const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

/**
 * Busca o treinador logado
 */
async function buscarTreinador(req) {
    if (!req.usuario || !req.usuario.id) {
        throw new Error('Usuário não autenticado.');
    }

    const treinador = await prisma.treinador.findUnique({
        where: {
            usuarioId: Number(req.usuario.id)
        }
    });

    if (!treinador) {
        throw new Error('Treinador não encontrado.');
    }

    return treinador;
}

/**
 * GET
 * /api/configuracao-analise
 *
 * Retorna todas as configurações de análise
 * do treinador logado.
 */
async function listarConfiguracoesAnalise(req, res) {
    try {
        const treinador = await buscarTreinador(req);

        const configuracoes = await prisma.configuracaoAnalise.findMany({
            where: {
                treinadorId: treinador.id
            },
            orderBy: [
                {
                    ordem: 'asc'
                },
                {
                    id: 'asc'
                }
            ]
        });

        return res.status(200).json({
            configuracoes
        });
    } catch (erro) {
        console.error(
            'ERRO AO LISTAR CONFIGURAÇÕES DE ANÁLISE:',
            erro
        );

        if (
            erro.message === 'Usuário não autenticado.' ||
            erro.message === 'Treinador não encontrado.'
        ) {
            return res.status(401).json({
                mensagem: erro.message
            });
        }

        return res.status(500).json({
            mensagem: 'Erro ao buscar configurações de análise.',
            erro: erro.message
        });
    }
}

/**
 * POST
 * /api/configuracao-analise
 *
 * Cria uma nova configuração de análise.
 */
async function criarConfiguracaoAnalise(req, res) {
    try {
        const treinador = await buscarTreinador(req);

        const {
            nome,
            descricao,
            tipo,
            ordem
        } = req.body;

        if (!nome || !nome.trim()) {
            return res.status(400).json({
                mensagem: 'O nome do evento é obrigatório.'
            });
        }

        const tiposPermitidos = [
            'POSITIVA',
            'NEGATIVA',
            'NEUTRA'
        ];

        const tipoFinal = tipo || 'POSITIVA';

        if (!tiposPermitidos.includes(tipoFinal)) {
            return res.status(400).json({
                mensagem: 'Tipo de evento inválido.',
                tiposPermitidos
            });
        }

        let ordemFinal = 0;

        if (
            ordem !== undefined &&
            ordem !== null &&
            ordem !== ''
        ) {
            ordemFinal = Number(ordem);

            if (Number.isNaN(ordemFinal)) {
                ordemFinal = 0;
            }
        } else {
            const ultimaConfiguracao =
                await prisma.configuracaoAnalise.findFirst({
                    where: {
                        treinadorId: treinador.id
                    },
                    orderBy: {
                        ordem: 'desc'
                    }
                });

            ordemFinal = ultimaConfiguracao
                ? ultimaConfiguracao.ordem + 1
                : 0;
        }

        const configuracao =
            await prisma.configuracaoAnalise.create({
                data: {
                    nome: nome.trim(),
                    descricao:
                        descricao && descricao.trim()
                            ? descricao.trim()
                            : null,
                    tipo: tipoFinal,
                    ordem: ordemFinal,
                    treinadorId: treinador.id
                }
            });

        return res.status(201).json({
            mensagem: 'Configuração de análise criada com sucesso.',
            configuracao
        });
    } catch (erro) {
        console.error(
            'ERRO AO CRIAR CONFIGURAÇÃO DE ANÁLISE:',
            erro
        );

        if (
            erro.message === 'Usuário não autenticado.' ||
            erro.message === 'Treinador não encontrado.'
        ) {
            return res.status(401).json({
                mensagem: erro.message
            });
        }

        return res.status(500).json({
            mensagem: 'Erro ao criar configuração de análise.',
            erro: erro.message
        });
    }
}

/**
 * PUT
 * /api/configuracao-analise/:id
 *
 * Atualiza uma configuração pertencente
 * ao treinador logado.
 */
async function atualizarConfiguracaoAnalise(req, res) {
    try {
        const treinador = await buscarTreinador(req);

        const id = Number(req.params.id);

        if (Number.isNaN(id)) {
            return res.status(400).json({
                mensagem: 'ID da configuração inválido.'
            });
        }

        const {
            nome,
            descricao,
            tipo,
            ordem
        } = req.body;

        const configuracaoExistente =
            await prisma.configuracaoAnalise.findFirst({
                where: {
                    id,
                    treinadorId: treinador.id
                }
            });

        if (!configuracaoExistente) {
            return res.status(404).json({
                mensagem:
                    'Configuração de análise não encontrada.'
            });
        }

        const tiposPermitidos = [
            'POSITIVA',
            'NEGATIVA',
            'NEUTRA'
        ];

        if (
            tipo !== undefined &&
            !tiposPermitidos.includes(tipo)
        ) {
            return res.status(400).json({
                mensagem: 'Tipo de evento inválido.',
                tiposPermitidos
            });
        }

        const dadosAtualizacao = {};

        if (nome !== undefined) {
            if (!nome || !nome.trim()) {
                return res.status(400).json({
                    mensagem: 'O nome do evento não pode ficar vazio.'
                });
            }

            dadosAtualizacao.nome = nome.trim();
        }

        if (descricao !== undefined) {
            dadosAtualizacao.descricao =
                descricao && descricao.trim()
                    ? descricao.trim()
                    : null;
        }

        if (tipo !== undefined) {
            dadosAtualizacao.tipo = tipo;
        }

        if (ordem !== undefined) {
            const ordemNumerica = Number(ordem);

            if (Number.isNaN(ordemNumerica)) {
                return res.status(400).json({
                    mensagem: 'A ordem informada é inválida.'
                });
            }

            dadosAtualizacao.ordem = ordemNumerica;
        }

        const configuracaoAtualizada =
            await prisma.configuracaoAnalise.update({
                where: {
                    id
                },
                data: dadosAtualizacao
            });

        return res.status(200).json({
            mensagem:
                'Configuração de análise atualizada com sucesso.',
            configuracao: configuracaoAtualizada
        });
    } catch (erro) {
        console.error(
            'ERRO AO ATUALIZAR CONFIGURAÇÃO DE ANÁLISE:',
            erro
        );

        if (
            erro.message === 'Usuário não autenticado.' ||
            erro.message === 'Treinador não encontrado.'
        ) {
            return res.status(401).json({
                mensagem: erro.message
            });
        }

        return res.status(500).json({
            mensagem:
                'Erro ao atualizar configuração de análise.',
            erro: erro.message
        });
    }
}

