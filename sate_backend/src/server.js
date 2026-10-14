const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const atletaRoutes = require('./routes/atletaRoutes');
const treinadorRoutes = require('./routes/treinadorRoutes');
const passwordRoutes = require('./routes/passwordRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const equipeRoutes = require('./routes/equipeRoutes');
const partidaRoutes = require('./routes/partidaRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const { partidaVideoRoutes, videoRoutes } = require('./routes/videoRoutes');

const app = express();

// ======================================================
// CORS
// ======================================================
app.use(
    cors({
        origin: true,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization']
    })
);

// ======================================================
// CORPO DAS REQUISIÇÕES
// ======================================================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

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
        mensagem: 'API SATE funcionando!'
    });
});

app.get('/api/health', (req, res) => {
    return res.status(200).json({
        status: 'ok',
        mensagem: 'Backend SATE funcionando.'
    });
});

// ======================================================
// ROTAS DA API
// ======================================================
app.use('/api/auth', authRoutes);
app.use('/api/atletas', atletaRoutes);
app.use('/api/treinadores', treinadorRoutes);
app.use('/api/password', passwordRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/equipes', equipeRoutes);
app.use('/api/partidas', partidaRoutes);

// Rotas exigidas pela tela detalhesPartida.tsx.
app.use('/api/partidas', partidaVideoRoutes);
app.use('/api/videos', videoRoutes);

app.use('/api/dashboard', dashboardRoutes);

// ======================================================
// ROTA NÃO ENCONTRADA
// ======================================================
app.use((req, res) => {
    return res.status(404).json({
        mensagem: 'Rota não encontrada.',
        metodo: req.method,
        rota: req.originalUrl
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
            mensagem: 'Vídeo muito grande. Limite de 500 MB por arquivo.'
        });
    }

    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.status(400).json({
            mensagem: 'Campo de arquivo inválido. Use o campo "arquivo".'
        });
    }

    return res.status(err.status || err.statusCode || 500).json({
        mensagem: err.message || 'Erro interno do servidor.'
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
    console.log(`Health: http://localhost:${PORT}/api/health`);
    console.log('Rotas de vídeos: /api/partidas/:id/videos');
    console.log('=================================');
    console.log('');
});
