jest.mock('../../src/lib/prisma',()=>({
 usuario:{findUnique:jest.fn(),create:jest.fn(),update:jest.fn()},
 treinador:{findUnique:jest.fn(),create:jest.fn()},
 atleta:{findUnique:jest.fn(),create:jest.fn()}
}));
jest.mock('bcrypt',()=>({hash:jest.fn(),compare:jest.fn()}));
jest.mock('jsonwebtoken',()=>({sign:jest.fn()}));
const prisma=require('../../src/lib/prisma');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const {cadastro,login}=require('../../src/controllers/authController');
const {criarResposta}=require('../helpers/resposta');
const novo={nome:'Marina',email:'Marina@exemplo.com',senha:'senha-segura-123'};
const acesso={email:'Marina@exemplo.com',senha:'senha-segura-123',tipo:'TREINADOR'};
async function executar(func,body) {
 const res=criarResposta();await func({body,ip:'127.0.0.1'},res);return res;
}
function verificar(res,code){expect(res.status).toHaveBeenCalledWith(code);}
describe('Cadastro e login - regras e perfis',()=>{
 const oldSecret=process.env.JWT_SECRET,oldTurnstile=process.env.TURNSTILE_SECRET_KEY;
 beforeEach(()=>{
  jest.resetAllMocks();
  process.env.JWT_SECRET='segredo-teste';
  delete process.env.TURNSTILE_SECRET_KEY;
  jwt.sign.mockReturnValue('token-falso-assinado');
  bcrypt.hash.mockResolvedValue('hash-senha');
  bcrypt.compare.mockResolvedValue(true);
 });
 afterAll(()=>{
  if(oldSecret===undefined)delete process.env.JWT_SECRET;else process.env.JWT_SECRET=oldSecret;
  if(oldTurnstile===undefined)delete process.env.TURNSTILE_SECRET_KEY;else process.env.TURNSTILE_SECRET_KEY=oldTurnstile;
 });
 test.each([
  [{...novo,nome:'   '},400],
  [{...novo,email:'email-invalido'},400],
  [{...novo,email:'x'.repeat(250)+'@mail.com'},400],
  [{...novo,senha:'abc'},400]
 ])('impede cadastro com dados inválidos: %p',async body=>{
  verificar(await executar(cadastro,body),400);
  expect(prisma.usuario.create).not.toHaveBeenCalled();
 });
 test('normaliza e-mail e rejeita endereço duplicado',async()=>{
  prisma.usuario.findUnique.mockResolvedValue({id:1});
  const res=await executar(cadastro,novo);
  verificar(res,409);
  expect(prisma.usuario.findUnique).toHaveBeenCalledWith({where:{email:'marina@exemplo.com'}});
 });
 test('salva senha criptografada e conta verificada conforme regra atual',async()=>{
  prisma.usuario.findUnique.mockResolvedValue(null);
  prisma.usuario.create.mockResolvedValue({id:1,nome:'Marina',email:'marina@exemplo.com',tipo:null,primeiroAcesso:false});
  const res=await executar(cadastro,novo);
  verificar(res,201);
  expect(bcrypt.hash).toHaveBeenCalledWith('senha-segura-123',10);
  expect(prisma.usuario.create).toHaveBeenCalledWith({data:expect.objectContaining({
    nome:'Marina',email:'marina@exemplo.com',senha:'hash-senha',emailVerificado:true
  })});
 });
 test('falha de banco no cadastro retorna 500',async()=>{
  prisma.usuario.findUnique.mockRejectedValue(new Error('falha simulada'));
  verificar(await executar(cadastro,novo),500);
 });
 test('login não revela se endereço está cadastrado',async()=>{
  prisma.usuario.findUnique.mockResolvedValue(null);
  verificar(await executar(login,acesso),401);
  expect(bcrypt.compare).not.toHaveBeenCalled();
 });
 test('login recusa senha incorreta',async()=>{
  prisma.usuario.findUnique.mockResolvedValue({id:1,senha:'hash'});
  bcrypt.compare.mockResolvedValue(false);
  verificar(await executar(login,acesso),401);
 });
 test('login recusa perfil incompatível',async()=>{
  prisma.usuario.findUnique.mockResolvedValue({id:1,tipo:'ATLETA',senha:'hash'});
  verificar(await executar(login,acesso),403);
  expect(jwt.sign).not.toHaveBeenCalled();
 });
 test('login retorna JWT para treinador existente',async()=>{
  prisma.usuario.findUnique.mockResolvedValue({id:1,nome:'Marina',tipo:'TREINADOR',senha:'hash'});
  prisma.treinador.findUnique.mockResolvedValue({id:5});
  const res=await executar(login,acesso);
  expect(res.json).toHaveBeenCalledWith(expect.objectContaining({token:'token-falso-assinado'}));
  expect(jwt.sign).toHaveBeenCalledWith({id:1,tipo:'TREINADOR'},'segredo-teste',{expiresIn:'7d'});
 });
 test('login cria perfil do treinador quando ausente',async()=>{
  prisma.usuario.findUnique.mockResolvedValue({id:1,nome:'Marina',tipo:'TREINADOR',senha:'hash'});
  prisma.treinador.findUnique.mockResolvedValue(null);
  const res=await executar(login,acesso);
  expect(res.json).toHaveBeenCalledWith(expect.objectContaining({token:'token-falso-assinado'}));
  expect(prisma.treinador.create).toHaveBeenCalledWith({data:{nome:'Marina',usuarioId:1}});
 });
 test('login de atleta cria perfil quando ausente',async()=>{
  prisma.usuario.findUnique.mockResolvedValue({id:2,nome:'Lucas',tipo:'ATLETA',senha:'hash'});
  prisma.atleta.findUnique.mockResolvedValue(null);
  const res=await executar(login,{...acesso,tipo:'ATLETA'});
  expect(res.json).toHaveBeenCalledWith(expect.objectContaining({token:'token-falso-assinado'}));
  expect(prisma.atleta.create).toHaveBeenCalledWith({data:{nome:'Lucas',usuarioId:2}});
 });
 test.each(['ATLETA','TREINADOR'])('primeiro login escolhe perfil %s',async tipo=>{
  const antes={id:3,nome:'Primeiro acesso',senha:'hash',tipo:null};
  const depois={...antes,tipo,primeiroAcesso:tipo==='TREINADOR'};
  prisma.usuario.findUnique.mockResolvedValue(antes);
  prisma.usuario.update.mockResolvedValue(depois);
  prisma.treinador.findUnique.mockResolvedValue(null);
  prisma.atleta.findUnique.mockResolvedValue(null);
  const res=await executar(login,{...acesso,tipo});
  expect(prisma.usuario.update).toHaveBeenCalledWith({where:{id:3},data:expect.objectContaining({tipo})});
  expect(res.json).toHaveBeenCalledWith(expect.objectContaining({token:'token-falso-assinado'}));
 });
 test('JWT_SECRET ausente é tratado como falha do login',async()=>{
  delete process.env.JWT_SECRET;
  prisma.usuario.findUnique.mockResolvedValue({id:1,nome:'Marina',tipo:'TREINADOR',senha:'hash'});
  prisma.treinador.findUnique.mockResolvedValue({id:5});
  verificar(await executar(login,acesso),500);
 });
});
