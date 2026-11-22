const express = require('express');

const autenticar = require('../middleware/authMiddleware');

const {
  buscarTreinador,
  atualizarTreinador
} = require('../controllers/treinadorController');

const router = express.Router();

/**
 * @swagger
 * /api/treinadores/{id}:
 *   get:
 *     tags: [Treinadores]
 *     summary: Buscar treinador
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
router.get('/:id', autenticar, buscarTreinador);

/**
 * @swagger
 * /api/treinadores/{id}:
 *   put:
 *     tags: [Treinadores]
 *     summary: Atualizar treinador
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
router.put('/:id', autenticar, atualizarTreinador);

module.exports = router;