jest.mock('../../src/lib/prisma',()=>({
 usuario:{findFirst:jest.fn(),findUnique:jest.fn(),update:jest.fn()}
}));
jest.mock('fs',()=>{
 const real=jest.requireActual('fs');
 return {...real,existsSync:jest.fn(),unlinkSync:jest.fn()};
});
const prisma=require('../../src/lib/prisma');
const fs=require('fs');
const controller=require('../../src/controllers/usuarioController');
const {criarResposta}=require('../helpers/resposta');
async function executar(fn,{body={},file,usuario={id:10}}={}) {
 const res=criarResposta();await controller[fn]({body,file,usuario},res);return res;
}
describe('Perfil de usuário - validação, segurança e foto',()=>{
 beforeEach(()=>{
   jest.resetAllMocks();
   prisma.usuario.findFirst.mockResolvedValue(null);
   prisma.usuario.findUnique.mockResolvedValue({id:10,nome:'Marina',avatarUrl:'/uploads/perfil/antiga.jpg'});
   prisma.usuario.update.mockResolvedValue({id:10,nome:'Novo',email:'novo@exemplo.com',avatarUrl:null});
 });
 test('consulta perfil retorna usuário sem senha',async()=>{
  const res=await executar('buscarPerfil');
  expect(res.status).toHaveBeenCalledWith(200);
  expect(prisma.usuario.findUnique).toHaveBeenCalledWith(expect.objectContaining({select:expect.not.objectContaining({senha:true})}));
 });
 test('não consulta perfil sem autenticação',async()=>{
  const res=await executar('buscarPerfil',{usuario:{id:0}});
  expect(res.status).toHaveBeenCalledWith(401);
 });
 test('atualização recusa e-mail duplicado',async()=>{
  prisma.usuario.findFirst.mockResolvedValue({id:22});
  const res=await executar('atualizarPerfil',{body:{nome:'Novo',email:'novo@exemplo.com'}});
  expect(res.status).toHaveBeenCalledWith(409);
  expect(prisma.usuario.update).not.toHaveBeenCalled();
 });
 test('atualização normaliza nome e endereço',async()=>{
  const res=await executar('atualizarPerfil',{body:{nome:'  Novo ',email:'NOVO@EXEMPLO.COM'}});
  expect(res.status).toHaveBeenCalledWith(200);
  expect(prisma.usuario.update).toHaveBeenCalledWith(expect.objectContaining({
    data:{nome:'Novo',email:'novo@exemplo.com',avatarUrl:'/uploads/perfil/antiga.jpg'}
  }));
 });
 test('atualização só usa avatar informado quando existe upload',async()=>{
  fs.existsSync.mockReturnValue(false);
  const res=await executar('atualizarPerfil',{
    body:{nome:'Novo',email:'novo@exemplo.com'},file:{filename:'nova.png'}
  });
  expect(res.status).toHaveBeenCalledWith(200);
  expect(prisma.usuario.update).toHaveBeenCalledWith(expect.objectContaining({
    data:expect.objectContaining({avatarUrl:'/uploads/perfil/nova.png'})
  }));
  expect(fs.unlinkSync).not.toHaveBeenCalled();
 });
 test('nova foto substitui foto antiga no servidor',async()=>{
  fs.existsSync.mockReturnValue(true);
  const res=await executar('atualizarPerfil',{
    body:{nome:'Novo',email:'novo@exemplo.com'},file:{filename:'nova.png'}
  });
  expect(res.status).toHaveBeenCalledWith(200);
  expect(fs.unlinkSync).toHaveBeenCalledTimes(1);
 });
 test('falha ao remover imagem antiga não impede atualização do perfil',async()=>{
  fs.existsSync.mockReturnValue(true);
  fs.unlinkSync.mockImplementation(()=>{throw new Error('arquivo bloqueado');});
  const res=await executar('atualizarPerfil',{
    body:{nome:'Novo',email:'novo@exemplo.com'},file:{filename:'nova.png'}
  });
  expect(res.status).toHaveBeenCalledWith(200);
 });
 test('perfil inexistente retorna 404 na atualização',async()=>{
  prisma.usuario.findUnique.mockResolvedValue(null);
  const res=await executar('atualizarPerfil',{body:{nome:'Novo',email:'novo@exemplo.com'}});
  expect(res.status).toHaveBeenCalledWith(404);
 });
 test('erro no banco ao atualizar retorna 500',async()=>{
  prisma.usuario.update.mockRejectedValue(new Error('falha simulada'));
  const res=await executar('atualizarPerfil',{body:{nome:'Novo',email:'novo@exemplo.com'}});
  expect(res.status).toHaveBeenCalledWith(500);
 });
});
