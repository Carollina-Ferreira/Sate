
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const {
    listarAtletas,
    listarAtletasDisponiveis,
    buscarAtleta,
    criarAtleta,
    atualizarAtleta,
    adicionarDocumento,
    excluirAtleta,
} = require('../controllers/atletaController');

const {
    listarPartidasDoAtleta,
} = require('../controllers/partidasAtletaController');

const autenticar = require('../middleware/authMiddleware');

const router = express.Router();

// =====================================
// CONFIGURAÇÃO DO UPLOAD DE DOCUMENTOS
// =====================================

const pastaDocumentos = path.resolve(
    __dirname,
    '../../uploads/documentos'
);

if (!fs.existsSync(pastaDocumentos)) {
    fs.mkdirSync(pastaDocumentos, {
        recursive: true,
    });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, pastaDocumentos);
    },

    filename: (req, file, cb) => {
        const nomeArquivo =
            `${crypto.randomBytes(16).toString('hex')}.pdf`;

        cb(null, nomeArquivo);
    },
});

const uploadDocumento = multer({
    storage,

    limits: {
        fileSize: 15 * 1024 * 1024,
    },

    fileFilter: (req, file, cb) => {
        const extensao = path.extname(
            file.originalname
        ).toLowerCase();

        if (
            extensao !== '.pdf' ||
            file.mimetype !== 'application/pdf'
        ) {
            return cb(
                new Error('Envie somente arquivos PDF.')
            );
        }

        cb(null, true);
    },
});

// =====================================
// ATLETAS DISPONÍVEIS
// =====================================

router.get(
    '/disponiveis',
    autenticar,
    listarAtletasDisponiveis
);

// =====================================
// LISTAR ATLETAS
// =====================================

router.get(
    '/',
    autenticar,
    listarAtletas
);

// =====================================
// CRIAR ATLETA
// =====================================

router.post(
    '/',
    autenticar,
    criarAtleta
);

// =====================================
// PARTIDAS DO ATLETA
// =====================================

router.get(
    '/:id/partidas',
    autenticar,
    listarPartidasDoAtleta
);

// =====================================
// DOCUMENTOS
// =====================================

router.post(
    '/:id/documentos',
    autenticar,
    uploadDocumento.single('arquivo'),
    adicionarDocumento
);

// =====================================
// BUSCAR ATLETA
// =====================================

router.get(
    '/:id',
    autenticar,
    buscarAtleta
);

// =====================================
// ATUALIZAR ATLETA
// =====================================

router.put(
    '/:id',
    autenticar,
    atualizarAtleta
);

// =====================================
// EXCLUIR ATLETA
// =====================================

router.delete(
    '/:id',
    autenticar,
    excluirAtleta
);

// =====================================
// EXPORTAR ROTAS
// =====================================

module.exports = router;
