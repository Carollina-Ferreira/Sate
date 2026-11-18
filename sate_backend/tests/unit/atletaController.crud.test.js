jest.mock('../../src/lib/prisma',()=>{
 const nomes=['treinador','usuario','atleta','responsavel','endereco','notificacao','documento'];
 const metodos=['findUnique','findFirst','findMany','create','update','delete','updateMany','upsert'];
 const db=Object.fromEntries(nomes.map(n=>[n,Object.fromEntries(metodos.map(m=>[m,jest.fn()]))]));
 db.$transaction=jest.fn();
 return db;
});
jest.mock('bcrypt',()=>({hash:jest.fn()}));
jest.mock('../../src/services/notificacaoService',()=>({sincronizarNotificacaoCadastroAtleta:jest.fn()}));
jest.mock('fs',()=>{
 const real=jest.requireActual('fs');
 return {...real,promises:{...real.promises,unlink:jest.fn().mockResolvedValue(undefined)}};
});
const prisma=require('../../src/lib/prisma');
const bcrypt=require('bcrypt');
const fs=require('fs');
const controller=require('../../src/controllers/atletaController');
const {criarResposta}=require('../helpers/resposta');
function req(body={},params={},file){return {usuario:{id:10},body,params,file};}
async function executar(fn,body={},params={},file){const res=criarResposta();await controller[fn](req(body,params,file),res);return res;}
function code(res,n){expect(res.status).toHaveBeenCalledWith(n);}
describe('Atletas - CRUD completo e upload de documentos',()=>{
 beforeEach(()=>{
  jest.resetAllMocks();
  prisma.$transaction.mockImplementation(async callback=>callback(prisma));
  prisma.treinador.findUnique.mockResolvedValue({id:7});
  prisma.usuario.findUnique.mockResolvedValue(null);
  prisma.usuario.findFirst.mockResolvedValue(null);
  prisma.atleta.findUnique.mockResolvedValue(null);
  prisma.atleta.findFirst.mockResolvedValue(null);
  prisma.usuario.create.mockResolvedValue({id:12});
  prisma.atleta.create.mockResolvedValue({id:22,nome:'Marina',cpf:null,rg:null,telefone:null});
  prisma.atleta.findUnique.mockResolvedValue({id:22,nome:'Marina'});
  prisma.atleta.update.mockResolvedValue({});
  prisma.usuario.update.mockResolvedValue({});
  bcrypt.hash.mockResolvedValue('hash-temporario');
 });
 const padrao={nome:'Marina',email:'MARINA@EXEMPLO.COM'};
 test.each([
  [{nome:'  ',email:'a@b.com'},400],
  [{nome:'Maria'},400],
  [{...padrao,dataNascimento:'nada'},400]
 ])('cadastro recusa dados inválidos %p',async body=>{
  code(await executar('criarAtleta',body),400);
  expect(prisma.atleta.create).not.toHaveBeenCalled();
 });
 test('cadastro impede e-mail já existente',async()=>{
  prisma.usuario.findUnique.mockResolvedValue({id:9});
  code(await executar('criarAtleta',padrao),409);
 });
 test('cadastro impede CPF duplicado',async()=>{
  prisma.atleta.findUnique.mockResolvedValueOnce({id:99});
  code(await executar('criarAtleta',{...padrao,cpf:'123'}),409);
 });
 test('cadastro cria usuário e atleta numa transação',async()=>{
  const res=await executar('criarAtleta',padrao);
  code(res,201);
  expect(prisma.$transaction).toHaveBeenCalledTimes(1);
  expect(bcrypt.hash).toHaveBeenCalledWith('SATE@123',10);
  expect(prisma.usuario.create).toHaveBeenCalledWith({data:expect.objectContaining({email:'marina@exemplo.com',tipo:'ATLETA'})});
  expect(prisma.atleta.create).toHaveBeenCalledWith(expect.objectContaining({data:expect.objectContaining({
   nome:'Marina',treinador:{connect:{id:7}},usuario:{connect:{id:12}}
  })}));
 });
 test('cadastro salva data de nascimento, sexo, responsável e endereço',async()=>{
  prisma.responsavel.create.mockResolvedValue({id:4});
  prisma.endereco.create.mockResolvedValue({id:5});
  const res=await executar('criarAtleta',{
    ...padrao,sexo:'Feminino',dataNascimento:'2008-01-01',
    responsavel:{nome:'Patricia',telefone:'11999999999',grauParentesco:'Mãe'},
    endereco:{cep:'06000000',logradouro:'Rua A',numero:'10',bairro:'Centro'}
  });
  code(res,201);
  expect(prisma.responsavel.create).toHaveBeenCalled();
  expect(prisma.endereco.create).toHaveBeenCalled();
  expect(prisma.atleta.create).toHaveBeenCalledWith(expect.objectContaining({data:expect.objectContaining({
   responsavel:{connect:{id:4}},endereco:{connect:{id:5}},sexo:'FEMININO'
  })}));
 });
 test('atualização modifica dados do atleta e nome de usuário',async()=>{
  prisma.atleta.findFirst.mockResolvedValue({id:22,usuarioId:12,usuario:{id:12}});
  const res=await executar('atualizarAtleta',{
   nome:'Nome atualizado',email:'NOVO@exemplo.com',avatarUrl:'/avatar.png',
   cpf:'111',rg:'123',categoria:'Sub-17',telefone:'11999',sexo:'Feminino',dataNascimento:'2007-01-01'
  },{id:'22'});
  code(res,200);
  expect(prisma.atleta.update).toHaveBeenCalledWith(expect.objectContaining({where:{id:22},data:expect.objectContaining({nome:'Nome atualizado',sexo:'FEMININO'})}));
  expect(prisma.usuario.update).toHaveBeenCalledWith(expect.objectContaining({where:{id:12},data:{email:'novo@exemplo.com',avatarUrl:'/avatar.png'}}));
 });
 test.each([
  [{email:'  '},400],
  [{dataNascimento:'data-invalida'},400]
 ])('atualização rejeita dados inválidos',async(body,expected)=>{
  prisma.atleta.findFirst.mockResolvedValue({id:22,usuarioId:12});
  code(await executar('atualizarAtleta',body,{id:'22'}),expected);
 });
 test('atualização rejeita CPF utilizado por outro atleta',async()=>{
  prisma.atleta.findFirst.mockResolvedValueOnce({id:22,usuarioId:12}).mockResolvedValueOnce({id:88});
  code(await executar('atualizarAtleta',{cpf:'111'},{id:'22'}),409);
 });
 test('atualização rejeita e-mail de outro usuário',async()=>{
  prisma.atleta.findFirst.mockResolvedValue({id:22,usuarioId:12});
  prisma.usuario.findFirst.mockResolvedValue({id:88});
  code(await executar('atualizarAtleta',{email:'ocupado@exemplo.com'},{id:'22'}),409);
 });
 test('sem arquivo PDF, recusa documento',async()=>{
  code(await executar('adicionarDocumento',{}, {id:'22'}),400);
 });
 test('upload recusa arquivos que não sejam PDF e remove temporário',async()=>{
  const file={path:'/tmp/teste.png',originalname:'foto.png',mimetype:'image/png',filename:'foto.png'};
  code(await executar('adicionarDocumento',{}, {id:'22'},file),400);
  expect(fs.promises.unlink).toHaveBeenCalledWith('/tmp/teste.png');
  expect(prisma.documento.create).not.toHaveBeenCalled();
 });
 test('documento válido só é vinculado a atleta autorizado',async()=>{
  const file={path:'/tmp/doc.pdf',originalname:'Contrato.pdf',mimetype:'application/pdf',filename:'uuid.pdf'};
  prisma.atleta.findFirst.mockResolvedValue({id:22});
  prisma.documento.create.mockResolvedValue({id:15,nome:'Ficha',atletaId:22});
  const res=await executar('adicionarDocumento',{nome:'Ficha'},{id:'22'},file);
  code(res,201);
  expect(prisma.documento.create).toHaveBeenCalledWith({data:{
   nome:'Ficha',tipo:'PDF',url:'/uploads/documentos/uuid.pdf',atletaId:22
  }});
 });
 test('não permite documento em atleta de outro treinador',async()=>{
  const file={path:'/tmp/doc.pdf',originalname:'Contrato.pdf',mimetype:'application/pdf',filename:'uuid.pdf'};
  code(await executar('adicionarDocumento',{}, {id:'22'},file),404);
  expect(fs.promises.unlink).toHaveBeenCalledWith('/tmp/doc.pdf');
  expect(prisma.documento.create).not.toHaveBeenCalled();
 });
});
