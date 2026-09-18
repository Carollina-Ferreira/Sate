import {
  ChevronDown,
  Plus,
  Trophy,
  Target,
  Goal,
  Activity,
} from 'lucide-react';

import { useMemo, useState } from 'react';

import styles from './estatisticas.module.css';

/* =====================================
   TIPAGENS
===================================== */

interface Resumo {
  gols: number;
  assistencias: number;
  finalizacoes: number;
  passes: number;
}

interface AtletaEstatistica {
  nome: string;
  gols: number;
  assistencias: number;
}

interface Evolucao {
  partida: string;
  equipe: number;
  adversarios: number;
}

interface Acao {
  nome: string;
  valor: number;
  cor: string;
}

interface DadosEquipe {
  resumo: Resumo;
  atletas: AtletaEstatistica[];
  evolucao: Evolucao[];
  acoes: Acao[];
}

/* =====================================
   DADOS MOCKADOS
===================================== */

const dadosPorEquipe: Record<string, DadosEquipe> = {
  falcoes: {
    resumo: {
      gols: 18,
      assistencias: 23,
      finalizacoes: 28,
      passes: 33,
    },

    atletas: [
      {
        nome: 'Rafael',
        gols: 8,
        assistencias: 8,
      },
      {
        nome: 'Higor',
        gols: 8,
        assistencias: 12,
      },
      {
        nome: 'Bruno',
        gols: 25,
        assistencias: 7,
      },
    ],

    acoes: [
      {
        nome: 'Boa',
        valor: 35,
        cor: '#7c6df2',
      },
      {
        nome: 'Ruim',
        valor: 27,
        cor: '#ff8580',
      },
      {
        nome: 'Neutra',
        valor: 18,
        cor: '#ffae4b',
      },
      {
        nome: 'Destaque',
        valor: 20,
        cor: '#37b9cf',
      },
    ],

    evolucao: [
      {
        partida: 'P1',
        equipe: 55,
        adversarios: 42,
      },
      {
        partida: 'P2',
        equipe: 59,
        adversarios: 56,
      },
      {
        partida: 'P3',
        equipe: 50,
        adversarios: 50,
      },
      {
        partida: 'P4',
        equipe: 63,
        adversarios: 40,
      },
      {
        partida: 'P5',
        equipe: 60,
        adversarios: 60,
      },
      {
        partida: 'P6',
        equipe: 66,
        adversarios: 50,
      },
      {
        partida: 'P7',
        equipe: 73,
        adversarios: 58,
      },
    ],
  },

  poli: {
    resumo: {
      gols: 22,
      assistencias: 29,
      finalizacoes: 36,
      passes: 41,
    },

    atletas: [
      {
        nome: 'Diogo',
        gols: 13,
        assistencias: 9,
      },
      {
        nome: 'Marcelo',
        gols: 10,
        assistencias: 15,
      },
      {
        nome: 'Lucas',
        gols: 18,
        assistencias: 12,
      },
    ],

    acoes: [
      {
        nome: 'Boa',
        valor: 42,
        cor: '#7c6df2',
      },
      {
        nome: 'Ruim',
        valor: 17,
        cor: '#ff8580',
      },
      {
        nome: 'Neutra',
        valor: 21,
        cor: '#ffae4b',
      },
      {
        nome: 'Destaque',
        valor: 20,
        cor: '#37b9cf',
      },
    ],

    evolucao: [
      {
        partida: 'P1',
        equipe: 48,
        adversarios: 43,
      },
      {
        partida: 'P2',
        equipe: 57,
        adversarios: 51,
      },
      {
        partida: 'P3',
        equipe: 62,
        adversarios: 46,
      },
      {
        partida: 'P4',
        equipe: 58,
        adversarios: 54,
      },
      {
        partida: 'P5',
        equipe: 69,
        adversarios: 57,
      },
      {
        partida: 'P6',
        equipe: 72,
        adversarios: 62,
      },
      {
        partida: 'P7',
        equipe: 78,
        adversarios: 64,
      },
    ],
  },
};

/* =====================================
   COMPONENTE
===================================== */

