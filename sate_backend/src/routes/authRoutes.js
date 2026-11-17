
const express = require('express');

const {
    cadastro,
    login,
} = require('../controllers/authController');

const router = express.Router();

// ============================================================================
// LIMITADOR DE TENTATIVAS
// ============================================================================

function criarLimitador({ limite, janelaMs, mensagem }) {
    const tentativasPorIp = new Map();

    return (req, res, next) => {
        const agora = Date.now();
        const ip = req.ip || req.socket?.remoteAddress || 'ip-desconhecido';

        let registro = tentativasPorIp.get(ip);

        if (!registro || registro.expiraEm <= agora) {
            registro = {
                quantidade: 0,
                expiraEm: agora + janelaMs,
            };

            tentativasPorIp.set(ip, registro);
        }

        registro.quantidade += 1;

        res.setHeader('RateLimit-Limit', String(limite));

        res.setHeader(
            'RateLimit-Remaining',
            String(Math.max(0, limite - registro.quantidade))
        );

        if (registro.quantidade > limite) {
            const segundos = Math.max(
                1,
                Math.ceil((registro.expiraEm - agora) / 1000)
            );

            res.setHeader('Retry-After', String(segundos));

            return res.status(429).json({
                codigo: 'MUITAS_TENTATIVAS',
                mensagem,
                tentarNovamenteEmSegundos: segundos,
            });
        }

        // Limpeza de registros expirados.
        if (tentativasPorIp.size > 5000) {
            for (const [chave, valor] of tentativasPorIp.entries()) {
                if (valor.expiraEm <= agora) {
                    tentativasPorIp.delete(chave);
                }
            }
        }

        return next();
    };
}

// ============================================================================
// LIMITADORES
// ============================================================================

const limitarCadastro = criarLimitador({
    limite: 5,
    janelaMs: 60 * 60 * 1000,
    mensagem:
        'Muitas tentativas de cadastro. Aguarde um pouco antes de tentar novamente.',
});

const limitarLogin = criarLimitador({
    limite: 10,
    janelaMs: 15 * 60 * 1000,
    mensagem:
        'Muitas tentativas de login. Aguarde alguns minutos antes de tentar novamente.',
});

// ============================================================================
// ROTAS
// ============================================================================

router.post('/cadastro', limitarCadastro, cadastro);

router.post('/login', limitarLogin, login);

module.exports = router;
