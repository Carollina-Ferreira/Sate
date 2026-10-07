import {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  Plus,
  Trash2,
  TriangleAlert,
  Upload,
  Video,
  X,
} from 'lucide-react';

import {
  useLocation,
  useNavigate,
} from 'react-router-dom';

import styles from './partidas2.module.css';


type AtletaPartida = {
  id: number;

  nome?: string | null;

  categoria?: string | null;

  equipeId?: number | null;

  usuario?: {
    avatarUrl?: string | null;
    email?: string | null;
  } | null;
};


type PartidaRecebida = {
  id: number;

  confronto: string;

  modalidade: string;

  data: string;

  resultado: string;

  status: string;

  tipo: string;

  temporada: string;
};


type VideoPartida = {
  id: number;

  titulo: string;

  horario?: string;

  tipo?: string | null;

  classe?: string;

  url: string;

  nomeArquivo?: string;

  tamanho?: number | string | null;

  createdAt?: string;

  updatedAt?: string;
};


const API_URL =
  'http://localhost:3000/api';


const eventos = [
  {
    horario: '22:54',
    tipo: 'Gol',
    atleta: 'Rafael Souza',
    cor: 'verde',
  },

  {
    horario: '22:54',
    tipo: 'Erro',
    atleta: 'Bruno Alves',
    cor: 'vermelho',
  },

  {
    horario: '22:54',
    tipo: 'Finalização',
    atleta: 'Rafael Souza',
    cor: 'azul',
  },
];


function obterToken() {
  return (
    localStorage.getItem('token') ||
    localStorage.getItem('accessToken') ||
    sessionStorage.getItem('token')
  );
}


function chaveEscalacao(
  partidaId: number,
) {
  return `sate_escalacao_partida_${partidaId}`;
}


function obterIniciais(
  nome: string,
) {
  const partes =
    nome
      .trim()
      .split(' ')
      .filter(Boolean);


  if (
    partes.length === 0
  ) {
    return 'AT';
  }


  if (
    partes.length === 1
  ) {
    return partes[0]
      .slice(0, 2)
      .toUpperCase();
  }


  return `${partes[0][0]}${partes[
    partes.length - 1
  ][0]}`.toUpperCase();
}


function formatarTamanho(
  tamanho: number | string | null | undefined,
) {
  if (
    tamanho === null ||
    tamanho === undefined ||
    tamanho === ''
  ) {
    return '';
  }


  const bytes =
    Number(tamanho);


  if (
    Number.isNaN(bytes)
  ) {
    return String(tamanho);
  }


  if (
    bytes < 1024
  ) {
    return `${bytes} B`;
  }


  if (
    bytes < 1024 * 1024
  ) {
    return `${(
      bytes / 1024
    ).toFixed(1)} KB`;
  }


  if (
    bytes < 1024 * 1024 * 1024
  ) {
    return `${(
      bytes /
      (1024 * 1024)
    ).toFixed(1)} MB`;
  }


  return `${(
    bytes /
    (1024 * 1024 * 1024)
  ).toFixed(1)} GB`;
}


function formatarHorario(
  video: VideoPartida,
) {
  if (
    video.horario
  ) {
    return video.horario;
  }


  if (
    video.createdAt
  ) {
    const data =
      new Date(
        video.createdAt,
      );


    if (
      !Number.isNaN(
        data.getTime(),
      )
    ) {
      return data.toLocaleTimeString(
        'pt-BR',
        {
          hour:
            '2-digit',
          minute:
            '2-digit',
        },
      );
    }
  }


  return '--:--';
}


function obterClasseVideo(
  video: VideoPartida,
) {
  if (
    video.classe
  ) {
    return video.classe;
  }


  if (
    video.tipo
      ?.toLowerCase()
      .includes('gol')
  ) {
    return 'gol';
  }


  return 'destaque';
}


function normalizarUrlVideo(
  url: string,
) {
  if (
    !url
  ) {
    return '';
  }


  if (
    url.startsWith('http://') ||
    url.startsWith('https://') ||
    url.startsWith('blob:')
  ) {
    return url;
  }


  if (
    url.startsWith('/')
  ) {
    return `http://localhost:3000${url}`;
  }


  return `http://localhost:3000/${url}`;
}


