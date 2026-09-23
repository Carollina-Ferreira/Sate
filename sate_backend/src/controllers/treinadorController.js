const prisma = require('../lib/prisma');

async function buscarTreinador(req, res) {
  try {
    const id = Number(req.params.id);

    const treinador = await prisma.treinador.findUnique({
      where: {
        id
      },
      include: {
        usuario: {
          select: {
            id: true,
            email: true,
            tipo: true
          }
        }
      }
    });

    if (!treinador) {
      return res.status(404).json({
        mensagem: 'Treinador não encontrado.'
      });
    }

    return res.json(treinador);

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      mensagem: 'Erro ao buscar treinador.'
    });
  }
}

async function atualizarTreinador(req, res) {
  try {
    const id = Number(req.params.id);

    const {
      nome,
      email
    } = req.body;

    const treinador = await prisma.treinador.findUnique({
      where: {
        id
      }
    });

    if (!treinador) {
      return res.status(404).json({
        mensagem: 'Treinador não encontrado.'
      });
    }

    const treinadorAtualizado =
      await prisma.treinador.update({
        where: {
          id
        },
        data: {
          ...(nome && { nome })
        },
        include: {
          usuario: {
            select: {
              id: true,
              email: true,
              tipo: true
            }
          }
        }
      });

    if (email) {
      await prisma.usuario.update({
        where: {
          id: treinador.usuarioId
        },
        data: {
          email
        }
      });
    }

    return res.json({
      mensagem: 'Treinador atualizado com sucesso.',
      treinador: treinadorAtualizado
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      mensagem: 'Erro ao atualizar treinador.'
    });
  }
}

module.exports = {
  buscarTreinador,
  atualizarTreinador
};