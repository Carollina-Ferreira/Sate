import {
  Check,
  CircleDot,
  Flag,
  Play,
  Save,
  Scissors,
  Search,
  Target,
  Video,
  X,
} from 'lucide-react';

import {
  useMemo,
  useState,
} from 'react';

import styles from './analiseVideos.module.css';

/* =====================================
   TIPAGENS
===================================== */

type Avaliacao =
  | 'boa'
  | 'ruim'
  | 'neutra'
  | 'destaque';

interface Atleta {
  id: number;
  nome: string;
  posicao: string;
  iniciais: string;
}

interface EventoAnalise {
  id: number;
  tipo: string;
  atleta: string;
  tempo: string;
  avaliacao: Avaliacao;
  clip?: boolean;
}

interface NovoClipe {
  nome: string;
  atletaId: number | null;
  acao: string;
  avaliacao: Avaliacao | '';
  observacao: string;
  inicio: number;
  fim: number;
}

/* =====================================
   DADOS MOCKADOS
===================================== */

const atletasMock: Atleta[] = [
  {
    id: 1,
    nome: 'Marcelo Ferreira',
    posicao: 'Atacante',
    iniciais: 'MF',
  },
  {
    id: 2,
    nome: 'Matheus Almeida',
    posicao: 'Meia',
    iniciais: 'MA',
  },
  {
    id: 3,
    nome: 'Bruno Alves',
    posicao: 'Atacante',
    iniciais: 'BA',
  },
  {
    id: 4,
    nome: 'Rafael Silva',
    posicao: 'Defensor',
    iniciais: 'RS',
  },
];

const eventosIniciais: EventoAnalise[] = [
  {
    id: 1,
    tipo: 'Gol',
    atleta: 'Bruno Alves',
    tempo: '45:00',
    avaliacao: 'boa',
  },
  {
    id: 2,
    tipo: 'Gol',
    atleta: 'Matheus Almeida',
    tempo: '45:00',
    avaliacao: 'boa',
    clip: true,
  },
  {
    id: 3,
    tipo: 'Erro',
    atleta: 'Rafael Silva',
    tempo: '45:00',
    avaliacao: 'ruim',
  },
  {
    id: 4,
    tipo: 'Finalização',
    atleta: 'João Ferreira',
    tempo: '45:00',
    avaliacao: 'ruim',
    clip: true,
  },
];

