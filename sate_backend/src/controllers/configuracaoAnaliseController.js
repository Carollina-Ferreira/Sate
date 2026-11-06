const prisma = require('../lib/prisma');

const TIPOS_PERMITIDOS = ['POSITIVA', 'NEGATIVA', 'NEUTRA', 'DESTAQUE'];
const ICONE_PADRAO = 'alvo';
const COR_PADRAO = '#087b5b';

// ============================================================
// TREINADOR LOGADO
// ============================================================

async function buscarTreinador(req) {
    const usuarioId = Number(req.usuario?.id);
    if (!Number.isSafeInteger(usuarioId) || usuarioId <= 0) {
        const erro = new Error('Usuário não autenticado.');
        erro.status = 401;
        throw erro;
    }

    const treinador = await prisma.treinador.findUnique({
        where: { usuarioId }
    });

    if (!treinador) {
        const erro = new Error('Treinador não encontrado.');
        erro.status = 401;
        throw erro;
    }

    return treinador;
}

function converterEquipeId(valor) {
    if (valor === undefined) return { valido: true, equipeId: undefined };
    if (valor === null || valor === '') return { valido: true, equipeId: null };

    const equipeId = Number(valor);
    if (!Number.isSafeInteger(equipeId) || equipeId <= 0) {
        return { valido: false, equipeId: null };
    }

    return { valido: true, equipeId };
}

async function validarEquipe(equipeId, treinadorId) {
    if (equipeId === null || equipeId === undefined) return true;

    const equipe = await prisma.equipe.findFirst({
        where: { id: equipeId, treinadorId },
        select: { id: true }
    });

    return Boolean(equipe);
}

async function verificarNomeDuplicado(nome, treinadorId, equipeId, ignorarId = null) {
    const configuracoes = await prisma.configuracaoAnalise.findMany({
        where: { treinadorId, equipeId },
        select: { id: true, nome: true }
    });

    return configuracoes.some(item =>
        item.id !== ignorarId &&
        item.nome.trim().toLocaleLowerCase('pt-BR') === nome.trim().toLocaleLowerCase('pt-BR')
    );
}

function erroResposta(res, erro, mensagemPadrao) {
    const status = erro.status || 500;
    return res.status(status).json({
        mensagem: erro.status ? erro.message : mensagemPadrao,
        ...(erro.status ? {} : { erro: erro.message })
    });
}

// ============================================================
// LISTAR CONFIGURAÇÕES
// GET /api/configuracao-analise?equipeId=1
// Retorna categorias da equipe e categorias gerais do treinador.
// ============================================================

async function listarConfiguracoesAnalise(req, res) {
    try {
        const treinador = await buscarTreinador(req);
        const equipeInformada = converterEquipeId(req.query.equipeId);

        if (!equipeInformada.valido) {
            return res.status(400).json({ mensagem: 'ID da equipe inválido.' });
        }

        const equipeId = equipeInformada.equipeId;
        if (equipeId !== undefined && equipeId !== null) {
            const equipeValida = await validarEquipe(equipeId, treinador.id);
            if (!equipeValida) {
                return res.status(404).json({ mensagem: 'Equipe não encontrada ou não pertence ao treinador.' });
            }
        }

        const where = { treinadorId: treinador.id };

        if (equipeId !== undefined && equipeId !== null) {
            where.OR = [{ equipeId }, { equipeId: null }];
        } else if (equipeId === null) {
            where.equipeId = null;
        }

        const configuracoes = await prisma.configuracaoAnalise.findMany({
            where,
            orderBy: [{ ordem: 'asc' }, { id: 'asc' }]
        });

        return res.status(200).json({ configuracoes });
    } catch (erro) {
        console.error('ERRO AO LISTAR CONFIGURAÇÕES DE ANÁLISE:', erro);
        return erroResposta(res, erro, 'Erro ao buscar configurações de análise.');
    }
}

// ============================================================
// CRIAR CONFIGURAÇÃO
// POST /api/configuracao-analise
// ============================================================

