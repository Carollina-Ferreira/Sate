import {
  ArrowRightLeft,
  Check,
  CircleDot,
  FastForward,
  Flag,
  Handshake,
  Palette,
  Pencil,
  Play,
  Plus,
  Save,
  Scissors,
  Search,
  Shield,
  ShieldCheck,
  Target,
  Trash2,
  Video,
  X,
  XCircle,
  Zap,
} from 'lucide-react';

import type {
  LucideIcon,
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

interface CategoriaAcao {
  id: number;
  nome: string;
  icon: LucideIcon;
  cor: string;
  mostrarTimeline: boolean;
}

interface CategoriaForm {
  id: number | null;
  nome: string;
  iconId: string;
  cor: string;
  mostrarTimeline: boolean;
}

const DURACAO_VIDEO =
  45 * 60;

const opcoesIcones: {
  id: string;
  nome: string;
  icon: LucideIcon;
}[] = [
  {
    id: 'target',
    nome: 'Alvo',
    icon: Target,
  },
  {
    id: 'passe',
    nome: 'Passe',
    icon: ArrowRightLeft,
  },
  {
    id: 'assistencia',
    nome: 'Assistência',
    icon: Handshake,
  },
  {
    id: 'raio',
    nome: 'Raio',
    icon: Zap,
  },
  {
    id: 'escudo',
    nome: 'Escudo',
    icon: Shield,
  },
  {
    id: 'defesa',
    nome: 'Defesa',
    icon: ShieldCheck,
  },
  {
    id: 'contra',
    nome: 'Avanço',
    icon: FastForward,
  },
  {
    id: 'bandeira',
    nome: 'Bandeira',
    icon: Flag,
  },
  {
    id: 'erro',
    nome: 'Erro',
    icon: XCircle,
  },
  {
    id: 'circulo',
    nome: 'Ponto',
    icon: CircleDot,
  },
];

const categoriasIniciais: CategoriaAcao[] = [
  {
    id: 1,
    nome: 'Gol',
    icon: Target,
    cor: '#4AA8D8',
    mostrarTimeline: true,
  },
  {
    id: 2,
    nome: 'Passe',
    icon: ArrowRightLeft,
    cor: '#4AA8D8',
    mostrarTimeline: true,
  },
  {
    id: 3,
    nome: 'Assistência',
    icon: Handshake,
    cor: '#4AA8D8',
    mostrarTimeline: true,
  },
  {
    id: 4,
    nome: 'Finalização',
    icon: Zap,
    cor: '#4AA8D8',
    mostrarTimeline: true,
  },
  {
    id: 5,
    nome: 'Defesa',
    icon: Shield,
    cor: '#4AA8D8',
    mostrarTimeline: true,
  },
  {
    id: 6,
    nome: 'Roubo de bola',
    icon: ShieldCheck,
    cor: '#4AA8D8',
    mostrarTimeline: true,
  },
  {
    id: 7,
    nome: 'Contra-ataque',
    icon: FastForward,
    cor: '#4AA8D8',
    mostrarTimeline: true,
  },
  {
    id: 8,
    nome: 'Falta',
    icon: Flag,
    cor: '#4AA8D8',
    mostrarTimeline: true,
  },
  {
    id: 9,
    nome: 'Erro',
    icon: XCircle,
    cor: '#E06C75',
    mostrarTimeline: true,
  },
];

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

const formatarTempo = (
  segundos: number,
) => {
  const minutos =
    Math.floor(
      segundos / 60,
    );

  const resto =
    segundos % 60;

  return `${minutos}:${resto
    .toString()
    .padStart(2, '0')}`;
};

const AnaliseVideos = () => {
  const [
    painelClipeAberto,
    setPainelClipeAberto,
  ] = useState(false);

  const [
    videoRodando,
    setVideoRodando,
  ] = useState(false);

  const [
    tempoAtual,
    setTempoAtual,
  ] = useState(
    22 * 60 + 54,
  );

  const [
    eventos,
    setEventos,
  ] =
    useState<EventoAnalise[]>(
      eventosIniciais,
    );

  const [
    categorias,
    setCategorias,
  ] =
    useState<CategoriaAcao[]>(
      categoriasIniciais,
    );

  const [
    modalCategoriasAberto,
    setModalCategoriasAberto,
  ] = useState(false);

  const [
    formularioCategoriaAberto,
    setFormularioCategoriaAberto,
  ] = useState(false);

  const [
    confirmarExclusao,
    setConfirmarExclusao,
  ] = useState(false);

  const [
    categoriaForm,
    setCategoriaForm,
  ] =
    useState<CategoriaForm>({
      id: null,
      nome: '',
      iconId: 'target',
      cor: '#4AA8D8',
      mostrarTimeline: true,
    });

  const [
    buscaAtleta,
    setBuscaAtleta,
  ] = useState('');

  const [
    novoClipe,
    setNovoClipe,
  ] =
    useState<NovoClipe>({
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
            .includes(
              busca,
            ) ||
          atleta.posicao
            .toLowerCase()
            .includes(
              busca,
            ),
      );
    }, [
      buscaAtleta,
    ]);

  const atletaSelecionado =
    useMemo(() => {
      return atletasMock.find(
        (atleta) =>
          atleta.id ===
          novoClipe.atletaId,
      );
    }, [
      novoClipe.atletaId,
    ]);

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
    setNovoClipe(
      (atual) => ({
        ...atual,
        atletaId:
          atleta.id,
      }),
    );

    setBuscaAtleta(
      atleta.nome,
    );
  };

  const salvarClipe = () => {
    if (
      !formularioValido
    ) {
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

    const novoEvento:
      EventoAnalise = {
        id:
          Date.now(),
        tipo:
          novoClipe.acao,
        atleta:
          atleta.nome,
        segundo:
          novoClipe.fim *
          60,
        avaliacao:
          novoClipe.avaliacao as Avaliacao,
        clip: true,
      };

    setEventos(
      (atuais) => [
        ...atuais,
        novoEvento,
      ],
    );

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
    setPainelClipeAberto(
      false,
    );
  };

  const abrirGerenciador =
    () => {
      setFormularioCategoriaAberto(
        false,
      );

      setConfirmarExclusao(
        false,
      );

      setModalCategoriasAberto(
        true,
      );
    };

  const abrirNovaCategoria =
    () => {
      setCategoriaForm({
        id: null,
        nome: '',
        iconId: 'target',
        cor: '#4AA8D8',
        mostrarTimeline: true,
      });

      setConfirmarExclusao(
        false,
      );

      setFormularioCategoriaAberto(
        true,
      );
    };

  const editarCategoria = (
    categoria:
      CategoriaAcao,
  ) => {
    const opcaoIcone =
      opcoesIcones.find(
        (opcao) =>
          opcao.icon ===
          categoria.icon,
      );

    setCategoriaForm({
      id:
        categoria.id,
      nome:
        categoria.nome,
      iconId:
        opcaoIcone?.id ??
        'target',
      cor:
        categoria.cor,
      mostrarTimeline:
        categoria.mostrarTimeline,
    });

    setConfirmarExclusao(
      false,
    );

    setFormularioCategoriaAberto(
      true,
    );
  };

  const voltarListaCategorias =
    () => {
      setFormularioCategoriaAberto(
        false,
      );

      setConfirmarExclusao(
        false,
      );
    };

  const salvarCategoria =
    () => {
      const nome =
        categoriaForm.nome.trim();

      if (!nome) {
        return;
      }

      const opcaoIcone =
        opcoesIcones.find(
          (opcao) =>
            opcao.id ===
            categoriaForm.iconId,
        );

      const Icone =
        opcaoIcone?.icon ??
        Target;

      if (
        categoriaForm.id ===
        null
      ) {
        const novaCategoria:
          CategoriaAcao = {
            id:
              Date.now(),
            nome,
            icon:
              Icone,
            cor:
              categoriaForm.cor,
            mostrarTimeline:
              categoriaForm.mostrarTimeline,
          };

        setCategorias(
          (atuais) => [
            ...atuais,
            novaCategoria,
          ],
        );
      } else {
        setCategorias(
          (atuais) =>
            atuais.map(
              (
                categoria,
              ) =>
                categoria.id ===
                categoriaForm.id
                  ? {
                      ...categoria,
                      nome,
                      icon:
                        Icone,
                      cor:
                        categoriaForm.cor,
                      mostrarTimeline:
                        categoriaForm.mostrarTimeline,
                    }
                  : categoria,
            ),
        );
      }

      voltarListaCategorias();
    };

  const excluirCategoria =
    () => {
      if (
        categoriaForm.id ===
        null
      ) {
        return;
      }

      if (
        !confirmarExclusao
      ) {
        setConfirmarExclusao(
          true,
        );

        return;
      }

      setCategorias(
        (atuais) =>
          atuais.filter(
            (categoria) =>
              categoria.id !==
              categoriaForm.id,
          ),
      );

      setEventos(
        (atuais) =>
          atuais.filter(
            (evento) =>
              evento.tipo !==
              categoriaForm.nome,
          ),
      );

      voltarListaCategorias();
    };

  return (
    <main
      className={
        styles.page
      }
    >
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
              styles.manageCategoriesButton
            }
            onClick={
              abrirGerenciador
            }
          >
            <Pencil
              size={16}
            />
            Gerenciar categorias
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
          >
            <Save
              size={16}
            />
            Salvar análise
          </button>
        </div>
      </div>

      <section
        className={
          styles.analysisGrid
        }
      >
        <div
          className={
            styles.leftColumn
          }
        >
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
                {formatarTempo(
                  tempoAtual,
                )}{' '}
                / 45:00
              </span>
            </div>

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
                    DURACAO_VIDEO
                  }
                  value={
                    tempoAtual
                  }
                  onChange={(
                    event,
                  ) =>
                    setTempoAtual(
                      Number(
                        event
                          .target
                          .value,
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
                    (
                      evento,
                    ) => {
                      const categoria =
                        categorias.find(
                          (
                            item,
                          ) =>
                            item.nome ===
                            evento.tipo,
                        );

                      if (
                        categoria &&
                        !categoria.mostrarTimeline
                      ) {
                        return null;
                      }

                      const posicao =
                        (
                          evento.segundo /
                          DURACAO_VIDEO
                        ) *
                        100;

                      return (
                        <button
                          key={
                            evento.id
                          }
                          type="button"
                          className={`${styles.analysisMarker} ${
                            styles[
                              `marker_${evento.avaliacao}`
                            ]
                          }`}
                          style={{
                            left:
                              `${posicao}%`,
                          }}
                          title={`${evento.tipo} - ${evento.atleta}`}
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
            </div>
          </article>

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
                  Categorias da análise
                </h2>

                <p>
                  Categorias disponíveis para esta análise de Futebol.
                </p>
              </div>

              <button
                type="button"
                className={
                  styles.editCategoriesSmall
                }
                onClick={
                  abrirGerenciador
                }
              >
                <Pencil
                  size={14}
                />
                Editar
              </button>
            </div>

            <div
              className={
                styles.actionTypesGrid
              }
            >
              {categorias.map(
                (
                  categoria,
                ) => {
                  const Icon =
                    categoria.icon;

                  return (
                    <div
                      key={
                        categoria.id
                      }
                      className={
                        styles.categoryPreview
                      }
                    >
                      <span
                        className={
                          styles.actionTypeIcon
                        }
                        style={{
                          color:
                            categoria.cor,
                          backgroundColor:
                            `${categoria.cor}18`,
                        }}
                      >
                        <Icon
                          size={19}
                        />
                      </span>

                      <strong>
                        {
                          categoria.nome
                        }
                      </strong>

                      {categoria.mostrarTimeline && (
                        <span
                          className={
                            styles.timelineStatus
                          }
                        >
                          <CircleDot
                            size={11}
                          />
                        </span>
                      )}
                    </div>
                  );
                },
              )}

              <button
                type="button"
                className={
                  styles.addCategoryCard
                }
                onClick={() => {
                  setModalCategoriasAberto(
                    true,
                  );

                  abrirNovaCategoria();
                }}
              >
                <Plus
                  size={19}
                />
                Adicionar categoria
              </button>
            </div>
          </section>
        </div>

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
                Eventos da análise
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
            {eventos
              .slice()
              .sort(
                (a, b) =>
                  a.segundo -
                  b.segundo,
              )
              .map(
                (
                  evento,
                ) => (
                  <EventCard
                    key={
                      evento.id
                    }
                    evento={
                      evento
                    }
                    onClick={() =>
                      setTempoAtual(
                        evento.segundo,
                      )
                    }
                  />
                ),
              )}
          </div>
        </aside>
      </section>

      {modalCategoriasAberto && (
        <div
          className={
            styles.categoryOverlay
          }
          onMouseDown={() =>
            setModalCategoriasAberto(
              false,
            )
          }
        >
          <div
            className={
              styles.categoryModal
            }
            onMouseDown={(
              event,
            ) =>
              event.stopPropagation()
            }
          >
            <header
              className={
                styles.categoryModalHeader
              }
            >
              <div>
                <span>
                  CONFIGURAÇÃO
                </span>

                <h2>
                  Categorias da análise
                </h2>

                <p>
                  Personalize as ações que podem ser utilizadas durante a análise.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setModalCategoriasAberto(
                    false,
                  )
                }
              >
                <X
                  size={21}
                />
              </button>
            </header>

            <div
              className={
                styles.categoryModalContent
              }
            >
              {!formularioCategoriaAberto ? (
                <>
                  <div
                    className={
                      styles.categoryListToolbar
                    }
                  >
                    <div>
                      <strong>
                        Suas categorias
                      </strong>

                      <span>
                        Clique em editar para alterar uma categoria.
                      </span>
                    </div>

                    <button
                      type="button"
                      className={
                        styles.newCategoryButton
                      }
                      onClick={
                        abrirNovaCategoria
                      }
                    >
                      <Plus
                        size={17}
                      />
                      Nova categoria
                    </button>
                  </div>

                  <div
                    className={
                      styles.categoriesList
                    }
                  >
                    {categorias.map(
                      (
                        categoria,
                      ) => {
                        const Icon =
                          categoria.icon;

                        return (
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
                                color:
                                  categoria.cor,
                                backgroundColor:
                                  `${categoria.cor}18`,
                              }}
                            >
                              <Icon
                                size={19}
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
                                {categoria.mostrarTimeline
                                  ? 'Visível na timeline'
                                  : 'Oculta na timeline'}
                              </span>
                            </div>

                            <button
                              type="button"
                              className={
                                styles.editCategoryButton
                              }
                              onClick={() =>
                                editarCategoria(
                                  categoria,
                                )
                              }
                            >
                              <Pencil
                                size={15}
                              />
                              Editar
                            </button>
                          </div>
                        );
                      },
                    )}
                  </div>
                </>
              ) : (
                <div
                  className={
                    styles.categoryForm
                  }
                >
                  <div
                    className={
                      styles.categoryFormGrid
                    }
                  >
                    <div
                      className={
                        styles.categoryFormLeft
                      }
                    >
                      <div
                        className={
                          styles.categoryField
                        }
                      >
                        <label>
                          Nome da categoria
                        </label>

                        <input
                          type="text"
                          placeholder="Ex.: Passe longo"
                          value={
                            categoriaForm.nome
                          }
                          onChange={(
                            event,
                          ) =>
                            setCategoriaForm(
                              (
                                atual,
                              ) => ({
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

                      <div
                        className={
                          styles.categoryField
                        }
                      >
                        <label>
                          Cor da categoria
                        </label>

                        <div
                          className={
                            styles.categoryColorArea
                          }
                        >
                          {[
                            '#4AA8D8',
                            '#16A875',
                            '#E58A2C',
                            '#D15A8B',
                            '#7862E8',
                            '#D94B4B',
                          ].map(
                            (
                              cor,
                            ) => (
                              <button
                                key={
                                  cor
                                }
                                type="button"
                                className={`${styles.categoryColorButton} ${
                                  categoriaForm.cor ===
                                  cor
                                    ? styles.categoryColorButtonActive
                                    : ''
                                }`}
                                style={{
                                  backgroundColor:
                                    cor,
                                }}
                                onClick={() =>
                                  setCategoriaForm(
                                    (
                                      atual,
                                    ) => ({
                                      ...atual,
                                      cor,
                                    }),
                                  )
                                }
                              >
                                {categoriaForm.cor ===
                                  cor && (
                                  <Check
                                    size={14}
                                  />
                                )}
                              </button>
                            ),
                          )}

                          <label
                            className={
                              styles.paletteColorButton
                            }
                          >
                            <div
                              className={
                                styles.paletteOuter
                              }
                            >
                              <div
                                className={
                                  styles.paletteInner
                                }
                              >
                                <Palette
                                  size={15}
                                />
                              </div>
                            </div>

                            <input
                              type="color"
                              value={
                                categoriaForm.cor
                              }
                              onChange={(
                                event,
                              ) =>
                                setCategoriaForm(
                                  (
                                    atual,
                                  ) => ({
                                    ...atual,
                                    cor:
                                      event
                                        .target
                                        .value,
                                  }),
                                )
                              }
                            />
                          </label>
                        </div>
                      </div>

                      <div
                        className={
                          styles.timelineOption
                        }
                      >
                        <div>
                          <strong>
                            Mostrar na timeline
                          </strong>

                          <span>
                            Mostra uma marcação no vídeo quando essa categoria aparecer.
                          </span>
                        </div>

                        <button
                          type="button"
                          className={`${styles.toggleButton} ${
                            categoriaForm.mostrarTimeline
                              ? styles.toggleButtonActive
                              : ''
                          }`}
                          onClick={() =>
                            setCategoriaForm(
                              (
                                atual,
                              ) => ({
                                ...atual,
                                mostrarTimeline:
                                  !atual.mostrarTimeline,
                              }),
                            )
                          }
                        >
                          <span />
                        </button>
                      </div>

                      <div
                        className={
                          styles.categoryPreviewForm
                        }
                      >
                        {(() => {
                          const opcao =
                            opcoesIcones.find(
                              (
                                item,
                              ) =>
                                item.id ===
                                categoriaForm.iconId,
                            );

                          const Icon =
                            opcao?.icon ??
                            Target;

                          return (
                            <>
                              <div
                                className={
                                  styles.categoryPreviewFormIcon
                                }
                                style={{
                                  color:
                                    categoriaForm.cor,
                                  backgroundColor:
                                    `${categoriaForm.cor}18`,
                                }}
                              >
                                <Icon
                                  size={21}
                                />
                              </div>

                              <div>
                                <span>
                                  PRÉVIA
                                </span>

                                <strong>
                                  {categoriaForm.nome.trim() ||
                                    'Nova categoria'}
                                </strong>
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    </div>

                    <div
                      className={
                        styles.categoryIconsSide
                      }
                    >
                      <span
                        className={
                          styles.iconsLabel
                        }
                      >
                        Escolha um ícone
                      </span>

                      <div
                        className={
                          styles.categoryIconsGrid
                        }
                      >
                        {opcoesIcones.map(
                          (
                            opcao,
                          ) => {
                            const Icon =
                              opcao.icon;

                            const ativo =
                              categoriaForm.iconId ===
                              opcao.id;

                            return (
                              <button
                                key={
                                  opcao.id
                                }
                                type="button"
                                className={`${styles.categoryIconOption} ${
                                  ativo
                                    ? styles.categoryIconOptionActive
                                    : ''
                                }`}
                                onClick={() =>
                                  setCategoriaForm(
                                    (
                                      atual,
                                    ) => ({
                                      ...atual,
                                      iconId:
                                        opcao.id,
                                    }),
                                  )
                                }
                              >
                                {ativo && (
                                  <span
                                    className={
                                      styles.categoryIconCheck
                                    }
                                  >
                                    <Check
                                      size={11}
                                      strokeWidth={
                                        3
                                      }
                                    />
                                  </span>
                                )}

                                <Icon
                                  size={20}
                                />

                                <span>
                                  {
                                    opcao.nome
                                  }
                                </span>
                              </button>
                            );
                          },
                        )}
                      </div>
                    </div>
                  </div>

                  <div
                    className={
                      styles.categoryFormFooter
                    }
                  >
                    <div
                      className={
                        styles.deleteArea
                      }
                    >
                      {categoriaForm.id !==
                        null && (
                        <>
                          <button
                            type="button"
                            className={`${styles.deleteCategoryButton} ${
                              confirmarExclusao
                                ? styles.deleteCategoryConfirm
                                : ''
                            }`}
                            onClick={
                              excluirCategoria
                            }
                          >
                            <Trash2
                              size={16}
                            />

                            {confirmarExclusao
                              ? 'Confirmar exclusão'
                              : 'Excluir categoria'}
                          </button>

                          {confirmarExclusao && (
                            <span
                              className={
                                styles.deleteWarning
                              }
                            >
                              Isso também remove os eventos dessa categoria.
                            </span>
                          )}
                        </>
                      )}
                    </div>

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
                        onClick={
                          voltarListaCategorias
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
                          !categoriaForm.nome.trim()
                        }
                        onClick={
                          salvarCategoria
                        }
                      >
                        <Check
                          size={16}
                        />
                        Salvar categoria
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

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
            <X
              size={19}
            />
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
              onChange={(
                event,
              ) =>
                setNovoClipe(
                  (
                    atual,
                  ) => ({
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
                (
                  atleta,
                ) => (
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
                  </button>
                ),
              )}
            </div>
          </div>

          <div
            className={
              styles.formGroup
            }
          >
            <label>
              Categoria
            </label>

            <select
              value={
                novoClipe.acao
              }
              onChange={(
                event,
              ) =>
                setNovoClipe(
                  (
                    atual,
                  ) => ({
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
                Selecionar categoria
              </option>

              {categorias.map(
                (
                  categoria,
                ) => (
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
              styles.formGroup
            }
          >
            <label>
              Avaliação
            </label>

            <div
              className={
                styles.ratingGrid
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
                (
                  avaliacao,
                ) => (
                  <RatingButton
                    key={
                      avaliacao
                    }
                    label={
                      avaliacao
                    }
                    type={
                      avaliacao
                    }
                    active={
                      novoClipe.avaliacao ===
                      avaliacao
                    }
                    onClick={() =>
                      setNovoClipe(
                        (
                          atual,
                        ) => ({
                          ...atual,
                          avaliacao,
                        }),
                      )
                    }
                  />
                ),
              )}
            </div>
          </div>

          <div
            className={
              styles.formGroup
            }
          >
            <label>
              Observação
            </label>

            <textarea
              value={
                novoClipe.observacao
              }
              onChange={(
                event,
              ) =>
                setNovoClipe(
                  (
                    atual,
                  ) => ({
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
                Início: {
                  novoClipe.inicio
                } min
              </span>

              <span>
                Fim: {
                  novoClipe.fim
                } min
              </span>

              <span>
                Duração: {
                  duracao
                } min
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

interface EventCardProps {
  evento:
    EventoAnalise;
  onClick:
    () => void;
}

const EventCard = ({
  evento,
  onClick,
}: EventCardProps) => (
  <button
    type="button"
    className={
      styles.eventItem
    }
    onClick={
      onClick
    }
  >
    <div
      className={`${styles.eventIcon} ${
        evento.avaliacao ===
        'boa'
          ? styles.eventIconGood
          : evento.avaliacao ===
              'ruim'
            ? styles.eventIconBad
            : evento.avaliacao ===
                'destaque'
              ? styles.eventIconHighlight
              : styles.eventIconNeutral
      }`}
    >
      <CircleDot
        size={17}
      />
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
        {formatarTempo(
          evento.segundo,
        )}
      </span>
    </div>
  </button>
);

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
}: RatingButtonProps) => (
  <button
    type="button"
    className={`${styles.ratingButton} ${
      active
        ? styles.ratingButtonActive
        : ''
    }`}
    onClick={
      onClick
    }
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

interface TimelineLegendProps {
  label: string;
  className: string;
}

const TimelineLegend = ({
  label,
  className,
}: TimelineLegendProps) => (
  <div
    className={
      styles.timelineLegendItem
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

export default AnaliseVideos;