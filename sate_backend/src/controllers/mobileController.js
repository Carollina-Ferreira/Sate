const prisma = require('../lib/prisma');
const {
    filtroAtletas,
    hojeDia,
    somaDias,
    lerDia,
} = require('../lib/acesso');
const {
    equipeJson,
    atletaJson,
    treinoJson,
    exercicioJson,
    eventoJson,
    testeJson,
    metaJson,
    feedbackJson,
    documentoJson,
    presencaJson,
} = require('../lib/serializadores');

function treinadorJson(t) {
    return {
        id: t.id,
        nome: t.nome,
        formacao: t.formacao || '',
        registroProfissional: t.registroProfissional || '',
        experiencia: t.experiencia || '',
    };
}

const INCLUDE_ATLETA = {
    usuario: { select: { id: true, nome: true, email: true, avatarUrl: true } },
    responsavel: true,
    endereco: true,
};

// ============================================================
// GET /api/mobile/me
// Sessão atual: usuário, perfil (treinador/atleta) e equipe.
// ============================================================
async function me(req, res) {
    const ctx = req.ctx;

    const usuario = await prisma.usuario.findUnique({
        where: { id: ctx.usuarioId },
        select: { id: true, nome: true, email: true, tipo: true, avatarUrl: true },
    });

    if (ctx.tipo === 'TREINADOR') {
        return res.json({
            usuario: { ...usuario, tipo: 'TREINADOR' },
            treinador: treinadorJson(ctx.treinador),
        });
    }

    const atleta = await prisma.atleta.findUnique({
        where: { id: ctx.atleta.id },
        include: INCLUDE_ATLETA,
    });

    return res.json({
        usuario: { ...usuario, tipo: 'ATLETA' },
        atleta: atletaJson(atleta),
    });
}