async function criarConfiguracaoAnalise(req, res) {
    try {
        const treinador = await buscarTreinador(req);
        const { nome, descricao, tipo, ordem, icone, cor, mostrarNaTimeline } = req.body;

        if (typeof nome !== 'string' || !nome.trim()) {
            return res.status(400).json({ mensagem: 'O nome da categoria é obrigatório.' });
        }

        const nomeFinal = nome.trim();
        const tipoFinal = tipo || 'POSITIVA';
        if (!TIPOS_PERMITIDOS.includes(tipoFinal)) {
            return res.status(400).json({ mensagem: 'Tipo de categoria inválido.', tiposPermitidos: TIPOS_PERMITIDOS });
        }

        if (mostrarNaTimeline !== undefined && typeof mostrarNaTimeline !== 'boolean') {
            return res.status(400).json({ mensagem: 'mostrarNaTimeline deve ser verdadeiro ou falso.' });
        }

        const equipeInformada = converterEquipeId(req.body.equipeId);
        if (!equipeInformada.valido) {
            return res.status(400).json({ mensagem: 'ID da equipe inválido.' });
        }
        const equipeId = equipeInformada.equipeId ?? null;

        const equipeValida = await validarEquipe(equipeId, treinador.id);
        if (!equipeValida) {
            return res.status(404).json({ mensagem: 'Equipe não encontrada ou não pertence ao treinador.' });
        }

        const duplicado = await verificarNomeDuplicado(nomeFinal, treinador.id, equipeId);
        if (duplicado) {
            return res.status(409).json({ mensagem: 'Já existe uma categoria com esse nome nesta equipe.' });
        }

        let ordemFinal;
        if (ordem !== undefined && ordem !== null && ordem !== '') {
            ordemFinal = Number(ordem);
            if (!Number.isInteger(ordemFinal)) {
                return res.status(400).json({ mensagem: 'A ordem informada é inválida.' });
            }
        } else {
            const ultima = await prisma.configuracaoAnalise.findFirst({
                where: { treinadorId: treinador.id, equipeId },
                orderBy: { ordem: 'desc' }
            });
            ordemFinal = ultima ? ultima.ordem + 1 : 0;
        }

        const configuracao = await prisma.configuracaoAnalise.create({
            data: {
                nome: nomeFinal,
                descricao: typeof descricao === 'string' && descricao.trim() ? descricao.trim() : null,
                tipo: tipoFinal,
                ordem: ordemFinal,
                treinadorId: treinador.id,
                equipeId,
                icone: typeof icone === 'string' && icone.trim() ? icone.trim() : ICONE_PADRAO,
                cor: typeof cor === 'string' && cor.trim() ? cor.trim() : COR_PADRAO,
                mostrarNaTimeline: mostrarNaTimeline ?? true
            }
        });

        return res.status(201).json({ mensagem: 'Categoria criada com sucesso.', configuracao });
    } catch (erro) {
        console.error('ERRO AO CRIAR CONFIGURAÇÃO DE ANÁLISE:', erro);
        return erroResposta(res, erro, 'Erro ao criar configuração de análise.');
    }
}

// ============================================================
// ATUALIZAR CONFIGURAÇÃO
// PUT /api/configuracao-analise/:id
// ============================================================

async function atualizarConfiguracaoAnalise(req, res) {
    try {
        const treinador = await buscarTreinador(req);
        const id = Number(req.params.id);
        if (!Number.isSafeInteger(id) || id <= 0) {
            return res.status(400).json({ mensagem: 'ID da configuração inválido.' });
        }

        const existente = await prisma.configuracaoAnalise.findFirst({
            where: { id, treinadorId: treinador.id }
        });
        if (!existente) return res.status(404).json({ mensagem: 'Categoria não encontrada.' });

        const { nome, descricao, tipo, ordem, icone, cor, mostrarNaTimeline } = req.body;
        const dados = {};

        if (nome !== undefined) {
            if (typeof nome !== 'string' || !nome.trim()) {
                return res.status(400).json({ mensagem: 'O nome da categoria não pode ficar vazio.' });
            }
            dados.nome = nome.trim();
        }
        if (descricao !== undefined) {
            dados.descricao = typeof descricao === 'string' && descricao.trim() ? descricao.trim() : null;
        }
        if (tipo !== undefined) {
            if (!TIPOS_PERMITIDOS.includes(tipo)) {
                return res.status(400).json({ mensagem: 'Tipo de categoria inválido.', tiposPermitidos: TIPOS_PERMITIDOS });
            }
            dados.tipo = tipo;
        }
        if (ordem !== undefined) {
            const ordemFinal = Number(ordem);
            if (!Number.isInteger(ordemFinal)) return res.status(400).json({ mensagem: 'A ordem informada é inválida.' });
            dados.ordem = ordemFinal;
        }
        if (icone !== undefined) dados.icone = typeof icone === 'string' && icone.trim() ? icone.trim() : ICONE_PADRAO;
        if (cor !== undefined) dados.cor = typeof cor === 'string' && cor.trim() ? cor.trim() : COR_PADRAO;
        if (mostrarNaTimeline !== undefined) {
            if (typeof mostrarNaTimeline !== 'boolean') {
                return res.status(400).json({ mensagem: 'mostrarNaTimeline deve ser verdadeiro ou falso.' });
            }
            dados.mostrarNaTimeline = mostrarNaTimeline;
        }

        let equipeIdFinal = existente.equipeId;
        if (req.body.equipeId !== undefined) {
            const equipeInformada = converterEquipeId(req.body.equipeId);
            if (!equipeInformada.valido) return res.status(400).json({ mensagem: 'ID da equipe inválido.' });
            equipeIdFinal = equipeInformada.equipeId ?? null;
            const equipeValida = await validarEquipe(equipeIdFinal, treinador.id);
            if (!equipeValida) return res.status(404).json({ mensagem: 'Equipe não encontrada ou não pertence ao treinador.' });
            dados.equipeId = equipeIdFinal;
        }

        const nomeFinal = dados.nome ?? existente.nome;
        const duplicado = await verificarNomeDuplicado(nomeFinal, treinador.id, equipeIdFinal, id);
        if (duplicado) return res.status(409).json({ mensagem: 'Já existe uma categoria com esse nome nesta equipe.' });

        const configuracao = await prisma.configuracaoAnalise.update({
            where: { id },
            data: dados
        });

        return res.status(200).json({ mensagem: 'Categoria atualizada com sucesso.', configuracao });
    } catch (erro) {
        console.error('ERRO AO ATUALIZAR CONFIGURAÇÃO DE ANÁLISE:', erro);
        return erroResposta(res, erro, 'Erro ao atualizar configuração de análise.');
    }
}

