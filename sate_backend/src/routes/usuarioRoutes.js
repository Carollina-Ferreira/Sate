const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const authMiddleware = require('../middleware/authMiddleware');

const {
  atualizarPerfil,
  buscarPerfil,
} = require('../controllers/usuarioController');

const router = express.Router();

/*
 * Pasta onde as fotos serão armazenadas.
 */
const uploadDir = path.join(
  __dirname,
  '../../uploads/perfil'
);

/*
 * Cria a pasta automaticamente se ela não existir.
 */
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, {
    recursive: true,
  });
}

/*
 * Configuração do armazenamento.
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const extensao = path.extname(file.originalname);

    const nomeArquivo = `usuario-${req.usuario.id}-${Date.now()}${extensao}`;

    cb(null, nomeArquivo);
  },
});

/*
 * Permite somente imagens.
 */
const fileFilter = (req, file, cb) => {
  const tiposPermitidos = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/jpg',
  ];

  if (tiposPermitidos.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        'Formato de imagem não permitido. Use JPG, PNG ou WEBP.'
      )
    );
  }
};

/*
 * Limite de 5 MB.
 */
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

/*
 * GET
 * Retorna perfil do usuário logado.
 */
/**
 * @swagger
 * /api/usuarios/perfil:
 *   get:
 *     tags: [Usuários]
 *     summary: Consultar perfil
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
  '/perfil',
  authMiddleware,
  buscarPerfil
);

/*
 * PUT
 * Atualiza nome, e-mail e foto.
 */
/**
 * @swagger
 * /api/usuarios/perfil:
 *   put:
 *     tags: [Usuários]
 *     summary: Atualizar perfil
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *               avatar:
 *                 type: string
 *                 format: binary
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
router.put(
  '/perfil',
  authMiddleware,
  upload.single('avatar'),
  atualizarPerfil
);

module.exports = router;