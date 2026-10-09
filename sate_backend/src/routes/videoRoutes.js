const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const autenticar =
    require('../middleware/authMiddleware');

const {
    listarVideos,
    adicionarVideo,
    excluirVideo
} = require('../controllers/videoController');

const router = express.Router();


// ============================================================
// PASTA DOS VÍDEOS
// ============================================================

const pastaVideos =
    path.join(
        __dirname,
        '../../uploads/videos'
    );


if (!fs.existsSync(pastaVideos)) {
    fs.mkdirSync(
        pastaVideos,
        {
            recursive: true
        }
    );
}


// ============================================================
// CONFIGURAÇÃO DO MULTER
// ============================================================

const storage =
    multer.diskStorage({

        destination: (
            req,
            file,
            cb
        ) => {

            cb(
                null,
                pastaVideos
            );

        },


        filename: (
            req,
            file,
            cb
        ) => {

            const extensao =
                path.extname(
                    file.originalname
                );


            const nomeBase =
                path
                    .basename(
                        file.originalname,
                        extensao
                    )
                    .replace(
                        /[^a-zA-Z0-9_-]/g,
                        '_'
                    );


            const nomeFinal =
                `${nomeBase}_${Date.now()}${extensao}`;


            cb(
                null,
                nomeFinal
            );

        }

    });


// ============================================================
// UPLOAD
// ============================================================

const upload =
    multer({

        storage,

        limits: {
            fileSize:
                500 * 1024 * 1024
        },

        fileFilter: (
            req,
            file,
            cb
        ) => {

            if (
                file.mimetype &&
                file.mimetype.startsWith(
                    'video/'
                )
            ) {

                cb(
                    null,
                    true
                );

            } else {

                cb(
                    new Error(
                        'Apenas arquivos de vídeo são permitidos.'
                    )
                );

            }

        }

    });


// ============================================================
// LISTAR VÍDEOS
// GET /api/partidas/:partidaId/videos
// ============================================================

router.get(
    '/partidas/:partidaId/videos',
    autenticar,
    listarVideos
);


// ============================================================
// ADICIONAR VÍDEO
// POST /api/partidas/:partidaId/videos
// ============================================================

router.post(
    '/partidas/:partidaId/videos',
    autenticar,
    upload.single('arquivo'),
    adicionarVideo
);


// ============================================================
// EXCLUIR VÍDEO
// DELETE /api/videos/:id
// ============================================================

router.delete(
    '/videos/:id',
    autenticar,
    excluirVideo
);


// ============================================================
// EXPORTAR
// ============================================================

module.exports = router;