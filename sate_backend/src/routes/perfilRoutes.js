
const express = require('express');

const autenticar = require('../middleware/authMiddleware');

const {
    listarPerfilAtleta
} = require('../controllers/perfilAtletaController');

const router = express.Router();

// ======================================================
// PERFIL DO ATLETA
// GET /api/estatisticas/atletas/:id
// ======================================================

/**
 * @swagger
 * /api/estatisticas/atletas/{id}:
 *   get:
 *     tags: [Perfil do atleta]
 *     summary: Consultar perfil estatístico
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
router.get(
    '/atletas/:id',
    autenticar,
    listarPerfilAtleta
);

module.exports = router;
