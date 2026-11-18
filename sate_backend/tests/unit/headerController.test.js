// Header usa PrismaClient diretamente, por isso a classe também é substituída por um mock.
const mockPrisma = { treinador: { findUnique: jest.fn() }, usuario: { findUnique: jest.fn() } };
jest.mock('@prisma/client', () => ({ PrismaClient: jest.fn(() => mockPrisma) }));
const { criarResposta } = require('../helpers/resposta');
const controller = require('../../src/controllers/headerController');

describe('headerController', () => {
  beforeEach(() => jest.clearAllMocks());

  test('resumo: usuário inexistente retorna 404', async () => {
    mockPrisma.usuario.findUnique.mockResolvedValue(null);
    const res = criarResposta();
    await controller.obterResumoHeader({ usuario: { id: 1 } }, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  test('resumo: usuário existente retorna 200', async () => {
    mockPrisma.usuario.findUnique.mockResolvedValue({ id: 1, nome: 'Treinador' });
    const res = criarResposta();
    await controller.obterResumoHeader({ usuario: { id: 1 } }, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ usuario: { id: 1, nome: 'Treinador' } });
  });
});
