const prisma =
    require('../lib/prisma');


// ============================================================
// TREINADOR LOGADO
// ============================================================

async function obterTreinadorLogado(req) {

    const usuarioId =
        req.usuario?.id;


    if (!usuarioId) {
        return null;
    }


    return prisma.treinador.findUnique({

        where: {
            usuarioId:
                Number(usuarioId),
        },

        include: {

            usuario: {

                select: {
                    id: true,
                    nome: true,
                    email: true,
                },

            },

        },

    });

}


// ============================================================
// INÍCIO DO MÊS
// ============================================================

function inicioDoMes(
    data,
) {

    return new Date(
        data.getFullYear(),
        data.getMonth(),
        1,
    );

}


// ============================================================
// PRÓXIMO MÊS
// ============================================================

function proximoMes(
    data,
) {

    return new Date(
        data.getFullYear(),
        data.getMonth() + 1,
        1,
    );

}


// ============================================================
// MÊS ANTERIOR
// ============================================================

function mesAnterior(
    data,
) {

    return new Date(
        data.getFullYear(),
        data.getMonth() - 1,
        1,
    );

}


// ============================================================
// VARIAÇÃO PERCENTUAL
// ============================================================

function calcularVariacao(
    atual,
    anterior,
) {

    if (
        anterior === 0
    ) {

        if (
            atual === 0
        ) {
            return 0;
        }


        return 100;

    }


    return Math.round(
        (
            (
                atual -
                anterior
            ) /
            anterior
        ) *
        100,
    );

}


// ============================================================
// TEMPO RELATIVO
// ============================================================

function tempoRelativo(
    data,
) {

    const agora =
        new Date();


    const diferenca =
        agora.getTime() -
        new Date(data).getTime();


    const minutos =
        Math.floor(
            diferenca /
            60000,
        );


    if (
        minutos < 1
    ) {
        return 'Agora';
    }


    if (
        minutos < 60
    ) {

        return `Há ${minutos} min`;

    }


    const horas =
        Math.floor(
            minutos /
            60,
        );


    if (
        horas < 24
    ) {

        return horas === 1
            ? 'Há 1 hora'
            : `Há ${horas} horas`;

    }


    const dias =
        Math.floor(
            horas /
            24,
        );


    if (
        dias === 1
    ) {
        return 'Ontem';
    }


    if (
        dias < 7
    ) {
        return `Há ${dias} dias`;
    }


    return new Date(
        data,
    ).toLocaleDateString(
        'pt-BR',
    );

}


// ============================================================
// STATUS PARA O FRONT
// ============================================================

function formatarStatus(
    status,
) {

    switch (
        status
    ) {

        case 'FINALIZADA':

            return 'Finalizada';


        case 'EM_ANDAMENTO':

            return 'Em andamento';


        case 'CANCELADA':

            return 'Cancelada';


        case 'AGENDADA':

        default:

            return 'Pendente';

    }

}


// ============================================================
// SIGLA DA EQUIPE
// ============================================================

function criarSigla(
    nome,
) {

    if (
        !nome
    ) {
        return '--';
    }


    const palavras =
        nome
            .trim()
            .split(/\s+/)
            .filter(Boolean);


    if (
        palavras.length === 1
    ) {

        return palavras[0]
            .substring(
                0,
                2,
            )
            .toUpperCase();

    }


    return (
        palavras[0][0] +
        palavras[1][0]
    ).toUpperCase();

}


// ============================================================
// RESULTADO FORMATADO
// ============================================================

function formatarResultado(
    partida,
) {

    if (
        partida.golsEquipe ===
            null ||
        partida.golsEquipe ===
            undefined ||
        partida.golsAdversario ===
            null ||
        partida.golsAdversario ===
            undefined
    ) {

        return '—';

    }


    return (
        `${partida.golsEquipe} - ` +
        `${partida.golsAdversario}`
    );

}


// ============================================================
// DESEMPENHO DA EQUIPE
// ============================================================

function calcularDesempenhoEquipe(
    partidas,
) {

    if (
        partidas.length === 0
    ) {
        return 0;
    }


    let pontos =
        0;


    partidas.forEach(
        (
            partida,
        ) => {

            const golsEquipe =
                partida.golsEquipe;


            const golsAdversario =
                partida.golsAdversario;


            if (
                golsEquipe === null ||
                golsAdversario === null
            ) {
                return;
            }


            if (
                golsEquipe >
                golsAdversario
            ) {

                pontos += 1;

            } else if (
                golsEquipe ===
                golsAdversario
            ) {

                pontos += 0.5;

            }

        },
    );


    return Math.round(
        (
            pontos /
            partidas.length
        ) *
        100,
    );

}


