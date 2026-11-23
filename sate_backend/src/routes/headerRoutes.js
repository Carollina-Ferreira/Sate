const express = require('express');

const autenticar = require('../middleware/authMiddleware');

const {
    listarNotificacoesHeader,
    pesquisarHeader,
    obterResumoHeader,
} = require('../controllers/headerController');

const router = express.Router();

// GET /api/header
/**
 * @swagger
 * /api/header:
 *   get:
 *     tags: [Cabeçalho]
 *     summary: Obter resumo
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
    autenticar,
    obterResumoHeader
);

// GET /api/header/notificacoes
/**
 * @swagger
 * /api/header/notificacoes:
 *   get:
 *     tags: [Cabeçalho]
 *     summary: Listar alertas
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
    '/notificacoes',
    autenticar,
    listarNotificacoesHeader
);

// GET /api/header/pesquisa?q=nome
/**
 * @swagger
 * /api/header/pesquisa:
 *   get:
 *     tags: [Cabeçalho]
 *     summary: Pesquisar no sistema
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
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
    '/pesquisa',
    autenticar,
    pesquisarHeader
);

module.exports = router;