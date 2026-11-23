
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
const { comContexto } = require('../lib/acesso');
const {
    meuPerfil,
    atualizarMeuPerfil,
} = require('../controllers/equipeMobileController');

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
// PERFIL DO ATLETA LOGADO (aplicativo mobile)
// Precisa vir antes das rotas com /:id.
// =====================================
router.get(
    '/me',
    autenticar,
    comContexto('ATLETA'),
    meuPerfil
);

router.put(
    '/me',
    autenticar,
    comContexto('ATLETA'),
    atualizarMeuPerfil
);

// =====================================
// ATLETAS DISPONÍVEIS
// =====================================

/**
 * @swagger
 * /api/atletas/disponiveis:
 *   get:
 *     tags: [Atletas]
 *     summary: Listar atletas disponíveis
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Operação realizada
 *       '400':
 *         description: Dados inválidos
 *       '401':
 *         description: Autenticação necessária
 *       '500':
 *         description: Erro interno
 */
router.get(
    '/disponiveis',
    autenticar,
    listarAtletasDisponiveis
);

// =====================================
// LISTAR ATLETAS
// =====================================

/**
 * @swagger
 * /api/atletas:
 *   get:
 *     tags: [Atletas]
 *     summary: Listar atletas
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Operação realizada
 *       '400':
 *         description: Dados inválidos
 *       '401':
 *         description: Autenticação necessária
 *       '500':
 *         description: Erro interno
 */
router.get(
    '/',
    autenticar,
    listarAtletas
);

// =====================================
// CRIAR ATLETA
// =====================================

/**
 * @swagger
 * /api/atletas:
 *   post:
 *     tags: [Atletas]
 *     summary: Cadastrar atleta
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *               cpf:
 *                 type: string
 *               categoria:
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
 *       '500':
 *         description: Erro interno
 */
router.post(
    '/',
    autenticar,
    criarAtleta
);

// =====================================
// PARTIDAS DO ATLETA
// =====================================

/**
 * @swagger
 * /api/atletas/{id}/partidas:
 *   get:
 *     tags: [Atletas]
 *     summary: Listar partidas do atleta
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
router.get(
    '/:id/partidas',
    autenticar,
    listarPartidasDoAtleta
);

// =====================================
// DOCUMENTOS
// =====================================

/**
 * @swagger
 * /api/atletas/{id}/documentos:
 *   post:
 *     tags: [Atletas]
 *     summary: Enviar documento PDF
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
router.post(
    '/:id/documentos',
    autenticar,
    uploadDocumento.single('arquivo'),
    adicionarDocumento
);

// =====================================
// BUSCAR ATLETA
// =====================================

/**
 * @swagger
 * /api/atletas/{id}:
 *   get:
 *     tags: [Atletas]
 *     summary: Buscar atleta
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
router.get(
    '/:id',
    autenticar,
    buscarAtleta
);

// =====================================
// ATUALIZAR ATLETA
// =====================================

/**
 * @swagger
 * /api/atletas/{id}:
 *   put:
 *     tags: [Atletas]
 *     summary: Atualizar atleta
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
router.put(
    '/:id',
    autenticar,
    atualizarAtleta
);

// =====================================
// EXCLUIR ATLETA
// =====================================

/**
 * @swagger
 * /api/atletas/{id}:
 *   delete:
 *     tags: [Atletas]
 *     summary: Excluir atleta
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
router.delete(
    '/:id',
    autenticar,
    excluirAtleta
);

// =====================================
// EXPORTAR ROTAS
// =====================================

module.exports = router;
