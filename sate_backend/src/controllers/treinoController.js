const prisma = require('../lib/prisma');
const {
    inteiro,
    texto,
    lerDia,
    horaTexto,
    dataBr,
    somaDias,
    hojeDia,
} = require('../lib/acesso');
const { treinoJson, exercicioJson } = require('../lib/serializadores');
const {
    notificarAtletas,
    idsAtletasDaEquipe,
} = require('../services/notificacaoAtletaService');

const INCLUDE_TREINO = { atletas: { select: { atletaId: true } } };

// ============================================================
// EXERCÍCIOS (biblioteca do treinador)
// ============================================================

function lerExercicio(b) {
    const nome = texto(b.nome, 120);
    if (!nome) return { erro: 'Informe o nome do exercício.' };

    return {
        dados: {
            nome,
            grupo: texto(b.grupo, 60) || 'Geral',
            series: Math.min(Math.max(inteiro(b.series, 3), 1), 50),
            repeticoes: Math.min(Math.max(inteiro(b.repeticoes, 10), 0), 1000),
            duracaoSeg: Math.min(Math.max(inteiro(b.duracaoSeg, 0), 0), 36000),
            instrucoes: b.instrucoes ? String(b.instrucoes).slice(0, 5000) : null,
            video: texto(b.video, 100),
        },
    };
}

async function criarExercicio(req, res) {
    const { dados, erro } = lerExercicio(req.body || {});
    if (erro) return res.status(400).json({ mensagem: erro });

    const e = await prisma.exercicio.create({
        data: { ...dados, treinadorId: req.ctx.treinador.id },
    });
    return res.status(201).json(exercicioJson(e));
}

async function atualizarExercicio(req, res) {
    const id = inteiro(req.params.id);
    const atual = id
        ? await prisma.exercicio.findFirst({
              where: { id, treinadorId: req.ctx.treinador.id },
          })
        : null;
    if (!atual) return res.status(404).json({ mensagem: 'Exercício não encontrado.' });

    const { dados, erro } = lerExercicio({ ...atual, ...(req.body || {}) });
    if (erro) return res.status(400).json({ mensagem: erro });

    const e = await prisma.exercicio.update({ where: { id }, data: dados });
    return res.json(exercicioJson(e));
}

async function excluirExercicio(req, res) {
    const id = inteiro(req.params.id);
    const r = id
        ? await prisma.exercicio.deleteMany({
              where: { id, treinadorId: req.ctx.treinador.id },
          })
        : { count: 0 };
    if (!r.count) return res.status(404).json({ mensagem: 'Exercício não encontrado.' });
    return res.json({ mensagem: 'Exercício removido.' });
}

// ============================================================
// TREINOS
// ============================================================