const AnaliseVideos = () => {
  const [painelClipeAberto, setPainelClipeAberto] =
    useState(false);

  const [videoRodando, setVideoRodando] =
    useState(false);

  const [eventos, setEventos] =
    useState<EventoAnalise[]>(
      eventosIniciais,
    );

  const [
    buscaAtleta,
    setBuscaAtleta,
  ] = useState('');

  const [
    novoClipe,
    setNovoClipe,
  ] = useState<NovoClipe>({
    nome: '',
    atletaId: null,
    acao: '',
    avaliacao: '',
    observacao: '',
    inicio: 10,
    fim: 14,
  });

  const atletasFiltrados =
    useMemo(() => {
      const busca =
        buscaAtleta
          .trim()
          .toLowerCase();

      if (!busca) {
        return atletasMock;
      }

      return atletasMock.filter(
        (atleta) =>
          atleta.nome
            .toLowerCase()
            .includes(busca) ||
          atleta.posicao
            .toLowerCase()
            .includes(busca),
      );
    }, [buscaAtleta]);

  const atletaSelecionado =
    useMemo(() => {
      return atletasMock.find(
        (atleta) =>
          atleta.id ===
          novoClipe.atletaId,
      );
    }, [novoClipe.atletaId]);

  const duracao =
    Math.max(
      0,
      novoClipe.fim -
        novoClipe.inicio,
    );

  const formularioValido =
    novoClipe.nome.trim() !== '' &&
    novoClipe.atletaId !== null &&
    novoClipe.acao !== '' &&
    novoClipe.avaliacao !== '' &&
    novoClipe.fim >
      novoClipe.inicio;

  const selecionarAtleta = (
    atleta: Atleta,
  ) => {
    setNovoClipe((atual) => ({
      ...atual,
      atletaId: atleta.id,
    }));

    setBuscaAtleta(
      atleta.nome,
    );
  };

  const selecionarAvaliacao = (
    avaliacao: Avaliacao,
  ) => {
    setNovoClipe((atual) => ({
      ...atual,
      avaliacao,
    }));
  };

  const salvarClipe = () => {
    if (!formularioValido) {
      return;
    }

    const atleta =
      atletasMock.find(
        (item) =>
          item.id ===
          novoClipe.atletaId,
      );

    if (!atleta) {
      return;
    }

    const novoEvento: EventoAnalise =
      {
        id: Date.now(),
        tipo: novoClipe.acao,
        atleta: atleta.nome,
        tempo: `${novoClipe.fim}:00`,
        avaliacao:
          novoClipe.avaliacao as Avaliacao,
        clip: true,
      };

    setEventos((atuais) => [
      ...atuais,
      novoEvento,
    ]);

    setNovoClipe({
      nome: '',
      atletaId: null,
      acao: '',
      avaliacao: '',
      observacao: '',
      inicio: 10,
      fim: 14,
    });

    setBuscaAtleta('');

    setPainelClipeAberto(false);
  };

  const registrarAcao = () => {
    console.log(
      'Registrar nova ação',
    );
  };

  const salvarAnalise = () => {
    console.log(
      'Análise salva',
      eventos,
    );
  };

  return (
    <main
      className={styles.page}
    >
      {/* =====================================
          CABEÇALHO
      ===================================== */}

      <div
        className={
          styles.pageHeader
        }
      >
        <div>
          <h1>
            Análise de Vídeos
          </h1>

          <div
            className={
              styles.matchInfo
            }
          >
            <span>
              Falcões FC vs Tigres FC
            </span>

            <i />

            <span>
              18/08/2026
            </span>

            <i />

            <span>
              Futebol
            </span>
          </div>
        </div>

        <div
          className={
            styles.headerActions
          }
        >
          <button
            type="button"
            className={
              styles.actionButtonBlue
            }
            onClick={
              registrarAcao
            }
          >
            <CircleDot
              size={16}
            />

            Registrar ação
          </button>

          <button
            type="button"
            className={
              styles.actionButtonRed
            }
            onClick={() =>
              setPainelClipeAberto(
                true,
              )
            }
          >
            <Scissors
              size={16}
            />

            Criar clipe
          </button>

          <button
            type="button"
            className={
              styles.actionButtonGreen
            }
            onClick={
              salvarAnalise
            }
          >
            <Save size={16} />

            Salvar análise
          </button>
        </div>
      </div>

      {/* =====================================
          CONTEÚDO PRINCIPAL
      ===================================== */}

      <section
        className={
          styles.analysisGrid
        }
      >
        {/* VÍDEO */}

        <article
          className={
            styles.videoCard
          }
        >
          <div
            className={
              styles.videoArea
            }
          >
            <button
              type="button"
              className={
                styles.playButton
              }
              onClick={() =>
                setVideoRodando(
                  (atual) =>
                    !atual,
                )
              }
            >
              {videoRodando ? (
                <span
                  className={
                    styles.pauseIcon
                  }
                >
                  ||
                </span>
              ) : (
                <Play
                  size={38}
                  fill="currentColor"
                />
              )}
            </button>

            <span
              className={
                styles.videoTime
              }
            >
              22:54 / 45:00
            </span>
          </div>

          {/* TIMELINE */}

          <div
            className={
              styles.timelineArea
            }
          >
            <input
              type="range"
              min="0"
              max="45"
              defaultValue="14"
              className={
                styles.videoRange
              }
            />

            <div
              className={
                styles.timelineMarkers
              }
            >
              <TimelineMarker
                label="Boa"
                className={
                  styles.goodMarker
                }
              />

              <TimelineMarker
                label="Ruim"
                className={
                  styles.badMarker
                }
              />

              <TimelineMarker
                label="Neutra"
                className={
                  styles.neutralMarker
                }
              />

              <TimelineMarker
                label="Destaque"
                className={
                  styles.highlightMarker
                }
              />
            </div>
          </div>
        </article>

        {/* EVENTOS */}

        <aside
          className={
            styles.eventsCard
          }
        >
          <div
            className={
              styles.eventsHeader
            }
          >
            <div>
              <h2>
                Eventos de análise
              </h2>

              <span>
                {eventos.length}{' '}
                eventos registrados
              </span>
            </div>

            <Video
              size={20}
            />
          </div>

          <div
            className={
              styles.eventsList
            }
          >
            {eventos.map(
              (evento) => (
                <EventCard
                  key={
                    evento.id
                  }
                  evento={
                    evento
                  }
                />
              ),
            )}
          </div>
        </aside>
      </section>

      {/* =====================================
          OVERLAY
      ===================================== */}

      {painelClipeAberto && (
        <div
          className={
            styles.overlay
          }
          onClick={() =>
            setPainelClipeAberto(
              false,
            )
          }
        />
      )}

      {/* =====================================
          PAINEL CRIAR CLIPE
      ===================================== */}

      <aside
        className={`${styles.clipPanel} ${
          painelClipeAberto
            ? styles.clipPanelOpen
            : ''
        }`}
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
                size={18}
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
              setPainelClipeAberto(
                false,
              )
            }
          >
            <X size={19} />
          </button>
        </div>

        <div
          className={
            styles.clipPanelContent
          }
        >
          {/* NOME */}

          <div
            className={
              styles.formGroup
            }
          >
            <label
              htmlFor="nome-clipe"
            >
              Nome do clipe
            </label>

            <input
              id="nome-clipe"
              type="text"
              placeholder="Ex: Contra-ataque - 2º Tempo"
              value={
                novoClipe.nome
              }
              onChange={(
                event,
              ) =>
                setNovoClipe(
                  (atual) => ({
                    ...atual,
                    nome:
                      event
                        .target
                        .value,
                  }),
                )
              }
            />
          </div>

          {/* ATLETA */}

          <div
            className={
              styles.formGroup
            }
          >
            <label>
              Atleta responsável
            </label>

            <div
              className={
                styles.searchAthlete
              }
            >
              <Search
                size={17}
              />

              <input
                type="text"
                placeholder="Pesquisar atleta..."
                value={
                  buscaAtleta
                }
                onChange={(
                  event,
                ) => {
                  setBuscaAtleta(
                    event
                      .target
                      .value,
                  );

                  setNovoClipe(
                    (
                      atual,
                    ) => ({
                      ...atual,
                      atletaId:
                        null,
                    }),
                  );
                }}
              />
            </div>

            <div
              className={
                styles.athletesList
              }
            >
              {atletasFiltrados.map(
                (atleta) => (
                  <button
                    key={
                      atleta.id
                    }
                    type="button"
                    className={`${styles.athleteItem} ${
                      atletaSelecionado?.id ===
                      atleta.id
                        ? styles.athleteSelected
                        : ''
                    }`}
                    onClick={() =>
                      selecionarAtleta(
                        atleta,
                      )
                    }
                  >
                    <div
                      className={
                        styles.athleteAvatar
                      }
                    >
                      {
                        atleta.iniciais
                      }
                    </div>

                    <div>
                      <strong>
                        {
                          atleta.nome
                        }
                      </strong>

                      <span>
                        {
                          atleta.posicao
                        }
                      </span>
                    </div>

                    {atletaSelecionado?.id ===
                      atleta.id && (
                      <Check
                        size={16}
                      />
                    )}
                  </button>
                ),
              )}
            </div>
          </div>

          {/* AÇÃO */}

          <div
            className={
              styles.formGroup
            }
          >
            <label
              htmlFor="acao"
            >
              Qual foi a ação?
            </label>

            <select
              id="acao"
              value={
                novoClipe.acao
              }
              onChange={(
                event,
              ) =>
                setNovoClipe(
                  (atual) => ({
                    ...atual,
                    acao:
                      event
                        .target
                        .value,
                  }),
                )
              }
            >
              <option value="">
                Selecionar ação
              </option>

              <option value="Gol">
                Gol
              </option>

              <option value="Passe">
                Passe
              </option>

              <option value="Tackle">
                Tackle
              </option>

              <option value="Finalização">
                Finalização
              </option>

              <option value="Erro">
                Erro
              </option>

              <option value="Duelo">
                Duelo
              </option>
            </select>
          </div>

          {/* AVALIAÇÃO */}

          <div
            className={
              styles.formGroup
            }
          >
            <label>
              Como foi a ação?
            </label>

            <div
              className={
                styles.ratingGrid
              }
            >
              <RatingButton
                label="Boa"
                type="boa"
                active={
                  novoClipe.avaliacao ===
                  'boa'
                }
                onClick={() =>
                  selecionarAvaliacao(
                    'boa',
                  )
                }
              />

              <RatingButton
                label="Ruim"
                type="ruim"
                active={
                  novoClipe.avaliacao ===
                  'ruim'
                }
                onClick={() =>
                  selecionarAvaliacao(
                    'ruim',
                  )
                }
              />

              <RatingButton
                label="Neutra"
                type="neutra"
                active={
                  novoClipe.avaliacao ===
                  'neutra'
                }
                onClick={() =>
                  selecionarAvaliacao(
                    'neutra',
                  )
                }
              />

              <RatingButton
                label="Destaque"
                type="destaque"
                active={
                  novoClipe.avaliacao ===
                  'destaque'
                }
                onClick={() =>
                  selecionarAvaliacao(
                    'destaque',
                  )
                }
              />
            </div>
          </div>

          {/* OBSERVAÇÃO */}

          <div
            className={
              styles.formGroup
            }
          >
            <label
              htmlFor="observacao"
            >
              Observação
            </label>

            <textarea
              id="observacao"
              placeholder="Ex: Boa tomada de decisão e excelente execução do passe."
              value={
                novoClipe.observacao
              }
              onChange={(
                event,
              ) =>
                setNovoClipe(
                  (atual) => ({
                    ...atual,
                    observacao:
                      event
                        .target
                        .value,
                  }),
                )
              }
            />
          </div>

          {/* DURAÇÃO */}

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
                <strong>
                  {
                    novoClipe.inicio
                  }{' '}
                  min
                </strong>
              </span>

              <span>
                Fim:{' '}
                <strong>
                  {
                    novoClipe.fim
                  }{' '}
                  min
                </strong>
              </span>

              <span>
                Duração:{' '}
                <strong
                  className={
                    styles.durationValue
                  }
                >
                  {duracao} min
                </strong>
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
                max="45"
                value={
                  novoClipe.inicio
                }
                onChange={(
                  event,
                ) => {
                  const value =
                    Number(
                      event
                        .target
                        .value,
                    );

                  setNovoClipe(
                    (
                      atual,
                    ) => ({
                      ...atual,
                      inicio:
                        Math.min(
                          value,
                          atual.fim -
                            1,
                        ),
                    }),
                  );
                }}
              />

              <input
                type="range"
                min="0"
                max="45"
                value={
                  novoClipe.fim
                }
                onChange={(
                  event,
                ) => {
                  const value =
                    Number(
                      event
                        .target
                        .value,
                    );

                  setNovoClipe(
                    (
                      atual,
                    ) => ({
                      ...atual,
                      fim:
                        Math.max(
                          value,
                          atual.inicio +
                            1,
                        ),
                    }),
                  );
                }}
              />
            </div>
          </div>

          <p
            className={
              styles.formHint
            }
          >
            Preencha nome,
            atleta, ação e
            avaliação para
            salvar o clipe.
          </p>
        </div>

        <div
          className={
            styles.clipPanelFooter
          }
        >
          <button
            type="button"
            disabled={
              !formularioValido
            }
            className={
              styles.saveClipButton
            }
            onClick={
              salvarClipe
            }
          >
            <Scissors
              size={17}
            />

            Salvar clipe
          </button>
        </div>
      </aside>
    </main>
  );
};

