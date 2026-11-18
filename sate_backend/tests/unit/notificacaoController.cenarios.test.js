jest.mock('../../src/lib/prisma',()=>({
 treinador:{findUnique:jest.fn()},
 notificacao:{findMany:jest.fn(),findFirst:jest.fn(),update:jest.fn(),updateMany:jest.fn(),count:jest.fn()}
}));
jest.mock('../../src/services/notificacaoService',()=>({
 sincronizarNotificacoesCadastroTreinador:jest.fn(),
 sincronizarNotificacoesPartidasTreinador:jest.fn(),
 sincronizarNotificacoesEscalacaoTreinador:jest.fn(),
 sincronizarNotificacoesLocalTreinador:jest.fn(),
 sincronizarNotificacoesPartidasAtrasadasTreinador:jest.fn(),
 sincronizarNotificacoesAtletasSemEquipeTreinador:jest.fn(),
 sincronizarNotificacoesEquipesSemAtletasTreinador:jest.fn()
}));
const prisma=require('../../src/lib/prisma');
const notificacoes=require('../../src/services/notificacaoService');
const controller=require('../../src/controllers/notificacaoController');
const {criarResposta}=require('../helpers/resposta');
async function executar(fn,params={}){const res=criarResposta();await controller[fn]({usuario:{id:10},params},res);return res;}
describe('Notificações - leitura, sincronização e permissões',()=>{
 beforeEach(()=>{
  jest.resetAllMocks();
  prisma.treinador.findUnique.mockResolvedValue({id:7});
  prisma.notificacao.findMany.mockResolvedValue([]);
  prisma.notificacao.count.mockResolvedValue(0);
  prisma.notificacao.updateMany.mockResolvedValue({count:3});
 });
 test('lista notificações pendentes e contadores',async()=>{
  const data=new Date('2026-11-10');
  prisma.notificacao.findMany.mockResolvedValue([{id:3,tipo:'partida',titulo:'Jogo',descricao:'Amanhã',lida:false,createdAt:data}]);
  prisma.notificacao.count.mockResolvedValueOnce(1).mockResolvedValueOnce(1);
  const res=await executar('listarNotificacoes');
  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
   naoLidas:1,total:1,notificacoes:[expect.objectContaining({id:3,type:'partida',title:'Jogo',read:false})]
  }));
  expect(prisma.notificacao.findMany).toHaveBeenCalledWith(expect.objectContaining({
   where:{treinadorId:7,resolvidaEm:null}
  }));
  expect(notificacoes.sincronizarNotificacoesCadastroTreinador).toHaveBeenCalledWith(prisma,7);
  expect(notificacoes.sincronizarNotificacoesEquipesSemAtletasTreinador).toHaveBeenCalledWith(prisma,7);
 });
 test('não lista notificações de outro treinador',async()=>{
  prisma.treinador.findUnique.mockResolvedValue(null);
  const res=await executar('listarNotificacoes');
  expect(res.status).toHaveBeenCalledWith(401);
  expect(prisma.notificacao.findMany).not.toHaveBeenCalled();
 });
 test('falha na sincronização interrompe a consulta e retorna 500',async()=>{
  notificacoes.sincronizarNotificacoesPartidasTreinador.mockRejectedValue(new Error('falha simulada'));
  const res=await executar('listarNotificacoes');
  expect(res.status).toHaveBeenCalledWith(500);
  expect(prisma.notificacao.findMany).not.toHaveBeenCalled();
 });
 test.each(['0','abc','-5'])('rejeita ID de notificação inválido %s',async id=>{
  const res=await executar('marcarNotificacaoComoLida',{id});
  expect(res.status).toHaveBeenCalledWith(400);
 });
 test('não marca como lida notificação de outro treinador',async()=>{
  prisma.notificacao.findFirst.mockResolvedValue(null);
  const res=await executar('marcarNotificacaoComoLida',{id:'3'});
  expect(res.status).toHaveBeenCalledWith(404);
  expect(prisma.notificacao.update).not.toHaveBeenCalled();
  expect(prisma.notificacao.findFirst).toHaveBeenCalledWith(expect.objectContaining({
   where:{id:3,treinadorId:7,resolvidaEm:null}
  }));
 });
 test('marca notificação existente como lida',async()=>{
  prisma.notificacao.findFirst.mockResolvedValue({id:3});
  prisma.notificacao.update.mockResolvedValue({id:3,tipo:'partida',titulo:'Jogo',lida:true});
  const res=await executar('marcarNotificacaoComoLida',{id:'3'});
  expect(res.status).toHaveBeenCalledWith(200);
  expect(prisma.notificacao.update).toHaveBeenCalledWith({where:{id:3},data:{lida:true}});
  expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
   notificacao:expect.objectContaining({id:3,read:true})
  }));
 });
 test('marca todas as notificações não resolvidas como lidas',async()=>{
  const res=await executar('marcarTodasComoLidas');
  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith(expect.objectContaining({quantidade:3}));
  expect(prisma.notificacao.updateMany).toHaveBeenCalledWith({
   where:{treinadorId:7,resolvidaEm:null,lida:false},data:{lida:true}
  });
 });
 test.each(['marcarTodasComoLidas','marcarNotificacaoComoLida'])('%s exige treinador autenticado',async fn=>{
  prisma.treinador.findUnique.mockResolvedValue(null);
  const res=await executar(fn,{id:'3'});
  expect(res.status).toHaveBeenCalledWith(401);
 });
});
