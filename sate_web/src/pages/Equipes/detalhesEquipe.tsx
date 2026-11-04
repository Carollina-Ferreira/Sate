import {
  ArrowLeft,
  PlayCircle,
  Trophy,
  Users,
} from 'lucide-react';

import type {
  ReactNode,
} from 'react';

import styles from './detalhesEquipe.module.css';


/* ============================================================
   TIPOS
============================================================ */

interface AtletaAPI {
  id: number | string;
  nome?: string | null;
  categoria?: string | null;
  posicao?: string | null;
  idade?: number | null;
  desempenho?: number | null;

  usuario?: {
    nome?: string | null;
    email?: string | null;
    avatarUrl?: string | null;
  } | null;
}


interface EquipeCompat {
  id: number | string;
  nome: string;
  sigla?: string;
  modalidade?: string;
  categoria?: string;

  cor?: string | null;
  corEquipe?: string | null;

  vitorias?: number;
  derrotas?: number;

  // Aceita tanto número quanto texto.
  empates?: number | string;

  videos?: number;
  desempenho?: number;

  atletas?: number | AtletaAPI[];
  atletasDetalhes?: AtletaAPI[];
  elenco?: AtletaAPI[];

  numeroAtletas?: number;
  evolucao?: number[];
}


interface AtletaElenco {
  id: number | string;
  nome: string;
  posicao: string;
  idade: number | null;
  desempenho: number;
}


interface DetalhesEquipeProps {
  equipe: EquipeCompat;
  onBack: () => void;
}


interface SummaryCardProps {
  icon: ReactNode;
  label: string;
  value: string;
}


interface StatRowProps {
  label: string;
  value: string;
}


interface PerformanceChartProps {
  values: number[];
  color: string;
}


/* ============================================================
   COMPONENTE PRINCIPAL
============================================================ */

