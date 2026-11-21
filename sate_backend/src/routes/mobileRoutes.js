const express = require('express');
const autenticar = require('../middleware/authMiddleware');
const { comContexto } = require('../lib/acesso');

const mobile = require('../controllers/mobileController');
const treino = require('../controllers/treinoController');
const agenda = require('../controllers/agendaController');
const acomp = require('../controllers/acompanhamentoController');

// Cada recurso é montado em seu próprio caminho (ver server.js):
//   /api/mobile      sessão e snapshot
//   /api/exercicios  /api/treinos  /api/eventos  /api/presencas
//   /api/testes      /api/metas    /api/feedbacks /api/documentos
// Todas exigem o mesmo JWT usado pelo site (middleware authMiddleware).

const treinador = comContexto('TREINADOR');
const qualquer = comContexto();

function criarRouter(configurar) {
    const r = express.Router();
    r.use(autenticar);
    configurar(r);
    return r;
}

const rotasMobile = criarRouter((r) => {
    r.get('/me', qualquer, mobile.me);
    r.get('/snapshot', qualquer, mobile.snapshot);
    r.put('/perfil-profissional', treinador, mobile.atualizarPerfilProfissional);
});

const rotasExercicios = criarRouter((r) => {
    r.post('/', treinador, treino.criarExercicio);
    r.put('/:id', treinador, treino.atualizarExercicio);
    r.delete('/:id', treinador, treino.excluirExercicio);
});

const rotasTreinos = criarRouter((r) => {
    r.get('/', qualquer, treino.listarTreinos);
    r.post('/', treinador, treino.criarTreino);
    r.put('/:id', treinador, treino.atualizarTreino);
    r.delete('/:id', treinador, treino.excluirTreino);
});

const rotasEventos = criarRouter((r) => {
    r.get('/', qualquer, agenda.listarEventos);
    r.post('/', treinador, agenda.criarEvento);
    r.put('/:id', treinador, agenda.atualizarEvento);
    r.delete('/:id', treinador, agenda.excluirEvento);
});

const rotasPresencas = criarRouter((r) => {
    r.get('/', qualquer, agenda.listarPresencas);
    r.put('/', treinador, agenda.registrarPresenca);
});

const rotasTestes = criarRouter((r) => {
    r.get('/', qualquer, acomp.listarTestes);
    r.post('/', qualquer, acomp.registrarTeste);
    r.delete('/:id', qualquer, acomp.excluirTeste);
});

const rotasMetas = criarRouter((r) => {
    r.get('/', qualquer, acomp.listarMetas);
    r.post('/', treinador, acomp.criarMeta);
    r.put('/:id', treinador, acomp.atualizarMeta);
    r.delete('/:id', treinador, acomp.excluirMeta);
});

const rotasFeedbacks = criarRouter((r) => {
    r.get('/', qualquer, acomp.listarFeedbacks);
    r.post('/', treinador, acomp.criarFeedback);
    r.delete('/:id', treinador, acomp.excluirFeedback);
});

const rotasDocumentos = criarRouter((r) => {
    r.get('/', qualquer, acomp.listarDocumentos);
    r.post('/', qualquer, acomp.criarDocumento);
    r.put('/:id', treinador, acomp.atualizarDocumento);
    r.delete('/:id', qualquer, acomp.excluirDocumento);
});

module.exports = {
    rotasMobile,
    rotasExercicios,
    rotasTreinos,
    rotasEventos,
    rotasPresencas,
    rotasTestes,
    rotasMetas,
    rotasFeedbacks,
    rotasDocumentos,
};