// ============================================================
// PONTO DO GRÁFICO
//
// Vitória = 100
// Empate = 50
// Derrota = 0
// ============================================================

function resultadoParaGrafico(
    partida,
) {

    const golsEquipe =
        partida.golsEquipe;


    const golsAdversario =
        partida.golsAdversario;


    if (
        golsEquipe ===
            null ||
        golsAdversario ===
            null
    ) {

        return {
            equipe: 0,
            adversario: 0,
        };

    }


    if (
        golsEquipe >
        golsAdversario
    ) {

        return {
            equipe: 100,
            adversario: 0,
        };

    }


    if (
        golsEquipe <
        golsAdversario
    ) {

        return {
            equipe: 0,
            adversario: 100,
        };

    }


    return {
        equipe: 50,
        adversario: 50,
    };

}


// ============================================================
// SÉRIE DO GRÁFICO
// ============================================================

function criarSerieDesempenho(
    partidas,
    quantidade,
) {

    const selecionadas =
        partidas
            .slice(
                0,
                quantidade,
            )
            .reverse();


    const equipe =
        [];


    const adversario =
        [];


    selecionadas.forEach(
        (
            partida,
        ) => {

            const resultado =
                resultadoParaGrafico(
                    partida,
                );


            equipe.push(
                resultado.equipe,
            );


            adversario.push(
                resultado.adversario,
            );

        },
    );


    return {
        equipe,
        adversario,
    };

}


// ============================================================
// FILTRO DOS ATLETAS DO TREINADOR
// ============================================================

function filtroAtletasTreinador(
    treinadorId,
) {

    return {

        OR: [

            {
                treinadorId,
            },

            {

                equipe: {

                    treinadorId,

                },

            },

        ],

    };

}


// ============================================================
// FILTRO DAS PARTIDAS DO TREINADOR
// ============================================================

function filtroPartidasTreinador(
    treinadorId,
) {

    return {

        equipe: {
            treinadorId,
        },

    };

}


// ============================================================
// GET /api/dashboard
// ============================================================

