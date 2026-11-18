jest.mock('../../src/lib/prisma', () => ({
  treinador:{findUnique:jest.fn()},
  equipe:{findFirst:jest.fn()},
  configuracaoAnalise:{findMany:jest.fn(),findFirst:jest.fn(),create:jest.fn(),update:jest.fn(),delete:jest.fn()},
  $transaction:jest.fn()
}));
const prisma=require('../../src/lib/prisma');
const {criarResposta}=require('../helpers/resposta');
const controller=require('../../src/controllers/configuracaoAnaliseController');
const requisicao=(body={},params={},query={})=>({usuario:{id:10},body,params,query});
async function executar(nome,body={},params={},query={}) {
 const res=criarResposta();
 await controller[nome](requisicao(body,params,query),res);
 return res;
}
function codigo(res,status){expect(res.status).toHaveBeenCalledWith(status);}
describe('Categorias de análise - CRUD, validação e ordenação',()=>{
 beforeEach(()=>{
  jest.resetAllMocks();
  prisma.treinador.findUnique.mockResolvedValue({id:7,usuarioId:10});
  prisma.configuracaoAnalise.findFirst.mockResolvedValue(null);
  prisma.configuracaoAnalise.findMany.mockResolvedValue([]);
  prisma.$transaction.mockImplementation(async operacoes=>Promise.all(operacoes));
 });
 test('lista categorias ordenadas apenas do treinador',async()=>{
   const res=await executar('listarConfiguracoesAnalise');
   codigo(res,200);
   expect(prisma.configuracaoAnalise.findMany).toHaveBeenCalledWith(expect.objectContaining({where:{treinadorId:7}}));
   expect(res.json).toHaveBeenCalledWith({configuracoes:[]});
 });
 test('filtra categorias de equipe própria e gerais',async()=>{
   prisma.equipe.findFirst.mockResolvedValue({id:2});
   const res=await executar('listarConfiguracoesAnalise',{}, {}, {equipeId:'2'});
   codigo(res,200);
   expect(prisma.configuracaoAnalise.findMany).toHaveBeenCalledWith(expect.objectContaining({
     where:{treinadorId:7,OR:[{equipeId:2},{equipeId:null}]}
   }));
 });
 test('equipe não pertencente ao treinador resulta em 404',async()=>{
   prisma.equipe.findFirst.mockResolvedValue(null);
   codigo(await executar('listarConfiguracoesAnalise',{}, {},{equipeId:'2'}),404);
 });
 test.each([
   [{nome:'',tipo:'POSITIVA'},400],
   [{nome:'Passe',tipo:'TIPO_DESCONHECIDO'},400],
   [{nome:'Passe',mostrarNaTimeline:'sim'},400],
   [{nome:'Passe',equipeId:'x'},400],
   [{nome:'Passe',ordem:'abc'},400]
 ])('não permite criar categoria com campos inválidos %p',async body=>{
   codigo(await executar('criarConfiguracaoAnalise',body),400);
   expect(prisma.configuracaoAnalise.create).not.toHaveBeenCalled();
 });
 test('recusa categoria duplicada',async()=>{
   prisma.configuracaoAnalise.findMany.mockResolvedValue([{id:12,nome:'Passe'}]);
   codigo(await executar('criarConfiguracaoAnalise',{nome:'Passe'}),409);
   expect(prisma.configuracaoAnalise.create).not.toHaveBeenCalled();
 });
 test('cria categoria padrão com ordem inicial',async()=>{
   prisma.configuracaoAnalise.create.mockResolvedValue({id:17,nome:'Passe',tipo:'POSITIVA'});
   const res=await executar('criarConfiguracaoAnalise',{nome:'  Passe  '});
   codigo(res,201);
   expect(prisma.configuracaoAnalise.create).toHaveBeenCalledWith(expect.objectContaining({data:expect.objectContaining({
     nome:'Passe',tipo:'POSITIVA',ordem:0,treinadorId:7,equipeId:null
   })}));
 });
 test('cria categoria com ordem após a última',async()=>{
   prisma.configuracaoAnalise.findFirst.mockResolvedValue({ordem:4});
   prisma.configuracaoAnalise.create.mockResolvedValue({id:18,nome:'Assistência'});
   codigo(await executar('criarConfiguracaoAnalise',{nome:'Assistência'}),201);
   expect(prisma.configuracaoAnalise.create).toHaveBeenCalledWith(expect.objectContaining({data:expect.objectContaining({ordem:5})}));
 });
 test('não atualiza categoria inexistente',async()=>{
   codigo(await executar('atualizarConfiguracaoAnalise',{nome:'Nome'},{id:'9'}),404);
   expect(prisma.configuracaoAnalise.update).not.toHaveBeenCalled();
 });
 test('atualiza nome, tipo, cor e exibição da categoria',async()=>{
   prisma.configuracaoAnalise.findFirst
     .mockResolvedValueOnce({id:9,nome:'Original',equipeId:null})
     .mockResolvedValueOnce(null);
   prisma.configuracaoAnalise.update.mockResolvedValue({id:9,nome:'Passe certo'});
   const res=await executar('atualizarConfiguracaoAnalise',{
     nome:'  Passe certo ',tipo:'POSITIVA',cor:'#16A875',mostrarNaTimeline:false
   },{id:'9'});
   codigo(res,200);
   expect(prisma.configuracaoAnalise.update).toHaveBeenCalledWith(expect.objectContaining({
     where:{id:9},data:expect.objectContaining({nome:'Passe certo',cor:'#16A875',mostrarNaTimeline:false})
   }));
 });
 test.each([
   [{nome:''},400],
   [{tipo:'RUIM'},400],
   [{mostrarNaTimeline:'false'},400],
   [{ordem:'invalido'},400]
 ])('recusa atualização inválida %p',async body=>{
   prisma.configuracaoAnalise.findFirst.mockResolvedValue({id:9,nome:'Original',equipeId:null});
   codigo(await executar('atualizarConfiguracaoAnalise',body,{id:'9'}),400);
   expect(prisma.configuracaoAnalise.update).not.toHaveBeenCalled();
 });
 test('não exclui categoria pertencente a outro treinador',async()=>{
   codigo(await executar('excluirConfiguracaoAnalise',{}, {id:'9'}),404);
   expect(prisma.configuracaoAnalise.delete).not.toHaveBeenCalled();
 });
 test('exclui categoria autorizada',async()=>{
   prisma.configuracaoAnalise.findFirst.mockResolvedValue({id:9});
   prisma.configuracaoAnalise.delete.mockResolvedValue({id:9});
   codigo(await executar('excluirConfiguracaoAnalise',{}, {id:'9'}),200);
   expect(prisma.configuracaoAnalise.delete).toHaveBeenCalledWith({where:{id:9}});
 });
 test.each([
   [null,400],
   [[{id:0,ordem:1}],400],
   [[{id:2,ordem:'x'}],400],
   [[{id:2,ordem:1},{id:2,ordem:2}],400]
 ])('reordenação rejeita lista inválida %p',async itens=>{
   codigo(await executar('atualizarOrdemConfiguracoes',{configuracoes:itens}),400);
 });
 test('reordenação recusa IDs de outro treinador',async()=>{
   prisma.configuracaoAnalise.findMany.mockResolvedValue([]);
   codigo(await executar('atualizarOrdemConfiguracoes',{configuracoes:[{id:2,ordem:1}]}),404);
 });
 test('reordena categorias dentro de uma transação',async()=>{
   prisma.configuracaoAnalise.findMany
     .mockResolvedValueOnce([{id:2},{id:3}])
     .mockResolvedValueOnce([{id:3,ordem:0},{id:2,ordem:1}]);
   prisma.configuracaoAnalise.update.mockResolvedValue({});
   const res=await executar('atualizarOrdemConfiguracoes',{
     configuracoes:[{id:2,ordem:1},{id:3,ordem:0}]
   });
   codigo(res,200);
   expect(prisma.$transaction).toHaveBeenCalledTimes(1);
   expect(prisma.configuracaoAnalise.update).toHaveBeenCalledTimes(2);
 });
});
