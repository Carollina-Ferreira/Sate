const crypto = require('crypto');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const prisma = require('../lib/prisma');

const TEMPO_EXPIRACAO_MINUTOS = 30;

function criarTransportadorEmail() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error(
      'Serviço de e-mail não configurado. Configure SMTP_HOST, SMTP_USER e SMTP_PASS no .env.'
    );
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: process.env.SMTP_SECURE === 'true' || port === 465,
    auth: { user, pass },
  });
}

function gerarHashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

async function solicitarRecuperacao(req, res) {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();

    if (!email) {
      return res.status(400).json({
        mensagem: 'Informe seu e-mail.',
      });
    }

    const respostaGenerica = {
      mensagem:
        'Se o e-mail estiver cadastrado, você receberá as instruções para redefinir sua senha.',
    };

    const usuario = await prisma.usuario.findUnique({
      where: { email },
      select: { id: true, nome: true, email: true },
    });

    // Não revela se o endereço está ou não cadastrado.
    if (!usuario) {
      return res.status(200).json(respostaGenerica);
    }

    // Invalida solicitações anteriores desse usuário.
    await prisma.passwordResetToken.deleteMany({
      where: { usuarioId: usuario.id },
    });

    // Token criptograficamente aleatório. Somente o hash vai para o banco.
    const token = crypto.randomBytes(32).toString('hex');
    const tokenHash = gerarHashToken(token);
    const expiresAt = new Date(
      Date.now() + TEMPO_EXPIRACAO_MINUTOS * 60 * 1000
    );

    const registro = await prisma.passwordResetToken.create({
      data: {
        tokenHash,
        usuarioId: usuario.id,
        expiresAt,
      },
    });

    const frontendUrl = (
      process.env.FRONTEND_URL || 'http://localhost:5173'
    ).replace(/\/$/, '');

    const link = `${frontendUrl}/redefinir-senha?token=${encodeURIComponent(token)}`;

    try {
      const transporter = criarTransportadorEmail();

      await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: usuario.email,
        subject: 'Redefinição de senha | SATE',
        text: [
          `Olá${usuario.nome ? `, ${usuario.nome}` : ''}!`,
          '',
          'Recebemos uma solicitação para redefinir sua senha no SATE.',
          `Acesse este link para criar uma nova senha: ${link}`,
          '',
          `O link expira em ${TEMPO_EXPIRACAO_MINUTOS} minutos e só pode ser utilizado uma vez.`,
          'Se você não solicitou essa alteração, ignore este e-mail.',
        ].join('\n'),
        html: `
          <div style="margin:0;padding:36px 16px;background:#f8f4f0;font-family:Arial,sans-serif;color:#12261f">
            <div style="max-width:520px;margin:0 auto;padding:36px;background:#ffffff;border:1px solid #e8dfd3;border-radius:20px">
              <div style="font-size:13px;font-weight:700;letter-spacing:2px;color:#006b4f">SATE</div>
              <h1 style="margin:22px 0 12px;font-size:25px">Redefinição de senha</h1>
              <p style="font-size:15px;line-height:1.7;color:#64736c">
                Olá${usuario.nome ? `, ${usuario.nome}` : ''}! Recebemos uma solicitação para redefinir sua senha no SATE.
              </p>
              <p style="font-size:15px;line-height:1.7;color:#64736c">
                Clique no botão abaixo para criar uma nova senha.
              </p>
              <p style="margin:28px 0">
                <a href="${link}" style="display:inline-block;padding:14px 24px;background:#006b4f;color:#ffffff;text-decoration:none;border-radius:999px;font-weight:700">
                  Redefinir minha senha
                </a>
              </p>
              <p style="font-size:13px;line-height:1.6;color:#78857e">
                Este link expira em ${TEMPO_EXPIRACAO_MINUTOS} minutos e só pode ser utilizado uma vez.
                Se você não solicitou essa alteração, ignore este e-mail.
              </p>
            </div>
          </div>
        `,
      });
    } catch (emailError) {
      // Não deixa um token válido no banco se o e-mail não foi enviado.
      await prisma.passwordResetToken.delete({
        where: { id: registro.id },
      });
      throw emailError;
    }

    return res.status(200).json(respostaGenerica);
  } catch (error) {
    console.error('Erro ao solicitar recuperação de senha:', error.message);

    return res.status(500).json({
      mensagem:
        'Não foi possível enviar o e-mail de recuperação. Verifique a configuração do serviço de e-mail e tente novamente.',
    });
  }
}

async function redefinirSenha(req, res) {
  try {
    const token = String(req.body.token || '').trim();
    const senha = String(req.body.senha || '');

    if (!token || !senha) {
      return res.status(400).json({
        mensagem: 'Token e nova senha são obrigatórios.',
      });
    }

    if (senha.length < 8) {
      return res.status(400).json({
        mensagem: 'A senha deve ter pelo menos 8 caracteres.',
      });
    }

    const tokenHash = gerarHashToken(token);

    const registro = await prisma.passwordResetToken.findUnique({
      where: { tokenHash },
    });

    if (
      !registro ||
      registro.usedAt ||
      registro.expiresAt.getTime() <= Date.now()
    ) {
      return res.status(400).json({
        mensagem:
          'Este link de recuperação é inválido ou expirou. Solicite um novo e-mail.',
      });
    }

    const senhaHash = await bcrypt.hash(senha, 12);

    await prisma.$transaction(async (tx) => {
      // Atualização condicional evita reutilização simultânea do mesmo token.
      const tokenAtualizado = await tx.passwordResetToken.updateMany({
        where: {
          id: registro.id,
          usedAt: null,
          expiresAt: { gt: new Date() },
        },
        data: { usedAt: new Date() },
      });

      if (tokenAtualizado.count !== 1) {
        throw new Error('TOKEN_INVALIDO_OU_EXPIRADO');
      }

      await tx.usuario.update({
        where: { id: registro.usuarioId },
        data: { senha: senhaHash },
      });

      // Invalida qualquer outro token de recuperação do mesmo usuário.
      await tx.passwordResetToken.deleteMany({
        where: {
          usuarioId: registro.usuarioId,
          id: { not: registro.id },
        },
      });
    });

    return res.status(200).json({
      mensagem:
        'Senha redefinida com sucesso. Você já pode entrar no SATE com sua nova senha.',
    });
  } catch (error) {
    if (error.message === 'TOKEN_INVALIDO_OU_EXPIRADO') {
      return res.status(400).json({
        mensagem:
          'Este link de recuperação é inválido ou expirou. Solicite um novo e-mail.',
      });
    }

    console.error('Erro ao redefinir senha:', error.message);

    return res.status(500).json({
      mensagem: 'Não foi possível redefinir sua senha. Tente novamente.',
    });
  }
}

module.exports = {
  solicitarRecuperacao,
  redefinirSenha,
};
