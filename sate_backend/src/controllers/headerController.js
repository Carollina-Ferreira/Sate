const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// ============================================================
// AUXILIARES
// ============================================================

async function obterTreinador(usuarioId) {
    return prisma.treinador.findUnique({
        where: {
            usuarioId: Number(usuarioId),
        },
    });
}

function formatarTempo(data) {
    if (!data) return '';

    const agora = new Date();
    const dataReferencia = new Date(data);

    const diferenca = agora.getTime() - dataReferencia.getTime();
    const minutos = Math.floor(diferenca / 60000);
    const horas = Math.floor(minutos / 60);
    const dias = Math.floor(horas / 24);

    if (minutos < 1) {
        return 'Agora';
    }

    if (minutos < 60) {
        return `Há ${minutos} min`;
    }

    if (horas < 24) {
        return `Há ${horas}h`;
    }

    if (dias === 1) {
        return 'Ontem';
    }

    return `Há ${dias} dias`;
}

function diferencaEmDias(data) {
    const agora = new Date();

    const hoje = new Date(
        agora.getFullYear(),
        agora.getMonth(),
        agora.getDate()
    );

    const destinoOriginal = new Date(data);

    const destino = new Date(
        destinoOriginal.getFullYear(),
        destinoOriginal.getMonth(),
        destinoOriginal.getDate()
    );

    return Math.ceil(
        (destino.getTime() - hoje.getTime()) /
            (1000 * 60 * 60 * 24)
    );
}

// ============================================================
// NOTIFICAÇÕES DO HEADER
// ============================================================

