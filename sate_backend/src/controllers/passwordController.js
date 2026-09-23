const crypto = require('crypto');
const prisma = require('../lib/prisma');

async function solicitarRecuperacao(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        mensagem: 'Informe seu email.'
      });
    }

    const usuario = await prisma.usuario.findUnique({
      where: {
        email
      }
    });

    /*
     * Mesmo que o email não exista,
     * retornamos a mesma mensagem.
     */
    if (!usuario) {
      return res.json({
        mensagem:
          'Se o email estiver cadastrado, você receberá as instruções para redefinir sua senha.'
      });
    }

    // Remove tokens anteriores
    await prisma.passwordResetToken.deleteMany({
      where: {
        usuarioId: usuario.id
      }
    });

    // Gera token aleatório
    const token = crypto.randomBytes(32).toString('hex');

    // Salva apenas o hash no banco
    const tokenHash = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Token válido por 30 minutos
    const expiresAt = new Date(
      Date.now() + 30 * 60 * 1000
    );

    await prisma.passwordResetToken.create({
      data: {
        tokenHash,
        usuarioId: usuario.id,
        expiresAt
      }
    });

    // Link temporário para desenvolvimento
    const link =
      `http://localhost:5173/redefinir-senha?token=${token}`;

    console.log('');
    console.log('========================================');
    console.log('LINK DE RECUPERAÇÃO DE SENHA');
    console.log(link);
    console.log('========================================');
    console.log('');

    return res.json({
      mensagem:
        'Se o email estiver cadastrado, você receberá as instruções para redefinir sua senha.'
    });

  } catch (error) {
    console.error(
      'Erro na recuperação de senha:',
      error
    );

    return res.status(500).json({
      mensagem:
        'Erro ao solicitar recuperação de senha.'
    });
  }
}

module.exports = {
  solicitarRecuperacao
};