jest.mock('../../src/lib/prisma',()=>({
 usuario:{findUnique:jest.fn(),create:jest.fn()},treinador:{findUnique:jest.fn()},atleta:{findUnique:jest.fn()}
}));
jest.mock('bcrypt',()=>({hash:jest.fn(),compare:jest.fn()}));
const prisma=require('../../src/lib/prisma');
const bcrypt=require('bcrypt');
const {cadastro,login}=require('../../src/controllers/authController');
const {criarResposta}=require('../helpers/resposta');
const cadastroValido={nome:'Atleta',email:'atleta@exemplo.com',senha:'senhaforte123'};
const loginValido={email:'atleta@exemplo.com',senha:'senhaforte123',tipo:'ATLETA'};
async function executar(func,body){
 const res=criarResposta();await func({body,ip:'127.0.0.1'},res);return res;
}
function retorno(res,codigo){expect(res.status).toHaveBeenCalledWith(codigo);}
describe('Cloudflare Turnstile - validação tradicional da autenticação',()=>{
 const antigaFetch=global.fetch;
 const antigaChave=process.env.TURNSTILE_SECRET_KEY;
 const antigosHosts=process.env.TURNSTILE_ALLOWED_HOSTNAMES;
 beforeEach(()=>{
   jest.resetAllMocks();
   process.env.TURNSTILE_SECRET_KEY='segredo-de-teste-turnstile';
   delete process.env.TURNSTILE_ALLOWED_HOSTNAMES;
   prisma.usuario.findUnique.mockResolvedValue(null);
   bcrypt.hash.mockResolvedValue('hash-seguro');
   global.fetch=jest.fn().mockResolvedValue({
     ok:true,json:jest.fn().mockResolvedValue({success:true,action:'signup',hostname:'localhost'})
   });
 });
 afterAll(()=>{
   global.fetch=antigaFetch;
   if(antigaChave===undefined)delete process.env.TURNSTILE_SECRET_KEY;else process.env.TURNSTILE_SECRET_KEY=antigaChave;
   if(antigosHosts===undefined)delete process.env.TURNSTILE_ALLOWED_HOSTNAMES;else process.env.TURNSTILE_ALLOWED_HOSTNAMES=antigosHosts;
 });
 test.each([
   [undefined,'token ausente'],
   ['', 'token vazio'],
   [100,'token numérico'],
   ['a'.repeat(2049),'token muito longo']
 ])('cadastro recusa %s (%s)',async token=>{
   retorno(await executar(cadastro,{...cadastroValido,turnstileToken:token}),400);
   expect(global.fetch).not.toHaveBeenCalled();
 });
 test('não aceita resposta HTTP negativa do Turnstile',async()=>{
   global.fetch.mockResolvedValue({ok:false});
   retorno(await executar(cadastro,{...cadastroValido,turnstileToken:'captcha'}),400);
 });
 test('não aceita resposta indicando desafio reprovado',async()=>{
   global.fetch.mockResolvedValue({ok:true,json:jest.fn().mockResolvedValue({success:false,action:'signup'})});
   retorno(await executar(cadastro,{...cadastroValido,turnstileToken:'captcha'}),400);
 });
 test('recusa ação de CAPTCHA incompatível com cadastro',async()=>{
   global.fetch.mockResolvedValue({ok:true,json:jest.fn().mockResolvedValue({success:true,action:'auth'})});
   retorno(await executar(cadastro,{...cadastroValido,turnstileToken:'captcha'}),400);
 });
 test('recusa CAPTCHA de host não autorizado',async()=>{
   process.env.TURNSTILE_ALLOWED_HOSTNAMES='localhost, site.com';
   global.fetch.mockResolvedValue({ok:true,json:jest.fn().mockResolvedValue({success:true,action:'signup',hostname:'intruso.com'})});
   retorno(await executar(cadastro,{...cadastroValido,turnstileToken:'captcha'}),400);
 });
 test('recusa CAPTCHA sem hostname quando exigido',async()=>{
   process.env.TURNSTILE_ALLOWED_HOSTNAMES='localhost';
   global.fetch.mockResolvedValue({ok:true,json:jest.fn().mockResolvedValue({success:true,action:'signup'})});
   retorno(await executar(cadastro,{...cadastroValido,turnstileToken:'captcha'}),400);
 });
 test('permite CAPTCHA de host cadastrado em letras diferentes',async()=>{
   process.env.TURNSTILE_ALLOWED_HOSTNAMES='LOCALHOST,site.com';
   prisma.usuario.create.mockResolvedValue({id:1,nome:'Atleta',email:'atleta@exemplo.com',tipo:null,primeiroAcesso:false});
   const res=await executar(cadastro,{...cadastroValido,turnstileToken:'captcha'});
   retorno(res,201);
   expect(global.fetch).toHaveBeenCalledWith(expect.any(String),expect.objectContaining({
      method:'POST',body:expect.stringContaining('segredo-de-teste-turnstile')
   }));
 });
 test('falha de rede do CAPTCHA não permite acesso',async()=>{
   global.fetch.mockRejectedValue(new Error('rede indisponível'));
   retorno(await executar(cadastro,{...cadastroValido,turnstileToken:'captcha'}),400);
 });
 test('login exige ação auth do Turnstile',async()=>{
   global.fetch.mockResolvedValue({ok:true,json:jest.fn().mockResolvedValue({success:true,action:'signup'})});
   retorno(await executar(login,{...loginValido,turnstileToken:'captcha'}),400);
 });
 test('chave distribuída no app não ignora CAPTCHA em produção',async()=>{
   const chaveAntiga=process.env.MOBILE_APP_KEY;
   const ambienteAntigo=process.env.NODE_ENV;
   process.env.MOBILE_APP_KEY='chave-publica-do-app';
   process.env.NODE_ENV='production';
   try {
     const res=criarResposta();
     await cadastro({body:cadastroValido,ip:'127.0.0.1',
       headers:{'x-sate-app-key':'chave-publica-do-app'}},res);
     retorno(res,400);
     expect(global.fetch).not.toHaveBeenCalled();
   } finally {
     if(chaveAntiga===undefined)delete process.env.MOBILE_APP_KEY;
     else process.env.MOBILE_APP_KEY=chaveAntiga;
     process.env.NODE_ENV=ambienteAntigo;
   }
 });
 test('login permite validar CAPTCHA com ação auth',async()=>{
   global.fetch.mockResolvedValue({ok:true,json:jest.fn().mockResolvedValue({success:true,action:'auth'})});
   retorno(await executar(login,{...loginValido,turnstileToken:'captcha'}),401);
   expect(prisma.usuario.findUnique).toHaveBeenCalled();
 });
});
