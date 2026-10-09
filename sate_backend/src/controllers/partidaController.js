const prisma = require('../lib/prisma');


// ============================================================
// PEGAR TREINADOR LOGADO
// ============================================================

async function obterTreinadorLogado(req) {
    const usuarioId = req.usuario?.id;

    if (!usuarioId) {
        return null;
    }

    const treinador =
        await prisma.treinador.findUnique({
            where: {
                usuarioId: Number(usuarioId)
            }
        });

    return treinador;
}


// ============================================================
// LISTAR PARTIDAS
// GET /api/partidas
// ============================================================

async function listarPartidas(req, res) {
    try {
        const treinador =
            await obterTreinadorLogado(req);


        if (!treinador) {
            return res.status(401).json({
                mensagem: 'Treinador não identificado.'
            });
        }


        const partidas =
            await prisma.partida.findMany({
                where: {
                    equipe: {
                        treinadorId: treinador.id
                    }
                },

                include: {
                    equipe: {
                        select: {
                            id: true,
                            nome: true,
                            modalidade: true,
                            categoria: true,
                            imagem: true,
                            corEquipe: true
                        }
                    }
                },

                orderBy: {
                    data: 'asc'
                }
            });


        return res.status(200).json(partidas);

    } catch (error) {
        console.error('=================================');
        console.error('ERRO AO LISTAR PARTIDAS:');
        console.error(error);
        console.error('=================================');

        return res.status(500).json({
            mensagem: 'Erro ao buscar partidas.',
            erro: error.message
        });
    }
}


// ============================================================
// BUSCAR PARTIDA POR ID
// GET /api/partidas/:id
// ============================================================

async function buscarPartida(req, res) {
    try {
        const id = Number(req.params.id);

        if (Number.isNaN(id)) {
            return res.status(400).json({
                mensagem: 'ID da partida inválido.'
            });
        }


        const treinador =
            await obterTreinadorLogado(req);


        if (!treinador) {
            return res.status(401).json({
                mensagem: 'Treinador não identificado.'
            });
        }


        const partida =
            await prisma.partida.findFirst({
                where: {
                    id,

                    equipe: {
                        treinadorId: treinador.id
                    }
                },

                include: {
                    equipe: {
                        select: {
                            id: true,
                            nome: true,
                            modalidade: true,
                            categoria: true,
                            imagem: true,
                            corEquipe: true
                        }
                    }
                }
            });


        if (!partida) {
            return res.status(404).json({
                mensagem: 'Partida não encontrada.'
            });
        }


        return res.status(200).json(partida);

    } catch (error) {
        console.error('=================================');
        console.error('ERRO AO BUSCAR PARTIDA:');
        console.error(error);
        console.error('=================================');

        return res.status(500).json({
            mensagem: 'Erro ao buscar partida.',
            erro: error.message
        });
    }
}


// ============================================================
// CRIAR PARTIDA
// POST /api/partidas
// ============================================================

async function criarPartida(req, res) {
    try {
        const treinador =
            await obterTreinadorLogado(req);


        if (!treinador) {
            return res.status(401).json({
                mensagem: 'Treinador não identificado.'
            });
        }


        const {
            equipeId,
            adversario,
            data,
            local,
            campeonato,
            rodada,
            observacoes,
            status,
            golsEquipe,
            golsAdversario
        } = req.body;


        if (!equipeId) {
            return res.status(400).json({
                mensagem: 'A equipe é obrigatória.'
            });
        }


        if (!adversario) {
            return res.status(400).json({
                mensagem: 'O adversário é obrigatório.'
            });
        }


        if (!data) {
            return res.status(400).json({
                mensagem: 'A data da partida é obrigatória.'
            });
        }


        const equipe =
            await prisma.equipe.findFirst({
                where: {
                    id: Number(equipeId),
                    treinadorId: treinador.id
                }
            });


        if (!equipe) {
            return res.status(404).json({
                mensagem:
                    'Equipe não encontrada ou não pertence ao treinador.'
            });
        }


        const partida =
            await prisma.partida.create({
                data: {
                    equipeId: Number(equipeId),

                    adversario:
                        String(adversario).trim(),

                    data:
                        new Date(data),

                    local:
                        local
                            ? String(local).trim()
                            : null,

                    campeonato:
                        campeonato
                            ? String(campeonato).trim()
                            : null,

                    rodada:
                        rodada
                            ? String(rodada).trim()
                            : null,

                    observacoes:
                        observacoes
                            ? String(observacoes).trim()
                            : null,

                    status:
                        status || 'AGENDADA',

                    golsEquipe:
                        golsEquipe !== undefined &&
                        golsEquipe !== null &&
                        golsEquipe !== ''
                            ? Number(golsEquipe)
                            : null,

                    golsAdversario:
                        golsAdversario !== undefined &&
                        golsAdversario !== null &&
                        golsAdversario !== ''
                            ? Number(golsAdversario)
                            : null
                },

                include: {
                    equipe: {
                        select: {
                            id: true,
                            nome: true,
                            modalidade: true,
                            categoria: true,
                            imagem: true,
                            corEquipe: true
                        }
                    }
                }
            });


        return res.status(201).json({
            mensagem: 'Partida criada com sucesso.',
            partida
        });

    } catch (error) {
        console.error('=================================');
        console.error('ERRO AO CRIAR PARTIDA:');
        console.error(error);
        console.error('=================================');

        return res.status(500).json({
            mensagem: 'Erro ao criar partida.',
            erro: error.message
        });
    }
}


