const prisma = require('../lib/prisma');
const {
    inteiro,
    texto,
    lerDia,
    resolverAtleta,
    filtroAtletas,
    dataBr,
} = require('../lib/acesso');
const {
    testeJson,
    metaJson,
    feedbackJson,
    documentoJson,
} = require('../lib/serializadores');
const {
    notificarAtleta,
    notificarTreinador,
} = require('../services/notificacaoAtletaService');

// Lista de ids de atletas que o usuário pode consultar (opcionalmente um só).
async function idsPermitidos(ctx, atletaId) {
    const filtro = inteiro(atletaId);
    const atletas = await prisma.atleta.findMany({
        where: { ...filtroAtletas(ctx), ...(filtro && { id: filtro }) },
        select: { id: true },
    });
    return atletas.map((a) => a.id);
}

// ============================================================
// TESTES FÍSICOS / AVALIAÇÕES
// ============================================================

// GET /api/testes?atletaId=
async function listarTestes(req, res) {
    const ids = await idsPermitidos(req.ctx, req.query.atletaId);
    const lista = await prisma.testeFisico.findMany({
        where: { atletaId: { in: ids } },
        orderBy: { data: 'asc' },
    });
    return res.json(lista.map(testeJson));
}

// POST /api/testes  { atletaId?, teste, unidade, valor, data?, obs? }
// Atleta registra apenas para si; treinador registra para os atletas dele.
async function registrarTeste(req, res) {
    const b = req.body || {};
    const atleta = await resolverAtleta(req.ctx, b.atletaId);
    if (!atleta) return res.status(404).json({ mensagem: 'Atleta não encontrado.' });

    const teste = texto(b.teste, 120);
    const unidade = texto(b.unidade, 30) || '';
    const valor = Number(b.valor);
    if (!teste) return res.status(400).json({ mensagem: 'Informe o nome do teste.' });
    if (!Number.isFinite(valor) || Math.abs(valor) > 1e9) {
        return res.status(400).json({ mensagem: 'Valor do teste inválido.' });
    }

    const data = b.data ? new Date(b.data) : new Date();
    if (Number.isNaN(data.getTime())) {
        return res.status(400).json({ mensagem: 'Data do teste inválida.' });
    }

    const porAtleta = req.ctx.tipo === 'ATLETA';

    const criado = await prisma.$transaction(async (tx) => {
        const t = await tx.testeFisico.create({
            data: {
                atletaId: atleta.id,
                teste,
                unidade,
                valor,
                data,
                obs: b.obs ? String(b.obs).slice(0, 2000) : null,
                registradoPor: porAtleta ? 'ATLETA' : 'TREINADOR',
            },
        });

        if (porAtleta && atleta.treinadorId) {
            await notificarTreinador(tx, atleta.treinadorId, {
                tipo: 'teste_registrado_atleta',
                titulo: 'Novo teste registrado',
                descricao: `${atleta.nome || 'Um atleta'} registrou ${teste}: ${valor} ${unidade}`.trim(),
                link: '/atletas',
                chave: `teste-${t.id}`,
                entidadeTipo: 'TESTE',
                entidadeId: t.id,
            });
        } else if (!porAtleta) {
            await notificarAtleta(tx, atleta.id, {
                tipo: 'teste_registrado',
                titulo: 'Nova avaliação registrada',
                descricao: `Seu treinador registrou ${teste}: ${valor} ${unidade}`.trim(),
                link: '/evolucao',
                chave: `teste-${t.id}`,
                entidadeTipo: 'TESTE',
                entidadeId: t.id,
            });
        }
        return t;
    });

    return res.status(201).json(testeJson(criado));
}

// DELETE /api/testes/:id  — atleta remove só os próprios; treinador, dos seus atletas.
async function excluirTeste(req, res) {
    const id = inteiro(req.params.id);
    const ids = await idsPermitidos(req.ctx);
    const r = id
        ? await prisma.testeFisico.deleteMany({ where: { id, atletaId: { in: ids } } })
        : { count: 0 };
    if (!r.count) return res.status(404).json({ mensagem: 'Teste não encontrado.' });
    return res.json({ mensagem: 'Teste removido.' });
}

// ============================================================
// METAS (treinador define; atleta consulta)
// ============================================================

async function listarMetas(req, res) {
    const ids = await idsPermitidos(req.ctx, req.query.atletaId);
    const lista = await prisma.metaAtleta.findMany({
        where: { atletaId: { in: ids } },
        orderBy: { prazo: 'asc' },
    });
    return res.json(lista.map(metaJson));
}

