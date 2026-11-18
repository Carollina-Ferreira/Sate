jest.mock('../../src/lib/prisma',()=>({
 treinador:{findUnique:jest.fn()},
 atleta:{findFirst:jest.fn()},
 marcacaoVideo:{findMany:jest.fn()},
 videoPartida:{findMany:jest.fn()},
 partida:{findMany:jest.fn()},
 configuracaoAnalise:{findMany:jest.fn()}
}));
jest.mock('@prisma/client',()=>({Prisma:{dmmf:{datamodel:{models:[
 {name:'MarcacaoVideo',fields:['id','videoId','atletaId','avaliacao','tipoRegistro','categoriaId','categoria'].map(name=>({name}))}
]}}}}));
const prisma=require('../../src/lib/prisma');
const {criarResposta}=require('../helpers/resposta');
const {listarPerfilAtleta}=require('../../src/controllers/perfilAtletaController');
async function consultar(id='2'){
 const res=criarResposta();
 await listarPerfilAtleta({usuario:{id:10},params:{id}},res);
 return res;
}
function ok(res){expect(res.status).toHaveBeenCalledWith(200);return res.json.mock.calls.at(-1)[0];}
describe('Perfil estatístico do atleta - segurança e evolução',()=>{
 beforeEach(()=>{
  jest.resetAllMocks();
  prisma.treinador.findUnique.mockResolvedValue({id:7});
  prisma.atleta.findFirst.mockResolvedValue({id:2,nome:'Marina'});
  prisma.marcacaoVideo.findMany.mockResolvedValue([]);
  prisma.videoPartida.findMany.mockResolvedValue([]);
  prisma.partida.findMany.mockResolvedValue([]);
  prisma.configuracaoAnalise.findMany.mockResolvedValue([]);
 });
 test('não revela atleta de treinador diferente',async()=>{
  prisma.atleta.findFirst.mockResolvedValue(null);
  const res=await consultar();
  expect(res.status).toHaveBeenCalledWith(404);
  expect(prisma.atleta.findFirst).toHaveBeenCalledWith(expect.objectContaining({
   where:expect.objectContaining({id:2,OR:[{treinadorId:7},{equipe:{treinadorId:7}}]})
  }));
 });
 test('retorna relatório sem atribuir nota radar inexistente',async()=>{
  const dados=ok(await consultar());
  expect(dados.resumo.total).toBe(0);
  expect(dados.desempenho).toBeNull();
  expect(dados.atributos).toEqual([]);
  expect(dados.evolucao).toEqual([]);
 });
 test('mesmo com eventos, não usa vídeos de outro treinador',async()=>{
  prisma.marcacaoVideo.findMany.mockResolvedValue([
   {id:1,videoId:88,atletaId:2,avaliacao:'POSITIVA',tipoRegistro:'EVENTO'}
  ]);
  prisma.videoPartida.findMany.mockResolvedValue([]);
  const dados=ok(await consultar());
  expect(dados.resumo.total).toBe(0);
  expect(prisma.videoPartida.findMany).toHaveBeenCalledWith(expect.objectContaining({
   where:{id:{in:[88]},partida:{equipe:{treinadorId:7}}}
  }));
 });
 test('conta somente eventos em partidas autorizadas e não canceladas',async()=>{
  prisma.marcacaoVideo.findMany.mockResolvedValue([
   {id:1,videoId:8,avaliacao:'POSITIVA',tipoRegistro:'EVENTO'},
   {id:2,videoId:8,avaliacao:'NEGATIVA',tipoRegistro:'EVENTO'},
   {id:3,videoId:8,avaliacao:'NEUTRA',tipoRegistro:'EVENTO'},
   {id:4,videoId:8,avaliacao:'DESTAQUE',tipoRegistro:'EVENTO'},
   {id:5,videoId:8,avaliacao:'POSITIVA',tipoRegistro:'CLIPE'},
   {id:6,videoId:9,avaliacao:'POSITIVA',tipoRegistro:'EVENTO'}
  ]);
  prisma.videoPartida.findMany.mockResolvedValue([{id:8,partidaId:3},{id:9,partidaId:4}]);
  prisma.partida.findMany.mockResolvedValue([
   {id:3,status:'FINALIZADA',data:'2026-11-15',adversario:'Rivais'},
   {id:4,status:'CANCELADA',data:'2026-11-16',adversario:'Cancelada'}
  ]);
  const dados=ok(await consultar());
  expect(dados.resumo).toMatchObject({boas:1,ruins:1,neutras:1,destaques:1,total:4,partidasComEventos:1});
  expect(dados.desempenho).toBe(50);
  expect(dados.evolucao).toHaveLength(1);
  expect(dados.evolucao[0]).toMatchObject({partidaId:3,valor:50,partida:'P1'});
 });
 test('descobre avaliação pela categoria do treinador quando ausente',async()=>{
  prisma.marcacaoVideo.findMany.mockResolvedValue([
   {id:1,videoId:8,avaliacao:null,categoriaId:2,categoria:'Gol',tipoRegistro:'EVENTO'}
  ]);
  prisma.videoPartida.findMany.mockResolvedValue([{id:8,partidaId:3}]);
  prisma.partida.findMany.mockResolvedValue([{id:3,status:'FINALIZADA'}]);
  prisma.configuracaoAnalise.findMany.mockResolvedValue([{id:2,tipo:'POSITIVA'}]);
  const dados=ok(await consultar());
  expect(dados.resumo.boas).toBe(1);
  expect(prisma.configuracaoAnalise.findMany).toHaveBeenCalledWith(expect.objectContaining({
   where:{id:{in:[2]},treinadorId:7}
  }));
 });
 test('erro inesperado do banco retorna 500 sem dados sensíveis',async()=>{
  prisma.marcacaoVideo.findMany.mockRejectedValue(new Error('falha simulada'));
  const res=await consultar();
  expect(res.status).toHaveBeenCalledWith(500);
  expect(res.json).toHaveBeenCalledWith({mensagem:'Não foi possível carregar as estatísticas do atleta.'});
 });
});
