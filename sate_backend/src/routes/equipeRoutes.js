const express = require('express');

const {
  listarEquipes,
  buscarEquipe,
  criarEquipe,
  atualizarEquipe,
  excluirEquipe,
} = require('../controllers/equipeController');

const authMiddleware = require('../middleware/authMiddleware');
const { comContexto } = require('../lib/acesso');
const {
  minhasEquipes,
  entrarEquipe,
  codigoEquipe,
  atualizarAgendaEquipe,
} = require('../controllers/equipeMobileController');

const router = express.Router();

// =====================================
// EQUIPES
// =====================================

/**
 * @swagger
 * /api/equipes:
 *   get:
 *     tags: [Equipes]
 *     summary: Listar equipes
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
router.get('/', authMiddleware, listarEquipes);

/**
 * @swagger
 * /api/equipes/{id}:
 *   get:
 *     tags: [Equipes]
 *     summary: Buscar equipe
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
// Aplicativo mobile — precisam vir antes das rotas com /:id.
router.get('/minhas', authMiddleware, comContexto('ATLETA'), minhasEquipes);
router.post('/entrar', authMiddleware, comContexto('ATLETA'), entrarEquipe);


router.get('/:id', authMiddleware, buscarEquipe);

/**
 * @swagger
 * /api/equipes:
 *   post:
 *     tags: [Equipes]
 *     summary: Criar equipe
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               modalidade:
 *                 type: string
 *               categoria:
 *                 type: string
 *               atletasIds:
 *                 type: array
 *                 items:
 *                   type: integer
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
router.post('/', authMiddleware, criarEquipe);

/**
 * @swagger
 * /api/equipes/{id}:
 *   put:
 *     tags: [Equipes]
 *     summary: Atualizar equipe
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
// Código de convite e agenda recorrente da equipe (treinador).
router.get('/:id/codigo', authMiddleware, comContexto('TREINADOR'), codigoEquipe);
router.post('/:id/codigo', authMiddleware, comContexto('TREINADOR'), codigoEquipe);
router.put('/:id/agenda', authMiddleware, comContexto('TREINADOR'), atualizarAgendaEquipe);

router.put('/:id', authMiddleware, atualizarEquipe);

/**
 * @swagger
 * /api/equipes/{id}:
 *   delete:
 *     tags: [Equipes]
 *     summary: Excluir equipe
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
router.delete('/:id', authMiddleware, excluirEquipe);

module.exports = router;