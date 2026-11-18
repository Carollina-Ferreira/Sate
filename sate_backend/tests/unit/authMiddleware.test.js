const jwt = require('jsonwebtoken');
const autenticar = require('../../src/middleware/authMiddleware');

jest.mock('jsonwebtoken', () => ({ verify: jest.fn() }));

function resposta() {
  return { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() };
}
describe('authMiddleware - JWT', () => {
  const segredoAnterior = process.env.JWT_SECRET;
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'segredo-de-teste';
  });
  afterAll(() => {
    if (segredoAnterior === undefined) delete process.env.JWT_SECRET;
    else process.env.JWT_SECRET = segredoAnterior;
  });

  test('recusa requisição sem cabeçalho Authorization', () => {
    const res = resposta(), next = jest.fn();
    autenticar({ headers: {} }, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ mensagem: 'Token não informado.' });
    expect(next).not.toHaveBeenCalled();
  });
  test.each(['Token abc', 'Bearer', 'Bearer abc extra', 'Basic abc'])(
    'recusa formato não-Bearer: %s', header => {
      const res = resposta(), next = jest.fn();
      autenticar({ headers: { authorization: header } }, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();
    }
  );
  test('aceita JWT válido e preenche req.usuario', () => {
    const usuario = { id: 17, tipo: 'TREINADOR' };
    jwt.verify.mockReturnValue(usuario);
    const req = { headers: { authorization: 'Bearer token-valido' } };
    const res = resposta(), next = jest.fn();
    autenticar(req, res, next);
    expect(jwt.verify).toHaveBeenCalledWith('token-valido', 'segredo-de-teste');
    expect(req.usuario).toEqual(usuario);
    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });
  test('rejeita token expirado ou assinatura inválida', () => {
    jwt.verify.mockImplementation(() => { throw new Error('JWT inválido'); });
    const req = { headers: { authorization: 'Bearer expirado' } };
    const res = resposta(), next = jest.fn();
    autenticar(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });
});
