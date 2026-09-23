const express = require('express');

const {
  solicitarRecuperacao
} = require('../controllers/passwordController');

const router = express.Router();

router.post(
  '/esqueci-senha',
  solicitarRecuperacao
);

module.exports = router;