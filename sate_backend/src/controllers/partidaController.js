
const prisma = require('../lib/prisma');

const {
    sincronizarNotificacaoPartida,
    resolverNotificacaoPartida,
    sincronizarNotificacoesEscalacaoTreinador,
} = require('../services/notificacaoService');

// ============================================================
// TREINADOR LOGADO
// ============================================================

async function obterTreinadorLogado(req) {
    const usuarioId = req.usuario?.id;

    if (!usuarioId) return null;

    return prisma.treinador.findUnique({
        where: {
            usuarioId: Number(usuarioId)
        }
    });
}

// ============================================================
// SINCRONIZAR NOTIFICAÇÃO GERAL DE ESCALAÇÃO
// ============================================================

async function atualizarNotificacaoEscalacao(treinadorId) {
    try {
        await sincronizarNotificacoesEscalacaoTreinador(
            prisma,
            treinadorId
        );
    } catch (error) {
        console.error(
            'ERRO AO ATUALIZAR NOTIFICAÇÃO DE ESCALAÇÃO:',
            error
        );
    }
}

// ============================================================
// SINCRONIZAR NOTIFICAÇÃO DE PARTIDA PRÓXIMA
// ============================================================

async function atualizarNotificacaoPartida(
    treinadorId,
    partida
) {
    try {
        await sincronizarNotificacaoPartida(
            prisma,
            treinadorId,
            partida
        );
    } catch (error) {
        console.error(
            'ERRO AO ATUALIZAR NOTIFICAÇÃO DA PARTIDA:',
            error
        );
    }
}

// ============================================================
// VALIDAR STATUS
// ============================================================

const STATUS_VALIDOS = [
    'AGENDADA',
    'EM_ANDAMENTO',
    'FINALIZADA',
    'CANCELADA'
];

function validarStatus(status) {
    return STATUS_VALIDOS.includes(status);
}

// ============================================================
// CONVERTER GOLS
// ============================================================

function converterGols(valor) {
    if (
        valor === undefined ||
        valor === null ||
        valor === ''
    ) {
        return null;
    }

    const numero = Number(valor);

    if (
        !Number.isInteger(numero) ||
        numero < 0
    ) {
        return NaN;
    }

    return numero;
}

function possuiResultado(golsEquipe, golsAdversario) {
    return golsEquipe !== null &&
        golsAdversario !== null;
}

// ============================================================
// LISTAR PARTIDAS
// GET /api/partidas
// ============================================================