const Estatisticas = () => {
  const [equipe, setEquipe] = useState('falcoes');
  const [atleta, setAtleta] = useState('todos');
  const [periodo, setPeriodo] = useState('30dias');
  const [modalidade, setModalidade] = useState('Futebol');

  const dados = useMemo(() => {
    return dadosPorEquipe[equipe];
  }, [equipe, atleta, periodo]);

  const nomeEquipe =
    equipe === 'falcoes'
      ? 'Falcões FC'
      : 'Poli Rugby';

  const handleNovaEquipe = () => {
    console.log('Nova equipe');
  };

  return (
    <main className={styles.page}>
      {/* =====================================
          CABEÇALHO
      ===================================== */}

      <div className={styles.pageHeader}>
        <div>
          <h1>Estatísticas</h1>

          <p>
            Acompanhe o desempenho da sua equipe e dos
            atletas.
          </p>
        </div>

        <button
          type="button"
          className={styles.newTeamButton}
          onClick={handleNovaEquipe}
        >
          <Plus size={17} />

          Nova equipe
        </button>
      </div>

      {/* =====================================
          FILTROS
      ===================================== */}

      <section className={styles.filters}>
        <FilterSelect
          label="Equipe"
          value={equipe}
          onChange={setEquipe}
          options={[
            {
              value: 'falcoes',
              label: 'Falcões FC',
            },
            {
              value: 'poli',
              label: 'Poli Rugby',
            },
          ]}
        />

        <FilterSelect
          label="Atleta"
          value={atleta}
          onChange={setAtleta}
          options={[
            {
              value: 'todos',
              label: 'Todos os atletas',
            },
            {
              value: 'titulares',
              label: 'Titulares',
            },
            {
              value: 'reservas',
              label: 'Reservas',
            },
          ]}
        />

        <FilterSelect
          label="Período"
          value={periodo}
          onChange={setPeriodo}
          options={[
            {
              value: '30dias',
              label: 'Últimos 30 dias',
            },
            {
              value: '60dias',
              label: 'Últimos 60 dias',
            },
            {
              value: 'temporada',
              label: 'Temporada',
            },
          ]}
        />

        <button
          type="button"
          className={styles.sportFilter}
          onClick={() =>
            setModalidade((atual) =>
              atual === 'Futebol'
                ? 'Rugby'
                : 'Futebol',
            )
          }
        >
          <Trophy size={14} />

          {modalidade}
        </button>
      </section>

      {/* =====================================
          RESUMO
      ===================================== */}

      <section className={styles.summaryGrid}>
        <SummaryCard
          value={dados.resumo.gols}
          label="Gols"
          icon={<Goal size={19} />}
        />

        <SummaryCard
          value={dados.resumo.assistencias}
          label="Assistências"
          icon={<Activity size={19} />}
        />

        <SummaryCard
          value={dados.resumo.finalizacoes}
          label="Finalizações"
          icon={<Target size={19} />}
        />

        <SummaryCard
          value={dados.resumo.passes}
          label="Passes"
          icon={<Trophy size={19} />}
        />
      </section>

      {/* =====================================
          GRÁFICOS SUPERIORES
      ===================================== */}

      <section className={styles.chartsGrid}>
        <article className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <div>
              <span className={styles.chartEyebrow}>
                Produção ofensiva
              </span>

              <h2>
                Gols e assistências por atleta
              </h2>
            </div>

            <span className={styles.teamTag}>
              {nomeEquipe}
            </span>
          </div>

          <BarChart data={dados.atletas} />
        </article>

        <article className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <div>
              <span className={styles.chartEyebrow}>
                Desempenho
              </span>

              <h2>Ações por avaliação</h2>
            </div>
          </div>

          <DonutChart data={dados.acoes} />
        </article>
      </section>

      {/* =====================================
          EVOLUÇÃO
      ===================================== */}

      <article
        className={`${styles.chartCard} ${styles.evolutionCard}`}
      >
        <div className={styles.chartHeader}>
          <div>
            <span className={styles.chartEyebrow}>
              Histórico recente
            </span>

            <h2>Evolução — {nomeEquipe}</h2>
          </div>

          <div className={styles.legend}>
            <span>
              <i className={styles.teamLegend} />
              Equipe
            </span>

            <span>
              <i className={styles.opponentLegend} />
              Adversários
            </span>
          </div>
        </div>

        <LineChart data={dados.evolucao} />
      </article>
    </main>
  );
};

