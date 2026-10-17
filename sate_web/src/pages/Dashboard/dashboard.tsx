import {
  ArrowRight,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Play,
  Shield,
  TrendingDown,
  TrendingUp,
  Trophy,
  UserRound,
  Users,
} from 'lucide-react';

import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import { useNavigate } from 'react-router-dom';

import styles from './dashboard.module.css';


// ============================================================
// TIPOS
// ============================================================

type TipoAtividade =
  | 'partida'
  | 'atleta'
  | 'equipe'
  | 'estatistica'
  | 'video';


type StatusPartida =
  | 'Finalizada'
  | 'Analisada'
  | 'Em andamento'
  | 'Em análise'
  | 'Pendente'
  | 'Cancelada';


type Periodo =
  | 'Últimas 7 partidas'
  | 'Últimas 5 partidas'
  | 'Últimas 3 partidas';


interface Resumo {
  id: number;
  titulo: string;
  valor: number;
  detalhe: string;
  variacao: number;
  rota: string;
}


interface AtividadeRecente {
  id: string | number;
  titulo: string;
  horario: string;
  tipo: TipoAtividade;
}


interface Partida {
  id: number;
  equipe: string;
  adversario: string;
  modalidade: string;
  data: string;
  dataFormatada?: string;
  resultado: string;
  status: StatusPartida;
}


interface Equipe {
  id: number;
  nome: string;
  modalidade: string;
  categoria?: string | null;
  sigla: string;
  desempenho: number;
  atletas?: number;
  corEquipe?: string | null;
  imagem?: string | null;
}


interface Serie {
  equipe: number[];
  adversario: number[];
}


type DadosGrafico = Record<
  Periodo,
  Serie
>;


interface DashboardResponse {
  treinador: {
    id: number;
    nome: string;
    email?: string | null;
  };

  resumos: Resumo[];

  atividades: AtividadeRecente[];

  desempenho: DadosGrafico;

  partidas: Partida[];

  partidasCalendario: Partida[];

  equipes: Equipe[];
}


interface ErroApi {
  mensagem?: string;
  erro?: string;
}


// ============================================================
// CONFIGURAÇÕES
// ============================================================

const API_URL =
  'http://localhost:3000/api';


const periodos: Periodo[] = [
  'Últimas 7 partidas',
  'Últimas 5 partidas',
  'Últimas 3 partidas',
];


const vazio: DadosGrafico = {
  'Últimas 7 partidas': {
    equipe: [],
    adversario: [],
  },

  'Últimas 5 partidas': {
    equipe: [],
    adversario: [],
  },

  'Últimas 3 partidas': {
    equipe: [],
    adversario: [],
  },
};


const diasSemana = [
  'SEG',
  'TER',
  'QUA',
  'QUI',
  'SEX',
  'SÁB',
  'DOM',
];


// ============================================================
// TOKEN
// ============================================================

const obterToken = () => {
  return (
    localStorage.getItem('token') ||
    sessionStorage.getItem('token') ||
    localStorage.getItem('accessToken') ||
    sessionStorage.getItem('accessToken')
  );
};


// ============================================================
// DATAS
// ============================================================

const dataLocal = (
  valor: string,
): Date | null => {
  if (!valor) {
    return null;
  }

  const partes = valor
    .slice(0, 10)
    .split('-');

  const data =
    partes.length === 3 &&
      partes[0].length === 4
      ? new Date(
        Number(partes[0]),
        Number(partes[1]) - 1,
        Number(partes[2]),
      )
      : new Date(valor);

  return Number.isNaN(
    data.getTime(),
  )
    ? null
    : data;
};


const formatarData = (
  valor: string,
) => {
  return (
    dataLocal(
      valor,
    )?.toLocaleDateString(
      'pt-BR',
    ) || '—'
  );
};


// ============================================================
// CALENDÁRIO
// ============================================================

