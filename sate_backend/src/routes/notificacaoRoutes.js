
const express = require('express');

const autenticar = require('../middleware/authMiddleware');
const { comContexto } = require('../lib/acesso');
const atleta = require('../controllers/notificacaoAtletaController');

const {
    listarNotificacoes,
    marcarNotificacaoComoLida,
    marcarTodasComoLidas,
} = require('../controllers/notificacaoController');

const router = express.Router();

// Todas as rotas exigem autenticação.
router.use(autenticar);

// Atletas (aplicativo mobile) usam as mesmas URLs, mas leem a tabela
// NotificacaoAtleta. Para treinadores, o fluxo original continua igual.
const carregarContexto = comContexto();
const daqui = (handlerAtleta) => (req, res, next) =>
    req.ctx.tipo === 'ATLETA' ? handlerAtleta(req, res, next) : next();

// ============================================================
// LISTAR NOTIFICAÇÕES
// GET /api/notificacoes
// ============================================================

router.get(
    '/',
    carregarContexto,
    daqui(atleta.listar),
    listarNotificacoes
);

// ============================================================
// MARCAR TODAS COMO LIDAS
// PATCH /api/notificacoes/lidas
// ============================================================

router.patch(
    '/lidas',
    carregarContexto,
    daqui(atleta.marcarTodasLidas),
    marcarTodasComoLidas
);

// ============================================================
// MARCAR UMA NOTIFICAÇÃO COMO LIDA
// PATCH /api/notificacoes/:id/lida
// ============================================================

router.patch(
    '/:id/lida',
    carregarContexto,
    daqui(atleta.marcarLida),
    marcarNotificacaoComoLida
);

module.exports = router;
