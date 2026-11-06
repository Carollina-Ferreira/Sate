
const prisma = require('../lib/prisma');

// ============================================================
// LISTAR PARTIDAS E AÇÕES DE UM ATLETA
// ============================================================

async function listarPartidasDoAtleta(req, res) {
    try {
        const atletaId = Number(req.params.id);
        const usuarioId = Number(req.usuario?.id);

        // ----------------------------------------------------
        // VALIDAR DADOS
        // ----------------------------------------------------

        if (!Number.isInteger(atletaId) || atletaId <= 0) {
            return res.status(400).json({
                mensagem: 'ID do atleta inválido.',
            });
        }

        if (!Number.isInteger(usuarioId) || usuarioId <= 0) {
            return res.status(401).json({
                mensagem: 'Usuário não autenticado.',
            });
        }

        // ----------------------------------------------------
        // IDENTIFICAR TREINADOR
        // ----------------------------------------------------

        const treinador = await prisma.treinador.findUnique({
            where: {
                usuarioId: usuarioId,
            },

            select: {
                id: true,
            },
        });

        if (!treinador) {
            return res.status(403).json({
                mensagem: 'Treinador não identificado.',
            });
        }

        // ----------------------------------------------------
        // VERIFICAR SE O ATLETA PERTENCE AO TREINADOR
        // ----------------------------------------------------

        const atleta = await prisma.atleta.findFirst({
            where: {
                id: atletaId,
                treinadorId: treinador.id,
            },

            select: {
                id: true,
                nome: true,
            },
        });

        if (!atleta) {
            return res.status(404).json({
                mensagem: 'Atleta não encontrado.',
            });
        }

        // ----------------------------------------------------
        // BUSCAR PARTICIPAÇÕES DO ATLETA
        // ----------------------------------------------------

        const participacoes = await prisma.partidaAtleta.findMany({
            where: {
                atletaId: atletaId,

                partida: {
                    equipe: {
                        treinadorId: treinador.id,
                    },
                },
            },

            include: {
                partida: {
                    include: {
                        equipe: {
                            select: {
                                id: true,
                                nome: true,
                                modalidade: true,
                            },
                        },

                        videos: {
                            include: {
                                marcacoes: {
                                    where: {
                                        atletaId: atletaId,
                                    },

                                    include: {
                                        configuracao: {
                                            select: {
                                                id: true,
                                                nome: true,
                                                descricao: true,
                                                cor: true,
                                                icone: true,
                                            },
                                        },
                                    },

                                    orderBy: {
                                        tempoInicio: 'asc',
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        // ----------------------------------------------------
        // ORGANIZAR PARTIDAS E AÇÕES
        // ----------------------------------------------------

        const partidas = participacoes.map((participacao) => {
            const partida = participacao.partida;

            // Cada vídeo pode possuir várias marcações.
            const acoes = (partida.videos || []).flatMap((video) => {
                return (video.marcacoes || []).map((marcacao) => {
                    return {
                        id: marcacao.id,

                        videoId: video.id,
                        videoTitulo: video.titulo,

                        // URL necessária para reproduzir o vídeo.
                        videoUrl: video.url,

                        titulo: marcacao.titulo,

                        categoria:
                            marcacao.configuracao?.nome ||
                            marcacao.categoria ||
                            'Sem categoria',

                        cor:
                            marcacao.configuracao?.cor || null,

                        avaliacao:
                            marcacao.avaliacao || null,

                        tipoRegistro:
                            marcacao.tipoRegistro || 'EVENTO',

                        tempoInicio:
                            marcacao.tempoInicio,

                        tempoFim:
                            marcacao.tempoFim,

                        observacao:
                            marcacao.observacao,
                    };
                });
            });

            // Organizar as ações pelo momento em que aconteceram.
            acoes.sort((a, b) => {
                return a.tempoInicio - b.tempoInicio;
            });

            return {
                id: partida.id,

                equipe: partida.equipe,

                adversario: partida.adversario,

                data: partida.data,

                local: partida.local,

                campeonato: partida.campeonato,

                rodada: partida.rodada,

                status: partida.status,

                golsEquipe: partida.golsEquipe,

                golsAdversario: partida.golsAdversario,

                acoes: acoes,
            };
        });

        // ----------------------------------------------------
        // ORDENAR PARTIDAS DA MAIS RECENTE PARA A MAIS ANTIGA
        // ----------------------------------------------------

        partidas.sort((a, b) => {
            return (
                new Date(b.data).getTime() -
                new Date(a.data).getTime()
            );
        });

        // ----------------------------------------------------
        // RETORNAR RESULTADO
        // ----------------------------------------------------

        return res.status(200).json({
            atleta: {
                id: atleta.id,
                nome: atleta.nome,
            },

            totalPartidas: partidas.length,

            partidas: partidas,
        });

    } catch (error) {
        console.error(
            'ERRO AO LISTAR PARTIDAS DO ATLETA:',
            error
        );

        return res.status(500).json({
            mensagem: 'Erro ao buscar as partidas do atleta.',
        });
    }
}

// ============================================================
// EXPORTAÇÕES
// ============================================================

module.exports = {
    listarPartidasDoAtleta,
};