const criarCalendario = (
  ano: number,
  mes: number,
): Array<number | null> => {
  const primeiroDia =
    new Date(
      ano,
      mes,
      1,
    ).getDay();

  const inicio =
    (primeiroDia + 6) % 7;

  const quantidadeDias =
    new Date(
      ano,
      mes + 1,
      0,
    ).getDate();

  const dias: Array<
    number | null
  > = Array(inicio).fill(
    null,
  );

  for (
    let dia = 1;
    dia <= quantidadeDias;
    dia += 1
  ) {
    dias.push(dia);
  }

  while (
    dias.length % 7 !== 0
  ) {
    dias.push(null);
  }

  return dias;
};


// ============================================================
// GRÁFICO
// ============================================================

const coordenadas = (
  valores: number[],
) => {
  return valores.map(
    (valor, index) => {
      const x =
        valores.length === 1
          ? 350
          : (index * 700) /
          (valores.length - 1);

      const valorLimitado =
        Math.max(
          0,
          Math.min(
            100,
            valor,
          ),
        );

      const y =
        200 -
        valorLimitado * 2;

      return {
        x,
        y,
      };
    },
  );
};


const pontos = (
  valores: number[],
) => {
  return coordenadas(
    valores,
  )
    .map(
      (ponto) =>
        `${ponto.x},${ponto.y}`,
    )
    .join(' ');
};


// ============================================================
// ÍCONES DE ATIVIDADES
// ============================================================

const iconAtividade = (
  tipo: TipoAtividade,
) => {
  if (tipo === 'video') {
    return (
      <Play size={15} />
    );
  }

  if (tipo === 'partida') {
    return (
      <Trophy size={15} />
    );
  }

  if (
    tipo ===
    'estatistica'
  ) {
    return (
      <BarChart3
        size={15}
      />
    );
  }

  return (
    <Users size={15} />
  );
};


// ============================================================
// STATUS
// ============================================================

const statusClass = (
  status: StatusPartida,
) => {
  if (
    status === 'Finalizada' ||
    status === 'Analisada'
  ) {
    return styles.statusDone;
  }

  if (
    status === 'Em andamento' ||
    status === 'Em análise'
  ) {
    return styles.statusAnalysis;
  }

  return styles.statusPending;
};


// ============================================================
// DASHBOARD
// ============================================================