async function listarPartidas(req, res) {
    try {
        const treinador = await obterTreinadorLogado(req);

        if (!treinador) {
            return res.status(401).json({
                mensagem: 'Treinador não identificado.'
            });
        }

        const partidas = await prisma.partida.findMany({
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
        console.error('ERRO AO LISTAR PARTIDAS:', error);

        return res.status(500).json({
            mensagem: 'Erro ao buscar partidas.',
            erro: error.message
        });
    }
}

// ============================================================
// BUSCAR PARTIDA
// GET /api/partidas/:id
// ============================================================

async function buscarPartida(req, res) {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                mensagem: 'ID da partida inválido.'
            });
        }

        const treinador = await obterTreinadorLogado(req);

        if (!treinador) {
            return res.status(401).json({
                mensagem: 'Treinador não identificado.'
            });
        }

        const partida = await prisma.partida.findFirst({
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
        console.error('ERRO AO BUSCAR PARTIDA:', error);

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
        const treinador = await obterTreinadorLogado(req);

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

        if (!equipeId || !Number.isInteger(Number(equipeId))) {
            return res.status(400).json({
                mensagem: 'A equipe é obrigatória.'
            });
        }

        if (!adversario || !String(adversario).trim()) {
            return res.status(400).json({
                mensagem: 'O adversário é obrigatório.'
            });
        }

        if (!data) {
            return res.status(400).json({
                mensagem: 'A data da partida é obrigatória.'
            });
        }

        const dataPartida = new Date(data);

        if (Number.isNaN(dataPartida.getTime())) {
            return res.status(400).json({
                mensagem: 'Data da partida inválida.'
            });
        }

        const golsCasa = converterGols(golsEquipe);
        const golsFora = converterGols(golsAdversario);

        if (Number.isNaN(golsCasa) || Number.isNaN(golsFora)) {
            return res.status(400).json({
                mensagem: 'Os gols devem ser números inteiros iguais ou maiores que zero.'
            });
        }

        const casaPreenchida = golsCasa !== null;
        const foraPreenchida = golsFora !== null;

        if (casaPreenchida !== foraPreenchida) {
            return res.status(400).json({
                mensagem: 'Informe os gols das duas equipes ou deixe os dois campos vazios.'
            });
        }

        const temResultado = possuiResultado(golsCasa, golsFora);

        if (status !== undefined && !validarStatus(status)) {
            return res.status(400).json({
                mensagem: 'Status da partida inválido.'
            });
        }

        const statusFinal = temResultado
            ? 'FINALIZADA'
            : (status || 'AGENDADA');

        const equipe = await prisma.equipe.findFirst({
            where: {
                id: Number(equipeId),
                treinadorId: treinador.id
            }
        });

        if (!equipe) {
            return res.status(404).json({
                mensagem: 'Equipe não encontrada ou não pertence ao treinador.'
            });
        }

        const partida = await prisma.partida.create({
            data: {
                equipeId: equipe.id,
                adversario: String(adversario).trim(),
                data: dataPartida,

                local: local ? String(local).trim() : null,
                campeonato: campeonato ? String(campeonato).trim() : null,
                rodada: rodada ? String(rodada).trim() : null,
                observacoes: observacoes ? String(observacoes).trim() : null,

                status: statusFinal,
                golsEquipe: golsCasa,
                golsAdversario: golsFora
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

        // Atualiza o lembrete de partida próxima.
        await atualizarNotificacaoPartida(
            treinador.id,
            partida
        );

        // Uma partida recém-criada começa sem escalação.
        await atualizarNotificacaoEscalacao(treinador.id);

        return res.status(201).json({
            mensagem: 'Partida criada com sucesso.',
            partida
        });

    } catch (error) {
        console.error('ERRO AO CRIAR PARTIDA:', error);

        return res.status(500).json({
            mensagem: 'Erro ao criar partida.',
            erro: error.message
        });
    }
}

// ============================================================
// ATUALIZAR PARTIDA, STATUS OU RESULTADO
// PUT /api/partidas/:id
// ============================================================

async function atualizarPartida(req, res) {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                mensagem: 'ID da partida inválido.'
            });
        }

        const treinador = await obterTreinadorLogado(req);

        if (!treinador) {
            return res.status(401).json({
                mensagem: 'Treinador não identificado.'
            });
        }

        const existente = await prisma.partida.findFirst({
            where: {
                id,
                equipe: {
                    treinadorId: treinador.id
                }
            }
        });

        if (!existente) {
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
            const equipe = await prisma.equipe.findFirst({
                where: {
                    id: Number(equipeId),
                    treinadorId: treinador.id
                }
            });

            if (!equipe) {
                return res.status(404).json({
                    mensagem: 'Equipe não encontrada ou não pertence ao treinador.'
                });
            }

            dadosPartida.equipeId = equipe.id;
        }

        if (adversario !== undefined) {
            if (!String(adversario).trim()) {
                return res.status(400).json({
                    mensagem: 'O adversário não pode ficar vazio.'
                });
            }

            dadosPartida.adversario = String(adversario).trim();
        }

        if (data !== undefined) {
            const novaData = new Date(data);

            if (Number.isNaN(novaData.getTime())) {
                return res.status(400).json({
                    mensagem: 'Data inválida.'
                });
            }

            dadosPartida.data = novaData;
        }

        if (local !== undefined) {
            dadosPartida.local = local
                ? String(local).trim()
                : null;
        }

        if (campeonato !== undefined) {
            dadosPartida.campeonato = campeonato
                ? String(campeonato).trim()
                : null;
        }

        if (rodada !== undefined) {
            dadosPartida.rodada = rodada
                ? String(rodada).trim()
                : null;
        }

        if (observacoes !== undefined) {
            dadosPartida.observacoes = observacoes
                ? String(observacoes).trim()
                : null;
        }

        if (status !== undefined) {
            if (!validarStatus(status)) {
                return res.status(400).json({
                    mensagem: 'Status inválido. Use AGENDADA, EM_ANDAMENTO, FINALIZADA ou CANCELADA.'
                });
            }

            dadosPartida.status = status;
        }

        const golsCasa = golsEquipe === undefined
            ? (existente.golsEquipe ?? null)
            : converterGols(golsEquipe);

        const golsFora = golsAdversario === undefined
            ? (existente.golsAdversario ?? null)
            : converterGols(golsAdversario);

        if (Number.isNaN(golsCasa) || Number.isNaN(golsFora)) {
            return res.status(400).json({
                mensagem: 'Os gols devem ser números inteiros iguais ou maiores que zero.'
            });
        }

        if ((golsCasa === null) !== (golsFora === null)) {
            return res.status(400).json({
                mensagem: 'Informe os gols das duas equipes ou deixe os dois campos vazios.'
            });
        }

        if (golsEquipe !== undefined) {
            dadosPartida.golsEquipe = golsCasa;
        }

        if (golsAdversario !== undefined) {
            dadosPartida.golsAdversario = golsFora;
        }

        const placarFoiAlterado =
            golsEquipe !== undefined ||
            golsAdversario !== undefined;

        if (
            status === undefined &&
            placarFoiAlterado &&
            possuiResultado(golsCasa, golsFora)
        ) {
            dadosPartida.status = 'FINALIZADA';
        }

        const partidaAtualizada = await prisma.partida.update({
            where: { id },
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

        // Atualiza os avisos conforme a nova data e status.
        await atualizarNotificacaoPartida(
            treinador.id,
            partidaAtualizada
        );

        await atualizarNotificacaoEscalacao(treinador.id);

        return res.status(200).json({
            mensagem: 'Partida atualizada com sucesso.',
            partida: partidaAtualizada
        });

    } catch (error) {
        console.error('ERRO AO ATUALIZAR PARTIDA:', error);

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

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                mensagem: 'ID da partida inválido.'
            });
        }

        const treinador = await obterTreinadorLogado(req);

        if (!treinador) {
            return res.status(401).json({
                mensagem: 'Treinador não identificado.'
            });
        }

        const partida = await prisma.partida.findFirst({
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
            where: { id }
        });

        // Resolve o lembrete individual da partida excluída.
        try {
            await resolverNotificacaoPartida(
                prisma,
                treinador.id,
                id
            );
        } catch (erroNotificacao) {
            console.error(
                'Erro ao resolver notificação da partida:',
                erroNotificacao
            );
        }

        // Atualiza a quantidade de partidas sem escalação.
        await atualizarNotificacaoEscalacao(treinador.id);

        return res.status(200).json({
            mensagem: 'Partida excluída com sucesso.'
        });

    } catch (error) {
        console.error('ERRO AO EXCLUIR PARTIDA:', error);

        return res.status(500).json({
            mensagem: 'Erro ao excluir partida.',
            erro: error.message
        });
    }
}

