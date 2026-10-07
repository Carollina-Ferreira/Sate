import {
  useEffect,
  useState,
} from 'react';

import {
  Trash2,
  TriangleAlert,
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


const videos = [
  {
    titulo:
      'Gol de Rafael Souza',

    horario:
      '22:54',

    tipo:
      'Gol',

    classe:
      'gol',
  },

  {
    titulo:
      'Gol de Rafael Souza',

    horario:
      '22:54',

    tipo:
      'Destaque',

    classe:
      'destaque',
  },
];


function obterToken() {
  return (
    localStorage.getItem(
      'token',
    ) ||
    sessionStorage.getItem(
      'token',
    )
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


export default function DetalhesDaPartida() {
  const navigate =
    useNavigate();


  const location =
    useLocation();


  const partida =
    location.state?.partida as
      | PartidaRecebida
      | undefined;


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
    videoSelecionado,
    setVideoSelecionado,
  ] =
    useState<
      number | null
    >(null);


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
     CARREGAR ATLETAS SELECIONADOS NA PARTIDA
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


      console.log(
        'ID PARTIDA:',
        partida.id,
      );


      console.log(
        'ESCALAÇÃO ENCONTRADA:',
        dadosSalvos,
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
     EXCLUIR
  ============================================================ */

  function abrirConfirmacaoExclusao() {
    setMostrarExcluir(
      true,
    );
  }


  function fecharConfirmacaoExclusao() {
    if (!excluindo) {
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
      setExcluindo(true);


      const token =
        obterToken();


      if (!token) {
        navigate('/login');
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


      if (!resposta.ok) {
        throw new Error(
          dados?.mensagem ||
          'Erro ao excluir partida.',
        );
      }


      /*
        REMOVE TAMBÉM A ESCALAÇÃO
        LOCAL DA PARTIDA
      */

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
      setExcluindo(false);
    }
  }


  return (
    <div
      className={
        styles.page
      }
    >

      {/* VOLTAR */}

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


      {/* PLACAR */}

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


      {/* EVENTOS + MOMENTOS */}

      <div
        className={
          styles.contentGrid
        }
      >

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
              Momentos Registrados
            </h3>
          </div>


          <div
            className={
              styles.videosList
            }
          >

            {videos.map(
              (
                video,
                index,
              ) => (

                <div
                  className={
                    styles.videoItem
                  }
                  key={
                    index
                  }
                >

                  <button
                    type="button"
                    className={
                      styles.videoPreview
                    }
                    onClick={() =>
                      setVideoSelecionado(
                        index,
                      )
                    }
                  >
                    <span
                      className={
                        styles.playIcon
                      }
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
                          video.horario
                        }
                      </span>

                    </div>


                    <span
                      className={`${styles.videoTag} ${
                        styles[
                          video.classe
                        ]
                      }`}
                    >
                      <span
                        className={
                          styles.tagDot
                        }
                      />

                      {
                        video.tipo
                      }
                    </span>

                  </div>

                </div>

              ),
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


      {/* EXCLUIR */}

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


      {/* MODAL VÍDEO */}

      {videoSelecionado !==
        null && (

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


            <div
              className={
                styles.fakeVideo
              }
            >
              <span
                className={
                  styles.bigPlay
                }
              >
                ▶
              </span>
            </div>


            <h3>
              {
                videos[
                  videoSelecionado
                ].titulo
              }
            </h3>

          </div>

        </div>

      )}


      {/* MODAL EXCLUIR */}

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