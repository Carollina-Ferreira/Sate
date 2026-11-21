
const express = require('express');
const cors = require('cors');
const path = require('path');
const jwt = require('jsonwebtoken');

// ======================================================
// IMPORTAÇÃO DAS ROTAS
// ======================================================

const authRoutes = require('./routes/authRoutes');
const atletaRoutes = require('./routes/atletaRoutes');
const treinadorRoutes = require('./routes/treinadorRoutes');
const passwordRoutes = require('./routes/passwordRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const equipeRoutes = require('./routes/equipeRoutes');
const partidaRoutes = require('./routes/partidaRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const videoRoutes = require('./routes/videoRoutes');
const configuracaoAnaliseRoutes = require('./routes/configuracaoAnaliseRoutes');
const notificacaoRoutes = require('./routes/notificacaoRoutes');
const mobileRoutes = require('./routes/mobileRoutes');

// ======================================================
// NOVA ROTA — PREFERÊNCIAS
// ======================================================

const criarRotasPreferencias = require('./routes/preferenciasRoutes');

// ======================================================
// ESTATÍSTICAS E PERFIL DO ATLETA
// ======================================================

const estatisticasRoutes = require('./routes/estatisticasRoutes');
const perfilRoutes = require('./routes/perfilRoutes');

// ======================================================
// VERIFICAÇÃO DAS ROTAS
// ======================================================

const rotas = {
    authRoutes,
    atletaRoutes,
    treinadorRoutes,
    passwordRoutes,
    usuarioRoutes,
    equipeRoutes,
    partidaRoutes,
    dashboardRoutes,
    videoRoutes,
    configuracaoAnaliseRoutes,
    notificacaoRoutes,
    estatisticasRoutes,
    perfilRoutes,
};

for (const [nome, rota] of Object.entries(rotas)) {
    if (typeof rota !== 'function') {
        console.error(
            `ERRO: ${nome} não exporta um Router válido.`
        );

        process.exit(1);
    }
}

if (typeof criarRotasPreferencias !== 'function') {
    console.error(
        'ERRO: preferenciasRoutes deve exportar uma função.'
    );

    process.exit(1);
}

console.log('Todas as rotas foram carregadas corretamente!');

// ======================================================
// APLICAÇÃO
// ======================================================

const app = express();

// ======================================================
// CORS
// ======================================================

app.use(
    cors({
        origin: true,
        credentials: true,
        methods: [
            'GET',
            'POST',
            'PUT',
            'PATCH',
            'DELETE',
            'OPTIONS',
        ],
        allowedHeaders: [
            'Content-Type',
            'Authorization',
            'X-SATE-App-Key',
        ],
    })
);

// ======================================================
// CORPO DAS REQUISIÇÕES
// ======================================================

app.use(
    express.json({
        limit: '10mb',
    })
);

app.use(
    express.urlencoded({
        extended: true,
        limit: '10mb',
    })
);

// ======================================================
// UPLOADS
// ======================================================

app.use(
    '/uploads',
    express.static(
        path.join(__dirname, '../uploads')
    )
);

// ======================================================
// MIDDLEWARE DE AUTENTICAÇÃO PARA PREFERÊNCIAS
// ======================================================

function autenticar(req, res, next) {
    try {
        const authorization =
            req.headers.authorization || '';

        const partes = authorization.trim().split(/\s+/);

        if (
            partes.length !== 2 ||
            partes[0].toLowerCase() !== 'bearer' ||
            !partes[1]
        ) {
            return res.status(401).json({
                mensagem:
                    'Token não informado. Faça login novamente.',
            });
        }

        const token = partes[1];

        const chave = process.env.JWT_SECRET;

        if (!chave) {
            console.error(
                'JWT_SECRET não está configurado.'
            );

            return res.status(500).json({
                mensagem:
                    'Autenticação indisponível no servidor.',
            });
        }

        const dados = jwt.verify(token, chave);

        if (
            !dados ||
            typeof dados !== 'object'
        ) {
            return res.status(401).json({
                mensagem: 'Token inválido.',
            });
        }

        // Compatível com tokens que usam "id"
        // ou "usuarioId" para identificar o usuário.
        const usuarioId = Number(
            dados.id ?? dados.usuarioId
        );

        if (
            !Number.isSafeInteger(usuarioId) ||
            usuarioId <= 0
        ) {
            return res.status(401).json({
                mensagem:
                    'Token sem identificação de usuário válida.',
            });
        }

        req.usuario = {
            ...dados,
            id: usuarioId,
        };

        return next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                mensagem:
                    'Sua sessão expirou. Faça login novamente.',
            });
        }

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                mensagem:
                    'Token inválido. Faça login novamente.',
            });
        }

        console.error(
            'Erro na autenticação das preferências:',
            error
        );

        return res.status(500).json({
            mensagem:
                'Erro ao autenticar usuário.',
        });
    }
}

// ======================================================
// TESTES DA API
// ======================================================

app.get('/', (req, res) => {
    return res.status(200).json({
        mensagem: 'API SATE funcionando!',
    });
});

app.get('/api/health', (req, res) => {
    return res.status(200).json({
        status: 'ok',
        mensagem: 'Backend SATE funcionando.',
    });
});

// ======================================================
// ROTAS DA API
// ======================================================

// AUTENTICAÇÃO
app.use('/api/auth', authRoutes);

