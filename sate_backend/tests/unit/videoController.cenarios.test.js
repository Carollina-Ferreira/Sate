// Testes reais de regras e persistência simulada: nenhum acesso ao MySQL.
jest.mock('../../src/lib/prisma', () => {
  const operacoes = ['findUnique','findFirst','findMany','create','update','delete'];
  const nomes = ['treinador','partida','videoPartida','marcacaoVideo','anotacaoVideo','atleta','configuracaoAnalise'];
  return Object.fromEntries(nomes.map(nome => [nome,
    Object.fromEntries(operacoes.map(op => [op, jest.fn()]))
  ]));
});
jest.mock('fs', () => {
  const original = jest.requireActual('fs');
  return { ...original, promises: { ...original.promises, unlink: jest.fn().mockResolvedValue(undefined) } };
});
const prisma = require('../../src/lib/prisma');
const fs = require('fs');
const video = require('../../src/controllers/videoController');
const { criarResposta } = require('../helpers/resposta');

function req(params = {}, body = {}) {
  return { usuario: { id: 10 }, params, body };
}
const diretor = { id: 7, usuarioId: 10 };
const arquivoVideo = { id: 4, partidaId: 5, nomeArquivo: 'video.mp4' };
function prepararVideo() {
  prisma.treinador.findUnique.mockResolvedValue(diretor);
  prisma.videoPartida.findFirst.mockResolvedValue(arquivoVideo);
}
async function executar(func, requisicao) {
  const res = criarResposta();
  await video[func](requisicao, res);
  return res;
}
function status(res, codigo) {
  expect(res.status).toHaveBeenCalledWith(codigo);
}
describe('videoController - regras de negócio', () => {
  beforeEach(() => jest.resetAllMocks());

  test.each([
    ['listarVideos','partidaId'],
    ['adicionarVideo','partidaId'],
    ['excluirVideo','id'],
    ['listarMarcacoes','videoId'],
    ['adicionarMarcacao','videoId'],
    ['editarMarcacao','id'],
    ['excluirMarcacao','id'],
    ['listarAnotacoes','videoId'],
    ['adicionarAnotacao','videoId'],
    ['excluirAnotacao','id']
  ])('%s recusa ID inválido', async (func, campo) => {
    const res = await executar(func, req({ [campo]: 'abc' }));
    status(res,400);
    expect(prisma.treinador.findUnique).not.toHaveBeenCalled();
  });

  test.each([
    ['listarVideos',{partidaId:'5'}],
    ['excluirVideo',{id:'4'}],
    ['listarMarcacoes',{videoId:'4'}],
    ['adicionarMarcacao',{videoId:'4'}],
    ['editarMarcacao',{id:'4'}],
    ['excluirMarcacao',{id:'4'}],
    ['listarAnotacoes',{videoId:'4'}],
    ['adicionarAnotacao',{videoId:'4'}],
    ['excluirAnotacao',{id:'4'}]
  ])('%s recusa treinador não encontrado', async (func, params) => {
    prisma.treinador.findUnique.mockResolvedValue(null);
    const res = await executar(func, req(params));
    status(res,401);
  });

  test('upload sem arquivo não cria vídeo', async () => {
    const res = await executar('adicionarVideo', req({partidaId:'5'}));
    status(res,400);
    expect(prisma.videoPartida.create).not.toHaveBeenCalled();
  });

  test('listar vídeos de partida sem acesso retorna 404', async () => {
    prisma.treinador.findUnique.mockResolvedValue(diretor);
    prisma.partida.findFirst.mockResolvedValue(null);
    const res = await executar('listarVideos', req({ partidaId: '5' }));
    status(res,404);
    expect(prisma.videoPartida.findMany).not.toHaveBeenCalled();
  });
  test('listar vídeos da partida retorna coleção', async () => {
    prisma.treinador.findUnique.mockResolvedValue(diretor);
    prisma.partida.findFirst.mockResolvedValue({ id:5 });
    prisma.videoPartida.findMany.mockResolvedValue([]);
    const res = await executar('listarVideos', req({partidaId:'5'}));
    status(res,200);
    expect(res.json).toHaveBeenCalledWith([]);
    expect(prisma.videoPartida.findMany).toHaveBeenCalledWith(expect.objectContaining({ where: { partidaId:5 } }));
  });

  test.each([
    ['listarMarcacoes','marcacaoVideo','findMany'],
    ['listarAnotacoes','anotacaoVideo','findMany']
  ])('%s retorna lista vazia quando não há registros', async (func, modelo, metodo) => {
    prepararVideo();
    prisma[modelo][metodo].mockResolvedValue([]);
    const res = await executar(func, req({videoId:'4'}));
    status(res,200);
    expect(res.json).toHaveBeenCalledWith([]);
  });
  test('listar marcações preserva associação com a partida e nome do atleta', async () => {
    prepararVideo();
    prisma.marcacaoVideo.findMany.mockResolvedValue([
      { id:8, atleta: {id:2,nome:'',usuario:{nome:'Camila'}} }
    ]);
    const res = await executar('listarMarcacoes', req({videoId:'4'}));
    status(res,200);
    expect(res.json).toHaveBeenCalledWith([
      expect.objectContaining({partidaId:5, atleta:expect.objectContaining({nome:'Camila'})})
    ]);
  });
  test.each(['listarVideos','listarMarcacoes','listarAnotacoes'])('%s retorna 500 em falha do banco', async func => {
    prepararVideo();
    prisma.partida.findFirst.mockResolvedValue({id:5});
    prisma.videoPartida.findMany.mockRejectedValue(new Error('Banco indisponível'));
    prisma.marcacaoVideo.findMany.mockRejectedValue(new Error('Banco indisponível'));
    prisma.anotacaoVideo.findMany.mockRejectedValue(new Error('Banco indisponível'));
    const params = func==='listarVideos'?{partidaId:'5'}:{videoId:'4'};
    const res=await executar(func, req(params));
    status(res,500);
  });

  test('não permite evento sem atleta e categoria', async () => {
    prepararVideo();
    const res = await executar('adicionarMarcacao', req({videoId:'4'},{
      titulo:'Passe',categoria:'boa',tempoInicio:1,tempoFim:5,tipoRegistro:'EVENTO'
    }));
    status(res,400);
    expect(prisma.marcacaoVideo.create).not.toHaveBeenCalled();
  });
  test('rejeita tempo final anterior ao início da marcação', async () => {
    prepararVideo();
    const res = await executar('adicionarMarcacao', req({videoId:'4'},{
      titulo:'Clipe',categoria:'clipe',tempoInicio:9,tempoFim:2,tipoRegistro:'CLIPE'
    }));
    status(res,400);
  });
  test('clipe pode ser criado sem atleta', async () => {
    prepararVideo();
    prisma.marcacaoVideo.create.mockResolvedValue({id:9,atleta:null});
    const res = await executar('adicionarMarcacao', req({videoId:'4'},{
      titulo:'Contra-ataque',categoria:'clipe',tempoInicio:2,tempoFim:8,tipoRegistro:'CLIPE'
    }));
    status(res,201);
    expect(prisma.marcacaoVideo.create).toHaveBeenCalledWith(expect.objectContaining({
      data:expect.objectContaining({videoId:4,atletaId:null,tipoRegistro:'CLIPE'})
    }));
  });
  test('evento com atleta e categoria da equipe é criado', async () => {
    prepararVideo();
    // Busca da categoria usa um segundo findFirst no mesmo delegado.
    prisma.videoPartida.findFirst
      .mockResolvedValueOnce(arquivoVideo)
      .mockResolvedValueOnce({partida:{equipeId:6}});
    prisma.configuracaoAnalise.findFirst.mockResolvedValue({id:3});
    prisma.atleta.findFirst.mockResolvedValue({id:2});
    prisma.marcacaoVideo.create.mockResolvedValue({id:8,atleta:{id:2,nome:'Maria'}});
    const res=await executar('adicionarMarcacao',req({videoId:'4'},{
      titulo:'Passe certo',categoria:'boa',tipoRegistro:'EVENTO',
      tempoInicio:3,tempoFim:6,atletaId:2,categoriaId:3
    }));
    status(res,201);
    expect(prisma.atleta.findFirst).toHaveBeenCalled();
  });
  test('impede associar marcação a outra partida', async () => {
    prepararVideo();
    const res=await executar('adicionarMarcacao',req({videoId:'4'},{
      partidaId:99
    }));
    status(res,400);
  });

  test('desenho com tempo inválido é rejeitado', async () => {
    prepararVideo();
    const res=await executar('adicionarAnotacao',req({videoId:'4'},{tempo:-1,formas:[]}));
    status(res,400);
  });
  test('desenho com coordenadas fora do vídeo é rejeitado', async () => {
    prepararVideo();
    const res=await executar('adicionarAnotacao',req({videoId:'4'},{
      tempo:1,formas:[{tipo:'linha',cor:'#fff',pontos:[{x:2,y:0.5}]}]
    }));
    status(res,400);
  });
  test('rejeita desenho sem formas', async () => {
    prepararVideo();
    const res=await executar('adicionarAnotacao',req({videoId:'4'},{tempo:2,formas:[]}));
    status(res,400);
    expect(prisma.anotacaoVideo.create).not.toHaveBeenCalled();
  });
  test('cria desenho válido e associa ao vídeo', async () => {
    prepararVideo();
    prisma.anotacaoVideo.create.mockResolvedValue({id:20});
    const res=await executar('adicionarAnotacao',req({videoId:'4'},{
      tempo:5,formas:[{tipo:'linha',cor:'#ffffff',pontos:[{x:0.1,y:0.5},{x:0.9,y:0.5}]}]
    }));
    status(res,201);
    expect(prisma.anotacaoVideo.create).toHaveBeenCalled();
  });
  test.each([
    ['excluirMarcacao','marcacaoVideo'],
    ['excluirAnotacao','anotacaoVideo']
  ])('%s não permite excluir recurso de outro treinador', async (func,model) => {
    prisma.treinador.findUnique.mockResolvedValue(diretor);
    prisma[model].findFirst.mockResolvedValue(null);
    const res=await executar(func,req({id:'4'}));
    status(res,404);
    expect(prisma[model].delete).not.toHaveBeenCalled();
  });
  test.each([
    ['excluirMarcacao','marcacaoVideo'],
    ['excluirAnotacao','anotacaoVideo']
  ])('%s exclui apenas recurso autorizado', async (func,model) => {
    prisma.treinador.findUnique.mockResolvedValue(diretor);
    prisma[model].findFirst.mockResolvedValue({id:4});
    prisma[model].delete.mockResolvedValue({id:4});
    const res=await executar(func,req({id:'4'}));
    status(res,200);
    expect(prisma[model].delete).toHaveBeenCalledWith({where:{id:4}});
  });
  test('excluir vídeo retira registro e arquivo', async () => {
    prepararVideo();
    prisma.videoPartida.delete.mockResolvedValue({id:4});
    const res=await executar('excluirVideo',req({id:'4'}));
    status(res,200);
    expect(prisma.videoPartida.delete).toHaveBeenCalledWith({where:{id:4}});
    expect(fs.promises.unlink).toHaveBeenCalled();
  });
});
