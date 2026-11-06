const express = require('express');
const autenticar = require('../middleware/authMiddleware');

const {
    listarPartidas,
    buscarPartida,
    criarPartida,
    atualizarPartida,
    excluirPartida,
    listarAtletasDaPartida,
    listarEscalacaoDaPartida,
    salvarAtletasDaPartida
} = require('../controllers/partidaController');

const router = express.Router();

// Todas as rotas deste arquivo exigem autenticação.
router.use(autenticar);

// PARTIDAS
router.get('/', listarPartidas);
router.post('/', criarPartida);

// ATLETAS DA PARTIDA: mantenha antes de /:id.
router.get('/:id/atletas', listarAtletasDaPartida);
router.put('/:id/atletas', salvarAtletasDaPartida);

// Escalação em formato simplificado para a tela de análise de vídeos.
router.get('/:id/escalacao', listarEscalacaoDaPartida);

// PARTIDA INDIVIDUAL
router.get('/:id', buscarPartida);
router.put('/:id', atualizarPartida);
router.delete('/:id', excluirPartida);

module.exports = router;
