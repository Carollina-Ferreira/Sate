jest.mock('../../src/lib/prisma', () => ({
  treinador:{findUnique:jest.fn()},
  equipe:{findMany:jest.fn(),count:jest.fn()},
  atleta:{findMany:jest.fn(),count:jest.fn()},
  partida:{findMany:jest.fn(),count:jest.fn()},
  marcacaoVideo:{findMany:jest.fn(),count:jest.fn()},
  notificacao:{findMany:jest.fn(),count:jest.fn()},
  videoPartida:{findMany:jest.fn(),count:jest.fn()}
}));
const prisma = require('../../src/lib/prisma');
const {criarResposta}=require('../helpers/resposta');
const {obterDashboard}=require('../../src/controllers/dashboardController');
async function executar(usuario={id:10}) {
  const res=criarResposta();
  await obterDashboard({usuario,query:{}},res);
  return res;
}
describe('Dashboard - autorização e falhas do banco',()=>{
  beforeEach(()=>jest.resetAllMocks());
  test('requisição sem sessão não acessa o banco de indicadores',async()=>{
    const res=await executar(null);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(prisma.partida.findMany).not.toHaveBeenCalled();
  });
  test('treinador inexistente recebe 401',async()=>{
    prisma.treinador.findUnique.mockResolvedValue(null);
    const res=await executar();
    expect(res.status).toHaveBeenCalledWith(401);
    expect(prisma.atleta.findMany).not.toHaveBeenCalled();
  });
  test('falha de banco ao identificar treinador não retorna sucesso',async()=>{
    prisma.treinador.findUnique.mockRejectedValue(new Error('banco offline'));
    const res=await executar();
    // O controller faz tratamento próprio de falha; não deve retornar indicadores.
    expect(res.json).toHaveBeenCalled();
    expect(prisma.atleta.findMany).not.toHaveBeenCalled();
  });
});