// ============================================================
// LISTAR ATLETAS DA PARTIDA
// GET /api/partidas/:id/atletas
// ============================================================

async function listarAtletasDaPartida(req, res) {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                mensagem: 'ID da partida inválido.'
            });
        }

        const treinador = await obterTreinadorLogado(req);

        if (!treinador) {
            return res.status(401).json({
                mensagem: 'Treinador não identificado.'
            });
        }

        const partida = await prisma.partida.findFirst({
            where: {
                id,
                equipe: {
                    treinadorId: treinador.id
                }
            },

            include: {
                atletas: {
                    include: {
                        atleta: true
                    }
                }
            }
        });

        if (!partida) {
            return res.status(404).json({
                mensagem: 'Partida não encontrada.'
            });
        }

        return res.status(200).json(partida.atletas);

    } catch (error) {
        console.error(
            'ERRO AO LISTAR ATLETAS DA PARTIDA:',
            error
        );

        return res.status(500).json({
            mensagem: 'Erro ao listar atletas da partida.',
            erro: error.message
        });
    }
}

// ============================================================
// SALVAR ATLETAS DA PARTIDA
// PUT /api/partidas/:id/atletas
// ============================================================

async function salvarAtletasDaPartida(req, res) {
    try {
        const id = Number(req.params.id);
        const { atletasIds } = req.body;

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                mensagem: 'ID da partida inválido.'
            });
        }

        if (
            !Array.isArray(atletasIds) ||
            !atletasIds.every(atletaId =>
                Number.isInteger(Number(atletaId)) &&
                Number(atletaId) > 0
            )
        ) {
            return res.status(400).json({
                mensagem: 'A lista de atletas é inválida.'
            });
        }

        const treinador = await obterTreinadorLogado(req);

        if (!treinador) {
            return res.status(401).json({
                mensagem: 'Treinador não identificado.'
            });
        }

        const partida = await prisma.partida.findFirst({
            where: {
                id,
                equipe: {
                    treinadorId: treinador.id
                }
            },

            include: {
                equipe: true
            }
        });

        if (!partida) {
            return res.status(404).json({
                mensagem: 'Partida não encontrada.'
            });
        }

        const ids = [...new Set(atletasIds.map(Number))];

        const atletasValidos = ids.length === 0
            ? []
            : await prisma.atleta.findMany({
                where: {
                    id: { in: ids },
                    equipeId: partida.equipeId
                },
                select: {
                    id: true
                }
            });

        if (atletasValidos.length !== ids.length) {
            return res.status(400).json({
                mensagem: 'Um ou mais atletas não pertencem à equipe desta partida.'
            });
        }

        await prisma.$transaction(async (tx) => {
            await tx.partidaAtleta.deleteMany({
                where: {
                    partidaId: id
                }
            });

            if (ids.length > 0) {
                await tx.partidaAtleta.createMany({
                    data: ids.map(atletaId => ({
                        partidaId: id,
                        atletaId
                    }))
                });
            }
        });

        // Atualiza a notificação geral após salvar a escalação.
        await atualizarNotificacaoEscalacao(treinador.id);

        return res.status(200).json({
            mensagem: 'Atletas da partida salvos com sucesso.',
            atletasIds: ids
        });

    } catch (error) {
        console.error(
            'ERRO AO SALVAR ATLETAS DA PARTIDA:',
            error
        );

        return res.status(500).json({
            mensagem: 'Erro ao salvar atletas da partida.',
            erro: error.message
        });
    }
}

// ============================================================
// EXPORTAÇÕES
// ============================================================

module.exports = {
    listarPartidas,
    buscarPartida,
    criarPartida,
    atualizarPartida,
    excluirPartida,
    listarAtletasDaPartida,
    salvarAtletasDaPartida
};
