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
            senha,
            tipo
        } = req.body;

        // ------------------------------------------------------------
        // VALIDAÇÃO
        // ------------------------------------------------------------

        if (!nome || !email || !senha || !tipo) {
            return res.status(400).json({
                mensagem: 'Nome, email, senha e tipo são obrigatórios.'
            });
        }

        // ------------------------------------------------------------
        // VALIDA TIPO
        // ------------------------------------------------------------

        if (!['ATLETA', 'TREINADOR'].includes(tipo)) {
            return res.status(400).json({
                mensagem: 'Tipo de usuário inválido.'
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
        // CRIA USUARIO + PERFIL
        // ------------------------------------------------------------

        const resultado = await prisma.$transaction(
            async (tx) => {

                // --------------------------------------------------------
                // CRIA USUARIO
                // --------------------------------------------------------

                const usuario = await tx.usuario.create({
                    data: {
                        nome: nomeNormalizado,
                        email: emailNormalizado,
                        senha: senhaHash,
                        tipo
                    }
                });

                // --------------------------------------------------------
                // CRIA PERFIL DE ATLETA
                // --------------------------------------------------------

                if (tipo === 'ATLETA') {

                    const atleta = await tx.atleta.create({
                        data: {
                            nome: nomeNormalizado,
                            usuarioId: usuario.id
                        }
                    });

                    return {
                        usuario,
                        atleta,
                        treinador: null
                    };
                }

                // --------------------------------------------------------
                // CRIA PERFIL DE TREINADOR
                // --------------------------------------------------------

                const treinador = await tx.treinador.create({
                    data: {
                        nome: nomeNormalizado,
                        usuarioId: usuario.id
                    }
                });

                return {
                    usuario,
                    atleta: null,
                    treinador
                };
            },
            {
                maxWait: 10000,
                timeout: 30000
            }
        );

        // ------------------------------------------------------------
        // RESPOSTA
        // ------------------------------------------------------------

        return res.status(201).json({
            mensagem:
                tipo === 'ATLETA'
                    ? 'Atleta cadastrado com sucesso.'
                    : 'Treinador cadastrado com sucesso.',

            usuario: {
                id: resultado.usuario.id,
                nome: resultado.usuario.nome,
                email: resultado.usuario.email,
                tipo: resultado.usuario.tipo
            },

            atleta: resultado.atleta
                ? {
                    id: resultado.atleta.id,
                    nome: resultado.atleta.nome
                }
                : null,

            treinador: resultado.treinador
                ? {
                    id: resultado.treinador.id,
                    nome: resultado.treinador.nome
                }
                : null
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