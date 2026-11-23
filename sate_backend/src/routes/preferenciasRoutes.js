
const { Router } = require('express');

const {
    listarPreferencias,
    salvarPreferencias,
} = require('../controllers/preferenciasController');

// ============================================================
// ROTAS DE PREFERÊNCIAS
// ============================================================

function criarRotasPreferencias(autenticar) {
    if (typeof autenticar !== 'function') {
        throw new TypeError(
            'O middleware de autenticação das preferências não foi informado.'
        );
    }

    const router = Router();

    // Todas as rotas exigem usuário autenticado.
    // O middleware deve preencher req.usuario.id.
    router.use(autenticar);

    /**
 * @swagger
 * /api/usuarios/preferencias:
 *   get:
 *     tags: [Preferências]
 *     summary: Consultar preferências
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
router.get('/', listarPreferencias);

    /**
 * @swagger
 * /api/usuarios/preferencias:
 *   put:
 *     tags: [Preferências]
 *     summary: Salvar preferências
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: boolean
 *               push:
 *                 type: boolean
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
router.put('/', salvarPreferencias);

    return router;
}

module.exports = criarRotasPreferencias;
