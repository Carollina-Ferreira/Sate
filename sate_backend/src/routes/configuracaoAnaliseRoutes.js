const express = require('express');
const autenticar = require('../middleware/authMiddleware');

const {
    listarConfiguracoesAnalise,
    criarConfiguracaoAnalise,
    atualizarConfiguracaoAnalise,
    excluirConfiguracaoAnalise,
    atualizarOrdemConfiguracoes
} = require('../controllers/configuracaoAnaliseController');

const router = express.Router();

router.use(autenticar);

/**
 * @swagger
 * /api/configuracao-analise:
 *   get:
 *     tags: [Configuração de análise]
 *     summary: Listar categorias
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
router.get('/', listarConfiguracoesAnalise);
/**
 * @swagger
 * /api/configuracao-analise:
 *   post:
 *     tags: [Configuração de análise]
 *     summary: Criar categoria
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
 *               tipo:
 *                 type: string
 *               descricao:
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
router.post('/', criarConfiguracaoAnalise);

// Esta rota precisa ficar antes de /:id.
/**
 * @swagger
 * /api/configuracao-analise/ordem:
 *   put:
 *     tags: [Configuração de análise]
 *     summary: Reordenar categorias
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: integer
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
router.put('/ordem', atualizarOrdemConfiguracoes);
/**
 * @swagger
 * /api/configuracao-analise/{id}:
 *   put:
 *     tags: [Configuração de análise]
 *     summary: Atualizar categoria
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
router.put('/:id', atualizarConfiguracaoAnalise);
/**
 * @swagger
 * /api/configuracao-analise/{id}:
 *   delete:
 *     tags: [Configuração de análise]
 *     summary: Excluir categoria
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
router.delete('/:id', excluirConfiguracaoAnalise);

module.exports = router;
