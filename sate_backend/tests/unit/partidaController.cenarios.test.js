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

const controller = require('../../src/controllers/partidaController');
describe('Partidas - regras de negócio e autorização', () => {
 beforeEach(()=>jest.resetAllMocks());
 const treinador={id:7};
 test('listagem consulta apenas partidas de equipes do treinador',async()=>{
   prisma.treinador.findUnique.mockResolvedValue(treinador);
   prisma.partida.findMany.mockResolvedValue([{id:3,adversario:'Equipe B'}]);
   const res=await executar(controller,'listarPartidas',requisicao());
   verificar(res,200);
   expect(prisma.partida.findMany).toHaveBeenCalledWith(expect.objectContaining({where:{equipe:{treinadorId:7}}}));
 });
 test('listagem falha do banco retorna 500',async()=>{
   prisma.treinador.findUnique.mockResolvedValue(treinador);
   prisma.partida.findMany.mockRejectedValue(new Error('falha'));
   verificar(await executar(controller,'listarPartidas',requisicao()),500);
 });
 test('busca não expõe partida pertencente a outro treinador',async()=>{
   prisma.treinador.findUnique.mockResolvedValue(treinador);
   prisma.partida.findFirst.mockResolvedValue(null);
   const res=await executar(controller,'buscarPartida',requisicao({id:'8'}));
   verificar(res,404);
   expect(prisma.partida.findFirst).toHaveBeenCalledWith(expect.objectContaining({where:{id:8,equipe:{treinadorId:7}}}));
 });
 test('busca retorna partida do treinador',async()=>{
   prisma.treinador.findUnique.mockResolvedValue(treinador);
   prisma.partida.findFirst.mockResolvedValue({id:8});
   const res=await executar(controller,'buscarPartida',requisicao({id:'8'}));
   verificar(res,200);
   expect(res.json).toHaveBeenCalledWith({id:8});
 });
 test.each([
   [{equipeId:1, adversario:'B'},'data inválida'],
   [{equipeId:1, adversario:'B',data:'nada'},'data inválida'],
   [{equipeId:1, adversario:'B',data:'2026-12-01',golsEquipe:-1,golsAdversario:0},'gols negativos'],
   [{equipeId:1, adversario:'B',data:'2026-12-01',golsEquipe:3},'placar incompleto'],
   [{equipeId:1, adversario:'B',data:'2026-12-01',status:'INVALIDO'},'status inválido']
 ])('não cria partida com %s (%s)',async(body)=>{
   prisma.treinador.findUnique.mockResolvedValue(treinador);
   const res=await executar(controller,'criarPartida',requisicao({},body));
   verificar(res,400);
   expect(prisma.partida.create).not.toHaveBeenCalled();
 });
 test('não permite atualizar partida inexistente',async()=>{
   prisma.treinador.findUnique.mockResolvedValue(treinador);
   prisma.partida.findFirst.mockResolvedValue(null);
   const res=await executar(controller,'atualizarPartida',requisicao({id:'9'},{local:'Campo A'}));
   verificar(res,404);
   expect(prisma.partida.update).not.toHaveBeenCalled();
 });
 test('não permite excluir partida inexistente',async()=>{
   prisma.treinador.findUnique.mockResolvedValue(treinador);
   prisma.partida.findFirst.mockResolvedValue(null);
   verificar(await executar(controller,'excluirPartida',requisicao({id:'9'})),404);
   expect(prisma.partida.delete).not.toHaveBeenCalled();
 });
});
