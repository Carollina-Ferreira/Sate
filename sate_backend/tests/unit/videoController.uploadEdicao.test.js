jest.mock('../../src/lib/prisma',()=>({
 treinador:{findUnique:jest.fn()},partida:{findFirst:jest.fn()},
 videoPartida:{create:jest.fn(),findFirst:jest.fn()},
 marcacaoVideo:{findFirst:jest.fn(),update:jest.fn()},
 configuracaoAnalise:{findFirst:jest.fn()},atleta:{findFirst:jest.fn()}
}));
jest.mock('fs',()=>{
 const fs=jest.requireActual('fs');
 return {...fs,promises:{...fs.promises,unlink:jest.fn()}};
});
const prisma=require('../../src/lib/prisma');
const fs=require('fs');
const controller=require('../../src/controllers/videoController');
const {criarResposta}=require('../helpers/resposta');
async function executar(fn,body={},params={},file){
 const res=criarResposta();
 await controller[fn]({usuario:{id:10},body,params,file},res);
 return res;
}
const file={path:'/tmp/video.mp4',filename:'uuid.mp4',originalname:'Jogo.mp4',mimetype:'video/mp4',size:10000};
const clipe={id:2,videoId:4,titulo:'Clipe',categoria:'clipe',tipoRegistro:'CLIPE',tempoInicio:1,tempoFim:3,avaliacao:'NEUTRA',atletaId:null,categoriaId:null};
describe('Vídeos - upload e atualização de marcações',()=>{
 beforeEach(()=>{
  jest.resetAllMocks();
  prisma.treinador.findUnique.mockResolvedValue({id:7});
  prisma.partida.findFirst.mockResolvedValue({id:5});
  prisma.videoPartida.create.mockResolvedValue({id:4});
  prisma.videoPartida.findFirst.mockResolvedValue({id:4,partidaId:5,partida:{equipeId:3}});
  prisma.marcacaoVideo.findFirst.mockResolvedValue(clipe);
  prisma.marcacaoVideo.update.mockResolvedValue({id:2,atleta:null});
  fs.promises.unlink.mockResolvedValue(undefined);
 });
 test('upload de vídeo cria vínculo à partida autorizada',async()=>{
  const res=await executar('adicionarVideo',{titulo:'Jogo de teste'},{partidaId:'5'},file);
  expect(res.status).toHaveBeenCalledWith(201);
  expect(prisma.videoPartida.create).toHaveBeenCalledWith({data:{
   partidaId:5,titulo:'Jogo de teste',nomeArquivo:'uuid.mp4',
   url:'/uploads/videos/uuid.mp4',tipo:'video/mp4',tamanho:10000
  }});
  expect(fs.promises.unlink).not.toHaveBeenCalled();
 });
 test('upload sem título informado usa nome do arquivo',async()=>{
  const res=await executar('adicionarVideo',{}, {partidaId:'5'},file);
  expect(res.status).toHaveBeenCalledWith(201);
  expect(prisma.videoPartida.create).toHaveBeenCalledWith(expect.objectContaining({data:expect.objectContaining({titulo:'Jogo'})}));
 });
 test('upload de vídeo só permite partidas do treinador',async()=>{
  prisma.partida.findFirst.mockResolvedValue(null);
  const res=await executar('adicionarVideo',{}, {partidaId:'5'},file);
  expect(res.status).toHaveBeenCalledWith(404);
  expect(fs.promises.unlink).toHaveBeenCalledWith('/tmp/video.mp4');
  expect(prisma.videoPartida.create).not.toHaveBeenCalled();
 });
 test('upload não mantém arquivo órfão se banco falhar',async()=>{
  prisma.videoPartida.create.mockRejectedValue(new Error('falha simulada'));
  const res=await executar('adicionarVideo',{}, {partidaId:'5'},file);
  expect(res.status).toHaveBeenCalledWith(500);
  expect(fs.promises.unlink).toHaveBeenCalledWith('/tmp/video.mp4');
 });
 test('upload rejeita nome armazenado ausente e remove arquivo temporário',async()=>{
  const res=await executar('adicionarVideo',{}, {partidaId:'5'},{...file,filename:''});
  expect(res.status).toHaveBeenCalledWith(400);
  expect(fs.promises.unlink).toHaveBeenCalledWith('/tmp/video.mp4');
 });
 test('edição de clipe autorizada mantém dados e altera título',async()=>{
  const res=await executar('editarMarcacao',{titulo:'Clipe novo'},{id:'2'});
  expect(res.status).toHaveBeenCalledWith(200);
  expect(prisma.marcacaoVideo.update).toHaveBeenCalledWith(expect.objectContaining({
   where:{id:2},data:expect.objectContaining({titulo:'Clipe novo',tipoRegistro:'CLIPE'})
  }));
 });
 test('edição recusa marcação de outro treinador',async()=>{
  prisma.marcacaoVideo.findFirst.mockResolvedValue(null);
  const res=await executar('editarMarcacao',{titulo:'Alteração'},{id:'2'});
  expect(res.status).toHaveBeenCalledWith(404);
  expect(prisma.marcacaoVideo.update).not.toHaveBeenCalled();
 });
 test('edição rejeita tempo final anterior ao inicial',async()=>{
  const res=await executar('editarMarcacao',{tempoInicio:10,tempoFim:5},{id:'2'});
  expect(res.status).toHaveBeenCalledWith(400);
  expect(prisma.marcacaoVideo.update).not.toHaveBeenCalled();
 });
});