async function listarNotificacoesHeader(req, res) {
    try {
        const usuarioId = req.usuario.id;

        const treinador = await obterTreinador(usuarioId);

        if (!treinador) {
            return res.status(404).json({
                mensagem: 'Treinador não encontrado.',
            });
        }

        const agora = new Date();

        const daquiTresDias = new Date();
        daquiTresDias.setDate(
            daquiTresDias.getDate() + 3
        );
        daquiTresDias.setHours(23, 59, 59, 999);

        const [
            partidasSemAnalise,
            proximasPartidas,
            atletas,
        ] = await Promise.all([
            // ------------------------------------------------
            // PARTIDAS QUE JÁ PASSARAM E NÃO FORAM ANALISADAS
            // ------------------------------------------------
            prisma.partida.findMany({
                where: {
                    equipe: {
                        treinadorId: treinador.id,
                    },

                    data: {
                        lt: agora,
                    },

                    status: 'AGENDADA',
                },

                include: {
                    equipe: true,
                },

                orderBy: {
                    data: 'desc',
                },

                take: 5,
            }),

            // ------------------------------------------------
            // PARTIDAS / CAMPEONATOS NOS PRÓXIMOS 3 DIAS
            // ------------------------------------------------
            prisma.partida.findMany({
                where: {
                    equipe: {
                        treinadorId: treinador.id,
                    },

                    data: {
                        gte: agora,
                        lte: daquiTresDias,
                    },

                    status: {
                        not: 'CANCELADA',
                    },
                },

                include: {
                    equipe: true,
                },

                orderBy: {
                    data: 'asc',
                },

                take: 5,
            }),

            // ------------------------------------------------
            // ATLETAS DAS EQUIPES DO TREINADOR
            // ------------------------------------------------
            prisma.atleta.findMany({
                where: {
                    equipe: {
                        treinadorId: treinador.id,
                    },
                },

                include: {
                    usuario: true,
                    equipe: true,
                },
            }),
        ]);

        const notificacoes = [];

        // ====================================================
        // PARTIDAS SEM ANÁLISE
        // ====================================================

        partidasSemAnalise.forEach((partida) => {
            notificacoes.push({
                id: `partida-sem-analise-${partida.id}`,

                type: 'partida',

                title: 'Partida sem análise',

                description:
                    `${partida.equipe.nome} x ${partida.adversario} ainda não foi analisada.`,

                time: formatarTempo(partida.data),

                read: false,

                prioridade: 'alta',

                destino: '/partidas',

                referenciaId: partida.id,
            });
        });

        // ====================================================
        // CAMPEONATOS / PARTIDAS PRÓXIMAS
        // ====================================================

        proximasPartidas.forEach((partida) => {
            const dias = diferencaEmDias(partida.data);

            let textoTempo = '';

            if (dias === 0) {
                textoTempo = 'é hoje';
            } else if (dias === 1) {
                textoTempo = 'é amanhã';
            } else {
                textoTempo = `acontece em ${dias} dias`;
            }

            notificacoes.push({
                id: `proxima-partida-${partida.id}`,

                type: 'campeonato',

                title: partida.campeonato
                    ? 'Campeonato se aproximando'
                    : 'Próxima partida',

                description: partida.campeonato
                    ? `${partida.campeonato} ${textoTempo}. ${partida.equipe.nome} enfrenta ${partida.adversario}.`
                    : `${partida.equipe.nome} enfrenta ${partida.adversario} e a partida ${textoTempo}.`,

                time:
                    dias === 0
                        ? 'Hoje'
                        : dias === 1
                        ? 'Amanhã'
                        : `Em ${dias} dias`,

                read: false,

                prioridade:
                    dias <= 1 ? 'alta' : 'media',

                destino: '/partidas',

                referenciaId: partida.id,
            });
        });

        // ====================================================
        // CADASTROS DE ATLETAS INCOMPLETOS
        // ====================================================

        const atletasIncompletos = atletas.filter(
            (atleta) => {
                return (
                    !atleta.cpf ||
                    !atleta.rg ||
                    !atleta.dataNascimento ||
                    !atleta.telefone
                );
            }
        );

        if (atletasIncompletos.length > 0) {
            notificacoes.push({
                id: 'atletas-cadastro-incompleto',

                type: 'atleta',

                title: 'Cadastro de atletas incompleto',

                description:
                    atletasIncompletos.length === 1
                        ? '1 atleta possui informações obrigatórias pendentes.'
                        : `${atletasIncompletos.length} atletas possuem informações pendentes.`,

                time: 'Agora',

                read: false,

                prioridade: 'media',

                destino: '/atletas',

                quantidade: atletasIncompletos.length,
            });
        }

        // ====================================================
        // ORDENAÇÃO
        // ====================================================

        const prioridade = {
            alta: 1,
            media: 2,
            baixa: 3,
        };

        notificacoes.sort((a, b) => {
            return (
                prioridade[a.prioridade] -
                prioridade[b.prioridade]
            );
        });

        return res.status(200).json({
            total: notificacoes.length,

            naoLidas: notificacoes.filter(
                (notificacao) => !notificacao.read
            ).length,

            notificacoes,
        });
    } catch (error) {
        console.error(
            'Erro ao carregar notificações do header:',
            error
        );

        return res.status(500).json({
            mensagem:
                'Erro ao carregar notificações.',
        });
    }
}

// ============================================================
// PESQUISA GLOBAL DO HEADER
// ============================================================

