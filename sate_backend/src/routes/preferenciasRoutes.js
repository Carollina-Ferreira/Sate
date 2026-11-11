
const { Router } = require('express');

const {
    listarPreferencias,
    salvarPreferencias,
} = require('../controllers/preferenciasController');

// ============================================================
// ROTAS DE PREFERÊNCIAS
// ============================================================

function criarRotasPreferencias(autenticar) {
    if (typeof autenticar !== 'function') {
        throw new TypeError(
            'O middleware de autenticação das preferências não foi informado.'
        );
    }

    const router = Router();

    // Todas as rotas exigem usuário autenticado.
    // O middleware deve preencher req.usuario.id.
    router.use(autenticar);

    router.get('/', listarPreferencias);

    router.put('/', salvarPreferencias);

    return router;
}

module.exports = criarRotasPreferencias;
