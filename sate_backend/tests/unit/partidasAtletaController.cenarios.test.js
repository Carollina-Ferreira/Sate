jest.mock('../../src/lib/prisma',()=>({
 treinador:{findUnique:jest.fn()},atleta:{findFirst:jest.fn()},partidaAtleta:{findMany:jest.fn()}
}));
const prisma=require('../../src/lib/prisma');
const {listarPartidasDoAtleta}=require('../../src/controllers/partidasAtletaController');
const {criarResposta}=require('../helpers/resposta');
async function executar(id='2'){
 const res=criarResposta();
 await listarPartidasDoAtleta({usuario:{id:10},params:{id}},res);
 return res;
}
function ok(res){expect(res.status).toHaveBeenCalledWith(200);return res.json.mock.calls.at(-1)[0];}
describe('Partidas do atleta - histórico com clipes e escalação',()=>{
 beforeEach(()=>{
  jest.resetAllMocks();
  prisma.treinador.findUnique.mockResolvedValue({id:7});
  prisma.atleta.findFirst.mockResolvedValue({id:2,nome:'Marina'});
  prisma.partidaAtleta.findMany.mockResolvedValue([]);
 });
 test('não permite acessar atletas de outro treinador',async()=>{
  prisma.atleta.findFirst.mockResolvedValue(null);
  const res=await executar();
  expect(res.status).toHaveBeenCalledWith(404);
  expect(prisma.partidaAtleta.findMany).not.toHaveBeenCalled();
 });
 test('treinador inexistente recebe 403',async()=>{
  prisma.treinador.findUnique.mockResolvedValue(null);
  const res=await executar();
  expect(res.status).toHaveBeenCalledWith(403);
 });
 test('atleta sem partidas recebe histórico vazio',async()=>{
  const dados=ok(await executar());
  expect(dados).toMatchObject({atleta:{id:2,nome:'Marina'},totalPartidas:0,partidas:[]});
 });
 test('lista partidas e suas ações ordenadas pelo tempo do vídeo',async()=>{
  prisma.partidaAtleta.findMany.mockResolvedValue([{
   partida:{id:5,data:'2026-11-12',adversario:'Time B',status:'FINALIZADA',equipe:{id:3,nome:'SATE',modalidade:'Futebol'},
    videos:[{id:8,titulo:'Partida',url:'/uploads/videos/video.mp4',marcacoes:[
     {id:1,titulo:'Passe',categoria:'boa',avaliacao:'POSITIVA',tempoInicio:10,tempoFim:12,configuracao:null},
     {id:2,titulo:'Gol',categoria:'boa',avaliacao:'POSITIVA',tempoInicio:2,tempoFim:3,configuracao:{nome:'Gol',cor:'#16A875'}}
    ]}]}
  }]);
  const dados=ok(await executar());
  expect(dados.totalPartidas).toBe(1);
  expect(dados.partidas[0].acoes.map(a=>a.titulo)).toEqual(['Gol','Passe']);
  expect(dados.partidas[0].acoes[0]).toMatchObject({videoId:8,categoria:'Gol',cor:'#16A875'});
  expect(prisma.partidaAtleta.findMany).toHaveBeenCalledWith(expect.objectContaining({
    where:{atletaId:2,partida:{equipe:{treinadorId:7}}}
  }));
 });
 test('ordena histórico da partida mais recente para mais antiga',async()=>{
  prisma.partidaAtleta.findMany.mockResolvedValue([
   {partida:{id:1,data:'2026-10-20',equipe:{nome:'SATE'},videos:[]}},
   {partida:{id:2,data:'2026-11-17',equipe:{nome:'SATE'},videos:[]}}
  ]);
  const dados=ok(await executar());
  expect(dados.partidas.map(p=>p.id)).toEqual([2,1]);
 });
 test('falha do banco retorna 500',async()=>{
  prisma.partidaAtleta.findMany.mockRejectedValue(new Error('falha simulada'));
  const res=await executar();
  expect(res.status).toHaveBeenCalledWith(500);
 });
});
