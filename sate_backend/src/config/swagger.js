const path = require('path');
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.3',

        info: {
            title: 'SATE - API REST',
            version: '1.0.0',
            description:
                'API do Sistema de Acompanhamento e Treinamento Esportivo'
        },

        servers: [
            {
                url: '/',
                description: 'Servidor atual - SATE'
            }
        ],

        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        }
    },

    apis: [
        path.join(__dirname, '../routes/*.js')
            .replace(/\\/g, '/')
    ]
};

module.exports = swaggerJsdoc(options);