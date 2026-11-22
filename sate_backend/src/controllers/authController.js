const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../lib/prisma');

const URL_TURNSTILE = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

function normalizarEmail(email) {
    return String(email || '').trim().toLowerCase();
}

function emailValido(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
}

// ============================================================================
// TURNSTILE
// ============================================================================

async function validarTurnstile(req, acaoEsperada) {
    const secret = process.env.TURNSTILE_SECRET_KEY;

    // Sem chave secreta, a verificação fica desativada.
    if (!secret) return true;

    // Compatibilidade para testes locais: uma chave embutida no APK NÃO é segredo.
    // Nunca liberar este bypass em produção, ainda que a variável esteja presente.
    const bypassLocal = process.env.NODE_ENV !== 'production' &&
        process.env.ALLOW_MOBILE_CAPTCHA_BYPASS === 'true';
    const chaveMobile = bypassLocal ? process.env.MOBILE_APP_KEY : null;
    const chaveRecebida = req.headers['x-sate-app-key'];

    if (
        chaveMobile &&
        typeof chaveRecebida === 'string' &&
        chaveRecebida.length === chaveMobile.length &&
        require('crypto').timingSafeEqual(
            Buffer.from(chaveRecebida),
            Buffer.from(chaveMobile)
        )
    ) {
        return true;
    }

    const token = req.body?.turnstileToken;

    if (typeof token !== 'string' || !token || token.length > 2048) {
        return false;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    try {
        const resposta = await fetch(URL_TURNSTILE, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                secret,
                response: token,
                remoteip: req.ip,
            }),
            signal: controller.signal,
        });

        if (!resposta.ok) return false;

        const resultado = await resposta.json();

        if (!resultado.success) return false;

        if (resultado.action !== acaoEsperada) {
            return false;
        }

        const hostsPermitidos = String(
            process.env.TURNSTILE_ALLOWED_HOSTNAMES || ''
        )
            .split(',')
            .map((host) => host.trim().toLowerCase())
            .filter(Boolean);

        if (
            hostsPermitidos.length > 0 &&
            (
                !resultado.hostname ||
                !hostsPermitidos.includes(
                    String(resultado.hostname).toLowerCase()
                )
            )
        ) {
            return false;
        }

        return true;
    } catch (error) {
        console.error('Falha ao validar Turnstile:', error.message);
        return false;
    } finally {
        clearTimeout(timeout);
    }
}

// ============================================================================
// JWT
// ============================================================================

function gerarJwt(usuario) {
    if (!process.env.JWT_SECRET) {
        throw new Error(
            'JWT_SECRET não está configurado no ambiente do backend.'
        );
    }

    return jwt.sign(
        {
            id: usuario.id,
            tipo: usuario.tipo,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: '7d',
        }
    );
}

// ============================================================================
// CADASTRO
// ============================================================================

async function cadastro(req, res) {
    try {
        const { nome, email, senha } = req.body || {};

        if (
            typeof nome !== 'string' ||
            typeof email !== 'string' ||
            typeof senha !== 'string'
        ) {
            return res.status(400).json({
                mensagem: 'Nome, e-mail e senha são obrigatórios.',
            });
        }

        const nomeNormalizado = nome.trim();
        const emailNormalizado = normalizarEmail(email);

        if (
            !nomeNormalizado ||
            nomeNormalizado.length > 120 ||
            !emailValido(emailNormalizado)
        ) {
            return res.status(400).json({
                mensagem: 'Informe um nome e um endereço de e-mail válidos.',
            });
        }

        if (senha.length < 8) {
            return res.status(400).json({
                mensagem: 'A senha deve ter pelo menos 8 caracteres.',
            });
        }

        const captchaValido = await validarTurnstile(req, 'signup');

        if (!captchaValido) {
            return res.status(400).json({
                codigo: 'CAPTCHA_INVALIDO',
                mensagem: 'Confirme a verificação antirrobô e tente novamente.',
            });
        }

        const usuarioExistente = await prisma.usuario.findUnique({
            where: {
                email: emailNormalizado,
            },
        });

        if (usuarioExistente) {
            return res.status(409).json({
                codigo: 'EMAIL_JA_CADASTRADO',
                mensagem: 'Este e-mail já está cadastrado.',
            });
        }

        const senhaHash = await bcrypt.hash(senha, 10);

        const usuario = await prisma.usuario.create({
            data: {
                nome: nomeNormalizado,
                email: emailNormalizado,
                senha: senhaHash,
                tipo: null,
                primeiroAcesso: false,

                // Confirmação de e-mail desativada.
                emailVerificado: true,
            },
        });

        return res.status(201).json({
            mensagem: 'Conta criada com sucesso!',
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                tipo: usuario.tipo,
                primeiroAcesso: usuario.primeiroAcesso,
                emailVerificado: true,
            },
        });
    } catch (error) {
        console.error('ERRO NO CADASTRO:', error);

        return res.status(500).json({
            mensagem: 'Erro ao cadastrar usuário.',
        });
    }
}

// ============================================================================
// LOGIN
// ============================================================================

