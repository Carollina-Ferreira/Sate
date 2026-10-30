const express = require('express');

const {
  solicitarRecuperacao,
  redefinirSenha,
} = require('../controllers/passwordController');

const router = express.Router();

router.post('/esqueci-senha', solicitarRecuperacao);
router.post('/redefinir-senha', redefinirSenha);

module.exports = router;