/* =====================================
   SELECT CUSTOMIZADO
===================================== */

interface FilterSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: {
    value: string;
    label: string;
  }[];
}

const FilterSelect = ({
  label,
  value,
  onChange,
  options,
}: FilterSelectProps) => {
  return (
    <div className={styles.filterSelect}>
      <span className={styles.srOnly}>
        {label}
      </span>

      <select
        value={value}
        aria-label={label}
        onChange={(event) =>
          onChange(event.target.value)
        }
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>

      <ChevronDown
        size={14}
        className={styles.selectIcon}
      />
    </div>
  );
};

/* =====================================
   CARD DE RESUMO
===================================== */

interface SummaryCardProps {
  value: number;
  label: string;
  icon: React.ReactNode;
}

const SummaryCard = ({
  value,
  label,
  icon,
}: SummaryCardProps) => {
  return (
    <article className={styles.summaryCard}>
      <div className={styles.summaryContent}>
        <strong>{value}</strong>
        <span>{label}</span>
      </div>

      <div className={styles.summaryIcon}>
        {icon}
      </div>
    </article>
  );
};

/* =====================================
   GRÁFICO DE BARRAS
===================================== */

interface BarChartProps {
  data: AtletaEstatistica[];
}

const BarChart = ({ data }: BarChartProps) => {
  const width = 620;
  const height = 235;

  const paddingLeft = 48;
  const paddingRight = 22;
  const paddingTop = 20;
  const paddingBottom = 42;

  const chartWidth =
    width - paddingLeft - paddingRight;

  const chartHeight =
    height - paddingTop - paddingBottom;

  const maxValue = Math.max(
    ...data.flatMap((item) => [
      item.gols,
      item.assistencias,
    ]),
    30,
  );

  const groups = data.length;

  const groupWidth = chartWidth / groups;

  const barWidth = 28;

  const gridValues = [0, 10, 20, 30];

  return (
    <div className={styles.svgWrapper}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className={styles.chartSvg}
        role="img"
        aria-label="Gráfico de gols e assistências por atleta"
      >
        {gridValues.map((value) => {
          const y =
            paddingTop +
            chartHeight -
            (value / maxValue) *
              chartHeight;

          return (
            <g key={value}>
              <line
                x1={paddingLeft}
                y1={y}
                x2={width - paddingRight}
                y2={y}
                className={styles.gridLine}
              />

              <text
                x={paddingLeft - 12}
                y={y + 4}
                textAnchor="end"
                className={styles.axisText}
              >
                {value}
              </text>
            </g>
          );
        })}

        {data.map((item, index) => {
          const centerX =
            paddingLeft +
            groupWidth * index +
            groupWidth / 2;

          const golsHeight =
            (item.gols / maxValue) *
            chartHeight;

          const assistenciasHeight =
            (item.assistencias /
              maxValue) *
            chartHeight;

          return (
            <g key={item.nome}>
              <rect
                x={
                  centerX -
                  barWidth -
                  2
                }
                y={
                  paddingTop +
                  chartHeight -
                  golsHeight
                }
                width={barWidth}
                height={golsHeight}
                rx={6}
                className={
                  styles.barGoals
                }
              />

              <rect
                x={centerX + 2}
                y={
                  paddingTop +
                  chartHeight -
                  assistenciasHeight
                }
                width={barWidth}
                height={
                  assistenciasHeight
                }
                rx={6}
                className={
                  styles.barAssists
                }
              />

              <text
                x={centerX}
                y={height - 15}
                textAnchor="middle"
                className={
                  styles.categoryText
                }
              >
                {item.nome}
              </text>
            </g>
          );
        })}
      </svg>

      <div className={styles.chartLegend}>
        <span>
          <i className={styles.goalLegend} />
          Gols
        </span>

        <span>
          <i className={styles.assistLegend} />
          Assistências
        </span>
      </div>
    </div>
  );
};

/* =====================================
   GRÁFICO DONUT
===================================== */

interface DonutChartProps {
  data: Acao[];
}

