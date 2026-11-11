
const express = require('express');
const cors = require('cors');
const path = require('path');

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

// NOVA ROTA — ESTATÍSTICAS
const estatisticasRoutes = require('./routes/estatisticasRoutes');

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
};

for (const [nome, rota] of Object.entries(rotas)) {
    if (typeof rota !== 'function') {
        console.error(
            `ERRO: ${nome} não exporta um Router válido.`
        );
        process.exit(1);
    }
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
        ],
    })
);

// ======================================================
// CORPO DAS REQUISIÇÕES
// ======================================================

app.use(express.json({ limit: '10mb' }));

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
    express.static(path.join(__dirname, '../uploads'))
);

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

// Autenticação
app.use('/api/auth', authRoutes);

// Atletas
app.use('/api/atletas', atletaRoutes);

// Treinadores
app.use('/api/treinadores', treinadorRoutes);

// Recuperação de senha
app.use('/api/password', passwordRoutes);

// Usuários
app.use('/api/usuarios', usuarioRoutes);

// Equipes
app.use('/api/equipes', equipeRoutes);

// Partidas
app.use('/api/partidas', partidaRoutes);

// Dashboard
app.use('/api/dashboard', dashboardRoutes);

// Estatísticas
app.use('/api/estatisticas', estatisticasRoutes);

// Notificações
app.use('/api/notificacoes', notificacaoRoutes);

// Configuração dos campos de análise de vídeo
app.use(
    '/api/configuracao-analise',
    configuracaoAnaliseRoutes
);

// Rotas de vídeos e marcações
app.use('/api', videoRoutes);

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

    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({
            mensagem:
                'Vídeo muito grande. Limite de 500 MB por arquivo.',
        });
    }

    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.status(400).json({
            mensagem:
                'Campo de arquivo inválido. Use o campo "arquivo".',
        });
    }

    const status = Number(
        err.status || err.statusCode || 500
    );

    return res.status(
        status >= 400 && status < 600 ? status : 500
    ).json({
        mensagem:
            err.message || 'Erro interno do servidor.',
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
    console.log(`Dashboard: http://localhost:${PORT}/api/dashboard`);
    console.log(`Estatísticas: http://localhost:${PORT}/api/estatisticas`);
    console.log(`Health: http://localhost:${PORT}/api/health`);
    console.log(`Vídeos: http://localhost:${PORT}/api/partidas/:id/videos`);
    console.log(`Configuração de análise: http://localhost:${PORT}/api/configuracao-analise`);
    console.log(`Notificações: http://localhost:${PORT}/api/notificacoes`);
    console.log('=================================');
    console.log('');
});
