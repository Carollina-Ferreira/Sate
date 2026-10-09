import {
  useEffect,
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


interface EquipeBackend {
  id: number;

  nome: string;

  modalidade: string;

  categoria?: string | null;

  proximaPartida?: string | null;

  imagem?: string | null;

  corEquipe?: string | null;

  treinadorId?: number;

  atletas?: unknown[];

  _count?: {
    atletas?: number;
  };
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


const API_URL =
  'http://localhost:3000/api';


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
    palavras.length === 0
  ) {
    return 'EQ';
  }


  if (
    palavras.length === 1
  ) {
    return palavras[0]
      .slice(0, 2)
      .toUpperCase();
  }


  return `${palavras[0][0]}${palavras[
    palavras.length - 1
  ][0]}`.toUpperCase();
};


function converterEquipe(
  equipe: EquipeBackend,
): Equipe {

  let quantidadeAtletas = 0;


  if (
    typeof equipe._count
      ?.atletas === 'number'
  ) {
    quantidadeAtletas =
      equipe._count.atletas;

  } else if (
    Array.isArray(
      equipe.atletas,
    )
  ) {
    quantidadeAtletas =
      equipe.atletas.length;
  }


  return {
    id:
      equipe.id,

    nome:
      equipe.nome,

    modalidade:
      equipe.modalidade,

    categoria:
      equipe.categoria ||
      'Sem categoria',

    atletas:
      quantidadeAtletas,

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

    vitorias:
      0,

    empates:
      0,

    derrotas:
      0,

    proximaPartida:
      equipe.proximaPartida
        ? new Date(
            equipe.proximaPartida,
          ).toLocaleString(
            'pt-BR',
            {
              day: '2-digit',
              month: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
            },
          )
        : 'Nenhuma partida agendada',

    sigla:
      criarSigla(
        equipe.nome,
      ),

    desempenho:
      0,

    videos:
      0,

    elenco:
      [],

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
}


function pegarMensagemErro(
  dados: unknown,
  padrao: string,
) {
  if (
    typeof dados ===
      'object' &&
    dados !== null
  ) {
    const objeto =
      dados as Record<
        string,
        unknown
      >;


    if (
      typeof objeto.erro ===
      'string'
    ) {
      return objeto.erro;
    }


    if (
      typeof objeto.mensagem ===
      'string'
    ) {
      return objeto.mensagem;
    }
  }


  return padrao;
}


function extrairEquipes(
  dados: unknown,
): EquipeBackend[] {

  if (
    Array.isArray(dados)
  ) {
    return dados as EquipeBackend[];
  }


  if (
    typeof dados ===
      'object' &&
    dados !== null
  ) {
    const objeto =
      dados as Record<
        string,
        unknown
      >;


    if (
      Array.isArray(
        objeto.equipes,
      )
    ) {
      return objeto.equipes as EquipeBackend[];
    }


    if (
      Array.isArray(
        objeto.data,
      )
    ) {
      return objeto.data as EquipeBackend[];
    }
  }


  return [];
}


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
  ] = useState<Equipe[]>([]);


  const [
    carregando,
    setCarregando,
  ] = useState(true);


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


  /* ============================================================
     CARREGAR EQUIPES DO BANCO
  ============================================================ */

  useEffect(() => {

    async function carregarEquipes() {

      try {

        setCarregando(true);


        const token =
          localStorage.getItem(
            'token',
          );


        if (!token) {

          console.error(
            'Token não encontrado.',
          );

          setEquipes([]);

          return;
        }


        const resposta =
          await fetch(
            `${API_URL}/equipes`,
            {
              method: 'GET',

              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            },
          );


        const dados: unknown =
          await resposta
            .json()
            .catch(() => []);


        console.log(
          'EQUIPES VINDAS DO BANCO:',
          dados,
        );


        if (!resposta.ok) {

          throw new Error(
            pegarMensagemErro(
              dados,
              'Erro ao carregar equipes.',
            ),
          );

        }


        const equipesBanco =
          extrairEquipes(
            dados,
          );


        const equipesFormatadas =
          equipesBanco.map(
            converterEquipe,
          );


        setEquipes(
          equipesFormatadas,
        );

      } catch (error) {

        console.error(
          'Erro ao carregar equipes:',
          error,
        );


        setEquipes([]);

      } finally {

        setCarregando(false);

      }

    }


    carregarEquipes();

  }, []);


  /* ============================================================
     FILTRO
  ============================================================ */

  const equipesFiltradas =
    filtroAtivo === 'Todos'
      ? equipes
      : equipes.filter(
          (equipe) =>
            equipe.modalidade ===
            filtroAtivo,
        );


  /* ============================================================
     CRIAR EQUIPE NO BANCO
  ============================================================ */

  const adicionarEquipe =
    async (
      dados:
        NovaEquipeData,
    ) => {

      try {

        const token =
          localStorage.getItem(
            'token',
          );


        if (!token) {

          alert(
            'Sessão não encontrada. Faça login novamente.',
          );

          return;

        }


        const resposta =
          await fetch(
            `${API_URL}/equipes`,
            {
              method: 'POST',

              headers: {
                'Content-Type':
                  'application/json',

                Authorization:
                  `Bearer ${token}`,
              },

              body:
                JSON.stringify({
                  nome:
                    dados.nome.trim(),

                  modalidade:
                    dados.modalidade,

                  categoria:
                    dados.categoria ||
                    null,

                  /*
                    Não enviamos imagem em base64
                    para evitar PayloadTooLarge.
                  */
                  imagem:
                    null,

                  corEquipe:
                    dados.cor ||
                    '#16A875',

                  proximaPartida:
                    null,
                }),
            },
          );


        const respostaDados:
          unknown =
          await resposta
            .json()
            .catch(() => ({}));


        console.log(
          'RESPOSTA CRIAR EQUIPE:',
          respostaDados,
        );


        if (!resposta.ok) {

          throw new Error(
            pegarMensagemErro(
              respostaDados,
              'Erro ao criar equipe.',
            ),
          );

        }


        let equipeCriada:
          EquipeBackend | null =
          null;


        if (
          typeof respostaDados ===
            'object' &&
          respostaDados !== null
        ) {

          const objeto =
            respostaDados as Record<
              string,
              unknown
            >;


          if (
            objeto.equipe &&
            typeof objeto.equipe ===
              'object'
          ) {

            equipeCriada =
              objeto.equipe as EquipeBackend;

          } else if (
            'id' in objeto
          ) {

            equipeCriada =
              respostaDados as EquipeBackend;

          }

        }


        if (!equipeCriada) {

          throw new Error(
            'A equipe foi criada, mas o servidor não retornou os dados da equipe.',
          );

        }


        const equipeFormatada =
          converterEquipe(
            equipeCriada,
          );


        /*
          Como não mandamos a imagem para o backend,
          podemos continuar mostrando o preview
          escolhido enquanto estiver nesta tela.
        */
        if (
          dados.imagemPreview
        ) {

          equipeFormatada.imagem =
            dados.imagemPreview;

        }


        setEquipes(
          (atuais) => [
            ...atuais,
            equipeFormatada,
          ],
        );


        setFiltroAtivo(
          'Todos',
        );


        setModalNovaEquipe(
          false,
        );


        alert(
          'Equipe criada com sucesso!',
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


  /* ============================================================
     DETALHES
  ============================================================ */

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

        {/* ======================================================
            CABEÇALHO
        ====================================================== */}

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


        {/* ======================================================
            FILTROS
        ====================================================== */}

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
                key={
                  nome
                }
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


        {/* ======================================================
            CARREGANDO
        ====================================================== */}

        {carregando && (
          <p>
            Carregando equipes...
          </p>
        )}


        {/* ======================================================
            EQUIPES
        ====================================================== */}

        {!carregando && (
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
        )}

      </main>


      {/* ========================================================
          MODAL NOVA EQUIPE
      ======================================================== */}

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

    </>
  );
};


export default Equipes;