import {
  Activity,
  BarChart3,
  ChevronDown,
  Play,
  Trophy,
  Users,
} from 'lucide-react';

import {
  useMemo,
  useState,
} from 'react';

import {
  useNavigate,
} from 'react-router-dom';

import styles from './dashboard.module.css';


type StatusPartida =
  | 'Analisada'
  | 'Em análise'
  | 'Pendente';


interface Resumo {
  id: number;
  titulo: string;
  valor: number;
  detalhe: string;
  variacao: number;
  rota: string;
}


interface AtividadeRecente {
  id: number;
  titulo: string;
  horario: string;

  tipo:
    | 'video'
    | 'partida'
    | 'atleta'
    | 'estatistica';
}


interface Partida {
  id: number;
  equipe: string;
  adversario: string;
  modalidade: string;
  data: string;
  resultado: string;
  status: StatusPartida;
}


interface Equipe {
  id: number;
  nome: string;
  modalidade: string;
  sigla: string;
  desempenho: number;
}


const resumos: Resumo[] = [
  {
    id: 1,
    titulo: 'Atletas',
    valor: 66,
    detalhe: 'cadastrados',
    variacao: 8,
    rota: '/atletas',
  },

  {
    id: 2,
    titulo: 'Equipes',
    valor: 4,
    detalhe: 'equipes ativas',
    variacao: 0,
    rota: '/equipes',
  },

  {
    id: 3,
    titulo: 'Partidas',
    valor: 46,
    detalhe: 'analisadas',
    variacao: 12,
    rota: '/partidas',
  },

  {
    id: 4,
    titulo: 'Alertas',
    valor: 5,
    detalhe: 'precisam de atenção',
    variacao: -3,
    rota: '/estatisticas',
  },
];


const atividades: AtividadeRecente[] = [
  {
    id: 1,
    titulo:
      'Falcões FC x Tigres FC analisado',
    horario:
      'Há 2 horas',
    tipo:
      'video',
  },

  {
    id: 2,
    titulo:
      'Nova partida adicionada',
    horario:
      'Há 5 horas',
    tipo:
      'partida',
  },

  {
    id: 3,
    titulo:
      'Perfil de Carla Mendes atualizado',
    horario:
      'Ontem',
    tipo:
      'atleta',
  },

  {
    id: 4,
    titulo:
      'Estatística de aproveitamento criada',
    horario:
      'Ontem',
    tipo:
      'estatistica',
  },
];


const partidas: Partida[] = [
  {
    id: 1,
    equipe: 'Falcões FC',
    adversario: 'Tigres FC',
    modalidade: 'Futebol',
    data: '18/09/2026',
    resultado: '3 - 1',
    status: 'Analisada',
  },

  {
    id: 2,
    equipe: 'Águias Basquete',
    adversario: 'Panteras',
    modalidade: 'Basquete',
    data: '15/09/2026',
    resultado: '88 - 76',
    status: 'Analisada',
  },

  {
    id: 3,
    equipe: 'Fúria Vôlei',
    adversario: 'Ventania',
    modalidade: 'Vôlei',
    data: '12/09/2026',
    resultado: '3 - 2',
    status: 'Em análise',
  },

  {
    id: 4,
    equipe: 'Poli Rugby',
    adversario: 'Spartans',
    modalidade: 'Rugby',
    data: '09/09/2026',
    resultado: '21 - 24',
    status: 'Pendente',
  },
];


const equipes: Equipe[] = [
  {
    id: 1,
    nome: 'Falcões FC',
    modalidade: 'Futebol',
    sigla: 'FC',
    desempenho: 78,
  },

  {
    id: 2,
    nome: 'Águias Basquete',
    modalidade: 'Basquete',
    sigla: 'AB',
    desempenho: 65,
  },

  {
    id: 3,
    nome: 'Poli Rugby',
    modalidade: 'Rugby',
    sigla: 'PR',
    desempenho: 76,
  },
];


const grafico = {
  'Últimas 7 partidas': {
    equipe: [
      58,
      65,
      63,
      71,
      69,
      77,
      82,
    ],

    adversario: [
      54,
      58,
      61,
      64,
      62,
      68,
      70,
    ],
  },

  'Últimas 5 partidas': {
    equipe: [
      63,
      69,
      68,
      76,
      82,
    ],

    adversario: [
      59,
      63,
      62,
      67,
      70,
    ],
  },

  'Últimas 3 partidas': {
    equipe: [
      69,
      77,
      82,
    ],

    adversario: [
      62,
      68,
      71,
    ],
  },
};


