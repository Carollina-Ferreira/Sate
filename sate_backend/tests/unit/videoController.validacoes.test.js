jest.mock('../../src/lib/prisma',()=>({
 treinador:{findUnique:jest.fn()},videoPartida:{findFirst:jest.fn(),create:jest.fn(),delete:jest.fn()},
 partida:{findFirst:jest.fn()},marcacaoVideo:{findFirst:jest.fn(),create:jest.fn(),update:jest.fn(),delete:jest.fn()},
 anotacaoVideo:{findFirst:jest.fn(),create:jest.fn(),delete:jest.fn()},
 configuracaoAnalise:{findFirst:jest.fn()},atleta:{findFirst:jest.fn()}
}));
const prisma=require('../../src/lib/prisma');
const controller=require('../../src/controllers/videoController');
const {criarResposta}=require('../helpers/resposta');
async function executar(fn,body={},params={videoId:'4',id:'4',partidaId:'5'}){
 const res=criarResposta();
 await controller[fn]({usuario:{id:10},params,body},res);
 return res;
}
describe('Vídeos - validações profundas das marcações e desenhos',()=>{
 beforeEach(()=>{
  jest.resetAllMocks();
  prisma.treinador.findUnique.mockResolvedValue({id:7});
  prisma.videoPartida.findFirst.mockResolvedValue({id:4,partidaId:5});
  prisma.partida.findFirst.mockResolvedValue({id:5});
  prisma.marcacaoVideo.create.mockResolvedValue({id:1,atleta:null});
  prisma.anotacaoVideo.create.mockResolvedValue({id:1});
 });
 const clipe={titulo:'Lance',categoria:'clipe',tipoRegistro:'CLIPE',tempoInicio:1,tempoFim:5};
 test.each([
  [{...clipe,titulo:''},400],
  [{...clipe,titulo:'a'.repeat(121)},400],
  [{...clipe,categoria:''},400],
  [{...clipe,categoria:'a'.repeat(81)},400],
  [{...clipe,tempoInicio:7,tempoFim:5},400],
  [{...clipe,tempoInicio:-1},400],
  [{...clipe,tempoInicio:'x'},400],
  [{...clipe,tempoFim:null},400],
  [{...clipe,tipoRegistro:'DESCONHECIDO'},400],
  [{...clipe,observacao:'a'.repeat(5001)},400],
  [{...clipe,atletaId:'invalido'},400],
  [{...clipe,categoriaId:'invalido'},400],
  [{...clipe,avaliacao:'invalido'},400]
 ])('recusa marcação com dados inválidos %p',async(body,n)=>{
  const res=await executar('adicionarMarcacao',body);
  expect(res.status).toHaveBeenCalledWith(n);
  expect(prisma.marcacaoVideo.create).not.toHaveBeenCalled();
 });
 test('evento exige atleta e categoria',async()=>{
  const evento={titulo:'Passe',categoria:'boa',tipoRegistro:'EVENTO',tempoInicio:1,tempoFim:5};
  const semAtleta=await executar('adicionarMarcacao',evento);
  expect(semAtleta.status).toHaveBeenCalledWith(400);
  const semCategoria=await executar('adicionarMarcacao',{...evento,atletaId:2});
  expect(semCategoria.status).toHaveBeenCalledWith(400);
 });
 test('recusa atleta fora da escalação',async()=>{
  const evento={titulo:'Passe',categoria:'boa',tipoRegistro:'EVENTO',tempoInicio:1,tempoFim:5,atletaId:2,categoriaId:3};
  prisma.videoPartida.findFirst.mockResolvedValueOnce({id:4,partidaId:5}).mockResolvedValueOnce({partida:{equipeId:6}});
  prisma.configuracaoAnalise.findFirst.mockResolvedValue({id:3});
  prisma.atleta.findFirst.mockResolvedValue(null);
  const res=await executar('adicionarMarcacao',evento);
  expect(res.status).toHaveBeenCalledWith(400);
  expect(prisma.marcacaoVideo.create).not.toHaveBeenCalled();
 });
 test.each([
  [undefined,400],
  [[],400],
  [Array.from({length:501},()=>({tipo:'linha',cor:'#fff',pontos:[{x:0,y:0}]})),400],
  [[null],400],
  [[{tipo:'desconhecido',cor:'#fff',pontos:[{x:0,y:0}]}],400],
  [[{tipo:'linha',cor:1,pontos:[{x:0,y:0}]}],400],
  [[{tipo:'linha',cor:'#fff',pontos:[]}],400],
  [[{tipo:'linha',cor:'#fff',pontos:[{x:-0.1,y:0}]}],400],
  [[{tipo:'linha',cor:'#fff',pontos:[{x:0.2,y:1.1}]}],400],
  [[{tipo:'numero',cor:'#fff',pontos:[{x:0.2,y:0.2}],valor:'abc'}],400]
 ])('não salva formas inválidas %p',async formas=>{
  const res=await executar('adicionarAnotacao',{tempo:5,duracao:3,formas});
  expect(res.status).toHaveBeenCalledWith(400);
  expect(prisma.anotacaoVideo.create).not.toHaveBeenCalled();
 });
 test('anotação tipo número válida é armazenada',async()=>{
  const formas=[{tipo:'numero',cor:'#fff',pontos:[{x:0.2,y:0.2}],valor:3}];
  const res=await executar('adicionarAnotacao',{tempo:5,duracao:3,formas});
  expect(res.status).toHaveBeenCalledWith(201);
  expect(prisma.anotacaoVideo.create).toHaveBeenCalledWith({data:{videoId:4,tempo:5,duracao:3,formas}});
 });
 test.each([-1,3601,'x'])('rejeita duração inválida %s',async duracao=>{
  const res=await executar('adicionarAnotacao',{tempo:5,duracao,formas:[{tipo:'linha',cor:'#fff',pontos:[{x:0,y:0}]}]});
  expect(res.status).toHaveBeenCalledWith(400);
 });
});
