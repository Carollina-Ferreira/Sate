const prisma = require('../lib/prisma');
const { inteiro } = require('../lib/acesso');
const { notificacaoJson } = require('../lib/serializadores');

// ============================================================
// NOTIFICAÇÕES DO ATLETA
// Mesmo formato de resposta de /api/notificacoes do treinador:
// { notificacoes, naoLidas, total }
// ============================================================

async function listar(req, res) {
    const where = { atletaId: req.ctx.atleta.id };

    const [lista, naoLidas, total] = await Promise.all([
        prisma.notificacaoAtleta.findMany({
            where,
            orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
            take: 50,
        }),
        prisma.notificacaoAtleta.count({ where: { ...where, lida: false } }),
        prisma.notificacaoAtleta.count({ where }),
    ]);

    return res.json({ notificacoes: lista.map(notificacaoJson), naoLidas, total });
}

async function marcarLida(req, res) {
    const id = inteiro(req.params.id);
    if (!id) return res.status(400).json({ mensagem: 'ID da notificação inválido.' });

    const r = await prisma.notificacaoAtleta.updateMany({
        where: { id, atletaId: req.ctx.atleta.id },
        data: { lida: true },
    });
    if (!r.count) return res.status(404).json({ mensagem: 'Notificação não encontrada.' });

    return res.json({ mensagem: 'Notificação marcada como lida.' });
}

async function marcarTodasLidas(req, res) {
    const r = await prisma.notificacaoAtleta.updateMany({
        where: { atletaId: req.ctx.atleta.id, lida: false },
        data: { lida: true },
    });
    return res.json({ mensagem: 'Notificações marcadas como lidas.', atualizadas: r.count });
}

module.exports = { listar, marcarLida, marcarTodasLidas };