// ============================================================
// GET /api/mobile/snapshot?de=YYYY-MM-DD&ate=YYYY-MM-DD
// Retorna tudo que o aplicativo precisa em uma única chamada,
// já filtrado pelas permissões do usuário (treinador ou atleta).
// O banco de dados é a fonte oficial; o app só mantém cache em memória.
// ============================================================
async function snapshot(req, res) {
    const ctx = req.ctx;
    const hoje = hojeDia();
    const de = lerDia(req.query.de) || somaDias(hoje, -200);
    const ate = lerDia(req.query.ate) || somaDias(hoje, 200);
    const ehTreinador = ctx.tipo === 'TREINADOR';

    // ---------- atletas visíveis ----------
    let atletas;
    let equipes;

    if (ehTreinador) {
        [atletas, equipes] = await Promise.all([
            prisma.atleta.findMany({
                where: filtroAtletas(ctx),
                include: INCLUDE_ATLETA,
                orderBy: { nome: 'asc' },
            }),
            prisma.equipe.findMany({
                where: { treinadorId: ctx.treinador.id },
                include: { _count: { select: { atletas: true } } },
                orderBy: { createdAt: 'asc' },
            }),
        ]);
    } else {
        const eu = await prisma.atleta.findUnique({
            where: { id: ctx.atleta.id },
            include: INCLUDE_ATLETA,
        });
        atletas = [eu];
        equipes = eu.equipeId
            ? await prisma.equipe.findMany({
                  where: { id: eu.equipeId },
                  include: { _count: { select: { atletas: true } } },
              })
            : [];

        // Colegas de equipe: somente nome, posição e foto.
        if (eu.equipeId) {
            const colegas = await prisma.atleta.findMany({
                where: { equipeId: eu.equipeId, id: { not: eu.id } },
                select: {
                    id: true,
                    nome: true,
                    equipeId: true,
                    posicao: true,
                    usuario: { select: { nome: true, avatarUrl: true } },
                },
                orderBy: { nome: 'asc' },
            });
            // Nunca carregar CPF, RG, nascimento ou medidas físicas dos colegas.
            atletas.push(...colegas);
        }
    }

    const idsAtletas = atletas.map((a) => a.id);
    const idsEquipes = equipes.map((e) => e.id);
    const treinadorId = ehTreinador ? ctx.treinador.id : ctx.atleta.treinadorId;
    const meusIds = ehTreinador ? idsAtletas : [ctx.atleta.id];

    const [treinos, exercicios, eventos, presencas, testes, metas, feedbacks, documentos] =
        await Promise.all([
            idsEquipes.length
                ? prisma.treino.findMany({
                      where: { equipeId: { in: idsEquipes }, data: { gte: de, lte: ate } },
                      include: { atletas: { select: { atletaId: true } } },
                      orderBy: [{ data: 'asc' }, { inicioMin: 'asc' }],
                  })
                : [],
            treinadorId
                ? prisma.exercicio.findMany({
                      where: { treinadorId },
                      orderBy: { nome: 'asc' },
                  })
                : [],
            treinadorId
                ? prisma.eventoAgenda.findMany({
                      where: {
                          treinadorId,
                          data: { gte: de, lte: ate },
                          ...(ehTreinador
                              ? {}
                              : { OR: [{ equipeId: null }, { equipeId: { in: idsEquipes } }] }),
                      },
                      orderBy: [{ data: 'asc' }, { inicioMin: 'asc' }],
                  })
                : [],
            prisma.presenca.findMany({
                where: { atletaId: { in: meusIds }, data: { gte: de, lte: ate } },
            }),
            prisma.testeFisico.findMany({
                where: { atletaId: { in: meusIds } },
                orderBy: { data: 'asc' },
            }),
            prisma.metaAtleta.findMany({
                where: { atletaId: { in: meusIds } },
                orderBy: { prazo: 'asc' },
            }),
            prisma.feedbackAtleta.findMany({
                where: { atletaId: { in: meusIds } },
                orderBy: { createdAt: 'desc' },
            }),
            prisma.documento.findMany({
                where: { atletaId: { in: meusIds } },
                orderBy: { createdAt: 'desc' },
            }),
        ]);

    // Atleta só enxerga treinos da própria equipe e que o incluam.
    const treinosVisiveis = ehTreinador
        ? treinos
        : treinos.filter(
              (t) =>
                  t.equipeId === ctx.atleta.equipeId &&
                  (t.atletas.length === 0 ||
                      t.atletas.some((x) => x.atletaId === ctx.atleta.id))
          );

    return res.json({
        geradoEm: new Date().toISOString(),
        janela: { de: de.toISOString().slice(0, 10), ate: ate.toISOString().slice(0, 10) },
        tipo: ctx.tipo,
        treinador: ehTreinador ? treinadorJson(ctx.treinador) : null,
        equipes: equipes.map((e) => equipeJson(e, { comCodigo: ehTreinador })),
        atletas: ehTreinador
            ? atletas.map(atletaJson)
            : atletas.map((a, index) => index === 0
                ? atletaJson(a)
                : {
                    id: a.id,
                    nome: a.nome || a.usuario?.nome || 'Atleta',
                    equipeId: a.equipeId,
                    posicao: a.posicao || '',
                    avatarUrl: a.usuario?.avatarUrl || null,
                }),
        treinos: treinosVisiveis.map(treinoJson),
        exercicios: exercicios.map(exercicioJson),
        eventos: eventos.map(eventoJson),
        presencas: presencas.map(presencaJson),
        testes: testes.map(testeJson),
        metas: metas.map(metaJson),
        feedbacks: feedbacks.map(feedbackJson),
        documentos: documentos.map(documentoJson),
    });
}

// ============================================================
// PUT /api/mobile/perfil-profissional   (somente treinador)
// { formacao, registroProfissional, experiencia } — todos opcionais, até 191 caracteres.
// ============================================================
async function atualizarPerfilProfissional(req, res) {
    const b = req.body || {};
    const dados = {};

    for (const campo of ['formacao', 'registroProfissional', 'experiencia']) {
        if (b[campo] === undefined) continue;
        const valor = b[campo] === null ? '' : String(b[campo]).trim();
        if (valor.length > 191) {
            return res.status(400).json({ mensagem: 'Texto muito longo (máximo 191 caracteres).' });
        }
        dados[campo] = valor || null;
    }

    if (Object.keys(dados).length === 0) {
        return res.status(400).json({ mensagem: 'Nenhum dado para atualizar.' });
    }

    const t = await prisma.treinador.update({
        where: { id: req.ctx.treinador.id },
        data: dados,
    });
    return res.json({ mensagem: 'Informações profissionais salvas.', treinador: treinadorJson(t) });
}

module.exports = { me, snapshot, atualizarPerfilProfissional };
