const prisma = require('../lib/prisma');
const {
    inteiro,
    texto,
    lerDia,
    horaTexto,
    dataBr,
    resolverAtleta,
} = require('../lib/acesso');
const { eventoJson, presencaJson } = require('../lib/serializadores');
const {
    notificarAtletas,
    idsAtletasDaEquipe,
} = require('../services/notificacaoAtletaService');

const TIPOS = ['JOGO', 'AVALIACAO', 'REUNIAO', 'LEMBRETE'];
const ROTULO = { JOGO: 'Jogo', AVALIACAO: 'Avaliação', REUNIAO: 'Reunião', LEMBRETE: 'Lembrete' };

// ============================================================
// EVENTOS DA AGENDA (jogos, avaliações, reuniões, lembretes)
// ============================================================

async function lerEvento(req, b, base = {}) {
    const titulo = texto(b.titulo ?? base.titulo, 150);
    if (!titulo) return { erro: 'Informe o título do evento.' };

    const tipo = String(b.tipo ?? base.tipo ?? 'LEMBRETE').toUpperCase();
    if (!TIPOS.includes(tipo)) return { erro: 'Tipo de evento inválido.' };

    const data = b.data !== undefined ? lerDia(String(b.data)) : base.data;
    if (!data) return { erro: 'Data do evento inválida.' };

    const inicioMin = inteiro(b.inicioMin ?? base.inicioMin, 480);
    const fimMin = inteiro(b.fimMin ?? base.fimMin, 540);
    if (inicioMin < 0 || inicioMin > 1439 || fimMin < 0 || fimMin > 1440 || fimMin < inicioMin) {
        return { erro: 'Horário do evento inválido.' };
    }

    let equipeId = base.equipeId ?? null;
    if (b.equipeId !== undefined) {
        equipeId = b.equipeId === null ? null : inteiro(b.equipeId);
        if (equipeId) {
            const equipe = await prisma.equipe.findFirst({
                where: { id: equipeId, treinadorId: req.ctx.treinador.id },
            });
            if (!equipe) return { erro: 'Equipe não encontrada.', status: 404 };
        }
    }

    return {
        dados: {
            titulo,
            tipo,
            data,
            inicioMin,
            fimMin,
            equipeId,
            local: b.local !== undefined ? texto(b.local, 191) : base.local,
            observacoes:
                b.observacoes !== undefined
                    ? String(b.observacoes).slice(0, 5000)
                    : base.observacoes,
        },
    };
}

async function avisarEvento(tx, evento, treinadorId) {
    const alvo = await idsAtletasDaEquipe(tx, { equipeId: evento.equipeId, treinadorId });
    await notificarAtletas(tx, alvo, {
        tipo: 'evento_agenda',
        titulo: `${ROTULO[evento.tipo]}: ${evento.titulo}`,
        descricao: `${dataBr(evento.data)} das ${horaTexto(evento.inicioMin)} às ${horaTexto(
            evento.fimMin
        )}${evento.local ? ` — ${evento.local}` : ''}.`,
        link: '/agenda',
        chave: `evento-${evento.id}`,
        entidadeTipo: 'EVENTO',
        entidadeId: evento.id,
    });
}

async function listarEventos(req, res) {
    const ctx = req.ctx;
    const treinadorId = ctx.tipo === 'TREINADOR' ? ctx.treinador.id : ctx.atleta.treinadorId;
    if (!treinadorId) return res.json([]);

    const where = { treinadorId };
    const de = lerDia(req.query.de);
    const ate = lerDia(req.query.ate);
    if (de || ate) where.data = { ...(de && { gte: de }), ...(ate && { lte: ate }) };

    if (ctx.tipo === 'ATLETA') {
        where.OR = [{ equipeId: null }, { equipeId: ctx.atleta.equipeId ?? -1 }];
    }

    const eventos = await prisma.eventoAgenda.findMany({
        where,
        orderBy: [{ data: 'asc' }, { inicioMin: 'asc' }],
    });
    return res.json(eventos.map(eventoJson));
}

