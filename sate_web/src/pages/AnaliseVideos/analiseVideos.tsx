import {
  ArrowLeft,
  Check,
  Clock3,
  Edit3,
  Flag,
  Pause,
  Play,
  Plus,
  Scissors,
  Trophy,
  Video,
  X,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  RotateCcw,
  RotateCw,
} from 'lucide-react';

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
} from 'react';

import styles from './analiseVideos.module.css';

const API_URL = 'http://localhost:3000/api';

/* =========================================================
   INTERFACES
========================================================= */

interface VideoPartida {
  id: number;
  titulo?: string;
  nome?: string;
  url: string;
  nomeArquivo?: string;
  tipo?: string | null;
  tamanho?: number | string | null;
  duracao?: string;
  createdAt?: string;
}

interface Partida {
  id: number;
  equipe: string;
  adversario: string;
  data: string;
  modalidade: string;
  videos: VideoPartida[];
}

interface PartidaBackend {
  id: number;
  adversario?: string | null;
  data?: string | null;
  local?: string | null;
  campeonato?: string | null;
  rodada?: string | null;
  status?: string | null;

  equipe?: {
    id: number;
    nome: string;
    modalidade?: string | null;
  } | null;

  videos?: VideoPartida[];
}

interface Evento {
  id: number;
  nome: string;
  descricao: string;
  tipo: 'boa' | 'ruim' | 'neutra' | 'destaque';
  segundo: number;
  duracao: number;
}

interface Categoria {
  id: number;
  nome: string;
  tipo: 'boa' | 'ruim' | 'neutra' | 'destaque';
}

interface Clipe {
  id: number;
  nome: string;
  inicio: number;
  fim: number;
}

/* =========================================================
   EVENTOS INICIAIS
========================================================= */

const eventosIniciais: Evento[] = [
  {
    id: 1,
    nome: 'Boa jogada',
    descricao: 'Construção ofensiva',
    tipo: 'boa',
    segundo: 12,
    duracao: 8,
  },
  {
    id: 2,
    nome: 'Erro',
    descricao: 'Perda de posse',
    tipo: 'ruim',
    segundo: 38,
    duracao: 6,
  },
  {
    id: 3,
    nome: 'Neutro',
    descricao: 'Posse de bola',
    tipo: 'neutra',
    segundo: 65,
    duracao: 10,
  },
  {
    id: 4,
    nome: 'Destaque',
    descricao: 'Grande oportunidade',
    tipo: 'destaque',
    segundo: 90,
    duracao: 7,
  },
];

/* =========================================================
   FUNÇÕES AUXILIARES
========================================================= */

function obterToken() {
  return (
    localStorage.getItem('token') ||
    localStorage.getItem('accessToken') ||
    sessionStorage.getItem('token')
  );
}

function normalizarUrlVideo(url: string) {
  if (!url) {
    return '';
  }

  if (
    url.startsWith('http://') ||
    url.startsWith('https://') ||
    url.startsWith('blob:')
  ) {
    return url;
  }

  if (url.startsWith('/')) {
    return `http://localhost:3000${url}`;
  }

  return `http://localhost:3000/${url}`;
}

function formatarData(data?: string | null) {
  if (!data) {
    return '--/--/----';
  }

  const valor = new Date(data);

  if (Number.isNaN(valor.getTime())) {
    return data;
  }

  return valor.toLocaleDateString('pt-BR');
}

function converterDuracao(valor: string) {
  const partes = valor.split(':').map(Number);

  if (partes.length === 3) {
    return (
      partes[0] * 3600 +
      partes[1] * 60 +
      partes[2]
    );
  }

  if (partes.length === 2) {
    return partes[0] * 60 + partes[1];
  }

  return 0;
}

function formatarTempo(segundos: number) {
  if (!Number.isFinite(segundos)) {
    return '00:00';
  }

  const horas = Math.floor(segundos / 3600);

  const minutos = Math.floor(
    (segundos % 3600) / 60,
  );

  const segundosRestantes = Math.floor(
    segundos % 60,
  );

  if (horas > 0) {
    return `${String(horas).padStart(
      2,
      '0',
    )}:${String(minutos).padStart(
      2,
      '0',
    )}:${String(segundosRestantes).padStart(
      2,
      '0',
    )}`;
  }

  return `${String(minutos).padStart(
    2,
    '0',
  )}:${String(segundosRestantes).padStart(
    2,
    '0',
  )}`;
}

function obterNomeVideo(video: VideoPartida) {
  return (
    video.titulo ||
    video.nome ||
    video.nomeArquivo ||
    'Vídeo da partida'
  );
}

function estimarDuracaoVideo(
  video: VideoPartida,
) {
  if (video.duracao) {
    return converterDuracao(
      video.duracao,
    );
  }

  return 0;
}

/* =========================================================
   COMPONENTE
========================================================= */

