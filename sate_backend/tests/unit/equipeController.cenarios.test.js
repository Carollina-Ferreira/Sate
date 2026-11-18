jest.mock('../../src/lib/prisma', () => {
  const nomes = ['treinador','usuario','atleta','equipe','partida','notificacao','videoPartida','configuracaoAnalise'];
  const metodos = ['findUnique','findFirst','findMany','count','create','update','delete','updateMany','deleteMany','upsert'];
  const db = Object.fromEntries(nomes.map(nome => [nome,Object.fromEntries(metodos.map(m => [m,jest.fn()]))]));
  db.$transaction=jest.fn(async callback => callback(db));
  return db;
});
jest.mock('../../src/services/notificacaoService', () => ({
  sincronizarNotificacoesEscalacaoTreinador: jest.fn().mockResolvedValue(undefined),
  sincronizarNotificacoesPartidasTreinador: jest.fn().mockResolvedValue(undefined),
  resolverNotificacaoPartida: jest.fn().mockResolvedValue(undefined)
}));
const prisma = require('../../src/lib/prisma');
const { criarResposta } = require('../helpers/resposta');
function requisicao(params={},body={},query={}) { return { usuario:{id:10},params,body,query }; }
async function executar(controller,func,req) {
  const res=criarResposta();
  await controller[func](req,res);
  return res;
}
function verificar(res,code) { expect(res.status).toHaveBeenCalledWith(code); }

const controller = require('../../src/controllers/equipeController');
describe('Equipes - regras de negócio e acesso', () => {
 beforeEach(()=>jest.resetAllMocks());
 const treinador={id:7};
 test('listagem formata contagem de atletas',async()=>{
   prisma.treinador.findUnique.mockResolvedValue(treinador);
   prisma.equipe.findMany.mockResolvedValue([{
     id:8,nome:'Equipe A',modalidade:'Futebol',categoria:'Sub-17',
     atletas:[{id:1}],_count:{atletas:1}
   }]);
   const res=await executar(controller,'listarEquipes',requisicao());
   verificar(res,200);
   expect(res.json).toHaveBeenCalledWith([expect.objectContaining({id:8,numeroAtletas:1})]);
   expect(prisma.equipe.findMany).toHaveBeenCalledWith(expect.objectContaining({where:{treinadorId:7}}));
 });
 test('listagem retorna erro em falha do banco',async()=>{
   prisma.treinador.findUnique.mockResolvedValue(treinador);
   prisma.equipe.findMany.mockRejectedValue(new Error('falha'));
   verificar(await executar(controller,'listarEquipes',requisicao()),500);
 });
 test('busca não expõe equipe de outro treinador',async()=>{
   prisma.treinador.findUnique.mockResolvedValue(treinador);
   prisma.equipe.findFirst.mockResolvedValue(null);
   const res=await executar(controller,'buscarEquipe',requisicao({id:'9'}));
   verificar(res,404);
   expect(prisma.equipe.findFirst).toHaveBeenCalledWith(expect.objectContaining({where:{id:9,treinadorId:7}}));
 });
 test('busca retorna equipe e contagem de atletas',async()=>{
   prisma.treinador.findUnique.mockResolvedValue(treinador);
   prisma.equipe.findFirst.mockResolvedValue({id:9,nome:'Equipe A',atletas:[],_count:{atletas:0}});
   const res=await executar(controller,'buscarEquipe',requisicao({id:'9'}));
   verificar(res,200);
   expect(res.json).toHaveBeenCalledWith(expect.objectContaining({id:9,numeroAtletas:0}));
 });
 test('cadastro exige lista de IDs quando informada',async()=>{
   prisma.treinador.findUnique.mockResolvedValue(treinador);
   const res=await executar(controller,'criarEquipe',requisicao({},{
     nome:'Equipe A',modalidade:'Futebol',atletasIds:'1,2'
   }));
   verificar(res,400);
   expect(prisma.equipe.create).not.toHaveBeenCalled();
 });
 test('cadastro remove IDs inválidos e duplicados antes de consultar atletas',async()=>{
   prisma.treinador.findUnique.mockResolvedValue(treinador);
   prisma.atleta.findMany.mockResolvedValue([]);
   const res=await executar(controller,'criarEquipe',requisicao({},{
     nome:'Equipe A',modalidade:'Futebol',atletasIds:[1,1,0,-1,'abc']
   }));
   // Quando IDs únicos não pertencem ao treinador, deve impedir vinculação.
   expect(prisma.atleta.findMany).toHaveBeenCalled();
   expect(res.status).toHaveBeenCalledWith(400);
   expect(prisma.equipe.create).not.toHaveBeenCalled();
 });
});