export default function Dashboard() {
  const navigate =
    useNavigate();


  // ==========================================================
  // ESTADOS
  // ==========================================================

  const [
    dashboard,
    setDashboard,
  ] =
    useState<DashboardResponse | null>(
      null,
    );


  const [
    carregando,
    setCarregando,
  ] = useState(true);


  const [
    erro,
    setErro,
  ] = useState('');


  const [
    periodo,
    setPeriodo,
  ] =
    useState<Periodo>(
      'Últimas 7 partidas',
    );


  const [
    mes,
    setMes,
  ] = useState(
    () =>
      new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        1,
      ),
  );


  const [
    dia,
    setDia,
  ] =
    useState<number | null>(
      new Date().getDate(),
    );


  // ==========================================================
  // CARREGAR DASHBOARD
  // ==========================================================

  useEffect(() => {
    let ativo = true;


    async function carregar() {
      try {
        setCarregando(true);

        setErro('');


        const token =
          obterToken();


        if (!token) {
          navigate(
            '/login',
            {
              replace: true,
            },
          );

          return;
        }


        const resposta =
          await fetch(
            `${API_URL}/dashboard`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            },
          );


        const texto =
          await resposta.text();


        let dados:
          DashboardResponse &
          ErroApi;


        try {
          dados =
            JSON.parse(
              texto,
            );
        } catch {
          throw new Error(
            'A API do dashboard não retornou JSON.',
          );
        }


        if (
          resposta.status === 401
        ) {
          const chaves = [
            'token',
            'accessToken',
            'usuario',
          ];


          chaves.forEach(
            (chave) => {
              localStorage.removeItem(
                chave,
              );

              sessionStorage.removeItem(
                chave,
              );
            },
          );


          navigate(
            '/login',
            {
              replace: true,
            },
          );

          return;
        }


        if (!resposta.ok) {
          throw new Error(
            dados.mensagem ||
            dados.erro ||
            `Erro HTTP ${resposta.status}`,
          );
        }


        if (!ativo) {
          return;
        }


        setDashboard(
          dados,
        );


        const partidasCalendario =
          Array.isArray(
            dados.partidasCalendario,
          )
            ? dados.partidasCalendario
            : [];


        const hoje =
          new Date();

        hoje.setHours(
          0,
          0,
          0,
          0,
        );


        const futura = [
          ...partidasCalendario,
        ]
          .filter(
            (partida) => {
              const data =
                dataLocal(
                  partida.data,
                );

              return (
                data &&
                data >= hoje
              );
            },
          )
          .sort(
            (
              primeira,
              segunda,
            ) =>
              (dataLocal(
                primeira.data,
              )?.getTime() ||
                0) -
              (dataLocal(
                segunda.data,
              )?.getTime() ||
                0),
          )[0];


        if (futura) {
          const data =
            dataLocal(
              futura.data,
            );


          if (data) {
            setMes(
              new Date(
                data.getFullYear(),
                data.getMonth(),
                1,
              ),
            );

            setDia(
              data.getDate(),
            );
          }
        }
      } catch (error) {
        if (ativo) {
          setErro(
            error instanceof Error
              ? error.message
              : 'Erro ao carregar dashboard.',
          );
        }
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }


    carregar();


    return () => {
      ativo = false;
    };
  }, [navigate]);


  // ==========================================================
  // DADOS
  // ==========================================================

  const resumos =
    dashboard?.resumos ||
    [];


  const atividades =
    dashboard?.atividades ||
    [];


  const partidas =
    dashboard?.partidas ||
    [];


  const partidasCalendario =
    dashboard?.partidasCalendario ||
    [];


  const equipes =
    dashboard?.equipes ||
    [];


  const serie =
    (
      dashboard?.desempenho ||
      vazio
    )[periodo] ||
    vazio[periodo];


  // ==========================================================
  // CALENDÁRIO
  // ==========================================================

  const ano =
    mes.getFullYear();


  const numeroMes =
    mes.getMonth();


  const dias =
    useMemo(
      () =>
        criarCalendario(
          ano,
          numeroMes,
        ),
      [
        ano,
        numeroMes,
      ],
    );


  const partidasMes =
    useMemo(() => {
      return partidasCalendario.filter(
        (partida) => {
          const data =
            dataLocal(
              partida.data,
            );

          return (
            data?.getFullYear() === ano &&
            data.getMonth() === numeroMes
          );
        },
      );
    }, [
      partidasCalendario,
      ano,
      numeroMes,
    ]);


  const diasPartida =
    useMemo(() => {
      const diasComPartida =
        partidasMes
          .map(
            (partida) =>
              dataLocal(
                partida.data,
              )?.getDate(),
          )
          .filter(
            (
              diaPartida,
            ): diaPartida is number =>
              typeof diaPartida ===
              'number',
          );


      return new Set(
        diasComPartida,
      );
    }, [partidasMes]);


  const partidasDia =
    partidasMes.filter(
      (partida) =>
        dataLocal(
          partida.data,
        )?.getDate() === dia,
    );


  // ==========================================================
  // PRÓXIMA PARTIDA
  // ==========================================================

  const hoje =
    new Date();

  hoje.setHours(
    0,
    0,
    0,
    0,
  );


  const proxima = [
    ...partidasCalendario,
  ]
    .filter(
      (partida) => {
        const data =
          dataLocal(
            partida.data,
          );

        return (
          data &&
          data >= hoje
        );
      },
    )
    .sort(
      (
        primeira,
        segunda,
      ) =>
        (dataLocal(
          primeira.data,
        )?.getTime() ||
          0) -
        (dataLocal(
          segunda.data,
        )?.getTime() ||
          0),
    )[0];


  const dataProxima =
    proxima
      ? dataLocal(
        proxima.data,
      )
      : null;


  // ==========================================================
  // TREINADOR
  // ==========================================================

  const nome =
    dashboard?.treinador?.nome
      ?.trim()
      .split(/\s+/)[0] ||
    'Treinador';


  // ==========================================================
  // MÊS
  // ==========================================================

  const mesNome =
    mes.toLocaleDateString(
      'pt-BR',
      {
        month: 'long',
        year: 'numeric',
      },
    );


  // ==========================================================
  // RESUMOS
  // ==========================================================

  const iconesResumo = [
    UserRound,
    Shield,
    Trophy,
    TrendingUp,
  ];


  const ordemResumos = [
    'atleta',
    'equipe',
    'partida',
    'evolu',
  ];


  const resumosOrdenados =
    [...resumos].sort(
      (
        primeiro,
        segundo,
      ) => {
        const tituloPrimeiro =
          primeiro.titulo.toLowerCase();

        const tituloSegundo =
          segundo.titulo.toLowerCase();


        const indicePrimeiro =
          ordemResumos.findIndex(
            (item) =>
              tituloPrimeiro.includes(
                item,
              ),
          );


        const indiceSegundo =
          ordemResumos.findIndex(
            (item) =>
              tituloSegundo.includes(
                item,
              ),
          );


        return (
          (
            indicePrimeiro === -1
              ? 999
              : indicePrimeiro
          ) -
          (
            indiceSegundo === -1
              ? 999
              : indiceSegundo
          )
        );
      },
    );


  // ==========================================================
  // ALTERAR MÊS
  // ==========================================================

  const mudarMes = (
    deslocamento: number,
  ) => {
    setMes(
      (atual) =>
        new Date(
          atual.getFullYear(),
          atual.getMonth() +
          deslocamento,
          1,
        ),
    );

    setDia(null);
  };


  // ==========================================================
  // ABRIR ATIVIDADE
  // ==========================================================

  const abrirAtividade = (
    tipo: TipoAtividade,
  ) => {
    if (tipo === 'atleta') {
      navigate('/atletas');

      return;
    }

    if (tipo === 'equipe') {
      navigate('/equipes');

      return;
    }

    if (
      tipo ===
      'estatistica'
    ) {
      navigate('/estatisticas');

      return;
    }

    if (tipo === 'video') {
      navigate('/videos');

      return;
    }

    navigate('/partidas');
  };


  // ==========================================================
  // CARREGANDO
  // ==========================================================

  if (carregando) {
    return (
      <main className={styles.page}>
        <div
          className={
            styles.feedback
          }
        >
          Carregando dashboard...
        </div>
      </main>
    );
  }


  // ==========================================================
  // ERRO
  // ==========================================================

  if (erro) {
    return (
      <main className={styles.page}>
        <div
          className={
            styles.feedback
          }
        >
          <p>
            {erro}
          </p>

          <button
            type="button"
            onClick={() =>
              window.location.reload()
            }
          >
            Tentar novamente
          </button>
        </div>
      </main>
    );
  }


  // ==========================================================
  // TELA
  // ==========================================================

  return (
    <main className={styles.page}>
      <div
        className={
          styles.dashboard
        }
      >
        {/* =================================================
            CABEÇALHO
        ================================================= */}

        <header className={styles.heroHeader}>
          <div className={styles.heroTop}>
            <div className={styles.heroText}>
              <h1>
                Olá, <em>{nome}.</em>
              </h1>

              <p>
                Acompanhe tudo o que está acontecendo com seu time.
              </p>
            </div>

            <span className={styles.heroDate}>
              {new Date()
                .toLocaleDateString('pt-BR', {
                  month: 'long',
                  year: 'numeric',
                })
                .replace(/^./, (letra) => letra.toUpperCase())}
            </span>
          </div>
        </header>


        {/* =================================================
            INDICADORES
        ================================================= */}

        <section
          className={
            styles.scoreboard
          }
        >
          {resumosOrdenados.map(
            (
              item,
              index,
            ) => {
              const Icone =
                iconesResumo[
                index %
                iconesResumo.length
                ];


              const evolucao =
                item.titulo
                  .toLowerCase()
                  .includes(
                    'evolu',
                  );


              return (
                <button
                  key={
                    item.id
                  }
                  type="button"
                  className={
                    styles.scoreItem
                  }
                  onClick={() =>
                    navigate(
                      item.rota,
                    )
                  }
                >
                  <div
                    className={
                      styles.scoreTop
                    }
                  >
                    <span>
                      {item.titulo}
                    </span>

                    <Icone
                      size={19}
                    />
                  </div>


                  <strong>
                    {item.valor}

                    {evolucao
                      ? '%'
                      : ''}
                  </strong>


                  <div
                    className={
                      styles.scoreBottom
                    }
                  >
                    <span>
                      {item.detalhe}
                    </span>


                    {item.variacao !==
                      0 && (
                        <small
                          className={
                            item.variacao > 0
                              ? styles.positive
                              : styles.negative
                          }
                        >
                          {item.variacao >
                            0 ? (
                            <TrendingUp
                              size={13}
                            />
                          ) : (
                            <TrendingDown
                              size={13}
                            />
                          )}

                          {item.variacao >
                            0
                            ? '+'
                            : ''}

                          {item.variacao}%
                        </small>
                      )}
                  </div>
                </button>
              );
            },
          )}


          {!resumos.length && (
            <div
              className={
                styles.emptyWide
              }
            >
              Nenhum indicador
              disponível.
            </div>
          )}
        </section>


        {/* =================================================
            DESEMPENHO + PRÓXIMA PARTIDA
        ================================================= */}

        <section
          className={
            styles.topGrid
          }
        >
          {/* GRÁFICO */}

          <article
            className={`${styles.card} ${styles.performance}`}
          >
            <div
              className={
                styles.cardHeading
              }
            >
              <div>


                <h2>
                  Evolução de{' '}

                  <em>
                    desempenho
                  </em>
                </h2>


                <p>
                  Sua equipe comparada
                  aos adversários.
                </p>
              </div>


              <div
                className={
                  styles.periodSelect
                }
              >
                <select
                  value={periodo}
                  onChange={(
                    event,
                  ) =>
                    setPeriodo(
                      event.target
                        .value as Periodo,
                    )
                  }
                  aria-label="Período do gráfico"
                >
                  {periodos.map(
                    (item) => (
                      <option
                        key={item}
                        value={item}
                      >
                        {item}
                      </option>
                    ),
                  )}
                </select>
              </div>
            </div>


            <div
              className={
                styles.chart
              }
            >
              <div
                className={
                  styles.chartAxis
                }
              >
                {[
                  100,
                  75,
                  50,
                  25,
                  0,
                ].map(
                  (numero) => (
                    <span
                      key={numero}
                    >
                      {numero}
                    </span>
                  ),
                )}
              </div>


              <div
                className={
                  styles.chartPlot
                }
              >
                <svg
                  viewBox="0 0 700 200"
                  preserveAspectRatio="none"
                  aria-label="Gráfico de evolução de desempenho"
                >
                  {[
                    0,
                    50,
                    100,
                    150,
                    200,
                  ].map(
                    (y) => (
                      <line
                        key={y}
                        x1="0"
                        x2="700"
                        y1={y}
                        y2={y}
                        className={
                          styles.gridLine
                        }
                      />
                    ),
                  )}


                  {serie.equipe
                    .length >
                    1 && (
                      <polygon
                        points={`0,200 ${pontos(
                          serie.equipe,
                        )} 700,200`}
                        className={
                          styles.areaFill
                        }
                      />
                    )}


                  {serie.adversario
                    .length >
                    1 && (
                      <polyline
                        points={pontos(
                          serie.adversario,
                        )}
                        className={
                          styles.opponentLine
                        }
                      />
                    )}


                  {serie.equipe
                    .length >
                    1 && (
                      <polyline
                        points={pontos(
                          serie.equipe,
                        )}
                        className={
                          styles.teamLine
                        }
                      />
                    )}


                  {coordenadas(
                    serie.adversario,
                  ).map(
                    (
                      ponto,
                      index,
                    ) => (
                      <circle
                        key={`adversario-${index}`}
                        cx={
                          ponto.x
                        }
                        cy={
                          ponto.y
                        }
                        r="4.5"
                        className={
                          styles.opponentPoint
                        }
                      />
                    ),
                  )}


                  {coordenadas(
                    serie.equipe,
                  ).map(
                    (
                      ponto,
                      index,
                    ) => (
                      <circle
                        key={`equipe-${index}`}
                        cx={
                          ponto.x
                        }
                        cy={
                          ponto.y
                        }
                        r="4.5"
                        className={
                          styles.teamPoint
                        }
                      />
                    ),
                  )}
                </svg>


                <div
                  className={
                    styles.chartLabels
                  }
                >
                  {serie.equipe.map(
                    (
                      _,
                      index,
                    ) => (
                      <span
                        key={index}
                      >
                        J
                        {index + 1}
                      </span>
                    ),
                  )}
                </div>
              </div>
            </div>


            <div
              className={
                styles.chartLegend
              }
            >
              <span>
                <i
                  className={
                    styles.teamLegend
                  }
                />

                Sua equipe
              </span>


              <span>
                <i
                  className={
                    styles.opponentLegend
                  }
                />

                Adversários
              </span>
            </div>
          </article>


          {/* =================================================
              PRÓXIMA PARTIDA
          ================================================= */}

          <article
            className={
              styles.nextMatch
            }
          >
            <span
              className={
                styles.eyebrow
              }
            >
              PRÓXIMA PARTIDA
            </span>


            {proxima &&
              dataProxima ? (
              <>
                <div
                  className={
                    styles.matchDate
                  }
                >
                  <strong>
                    {
                      dataProxima.getDate()
                    }
                  </strong>


                  <div>
                    <b>
                      {dataProxima
                        .toLocaleDateString(
                          'pt-BR',
                          {
                            month:
                              'long',
                          },
                        )
                        .toUpperCase()}
                    </b>


                    <span>
                      {dataProxima.toLocaleDateString(
                        'pt-BR',
                        {
                          weekday:
                            'long',
                        },
                      )}
                    </span>
                  </div>
                </div>


                <div
                  className={
                    styles.matchTeams
                  }
                >
                  <strong>
                    {proxima.equipe}
                  </strong>

                  <em>
                    contra
                  </em>

                  <strong>
                    {proxima.adversario}
                  </strong>
                </div>


                <div
                  className={
                    styles.matchTags
                  }
                >
                  <span>
                    {
                      proxima.modalidade
                    }
                  </span>

                  <span>
                    {formatarData(
                      proxima.data,
                    )}
                  </span>
                </div>
              </>
            ) : (
              <p
                className={
                  styles.noUpcoming
                }
              >
                Nenhuma próxima
                partida agendada.
              </p>
            )}


            <button
              type="button"
              className={
                styles.matchButton
              }
              onClick={() =>
                navigate(
                  '/partidas',
                )
              }
            >
              Ver partidas

              <ArrowRight
                size={17}
              />
            </button>


            <div
              className={
                styles.decorativeCircle
              }
            />
          </article>
        </section>


        {/* =================================================
            CALENDÁRIO + ATIVIDADES
        ================================================= */}

        <section
          className={
            styles.middleGrid
          }
        >
          <article
            className={`${styles.card} ${styles.calendarCard}`}
          >
            <div
              className={
                styles.cardHeading
              }
            >
              <div>
                <span
                  className={
                    styles.eyebrow
                  }
                >
                  AGENDA
                </span>

                <h2>
                  Calendário
                </h2>

                <p>
                  Acompanhe as datas
                  das partidas.
                </p>
              </div>
            </div>


            <div
              className={
                styles.calendarLayout
              }
            >
              <div
                className={
                  styles.calendarLeft
                }
              >
                <div
                  className={
                    styles.calendarNavigation
                  }
                >
                  <button
                    type="button"
                    aria-label="Mês anterior"
                    onClick={() =>
                      mudarMes(-1)
                    }
                  >
                    <ChevronLeft
                      size={17}
                    />
                  </button>


                  <strong>
                    {mesNome}
                  </strong>


                  <button
                    type="button"
                    aria-label="Próximo mês"
                    onClick={() =>
                      mudarMes(1)
                    }
                  >
                    <ChevronRight
                      size={17}
                    />
                  </button>
                </div>


                <div
                  className={
                    styles.calendarWeek
                  }
                >
                  {diasSemana.map(
                    (
                      diaSemana,
                    ) => (
                      <span
                        key={
                          diaSemana
                        }
                      >
                        {diaSemana}
                      </span>
                    ),
                  )}
                </div>


                <div
                  className={
                    styles.calendarDays
                  }
                >
                  {dias.map(
                    (
                      diaCalendario,
                      index,
                    ) => {
                      if (
                        diaCalendario ===
                        null
                      ) {
                        return (
                          <span
                            key={`vazio-${index}`}
                          />
                        );
                      }


                      const temPartida =
                        diasPartida.has(
                          diaCalendario,
                        );


                      const selecionado =
                        dia ===
                        diaCalendario;


                      return (
                        <button
                          key={
                            diaCalendario
                          }
                          type="button"
                          onClick={() =>
                            setDia(
                              diaCalendario,
                            )
                          }
                          className={`${styles.calendarDay} ${temPartida
                              ? styles.hasMatch
                              : ''
                            } ${selecionado
                              ? styles.selectedDay
                              : ''
                            }`}
                        >
                          {
                            diaCalendario
                          }

                          {temPartida && (
                            <i />
                          )}
                        </button>
                      );
                    },
                  )}
                </div>
              </div>


              <div
                className={
                  styles.calendarDetail
                }
              >
                <span
                  className={
                    styles.eyebrow
                  }
                >
                  PARTIDAS DO DIA
                </span>


                {partidasDia.length >
                  0 ? (
                  partidasDia.map(
                    (
                      partida,
                    ) => (
                      <button
                        key={
                          partida.id
                        }
                        type="button"
                        className={
                          styles.calendarMatch
                        }
                        onClick={() =>
                          navigate(
                            '/partidas',
                          )
                        }
                      >
                        <span>
                          {
                            partida.modalidade
                          }
                        </span>

                        <strong>
                          {
                            partida.equipe
                          }
                        </strong>

                        <small>
                          vs.{' '}
                          {
                            partida.adversario
                          }
                        </small>

                        <ArrowRight
                          size={15}
                        />
                      </button>
                    ),
                  )
                ) : (
                  <div
                    className={
                      styles.calendarEmpty
                    }
                  >
                    Nenhuma partida
                    nesta data.
                  </div>
                )}
              </div>
            </div>
          </article>


          <article
            className={`${styles.card} ${styles.activitiesCard}`}
          >
            <div
              className={
                styles.cardHeading
              }
            >
              <div>
                <span
                  className={
                    styles.eyebrow
                  }
                >
                  HISTÓRICO
                </span>

                <h2>
                  Atividades recentes
                </h2>
              </div>
            </div>


            <div
              className={
                styles.activityList
              }
            >
              {atividades.map(
                (
                  atividade,
                ) => (
                  <button
                    key={
                      atividade.id
                    }
                    type="button"
                    className={
                      styles.activity
                    }
                    onClick={() =>
                      abrirAtividade(
                        atividade.tipo,
                      )
                    }
                  >
                    <span
                      className={
                        styles.activityIcon
                      }
                    >
                      {iconAtividade(
                        atividade.tipo,
                      )}
                    </span>


                    <span
                      className={
                        styles.activityText
                      }
                    >
                      <strong>
                        {
                          atividade.titulo
                        }
                      </strong>

                      <small>
                        {
                          atividade.horario
                        }
                      </small>
                    </span>
                  </button>
                ),
              )}


              {!atividades.length && (
                <p
                  className={
                    styles.empty
                  }
                >
                  Nenhuma atividade
                  recente.
                </p>
              )}
            </div>
          </article>
        </section>


        {/* =================================================
            PARTIDAS + EQUIPES
        ================================================= */}

        <section
          className={
            styles.bottomGrid
          }
        >
          <article
            className={`${styles.card} ${styles.matchesCard}`}
          >
            <div
              className={
                styles.cardHeading
              }
            >
              <div>
                <span
                  className={
                    styles.eyebrow
                  }
                >
                  RESULTADOS
                </span>

                <h2>
                  Últimas partidas
                </h2>
              </div>


              <button
                type="button"
                className={
                  styles.textLink
                }
                onClick={() =>
                  navigate(
                    '/partidas',
                  )
                }
              >
                Ver todas

                <ArrowRight
                  size={15}
                />
              </button>
            </div>


            <div
              className={
                styles.tableScroll
              }
            >
              <table>
                <thead>
                  <tr>
                    <th>
                      Equipes
                    </th>

                    <th>
                      Modalidade
                    </th>

                    <th>
                      Data
                    </th>

                    <th>
                      Placar
                    </th>

                    <th>
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {partidas.map(
                    (
                      partida,
                    ) => (
                      <tr
                        key={
                          partida.id
                        }
                        onClick={() =>
                          navigate(
                            '/partidas',
                          )
                        }
                      >
                        <td>
                          <strong>
                            {
                              partida.equipe
                            }
                          </strong>

                          <small>
                            vs.{' '}
                            {
                              partida.adversario
                            }
                          </small>
                        </td>

                        <td>
                          {
                            partida.modalidade
                          }
                        </td>

                        <td>
                          {partida.dataFormatada ||
                            formatarData(
                              partida.data,
                            )}
                        </td>

                        <td
                          className={
                            styles.result
                          }
                        >
                          {partida.resultado ||
                            '—'}
                        </td>

                        <td>
                          <span
                            className={`${styles.status} ${statusClass(
                              partida.status,
                            )}`}
                          >
                            {
                              partida.status
                            }
                          </span>
                        </td>
                      </tr>
                    ),
                  )}


                  {!partidas.length && (
                    <tr>
                      <td
                        colSpan={5}
                        className={
                          styles.empty
                        }
                      >
                        Nenhuma partida
                        cadastrada.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </article>


          <article
            className={`${styles.card} ${styles.teamsCard}`}
          >
            <div
              className={
                styles.cardHeading
              }
            >
              <div>
                <span
                  className={
                    styles.eyebrow
                  }
                >
                  RANKING
                </span>

                <h2>
                  Equipes em destaque
                </h2>
              </div>


              <button
                type="button"
                className={
                  styles.textLink
                }
                onClick={() =>
                  navigate(
                    '/equipes',
                  )
                }
              >
                Ver equipes

                <ArrowRight
                  size={15}
                />
              </button>
            </div>


            <div
              className={
                styles.teamList
              }
            >
              {equipes.map(
                (
                  equipe,
                  index,
                ) => (
                  <button
                    key={
                      equipe.id
                    }
                    type="button"
                    className={
                      styles.teamRow
                    }
                    onClick={() =>
                      navigate(
                        '/equipes',
                      )
                    }
                  >
                    <span
                      className={
                        styles.teamRank
                      }
                    >
                      {String(
                        index + 1,
                      ).padStart(
                        2,
                        '0',
                      )}
                    </span>


                    <span
                      className={
                        styles.teamBadge
                      }
                      style={
                        equipe.corEquipe
                          ? {
                            background:
                              equipe.corEquipe,
                          }
                          : undefined
                      }
                    >
                      {equipe.sigla}
                    </span>


                    <span
                      className={
                        styles.teamInfo
                      }
                    >
                      <strong>
                        {equipe.nome}
                      </strong>

                      <small>
                        {
                          equipe.modalidade
                        }

                        {typeof equipe.atletas ===
                          'number'
                          ? ` · ${equipe.atletas} atletas`
                          : ''}
                      </small>


                      <span
                        className={
                          styles.progress
                        }
                      >
                        <i
                          style={{
                            width: `${Math.max(
                              0,
                              Math.min(
                                100,
                                equipe.desempenho,
                              ),
                            )}%`,
                          }}
                        />
                      </span>
                    </span>


                    <strong
                      className={
                        styles.teamPercent
                      }
                    >
                      {
                        equipe.desempenho
                      }
                      %
                    </strong>
                  </button>
                ),
              )}


              {!equipes.length && (
                <p
                  className={
                    styles.empty
                  }
                >
                  Nenhuma equipe
                  cadastrada.
                </p>
              )}
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}