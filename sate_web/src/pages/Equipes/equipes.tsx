import { useEffect, useState } from 'react';

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


// ======================================================
// TIPOS
// ======================================================

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


// ======================================================
// FILTROS
// ======================================================

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


// ======================================================
// ÍCONES POR MODALIDADE
// ======================================================

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


// ======================================================
// IMAGEM POR MODALIDADE
// ======================================================

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


// ======================================================
// ÍCONE POR MODALIDADE
// ======================================================

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


// ======================================================
// CRIAR SIGLA
// ======================================================

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


// ======================================================
// FORMATAR PRÓXIMA PARTIDA
// ======================================================

const formatarProximaPartida = (
  data: string,
) => {
  const dataPartida =
    new Date(data);

  if (
    Number.isNaN(
      dataPartida.getTime(),
    )
  ) {
    return 'Data não informada';
  }

  return dataPartida.toLocaleString(
    'pt-BR',
    {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    },
  );
};


// ======================================================
// COMPONENTE
// ======================================================

const Equipes = () => {

  // ====================================================
  // ESTADOS
  // ====================================================

  const [
    filtroAtivo,
    setFiltroAtivo,
  ] = useState<Modalidade>(
    'Todos',
  );

  const [
    equipes,
    setEquipes,
  ] = useState<Equipe[]>([]);

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

  const [
    carregando,
    setCarregando,
  ] = useState(true);


  // ====================================================
  // CARREGAR EQUIPES
  // ====================================================

  useEffect(() => {
    carregarEquipes();
  }, []);


  // ====================================================
  // GET /api/equipes
  // ====================================================

  const carregarEquipes = async () => {
    try {
      setCarregando(true);

      const token =
        localStorage.getItem(
          'token',
        );

      const resposta =
        await fetch(
          'http://localhost:3000/api/equipes',
          {
            method: 'GET',

            headers: {
              'Content-Type':
                'application/json',

              Authorization:
                `Bearer ${token}`,
            },
          },
        );

      const dados =
        await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          dados.mensagem ||
            'Erro ao carregar equipes.',
        );
      }

      const equipesFormatadas: Equipe[] =
        dados.map(
          (equipe: any) => ({
            id: equipe.id,

            nome: equipe.nome,

            modalidade:
              equipe.modalidade,

            categoria:
              equipe.categoria ||
              'Não informada',

            atletas:
              equipe.numeroAtletas ??
              0,

            imagem:
              equipe.imagem ||
              imagemPorModalidade(
                equipe.modalidade,
              ),

            icone:
              iconePorModalidade(
                equipe.modalidade,
              ),

            cor:
              equipe.corEquipe ||
              '#16A875',

            vitorias: 0,

            empates: 0,

            derrotas: 0,

            proximaPartida:
              equipe.proximaPartida
                ? formatarProximaPartida(
                    equipe.proximaPartida,
                  )
                : 'Nenhuma partida agendada',

            sigla:
              criarSigla(
                equipe.nome,
              ),

            desempenho: 0,

            videos: 0,

            elenco:
              equipe.atletas?.map(
                (atleta: any) => ({
                  id: atleta.id,

                  nome:
                    atleta.nome ||
                    'Atleta',

                  posicao:
                    atleta.categoria ||
                    'Não informada',

                  idade: 0,

                  desempenho: 0,
                }),
              ) || [],

            evolucao: [
              0,
              0,
              0,
              0,
              0,
              0,
              0,
            ],
          }),
        );

      setEquipes(
        equipesFormatadas,
      );

    } catch (error) {

      console.error(
        'Erro ao carregar equipes:',
        error,
      );

      alert(
        error instanceof Error
          ? error.message
          : 'Erro ao carregar equipes.',
      );

    } finally {

      setCarregando(false);

    }
  };


  // ====================================================
  // CRIAR EQUIPE
  // POST /api/equipes
  // ====================================================

  const adicionarEquipe =
    async (
      dados: NovaEquipeData,
    ) => {

      try {

        const token =
          localStorage.getItem(
            'token',
          );

        const resposta =
          await fetch(
            'http://localhost:3000/api/equipes',
            {
              method: 'POST',

              headers: {
                'Content-Type':
                  'application/json',

                Authorization:
                  `Bearer ${token}`,
              },

              body: JSON.stringify({
                nome:
                  dados.nome,

                modalidade:
                  dados.modalidade,

                categoria:
                  dados.categoria,

                proximaPartida:
                  dados.proximaPartida ||
                  null,

                imagem:
                  dados.imagemPreview ||
                  null,

                corEquipe:
                  dados.cor,
              }),
            },
          );

        const resultado =
          await resposta.json();

        if (!resposta.ok) {
          throw new Error(
            resultado.mensagem ||
              'Erro ao criar equipe.',
          );
        }

        const equipeCriada =
          resultado.equipe;

        const novaEquipe: Equipe = {
          id:
            equipeCriada.id,

          nome:
            equipeCriada.nome,

          modalidade:
            equipeCriada.modalidade,

          categoria:
            equipeCriada.categoria ||
            'Não informada',

          atletas:
            equipeCriada.numeroAtletas ??
            0,

          imagem:
            equipeCriada.imagem ||
            imagemPorModalidade(
              equipeCriada.modalidade,
            ),

          icone:
            iconePorModalidade(
              equipeCriada.modalidade,
            ),

          cor:
            equipeCriada.corEquipe ||
            '#16A875',

          vitorias: 0,

          empates: 0,

          derrotas: 0,

          proximaPartida:
            equipeCriada.proximaPartida
              ? formatarProximaPartida(
                  equipeCriada.proximaPartida,
                )
              : 'Nenhuma partida agendada',

          sigla:
            criarSigla(
              equipeCriada.nome,
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

        setModalNovaEquipe(
          false,
        );

      } catch (error) {

        console.error(
          'Erro ao criar equipe:',
          error,
        );

        alert(
          error instanceof Error
            ? error.message
            : 'Erro ao criar equipe.',
        );

      }
    };


  // ====================================================
  // EDITAR EQUIPE
  // PUT /api/equipes/:id
  // ====================================================

  const salvarEdicao =
    async (
      dados: EditarEquipeData,
    ) => {

      try {

        const token =
          localStorage.getItem(
            'token',
          );

        const resposta =
          await fetch(
            `http://localhost:3000/api/equipes/${dados.id}`,
            {
              method: 'PUT',

              headers: {
                'Content-Type':
                  'application/json',

                Authorization:
                  `Bearer ${token}`,
              },

              body: JSON.stringify({
                nome:
                  dados.nome,

                modalidade:
                  dados.modalidade,

                categoria:
                  dados.categoria,

                proximaPartida:
                  dados.proximaPartida ||
                  null,

                imagem:
                  dados.imagem ||
                  null,

                corEquipe:
                  dados.cor,
              }),
            },
          );

        const resultado =
          await resposta.json();

        if (!resposta.ok) {
          throw new Error(
            resultado.mensagem ||
              'Erro ao atualizar equipe.',
          );
        }

        const equipeAtualizada =
          resultado.equipe;

        setEquipes(
          (atuais) =>
            atuais.map(
              (equipe) => {

                if (
                  equipe.id !==
                  equipeAtualizada.id
                ) {
                  return equipe;
                }

                return {
                  ...equipe,

                  nome:
                    equipeAtualizada.nome,

                  modalidade:
                    equipeAtualizada.modalidade,

                  categoria:
                    equipeAtualizada.categoria ||
                    'Não informada',

                  atletas:
                    equipeAtualizada.numeroAtletas ??
                    equipe.atletas,

                  imagem:
                    equipeAtualizada.imagem ||
                    imagemPorModalidade(
                      equipeAtualizada.modalidade,
                    ),

                  cor:
                    equipeAtualizada.corEquipe ||
                    '#16A875',

                  proximaPartida:
                    equipeAtualizada.proximaPartida
                      ? formatarProximaPartida(
                          equipeAtualizada.proximaPartida,
                        )
                      : 'Nenhuma partida agendada',

                  sigla:
                    criarSigla(
                      equipeAtualizada.nome,
                    ),

                  icone:
                    iconePorModalidade(
                      equipeAtualizada.modalidade,
                    ),
                };
              },
            ),
        );

        setEquipeEmEdicao(
          null,
        );

      } catch (error) {

        console.error(
          'Erro ao atualizar equipe:',
          error,
        );

        alert(
          error instanceof Error
            ? error.message
            : 'Erro ao atualizar equipe.',
        );

      }
    };


  // ====================================================
  // FILTRO
  // ====================================================

  const equipesFiltradas =
    filtroAtivo === 'Todos'
      ? equipes
      : equipes.filter(
          (equipe) =>
            equipe.modalidade ===
            filtroAtivo,
        );


  // ====================================================
  // CLICAR NA EQUIPE
  // ====================================================

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


  // ====================================================
  // CALCULAR TENDÊNCIA
  // ====================================================

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


  // ====================================================
  // DETALHES
  // ====================================================

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


  // ====================================================
  // TELA
  // ====================================================

  return (
    <>
      <main
        className={
          styles.page
        }
      >

        {/* ==========================================
            CABEÇALHO
        ========================================== */}

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


        {/* ==========================================
            AVISO DE EDIÇÃO
        ========================================== */}

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


        {/* ==========================================
            FILTROS
        ========================================== */}

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


        {/* ==========================================
            CARREGANDO
        ========================================== */}

        {carregando && (
          <div
            style={{
              padding:
                '40px 0',
              textAlign:
                'center',
            }}
          >
            Carregando equipes...
          </div>
        )}


        {/* ==========================================
            GRID
        ========================================== */}

        {!carregando && (
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

                    {/* ==================================
                        IMAGEM
                    ================================== */}

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


                    {/* ==================================
                        CONTEÚDO
                    ================================== */}

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
                        {
                          equipe.nome
                        }
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


                      {/* ==================================
                          ESTATÍSTICAS
                      ================================== */}

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


                    {/* ==================================
                        PRÓXIMA PARTIDA
                    ================================== */}

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
        )}


        {/* ==========================================
            NENHUMA EQUIPE
        ========================================== */}

        {!carregando &&
          equipesFiltradas.length ===
            0 && (
            <div
              style={{
                padding:
                  '50px 20px',
                textAlign:
                  'center',
              }}
            >
              <h3>
                Nenhuma equipe encontrada.
              </h3>

              <p>
                Cadastre uma nova equipe
                para começar.
              </p>
            </div>
          )}

      </main>


      {/* ==========================================
          MODAL NOVA EQUIPE
      ========================================== */}

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


      {/* ==========================================
          MODAL EDITAR EQUIPE
      ========================================== */}

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