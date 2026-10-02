const express = require('express');

const {
    listarAtletas,
    listarAtletasDisponiveis,
    buscarAtleta,
    criarAtleta,
    atualizarAtleta,
    excluirAtleta,
} = require('../controllers/atletaController');

const autenticar =
    require('../middleware/authMiddleware');

const router = express.Router();

// =====================================
// ATLETAS
// =====================================

router.get(
    '/disponiveis',
    autenticar,
    listarAtletasDisponiveis
);

router.get(
    '/',
    autenticar,
    listarAtletas
);

router.post(
    '/',
    autenticar,
    criarAtleta
);

router.get(
    '/:id',
    autenticar,
    buscarAtleta
);

router.put(
    '/:id',
    autenticar,
    atualizarAtleta
);

router.delete(
    '/:id',
    autenticar,
    excluirAtleta
);

module.exports = router;