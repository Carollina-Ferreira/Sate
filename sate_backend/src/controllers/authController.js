const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const dns = require('dns').promises;
const nodemailer = require('nodemailer');
const prisma = require('../lib/prisma');

const TEMPO_TOKEN_VERIFICACAO_MINUTOS = 30;
const URL_TURNSTILE = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

function normalizarEmail(email) {
    return String(email || '').trim().toLowerCase();
}

function emailValido(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
}

// Verifica se o domínio do e-mail possui infraestrutura DNS para receber e-mails.
// Isso detecta domínios inexistentes/sem DNS, mas NÃO comprova que a caixa postal
// individual existe. A confirmação por link continua sendo a prova de acesso ao e-mail.
async function dominioEmailRecebeEmail(email) {
    const dominio = String(email).split('@').pop().toLowerCase();
    if (!dominio) return false;

    try {
        const registrosMx = await dns.resolveMx(dominio);
        if (Array.isArray(registrosMx) && registrosMx.length > 0) return true;
    } catch (erroMx) {
        // Alguns domínios válidos usam fallback A/AAAA quando não têm MX explícito.
        if (erroMx.code !== 'ENODATA' && erroMx.code !== 'ENOTFOUND' && erroMx.code !== 'ESERVFAIL') {
            console.warn('Não foi possível consultar MX do domínio:', erroMx.code || erroMx.message);
        }
    }

    try {
        const registrosA = await dns.resolve4(dominio);
        if (Array.isArray(registrosA) && registrosA.length > 0) return true;
    } catch (_) {}

    try {
        const registrosAAAA = await dns.resolve6(dominio);
        if (Array.isArray(registrosAAAA) && registrosAAAA.length > 0) return true;
    } catch (_) {}

    return false;
}

