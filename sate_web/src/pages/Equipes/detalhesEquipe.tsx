import {
  ArrowLeft,
  PlayCircle,
  Trophy,
  Users,
} from 'lucide-react';

import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import styles from './detalhesEquipe.module.css';

import type {
  Equipe,
} from './equipes';

/* =====================================
   API
===================================== */

const API_URL =
  'http://localhost:3000/api';

const BACKEND_URL =
  'http://localhost:3000';

/* =====================================
   TIPOS
===================================== */

interface AtletaBackend {
  id: number;

  nome?: string | null;

  categoria?: string | null;

  dataNascimento?: string | null;

  posicao?: string | null;

  desempenho?: number | null;

  usuario?: {
    email?: string | null;

    avatarUrl?: string | null;
  } | null;
}

interface EquipeDetalhesBackend {
  id: number;

  nome: string;

  modalidade?: string | null;

  categoria?: string | null;

  corEquipe?: string | null;

  imagem?: string | null;

  proximaPartida?: string | null;

  atletas?: AtletaBackend[];

  _count?: {
    atletas?: number;
  };

  vitorias?: number | null;

  empates?: number | null;

  derrotas?: number | null;

  desempenho?: number | null;

  videos?: number | null;

  evolucao?: number[] | null;
}

interface DetalhesEquipeProps {
  equipe: Equipe;

  onBack: () => void;
}

/* =====================================
   TIPO DO ELENCO
===================================== */

interface AtletaElenco {
  id: number;

  nome: string;

  posicao: string;

  idade: number | null;

  desempenho: number;

  avatarUrl: string;
}

/* =====================================
   TOKEN
===================================== */

const obterToken = () => {
  return (
    localStorage.getItem('token') ||
    localStorage.getItem('accessToken') ||
    sessionStorage.getItem('token') ||
    ''
  );
};

/* =====================================
   MONTAR URL DA IMAGEM
===================================== */

const montarUrlImagem = (
  imagem?: string | null,
): string => {
  if (!imagem) {
    return '';
  }

  const valor =
    String(imagem).trim();

  if (!valor) {
    return '';
  }

  /*
   * Base64
   */
  if (
    valor.startsWith('data:image/')
  ) {
    return valor;
  }

  /*
   * URL completa
   */
  if (
    valor.startsWith('http://') ||
    valor.startsWith('https://')
  ) {
    return valor;
  }

  /*
   * Caminho absoluto
   *
   * /uploads/equipes/foto.png
   */
  if (
    valor.startsWith('/')
  ) {
    return `${BACKEND_URL}${valor}`;
  }

  /*
   * Caminho relativo
   *
   * uploads/equipes/foto.png
   */
  return `${BACKEND_URL}/${valor}`;
};

/* =====================================
   CALCULAR IDADE
===================================== */

const calcularIdade = (
  dataNascimento?: string | null,
): number | null => {

  /*
   * Se não tiver data,
   * não informa idade.
   */
  if (
    !dataNascimento ||
    !String(dataNascimento).trim()
  ) {
    return null;
  }

  const texto =
    String(dataNascimento).trim();

  /*
   * Aceita:
   *
   * 2008-05-20
   * 2008-05-20T00:00:00.000Z
   */
  const match =
    texto.match(
      /^(\d{4})-(\d{2})-(\d{2})/,
    );

  let anoNascimento: number;
  let mesNascimento: number;
  let diaNascimento: number;

  if (match) {
    anoNascimento =
      Number(match[1]);

    mesNascimento =
      Number(match[2]);

    diaNascimento =
      Number(match[3]);
  } else {

    const nascimento =
      new Date(texto);

    if (
      Number.isNaN(
        nascimento.getTime(),
      )
    ) {
      return null;
    }

    anoNascimento =
      nascimento.getFullYear();

    mesNascimento =
      nascimento.getMonth() + 1;

    diaNascimento =
      nascimento.getDate();
  }

  const hoje =
    new Date();

  let idade =
    hoje.getFullYear() -
    anoNascimento;

  const mesAtual =
    hoje.getMonth() + 1;

  const diaAtual =
    hoje.getDate();

  /*
   * Ainda não fez aniversário
   * neste ano.
   */
  if (
    mesAtual < mesNascimento ||
    (
      mesAtual ===
        mesNascimento &&
      diaAtual <
        diaNascimento
    )
  ) {
    idade--;
  }

  /*
   * Evita idade inválida.
   */
  if (
    idade < 0 ||
    idade > 120
  ) {
    return null;
  }

  return idade;
};

