
'use strict';

const prisma = require('../lib/prisma');

const TIPOS = ['boa', 'ruim', 'neutra', 'destaque'];

/* ============================================================
   FUNÇÕES AUXILIARES
============================================================ */

function tipoNormalizado(valor) {
    const texto = String(valor || '').trim().toLowerCase();

    if (texto.includes('destaq')) return 'destaque';

    if (
        texto.includes('ruim') ||
        texto.includes('negativ')
    ) return 'ruim';

    if (texto.includes('neutr')) return 'neutra';

    if (
        texto.includes('boa') ||
        texto.includes('positiv')
    ) return 'boa';

    return null;
}

function numero(valor) {
    const n = Number(valor);
    return Number.isFinite(n) ? n : 0;
}

function dataValida(valor) {
    const d = new Date(valor);

    return !Number.isNaN(d.getTime()) ? d : null;
}

function idPositivo(valor) {
    const id = Number(valor);

    return Number.isSafeInteger(id) && id > 0
        ? id
        : null;
}

function modelo(nome) {
    const chave =
        nome.charAt(0).toLowerCase() + nome.slice(1);

    const delegado = prisma[chave];

    return delegado &&
        typeof delegado.findMany === 'function'
        ? delegado
        : null;
}

function modeloSchema(nome) {
    try {
        const { Prisma } = require('@prisma/client');

        return Prisma.dmmf.datamodel.models.find(
            (m) => m.name === nome
        ) || null;
    } catch {
        return null;
    }
}

function campo(modelName, fieldName) {
    return Boolean(
        modeloSchema(modelName)?.fields?.some(
            (f) => f.name === fieldName
        )
    );
}

function relacao(modelName, relationName) {
    return modeloSchema(modelName)?.fields?.find(
        (f) =>
            f.name === relationName &&
            f.kind === 'object'
    ) || null;
}

function selecionarCampos(modelName, nomes) {
    const select = {};

    for (const nome of nomes) {
        if (campo(modelName, nome)) {
            select[nome] = true;
        }
    }

    return select;
}

/* ============================================================
   GET /api/estatisticas
   ESTATÍSTICAS DO TREINADOR AUTENTICADO
============================================================ */

