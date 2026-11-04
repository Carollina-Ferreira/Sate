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

const autenticar = require('../middleware/authMiddleware');

const router = express.Router();

// =====================================
// CONFIGURAÇÃO DO UPLOAD DE DOCUMENTOS
// =====================================

const pastaDocumentos = path.resolve(
    __dirname,
    '../../uploads/documentos'
);

// Criar a pasta automaticamente
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
// ATLETAS
// =====================================

// Listar atletas disponíveis para equipe
router.get(
    '/disponiveis',
    autenticar,
    listarAtletasDisponiveis
);

// Listar todos os atletas
router.get(
    '/',
    autenticar,
    listarAtletas
);

// Criar atleta
router.post(
    '/',
    autenticar,
    criarAtleta
);

// Adicionar documento ao atleta
router.post(
    '/:id/documentos',
    autenticar,
    uploadDocumento.single('arquivo'),
    adicionarDocumento
);

// Buscar atleta por ID
router.get(
    '/:id',
    autenticar,
    buscarAtleta
);

// Atualizar atleta
router.put(
    '/:id',
    autenticar,
    atualizarAtleta
);

// Excluir atleta
router.delete(
    '/:id',
    autenticar,
    excluirAtleta
);

module.exports = router;