function lerMeta(b, base = {}) {
    const titulo = texto(b.titulo ?? base.titulo, 150);
    if (!titulo) return { erro: 'Informe o título da meta.' };

    const prazo = b.prazo !== undefined ? lerDia(String(b.prazo)) : base.prazo;
    if (!prazo) return { erro: 'Prazo inválido.' };

    const progresso = Math.min(Math.max(inteiro(b.progresso ?? base.progresso, 0), 0), 100);
    return {
        dados: {
            titulo,
            prazo,
            progresso,
            descricao:
                b.descricao !== undefined ? String(b.descricao).slice(0, 2000) : base.descricao,
        },
    };
}

async function criarMeta(req, res) {
    const b = req.body || {};
    const atleta = await resolverAtleta(req.ctx, b.atletaId);
    if (!atleta) return res.status(404).json({ mensagem: 'Atleta não encontrado.' });

    const r = lerMeta(b);
    if (r.erro) return res.status(400).json({ mensagem: r.erro });

    const meta = await prisma.$transaction(async (tx) => {
        const m = await tx.metaAtleta.create({ data: { ...r.dados, atletaId: atleta.id } });
        await notificarAtleta(tx, atleta.id, {
            tipo: 'meta_definida',
            titulo: 'Nova meta',
            descricao: `${m.titulo} — prazo ${dataBr(m.prazo)}.`,
            link: '/evolucao',
            chave: `meta-${m.id}`,
            entidadeTipo: 'META',
            entidadeId: m.id,
        });
        return m;
    });
    return res.status(201).json(metaJson(meta));
}

async function atualizarMeta(req, res) {
    const id = inteiro(req.params.id);
    const ids = await idsPermitidos(req.ctx);
    const atual = id
        ? await prisma.metaAtleta.findFirst({ where: { id, atletaId: { in: ids } } })
        : null;
    if (!atual) return res.status(404).json({ mensagem: 'Meta não encontrada.' });

    const r = lerMeta(req.body || {}, atual);
    if (r.erro) return res.status(400).json({ mensagem: r.erro });

    const m = await prisma.metaAtleta.update({ where: { id }, data: r.dados });
    return res.json(metaJson(m));
}

async function excluirMeta(req, res) {
    const id = inteiro(req.params.id);
    const ids = await idsPermitidos(req.ctx);
    const r = id
        ? await prisma.metaAtleta.deleteMany({ where: { id, atletaId: { in: ids } } })
        : { count: 0 };
    if (!r.count) return res.status(404).json({ mensagem: 'Meta não encontrada.' });
    return res.json({ mensagem: 'Meta removida.' });
}

// ============================================================
// FEEDBACKS (treinador escreve; atleta lê)
// ============================================================

async function listarFeedbacks(req, res) {
    const ids = await idsPermitidos(req.ctx, req.query.atletaId);
    const lista = await prisma.feedbackAtleta.findMany({
        where: { atletaId: { in: ids } },
        orderBy: { createdAt: 'desc' },
    });
    return res.json(lista.map(feedbackJson));
}

async function criarFeedback(req, res) {
    const b = req.body || {};
    const atleta = await resolverAtleta(req.ctx, b.atletaId);
    if (!atleta) return res.status(404).json({ mensagem: 'Atleta não encontrado.' });

    const t = b.texto ? String(b.texto).trim().slice(0, 3000) : '';
    if (!t) return res.status(400).json({ mensagem: 'Escreva o feedback.' });

    const fb = await prisma.$transaction(async (tx) => {
        const f = await tx.feedbackAtleta.create({ data: { atletaId: atleta.id, texto: t } });
        await notificarAtleta(tx, atleta.id, {
            tipo: 'feedback_recebido',
            titulo: 'Novo feedback do treinador',
            descricao: t.length > 140 ? `${t.slice(0, 137)}...` : t,
            link: '/evolucao',
            chave: `feedback-${f.id}`,
            entidadeTipo: 'FEEDBACK',
            entidadeId: f.id,
        });
        return f;
    });
    return res.status(201).json(feedbackJson(fb));
}

async function excluirFeedback(req, res) {
    const id = inteiro(req.params.id);
    const ids = await idsPermitidos(req.ctx);
    const r = id
        ? await prisma.feedbackAtleta.deleteMany({ where: { id, atletaId: { in: ids } } })
        : { count: 0 };
    if (!r.count) return res.status(404).json({ mensagem: 'Feedback não encontrado.' });
    return res.json({ mensagem: 'Feedback removido.' });
}

// ============================================================
// DOCUMENTOS (metadados: categoria, validade, aprovação)
// O envio do arquivo PDF continua em POST /api/atletas/:id/documentos.
// ============================================================