function escaparHtml(valor) {
    return String(valor || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function criarTransportadorEmail() {
    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT || 465);
    const user = process.env.SMTP_USER;
    const pass = String(process.env.SMTP_PASS || '').replace(/\s+/g, '');

    if (!host || !user || !pass || !Number.isInteger(port) || port <= 0) {
        throw new Error('Configuração SMTP incompleta. Confira SMTP_HOST, SMTP_PORT, SMTP_USER e SMTP_PASS.');
    }

    const secure = process.env.SMTP_SECURE
        ? process.env.SMTP_SECURE.toLowerCase() === 'true'
        : port === 465;

    return nodemailer.createTransport({
        host,
        port,
        secure,
        auth: { user, pass },
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 15000,
    });
}

async function validarTurnstile(req, acaoEsperada) {
    const secret = process.env.TURNSTILE_SECRET_KEY;

    // Sem chave secreta, o Turnstile fica desativado para desenvolvimento local.
    // Em produção, configure TURNSTILE_SECRET_KEY e VITE_TURNSTILE_SITE_KEY.
    if (!secret) return true;

    const token = req.body?.turnstileToken;
    if (typeof token !== 'string' || !token || token.length > 2048) {
        return false;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    try {
        const resposta = await fetch(URL_TURNSTILE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
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

        // A ação é definida no widget do frontend e conferida no servidor.
        if (resultado.action !== acaoEsperada) {
            return false;
        }

        const hostsPermitidos = String(process.env.TURNSTILE_ALLOWED_HOSTNAMES || '')
            .split(',')
            .map((host) => host.trim().toLowerCase())
            .filter(Boolean);

        if (
            hostsPermitidos.length > 0 &&
            (!resultado.hostname || !hostsPermitidos.includes(String(resultado.hostname).toLowerCase()))
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

async function enviarEmailVerificacao(usuario) {
    const token = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const expiresAt = new Date(Date.now() + TEMPO_TOKEN_VERIFICACAO_MINUTOS * 60 * 1000);

    // Um novo envio invalida links anteriores para a mesma conta.
    await prisma.emailVerificationToken.deleteMany({
        where: { usuarioId: usuario.id },
    });

    await prisma.emailVerificationToken.create({
        data: {
            usuarioId: usuario.id,
            tokenHash,
            expiresAt,
        },
    });

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const linkVerificacao = new URL('/verificar-email', frontendUrl);
    linkVerificacao.searchParams.set('token', token);

    const nome = escaparHtml(usuario.nome || 'Olá');
    const email = escaparHtml(usuario.email);
    const transporter = criarTransportadorEmail();

    try {
        await transporter.sendMail({
            from: process.env.SMTP_FROM || process.env.SMTP_USER,
            to: usuario.email,
            subject: 'Confirme seu e-mail — SATE',
            text: [
                `Olá, ${usuario.nome || 'atleta'}!`,
                '',
                'Para ativar sua conta no SATE, confirme seu endereço de e-mail acessando o link abaixo:',
                linkVerificacao.toString(),
                '',
                `Este link expira em ${TEMPO_TOKEN_VERIFICACAO_MINUTOS} minutos e só pode ser utilizado uma vez.`,
                'Se você não criou uma conta no SATE, ignore esta mensagem.',
            ].join('\n'),
            html: `
                <!doctype html>
                <html lang="pt-BR">
                  <body style="margin:0;padding:32px 16px;background:#f6f9f7;font-family:Arial,sans-serif;color:#12261f;">
                    <div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e1e8e4;border-radius:20px;padding:36px 30px;">
                      <div style="font-size:13px;font-weight:800;letter-spacing:2px;color:#16a875;">SATE</div>
                      <h1 style="font-size:25px;line-height:1.25;margin:18px 0 12px;color:#005942;">Confirme seu e-mail</h1>
                      <p style="font-size:15px;line-height:1.7;margin:0 0 8px;">Olá, ${nome}!</p>
                      <p style="font-size:15px;line-height:1.7;margin:0 0 24px;">Recebemos uma solicitação para criar uma conta no SATE usando <strong>${email}</strong>. Confirme que este endereço é seu para liberar o acesso.</p>
                      <a href="${linkVerificacao.toString()}" style="display:inline-block;padding:14px 22px;border-radius:999px;background:#16a875;color:#ffffff;text-decoration:none;font-weight:700;">Confirmar meu e-mail</a>
                      <p style="font-size:13px;line-height:1.6;margin:26px 0 8px;color:#6c7c77;">O link expira em ${TEMPO_TOKEN_VERIFICACAO_MINUTOS} minutos e só pode ser usado uma vez.</p>
                      <p style="font-size:12px;line-height:1.6;margin:0;color:#6c7c77;">Se o botão não funcionar, copie este endereço para o navegador:<br><a href="${linkVerificacao.toString()}" style="color:#006b4f;word-break:break-all;">${linkVerificacao.toString()}</a></p>
                      <p style="font-size:12px;margin:28px 0 0;color:#91a09a;">Se você não criou uma conta, ignore esta mensagem.</p>
                    </div>
                  </body>
                </html>
            `,
        });
    } catch (error) {
        // Remove o token que não chegou a ser enviado; o cadastro permanece pendente
        // e o usuário pode solicitar um novo e-mail pela tela de confirmação.
        await prisma.emailVerificationToken.deleteMany({
            where: { usuarioId: usuario.id },
        });
        throw error;
    }
}

function gerarJwt(usuario) {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET não está configurado no ambiente do backend.');
    }

    return jwt.sign(
        { id: usuario.id, tipo: usuario.tipo },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
}

// ============================================================================
// CADASTRO
// ============================================================================

async function cadastro(req, res) {
    try {
        const { nome, email, senha } = req.body || {};

        if (typeof nome !== 'string' || typeof email !== 'string' || typeof senha !== 'string') {
            return res.status(400).json({
                mensagem: 'Nome, e-mail e senha são obrigatórios.',
            });
        }

        const nomeNormalizado = nome.trim();
        const emailNormalizado = normalizarEmail(email);

        if (!nomeNormalizado || nomeNormalizado.length > 120 || !emailValido(emailNormalizado)) {
            return res.status(400).json({
                mensagem: 'Informe um nome e um endereço de e-mail válidos.',
            });
        }

        // Validação preliminar do domínio: evita e-mails com domínio inexistente.
        // A existência da caixa postal só pode ser confirmada com o link enviado.
        const dominioRecebeEmail = await dominioEmailRecebeEmail(emailNormalizado);
        if (!dominioRecebeEmail) {
            return res.status(400).json({
                codigo: 'DOMINIO_EMAIL_INVALIDO',
                mensagem: 'O domínio deste e-mail não parece receber mensagens. Confira o endereço digitado.',
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
            where: { email: emailNormalizado },
        });

        if (usuarioExistente) {
            return res.status(409).json({
                codigo: usuarioExistente.emailVerificado ? 'EMAIL_JA_CADASTRADO' : 'EMAIL_NAO_VERIFICADO',
                mensagem: usuarioExistente.emailVerificado
                    ? 'Este e-mail já está cadastrado.'
                    : 'Este e-mail já possui uma conta aguardando confirmação. Acesse a tela de confirmação para reenviar o link.',
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
                emailVerificado: false,
            },
        });

        try {
            await enviarEmailVerificacao(usuario);
        } catch (emailError) {
            console.error('Falha ao enviar confirmação de e-mail:', emailError.message);
            return res.status(503).json({
                codigo: 'EMAIL_ENVIO_FALHOU',
                mensagem: 'Sua conta foi criada, mas não conseguimos enviar o e-mail de confirmação. Confira a configuração SMTP e tente reenviar o link na próxima tela.',
                usuario: {
                    id: usuario.id,
                    nome: usuario.nome,
                    email: usuario.email,
                },
            });
        }

        return res.status(201).json({
            mensagem: 'Conta criada! Enviamos um link de confirmação para seu e-mail.',
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                tipo: usuario.tipo,
                primeiroAcesso: usuario.primeiroAcesso,
                emailVerificado: usuario.emailVerificado,
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
// CONFIRMAÇÃO DE E-MAIL
// ============================================================================

async function verificarEmail(req, res) {
    try {
        const { token } = req.body || {};
        if (typeof token !== 'string' || token.length < 32 || token.length > 256) {
            return res.status(400).json({ mensagem: 'Link de confirmação inválido ou expirado.' });
        }

        const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
        const registro = await prisma.emailVerificationToken.findUnique({
            where: { tokenHash },
            include: { usuario: true },
        });

        if (!registro || registro.usedAt || registro.expiresAt <= new Date()) {
            return res.status(400).json({ mensagem: 'Este link de confirmação é inválido ou expirou. Solicite um novo link.' });
        }

        if (registro.usuario.emailVerificado) {
            return res.status(200).json({ mensagem: 'Este e-mail já foi confirmado.' });
        }

        await prisma.$transaction(async (tx) => {
            const tokenAtualizado = await tx.emailVerificationToken.updateMany({
                where: {
                    id: registro.id,
                    usedAt: null,
                    expiresAt: { gt: new Date() },
                },
                data: { usedAt: new Date() },
            });

            if (tokenAtualizado.count !== 1) {
                throw new Error('TOKEN_JA_UTILIZADO');
            }

            await tx.usuario.update({
                where: { id: registro.usuarioId },
                data: { emailVerificado: true },
            });

            await tx.emailVerificationToken.deleteMany({
                where: { usuarioId: registro.usuarioId },
            });
        });

        return res.status(200).json({
            mensagem: 'E-mail confirmado com sucesso! Agora você já pode entrar no SATE.',
        });
    } catch (error) {
        if (error.message === 'TOKEN_JA_UTILIZADO') {
            return res.status(400).json({ mensagem: 'Este link já foi utilizado ou expirou. Solicite um novo link.' });
        }

        console.error('ERRO AO VERIFICAR E-MAIL:', error);
        return res.status(500).json({ mensagem: 'Não foi possível confirmar o e-mail agora.' });
    }
}

// ============================================================================
// REENVIO DO E-MAIL
// ============================================================================

async function reenviarVerificacao(req, res) {
    try {
        const email = normalizarEmail(req.body?.email);
        if (!emailValido(email)) {
            return res.status(400).json({ mensagem: 'Informe um endereço de e-mail válido.' });
        }

        const captchaValido = await validarTurnstile(req, 'auth');
        if (!captchaValido) {
            return res.status(400).json({
                codigo: 'CAPTCHA_INVALIDO',
                mensagem: 'Confirme a verificação antirrobô e tente novamente.',
            });
        }

        const usuario = await prisma.usuario.findUnique({
            where: { email },
        });

        // Resposta genérica para não revelar se um e-mail possui conta no SATE.
        const respostaGenerica = {
            mensagem: 'Se existir uma conta pendente para este e-mail, enviaremos um novo link de confirmação.',
        };

        if (!usuario || usuario.emailVerificado) {
            return res.status(200).json(respostaGenerica);
        }

        try {
            await enviarEmailVerificacao(usuario);
        } catch (emailError) {
            console.error('Falha ao reenviar confirmação:', emailError.message);
            return res.status(503).json({
                mensagem: 'Não foi possível enviar o e-mail agora. Confira a configuração SMTP e tente novamente mais tarde.',
            });
        }

        return res.status(200).json(respostaGenerica);
    } catch (error) {
        console.error('ERRO AO REENVIAR CONFIRMAÇÃO:', error);
        return res.status(500).json({ mensagem: 'Não foi possível solicitar um novo e-mail agora.' });
    }
}

// ============================================================================
// LOGIN
// ============================================================================

async function login(req, res) {
    try {
        const { email, senha, tipo } = req.body || {};

        if (typeof email !== 'string' || typeof senha !== 'string' || !tipo) {
            return res.status(400).json({ mensagem: 'Email, senha e tipo são obrigatórios.' });
        }

        if (!['TREINADOR', 'ATLETA'].includes(tipo)) {
            return res.status(400).json({ mensagem: 'Tipo de usuário inválido.' });
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
            where: { email: emailNormalizado },
        });

        if (!usuario) {
            return res.status(401).json({ mensagem: 'Email ou senha inválidos.' });
        }

        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida) {
            return res.status(401).json({ mensagem: 'Email ou senha inválidos.' });
        }

        // O tipo e os perfis só são definidos depois da confirmação do endereço.
        if (!usuario.emailVerificado) {
            return res.status(403).json({
                codigo: 'EMAIL_NAO_VERIFICADO',
                mensagem: 'Confirme seu e-mail antes de entrar. Enviamos um link para o endereço cadastrado.',
            });
        }

        // Primeiro acesso: define o tipo escolhido no login e cria o perfil correspondente.
        if (usuario.tipo === null) {
            const usuarioAtualizado = await prisma.usuario.update({
                where: { id: usuario.id },
                data: {
                    tipo,
                    primeiroAcesso: tipo === 'TREINADOR',
                },
            });

            if (tipo === 'TREINADOR') {
                const treinadorExistente = await prisma.treinador.findUnique({
                    where: { usuarioId: usuarioAtualizado.id },
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
                const atletaExistente = await prisma.atleta.findUnique({
                    where: { usuarioId: usuarioAtualizado.id },
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
                    emailVerificado: usuarioAtualizado.emailVerificado,
                },
            });
        }

        if (usuario.tipo !== tipo) {
            const tipoConta = usuario.tipo === 'ATLETA' ? 'Atleta' : 'Treinador';
            return res.status(403).json({
                mensagem: `Esta conta está cadastrada como ${tipoConta}.`,
            });
        }

        if (usuario.tipo === 'ATLETA') {
            const atletaExistente = await prisma.atleta.findUnique({
                where: { usuarioId: usuario.id },
            });

            if (!atletaExistente) {
                await prisma.atleta.create({
                    data: { nome: usuario.nome || 'Atleta', usuarioId: usuario.id },
                });
            }
        }

        if (usuario.tipo === 'TREINADOR') {
            const treinadorExistente = await prisma.treinador.findUnique({
                where: { usuarioId: usuario.id },
            });

            if (!treinadorExistente) {
                await prisma.treinador.create({
                    data: { nome: usuario.nome || 'Treinador', usuarioId: usuario.id },
                });
            }
        }

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
                emailVerificado: usuario.emailVerificado,
            },
        });
    } catch (error) {
        console.error('ERRO NO LOGIN:', error);
        return res.status(500).json({ mensagem: 'Erro ao realizar login.' });
    }
}

module.exports = {
    cadastro,
    login,
    verificarEmail,
    reenviarVerificacao,
};
