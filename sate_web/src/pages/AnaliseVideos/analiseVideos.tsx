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
  useMemo,
  useRef,
  useState,
} from 'react';

import styles from './analiseVideos.module.css';

const VIDEO_TESTE =
  'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';

interface VideoPartida {
  id: number;
  nome: string;
  url: string;
  duracao: string;
}

interface Partida {
  id: number;
  equipe: string;
  adversario: string;
  data: string;
  modalidade: string;
  videos: VideoPartida[];
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

const partidasMock: Partida[] = [
  {
    id: 1,
    equipe: 'Falcões FC',
    adversario: 'Águias FC',
    data: '22/04/2025',
    modalidade: 'Futebol',
    videos: [
      {
        id: 101,
        nome: 'Jogo completo',
        url: VIDEO_TESTE,
        duracao: '01:32:15',
      },
      {
        id: 102,
        nome: 'Câmera principal',
        url: VIDEO_TESTE,
        duracao: '01:30:42',
      },
      {
        id: 103,
        nome: 'Câmera lateral',
        url: VIDEO_TESTE,
        duracao: '01:28:10',
      },
    ],
  },
  {
    id: 2,
    equipe: 'Falcões FC',
    adversario: 'Real Sports',
    data: '28/04/2025',
    modalidade: 'Futebol',
    videos: [
      {
        id: 201,
        nome: 'Jogo completo',
        url: VIDEO_TESTE,
        duracao: '01:20:30',
      },
      {
        id: 202,
        nome: 'Câmera auxiliar',
        url: VIDEO_TESTE,
        duracao: '01:18:20',
      },
    ],
  },
  {
    id: 3,
    equipe: 'Falcões FC',
    adversario: 'Leões SC',
    data: '05/05/2025',
    modalidade: 'Futebol',
    videos: [
      {
        id: 301,
        nome: 'Jogo completo',
        url: VIDEO_TESTE,
        duracao: '01:25:10',
      },
      {
        id: 302,
        nome: 'Câmera principal',
        url: VIDEO_TESTE,
        duracao: '01:22:50',
      },
      {
        id: 303,
        nome: 'Câmera auxiliar',
        url: VIDEO_TESTE,
        duracao: '01:19:40',
      },
    ],
  },
];

const categoriasIniciais: Categoria[] = [
  {
    id: 1,
    nome: 'Boa jogada',
    tipo: 'boa',
  },
  {
    id: 2,
    nome: 'Erro',
    tipo: 'ruim',
  },
  {
    id: 3,
    nome: 'Neutro',
    tipo: 'neutra',
  },
  {
    id: 4,
    nome: 'Destaque',
    tipo: 'destaque',
  },
];

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

export default function AnaliseVideos() {
  const videoRef =
    useRef<HTMLVideoElement | null>(null);

  const videoAreaRef =
    useRef<HTMLDivElement | null>(null);

  const [partidaSelecionadaId, setPartidaSelecionadaId] =
    useState(1);

  const [videoSelecionadoId, setVideoSelecionadoId] =
    useState(101);

  const [tempoAtual, setTempoAtual] =
    useState(0);

  const [categorias, setCategorias] =
    useState<Categoria[]>(
      categoriasIniciais,
    );

  const [eventos, setEventos] =
    useState<Evento[]>(eventosIniciais);

  const [clipes, setClipes] =
    useState<Clipe[]>([]);

  const [mostrarCategorias, setMostrarCategorias] =
    useState(false);

  const [mostrarNovoEvento, setMostrarNovoEvento] =
    useState(false);

  const [mostrarClipe, setMostrarClipe] =
    useState(false);

  const [videoExecutando, setVideoExecutando] =
    useState(false);

  const [velocidade, setVelocidade] =
    useState(1);

  const [mutado, setMutado] =
    useState(false);

  const [telaCheia, setTelaCheia] =
    useState(false);

  const [mostrarVelocidades, setMostrarVelocidades] =
    useState(false);

  const [novoEvento, setNovoEvento] = useState({
    nome: '',
    descricao: '',
    tipo: 'boa' as Evento['tipo'],
    segundo: 0,
    duracao: 5,
  });

  const [novoClipe, setNovoClipe] = useState({
    nome: '',
    inicio: 0,
    fim: 10,
  });

  const partidaSelecionada = useMemo(
    () =>
      partidasMock.find(
        (partida) =>
          partida.id ===
          partidaSelecionadaId,
      ) ?? null,
    [partidaSelecionadaId],
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
    [videosDaPartida, videoSelecionadoId],
  );

  const duracaoVideo =
    videoSelecionado
      ? converterDuracao(
          videoSelecionado.duracao,
        )
      : 0;

  function trocarPartida(id: number) {
    const partida = partidasMock.find(
      (item) => item.id === id,
    );

    setPartidaSelecionadaId(id);
    setTempoAtual(0);
    setVideoExecutando(false);

    if (partida?.videos.length) {
      setVideoSelecionadoId(
        partida.videos[0].id,
      );
    } else {
      setVideoSelecionadoId(0);
    }

    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }

  function trocarVideo(id: number) {
    setVideoSelecionadoId(id);
    setTempoAtual(0);
    setVideoExecutando(false);

    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }

  function alternarVideo() {
    if (!videoRef.current) {
      return;
    }

    if (videoRef.current.paused) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
  }

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

  function avancarDezSegundos() {
    if (!videoRef.current) {
      return;
    }

    videoRef.current.currentTime =
      Math.min(
        videoRef.current.duration || duracaoVideo,
        videoRef.current.currentTime + 10,
      );

    setTempoAtual(
      videoRef.current.currentTime,
    );
  }

  function alternarMute() {
    if (!videoRef.current) {
      return;
    }

    videoRef.current.muted =
      !videoRef.current.muted;

    setMutado(videoRef.current.muted);
  }

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

  async function alternarTelaCheia() {
    const elemento = videoAreaRef.current;

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

  function alterarTempo(
    event: React.ChangeEvent<HTMLInputElement>,
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

  function irParaEvento(segundo: number) {
    setTempoAtual(segundo);

    if (videoRef.current) {
      videoRef.current.currentTime =
        segundo;

      videoRef.current.play();

      setVideoExecutando(true);
    }
  }

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

  function selecionarCategoria(
    categoria: Categoria,
  ) {
    setNovoEvento({
      ...novoEvento,
      nome: categoria.nome,
      tipo: categoria.tipo,
      segundo: tempoAtual,
    });

    setMostrarNovoEvento(true);
  }

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

          {/* SELEÇÃO */}

          <div
            className={styles.videoSelectors}
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
              >
                {partidasMock.map(
                  (partida) => (
                    <option
                      key={partida.id}
                      value={partida.id}
                    >
                      {partida.equipe} x{' '}
                      {partida.adversario}
                    </option>
                  ),
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
                  videosDaPartida.length ===
                  0
                }
              >
                {videosDaPartida.map(
                  (video) => (
                    <option
                      key={video.id}
                      value={video.id}
                    >
                      {video.nome}
                    </option>
                  ),
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
                  ref={videoRef}
                  src={
                    videoSelecionado.url
                  }
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    display: 'block',
                  }}
                  onTimeUpdate={(
                    event,
                  ) =>
                    setTempoAtual(
                      event.currentTarget
                        .currentTime,
                    )
                  }
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
                  onLoadedMetadata={() => {
                    if (
                      videoRef.current
                    ) {
                      videoRef.current.playbackRate =
                        velocidade;

                      videoRef.current.muted =
                        mutado;
                    }
                  }}
                />
              ) : (
                <div
                  style={{
                    color: '#ffffff',
                    display: 'flex',
                    flexDirection:
                      'column',
                    alignItems: 'center',
                    gap: 10,
                  }}
                >
                  <Video size={42} />

                  <span>
                    Nenhum vídeo
                    disponível
                  </span>
                </div>
              )}

              {/* =================================
                  CONTROLES DO VÍDEO
              ================================= */}

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
                  {/* VOLTAR 10 */}

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

                  {/* PLAY */}

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

                  {/* AVANÇAR 10 */}

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

                  {/* VOLUME */}

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

                  {/* TEMPO */}

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
                  Selecione uma categoria
                  para registrar um
                  momento do vídeo.
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
                Editar
              </button>
            </div>

            <div
              className={
                styles.actionTypesGrid
              }
            >
              {categorias.map(
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
                          categoria.tipo ===
                          'boa'
                            ? '#d3f0df'
                            : categoria.tipo ===
                                'ruim'
                              ? '#f5d7d7'
                              : categoria.tipo ===
                                  'destaque'
                                ? '#d9eaf4'
                                : '#e0e5e2',
                        color:
                          categoria.tipo ===
                          'boa'
                            ? '#16a875'
                            : categoria.tipo ===
                                'ruim'
                              ? '#c94d4d'
                              : categoria.tipo ===
                                  'destaque'
                                ? '#2689c4'
                                : '#7d8983',
                      }}
                    >
                      {categoria.tipo ===
                      'boa' ? (
                        <Trophy
                          size={18}
                        />
                      ) : categoria.tipo ===
                        'ruim' ? (
                        <Flag
                          size={18}
                        />
                      ) : categoria.tipo ===
                        'destaque' ? (
                        <Play
                          size={18}
                        />
                      ) : (
                        <Clock3
                          size={18}
                        />
                      )}
                    </div>

                    <strong>
                      {categoria.nome}
                    </strong>

                    <span
                      className={
                        styles.timelineStatus
                      }
                    >
                      <Check
                        size={12}
                      />
                    </span>
                  </button>
                ),
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
                <Plus size={17} />
                Adicionar categoria
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
                  CONFIGURAÇÃO
                </span>

                <h2>
                  Categorias
                </h2>

                <p>
                  Gerencie as categorias
                  usadas durante a análise.
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
                    Categorias disponíveis
                  </strong>

                  <span>
                    {categorias.length}{' '}
                    categorias
                  </span>
                </div>

                <button
                  type="button"
                  className={
                    styles.newCategoryButton
                  }
                  onClick={() => {
                    setNovoEvento({
                      ...novoEvento,
                      nome: '',
                    });

                    setMostrarCategorias(
                      false,
                    );

                    setMostrarNovoEvento(
                      true,
                    );
                  }}
                >
                  <Plus size={15} />
                  Nova categoria
                </button>
              </div>

              <div
                className={
                  styles.categoriesList
                }
              >
                {categorias.map(
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
                            categoria.tipo ===
                            'boa'
                              ? '#d3f0df'
                              : categoria.tipo ===
                                  'ruim'
                                ? '#f5d7d7'
                                : categoria.tipo ===
                                    'destaque'
                                  ? '#d9eaf4'
                                  : '#e0e5e2',
                          color:
                            categoria.tipo ===
                            'boa'
                              ? '#16a875'
                              : categoria.tipo ===
                                  'ruim'
                                ? '#c94d4d'
                                : categoria.tipo ===
                                    'destaque'
                                  ? '#2689c4'
                                  : '#7d8983',
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
                          Categoria de{' '}
                          {categoria.tipo}
                        </span>
                      </div>

                      <button
                        type="button"
                        className={
                          styles.editCategoryButton
                        }
                        onClick={() => {
                          setNovoEvento({
                            ...novoEvento,
                            nome:
                              categoria.nome,
                            tipo:
                              categoria.tipo,
                            segundo:
                              tempoAtual,
                          });

                          setMostrarCategorias(
                            false,
                          );

                          setMostrarNovoEvento(
                            true,
                          );
                        }}
                      >
                        <Edit3
                          size={13}
                        />
                        Usar
                      </button>
                    </div>
                  ),
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
                    Nome do evento
                  </label>

                  <input
                    value={
                      novoEvento.nome
                    }
                    placeholder="Ex.: Gol, erro, boa jogada..."
                    onChange={(event) =>
                      setNovoEvento({
                        ...novoEvento,
                        nome: event
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
                    Tipo
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