// ============================================================
// ATUALIZAR PARTIDA
// PUT /api/partidas/:id
// ============================================================

async function atualizarPartida(req, res) {
    try {
        const id = Number(req.params.id);

        if (Number.isNaN(id)) {
            return res.status(400).json({
                mensagem: 'ID da partida inválido.'
            });
        }


        const treinador =
            await obterTreinadorLogado(req);


        if (!treinador) {
            return res.status(401).json({
                mensagem: 'Treinador não identificado.'
            });
        }


        const partidaExistente =
            await prisma.partida.findFirst({
                where: {
                    id,

                    equipe: {
                        treinadorId: treinador.id
                    }
                }
            });


        if (!partidaExistente) {
            return res.status(404).json({
                mensagem: 'Partida não encontrada.'
            });
        }


        const {
            equipeId,
            adversario,
            data,
            local,
            campeonato,
            rodada,
            observacoes,
            status,
            golsEquipe,
            golsAdversario
        } = req.body;


        const dadosPartida = {};


        if (equipeId !== undefined) {
            const equipe =
                await prisma.equipe.findFirst({
                    where: {
                        id: Number(equipeId),
                        treinadorId: treinador.id
                    }
                });


            if (!equipe) {
                return res.status(404).json({
                    mensagem:
                        'Equipe não encontrada ou não pertence ao treinador.'
                });
            }


            dadosPartida.equipeId =
                Number(equipeId);
        }


        if (adversario !== undefined) {
            dadosPartida.adversario =
                String(adversario).trim();
        }


        if (data !== undefined) {
            dadosPartida.data =
                new Date(data);
        }


        if (local !== undefined) {
            dadosPartida.local =
                local
                    ? String(local).trim()
                    : null;
        }


        if (campeonato !== undefined) {
            dadosPartida.campeonato =
                campeonato
                    ? String(campeonato).trim()
                    : null;
        }


        if (rodada !== undefined) {
            dadosPartida.rodada =
                rodada
                    ? String(rodada).trim()
                    : null;
        }


        if (observacoes !== undefined) {
            dadosPartida.observacoes =
                observacoes
                    ? String(observacoes).trim()
                    : null;
        }


        if (status !== undefined) {
            dadosPartida.status =
                status;
        }


        if (golsEquipe !== undefined) {
            dadosPartida.golsEquipe =
                golsEquipe !== null &&
                golsEquipe !== ''
                    ? Number(golsEquipe)
                    : null;
        }


        if (golsAdversario !== undefined) {
            dadosPartida.golsAdversario =
                golsAdversario !== null &&
                golsAdversario !== ''
                    ? Number(golsAdversario)
                    : null;
        }


        const partidaAtualizada =
            await prisma.partida.update({
                where: {
                    id
                },

                data: dadosPartida,

                include: {
                    equipe: {
                        select: {
                            id: true,
                            nome: true,
                            modalidade: true,
                            categoria: true,
                            imagem: true,
                            corEquipe: true
                        }
                    }
                }
            });


        return res.status(200).json({
            mensagem: 'Partida atualizada com sucesso.',
            partida: partidaAtualizada
        });

    } catch (error) {
        console.error('=================================');
        console.error('ERRO AO ATUALIZAR PARTIDA:');
        console.error(error);
        console.error('=================================');

        return res.status(500).json({
            mensagem: 'Erro ao atualizar partida.',
            erro: error.message
        });
    }
}


// ============================================================
// EXCLUIR PARTIDA
// DELETE /api/partidas/:id
// ============================================================

async function excluirPartida(req, res) {
    try {
        const id = Number(req.params.id);

        if (Number.isNaN(id)) {
            return res.status(400).json({
                mensagem: 'ID da partida inválido.'
            });
        }


        const treinador =
            await obterTreinadorLogado(req);


        if (!treinador) {
            return res.status(401).json({
                mensagem: 'Treinador não identificado.'
            });
        }


        const partida =
            await prisma.partida.findFirst({
                where: {
                    id,

                    equipe: {
                        treinadorId: treinador.id
                    }
                }
            });


        if (!partida) {
            return res.status(404).json({
                mensagem: 'Partida não encontrada.'
            });
        }


        await prisma.partida.delete({
            where: {
                id
            }
        });


        return res.status(200).json({
            mensagem: 'Partida excluída com sucesso.'
        });

    } catch (error) {
        console.error('=================================');
        console.error('ERRO AO EXCLUIR PARTIDA:');
        console.error(error);
        console.error('=================================');

        return res.status(500).json({
            mensagem: 'Erro ao excluir partida.',
            erro: error.message
        });
    }
}


// ============================================================
// EXPORTS
// ============================================================

module.exports = {
    listarPartidas,
    buscarPartida,
    criarPartida,
    atualizarPartida,
    excluirPartida
};