async function lerTreino(req, b, parcial = null) {
    const equipeId = inteiro(b.equipeId ?? parcial?.equipeId);
    const equipe = equipeId
        ? await prisma.equipe.findFirst({
              where: { id: equipeId, treinadorId: req.ctx.treinador.id },
          })
        : null;
    if (!equipe) return { erro: 'Equipe não encontrada.', status: 404 };

    const titulo = texto(b.titulo ?? parcial?.titulo, 150);
    if (!titulo) return { erro: 'Informe o título do treino.' };

    const data = b.data !== undefined ? lerDia(String(b.data)) : parcial?.data;
    if (!data) return { erro: 'Data do treino inválida.' };

    const inicioMin = inteiro(b.inicioMin ?? parcial?.inicioMin, 1080);
    const duracaoMin = inteiro(b.duracaoMin ?? parcial?.duracaoMin, 60);
    if (inicioMin < 0 || inicioMin > 1439) return { erro: 'Horário de início inválido.' };
    if (duracaoMin < 5 || duracaoMin > 600) return { erro: 'Duração inválida.' };

    let exercicios = parcial ? undefined : '[]';
    if (b.exercicioIds !== undefined) {
        if (!Array.isArray(b.exercicioIds) || b.exercicioIds.length > 100) {
            return { erro: 'Lista de exercícios inválida.' };
        }
        exercicios = JSON.stringify(b.exercicioIds.map((x) => String(x).slice(0, 40)));
    }

    // Atletas específicos precisam ser da equipe. Vazio = equipe inteira.
    let atletaIds;
    if (b.atletaIds !== undefined) {
        if (!Array.isArray(b.atletaIds)) return { erro: 'Lista de atletas inválida.' };
        atletaIds = [...new Set(b.atletaIds.map(Number))].filter(Number.isInteger);
        if (atletaIds.length) {
            const validos = await prisma.atleta.count({
                where: { id: { in: atletaIds }, equipeId: equipe.id },
            });
            if (validos !== atletaIds.length) {
                return { erro: 'Há atletas que não pertencem à equipe.' };
            }
        }
    }

    return {
        equipe,
        atletaIds,
        dados: {
            titulo,
            objetivo: b.objetivo !== undefined ? texto(b.objetivo, 191) : undefined,
            foco: b.foco !== undefined ? texto(b.foco, 191) : undefined,
            observacoes:
                b.observacoes !== undefined ? String(b.observacoes).slice(0, 5000) : undefined,
            data,
            inicioMin,
            duracaoMin,
            exercicios,
            cancelado: b.cancelado === undefined ? undefined : !!b.cancelado,
        },
    };
}

async function avisarTreino(tx, treino, equipe, atletaIds) {
    const alvo =
        atletaIds && atletaIds.length
            ? atletaIds
            : await idsAtletasDaEquipe(tx, { equipeId: equipe.id });

    const quando = `${dataBr(treino.data)} às ${horaTexto(treino.inicioMin)}`;

    await notificarAtletas(tx, alvo, {
        tipo: treino.cancelado ? 'treino_cancelado' : 'treino_agendado',
        titulo: treino.cancelado ? 'Treino cancelado' : 'Treino agendado',
        descricao: treino.cancelado
            ? `O treino "${treino.titulo}" de ${quando} foi cancelado.`
            : `${treino.titulo} — ${quando}, equipe ${equipe.nome}.`,
        link: '/treinos',
        chave: `treino-${treino.id}`,
        entidadeTipo: 'TREINO',
        entidadeId: treino.id,
    });
}

// POST /api/treinos  (se vier padraoChave, altera/cancela a sessão recorrente)
async function criarTreino(req, res) {
    const b = req.body || {};
    const r = await lerTreino(req, b);
    if (r.erro) return res.status(r.status || 400).json({ mensagem: r.erro });

    const padraoChave = texto(b.padraoChave, 100);
    const dadosLimpos = Object.fromEntries(
        Object.entries(r.dados).filter(([, v]) => v !== undefined)
    );

    const treino = await prisma.$transaction(async (tx) => {
        let t;
        if (padraoChave) {
            t = await tx.treino.upsert({
                where: { equipeId_padraoChave: { equipeId: r.equipe.id, padraoChave } },
                create: {
                    ...dadosLimpos,
                    equipeId: r.equipe.id,
                    treinadorId: req.ctx.treinador.id,
                    padraoChave,
                },
                update: dadosLimpos,
            });
        } else {
            t = await tx.treino.create({
                data: {
                    ...dadosLimpos,
                    equipeId: r.equipe.id,
                    treinadorId: req.ctx.treinador.id,
                },
            });
        }

        if (r.atletaIds !== undefined) {
            await tx.treinoAtleta.deleteMany({ where: { treinoId: t.id } });
            if (r.atletaIds.length) {
                await tx.treinoAtleta.createMany({
                    data: r.atletaIds.map((atletaId) => ({ treinoId: t.id, atletaId })),
                });
            }
        }

        await avisarTreino(tx, t, r.equipe, r.atletaIds);
        return tx.treino.findUnique({ where: { id: t.id }, include: INCLUDE_TREINO });
    });

    return res.status(201).json(treinoJson(treino));
}

