const express = require('express');

const {
  solicitarRecuperacao,
  redefinirSenha,
} = require('../controllers/passwordController');

const router = express.Router();

/**
 * @swagger
 * /api/password/esqueci-senha:
 *   post:
 *     tags: [Senha]
 *     summary: Solicitar recuperação
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Operação realizada
 *       '201':
 *         description: Recurso criado, quando aplicável
 *       '400':
 *         description: Dados inválidos
 *       '500':
 *         description: Erro interno
 */
router.post('/esqueci-senha', solicitarRecuperacao);
/**
 * @swagger
 * /api/password/redefinir-senha:
 *   post:
 *     tags: [Senha]
 *     summary: Redefinir senha
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *               senha:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Operação realizada
 *       '201':
 *         description: Recurso criado, quando aplicável
 *       '400':
 *         description: Dados inválidos
 *       '500':
 *         description: Erro interno
 */
router.post('/redefinir-senha', redefinirSenha);

module.exports = router;