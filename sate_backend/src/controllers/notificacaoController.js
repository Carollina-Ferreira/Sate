const prisma = require('../lib/prisma');

const {
    sincronizarNotificacoesCadastroTreinador,
    sincronizarNotificacoesPartidasTreinador,
    sincronizarNotificacoesEscalacaoTreinador,
    sincronizarNotificacoesLocalTreinador,
    sincronizarNotificacoesPartidasAtrasadasTreinador,
    sincronizarNotificacoesAtletasSemEquipeTreinador,
    sincronizarNotificacoesEquipesSemAtletasTreinador,
} = require('../services/notificacaoService');

// ============================================================
// OBTER TREINADOR AUTENTICADO
// ============================================================

async function obterTreinadorLogado(req) {
    const usuarioId = req.usuario?.id;

    if (!usuarioId) {
        return null;
    }

    return prisma.treinador.findUnique({
        where: {
            usuarioId: Number(usuarioId),
        },
    });
}

// ============================================================
// FORMATAR NOTIFICAÇÃO PARA O FRONTEND
// ============================================================

function formatarNotificacao(notificacao) {
    return {
        id: notificacao.id,
        type: notificacao.tipo,
        title: notificacao.titulo,
        description: notificacao.descricao,
        link: notificacao.link,
        time: notificacao.createdAt,
        read: notificacao.lida,
        createdAt: notificacao.createdAt,
        updatedAt: notificacao.updatedAt,
        entidadeTipo: notificacao.entidadeTipo,
        entidadeId: notificacao.entidadeId,
    };
}

// ============================================================
// LISTAR NOTIFICAÇÕES
// GET /api/notificacoes
// ============================================================

async function listarNotificacoes(req, res) {
    try {
        const treinador = await obterTreinadorLogado(req);

        if (!treinador) {
            return res.status(401).json({
                mensagem: 'Treinador não identificado.',
            });
        }

        // 1. Cadastros incompletos.
        await sincronizarNotificacoesCadastroTreinador(
            prisma,
            treinador.id
        );

        // 2. Partidas próximas.
        await sincronizarNotificacoesPartidasTreinador(
            prisma,
            treinador.id
        );

        // 3. Partidas sem escalação.
        await sincronizarNotificacoesEscalacaoTreinador(
            prisma,
            treinador.id
        );

        // 4. Partidas sem local.
        await sincronizarNotificacoesLocalTreinador(
            prisma,
            treinador.id
        );

        // 5. Partidas com data passada ainda pendentes.
        await sincronizarNotificacoesPartidasAtrasadasTreinador(
            prisma,
            treinador.id
        );

        // 6. Atletas sem equipe.
        await sincronizarNotificacoesAtletasSemEquipeTreinador(
            prisma,
            treinador.id
        );

        // 7. Equipes sem atletas.
        await sincronizarNotificacoesEquipesSemAtletasTreinador(
            prisma,
            treinador.id
        );

        // Busca somente notificações não resolvidas.
        const where = {
            treinadorId: treinador.id,
            resolvidaEm: null,
        };

        const [notificacoes, naoLidas, total] = await Promise.all([
            prisma.notificacao.findMany({
                where,
                orderBy: [
                    { createdAt: 'desc' },
                    { id: 'desc' },
                ],
                take: 50,
            }),

            prisma.notificacao.count({
                where: {
                    ...where,
                    lida: false,
                },
            }),

            prisma.notificacao.count({ where }),
        ]);

        return res.status(200).json({
            notificacoes: notificacoes.map(formatarNotificacao),
            naoLidas,
            total,
        });
    } catch (error) {
        console.error('ERRO AO LISTAR NOTIFICAÇÕES:', error);

        return res.status(500).json({
            mensagem: 'Erro ao listar notificações.',
            erro: error.message,
        });
    }
}

// ============================================================
// MARCAR UMA NOTIFICAÇÃO COMO LIDA
// PATCH /api/notificacoes/:id/lida
// ============================================================

async function marcarNotificacaoComoLida(req, res) {
    try {
        const treinador = await obterTreinadorLogado(req);

        if (!treinador) {
            return res.status(401).json({
                mensagem: 'Treinador não identificado.',
            });
        }

        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                mensagem: 'ID da notificação inválido.',
            });
        }

        const notificacao = await prisma.notificacao.findFirst({
            where: {
                id,
                treinadorId: treinador.id,
                resolvidaEm: null,
            },
        });

        if (!notificacao) {
            return res.status(404).json({
                mensagem: 'Notificação não encontrada.',
            });
        }

        const atualizada = await prisma.notificacao.update({
            where: { id: notificacao.id },
            data: { lida: true },
        });

        return res.status(200).json({
            mensagem: 'Notificação marcada como lida.',
            notificacao: formatarNotificacao(atualizada),
        });
    } catch (error) {
        console.error(
            'ERRO AO MARCAR NOTIFICAÇÃO COMO LIDA:',
            error
        );

        return res.status(500).json({
            mensagem: 'Erro ao atualizar notificação.',
            erro: error.message,
        });
    }
}

// ============================================================
// MARCAR TODAS AS NOTIFICAÇÕES COMO LIDAS
// PATCH /api/notificacoes/lidas
// ============================================================

async function marcarTodasComoLidas(req, res) {
    try {
        const treinador = await obterTreinadorLogado(req);

        if (!treinador) {
            return res.status(401).json({
                mensagem: 'Treinador não identificado.',
            });
        }

        const resultado = await prisma.notificacao.updateMany({
            where: {
                treinadorId: treinador.id,
                resolvidaEm: null,
                lida: false,
            },
            data: { lida: true },
        });

        return res.status(200).json({
            mensagem: 'Notificações marcadas como lidas.',
            quantidade: resultado.count,
        });
    } catch (error) {
        console.error(
            'ERRO AO MARCAR TODAS AS NOTIFICAÇÕES COMO LIDAS:',
            error
        );

        return res.status(500).json({
            mensagem: 'Erro ao atualizar notificações.',
            erro: error.message,
        });
    }
}

// ============================================================
// EXPORTAÇÕES
// ============================================================

module.exports = {
    listarNotificacoes,
    marcarNotificacaoComoLida,
    marcarTodasComoLidas,
};
