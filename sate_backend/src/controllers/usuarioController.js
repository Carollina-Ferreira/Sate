const prisma = require('../lib/prisma');
const fs = require('fs');
const path = require('path');

/**
 * Atualiza o perfil do usuário.
 *
 * Recebe:
 * - nome
 * - email
 * - foto opcional
 */
const atualizarPerfil = async (req, res) => {
  try {
    const usuarioId = Number(req.usuario.id);

    if (!usuarioId) {
      return res.status(401).json({
        mensagem: 'Usuário não autenticado.',
      });
    }

    const { nome, email } = req.body;

    if (!nome || !nome.trim()) {
      return res.status(400).json({
        mensagem: 'O nome é obrigatório.',
      });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({
        mensagem: 'O e-mail é obrigatório.',
      });
    }

    const emailNormalizado = email.trim().toLowerCase();

    // Verifica se outro usuário já usa esse e-mail
    const usuarioComEmail = await prisma.usuario.findFirst({
      where: {
        email: emailNormalizado,
        NOT: {
          id: usuarioId,
        },
      },
    });

    if (usuarioComEmail) {
      return res.status(409).json({
        mensagem: 'Este e-mail já está sendo usado por outro usuário.',
      });
    }

    // Busca usuário atual
    const usuarioAtual = await prisma.usuario.findUnique({
      where: {
        id: usuarioId,
      },
    });

    if (!usuarioAtual) {
      return res.status(404).json({
        mensagem: 'Usuário não encontrado.',
      });
    }

    let avatarUrl = usuarioAtual.avatarUrl;

    /*
     * Se uma nova imagem foi enviada,
     * o multer disponibiliza em req.file.
     */
    if (req.file) {
      avatarUrl = `/uploads/perfil/${req.file.filename}`;

      // Remove a foto anterior do servidor
      if (usuarioAtual.avatarUrl) {
        const caminhoAntigo = path.join(
          __dirname,
          '../../',
          usuarioAtual.avatarUrl.replace(/^\/+/, '')
        );

        if (fs.existsSync(caminhoAntigo)) {
          try {
            fs.unlinkSync(caminhoAntigo);
          } catch (erro) {
            console.error(
              'Não foi possível remover a foto anterior:',
              erro
            );
          }
        }
      }
    }

    const usuarioAtualizado = await prisma.usuario.update({
      where: {
        id: usuarioId,
      },
      data: {
        nome: nome.trim(),
        email: emailNormalizado,
        avatarUrl,
      },
      select: {
        id: true,
        nome: true,
        email: true,
        tipo: true,
        avatarUrl: true,
      },
    });

    return res.status(200).json({
      mensagem: 'Perfil atualizado com sucesso.',
      usuario: usuarioAtualizado,
    });
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);

    return res.status(500).json({
      mensagem: 'Erro interno ao atualizar perfil.',
    });
  }
};

/**
 * Retorna os dados do usuário autenticado.
 */
const buscarPerfil = async (req, res) => {
  try {
    const usuarioId = Number(req.usuario.id);

    if (!usuarioId) {
      return res.status(401).json({
        mensagem: 'Usuário não autenticado.',
      });
    }

    const usuario = await prisma.usuario.findUnique({
      where: {
        id: usuarioId,
      },
      select: {
        id: true,
        nome: true,
        email: true,
        tipo: true,
        avatarUrl: true,
      },
    });

    if (!usuario) {
      return res.status(404).json({
        mensagem: 'Usuário não encontrado.',
      });
    }

    return res.status(200).json({
      usuario,
    });
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);

    return res.status(500).json({
      mensagem: 'Erro interno ao buscar perfil.',
    });
  }
};

module.exports = {
  atualizarPerfil,
  buscarPerfil,
};