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

/*
|--------------------------------------------------------------------------
| CONFIGURAÇÃO DA ANÁLISE
|--------------------------------------------------------------------------
*/

/*
 * GET
 * Buscar configurações do treinador logado
 */
router.get(
    '/',
    autenticar,
    listarConfiguracoesAnalise
);

/*
 * POST
 * Criar nova configuração
 */
router.post(
    '/',
    autenticar,
    criarConfiguracaoAnalise
);

/*
 * PUT
 * Atualizar ordem
 *
 * IMPORTANTE:
 * Essa rota precisa ficar ANTES de /:id
 */
router.put(
    '/ordem',
    autenticar,
    atualizarOrdemConfiguracoes
);

/*
 * PUT
 * Atualizar configuração
 */
router.put(
    '/:id',
    autenticar,
    atualizarConfiguracaoAnalise
);

/*
 * DELETE
 * Excluir configuração
 */
router.delete(
    '/:id',
    autenticar,
    excluirConfiguracaoAnalise
);

module.exports = router;