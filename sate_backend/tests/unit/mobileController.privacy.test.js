// Verifica o contrato de dados do snapshot sem abrir conexão MySQL.
jest.mock('../../src/lib/prisma', () => ({
  atleta: { findUnique: jest.fn(), findMany: jest.fn() },
  equipe: { findMany: jest.fn() },
  treino: { findMany: jest.fn() },
  exercicio: { findMany: jest.fn() },
  eventoAgenda: { findMany: jest.fn() },
  presenca: { findMany: jest.fn() },
  testeFisico: { findMany: jest.fn() },
  metaAtleta: { findMany: jest.fn() },
  feedbackAtleta: { findMany: jest.fn() },
  documento: { findMany: jest.fn() },
}));

const prisma = require('../../src/lib/prisma');
const { snapshot } = require('../../src/controllers/mobileController');

describe('Snapshot mobile: privacidade dos atletas', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    const eu = {
      id: 1, usuarioId: 11, nome: 'Alice', equipeId: 99, treinadorId: 7,
      alturaCm: 171, pesoKg: 65, dataNascimento: new Date('2008-02-01'),
      usuario: { nome: 'Alice', email: 'alice@example.test', avatarUrl: null },
    };
    const colega = {
      id: 2, usuarioId: 22, nome: 'Bia', equipeId: 99,
      posicao: 'Goleira', alturaCm: 178, pesoKg: 72,
      dataNascimento: new Date('2007-01-01'), cpf: '11122233344',
      usuario: { nome: 'Bia', avatarUrl: '/uploads/bia.jpg' },
    };
    prisma.atleta.findUnique.mockResolvedValue(eu);
    prisma.atleta.findMany.mockResolvedValue([colega]);
    prisma.equipe.findMany.mockResolvedValue([{
      id: 99, nome: 'Time', modalidade: 'Futebol', treinadorId: 7, _count: { atletas: 2 },
    }]);
    for (const tabela of ['treino', 'exercicio', 'eventoAgenda', 'presenca',
      'testeFisico', 'metaAtleta', 'feedbackAtleta', 'documento']) {
      prisma[tabela].findMany.mockResolvedValue([]);
    }
  });

  test('colega recebe apenas nome, posição, foto, ID e equipe', async () => {
    const req = {
      query: {},
      ctx: { usuarioId: 11, tipo: 'ATLETA', atleta: { id: 1, equipeId: 99, treinadorId: 7 } },
    };
    const res = { json: jest.fn((payload) => payload) };
    await snapshot(req, res);
    expect(res.json).toHaveBeenCalledTimes(1);
    const payload = res.json.mock.calls[0][0];
    expect(payload.atletas).toHaveLength(2);
    expect(payload.atletas[0].alturaCm).toBe(171);
    expect(payload.atletas[1]).toEqual({
      id: 2,
      nome: 'Bia',
      equipeId: 99,
      posicao: 'Goleira',
      avatarUrl: '/uploads/bia.jpg',
    });
    expect(payload.atletas[1]).not.toHaveProperty('cpf');
    expect(payload.atletas[1]).not.toHaveProperty('dataNascimento');
    expect(payload.atletas[1]).not.toHaveProperty('pesoKg');
    expect(payload.atletas[1]).not.toHaveProperty('alturaCm');
    expect(payload.atletas[1]).not.toHaveProperty('email');
    const queryColegas = prisma.atleta.findMany.mock.calls[0][0];
    expect(queryColegas.where.equipeId).toBe(99);
    expect(queryColegas.select).not.toHaveProperty('cpf');
    expect(queryColegas.select).not.toHaveProperty('dataNascimento');
  });
});
