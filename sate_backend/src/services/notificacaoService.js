const CHAVE_NOTIFICACAO_CADASTRO = 'cadastros-incompletos';
const CHAVE_NOTIFICACAO_ESCALACAO = 'partidas-sem-escalacao';
const CHAVE_NOTIFICACAO_LOCAL = 'partidas-sem-local';
const CHAVE_NOTIFICACAO_ATRASADAS = 'partidas-pendentes-atrasadas';
const CHAVE_NOTIFICACAO_ATLETAS_SEM_EQUIPE = 'atletas-sem-equipe';
const CHAVE_NOTIFICACAO_EQUIPES_SEM_ATLETAS = 'equipes-sem-atletas';

const HORAS_24 = 24 * 60 * 60 * 1000;
const DIAS_7 = 7 * 24 * 60 * 60 * 1000;
const TAMANHO_LOTE = 5;

const CAMPOS_CADASTRO = {
    nome: 'Nome',
    dataNascimento: 'Data de nascimento',
    sexo: 'Sexo',
    categoria: 'Categoria',
    telefone: 'Telefone',
};

// ============================================================
// FUNÇÕES AUXILIARES
// ============================================================

function possuiTexto(valor) {
    return (
        valor !== null &&
        valor !== undefined &&
        String(valor).trim() !== ''
    );
}

function formatarDataPartida(data) {
    const dataConvertida = new Date(data);

    if (Number.isNaN(dataConvertida.getTime())) {
        return 'Data não informada';
    }

    return dataConvertida.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

// Retorna a data no fuso horário de São Paulo. Formato: YYYY-MM-DD.
function obterDataSaoPaulo(data) {
    const dataConvertida = new Date(data);

    if (Number.isNaN(dataConvertida.getTime())) {
        return null;
    }

    const partes = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'America/Sao_Paulo',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).formatToParts(dataConvertida);

    const valores = {};

    for (const parte of partes) {
        if (parte.type !== 'literal') {
            valores[parte.type] = parte.value;
        }
    }

    return `${valores.year}-${valores.month}-${valores.day}`;
}

function obterNomeAtleta(atleta) {
    if (possuiTexto(atleta.nome)) {
        return String(atleta.nome).trim();
    }

    if (possuiTexto(atleta.usuario?.nome)) {
        return String(atleta.usuario.nome).trim();
    }

    return 'Atleta sem nome';
}

function formatarListaNomes(nomes, quantidade) {
    const nomesExibidos = nomes.slice(0, 3);

    if (nomesExibidos.length === 0) {
        return '';
    }

    const complemento = quantidade > 3
        ? ` e mais ${quantidade - 3}`
        : '';

    return `${nomesExibidos.join('; ')}${complemento}`;
}

// ============================================================
// SINCRONIZAR NOTIFICAÇÃO GERAL
// Uma notificação por treinador e por chave.
// Cria, atualiza, reabre ou resolve conforme a situação atual.
// ============================================================

async function sincronizarNotificacaoGeral(
    prismaClient,
    dadosNotificacao,
    quantidade
) {
    let existente = await prismaClient.notificacao.findUnique({
        where: {
            treinadorId_chave: {
                treinadorId: dadosNotificacao.treinadorId,
                chave: dadosNotificacao.chave,
            },
        },
    });

    if (quantidade === 0) {
        if (existente && !existente.resolvidaEm) {
            await prismaClient.notificacao.update({
                where: { id: existente.id },
                data: { resolvidaEm: new Date() },
            });
        }

        return { quantidade: 0, notificacao: null };
    }

    if (!existente) {
        try {
            const criada = await prismaClient.notificacao.create({
                data: {
                    ...dadosNotificacao,
                    lida: false,
                },
            });

            return { quantidade, notificacao: criada };
        } catch (error) {
            if (error.code !== 'P2002') {
                throw error;
            }

            // Outra requisição pode ter criado a mesma notificação.
            existente = await prismaClient.notificacao.findUnique({
                where: {
                    treinadorId_chave: {
                        treinadorId: dadosNotificacao.treinadorId,
                        chave: dadosNotificacao.chave,
                    },
                },
            });

            if (!existente) {
                throw error;
            }
        }
    }

    if (existente.resolvidaEm) {
        const reaberta = await prismaClient.notificacao.update({
            where: { id: existente.id },
            data: {
                ...dadosNotificacao,
                lida: false,
                resolvidaEm: null,
                createdAt: new Date(),
            },
        });

        return { quantidade, notificacao: reaberta };
    }

    const mensagemMudou =
        existente.titulo !== dadosNotificacao.titulo ||
        existente.descricao !== dadosNotificacao.descricao;

    const atualizada = await prismaClient.notificacao.update({
        where: { id: existente.id },
        data: {
            tipo: dadosNotificacao.tipo,
            titulo: dadosNotificacao.titulo,
            descricao: dadosNotificacao.descricao,
            link: dadosNotificacao.link,
            entidadeTipo: dadosNotificacao.entidadeTipo,
            entidadeId: dadosNotificacao.entidadeId,
            ...(mensagemMudou
                ? {
                    lida: false,
                    createdAt: new Date(),
                }
                : {}),
        },
    });

    return { quantidade, notificacao: atualizada };
}

