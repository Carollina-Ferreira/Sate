
const fs = require('fs');
const path = require('path');
const prisma = require('../lib/prisma');

const PASTA_VIDEOS = path.resolve(
    __dirname,
    '../../uploads/videos'
);

const TAMANHO_MAXIMO_TITULO = 120;
const TAMANHO_MAXIMO_CATEGORIA = 80;
const TAMANHO_MAXIMO_OBSERVACAO = 5000;

// ============================================================
// FUNÇÕES AUXILIARES
// ============================================================

function obterIdValido(valor) {
    const id = Number(valor);

    return Number.isSafeInteger(id) && id > 0 ? id : null;
}

async function obterTreinadorLogado(req) {
    const usuarioId = obterIdValido(req.usuario?.id);

    if (!usuarioId) {
        return null;
    }

    return prisma.treinador.findUnique({
        where: { usuarioId }
    });
}

function normalizarTexto(valor) {
    return typeof valor === 'string' ? valor.trim() : '';
}

// ============================================================
// BUSCAR VÍDEO PERTENCENTE AO TREINADOR
// ============================================================

async function buscarVideoDoTreinador(videoId, treinadorId) {
    return prisma.videoPartida.findFirst({
        where: {
            id: videoId,
            partida: {
                equipe: {
                    treinadorId
                }
            }
        }
    });
}

// ============================================================
// LISTAR VÍDEOS DA PARTIDA
// GET /api/partidas/:partidaId/videos
// ============================================================

