jest.mock('../../src/lib/prisma',()=>{
 const names=['treinador','atleta','equipe'];
 const methods=['findUnique','findFirst','findMany','create','update','delete','updateMany'];
 const db=Object.fromEntries(names.map(n=>[n,Object.fromEntries(methods.map(m=>[m,jest.fn()]))]));
 db.$transaction=jest.fn();return db;
});
const prisma=require('../../src/lib/prisma');
const controller=require('../../src/controllers/equipeController');
const {criarResposta}=require('../helpers/resposta');
async function executar(fn,body={},params={}){const res=criarResposta();await controller[fn]({usuario:{id:10},body,params},res);return res;}
function status(res,n){expect(res.status).toHaveBeenCalledWith(n);}
const eq={id:4,nome:'Time A',modalidade:'Futebol',categoria:'Sub-17',atletas:[],_count:{atletas:0}};
describe('Equipes - CRUD com vinculação e regras reais',()=>{
 beforeEach(()=>{
  jest.resetAllMocks();
  prisma.treinador.findUnique.mockResolvedValue({id:7});
  prisma.$transaction.mockImplementation(async cb=>cb(prisma));
  prisma.equipe.create.mockResolvedValue({id:4});
  prisma.equipe.findUnique.mockResolvedValue(eq);
  prisma.equipe.update.mockResolvedValue(eq);
  prisma.equipe.findFirst.mockResolvedValue(eq);
  prisma.atleta.updateMany.mockResolvedValue({count:1});
  prisma.equipe.delete.mockResolvedValue({});
 });
 test('cria equipe sem atletas',async()=>{
  const res=await executar('criarEquipe',{nome:'Time A',modalidade:'Futebol'});
  status(res,201);
  expect(prisma.$transaction).toHaveBeenCalledTimes(1);
  expect(prisma.equipe.create).toHaveBeenCalledWith({data:expect.objectContaining({nome:'Time A',treinadorId:7})});
  expect(prisma.atleta.updateMany).not.toHaveBeenCalled();
 });
 test('cria equipe com atletas disponíveis do treinador',async()=>{
  prisma.atleta.findMany.mockResolvedValue([{id:2,nome:'Maria',equipeId:null}]);
  const res=await executar('criarEquipe',{nome:'Time A',modalidade:'Futebol',atletasIds:[2,2,'invalido']});
  status(res,201);
  expect(prisma.atleta.findMany).toHaveBeenCalledWith(expect.objectContaining({where:expect.objectContaining({treinadorId:7,id:{in:[2]}})}));
  expect(prisma.atleta.updateMany).toHaveBeenCalledWith(expect.objectContaining({data:{equipeId:4}}));
 });
 test('recusa atleta que já pertence a equipe',async()=>{
  prisma.atleta.findMany.mockResolvedValue([{id:2,nome:'Maria',equipeId:88}]);
  status(await executar('criarEquipe',{nome:'Time A',modalidade:'Futebol',atletasIds:[2]}),400);
  expect(prisma.equipe.create).not.toHaveBeenCalled();
 });
 test('recusa data inválida da próxima partida',async()=>{
  status(await executar('criarEquipe',{nome:'Time A',modalidade:'Futebol',proximaPartida:'inválida'}),400);
 });
 test('transação falha se não conseguir vincular todos',async()=>{
  prisma.atleta.findMany.mockResolvedValue([{id:2,equipeId:null}]);
  prisma.atleta.updateMany.mockResolvedValue({count:0});
  status(await executar('criarEquipe',{nome:'Time A',modalidade:'Futebol',atletasIds:[2]}),500);
 });
 test('edita nome, modalidade, cor e limpa próxima partida',async()=>{
  const res=await executar('atualizarEquipe',{nome:'Novo nome',modalidade:'Basquete',corEquipe:'#16A875',proximaPartida:null},{id:'4'});
  status(res,200);
  expect(prisma.equipe.update).toHaveBeenCalledWith(expect.objectContaining({
   where:{id:4},data:expect.objectContaining({nome:'Novo nome',modalidade:'Basquete',corEquipe:'#16A875',proximaPartida:null})
  }));
 });
 test('impede editar equipe de outro treinador',async()=>{
  prisma.equipe.findFirst.mockResolvedValue(null);
  status(await executar('atualizarEquipe',{nome:'Nome'},{id:'4'}),404);
  expect(prisma.equipe.update).not.toHaveBeenCalled();
 });
 test('edição recusa data inválida',async()=>{
  status(await executar('atualizarEquipe',{proximaPartida:'nada'},{id:'4'}),400);
  expect(prisma.equipe.update).not.toHaveBeenCalled();
 });
 test('edição aceita nova data válida',async()=>{
  const res=await executar('atualizarEquipe',{proximaPartida:'2026-12-10'},{id:'4'});
  status(res,200);
  expect(prisma.equipe.update).toHaveBeenCalledWith(expect.objectContaining({
   data:expect.objectContaining({proximaPartida:expect.any(Date)})
  }));
 });
 test('excluir equipe primeiro desvincula atletas',async()=>{
  const res=await executar('excluirEquipe',{}, {id:'4'});
  status(res,200);
  expect(prisma.atleta.updateMany).toHaveBeenCalledWith({where:{equipeId:4,treinadorId:7},data:{equipeId:null}});
  expect(prisma.equipe.delete).toHaveBeenCalledWith({where:{id:4}});
 });
 test('não exclui equipe alheia',async()=>{
  prisma.equipe.findFirst.mockResolvedValue(null);
  status(await executar('excluirEquipe',{}, {id:'4'}),404);
  expect(prisma.equipe.delete).not.toHaveBeenCalled();
 });
 test('não realiza exclusão se banco falhar',async()=>{
  prisma.equipe.delete.mockRejectedValue(new Error('erro simulado'));
  status(await executar('excluirEquipe',{}, {id:'4'}),500);
 });
});
