const express = require('express');
const request = require('supertest');

// Testes de roteamento HTTP: os controllers e a autenticação são simulados.
// Eles verificam método, endereço, montagem e exigência de token.
describe('Rotas de preferencias', () => {
  let app;
  let acionarController;

  beforeAll(() => {
    jest.resetModules();

    // Middleware simulado: não aceita requisições sem Bearer.
    jest.doMock('../../src/middleware/authMiddleware', () => (req, res, next) => {
      if (!req.headers.authorization?.startsWith('Bearer ')) {
        return res.status(401).json({ mensagem: 'Token não informado.' });
      }
      req.usuario = { id: 1 };
      return next();
    });

    acionarController = jest.fn((req, res) => {
      return res.status(200).json({ metodo: req.method, rota: req.path });
    });

    jest.doMock('../../src/controllers/preferenciasController', () => new Proxy({}, {
      get: () => acionarController
    }));

    const router = require('../../src/routes/preferenciasRoutes');
    app = express();
    app.use(express.json());
    app.use('/api/usuarios/preferencias', router((req, res, next) => {
      if (!req.headers.authorization?.startsWith('Bearer ')) return res.status(401).json({ mensagem: 'Token não informado.' });
      req.usuario = { id: 1 };
      next();
    }));
  });

  test.each([
    {
        "method": "get",
        "url": "/api/usuarios/preferencias"
    },
    {
        "method": "put",
        "url": "/api/usuarios/preferencias"
    }
])('$method $url chama seu controller', async ({ method, url }) => {
    const res = await request(app)[method](url).set('Authorization', 'Bearer token-de-teste');
    expect(res.status).toBe(200);
    expect(res.body.metodo).toBe(method.toUpperCase());
    expect(acionarController).toHaveBeenCalled();
  });

  test.each([
    {
        "method": "get",
        "url": "/api/usuarios/preferencias"
    },
    {
        "method": "put",
        "url": "/api/usuarios/preferencias"
    }
])('$method $url exige autenticação', async ({ method, url }) => {
    const res = await request(app)[method](url);
    expect(res.status).toBe(401);
  });
});
