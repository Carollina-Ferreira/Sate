jest.mock('../../src/lib/prisma',()=>({
 treinador:{findUnique:jest.fn()},
 atleta:{count:jest.fn(),findMany:jest.fn()},
 equipe:{count:jest.fn(),findMany:jest.fn()},
 partida:{count:jest.fn(),findMany:jest.fn()}
}));
const prisma=require('../../src/lib/prisma');
const {obterDashboard}=require('../../src/controllers/dashboardController');
const {criarResposta}=require('../helpers/resposta');
const agora=Date.now();
const dias=n=>new Date(agora-n*86400000);
function partida(id,status,golsEquipe,golsAdversario,data=dias(2)){
 return {id,equipe:{nome:'SATE',modalidade:'Futebol'},adversario:'Rival',status,golsEquipe,golsAdversario,data,updatedAt:data};
}
function prepara({ultimas=[],calendario=[],grafico=[],equipes=[],atividadePartidas=[],atividadeAtletas=[],atividadeEquipes=[],atletasContagem=[0,0,0],equipesContagem=[0,0,0],partidasContagem=[0,0,0,0]}){
 prisma.treinador.findUnique.mockResolvedValue({id:7,usuario:{nome:'Marcos',email:'marcos@exemplo.com'}});
 prisma.atleta.count.mockImplementationOnce(()=>Promise.resolve(atletasContagem[0]))
   .mockImplementationOnce(()=>Promise.resolve(atletasContagem[1]))
   .mockImplementationOnce(()=>Promise.resolve(atletasContagem[2]));
 prisma.equipe.count.mockImplementationOnce(()=>Promise.resolve(equipesContagem[0]))
   .mockImplementationOnce(()=>Promise.resolve(equipesContagem[1]))
   .mockImplementationOnce(()=>Promise.resolve(equipesContagem[2]));
 partidasContagem.forEach(n=>prisma.partida.count.mockResolvedValueOnce(n));
 prisma.partida.findMany
   .mockResolvedValueOnce(ultimas)
   .mockResolvedValueOnce(calendario)
   .mockResolvedValueOnce(atividadePartidas)
   .mockResolvedValueOnce(grafico);
 prisma.equipe.findMany.mockResolvedValueOnce(equipes).mockResolvedValueOnce(atividadeEquipes);
 prisma.atleta.findMany.mockResolvedValue(atividadeAtletas);
}
async function executar(){
 const res=criarResposta();
 await obterDashboard({usuario:{id:10}},res);
 expect(res.status).toHaveBeenCalledWith(200);
 return res.json.mock.calls.at(-1)[0];
}
describe('Dashboard - resultados, evolução, variações e datas',()=>{
 beforeEach(()=>jest.resetAllMocks());
 test('gráfico classifica vitória, derrota, empate e partida sem placar',async()=>{
  const jogos=[
   partida(1,'FINALIZADA',2,1),
   partida(2,'FINALIZADA',0,2),
   partida(3,'FINALIZADA',1,1),
   partida(4,'AGENDADA',null,null)
  ];
  prepara({grafico:jogos,ultimas:jogos,calendario:jogos});
  const retorno=await executar();
  expect(retorno.desempenho['Últimas 7 partidas'].equipe).toEqual([0,50,0,100]);
  expect(retorno.desempenho['Últimas 7 partidas'].adversario).toEqual([0,50,100,0]);
  expect(retorno.partidas.map(p=>p.status)).toEqual(['Finalizada','Finalizada','Finalizada','Pendente']);
  expect(retorno.partidas.at(-1).resultado).toBe('—');
 });
 test('formata status EM_ANDAMENTO e CANCELADA para o calendário',async()=>{
  const jogos=[partida(1,'EM_ANDAMENTO',null,null),partida(2,'CANCELADA',0,0)];
  prepara({calendario:jogos});
  const retorno=await executar();
  expect(retorno.partidasCalendario.map(p=>p.status)).toEqual(['Em andamento','Cancelada']);
 });
 test('calcula variações mensais com histórico e crescimento',async()=>{
  prepara({atletasContagem:[12,6,3],equipesContagem:[4,1,2],partidasContagem:[2,1,1,1]});
  const retorno=await executar();
  expect(retorno.resumos[0].variacao).toBe(100);
  expect(retorno.resumos[1].variacao).toBe(-50);
  expect(retorno.resumos[2].variacao).toBe(0);
 });
 test('progresso de equipes considera vitória, empate, derrota e ausência de placar',async()=>{
  const equipes=[
   {id:1,nome:'SATE FC',modalidade:'Futebol',atletas:[{id:1}],partidas:[
    {id:1,golsEquipe:2,golsAdversario:1},
    {id:2,golsEquipe:1,golsAdversario:1},
    {id:3,golsEquipe:0,golsAdversario:2}
   ]},
   {id:2,nome:'Rugby',modalidade:'Rugby',atletas:[],partidas:[]},
   {id:3,nome:null,modalidade:'Basquete',atletas:[],partidas:[{id:4,golsEquipe:null,golsAdversario:null}]}
  ];
  prepara({equipes});
  const retorno=await executar();
  expect(retorno.equipes[0].desempenho).toBe(50);
  expect(retorno.equipes.find(e=>e.id===2).sigla).toBe('RU');
  expect(retorno.equipes.find(e=>e.id===3).sigla).toBe('--');
 });
 test('datas de atividades têm formatos relativos e equipes podem ter nome abreviado',async()=>{
  const atividades=[
   partida(10,'FINALIZADA',1,0,new Date()),
   partida(11,'AGENDADA',null,null,new Date(agora-90*60000))
  ];
  const atletas=[{id:1,nome:'Marina',updatedAt:dias(1)},{id:2,nome:null,usuario:{nome:'João'},updatedAt:dias(3)}];
  const equipes=[{id:1,nome:'Equipe A',updatedAt:dias(10)}];
  prepara({atividadePartidas:atividades,atividadeAtletas:atletas,atividadeEquipes:equipes});
  const retorno=await executar();
  expect(retorno.atividades).toHaveLength(4);
  expect(retorno.atividades.some(a=>a.tipo==='atleta')).toBe(true);
  expect(retorno.atividades.some(a=>a.horario==='Ontem')).toBe(true);
 });
});
