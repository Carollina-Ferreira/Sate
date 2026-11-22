jest.mock('../../src/lib/prisma', () => ({
  treinador: { findUnique: jest.fn() },
  equipe: { findMany: jest.fn() },
  partida: { findMany: jest.fn() },
  atleta: { findMany: jest.fn() }
}));
const prisma = require('../../src/lib/prisma');
const { criarResposta } = require('../helpers/resposta');
const { listarDoTreinador } = require('../../src/controllers/estatisticasController');
async function consultar(query={}) {
  const res=criarResposta();
  await listarDoTreinador({usuario:{id:10},query},res);
  return res;
}
describe('Estatísticas do treinador - regras de filtros',()=>{
  beforeEach(()=>jest.resetAllMocks());
  test('usuário sem treinador recebe 403',async()=>{
    prisma.treinador.findUnique.mockResolvedValue(null);
    const res=await consultar();
    expect(res.status).toHaveBeenCalledWith(403);
    expect(prisma.equipe.findMany).not.toHaveBeenCalled();
  });
  test('erro ao buscar treinador retorna 500',async()=>{
    prisma.treinador.findUnique.mockRejectedValue(new Error('falha de banco'));
    const res=await consultar();
    expect(res.status).toHaveBeenCalledWith(500);
  });
  test('restringe busca de equipes ao treinador',async()=>{
    prisma.treinador.findUnique.mockResolvedValue({id:7});
    prisma.equipe.findMany.mockResolvedValue([]);
    const res=await consultar();
    expect(prisma.equipe.findMany).toHaveBeenCalledWith(expect.objectContaining({
      where:{treinadorId:7}
    }));
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      equipeId:null,resumo:expect.objectContaining({partidas:0,atletas:0,eventos:0})
    }));
  });
  test.each([
    [{equipeId:'invalido'},400],
    [{equipeId:'99'},403],
    [{periodo:'2030'},400]
  ])('rejeita filtro inválido (%p)',async(query,status)=>{
    prisma.treinador.findUnique.mockResolvedValue({id:7});
    prisma.equipe.findMany.mockResolvedValue([{id:3,nome:'Equipe A'}]);
    const res=await consultar(query);
    expect(res.status).toHaveBeenCalledWith(status);
  });
  test('sem equipe retorna lista e resumo vazios',async()=>{
    prisma.treinador.findUnique.mockResolvedValue({id:7});
    prisma.equipe.findMany.mockResolvedValue([]);
    const res=await consultar({periodo:'temporada'});
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      equipes:[],atletas:[],evolucao:[],periodo:'temporada'
    }));
  });
});
