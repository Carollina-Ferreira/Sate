const express = require('express');

const autenticar = require('../middleware/authMiddleware');

const {
  buscarTreinador,
  atualizarTreinador
} = require('../controllers/treinadorController');

const router = express.Router();

router.get('/:id', autenticar, buscarTreinador);

router.put('/:id', autenticar, atualizarTreinador);

module.exports = router;