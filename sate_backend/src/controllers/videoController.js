
const fs = require('fs');
const path = require('path');

const prisma = require('../lib/prisma');

const PASTA_VIDEOS = path.resolve(
  __dirname,
  '../../uploads/videos'
);

// ============================================================
// TREINADOR LOGADO
// ============================================================

async function obterTreinadorLogado(req) {
  const usuarioId = Number(req.usuario?.id);

  if (!Number.isSafeInteger(usuarioId) || usuarioId <= 0) {
    return null;
  }

  return prisma.treinador.findUnique({
    where: { usuarioId },
  });
}

// ============================================================
// VERIFICAR ACESSO A UM VÍDEO
// ============================================================

async function buscarVideoDoTreinador(videoId, treinadorId) {
  return prisma.videoPartida.findFirst({
    where: {
      id: videoId,
      partida: {
        equipe: {
          treinadorId,
        },
      },
    },
  });
}

// ============================================================
// LISTAR VÍDEOS DA PARTIDA
// GET /api/partidas/:partidaId/videos
// ============================================================

async function listarVideos(req, res) {
  try {
    const partidaId = Number(req.params.partidaId);

    if (!Number.isSafeInteger(partidaId) || partidaId <= 0) {
      return res.status(400).json({
        mensagem: 'ID da partida inválido.',
      });
    }

    const treinador = await obterTreinadorLogado(req);

    if (!treinador) {
      return res.status(401).json({
        mensagem: 'Treinador não identificado.',
      });
    }

    const partida = await prisma.partida.findFirst({
      where: {
        id: partidaId,
        equipe: {
          treinadorId: treinador.id,
        },
      },
      select: { id: true },
    });

    if (!partida) {
      return res.status(404).json({
        mensagem: 'Partida não encontrada.',
      });
    }

    const videos = await prisma.videoPartida.findMany({
      where: { partidaId },
      include: {
        marcacoes: {
          orderBy: { tempoInicio: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json(videos);
  } catch (error) {
    console.error('ERRO AO LISTAR VÍDEOS:', error);

    return res.status(500).json({
      mensagem: 'Erro ao buscar vídeos.',
    });
  }
}

// ============================================================
// ADICIONAR VÍDEO
// POST /api/partidas/:partidaId/videos
// ============================================================

async function adicionarVideo(req, res) {
  let arquivoCriado = req.file?.path;

  try {
    const partidaId = Number(req.params.partidaId);

    if (!Number.isSafeInteger(partidaId) || partidaId <= 0) {
      return res.status(400).json({
        mensagem: 'ID da partida inválido.',
      });
    }

    if (!req.file) {
      return res.status(400).json({
        mensagem: 'Nenhum vídeo foi enviado.',
      });
    }

    const treinador = await obterTreinadorLogado(req);

    if (!treinador) {
      return res.status(401).json({
        mensagem: 'Treinador não identificado.',
      });
    }

    const partida = await prisma.partida.findFirst({
      where: {
        id: partidaId,
        equipe: {
          treinadorId: treinador.id,
        },
      },
      select: { id: true },
    });

    if (!partida) {
      return res.status(404).json({
        mensagem: 'Partida não encontrada.',
      });
    }

    const titulo = String(
      req.body.titulo || req.file.originalname
    ).trim();

    if (!titulo || titulo.length > 120) {
      return res.status(400).json({
        mensagem: 'Informe um título de até 120 caracteres.',
      });
    }

    const video = await prisma.videoPartida.create({
      data: {
        partidaId: partida.id,
        titulo,
        nomeArquivo: req.file.filename,
        url: `/uploads/videos/${req.file.filename}`,
        tipo: 'Vídeo',
        tamanho: req.file.size,
      },
    });

    // O arquivo agora pertence ao registro salvo.
    arquivoCriado = null;

    return res.status(201).json({
      mensagem: 'Vídeo adicionado com sucesso.',
      video,
    });
  } catch (error) {
    console.error('ERRO AO ADICIONAR VÍDEO:', error);

    return res.status(500).json({
      mensagem: 'Erro ao adicionar vídeo.',
    });
  } finally {
    if (arquivoCriado) {
      try {
        fs.unlinkSync(arquivoCriado);
      } catch (erroArquivo) {
        console.error(
          'Não foi possível remover o upload temporário:',
          erroArquivo.message
        );
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
    const id = Number(req.params.id);

    if (!Number.isSafeInteger(id) || id <= 0) {
      return res.status(400).json({
        mensagem: 'ID do vídeo inválido.',
      });
    }

    const treinador = await obterTreinadorLogado(req);

    if (!treinador) {
      return res.status(401).json({
        mensagem: 'Treinador não identificado.',
      });
    }

    const video = await buscarVideoDoTreinador(
      id,
      treinador.id
    );

    if (!video) {
      return res.status(404).json({
        mensagem: 'Vídeo não encontrado.',
      });
    }

    await prisma.videoPartida.delete({
      where: { id },
    });

    const caminhoArquivo = path.join(
      PASTA_VIDEOS,
      path.basename(video.nomeArquivo)
    );

    try {
      await fs.promises.unlink(caminhoArquivo);
    } catch (erroArquivo) {
      if (erroArquivo.code !== 'ENOENT') {
        console.error(
          'ERRO AO EXCLUIR ARQUIVO:',
          erroArquivo
        );
      }
    }

    return res.status(200).json({
      mensagem: 'Vídeo excluído com sucesso.',
    });
  } catch (error) {
    console.error('ERRO AO EXCLUIR VÍDEO:', error);

    return res.status(500).json({
      mensagem: 'Erro ao excluir vídeo.',
    });
  }
}

// ============================================================
// LISTAR MARCAÇÕES
// GET /api/videos/:videoId/marcacoes
// ============================================================

async function listarMarcacoes(req, res) {
  try {
    const videoId = Number(req.params.videoId);

    if (!Number.isSafeInteger(videoId) || videoId <= 0) {
      return res.status(400).json({
        mensagem: 'ID do vídeo inválido.',
      });
    }

    const treinador = await obterTreinadorLogado(req);

    if (!treinador) {
      return res.status(401).json({
        mensagem: 'Treinador não identificado.',
      });
    }

    const video = await buscarVideoDoTreinador(
      videoId,
      treinador.id
    );

    if (!video) {
      return res.status(404).json({
        mensagem: 'Vídeo não encontrado.',
      });
    }

    const marcacoes = await prisma.marcacaoVideo.findMany({
      where: { videoId },
      orderBy: { tempoInicio: 'asc' },
    });

    return res.status(200).json(marcacoes);
  } catch (error) {
    console.error('ERRO AO LISTAR MARCAÇÕES:', error);

    return res.status(500).json({
      mensagem: 'Erro ao buscar marcações.',
    });
  }
}

// ============================================================
// VALIDAR DADOS DE UMA MARCAÇÃO
// ============================================================

function validarDadosMarcacao(body) {
  const titulo = String(body.titulo || '').trim();
  const categoria = String(body.categoria || '').trim();
  const tempoInicio = Number(body.tempoInicio);
  const tempoFim = Number(body.tempoFim);
  const observacao = body.observacao == null
    ? null
    : String(body.observacao).trim();

  if (!titulo || titulo.length > 120) {
    return {
      erro: 'Informe um título de até 120 caracteres.',
    };
  }

  if (!categoria || categoria.length > 80) {
    return {
      erro: 'Informe uma categoria de até 80 caracteres.',
    };
  }

  if (
    !Number.isFinite(tempoInicio) ||
    !Number.isFinite(tempoFim) ||
    tempoInicio < 0 ||
    tempoFim <= tempoInicio
  ) {
    return {
      erro: 'O tempo final deve ser maior que o tempo inicial, e ambos não podem ser negativos.',
    };
  }

  if (observacao && observacao.length > 5000) {
    return {
      erro: 'A observação deve ter no máximo 5000 caracteres.',
    };
  }

  return {
    dados: {
      titulo,
      categoria,
      tempoInicio,
      tempoFim,
      observacao: observacao || null,
    },
  };
}

// ============================================================
// CRIAR MARCAÇÃO
// POST /api/videos/:videoId/marcacoes
// ============================================================

async function adicionarMarcacao(req, res) {
  try {
    const videoId = Number(req.params.videoId);

    if (!Number.isSafeInteger(videoId) || videoId <= 0) {
      return res.status(400).json({
        mensagem: 'ID do vídeo inválido.',
      });
    }

    const validacao = validarDadosMarcacao(req.body);

    if (validacao.erro) {
      return res.status(400).json({
        mensagem: validacao.erro,
      });
    }

    const treinador = await obterTreinadorLogado(req);

    if (!treinador) {
      return res.status(401).json({
        mensagem: 'Treinador não identificado.',
      });
    }

    const video = await buscarVideoDoTreinador(
      videoId,
      treinador.id
    );

    if (!video) {
      return res.status(404).json({
        mensagem: 'Vídeo não encontrado.',
      });
    }

    const marcacao = await prisma.marcacaoVideo.create({
      data: {
        videoId,
        ...validacao.dados,
      },
    });

    return res.status(201).json({
      mensagem: 'Marcação criada com sucesso.',
      marcacao,
    });
  } catch (error) {
    console.error('ERRO AO CRIAR MARCAÇÃO:', error);

    return res.status(500).json({
      mensagem: 'Erro ao salvar marcação.',
    });
  }
}

// ============================================================
// EDITAR MARCAÇÃO
// PUT /api/marcacoes/:id
// ============================================================

async function editarMarcacao(req, res) {
  try {
    const id = Number(req.params.id);

    if (!Number.isSafeInteger(id) || id <= 0) {
      return res.status(400).json({
        mensagem: 'ID da marcação inválido.',
      });
    }

    const validacao = validarDadosMarcacao(req.body);

    if (validacao.erro) {
      return res.status(400).json({
        mensagem: validacao.erro,
      });
    }

    const treinador = await obterTreinadorLogado(req);

    if (!treinador) {
      return res.status(401).json({
        mensagem: 'Treinador não identificado.',
      });
    }

    const marcacaoExistente = await prisma.marcacaoVideo.findFirst({
      where: {
        id,
        video: {
          partida: {
            equipe: {
              treinadorId: treinador.id,
            },
          },
        },
      },
    });

    if (!marcacaoExistente) {
      return res.status(404).json({
        mensagem: 'Marcação não encontrada.',
      });
    }

    const marcacao = await prisma.marcacaoVideo.update({
      where: { id },
      data: validacao.dados,
    });

    return res.status(200).json({
      mensagem: 'Marcação atualizada com sucesso.',
      marcacao,
    });
  } catch (error) {
    console.error('ERRO AO EDITAR MARCAÇÃO:', error);

    return res.status(500).json({
      mensagem: 'Erro ao atualizar marcação.',
    });
  }
}

// ============================================================
// EXCLUIR MARCAÇÃO
// DELETE /api/marcacoes/:id
// ============================================================

async function excluirMarcacao(req, res) {
  try {
    const id = Number(req.params.id);

    if (!Number.isSafeInteger(id) || id <= 0) {
      return res.status(400).json({
        mensagem: 'ID da marcação inválido.',
      });
    }

    const treinador = await obterTreinadorLogado(req);

    if (!treinador) {
      return res.status(401).json({
        mensagem: 'Treinador não identificado.',
      });
    }

    const marcacao = await prisma.marcacaoVideo.findFirst({
      where: {
        id,
        video: {
          partida: {
            equipe: {
              treinadorId: treinador.id,
            },
          },
        },
      },
    });

    if (!marcacao) {
      return res.status(404).json({
        mensagem: 'Marcação não encontrada.',
      });
    }

    await prisma.marcacaoVideo.delete({
      where: { id },
    });

    return res.status(200).json({
      mensagem: 'Marcação excluída com sucesso.',
    });
  } catch (error) {
    console.error('ERRO AO EXCLUIR MARCAÇÃO:', error);

    return res.status(500).json({
      mensagem: 'Erro ao excluir marcação.',
    });
  }
}

module.exports = {
  listarVideos,
  adicionarVideo,
  excluirVideo,
  listarMarcacoes,
  adicionarMarcacao,
  editarMarcacao,
  excluirMarcacao,
};
