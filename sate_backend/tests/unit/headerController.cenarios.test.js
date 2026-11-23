const mockPrisma = {
 treinador:{findUnique:jest.fn()},
 usuario:{findUnique:jest.fn()},
 equipe:{findMany:jest.fn()},
 atleta:{findMany:jest.fn()},
 partida:{findMany:jest.fn()}
};
jest.mock('@prisma/client',()=>({PrismaClient:jest.fn(()=>mockPrisma)}));
const controller=require('../../src/controllers/headerController');
const {criarResposta}=require('../helpers/resposta');
async function executar(func,query={}){
 const res=criarResposta();
 await controller[func]({usuario:{id:10},query},res);
 return res;
}
function payload(res){
 expect(res.status).toHaveBeenCalledWith(200);
 return res.json.mock.calls.at(-1)[0];
}
describe('Cabeçalho - pesquisa, notificações e usuário',()=>{
 beforeEach(()=>{
   jest.resetAllMocks();
   mockPrisma.treinador.findUnique.mockResolvedValue({id:7});
   mockPrisma.partida.findMany.mockResolvedValue([]);
   mockPrisma.atleta.findMany.mockResolvedValue([]);
   mockPrisma.equipe.findMany.mockResolvedValue([]);
 });
 test.each(['listarNotificacoesHeader','pesquisarHeader'])('%s recusa treinador inexistente',async func=>{
   mockPrisma.treinador.findUnique.mockResolvedValue(null);
   const res=await executar(func,{q:'futebol'});
   expect(res.status).toHaveBeenCalledWith(404);
   expect(mockPrisma.atleta.findMany).not.toHaveBeenCalled();
 });
 test('pesquisa vazia não realiza consultas aos atletas',async()=>{
   const data=payload(await executar('pesquisarHeader',{q:'  '}));
   expect(data.resultados).toEqual([]);
   expect(mockPrisma.atleta.findMany).not.toHaveBeenCalled();
 });
 test('pesquisa retorna atletas, equipes e partidas do treinador',async()=>{
   mockPrisma.atleta.findMany.mockResolvedValue([{id:2,nome:'Maria Souza',categoria:'Sub-17',equipe:{nome:'Equipe A'}}]);
   mockPrisma.equipe.findMany.mockResolvedValue([{id:4,nome:'Equipe A',modalidade:'Futebol',categoria:'Sub-17'}]);
   mockPrisma.partida.findMany.mockResolvedValue([{id:8,adversario:'Equipe B',equipe:{nome:'Equipe A'},data:'2026-11-30'}]);
   const dados=payload(await executar('pesquisarHeader',{q:'Maria'}));
   expect(dados.atletas[0]).toMatchObject({id:2,type:'atleta',initials:'MS'});
   expect(dados.equipes[0]).toMatchObject({id:4,type:'equipe'});
   expect(dados.partidas[0]).toMatchObject({id:8,type:'partida'});
   expect(dados.resultados).toHaveLength(3);
 });
 test('pesquisa não retorna dados de outros treinadores',async()=>{
   await executar('pesquisarHeader',{q:'gol'});
   expect(mockPrisma.partida.findMany).toHaveBeenCalledWith(expect.objectContaining({where:expect.objectContaining({equipe:{treinadorId:7}})}));
   expect(mockPrisma.atleta.findMany).toHaveBeenCalledWith(expect.objectContaining({where:expect.objectContaining({equipe:{treinadorId:7}})}));
 });
 test('lista notificações vazias',async()=>{
   const result=payload(await executar('listarNotificacoesHeader'));
   expect(result).toEqual({total:0,naoLidas:0,notificacoes:[]});
 });
 test('notifica partida antiga e atleta com dados incompletos',async()=>{
   mockPrisma.partida.findMany
     .mockResolvedValueOnce([{id:5,data:'2026-10-01',equipe:{nome:'Equipe A'},adversario:'B'}])
     .mockResolvedValueOnce([]);
   mockPrisma.atleta.findMany.mockResolvedValue([{id:2,cpf:null,rg:null}]);
   const result=payload(await executar('listarNotificacoesHeader'));
   expect(result.total).toBe(2);
   expect(result.notificacoes.map(n=>n.type)).toEqual(expect.arrayContaining(['partida','atleta']));
 });
 test('notifica próximas partidas e campeonato',async()=>{
   const data=new Date(Date.now()+48*60*60*1000);
   mockPrisma.partida.findMany
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([{id:5,data,equipe:{nome:'SATE'},adversario:'Adversário',campeonato:'Copa'}]);
   const result=payload(await executar('listarNotificacoesHeader'));
   expect(result.total).toBe(1);
   expect(result.notificacoes[0].type).toBe('campeonato');
 });
 test('resumo mostra usuário autenticado',async()=>{
   mockPrisma.usuario.findUnique.mockResolvedValue({id:10,nome:'Treinador'});
   const result=payload(await executar('obterResumoHeader'));
   expect(result.usuario.id).toBe(10);
   expect(mockPrisma.usuario.findUnique).toHaveBeenCalledWith(expect.objectContaining({where:{id:10}}));
 });
 test('resumo não revela usuário inexistente',async()=>{
   mockPrisma.usuario.findUnique.mockResolvedValue(null);
   const res=await executar('obterResumoHeader');
   expect(res.status).toHaveBeenCalledWith(404);
 });
 test.each(['pesquisarHeader','listarNotificacoesHeader'])('%s trata falha na consulta',async func=>{
   mockPrisma.treinador.findUnique.mockRejectedValue(new Error('falha simulada'));
   const res=await executar(func,{q:'a'});
   expect(res.status).toHaveBeenCalledWith(500);
 });
});
