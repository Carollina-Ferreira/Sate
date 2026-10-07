const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

/* =====================================================
   TREINADOR LOGADO
===================================================== */

async function obterTreinadorLogado(req) {
  const usuarioId = Number(req.usuario?.id);

  if (!usuarioId) {
    return null;
  }

  const treinador =
    await prisma.treinador.findUnique({
      where: {
        usuarioId,
      },
    });

  return treinador;
}


/* =====================================================
   SELEÇÃO PADRÃO DOS ATLETAS
===================================================== */

const selecionarAtleta = {
  id: true,
  nome: true,
  cpf: true,
  rg: true,
  dataNascimento: true,
  sexo: true,
  categoria: true,
  telefone: true,
  equipeId: true,
  treinadorId: true,

  usuario: {
    select: {
      id: true,
      nome: true,
      email: true,
      avatarUrl: true,
    },
  },
};


/* =====================================================
   LISTAR EQUIPES
===================================================== */

const listarEquipes = async (req, res) => {
  try {
    const treinador =
      await obterTreinadorLogado(req);

    if (!treinador) {
      return res.status(401).json({
        mensagem:
          'Treinador não identificado.',
      });
    }

    const equipes =
      await prisma.equipe.findMany({
        where: {
          treinadorId:
            treinador.id,
        },

        orderBy: {
          createdAt: 'desc',
        },

        include: {
          atletas: {
            where: {
              treinadorId:
                treinador.id,
            },

            select:
              selecionarAtleta,
          },

          _count: {
            select: {
              atletas: true,
            },
          },
        },
      });


    return res.status(200).json(
      equipes
    );

  } catch (error) {

    console.error(
      'Erro ao listar equipes:',
      error
    );

    return res.status(500).json({
      mensagem:
        'Erro ao listar equipes.',
      erro:
        error.message,
    });
  }
};


/* =====================================================
   BUSCAR EQUIPE POR ID
===================================================== */