export default function AnaliseVideos() {
  const videoRef =
    useRef<HTMLVideoElement | null>(null);

  const videoAreaRef =
    useRef<HTMLDivElement | null>(null);

  /* =====================================================
     PARTIDAS
  ===================================================== */

  const [partidas, setPartidas] =
    useState<Partida[]>([]);

  const [
    carregandoPartidas,
    setCarregandoPartidas,
  ] = useState(true);

  const [
    carregandoVideos,
    setCarregandoVideos,
  ] = useState(false);

  const [
    partidaSelecionadaId,
    setPartidaSelecionadaId,
  ] = useState(0);

  const [
    videoSelecionadoId,
    setVideoSelecionadoId,
  ] = useState(0);

  /* =====================================================
     VÍDEO
  ===================================================== */

  const [tempoAtual, setTempoAtual] =
    useState(0);

  const [
    duracaoRealVideo,
    setDuracaoRealVideo,
  ] = useState(0);

  const [
    videoExecutando,
    setVideoExecutando,
  ] = useState(false);

  const [velocidade, setVelocidade] =
    useState(1);

  const [mutado, setMutado] =
    useState(false);

  const [telaCheia, setTelaCheia] =
    useState(false);

  const [
    mostrarVelocidades,
    setMostrarVelocidades,
  ] = useState(false);

  /* =====================================================
     CATEGORIAS DA CONFIGURAÇÃO

     VÊM DE:
     sate-campos-analise
  ===================================================== */

  const [categorias, setCategorias] =
    useState<Categoria[]>([]);

  /* =====================================================
     EVENTOS
  ===================================================== */

  const [eventos, setEventos] =
    useState<Evento[]>(eventosIniciais);

  /* =====================================================
     CLIPES
  ===================================================== */

  const [clipes, setClipes] =
    useState<Clipe[]>([]);

  /* =====================================================
     MODAIS
  ===================================================== */

  const [
    mostrarCategorias,
    setMostrarCategorias,
  ] = useState(false);

  const [
    mostrarNovoEvento,
    setMostrarNovoEvento,
  ] = useState(false);

  const [mostrarClipe, setMostrarClipe] =
    useState(false);

  /* =====================================================
     NOVO EVENTO
  ===================================================== */

  const [novoEvento, setNovoEvento] =
    useState({
      nome: '',
      descricao: '',
      tipo: 'boa' as Evento['tipo'],
      segundo: 0,
      duracao: 5,
    });

  /* =====================================================
     NOVO CLIPE
  ===================================================== */

  const [novoClipe, setNovoClipe] =
    useState({
      nome: '',
      inicio: 0,
      fim: 10,
    });

  /* =========================================================
     CARREGAR CATEGORIAS DA CONFIGURAÇÃO DE ANÁLISE

     AGORA OS CAMPOS VÊM DO BANCO DE DADOS
     PELO ENDPOINT /api/configuracao-analise
  ========================================================= */

  useEffect(() => {
    async function carregarCategoriasConfiguradas() {
      try {
        const token = obterToken();

        if (!token) {
          console.error('Token não encontrado.');
          setCategorias([]);
          return;
        }

        const resposta = await fetch(
          `${API_URL}/configuracao-analise`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          },
        );

        const dados = await resposta.json().catch(() => ({}));

        if (resposta.status === 401) {
          window.location.href = '/login';
          return;
        }

        if (!resposta.ok) {
          throw new Error(
            dados?.mensagem ||
              'Erro ao carregar a configuração da análise.',
          );
        }

        const configuracoes =
          Array.isArray(dados?.configuracoes)
            ? dados.configuracoes
            : [];

        const categoriasFormatadas: Categoria[] =
          configuracoes.map(
            (configuracao: {
              id: number;
              nome: string;
              tipo?: string | null;
            }) => {
              const tipoBackend = String(
                configuracao.tipo || '',
              ).toUpperCase();

              let tipo: Categoria['tipo'] = 'neutra';

              if (tipoBackend === 'POSITIVA') {
                tipo = 'boa';
              } else if (tipoBackend === 'NEGATIVA') {
                tipo = 'ruim';
              }

              return {
                id: configuracao.id,
                nome: configuracao.nome,
                tipo,
              };
            },
          );

        setCategorias(categoriasFormatadas);

        console.log(
          'Campos de análise carregados do banco:',
          categoriasFormatadas,
        );
      } catch (erro) {
        console.error(
          'Erro ao carregar categorias da análise:',
          erro,
        );

        setCategorias([]);
      }
    }

    carregarCategoriasConfiguradas();
  }, []);

  /* =========================================================
     CARREGAR PARTIDAS
  ========================================================= */

  useEffect(() => {
    async function carregarPartidas() {
      try {
        setCarregandoPartidas(true);

        const token = obterToken();

        if (!token) {
          window.location.href = '/login';
          return;
        }

        const resposta = await fetch(
          `${API_URL}/partidas`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type':
                'application/json',
            },
          },
        );

        const dados = await resposta
          .json()
          .catch(() => ({}));

        if (resposta.status === 401) {
          window.location.href = '/login';
          return;
        }

        if (!resposta.ok) {
          throw new Error(
            dados?.mensagem ||
              'Erro ao carregar as partidas.',
          );
        }

        const lista: PartidaBackend[] =
          Array.isArray(dados)
            ? dados
            : Array.isArray(
                  dados?.partidas,
                )
              ? dados.partidas
              : [];

        const partidasFormatadas: Partida[] =
          lista.map((partida) => ({
            id: partida.id,

            equipe:
              partida.equipe?.nome ||
              'Minha equipe',

            adversario:
              partida.adversario ||
              'Adversário',

            data: formatarData(
              partida.data,
            ),

            modalidade:
              partida.equipe?.modalidade ||
              'Esporte',

            videos: [],
          }));

        setPartidas(
          partidasFormatadas,
        );

        if (
          partidasFormatadas.length >
          0
        ) {
          setPartidaSelecionadaId(
            partidasFormatadas[0].id,
          );
        }
      } catch (error) {
        console.error(
          'Erro ao carregar partidas:',
          error,
        );

        /*
         * Não usa partidas falsas aqui.
         * Se o backend falhar, a tela deve
         * mostrar que não existem partidas
         * disponíveis.
         */
        setPartidas([]);
        setPartidaSelecionadaId(0);
      } finally {
        setCarregandoPartidas(false);
      }
    }

    carregarPartidas();
  }, []);

  /* =========================================================
     CARREGAR VÍDEOS DA PARTIDA
  ========================================================= */

  useEffect(() => {
    async function carregarVideos() {
      if (!partidaSelecionadaId) {
        return;
      }

      try {
        setCarregandoVideos(true);

        const token = obterToken();

        if (!token) {
          window.location.href = '/login';
          return;
        }

        setVideoSelecionadoId(0);
        setTempoAtual(0);
        setDuracaoRealVideo(0);
        setVideoExecutando(false);

        if (videoRef.current) {
          videoRef.current.pause();
          videoRef.current.currentTime = 0;
        }

        const resposta = await fetch(
          `${API_URL}/partidas/${partidaSelecionadaId}/videos`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type':
                'application/json',
            },
          },
        );

        const dados = await resposta
          .json()
          .catch(() => ({}));

        if (resposta.status === 401) {
          window.location.href = '/login';
          return;
        }

        if (!resposta.ok) {
          throw new Error(
            dados?.mensagem ||
              'Erro ao carregar os vídeos.',
          );
        }

        const lista = Array.isArray(dados)
          ? dados
          : Array.isArray(
                dados?.videos,
              )
            ? dados.videos
            : [];

        const videosFormatados: VideoPartida[] =
          lista.map(
            (video: VideoPartida) => ({
              ...video,

              nome:
                video.titulo ||
                video.nome ||
                video.nomeArquivo ||
                'Vídeo da partida',

              url: normalizarUrlVideo(
                video.url,
              ),
            }),
          );

        setPartidas((atuais) =>
          atuais.map((partida) =>
            partida.id ===
            partidaSelecionadaId
              ? {
                  ...partida,
                  videos:
                    videosFormatados,
                }
              : partida,
          ),
        );

        if (
          videosFormatados.length >
          0
        ) {
          setVideoSelecionadoId(
            videosFormatados[0].id,
          );
        } else {
          setVideoSelecionadoId(0);
        }
      } catch (error) {
        console.error(
          'Erro ao carregar vídeos:',
          error,
        );

        setPartidas((atuais) =>
          atuais.map((partida) =>
            partida.id ===
            partidaSelecionadaId
              ? {
                  ...partida,
                  videos: [],
                }
              : partida,
          ),
        );

        setVideoSelecionadoId(0);
      } finally {
        setCarregandoVideos(false);
      }
    }

    carregarVideos();
  }, [partidaSelecionadaId]);

  /* =========================================================
     DADOS SELECIONADOS
  ========================================================= */

  const partidaSelecionada = useMemo(
    () =>
      partidas.find(
        (partida) =>
          partida.id ===
          partidaSelecionadaId,
      ) ?? null,
    [
      partidas,
      partidaSelecionadaId,
    ],
  );

  const videosDaPartida =
    partidaSelecionada?.videos ?? [];

  const videoSelecionado = useMemo(
    () =>
      videosDaPartida.find(
        (video) =>
          video.id ===
          videoSelecionadoId,
      ) ??
      videosDaPartida[0] ??
      null,
    [
      videosDaPartida,
      videoSelecionadoId,
    ],
  );

  const duracaoVideo =
    duracaoRealVideo ||
    (videoSelecionado
      ? estimarDuracaoVideo(
          videoSelecionado,
        )
      : 0);

  /* =========================================================
     TROCAR PARTIDA
  ========================================================= */

  function trocarPartida(id: number) {
    setPartidaSelecionadaId(id);
    setVideoSelecionadoId(0);
    setTempoAtual(0);
    setDuracaoRealVideo(0);
    setVideoExecutando(false);

    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }

  /* =========================================================
     TROCAR VÍDEO
  ========================================================= */

  function trocarVideo(id: number) {
    setVideoSelecionadoId(id);
    setTempoAtual(0);
    setDuracaoRealVideo(0);
    setVideoExecutando(false);

    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }

  /* =========================================================
     PLAY / PAUSE
  ========================================================= */

  function alternarVideo() {
    if (!videoRef.current) {
      return;
    }

    if (videoRef.current.paused) {
      videoRef.current
        .play()
        .catch((erro) => {
          console.error(
            'Erro ao reproduzir vídeo:',
            erro,
          );
        });
    } else {
      videoRef.current.pause();
    }
  }

  /* =========================================================
     VOLTAR 10 SEGUNDOS
  ========================================================= */

  function voltarDezSegundos() {
    if (!videoRef.current) {
      return;
    }

    videoRef.current.currentTime =
      Math.max(
        0,
        videoRef.current.currentTime - 10,
      );

    setTempoAtual(
      videoRef.current.currentTime,
    );
  }

  /* =========================================================
     AVANÇAR 10 SEGUNDOS
  ========================================================= */

  function avancarDezSegundos() {
    if (!videoRef.current) {
      return;
    }

    videoRef.current.currentTime =
      Math.min(
        videoRef.current.duration ||
          duracaoVideo,
        videoRef.current.currentTime + 10,
      );

    setTempoAtual(
      videoRef.current.currentTime,
    );
  }

  /* =========================================================
     MUTE
  ========================================================= */

  function alternarMute() {
    if (!videoRef.current) {
      return;
    }

    videoRef.current.muted =
      !videoRef.current.muted;

    setMutado(
      videoRef.current.muted,
    );
  }

  /* =========================================================
     VELOCIDADE
  ========================================================= */

  function alterarVelocidade(
    novaVelocidade: number,
  ) {
    setVelocidade(novaVelocidade);

    if (videoRef.current) {
      videoRef.current.playbackRate =
        novaVelocidade;
    }

    setMostrarVelocidades(false);
  }

  /* =========================================================
     TELA CHEIA
  ========================================================= */

  async function alternarTelaCheia() {
    const elemento =
      videoAreaRef.current;

    if (!elemento) {
      return;
    }

    try {
      if (!document.fullscreenElement) {
        await elemento.requestFullscreen();
        setTelaCheia(true);
      } else {
        await document.exitFullscreen();
        setTelaCheia(false);
      }
    } catch (erro) {
      console.error(
        'Erro ao alternar tela cheia:',
        erro,
      );
    }
  }

  /* =========================================================
     ALTERAR TEMPO
  ========================================================= */

  function alterarTempo(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const novoTempo = Number(
      event.target.value,
    );

    setTempoAtual(novoTempo);

    if (videoRef.current) {
      videoRef.current.currentTime =
        novoTempo;
    }
  }

  /* =========================================================
     IR PARA EVENTO
  ========================================================= */

  function irParaEvento(segundo: number) {
    setTempoAtual(segundo);

    if (videoRef.current) {
      videoRef.current.currentTime =
        segundo;

      videoRef.current
        .play()
        .catch(() => {});

      setVideoExecutando(true);
    }
  }

  /* =========================================================
     ADICIONAR EVENTO
  ========================================================= */

  function adicionarEvento() {
    if (!novoEvento.nome.trim()) {
      return;
    }

    const evento: Evento = {
      id: Date.now(),

      nome: novoEvento.nome,

      descricao:
        novoEvento.descricao ||
        'Evento registrado na partida',

      tipo: novoEvento.tipo,

      segundo: novoEvento.segundo,

      duracao: novoEvento.duracao,
    };

    setEventos((atual) => [
      ...atual,
      evento,
    ]);

    setNovoEvento({
      nome: '',
      descricao: '',
      tipo: 'boa',
      segundo: tempoAtual,
      duracao: 5,
    });

    setMostrarNovoEvento(false);
  }

  /* =========================================================
     ADICIONAR CLIPE
  ========================================================= */

  function adicionarClipe() {
    if (!novoClipe.nome.trim()) {
      return;
    }

    const novo: Clipe = {
      id: Date.now(),
      nome: novoClipe.nome,
      inicio: novoClipe.inicio,
      fim: novoClipe.fim,
    };

    setClipes((atual) => [
      ...atual,
      novo,
    ]);

    setNovoClipe({
      nome: '',
      inicio: tempoAtual,
      fim: tempoAtual + 10,
    });

    setMostrarClipe(false);
  }

  /* =========================================================
     SELECIONAR CATEGORIA
  ========================================================= */

  function selecionarCategoria(
    categoria: Categoria,
  ) {
    setNovoEvento({
      ...novoEvento,

      nome: categoria.nome,

      tipo: 'neutra',

      segundo: tempoAtual,
    });

    setMostrarNovoEvento(true);
  }

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className={styles.page}>

      {/* =====================================
          CABEÇALHO
      ===================================== */}

      <header className={styles.pageHeader}>
        <div>
          <button
            type="button"
            onClick={() =>
              window.history.back()
            }
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 7,
              marginBottom: 12,
              border: 'none',
              background: 'transparent',
              color: '#ffffff',
              fontFamily: 'inherit',
              fontSize: 13,
              cursor: 'pointer',
              padding: 0,
            }}
          >
            <ArrowLeft size={17} />
            Voltar
          </button>

          <h1>Análise de vídeo</h1>

          <div
            className={
              styles.videoSelectors
            }
          >
            <div
              className={
                styles.videoSelectorGroup
              }
            >
              <label htmlFor="partida">
                Partida
              </label>

              <select
                id="partida"
                value={
                  partidaSelecionadaId
                }
                onChange={(event) =>
                  trocarPartida(
                    Number(
                      event.target.value,
                    ),
                  )
                }
                className={
                  styles.matchSelector
                }
                disabled={
                  carregandoPartidas ||
                  partidas.length === 0
                }
              >
                {partidas.length === 0 ? (
                  <option value={0}>
                    {carregandoPartidas
                      ? 'Carregando partidas...'
                      : 'Nenhuma partida'}
                  </option>
                ) : (
                  partidas.map(
                    (partida) => (
                      <option
                        key={
                          partida.id
                        }
                        value={
                          partida.id
                        }
                      >
                        {partida.equipe} x{' '}
                        {
                          partida.adversario
                        }
                      </option>
                    ),
                  )
                )}
              </select>
            </div>

            <div
              className={
                styles.videoSelectorGroup
              }
            >
              <label htmlFor="video">
                Vídeo da partida
              </label>

              <select
                id="video"
                value={
                  videoSelecionadoId
                }
                onChange={(event) =>
                  trocarVideo(
                    Number(
                      event.target.value,
                    ),
                  )
                }
                className={
                  styles.matchSelector
                }
                disabled={
                  carregandoVideos ||
                  videosDaPartida.length ===
                    0
                }
              >
                {carregandoVideos ? (
                  <option value={0}>
                    Carregando vídeos...
                  </option>
                ) : videosDaPartida.length ===
                  0 ? (
                  <option value={0}>
                    Nenhum vídeo
                  </option>
                ) : (
                  videosDaPartida.map(
                    (video) => (
                      <option
                        key={
                          video.id
                        }
                        value={
                          video.id
                        }
                      >
                        {obterNomeVideo(
                          video,
                        )}
                      </option>
                    ),
                  )
                )}
              </select>
            </div>

            {partidaSelecionada && (
              <div
                className={
                  styles.matchDetails
                }
              >
                <span>
                  {partidaSelecionada.data}
                </span>

                <i />

                <span>
                  {
                    partidaSelecionada.modalidade
                  }
                </span>

                <i />

                <span>
                  {videosDaPartida.length}{' '}
                  {videosDaPartida.length ===
                  1
                    ? 'vídeo'
                    : 'vídeos'}
                </span>
              </div>
            )}
          </div>
        </div>

        <div
          className={styles.headerActions}
        >
          <button
            type="button"
            className={
              styles.manageCategoriesButton
            }
            onClick={() =>
              setMostrarCategorias(true)
            }
          >
            <Edit3 size={16} />
            Categorias
          </button>

          <button
            type="button"
            className={
              styles.actionButtonRed
            }
            onClick={() =>
              setMostrarClipe(true)
            }
          >
            <Scissors size={16} />
            Criar clipe
          </button>

          <button
            type="button"
            className={
              styles.actionButtonGreen
            }
            onClick={() =>
              setMostrarNovoEvento(true)
            }
          >
            <Plus size={16} />
            Marcar evento
          </button>
        </div>
      </header>

      {/* =====================================
          GRID PRINCIPAL
      ===================================== */}

      <div className={styles.analysisGrid}>

        <div className={styles.leftColumn}>

          {/* =================================
              VÍDEO
          ================================= */}

          <section
            className={styles.videoCard}
          >
            <div
              ref={videoAreaRef}
              className={styles.videoArea}
              style={{
                position: 'relative',
              }}
            >
              {videoSelecionado?.url ? (
                <video
                  key={
                    videoSelecionado.id
                  }
                  ref={videoRef}
                  src={
                    videoSelecionado.url
                  }
                  preload="metadata"
                  playsInline
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    display: 'block',
                    background: '#071914',
                  }}
                  onTimeUpdate={(
                    event,
                  ) =>
                    setTempoAtual(
                      event.currentTarget
                        .currentTime,
                    )
                  }
                  onLoadedMetadata={(
                    event,
                  ) => {
                    const video =
                      event.currentTarget;

                    setDuracaoRealVideo(
                      Number.isFinite(
                        video.duration,
                      )
                        ? video.duration
                        : 0,
                    );

                    video.playbackRate =
                      velocidade;

                    video.muted =
                      mutado;
                  }}
                  onPlay={() => {
                    setVideoExecutando(
                      true,
                    );

                    if (videoRef.current) {
                      videoRef.current.playbackRate =
                        velocidade;
                    }
                  }}
                  onPause={() =>
                    setVideoExecutando(
                      false,
                    )
                  }
                  onEnded={() =>
                    setVideoExecutando(
                      false,
                    )
                  }
                  onVolumeChange={(event) =>
                    setMutado(
                      event.currentTarget
                        .muted,
                    )
                  }
                  onError={(event) => {
                    console.error(
                      'Erro ao carregar vídeo:',
                      videoSelecionado.url,
                      event,
                    );
                  }}
                />
              ) : (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    color: '#ffffff',
                    display: 'flex',
                    flexDirection:
                      'column',
                    alignItems: 'center',
                    justifyContent:
                      'center',
                    gap: 10,
                    background:
                      '#071914',
                  }}
                >
                  <Video size={42} />

                  <span>
                    {carregandoVideos
                      ? 'Carregando vídeo...'
                      : 'Nenhum vídeo disponível para esta partida'}
                  </span>
                </div>
              )}

              {/* CONTROLES */}

              {videoSelecionado && (
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 5,
                    padding:
                      '70px 14px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    background:
                      'linear-gradient(transparent, rgba(0,0,0,0.82))',
                    boxSizing: 'border-box',
                  }}
                >
                  <button
                    type="button"
                    title="Voltar 10 segundos"
                    onClick={
                      voltarDezSegundos
                    }
                    style={{
                      width: 34,
                      height: 34,
                      display: 'flex',
                      alignItems:
                        'center',
                      justifyContent:
                        'center',
                      border: 'none',
                      borderRadius: 8,
                      background:
                        'transparent',
                      color: '#ffffff',
                      cursor: 'pointer',
                    }}
                  >
                    <RotateCcw
                      size={19}
                    />
                  </button>

                  <button
                    type="button"
                    title={
                      videoExecutando
                        ? 'Pausar'
                        : 'Reproduzir'
                    }
                    onClick={
                      alternarVideo
                    }
                    style={{
                      width: 38,
                      height: 38,
                      display: 'flex',
                      alignItems:
                        'center',
                      justifyContent:
                        'center',
                      border: 'none',
                      borderRadius: '50%',
                      background:
                        'rgba(255,255,255,0.14)',
                      color: '#ffffff',
                      cursor: 'pointer',
                    }}
                  >
                    {videoExecutando ? (
                      <Pause
                        size={21}
                        fill="currentColor"
                      />
                    ) : (
                      <Play
                        size={21}
                        fill="currentColor"
                      />
                    )}
                  </button>

                  <button
                    type="button"
                    title="Avançar 10 segundos"
                    onClick={
                      avancarDezSegundos
                    }
                    style={{
                      width: 34,
                      height: 34,
                      display: 'flex',
                      alignItems:
                        'center',
                      justifyContent:
                        'center',
                      border: 'none',
                      borderRadius: 8,
                      background:
                        'transparent',
                      color: '#ffffff',
                      cursor: 'pointer',
                    }}
                  >
                    <RotateCw
                      size={19}
                    />
                  </button>

                  <button
                    type="button"
                    title={
                      mutado
                        ? 'Ativar som'
                        : 'Silenciar'
                    }
                    onClick={
                      alternarMute
                    }
                    style={{
                      width: 34,
                      height: 34,
                      display: 'flex',
                      alignItems:
                        'center',
                      justifyContent:
                        'center',
                      border: 'none',
                      borderRadius: 8,
                      background:
                        'transparent',
                      color: '#ffffff',
                      cursor: 'pointer',
                    }}
                  >
                    {mutado ? (
                      <VolumeX
                        size={20}
                      />
                    ) : (
                      <Volume2
                        size={20}
                      />
                    )}
                  </button>

                  <span
                    style={{
                      color: '#ffffff',
                      fontSize: 12,
                      fontWeight: 600,
                      whiteSpace:
                        'nowrap',
                      marginLeft: 3,
                    }}
                  >
                    {formatarTempo(
                      tempoAtual,
                    )}{' '}
                    /{' '}
                    {formatarTempo(
                      duracaoVideo,
                    )}
                  </span>

                  <div
                    style={{
                      flex: 1,
                    }}
                  />

                  {/* VELOCIDADE */}

                  <div
                    style={{
                      position:
                        'relative',
                    }}
                  >
                    <button
                      type="button"
                      title="Velocidade"
                      onClick={() =>
                        setMostrarVelocidades(
                          (atual) =>
                            !atual,
                        )
                      }
                      style={{
                        minWidth: 48,
                        height: 34,
                        padding:
                          '0 8px',
                        border:
                          'none',
                        borderRadius: 7,
                        background:
                          'transparent',
                        color:
                          '#ffffff',
                        fontFamily:
                          'inherit',
                        fontSize: 12,
                        fontWeight: 700,
                        cursor:
                          'pointer',
                      }}
                    >
                      {velocidade}x
                    </button>

                    {mostrarVelocidades && (
                      <div
                        style={{
                          position:
                            'absolute',
                          bottom:
                            '44px',
                          right: 0,
                          minWidth:
                            120,
                          padding:
                            '7px',
                          borderRadius:
                            10,
                          background:
                            '#ffffff',
                          boxShadow:
                            '0 8px 25px rgba(0,0,0,0.28)',
                          display:
                            'flex',
                          flexDirection:
                            'column',
                          gap: 2,
                        }}
                      >
                        <span
                          style={{
                            padding:
                              '5px 8px',
                            color:
                              '#718078',
                            fontSize:
                              10,
                            fontWeight:
                              700,
                          }}
                        >
                          VELOCIDADE
                        </span>

                        {[
                          0.5,
                          0.75,
                          1,
                          1.25,
                          1.5,
                          1.75,
                          2,
                        ].map(
                          (
                            valor,
                          ) => (
                            <button
                              key={
                                valor
                              }
                              type="button"
                              onClick={() =>
                                alterarVelocidade(
                                  valor,
                                )
                              }
                              style={{
                                border:
                                  'none',
                                borderRadius:
                                  7,
                                padding:
                                  '7px 9px',
                                textAlign:
                                  'left',
                                background:
                                  velocidade ===
                                  valor
                                    ? '#e5f5ef'
                                    : 'transparent',
                                color:
                                  velocidade ===
                                  valor
                                    ? '#16a875'
                                    : '#33453d',
                                fontFamily:
                                  'inherit',
                                fontSize:
                                  12,
                                fontWeight:
                                  600,
                                cursor:
                                  'pointer',
                              }}
                            >
                              {valor}x
                            </button>
                          ),
                        )}
                      </div>
                    )}
                  </div>

                  {/* TELA CHEIA */}

                  <button
                    type="button"
                    title={
                      telaCheia
                        ? 'Sair da tela cheia'
                        : 'Tela cheia'
                    }
                    onClick={
                      alternarTelaCheia
                    }
                    style={{
                      width: 38,
                      height: 34,
                      display: 'flex',
                      alignItems:
                        'center',
                      justifyContent:
                        'center',
                      border: 'none',
                      borderRadius: 8,
                      background:
                        'transparent',
                      color: '#ffffff',
                      cursor: 'pointer',
                    }}
                  >
                    {telaCheia ? (
                      <Minimize
                        size={19}
                      />
                    ) : (
                      <Maximize
                        size={19}
                      />
                    )}
                  </button>
                </div>
              )}

              {/* BOTÃO CENTRAL */}

              {videoSelecionado &&
                !videoExecutando && (
                  <button
                    type="button"
                    className={
                      styles.playButton
                    }
                    onClick={
                      alternarVideo
                    }
                    style={{
                      zIndex: 4,
                    }}
                  >
                    <Play
                      size={29}
                      fill="currentColor"
                    />
                  </button>
                )}
            </div>

            {/* TIMELINE */}

            <div
              className={
                styles.timelineArea
              }
            >
              <div
                className={
                  styles.timelineTrackWrapper
                }
              >
                <input
                  type="range"
                  min="0"
                  max={
                    duracaoVideo || 1
                  }
                  value={Math.min(
                    tempoAtual,
                    duracaoVideo ||
                      1,
                  )}
                  onChange={
                    alterarTempo
                  }
                  className={
                    styles.videoRange
                  }
                />

                <div
                  className={
                    styles.analysisMarkers
                  }
                >
                  {eventos.map(
                    (evento) => (
                      <button
                        key={
                          evento.id
                        }
                        type="button"
                        className={`${styles.analysisMarker} ${
                          styles[
                            `marker_${evento.tipo}`
                          ]
                        }`}
                        style={{
                          left: `${
                            duracaoVideo >
                            0
                              ? (evento.segundo /
                                  duracaoVideo) *
                                100
                              : 0
                          }%`,
                        }}
                        onClick={() =>
                          irParaEvento(
                            evento.segundo,
                          )
                        }
                        title={
                          evento.nome
                        }
                      />
                    ),
                  )}
                </div>
              </div>

              <div
                className={
                  styles.timelineLegend
                }
              >
                <div
                  className={
                    styles.timelineLegendItem
                  }
                >
                  <span
                    className={
                      styles.goodMarker
                    }
                  />
                  <small>
                    Boa
                  </small>
                </div>

                <div
                  className={
                    styles.timelineLegendItem
                  }
                >
                  <span
                    className={
                      styles.badMarker
                    }
                  />
                  <small>
                    Ruim
                  </small>
                </div>

                <div
                  className={
                    styles.timelineLegendItem
                  }
                >
                  <span
                    className={
                      styles.neutralMarker
                    }
                  />
                  <small>
                    Neutra
                  </small>
                </div>

                <div
                  className={
                    styles.timelineLegendItem
                  }
                >
                  <span
                    className={
                      styles.highlightMarker
                    }
                  />
                  <small>
                    Destaque
                  </small>
                </div>
              </div>
            </div>
          </section>

          {/* =================================
              CATEGORIAS
          ================================= */}

          <section
            className={
              styles.actionTypesCard
            }
          >
            <div
              className={
                styles.actionTypesHeader
              }
            >
              <div>
                <h2>
                  Categorias de análise
                </h2>

                <p>
                  Campos selecionados na
                  configuração da análise.
                </p>
              </div>

              <button
                type="button"
                className={
                  styles.editCategoriesSmall
                }
                onClick={() =>
                  setMostrarCategorias(
                    true,
                  )
                }
              >
                <Edit3 size={14} />
                Visualizar
              </button>
            </div>

            <div
              className={
                styles.actionTypesGrid
              }
            >
              {categorias.length === 0 ? (
                <div
                  style={{
                    gridColumn:
                      '1 / -1',
                    padding:
                      '28px 20px',
                    textAlign:
                      'center',
                    border:
                      '1px dashed #cbd8d2',
                    borderRadius:
                      14,
                    color:
                      '#718078',
                    background:
                      '#f7faf8',
                  }}
                >
                  <Video
                    size={28}
                    style={{
                      marginBottom:
                        8,
                    }}
                  />

                  <strong
                    style={{
                      display:
                        'block',
                      marginBottom:
                        5,
                      color:
                        '#31433a',
                    }}
                  >
                    Nenhum campo configurado
                  </strong>

                  <span
                    style={{
                      fontSize:
                        13,
                    }}
                  >
                    Volte para a
                    configuração da
                    análise e selecione
                    os campos que deseja
                    acompanhar.
                  </span>
                </div>
              ) : (
                categorias.map(
                  (categoria) => (
                    <button
                      key={
                        categoria.id
                      }
                      type="button"
                      className={
                        styles.categoryPreview
                      }
                      onClick={() =>
                        selecionarCategoria(
                          categoria,
                        )
                      }
                    >
                      <div
                        className={
                          styles.actionTypeIcon
                        }
                        style={{
                          background:
                            '#e5f5ef',
                          color:
                            '#16a875',
                        }}
                      >
                        <TargetIcon />
                      </div>

                      <strong>
                        {
                          categoria.nome
                        }
                      </strong>

                      <span
                        className={
                          styles.timelineStatus
                        }
                      >
                        <Plus
                          size={12}
                        />
                      </span>
                    </button>
                  ),
                )
              )}

              <button
                type="button"
                className={
                  styles.addCategoryCard
                }
                onClick={() =>
                  setMostrarCategorias(
                    true,
                  )
                }
              >
                <Edit3 size={17} />
                Ver campos configurados
              </button>
            </div>
          </section>
        </div>

        {/* =====================================
            EVENTOS
        ===================================== */}

        <section
          className={styles.eventsCard}
        >
          <div
            className={
              styles.eventsHeader
            }
          >
            <div>
              <h2>Eventos</h2>

              <span>
                Momentos marcados no vídeo
              </span>
            </div>

            <Flag size={21} />
          </div>

          <div
            className={styles.eventsList}
          >
            {eventos.map((evento) => (
              <button
                key={evento.id}
                type="button"
                className={
                  styles.eventItem
                }
                onClick={() =>
                  irParaEvento(
                    evento.segundo,
                  )
                }
              >
                <div
                  className={`${styles.eventIcon} ${
                    evento.tipo ===
                    'boa'
                      ? styles.eventIconGood
                      : evento.tipo ===
                          'ruim'
                        ? styles.eventIconBad
                        : evento.tipo ===
                            'destaque'
                          ? styles.eventIconHighlight
                          : styles.eventIconNeutral
                  }`}
                >
                  {evento.tipo ===
                  'boa' ? (
                    <Trophy
                      size={17}
                    />
                  ) : evento.tipo ===
                    'ruim' ? (
                    <Flag
                      size={17}
                    />
                  ) : evento.tipo ===
                    'destaque' ? (
                    <Play
                      size={17}
                    />
                  ) : (
                    <Clock3
                      size={17}
                    />
                  )}
                </div>

                <div
                  className={
                    styles.eventContent
                  }
                >
                  <strong>
                    {evento.nome}
                  </strong>

                  <span>
                    {evento.descricao}
                  </span>
                </div>

                <div
                  className={
                    styles.eventRight
                  }
                >
                  <span>
                    {formatarTempo(
                      evento.segundo,
                    )}
                  </span>

                  <small>
                    {evento.duracao}s
                  </small>
                </div>
              </button>
            ))}
          </div>
        </section>
      </div>

      {/* =====================================
          MODAL CATEGORIAS
      ===================================== */}

      {mostrarCategorias && (
        <div
          className={
            styles.categoryOverlay
          }
        >
          <div
            className={
              styles.categoryModal
            }
          >
            <div
              className={
                styles.categoryModalHeader
              }
            >
              <div>
                <span>
                  CONFIGURAÇÃO DA ANÁLISE
                </span>

                <h2>
                  Campos selecionados
                </h2>

                <p>
                  Estes são os campos
                  definidos no onboarding
                  da equipe.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setMostrarCategorias(
                    false,
                  )
                }
              >
                <X size={19} />
              </button>
            </div>

            <div
              className={
                styles.categoryModalContent
              }
            >
              <div
                className={
                  styles.categoryListToolbar
                }
              >
                <div>
                  <strong>
                    Campos disponíveis
                  </strong>

                  <span>
                    {categorias.length}{' '}
                    {categorias.length ===
                    1
                      ? 'campo'
                      : 'campos'}
                  </span>
                </div>
              </div>

              <div
                className={
                  styles.categoriesList
                }
              >
                {categorias.length ===
                0 ? (
                  <div
                    style={{
                      padding:
                        '30px 20px',
                      textAlign:
                        'center',
                      color:
                        '#718078',
                    }}
                  >
                    Nenhum campo foi
                    selecionado na
                    configuração da
                    análise.
                  </div>
                ) : (
                  categorias.map(
                    (categoria) => (
                      <div
                        key={
                          categoria.id
                        }
                        className={
                          styles.categoryRow
                        }
                      >
                        <div
                          className={
                            styles.categoryRowIcon
                          }
                          style={{
                            background:
                              '#e5f5ef',
                            color:
                              '#16a875',
                          }}
                        >
                          <Video
                            size={18}
                          />
                        </div>

                        <div
                          className={
                            styles.categoryRowInfo
                          }
                        >
                          <strong>
                            {
                              categoria.nome
                            }
                          </strong>

                          <span>
                            Campo da
                            análise
                          </span>
                        </div>

                        <button
                          type="button"
                          className={
                            styles.editCategoryButton
                          }
                          onClick={() => {
                            selecionarCategoria(
                              categoria,
                            );

                            setMostrarCategorias(
                              false,
                            );
                          }}
                        >
                          <Plus
                            size={13}
                          />
                          Usar
                        </button>
                      </div>
                    ),
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================
          PAINEL DE CLIPE
      ===================================== */}

      {mostrarClipe && (
        <>
          <div
            className={styles.overlay}
            onClick={() =>
              setMostrarClipe(false)
            }
          />

          <aside
            className={`${styles.clipPanel} ${styles.clipPanelOpen}`}
          >
            <div
              className={
                styles.clipPanelHeader
              }
            >
              <div>
                <div
                  className={
                    styles.clipIcon
                  }
                >
                  <Scissors
                    size={16}
                  />
                </div>

                <h2>
                  Criar clipe
                </h2>
              </div>

              <button
                type="button"
                className={
                  styles.closeButton
                }
                onClick={() =>
                  setMostrarClipe(
                    false,
                  )
                }
              >
                <X size={17} />
              </button>
            </div>

            <div
              className={
                styles.clipPanelContent
              }
            >
              <div
                className={
                  styles.formGroup
                }
              >
                <label>
                  Nome do clipe
                </label>

                <input
                  type="text"
                  value={
                    novoClipe.nome
                  }
                  placeholder="Ex.: Melhor jogada"
                  onChange={(event) =>
                    setNovoClipe({
                      ...novoClipe,
                      nome: event
                        .target
                        .value,
                    })
                  }
                />
              </div>

              <div
                className={
                  styles.formGroup
                }
              >
                <label>
                  Descrição
                </label>

                <textarea
                  placeholder="Descreva este momento..."
                />
              </div>

              <div
                className={
                  styles.durationSection
                }
              >
                <h3>
                  Duração do clipe
                </h3>

                <div
                  className={
                    styles.durationInfo
                  }
                >
                  <span>
                    Início:{' '}
                    {formatarTempo(
                      novoClipe.inicio,
                    )}
                  </span>

                  <span
                    className={
                      styles.durationValue
                    }
                  >
                    Fim:{' '}
                    {formatarTempo(
                      novoClipe.fim,
                    )}
                  </span>
                </div>

                <div
                  className={
                    styles.rangeGroup
                  }
                >
                  <input
                    type="range"
                    min="0"
                    max={
                      duracaoVideo ||
                      100
                    }
                    value={
                      novoClipe.inicio
                    }
                    onChange={(
                      event,
                    ) => {
                      const inicio =
                        Number(
                          event.target
                            .value,
                        );

                      setNovoClipe(
                        (atual) => ({
                          ...atual,
                          inicio,
                          fim: Math.max(
                            atual.fim,
                            inicio +
                              1,
                          ),
                        }),
                      );
                    }}
                  />

                  <input
                    type="range"
                    min="0"
                    max={
                      duracaoVideo ||
                      100
                    }
                    value={
                      novoClipe.fim
                    }
                    onChange={(
                      event,
                    ) =>
                      setNovoClipe(
                        (atual) => ({
                          ...atual,
                          fim: Math.max(
                            Number(
                              event.target
                                .value,
                            ),
                            atual.inicio +
                              1,
                          ),
                        }),
                      )
                    }
                  />
                </div>
              </div>
            </div>

            <div
              className={
                styles.clipPanelFooter
              }
            >
              <button
                type="button"
                className={
                  styles.saveClipButton
                }
                disabled={
                  !novoClipe.nome.trim()
                }
                onClick={
                  adicionarClipe
                }
              >
                <Scissors
                  size={15}
                />
                Salvar clipe
              </button>
            </div>
          </aside>
        </>
      )}

      {/* =====================================
          NOVO EVENTO
      ===================================== */}

      {mostrarNovoEvento && (
        <div
          className={
            styles.categoryOverlay
          }
        >
          <div
            className={
              styles.categoryModal
            }
            style={{
              width: 'min(560px, 100%)',
            }}
          >
            <div
              className={
                styles.categoryModalHeader
              }
            >
              <div>
                <span>
                  ANÁLISE
                </span>

                <h2>
                  Marcar evento
                </h2>

                <p>
                  Registre um momento
                  importante da partida.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setMostrarNovoEvento(
                    false,
                  )
                }
              >
                <X size={19} />
              </button>
            </div>

            <div
              className={
                styles.categoryModalContent
              }
            >
              <div
                className={
                  styles.categoryForm
                }
              >
                <div
                  className={
                    styles.categoryField
                  }
                >
                  <label>
                    Campo de análise
                  </label>

                  <select
                    value={
                      novoEvento.nome
                    }
                    onChange={(event) =>
                      setNovoEvento({
                        ...novoEvento,
                        nome: event
                          .target
                          .value,
                      })
                    }
                    style={{
                      width: '100%',
                      height: 48,
                      padding:
                        '0 14px',
                      border:
                        '1px solid #c8d5cf',
                      borderRadius: 10,
                      background:
                        '#ffffff',
                      color:
                        '#2c3c34',
                      fontFamily:
                        'inherit',
                      fontSize: 15,
                    }}
                  >
                    <option value="">
                      Selecione um campo
                    </option>

                    {categorias.map(
                      (categoria) => (
                        <option
                          key={
                            categoria.id
                          }
                          value={
                            categoria.nome
                          }
                        >
                          {
                            categoria.nome
                          }
                        </option>
                      ),
                    )}
                  </select>
                </div>

                <div
                  className={
                    styles.categoryField
                  }
                >
                  <label>
                    Descrição
                  </label>

                  <input
                    value={
                      novoEvento.descricao
                    }
                    placeholder="Descreva o momento"
                    onChange={(event) =>
                      setNovoEvento({
                        ...novoEvento,
                        descricao:
                          event
                            .target
                            .value,
                      })
                    }
                  />
                </div>

                <div
                  className={
                    styles.categoryField
                  }
                >
                  <label>
                    Tipo do evento
                  </label>

                  <select
                    value={
                      novoEvento.tipo
                    }
                    onChange={(event) =>
                      setNovoEvento({
                        ...novoEvento,
                        tipo: event
                          .target
                          .value as Evento['tipo'],
                      })
                    }
                    style={{
                      width: '100%',
                      height: 48,
                      padding:
                        '0 14px',
                      border:
                        '1px solid #c8d5cf',
                      borderRadius: 10,
                      background:
                        '#ffffff',
                      color:
                        '#2c3c34',
                      fontFamily:
                        'inherit',
                      fontSize: 15,
                    }}
                  >
                    <option value="boa">
                      Boa
                    </option>

                    <option value="ruim">
                      Ruim
                    </option>

                    <option value="neutra">
                      Neutra
                    </option>

                    <option value="destaque">
                      Destaque
                    </option>
                  </select>
                </div>

                <div
                  className={
                    styles.categoryFormFooter
                  }
                >
                  <span
                    style={{
                      color:
                        '#78867f',
                      fontSize: 12,
                    }}
                  >
                    Momento atual:{' '}
                    {formatarTempo(
                      tempoAtual,
                    )}
                  </span>

                  <div
                    className={
                      styles.categoryFormActions
                    }
                  >
                    <button
                      type="button"
                      className={
                        styles.cancelCategoryButton
                      }
                      onClick={() =>
                        setMostrarNovoEvento(
                          false,
                        )
                      }
                    >
                      Cancelar
                    </button>

                    <button
                      type="button"
                      className={
                        styles.saveCategoryButton
                      }
                      disabled={
                        !novoEvento.nome.trim()
                      }
                      onClick={
                        adicionarEvento
                      }
                    >
                      <Check
                        size={15}
                      />
                      Marcar evento
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   ÍCONE SIMPLES PARA OS CAMPOS DE ANÁLISE
========================================================= */

function TargetIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
      />

      <circle
        cx="12"
        cy="12"
        r="5"
      />

      <circle
        cx="12"
        cy="12"
        r="1"
      />
    </svg>
  );
}