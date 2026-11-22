jest.mock('../../src/lib/prisma',()=>{
 const names=['treinador','partida','equipe','atleta','partidaAtleta'];
 const meth=['findUnique','findFirst','findMany','create','update','delete','deleteMany','createMany'];
 const db=Object.fromEntries(names.map(n=>[n,Object.fromEntries(meth.map(m=>[m,jest.fn()]))]));
 db.$transaction=jest.fn();
 return db;
});
jest.mock('../../src/services/notificacaoService',()=>({
 sincronizarNotificacaoPartida:jest.fn().mockResolvedValue(undefined),
 resolverNotificacaoPartida:jest.fn().mockResolvedValue(undefined),
 sincronizarNotificacoesEscalacaoTreinador:jest.fn().mockResolvedValue(undefined)
}));
const prisma=require('../../src/lib/prisma');
const controller=require('../../src/controllers/partidaController');
const {criarResposta}=require('../helpers/resposta');
async function executar(fn,body={},params={}){
 const res=criarResposta();await controller[fn]({usuario:{id:10},body,params},res);return res;
}
function status(res,n){expect(res.status).toHaveBeenCalledWith(n);}
const dados={equipeId:3,adversario:'Rivais',data:'2026-12-03'};
describe('Partidas - cadastro, edição, exclusão e escalação',()=>{
 beforeEach(()=>{
  jest.resetAllMocks();
  prisma.treinador.findUnique.mockResolvedValue({id:7});
  prisma.equipe.findFirst.mockResolvedValue({id:3});
  prisma.partida.findFirst.mockResolvedValue({id:4,equipeId:3,atletas:[],golsEquipe:null,golsAdversario:null});
  prisma.partida.create.mockResolvedValue({id:4});
  prisma.partida.update.mockResolvedValue({id:4});
  prisma.partida.delete.mockResolvedValue({id:4});
  prisma.$transaction.mockImplementation(async callback=>callback(prisma));
 });
 test('cria partida e atribui status AGENDADA',async()=>{
  const res=await executar('criarPartida',dados);
  status(res,201);
  expect(prisma.partida.create).toHaveBeenCalledWith(expect.objectContaining({data:expect.objectContaining({
   equipeId:3,adversario:'Rivais',status:'AGENDADA',golsEquipe:null,golsAdversario:null
  })}));
 });
 test('placar completo finaliza a partida automaticamente',async()=>{
  status(await executar('criarPartida',{...dados,golsEquipe:3,golsAdversario:1}),201);
  expect(prisma.partida.create).toHaveBeenCalledWith(expect.objectContaining({data:expect.objectContaining({
   status:'FINALIZADA',golsEquipe:3,golsAdversario:1
  })}));
 });
 test('recusa equipe que não pertence ao treinador',async()=>{
  prisma.equipe.findFirst.mockResolvedValue(null);
  status(await executar('criarPartida',dados),404);
  expect(prisma.partida.create).not.toHaveBeenCalled();
 });
 test('edita data, adversário, campeonato e local',async()=>{
  const res=await executar('atualizarPartida',{adversario:'Rival B',local:'Osasco',campeonato:'Copa',data:'2026-12-12'},{id:'4'});
  status(res,200);
  expect(prisma.partida.update).toHaveBeenCalledWith(expect.objectContaining({where:{id:4},data:expect.objectContaining({
   adversario:'Rival B',local:'Osasco',campeonato:'Copa',data:expect.any(Date)
  })}));
 });
 test('atualizar placar transforma partida em FINALIZADA',async()=>{
  const res=await executar('atualizarPartida',{golsEquipe:2,golsAdversario:1},{id:'4'});
  status(res,200);
  expect(prisma.partida.update).toHaveBeenCalledWith(expect.objectContaining({data:expect.objectContaining({status:'FINALIZADA',golsEquipe:2,golsAdversario:1})}));
 });
 test.each([
  [{adversario:'  '},400],
  [{data:'errada'},400],
  [{status:'DESCONHECIDO'},400],
  [{golsEquipe:3},400],
  [{equipeId:0},400]
 ])('recusa editar dados incorretos %p',async body=>{
  status(await executar('atualizarPartida',body,{id:'4'}),400);
  expect(prisma.partida.update).not.toHaveBeenCalled();
 });
 test('exclui partida autorizada',async()=>{
  status(await executar('excluirPartida',{}, {id:'4'}),200);
  expect(prisma.partida.delete).toHaveBeenCalledWith({where:{id:4}});
 });
 test('lista atletas associados à partida',async()=>{
  prisma.partida.findFirst.mockResolvedValue({id:4,atletas:[{atleta:{id:2,nome:'Maria'}}]});
  const res=await executar('listarAtletasDaPartida',{}, {id:'4'});
  status(res,200);
  expect(res.json).toHaveBeenCalledWith([{atleta:{id:2,nome:'Maria'}}]);
 });
 test('escalação simplificada usa nome do atleta',async()=>{
  prisma.partida.findFirst.mockResolvedValue({id:4,atletas:[{atleta:{id:2,nome:'Maria'}},{atleta:{id:3,nome:'',usuario:{nome:'João'}}}]});
  const res=await executar('listarEscalacaoDaPartida',{}, {id:'4'});
  status(res,200);
  expect(res.json).toHaveBeenCalledWith([{id:2,nome:'Maria',participou:true},{id:3,nome:'João',participou:true}]);
 });
 test('salvar escalação rejeita atletas não pertencentes à equipe',async()=>{
  prisma.atleta.findMany.mockResolvedValue([]);
  status(await executar('salvarAtletasDaPartida',{atletasIds:[2]},{id:'4'}),400);
 });
 test('salvar escalação remove anterior e cadastra atletas autorizados',async()=>{
  prisma.atleta.findMany.mockResolvedValue([{id:2},{id:3}]);
  const res=await executar('salvarAtletasDaPartida',{atletasIds:[2,3,2]},{id:'4'});
  status(res,200);
  expect(prisma.partidaAtleta.deleteMany).toHaveBeenCalledWith({where:{partidaId:4}});
  expect(prisma.partidaAtleta.createMany).toHaveBeenCalledWith({data:[{partidaId:4,atletaId:2},{partidaId:4,atletaId:3}]});
 });
 test('salvar escalação vazia apenas remove vínculos',async()=>{
  const res=await executar('salvarAtletasDaPartida',{atletasIds:[]},{id:'4'});
  status(res,200);
  expect(prisma.partidaAtleta.deleteMany).toHaveBeenCalled();
  expect(prisma.partidaAtleta.createMany).not.toHaveBeenCalled();
 });
 test.each(['listarAtletasDaPartida','listarEscalacaoDaPartida','salvarAtletasDaPartida'])('%s recusa partida de outro treinador',async fn=>{
  prisma.partida.findFirst.mockResolvedValue(null);
  status(await executar(fn,{atletasIds:[]},{id:'4'}),404);
 });
});
