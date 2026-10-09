import {
  ArrowLeft,
  PlayCircle,
  Trophy,
  Users,
} from 'lucide-react';

import styles from './detalhesEquipe.module.css';

import type {
  Equipe,
} from './equipes';

interface DetalhesEquipeProps {
  equipe: Equipe;
  onBack: () => void;
}

const DetalhesEquipe = ({
  equipe,
  onBack,
}: DetalhesEquipeProps) => {
  const recorde =
    typeof equipe.empates ===
    'number'
      ? `${equipe.vitorias}V • ${equipe.derrotas}D • ${equipe.empates}E`
      : `${equipe.vitorias}V • ${equipe.derrotas}D`;

  return (
    <main
      className={styles.page}
    >
      {/* VOLTAR */}

      <button
        type="button"
        className={
          styles.backButton
        }
        onClick={onBack}
      >
        <ArrowLeft
          size={17}
        />

        Voltar para equipes
      </button>

      {/* PERFIL DA EQUIPE */}

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
          <div
            className={
              styles.avatar
            }
            style={{
              background:
                equipe.cor,
            }}
          >
            {equipe.sigla}
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
              {equipe.nome}
            </h1>

            <div
              className={
                styles.teamMeta
              }
            >
              <span>
                {
                  equipe.modalidade
                }
              </span>

              <i />

              <span>
                {
                  equipe.categoria
                }
              </span>

              <i />

              <span>
                {
                  equipe.atletas
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
              equipe.desempenho
            }
            %
          </strong>

          <span>
            desempenho geral
          </span>
        </div>
      </section>

      {/* CARDS DE RESUMO */}

      <section
        className={
          styles.summaryGrid
        }
      >
        <SummaryCard
          icon={
            <Trophy size={18} />
          }
          label="Vitórias"
          value={
            String(
              equipe.vitorias,
            )
          }
        />

        <SummaryCard
          icon={
            <Users size={18} />
          }
          label="Atletas"
          value={
            String(
              equipe.atletas,
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
              equipe.videos,
            )
          }
        />
      </section>

      {/* GRÁFICO + ESTATÍSTICAS */}

      <section
        className={
          styles.infoGrid
        }
      >
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
                equipe.desempenho
              }
              %
            </strong>
          </div>

          <PerformanceChart
            values={
              equipe.evolucao
            }
            color={
              equipe.cor
            }
          />
        </article>

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
              value={recorde}
            />

            <StatRow
              label="Modalidade"
              value={
                equipe.modalidade
              }
            />

            <StatRow
              label="Atletas ativos"
              value={String(
                equipe.atletas,
              )}
            />

            <StatRow
              label="Vídeos relacionados"
              value={String(
                equipe.videos,
              )}
            />
          </div>
        </article>
      </section>

      {/* ELENCO */}

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
              equipe.elenco
                .length
            }{' '}
            exibidos
          </span>
        </div>

        <div
          className={
            styles.table
          }
        >
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

          {equipe.elenco.map(
            (atleta) => (
              <div
                key={
                  atleta.id
                }
                className={
                  styles.tableRow
                }
              >
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
                        equipe.cor,
                    }}
                  >
                    {getInitials(
                      atleta.nome,
                    )}
                  </div>

                  <strong>
                    {
                      atleta.nome
                    }
                  </strong>
                </div>

                <span>
                  {
                    atleta.posicao
                  }
                </span>

                <span>
                  {
                    atleta.idade
                  }{' '}
                  anos
                </span>

                <div
                  className={
                    styles.performanceCell
                  }
                >
                  <strong>
                    {
                      atleta.desempenho
                    }
                    %
                  </strong>

                  <div
                    className={
                      styles.miniProgress
                    }
                  >
                    <div
                      style={{
                        width: `${atleta.desempenho}%`,
                        background:
                          equipe.cor,
                      }}
                    />
                  </div>
                </div>
              </div>
            ),
          )}
        </div>
      </section>
    </main>
  );
};

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

  const x = (
    index: number,
  ) =>
    paddingLeft +
    (index /
      Math.max(
        values.length - 1,
        1,
      )) *
      chartWidth;

  const y = (
    value: number,
  ) =>
    paddingTop +
    chartHeight -
    (value / 100) *
      chartHeight;

  const points =
    values
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
          (value) => (
            <g key={value}>
              <line
                x1={
                  paddingLeft
                }
                y1={y(value)}
                x2={
                  width -
                  paddingRight
                }
                y2={y(value)}
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
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {values.map(
          (
            value,
            index,
          ) => (
            <g key={index}>
              <circle
                cx={x(index)}
                cy={y(value)}
                r="5"
                fill="#e7efeb"
                stroke={color}
                strokeWidth="3"
              />

              <text
                x={x(index)}
                y={
                  height -
                  8
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

const getInitials = (
  nome: string,
) => {
  const partes =
    nome.split(' ');

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