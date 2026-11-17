
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
router.get(
    '/',
    autenticar,
    listarDoTreinador
);

module.exports = router;
