
const express = require('express');

const autenticar = require('../middleware/authMiddleware');

const {
    listarNotificacoes,
    marcarNotificacaoComoLida,
    marcarTodasComoLidas,
} = require('../controllers/notificacaoController');

const router = express.Router();

// Todas as rotas exigem autenticação.
router.use(autenticar);

// ============================================================
// LISTAR NOTIFICAÇÕES
// GET /api/notificacoes
// ============================================================

router.get(
    '/',
    listarNotificacoes
);

// ============================================================
// MARCAR TODAS COMO LIDAS
// PATCH /api/notificacoes/lidas
// ============================================================

router.patch(
    '/lidas',
    marcarTodasComoLidas
);

// ============================================================
// MARCAR UMA NOTIFICAÇÃO COMO LIDA
// PATCH /api/notificacoes/:id/lida
// ============================================================

router.patch(
    '/:id/lida',
    marcarNotificacaoComoLida
);

module.exports = router;