// ============================================================
// IDENTIFICAR DADOS FALTANTES DO ATLETA
// ============================================================

function obterPendenciasAtleta(atleta) {
    const pendencias = [];

    const nome = possuiTexto(atleta.nome)
        ? String(atleta.nome).trim()
        : possuiTexto(atleta.usuario?.nome)
            ? String(atleta.usuario.nome).trim()
            : '';

    if (!nome) pendencias.push(CAMPOS_CADASTRO.nome);
    if (!atleta.dataNascimento) pendencias.push(CAMPOS_CADASTRO.dataNascimento);

    if (!atleta.sexo || atleta.sexo === 'NAO_INFORMADO') {
        pendencias.push(CAMPOS_CADASTRO.sexo);
    }

    if (!possuiTexto(atleta.categoria)) {
        pendencias.push(CAMPOS_CADASTRO.categoria);
    }

    if (!possuiTexto(atleta.telefone)) {
        pendencias.push(CAMPOS_CADASTRO.telefone);
    }

    return { nome, pendencias };
}

// ============================================================
// NOTIFICAÇÃO GERAL DE CADASTROS INCOMPLETOS
// ============================================================

async function sincronizarNotificacoesCadastroTreinador(
    prismaClient,
    treinadorId
) {
    const atletas = await prismaClient.atleta.findMany({
        where: { treinadorId },
        select: {
            id: true,
            nome: true,
            dataNascimento: true,
            sexo: true,
            categoria: true,
            telefone: true,
            usuario: { select: { nome: true } },
        },
    });

    const atletasIncompletos = atletas.filter((atleta) => {
        return obterPendenciasAtleta(atleta).pendencias.length > 0;
    });

    // Resolve notificações individuais antigas, caso existam.
    await prismaClient.notificacao.updateMany({
        where: {
            treinadorId,
            chave: { startsWith: 'cadastro-atleta-' },
            resolvidaEm: null,
        },
        data: { resolvidaEm: new Date() },
    });

    const quantidade = atletasIncompletos.length;
    const descricao = quantidade === 1
        ? 'Existe 1 atleta com cadastro incompleto. Acesse a lista de atletas para revisar os dados.'
        : `Existem ${quantidade} atletas com cadastro incompleto. Acesse a lista de atletas para revisar os dados.`;

    return sincronizarNotificacaoGeral(
        prismaClient,
        {
            treinadorId,
            tipo: 'cadastros_incompletos',
            titulo: 'Atletas com cadastro incompleto',
            descricao,
            link: '/atletas',
            chave: CHAVE_NOTIFICACAO_CADASTRO,
            entidadeTipo: 'ATLETAS',
            entidadeId: null,
        },
        quantidade
    );
}

// ============================================================
// NOTIFICAÇÃO DE UMA PARTIDA PRÓXIMA
// Uma notificação por partida.
// ============================================================