const buscarEquipe = async (req, res) => {
  try {
    const treinador =
      await obterTreinadorLogado(req);

    if (!treinador) {
      return res.status(401).json({
        mensagem:
          'Treinador não identificado.',
      });
    }

    const id =
      Number(req.params.id);

    if (
      !Number.isInteger(id) ||
      id <= 0
    ) {
      return res.status(400).json({
        mensagem:
          'ID da equipe inválido.',
      });
    }


    const equipe =
      await prisma.equipe.findFirst({
        where: {
          id,

          treinadorId:
            treinador.id,
        },

        include: {
          atletas: {
            where: {
              treinadorId:
                treinador.id,
            },

            select:
              selecionarAtleta,
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
        mensagem:
          'Equipe não encontrada.',
      });
    }


    return res.status(200).json(
      equipe
    );

  } catch (error) {

    console.error(
      'Erro ao buscar equipe:',
      error
    );

    return res.status(500).json({
      mensagem:
        'Erro ao buscar equipe.',
      erro:
        error.message,
    });
  }
};


/* =====================================================
   CRIAR EQUIPE
===================================================== */

const criarEquipe = async (req, res) => {
  try {
    const treinador =
      await obterTreinadorLogado(req);

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
      imagem,
      corEquipe,
      proximaPartida,
      atletasIds,
    } = req.body;


    /* ================================================
       VALIDAÇÕES
    ================================================= */

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


    /* ================================================
       NORMALIZAR ATLETAS
    ================================================= */

    let idsUnicos = [];

    if (
      atletasIds !== undefined
    ) {

      if (!Array.isArray(atletasIds)) {
        return res.status(400).json({
          mensagem:
            'A lista de atletas é inválida.',
        });
      }


      const idsAtletas =
        atletasIds
          .map(Number)
          .filter(
            (id) =>
              Number.isInteger(id) &&
              id > 0
          );


      idsUnicos = [
        ...new Set(
          idsAtletas
        ),
      ];
    }


    /* ================================================
       VERIFICAR ATLETAS
    ================================================= */

    let atletasSelecionados = [];

    if (
      idsUnicos.length > 0
    ) {

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


      /* ==============================================
         ATLETAS QUE NÃO PERTENCEM AO TREINADOR
      ============================================== */

      if (
        atletasSelecionados.length !==
        idsUnicos.length
      ) {
        return res.status(403).json({
          mensagem:
            'Um ou mais atletas selecionados não pertencem ao treinador logado.',
        });
      }


      /* ==============================================
         ATLETAS JÁ EM OUTRA EQUIPE
      ============================================== */

      const atletasDeOutraEquipe =
        atletasSelecionados.filter(
          (atleta) =>
            atleta.equipeId !== null
        );


      if (
        atletasDeOutraEquipe.length > 0
      ) {

        const nomes =
          atletasDeOutraEquipe
            .map(
              (atleta) =>
                atleta.nome ||
                `Atleta #${atleta.id}`
            )
            .join(', ');


        return res.status(400).json({
          mensagem:
            `Os seguintes atletas já pertencem a outra equipe: ${nomes}`,
        });
      }
    }


    /* ================================================
       DATA DA PARTIDA
    ================================================= */

    let dataProximaPartida =
      null;


    if (proximaPartida) {

      const data =
        new Date(
          proximaPartida
        );


      if (
        Number.isNaN(
          data.getTime()
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


    /* ================================================
       CRIAR EQUIPE
    ================================================= */

    const equipe =
      await prisma.$transaction(
        async (tx) => {

          const novaEquipe =
            await tx.equipe.create({
              data: {

                nome:
                  nome.trim(),

                modalidade:
                  modalidade.trim(),

                categoria:
                  typeof categoria ===
                    'string' &&
                  categoria.trim()
                    ? categoria.trim()
                    : null,

                imagem:
                  imagem || null,

                corEquipe:
                  corEquipe ||
                  '#16A875',

                proximaPartida:
                  dataProximaPartida,

                treinadorId:
                  treinador.id,
              },
            });


          /* ==========================================
             VINCULAR ATLETAS
          ========================================== */

          if (
            idsUnicos.length > 0
          ) {

            await tx.atleta.updateMany({

              where: {
                id: {
                  in: idsUnicos,
                },

                treinadorId:
                  treinador.id,

                equipeId:
                  null,
              },

              data: {
                equipeId:
                  novaEquipe.id,
              },
            });
          }


          return novaEquipe;
        }
      );


    /* ================================================
       BUSCAR EQUIPE COMPLETA
    ================================================= */

    const equipeCompleta =
      await prisma.equipe.findFirst({
        where: {
          id:
            equipe.id,

          treinadorId:
            treinador.id,
        },

        include: {

          atletas: {
            where: {
              treinadorId:
                treinador.id,
            },

            select:
              selecionarAtleta,
          },

          _count: {
            select: {
              atletas: true,
            },
          },
        },
      });


    return res.status(201).json({

      mensagem:
        'Equipe criada com sucesso.',

      equipe:
        equipeCompleta,
    });

  } catch (error) {

    console.error(
      'Erro ao criar equipe:',
      error
    );

    return res.status(500).json({
      mensagem:
        'Erro ao criar equipe.',
      erro:
        error.message,
    });
  }
};


/* =====================================================
   ATUALIZAR EQUIPE
===================================================== */

const atualizarEquipe = async (req, res) => {
  try {
    const treinador =
      await obterTreinadorLogado(req);

    if (!treinador) {
      return res.status(401).json({
        mensagem:
          'Treinador não identificado.',
      });
    }


    const id =
      Number(req.params.id);


    if (
      !Number.isInteger(id) ||
      id <= 0
    ) {
      return res.status(400).json({
        mensagem:
          'ID da equipe inválido.',
      });
    }


    const {
      nome,
      modalidade,
      categoria,
      atletasIds,
      proximaPartida,
      imagem,
      corEquipe,
    } = req.body;


    /* ================================================
       VERIFICAR EQUIPE
    ================================================= */

    const equipeExistente =
      await prisma.equipe.findFirst({
        where: {
          id,

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


    /* ================================================
       NORMALIZAR ATLETAS
    ================================================= */

    let idsUnicos = null;


    if (
      atletasIds !== undefined
    ) {

      if (!Array.isArray(atletasIds)) {
        return res.status(400).json({
          mensagem:
            'A lista de atletas é inválida.',
        });
      }


      const idsAtletas =
        atletasIds
          .map(Number)
          .filter(
            (atletaId) =>
              Number.isInteger(
                atletaId
              ) &&
              atletaId > 0
          );


      idsUnicos = [
        ...new Set(
          idsAtletas
        ),
      ];


      /* ==============================================
         VALIDAR ATLETAS DO TREINADOR
      ============================================== */

      if (
        idsUnicos.length > 0
      ) {

        const atletasSelecionados =
          await prisma.atleta.findMany({

            where: {

              id: {
                in:
                  idsUnicos,
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


        /* ============================================
           ATLETAS DE OUTRO TREINADOR
        ============================================ */

        if (
          atletasSelecionados.length !==
          idsUnicos.length
        ) {
          return res.status(403).json({
            mensagem:
              'Um ou mais atletas selecionados não pertencem ao treinador logado.',
          });
        }


        /* ============================================
           ATLETAS DE OUTRA EQUIPE
        ============================================ */

        const atletasDeOutraEquipe =
          atletasSelecionados.filter(
            (atleta) =>
              atleta.equipeId !== null &&
              atleta.equipeId !== id
          );


        if (
          atletasDeOutraEquipe.length > 0
        ) {

          const nomes =
            atletasDeOutraEquipe
              .map(
                (atleta) =>
                  atleta.nome ||
                  `Atleta #${atleta.id}`
              )
              .join(', ');


          return res.status(400).json({
            mensagem:
              `Os seguintes atletas já pertencem a outra equipe: ${nomes}`,
          });
        }
      }
    }


    /* ================================================
       DATA DA PARTIDA
    ================================================= */

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
            proximaPartida
          );


        if (
          Number.isNaN(
            data.getTime()
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


    /* ================================================
       TRANSACTION
    ================================================= */

    const equipe =
      await prisma.$transaction(
        async (tx) => {

          /* ==========================================
             ATUALIZAR ATLETAS
          ========================================== */

          if (
            idsUnicos !== null
          ) {

            /* ========================================
               REMOVER ATLETAS DESELECIONADOS
            ======================================== */

            if (
              idsUnicos.length > 0
            ) {

              await tx.atleta.updateMany({

                where: {

                  equipeId:
                    id,

                  treinadorId:
                    treinador.id,

                  id: {
                    notIn:
                      idsUnicos,
                  },
                },

                data: {
                  equipeId:
                    null,
                },
              });

            } else {

              /* ======================================
                 NENHUM ATLETA SELECIONADO
              ====================================== */

              await tx.atleta.updateMany({

                where: {

                  equipeId:
                    id,

                  treinadorId:
                    treinador.id,
                },

                data: {
                  equipeId:
                    null,
                },
              });
            }


            /* ========================================
               ADICIONAR ATLETAS SELECIONADOS
            ======================================== */

            if (
              idsUnicos.length > 0
            ) {

              const resultado =
                await tx.atleta.updateMany({

                  where: {

                    id: {
                      in:
                        idsUnicos,
                    },

                    treinadorId:
                      treinador.id,

                    OR: [
                      {
                        equipeId:
                          null,
                      },

                      {
                        equipeId:
                          id,
                      },
                    ],
                  },

                  data: {
                    equipeId:
                      id,
                  },
                });


              if (
                resultado.count !==
                idsUnicos.length
              ) {
                throw new Error(
                  'Não foi possível atualizar todos os atletas da equipe.'
                );
              }
            }
          }


          /* ==========================================
             DADOS DA EQUIPE
          ========================================== */

          const dadosEquipe = {};


          if (
            nome !== undefined
          ) {

            if (
              typeof nome !==
                'string' ||
              !nome.trim()
            ) {
              throw new Error(
                'O nome da equipe é obrigatório.'
              );
            }


            dadosEquipe.nome =
              nome.trim();
          }


          if (
            modalidade !==
            undefined
          ) {

            if (
              typeof modalidade !==
                'string' ||
              !modalidade.trim()
            ) {
              throw new Error(
                'A modalidade é obrigatória.'
              );
            }


            dadosEquipe.modalidade =
              modalidade.trim();
          }


          if (
            categoria !==
            undefined
          ) {

            dadosEquipe.categoria =
              typeof categoria ===
                'string' &&
              categoria.trim()
                ? categoria.trim()
                : null;
          }


          if (
            imagem !==
            undefined
          ) {

            dadosEquipe.imagem =
              imagem || null;
          }


          if (
            corEquipe !==
            undefined
          ) {

            dadosEquipe.corEquipe =
              corEquipe ||
              '#16A875';
          }


          if (
            proximaPartida !==
            undefined
          ) {

            dadosEquipe.proximaPartida =
              dataProximaPartida;
          }


          /* ==========================================
             ATUALIZAR EQUIPE
          ========================================== */

          return tx.equipe.update({

            where: {
              id,
            },

            data:
              dadosEquipe,
          });
        }
      );


    /* ================================================
       BUSCAR EQUIPE ATUALIZADA
    ================================================= */

    const equipeAtualizada =
      await prisma.equipe.findFirst({

        where: {

          id:
            equipe.id,

          treinadorId:
            treinador.id,
        },

        include: {

          atletas: {

            where: {
              treinadorId:
                treinador.id,
            },

            select:
              selecionarAtleta,
          },

          _count: {
            select: {
              atletas: true,
            },
          },
        },
      });


    return res.status(200).json({

      mensagem:
        'Equipe atualizada com sucesso.',

      equipe:
        equipeAtualizada,
    });

  } catch (error) {

    console.error(
      'Erro ao atualizar equipe:',
      error
    );


    return res.status(500).json({

      mensagem:
        'Erro ao atualizar equipe.',

      erro:
        error.message,
    });
  }
};


/* =====================================================
   EXCLUIR EQUIPE
===================================================== */

const excluirEquipe = async (req, res) => {
  try {
    const treinador =
      await obterTreinadorLogado(req);


    if (!treinador) {
      return res.status(401).json({
        mensagem:
          'Treinador não identificado.',
      });
    }


    const id =
      Number(req.params.id);


    if (
      !Number.isInteger(id) ||
      id <= 0
    ) {
      return res.status(400).json({
        mensagem:
          'ID da equipe inválido.',
      });
    }


    /* ================================================
       VERIFICAR EQUIPE
    ================================================= */

    const equipe =
      await prisma.equipe.findFirst({

        where: {

          id,

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


    /* ================================================
       TRANSACTION
    ================================================= */

    await prisma.$transaction(
      async (tx) => {

        /* ============================================
           DESVINCULAR ATLETAS
        ============================================ */

        await tx.atleta.updateMany({

          where: {

            equipeId:
              id,

            treinadorId:
              treinador.id,
          },

          data: {
            equipeId:
              null,
          },
        });


        /* ============================================
           EXCLUIR EQUIPE
        ============================================ */

        await tx.equipe.delete({

          where: {
            id,
          },
        });
      }
    );


    return res.status(200).json({

      mensagem:
        'Equipe excluída com sucesso.',
    });

  } catch (error) {

    console.error(
      'Erro ao excluir equipe:',
      error
    );


    return res.status(500).json({

      mensagem:
        'Erro ao excluir equipe.',

      erro:
        error.message,
    });
  }
};


/* =====================================================
   EXPORTS
===================================================== */

module.exports = {
  listarEquipes,
  buscarEquipe,
  criarEquipe,
  atualizarEquipe,
  excluirEquipe,
};