/* =====================================
   COMPONENTE
===================================== */

const DetalhesEquipe = ({
  equipe,
  onBack,
}: DetalhesEquipeProps) => {

  /* =====================================
     ESTADOS
  ===================================== */

  const [
    equipeBackend,
    setEquipeBackend,
  ] = useState<
    EquipeDetalhesBackend | null
  >(null);

  const [
    carregando,
    setCarregando,
  ] = useState(true);

  const [
    erro,
    setErro,
  ] = useState('');

  /*
   * Começa com a imagem que veio
   * da página anterior.
   */
  const [
    imagemEquipe,
    setImagemEquipe,
  ] = useState(
    montarUrlImagem(
      equipe.imagem,
    ),
  );

  /* =====================================
     BUSCAR EQUIPE
  ===================================== */

  useEffect(() => {

    let ativo = true;

    const carregarEquipe =
      async () => {

        try {

          setCarregando(
            true,
          );

          setErro('');

          /*
           * Primeiro mostra imediatamente
           * a imagem que já veio da tela.
           */
          setImagemEquipe(
            montarUrlImagem(
              equipe.imagem,
            ),
          );

          const token =
            obterToken();

          if (!token) {
            throw new Error(
              'Usuário não autenticado.',
            );
          }

          const resposta =
            await fetch(
              `${API_URL}/equipes/${equipe.id}`,
              {
                method: 'GET',

                headers: {
                  Authorization:
                    `Bearer ${token}`,

                  'Content-Type':
                    'application/json',
                },
              },
            );

          const texto =
            await resposta.text();

          let dados: any =
            null;

          try {

            dados =
              texto
                ? JSON.parse(
                    texto,
                  )
                : null;

          } catch {

            dados = null;
          }

          if (!resposta.ok) {

            throw new Error(
              dados?.message ||
              dados?.erro ||
              'Não foi possível carregar a equipe.',
            );
          }

          /*
           * Pode retornar:
           *
           * { equipe: {...} }
           *
           * ou:
           *
           * {...}
           */
          const equipeRecebida =
            dados?.equipe ||
            dados;

          console.log(
            '==============================',
          );

          console.log(
            'EQUIPE RECEBIDA:',
            equipeRecebida,
          );

          console.log(
            'IMAGEM DA EQUIPE NO BACKEND:',
            equipeRecebida?.imagem,
          );

          console.log(
            'IMAGEM DA EQUIPE NA PÁGINA:',
            equipe.imagem,
          );

          console.log(
            'ATLETAS:',
            equipeRecebida?.atletas,
          );

          console.log(
            '==============================',
          );

          if (
            !equipeRecebida
          ) {

            throw new Error(
              'Equipe não encontrada.',
            );
          }

          if (ativo) {

            setEquipeBackend(
              equipeRecebida,
            );

            /*
             * Prioridade:
             *
             * 1. imagem do backend
             * 2. imagem da equipe já carregada
             */
            const imagem =
              montarUrlImagem(
                equipeRecebida.imagem ||
                equipe.imagem,
              );

            console.log(
              'URL FINAL DA IMAGEM DA EQUIPE:',
              imagem,
            );

            setImagemEquipe(
              imagem,
            );
          }

        } catch (error) {

          console.error(
            'Erro ao carregar detalhes da equipe:',
            error,
          );

          if (ativo) {

            setErro(
              error instanceof Error
                ? error.message
                : 'Erro ao carregar equipe.',
            );

          }

        } finally {

          if (ativo) {

            setCarregando(
              false,
            );

          }

        }
      };

    carregarEquipe();

    return () => {
      ativo = false;
    };

  }, [
    equipe.id,
    equipe.imagem,
  ]);

  /* =====================================
     DADOS DA EQUIPE
  ===================================== */

  const dados =
    useMemo(() => {

      const backend =
        equipeBackend;

      const atletas =
        Array.isArray(
          backend?.atletas,
        )
          ? backend.atletas
          : [];

      /*
       * ELENCO
       */
      const elenco: AtletaElenco[] =
        atletas.map(
          (atleta) => {

            const idade =
              calcularIdade(
                atleta.dataNascimento,
              );

            console.log(
              `IDADE - ${atleta.nome}:`,
              atleta.dataNascimento,
              '=>',
              idade,
            );

            return {
              id:
                atleta.id,

              nome:
                atleta.nome ||
                'Atleta',

              posicao:
                atleta.posicao ||
                atleta.categoria ||
                'Atleta',

              idade,

              desempenho:
                typeof atleta.desempenho ===
                'number'
                  ? atleta.desempenho
                  : 0,

              /*
               * FOTO DO ATLETA
               */
              avatarUrl:
                montarUrlImagem(
                  atleta.usuario
                    ?.avatarUrl,
                ),
            };
          },
        );

      /*
       * QUANTIDADE
       */
      const quantidadeAtletas =
        typeof backend?._count
          ?.atletas === 'number'
          ? backend._count.atletas
          : atletas.length > 0
            ? atletas.length
            : equipe.atletas;

      /*
       * VITÓRIAS
       */
      const vitorias =
        typeof backend?.vitorias ===
        'number'
          ? backend.vitorias
          : equipe.vitorias;

      /*
       * EMPATES
       */
      const empates =
        typeof backend?.empates ===
        'number'
          ? backend.empates
          : typeof equipe.empates ===
            'number'
              ? equipe.empates
              : 0;

      /*
       * DERROTAS
       */
      const derrotas =
        typeof backend?.derrotas ===
        'number'
          ? backend.derrotas
          : equipe.derrotas;

      /*
       * DESEMPENHO
       */
      const desempenho =
        typeof backend?.desempenho ===
        'number'
          ? backend.desempenho
          : equipe.desempenho;

      /*
       * VÍDEOS
       */
      const videos =
        typeof backend?.videos ===
        'number'
          ? backend.videos
          : equipe.videos;

      /*
       * EVOLUÇÃO
       */
      const evolucao =
        Array.isArray(
          backend?.evolucao,
        ) &&
        backend.evolucao.length > 0
          ? backend.evolucao
          : equipe.evolucao;

      /*
       * IMAGEM
       */
      const imagem =
        montarUrlImagem(
          backend?.imagem ||
          equipe.imagem,
        );

      return {
        ...equipe,

        nome:
          backend?.nome ||
          equipe.nome,

        modalidade:
          backend?.modalidade ||
          equipe.modalidade,

        categoria:
          backend?.categoria ||
          equipe.categoria,

        cor:
          backend?.corEquipe ||
          equipe.cor,

        imagem,

        atletas:
          quantidadeAtletas,

        vitorias,

        empates,

        derrotas,

        desempenho,

        videos,

        evolucao,

        elenco,
      };

    }, [
      equipe,
      equipeBackend,
    ]);

  /* =====================================
     RECORDE
  ===================================== */

  const recorde =
    typeof dados.empates ===
    'number'
      ? `${dados.vitorias}V • ${dados.derrotas}D • ${dados.empates}E`
      : `${dados.vitorias}V • ${dados.derrotas}D`;

  /* =====================================
     LOADING
  ===================================== */

  if (carregando) {

    return (
      <main
        className={
          styles.page
        }
      >

        <button
          type="button"
          className={
            styles.backButton
          }
          onClick={
            onBack
          }
        >

          <ArrowLeft
            size={17}
          />

          Voltar para equipes

        </button>

        <section
          className={
            styles.teamHero
          }
        >

          <div>

            <span
              className={
                styles.heroLabel
              }
            >
              EQUIPE
            </span>

            <h1>
              Carregando...
            </h1>

            <div
              className={
                styles.teamMeta
              }
            >
              <span>
                Buscando informações da equipe...
              </span>
            </div>

          </div>

        </section>

      </main>
    );
  }

  /* =====================================
     ERRO
  ===================================== */

  if (
    erro &&
    !equipeBackend
  ) {

    return (
      <main
        className={
          styles.page
        }
      >

        <button
          type="button"
          className={
            styles.backButton
          }
          onClick={
            onBack
          }
        >

          <ArrowLeft
            size={17}
          />

          Voltar para equipes

        </button>

        <section
          className={
            styles.teamHero
          }
        >

          <div>

            <span
              className={
                styles.heroLabel
              }
            >
              ERRO
            </span>

            <h1>
              Não foi possível carregar a equipe
            </h1>

            <div
              className={
                styles.teamMeta
              }
            >
              <span>
                {erro}
              </span>
            </div>

          </div>

        </section>

      </main>
    );
  }

  /* =====================================
     PÁGINA
  ===================================== */

  return (
    <main
      className={
        styles.page
      }
    >

      {/* =================================
          VOLTAR
      ================================= */}

      <button
        type="button"
        className={
          styles.backButton
        }
        onClick={
          onBack
        }
      >

        <ArrowLeft
          size={17}
        />

        Voltar para equipes

      </button>

      {/* =================================
          HERO DA EQUIPE
      ================================= */}

      <section
        className={
          styles.teamHero
        }
      >

        <div
          className={
            styles.teamIdentity
          }
        >

          {/* FOTO DA EQUIPE */}

          <div
            className={
              styles.avatar
            }
            style={{
              background:
                imagemEquipe
                  ? '#F1F6F3'
                  : dados.cor,

              overflow:
                'hidden',

              display:
                'flex',

              alignItems:
                'center',

              justifyContent:
                'center',
            }}
          >

            {imagemEquipe ? (

              <img
                src={
                  imagemEquipe
                }
                alt={
                  `Imagem da equipe ${dados.nome}`
                }
                style={{
                  width:
                    '100%',

                  height:
                    '100%',

                  objectFit:
                    'cover',

                  display:
                    'block',
                }}
                onLoad={() => {

                  console.log(
                    'IMAGEM DA EQUIPE CARREGOU:',
                    imagemEquipe,
                  );

                }}
                onError={() => {

                  console.error(
                    'NÃO FOI POSSÍVEL CARREGAR A IMAGEM:',
                    imagemEquipe,
                  );

                  /*
                   * Não usa a imagem quebrada.
                   */
                  setImagemEquipe('');

                }}
              />

            ) : (

              <span
                style={{
                  color:
                    '#FFFFFF',

                  fontWeight:
                    800,

                  fontSize:
                    '24px',
                }}
              >
                {dados.sigla}
              </span>

            )}

          </div>

          <div>

            <span
              className={
                styles.heroLabel
              }
            >
              EQUIPE
            </span>

            <h1>
              {dados.nome}
            </h1>

            <div
              className={
                styles.teamMeta
              }
            >

              <span>
                {
                  dados.modalidade
                }
              </span>

              <i />

              <span>
                {
                  dados.categoria
                }
              </span>

              <i />

              <span>
                {
                  dados.atletas
                }{' '}
                atletas
              </span>

            </div>

          </div>

        </div>

        <div
          className={
            styles.performance
          }
        >

          <strong>
            {
              dados.desempenho
            }
            %
          </strong>

          <span>
            desempenho geral
          </span>

        </div>

      </section>

      {/* =================================
          RESUMO
      ================================= */}

      <section
        className={
          styles.summaryGrid
        }
      >

        <SummaryCard
          icon={
            <Trophy
              size={18}
            />
          }
          label="Vitórias"
          value={
            String(
              dados.vitorias,
            )
          }
        />

        <SummaryCard
          icon={
            <Users
              size={18}
            />
          }
          label="Atletas"
          value={
            String(
              dados.atletas,
            )
          }
        />

        <SummaryCard
          icon={
            <PlayCircle
              size={18}
            />
          }
          label="Vídeos"
          value={
            String(
              dados.videos,
            )
          }
        />

      </section>

      {/* =================================
          INFORMAÇÕES
      ================================= */}

      <section
        className={
          styles.infoGrid
        }
      >

        {/* DESEMPENHO */}

        <article
          className={
            styles.card
          }
        >

          <div
            className={
              styles.cardHeader
            }
          >

            <div>

              <span>
                ÚLTIMAS PARTIDAS
              </span>

              <h2>
                Desempenho recente
              </h2>

            </div>

            <strong>
              {
                dados.desempenho
              }
              %
            </strong>

          </div>

          <PerformanceChart
            values={
              dados.evolucao
            }
            color={
              dados.cor
            }
          />

        </article>

        {/* ESTATÍSTICAS */}

        <article
          className={
            styles.card
          }
        >

          <div
            className={
              styles.cardHeader
            }
          >

            <div>

              <span>
                RESUMO
              </span>

              <h2>
                Estatísticas gerais
              </h2>

            </div>

          </div>

          <div
            className={
              styles.generalStats
            }
          >

            <StatRow
              label="Recorde"
              value={
                recorde
              }
            />

            <StatRow
              label="Modalidade"
              value={
                dados.modalidade
              }
            />

            <StatRow
              label="Atletas ativos"
              value={
                String(
                  dados.atletas,
                )
              }
            />

            <StatRow
              label="Vídeos relacionados"
              value={
                String(
                  dados.videos,
                )
              }
            />

          </div>

        </article>

      </section>

      {/* =================================
          ELENCO
      ================================= */}

      <section
        className={`${styles.card} ${styles.squadCard}`}
      >

        <div
          className={
            styles.cardHeader
          }
        >

          <div>

            <span>
              JOGADORES
            </span>

            <h2>
              Elenco
            </h2>

          </div>

          <span
            className={
              styles.playerCount
            }
          >
            {
              dados.elenco.length
            }{' '}
            exibidos
          </span>

        </div>

        <div
          className={
            styles.table
          }
        >

          {/* CABEÇALHO */}

          <div
            className={
              styles.tableHeader
            }
          >

            <span>
              ATLETA
            </span>

            <span>
              POSIÇÃO
            </span>

            <span>
              IDADE
            </span>

            <span>
              DESEMPENHO
            </span>

          </div>

          {/* SEM ATLETAS */}

          {dados.elenco.length ===
          0 ? (

            <div
              className={
                styles.tableRow
              }
            >

              <span>
                Nenhum atleta cadastrado nesta equipe.
              </span>

            </div>

          ) : (

            dados.elenco.map(
              (
                atleta,
              ) => (

                <div
                  key={
                    atleta.id
                  }
                  className={
                    styles.tableRow
                  }
                >

                  {/* =========================
                      ATLETA
                  ========================== */}

                  <div
                    className={
                      styles.player
                    }
                  >

                    <div
                      className={
                        styles.playerAvatar
                      }
                      style={{
                        background:
                          atleta.avatarUrl
                            ? '#F1F6F3'
                            : dados.cor,

                        overflow:
                          'hidden',

                        display:
                          'flex',

                        alignItems:
                          'center',

                        justifyContent:
                          'center',

                        flexShrink:
                          0,
                      }}
                    >

                      {atleta.avatarUrl ? (

                        <img
                          src={
                            atleta.avatarUrl
                          }
                          alt={
                            atleta.nome
                          }
                          style={{
                            width:
                              '100%',

                            height:
                              '100%',

                            objectFit:
                              'cover',

                            display:
                              'block',
                          }}
                          onError={(
                            event,
                          ) => {

                            console.error(
                              'Erro ao carregar foto do atleta:',
                              atleta.nome,
                              atleta.avatarUrl,
                            );

                            event.currentTarget.style.display =
                              'none';
                          }}
                        />

                      ) : (

                        <span
                          style={{
                            color:
                              '#FFFFFF',

                            fontWeight:
                              800,

                            fontSize:
                              '14px',
                          }}
                        >
                          {
                            getInitials(
                              atleta.nome,
                            )
                          }
                        </span>

                      )}

                    </div>

                    <strong>
                      {
                        atleta.nome
                      }
                    </strong>

                  </div>

                  {/* =========================
                      POSIÇÃO
                  ========================== */}

                  <span>
                    {
                      atleta.posicao
                    }
                  </span>

                  {/* =========================
                      IDADE
                  ========================== */}

                  <span>

                    {atleta.idade ===
                    null
                      ? 'Não informada'
                      : `${atleta.idade} ${
                          atleta.idade ===
                          1
                            ? 'ano'
                            : 'anos'
                        }`}

                  </span>

                  {/* =========================
                      DESEMPENHO
                  ========================== */}

                  <div
                    className={
                      styles.performanceCell
                    }
                  >

                    <strong>
                      {
                        atleta.desempenho
                      }%
                    </strong>

                    <div
                      className={
                        styles.miniProgress
                      }
                    >

                      <div
                        style={{
                          width:
                            `${Math.min(
                              Math.max(
                                atleta.desempenho,
                                0,
                              ),
                              100,
                            )}%`,

                          background:
                            dados.cor,
                        }}
                      />

                    </div>

                  </div>

                </div>

              ),
            )

          )}

        </div>

      </section>

    </main>
  );
};

