const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../lib/prisma');

// ============================================================================
// CADASTRO
// ============================================================================

async function cadastro(req, res) {
    try {
        const {
            nome,
            email,
            senha
        } = req.body;

        // O cadastro não define o tipo de usuário.
        // O tipo será definido posteriormente no login,
        // quando o usuário escolher Atleta ou Treinador.

        if (!nome || !email || !senha) {
            return res.status(400).json({
                mensagem: 'Nome, email e senha são obrigatórios.'
            });
        }

        const nomeNormalizado = nome.trim();
        const emailNormalizado = email.trim().toLowerCase();

        // Verifica se o email já existe
        const usuarioExistente = await prisma.usuario.findUnique({
            where: {
                email: emailNormalizado
            }
        });

        if (usuarioExistente) {
            return res.status(409).json({
                mensagem: 'Este email já está cadastrado.'
            });
        }

        // Criptografa a senha
        const senhaHash = await bcrypt.hash(senha, 10);

        // Cria o usuário sem definir o tipo
        const usuario = await prisma.usuario.create({
            data: {
                nome: nomeNormalizado,
                email: emailNormalizado,
                senha: senhaHash,

                // Será definido no login
                tipo: null,

                // Ainda não escolheu o perfil
                primeiroAcesso: false
            }
        });

        return res.status(201).json({
            mensagem: 'Conta criada com sucesso.',

            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                tipo: usuario.tipo,
                primeiroAcesso: usuario.primeiroAcesso
            }
        });

    } catch (error) {
        console.error('=================================');
        console.error('ERRO NO CADASTRO:');
        console.error(error);
        console.error('=================================');

        return res.status(500).json({
            mensagem: 'Erro ao cadastrar usuário.',
            erro: error.message
        });
    }
}


// ============================================================================
// LOGIN
// ============================================================================

async function login(req, res) {
    try {
        const {
            email,
            senha,
            tipo
        } = req.body;

        // Email, senha e tipo são necessários no login
        if (!email || !senha || !tipo) {
            return res.status(400).json({
                mensagem: 'Email, senha e tipo são obrigatórios.'
            });
        }

        // Verifica se o tipo escolhido é válido
        if (!['TREINADOR', 'ATLETA'].includes(tipo)) {
            return res.status(400).json({
                mensagem: 'Tipo de usuário inválido.'
            });
        }

        const emailNormalizado = email.trim().toLowerCase();

        // Procura o usuário pelo email
        const usuario = await prisma.usuario.findUnique({
            where: {
                email: emailNormalizado
            }
        });

        if (!usuario) {
            return res.status(401).json({
                mensagem: 'Email ou senha inválidos.'
            });
        }

        // Compara a senha digitada com a senha criptografada
        const senhaValida = await bcrypt.compare(
            senha,
            usuario.senha
        );

        if (!senhaValida) {
            return res.status(401).json({
                mensagem: 'Email ou senha inválidos.'
            });
        }

        // ====================================================================
        // PRIMEIRO LOGIN
        // ====================================================================
        // Se o usuário foi criado pelo cadastro e ainda não possui tipo,
        // usamos o tipo escolhido no login.

        if (usuario.tipo === null) {

            const usuarioAtualizado = await prisma.usuario.update({
                where: {
                    id: usuario.id
                },

                data: {
                    tipo: tipo,

                    primeiroAcesso:
                        tipo === 'TREINADOR'
                            ? true
                            : false
                }
            });

            // ---------------------------------------------------------------
            // CRIA PERFIL DE TREINADOR
            // ---------------------------------------------------------------

            if (tipo === 'TREINADOR') {

                const treinadorExistente =
                    await prisma.treinador.findUnique({
                        where: {
                            usuarioId: usuarioAtualizado.id
                        }
                    });

                if (!treinadorExistente) {
                    await prisma.treinador.create({
                        data: {
                            nome:
                                usuarioAtualizado.nome ||
                                'Treinador',

                            usuarioId:
                                usuarioAtualizado.id
                        }
                    });
                }
            }

            // ---------------------------------------------------------------
            // CRIA PERFIL DE ATLETA
            // ---------------------------------------------------------------

            if (tipo === 'ATLETA') {

                const atletaExistente =
                    await prisma.atleta.findUnique({
                        where: {
                            usuarioId: usuarioAtualizado.id
                        }
                    });

                if (!atletaExistente) {
                    await prisma.atleta.create({
                        data: {
                            nome:
                                usuarioAtualizado.nome ||
                                'Atleta',

                            usuarioId:
                                usuarioAtualizado.id
                        }
                    });
                }
            }

            // ---------------------------------------------------------------
            // GERA TOKEN
            // ---------------------------------------------------------------

            const token = jwt.sign(
                {
                    id: usuarioAtualizado.id,
                    tipo: usuarioAtualizado.tipo
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: '7d'
                }
            );

            return res.json({
                mensagem: 'Login realizado com sucesso.',
                token,

                usuario: {
                    id: usuarioAtualizado.id,
                    nome: usuarioAtualizado.nome,
                    email: usuarioAtualizado.email,
                    tipo: usuarioAtualizado.tipo,
                    primeiroAcesso:
                        usuarioAtualizado.primeiroAcesso
                }
            });
        }

        // ====================================================================
        // USUÁRIO JÁ POSSUI TIPO
        // ====================================================================

        if (usuario.tipo !== tipo) {

            const tipoConta =
                usuario.tipo === 'ATLETA'
                    ? 'Atleta'
                    : 'Treinador';

            return res.status(403).json({
                mensagem:
                    `Esta conta está cadastrada como ${tipoConta}.`
            });
        }

        // ====================================================================
        // GARANTE PERFIL DE ATLETA
        // ====================================================================

        if (usuario.tipo === 'ATLETA') {

            const atletaExistente =
                await prisma.atleta.findUnique({
                    where: {
                        usuarioId: usuario.id
                    }
                });

            if (!atletaExistente) {
                await prisma.atleta.create({
                    data: {
                        nome:
                            usuario.nome ||
                            'Atleta',

                        usuarioId:
                            usuario.id
                    }
                });
            }
        }

        // ====================================================================
        // GARANTE PERFIL DE TREINADOR
        // ====================================================================

        if (usuario.tipo === 'TREINADOR') {

            const treinadorExistente =
                await prisma.treinador.findUnique({
                    where: {
                        usuarioId: usuario.id
                    }
                });

            if (!treinadorExistente) {
                await prisma.treinador.create({
                    data: {
                        nome:
                            usuario.nome ||
                            'Treinador',

                        usuarioId:
                            usuario.id
                    }
                });
            }
        }

        // ====================================================================
        // GERA TOKEN
        // ====================================================================

        const token = jwt.sign(
            {
                id: usuario.id,
                tipo: usuario.tipo
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '7d'
            }
        );

        // ====================================================================
        // RESPOSTA
        // ====================================================================

        return res.json({
            mensagem: 'Login realizado com sucesso.',
            token,

            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                tipo: usuario.tipo,
                primeiroAcesso: usuario.primeiroAcesso
            }
        });

    } catch (error) {

        console.error('=================================');
        console.error('ERRO NO LOGIN:');
        console.error(error);
        console.error('=================================');

        return res.status(500).json({
            mensagem: 'Erro ao realizar login.',
            erro: error.message
        });
    }
}


// ============================================================================
// EXPORTAÇÕES
// ============================================================================

module.exports = {
    cadastro,
    login
};