const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const fsp = require('fs/promises');
const { randomUUID } = require('crypto');

const prisma = require('../lib/prisma');
const autenticar = require('../middleware/authMiddleware');

// A pasta é a mesma exposta em /uploads pelo server.js.
const PASTA_VIDEOS = path.resolve(__dirname, '../../uploads/videos');
// Os metadados ficam FORA da pasta pública /uploads.
const ARQUIVO_REGISTROS = path.resolve(__dirname, '../../data/videos.json');
fs.mkdirSync(PASTA_VIDEOS, { recursive: true });

// Gravações serializadas para evitar conflitos de IDs e de arquivo JSON.
let fila = Promise.resolve();
function executarEmFila(operacao) {
    const resultado = fila.then(operacao);
    fila = resultado.then(() => undefined, () => undefined);
    return resultado;
}

async function lerRegistros() {
    try {
        const conteudo = await fsp.readFile(ARQUIVO_REGISTROS, 'utf8');
        const dados = JSON.parse(conteudo);
        if (!Array.isArray(dados)) {
            throw new Error('Arquivo de registros de vídeos inválido.');
        }
        return dados;
    } catch (erro) {
        if (erro.code === 'ENOENT') return [];
        throw erro;
    }
}

async function salvarRegistros(registros) {
    await fsp.mkdir(path.dirname(ARQUIVO_REGISTROS), { recursive: true });
    const temporario = `${ARQUIVO_REGISTROS}.${randomUUID()}.tmp`;
    try {
        await fsp.writeFile(temporario, JSON.stringify(registros, null, 2), 'utf8');
        await fsp.rename(temporario, ARQUIVO_REGISTROS);
    } finally {
        await fsp.unlink(temporario).catch(() => {});
    }
}

const extensoesPermitidas = new Set([
    '.mp4', '.webm', '.mov', '.m4v', '.ogv', '.avi', '.mkv'
]);

const upload = multer({
    storage: multer.diskStorage({
        destination(req, arquivo, callback) {
            callback(null, PASTA_VIDEOS);
        },
        filename(req, arquivo, callback) {
            const extensao = path.extname(arquivo.originalname).toLowerCase();
            callback(null, `${randomUUID()}${extensao}`);
        }
    }),
    limits: { fileSize: 500 * 1024 * 1024 },
    fileFilter(req, arquivo, callback) {
        const extensao = path.extname(arquivo.originalname).toLowerCase();
        if (!arquivo.mimetype.startsWith('video/') || !extensoesPermitidas.has(extensao)) {
            const erro = new Error('Envie um vídeo MP4, WebM, MOV, M4V, OGV, AVI ou MKV.');
            erro.status = 400;
            return callback(erro);
        }
        callback(null, true);
    }
});

async function partidaPertenceAoTreinador(req, partidaId) {
    const usuarioId = Number(req.usuario?.id);
    if (!Number.isSafeInteger(usuarioId) || usuarioId <= 0) return false;

    const treinador = await prisma.treinador.findUnique({
        where: { usuarioId }
    });
    if (!treinador) return false;

    const partida = await prisma.partida.findFirst({
        where: {
            id: partidaId,
            equipe: { treinadorId: treinador.id }
        },
        select: { id: true }
    });
    return Boolean(partida);
}

async function validarPartida(req, res, next) {
    try {
        const partidaId = Number(req.params.id);
        if (!Number.isSafeInteger(partidaId) || partidaId <= 0) {
            return res.status(400).json({ mensagem: 'ID de partida inválido.' });
        }

        if (!(await partidaPertenceAoTreinador(req, partidaId))) {
            return res.status(404).json({ mensagem: 'Partida não encontrada.' });
        }

        req.partidaValidadaId = partidaId;
        next();
    } catch (erro) {
        next(erro);
    }
}

const partidaVideoRoutes = express.Router();
const videoRoutes = express.Router();

// GET /api/partidas/:id/videos
partidaVideoRoutes.get('/:id/videos', autenticar, validarPartida, async (req, res, next) => {
    try {
        const registros = await executarEmFila(lerRegistros);
        const videos = registros.filter((video) => video.partidaId === req.partidaValidadaId);
        return res.status(200).json({ videos });
    } catch (erro) {
        next(erro);
    }
});

// POST /api/partidas/:id/videos
// A autorização ocorre ANTES da gravação do arquivo no disco.
partidaVideoRoutes.post(
    '/:id/videos',
    autenticar,
    validarPartida,
    upload.single('arquivo'),
    async (req, res, next) => {
        if (!req.file) {
            return res.status(400).json({ mensagem: 'Selecione um arquivo de vídeo.' });
        }

        const titulo = String(req.body.titulo || '').trim();
        if (!titulo || titulo.length > 120) {
            await fsp.unlink(req.file.path).catch(() => {});
            return res.status(400).json({ mensagem: 'Informe um título de até 120 caracteres.' });
        }

        try {
            const video = await executarEmFila(async () => {
                const registros = await lerRegistros();
                const proximoId = registros.reduce((maior, atual) => Math.max(maior, atual.id || 0), 0) + 1;
                const novo = {
                    id: proximoId,
                    partidaId: req.partidaValidadaId,
                    titulo,
                    url: `/uploads/videos/${req.file.filename}`,
                    nomeArquivo: req.file.filename,
                    tamanho: req.file.size,
                    tipo: 'Vídeo',
                    createdAt: new Date().toISOString()
                };
                await salvarRegistros([...registros, novo]);
                return novo;
            });

            return res.status(201).json({
                mensagem: 'Vídeo adicionado com sucesso.',
                video
            });
        } catch (erro) {
            await fsp.unlink(req.file.path).catch(() => {});
            next(erro);
        }
    }
);

// DELETE /api/videos/:id
videoRoutes.delete('/:id', autenticar, async (req, res, next) => {
    try {
        const videoId = Number(req.params.id);
        if (!Number.isSafeInteger(videoId) || videoId <= 0) {
            return res.status(400).json({ mensagem: 'ID de vídeo inválido.' });
        }

        const registros = await executarEmFila(lerRegistros);
        const video = registros.find((item) => item.id === videoId);
        if (!video) {
            return res.status(404).json({ mensagem: 'Vídeo não encontrado.' });
        }

        if (!(await partidaPertenceAoTreinador(req, video.partidaId))) {
            return res.status(404).json({ mensagem: 'Vídeo não encontrado.' });
        }

        const removido = await executarEmFila(async () => {
            const atuais = await lerRegistros();
            const existente = atuais.find((item) => item.id === videoId);
            if (!existente) return null;
            await salvarRegistros(atuais.filter((item) => item.id !== videoId));
            return existente;
        });

        if (!removido) {
            return res.status(404).json({ mensagem: 'Vídeo não encontrado.' });
        }

        const caminho = path.join(PASTA_VIDEOS, path.basename(removido.nomeArquivo));
        try {
            await fsp.unlink(caminho);
        } catch (erro) {
            if (erro.code !== 'ENOENT') {
                console.error('Não foi possível remover arquivo físico:', erro);
            }
        }

        return res.status(200).json({ mensagem: 'Vídeo excluído com sucesso.' });
    } catch (erro) {
        next(erro);
    }
});

module.exports = { partidaVideoRoutes, videoRoutes };