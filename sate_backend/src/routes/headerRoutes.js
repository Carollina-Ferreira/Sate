const express = require('express');

const autenticar = require('../middleware/authMiddleware');

const {
    listarNotificacoesHeader,
    pesquisarHeader,
    obterResumoHeader,
} = require('../controllers/headerController');

const router = express.Router();

// GET /api/header
router.get(
    '/',
    autenticar,
    obterResumoHeader
);

// GET /api/header/notificacoes
router.get(
    '/notificacoes',
    autenticar,
    listarNotificacoesHeader
);

// GET /api/header/pesquisa?q=nome
router.get(
    '/pesquisa',
    autenticar,
    pesquisarHeader
);

module.exports = router;