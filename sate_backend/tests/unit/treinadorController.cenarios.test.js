jest.mock('../../src/lib/prisma',()=>({
 treinador:{findUnique:jest.fn(),update:jest.fn()},
 usuario:{update:jest.fn()}
}));
const prisma=require('../../src/lib/prisma');
const controller=require('../../src/controllers/treinadorController');
const {criarResposta}=require('../helpers/resposta');
async function executar(fn,body={},params={id:'7'}){
 const res=criarResposta();
 await controller[fn]({params,body},res);
 return res;
}
describe('Treinadores - consulta, atualização, campos opcionais e falhas',()=>{
 beforeEach(()=>{
  jest.resetAllMocks();
  prisma.treinador.findUnique.mockResolvedValue({id:7,nome:'Marcos',usuarioId:10});
  prisma.treinador.update.mockResolvedValue({id:7,nome:'Marcos atualizado'});
 });
 test('busca dados existentes',async()=>{
  const res=await executar('buscarTreinador');
  expect(res.json).toHaveBeenCalledWith({id:7,nome:'Marcos',usuarioId:10});
 });
 test('busca trata falha no Prisma',async()=>{
  prisma.treinador.findUnique.mockRejectedValue(new Error('banco simulado'));
  const res=await executar('buscarTreinador');
  expect(res.status).toHaveBeenCalledWith(500);
 });
 test('atualiza nome e e-mail do treinador',async()=>{
  const res=await executar('atualizarTreinador',{nome:'Novo nome',email:'novo@exemplo.com'});
  expect(res.json).toHaveBeenCalledWith(expect.objectContaining({mensagem:'Treinador atualizado com sucesso.'}));
  expect(prisma.treinador.update).toHaveBeenCalledWith(expect.objectContaining({data:{nome:'Novo nome'}}));
  expect(prisma.usuario.update).toHaveBeenCalledWith({where:{id:10},data:{email:'novo@exemplo.com'}});
 });
 test('atualizar somente nome não altera e-mail',async()=>{
  await executar('atualizarTreinador',{nome:'Marcos'});
  expect(prisma.usuario.update).not.toHaveBeenCalled();
 });
 test('atualizar só e-mail não altera nome',async()=>{
  await executar('atualizarTreinador',{email:'outro@exemplo.com'});
  expect(prisma.treinador.update).toHaveBeenCalledWith(expect.objectContaining({data:{}}));
  expect(prisma.usuario.update).toHaveBeenCalled();
 });
 test('falha na atualização retorna 500',async()=>{
  prisma.treinador.update.mockRejectedValue(new Error('banco simulado'));
  const res=await executar('atualizarTreinador',{nome:'Teste'});
  expect(res.status).toHaveBeenCalledWith(500);
 });
});