async function listarVideos(req, res) {
    try {
        const partidaId = obterIdValido(req.params.partidaId);

        if (!partidaId) {
            return res.status(400).json({
                mensagem: 'ID da partida inválido.'
            });
        }

        const treinador = await obterTreinadorLogado(req);

        if (!treinador) {
            return res.status(401).json({
                mensagem: 'Treinador não identificado.'
            });
        }

        const partida = await prisma.partida.findFirst({
            where: {
                id: partidaId,
                equipe: {
                    treinadorId: treinador.id
                }
            },
            select: {
                id: true
            }
        });

        if (!partida) {
            return res.status(404).json({
                mensagem: 'Partida não encontrada.'
            });
        }

        const videos = await prisma.videoPartida.findMany({
            where: { partidaId },
            include: {
                marcacoes: {
                    include: {
                        atleta: {
                            select: {
                                id: true,
                                nome: true,
                                usuario: {
                                    select: {
                                        nome: true
                                    }
                                }
                            }
                        }
                    },
                    orderBy: {
                        tempoInicio: 'asc'
                    }
                },
                _count: {
                    select: {
                        marcacoes: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return res.status(200).json(videos);
    } catch (error) {
        console.error('ERRO AO LISTAR VÍDEOS:', error);

        return res.status(500).json({
            mensagem: 'Erro ao buscar vídeos.'
        });
    }
}

// ============================================================
// ADICIONAR VÍDEO
// POST /api/partidas/:partidaId/videos
// ============================================================

async function adicionarVideo(req, res) {
    let arquivoTemporario = req.file?.path;

    try {
        const partidaId = obterIdValido(req.params.partidaId);

        if (!partidaId) {
            return res.status(400).json({
                mensagem: 'ID da partida inválido.'
            });
        }

        if (!req.file) {
            return res.status(400).json({
                mensagem: 'Nenhum vídeo foi enviado.'
            });
        }

        const treinador = await obterTreinadorLogado(req);

        if (!treinador) {
            return res.status(401).json({
                mensagem: 'Treinador não identificado.'
            });
        }

        const partida = await prisma.partida.findFirst({
            where: {
                id: partidaId,
                equipe: {
                    treinadorId: treinador.id
                }
            },
            select: {
                id: true
            }
        });

        if (!partida) {
            return res.status(404).json({
                mensagem: 'Partida não encontrada.'
            });
        }

        const tituloInformado = normalizarTexto(req.body?.titulo);
        const titulo = tituloInformado || path.parse(req.file.originalname || 'Vídeo').name;

        if (
            !titulo ||
            titulo.length > TAMANHO_MAXIMO_TITULO
        ) {
            return res.status(400).json({
                mensagem: 'Informe um título de até 120 caracteres.'
            });
        }

        const nomeArquivo = path.basename(req.file.filename || '');

        if (!nomeArquivo) {
            return res.status(400).json({
                mensagem: 'Nome do arquivo enviado inválido.'
            });
        }

        const video = await prisma.videoPartida.create({
            data: {
                partidaId,
                titulo,
                nomeArquivo,
                url: `/uploads/videos/${nomeArquivo}`,
                tipo: req.file.mimetype || 'video/mp4',
                tamanho: Number.isSafeInteger(req.file.size)
                    ? req.file.size
                    : null
            }
        });

        // O arquivo agora está associado ao registro do banco.
        arquivoTemporario = null;

        return res.status(201).json({
            mensagem: 'Vídeo adicionado com sucesso.',
            video
        });
    } catch (error) {
        console.error('ERRO AO ADICIONAR VÍDEO:', error);

        return res.status(500).json({
            mensagem: 'Erro ao adicionar vídeo.'
        });
    } finally {
        // Remove o arquivo se o registro não foi salvo.
        if (arquivoTemporario) {
            try {
                await fs.promises.unlink(arquivoTemporario);
            } catch (erroArquivo) {
                if (erroArquivo.code !== 'ENOENT') {
                    console.error(
                        'ERRO AO REMOVER UPLOAD TEMPORÁRIO:',
                        erroArquivo.message
                    );
                }
            }
        }
    }
}

// ============================================================
// EXCLUIR VÍDEO
// DELETE /api/videos/:id
// ============================================================

async function excluirVideo(req, res) {
    try {
        const id = obterIdValido(req.params.id);

        if (!id) {
            return res.status(400).json({
                mensagem: 'ID do vídeo inválido.'
            });
        }

        const treinador = await obterTreinadorLogado(req);

        if (!treinador) {
            return res.status(401).json({
                mensagem: 'Treinador não identificado.'
            });
        }

        const video = await buscarVideoDoTreinador(
            id,
            treinador.id
        );

        if (!video) {
            return res.status(404).json({
                mensagem: 'Vídeo não encontrado.'
            });
        }

        // Exclui primeiro o registro e suas marcações relacionadas.
        await prisma.videoPartida.delete({
            where: { id }
        });

        const nomeArquivo = path.basename(video.nomeArquivo || '');
        const caminhoArquivo = path.join(
            PASTA_VIDEOS,
            nomeArquivo
        );

        try {
            await fs.promises.unlink(caminhoArquivo);
        } catch (erroArquivo) {
            if (erroArquivo.code !== 'ENOENT') {
                console.error(
                    'ERRO AO EXCLUIR ARQUIVO DE VÍDEO:',
                    erroArquivo.message
                );
            }
        }

        return res.status(200).json({
            mensagem: 'Vídeo excluído com sucesso.'
        });
    } catch (error) {
        console.error('ERRO AO EXCLUIR VÍDEO:', error);

        return res.status(500).json({
            mensagem: 'Erro ao excluir vídeo.'
        });
    }
}

// ============================================================
// VALIDAR DADOS DE MARCAÇÃO
// ============================================================

function validarDadosMarcacao(body) {
    const titulo = normalizarTexto(body?.titulo);
    const categoria = normalizarTexto(body?.categoria);

    const tempoInicio = Number(body?.tempoInicio);
    const tempoFim = Number(body?.tempoFim);

    const observacao = body?.observacao == null
        ? null
        : String(body.observacao).trim();

    if (!titulo || titulo.length > TAMANHO_MAXIMO_TITULO) {
        return {
            erro: 'Informe um título de até 120 caracteres.'
        };
    }

    if (
        !categoria ||
        categoria.length > TAMANHO_MAXIMO_CATEGORIA
    ) {
        return {
            erro: 'Informe uma categoria de até 80 caracteres.'
        };
    }

    if (
        body.tempoInicio === undefined ||
        body.tempoInicio === null ||
        body.tempoInicio === '' ||
        body.tempoFim === undefined ||
        body.tempoFim === null ||
        body.tempoFim === '' ||
        !Number.isFinite(tempoInicio) ||
        !Number.isFinite(tempoFim) ||
        tempoInicio < 0 ||
        tempoFim <= tempoInicio
    ) {
        return {
            erro: 'O tempo final deve ser maior que o inicial, e ambos devem ser válidos.'
        };
    }

    if (
        observacao &&
        observacao.length > TAMANHO_MAXIMO_OBSERVACAO
    ) {
        return {
            erro: 'A observação deve ter no máximo 5000 caracteres.'
        };
    }

    let atletaId = null;

    if (
        body.atletaId !== undefined &&
        body.atletaId !== null &&
        body.atletaId !== ''
    ) {
        atletaId = obterIdValido(body.atletaId);

        if (!atletaId) {
            return {
                erro: 'ID do atleta inválido.'
            };
        }
    }

    return {
        dados: {
            titulo,
            categoria,
            tempoInicio,
            tempoFim,
            observacao: observacao || null,
            atletaId
        }
    };
}

// ============================================================
// VALIDAR ATLETA DA MARCAÇÃO
// ============================================================

async function validarAtletaDaPartida(
    atletaId,
    videoId,
    treinadorId
) {
    if (atletaId === null) {
        return true;
    }

    const atleta = await prisma.atleta.findFirst({
        where: {
            id: atletaId,
            treinadorId,
            partidas: {
                some: {
                    partida: {
                        videos: {
                            some: {
                                id: videoId
                            }
                        }
                    }
                }
            }
        },
        select: {
            id: true
        }
    });

    return Boolean(atleta);
}

// ============================================================
// LISTAR MARCAÇÕES
// GET /api/videos/:videoId/marcacoes
// ============================================================

async function listarMarcacoes(req, res) {
    try {
        const videoId = obterIdValido(req.params.videoId);

        if (!videoId) {
            return res.status(400).json({
                mensagem: 'ID do vídeo inválido.'
            });
        }

        const treinador = await obterTreinadorLogado(req);

        if (!treinador) {
            return res.status(401).json({
                mensagem: 'Treinador não identificado.'
            });
        }

        const video = await buscarVideoDoTreinador(
            videoId,
            treinador.id
        );

        if (!video) {
            return res.status(404).json({
                mensagem: 'Vídeo não encontrado.'
            });
        }

        const marcacoes = await prisma.marcacaoVideo.findMany({
            where: { videoId },
            include: {
                atleta: {
                    select: {
                        id: true,
                        nome: true,
                        usuario: {
                            select: {
                                nome: true
                            }
                        }
                    }
                }
            },
            orderBy: [
                { tempoInicio: 'asc' },
                { id: 'asc' }
            ]
        });

        return res.status(200).json(marcacoes);
    } catch (error) {
        console.error('ERRO AO LISTAR MARCAÇÕES:', error);

        return res.status(500).json({
            mensagem: 'Erro ao buscar marcações.'
        });
    }
}

// ============================================================
// CRIAR MARCAÇÃO
// POST /api/videos/:videoId/marcacoes
// ============================================================

async function adicionarMarcacao(req, res) {
    try {
        const videoId = obterIdValido(req.params.videoId);

        if (!videoId) {
            return res.status(400).json({
                mensagem: 'ID do vídeo inválido.'
            });
        }

        const validacao = validarDadosMarcacao(req.body);

        if (validacao.erro) {
            return res.status(400).json({
                mensagem: validacao.erro
            });
        }

        const treinador = await obterTreinadorLogado(req);

        if (!treinador) {
            return res.status(401).json({
                mensagem: 'Treinador não identificado.'
            });
        }

        const video = await buscarVideoDoTreinador(
            videoId,
            treinador.id
        );

        if (!video) {
            return res.status(404).json({
                mensagem: 'Vídeo não encontrado.'
            });
        }

        const atletaValido = await validarAtletaDaPartida(
            validacao.dados.atletaId,
            videoId,
            treinador.id
        );

        if (!atletaValido) {
            return res.status(400).json({
                mensagem: 'O atleta informado não está escalado nesta partida ou não pertence ao treinador.'
            });
        }

        const marcacao = await prisma.marcacaoVideo.create({
            data: {
                videoId,
                ...validacao.dados
            },
            include: {
                atleta: {
                    select: {
                        id: true,
                        nome: true
                    }
                }
            }
        });

        return res.status(201).json({
            mensagem: 'Marcação criada com sucesso.',
            marcacao
        });
    } catch (error) {
        console.error('ERRO AO CRIAR MARCAÇÃO:', error);

        return res.status(500).json({
            mensagem: 'Erro ao salvar marcação.'
        });
    }
}

// ============================================================
// EDITAR MARCAÇÃO
// PUT /api/marcacoes/:id
// ============================================================

async function editarMarcacao(req, res) {
    try {
        const id = obterIdValido(req.params.id);

        if (!id) {
            return res.status(400).json({
                mensagem: 'ID da marcação inválido.'
            });
        }

        const validacao = validarDadosMarcacao(req.body);

        if (validacao.erro) {
            return res.status(400).json({
                mensagem: validacao.erro
            });
        }

        const treinador = await obterTreinadorLogado(req);

        if (!treinador) {
            return res.status(401).json({
                mensagem: 'Treinador não identificado.'
            });
        }

        const existente = await prisma.marcacaoVideo.findFirst({
            where: {
                id,
                video: {
                    partida: {
                        equipe: {
                            treinadorId: treinador.id
                        }
                    }
                }
            },
            select: {
                id: true,
                videoId: true
            }
        });

        if (!existente) {
            return res.status(404).json({
                mensagem: 'Marcação não encontrada.'
            });
        }

        const atletaValido = await validarAtletaDaPartida(
            validacao.dados.atletaId,
            existente.videoId,
            treinador.id
        );

        if (!atletaValido) {
            return res.status(400).json({
                mensagem: 'O atleta informado não está escalado nesta partida ou não pertence ao treinador.'
            });
        }

        const marcacao = await prisma.marcacaoVideo.update({
            where: { id },
            data: validacao.dados,
            include: {
                atleta: {
                    select: {
                        id: true,
                        nome: true
                    }
                }
            }
        });

        return res.status(200).json({
            mensagem: 'Marcação atualizada com sucesso.',
            marcacao
        });
    } catch (error) {
        console.error('ERRO AO EDITAR MARCAÇÃO:', error);

        return res.status(500).json({
            mensagem: 'Erro ao atualizar marcação.'
        });
    }
}

// ============================================================
// EXCLUIR MARCAÇÃO
// DELETE /api/marcacoes/:id
// ============================================================

async function excluirMarcacao(req, res) {
    try {
        const id = obterIdValido(req.params.id);

        if (!id) {
            return res.status(400).json({
                mensagem: 'ID da marcação inválido.'
            });
        }

        const treinador = await obterTreinadorLogado(req);

        if (!treinador) {
            return res.status(401).json({
                mensagem: 'Treinador não identificado.'
            });
        }

        const marcacao = await prisma.marcacaoVideo.findFirst({
            where: {
                id,
                video: {
                    partida: {
                        equipe: {
                            treinadorId: treinador.id
                        }
                    }
                }
            },
            select: {
                id: true
            }
        });

        if (!marcacao) {
            return res.status(404).json({
                mensagem: 'Marcação não encontrada.'
            });
        }

        await prisma.marcacaoVideo.delete({
            where: { id }
        });

        return res.status(200).json({
            mensagem: 'Marcação excluída com sucesso.'
        });
    } catch (error) {
        console.error('ERRO AO EXCLUIR MARCAÇÃO:', error);

        return res.status(500).json({
            mensagem: 'Erro ao excluir marcação.'
        });
    }
}

// ============================================================
// EXPORTAR FUNÇÕES
// ============================================================

module.exports = {
    listarVideos,
    adicionarVideo,
    excluirVideo,
    listarMarcacoes,
    adicionarMarcacao,
    editarMarcacao,
    excluirMarcacao
};
