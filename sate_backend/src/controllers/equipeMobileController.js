const crypto = require('crypto');
const prisma = require('../lib/prisma');
const { inteiro, texto, resolverAtleta, lerDia } = require('../lib/acesso');
const { equipeJson, atletaJson } = require('../lib/serializadores');
const { notificarTreinador } = require('../services/notificacaoAtletaService');

const ALFABETO = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // sem 0/O/1/I
const SEXOS = ['MASCULINO', 'FEMININO', 'OUTRO', 'NAO_INFORMADO'];

const INCLUDE_ATLETA = {
    usuario: { select: { id: true, nome: true, email: true, avatarUrl: true } },
    responsavel: true,
    endereco: true,
};

// ============================================================
// LIMITE DE TENTATIVAS DE CÓDIGO (por usuário)
// ============================================================
const tentativas = new Map();

function limitarTentativas(usuarioId) {
    const agora = Date.now();
    const janela = 15 * 60 * 1000;
    const r = tentativas.get(usuarioId);
    if (!r || r.expira <= agora) {
        tentativas.set(usuarioId, { qtd: 1, expira: agora + janela });
        return true;
    }
    r.qtd += 1;
    return r.qtd <= 15;
}

function gerarCodigo() {
    const bytes = crypto.randomBytes(6);
    let c = '';
    for (const b of bytes) c += ALFABETO[b % ALFABETO.length];
    return `SATE-${c}`;
}

async function garantirCodigo(equipe, renovar = false) {
    if (equipe.codigoConvite && !renovar) return equipe.codigoConvite;

    for (let i = 0; i < 8; i += 1) {
        const codigo = gerarCodigo();
        try {
            await prisma.equipe.update({
                where: { id: equipe.id },
                data: { codigoConvite: codigo },
            });
            return codigo;
        } catch (e) {
            if (e.code !== 'P2002') throw e;
        }
    }
    throw new Error('Não foi possível gerar o código da equipe.');
}

// ============================================================
// ATLETA — GET /api/atletas/me
// ============================================================
async function meuPerfil(req, res) {
    const atleta = await prisma.atleta.findUnique({
        where: { id: req.ctx.atleta.id },
        include: INCLUDE_ATLETA,
    });
    return res.json(atletaJson(atleta));
}

// ============================================================
// ATLETA — PUT /api/atletas/me
// O atleta edita apenas os próprios dados de perfil.
// Campos sensíveis (CPF, RG, equipe, treinador) continuam com o treinador.
// ============================================================
async function atualizarMeuPerfil(req, res) {
    const b = req.body || {};
    const dados = {};

    if (b.nome !== undefined) {
        const nome = texto(b.nome, 120);
        if (!nome) return res.status(400).json({ mensagem: 'Informe o nome.' });
        dados.nome = nome;
    }
    if (b.telefone !== undefined) dados.telefone = texto(b.telefone, 40);
    if (b.posicao !== undefined) dados.posicao = texto(b.posicao, 60);

    if (b.alturaCm !== undefined) {
        const n = inteiro(b.alturaCm);
        if (b.alturaCm !== null && (n === null || n < 50 || n > 260)) {
            return res.status(400).json({ mensagem: 'Altura inválida (em cm).' });
        }
        dados.alturaCm = n;
    }
    if (b.pesoKg !== undefined) {
        const n = b.pesoKg === null ? null : Number(b.pesoKg);
        if (n !== null && (!Number.isFinite(n) || n < 10 || n > 400)) {
            return res.status(400).json({ mensagem: 'Peso inválido (em kg).' });
        }
        dados.pesoKg = n;
    }
    if (b.sexo !== undefined) {
        const s = b.sexo ? String(b.sexo).toUpperCase() : null;
        if (s && !SEXOS.includes(s)) {
            return res.status(400).json({ mensagem: 'Sexo inválido.' });
        }
        dados.sexo = s;
    }
    if (b.dataNascimento !== undefined) {
        if (!b.dataNascimento) dados.dataNascimento = null;
        else {
            const d = lerDia(String(b.dataNascimento));
            if (!d) return res.status(400).json({ mensagem: 'Data de nascimento inválida.' });
            dados.dataNascimento = d;
        }
    }

    if (Object.keys(dados).length === 0) {
        return res.status(400).json({ mensagem: 'Nenhum dado para atualizar.' });
    }

    const atualizado = await prisma.$transaction(async (tx) => {
        const a = await tx.atleta.update({
            where: { id: req.ctx.atleta.id },
            data: dados,
            include: INCLUDE_ATLETA,
        });
        // Mantém o nome do usuário igual ao do atleta (o site exibe os dois).
        if (dados.nome) {
            await tx.usuario.update({
                where: { id: a.usuarioId },
                data: { nome: dados.nome },
            });
        }
        return a;
    });

    return res.json({ mensagem: 'Perfil atualizado.', atleta: atletaJson(atualizado) });
}

// ============================================================
// ATLETA — GET /api/equipes/minhas
// ============================================================
async function minhasEquipes(req, res) {
    const a = await prisma.atleta.findUnique({ where: { id: req.ctx.atleta.id } });
    if (!a?.equipeId) return res.json([]);

    const equipe = await prisma.equipe.findUnique({
        where: { id: a.equipeId },
        include: { _count: { select: { atletas: true } } },
    });
    return res.json(equipe ? [equipeJson(equipe)] : []);
}