async function listarDocumentos(req, res) {
    const ids = await idsPermitidos(req.ctx, req.query.atletaId);
    const lista = await prisma.documento.findMany({
        where: { atletaId: { in: ids } },
        orderBy: { createdAt: 'desc' },
    });
    return res.json(lista.map(documentoJson));
}

function lerDocumento(b, base = {}) {
    const nome = texto(b.titulo ?? b.nome ?? base.nome, 150);
    if (!nome) return { erro: 'Informe o título do documento.' };

    let validade = base.validade ?? null;
    if (b.validade !== undefined) {
        if (!b.validade) validade = null;
        else {
            validade = lerDia(String(b.validade));
            if (!validade) return { erro: 'Validade inválida.' };
        }
    }

    return {
        dados: {
            nome,
            tipo: texto(b.categoria ?? base.tipo, 80) || 'Geral',
            categoria: texto(b.categoria ?? base.categoria, 80) || 'Geral',
            validade,
            obs: b.obs !== undefined ? String(b.obs).slice(0, 2000) : base.obs,
        },
    };
}

async function criarDocumento(req, res) {
    const b = req.body || {};
    const atleta = await resolverAtleta(req.ctx, b.atletaId);
    if (!atleta) return res.status(404).json({ mensagem: 'Atleta não encontrado.' });

    const r = lerDocumento(b);
    if (r.erro) return res.status(400).json({ mensagem: r.erro });

    const porAtleta = req.ctx.tipo === 'ATLETA';
    // Documento enviado pelo atleta fica pendente até o treinador aprovar.
    const aprovado = porAtleta ? false : b.aprovado !== false;

    const doc = await prisma.$transaction(async (tx) => {
        const d = await tx.documento.create({
            data: { ...r.dados, aprovado, url: '', atletaId: atleta.id },
        });
        if (porAtleta && atleta.treinadorId) {
            await notificarTreinador(tx, atleta.treinadorId, {
                tipo: 'documento_enviado',
                titulo: 'Documento enviado por atleta',
                descricao: `${atleta.nome || 'Um atleta'} enviou "${d.nome}" para aprovação.`,
                link: '/atletas',
                chave: `documento-${d.id}`,
                entidadeTipo: 'DOCUMENTO',
                entidadeId: d.id,
            });
        }
        return d;
    });
    return res.status(201).json(documentoJson(doc));
}

// Somente o treinador altera/aprova. Atleta só consulta.
async function atualizarDocumento(req, res) {
    const id = inteiro(req.params.id);
    const ids = await idsPermitidos(req.ctx);
    const atual = id
        ? await prisma.documento.findFirst({ where: { id, atletaId: { in: ids } } })
        : null;
    if (!atual) return res.status(404).json({ mensagem: 'Documento não encontrado.' });

    const b = req.body || {};
    const r = lerDocumento(b, atual);
    if (r.erro) return res.status(400).json({ mensagem: r.erro });

    const aprovado = b.aprovado === undefined ? atual.aprovado : !!b.aprovado;

    const doc = await prisma.$transaction(async (tx) => {
        const d = await tx.documento.update({ where: { id }, data: { ...r.dados, aprovado } });
        if (aprovado !== atual.aprovado) {
            await notificarAtleta(tx, d.atletaId, {
                tipo: 'documento_status',
                titulo: aprovado ? 'Documento aprovado' : 'Documento pendente',
                descricao: `"${d.nome}" ${aprovado ? 'foi aprovado' : 'voltou para pendente'}.`,
                link: '/documentos',
                chave: `documento-${d.id}`,
                entidadeTipo: 'DOCUMENTO',
                entidadeId: d.id,
            });
        }
        return d;
    });
    return res.json(documentoJson(doc));
}

async function excluirDocumento(req, res) {
    const id = inteiro(req.params.id);
    const ids = await idsPermitidos(req.ctx);
    const r = id
        ? await prisma.documento.deleteMany({
              where: {
                  id,
                  atletaId: { in: ids },
                  // Atleta só remove o que ainda não foi aprovado pelo treinador.
                  ...(req.ctx.tipo === 'ATLETA' && { aprovado: false }),
              },
          })
        : { count: 0 };
    if (!r.count) return res.status(404).json({ mensagem: 'Documento não encontrado.' });
    return res.json({ mensagem: 'Documento removido.' });
}

module.exports = {
    listarTestes,
    registrarTeste,
    excluirTeste,
    listarMetas,
    criarMeta,
    atualizarMeta,
    excluirMeta,
    listarFeedbacks,
    criarFeedback,
    excluirFeedback,
    listarDocumentos,
    criarDocumento,
    atualizarDocumento,
    excluirDocumento,
};