// PUT /api/treinos/:id
async function atualizarTreino(req, res) {
    const id = inteiro(req.params.id);
    const atual = id
        ? await prisma.treino.findFirst({
              where: { id, treinadorId: req.ctx.treinador.id },
          })
        : null;
    if (!atual) return res.status(404).json({ mensagem: 'Treino não encontrado.' });

    const r = await lerTreino(req, req.body || {}, atual);
    if (r.erro) return res.status(r.status || 400).json({ mensagem: r.erro });

    const dadosLimpos = Object.fromEntries(
        Object.entries(r.dados).filter(([, v]) => v !== undefined)
    );

    const treino = await prisma.$transaction(async (tx) => {
        const t = await tx.treino.update({ where: { id }, data: dadosLimpos });

        if (r.atletaIds !== undefined) {
            await tx.treinoAtleta.deleteMany({ where: { treinoId: id } });
            if (r.atletaIds.length) {
                await tx.treinoAtleta.createMany({
                    data: r.atletaIds.map((atletaId) => ({ treinoId: id, atletaId })),
                });
            }
        }

        const atuais = await tx.treinoAtleta.findMany({ where: { treinoId: id } });
        await avisarTreino(tx, t, r.equipe, atuais.map((x) => x.atletaId));
        return tx.treino.findUnique({ where: { id }, include: INCLUDE_TREINO });
    });

    return res.json(treinoJson(treino));
}

// DELETE /api/treinos/:id
async function excluirTreino(req, res) {
    const id = inteiro(req.params.id);
    const atual = id
        ? await prisma.treino.findFirst({
              where: { id, treinadorId: req.ctx.treinador.id },
              include: { equipe: true, atletas: true },
          })
        : null;
    if (!atual) return res.status(404).json({ mensagem: 'Treino não encontrado.' });

    await prisma.$transaction(async (tx) => {
        await avisarTreino(
            tx,
            { ...atual, cancelado: true },
            atual.equipe,
            atual.atletas.map((x) => x.atletaId)
        );
        await tx.treino.delete({ where: { id } });
    });

    return res.json({ mensagem: 'Treino removido.' });
}

// GET /api/treinos?de=&ate=&equipeId=
async function listarTreinos(req, res) {
    const ctx = req.ctx;
    const de = lerDia(req.query.de) || somaDias(hojeDia(), -60);
    const ate = lerDia(req.query.ate) || somaDias(hojeDia(), 120);

    let equipeIds;
    if (ctx.tipo === 'TREINADOR') {
        const equipes = await prisma.equipe.findMany({
            where: { treinadorId: ctx.treinador.id },
            select: { id: true },
        });
        equipeIds = equipes.map((e) => e.id);
    } else {
        equipeIds = ctx.atleta.equipeId ? [ctx.atleta.equipeId] : [];
    }

    const filtroEquipe = inteiro(req.query.equipeId);
    if (filtroEquipe) equipeIds = equipeIds.filter((e) => e === filtroEquipe);

    const treinos = await prisma.treino.findMany({
        where: { equipeId: { in: equipeIds }, data: { gte: de, lte: ate } },
        include: INCLUDE_TREINO,
        orderBy: [{ data: 'asc' }, { inicioMin: 'asc' }],
    });

    const visiveis =
        ctx.tipo === 'TREINADOR'
            ? treinos
            : treinos.filter(
                  (t) =>
                      t.atletas.length === 0 ||
                      t.atletas.some((x) => x.atletaId === ctx.atleta.id)
              );

    return res.json(visiveis.map(treinoJson));
}

module.exports = {
    criarExercicio,
    atualizarExercicio,
    excluirExercicio,
    criarTreino,
    atualizarTreino,
    excluirTreino,
    listarTreinos,
};
