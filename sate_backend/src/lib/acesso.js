const prisma = require('./prisma');

// ============================================================
// CONTEXTO DO USUÁRIO AUTENTICADO (treinador ou atleta)
// Usa o mesmo JWT já emitido por /api/auth/login (payload: id, tipo).
// ============================================================

async function obterContexto(req) {
    const usuarioId = Number(req.usuario?.id ?? req.usuario?.usuarioId);

    if (!Number.isInteger(usuarioId) || usuarioId <= 0) {
        return null;
    }

    const [treinador, atleta] = await Promise.all([
        prisma.treinador.findUnique({ where: { usuarioId } }),
        prisma.atleta.findUnique({ where: { usuarioId } }),
    ]);

    // O tipo do token decide quando a conta tiver os dois perfis.
    let tipo = null;

    if (req.usuario?.tipo === 'ATLETA' && atleta) tipo = 'ATLETA';
    else if (req.usuario?.tipo === 'TREINADOR' && treinador) tipo = 'TREINADOR';
    else if (treinador) tipo = 'TREINADOR';
    else if (atleta) tipo = 'ATLETA';

    return { usuarioId, tipo, treinador, atleta };
}

// Middleware: carrega req.ctx e restringe por tipo (opcional).
function comContexto(tipoExigido) {
    return async (req, res, next) => {
        try {
            const ctx = await obterContexto(req);

            if (!ctx || !ctx.tipo) {
                return res.status(401).json({
                    mensagem: 'Perfil de treinador ou atleta não identificado.',
                });
            }

            if (tipoExigido && ctx.tipo !== tipoExigido) {
                return res.status(403).json({
                    mensagem:
                        tipoExigido === 'TREINADOR'
                            ? 'Acesso restrito a treinadores.'
                            : 'Acesso restrito a atletas.',
                });
            }

            req.ctx = ctx;
            return next();
        } catch (error) {
            return next(error);
        }
    };
}

// ============================================================
// REGRAS DE ACESSO A ATLETAS
// ============================================================

// Filtro Prisma dos atletas que o usuário pode enxergar.
function filtroAtletas(ctx) {
    return ctx.tipo === 'TREINADOR'
        ? { treinadorId: ctx.treinador.id }
        : { id: ctx.atleta.id };
}

// Retorna o atleta alvo da operação ou null quando não permitido.
// Atleta: somente ele mesmo. Treinador: somente atletas dele.
async function resolverAtleta(ctx, atletaId) {
    if (ctx.tipo === 'ATLETA') {
        if (atletaId !== undefined && atletaId !== null && Number(atletaId) !== ctx.atleta.id) {
            return null;
        }
        return ctx.atleta;
    }

    const id = Number(atletaId);
    if (!Number.isInteger(id) || id <= 0) return null;

    return prisma.atleta.findFirst({
        where: { id, treinadorId: ctx.treinador.id },
    });
}

// ============================================================
// UTILIDADES DE DATA E VALIDAÇÃO
// ============================================================

// "YYYY-MM-DD" -> Date em UTC (coluna DATE do MySQL).
function lerDia(valor) {
    if (typeof valor !== 'string' || !/^\d{4}-\d{2}-\d{2}/.test(valor)) {
        return null;
    }
    const d = new Date(`${valor.slice(0, 10)}T00:00:00.000Z`);
    return Number.isNaN(d.getTime()) ? null : d;
}

function textoDia(data) {
    if (!data) return null;
    return new Date(data).toISOString().slice(0, 10);
}

function inteiro(valor, padrao = null) {
    if (valor === undefined || valor === null || valor === '') return padrao;
    const n = Number(valor);
    return Number.isInteger(n) ? n : padrao;
}

function texto(valor, max = 191) {
    if (valor === undefined || valor === null) return null;
    const t = String(valor).trim();
    return t ? t.slice(0, max) : null;
}

function hojeDia() {
    const agora = new Date();
    return new Date(Date.UTC(agora.getFullYear(), agora.getMonth(), agora.getDate()));
}

function somaDias(data, n) {
    const d = new Date(data);
    d.setUTCDate(d.getUTCDate() + n);
    return d;
}

function horaTexto(min) {
    const h = String(Math.floor(min / 60)).padStart(2, '0');
    const m = String(min % 60).padStart(2, '0');
    return `${h}:${m}`;
}

function dataBr(data) {
    const [a, m, d] = textoDia(data).split('-');
    return `${d}/${m}/${a}`;
}

module.exports = {
    obterContexto,
    comContexto,
    filtroAtletas,
    resolverAtleta,
    lerDia,
    textoDia,
    inteiro,
    texto,
    hojeDia,
    somaDias,
    horaTexto,
    dataBr,
};