async function pesquisarHeader(req, res) {
    try {
        const usuarioId = req.usuario.id;

        const treinador = await obterTreinador(usuarioId);

        if (!treinador) {
            return res.status(404).json({
                mensagem: 'Treinador não encontrado.',
            });
        }

        const termo = String(
            req.query.q || ''
        ).trim();

        if (termo.length < 1) {
            return res.status(200).json({
                resultados: [],
                atletas: [],
                equipes: [],
                partidas: [],
            });
        }

        const [
            atletas,
            equipes,
            partidas,
        ] = await Promise.all([
            // ------------------------------------------------
            // ATLETAS
            // ------------------------------------------------
            prisma.atleta.findMany({
                where: {
                    equipe: {
                        treinadorId: treinador.id,
                    },

                    OR: [
                        {
                            nome: {
                                contains: termo,
                            },
                        },

                        {
                            categoria: {
                                contains: termo,
                            },
                        },
                    ],
                },

                include: {
                    equipe: true,
                    usuario: true,
                },

                take: 8,
            }),

            // ------------------------------------------------
            // EQUIPES
            // ------------------------------------------------
            prisma.equipe.findMany({
                where: {
                    treinadorId: treinador.id,

                    OR: [
                        {
                            nome: {
                                contains: termo,
                            },
                        },

                        {
                            modalidade: {
                                contains: termo,
                            },
                        },

                        {
                            categoria: {
                                contains: termo,
                            },
                        },
                    ],
                },

                take: 8,
            }),

            // ------------------------------------------------
            // PARTIDAS
            // ------------------------------------------------
            prisma.partida.findMany({
                where: {
                    equipe: {
                        treinadorId: treinador.id,
                    },

                    OR: [
                        {
                            adversario: {
                                contains: termo,
                            },
                        },

                        {
                            campeonato: {
                                contains: termo,
                            },
                        },

                        {
                            equipe: {
                                nome: {
                                    contains: termo,
                                },
                            },
                        },
                    ],
                },

                include: {
                    equipe: true,
                },

                orderBy: {
                    data: 'desc',
                },

                take: 8,
            }),
        ]);

        const atletasFormatados =
            atletas.map((atleta) => {
                const nome =
                    atleta.nome ||
                    atleta.usuario?.nome ||
                    'Atleta';

                const iniciais = nome
                    .split(' ')
                    .filter(Boolean)
                    .slice(0, 2)
                    .map((parte) => parte[0])
                    .join('')
                    .toUpperCase();

                return {
                    id: atleta.id,

                    type: 'atleta',

                    title: nome,

                    subtitle:
                        atleta.equipe?.nome ||
                        atleta.categoria ||
                        'Atleta',

                    initials: iniciais,
                };
            });

        const equipesFormatadas =
            equipes.map((equipe) => ({
                id: equipe.id,

                type: 'equipe',

                title: equipe.nome,

                subtitle:
                    [
                        equipe.modalidade,
                        equipe.categoria,
                    ]
                        .filter(Boolean)
                        .join(' • ') ||
                    'Equipe',
            }));

        const partidasFormatadas =
            partidas.map((partida) => ({
                id: partida.id,

                type: 'partida',

                title:
                    `${partida.equipe.nome} x ${partida.adversario}`,

                subtitle:
                    new Date(
                        partida.data
                    ).toLocaleDateString(
                        'pt-BR'
                    ),
            }));

        const resultados = [
            ...atletasFormatados,
            ...equipesFormatadas,
            ...partidasFormatadas,
        ];

        return res.status(200).json({
            resultados,

            atletas: atletasFormatados,

            equipes: equipesFormatadas,

            partidas: partidasFormatadas,
        });
    } catch (error) {
        console.error(
            'Erro na pesquisa do header:',
            error
        );

        return res.status(500).json({
            mensagem:
                'Erro ao realizar pesquisa.',
        });
    }
}

// ============================================================
// RESUMO DO HEADER
// ============================================================

async function obterResumoHeader(req, res) {
    try {
        const usuarioId = req.usuario.id;

        const usuario =
            await prisma.usuario.findUnique({
                where: {
                    id: Number(usuarioId),
                },

                select: {
                    id: true,
                    nome: true,
                    email: true,
                    tipo: true,
                    avatarUrl: true,
                },
            });

        if (!usuario) {
            return res.status(404).json({
                mensagem:
                    'Usuário não encontrado.',
            });
        }

        return res.status(200).json({
            usuario,
        });
    } catch (error) {
        console.error(
            'Erro ao carregar header:',
            error
        );

        return res.status(500).json({
            mensagem:
                'Erro ao carregar dados do header.',
        });
    }
}

module.exports = {
    listarNotificacoesHeader,
    pesquisarHeader,
    obterResumoHeader,
};