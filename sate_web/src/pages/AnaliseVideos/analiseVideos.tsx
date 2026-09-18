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
  segundo: number;
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

const DURACAO_VIDEO = 45 * 60;

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
    segundo: 360,
    avaliacao: 'boa',
  },
  {
    id: 2,
    tipo: 'Gol',
    atleta: 'Matheus Almeida',
    segundo: 820,
    avaliacao: 'boa',
    clip: true,
  },
  {
    id: 3,
    tipo: 'Erro',
    atleta: 'Rafael Silva',
    segundo: 1270,
    avaliacao: 'ruim',
  },
  {
    id: 4,
    tipo: 'Finalização',
    atleta: 'João Ferreira',
    segundo: 2010,
    avaliacao: 'destaque',
    clip: true,
  },
];

const formatarTempo = (segundos: number) => {
  const minutos = Math.floor(segundos / 60);
  const resto = segundos % 60;

  return `${minutos}:${resto
    .toString()
    .padStart(2, '0')}`;
};

const AnaliseVideos = () => {
  const [painelClipeAberto, setPainelClipeAberto] =
    useState(false);

  const [registroAberto, setRegistroAberto] =
    useState(false);

  const [videoRodando, setVideoRodando] =
    useState(false);

  const [tempoAtual, setTempoAtual] =
    useState(22 * 60 + 54);

  const [eventos, setEventos] =
    useState<EventoAnalise[]>(
      eventosIniciais,
    );

  const [tipoAcao, setTipoAcao] =
    useState('');

  const [
    avaliacaoRapida,
    setAvaliacaoRapida,
  ] = useState<Avaliacao | ''>('');

  const [
    atletaRapido,
    setAtletaRapido,
  ] = useState(1);

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

  const atletasFiltrados = useMemo(() => {
    const busca =
      buscaAtleta.trim().toLowerCase();

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

  const atletaSelecionado = useMemo(() => {
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

  const registroValido =
    tipoAcao !== '' &&
    avaliacaoRapida !== '';

  const registrarAcao = () => {
    if (!registroValido) {
      return;
    }

    const atleta =
      atletasMock.find(
        (item) =>
          item.id ===
          atletaRapido,
      );

    if (!atleta) {
      return;
    }

    const novoEvento: EventoAnalise = {
      id: Date.now(),
      tipo: tipoAcao,
      atleta: atleta.nome,
      segundo: tempoAtual,
      avaliacao:
        avaliacaoRapida as Avaliacao,
    };

    setEventos((atuais) => [
      ...atuais,
      novoEvento,
    ]);

    setTipoAcao('');
    setAvaliacaoRapida('');
    setRegistroAberto(false);
  };

  const selecionarAtleta = (
    atleta: Atleta,
  ) => {
    setNovoClipe((atual) => ({
      ...atual,
      atletaId: atleta.id,
    }));

    setBuscaAtleta(atleta.nome);
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

    const novoEvento: EventoAnalise = {
      id: Date.now(),
      tipo: novoClipe.acao,
      atleta: atleta.nome,
      segundo:
        novoClipe.fim * 60,
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

  return (
    <main className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1>
            Análise de Vídeos
          </h1>

          <div className={styles.matchInfo}>
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

        <div className={styles.headerActions}>
          <button
            type="button"
            className={styles.actionButtonBlue}
            onClick={() =>
              setRegistroAberto(
                (atual) => !atual,
              )
            }
          >
            <CircleDot size={16} />
            Registrar ação
          </button>

          <button
            type="button"
            className={styles.actionButtonRed}
            onClick={() =>
              setPainelClipeAberto(true)
            }
          >
            <Scissors size={16} />
            Criar clipe
          </button>

          <button
            type="button"
            className={styles.actionButtonGreen}
          >
            <Save size={16} />
            Salvar análise
          </button>
        </div>
      </div>

      <section className={styles.analysisGrid}>
        <article className={styles.videoCard}>
          <div className={styles.videoArea}>
            <button
              type="button"
              className={styles.playButton}
              onClick={() =>
                setVideoRodando(
                  (atual) => !atual,
                )
              }
            >
              {videoRodando ? (
                <span className={styles.pauseIcon}>
                  ||
                </span>
              ) : (
                <Play
                  size={38}
                  fill="currentColor"
                />
              )}
            </button>

            <span className={styles.videoTime}>
              {formatarTempo(
                tempoAtual,
              )}{' '}
              / 45:00
            </span>
          </div>

          <div className={styles.timelineArea}>
            <div
              className={
                styles.timelineTrackWrapper
              }
            >
              <input
                type="range"
                min="0"
                max={DURACAO_VIDEO}
                value={tempoAtual}
                onChange={(event) =>
                  setTempoAtual(
                    Number(
                      event.target.value,
                    ),
                  )
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
                  (evento) => {
                    const posicao =
                      (evento.segundo /
                        DURACAO_VIDEO) *
                      100;

                    return (
                      <button
                        key={evento.id}
                        type="button"
                        className={`${styles.analysisMarker} ${
                          styles[
                            `marker_${evento.avaliacao}`
                          ]
                        }`}
                        style={{
                          left: `${posicao}%`,
                        }}
                        title={`${evento.tipo} - ${evento.atleta} - ${formatarTempo(
                          evento.segundo,
                        )}`}
                        onClick={() =>
                          setTempoAtual(
                            evento.segundo,
                          )
                        }
                      />
                    );
                  },
                )}
              </div>
            </div>

            <div
              className={
                styles.timelineLegend
              }
            >
              <TimelineLegend
                label="Boa"
                className={
                  styles.goodMarker
                }
              />

              <TimelineLegend
                label="Ruim"
                className={
                  styles.badMarker
                }
              />

              <TimelineLegend
                label="Neutra"
                className={
                  styles.neutralMarker
                }
              />

              <TimelineLegend
                label="Destaque"
                className={
                  styles.highlightMarker
                }
              />
            </div>

            {registroAberto && (
              <div
                className={
                  styles.quickRegister
                }
              >
                <div
                  className={
                    styles.quickRegisterHeader
                  }
                >
                  <div>
                    <strong>
                      Registrar ação
                    </strong>

                    <span>
                      Momento:{' '}
                      {formatarTempo(
                        tempoAtual,
                      )}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setRegistroAberto(false)
                    }
                  >
                    <X size={17} />
                  </button>
                </div>

                <div
                  className={
                    styles.quickRegisterGrid
                  }
                >
                  <div>
                    <label>
                      Atleta
                    </label>

                    <select
                      value={atletaRapido}
                      onChange={(event) =>
                        setAtletaRapido(
                          Number(
                            event.target.value,
                          ),
                        )
                      }
                    >
                      {atletasMock.map(
                        (atleta) => (
                          <option
                            key={atleta.id}
                            value={atleta.id}
                          >
                            {atleta.nome}
                          </option>
                        ),
                      )}
                    </select>
                  </div>

                  <div>
                    <label>
                      Ação
                    </label>

                    <select
                      value={tipoAcao}
                      onChange={(event) =>
                        setTipoAcao(
                          event.target.value,
                        )
                      }
                    >
                      <option value="">
                        Selecionar
                      </option>

                      <option value="Gol">
                        Gol
                      </option>

                      <option value="Passe">
                        Passe
                      </option>

                      <option value="Finalização">
                        Finalização
                      </option>

                      <option value="Tackle">
                        Tackle
                      </option>

                      <option value="Erro">
                        Erro
                      </option>

                      <option value="Duelo">
                        Duelo
                      </option>
                    </select>
                  </div>
                </div>

                <div
                  className={
                    styles.quickRatings
                  }
                >
                  {(
                    [
                      'boa',
                      'ruim',
                      'neutra',
                      'destaque',
                    ] as Avaliacao[]
                  ).map(
                    (avaliacao) => (
                      <RatingButton
                        key={avaliacao}
                        label={
                          avaliacao === 'boa'
                            ? 'Boa'
                            : avaliacao === 'ruim'
                              ? 'Ruim'
                              : avaliacao === 'neutra'
                                ? 'Neutra'
                                : 'Destaque'
                        }
                        type={avaliacao}
                        active={
                          avaliacaoRapida ===
                          avaliacao
                        }
                        onClick={() =>
                          setAvaliacaoRapida(
                            avaliacao,
                          )
                        }
                      />
                    ),
                  )}
                </div>

                <button
                  type="button"
                  disabled={
                    !registroValido
                  }
                  className={
                    styles.quickSaveButton
                  }
                  onClick={registrarAcao}
                >
                  <Check size={16} />

                  Registrar em{' '}
                  {formatarTempo(
                    tempoAtual,
                  )}
                </button>
              </div>
            )}
          </div>
        </article>

        <aside className={styles.eventsCard}>
          <div className={styles.eventsHeader}>
            <div>
              <h2>
                Eventos de análise
              </h2>

              <span>
                {eventos.length}{' '}
                eventos registrados
              </span>
            </div>

            <Video size={20} />
          </div>

          <div className={styles.eventsList}>
            {eventos
              .slice()
              .sort(
                (a, b) =>
                  a.segundo -
                  b.segundo,
              )
              .map((evento) => (
                <EventCard
                  key={evento.id}
                  evento={evento}
                  onClick={() =>
                    setTempoAtual(
                      evento.segundo,
                    )
                  }
                />
              ))}
          </div>
        </aside>
      </section>

      {painelClipeAberto && (
        <div
          className={styles.overlay}
          onClick={() =>
            setPainelClipeAberto(false)
          }
        />
      )}

      <aside
        className={`${styles.clipPanel} ${
          painelClipeAberto
            ? styles.clipPanelOpen
            : ''
        }`}
      >
        <div className={styles.clipPanelHeader}>
          <div>
            <div className={styles.clipIcon}>
              <Scissors size={18} />
            </div>

            <h2>Criar clipe</h2>
          </div>

          <button
            type="button"
            className={styles.closeButton}
            onClick={() =>
              setPainelClipeAberto(false)
            }
          >
            <X size={19} />
          </button>
        </div>

        <div className={styles.clipPanelContent}>
          <div className={styles.formGroup}>
            <label htmlFor="nome-clipe">
              Nome do clipe
            </label>

            <input
              id="nome-clipe"
              type="text"
              placeholder="Ex: Contra-ataque - 2º Tempo"
              value={novoClipe.nome}
              onChange={(event) =>
                setNovoClipe(
                  (atual) => ({
                    ...atual,
                    nome:
                      event.target.value,
                  }),
                )
              }
            />
          </div>

          <div className={styles.formGroup}>
            <label>
              Atleta responsável
            </label>

            <div
              className={
                styles.searchAthlete
              }
            >
              <Search size={17} />

              <input
                type="text"
                placeholder="Pesquisar atleta..."
                value={buscaAtleta}
                onChange={(event) => {
                  setBuscaAtleta(
                    event.target.value,
                  );

                  setNovoClipe(
                    (atual) => ({
                      ...atual,
                      atletaId: null,
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
                    key={atleta.id}
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
                      {atleta.iniciais}
                    </div>

                    <div>
                      <strong>
                        {atleta.nome}
                      </strong>

                      <span>
                        {atleta.posicao}
                      </span>
                    </div>

                    {atletaSelecionado?.id ===
                      atleta.id && (
                      <Check size={16} />
                    )}
                  </button>
                ),
              )}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>
              Qual foi a ação?
            </label>

            <select
              value={novoClipe.acao}
              onChange={(event) =>
                setNovoClipe(
                  (atual) => ({
                    ...atual,
                    acao:
                      event.target.value,
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

          <div className={styles.formGroup}>
            <label>
              Como foi a ação?
            </label>

            <div className={styles.ratingGrid}>
              {(
                [
                  'boa',
                  'ruim',
                  'neutra',
                  'destaque',
                ] as Avaliacao[]
              ).map((avaliacao) => (
                <RatingButton
                  key={avaliacao}
                  label={
                    avaliacao === 'boa'
                      ? 'Boa'
                      : avaliacao === 'ruim'
                        ? 'Ruim'
                        : avaliacao === 'neutra'
                          ? 'Neutra'
                          : 'Destaque'
                  }
                  type={avaliacao}
                  active={
                    novoClipe.avaliacao ===
                    avaliacao
                  }
                  onClick={() =>
                    setNovoClipe(
                      (atual) => ({
                        ...atual,
                        avaliacao,
                      }),
                    )
                  }
                />
              ))}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>
              Observação
            </label>

            <textarea
              placeholder="Ex: Boa tomada de decisão e excelente execução do passe."
              value={
                novoClipe.observacao
              }
              onChange={(event) =>
                setNovoClipe(
                  (atual) => ({
                    ...atual,
                    observacao:
                      event.target.value,
                  }),
                )
              }
            />
          </div>

          <div className={styles.durationSection}>
            <h3>
              Duração do clipe
            </h3>

            <div className={styles.durationInfo}>
              <span>
                Início:{' '}
                <strong>
                  {novoClipe.inicio} min
                </strong>
              </span>

              <span>
                Fim:{' '}
                <strong>
                  {novoClipe.fim} min
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

            <div className={styles.rangeGroup}>
              <input
                type="range"
                min="0"
                max="45"
                value={novoClipe.inicio}
                onChange={(event) => {
                  const value =
                    Number(
                      event.target.value,
                    );

                  setNovoClipe(
                    (atual) => ({
                      ...atual,
                      inicio:
                        Math.min(
                          value,
                          atual.fim - 1,
                        ),
                    }),
                  );
                }}
              />

              <input
                type="range"
                min="0"
                max="45"
                value={novoClipe.fim}
                onChange={(event) => {
                  const value =
                    Number(
                      event.target.value,
                    );

                  setNovoClipe(
                    (atual) => ({
                      ...atual,
                      fim:
                        Math.max(
                          value,
                          atual.inicio + 1,
                        ),
                    }),
                  );
                }}
              />
            </div>
          </div>

          <p className={styles.formHint}>
            Preencha nome, atleta, ação e avaliação para salvar o clipe.
          </p>
        </div>

        <div className={styles.clipPanelFooter}>
          <button
            type="button"
            disabled={!formularioValido}
            className={styles.saveClipButton}
            onClick={salvarClipe}
          >
            <Scissors size={17} />

            Salvar clipes
          </button>
        </div>
      </aside>
    </main>
  );
};

interface EventCardProps {
  evento: EventoAnalise;
  onClick: () => void;
}

const EventCard = ({
  evento,
  onClick,
}: EventCardProps) => {
  return (
    <button
      type="button"
      className={styles.eventItem}
      onClick={onClick}
    >
      <div
        className={`${styles.eventIcon} ${
          evento.avaliacao === 'boa'
            ? styles.eventIconGood
            : evento.avaliacao ===
                'destaque'
              ? styles.eventIconHighlight
              : evento.avaliacao ===
                  'neutra'
                ? styles.eventIconNeutral
                : styles.eventIconBad
        }`}
      >
        {evento.tipo === 'Gol' ? (
          <Target size={17} />
        ) : evento.tipo ===
          'Erro' ? (
          <Flag size={17} />
        ) : (
          <CircleDot size={17} />
        )}
      </div>

      <div className={styles.eventContent}>
        <strong>
          {evento.tipo}
        </strong>

        <span>
          {evento.atleta}
        </span>
      </div>

      <div className={styles.eventRight}>
        <span>
          {formatarTempo(
            evento.segundo,
          )}
        </span>

        {evento.clip && (
          <small>
            <Scissors size={11} />
            clipe
          </small>
        )}
      </div>
    </button>
  );
};

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
              : type === 'destaque'
                ? styles.dotHighlight
                : styles.dotNeutral
        }`}
      />

      {label}
    </button>
  );
};

interface TimelineLegendProps {
  label: string;
  className: string;
}

const TimelineLegend = ({
  label,
  className,
}: TimelineLegendProps) => {
  return (
    <div className={styles.timelineLegendItem}>
      <span className={className} />
      <small>{label}</small>
    </div>
  );
};

export default AnaliseVideos;