// ATLETAS
app.use('/api/atletas', atletaRoutes);

// TREINADORES
app.use('/api/treinadores', treinadorRoutes);

// RECUPERAÇÃO DE SENHA
app.use('/api/password', passwordRoutes);

// USUÁRIOS
app.use('/api/usuarios', usuarioRoutes);

// EQUIPES
app.use('/api/equipes', equipeRoutes);

// PARTIDAS
app.use('/api/partidas', partidaRoutes);

// DASHBOARD
app.use('/api/dashboard', dashboardRoutes);

// ======================================================
// ESTATÍSTICAS GERAIS
// ======================================================

app.use(
    '/api/estatisticas',
    estatisticasRoutes
);

// ======================================================
// PERFIL DO ATLETA
//
// GET /api/estatisticas/atletas/:id
// ======================================================

app.use(
    '/api/estatisticas',
    perfilRoutes
);

// ======================================================
// NOTIFICAÇÕES
// ======================================================

app.use(
    '/api/notificacoes',
    notificacaoRoutes
);

// ======================================================
// PREFERÊNCIAS DO USUÁRIO
//
// GET /api/usuarios/preferencias
// PUT /api/usuarios/preferencias
// ======================================================

app.use(
    '/api/usuarios/preferencias',
    criarRotasPreferencias(autenticar)
);

// ======================================================
// CONFIGURAÇÃO DOS CAMPOS DE ANÁLISE
// ======================================================

app.use(
    '/api/configuracao-analise',
    configuracaoAnaliseRoutes
);

// ======================================================
// VÍDEOS, MARCAÇÕES, EVENTOS E CLIPES
// ======================================================

app.use(
    '/api',
    videoRoutes
);

// ======================================================
// APLICATIVO MOBILE (Flutter) — mesmo banco, mesmo JWT do site
//
// GET /api/mobile/me         GET /api/mobile/snapshot
// /api/exercicios  /api/treinos  /api/eventos  /api/presencas
// /api/testes      /api/metas    /api/feedbacks /api/documentos
// ======================================================

app.use('/api/mobile', mobileRoutes.rotasMobile);
app.use('/api/exercicios', mobileRoutes.rotasExercicios);
app.use('/api/treinos', mobileRoutes.rotasTreinos);
app.use('/api/eventos', mobileRoutes.rotasEventos);
app.use('/api/presencas', mobileRoutes.rotasPresencas);
app.use('/api/testes', mobileRoutes.rotasTestes);
app.use('/api/metas', mobileRoutes.rotasMetas);
app.use('/api/feedbacks', mobileRoutes.rotasFeedbacks);
app.use('/api/documentos', mobileRoutes.rotasDocumentos);

// ======================================================
// ROTA NÃO ENCONTRADA
// ======================================================

app.use((req, res) => {
    return res.status(404).json({
        mensagem: 'Rota não encontrada.',
        metodo: req.method,
        rota: req.originalUrl,
    });
});

// ======================================================
// TRATAMENTO GLOBAL DE ERROS
// ======================================================

app.use((err, req, res, next) => {
    console.error('ERRO NO SERVIDOR:', err);

    if (res.headersSent) {
        return next(err);
    }

    // ==================================================
    // ERRO DE TAMANHO DO UPLOAD
    // ==================================================

    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({
            mensagem:
                'Vídeo muito grande. Limite de 500 MB por arquivo.',
        });
    }

    // ==================================================
    // CAMPO DE ARQUIVO INVÁLIDO
    // ==================================================

    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.status(400).json({
            mensagem:
                'Campo de arquivo inválido. Use o campo "arquivo".',
        });
    }

    // ==================================================
    // ERROS GERAIS
    // ==================================================

    const status = Number(
        err.status || err.statusCode || 500
    );

    const statusFinal =
        Number.isInteger(status) &&
        status >= 400 &&
        status < 600
            ? status
            : 500;

    return res.status(statusFinal).json({
        mensagem:
            err.message ||
            'Erro interno do servidor.',
    });
});

// ======================================================
// SERVIDOR
// ======================================================

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
    console.log('');
    console.log('=================================');
    console.log('          SATE BACKEND');
    console.log('=================================');

    console.log(`Servidor: http://localhost:${PORT}`);
    console.log(`API: http://localhost:${PORT}/api`);

    console.log(
        `Dashboard: http://localhost:${PORT}/api/dashboard`
    );

    console.log(
        `Estatísticas: http://localhost:${PORT}/api/estatisticas`
    );

    console.log(
        `Perfil do Atleta: http://localhost:${PORT}/api/estatisticas/atletas/:id`
    );

    console.log(
        `Atletas: http://localhost:${PORT}/api/atletas`
    );

    console.log(
        `Equipes: http://localhost:${PORT}/api/equipes`
    );

    console.log(
        `Partidas: http://localhost:${PORT}/api/partidas`
    );

    console.log(
        `Vídeos: http://localhost:${PORT}/api/partidas/:id/videos`
    );

    console.log(
        `Configuração de análise: http://localhost:${PORT}/api/configuracao-analise`
    );

    console.log(
        `Notificações: http://localhost:${PORT}/api/notificacoes`
    );

    console.log(
        `Preferências: http://localhost:${PORT}/api/usuarios/preferencias`
    );

    console.log(
        `Health: http://localhost:${PORT}/api/health`
    );

    console.log('=================================');
    console.log('');
});
