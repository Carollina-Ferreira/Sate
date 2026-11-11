'use strict';

const prisma = require('../lib/prisma');
const { Prisma } = require('@prisma/client');

// Apenas eventos associados ao atleta, em vídeos de partidas de equipes
// pertencentes ao treinador autenticado, são usados neste relatório.

function idValido(valor) {
    const id = Number(valor);
    return Number.isSafeInteger(id) && id > 0 ? id : null;
}

function camposPrisma(nomeModelo) {
    const modelo = Prisma.dmmf?.datamodel?.models?.find(
        (item) => item.name === nomeModelo
    );
    return new Set((modelo?.fields || []).map((item) => item.name));
}

function normalizarAvaliacao(valor) {
    const tipo = String(valor || '')
        .trim()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toUpperCase();

    if (['POSITIVA', 'POSITIVO', 'BOA', 'BOM'].includes(tipo)) return 'boa';
    if (['NEGATIVA', 'NEGATIVO', 'RUIM'].includes(tipo)) return 'ruim';
    if (['NEUTRA', 'NEUTRO'].includes(tipo)) return 'neutra';
    if (['DESTAQUE', 'DESTACADA', 'DESTACADO'].includes(tipo)) return 'destaque';
    return null;
}

function resumoVazio() {
    return {
        boas: 0,
        ruins: 0,
        neutras: 0,
        destaques: 0,
        total: 0,
        partidasComEventos: 0,
    };
}

function percentualPositivo(resumo) {
    // Indicador transparente: ações boas + destaques / total classificado.
    // Não representa uma nota técnica oficial nem uma avaliação física.
    if (!resumo.total) return null;
    return Math.round(((resumo.boas + resumo.destaques) / resumo.total) * 100);
}

function contabilizar(eventos) {
    const resumo = resumoVazio();
    for (const evento of eventos) {
        if (evento.tipo === 'boa') resumo.boas += 1;
        if (evento.tipo === 'ruim') resumo.ruins += 1;
        if (evento.tipo === 'neutra') resumo.neutras += 1;
        if (evento.tipo === 'destaque') resumo.destaques += 1;
    }
    resumo.total = resumo.boas + resumo.ruins + resumo.neutras + resumo.destaques;
    return resumo;
}

async function obterEventosDoAtleta(atletaId, treinadorId) {
    if (!prisma.marcacaoVideo || !prisma.videoPartida) {
        return {
            eventos: [],
            partidas: [],
            possuiMarcacoes: false,
        };
    }

    const campos = camposPrisma('MarcacaoVideo');
    if (!campos.has('atletaId') || !campos.has('videoId')) {
        return {
            eventos: [],
            partidas: [],
            possuiMarcacoes: false,
        };
    }

    const select = { id: true, videoId: true };
    for (const propriedade of ['avaliacao', 'tipoRegistro', 'categoriaId', 'categoria']) {
        if (campos.has(propriedade)) select[propriedade] = true;
    }

    const marcacoes = await prisma.marcacaoVideo.findMany({
        where: { atletaId },
        select,
    });

    if (marcacoes.length === 0) {
        return { eventos: [], partidas: [], possuiMarcacoes: true };
    }

    const idsVideos = [...new Set(marcacoes.map((item) => item.videoId))];

    // A restrição por treinador acontece NO BANCO, antes de fazer as contagens.
    const videosAutorizados = await prisma.videoPartida.findMany({
        where: {
            id: { in: idsVideos },
            partida: { equipe: { treinadorId } },
        },
        select: { id: true, partidaId: true },
    });

    const videoParaPartida = new Map(
        videosAutorizados.map((video) => [video.id, video.partidaId])
    );

    const idsPartidas = [
        ...new Set(videosAutorizados.map((video) => video.partidaId)),
    ];

    if (!idsPartidas.length) {
        return { eventos: [], partidas: [], possuiMarcacoes: true };
    }

    const partidas = await prisma.partida.findMany({
        where: { id: { in: idsPartidas } },
        select: {
            id: true,
            data: true,
            adversario: true,
            status: true,
        },
        orderBy: [{ data: 'asc' }, { id: 'asc' }],
    });

    const partidasPermitidas = new Set(
        partidas
            .filter((p) => String(p.status).toUpperCase() !== 'CANCELADA')
            .map((p) => p.id)
    );

    const marcacoesAutorizadas = marcacoes.filter((marcacao) => {
        const partidaId = videoParaPartida.get(marcacao.videoId);
        if (!partidasPermitidas.has(partidaId)) return false;

        const tipoRegistro = String(marcacao.tipoRegistro || 'EVENTO').toUpperCase();
        if (tipoRegistro !== 'EVENTO') return false;

        // Compatibilidade com registros antigos sem tipoRegistro.
        if (
            !campos.has('tipoRegistro') &&
            String(marcacao.categoria || '').toUpperCase() === 'CLIPE'
        ) return false;

        return true;
    });

    const idsCategorias = [...new Set(
        marcacoesAutorizadas
            .map((item) => item.categoriaId)
            .filter((id) => idValido(id) !== null)
    )];

    const tiposCategorias = new Map();
    if (idsCategorias.length && prisma.configuracaoAnalise) {
        const configuracoes = await prisma.configuracaoAnalise.findMany({
            where: {
                id: { in: idsCategorias },
                treinadorId,
            },
            select: { id: true, tipo: true },
        });
        for (const configuracao of configuracoes) {
            tiposCategorias.set(configuracao.id, configuracao.tipo);
        }
    }

    const eventos = marcacoesAutorizadas
        .map((marcacao) => ({
            partidaId: videoParaPartida.get(marcacao.videoId),
            tipo: normalizarAvaliacao(marcacao.avaliacao) ||
                normalizarAvaliacao(tiposCategorias.get(marcacao.categoriaId)) ||
                normalizarAvaliacao(marcacao.categoria),
        }))
        .filter((evento) => evento.tipo !== null);

    return {
        eventos,
        partidas: partidas.filter((p) => partidasPermitidas.has(p.id)),
        possuiMarcacoes: true,
    };
}

