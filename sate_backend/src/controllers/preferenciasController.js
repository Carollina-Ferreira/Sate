
const prisma = require('../lib/prisma');

// ============================================================
// IDENTIFICAR USUÁRIO LOGADO
// ============================================================

function obterUsuarioId(req) {
    const id = Number(req.usuario?.id);

    return Number.isInteger(id) && id > 0
        ? id
        : null;
}

// ============================================================
// FORMATAR PREFERÊNCIAS
// ============================================================

function formatarPreferencias(registro) {
    return {
        email: registro?.email ?? true,
        push: registro?.push ?? true,
    };
}

// ============================================================
// GET /api/usuarios/preferencias
// ============================================================

async function listarPreferencias(req, res) {
    const usuarioId = obterUsuarioId(req);

    if (!usuarioId) {
        return res.status(401).json({
            mensagem: 'Usuário não autenticado.',
        });
    }

    try {
        const registro =
            await prisma.preferenciasUsuario.findUnique({
                where: {
                    usuarioId,
                },
                select: {
                    email: true,
                    push: true,
                },
            });

        return res.status(200).json({
            preferencias: formatarPreferencias(registro),
        });
    } catch (error) {
        console.error(
            'Erro ao consultar preferências:',
            error
        );

        return res.status(500).json({
            mensagem: 'Erro ao consultar preferências.',
        });
    }
}

// ============================================================
// PUT /api/usuarios/preferencias
// ============================================================

async function salvarPreferencias(req, res) {
    const usuarioId = obterUsuarioId(req);

    if (!usuarioId) {
        return res.status(401).json({
            mensagem: 'Usuário não autenticado.',
        });
    }

    const { email, push } = req.body ?? {};

    if (
        typeof email !== 'boolean' ||
        typeof push !== 'boolean'
    ) {
        return res.status(400).json({
            mensagem:
                'Os campos email e push devem ser true ou false.',
        });
    }

    try {
        const registro =
            await prisma.preferenciasUsuario.upsert({
                where: {
                    usuarioId,
                },
                create: {
                    usuarioId,
                    email,
                    push,
                },
                update: {
                    email,
                    push,
                },
                select: {
                    email: true,
                    push: true,
                },
            });

        return res.status(200).json({
            preferencias: formatarPreferencias(registro),
        });
    } catch (error) {
        console.error(
            'Erro ao salvar preferências:',
            error
        );

        return res.status(500).json({
            mensagem: 'Erro ao salvar preferências.',
        });
    }
}

// ============================================================
// EXPORTAÇÕES
// ============================================================

module.exports = {
    listarPreferencias,
    salvarPreferencias,
};