async function sincronizarNotificacaoPartida(
    prismaClient,
    treinadorId,
    partida
) {
    if (!partida) return null;

    const chave = `partida-proxima-${partida.id}`;

    const existente = await prismaClient.notificacao.findUnique({
        where: {
            treinadorId_chave: { treinadorId, chave },
        },
    });

    const dataPartida = new Date(partida.data);
    const diferenca = dataPartida.getTime() - Date.now();

    const deveNotificar =
        partida.status === 'AGENDADA' &&
        !Number.isNaN(dataPartida.getTime()) &&
        diferenca > 0 &&
        diferenca <= HORAS_24;

    if (!deveNotificar) {
        if (existente && !existente.resolvidaEm) {
            await prismaClient.notificacao.update({
                where: { id: existente.id },
                data: { resolvidaEm: new Date() },
            });
        }
        return null;
    }

    const nomeEquipe = partida.equipe?.nome || 'Sua equipe';
    const adversario = partida.adversario || 'Adversário';
    const titulo = 'Partida se aproximando';
    const descricao = `A partida ${nomeEquipe} x ${adversario} acontecerá em ${formatarDataPartida(partida.data)}. Confira os detalhes e prepare sua equipe.`;

    const dadosNotificacao = {
        treinadorId,
        tipo: 'partida_proxima',
        titulo,
        descricao,
        link: '/partidas',
        chave,
        entidadeTipo: 'PARTIDA',
        entidadeId: partida.id,
    };

    if (!existente) {
        try {
            return await prismaClient.notificacao.create({
                data: { ...dadosNotificacao, lida: false },
            });
        } catch (error) {
            if (error.code !== 'P2002') throw error;

            const criadaPorOutraRequisicao = await prismaClient.notificacao.findUnique({
                where: { treinadorId_chave: { treinadorId, chave } },
            });

            if (!criadaPorOutraRequisicao) throw error;
            return criadaPorOutraRequisicao;
        }
    }

    if (existente.resolvidaEm) {
        return prismaClient.notificacao.update({
            where: { id: existente.id },
            data: {
                ...dadosNotificacao,
                lida: false,
                resolvidaEm: null,
                createdAt: new Date(),
            },
        });
    }

    const mensagemMudou =
        existente.titulo !== titulo ||
        existente.descricao !== descricao;

    return prismaClient.notificacao.update({
        where: { id: existente.id },
        data: {
            titulo,
            descricao,
            link: '/partidas',
            ...(mensagemMudou
                ? { lida: false, createdAt: new Date() }
                : {}),
        },
    });
}

// ============================================================
// SINCRONIZAR NOTIFICAÇÕES DE PARTIDAS PRÓXIMAS
// ============================================================

async function sincronizarNotificacoesPartidasTreinador(
    prismaClient,
    treinadorId
) {
    const partidas = await prismaClient.partida.findMany({
        where: { equipe: { treinadorId } },
        include: {
            equipe: { select: { id: true, nome: true } },
        },
        orderBy: { data: 'asc' },
    });

    for (let inicio = 0; inicio < partidas.length; inicio += TAMANHO_LOTE) {
        const lote = partidas.slice(inicio, inicio + TAMANHO_LOTE);
        await Promise.all(
            lote.map((partida) =>
                sincronizarNotificacaoPartida(prismaClient, treinadorId, partida)
            )
        );
    }

    const idsExistentes = new Set(partidas.map((partida) => partida.id));

    const notificacoesAtivas = await prismaClient.notificacao.findMany({
        where: {
            treinadorId,
            tipo: 'partida_proxima',
            resolvidaEm: null,
        },
        select: { id: true, entidadeId: true },
    });

    const idsParaResolver = notificacoesAtivas
        .filter((notificacao) => {
            return !notificacao.entidadeId || !idsExistentes.has(notificacao.entidadeId);
        })
        .map((notificacao) => notificacao.id);

    if (idsParaResolver.length > 0) {
        await prismaClient.notificacao.updateMany({
            where: {
                id: { in: idsParaResolver },
                treinadorId,
            },
            data: { resolvidaEm: new Date() },
        });
    }

    return partidas.length;
}

// ============================================================
// NOTIFICAÇÃO GERAL DE PARTIDAS SEM ESCALAÇÃO
// Considera partidas AGENDADAS nos próximos 7 dias.
// ============================================================

async function sincronizarNotificacoesEscalacaoTreinador(
    prismaClient,
    treinadorId
) {
    const agora = new Date();
    const limite = new Date(agora.getTime() + DIAS_7);

    const partidasPendentes = await prismaClient.partida.findMany({
        where: {
            equipe: { treinadorId },
            status: 'AGENDADA',
            data: { gte: agora, lte: limite },
            atletas: { none: {} },
        },
        include: {
            equipe: { select: { id: true, nome: true } },
        },
        orderBy: { data: 'asc' },
    });

    const quantidade = partidasPendentes.length;
    const nomesPartidas = partidasPendentes.slice(0, 3).map((partida) => {
        const equipe = partida.equipe?.nome || 'Equipe';
        const adversario = partida.adversario || 'Adversário';
        return `${equipe} x ${adversario}`;
    });

    const detalhes = nomesPartidas.length > 0
        ? ` Partidas: ${formatarListaNomes(nomesPartidas, quantidade)}.`
        : '';

    const descricao = quantidade === 1
        ? `Existe 1 partida agendada nos próximos 7 dias sem atletas selecionados.${detalhes}`
        : `Existem ${quantidade} partidas agendadas nos próximos 7 dias sem atletas selecionados.${detalhes}`;

    return sincronizarNotificacaoGeral(
        prismaClient,
        {
            treinadorId,
            tipo: 'partidas_sem_escalacao',
            titulo: 'Partidas sem escalação definida',
            descricao,
            link: '/partidas',
            chave: CHAVE_NOTIFICACAO_ESCALACAO,
            entidadeTipo: 'PARTIDAS',
            entidadeId: null,
        },
        quantidade
    );
}

