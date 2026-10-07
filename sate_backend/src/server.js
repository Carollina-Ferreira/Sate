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
// Aumentado para permitir imagens em Base64.
// 10mb evita o erro:
// PayloadTooLargeError: request entity too large
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
        path.join(
            __dirname,
            '../uploads'
        )
    )
);


// ======================================================
// ROTAS
// ======================================================

app.use(
    '/api/auth',
    authRoutes
);


app.use(
    '/api/atletas',
    atletaRoutes
);


app.use(
    '/api/treinadores',
    treinadorRoutes
);


app.use(
    '/api/password',
    passwordRoutes
);


app.use(
    '/api/usuarios',
    usuarioRoutes
);


app.use(
    '/api/equipes',
    equipeRoutes
);


app.use(
    '/api/partidas',
    partidaRoutes
);


// ======================================================
// TESTE DO SERVIDOR
// ======================================================

app.get(
    '/',
    (req, res) => {

        res.json({
            mensagem:
                'API SATE funcionando!'
        });

    }
);


// ======================================================
// ERRO GLOBAL
// ======================================================

app.use(
    (err, req, res, next) => {

        console.error(
            'ERRO NO SERVIDOR:',
            err
        );


        // ==============================================
        // ARQUIVO/JSON MAIOR QUE O LIMITE
        // ==============================================

        if (
            err.type ===
            'entity.too.large'
        ) {

            return res.status(413).json({
                mensagem:
                    'A imagem ou os dados enviados são muito grandes.',
                erro:
                    'Limite máximo de 10 MB.'
            });

        }


        // ==============================================
        // ERRO NORMAL
        // ==============================================

        return res.status(500).json({
            mensagem:
                'Erro interno do servidor.',
            erro:
                err.message
        });

    }
);


// ======================================================
// SERVIDOR
// ======================================================

const PORT =
    process.env.PORT || 3000;


app.listen(
    PORT,
    '0.0.0.0',
    () => {

        console.log('');
        console.log(
            '================================='
        );
        console.log(
            '   SATE BACKEND'
        );
        console.log(
            '================================='
        );

        console.log(
            `Servidor rodando em: http://localhost:${PORT}`
        );

        console.log(
            `Servidor disponível em: http://0.0.0.0:${PORT}`
        );

        console.log(
            'Limite JSON: 10 MB'
        );

        console.log(
            '================================='
        );

        console.log('');

    }
);