export default function DetalhesDaPartida() {
  const navigate =
    useNavigate();


  const location =
    useLocation();


  const partida =
    location.state?.partida as
      | PartidaRecebida
      | undefined;


  const inputVideoRef =
    useRef<HTMLInputElement | null>(
      null,
    );


  const [
    atletasPartida,
    setAtletasPartida,
  ] =
    useState<
      AtletaPartida[]
    >([]);


  const [
    carregandoAtletas,
    setCarregandoAtletas,
  ] =
    useState(true);


  const [
    videos,
    setVideos,
  ] =
    useState<
      VideoPartida[]
    >([]);


  const [
    carregandoVideos,
    setCarregandoVideos,
  ] =
    useState(true);


  const [
    videoSelecionado,
    setVideoSelecionado,
  ] =
    useState<
      number | null
    >(null);


  const [
    mostrarAdicionarVideo,
    setMostrarAdicionarVideo,
  ] =
    useState(false);


  const [
    nomeNovoVideo,
    setNomeNovoVideo,
  ] =
    useState('');


  const [
    arquivoVideo,
    setArquivoVideo,
  ] =
    useState<File | null>(
      null,
    );


  const [
    enviandoVideo,
    setEnviandoVideo,
  ] =
    useState(false);


  const [
    videoExcluindo,
    setVideoExcluindo,
  ] =
    useState<number | null>(
      null,
    );


  const [
    mostrarExcluir,
    setMostrarExcluir,
  ] =
    useState(false);


  const [
    excluindo,
    setExcluindo,
  ] =
    useState(false);


  /* ============================================================
     CARREGAR ATLETAS DA PARTIDA
  ============================================================ */

  useEffect(() => {
    if (
      !partida?.id
    ) {
      setCarregandoAtletas(
        false,
      );

      return;
    }


    try {
      const chave =
        chaveEscalacao(
          partida.id,
        );


      const dadosSalvos =
        localStorage.getItem(
          chave,
        );


      if (
        !dadosSalvos
      ) {
        setAtletasPartida(
          [],
        );

        return;
      }


      const atletasSalvos =
        JSON.parse(
          dadosSalvos,
        );


      if (
        Array.isArray(
          atletasSalvos,
        )
      ) {
        setAtletasPartida(
          atletasSalvos,
        );
      } else {
        setAtletasPartida(
          [],
        );
      }

    } catch (error) {
      console.error(
        'Erro ao carregar escalação:',
        error,
      );

      setAtletasPartida(
        [],
      );

    } finally {
      setCarregandoAtletas(
        false,
      );
    }

  }, [
    partida?.id,
  ]);


  /* ============================================================
     CARREGAR VÍDEOS DO BACKEND
  ============================================================ */

  useEffect(() => {
    async function carregarVideos() {
      if (
        !partida?.id
      ) {
        setCarregandoVideos(
          false,
        );

        return;
      }


      try {
        setCarregandoVideos(
          true,
        );


        const token =
          obterToken();


        if (!token) {
          navigate(
            '/login',
          );

          return;
        }


        const resposta =
          await fetch(
            `${API_URL}/partidas/${partida.id}/videos`,
            {
              method:
                'GET',

              headers: {
                Authorization:
                  `Bearer ${token}`,

                'Content-Type':
                  'application/json',
              },
            },
          );


        const dados =
          await resposta
            .json()
            .catch(
              () => ({}),
            );


        if (
          resposta.status ===
          401
        ) {
          navigate(
            '/login',
          );

          return;
        }


        if (
          !resposta.ok
        ) {
          throw new Error(
            dados?.mensagem ||
            'Erro ao carregar os vídeos da partida.',
          );
        }


        const lista =
          Array.isArray(
            dados,
          )
            ? dados
            : Array.isArray(
                dados?.videos,
              )
              ? dados.videos
              : [];


        const videosFormatados =
          lista.map(
            (
              video: VideoPartida,
            ) => ({
              ...video,

              url:
                normalizarUrlVideo(
                  video.url,
                ),
            }),
          );


        setVideos(
          videosFormatados,
        );

      } catch (error) {
        console.error(
          'Erro ao carregar vídeos:',
          error,
        );


        setVideos(
          [],
        );

      } finally {
        setCarregandoVideos(
          false,
        );
      }
    }


    carregarVideos();

  }, [
    partida?.id,
    navigate,
  ]);


  /* ============================================================
     DADOS DA PARTIDA
  ============================================================ */

  const confronto =
    partida?.confronto ||
    'Partida';


  const modalidade =
    partida?.modalidade ||
    'Modalidade';


  const data =
    partida?.data ||
    '-';


  const resultado =
    partida?.resultado ||
    '-';


  const status =
    partida?.status ||
    'Pendente';


  const equipes =
    confronto.split(
      ' vs ',
    );


  const equipeCasa =
    equipes[0] ||
    'Equipe';


  const equipeVisitante =
    equipes[1] ||
    'Adversário';


  function voltarParaPartidas() {
    navigate(
      '/partidas',
    );
  }


  /* ============================================================
     ABRIR MODAL ADICIONAR
  ============================================================ */

  function abrirAdicionarVideo() {
    setNomeNovoVideo(
      '',
    );

    setArquivoVideo(
      null,
    );

    setMostrarAdicionarVideo(
      true,
    );
  }


  function fecharAdicionarVideo() {
    if (
      enviandoVideo
    ) {
      return;
    }


    setMostrarAdicionarVideo(
      false,
    );

    setNomeNovoVideo(
      '',
    );

    setArquivoVideo(
      null,
    );


    if (
      inputVideoRef.current
    ) {
      inputVideoRef.current.value =
        '';
    }
  }


  /* ============================================================
     SELECIONAR ARQUIVO
  ============================================================ */

  function selecionarArquivoVideo(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const arquivo =
      event.target.files?.[0];


    if (
      !arquivo
    ) {
      return;
    }


    if (
      !arquivo.type.startsWith(
        'video/',
      )
    ) {
      alert(
        'Selecione um arquivo de vídeo válido.',
      );


      event.target.value =
        '';


      return;
    }


    setArquivoVideo(
      arquivo,
    );


    if (
      !nomeNovoVideo.trim()
    ) {
      const nomeSemExtensao =
        arquivo.name.replace(
          /\.[^/.]+$/,
          '',
        );


      setNomeNovoVideo(
        nomeSemExtensao,
      );
    }
  }


  /* ============================================================
     ENVIAR VÍDEO PARA O BACKEND
  ============================================================ */

  async function adicionarVideo() {
    if (
      !partida?.id
    ) {
      alert(
        'Não foi possível identificar a partida.',
      );

      return;
    }


    if (
      !arquivoVideo
    ) {
      alert(
        'Selecione um vídeo antes de continuar.',
      );

      return;
    }


    if (
      !nomeNovoVideo.trim()
    ) {
      alert(
        'Digite um nome para o vídeo.',
      );

      return;
    }


    try {
      setEnviandoVideo(
        true,
      );


      const token =
        obterToken();


      if (!token) {
        navigate(
          '/login',
        );

        return;
      }


      const formData =
        new FormData();


      formData.append(
        'arquivo',
        arquivoVideo,
      );


      formData.append(
        'titulo',
        nomeNovoVideo.trim(),
      );


      const resposta =
        await fetch(
          `${API_URL}/partidas/${partida.id}/videos`,
          {
            method:
              'POST',

            headers: {
              Authorization:
                `Bearer ${token}`,
            },

            body:
              formData,
          },
        );


      const dados =
        await resposta
          .json()
          .catch(
            () => ({}),
          );


      if (
        resposta.status ===
        401
      ) {
        navigate(
          '/login',
        );

        return;
      }


      if (
        !resposta.ok
      ) {
        throw new Error(
          dados?.mensagem ||
          'Erro ao enviar vídeo.',
        );
      }


      const videoRecebido =
        dados?.video ||
        dados;


      if (
        !videoRecebido?.id
      ) {
        throw new Error(
          'O vídeo foi enviado, mas o servidor não retornou os dados corretamente.',
        );
      }


      const videoFormatado:
        VideoPartida = {
        ...videoRecebido,

        url:
          normalizarUrlVideo(
            videoRecebido.url,
          ),
      };


      setVideos(
        (atual) => [
          ...atual,
          videoFormatado,
        ],
      );


      setMostrarAdicionarVideo(
        false,
      );


      setNomeNovoVideo(
        '',
      );


      setArquivoVideo(
        null,
      );


      if (
        inputVideoRef.current
      ) {
        inputVideoRef.current.value =
          '';
      }


      setVideoSelecionado(
        videoFormatado.id,
      );


      alert(
        'Vídeo adicionado com sucesso!',
      );

    } catch (error) {
      console.error(
        'Erro ao adicionar vídeo:',
        error,
      );


      alert(
        error instanceof Error
          ? error.message
          : 'Erro ao adicionar vídeo.',
      );

    } finally {
      setEnviandoVideo(
        false,
      );
    }
  }


  /* ============================================================
     EXCLUIR VÍDEO DO BACKEND
  ============================================================ */

  async function removerVideo(
    videoId: number,
  ) {
    if (
      !partida?.id
    ) {
      return;
    }


    try {
      setVideoExcluindo(
        videoId,
      );


      const token =
        obterToken();


      if (!token) {
        navigate(
          '/login',
        );

        return;
      }


      /*
        A rota de exclusão está no backend como:

        DELETE /api/videos/:id

        Por isso não usamos /partidas/:partidaId/videos/:id.
      */

      const resposta =
        await fetch(
          `${API_URL}/videos/${videoId}`,
          {
            method:
              'DELETE',

            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          },
        );


      const dados =
        await resposta
          .json()
          .catch(
            () => ({}),
          );


      if (
        resposta.status ===
        401
      ) {
        navigate(
          '/login',
        );

        return;
      }


      if (
        !resposta.ok
      ) {
        throw new Error(
          dados?.mensagem ||
          'Erro ao excluir vídeo.',
        );
      }


      setVideos(
        (atual) =>
          atual.filter(
            (video) =>
              video.id !==
              videoId,
          ),
      );


      if (
        videoSelecionado ===
        videoId
      ) {
        setVideoSelecionado(
          null,
        );
      }

    } catch (error) {
      console.error(
        'Erro ao excluir vídeo:',
        error,
      );


      alert(
        error instanceof Error
          ? error.message
          : 'Erro ao excluir vídeo.',
      );

    } finally {
      setVideoExcluindo(
        null,
      );
    }
  }


  /* ============================================================
     EXCLUIR PARTIDA
  ============================================================ */

  function abrirConfirmacaoExclusao() {
    setMostrarExcluir(
      true,
    );
  }


  function fecharConfirmacaoExclusao() {
    if (
      !excluindo
    ) {
      setMostrarExcluir(
        false,
      );
    }
  }


  async function excluirPartida() {
    if (
      !partida?.id
    ) {
      return;
    }


    try {
      setExcluindo(
        true,
      );


      const token =
        obterToken();


      if (!token) {
        navigate(
          '/login',
        );

        return;
      }


      const resposta =
        await fetch(
          `${API_URL}/partidas/${partida.id}`,
          {
            method:
              'DELETE',

            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          },
        );


      const dados =
        await resposta
          .json()
          .catch(
            () => ({}),
          );


      if (
        !resposta.ok
      ) {
        throw new Error(
          dados?.mensagem ||
          'Erro ao excluir partida.',
        );
      }


      localStorage.removeItem(
        chaveEscalacao(
          partida.id,
        ),
      );


      navigate(
        '/partidas',
      );

    } catch (error) {
      console.error(
        error,
      );


      alert(
        error instanceof Error
          ? error.message
          : 'Erro ao excluir partida.',
      );

    } finally {
      setExcluindo(
        false,
      );
    }
  }


  const videoAtual =
    videoSelecionado !== null
      ? videos.find(
          (video) =>
            video.id ===
            videoSelecionado,
        )
      : null;


  return (
    <div
      className={
        styles.page
      }
    >

      {/* =====================================================
          VOLTAR
      ===================================================== */}

      <button
        type="button"
        className={
          styles.backButton
        }
        onClick={
          voltarParaPartidas
        }
      >
        <span>
          ‹
        </span>

        Voltar para partidas
      </button>


      {/* =====================================================
          PLACAR
      ===================================================== */}

      <section
        className={
          styles.scoreCard
        }
      >

        <div
          className={
            styles.team
          }
        >

          <div
            className={
              styles.teamIcon
            }
          >
            {obterIniciais(
              equipeCasa,
            )}
          </div>


          <strong>
            {equipeCasa}
          </strong>

        </div>


        <div
          className={
            styles.scoreCenter
          }
        >

          <div
            className={
              styles.score
            }
          >
            {resultado}
          </div>


          <div
            className={
              styles.matchInfo
            }
          >

            <span>
              {data}
            </span>


            <span
              className={
                styles.separator
              }
            >
              •
            </span>


            <span>
              {modalidade}
            </span>

          </div>


          <span
            className={`${styles.status} ${
              status ===
              'Pendente'
                ? styles.statusPending
                : status ===
                    'Cancelada'
                  ? styles.statusCancelled
                  : styles.statusFinished
            }`}
          >
            {status}
          </span>

        </div>


        <div
          className={
            styles.team
          }
        >

          <div
            className={
              styles.teamIcon
            }
          >
            {obterIniciais(
              equipeVisitante,
            )}
          </div>


          <strong>
            {equipeVisitante}
          </strong>

        </div>

      </section>


      {/* =====================================================
          EVENTOS + VÍDEOS
      ===================================================== */}

      <div
        className={
          styles.contentGrid
        }
      >

        {/* EVENTOS */}

        <section
          className={
            styles.card
          }
        >

          <div
            className={
              styles.cardHeader
            }
          >
            <h3>
              Eventos Registrados
            </h3>
          </div>


          <div
            className={
              styles.eventsList
            }
          >

            {eventos.map(
              (
                evento,
                index,
              ) => (

                <div
                  className={
                    styles.eventRow
                  }
                  key={
                    index
                  }
                >

                  <span
                    className={
                      styles.eventTime
                    }
                  >
                    {
                      evento.horario
                    }
                  </span>


                  <span
                    className={`${styles.eventDot} ${
                      styles[
                        evento.cor
                      ]
                    }`}
                  />


                  <span
                    className={
                      styles.eventType
                    }
                  >
                    {
                      evento.tipo
                    }
                  </span>


                  <span
                    className={
                      styles.eventAthlete
                    }
                  >
                    {
                      evento.atleta
                    }
                  </span>

                </div>

              ),
            )}

          </div>

        </section>


        {/* ===================================================
            VÍDEOS
        =================================================== */}

        <section
          className={
            styles.card
          }
        >

          <div
            className={
              styles.cardHeader
            }
            style={{
              display:
                'flex',

              alignItems:
                'center',

              justifyContent:
                'space-between',

              gap: 16,
            }}
          >

            <div>
              <h3>
                Vídeos da partida
              </h3>
            </div>


            <button
              type="button"
              onClick={
                abrirAdicionarVideo
              }
              disabled={
                carregandoVideos
              }
              style={{
                display:
                  'inline-flex',

                alignItems:
                  'center',

                justifyContent:
                  'center',

                gap: 7,

                padding:
                  '9px 13px',

                border:
                  'none',

                borderRadius:
                  9,

                background:
                  '#16A875',

                color:
                  '#ffffff',

                fontFamily:
                  'inherit',

                fontSize:
                  12,

                fontWeight:
                  700,

                cursor:
                  carregandoVideos
                    ? 'not-allowed'
                    : 'pointer',

                whiteSpace:
                  'nowrap',

                opacity:
                  carregandoVideos
                    ? 0.6
                    : 1,
              }}
            >

              <Plus
                size={15}
              />

              Adicionar vídeo

            </button>

          </div>


          <div
            className={
              styles.videosList
            }
          >

            {carregandoVideos ? (

              <div
                style={{
                  display:
                    'flex',

                  flexDirection:
                    'column',

                  alignItems:
                    'center',

                  justifyContent:
                    'center',

                  padding:
                    '35px 20px',

                  textAlign:
                    'center',

                  color:
                    '#77857e',

                  gap: 10,
                }}
              >

                <Video
                  size={30}
                />

                <strong>
                  Carregando vídeos...
                </strong>

              </div>

            ) : videos.length ===
              0 ? (

              <div
                style={{
                  display:
                    'flex',

                  flexDirection:
                    'column',

                  alignItems:
                    'center',

                  justifyContent:
                    'center',

                  padding:
                    '35px 20px',

                  textAlign:
                    'center',

                  color:
                    '#77857e',

                  gap: 10,
                }}
              >

                <Video
                  size={32}
                />

                <strong>
                  Nenhum vídeo adicionado
                </strong>

                <span
                  style={{
                    fontSize:
                      12,
                  }}
                >
                  Adicione um vídeo
                  desta partida
                  para começar.
                </span>

              </div>

            ) : (

              videos.map(
                (
                  video,
                ) => (

                  <div
                    className={
                      styles.videoItem
                    }
                    key={
                      video.id
                    }
                  >

                    {/* =================================================
                        CAPA DO VÍDEO
                        AGORA MOSTRA O PRÓPRIO VÍDEO
                    ================================================= */}

                    <button
                      type="button"
                      className={
                        styles.videoPreview
                      }
                      onClick={() =>
                        setVideoSelecionado(
                          video.id,
                        )
                      }
                      style={{
                        position:
                          'relative',

                        overflow:
                          'hidden',

                        padding:
                          0,

                        border:
                          'none',

                        background:
                          '#000',

                        cursor:
                          'pointer',
                      }}
                    >

                      <video
                        src={
                          video.url
                        }
                        muted
                        autoPlay
                        loop
                        playsInline
                        preload="metadata"
                        aria-label={
                          video.titulo
                        }
                        style={{
                          position:
                            'absolute',

                          inset:
                            0,

                          width:
                            '100%',

                          height:
                            '100%',

                          objectFit:
                            'cover',

                          display:
                            'block',

                          pointerEvents:
                            'none',
                        }}
                        onError={(
                          event,
                        ) => {
                          console.error(
                            'Erro ao carregar miniatura do vídeo:',
                            video.url,
                          );

                          event.currentTarget.style.display =
                            'none';
                        }}
                      />


                      {/* ESCURECIMENTO LEVE */}

                      <span
                        style={{
                          position:
                            'absolute',

                          inset:
                            0,

                          background:
                            'linear-gradient(rgba(0,0,0,0.03), rgba(0,0,0,0.25))',

                          pointerEvents:
                            'none',
                        }}
                      />


                      {/* BOTÃO PLAY */}

                      <span
                        className={
                          styles.playIcon
                        }
                        style={{
                          position:
                            'absolute',

                          top:
                            '50%',

                          left:
                            '50%',

                          transform:
                            'translate(-50%, -50%)',

                          zIndex:
                            2,

                          display:
                            'flex',

                          alignItems:
                            'center',

                          justifyContent:
                            'center',

                          width:
                            42,

                          height:
                            42,

                          borderRadius:
                            '50%',

                          background:
                            'rgba(255,255,255,0.92)',

                          color:
                            '#16A875',

                          boxShadow:
                            '0 4px 15px rgba(0,0,0,0.25)',

                          fontSize:
                            15,

                          paddingLeft:
                            2,

                          boxSizing:
                            'border-box',

                          pointerEvents:
                            'none',
                        }}
                      >
                        ▶
                      </span>

                    </button>


                    <div
                      className={
                        styles.videoInfo
                      }
                    >

                      <div
                        className={
                          styles.videoTitleRow
                        }
                      >

                        <strong>
                          {
                            video.titulo
                          }
                        </strong>


                        <span>
                          {
                            formatarHorario(
                              video,
                            )
                          }
                        </span>

                      </div>


                      <span
                        className={`${styles.videoTag} ${
                          styles[
                            obterClasseVideo(
                              video,
                            )
                          ]
                        }`}
                      >

                        <span
                          className={
                            styles.tagDot
                          }
                        />

                        {
                          video.tipo ||
                          'Vídeo'
                        }

                      </span>


                      {video.nomeArquivo && (
                        <span
                          style={{
                            display:
                              'block',

                            marginTop:
                              4,

                            fontSize:
                              10,

                            color:
                              '#84918b',

                            overflow:
                              'hidden',

                            textOverflow:
                              'ellipsis',

                            whiteSpace:
                              'nowrap',
                          }}
                        >

                          {
                            video.nomeArquivo
                          }


                          {video.tamanho &&
                            ` • ${formatarTamanho(
                              video.tamanho,
                            )}`}

                        </span>
                      )}

                    </div>


                    <button
                      type="button"
                      onClick={() =>
                        removerVideo(
                          video.id,
                        )
                      }
                      disabled={
                        videoExcluindo ===
                        video.id
                      }
                      title="Remover vídeo"
                      style={{
                        width:
                          30,

                        height:
                          30,

                        display:
                          'flex',

                        alignItems:
                          'center',

                        justifyContent:
                          'center',

                        flexShrink:
                          0,

                        border:
                          'none',

                        borderRadius:
                          7,

                        background:
                          '#fff0f0',

                        color:
                          '#D52941',

                        cursor:
                          videoExcluindo ===
                          video.id
                            ? 'not-allowed'
                            : 'pointer',

                        opacity:
                          videoExcluindo ===
                          video.id
                            ? 0.5
                            : 1,
                      }}
                    >

                      <Trash2
                        size={14}
                      />

                    </button>

                  </div>

                ),
              )

            )}

          </div>

        </section>

      </div>


      {/* =====================================================
          ATLETAS PARTICIPANTES
      ===================================================== */}

      <section
        className={`${styles.card} ${styles.athletesCard}`}
      >

        <div
          className={
            styles.cardHeader
          }
        >

          <h3>
            Atletas participantes
          </h3>

        </div>


        <div
          className={
            styles.athletesList
          }
        >

          {carregandoAtletas ? (

            <p
              className={
                styles.athletesMessage
              }
            >
              Carregando escalação...
            </p>

          ) : atletasPartida.length ===
            0 ? (

            <p
              className={
                styles.athletesMessage
              }
            >
              Nenhum atleta foi escalado para esta partida.
            </p>

          ) : (

            atletasPartida.map(
              (atleta) => {

                const nome =
                  atleta.nome ||
                  'Atleta';


                return (

                  <div
                    className={
                      styles.athlete
                    }
                    key={
                      atleta.id
                    }
                  >

                    <div
                      className={
                        styles.athleteAvatar
                      }
                    >

                      {atleta.usuario
                        ?.avatarUrl ? (

                        <img
                          src={
                            atleta.usuario
                              .avatarUrl
                          }
                          alt={
                            nome
                          }
                        />

                      ) : (

                        obterIniciais(
                          nome,
                        )

                      )}

                    </div>


                    <div
                      className={
                        styles.athleteInfo
                      }
                    >

                      <strong>
                        {nome}
                      </strong>


                      {atleta.categoria && (
                        <span>
                          {
                            atleta.categoria
                          }
                        </span>
                      )}

                    </div>

                  </div>

                );

              },
            )

          )}

        </div>

      </section>


      {/* =====================================================
          EXCLUIR PARTIDA
      ===================================================== */}

      <section
        className={
          styles.dangerZone
        }
      >

        <div
          className={
            styles.dangerText
          }
        >

          <strong>
            Excluir partida
          </strong>


          <p>
            Remova esta partida permanentemente do sistema.
          </p>

        </div>


        <button
          type="button"
          className={
            styles.deleteButton
          }
          onClick={
            abrirConfirmacaoExclusao
          }
        >

          <Trash2
            size={16}
          />

          Excluir partida

        </button>

      </section>


      {/* =====================================================
          MODAL ADICIONAR VÍDEO
      ===================================================== */}

      {mostrarAdicionarVideo && (

        <div
          className={
            styles.videoModalOverlay
          }
          onClick={
            fecharAdicionarVideo
          }
        >

          <div
            className={
              styles.videoModal
            }
            onClick={(event) =>
              event.stopPropagation()
            }
            style={{
              width:
                'min(520px, calc(100% - 32px))',

              padding:
                0,

              overflow:
                'hidden',
            }}
          >

            <div
              style={{
                display:
                  'flex',

                alignItems:
                  'center',

                justifyContent:
                  'space-between',

                padding:
                  '20px 22px',

                borderBottom:
                  '1px solid #e5ebe7',
              }}
            >

              <div>

                <div
                  style={{
                    display:
                      'flex',

                    alignItems:
                      'center',

                    gap: 9,

                    marginBottom:
                      5,
                  }}
                >

                  <Video
                    size={19}
                    color="#16A875"
                  />

                  <h3
                    style={{
                      margin:
                        0,

                      fontSize:
                        18,

                      color:
                        '#12261F',
                    }}
                  >
                    Adicionar vídeo
                  </h3>

                </div>


                <span
                  style={{
                    display:
                      'block',

                    fontSize:
                      12,

                    color:
                      '#7b8982',
                  }}
                >
                  O vídeo será salvo
                  nesta partida.
                </span>

              </div>


              <button
                type="button"
                onClick={
                  fecharAdicionarVideo
                }
                disabled={
                  enviandoVideo
                }
                style={{
                  width:
                    34,

                  height:
                    34,

                  display:
                    'flex',

                  alignItems:
                    'center',

                  justifyContent:
                    'center',

                  border:
                    'none',

                  borderRadius:
                    8,

                  background:
                    '#f2f5f3',

                  color:
                    '#52615a',

                  cursor:
                    enviandoVideo
                      ? 'not-allowed'
                      : 'pointer',
                }}
              >

                <X
                  size={17}
                />

              </button>

            </div>


            <div
              style={{
                padding:
                  '22px',
              }}
            >

              <label
                style={{
                  display:
                    'block',

                  marginBottom:
                    7,

                  color:
                    '#34453d',

                  fontSize:
                    12,

                  fontWeight:
                    700,
                }}
              >
                Nome do vídeo
              </label>


              <input
                type="text"
                value={
                  nomeNovoVideo
                }
                onChange={(
                  event,
                ) =>
                  setNomeNovoVideo(
                    event.target.value,
                  )
                }
                placeholder="Ex.: Gol de Rafael Souza"
                disabled={
                  enviandoVideo
                }
                style={{
                  width:
                    '100%',

                  height:
                    45,

                  boxSizing:
                    'border-box',

                  padding:
                    '0 13px',

                  border:
                    '1px solid #cdd8d2',

                  borderRadius:
                    9,

                  outline:
                    'none',

                  background:
                    '#ffffff',

                  color:
                    '#12261F',

                  fontFamily:
                    'inherit',

                  fontSize:
                    13,
                }}
              />


              <div
                style={{
                  marginTop:
                    18,
                }}
              >

                <label
                  style={{
                    display:
                      'block',

                    marginBottom:
                      7,

                    color:
                      '#34453d',

                    fontSize:
                      12,

                    fontWeight:
                      700,
                  }}
                >
                  Arquivo do vídeo
                </label>


                <input
                  ref={
                    inputVideoRef
                  }
                  type="file"
                  accept="video/*"
                  onChange={
                    selecionarArquivoVideo
                  }
                  disabled={
                    enviandoVideo
                  }
                  style={{
                    display:
                      'none',
                  }}
                />


                <button
                  type="button"
                  onClick={() =>
                    inputVideoRef.current?.click()
                  }
                  disabled={
                    enviandoVideo
                  }
                  style={{
                    width:
                      '100%',

                    minHeight:
                      110,

                    display:
                      'flex',

                    flexDirection:
                      'column',

                    alignItems:
                      'center',

                    justifyContent:
                      'center',

                    gap: 8,

                    padding:
                      16,

                    boxSizing:
                      'border-box',

                    border:
                      '1.5px dashed #b8c9c0',

                    borderRadius:
                      12,

                    background:
                      '#f7faf8',

                    color:
                      '#52615a',

                    cursor:
                      enviandoVideo
                        ? 'not-allowed'
                        : 'pointer',

                    fontFamily:
                      'inherit',

                    opacity:
                      enviandoVideo
                        ? 0.6
                        : 1,
                  }}
                >

                  <div
                    style={{
                      width:
                        40,

                      height:
                        40,

                      display:
                        'flex',

                      alignItems:
                        'center',

                      justifyContent:
                        'center',

                      borderRadius:
                        '50%',

                      background:
                        '#dff4eb',

                      color:
                        '#16A875',
                    }}
                  >

                    <Upload
                      size={19}
                    />

                  </div>


                  {arquivoVideo ? (

                    <>

                      <strong
                        style={{
                          maxWidth:
                            '100%',

                          overflow:
                            'hidden',

                          textOverflow:
                            'ellipsis',

                          whiteSpace:
                            'nowrap',

                          fontSize:
                            13,

                          color:
                            '#23372e',
                        }}
                      >
                        {
                          arquivoVideo.name
                        }
                      </strong>


                      <span
                        style={{
                          fontSize:
                            11,

                          color:
                            '#7c8983',
                        }}
                      >
                        {formatarTamanho(
                          arquivoVideo.size,
                        )}{' '}
                        • Clique
                        para trocar
                      </span>

                    </>

                  ) : (

                    <>

                      <strong
                        style={{
                          fontSize:
                            13,

                          color:
                            '#34453d',
                        }}
                      >
                        Clique para
                        selecionar
                      </strong>


                      <span
                        style={{
                          fontSize:
                            11,

                          color:
                            '#89958f',
                        }}
                      >
                        MP4, WebM,
                        MOV ou outro
                        formato de
                        vídeo
                      </span>

                    </>

                  )}

                </button>

              </div>

            </div>


            <div
              style={{
                display:
                  'flex',

                justifyContent:
                  'flex-end',

                gap: 9,

                padding:
                  '15px 22px',

                borderTop:
                  '1px solid #e5ebe7',

                background:
                  '#fafcfb',
              }}
            >

              <button
                type="button"
                onClick={
                  fecharAdicionarVideo
                }
                disabled={
                  enviandoVideo
                }
                style={{
                  height:
                    40,

                  padding:
                    '0 15px',

                  border:
                    '1px solid #d4ded9',

                  borderRadius:
                    8,

                  background:
                    '#ffffff',

                  color:
                    '#53625b',

                  fontFamily:
                    'inherit',

                  fontSize:
                    12,

                  fontWeight:
                    600,

                  cursor:
                    enviandoVideo
                      ? 'not-allowed'
                      : 'pointer',
                }}
              >
                Cancelar
              </button>


              <button
                type="button"
                onClick={
                  adicionarVideo
                }
                disabled={
                  enviandoVideo ||
                  !arquivoVideo ||
                  !nomeNovoVideo.trim()
                }
                style={{
                  height:
                    40,

                  display:
                    'flex',

                  alignItems:
                    'center',

                  gap: 7,

                  padding:
                    '0 17px',

                  border:
                    'none',

                  borderRadius:
                    8,

                  background:
                    enviandoVideo ||
                    !arquivoVideo ||
                    !nomeNovoVideo.trim()
                      ? '#b7c8c0'
                      : '#16A875',

                  color:
                    '#ffffff',

                  fontFamily:
                    'inherit',

                  fontSize:
                    12,

                  fontWeight:
                    700,

                  cursor:
                    enviandoVideo ||
                    !arquivoVideo ||
                    !nomeNovoVideo.trim()
                      ? 'not-allowed'
                      : 'pointer',
                }}
              >

                <Upload
                  size={15}
                />


                {enviandoVideo
                  ? 'Enviando...'
                  : 'Enviar vídeo'}

              </button>

            </div>

          </div>

        </div>

      )}


      {/* =====================================================
          MODAL VÍDEO
      ===================================================== */}

      {videoAtual && (

        <div
          className={
            styles.videoModalOverlay
          }
          onClick={() =>
            setVideoSelecionado(
              null,
            )
          }
        >

          <div
            className={
              styles.videoModal
            }
            onClick={(event) =>
              event.stopPropagation()
            }
            style={{
              width:
                'min(900px, calc(100% - 32px))',

              maxWidth:
                900,

              padding:
                0,

              overflow:
                'hidden',
            }}
          >

            <button
              type="button"
              className={
                styles.closeModal
              }
              onClick={() =>
                setVideoSelecionado(
                  null,
                )
              }
            >
              ×
            </button>


            <video
              src={
                videoAtual.url
              }
              controls
              autoPlay
              style={{
                width:
                  '100%',

                display:
                  'block',

                maxHeight:
                  '70vh',

                background:
                  '#050505',
              }}
              onError={() => {
                console.error(
                  'Não foi possível reproduzir:',
                  videoAtual.url,
                );
              }}
            />


            <div
              style={{
                padding:
                  '16px 20px',
              }}
            >

              <h3
                style={{
                  margin:
                    0,

                  color:
                    '#12261F',

                  fontSize:
                    16,
                }}
              >
                {
                  videoAtual.titulo
                }
              </h3>


              <span
                style={{
                  display:
                    'block',

                  marginTop:
                    5,

                  fontSize:
                    11,

                  color:
                    '#7c8983',
                }}
              >

                {
                  videoAtual.nomeArquivo ||
                  'Vídeo da partida'
                }


                {videoAtual.tamanho &&
                  ` • ${formatarTamanho(
                    videoAtual.tamanho,
                  )}`}

              </span>

            </div>

          </div>

        </div>

      )}


      {/* =====================================================
          MODAL EXCLUIR PARTIDA
      ===================================================== */}

      {mostrarExcluir && (

        <div
          className={
            styles.deleteOverlay
          }
          onClick={
            fecharConfirmacaoExclusao
          }
        >

          <div
            className={
              styles.deleteModal
            }
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div
              className={
                styles.deleteModalHeader
              }
            >

              <div
                className={
                  styles.deleteIcon
                }
              >

                <TriangleAlert
                  size={21}
                />

              </div>


              <button
                type="button"
                className={
                  styles.deleteClose
                }
                onClick={
                  fecharConfirmacaoExclusao
                }
              >

                <X
                  size={18}
                />

              </button>

            </div>


            <div
              className={
                styles.deleteModalContent
              }
            >

              <h3>
                Excluir partida?
              </h3>


              <p>
                Você está prestes a excluir
                <strong>
                  {' '}
                  {confronto}
                </strong>
                . Essa ação não poderá ser desfeita.
              </p>

            </div>


            <div
              className={
                styles.deleteActions
              }
            >

              <button
                type="button"
                className={
                  styles.deleteCancel
                }
                onClick={
                  fecharConfirmacaoExclusao
                }
              >
                Cancelar
              </button>


              <button
                type="button"
                className={
                  styles.deleteConfirm
                }
                onClick={
                  excluirPartida
                }
                disabled={
                  excluindo
                }
              >

                <Trash2
                  size={15}
                />


                {excluindo
                  ? 'Excluindo...'
                  : 'Excluir partida'}

              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}