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

/**
 * @swagger
 * /api/partidas/{partidaId}/videos:
 *   get:
 *     tags: [Vídeos e marcações]
 *     summary: Listar vídeos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: partidaId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Operação realizada
 *       '400':
 *         description: Dados inválidos
 *       '401':
 *         description: Autenticação necessária
 *       '404':
 *         description: Não encontrado
 *       '500':
 *         description: Erro interno
 */
router.get('/partidas/:partidaId/videos', listarVideos);
/**
 * @swagger
 * /api/partidas/{partidaId}/videos:
 *   post:
 *     tags: [Vídeos e marcações]
 *     summary: Enviar vídeo
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: partidaId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               arquivo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       '200':
 *         description: Operação realizada
 *       '201':
 *         description: Recurso criado, quando aplicável
 *       '400':
 *         description: Dados inválidos
 *       '401':
 *         description: Autenticação necessária
 *       '404':
 *         description: Não encontrado
 *       '500':
 *         description: Erro interno
 */
router.post('/partidas/:partidaId/videos', receberArquivoVideo, adicionarVideo);
/**
 * @swagger
 * /api/videos/{id}:
 *   delete:
 *     tags: [Vídeos e marcações]
 *     summary: Excluir vídeo
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Operação realizada
 *       '400':
 *         description: Dados inválidos
 *       '401':
 *         description: Autenticação necessária
 *       '404':
 *         description: Não encontrado
 *       '500':
 *         description: Erro interno
 */
router.delete('/videos/:id', excluirVideo);

// ============================================================
// EVENTOS E CLIPES
// ============================================================

/**
 * @swagger
 * /api/videos/{videoId}/marcacoes:
 *   get:
 *     tags: [Vídeos e marcações]
 *     summary: Listar marcações
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: videoId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Operação realizada
 *       '400':
 *         description: Dados inválidos
 *       '401':
 *         description: Autenticação necessária
 *       '404':
 *         description: Não encontrado
 *       '500':
 *         description: Erro interno
 */
router.get('/videos/:videoId/marcacoes', listarMarcacoes);
/**
 * @swagger
 * /api/videos/{videoId}/marcacoes:
 *   post:
 *     tags: [Vídeos e marcações]
 *     summary: Adicionar marcação
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: videoId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tempoInicio:
 *                 type: number
 *               tempoFim:
 *                 type: number
 *               atletaId:
 *                 type: integer
 *               tipo:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Operação realizada
 *       '201':
 *         description: Recurso criado, quando aplicável
 *       '400':
 *         description: Dados inválidos
 *       '401':
 *         description: Autenticação necessária
 *       '404':
 *         description: Não encontrado
 *       '500':
 *         description: Erro interno
 */
router.post('/videos/:videoId/marcacoes', adicionarMarcacao);
/**
 * @swagger
 * /api/marcacoes/{id}:
 *   put:
 *     tags: [Vídeos e marcações]
 *     summary: Editar marcação
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *     responses:
 *       '200':
 *         description: Operação realizada
 *       '400':
 *         description: Dados inválidos
 *       '401':
 *         description: Autenticação necessária
 *       '404':
 *         description: Não encontrado
 *       '500':
 *         description: Erro interno
 */
router.put('/marcacoes/:id', editarMarcacao);
/**
 * @swagger
 * /api/marcacoes/{id}:
 *   delete:
 *     tags: [Vídeos e marcações]
 *     summary: Excluir marcação
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Operação realizada
 *       '400':
 *         description: Dados inválidos
 *       '401':
 *         description: Autenticação necessária
 *       '404':
 *         description: Não encontrado
 *       '500':
 *         description: Erro interno
 */
router.delete('/marcacoes/:id', excluirMarcacao);

// ============================================================
// DESENHOS / ANOTAÇÕES DO VÍDEO
// ============================================================

/**
 * @swagger
 * /api/videos/{videoId}/anotacoes:
 *   get:
 *     tags: [Vídeos e marcações]
 *     summary: Listar desenhos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: videoId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Operação realizada
 *       '400':
 *         description: Dados inválidos
 *       '401':
 *         description: Autenticação necessária
 *       '404':
 *         description: Não encontrado
 *       '500':
 *         description: Erro interno
 */
router.get('/videos/:videoId/anotacoes', listarAnotacoes);
/**
 * @swagger
 * /api/videos/{videoId}/anotacoes:
 *   post:
 *     tags: [Vídeos e marcações]
 *     summary: Adicionar desenho
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: videoId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               formas:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       '200':
 *         description: Operação realizada
 *       '201':
 *         description: Recurso criado, quando aplicável
 *       '400':
 *         description: Dados inválidos
 *       '401':
 *         description: Autenticação necessária
 *       '404':
 *         description: Não encontrado
 *       '500':
 *         description: Erro interno
 */
router.post('/videos/:videoId/anotacoes', adicionarAnotacao);
/**
 * @swagger
 * /api/anotacoes/{id}:
 *   delete:
 *     tags: [Vídeos e marcações]
 *     summary: Excluir desenho
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Operação realizada
 *       '400':
 *         description: Dados inválidos
 *       '401':
 *         description: Autenticação necessária
 *       '404':
 *         description: Não encontrado
 *       '500':
 *         description: Erro interno
 */
router.delete('/anotacoes/:id', excluirAnotacao);

module.exports = router;
