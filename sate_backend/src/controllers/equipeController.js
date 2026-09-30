const prisma = require('../lib/prisma');

// =====================================
// PEGAR O TREINADOR LOGADO
// =====================================

const obterTreinadorLogado = async (req) => {
  const usuarioId = req.usuario?.id;

  if (!usuarioId) {
    return null;
  }

  const treinador = await prisma.treinador.findUnique({
    where: {
      usuarioId: Number(usuarioId),
    },
  });

  return treinador;
};

// =====================================
// LISTAR EQUIPES DO TREINADOR LOGADO
// =====================================

const listarEquipes = async (req, res) => {
  try {
    const treinador = await obterTreinadorLogado(req);

    if (!treinador) {
      return res.status(401).json({
        mensagem: 'Treinador não identificado.',
      });
    }

    const equipes = await prisma.equipe.findMany({
      where: {
        treinadorId: treinador.id,
      },

      include: {
        atletas: {
          select: {
            id: true,
            nome: true,
            categoria: true,
            usuario: {
              select: {
                email: true,
                avatarUrl: true,
              },
            },
          },
        },

        _count: {
          select: {
            atletas: true,
          },
        },
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    const equipesFormatadas = equipes.map((equipe) => ({
      id: equipe.id,
      nome: equipe.nome,
      modalidade: equipe.modalidade,
      categoria: equipe.categoria,
      numeroAtletas: equipe._count.atletas,
      proximaPartida: equipe.proximaPartida,
      imagem: equipe.imagem,
      corEquipe: equipe.corEquipe,
      createdAt: equipe.createdAt,
      updatedAt: equipe.updatedAt,
      atletas: equipe.atletas,
    }));

    return res.status(200).json(equipesFormatadas);
  } catch (error) {
    console.error('Erro ao listar equipes:', error);

    return res.status(500).json({
      mensagem: 'Erro ao listar equipes.',
      erro: error.message,
    });
  }
};

// =====================================
// BUSCAR EQUIPE POR ID
// =====================================

const buscarEquipe = async (req, res) => {
  try {
    const treinador = await obterTreinadorLogado(req);
    const { id } = req.params;

    if (!treinador) {
      return res.status(401).json({
        mensagem: 'Treinador não identificado.',
      });
    }

    const equipe = await prisma.equipe.findFirst({
      where: {
        id: Number(id),
        treinadorId: treinador.id,
      },

      include: {
        atletas: {
          select: {
            id: true,
            nome: true,
            categoria: true,
            telefone: true,
            usuario: {
              select: {
                email: true,
                avatarUrl: true,
              },
            },
          },
        },

        _count: {
          select: {
            atletas: true,
          },
        },
      },
    });

    if (!equipe) {
      return res.status(404).json({
        mensagem: 'Equipe não encontrada.',
      });
    }

    return res.status(200).json({
      id: equipe.id,
      nome: equipe.nome,
      modalidade: equipe.modalidade,
      categoria: equipe.categoria,
      numeroAtletas: equipe._count.atletas,
      proximaPartida: equipe.proximaPartida,
      imagem: equipe.imagem,
      corEquipe: equipe.corEquipe,
      createdAt: equipe.createdAt,
      updatedAt: equipe.updatedAt,
      atletas: equipe.atletas,
    });
  } catch (error) {
    console.error('Erro ao buscar equipe:', error);

    return res.status(500).json({
      mensagem: 'Erro ao buscar equipe.',
      erro: error.message,
    });
  }
};

// =====================================
// CRIAR EQUIPE
// =====================================

const criarEquipe = async (req, res) => {
  try {
    const treinador = await obterTreinadorLogado(req);

    if (!treinador) {
      return res.status(401).json({
        mensagem: 'Treinador não identificado.',
      });
    }

    const {
      nome,
      modalidade,
      categoria,
      proximaPartida,
      imagem,
      corEquipe,
    } = req.body;

    if (!nome || !modalidade) {
      return res.status(400).json({
        mensagem: 'Nome e modalidade são obrigatórios.',
      });
    }

    const equipe = await prisma.equipe.create({
      data: {
        nome,
        modalidade,
        categoria: categoria || null,

        proximaPartida: proximaPartida
          ? new Date(proximaPartida)
          : null,

        imagem: imagem || null,
        corEquipe: corEquipe || null,

        treinadorId: treinador.id,
      },
    });

    return res.status(201).json({
      mensagem: 'Equipe criada com sucesso.',

      equipe: {
        id: equipe.id,
        nome: equipe.nome,
        modalidade: equipe.modalidade,
        categoria: equipe.categoria,
        numeroAtletas: 0,
        proximaPartida: equipe.proximaPartida,
        imagem: equipe.imagem,
        corEquipe: equipe.corEquipe,
        createdAt: equipe.createdAt,
        updatedAt: equipe.updatedAt,
      },
    });
  } catch (error) {
    console.error('Erro ao criar equipe:', error);

    return res.status(500).json({
      mensagem: 'Erro ao criar equipe.',
      erro: error.message,
    });
  }
};

// =====================================
// ATUALIZAR EQUIPE
// =====================================

const atualizarEquipe = async (req, res) => {
  try {
    const treinador = await obterTreinadorLogado(req);
    const { id } = req.params;

    if (!treinador) {
      return res.status(401).json({
        mensagem: 'Treinador não identificado.',
      });
    }

    const {
      nome,
      modalidade,
      categoria,
      proximaPartida,
      imagem,
      corEquipe,
    } = req.body;

    // =====================================
    // VERIFICAR DONO DA EQUIPE
    // =====================================

    const equipeExistente = await prisma.equipe.findFirst({
      where: {
        id: Number(id),
        treinadorId: treinador.id,
      },
    });

    if (!equipeExistente) {
      return res.status(404).json({
        mensagem: 'Equipe não encontrada.',
      });
    }

    // =====================================
    // ATUALIZAR
    // =====================================

    const equipe = await prisma.equipe.update({
      where: {
        id: Number(id),
      },

      data: {
        ...(nome !== undefined && {
          nome,
        }),

        ...(modalidade !== undefined && {
          modalidade,
        }),

        ...(categoria !== undefined && {
          categoria: categoria || null,
        }),

        ...(proximaPartida !== undefined && {
          proximaPartida: proximaPartida
            ? new Date(proximaPartida)
            : null,
        }),

        ...(imagem !== undefined && {
          imagem: imagem || null,
        }),

        ...(corEquipe !== undefined && {
          corEquipe: corEquipe || null,
        }),
      },

      include: {
        _count: {
          select: {
            atletas: true,
          },
        },
      },
    });

    return res.status(200).json({
      mensagem: 'Equipe atualizada com sucesso.',

      equipe: {
        id: equipe.id,
        nome: equipe.nome,
        modalidade: equipe.modalidade,
        categoria: equipe.categoria,
        numeroAtletas: equipe._count.atletas,
        proximaPartida: equipe.proximaPartida,
        imagem: equipe.imagem,
        corEquipe: equipe.corEquipe,
        createdAt: equipe.createdAt,
        updatedAt: equipe.updatedAt,
      },
    });
  } catch (error) {
    console.error('Erro ao atualizar equipe:', error);

    return res.status(500).json({
      mensagem: 'Erro ao atualizar equipe.',
      erro: error.message,
    });
  }
};

// =====================================
// EXCLUIR EQUIPE
// =====================================

const excluirEquipe = async (req, res) => {
  try {
    const treinador = await obterTreinadorLogado(req);
    const { id } = req.params;

    if (!treinador) {
      return res.status(401).json({
        mensagem: 'Treinador não identificado.',
      });
    }

    // =====================================
    // VERIFICAR DONO DA EQUIPE
    // =====================================

    const equipe = await prisma.equipe.findFirst({
      where: {
        id: Number(id),
        treinadorId: treinador.id,
      },
    });

    if (!equipe) {
      return res.status(404).json({
        mensagem: 'Equipe não encontrada.',
      });
    }

    // =====================================
    // DESVINCULAR ATLETAS
    // =====================================

    await prisma.atleta.updateMany({
      where: {
        equipeId: Number(id),
      },

      data: {
        equipeId: null,
      },
    });

    // =====================================
    // EXCLUIR EQUIPE
    // =====================================

    await prisma.equipe.delete({
      where: {
        id: Number(id),
      },
    });

    return res.status(200).json({
      mensagem: 'Equipe excluída com sucesso.',
    });
  } catch (error) {
    console.error('Erro ao excluir equipe:', error);

    return res.status(500).json({
      mensagem: 'Erro ao excluir equipe.',
      erro: error.message,
    });
  }
};

// =====================================
// EXPORTAÇÕES
// =====================================

module.exports = {
  listarEquipes,
  buscarEquipe,
  criarEquipe,
  atualizarEquipe,
  excluirEquipe,
};