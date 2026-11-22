const bcrypt = require('bcrypt');
const prisma = require('../lib/prisma');

// ============================================================
// PUT /api/usuarios/senha   { senhaAtual, novaSenha }
// Troca a senha do usuário autenticado (site ou aplicativo).
// ============================================================
async function alterarSenha(req, res) {
    try {
        const { senhaAtual, novaSenha } = req.body || {};

        if (typeof senhaAtual !== 'string' || typeof novaSenha !== 'string') {
            return res.status(400).json({ mensagem: 'Informe a senha atual e a nova senha.' });
        }
        if (novaSenha.length < 8) {
            return res.status(400).json({ mensagem: 'A nova senha deve ter pelo menos 8 caracteres.' });
        }
        if (novaSenha === senhaAtual) {
            return res.status(400).json({ mensagem: 'A nova senha deve ser diferente da atual.' });
        }

        const usuarioId = Number(req.usuario?.id ?? req.usuario?.usuarioId);
        const usuario = await prisma.usuario.findUnique({ where: { id: usuarioId } });
        if (!usuario) return res.status(401).json({ mensagem: 'Usuário não encontrado.' });

        const confere = await bcrypt.compare(senhaAtual, usuario.senha);
        if (!confere) return res.status(403).json({ mensagem: 'A senha atual está incorreta.' });

        await prisma.usuario.update({
            where: { id: usuarioId },
            data: { senha: await bcrypt.hash(novaSenha, 10), primeiroAcesso: false },
        });

        return res.json({ mensagem: 'Senha alterada com sucesso.' });
    } catch (error) {
        console.error('Erro ao alterar senha:', error);
        return res.status(500).json({ mensagem: 'Erro ao alterar a senha.' });
    }
}

module.exports = { alterarSenha };
