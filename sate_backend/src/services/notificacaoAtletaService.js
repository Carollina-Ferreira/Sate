const prisma = require('../lib/prisma');
const { sincronizarNotificacaoGeral } = require('./notificacaoService');

// ============================================================
// NOTIFICAÇÕES DO ATLETA
// Uma notificação por (atleta, chave). Se o conteúdo mudar, volta a ser "não lida".
// ============================================================

async function notificarAtleta(client, atletaId, dados) {
    const c = client || prisma;
    const base = {
        tipo: dados.tipo,
        titulo: dados.titulo,
        descricao: dados.descricao,
        link: dados.link || null,
        entidadeTipo: dados.entidadeTipo || null,
        entidadeId: dados.entidadeId ?? null,
    };

    const existente = await c.notificacaoAtleta.findUnique({
        where: { atletaId_chave: { atletaId, chave: dados.chave } },
    });

    if (!existente) {
        return c.notificacaoAtleta.create({
            data: { atletaId, chave: dados.chave, ...base, lida: false },
        });
    }

    const mudou =
        existente.titulo !== base.titulo ||
        existente.descricao !== base.descricao ||
        existente.tipo !== base.tipo;

    return c.notificacaoAtleta.update({
        where: { id: existente.id },
        data: {
            ...base,
            ...(mudou ? { lida: false, createdAt: new Date() } : {}),
        },
    });
}

async function notificarAtletas(client, atletaIds, dados) {
    const unicos = [...new Set(atletaIds)];
    for (const id of unicos) {
        await notificarAtleta(client, id, dados);
    }
}

// Notificação para o treinador reutilizando o mecanismo que o site já usa
// (tabela Notificacao, única por treinador + chave).
async function notificarTreinador(client, treinadorId, dados) {
    return sincronizarNotificacaoGeral(
        client || prisma,
        {
            treinadorId,
            tipo: dados.tipo,
            titulo: dados.titulo,
            descricao: dados.descricao,
            link: dados.link || null,
            chave: dados.chave,
            entidadeTipo: dados.entidadeTipo || null,
            entidadeId: dados.entidadeId ?? null,
        },
        1
    );
}

// Atletas que recebem avisos de uma equipe (ou de todas as equipes do treinador).
async function idsAtletasDaEquipe(client, { equipeId, treinadorId }) {
    const c = client || prisma;
    const atletas = await c.atleta.findMany({
        where: equipeId ? { equipeId } : { treinadorId },
        select: { id: true },
    });
    return atletas.map((a) => a.id);
}

module.exports = {
    notificarAtleta,
    notificarAtletas,
    notificarTreinador,
    idsAtletasDaEquipe,
};