// ============================================================
// NOTIFICAÇÃO GERAL DE PARTIDAS SEM LOCAL
// Considera todas as partidas futuras com status AGENDADA.
// ============================================================

async function sincronizarNotificacoesLocalTreinador(
    prismaClient,
    treinadorId
) {
    const agora = new Date();

    const partidasFuturas = await prismaClient.partida.findMany({
        where: {
            equipe: { treinadorId },
            status: 'AGENDADA',
            data: { gt: agora },
        },
        include: {
            equipe: { select: { id: true, nome: true } },
        },
        orderBy: { data: 'asc' },
    });

    const partidasSemLocal = partidasFuturas.filter((partida) => {
        return !possuiTexto(partida.local);
    });

    const quantidade = partidasSemLocal.length;
    const nomesPartidas = partidasSemLocal.slice(0, 3).map((partida) => {
        const equipe = partida.equipe?.nome || 'Equipe';
        const adversario = partida.adversario || 'Adversário';
        const data = formatarDataPartida(partida.data);
        return `${equipe} x ${adversario} (${data})`;
    });

    const detalhes = nomesPartidas.length > 0
        ? ` Partidas: ${formatarListaNomes(nomesPartidas, quantidade)}.`
        : '';

    const descricao = quantidade === 1
        ? `Existe 1 partida futura agendada sem local definido.${detalhes}`
        : `Existem ${quantidade} partidas futuras agendadas sem local definido.${detalhes}`;

    return sincronizarNotificacaoGeral(
        prismaClient,
        {
            treinadorId,
            tipo: 'partidas_sem_local',
            titulo: 'Partidas sem local definido',
            descricao,
            link: '/partidas',
            chave: CHAVE_NOTIFICACAO_LOCAL,
            entidadeTipo: 'PARTIDAS',
            entidadeId: null,
        },
        quantidade
    );
}

// ============================================================
// NOTIFICAÇÃO GERAL DE PARTIDAS ATRASADAS
// Partidas de dias anteriores que continuam AGENDADAS.
// ============================================================

async function sincronizarNotificacoesPartidasAtrasadasTreinador(
    prismaClient,
    treinadorId
) {
    const hoje = obterDataSaoPaulo(new Date());

    const partidasAgendadas = await prismaClient.partida.findMany({
        where: {
            equipe: { treinadorId },
            status: 'AGENDADA',
        },
        include: {
            equipe: { select: { id: true, nome: true } },
        },
        orderBy: { data: 'asc' },
    });

    const partidasAtrasadas = partidasAgendadas.filter((partida) => {
        const dataPartida = obterDataSaoPaulo(partida.data);
        return dataPartida !== null && hoje !== null && dataPartida < hoje;
    });

    const quantidade = partidasAtrasadas.length;
    const nomesPartidas = partidasAtrasadas.slice(0, 3).map((partida) => {
        const equipe = partida.equipe?.nome || 'Equipe';
        const adversario = partida.adversario || 'Adversário';
        const data = formatarDataPartida(partida.data);
        return `${equipe} x ${adversario} (${data})`;
    });

    const detalhes = nomesPartidas.length > 0
        ? ` Partidas: ${formatarListaNomes(nomesPartidas, quantidade)}.`
        : '';

    const descricao = quantidade === 1
        ? `Existe 1 partida com data passada que ainda está pendente. Atualize o resultado e o status do jogo.${detalhes}`
        : `Existem ${quantidade} partidas com data passada que ainda estão pendentes. Atualize os resultados e os status dos jogos.${detalhes}`;

    return sincronizarNotificacaoGeral(
        prismaClient,
        {
            treinadorId,
            tipo: 'partidas_pendentes_atrasadas',
            titulo: 'Partidas aguardando atualização',
            descricao,
            link: '/partidas',
            chave: CHAVE_NOTIFICACAO_ATRASADAS,
            entidadeTipo: 'PARTIDAS',
            entidadeId: null,
        },
        quantidade
    );
}

// ============================================================
// NOVA NOTIFICAÇÃO: ATLETAS SEM EQUIPE
// Considera somente atletas pertencentes ao treinador logado.
// ============================================================

