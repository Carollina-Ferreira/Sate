const express = require('express');
const autenticar = require('../middleware/authMiddleware');

const {
    listarConfiguracoesAnalise,
    criarConfiguracaoAnalise,
    atualizarConfiguracaoAnalise,
    excluirConfiguracaoAnalise,
    atualizarOrdemConfiguracoes
} = require('../controllers/configuracaoAnaliseController');

const router = express.Router();

router.use(autenticar);

router.get('/', listarConfiguracoesAnalise);
router.post('/', criarConfiguracaoAnalise);

// Esta rota precisa ficar antes de /:id.
router.put('/ordem', atualizarOrdemConfiguracoes);
router.put('/:id', atualizarConfiguracaoAnalise);
router.delete('/:id', excluirConfiguracaoAnalise);

module.exports = router;