async function login(req, res) {
    try {
        const { email, senha, tipo } = req.body || {};

        if (
            typeof email !== 'string' ||
            typeof senha !== 'string' ||
            !tipo
        ) {
            return res.status(400).json({
                mensagem: 'Email, senha e tipo são obrigatórios.',
            });
        }

        if (!['TREINADOR', 'ATLETA'].includes(tipo)) {
            return res.status(400).json({
                mensagem: 'Tipo de usuário inválido.',
            });
        }

        const captchaValido = await validarTurnstile(req, 'auth');

        if (!captchaValido) {
            return res.status(400).json({
                codigo: 'CAPTCHA_INVALIDO',
                mensagem: 'Confirme a verificação antirrobô e tente novamente.',
            });
        }

        const emailNormalizado = normalizarEmail(email);

        const usuario = await prisma.usuario.findUnique({
            where: {
                email: emailNormalizado,
            },
        });

        if (!usuario) {
            return res.status(401).json({
                mensagem: 'Email ou senha inválidos.',
            });
        }

        const senhaValida = await bcrypt.compare(
            senha,
            usuario.senha
        );

        if (!senhaValida) {
            return res.status(401).json({
                mensagem: 'Email ou senha inválidos.',
            });
        }

        // Não existe mais bloqueio por e-mail não confirmado.

        // ====================================================================
        // PRIMEIRO ACESSO: DEFINIR TIPO E CRIAR PERFIL
        // ====================================================================

        if (usuario.tipo === null) {
            const usuarioAtualizado = await prisma.usuario.update({
                where: {
                    id: usuario.id,
                },
                data: {
                    tipo,
                    primeiroAcesso: tipo === 'TREINADOR',
                    emailVerificado: true,
                },
            });

            if (tipo === 'TREINADOR') {
                const treinadorExistente =
                    await prisma.treinador.findUnique({
                        where: {
                            usuarioId: usuarioAtualizado.id,
                        },
                    });

                if (!treinadorExistente) {
                    await prisma.treinador.create({
                        data: {
                            nome: usuarioAtualizado.nome || 'Treinador',
                            usuarioId: usuarioAtualizado.id,
                        },
                    });
                }
            }

            if (tipo === 'ATLETA') {
                const atletaExistente =
                    await prisma.atleta.findUnique({
                        where: {
                            usuarioId: usuarioAtualizado.id,
                        },
                    });

                if (!atletaExistente) {
                    await prisma.atleta.create({
                        data: {
                            nome: usuarioAtualizado.nome || 'Atleta',
                            usuarioId: usuarioAtualizado.id,
                        },
                    });
                }
            }

            const token = gerarJwt(usuarioAtualizado);

            return res.json({
                mensagem: 'Login realizado com sucesso.',
                token,
                usuario: {
                    id: usuarioAtualizado.id,
                    nome: usuarioAtualizado.nome,
                    email: usuarioAtualizado.email,
                    tipo: usuarioAtualizado.tipo,
                    primeiroAcesso: usuarioAtualizado.primeiroAcesso,
                    emailVerificado: true,
                },
            });
        }

        // ====================================================================
        // CONFERIR TIPO DA CONTA
        // ====================================================================

        if (usuario.tipo !== tipo) {
            const tipoConta =
                usuario.tipo === 'ATLETA' ? 'Atleta' : 'Treinador';

            return res.status(403).json({
                mensagem: `Esta conta está cadastrada como ${tipoConta}.`,
            });
        }

        // ====================================================================
        // GARANTIR PERFIL DE ATLETA
        // ====================================================================

        if (usuario.tipo === 'ATLETA') {
            const atletaExistente = await prisma.atleta.findUnique({
                where: {
                    usuarioId: usuario.id,
                },
            });

            if (!atletaExistente) {
                await prisma.atleta.create({
                    data: {
                        nome: usuario.nome || 'Atleta',
                        usuarioId: usuario.id,
                    },
                });
            }
        }

        // ====================================================================
        // GARANTIR PERFIL DE TREINADOR
        // ====================================================================

        if (usuario.tipo === 'TREINADOR') {
            const treinadorExistente = await prisma.treinador.findUnique({
                where: {
                    usuarioId: usuario.id,
                },
            });

            if (!treinadorExistente) {
                await prisma.treinador.create({
                    data: {
                        nome: usuario.nome || 'Treinador',
                        usuarioId: usuario.id,
                    },
                });
            }
        }

        // ====================================================================
        // GERAR TOKEN E FINALIZAR LOGIN
        // ====================================================================

        const token = gerarJwt(usuario);

        return res.json({
            mensagem: 'Login realizado com sucesso.',
            token,
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                tipo: usuario.tipo,
                primeiroAcesso: usuario.primeiroAcesso,
                emailVerificado: true,
            },
        });
    } catch (error) {
        console.error('ERRO NO LOGIN:', error);

        return res.status(500).json({
            mensagem: 'Erro ao realizar login.',
        });
    }
}

// ============================================================================
// EXPORTAÇÕES
// ============================================================================

module.exports = {
    cadastro,
    login,
};

