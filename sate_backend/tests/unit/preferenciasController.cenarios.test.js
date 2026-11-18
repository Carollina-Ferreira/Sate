jest.mock('../../src/lib/prisma',()=>({preferenciasUsuario:{findUnique:jest.fn(),upsert:jest.fn()}}));
const prisma=require('../../src/lib/prisma');
const {listarPreferencias,salvarPreferencias}=require('../../src/controllers/preferenciasController');
const {criarResposta}=require('../helpers/resposta');
async function executar(fn,body={},usuario={id:10}){
 const res=criarResposta();await fn({body,usuario},res);return res;
}
describe('Preferências - valores padrão, erros e formatos',()=>{
 beforeEach(()=>jest.resetAllMocks());
 test('sem registro de preferências usa valores padrão verdadeiros',async()=>{
  prisma.preferenciasUsuario.findUnique.mockResolvedValue(null);
  const res=await executar(listarPreferencias);
  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith({preferencias:{email:true,push:true}});
 });
 test('registro com preferências desativadas retorna false',async()=>{
  prisma.preferenciasUsuario.findUnique.mockResolvedValue({email:false,push:false});
  const res=await executar(listarPreferencias);
  expect(res.json).toHaveBeenCalledWith({preferencias:{email:false,push:false}});
 });
 test('falha de banco na consulta retorna 500',async()=>{
  prisma.preferenciasUsuario.findUnique.mockRejectedValue(new Error('falha simulada'));
  const res=await executar(listarPreferencias);
  expect(res.status).toHaveBeenCalledWith(500);
 });
 test('falha de banco ao salvar retorna 500',async()=>{
  prisma.preferenciasUsuario.upsert.mockRejectedValue(new Error('falha simulada'));
  const res=await executar(salvarPreferencias,{email:true,push:false});
  expect(res.status).toHaveBeenCalledWith(500);
 });
 test.each([
  [{email:true},400],
  [{push:true},400],
  [{email:1,push:false},400],
  [{email:true,push:'não'},400]
 ])('não aceita preferências incompletas ou não booleanas',async(body,status)=>{
  const res=await executar(salvarPreferencias,body);
  expect(res.status).toHaveBeenCalledWith(status);
  expect(prisma.preferenciasUsuario.upsert).not.toHaveBeenCalled();
 });
 test('usuário de ID inválido não pode salvar preferências',async()=>{
  const res=await executar(salvarPreferencias,{email:true,push:true},{id:'inválido'});
  expect(res.status).toHaveBeenCalledWith(401);
 });
});