async function listarDoTreinador(req, res) {
    try {
        /* ====================================================
           AUTENTICAÇÃO
        ==================================================== */

        const usuarioId = idPositivo(req.usuario?.id);

        if (!usuarioId) {
            return res.status(401).json({
                mensagem: 'Não autenticado.'
            });
        }

        const treinador = await prisma.treinador.findUnique({
            where: {
                usuarioId
            }
        });

        if (!treinador) {
            return res.status(403).json({
                mensagem: 'Treinador não encontrado.'
            });
        }

        /* ====================================================
           EQUIPES
        ==================================================== */

        const equipes = await prisma.equipe.findMany({
            where: {
                treinadorId: treinador.id
            },
            select: selecionarCampos(
                'Equipe',
                ['id', 'nome', 'modalidade']
            ),
            orderBy: {
                id: 'asc'
            }
        });

        const equipesIds = equipes.map(
            (equipe) => equipe.id
        );

        const equipeSelecionada = req.query.equipeId
            ? idPositivo(req.query.equipeId)
            : (equipesIds[0] || null);

        if (req.query.equipeId && !equipeSelecionada) {
            return res.status(400).json({
                mensagem: 'Equipe inválida.'
            });
        }

        if (
            equipeSelecionada &&
            !equipesIds.includes(equipeSelecionada)
        ) {
            return res.status(403).json({
                mensagem: 'Equipe não pertence ao treinador.'
            });
        }

        /* ====================================================
           FILTRO DE PERÍODO
        ==================================================== */

        const periodo = String(
            req.query.periodo || '30dias'
        );

        const periodosPermitidos = [
            '30dias',
            '60dias',
            'temporada'
        ];

        if (!periodosPermitidos.includes(periodo)) {
            return res.status(400).json({
                mensagem: 'Período inválido.'
            });
        }

        const hoje = new Date();

        const dias =
            periodo === '60dias' ? 60 : 30;

        const inicio = periodo === 'temporada'
            ? null
            : new Date(
                hoje.getTime() - dias * 86400000
            );

        /* ====================================================
           SEM EQUIPES
        ==================================================== */

        if (!equipeSelecionada) {
            return res.json({
                equipes,
                equipeId: null,
                atletasFiltro: [],
                periodo,

                resumo: {
                    partidas: 0,
                    atletas: 0,
                    eventos: 0,
                    gols: 0
                },

                atletas: [],

                acoes: TIPOS.map((nome) => ({
                    nome,
                    valor: 0,
                    quantidade: 0
                })),

                evolucao: []
            });
        }

        /* ====================================================
           PARTIDAS
        ==================================================== */

        const partidas = await prisma.partida.findMany({
            where: {
                equipeId: equipeSelecionada
            },

            select: selecionarCampos(
                'Partida',
                [
                    'id',
                    'data',
                    'adversario',
                    'golsEquipe',
                    'golsAdversario',
                    'status'
                ]
            ),

            orderBy: {
                data: 'asc'
            }
        });

        const partidasPeriodo = partidas.filter(
            (partida) => {
                const data = dataValida(partida.data);

                return (
                    data &&
                    data <= hoje &&
                    (!inicio || data >= inicio) &&
                    String(
                        partida.status || ''
                    ).toUpperCase() !== 'CANCELADA'
                );
            }
        );

        const idsPartida = partidasPeriodo.map(
            (partida) => partida.id
        );

        /* ====================================================
           VÍDEOS DAS PARTIDAS
        ==================================================== */

        const relVideos = relacao(
            'Partida',
            'videos'
        );

        const nomeVideo =
            relVideos?.type || 'VideoPartida';

        const videoDelegate = modelo(nomeVideo);

        let videos = [];

        if (
            idsPartida.length &&
            videoDelegate &&
            campo(nomeVideo, 'partidaId')
        ) {
            videos = await videoDelegate.findMany({
                where: {
                    partidaId: {
                        in: idsPartida
                    }
                },

                select: selecionarCampos(
                    nomeVideo,
                    ['id', 'partidaId']
                )
            });
        }

        const idsVideos = videos.map(
            (video) => video.id
        );

        const videoPorId = new Map(
            videos.map((video) => [
                video.id,
                video.partidaId
            ])
        );

        /* ====================================================
           MARCAÇÕES DOS VÍDEOS
        ==================================================== */

        const relMarcacoes = relacao(
            nomeVideo,
            'marcacoes'
        );

        const nomeMarcacao =
            relMarcacoes?.type ||
            (
                modelo('MarcacaoVideo')
                    ? 'MarcacaoVideo'
                    : 'Marcacao'
            );

        const marcacaoDelegate = modelo(
            nomeMarcacao
        );

        let marcacoes = [];

        if (
            idsVideos.length &&
            marcacaoDelegate &&
            campo(nomeMarcacao, 'videoId')
        ) {
            marcacoes = await marcacaoDelegate.findMany({
                where: {
                    videoId: {
                        in: idsVideos
                    }
                },

                select: selecionarCampos(
                    nomeMarcacao,
                    [
                        'id',
                        'videoId',
                        'atletaId',
                        'avaliacao',
                        'tipoRegistro',
                        'titulo',
                        'categoria',
                        'categoriaId',
                        'createdAt'
                    ]
                )
            });
        }

        /* ====================================================
           EVENTOS
           CLIPES NÃO ENTRAM NA CONTAGEM
        ==================================================== */

        const eventos = marcacoes
            .filter((marcacao) => {
                const tipoRegistro = String(
                    marcacao.tipoRegistro || 'EVENTO'
                ).toUpperCase();

                return tipoRegistro === 'EVENTO';
            })
            .map((marcacao) => ({
                ...marcacao,

                partidaId: videoPorId.get(
                    marcacao.videoId
                ),

                tipo: tipoNormalizado(
                    marcacao.avaliacao
                )
            }));

        /* ====================================================
           ATLETAS DA EQUIPE
        ==================================================== */

        const atletasMap = new Map();

        if (relacao('Equipe', 'atletas')) {
            const equipeComAtletas =
                await prisma.equipe.findUnique({
                    where: {
                        id: equipeSelecionada
                    },

                    include: {
                        atletas: true
                    }
                });

            const relAtletas = relacao(
                'Equipe',
                'atletas'
            );

            for (
                const item of
                equipeComAtletas?.atletas || []
            ) {
                const id = idPositivo(
                    item.atletaId ||
                    (
                        relAtletas?.type === 'Atleta'
                            ? item.id
                            : null
                    )
                );

                if (id) {
                    atletasMap.set(id, {
                        id,
                        nome: item.nome ||
                            `Atleta ${id}`
                    });
                }
            }
        }

        const atletaDelegate = modelo('Atleta');

        const marcadosIds = [
            ...new Set([
                ...atletasMap.keys(),

                ...eventos
                    .map(
                        (evento) =>
                            idPositivo(evento.atletaId)
                    )
                    .filter(Boolean)
            ])
        ];

        if (
            atletaDelegate &&
            marcadosIds.length
        ) {
            const selectAtleta = selecionarCampos(
                'Atleta',
                ['id', 'nome']
            );

            if (relacao('Atleta', 'usuario')) {
                selectAtleta.usuario = {
                    select: {
                        nome: true
                    }
                };
            }

            const atletas =
                await atletaDelegate.findMany({
                    where: {
                        id: {
                            in: marcadosIds
                        }
                    },

                    select: selectAtleta
                });

            for (const atleta of atletas) {
                atletasMap.set(atleta.id, {
                    id: atleta.id,

                    nome:
                        atleta.nome ||
                        atleta.usuario?.nome ||
                        `Atleta ${atleta.id}`
                });
            }
        }

        const atletasFiltro = [
            ...atletasMap.values()
        ].sort(
            (a, b) =>
                a.nome.localeCompare(b.nome, 'pt-BR')
        );

        /* ====================================================
           FILTRO DE ATLETA
        ==================================================== */

        const atletaSelecionado =
            req.query.atletaId &&
            req.query.atletaId !== 'todos'
                ? idPositivo(req.query.atletaId)
                : null;

        if (
            req.query.atletaId &&
            req.query.atletaId !== 'todos' &&
            !atletaSelecionado
        ) {
            return res.status(400).json({
                mensagem: 'Atleta inválido.'
            });
        }

        if (
            atletaSelecionado &&
            !atletasMap.has(atletaSelecionado)
        ) {
            return res.status(403).json({
                mensagem:
                    'Atleta não pertence aos dados disponíveis da equipe.'
            });
        }

        const eventosFiltrados = atletaSelecionado
            ? eventos.filter(
                (evento) =>
                    evento.atletaId === atletaSelecionado
            )
            : eventos;

        /* ====================================================
           CONTAGEM POR AVALIAÇÃO
        ==================================================== */

        const contagem = Object.fromEntries(
            TIPOS.map((tipo) => [tipo, 0])
        );

        const porAtleta = new Map();

        for (const evento of eventosFiltrados) {
            if (evento.tipo) {
                contagem[evento.tipo] += 1;
            }

            const atletaId = idPositivo(
                evento.atletaId
            );

            if (!atletaId) continue;

            if (!porAtleta.has(atletaId)) {
                porAtleta.set(atletaId, {
                    id: atletaId,

                    nome:
                        atletasMap.get(atletaId)?.nome ||
                        `Atleta ${atletaId}`,

                    boas: 0,
                    destaques: 0,
                    ruins: 0,
                    neutras: 0
                });
            }

            const item = porAtleta.get(atletaId);

            if (evento.tipo === 'boa') {
                item.boas++;
            } else if (evento.tipo === 'ruim') {
                item.ruins++;
            } else if (evento.tipo === 'neutra') {
                item.neutras++;
            } else if (evento.tipo === 'destaque') {
                item.destaques++;
            }
        }

        /* ====================================================
           PORCENTAGENS
        ==================================================== */

        const acoes = TIPOS.map((nome) => ({
            nome,

            quantidade: contagem[nome],

            valor: eventosFiltrados.length
                ? Math.round(
                    (
                        contagem[nome] /
                        eventosFiltrados.length
                    ) * 100
                )
                : 0
        }));

        /* ====================================================
           EVOLUÇÃO POR PARTIDA
        ==================================================== */

        const evolucao = partidasPeriodo.map(
            (partida, index) => {
                const eventosPartida =
                    eventosFiltrados.filter(
                        (evento) =>
                            evento.partidaId === partida.id
                    );

                return {
                    partida: `P${index + 1}`,

                    adversario:
                        partida.adversario || '',

                    data: partida.data,

                    boas: eventosPartida.filter(
                        (evento) =>
                            evento.tipo === 'boa'
                    ).length,

                    ruins: eventosPartida.filter(
                        (evento) =>
                            evento.tipo === 'ruim'
                    ).length
                };
            }
        );

        /* ====================================================
           RESPOSTA FINAL
        ==================================================== */

        return res.json({
            equipes,

            equipeId: equipeSelecionada,

            periodo,

            atletasFiltro,

            resumo: {
                partidas: partidasPeriodo.length,

                atletas: new Set(
                    eventosFiltrados
                        .map(
                            (evento) =>
                                idPositivo(evento.atletaId)
                        )
                        .filter(Boolean)
                ).size,

                eventos: eventosFiltrados.length,

                gols:
                    atletaSelecionado ||
                    !partidasPeriodo.some(
                        (partida) =>
                            partida.golsEquipe != null
                    )
                        ? null
                        : partidasPeriodo.reduce(
                            (total, partida) =>
                                total + numero(
                                    partida.golsEquipe
                                ),
                            0
                        )
            },

            atletas: [...porAtleta.values()].sort(
                (a, b) =>
                    a.nome.localeCompare(
                        b.nome,
                        'pt-BR'
                    )
            ),

            acoes,

            evolucao
        });

    } catch (error) {
        console.error(
            'Erro ao calcular estatísticas:',
            error
        );

        return res.status(500).json({
            mensagem:
                'Não foi possível carregar as estatísticas.'
        });
    }
}

module.exports = {
    listarDoTreinador
};
