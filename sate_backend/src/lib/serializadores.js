const { textoDia } = require('./acesso');

// ============================================================
// FORMATOS JSON ENVIADOS AO APLICATIVO
// ============================================================

function listaDeTexto(valor) {
    if (!valor) return [];
    try {
        const lista = JSON.parse(valor);
        return Array.isArray(lista) ? lista.map(String) : [];
    } catch {
        return [];
    }
}

function idadeDe(dataNascimento) {
    if (!dataNascimento) return null;
    const n = new Date(dataNascimento);
    const hoje = new Date();
    let idade = hoje.getFullYear() - n.getUTCFullYear();
    const fez =
        hoje.getMonth() > n.getUTCMonth() ||
        (hoje.getMonth() === n.getUTCMonth() && hoje.getDate() >= n.getUTCDate());
    if (!fez) idade -= 1;
    return idade >= 0 && idade < 120 ? idade : null;
}

function equipeJson(e, { comCodigo = false } = {}) {
    return {
        id: e.id,
        nome: e.nome,
        modalidade: e.modalidade,
        categoria: e.categoria,
        local: e.local || '',
        diasTreino: (e.diasTreino || '')
            .split(',')
            .map((d) => Number(d))
            .filter((d) => d >= 1 && d <= 7),
        inicioMin: e.inicioMin ?? null,
        duracaoMin: e.duracaoMin ?? null,
        treinadorId: e.treinadorId,
        numeroAtletas: e._count?.atletas ?? undefined,
        ...(comCodigo ? { codigoConvite: e.codigoConvite || null } : {}),
    };
}

function atletaJson(a) {
    return {
        id: a.id,
        usuarioId: a.usuarioId,
        nome: a.nome || a.usuario?.nome || 'Atleta',
        email: a.usuario?.email || '',
        avatarUrl: a.usuario?.avatarUrl || null,
        equipeId: a.equipeId ?? null,
        treinadorId: a.treinadorId ?? null,
        posicao: a.posicao || '',
        alturaCm: a.alturaCm ?? null,
        pesoKg: a.pesoKg ?? null,
        dataNascimento: textoDia(a.dataNascimento),
        idade: idadeDe(a.dataNascimento),
        sexo: a.sexo || null,
        categoria: a.categoria || '',
        telefone: a.telefone || '',
        cpf: a.cpf || null,
        rg: a.rg || null,
        responsavel: a.responsavel || null,
        endereco: a.endereco || null,
    };
}

function treinoJson(t) {
    return {
        id: t.id,
        equipeId: t.equipeId,
        titulo: t.titulo,
        objetivo: t.objetivo || '',
        foco: t.foco || '',
        observacoes: t.observacoes || '',
        data: textoDia(t.data),
        inicioMin: t.inicioMin,
        duracaoMin: t.duracaoMin,
        exercicioIds: listaDeTexto(t.exercicios),
        atletaIds: (t.atletas || []).map((x) => x.atletaId),
        padraoChave: t.padraoChave || null,
        cancelado: !!t.cancelado,
    };
}

function exercicioJson(e) {
    return {
        id: String(e.id),
        nome: e.nome,
        grupo: e.grupo,
        series: e.series,
        repeticoes: e.repeticoes,
        duracaoSeg: e.duracaoSeg,
        instrucoes: e.instrucoes || '',
        video: e.video || '',
    };
}

function eventoJson(e) {
    return {
        id: e.id,
        equipeId: e.equipeId ?? null,
        titulo: e.titulo,
        tipo: e.tipo,
        local: e.local || '',
        observacoes: e.observacoes || '',
        data: textoDia(e.data),
        inicioMin: e.inicioMin,
        fimMin: e.fimMin,
    };
}

function testeJson(t) {
    return {
        id: t.id,
        atletaId: t.atletaId,
        teste: t.teste,
        unidade: t.unidade,
        valor: t.valor,
        data: new Date(t.data).toISOString(),
        obs: t.obs || '',
        registradoPor: t.registradoPor,
    };
}

function metaJson(m) {
    return {
        id: m.id,
        atletaId: m.atletaId,
        titulo: m.titulo,
        descricao: m.descricao || '',
        progresso: m.progresso,
        prazo: textoDia(m.prazo),
    };
}

function feedbackJson(f) {
    return {
        id: f.id,
        atletaId: f.atletaId,
        texto: f.texto,
        criadoEm: new Date(f.createdAt).toISOString(),
    };
}

function documentoJson(d) {
    return {
        id: d.id,
        atletaId: d.atletaId,
        titulo: d.nome,
        categoria: d.categoria || d.tipo || 'Geral',
        validade: textoDia(d.validade),
        aprovado: !!d.aprovado,
        obs: d.obs || '',
        url: d.url || '',
    };
}

function presencaJson(p) {
    return {
        atletaId: p.atletaId,
        data: textoDia(p.data),
        presente: p.presente,
    };
}

function notificacaoJson(n) {
    return {
        id: n.id,
        type: n.tipo,
        title: n.titulo,
        description: n.descricao,
        link: n.link,
        time: n.createdAt,
        read: n.lida,
        createdAt: n.createdAt,
        updatedAt: n.updatedAt,
        entidadeTipo: n.entidadeTipo,
        entidadeId: n.entidadeId,
    };
}

module.exports = {
    listaDeTexto,
    idadeDe,
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
    notificacaoJson,
};