// ============================================================
// ATLETA — POST /api/equipes/entrar   { codigo }
// Regras do sistema: o atleta só entra em UMA equipe por vez e não pode
// estar vinculado a outro treinador.
// ============================================================
async function entrarEquipe(req, res) {
    if (!limitarTentativas(req.ctx.usuarioId)) {
        return res.status(429).json({
            mensagem: 'Muitas tentativas. Aguarde alguns minutos e tente novamente.',
        });
    }

    const bruto = String(req.body?.codigo || '').toUpperCase().replace(/\s+/g, '');
    if (!bruto) return res.status(400).json({ mensagem: 'Informe o código da equipe.' });

    const codigo = bruto.startsWith('SATE-') ? bruto : `SATE-${bruto}`;

    const equipe = await prisma.equipe.findUnique({
        where: { codigoConvite: codigo },
        include: { treinador: { select: { id: true, nome: true } } },
    });
    if (!equipe) return res.status(404).json({ mensagem: 'Código de equipe inválido.' });

    const atleta = await prisma.atleta.findUnique({ where: { id: req.ctx.atleta.id } });

    if (atleta.equipeId === equipe.id) {
        return res.json({ mensagem: 'Você já faz parte desta equipe.', equipe: equipeJson(equipe) });
    }
    if (atleta.equipeId) {
        return res.status(409).json({
            mensagem: 'Você já pertence a uma equipe. Peça ao treinador para movê-lo.',
        });
    }
    if (atleta.treinadorId && atleta.treinadorId !== equipe.treinadorId) {
        return res.status(409).json({
            mensagem: 'Você já está vinculado a outro treinador.',
        });
    }

    await prisma.$transaction(async (tx) => {
        await tx.atleta.update({
            where: { id: atleta.id },
            data: { equipeId: equipe.id, treinadorId: equipe.treinadorId },
        });
        await notificarTreinador(tx, equipe.treinadorId, {
            tipo: 'atleta_entrou_equipe',
            titulo: 'Novo atleta na equipe',
            descricao: `${atleta.nome || 'Um atleta'} entrou na equipe ${equipe.nome} pelo código de convite.`,
            link: '/atletas',
            chave: `atleta-entrou-${atleta.id}-${equipe.id}`,
            entidadeTipo: 'ATLETA',
            entidadeId: atleta.id,
        });
    });

    return res.json({
        mensagem: `Você entrou na equipe ${equipe.nome}.`,
        equipe: equipeJson(equipe),
    });
}

// ============================================================
// TREINADOR — GET /api/equipes/:id/codigo  (gera se ainda não existir)
//             POST /api/equipes/:id/codigo (renova o código)
// ============================================================
async function obterEquipeDoTreinador(req, res) {
    const id = inteiro(req.params.id);
    if (!id) {
        res.status(400).json({ mensagem: 'ID da equipe inválido.' });
        return null;
    }
    const equipe = await prisma.equipe.findFirst({
        where: { id, treinadorId: req.ctx.treinador.id },
    });
    if (!equipe) {
        res.status(404).json({ mensagem: 'Equipe não encontrada.' });
        return null;
    }
    return equipe;
}

async function codigoEquipe(req, res) {
    const equipe = await obterEquipeDoTreinador(req, res);
    if (!equipe) return undefined;
    const codigo = await garantirCodigo(equipe, req.method === 'POST');
    return res.json({ equipeId: equipe.id, codigo });
}

// ============================================================
// TREINADOR — PUT /api/equipes/:id/agenda
// { local, diasTreino:[1..7], inicioMin, duracaoMin }
// ============================================================
async function atualizarAgendaEquipe(req, res) {
    const equipe = await obterEquipeDoTreinador(req, res);
    if (!equipe) return undefined;

    const b = req.body || {};
    const dados = {};

    if (b.local !== undefined) dados.local = texto(b.local, 191);

    if (b.diasTreino !== undefined) {
        if (!Array.isArray(b.diasTreino)) {
            return res.status(400).json({ mensagem: 'Dias de treino inválidos.' });
        }
        const dias = [...new Set(b.diasTreino.map(Number))].filter(
            (d) => Number.isInteger(d) && d >= 1 && d <= 7
        );
        dados.diasTreino = dias.sort().join(',') || null;
    }
    if (b.inicioMin !== undefined) {
        const n = inteiro(b.inicioMin);
        if (n === null || n < 0 || n > 1439) {
            return res.status(400).json({ mensagem: 'Horário de início inválido.' });
        }
        dados.inicioMin = n;
    }
    if (b.duracaoMin !== undefined) {
        const n = inteiro(b.duracaoMin);
        if (n === null || n < 5 || n > 600) {
            return res.status(400).json({ mensagem: 'Duração inválida.' });
        }
        dados.duracaoMin = n;
    }

    const atualizada = await prisma.equipe.update({
        where: { id: equipe.id },
        data: dados,
        include: { _count: { select: { atletas: true } } },
    });

    return res.json({
        mensagem: 'Agenda da equipe atualizada.',
        equipe: equipeJson(atualizada, { comCodigo: true }),
    });
}

module.exports = {
    meuPerfil,
    atualizarMeuPerfil,
    minhasEquipes,
    entrarEquipe,
    codigoEquipe,
    atualizarAgendaEquipe,
    resolverAtleta,
};
