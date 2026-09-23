import { useState } from 'react';

import {
  CalendarDays,
  Minus,
  Pencil,
  Plus,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';

import type { IconType } from 'react-icons';

import {
  FaBasketballBall,
  FaFootballBall,
  FaFutbol,
  FaTableTennis,
  FaVolleyballBall,
} from 'react-icons/fa';

import { MdSports } from 'react-icons/md';

import styles from './equipes.module.css';

import NovaEquipeModal from '../../components/NovaEquipeModal/novaEquipeModal';

import type {
  NovaEquipeData,
} from '../../components/NovaEquipeModal/novaEquipeModal';

import EditarEquipeModal from '../../components/EditarEquipeModal/editarEquipeModal';

import type {
  EditarEquipeData,
} from '../../components/EditarEquipeModal/editarEquipeModal';

import DetalhesEquipe from './detalhesEquipe';

import Futebol from '../../assets/img/futebol_img.png';
import Basquete from '../../assets/img/basquete_img.png';
import Volei from '../../assets/img/volei_img.png';
import Rugby from '../../assets/img/rugby_img.png';

type Modalidade =
  | 'Todos'
  | 'Futebol'
  | 'Basquete'
  | 'Vôlei'
  | 'Rugby'
  | 'Tênis';

interface Filtro {
  nome: Modalidade;
  icon: IconType;
}

export interface Equipe {
  id: number;

  nome: string;
  modalidade: string;
  categoria: string;
  atletas: number;

  imagem: string;
  icone: string;
  cor: string;

  vitorias: number;
  empates: number | string;
  derrotas: number;

  proximaPartida: string;

  sigla: string;

  desempenho: number;

  videos: number;

  elenco: {
    id: number;
    nome: string;
    posicao: string;
    idade: number;
    desempenho: number;
  }[];

  evolucao: number[];
}

const filtros: Filtro[] = [
  {
    nome: 'Todos',
    icon: MdSports,
  },
  {
    nome: 'Futebol',
    icon: FaFutbol,
  },
  {
    nome: 'Basquete',
    icon: FaBasketballBall,
  },
  {
    nome: 'Vôlei',
    icon: FaVolleyballBall,
  },
  {
    nome: 'Rugby',
    icon: FaFootballBall,
  },
  {
    nome: 'Tênis',
    icon: FaTableTennis,
  },
];

const iconeReactPorModalidade: Record<
  string,
  IconType
> = {
  Futebol: FaFutbol,
  Basquete: FaBasketballBall,
  Vôlei: FaVolleyballBall,
  Rugby: FaFootballBall,
  Tênis: FaTableTennis,
};

const equipesIniciais: Equipe[] = [
  {
    id: 1,
    nome: 'Falcões FC',
    modalidade: 'Futebol',
    categoria: 'Principal',
    atletas: 24,

    imagem: Futebol,
    icone: 'sports_soccer',
    cor: '#1674B8',

    vitorias: 7,
    empates: 2,
    derrotas: 3,

    proximaPartida:
      'vs Tigres do Vale (Sáb, 16h)',

    sigla: 'FC',
    desempenho: 72,
    videos: 12,

    evolucao: [
      58,
      67,
      62,
      74,
      70,
      78,
      84,
    ],

    elenco: [],
  },

  {
    id: 2,
    nome: 'Águias Basquete',
    modalidade: 'Basquete',
    categoria: 'Principal',
    atletas: 14,

    imagem: Basquete,
    icone: 'sports_basketball',
    cor: '#D9822B',

    vitorias: 6,
    empates: 10,
    derrotas: 8,

    proximaPartida:
      'vs Panteras (Sex, 20h)',

    sigla: 'ÁG',
    desempenho: 55,
    videos: 9,

    evolucao: [
      70,
      72,
      68,
      64,
      61,
      58,
      52,
    ],

    elenco: [],
  },

  {
    id: 3,
    nome: 'Falcões FC',
    modalidade: 'Vôlei',
    categoria: 'Principal',
    atletas: 24,

    imagem: Volei,
    icone: 'sports_volleyball',
    cor: '#B6B51A',

    vitorias: 12,
    empates: '-',
    derrotas: 4,

    proximaPartida:
      'vs Tigres do Vale (Sáb, 16h)',

    sigla: 'FV',
    desempenho: 81,
    videos: 15,

    evolucao: [
      72,
      76,
      78,
      80,
      81,
      82,
      82,
    ],

    elenco: [],
  },

  {
    id: 4,
    nome: 'Poli Rugby',
    modalidade: 'Rugby',
    categoria: 'Principal',
    atletas: 22,

    imagem: Rugby,
    icone: 'sports_rugby',
    cor: '#16A875',

    vitorias: 8,
    empates: 1,
    derrotas: 2,

    proximaPartida:
      'vs Spartans (Dom, 14h)',

    sigla: 'PR',
    desempenho: 76,
    videos: 18,

    evolucao: [
      55,
      61,
      66,
      64,
      72,
      79,
      83,
    ],

    elenco: [],
  },
];

const imagemPorModalidade = (
  modalidade: string,
) => {
  switch (modalidade) {
    case 'Basquete':
      return Basquete;

    case 'Vôlei':
      return Volei;

    case 'Rugby':
      return Rugby;

    default:
      return Futebol;
  }
};

const iconePorModalidade = (
  modalidade: string,
) => {
  switch (modalidade) {
    case 'Basquete':
      return 'sports_basketball';

    case 'Vôlei':
      return 'sports_volleyball';

    case 'Rugby':
      return 'sports_rugby';

    case 'Tênis':
      return 'sports_tennis';

    default:
      return 'sports_soccer';
  }
};

const criarSigla = (
  nome: string,
) => {
  const palavras = nome
    .trim()
    .split(' ')
    .filter(Boolean);

  if (palavras.length === 0) {
    return 'EQ';
  }

  if (palavras.length === 1) {
    return palavras[0]
      .slice(0, 2)
      .toUpperCase();
  }

  return `${palavras[0][0]}${
    palavras[
      palavras.length - 1
    ][0]
  }`.toUpperCase();
};

const Equipes = () => {
  const [
    filtroAtivo,
    setFiltroAtivo,
  ] = useState<Modalidade>(
    'Todos',
  );

  const [
    equipes,
    setEquipes,
  ] = useState<Equipe[]>(
    equipesIniciais,
  );

  const [
    equipeSelecionada,
    setEquipeSelecionada,
  ] = useState<Equipe | null>(
    null,
  );

  const [
    modalNovaEquipe,
    setModalNovaEquipe,
  ] = useState(false);

  const [
    modoEditar,
    setModoEditar,
  ] = useState(false);

  const [
    equipeEmEdicao,
    setEquipeEmEdicao,
  ] = useState<Equipe | null>(
    null,
  );

  const equipesFiltradas =
    filtroAtivo === 'Todos'
      ? equipes
      : equipes.filter(
          (equipe) =>
            equipe.modalidade ===
            filtroAtivo,
        );

  const adicionarEquipe = (
    dados: NovaEquipeData,
  ) => {
    const novaEquipe: Equipe = {
      id: Date.now(),

      nome: dados.nome,
      modalidade: dados.modalidade,
      categoria: dados.categoria,
      atletas: dados.atletas,

      imagem:
        dados.imagemPreview ??
        imagemPorModalidade(
          dados.modalidade,
        ),

      icone:
        iconePorModalidade(
          dados.modalidade,
        ),

      cor: dados.cor,

      vitorias: 0,
      empates: 0,
      derrotas: 0,

      proximaPartida:
        dados.proximaPartida,

      sigla:
        criarSigla(
          dados.nome,
        ),

      desempenho: 0,

      videos: 0,

      elenco: [],

      evolucao: [
        0,
        0,
        0,
        0,
        0,
        0,
        0,
      ],
    };

    setEquipes(
      (atuais) => [
        ...atuais,
        novaEquipe,
      ],
    );

    setFiltroAtivo(
      'Todos',
    );
  };

  const salvarEdicao = (
    dados: EditarEquipeData,
  ) => {
    setEquipes(
      (atuais) =>
        atuais.map(
          (equipe) => {
            if (
              equipe.id !==
              dados.id
            ) {
              return equipe;
            }

            return {
              ...equipe,

              nome:
                dados.nome,

              modalidade:
                dados.modalidade,

              categoria:
                dados.categoria,

              atletas:
                dados.atletas,

              imagem:
                dados.imagem,

              cor:
                dados.cor,

              proximaPartida:
                dados.proximaPartida,

              sigla:
                criarSigla(
                  dados.nome,
                ),

              icone:
                iconePorModalidade(
                  dados.modalidade,
                ),
            };
          },
        ),
    );
  };

  const clicarEquipe = (
    equipe: Equipe,
  ) => {
    if (modoEditar) {
      setEquipeEmEdicao(
        equipe,
      );

      setModoEditar(
        false,
      );

      return;
    }

    setEquipeSelecionada(
      equipe,
    );
  };

  const calcularTendencia = (
    evolucao: number[],
  ) => {
    if (
      evolucao.length < 2
    ) {
      return 'estavel';
    }

    const atual =
      evolucao[
        evolucao.length - 1
      ];

    const anterior =
      evolucao[
        evolucao.length - 2
      ];

    const diferenca =
      atual - anterior;

    if (
      diferenca >= 3
    ) {
      return 'subiu';
    }

    if (
      diferenca <= -3
    ) {
      return 'caiu';
    }

    return 'estavel';
  };

  if (
    equipeSelecionada
  ) {
    return (
      <DetalhesEquipe
        equipe={
          equipeSelecionada
        }
        onBack={() =>
          setEquipeSelecionada(
            null,
          )
        }
      />
    );
  }

  return (
    <>
      <main
        className={
          styles.page
        }
      >
        <div
          className={
            styles.header
          }
        >
          <div
            className={
              styles.headerText
            }
          >
            <h1
              className={
                styles.title
              }
            >
              Minhas Equipes
            </h1>

            <p
              className={
                styles.description
              }
            >
              Gerencie seus times,
              acompanhe métricas de
              performance e organize
              seu portfólio de atletas
              em um só lugar.
            </p>
          </div>

          <div
            className={
              styles.headerActions
            }
          >
            <button
              type="button"
              className={`${styles.editTeamButton} ${
                modoEditar
                  ? styles.editTeamButtonActive
                  : ''
              }`}
              onClick={() =>
                setModoEditar(
                  (atual) =>
                    !atual,
                )
              }
            >
              <Pencil
                size={17}
              />

              {modoEditar
                ? 'Cancelar edição'
                : 'Editar equipe'}
            </button>

            <button
              type="button"
              className={
                styles.newTeamButton
              }
              onClick={() =>
                setModalNovaEquipe(
                  true,
                )
              }
            >
              <Plus
                size={19}
              />

              Nova Equipe
            </button>
          </div>
        </div>

        {modoEditar && (
          <div
            className={
              styles.editNotice
            }
          >
            <Pencil
              size={15}
            />

            Clique na equipe que
            deseja editar.
          </div>
        )}

        <div
          className={
            styles.filters
          }
        >
          {filtros.map(
            (filtro) => {
              const Icon =
                filtro.icon;

              const ativo =
                filtroAtivo ===
                filtro.nome;

              return (
                <button
                  key={
                    filtro.nome
                  }
                  type="button"
                  className={`${styles.filterButton} ${
                    ativo
                      ? styles.active
                      : ''
                  }`}
                  onClick={() =>
                    setFiltroAtivo(
                      filtro.nome,
                    )
                  }
                >
                  <span
                    className={
                      styles.filterIcon
                    }
                  >
                    <Icon
                      size={17}
                    />
                  </span>

                  {filtro.nome}
                </button>
              );
            },
          )}
        </div>

        <div
          className={
            styles.teamsGrid
          }
        >
          {equipesFiltradas.map(
            (equipe) => {
              const IconeEsporte =
                iconeReactPorModalidade[
                  equipe.modalidade
                ] ??
                FaFutbol;

              const tendencia =
                calcularTendencia(
                  equipe.evolucao,
                );

              return (
                <article
                  key={
                    equipe.id
                  }
                  className={`${styles.teamCard} ${
                    modoEditar
                      ? styles.teamEditable
                      : ''
                  }`}
                  role="button"
                  tabIndex={0}
                  onClick={() =>
                    clicarEquipe(
                      equipe,
                    )
                  }
                  onKeyDown={(
                    event,
                  ) => {
                    if (
                      event.key ===
                        'Enter' ||
                      event.key ===
                        ' '
                    ) {
                      clicarEquipe(
                        equipe,
                      );
                    }
                  }}
                >
                  <div
                    className={
                      styles.teamImageArea
                    }
                  >
                    <img
                      src={
                        equipe.imagem
                      }
                      alt={
                        equipe.nome
                      }
                      className={
                        styles.teamImage
                      }
                    />

                    <span
                      className={
                        styles.teamSportBadge
                      }
                      style={{
                        backgroundColor:
                          equipe.cor,
                      }}
                    >
                      <IconeEsporte
                        size={12}
                      />

                      {
                        equipe.modalidade
                      }
                    </span>

                    {tendencia ===
                      'subiu' && (
                      <span
                        className={`${styles.trendIcon} ${styles.trendUp}`}
                        title="Equipe em evolução"
                      >
                        <TrendingUp
                          size={18}
                        />
                      </span>
                    )}

                    {tendencia ===
                      'caiu' && (
                      <span
                        className={`${styles.trendIcon} ${styles.trendDown}`}
                        title="Queda de desempenho"
                      >
                        <TrendingDown
                          size={18}
                        />
                      </span>
                    )}

                    {tendencia ===
                      'estavel' && (
                      <span
                        className={`${styles.trendIcon} ${styles.trendStable}`}
                        title="Desempenho estável"
                      >
                        <Minus
                          size={18}
                        />
                      </span>
                    )}
                  </div>

                  <div
                    className={
                      styles.teamContent
                    }
                  >
                    <div
                      className={
                        styles.teamFloatingIcon
                      }
                      style={{
                        color:
                          equipe.cor,
                      }}
                    >
                      <IconeEsporte
                        size={22}
                      />
                    </div>

                    <h3
                      className={
                        styles.teamName
                      }
                    >
                      {equipe.nome}
                    </h3>

                    <div
                      className={
                        styles.teamMeta
                      }
                    >
                      <span>
                        {
                          equipe.categoria
                        }
                      </span>

                      <span>
                        •
                      </span>

                      <span>
                        {
                          equipe.atletas
                        }{' '}
                        Atletas
                      </span>
                    </div>

                    <div
                      className={
                        styles.teamStats
                      }
                    >
                      <div
                        className={
                          styles.statBox
                        }
                      >
                        <span>
                          VITÓRIAS
                        </span>

                        <strong
                          className={
                            styles.statWin
                          }
                        >
                          {
                            equipe.vitorias
                          }
                        </strong>
                      </div>

                      <div
                        className={
                          styles.statBox
                        }
                      >
                        <span>
                          EMPATES
                        </span>

                        <strong
                          className={
                            styles.statDraw
                          }
                        >
                          {
                            equipe.empates
                          }
                        </strong>
                      </div>

                      <div
                        className={
                          styles.statBox
                        }
                      >
                        <span>
                          DERROTAS
                        </span>

                        <strong
                          className={
                            styles.statLoss
                          }
                        >
                          {
                            equipe.derrotas
                          }
                        </strong>
                      </div>
                    </div>
                  </div>

                  <div
                    className={
                      styles.nextMatch
                    }
                  >
                    <div
                      className={
                        styles.nextMatchIcon
                      }
                    >
                      <CalendarDays
                        size={16}
                      />
                    </div>

                    <div>
                      <span>
                        PRÓXIMA PARTIDA
                      </span>

                      <strong>
                        {
                          equipe.proximaPartida
                        }
                      </strong>
                    </div>
                  </div>
                </article>
              );
            },
          )}
        </div>
      </main>

      <NovaEquipeModal
        open={
          modalNovaEquipe
        }
        modalidadeInicial={
          filtroAtivo
        }
        onClose={() =>
          setModalNovaEquipe(
            false,
          )
        }
        onCreate={
          adicionarEquipe
        }
      />

      <EditarEquipeModal
        open={
          equipeEmEdicao !==
          null
        }
        equipe={
          equipeEmEdicao
        }
        onClose={() =>
          setEquipeEmEdicao(
            null,
          )
        }
        onSave={
          salvarEdicao
        }
      />
    </>
  );
};

export default Equipes;