const Dashboard = () => {
  const navigate =
    useNavigate();


  const [
    periodo,
    setPeriodo,
  ] =
    useState(
      'Últimas 7 partidas',
    );


  const dados =
    grafico[
      periodo as keyof typeof grafico
    ];


  const linhaEquipe =
    useMemo(
      () =>
        criarLinha(
          dados.equipe,
        ),
      [dados],
    );


  const linhaAdversario =
    useMemo(
      () =>
        criarLinha(
          dados.adversario,
        ),
      [dados],
    );


  const abrirAtividade = (
    atividade: AtividadeRecente,
  ) => {
    if (
      atividade.tipo ===
      'atleta'
    ) {
      navigate('/atletas');

      return;
    }


    if (
      atividade.tipo ===
      'estatistica'
    ) {
      navigate(
        '/estatisticas',
      );

      return;
    }


    navigate('/partidas');
  };


  return (
    <main
      className={
        styles.page
      }
    >
      <div
        className={
          styles.dashboard
        }
      >
        {/* =========================
            TOPO
        ========================= */}

        <header
          className={
            styles.header
          }
        >
          <div>
            <h1>
              Olá, Marcelo
            </h1>

            <p>
              Acompanhe o que está acontecendo com suas equipes.
            </p>
          </div>

          <span
            className={
              styles.date
            }
          >
            Setembro
            <strong>
              2026
            </strong>
          </span>
        </header>


        {/* =========================
            FAIXA DE RESUMO
        ========================= */}

        <section
          className={
            styles.scoreboard
          }
        >
          {resumos.map(
            (
              item,
            ) => (
              <button
                type="button"
                key={
                  item.id
                }
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
                    styles.scoreMain
                  }
                >
                  <strong>
                    {
                      item.valor
                    }
                  </strong>

                  <span>
                    {
                      item.titulo
                    }
                  </span>
                </div>

                <div
                  className={
                    styles.scoreFooter
                  }
                >
                  <span>
                    {
                      item.detalhe
                    }
                  </span>

                  {item.variacao !==
                    0 && (
                    <small
                      className={
                        item.variacao >
                        0
                          ? styles.positive
                          : styles.negative
                      }
                    >
                      {item.variacao >
                      0
                        ? '+'
                        : ''}

                      {
                        item.variacao
                      }%
                    </small>
                  )}
                </div>
              </button>
            ),
          )}
        </section>


        {/* =========================
            ÁREA PRINCIPAL
        ========================= */}

        <section
          className={
            styles.mainArea
          }
        >
          {/* GRÁFICO */}

          <article
            className={
              styles.performance
            }
          >
            <div
              className={
                styles.sectionHeader
              }
            >
              <div>
                <h2>
                  Evolução de desempenho
                </h2>

                <p>
                  Sua equipe comparada aos adversários
                </p>
              </div>

              <div
                className={
                  styles.period
                }
              >
                <select
                  value={
                    periodo
                  }
                  onChange={(
                    event,
                  ) =>
                    setPeriodo(
                      event
                        .target
                        .value,
                    )
                  }
                >
                  <option>
                    Últimas 7 partidas
                  </option>

                  <option>
                    Últimas 5 partidas
                  </option>

                  <option>
                    Últimas 3 partidas
                  </option>
                </select>

                <ChevronDown
                  size={15}
                />
              </div>
            </div>


            <div
              className={
                styles.chartBody
              }
            >
              <div
                className={
                  styles.axis
                }
              >
                <span>
                  100
                </span>

                <span>
                  75
                </span>

                <span>
                  50
                </span>

                <span>
                  25
                </span>
              </div>

              <div
                className={
                  styles.chartArea
                }
              >
                <span
                  className={
                    styles.horizontal1
                  }
                />

                <span
                  className={
                    styles.horizontal2
                  }
                />

                <span
                  className={
                    styles.horizontal3
                  }
                />

                <span
                  className={
                    styles.horizontal4
                  }
                />

                <svg
                  viewBox="0 0 700 185"
                  preserveAspectRatio="none"
                >
                  <polyline
                    points={
                      linhaAdversario
                    }
                    className={
                      styles.adversaryLine
                    }
                  />

                  <polyline
                    points={
                      linhaEquipe
                    }
                    className={
                      styles.teamLine
                    }
                  />

                  {renderPoints(
                    dados.adversario,
                    'adversario',
                  )}

                  {renderPoints(
                    dados.equipe,
                    'equipe',
                  )}
                </svg>

                <div
                  className={
                    styles.labels
                  }
                >
                  {dados.equipe.map(
                    (
                      _,
                      index,
                    ) => (
                      <span
                        key={
                          index
                        }
                      >
                        J
                        {
                          index +
                          1
                        }
                      </span>
                    ),
                  )}
                </div>
              </div>
            </div>


            <footer
              className={
                styles.chartFooter
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
                    styles.adversaryLegend
                  }
                />

                Adversário
              </span>
            </footer>
          </article>


          {/* ATIVIDADES */}

          <aside
            className={
              styles.activities
            }
          >
            <div
              className={
                styles.sectionHeader
              }
            >
              <div>
                <h2>
                  Atividades recentes
                </h2>

                <p>
                  Últimas movimentações
                </p>
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
                  index,
                ) => (
                  <button
                    type="button"
                    key={
                      atividade.id
                    }
                    className={
                      styles.activity
                    }
                    onClick={() =>
                      abrirAtividade(
                        atividade,
                      )
                    }
                  >
                    <span
                      className={
                        styles.activityNumber
                      }
                    >
                      0
                      {
                        index +
                        1
                      }
                    </span>

                    <div
                      className={
                        styles.activityContent
                      }
                    >
                      <strong>
                        {
                          atividade.titulo
                        }
                      </strong>

                      <span>
                        {
                          atividade.horario
                        }
                      </span>
                    </div>

                    <ActivityIcon
                      tipo={
                        atividade.tipo
                      }
                    />
                  </button>
                ),
              )}
            </div>
          </aside>
        </section>


        {/* =========================
            PARTE INFERIOR
        ========================= */}

        <section
          className={
            styles.bottomArea
          }
        >
          {/* PARTIDAS */}

          <article
            className={
              styles.matches
            }
          >
            <div
              className={
                styles.sectionHeader
              }
            >
              <div>
                <h2>
                  Últimas partidas
                </h2>

                <p>
                  Resultados mais recentes
                </p>
              </div>

              <button
                type="button"
                className={
                  styles.link
                }
                onClick={() =>
                  navigate(
                    '/partidas',
                  )
                }
              >
                Ver todas
              </button>
            </div>

            <div
              className={
                styles.tableWrapper
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

                          <span>
                            {
                              partida.adversario
                            }
                          </span>
                        </td>

                        <td>
                          {
                            partida.modalidade
                          }
                        </td>

                        <td>
                          {
                            partida.data
                          }
                        </td>

                        <td
                          className={
                            styles.result
                          }
                        >
                          {
                            partida.resultado
                          }
                        </td>

                        <td>
                          <span
                            className={`${styles.status} ${
                              styles[
                                statusClass(
                                  partida.status,
                                )
                              ]
                            }`}
                          >
                            {
                              partida.status
                            }
                          </span>
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          </article>


          {/* EQUIPES */}

          <aside
            className={
              styles.teams
            }
          >
            <div
              className={
                styles.sectionHeader
              }
            >
              <div>
                <h2>
                  Equipes em destaque
                </h2>

                <p>
                  Desempenho recente
                </p>
              </div>

              <button
                type="button"
                className={
                  styles.link
                }
                onClick={() =>
                  navigate(
                    '/equipes',
                  )
                }
              >
                Ver equipes
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
                    type="button"
                    key={
                      equipe.id
                    }
                    className={
                      styles.team
                    }
                    onClick={() =>
                      navigate(
                        '/equipes',
                      )
                    }
                  >
                    <div
                      className={
                        styles.teamPosition
                      }
                    >
                      0
                      {
                        index +
                        1
                      }
                    </div>

                    <div
                      className={
                        styles.teamBadge
                      }
                    >
                      {
                        equipe.sigla
                      }
                    </div>

                    <div
                      className={
                        styles.teamText
                      }
                    >
                      <strong>
                        {
                          equipe.nome
                        }
                      </strong>

                      <span>
                        {
                          equipe.modalidade
                        }
                      </span>
                    </div>

                    <strong
                      className={
                        styles.teamValue
                      }
                    >
                      {
                        equipe.desempenho
                      }
                      <small>
                        %
                      </small>
                    </strong>
                  </button>
                ),
              )}
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
};