/**
 * DELETE
 * /api/configuracao-analise/:id
 *
 * Exclui uma configuração pertencente
 * ao treinador logado.
 */
async function excluirConfiguracaoAnalise(req, res) {
    try {
        const treinador = await buscarTreinador(req);

        const id = Number(req.params.id);

        if (Number.isNaN(id)) {
            return res.status(400).json({
                mensagem: 'ID da configuração inválido.'
            });
        }

        const configuracao =
            await prisma.configuracaoAnalise.findFirst({
                where: {
                    id,
                    treinadorId: treinador.id
                }
            });

        if (!configuracao) {
            return res.status(404).json({
                mensagem:
                    'Configuração de análise não encontrada.'
            });
        }

        await prisma.configuracaoAnalise.delete({
            where: {
                id
            }
        });

        return res.status(200).json({
            mensagem:
                'Configuração de análise excluída com sucesso.'
        });
    } catch (erro) {
        console.error(
            'ERRO AO EXCLUIR CONFIGURAÇÃO DE ANÁLISE:',
            erro
        );

        if (
            erro.message === 'Usuário não autenticado.' ||
            erro.message === 'Treinador não encontrado.'
        ) {
            return res.status(401).json({
                mensagem: erro.message
            });
        }

        return res.status(500).json({
            mensagem:
                'Erro ao excluir configuração de análise.',
            erro: erro.message
        });
    }
}

/**
 * PUT
 * /api/configuracao-analise/ordem
 *
 * Atualiza a ordem de vários eventos de uma vez.
 *
 * Body:
 * {
 *   "configuracoes": [
 *     {
 *       "id": 1,
 *       "ordem": 0
 *     },
 *     {
 *       "id": 2,
 *       "ordem": 1
 *     }
 *   ]
 * }
 */
async function atualizarOrdemConfiguracoes(req, res) {
    try {
        const treinador = await buscarTreinador(req);

        const { configuracoes } = req.body;

        if (!Array.isArray(configuracoes)) {
            return res.status(400).json({
                mensagem:
                    'Envie uma lista de configurações para atualizar a ordem.'
            });
        }

        for (const item of configuracoes) {
            const id = Number(item.id);
            const ordem = Number(item.ordem);

            if (
                Number.isNaN(id) ||
                Number.isNaN(ordem)
            ) {
                return res.status(400).json({
                    mensagem:
                        'ID ou ordem inválidos.'
                });
            }

            const configuracao =
                await prisma.configuracaoAnalise.findFirst({
                    where: {
                        id,
                        treinadorId: treinador.id
                    }
                });

            if (!configuracao) {
                return res.status(404).json({
                    mensagem:
                        `Configuração ${id} não encontrada.`
                });
            }
        }

        await prisma.$transaction(
            configuracoes.map((item) =>
                prisma.configuracaoAnalise.update({
                    where: {
                        id: Number(item.id)
                    },
                    data: {
                        ordem: Number(item.ordem)
                    }
                })
            )
        );

        const configuracoesAtualizadas =
            await prisma.configuracaoAnalise.findMany({
                where: {
                    treinadorId: treinador.id
                },
                orderBy: [
                    {
                        ordem: 'asc'
                    },
                    {
                        id: 'asc'
                    }
                ]
            });

        return res.status(200).json({
            mensagem:
                'Ordem das configurações atualizada com sucesso.',
            configuracoes: configuracoesAtualizadas
        });
    } catch (erro) {
        console.error(
            'ERRO AO ATUALIZAR ORDEM DAS CONFIGURAÇÕES:',
            erro
        );

        if (
            erro.message === 'Usuário não autenticado.' ||
            erro.message === 'Treinador não encontrado.'
        ) {
            return res.status(401).json({
                mensagem: erro.message
            });
        }

        return res.status(500).json({
            mensagem:
                'Erro ao atualizar ordem das configurações.',
            erro: erro.message
        });
    }
}

module.exports = {
    listarConfiguracoesAnalise,
    criarConfiguracaoAnalise,
    atualizarConfiguracaoAnalise,
    excluirConfiguracaoAnalise,
    atualizarOrdemConfiguracoes
};