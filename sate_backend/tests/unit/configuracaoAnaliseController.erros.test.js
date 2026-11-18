jest.mock('../../src/lib/prisma',()=>({
 treinador:{findUnique:jest.fn()},
 equipe:{findFirst:jest.fn()},
 configuracaoAnalise:{findMany:jest.fn(),findFirst:jest.fn(),create:jest.fn(),update:jest.fn(),delete:jest.fn()},
 $transaction:jest.fn()
}));
const prisma=require('../../src/lib/prisma');
const controller=require('../../src/controllers/configuracaoAnaliseController');
const {criarResposta}=require('../helpers/resposta');
async function executar(fn,body={},params={},query={}){
 const res=criarResposta();await controller[fn]({usuario:{id:10},body,params,query},res);return res;
}
describe('Configuração de análise - falhas e permissões',()=>{
 beforeEach(()=>{
  jest.resetAllMocks();
  prisma.treinador.findUnique.mockResolvedValue({id:7});
  prisma.configuracaoAnalise.findMany.mockResolvedValue([]);
  prisma.configuracaoAnalise.findFirst.mockResolvedValue(null);
 });
 test('falha na listagem recebe 500 e mantém API disponível',async()=>{
  prisma.configuracaoAnalise.findMany.mockRejectedValue(new Error('falha simulada'));
  const res=await executar('listarConfiguracoesAnalise');
  expect(res.status).toHaveBeenCalledWith(500);
  expect(res.json).toHaveBeenCalledWith(expect.objectContaining({mensagem:'Erro ao buscar configurações de análise.'}));
 });
 test('falha na criação retorna 500 sem duplicar categoria',async()=>{
  prisma.configuracaoAnalise.create.mockRejectedValue(new Error('falha simulada'));
  const res=await executar('criarConfiguracaoAnalise',{nome:'Passe'});
  expect(res.status).toHaveBeenCalledWith(500);
 });
 test('erro de banco em exclusão é tratado',async()=>{
  prisma.configuracaoAnalise.findFirst.mockResolvedValue({id:3});
  prisma.configuracaoAnalise.delete.mockRejectedValue(new Error('falha simulada'));
  const res=await executar('excluirConfiguracaoAnalise',{}, {id:'3'});
  expect(res.status).toHaveBeenCalledWith(500);
 });
 test('treinador inexistente não consulta configuração',async()=>{
  prisma.treinador.findUnique.mockResolvedValue(null);
  const res=await executar('listarConfiguracoesAnalise');
  expect(res.status).toHaveBeenCalledWith(404);
  expect(prisma.configuracaoAnalise.findMany).not.toHaveBeenCalled();
 });
});
