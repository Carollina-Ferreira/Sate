jest.mock('../../src/lib/prisma',()=>({
 treinador:{findUnique:jest.fn()},equipe:{findMany:jest.fn(),findUnique:jest.fn()},
 partida:{findMany:jest.fn()},videoPartida:{findMany:jest.fn()},
 marcacaoVideo:{findMany:jest.fn()},atleta:{findMany:jest.fn()}
}));
jest.mock('@prisma/client',()=>({
 Prisma:{dmmf:{datamodel:{models:[
 {name:'Equipe',fields:[{name:'id'},{name:'nome'},{name:'modalidade'},{name:'atletas',kind:'object',type:'Atleta'}]},
 {name:'Partida',fields:['id','data','adversario','golsEquipe','golsAdversario','status'].map(name=>({name})).concat({name:'videos',kind:'object',type:'VideoPartida'})},
 {name:'VideoPartida',fields:[{name:'id'},{name:'partidaId'},{name:'marcacoes',kind:'object',type:'MarcacaoVideo'}]},
 {name:'MarcacaoVideo',fields:['id','videoId','atletaId','avaliacao','tipoRegistro','titulo','categoria','categoriaId','createdAt'].map(name=>({name}))},
 {name:'Atleta',fields:[{name:'id'},{name:'nome'},{name:'usuario',kind:'object',type:'Usuario'}]}
 ]}}}
}));
const prisma=require('../../src/lib/prisma');
const {listarDoTreinador}=require('../../src/controllers/estatisticasController');
const {criarResposta}=require('../helpers/resposta');
function preparar({eventos=[],atletas=[],periodo='2026-11-01'}={}){
 prisma.treinador.findUnique.mockResolvedValue({id:7});
 prisma.equipe.findMany.mockResolvedValue([{id:3,nome:'Equipe A',modalidade:'Futebol'}]);
 prisma.partida.findMany.mockResolvedValue([{id:5,data:new Date(),status:'FINALIZADA',adversario:'Rivais',golsEquipe:2,golsAdversario:1}]);
 prisma.videoPartida.findMany.mockResolvedValue([{id:8,partidaId:5}]);
 prisma.marcacaoVideo.findMany.mockResolvedValue(eventos);
 prisma.equipe.findUnique.mockResolvedValue({atletas:atletas});
 prisma.atleta.findMany.mockResolvedValue(atletas);
}
async function consultar(query={}){
 const res=criarResposta();await listarDoTreinador({usuario:{id:10},query},res);return res;
}
function ok(res){expect(res.json).toHaveBeenCalled();return res.json.mock.calls.at(-1)[0];}
describe('Estatísticas - métricas de eventos, jogos e atletas',()=>{
 beforeEach(()=>jest.resetAllMocks());
 test('calcula indicadores de jogo e evolução sem marcações',async()=>{
   preparar();
   const data=ok(await consultar());
   expect(data.equipeId).toBe(3);
   expect(data.resumo.partidas).toBe(1);
   expect(data.evolucao).toHaveLength(1);
   expect(data.acoes).toHaveLength(4);
   expect(data.acoes.map(a=>a.valor)).toEqual([0,0,0,0]);
 });
 test('contabiliza ações boas, ruins, neutras e destaques, sem contar clipes',async()=>{
   preparar({eventos:[
     {id:1,videoId:8,atletaId:2,avaliacao:'POSITIVA',tipoRegistro:'EVENTO'},
     {id:2,videoId:8,atletaId:2,avaliacao:'NEGATIVA',tipoRegistro:'EVENTO'},
     {id:3,videoId:8,atletaId:2,avaliacao:'NEUTRA',tipoRegistro:'EVENTO'},
     {id:4,videoId:8,atletaId:2,avaliacao:'DESTAQUE',tipoRegistro:'EVENTO'},
     {id:5,videoId:8,atletaId:null,avaliacao:'NEUTRA',tipoRegistro:'CLIPE'}
   ],atletas:[{id:2,nome:'Marina'}]});
   const data=ok(await consultar({periodo:'temporada'}));
   expect(data.resumo.eventos).toBe(4);
   expect(data.acoes.map(a=>a.quantidade)).toEqual([1,1,1,1]);
   expect(data.acoes.map(a=>a.valor)).toEqual([25,25,25,25]);
   expect(data.atletasFiltro).toEqual([{id:2,nome:'Marina'}]);
 });
 test('filtra estatísticas pelo atleta escolhido',async()=>{
   preparar({eventos:[
      {id:1,videoId:8,atletaId:2,avaliacao:'POSITIVA',tipoRegistro:'EVENTO'},
      {id:2,videoId:8,atletaId:3,avaliacao:'NEGATIVA',tipoRegistro:'EVENTO'}
    ],atletas:[{id:2,nome:'Maria'},{id:3,nome:'Ana'}]});
   const data=ok(await consultar({atletaId:'2'}));
   expect(data.resumo.eventos).toBe(1);
   expect(data.evolucao).toHaveLength(1);
 });
 test('não permite consultar atleta de outra equipe',async()=>{
   preparar({atletas:[{id:2,nome:'Maria'}]});
   const res=await consultar({atletaId:'999'});
   expect(res.status).toHaveBeenCalledWith(403);
 });
 test('dados inválidos de atleta são rejeitados',async()=>{
   preparar();
   const res=await consultar({atletaId:'incorreto'});
   expect(res.status).toHaveBeenCalledWith(400);
 });
 test('partidas canceladas e datas futuras não são contadas',async()=>{
   preparar();
   prisma.partida.findMany.mockResolvedValue([
    {id:1,data:new Date(Date.now()+86400000),status:'AGENDADA'},
    {id:2,data:new Date(),status:'CANCELADA'}
   ]);
   const data=ok(await consultar());
   expect(data.resumo.partidas).toBe(0);
 });
});