// GET /api/estatisticas/atletas/:id
async function listarPerfilAtleta(req, res) {
    try {
        const atletaId = idValido(req.params.id);
        if (!atletaId) {
            return res.status(400).json({ mensagem: 'ID do atleta inválido.' });
        }

        const usuarioId = idValido(req.usuario?.id);
        if (!usuarioId) {
            return res.status(401).json({ mensagem: 'Usuário não autenticado.' });
        }

        const treinador = await prisma.treinador.findUnique({
            where: { usuarioId },
            select: { id: true },
        });
        if (!treinador) {
            return res.status(403).json({ mensagem: 'Perfil de treinador não identificado.' });
        }

        // Não expõe dados de atletas de outro treinador.
        const atleta = await prisma.atleta.findFirst({
            where: {
                id: atletaId,
                OR: [
                    { treinadorId: treinador.id },
                    { equipe: { treinadorId: treinador.id } },
                ],
            },
            select: { id: true, nome: true },
        });

        if (!atleta) {
            return res.status(404).json({ mensagem: 'Atleta não encontrado.' });
        }

        const { eventos, partidas, possuiMarcacoes } =
            await obterEventosDoAtleta(atletaId, treinador.id);

        const resumo = contabilizar(eventos);
        const porPartida = new Map();
        for (const evento of eventos) {
            if (!porPartida.has(evento.partidaId)) {
                porPartida.set(evento.partidaId, []);
            }
            porPartida.get(evento.partidaId).push(evento);
        }

        const evolucao = partidas
            .filter((partida) => porPartida.has(partida.id))
            .map((partida) => {
                const parcial = contabilizar(porPartida.get(partida.id));
                return {
                    partidaId: partida.id,
                    adversario: partida.adversario,
                    data: partida.data,
                    valor: percentualPositivo(parcial),
                    ...parcial,
                };
            });

        resumo.partidasComEventos = evolucao.length;

        return res.status(200).json({
            atleta: { id: atleta.id, nome: atleta.nome },
            resumo,
            desempenho: percentualPositivo(resumo),
            // O schema consultado contém avaliações de eventos, não notas
            // numéricas de Ataque/Defesa/Passe/Físico/Técnica/Visão.
            // Por isso o gráfico radar não recebe valores inventados.
            atributos: [],
            evolucao: evolucao.slice(-7).map((item, indice) => ({
                ...item,
                partida: `P${indice + 1}`,
            })),
            disponibilidade: {
                marcacoes: possuiMarcacoes,
                atributos: false,
            },
        });
    } catch (erro) {
        console.error('ERRO NO PERFIL ESTATÍSTICO DO ATLETA:', erro);
        return res.status(500).json({
            mensagem: 'Não foi possível carregar as estatísticas do atleta.',
        });
    }
}

module.exports = { listarPerfilAtleta };

