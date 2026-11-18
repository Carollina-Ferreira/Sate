const express = require('express');
const autenticar = require('../middleware/authMiddleware');

const {
    listarPartidas,
    buscarPartida,
    criarPartida,
    atualizarPartida,
    excluirPartida,
    listarAtletasDaPartida,
    listarEscalacaoDaPartida,
    salvarAtletasDaPartida
} = require('../controllers/partidaController');

const router = express.Router();

// Todas as rotas deste arquivo exigem autenticação.
router.use(autenticar);

// PARTIDAS
/**
 * @swagger
 * /api/partidas:
 *   get:
 *     tags: [Partidas]
 *     summary: Listar partidas
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
router.get('/', listarPartidas);
/**
 * @swagger
 * /api/partidas:
 *   post:
 *     tags: [Partidas]
 *     summary: Criar partida
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               equipeId:
 *                 type: integer
 *               adversario:
 *                 type: string
 *               data:
 *                 type: string
 *               local:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Operação realizada
 *       '201':
 *         description: Recurso criado, quando aplicável
 *       '400':
 *         description: Dados inválidos
 *       '401':
 *         description: Autenticação necessária
 *       '500':
 *         description: Erro interno
 */
router.post('/', criarPartida);

// ATLETAS DA PARTIDA: mantenha antes de /:id.
/**
 * @swagger
 * /api/partidas/{id}/atletas:
 *   get:
 *     tags: [Partidas]
 *     summary: Listar atletas escalados
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
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
router.get('/:id/atletas', listarAtletasDaPartida);
/**
 * @swagger
 * /api/partidas/{id}/atletas:
 *   put:
 *     tags: [Partidas]
 *     summary: Atualizar escalação
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
router.put('/:id/atletas', salvarAtletasDaPartida);

// Escalação em formato simplificado para a tela de análise de vídeos.
/**
 * @swagger
 * /api/partidas/{id}/escalacao:
 *   get:
 *     tags: [Partidas]
 *     summary: Consultar escalação
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
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
router.get('/:id/escalacao', listarEscalacaoDaPartida);

// PARTIDA INDIVIDUAL
/**
 * @swagger
 * /api/partidas/{id}:
 *   get:
 *     tags: [Partidas]
 *     summary: Buscar partida
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
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
router.get('/:id', buscarPartida);
/**
 * @swagger
 * /api/partidas/{id}:
 *   put:
 *     tags: [Partidas]
 *     summary: Atualizar partida
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
router.put('/:id', atualizarPartida);
/**
 * @swagger
 * /api/partidas/{id}:
 *   delete:
 *     tags: [Partidas]
 *     summary: Excluir partida
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
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
router.delete('/:id', excluirPartida);

module.exports = router;
