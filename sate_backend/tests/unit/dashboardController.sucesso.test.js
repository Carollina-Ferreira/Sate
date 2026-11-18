jest.mock('../../src/lib/prisma', () => ({
  treinador: { findUnique:jest.fn() },
  atleta: { count:jest.fn(), findMany:jest.fn() },
  equipe: { count:jest.fn(), findMany:jest.fn() },
  partida: { count:jest.fn(), findMany:jest.fn() }
}));
const prisma=require('../../src/lib/prisma');
const {criarResposta}=require('../helpers/resposta');
const {obterDashboard}=require('../../src/controllers/dashboardController');

function preparar({atletas=0,equipes=0,partidas=0,alertas=0,ultimas=[],calendario=[],equipesBanco=[],atividadePartidas=[],atividadeAtletas=[],atividadeEquipes=[],grafico=[]}={}) {
  prisma.treinador.findUnique.mockResolvedValue({id:7,nome:'Professor Marcos',usuario:{email:'professor@example.com'}});
  prisma.atleta.count.mockResolvedValue(atletas);
  prisma.equipe.count.mockResolvedValue(equipes);
  prisma.partida.count.mockImplementation(({where}) =>
    Promise.resolve(where?.status==='AGENDADA' ? alertas : partidas)
  );
  prisma.atleta.findMany.mockResolvedValue(atividadeAtletas);
  prisma.equipe.findMany
    .mockResolvedValueOnce(equipesBanco)
    .mockResolvedValueOnce(atividadeEquipes);
  prisma.partida.findMany
    .mockResolvedValueOnce(ultimas)
    .mockResolvedValueOnce(calendario)
    .mockResolvedValueOnce(atividadePartidas)
    .mockResolvedValueOnce(grafico);
}
async function executar(){
  const res=criarResposta();
  await obterDashboard({usuario:{id:10}},res);
  return res;
}
function conteudo(res) {
  expect(res.status).toHaveBeenCalledWith(200);
  return res.json.mock.calls.at(-1)[0];
}
describe('Dashboard: cenários completos de sucesso',()=>{
  beforeEach(()=>jest.resetAllMocks());

  test('painel vazio responde com resumos, gráficos e listas',async()=>{
    preparar();
    const retorno=conteudo(await executar());
    expect(retorno.treinador).toEqual({id:7,nome:'Professor Marcos',email:'professor@example.com'});
    expect(retorno.resumos).toHaveLength(4);
    expect(retorno.resumos[0]).toMatchObject({titulo:'Atletas',valor:0});
    expect(retorno.resumos[1]).toMatchObject({titulo:'Equipes',valor:0});
    expect(retorno.atividades).toEqual([]);
    expect(retorno.equipes).toEqual([]);
    expect(retorno.partidas).toEqual([]);
    expect(retorno.partidasCalendario).toEqual([]);
    expect(Object.keys(retorno.desempenho)).toEqual(['Últimas 7 partidas','Últimas 5 partidas','Últimas 3 partidas']);
    expect(prisma.partida.findMany).toHaveBeenCalledTimes(4);
  });

  test('preenche calendário, atividades recentes, equipes e resultados reais',async()=>{
    const data=new Date('2026-11-12T14:30:00.000Z');
    const partida={id:3,adversario:'Rivais',equipe:{nome:'SATE',modalidade:'Futebol'},data,
      status:'FINALIZADA',golsEquipe:3,golsAdversario:1,updatedAt:data};
    const equipe={id:7,nome:'SATE FC',modalidade:'Futebol',categoria:'Sub-17',
      corEquipe:'#16A875',imagem:null,atletas:[{id:2}],
      partidas:[{id:3,golsEquipe:3,golsAdversario:1,data}]};
    const atleta={id:2,nome:'Marina',usuario:{nome:'Marina'},updatedAt:data};
    const equipeAtividade={id:7,nome:'SATE FC',updatedAt:data};
    preparar({atletas:1,equipes:1,partidas:1,ultimas:[partida],calendario:[partida],
      equipesBanco:[equipe],atividadePartidas:[partida],atividadeAtletas:[atleta],
      atividadeEquipes:[equipeAtividade],
      grafico:[{id:3,data,golsEquipe:3,golsAdversario:1}]});
    const retorno=conteudo(await executar());
    expect(retorno.resumos[0].valor).toBe(1);
    expect(retorno.partidas[0]).toMatchObject({id:3,equipe:'SATE',adversario:'Rivais'});
    expect(retorno.partidasCalendario[0].id).toBe(3);
    expect(retorno.atividades).toHaveLength(3);
    expect(retorno.equipes[0]).toMatchObject({id:7,atletas:1});
  });

  test('sem partidas, diferença de totais e alertas não causa divisão por zero',async()=>{
    preparar({atletas:10,equipes:2,alertas:2});
    const retorno=conteudo(await executar());
    expect(retorno.resumos[0].valor).toBe(10);
    expect(retorno.resumos[1].valor).toBe(2);
    expect(retorno.resumos[3].valor).toBe(2);
  });

  test('falha em consulta de indicadores retorna erro HTTP 500',async()=>{
    preparar();
    prisma.partida.count.mockRejectedValue(new Error('falha interna de consulta'));
    const res=await executar();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({mensagem:'Erro ao carregar o dashboard.'}));
  });
});
