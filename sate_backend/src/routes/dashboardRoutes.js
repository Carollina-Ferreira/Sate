const express = require('express');

const autenticar = require('../middleware/authMiddleware');

const {
    obterDashboard
} = require('../controllers/dashboardController');


const router = express.Router();


// ============================================================
// DASHBOARD
// GET /api/dashboard
// ============================================================

/**
 * @swagger
 * /api/dashboard:
 *   get:
 *     tags: [Dashboard]
 *     summary: Consultar painel
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
    obterDashboard
);


module.exports = router;