// ============================================================
// EXCLUIR CONFIGURAÇÃO
// DELETE /api/configuracao-analise/:id
// ============================================================

async function excluirConfiguracaoAnalise(req, res) {
    try {
        const treinador = await buscarTreinador(req);
        const id = Number(req.params.id);
        if (!Number.isSafeInteger(id) || id <= 0) {
            return res.status(400).json({ mensagem: 'ID da configuração inválido.' });
        }

        const configuracao = await prisma.configuracaoAnalise.findFirst({
            where: { id, treinadorId: treinador.id },
            select: { id: true }
        });
        if (!configuracao) return res.status(404).json({ mensagem: 'Categoria não encontrada.' });

        await prisma.configuracaoAnalise.delete({ where: { id } });
        return res.status(200).json({ mensagem: 'Categoria excluída com sucesso.' });
    } catch (erro) {
        console.error('ERRO AO EXCLUIR CONFIGURAÇÃO DE ANÁLISE:', erro);
        return erroResposta(res, erro, 'Erro ao excluir configuração de análise.');
    }
}

// ============================================================
// ATUALIZAR ORDEM
// PUT /api/configuracao-analise/ordem
// ============================================================

async function atualizarOrdemConfiguracoes(req, res) {
    try {
        const treinador = await buscarTreinador(req);
        const { configuracoes } = req.body;
        if (!Array.isArray(configuracoes)) {
            return res.status(400).json({ mensagem: 'Envie uma lista de configurações para atualizar a ordem.' });
        }

        const itens = configuracoes.map(item => ({ id: Number(item.id), ordem: Number(item.ordem) }));
        if (itens.some(item => !Number.isSafeInteger(item.id) || item.id <= 0 || !Number.isInteger(item.ordem))) {
            return res.status(400).json({ mensagem: 'Um ou mais IDs ou posições são inválidos.' });
        }

        const ids = [...new Set(itens.map(item => item.id))];
        if (ids.length !== itens.length) {
            return res.status(400).json({ mensagem: 'A lista possui configurações repetidas.' });
        }

        const existentes = await prisma.configuracaoAnalise.findMany({
            where: { id: { in: ids }, treinadorId: treinador.id },
            select: { id: true }
        });
        if (existentes.length !== ids.length) {
            return res.status(404).json({ mensagem: 'Uma ou mais configurações não foram encontradas.' });
        }

        await prisma.$transaction(itens.map(item => prisma.configuracaoAnalise.update({
            where: { id: item.id },
            data: { ordem: item.ordem }
        })));

        const configuracoesAtualizadas = await prisma.configuracaoAnalise.findMany({
            where: { treinadorId: treinador.id },
            orderBy: [{ ordem: 'asc' }, { id: 'asc' }]
        });

        return res.status(200).json({ mensagem: 'Ordem das configurações atualizada com sucesso.', configuracoes: configuracoesAtualizadas });
    } catch (erro) {
        console.error('ERRO AO ATUALIZAR ORDEM DAS CONFIGURAÇÕES:', erro);
        return erroResposta(res, erro, 'Erro ao atualizar a ordem das configurações.');
    }
}

module.exports = {
    listarConfiguracoesAnalise,
    criarConfiguracaoAnalise,
    atualizarConfiguracaoAnalise,
    excluirConfiguracaoAnalise,
    atualizarOrdemConfiguracoes
};
