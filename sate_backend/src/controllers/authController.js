
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

        // ------------------------------------------------------------
        // VALIDAÇÃO
        // ------------------------------------------------------------

        if (!nome || !email || !senha) {
            return res.status(400).json({
                mensagem: 'Nome, email e senha são obrigatórios.'
            });
        }

        const nomeNormalizado = nome.trim();
        const emailNormalizado = email.trim().toLowerCase();

        // ------------------------------------------------------------
        // VERIFICA SE O EMAIL JÁ EXISTE
        // ------------------------------------------------------------

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

        // ------------------------------------------------------------
        // CRIPTOGRAFA A SENHA
        // ------------------------------------------------------------

        const senhaHash = await bcrypt.hash(senha, 10);

        // ------------------------------------------------------------
        // CRIA USUARIO + ATLETA
        // ------------------------------------------------------------

        const resultado = await prisma.$transaction(async (tx) => {

            // --------------------------------------------------------
            // CRIA USUARIO
            // --------------------------------------------------------

            const usuario = await tx.usuario.create({
                data: {
                    nome: nomeNormalizado,
                    email: emailNormalizado,
                    senha: senhaHash,

                    // Cadastro feito pela tela de cadastro
                    // é considerado uma conta de atleta.
                    tipo: 'ATLETA'
                }
            });

            // --------------------------------------------------------
            // CRIA ATLETA
            // --------------------------------------------------------

            const atleta = await tx.atleta.create({
                data: {
                    nome: nomeNormalizado,
                    usuarioId: usuario.id
                }
            });

            return {
                usuario,
                atleta
            };
        });

        // ------------------------------------------------------------
        // RESPOSTA
        // ------------------------------------------------------------

        return res.status(201).json({
            mensagem: 'Atleta cadastrado com sucesso.',

            usuario: {
                id: resultado.usuario.id,
                nome: resultado.usuario.nome,
                email: resultado.usuario.email,
                tipo: resultado.usuario.tipo
            },

            atleta: {
                id: resultado.atleta.id,
                nome: resultado.atleta.nome
            }
        });

    } catch (error) {

        console.error('=================================');
        console.error('ERRO NO CADASTRO:');
        console.error(error);
        console.error('=================================');

        return res.status(500).json({
            mensagem: 'Erro ao cadastrar atleta.',
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

        // ------------------------------------------------------------
        // VALIDAÇÃO
        // ------------------------------------------------------------

        if (!email || !senha || !tipo) {
            return res.status(400).json({
                mensagem: 'Email, senha e tipo são obrigatórios.'
            });
        }

        if (!['TREINADOR', 'ATLETA'].includes(tipo)) {
            return res.status(400).json({
                mensagem: 'Tipo de usuário inválido.'
            });
        }

        const emailNormalizado = email.trim().toLowerCase();

        // ------------------------------------------------------------
        // BUSCAR USUÁRIO
        // ------------------------------------------------------------

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

        // ------------------------------------------------------------
        // VALIDAR SENHA
        // ------------------------------------------------------------

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
        // CONTA ANTIGA SEM TIPO
        // ====================================================================

        if (usuario.tipo === null) {

            const usuarioAtualizado = await prisma.usuario.update({
                where: {
                    id: usuario.id
                },

                data: {
                    tipo
                }
            });

            // --------------------------------------------------------
            // PRIMEIRO LOGIN COMO TREINADOR
            // --------------------------------------------------------

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

            // --------------------------------------------------------
            // PRIMEIRO LOGIN COMO ATLETA
            // --------------------------------------------------------

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
                                usuarioAtualizado.nome,

                            usuarioId:
                                usuarioAtualizado.id
                        }
                    });
                }
            }

            // --------------------------------------------------------
            // JWT
            // --------------------------------------------------------

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
                    tipo: usuarioAtualizado.tipo
                }
            });
        }

        // ====================================================================
        // VERIFICAR TIPO DA CONTA
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
        // GARANTIR PERFIL DE ATLETA
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
                        nome: usuario.nome,
                        usuarioId: usuario.id
                    }
                });
            }
        }

        // ====================================================================
        // GARANTIR PERFIL DE TREINADOR
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

                        usuarioId: usuario.id
                    }
                });
            }
        }

        // ====================================================================
        // GERAR JWT
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
                tipo: usuario.tipo
            }
        });

    } catch (error) {

        console.error('Erro no login:', error);

        return res.status(500).json({
            mensagem: 'Erro ao realizar login.'
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

