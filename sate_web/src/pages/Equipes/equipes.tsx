import {
  useState,
} from 'react';

import styles from './equipes.module.css';

import CardEquipe from '../../components/CardEquipe/cardEquipe';

import NovaEquipeModal from '../../components/NovaEquipeModal/novaEquipeModal';

import type {
  NovaEquipeData,
} from '../../components/NovaEquipeModal/novaEquipeModal';

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
      60,
      70,
      63,
      76,
      73,
      77,
      85,
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
      62,
      65,
      71,
      69,
      78,
      82,
      88,
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
  const palavras =
    nome
      .trim()
      .split(' ')
      .filter(Boolean);

  if (
    palavras.length === 1
  ) {
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

      modalidade:
        dados.modalidade,

      categoria:
        dados.categoria,

      atletas:
        dados.atletas,

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
        {/* CABEÇALHO */}

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
              Gerencie seus
              times, acompanhe
              métricas de
              performance e
              organize seu
              portfólio de
              atletas em um só
              lugar.
            </p>
          </div>

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
            <span
              className={
                styles.plus
              }
            >
              +
            </span>

            Nova Equipe
          </button>
        </div>

        {/* FILTROS */}

        <div
          className={
            styles.filters
          }
        >
          {[
            [
              'Todos',
              '⚽',
            ],
            [
              'Futebol',
              '⚽',
            ],
            [
              'Basquete',
              '🏀',
            ],
            [
              'Vôlei',
              '🏐',
            ],
            [
              'Rugby',
              '🏉',
            ],
            [
              'Tênis',
              '🎾',
            ],
          ].map(
            ([
              nome,
              icone,
            ]) => (
              <button
                key={nome}
                type="button"
                className={`${styles.filterButton} ${
                  filtroAtivo ===
                  nome
                    ? styles.active
                    : ''
                }`}
                onClick={() =>
                  setFiltroAtivo(
                    nome as Modalidade,
                  )
                }
              >
                <span
                  className={
                    styles.filterIcon
                  }
                >
                  {icone}
                </span>

                {nome}
              </button>
            ),
          )}
        </div>

        {/* EQUIPES */}

        <div
          className={
            styles.teamsGrid
          }
        >
          {equipesFiltradas.map(
            (equipe) => (
              <div
                key={
                  equipe.id
                }
                className={
                  styles.teamClickable
                }
                role="button"
                tabIndex={0}
                onClick={() =>
                  setEquipeSelecionada(
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
                    setEquipeSelecionada(
                      equipe,
                    );
                  }
                }}
              >
                <CardEquipe
                  nome={
                    equipe.nome
                  }
                  modalidade={
                    equipe.modalidade
                  }
                  categoria={
                    equipe.categoria
                  }
                  atletas={
                    equipe.atletas
                  }
                  imagem={
                    equipe.imagem
                  }
                  icone={
                    equipe.icone
                  }
                  cor={
                    equipe.cor
                  }
                  vitorias={
                    equipe.vitorias
                  }
                  empates={
                    equipe.empates
                  }
                  derrotas={
                    equipe.derrotas
                  }
                  proximaPartida={
                    equipe.proximaPartida
                  }
                />
              </div>
            ),
          )}
        </div>
      </main>

      <NovaEquipeModal
        open={
          modalNovaEquipe
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
    </>
  );
};

export default Equipes;