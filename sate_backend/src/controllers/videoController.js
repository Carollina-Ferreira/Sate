const fs = require('fs');
const path = require('path');

const prisma = require('../lib/prisma');


// ============================================================
// PEGAR TREINADOR LOGADO
// ============================================================

async function obterTreinadorLogado(req) {
    const usuarioId = req.usuario?.id;

    if (!usuarioId) {
        return null;
    }

    const treinador =
        await prisma.treinador.findUnique({
            where: {
                usuarioId: Number(usuarioId)
            }
        });

    return treinador;
}


// ============================================================
// LISTAR VÍDEOS DA PARTIDA
// GET /api/partidas/:partidaId/videos
// ============================================================

async function listarVideos(req, res) {
    try {

        const partidaId =
            Number(req.params.partidaId);


        if (Number.isNaN(partidaId)) {
            return res.status(400).json({
                mensagem:
                    'ID da partida inválido.'
            });
        }


        const treinador =
            await obterTreinadorLogado(req);


        if (!treinador) {
            return res.status(401).json({
                mensagem:
                    'Treinador não identificado.'
            });
        }


        // ====================================================
        // VERIFICAR SE A PARTIDA PERTENCE AO TREINADOR
        // ====================================================

        const partida =
            await prisma.partida.findFirst({
                where: {
                    id: partidaId,

                    equipe: {
                        treinadorId:
                            treinador.id
                    }
                }
            });


        if (!partida) {
            return res.status(404).json({
                mensagem:
                    'Partida não encontrada.'
            });
        }


        // ====================================================
        // BUSCAR VÍDEOS
        // ====================================================

        const videos =
            await prisma.videoPartida.findMany({
                where: {
                    partidaId
                },

                orderBy: {
                    createdAt: 'desc'
                }
            });


        return res
            .status(200)
            .json(videos);


    } catch (error) {

        console.error(
            'ERRO AO LISTAR VÍDEOS:',
            error
        );


        return res.status(500).json({
            mensagem:
                'Erro ao buscar vídeos.',

            erro:
                error.message
        });
    }
}


// ============================================================
// ADICIONAR VÍDEO
// POST /api/partidas/:partidaId/videos
// ============================================================

async function adicionarVideo(req, res) {
    try {

        const partidaId =
            Number(req.params.partidaId);


        if (Number.isNaN(partidaId)) {
            return res.status(400).json({
                mensagem:
                    'ID da partida inválido.'
            });
        }


        // ====================================================
        // VERIFICAR ARQUIVO
        // ====================================================

        if (!req.file) {
            return res.status(400).json({
                mensagem:
                    'Nenhum vídeo foi enviado.'
            });
        }


        // ====================================================
        // PEGAR TREINADOR
        // ====================================================

        const treinador =
            await obterTreinadorLogado(req);


        if (!treinador) {

            if (req.file.path) {
                try {
                    fs.unlinkSync(
                        req.file.path
                    );
                } catch {}
            }


            return res.status(401).json({
                mensagem:
                    'Treinador não identificado.'
            });
        }


        // ====================================================
        // VERIFICAR PARTIDA
        // ====================================================

        const partida =
            await prisma.partida.findFirst({
                where: {
                    id: partidaId,

                    equipe: {
                        treinadorId:
                            treinador.id
                    }
                }
            });


        if (!partida) {

            if (req.file.path) {
                try {
                    fs.unlinkSync(
                        req.file.path
                    );
                } catch {}
            }


            return res.status(404).json({
                mensagem:
                    'Partida não encontrada.'
            });
        }


        // ====================================================
        // DADOS DO VÍDEO
        // ====================================================

        const titulo =
            req.body.titulo &&
            String(req.body.titulo).trim()
                ? String(req.body.titulo).trim()
                : req.file.originalname;


        const tipo =
            req.body.tipo &&
            String(req.body.tipo).trim()
                ? String(req.body.tipo).trim()
                : 'Vídeo';


        const nomeArquivo =
            req.file.filename;


        const url =
            `/uploads/videos/${nomeArquivo}`;


        // ====================================================
        // SALVAR NO BANCO
        // ====================================================

        const video =
            await prisma.videoPartida.create({
                data: {

                    titulo:
                        titulo,

                    nomeArquivo:
                        nomeArquivo,

                    url:
                        url,

                    tipo:
                        tipo,

                    tamanho:
                        req.file.size,

                    partidaId:
                        partida.id
                }
            });


        return res
            .status(201)
            .json({
                mensagem:
                    'Vídeo adicionado com sucesso.',

                video
            });


    } catch (error) {

        console.error(
            'ERRO AO ADICIONAR VÍDEO:',
            error
        );


        // ====================================================
        // REMOVER ARQUIVO SE DER ERRO
        // ====================================================

        if (req.file?.path) {
            try {
                fs.unlinkSync(
                    req.file.path
                );
            } catch {}
        }


        return res.status(500).json({
            mensagem:
                'Erro ao adicionar vídeo.',

            erro:
                error.message
        });
    }
}


// ============================================================
// EXCLUIR VÍDEO
// DELETE /api/videos/:id
// ============================================================

async function excluirVideo(req, res) {
    try {

        const id =
            Number(req.params.id);


        if (Number.isNaN(id)) {
            return res.status(400).json({
                mensagem:
                    'ID do vídeo inválido.'
            });
        }


        const treinador =
            await obterTreinadorLogado(req);


        if (!treinador) {
            return res.status(401).json({
                mensagem:
                    'Treinador não identificado.'
            });
        }


        // ====================================================
        // BUSCAR VÍDEO
        // ====================================================

        const video =
            await prisma.videoPartida.findFirst({
                where: {

                    id,

                    partida: {

                        equipe: {

                            treinadorId:
                                treinador.id
                        }
                    }
                }
            });


        if (!video) {
            return res.status(404).json({
                mensagem:
                    'Vídeo não encontrado.'
            });
        }


        // ====================================================
        // EXCLUIR DO BANCO
        // ====================================================

        await prisma.videoPartida.delete({
            where: {
                id
            }
        });


        // ====================================================
        // EXCLUIR ARQUIVO FÍSICO
        // ====================================================

        const caminhoArquivo =
            path.join(
                __dirname,
                '../../uploads/videos',
                video.nomeArquivo
            );


        if (
            fs.existsSync(
                caminhoArquivo
            )
        ) {

            try {

                fs.unlinkSync(
                    caminhoArquivo
                );

            } catch (erroArquivo) {

                console.error(
                    'ERRO AO EXCLUIR ARQUIVO:',
                    erroArquivo
                );

            }
        }


        return res.status(200).json({
            mensagem:
                'Vídeo excluído com sucesso.'
        });


    } catch (error) {

        console.error(
            'ERRO AO EXCLUIR VÍDEO:',
            error
        );


        return res.status(500).json({
            mensagem:
                'Erro ao excluir vídeo.',

            erro:
                error.message
        });
    }
}


// ============================================================
// EXPORTAR
// ============================================================

module.exports = {
    listarVideos,
    adicionarVideo,
    excluirVideo
};