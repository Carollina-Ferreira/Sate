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
            'OPTIONS'
        ],
        allowedHeaders: [
            'Content-Type',
            'Authorization'
        ]
    })
);

// ======================================================
// JSON
// ======================================================

app.use(
    express.json({
        limit: '10mb'
    })
);

// ======================================================
// URL ENCODED
// ======================================================

app.use(
    express.urlencoded({
        extended: true,
        limit: '10mb'
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
// TESTE DA API
// ======================================================

app.get('/', (req, res) => {
    return res.status(200).json({
        mensagem: 'API SATE funcionando!'
    });
});

// ======================================================
// HEALTH CHECK
// ======================================================

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
// ERRO GLOBAL
// ======================================================

app.use((err, req, res, next) => {
    console.error('');
    console.error('=================================');
    console.error('ERRO NO SERVIDOR');
    console.error('=================================');
    console.error(err);
    console.error('=================================');
    console.error('');

    if (res.headersSent) {
        return next(err);
    }

    return res.status(
        err.status ||
        err.statusCode ||
        500
    ).json({
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
    console.log('=================================');
    console.log('');
});