async function criarEvento(req, res) {
    const r = await lerEvento(req, req.body || {});
    if (r.erro) return res.status(r.status || 400).json({ mensagem: r.erro });

    const evento = await prisma.$transaction(async (tx) => {
        const e = await tx.eventoAgenda.create({
            data: { ...r.dados, treinadorId: req.ctx.treinador.id },
        });
        await avisarEvento(tx, e, req.ctx.treinador.id);
        return e;
    });
    return res.status(201).json(eventoJson(evento));
}

async function atualizarEvento(req, res) {
    const id = inteiro(req.params.id);
    const atual = id
        ? await prisma.eventoAgenda.findFirst({
              where: { id, treinadorId: req.ctx.treinador.id },
          })
        : null;
    if (!atual) return res.status(404).json({ mensagem: 'Evento não encontrado.' });

    const r = await lerEvento(req, req.body || {}, atual);
    if (r.erro) return res.status(r.status || 400).json({ mensagem: r.erro });

    const evento = await prisma.$transaction(async (tx) => {
        const e = await tx.eventoAgenda.update({ where: { id }, data: r.dados });
        await avisarEvento(tx, e, req.ctx.treinador.id);
        return e;
    });
    return res.json(eventoJson(evento));
}

async function excluirEvento(req, res) {
    const id = inteiro(req.params.id);
    const r = id
        ? await prisma.eventoAgenda.deleteMany({
              where: { id, treinadorId: req.ctx.treinador.id },
          })
        : { count: 0 };
    if (!r.count) return res.status(404).json({ mensagem: 'Evento não encontrado.' });
    return res.json({ mensagem: 'Evento removido.' });
}

// ============================================================
// FREQUÊNCIA (presença por atleta e dia)
// ============================================================

// GET /api/presencas?de=&ate=&atletaId=
async function listarPresencas(req, res) {
    const ctx = req.ctx;
    let atletaIds;

    if (ctx.tipo === 'ATLETA') {
        atletaIds = [ctx.atleta.id];
    } else {
        const filtro = inteiro(req.query.atletaId);
        const atletas = await prisma.atleta.findMany({
            where: { treinadorId: ctx.treinador.id, ...(filtro && { id: filtro }) },
            select: { id: true },
        });
        atletaIds = atletas.map((a) => a.id);
    }

    const where = { atletaId: { in: atletaIds } };
    const de = lerDia(req.query.de);
    const ate = lerDia(req.query.ate);
    if (de || ate) where.data = { ...(de && { gte: de }), ...(ate && { lte: ate }) };

    const lista = await prisma.presenca.findMany({ where });
    return res.json(lista.map(presencaJson));
}

// PUT /api/presencas  { atletaId, data, presente: true | false | null }
// Somente o treinador registra frequência. null remove a marcação.
async function registrarPresenca(req, res) {
    const b = req.body || {};
    const atleta = await resolverAtleta(req.ctx, b.atletaId);
    if (!atleta) return res.status(404).json({ mensagem: 'Atleta não encontrado.' });

    const data = lerDia(String(b.data || ''));
    if (!data) return res.status(400).json({ mensagem: 'Data inválida.' });

    if (b.presente === null) {
        await prisma.presenca.deleteMany({ where: { atletaId: atleta.id, data } });
        return res.json({ atletaId: atleta.id, data: b.data, presente: null });
    }
    if (typeof b.presente !== 'boolean') {
        return res.status(400).json({ mensagem: 'Informe presente: true, false ou null.' });
    }

    const p = await prisma.presenca.upsert({
        where: { atletaId_data: { atletaId: atleta.id, data } },
        create: { atletaId: atleta.id, data, presente: b.presente },
        update: { presente: b.presente },
    });
    return res.json(presencaJson(p));
}

module.exports = {
    listarEventos,
    criarEvento,
    atualizarEvento,
    excluirEvento,
    listarPresencas,
    registrarPresenca,
};
