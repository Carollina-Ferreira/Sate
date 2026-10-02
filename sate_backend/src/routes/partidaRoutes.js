const express = require('express');

const autenticar = require('../middleware/authMiddleware');

const {
    listarPartidas,
    buscarPartida,
    criarPartida,
    atualizarPartida,
    excluirPartida
} = require('../controllers/partidaController');


const router = express.Router();


// ============================================================
// LISTAR TODAS AS PARTIDAS
// GET /api/partidas
// ============================================================

router.get(
    '/',
    autenticar,
    listarPartidas
);


// ============================================================
// BUSCAR PARTIDA
// GET /api/partidas/:id
// ============================================================

router.get(
    '/:id',
    autenticar,
    buscarPartida
);


// ============================================================
// CRIAR PARTIDA
// POST /api/partidas
// ============================================================

router.post(
    '/',
    autenticar,
    criarPartida
);


// ============================================================
// ATUALIZAR PARTIDA
// PUT /api/partidas/:id
// ============================================================

router.put(
    '/:id',
    autenticar,
    atualizarPartida
);


// ============================================================
// EXCLUIR PARTIDA
// DELETE /api/partidas/:id
// ============================================================

router.delete(
    '/:id',
    autenticar,
    excluirPartida
);


module.exports = router;