const DonutChart = ({
  data,
}: DonutChartProps) => {
  const radius = 55;

  const circumference =
    2 * Math.PI * radius;

  const total = data.reduce(
    (acc, item) => acc + item.valor,
    0,
  );

  let offset = 0;

  return (
    <div className={styles.donutArea}>
      <svg
        viewBox="0 0 180 180"
        className={styles.donutSvg}
        role="img"
        aria-label="Gráfico de ações por avaliação"
      >
        <circle
          cx="90"
          cy="90"
          r={radius}
          fill="none"
          stroke="#d7e2dd"
          strokeWidth="27"
        />

        {data.map((item) => {
          const percentage =
            item.valor / total;

          const dash =
            percentage * circumference;

          const currentOffset =
            offset;

          offset += dash;

          return (
            <circle
              key={item.nome}
              cx="90"
              cy="90"
              r={radius}
              fill="none"
              stroke={item.cor}
              strokeWidth="27"
              strokeDasharray={`${Math.max(
                dash - 3,
                0,
              )} ${circumference}`}
              strokeDashoffset={
                -currentOffset
              }
              strokeLinecap="round"
              transform="rotate(-90 90 90)"
            />
          );
        })}

        <circle
          cx="90"
          cy="90"
          r="28"
          className={
            styles.donutCenter
          }
        />

        <text
          x="90"
          y="87"
          textAnchor="middle"
          className={
            styles.donutTotal
          }
        >
          {total}
        </text>

        <text
          x="90"
          y="103"
          textAnchor="middle"
          className={
            styles.donutLabel
          }
        >
          ações
        </text>
      </svg>

      <div className={styles.donutLegend}>
        {data.map((item) => (
          <span key={item.nome}>
            <i
              style={{
                background: item.cor,
              }}
            />

            {item.nome}

            <strong>
              {item.valor}%
            </strong>
          </span>
        ))}
      </div>
    </div>
  );
};

/* =====================================
   GRÁFICO DE LINHA
===================================== */

interface LineChartProps {
  data: Evolucao[];
}

const LineChart = ({
  data,
}: LineChartProps) => {
  const width = 1050;
  const height = 255;

  const paddingLeft = 45;
  const paddingRight = 25;
  const paddingTop = 25;
  const paddingBottom = 40;

  const chartWidth =
    width - paddingLeft - paddingRight;

  const chartHeight =
    height - paddingTop - paddingBottom;

  const maxValue = 90;

  const x = (index: number) =>
    paddingLeft +
    (index /
      Math.max(data.length - 1, 1)) *
      chartWidth;

  const y = (value: number) =>
    paddingTop +
    chartHeight -
    (value / maxValue) * chartHeight;

  const equipePoints = data
    .map(
      (item, index) =>
        `${x(index)},${y(
          item.equipe,
        )}`,
    )
    .join(' ');

  const adversarioPoints = data
    .map(
      (item, index) =>
        `${x(index)},${y(
          item.adversarios,
        )}`,
    )
    .join(' ');

  const gridValues = [0, 30, 60, 90];

  return (
    <div className={styles.lineWrapper}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className={styles.lineSvg}
        role="img"
        aria-label="Gráfico de evolução da equipe"
      >
        {gridValues.map((value) => (
          <g key={value}>
            <line
              x1={paddingLeft}
              y1={y(value)}
              x2={width - paddingRight}
              y2={y(value)}
              className={styles.gridLine}
            />

            <text
              x={paddingLeft - 12}
              y={y(value) + 4}
              textAnchor="end"
              className={styles.axisText}
            >
              {value}
            </text>
          </g>
        ))}

        <polyline
          points={adversarioPoints}
          fill="none"
          className={
            styles.opponentLine
          }
        />

        <polyline
          points={equipePoints}
          fill="none"
          className={styles.teamLine}
        />

        {data.map((item, index) => (
          <g key={item.partida}>
            <circle
              cx={x(index)}
              cy={y(item.equipe)}
              r="4"
              className={
                styles.teamPoint
              }
            />

            <circle
              cx={x(index)}
              cy={y(item.adversarios)}
              r="4"
              className={
                styles.opponentPoint
              }
            />

            <text
              x={x(index)}
              y={height - 15}
              textAnchor="middle"
              className={
                styles.categoryText
              }
            >
              {item.partida}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};

export default Estatisticas;