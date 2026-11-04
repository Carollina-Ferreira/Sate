const express = require('express');
const autenticar = require('../middleware/authMiddleware');

const {
  listarPartidas,
  buscarPartida,
  criarPartida,
  atualizarPartida,
  excluirPartida,
  listarAtletasDaPartida,
  salvarAtletasDaPartida,
} = require('../controllers/partidaController');

const router = express.Router();

// Todas as rotas deste arquivo exigem autenticação.
router.use(autenticar);

// ============================================================
// PARTIDAS
// ============================================================

// Listar todas as partidas do treinador autenticado.
router.get('/', listarPartidas);

// Criar uma partida.
router.post('/', criarPartida);

// ============================================================
// ATLETAS DA PARTIDA
// Estas rotas devem ficar antes de /:id.
// ============================================================

// Listar atletas participantes de uma partida.
router.get('/:id/atletas', listarAtletasDaPartida);

// Salvar ou atualizar os atletas participantes.
router.put('/:id/atletas', salvarAtletasDaPartida);

// ============================================================
// PARTIDA INDIVIDUAL
// ============================================================

// Buscar os dados de uma partida.
router.get('/:id', buscarPartida);

// Atualizar os dados da partida.
router.put('/:id', atualizarPartida);

// Excluir uma partida.
router.delete('/:id', excluirPartida);

module.exports = router;
