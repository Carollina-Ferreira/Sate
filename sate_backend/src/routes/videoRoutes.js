
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { randomUUID } = require('crypto');

const autenticar = require('../middleware/authMiddleware');
const videoController = require('../controllers/videoController');

const router = express.Router();

const PASTA_VIDEOS = path.resolve(
  __dirname,
  '../../uploads/videos'
);

fs.mkdirSync(PASTA_VIDEOS, { recursive: true });

const extensoesPermitidas = new Set([
  '.mp4',
  '.webm',
  '.mov',
  '.m4v',
  '.ogv',
  '.avi',
  '.mkv',
]);

const upload = multer({
  storage: multer.diskStorage({
    destination(req, arquivo, callback) {
      callback(null, PASTA_VIDEOS);
    },

    filename(req, arquivo, callback) {
      const extensao = path
        .extname(arquivo.originalname)
        .toLowerCase();

      callback(
        null,
        `${randomUUID()}${extensao}`
      );
    },
  }),

  limits: {
    fileSize: 500 * 1024 * 1024,
  },

  fileFilter(req, arquivo, callback) {
    const extensao = path
      .extname(arquivo.originalname)
      .toLowerCase();

    if (
      !arquivo.mimetype.startsWith('video/') ||
      !extensoesPermitidas.has(extensao)
    ) {
      const erro = new Error(
        'Envie um vídeo MP4, WebM, MOV, M4V, OGV, AVI ou MKV.'
      );

      erro.status = 400;
      return callback(erro);
    }

    callback(null, true);
  },
});

// Listar vídeos de uma partida
router.get(
  '/partidas/:partidaId/videos',
  autenticar,
  videoController.listarVideos
);

// Cadastrar vídeo de uma partida
router.post(
  '/partidas/:partidaId/videos',
  autenticar,
  upload.single('arquivo'),
  videoController.adicionarVideo
);

// Excluir vídeo
router.delete(
  '/videos/:id',
  autenticar,
  videoController.excluirVideo
);

// Listar marcações de um vídeo
router.get(
  '/videos/:videoId/marcacoes',
  autenticar,
  videoController.listarMarcacoes
);

// Criar marcação em um vídeo
router.post(
  '/videos/:videoId/marcacoes',
  autenticar,
  videoController.adicionarMarcacao
);

// Editar marcação
router.put(
  '/marcacoes/:id',
  autenticar,
  videoController.editarMarcacao
);

// Excluir marcação
router.delete(
  '/marcacoes/:id',
  autenticar,
  videoController.excluirMarcacao
);

module.exports = router;
