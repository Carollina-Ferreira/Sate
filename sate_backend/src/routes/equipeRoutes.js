const express = require('express');

const {
  listarEquipes,
  buscarEquipe,
  criarEquipe,
  atualizarEquipe,
  excluirEquipe,
} = require('../controllers/equipeController');

const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// =====================================
// EQUIPES
// =====================================

router.get('/', authMiddleware, listarEquipes);

router.get('/:id', authMiddleware, buscarEquipe);

router.post('/', authMiddleware, criarEquipe);

router.put('/:id', authMiddleware, atualizarEquipe);

router.delete('/:id', authMiddleware, excluirEquipe);

module.exports = router;