async function sincronizarNotificacoesAtletasSemEquipeTreinador(
    prismaClient,
    treinadorId
) {
    const atletasSemEquipe = await prismaClient.atleta.findMany({
        where: {
            treinadorId,
            equipeId: null,
        },
        select: {
            id: true,
            nome: true,
            usuario: {
                select: { nome: true },
            },
        },
        orderBy: { nome: 'asc' },
    });

    const quantidade = atletasSemEquipe.length;
    const nomes = atletasSemEquipe
        .slice(0, 3)
        .map(obterNomeAtleta);

    const detalhes = formatarListaNomes(nomes, quantidade);

    const descricao = quantidade === 1
        ? `Existe 1 atleta sem equipe vinculada: ${detalhes}. Acesse os atletas para organizar o vínculo com uma equipe.`
        : `Existem ${quantidade} atletas sem equipe vinculada: ${detalhes}. Acesse os atletas para organizar os vínculos com as equipes.`;

    return sincronizarNotificacaoGeral(
        prismaClient,
        {
            treinadorId,
            tipo: 'atletas_sem_equipe',
            titulo: 'Atletas sem equipe',
            descricao,
            link: '/atletas',
            chave: CHAVE_NOTIFICACAO_ATLETAS_SEM_EQUIPE,
            entidadeTipo: 'ATLETAS',
            entidadeId: null,
        },
        quantidade
    );
}

// ============================================================
// NOVA NOTIFICAÇÃO: EQUIPES SEM ATLETAS
// Considera somente equipes pertencentes ao treinador logado.
// ============================================================

async function sincronizarNotificacoesEquipesSemAtletasTreinador(
    prismaClient,
    treinadorId
) {
    const equipesSemAtletas = await prismaClient.equipe.findMany({
        where: {
            treinadorId,
            atletas: { none: {} },
        },
        select: {
            id: true,
            nome: true,
        },
        orderBy: { nome: 'asc' },
    });

    const quantidade = equipesSemAtletas.length;
    const nomes = equipesSemAtletas
        .slice(0, 3)
        .map((equipe) => possuiTexto(equipe.nome)
            ? String(equipe.nome).trim()
            : `Equipe ${equipe.id}`
        );

    const detalhes = formatarListaNomes(nomes, quantidade);

    const descricao = quantidade === 1
        ? `Existe 1 equipe sem atletas vinculados: ${detalhes}. Acesse as equipes para adicionar atletas ao elenco.`
        : `Existem ${quantidade} equipes sem atletas vinculados: ${detalhes}. Acesse as equipes para organizar os elencos.`;

    return sincronizarNotificacaoGeral(
        prismaClient,
        {
            treinadorId,
            tipo: 'equipes_sem_atletas',
            titulo: 'Equipes sem atletas',
            descricao,
            link: '/equipes',
            chave: CHAVE_NOTIFICACAO_EQUIPES_SEM_ATLETAS,
            entidadeTipo: 'EQUIPES',
            entidadeId: null,
        },
        quantidade
    );
}

// ============================================================
// RESOLVER NOTIFICAÇÃO DE UMA PARTIDA
// ============================================================

async function resolverNotificacaoPartida(
    prismaClient,
    treinadorId,
    partidaId
) {
    return prismaClient.notificacao.updateMany({
        where: {
            treinadorId,
            chave: `partida-proxima-${partidaId}`,
            resolvidaEm: null,
        },
        data: { resolvidaEm: new Date() },
    });
}

// ============================================================
// NOTIFICAÇÃO DE CADASTRO DE ATLETA
// Chamada pelo atletaController ao criar/atualizar um atleta.
// A notificação de cadastros incompletos é agregada por treinador,
// então basta recalcular o resumo do treinador.
// (Esta função era importada pelo controller mas não existia.)
// ============================================================

async function sincronizarNotificacaoCadastroAtleta(
    prismaClient,
    treinadorId,
    _atleta
) {
    return sincronizarNotificacoesCadastroTreinador(
        prismaClient,
        treinadorId
    );
}

// ============================================================
// EXPORTAÇÕES
// ============================================================

module.exports = {
    obterPendenciasAtleta,
    sincronizarNotificacaoGeral,
    sincronizarNotificacoesCadastroTreinador,
    sincronizarNotificacaoCadastroAtleta,
    sincronizarNotificacaoPartida,
    sincronizarNotificacoesPartidasTreinador,
    sincronizarNotificacoesEscalacaoTreinador,
    sincronizarNotificacoesLocalTreinador,
    sincronizarNotificacoesPartidasAtrasadasTreinador,
    sincronizarNotificacoesAtletasSemEquipeTreinador,
    sincronizarNotificacoesEquipesSemAtletasTreinador,
    resolverNotificacaoPartida,
};