async function obterDashboard(
    req,
    res,
) {

    try {

        // ====================================================
        // TREINADOR
        // ====================================================

        const treinador =
            await obterTreinadorLogado(
                req,
            );


        if (
            !treinador
        ) {

            return res
                .status(401)
                .json({

                    mensagem:
                        'Treinador não identificado.',

                });

        }


        const treinadorId =
            treinador.id;


        const filtroAtletas =
            filtroAtletasTreinador(
                treinadorId,
            );


        const filtroPartidas =
            filtroPartidasTreinador(
                treinadorId,
            );


        // ====================================================
        // DATAS
        // ====================================================

        const agora =
            new Date();


        const inicioAtual =
            inicioDoMes(
                agora,
            );


        const inicioProximo =
            proximoMes(
                agora,
            );


        const inicioAnterior =
            mesAnterior(
                agora,
            );


        const limiteAlertas =
            new Date(
                agora.getTime() +
                7 *
                24 *
                60 *
                60 *
                1000,
            );


        // ====================================================
        // BUSCAR TUDO EM PARALELO
        // ====================================================

        const [

            totalAtletas,

            totalEquipes,

            totalPartidasFinalizadas,

            totalAlertas,

            atletasMesAtual,

            atletasMesAnterior,

            equipesMesAtual,

            equipesMesAnterior,

            partidasMesAtual,

            partidasMesAnterior,

            ultimasPartidas,

            partidasCalendario,

            equipesBanco,

            atividadesPartidas,

            atividadesAtletas,

            atividadesEquipes,

            partidasDesempenho,

        ] =
            await Promise.all([

                // --------------------------------------------
                // TOTAL ATLETAS
                // --------------------------------------------

                prisma.atleta.count({

                    where:
                        filtroAtletas,

                }),


                // --------------------------------------------
                // TOTAL EQUIPES
                // --------------------------------------------

                prisma.equipe.count({

                    where: {
                        treinadorId,
                    },

                }),


                // --------------------------------------------
                // PARTIDAS FINALIZADAS
                // --------------------------------------------

                prisma.partida.count({

                    where: {

                        ...filtroPartidas,

                        status:
                            'FINALIZADA',

                    },

                }),


                // --------------------------------------------
                // ALERTAS
                //
                // Partida ainda agendada que já passou
                // ou acontecerá nos próximos 7 dias.
                // --------------------------------------------

                prisma.partida.count({

                    where: {

                        ...filtroPartidas,

                        status:
                            'AGENDADA',

                        data: {
                            lte:
                                limiteAlertas,
                        },

                    },

                }),


                // --------------------------------------------
                // ATLETAS MÊS ATUAL
                // --------------------------------------------

                prisma.atleta.count({

                    where: {

                        AND: [

                            filtroAtletas,

                            {

                                createdAt: {

                                    gte:
                                        inicioAtual,

                                    lt:
                                        inicioProximo,

                                },

                            },

                        ],

                    },

                }),


                // --------------------------------------------
                // ATLETAS MÊS ANTERIOR
                // --------------------------------------------

                prisma.atleta.count({

                    where: {

                        AND: [

                            filtroAtletas,

                            {

                                createdAt: {

                                    gte:
                                        inicioAnterior,

                                    lt:
                                        inicioAtual,

                                },

                            },

                        ],

                    },

                }),


                // --------------------------------------------
                // EQUIPES MÊS ATUAL
                // --------------------------------------------

                prisma.equipe.count({

                    where: {

                        treinadorId,

                        createdAt: {

                            gte:
                                inicioAtual,

                            lt:
                                inicioProximo,

                        },

                    },

                }),


                // --------------------------------------------
                // EQUIPES MÊS ANTERIOR
                // --------------------------------------------

                prisma.equipe.count({

                    where: {

                        treinadorId,

                        createdAt: {

                            gte:
                                inicioAnterior,

                            lt:
                                inicioAtual,

                        },

                    },

                }),


                // --------------------------------------------
                // PARTIDAS FINALIZADAS ESTE MÊS
                // --------------------------------------------

                prisma.partida.count({

                    where: {

                        ...filtroPartidas,

                        status:
                            'FINALIZADA',

                        data: {

                            gte:
                                inicioAtual,

                            lt:
                                inicioProximo,

                        },

                    },

                }),


                // --------------------------------------------
                // PARTIDAS FINALIZADAS MÊS PASSADO
                // --------------------------------------------

                prisma.partida.count({

                    where: {

                        ...filtroPartidas,

                        status:
                            'FINALIZADA',

                        data: {

                            gte:
                                inicioAnterior,

                            lt:
                                inicioAtual,

                        },

                    },

                }),


                // --------------------------------------------
                // ÚLTIMAS PARTIDAS
                // --------------------------------------------

                prisma.partida.findMany({

                    where:
                        filtroPartidas,

                    include: {

                        equipe: {

                            select: {
                                id: true,
                                nome: true,
                                modalidade: true,
                            },

                        },

                    },

                    orderBy: {
                        data: 'desc',
                    },

                    take: 5,

                }),


                // --------------------------------------------
                // TODAS AS PARTIDAS PARA O CALENDÁRIO
                // --------------------------------------------

                prisma.partida.findMany({

                    where:
                        filtroPartidas,

                    include: {

                        equipe: {

                            select: {
                                id: true,
                                nome: true,
                                modalidade: true,
                            },

                        },

                    },

                    orderBy: {
                        data: 'asc',
                    },

                }),


                // --------------------------------------------
                // EQUIPES + PARTIDAS FINALIZADAS
                // --------------------------------------------

                prisma.equipe.findMany({

                    where: {
                        treinadorId,
                    },

                    select: {

                        id: true,

                        nome: true,

                        modalidade: true,

                        categoria: true,

                        corEquipe: true,

                        imagem: true,

                        atletas: {

                            select: {
                                id: true,
                            },

                        },

                        partidas: {

                            where: {

                                status:
                                    'FINALIZADA',

                                golsEquipe: {
                                    not: null,
                                },

                                golsAdversario: {
                                    not: null,
                                },

                            },

                            select: {

                                id: true,

                                golsEquipe:
                                    true,

                                golsAdversario:
                                    true,

                                data: true,

                            },

                            orderBy: {
                                data: 'desc',
                            },

                        },

                    },

                }),


                // --------------------------------------------
                // ATIVIDADES - PARTIDAS
                // --------------------------------------------

                prisma.partida.findMany({

                    where:
                        filtroPartidas,

                    include: {

                        equipe: {

                            select: {
                                nome: true,
                            },

                        },

                    },

                    orderBy: {
                        updatedAt: 'desc',
                    },

                    take: 6,

                }),


                // --------------------------------------------
                // ATIVIDADES - ATLETAS
                // --------------------------------------------

                prisma.atleta.findMany({

                    where:
                        filtroAtletas,

                    select: {

                        id: true,

                        nome: true,

                        updatedAt: true,

                        usuario: {

                            select: {
                                nome: true,
                            },

                        },

                    },

                    orderBy: {
                        updatedAt: 'desc',
                    },

                    take: 6,

                }),


                // --------------------------------------------
                // ATIVIDADES - EQUIPES
                // --------------------------------------------

                prisma.equipe.findMany({

                    where: {
                        treinadorId,
                    },

                    select: {

                        id: true,

                        nome: true,

                        updatedAt: true,

                    },

                    orderBy: {
                        updatedAt: 'desc',
                    },

                    take: 6,

                }),


                // --------------------------------------------
                // PARTIDAS PARA O GRÁFICO
                // --------------------------------------------

                prisma.partida.findMany({

                    where: {

                        ...filtroPartidas,

                        status:
                            'FINALIZADA',

                        golsEquipe: {
                            not: null,
                        },

                        golsAdversario: {
                            not: null,
                        },

                    },

                    select: {

                        id: true,

                        data: true,

                        golsEquipe:
                            true,

                        golsAdversario:
                            true,

                    },

                    orderBy: {
                        data: 'desc',
                    },

                    take: 7,

                }),

            ]);


        // ====================================================
        // RESUMOS
        // ====================================================

        const resumos = [

            {

                id: 1,

                titulo:
                    'Atletas',

                valor:
                    totalAtletas,

                detalhe:
                    'cadastrados',

                variacao:
                    calcularVariacao(
                        atletasMesAtual,
                        atletasMesAnterior,
                    ),

                rota:
                    '/atletas',

            },


            {

                id: 2,

                titulo:
                    'Equipes',

                valor:
                    totalEquipes,

                detalhe:
                    'equipes ativas',

                variacao:
                    calcularVariacao(
                        equipesMesAtual,
                        equipesMesAnterior,
                    ),

                rota:
                    '/equipes',

            },


            {

                id: 3,

                titulo:
                    'Partidas',

                valor:
                    totalPartidasFinalizadas,

                detalhe:
                    'finalizadas',

                variacao:
                    calcularVariacao(
                        partidasMesAtual,
                        partidasMesAnterior,
                    ),

                rota:
                    '/partidas',

            },


            {

                id: 4,

                titulo:
                    'Alertas',

                valor:
                    totalAlertas,

                detalhe:
                    'precisam de atenção',

                variacao:
                    0,

                rota:
                    '/partidas',

            },

        ];


        // ====================================================
        // ATIVIDADES
        // ====================================================

        const atividades = [];


        atividadesPartidas.forEach(
            (
                partida,
            ) => {

                atividades.push({

                    id:
                        `partida-${partida.id}`,

                    titulo:
                        partida.status ===
                        'FINALIZADA'
                            ? `${partida.equipe.nome} x ${partida.adversario} finalizada`
                            : `Partida ${partida.equipe.nome} x ${partida.adversario} atualizada`,

                    horario:
                        tempoRelativo(
                            partida.updatedAt,
                        ),

                    tipo:
                        'partida',

                    dataOrdenacao:
                        partida.updatedAt,

                });

            },
        );


        atividadesAtletas.forEach(
            (
                atleta,
            ) => {

                const nome =
                    atleta.nome ||
                    atleta.usuario?.nome ||
                    'Atleta';


                atividades.push({

                    id:
                        `atleta-${atleta.id}`,

                    titulo:
                        `Perfil de ${nome} atualizado`,

                    horario:
                        tempoRelativo(
                            atleta.updatedAt,
                        ),

                    tipo:
                        'atleta',

                    dataOrdenacao:
                        atleta.updatedAt,

                });

            },
        );


        atividadesEquipes.forEach(
            (
                equipe,
            ) => {

                atividades.push({

                    id:
                        `equipe-${equipe.id}`,

                    titulo:
                        `Equipe ${equipe.nome} atualizada`,

                    horario:
                        tempoRelativo(
                            equipe.updatedAt,
                        ),

                    tipo:
                        'equipe',

                    dataOrdenacao:
                        equipe.updatedAt,

                });

            },
        );


        const atividadesRecentes =
            atividades

                .sort(
                    (
                        a,
                        b,
                    ) =>
                        new Date(
                            b.dataOrdenacao,
                        ).getTime() -
                        new Date(
                            a.dataOrdenacao,
                        ).getTime(),
                )

                .slice(
                    0,
                    4,
                )

                .map(
                    (
                        atividade,
                    ) => {

                        const {
                            dataOrdenacao,
                            ...dadosAtividade
                        } =
                            atividade;


                        return dadosAtividade;

                    },
                );


        // ====================================================
        // ÚLTIMAS PARTIDAS
        // ====================================================

        const partidasFormatadas =
            ultimasPartidas.map(
                (
                    partida,
                ) => ({

                    id:
                        partida.id,

                    equipe:
                        partida.equipe.nome,

                    adversario:
                        partida.adversario,

                    modalidade:
                        partida.equipe.modalidade,

                    data:
                        partida.data,

                    dataFormatada:
                        new Date(
                            partida.data,
                        ).toLocaleDateString(
                            'pt-BR',
                        ),

                    resultado:
                        formatarResultado(
                            partida,
                        ),

                    status:
                        formatarStatus(
                            partida.status,
                        ),

                }),
            );


        // ====================================================
        // CALENDÁRIO
        // ====================================================

        const calendario =
            partidasCalendario.map(
                (
                    partida,
                ) => ({

                    id:
                        partida.id,

                    equipe:
                        partida.equipe.nome,

                    adversario:
                        partida.adversario,

                    modalidade:
                        partida.equipe.modalidade,

                    data:
                        partida.data,

                    dataFormatada:
                        new Date(
                            partida.data,
                        ).toLocaleDateString(
                            'pt-BR',
                        ),

                    resultado:
                        formatarResultado(
                            partida,
                        ),

                    status:
                        formatarStatus(
                            partida.status,
                        ),

                }),
            );


        // ====================================================
        // EQUIPES EM DESTAQUE
        // ====================================================

        const equipes =
            equipesBanco

                .map(
                    (
                        equipe,
                    ) => ({

                        id:
                            equipe.id,

                        nome:
                            equipe.nome,

                        modalidade:
                            equipe.modalidade,

                        categoria:
                            equipe.categoria,

                        sigla:
                            criarSigla(
                                equipe.nome,
                            ),

                        desempenho:
                            calcularDesempenhoEquipe(
                                equipe.partidas,
                            ),

                        atletas:
                            equipe.atletas.length,

                        corEquipe:
                            equipe.corEquipe,

                        imagem:
                            equipe.imagem,

                    }),
                )

                .sort(
                    (
                        a,
                        b,
                    ) =>
                        b.desempenho -
                        a.desempenho,
                )

                .slice(
                    0,
                    3,
                );


        // ====================================================
        // GRÁFICO
        // ====================================================

        const desempenho = {

            'Últimas 7 partidas':
                criarSerieDesempenho(
                    partidasDesempenho,
                    7,
                ),

            'Últimas 5 partidas':
                criarSerieDesempenho(
                    partidasDesempenho,
                    5,
                ),

            'Últimas 3 partidas':
                criarSerieDesempenho(
                    partidasDesempenho,
                    3,
                ),

        };


        // ====================================================
        // RESPOSTA
        // ====================================================

        return res
            .status(200)
            .json({

                treinador: {

                    id:
                        treinador.id,

                    nome:
                        treinador.nome ||
                        treinador.usuario?.nome ||
                        'Treinador',

                    email:
                        treinador.usuario?.email ||
                        null,

                },


                resumos,


                atividades:
                    atividadesRecentes,


                desempenho,


                partidas:
                    partidasFormatadas,


                partidasCalendario:
                    calendario,


                equipes,

            });


    } catch (
        error
    ) {

        console.error(
            '=================================',
        );

        console.error(
            'ERRO AO CARREGAR DASHBOARD:',
        );

        console.error(
            error,
        );

        console.error(
            '=================================',
        );


        return res
            .status(500)
            .json({

                mensagem:
                    'Erro ao carregar o dashboard.',

                erro:
                    error.message,

            });

    }

}


module.exports = {
    obterDashboard,
};