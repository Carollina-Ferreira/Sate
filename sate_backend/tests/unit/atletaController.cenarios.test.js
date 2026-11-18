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

const controller = require('../../src/controllers/atletaController');
describe('Atletas - buscas, permissões e erros reais', () => {
 beforeEach(() => jest.resetAllMocks());
 const treinador={id:7};
 test('listar atletas restringe resultados ao treinador logado',async()=>{
   prisma.treinador.findUnique.mockResolvedValue(treinador);
   prisma.atleta.findMany.mockResolvedValue([{id:1,nome:'Atleta A'}]);
   const res=await executar(controller,'listarAtletas',requisicao());
   verificar(res,200);
   expect(prisma.atleta.findMany).toHaveBeenCalledWith(expect.objectContaining({where:{treinadorId:7}}));
   expect(res.json).toHaveBeenCalledWith([{id:1,nome:'Atleta A'}]);
 });
 test('falha de banco ao listar retorna 500',async()=>{
   prisma.treinador.findUnique.mockResolvedValue(treinador);
   prisma.atleta.findMany.mockRejectedValue(new Error('falha'));
   verificar(await executar(controller,'listarAtletas',requisicao()),500);
 });
 test('atletas disponíveis não incluem atletas já associados a equipe',async()=>{
   prisma.treinador.findUnique.mockResolvedValue(treinador);
   prisma.atleta.findMany.mockResolvedValue([]);
   const res=await executar(controller,'listarAtletasDisponiveis',requisicao());
   verificar(res,200);
   expect(prisma.atleta.findMany).toHaveBeenCalledWith(expect.objectContaining({where:{treinadorId:7,equipeId:null}}));
 });
 test('busca impede acessar atleta de outro treinador',async()=>{
   prisma.treinador.findUnique.mockResolvedValue(treinador);
   prisma.atleta.findFirst.mockResolvedValue(null);
   const res=await executar(controller,'buscarAtleta',requisicao({id:'22'}));
   verificar(res,404);
   expect(prisma.atleta.findFirst).toHaveBeenCalledWith(expect.objectContaining({where:{id:22,treinadorId:7}}));
 });
 test('busca retorna atleta encontrado',async()=>{
   prisma.treinador.findUnique.mockResolvedValue(treinador);
   prisma.atleta.findFirst.mockResolvedValue({id:22,nome:'Marina'});
   const res=await executar(controller,'buscarAtleta',requisicao({id:'22'}));
   verificar(res,200);
   expect(res.json).toHaveBeenCalledWith({id:22,nome:'Marina'});
 });
 test('não atualiza atleta inexistente',async()=>{
   prisma.treinador.findUnique.mockResolvedValue(treinador);
   prisma.atleta.findFirst.mockResolvedValue(null);
   verificar(await executar(controller,'atualizarAtleta',requisicao({id:'22'},{nome:'Novo'})),404);
   expect(prisma.atleta.update).not.toHaveBeenCalled();
 });
 test('não exclui atleta inexistente',async()=>{
   prisma.treinador.findUnique.mockResolvedValue(treinador);
   prisma.atleta.findFirst.mockResolvedValue(null);
   verificar(await executar(controller,'excluirAtleta',requisicao({id:'22'})),404);
   expect(prisma.atleta.delete).not.toHaveBeenCalled();
 });
 test('exclusão resolve notificação e exclui o atleta na transação',async()=>{
   prisma.treinador.findUnique.mockResolvedValue(treinador);
   prisma.atleta.findFirst.mockResolvedValue({id:22});
   prisma.notificacao.updateMany.mockResolvedValue({count:1});
   prisma.atleta.delete.mockResolvedValue({id:22});
   const res=await executar(controller,'excluirAtleta',requisicao({id:'22'}));
   verificar(res,200);
   expect(prisma.$transaction).toHaveBeenCalledTimes(1);
   expect(prisma.notificacao.updateMany).toHaveBeenCalled();
   expect(prisma.atleta.delete).toHaveBeenCalledWith({where:{id:22}});
 });
});