const DetalhesEquipe = ({
  equipe,
  onBack,
}: DetalhesEquipeProps) => {
  const dados = equipe;


  /* ============================================================
     ATLETAS
  ============================================================ */

  const atletasRecebidos: AtletaAPI[] =
    Array.isArray(dados.atletas)
      ? dados.atletas
      : Array.isArray(dados.atletasDetalhes)
        ? dados.atletasDetalhes
        : Array.isArray(dados.elenco)
          ? dados.elenco
          : [];


  const elenco: AtletaElenco[] =
    atletasRecebidos.map(
      (atleta, index) => ({
        id: atleta.id ?? index,

        nome:
          atleta.nome?.trim() ||
          atleta.usuario?.nome?.trim() ||
          atleta.usuario?.email?.trim() ||
          `Atleta ${index + 1}`,

        posicao:
          atleta.posicao?.trim() ||
          atleta.categoria?.trim() ||
          'Não informada',

        idade:
          typeof atleta.idade === 'number'
            ? atleta.idade
            : null,

        desempenho: Math.min(
          100,
          Math.max(
            0,
            Number(atleta.desempenho ?? 0) || 0
          )
        ),
      })
    );


  /* ============================================================
     QUANTIDADE DE ATLETAS
  ============================================================ */

  const totalInformado =
    Array.isArray(dados.atletas)
      ? dados.atletas.length
      : Number(dados.atletas ?? 0) || 0;


  const totalAtletas = Math.max(
    elenco.length,

    Number(dados.numeroAtletas ?? 0) || 0,

    totalInformado,

    Array.isArray(dados.atletasDetalhes)
      ? dados.atletasDetalhes.length
      : 0,

    Array.isArray(dados.elenco)
      ? dados.elenco.length
      : 0
  );


  /* ============================================================
     ESTATÍSTICAS
  ============================================================ */

  const cor =
    dados.corEquipe ||
    dados.cor ||
    '#16A875';


  const vitorias =
    Number(dados.vitorias ?? 0);


  const derrotas =
    Number(dados.derrotas ?? 0);


  const empatesNumero =
    Number(dados.empates ?? 0);


  const empatesValidos =
    Number.isFinite(empatesNumero)
      ? empatesNumero
      : 0;


  const videos =
    Number(dados.videos ?? 0);


  const desempenho = Math.min(
    100,
    Math.max(
      0,
      Number(dados.desempenho ?? 0) || 0
    )
  );


  const evolucao =
    Array.isArray(dados.evolucao)
      ? dados.evolucao
          .map((valor) => Number(valor) || 0)
          .map((valor) =>
            Math.min(
              100,
              Math.max(0, valor)
            )
          )
      : [];


  const recorde =
    `${vitorias}V • ${derrotas}D • ${empatesValidos}E`;


  /* ============================================================
     RENDERIZAÇÃO
  ============================================================ */

  return (
    <main className={styles.page}>

      {/* VOLTAR */}

      <button
        type="button"
        className={styles.backButton}
        onClick={onBack}
      >
        <ArrowLeft size={17} />
        Voltar para equipes
      </button>


      {/* CABEÇALHO DA EQUIPE */}

      <section className={styles.teamHero}>
        <div className={styles.teamIdentity}>
          <div
            className={styles.avatar}
            style={{
              background: cor,
            }}
          >
            {dados.sigla ||
              dados.nome.slice(0, 2).toUpperCase()}
          </div>

          <div className={styles.teamInformation}>
            <span className={styles.heroLabel}>
              EQUIPE
            </span>

            <h1>
              {dados.nome}
            </h1>

            <div className={styles.teamMeta}>
              <span>
                {dados.modalidade ||
                  'Modalidade não informada'}
              </span>

              <i />

              <span>
                {dados.categoria ||
                  'Categoria não informada'}
              </span>

              <i />

              <span>
                {totalAtletas}{' '}
                {totalAtletas === 1
                  ? 'atleta'
                  : 'atletas'}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.performance}>
          <strong>
            {desempenho}%
          </strong>

          <span>
            desempenho geral
          </span>
        </div>
      </section>


      {/* RESUMO */}

      <section className={styles.summaryGrid}>
        <SummaryCard
          icon={<Trophy size={18} />}
          label="Vitórias"
          value={String(vitorias)}
        />

        <SummaryCard
          icon={<Users size={18} />}
          label="Atletas"
          value={String(totalAtletas)}
        />

        <SummaryCard
          icon={<PlayCircle size={18} />}
          label="Vídeos"
          value={String(videos)}
        />
      </section>


      {/* DESEMPENHO E ESTATÍSTICAS */}

      <section className={styles.infoGrid}>
        <article className={styles.card}>
          <div className={styles.cardHeader}>
            <div>
              <span>
                ÚLTIMAS PARTIDAS
              </span>

              <h2>
                Desempenho recente
              </h2>
            </div>

            <strong>
              {desempenho}%
            </strong>
          </div>

          {evolucao.length > 0 ? (
            <PerformanceChart
              values={evolucao}
              color={cor}
            />
          ) : (
            <p className={styles.emptyMessage}>
              Não há dados de evolução disponíveis no momento.
            </p>
          )}
        </article>


        <article className={styles.card}>
          <div className={styles.cardHeader}>
            <div>
              <span>
                RESUMO
              </span>

              <h2>
                Estatísticas gerais
              </h2>
            </div>
          </div>

          <div className={styles.generalStats}>
            <StatRow
              label="Recorde"
              value={recorde}
            />

            <StatRow
              label="Modalidade"
              value={dados.modalidade || 'Não informada'}
            />

            <StatRow
              label="Atletas ativos"
              value={String(totalAtletas)}
            />

            <StatRow
              label="Vídeos relacionados"
              value={String(videos)}
            />
          </div>
        </article>
      </section>


      {/* ELENCO */}

      <section
        className={`${styles.card} ${styles.squadCard}`}
      >
        <div className={styles.cardHeader}>
          <div>
            <span>
              JOGADORES
            </span>

            <h2>
              Elenco
            </h2>
          </div>

          <span className={styles.playerCount}>
            {elenco.length}{' '}
            {elenco.length === 1
              ? 'atleta listado'
              : 'atletas listados'}
          </span>
        </div>


        {elenco.length > 0 ? (
          <div className={styles.table}>
            <div className={styles.tableHeader}>
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


            {elenco.map((atleta) => (
              <div
                key={atleta.id}
                className={styles.tableRow}
              >
                <div className={styles.player}>
                  <div
                    className={styles.playerAvatar}
                    style={{
                      background: cor,
                    }}
                  >
                    {getInitials(atleta.nome)}
                  </div>

                  <strong>
                    {atleta.nome}
                  </strong>
                </div>


                <span>
                  {atleta.posicao}
                </span>


                <span>
                  {atleta.idade !== null
                    ? `${atleta.idade} anos`
                    : 'Não informada'}
                </span>


                <div className={styles.performanceCell}>
                  <strong>
                    {atleta.desempenho}%
                  </strong>

                  <div className={styles.miniProgress}>
                    <div
                      style={{
                        width: `${atleta.desempenho}%`,
                        background: cor,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptySquad}>
            <Users size={32} />

            <h3>
              Nenhum atleta encontrado
            </h3>

            <p>
              {totalAtletas > 0
                ? `O sistema informa ${totalAtletas} atleta(s), mas não recebeu a lista individual. Verifique se a resposta de GET /api/equipes contém a propriedade atletas e se equipes.tsx preserva essa lista.`
                : 'Esta equipe ainda não possui atletas vinculados.'}
            </p>
          </div>
        )}
      </section>
    </main>
  );
};


/* ============================================================
   CARD DE RESUMO
============================================================ */

const SummaryCard = ({
  icon,
  label,
  value,
}: SummaryCardProps) => (
  <article className={styles.summaryCard}>
    <div className={styles.summaryIcon}>
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


/* ============================================================
   LINHA DE ESTATÍSTICA
============================================================ */

const StatRow = ({
  label,
  value,
}: StatRowProps) => (
  <div className={styles.statRow}>
    <span>
      {label}
    </span>

    <strong>
      {value}
    </strong>
  </div>
);


/* ============================================================
   GRÁFICO DE DESEMPENHO
============================================================ */

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
    width - paddingLeft - paddingRight;

  const chartHeight =
    height - paddingTop - paddingBottom;


  const x = (index: number) =>
    paddingLeft +
    (index / Math.max(values.length - 1, 1)) *
      chartWidth;


  const y = (value: number) =>
    paddingTop +
    chartHeight -
    (value / 100) * chartHeight;


  const points = values
    .map(
      (value, index) =>
        `${x(index)},${y(value)}`
    )
    .join(' ');


  return (
    <div className={styles.chartWrapper}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className={styles.chart}
        role="img"
        aria-label="Gráfico de desempenho recente"
      >
        {[0, 30, 60, 90].map((value) => (
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
              className={styles.axisLabel}
            >
              {value}
            </text>
          </g>
        ))}


        {values.length > 1 && (
          <polyline
            points={points}
            fill="none"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}


        {values.map((value, index) => (
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
              y={height - 8}
              textAnchor="middle"
              className={styles.axisLabel}
            >
              P{index + 1}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};


/* ============================================================
   INICIAIS DO ATLETA
============================================================ */

const getInitials = (
  nome: string
): string => {
  const partes = nome
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (partes.length === 0) {
    return 'AT';
  }

  if (partes.length === 1) {
    return partes[0]
      .slice(0, 2)
      .toUpperCase();
  }

  return (
    partes[0][0] +
    partes[partes.length - 1][0]
  ).toUpperCase();
};


export default DetalhesEquipe;