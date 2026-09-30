
const express = require('express');

const autenticar = require('../middleware/authMiddleware');

const {
    listarAtletas,
    buscarAtleta,
    atualizarAtleta,
    excluirAtleta
} = require('../controllers/atletaController');


const router = express.Router();


// ============================================================
// LISTAR TODOS OS ATLETAS
// GET /api/atletas
// ============================================================

router.get(
    '/',
    autenticar,
    listarAtletas
);


// ============================================================
// BUSCAR ATLETA
// GET /api/atletas/:id
// ============================================================

router.get(
    '/:id',
    autenticar,
    buscarAtleta
);


// ============================================================
// ATUALIZAR ATLETA
// PUT /api/atletas/:id
// ============================================================

router.put(
    '/:id',
    autenticar,
    atualizarAtleta
);


// ============================================================
// EXCLUIR ATLETA
// DELETE /api/atletas/:id
// ============================================================

router.delete(
    '/:id',
    autenticar,
    excluirAtleta
);


module.exports = router;