/* =====================================
   EVENTO
===================================== */

interface EventCardProps {
  evento: EventoAnalise;
}

const EventCard = ({
  evento,
}: EventCardProps) => {
  const iconClass =
    evento.avaliacao === 'boa'
      ? styles.eventIconGood
      : evento.avaliacao ===
          'destaque'
        ? styles.eventIconHighlight
        : styles.eventIconBad;

  return (
    <div
      className={
        styles.eventItem
      }
    >
      <div
        className={`${styles.eventIcon} ${iconClass}`}
      >
        {evento.tipo ===
        'Gol' ? (
          <Target
            size={17}
          />
        ) : evento.tipo ===
          'Erro' ? (
          <Flag
            size={17}
          />
        ) : (
          <CircleDot
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
          {evento.tipo}
        </strong>

        <span>
          {evento.atleta}
        </span>
      </div>

      <div
        className={
          styles.eventRight
        }
      >
        <span>
          {evento.tempo}
        </span>

        {evento.clip && (
          <small>
            <Scissors
              size={11}
            />

            clipe
          </small>
        )}
      </div>
    </div>
  );
};

/* =====================================
   AVALIAÇÃO
===================================== */

interface RatingButtonProps {
  label: string;
  type: Avaliacao;
  active: boolean;
  onClick: () => void;
}

const RatingButton = ({
  label,
  type,
  active,
  onClick,
}: RatingButtonProps) => {
  return (
    <button
      type="button"
      className={`${styles.ratingButton} ${
        active
          ? styles.ratingButtonActive
          : ''
      }`}
      onClick={onClick}
    >
      <span
        className={`${styles.ratingDot} ${
          type === 'boa'
            ? styles.dotGood
            : type === 'ruim'
              ? styles.dotBad
              : type ===
                  'destaque'
                ? styles.dotHighlight
                : styles.dotNeutral
        }`}
      />

      {label}
    </button>
  );
};

/* =====================================
   MARCADOR TIMELINE
===================================== */

interface TimelineMarkerProps {
  label: string;
  className: string;
}

const TimelineMarker = ({
  label,
  className,
}: TimelineMarkerProps) => {
  return (
    <div
      className={
        styles.timelineMarker
      }
    >
      <span
        className={
          className
        }
      />

      <small>
        {label}
      </small>
    </div>
  );
};

export default AnaliseVideos;