const ActivityIcon = ({
  tipo,
}: {
  tipo:
    AtividadeRecente['tipo'];
}) => {
  if (
    tipo ===
    'video'
  ) {
    return (
      <Play
        className={
          styles.activityIcon
        }
        size={15}
      />
    );
  }


  if (
    tipo ===
    'partida'
  ) {
    return (
      <Trophy
        className={
          styles.activityIcon
        }
        size={15}
      />
    );
  }


  if (
    tipo ===
    'atleta'
  ) {
    return (
      <Users
        className={
          styles.activityIcon
        }
        size={15}
      />
    );
  }


  return (
    <BarChart3
      className={
        styles.activityIcon
      }
      size={15}
    />
  );
};


function criarLinha(
  valores: number[],
) {
  const largura =
    700;

  const altura =
    160;


  return valores
    .map(
      (
        valor,
        index,
      ) => {
        const x =
          valores.length ===
          1
            ? largura /
              2
            : (index *
                largura) /
              (valores.length -
                1);


        const y =
          altura -
          (valor /
            100) *
            altura +
          10;


        return `${x},${y}`;
      },
    )
    .join(' ');
}


function renderPoints(
  valores: number[],

  tipo:
    | 'equipe'
    | 'adversario',
) {
  const largura =
    700;

  const altura =
    160;


  return valores.map(
    (
      valor,
      index,
    ) => {
      const x =
        valores.length ===
        1
          ? largura /
            2
          : (index *
              largura) /
            (valores.length -
              1);


      const y =
        altura -
        (valor /
          100) *
          altura +
        10;


      return (
        <circle
          key={`${tipo}-${index}`}
          cx={x}
          cy={y}
          r="4"
          className={
            tipo ===
            'equipe'
              ? styles.teamPoint
              : styles.adversaryPoint
          }
        />
      );
    },
  );
}


function statusClass(
  status:
    StatusPartida,
) {
  if (
    status ===
    'Analisada'
  ) {
    return 'statusDone';
  }


  if (
    status ===
    'Em análise'
  ) {
    return 'statusAnalysis';
  }


  return 'statusPending';
}


export default Dashboard;