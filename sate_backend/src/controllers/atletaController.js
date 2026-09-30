
const prisma = require('../lib/prisma');


// ============================================================
// LISTAR ATLETAS
// GET /api/atletas
// ============================================================

async function listarAtletas(req, res) {
    try {
        const atletas = await prisma.atleta.findMany({
            include: {
                usuario: {
                    select: {
                        id: true,
                        nome: true,
                        email: true,
                        tipo: true,
                        avatarUrl: true
                    }
                },

                responsavel: true,

                endereco: true,

                documentos: true
            },

            orderBy: {
                nome: 'asc'
            }
        });

        return res.status(200).json(atletas);

    } catch (error) {
        console.error('=================================');
        console.error('ERRO AO LISTAR ATLETAS:');
        console.error(error);
        console.error('=================================');

        return res.status(500).json({
            mensagem: 'Erro ao buscar atletas.',
            erro: error.message
        });
    }
}


// ============================================================
// BUSCAR ATLETA POR ID
// GET /api/atletas/:id
// ============================================================

async function buscarAtleta(req, res) {
    try {
        const id = Number(req.params.id);

        if (Number.isNaN(id)) {
            return res.status(400).json({
                mensagem: 'ID do atleta inválido.'
            });
        }

        const atleta = await prisma.atleta.findUnique({
            where: {
                id
            },

            include: {
                usuario: {
                    select: {
                        id: true,
                        nome: true,
                        email: true,
                        tipo: true,
                        avatarUrl: true
                    }
                },

                responsavel: true,

                endereco: true,

                documentos: true
            }
        });

        if (!atleta) {
            return res.status(404).json({
                mensagem: 'Atleta não encontrado.'
            });
        }

        return res.status(200).json(atleta);

    } catch (error) {
        console.error('=================================');
        console.error('ERRO AO BUSCAR ATLETA:');
        console.error(error);
        console.error('=================================');

        return res.status(500).json({
            mensagem: 'Erro ao buscar atleta.',
            erro: error.message
        });
    }
}


// ============================================================
// ATUALIZAR ATLETA
// PUT /api/atletas/:id
// ============================================================

async function atualizarAtleta(req, res) {
    try {
        const id = Number(req.params.id);

        if (Number.isNaN(id)) {
            return res.status(400).json({
                mensagem: 'ID do atleta inválido.'
            });
        }

        const {
            nome,
            cpf,
            rg,
            dataNascimento,
            sexo,
            categoria,
            telefone
        } = req.body;


        const atletaExistente =
            await prisma.atleta.findUnique({
                where: {
                    id
                }
            });


        if (!atletaExistente) {
            return res.status(404).json({
                mensagem: 'Atleta não encontrado.'
            });
        }


        const dadosAtleta = {};


        if (nome !== undefined) {
            dadosAtleta.nome =
                nome
                    ? String(nome).trim()
                    : null;
        }


        if (cpf !== undefined) {
            dadosAtleta.cpf =
                cpf
                    ? String(cpf).trim()
                    : null;
        }


        if (rg !== undefined) {
            dadosAtleta.rg =
                rg
                    ? String(rg).trim()
                    : null;
        }


        if (dataNascimento !== undefined) {
            dadosAtleta.dataNascimento =
                dataNascimento
                    ? new Date(dataNascimento)
                    : null;
        }


        if (sexo !== undefined) {
            dadosAtleta.sexo =
                sexo || null;
        }


        if (categoria !== undefined) {
            dadosAtleta.categoria =
                categoria
                    ? String(categoria).trim()
                    : null;
        }


        if (telefone !== undefined) {
            dadosAtleta.telefone =
                telefone
                    ? String(telefone).trim()
                    : null;
        }


        const atletaAtualizado =
            await prisma.atleta.update({
                where: {
                    id
                },

                data: dadosAtleta,

                include: {
                    usuario: {
                        select: {
                            id: true,
                            nome: true,
                            email: true,
                            tipo: true,
                            avatarUrl: true
                        }
                    },

                    responsavel: true,

                    endereco: true,

                    documentos: true
                }
            });


        return res.status(200).json({
            mensagem: 'Atleta atualizado com sucesso.',
            atleta: atletaAtualizado
        });

    } catch (error) {
        console.error('=================================');
        console.error('ERRO AO ATUALIZAR ATLETA:');
        console.error(error);
        console.error('=================================');

        return res.status(500).json({
            mensagem: 'Erro ao atualizar atleta.',
            erro: error.message
        });
    }
}


// ============================================================
// EXCLUIR ATLETA
// DELETE /api/atletas/:id
// ============================================================

async function excluirAtleta(req, res) {
    try {
        const id = Number(req.params.id);

        if (Number.isNaN(id)) {
            return res.status(400).json({
                mensagem: 'ID do atleta inválido.'
            });
        }


        const atleta =
            await prisma.atleta.findUnique({
                where: {
                    id
                }
            });


        if (!atleta) {
            return res.status(404).json({
                mensagem: 'Atleta não encontrado.'
            });
        }


        await prisma.atleta.delete({
            where: {
                id
            }
        });


        return res.status(200).json({
            mensagem: 'Atleta excluído com sucesso.'
        });

    } catch (error) {
        console.error('=================================');
        console.error('ERRO AO EXCLUIR ATLETA:');
        console.error(error);
        console.error('=================================');

        return res.status(500).json({
            mensagem: 'Erro ao excluir atleta.',
            erro: error.message
        });
    }
}


// ============================================================
// EXPORTS
// ============================================================

module.exports = {
    listarAtletas,
    buscarAtleta,
    atualizarAtleta,
    excluirAtleta
};

