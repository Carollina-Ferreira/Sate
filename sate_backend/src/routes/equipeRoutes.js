const express = require('express');

const {
  listarEquipes,
  buscarEquipe,
  criarEquipe,
  atualizarEquipe,
  excluirEquipe,
} = require('../controllers/equipeController');

const authMiddleware = require('../middleware/authMiddleware');
const { comContexto } = require('../lib/acesso');
const {
  minhasEquipes,
  entrarEquipe,
  codigoEquipe,
  atualizarAgendaEquipe,
} = require('../controllers/equipeMobileController');

const router = express.Router();

// =====================================
// EQUIPES
// =====================================

router.get('/', authMiddleware, listarEquipes);

// Aplicativo mobile — precisam vir antes das rotas com /:id.
router.get('/minhas', authMiddleware, comContexto('ATLETA'), minhasEquipes);
router.post('/entrar', authMiddleware, comContexto('ATLETA'), entrarEquipe);


router.get('/:id', authMiddleware, buscarEquipe);

router.post('/', authMiddleware, criarEquipe);

// Código de convite e agenda recorrente da equipe (treinador).
router.get('/:id/codigo', authMiddleware, comContexto('TREINADOR'), codigoEquipe);
router.post('/:id/codigo', authMiddleware, comContexto('TREINADOR'), codigoEquipe);
router.put('/:id/agenda', authMiddleware, comContexto('TREINADOR'), atualizarAgendaEquipe);

router.put('/:id', authMiddleware, atualizarEquipe);

router.delete('/:id', authMiddleware, excluirEquipe);

module.exports = router;