
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

/**
 * @swagger
 * /api/notificacoes:
 *   get:
 *     tags: [Notificações]
 *     summary: Listar notificações
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Operação realizada
 *       '400':
 *         description: Dados inválidos
 *       '401':
 *         description: Autenticação necessária
 *       '500':
 *         description: Erro interno
 */
router.get(
    '/',
    listarNotificacoes
);

// ============================================================
// MARCAR TODAS COMO LIDAS
// PATCH /api/notificacoes/lidas
// ============================================================

/**
 * @swagger
 * /api/notificacoes/lidas:
 *   patch:
 *     tags: [Notificações]
 *     summary: Marcar todas como lidas
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *     responses:
 *       '200':
 *         description: Operação realizada
 *       '400':
 *         description: Dados inválidos
 *       '401':
 *         description: Autenticação necessária
 *       '500':
 *         description: Erro interno
 */
router.patch(
    '/lidas',
    marcarTodasComoLidas
);

// ============================================================
// MARCAR UMA NOTIFICAÇÃO COMO LIDA
// PATCH /api/notificacoes/:id/lida
// ============================================================

/**
 * @swagger
 * /api/notificacoes/{id}/lida:
 *   patch:
 *     tags: [Notificações]
 *     summary: Marcar como lida
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *     responses:
 *       '200':
 *         description: Operação realizada
 *       '400':
 *         description: Dados inválidos
 *       '401':
 *         description: Autenticação necessária
 *       '404':
 *         description: Não encontrado
 *       '500':
 *         description: Erro interno
 */
router.patch(
    '/:id/lida',
    marcarNotificacaoComoLida
);

module.exports = router;
