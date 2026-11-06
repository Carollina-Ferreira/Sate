const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { randomUUID } = require('crypto');

const autenticar = require('../middleware/authMiddleware');

const {
    listarVideos,
    adicionarVideo,
    excluirVideo,
    listarMarcacoes,
    adicionarMarcacao,
    editarMarcacao,
    excluirMarcacao,
    listarAnotacoes,
    adicionarAnotacao,
    excluirAnotacao
} = require('../controllers/videoController');

const router = express.Router();

// ============================================================
// UPLOAD DE VÍDEOS
// ============================================================

const PASTA_VIDEOS = path.resolve(__dirname, '../../uploads/videos');
const TAMANHO_MAXIMO_VIDEO = 500 * 1024 * 1024; // 500 MB

if (!fs.existsSync(PASTA_VIDEOS)) {
    fs.mkdirSync(PASTA_VIDEOS, { recursive: true });
}

const EXTENSOES_PERMITIDAS = new Set([
    '.mp4',
    '.mov',
    '.m4v',
    '.avi',
    '.mkv',
    '.webm'
]);

const TIPOS_MIME_PERMITIDOS = new Set([
    'video/mp4',
    'video/quicktime',
    'video/x-m4v',
    'video/x-msvideo',
    'video/avi',
    'video/x-matroska',
    'video/webm',
    'application/octet-stream'
]);

const armazenamento = multer.diskStorage({
    destination: (_req, _file, callback) => {
        callback(null, PASTA_VIDEOS);
    },
    filename: (_req, arquivo, callback) => {
        const extensao = path.extname(arquivo.originalname || '').toLowerCase();
        callback(null, `${randomUUID()}${extensao}`);
    }
});

const upload = multer({
    storage: armazenamento,
    limits: {
        fileSize: TAMANHO_MAXIMO_VIDEO,
        files: 1
    },
    fileFilter: (_req, arquivo, callback) => {
        const extensao = path.extname(arquivo.originalname || '').toLowerCase();
        const mime = String(arquivo.mimetype || '').toLowerCase();

        if (!EXTENSOES_PERMITIDAS.has(extensao)) {
            return callback(new Error('Formato de vídeo não permitido. Envie MP4, MOV, M4V, AVI, MKV ou WEBM.'));
        }

        if (!TIPOS_MIME_PERMITIDOS.has(mime) && !mime.startsWith('video/')) {
            return callback(new Error('O arquivo enviado não foi identificado como vídeo.'));
        }

        return callback(null, true);
    }
});

// Middleware que transforma erros do Multer em respostas JSON.
function receberArquivoVideo(req, res, next) {
    upload.single('arquivo')(req, res, error => {
        if (!error) return next();

        if (error instanceof multer.MulterError) {
            if (error.code === 'LIMIT_FILE_SIZE') {
                return res.status(413).json({
                    mensagem: 'O vídeo ultrapassa o limite de 500 MB.'
                });
            }

            return res.status(400).json({
                mensagem: `Falha no envio do vídeo: ${error.message}`
            });
        }

        return res.status(400).json({
            mensagem: error.message || 'Não foi possível receber o vídeo.'
        });
    });
}

// Todas as rotas deste arquivo exigem autenticação.
router.use(autenticar);

// ============================================================
// VÍDEOS DA PARTIDA
// ============================================================

router.get('/partidas/:partidaId/videos', listarVideos);
router.post('/partidas/:partidaId/videos', receberArquivoVideo, adicionarVideo);
router.delete('/videos/:id', excluirVideo);

// ============================================================
// EVENTOS E CLIPES
// ============================================================

router.get('/videos/:videoId/marcacoes', listarMarcacoes);
router.post('/videos/:videoId/marcacoes', adicionarMarcacao);
router.put('/marcacoes/:id', editarMarcacao);
router.delete('/marcacoes/:id', excluirMarcacao);

// ============================================================
// DESENHOS / ANOTAÇÕES DO VÍDEO
// ============================================================

router.get('/videos/:videoId/anotacoes', listarAnotacoes);
router.post('/videos/:videoId/anotacoes', adicionarAnotacao);
router.delete('/anotacoes/:id', excluirAnotacao);

module.exports = router;
