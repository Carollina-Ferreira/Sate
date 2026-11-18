const mockDb={treinador:{findUnique:jest.fn()},partida:{findMany:jest.fn()},atleta:{findMany:jest.fn()},equipe:{findMany:jest.fn()},usuario:{findUnique:jest.fn()}};
jest.mock('@prisma/client',()=>({PrismaClient:jest.fn(()=>mockDb)}));
const controller=require('../../src/controllers/headerController');
const {criarResposta}=require('../helpers/resposta');
const dia=n=>{const d=new Date();d.setDate(d.getDate()+n);d.setHours(12,0,0,0);return d;};
async function executar(fn,query={}){
 const res=criarResposta();
 await controller[fn]({usuario:{id:10},query},res);
 expect(res.status).toHaveBeenCalledWith(200);
 return res.json.mock.calls.at(-1)[0];
}
function preparar({passadas=[],proximas=[],atletas=[],equipes=[],partidas=[]}={}){
 mockDb.treinador.findUnique.mockResolvedValue({id:7});
 mockDb.partida.findMany.mockResolvedValueOnce(passadas).mockResolvedValueOnce(proximas);
 mockDb.atleta.findMany.mockResolvedValue(atletas);
 mockDb.equipe.findMany.mockResolvedValue(equipes);
}
describe('Cabeçalho - branches de tempo, pesquisas e avisos',()=>{
 beforeEach(()=>jest.resetAllMocks());
 test.each([
  [0,'Hoje'],
  [1,'Amanhã'],
  [2,'Em 2 dias']
 ])('mostra aviso da partida para daqui a %s dias',async(k,label)=>{
  preparar({proximas:[{id:5,data:dia(k),equipe:{nome:'SATE'},adversario:'Rivais'}]});
  const data=await executar('listarNotificacoesHeader');
  expect(data.notificacoes[0].time).toBe(label);
 });
 test('avisa partida antiga com diferença menor que um minuto',async()=>{
  preparar({passadas:[{id:5,data:new Date(),equipe:{nome:'SATE'},adversario:'Rivais'}]});
  const data=await executar('listarNotificacoesHeader');
  expect(data.notificacoes[0].time).toBe('Agora');
 });
 test('distingue cadastros incompletos quando há mais de um atleta',async()=>{
  preparar({atletas:[{id:2,cpf:null},{id:3,rg:null}]});
  const data=await executar('listarNotificacoesHeader');
  expect(data.notificacoes[0].quantidade).toBe(2);
  expect(data.notificacoes[0].description).toContain('2 atletas');
 });
 test('não gera aviso quando atletas possuem cadastro completo',async()=>{
  preparar({atletas:[{id:2,cpf:'123',rg:'123',dataNascimento:'2007-01-01',telefone:'119999'}]});
  const data=await executar('listarNotificacoesHeader');
  expect(data.total).toBe(0);
 });
 test('pesquisa organiza iniciais e usa fallback para atleta sem nome',async()=>{
  preparar({atletas:[
   {id:2,nome:'Maria Santos',equipe:null,categoria:'Sub-17'},
   {id:3,nome:null,usuario:{nome:'João Silva'},equipe:null,categoria:null},
   {id:4,nome:null,usuario:null,equipe:null,categoria:null}
  ]});
  const data=await executar('pesquisarHeader',{q:'s'});
  expect(data.atletas.map(x=>x.initials)).toEqual(['MS','JS','A']);
  expect(data.atletas[2].title).toBe('Atleta');
 });
 test('pesquisa utiliza fallback de subtítulo para equipe vazia',async()=>{
  preparar({equipes:[{id:3,nome:'Equipe',modalidade:null,categoria:null}]});
  const data=await executar('pesquisarHeader',{q:'Equipe'});
  expect(data.equipes[0].subtitle).toBe('Equipe');
 });
 test('pesquisa retorna adversário e equipe relacionada',async()=>{
  preparar({partidas:[{id:5,data:new Date(),adversario:'B',equipe:{nome:'SATE'}}]});
  // Consulta da pesquisa usa somente uma busca por partidas.
  mockDb.partida.findMany.mockReset().mockResolvedValue([{id:5,data:new Date(),adversario:'B',equipe:{nome:'SATE'}}]);
  const data=await executar('pesquisarHeader',{q:'SATE'});
  expect(data.partidas[0].title).toBe('SATE x B');
 });
});
