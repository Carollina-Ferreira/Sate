jest.mock('../../src/lib/prisma',()=>({
 usuario:{findUnique:jest.fn(),update:jest.fn()},
 passwordResetToken:{deleteMany:jest.fn(),create:jest.fn(),delete:jest.fn(),findUnique:jest.fn(),updateMany:jest.fn()},
 $transaction:jest.fn()
}));
jest.mock('bcrypt',()=>({hash:jest.fn()}));
jest.mock('nodemailer',()=>({createTransport:jest.fn()}));
const prisma=require('../../src/lib/prisma');
const bcrypt=require('bcrypt');
const nodemailer=require('nodemailer');
const controller=require('../../src/controllers/passwordController');
const {criarResposta}=require('../helpers/resposta');
async function executar(fn,body){const res=criarResposta();await controller[fn]({body},res);return res;}
function status(res,n){expect(res.status).toHaveBeenCalledWith(n);}
describe('Recuperação de senha - segurança e transações',()=>{
 const old={SMTP_HOST:process.env.SMTP_HOST,SMTP_USER:process.env.SMTP_USER,SMTP_PASS:process.env.SMTP_PASS};
 beforeEach(()=>{
  jest.resetAllMocks();
  process.env.SMTP_HOST='smtp.exemplo.com';process.env.SMTP_USER='teste@exemplo.com';process.env.SMTP_PASS='senha-teste';
  prisma.$transaction.mockImplementation(async cb=>cb(prisma));
  prisma.passwordResetToken.create.mockResolvedValue({id:4});
  prisma.passwordResetToken.updateMany.mockResolvedValue({count:1});
  bcrypt.hash.mockResolvedValue('hash-senha-nova');
  nodemailer.createTransport.mockReturnValue({sendMail:jest.fn().mockResolvedValue({messageId:'fake'})});
 });
 afterAll(()=>{for(const [k,v] of Object.entries(old)){if(v===undefined)delete process.env[k];else process.env[k]=v;}});
 test('não revela se endereço de e-mail não existe',async()=>{
  prisma.usuario.findUnique.mockResolvedValue(null);
  const res=await executar('solicitarRecuperacao',{email:'naoexiste@exemplo.com'});
  status(res,200);
  expect(prisma.passwordResetToken.create).not.toHaveBeenCalled();
 });
 test('cria token com hash e envia e-mail simulado para conta cadastrada',async()=>{
  prisma.usuario.findUnique.mockResolvedValue({id:2,email:'maria@exemplo.com',nome:'Maria'});
  const res=await executar('solicitarRecuperacao',{email:'MARIA@exemplo.com'});
  status(res,200);
  expect(prisma.passwordResetToken.deleteMany).toHaveBeenCalledWith({where:{usuarioId:2}});
  expect(prisma.passwordResetToken.create).toHaveBeenCalledWith({data:expect.objectContaining({
   usuarioId:2,tokenHash:expect.any(String),expiresAt:expect.any(Date)
  })});
  expect(nodemailer.createTransport).toHaveBeenCalled();
 });
 test('não mantém token caso SMTP falhe',async()=>{
  prisma.usuario.findUnique.mockResolvedValue({id:2,email:'maria@exemplo.com'});
  nodemailer.createTransport.mockReturnValue({sendMail:jest.fn().mockRejectedValue(new Error('SMTP offline'))});
  status(await executar('solicitarRecuperacao',{email:'maria@exemplo.com'}),500);
  expect(prisma.passwordResetToken.delete).toHaveBeenCalledWith({where:{id:4}});
 });
 test('não aceita redefinição de token inexistente',async()=>{
  prisma.passwordResetToken.findUnique.mockResolvedValue(null);
  status(await executar('redefinirSenha',{token:'inexistente',senha:'senha-1234'}),400);
  expect(prisma.usuario.update).not.toHaveBeenCalled();
 });
 test.each([
   [{token:'abc',senha:'curta'},400],
   [{token:'abc'},400],
   [{senha:'senha-valida'},400]
 ])('rejeita token ou senha inválidos %p',async body=>{
  status(await executar('redefinirSenha',body),400);
 });
 test('rejeita token vencido',async()=>{
  prisma.passwordResetToken.findUnique.mockResolvedValue({id:4,usuarioId:2,expiresAt:new Date(Date.now()-1000)});
  status(await executar('redefinirSenha',{token:'vencido',senha:'senha-nova-123'}),400);
 });
 test('rejeita token já utilizado',async()=>{
  prisma.passwordResetToken.findUnique.mockResolvedValue({id:4,usuarioId:2,usedAt:new Date(),expiresAt:new Date(Date.now()+360000)});
  status(await executar('redefinirSenha',{token:'usado',senha:'senha-nova-123'}),400);
 });
 test('redefine senha dentro da transação e invalida outros tokens',async()=>{
  prisma.passwordResetToken.findUnique.mockResolvedValue({id:4,usuarioId:2,usedAt:null,expiresAt:new Date(Date.now()+360000)});
  const res=await executar('redefinirSenha',{token:'valido',senha:'senha-nova-123'});
  status(res,200);
  expect(bcrypt.hash).toHaveBeenCalledWith('senha-nova-123',12);
  expect(prisma.passwordResetToken.updateMany).toHaveBeenCalledWith(expect.objectContaining({where:expect.objectContaining({id:4,usedAt:null})}));
  expect(prisma.usuario.update).toHaveBeenCalledWith({where:{id:2},data:{senha:'hash-senha-nova'}});
  expect(prisma.passwordResetToken.deleteMany).toHaveBeenCalledWith({where:{usuarioId:2,id:{not:4}}});
 });
 test('não redefine senha se token foi consumido em outra requisição',async()=>{
  prisma.passwordResetToken.findUnique.mockResolvedValue({id:4,usuarioId:2,usedAt:null,expiresAt:new Date(Date.now()+360000)});
  prisma.passwordResetToken.updateMany.mockResolvedValue({count:0});
  status(await executar('redefinirSenha',{token:'valido',senha:'senha-nova-123'}),400);
  expect(prisma.usuario.update).not.toHaveBeenCalled();
 });
});