/* =====================================
   CARD DE RESUMO
===================================== */

interface SummaryCardProps {
  icon: React.ReactNode;

  label: string;

  value: string;
}

const SummaryCard = ({
  icon,
  label,
  value,
}: SummaryCardProps) => {

  return (
    <article
      className={
        styles.summaryCard
      }
    >

      <div
        className={
          styles.summaryIcon
        }
      >
        {icon}
      </div>

      <div>

        <span>
          {label}
        </span>

        <strong>
          {value}
        </strong>

      </div>

    </article>
  );
};

/* =====================================
   LINHA DE ESTATÍSTICA
===================================== */

interface StatRowProps {
  label: string;

  value: string;
}

const StatRow = ({
  label,
  value,
}: StatRowProps) => {

  return (
    <div
      className={
        styles.statRow
      }
    >

      <span>
        {label}
      </span>

      <strong>
        {value}
      </strong>

    </div>
  );
};

/* =====================================
   GRÁFICO
===================================== */

interface PerformanceChartProps {
  values: number[];

  color: string;
}

const PerformanceChart = ({
  values,
  color,
}: PerformanceChartProps) => {

  const width = 700;

  const height = 270;

  const paddingLeft = 45;

  const paddingRight = 20;

  const paddingTop = 20;

  const paddingBottom = 35;

  const chartWidth =
    width -
    paddingLeft -
    paddingRight;

  const chartHeight =
    height -
    paddingTop -
    paddingBottom;

  const valoresSeguros =
    values.length > 0
      ? values
      : [0];

  const x = (
    index: number,
  ) =>
    paddingLeft +
    (
      index /
      Math.max(
        valoresSeguros.length -
          1,
        1,
      )
    ) *
      chartWidth;

  const y = (
    value: number,
  ) =>
    paddingTop +
    chartHeight -
    (
      Math.max(
        0,
        Math.min(
          value,
          100,
        ),
      ) /
      100
    ) *
      chartHeight;

  const points =
    valoresSeguros
      .map(
        (
          value,
          index,
        ) =>
          `${x(
            index,
          )},${y(
            value,
          )}`,
      )
      .join(' ');

  return (
    <div
      className={
        styles.chartWrapper
      }
    >

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className={
          styles.chart
        }
      >

        {[0, 30, 60, 90].map(
          (
            value,
          ) => (

            <g
              key={
                value
              }
            >

              <line
                x1={
                  paddingLeft
                }
                y1={
                  y(value)
                }
                x2={
                  width -
                  paddingRight
                }
                y2={
                  y(value)
                }
                className={
                  styles.gridLine
                }
              />

              <text
                x={
                  paddingLeft -
                  12
                }
                y={
                  y(value) +
                  4
                }
                textAnchor="end"
                className={
                  styles.axisLabel
                }
              >
                {value}
              </text>

            </g>

          ),
        )}

        <polyline
          points={
            points
          }
          fill="none"
          stroke={
            color
          }
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {valoresSeguros.map(
          (
            value,
            index,
          ) => (

            <g
              key={
                index
              }
            >

              <circle
                cx={
                  x(index)
                }
                cy={
                  y(value)
                }
                r="5"
                fill="#e7efeb"
                stroke={
                  color
                }
                strokeWidth="3"
              />

              <text
                x={
                  x(index)
                }
                y={
                  height - 8
                }
                textAnchor="middle"
                className={
                  styles.axisLabel
                }
              >
                P{index + 1}
              </text>

            </g>

          ),
        )}

      </svg>

    </div>
  );
};

/* =====================================
   INICIAIS
===================================== */

const getInitials = (
  nome: string,
) => {

  const partes =
    nome
      .trim()
      .split(/\s+/)
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

  return `${partes[0][0]}${
    partes[
      partes.length - 1
    ][0]
  }`.toUpperCase();
};

export default DetalhesEquipe;