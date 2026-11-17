
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

router.get(
    '/atletas/:id',
    autenticar,
    listarPerfilAtleta
);

module.exports = router;
