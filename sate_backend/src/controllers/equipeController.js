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
    console.error(
      'Erro ao listar equipes:',
      error,
    );

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

      numeroAtletas:
        equipe._count.atletas,

      proximaPartida:
        equipe.proximaPartida,

      imagem:
        equipe.imagem,

      corEquipe:
        equipe.corEquipe,

      createdAt:
        equipe.createdAt,

      updatedAt:
        equipe.updatedAt,

      atletas:
        equipe.atletas,
    });

  } catch (error) {
    console.error(
      'Erro ao buscar equipe:',
      error,
    );

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
      atletasIds = [],
      proximaPartida,
      imagem,
      corEquipe,
    } = req.body;

    // =====================================
    // VALIDAÇÕES BÁSICAS
    // =====================================

    if (
      typeof nome !== 'string' ||
      !nome.trim()
    ) {
      return res.status(400).json({
        mensagem:
          'O nome da equipe é obrigatório.',
      });
    }

    if (
      typeof modalidade !== 'string' ||
      !modalidade.trim()
    ) {
      return res.status(400).json({
        mensagem:
          'A modalidade é obrigatória.',
      });
    }

    if (!Array.isArray(atletasIds)) {
      return res.status(400).json({
        mensagem:
          'A lista de atletas é inválida.',
      });
    }

    // =====================================
    // NORMALIZAR IDS DOS ATLETAS
    // =====================================

    const idsAtletas = atletasIds
      .map((id) => Number(id))
      .filter(
        (id) =>
          Number.isInteger(id) &&
          id > 0,
      );

    // Remove IDs duplicados
    const idsUnicos = [
      ...new Set(idsAtletas),
    ];

    // =====================================
    // VALIDAR ATLETAS SELECIONADOS
    // =====================================

    let atletasSelecionados = [];

    if (idsUnicos.length > 0) {
      atletasSelecionados =
        await prisma.atleta.findMany({
          where: {
            id: {
              in: idsUnicos,
            },

            treinadorId:
              treinador.id,
          },

          select: {
            id: true,
            nome: true,
            equipeId: true,
          },
        });

      // -------------------------------------
      // TODOS PRECISAM PERTENCER AO TREINADOR
      // -------------------------------------

      if (
        atletasSelecionados.length !==
        idsUnicos.length
      ) {
        return res.status(400).json({
          mensagem:
            'Um ou mais atletas selecionados não pertencem ao treinador logado.',
        });
      }

      // -------------------------------------
      // NENHUM PODE JÁ ESTAR EM UMA EQUIPE
      // -------------------------------------

      const atletasJaEmEquipe =
        atletasSelecionados.filter(
          (atleta) =>
            atleta.equipeId !== null,
        );

      if (
        atletasJaEmEquipe.length > 0
      ) {
        const nomes =
          atletasJaEmEquipe
            .map(
              (atleta) =>
                atleta.nome ||
                `Atleta #${atleta.id}`,
            )
            .join(', ');

        return res.status(400).json({
          mensagem:
            `Os seguintes atletas já pertencem a uma equipe: ${nomes}`,
        });
      }
    }

    // =====================================
    // PREPARAR DATA DA PRÓXIMA PARTIDA
    // =====================================

    let dataProximaPartida = null;

    if (proximaPartida) {
      const data =
        new Date(proximaPartida);

      if (
        Number.isNaN(
          data.getTime(),
        )
      ) {
        return res.status(400).json({
          mensagem:
            'A data da próxima partida é inválida.',
        });
      }

      dataProximaPartida = data;
    }

    // =====================================
    // CRIAR EQUIPE + VINCULAR ATLETAS
    // =====================================

    const equipe =
      await prisma.$transaction(
        async (tx) => {

          // ---------------------------------
          // CRIAR EQUIPE
          // ---------------------------------

          const novaEquipe =
            await tx.equipe.create({
              data: {
                nome:
                  nome.trim(),

                modalidade:
                  modalidade.trim(),

                categoria:
                  typeof categoria === 'string' &&
                  categoria.trim()
                    ? categoria.trim()
                    : null,

                proximaPartida:
                  dataProximaPartida,

                imagem:
                  imagem || null,

                corEquipe:
                  corEquipe || null,

                treinadorId:
                  treinador.id,
              },
            });

          // ---------------------------------
          // VINCULAR ATLETAS
          // ---------------------------------

          if (
            idsUnicos.length > 0
          ) {
            const resultado =
              await tx.atleta.updateMany({
                where: {
                  id: {
                    in: idsUnicos,
                  },

                  treinadorId:
                    treinador.id,

                  equipeId: null,
                },

                data: {
                  equipeId:
                    novaEquipe.id,
                },
              });

            // ---------------------------------
            // GARANTIR QUE TODOS FORAM VINCULADOS
            // ---------------------------------

            if (
              resultado.count !==
              idsUnicos.length
            ) {
              throw new Error(
                'Não foi possível vincular todos os atletas selecionados.',
              );
            }
          }

          // ---------------------------------
          // BUSCAR EQUIPE FINAL
          // ---------------------------------

          return tx.equipe.findUnique({
            where: {
              id: novaEquipe.id,
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
        },
      );

    // =====================================
    // RESPOSTA
    // =====================================

    return res.status(201).json({
      mensagem:
        'Equipe criada com sucesso.',

      equipe: {
        id:
          equipe.id,

        nome:
          equipe.nome,

        modalidade:
          equipe.modalidade,

        categoria:
          equipe.categoria,

        numeroAtletas:
          equipe._count.atletas,

        proximaPartida:
          equipe.proximaPartida,

        imagem:
          equipe.imagem,

        corEquipe:
          equipe.corEquipe,

        createdAt:
          equipe.createdAt,

        updatedAt:
          equipe.updatedAt,

        atletas:
          equipe.atletas,
      },
    });

  } catch (error) {
    console.error(
      'Erro ao criar equipe:',
      error,
    );

    return res.status(500).json({
      mensagem:
        'Erro ao criar equipe.',
      erro:
        error.message,
    });
  }
};


// =====================================
// ATUALIZAR EQUIPE
// =====================================

const atualizarEquipe = async (
  req,
  res,
) => {
  try {
    const treinador =
      await obterTreinadorLogado(req);

    const { id } =
      req.params;

    if (!treinador) {
      return res.status(401).json({
        mensagem:
          'Treinador não identificado.',
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

    const equipeExistente =
      await prisma.equipe.findFirst({
        where: {
          id: Number(id),
          treinadorId:
            treinador.id,
        },
      });

    if (!equipeExistente) {
      return res.status(404).json({
        mensagem:
          'Equipe não encontrada.',
      });
    }

    // =====================================
    // PREPARAR DATA
    // =====================================

    let dataProximaPartida =
      undefined;

    if (
      proximaPartida !==
      undefined
    ) {
      if (!proximaPartida) {
        dataProximaPartida =
          null;
      } else {
        const data =
          new Date(
            proximaPartida,
          );

        if (
          Number.isNaN(
            data.getTime(),
          )
        ) {
          return res.status(400).json({
            mensagem:
              'A data da próxima partida é inválida.',
          });
        }

        dataProximaPartida =
          data;
      }
    }

    // =====================================
    // ATUALIZAR EQUIPE
    // =====================================

    const equipe =
      await prisma.equipe.update({
        where: {
          id: Number(id),
        },

        data: {
          ...(nome !== undefined && {
            nome:
              typeof nome === 'string'
                ? nome.trim()
                : equipeExistente.nome,
          }),

          ...(modalidade !== undefined && {
            modalidade:
              typeof modalidade === 'string'
                ? modalidade.trim()
                : equipeExistente.modalidade,
          }),

          ...(categoria !== undefined && {
            categoria:
              typeof categoria === 'string' &&
              categoria.trim()
                ? categoria.trim()
                : null,
          }),

          ...(proximaPartida !== undefined && {
            proximaPartida:
              dataProximaPartida,
          }),

          ...(imagem !== undefined && {
            imagem:
              imagem || null,
          }),

          ...(corEquipe !== undefined && {
            corEquipe:
              corEquipe || null,
          }),
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

    // =====================================
    // RESPOSTA
    // =====================================

    return res.status(200).json({
      mensagem:
        'Equipe atualizada com sucesso.',

      equipe: {
        id:
          equipe.id,

        nome:
          equipe.nome,

        modalidade:
          equipe.modalidade,

        categoria:
          equipe.categoria,

        numeroAtletas:
          equipe._count.atletas,

        proximaPartida:
          equipe.proximaPartida,

        imagem:
          equipe.imagem,

        corEquipe:
          equipe.corEquipe,

        createdAt:
          equipe.createdAt,

        updatedAt:
          equipe.updatedAt,

        atletas:
          equipe.atletas,
      },
    });

  } catch (error) {
    console.error(
      'Erro ao atualizar equipe:',
      error,
    );

    return res.status(500).json({
      mensagem:
        'Erro ao atualizar equipe.',
      erro:
        error.message,
    });
  }
};


// =====================================
// EXCLUIR EQUIPE
// =====================================

const excluirEquipe = async (
  req,
  res,
) => {
  try {
    const treinador =
      await obterTreinadorLogado(req);

    const { id } =
      req.params;

    if (!treinador) {
      return res.status(401).json({
        mensagem:
          'Treinador não identificado.',
      });
    }

    // =====================================
    // VERIFICAR DONO DA EQUIPE
    // =====================================

    const equipe =
      await prisma.equipe.findFirst({
        where: {
          id: Number(id),
          treinadorId:
            treinador.id,
        },
      });

    if (!equipe) {
      return res.status(404).json({
        mensagem:
          'Equipe não encontrada.',
      });
    }

    // =====================================
    // DESVINCULAR ATLETAS
    // =====================================

    await prisma.atleta.updateMany({
      where: {
        equipeId:
          Number(id),

        treinadorId:
          treinador.id,
      },

      data: {
        equipeId:
          null,
      },
    });

    // =====================================
    // EXCLUIR EQUIPE
    // =====================================

    await prisma.equipe.delete({
      where: {
        id:
          Number(id),
      },
    });

    return res.status(200).json({
      mensagem:
        'Equipe excluída com sucesso.',
    });

  } catch (error) {
    console.error(
      'Erro ao excluir equipe:',
      error,
    );

    return res.status(500).json({
      mensagem:
        'Erro ao excluir equipe.',
      erro:
        error.message,
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