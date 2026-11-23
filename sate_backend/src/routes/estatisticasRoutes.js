
const express = require('express');

const {
    listarDoTreinador
} = require('../controllers/estatisticasController');

// IMPORTANTE:
// Utilize aqui o mesmo middleware de autenticação
// usado em equipeRoutes.js ou partidaRoutes.js.
// Exemplo: ajuste o caminho e o nome conforme seu projeto.
const autenticar = require('../middleware/authMiddleware');

const router = express.Router();

// GET /api/estatisticas
/**
 * @swagger
 * /api/estatisticas:
 *   get:
 *     tags: [Estatísticas]
 *     summary: Listar estatísticas
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
    listarDoTreinador
);

module.exports = router;
