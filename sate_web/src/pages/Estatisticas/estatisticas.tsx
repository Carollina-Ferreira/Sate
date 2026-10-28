import { useMemo, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import styles from './estatisticas.module.css';

interface Resumo {
  gols: number;
  assistencias: number;
  finalizacoes: number;
  posses: number;
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

const dadosPorEquipe: Record<string, DadosEquipe> = {
  falcoes: {
    resumo: { gols: 18, assistencias: 23, finalizacoes: 28, posses: 33 },
    atletas: [
      { nome: 'Rafael', gols: 8, assistencias: 8 },
      { nome: 'Higor', gols: 8, assistencias: 12 },
      { nome: 'Bruno', gols: 25, assistencias: 7 },
    ],
    acoes: [
      { nome: 'Boa', valor: 35, cor: '#005f46' },
      { nome: 'Ruim', valor: 27, cor: '#cf382e' },
      { nome: 'Neutra', valor: 18, cor: '#9aaba4' },
      { nome: 'Destaque', valor: 20, cor: '#f43f78' },
    ],
    evolucao: [
      { partida: 'P1', equipe: 62, adversarios: 70 },
      { partida: 'P2', equipe: 70, adversarios: 66 },
      { partida: 'P3', equipe: 66, adversarios: 72 },
      { partida: 'P4', equipe: 78, adversarios: 64 },
      { partida: 'P5', equipe: 74, adversarios: 68 },
      { partida: 'P6', equipe: 84, adversarios: 66 },
      { partida: 'P7', equipe: 88, adversarios: 70 },
    ],
  },
  poli: {
    resumo: { gols: 22, assistencias: 29, finalizacoes: 36, posses: 41 },
    atletas: [
      { nome: 'Diogo', gols: 13, assistencias: 9 },
      { nome: 'Marcelo', gols: 10, assistencias: 15 },
      { nome: 'Lucas', gols: 18, assistencias: 12 },
    ],
    acoes: [
      { nome: 'Boa', valor: 42, cor: '#005f46' },
      { nome: 'Ruim', valor: 17, cor: '#cf382e' },
      { nome: 'Neutra', valor: 21, cor: '#9aaba4' },
      { nome: 'Destaque', valor: 20, cor: '#f43f78' },
    ],
    evolucao: [
      { partida: 'P1', equipe: 48, adversarios: 43 },
      { partida: 'P2', equipe: 57, adversarios: 51 },
      { partida: 'P3', equipe: 62, adversarios: 46 },
      { partida: 'P4', equipe: 58, adversarios: 54 },
      { partida: 'P5', equipe: 69, adversarios: 57 },
      { partida: 'P6', equipe: 72, adversarios: 62 },
      { partida: 'P7', equipe: 78, adversarios: 64 },
    ],
  },
};

const Estatisticas = () => {
  const [equipe, setEquipe] = useState('falcoes');
  const [atleta, setAtleta] = useState('todos');
  const [periodo, setPeriodo] = useState('30dias');

  const dados = useMemo(() => dadosPorEquipe[equipe], [equipe]);
  const nomeEquipe = equipe === 'falcoes' ? 'Falcões FC' : 'Poli Rugby';

  // O filtro de atleta e o período ficam prontos para serem ligados à API quando ela estiver disponível.
  const atletasExibidos = useMemo(() => {
    if (atleta === 'titulares') return dados.atletas.slice(0, 2);
    if (atleta === 'reservas') return dados.atletas.slice(2);
    return dados.atletas;
  }, [atleta, dados]);

  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <header className={styles.pageHeader}>
          <div>
            <h1>Estatísticas que revelam sua <em>evolução.</em></h1>
            <p>Acompanhe o desempenho da sua equipe e dos atletas.</p>
          </div>
        </header>

        <section className={styles.filters} aria-label="Filtros de estatísticas">
          <FilterSelect label="Equipe" value={equipe} onChange={setEquipe} options={[
            { value: 'falcoes', label: 'Falcões FC' },
            { value: 'poli', label: 'Poli Rugby' },
          ]} />
          <FilterSelect label="Atleta" value={atleta} onChange={setAtleta} options={[
            { value: 'todos', label: 'Todos os atletas' },
            { value: 'titulares', label: 'Titulares' },
            { value: 'reservas', label: 'Reservas' },
          ]} />
          <FilterSelect label="Período" value={periodo} onChange={setPeriodo} options={[
            { value: '30dias', label: 'Últimos 30 dias' },
            { value: '60dias', label: 'Últimos 60 dias' },
            { value: 'temporada', label: 'Temporada' },
          ]} />
        </section>

        <section className={styles.summaryGrid} aria-label="Resumo da equipe">
          <SummaryItem label="Gols" value={dados.resumo.gols} color="green" />
          <SummaryItem label="Assistências" value={dados.resumo.assistencias} color="pink" />
          <SummaryItem label="Finalizações" value={dados.resumo.finalizacoes} color="green" />
          <SummaryItem label="Posses" value={dados.resumo.posses} color="pink" />
        </section>

        <section className={styles.chartsGrid}>
          <article className={styles.chartPanel}>
            <div className={styles.chartHeader}>
              <div>
                <h2>Gols e assistências por atleta</h2>
                <p>{nomeEquipe} <span className={styles.dotGreen}>•</span> <span className={styles.legendGreen}>Gols</span> <span className={styles.dotPink}>•</span> <span className={styles.legendPink}>Assistências</span></p>
              </div>
            </div>
            <BarChart data={atletasExibidos} />
          </article>

          <article className={styles.chartPanel}>
            <div className={styles.chartHeader}>
              <div>
                <h2>Ações por avaliação</h2>
                <p>100 ações no período.</p>
              </div>
            </div>
            <div className={styles.actionList}>
              {dados.acoes.map((acao) => (
                <div className={styles.actionItem} key={acao.nome}>
                  <div className={styles.actionLabel}><span>{acao.nome}</span><strong>{acao.valor}%</strong></div>
                  <div className={styles.progressTrack}>
                    <span style={{ width: `${acao.valor}%`, backgroundColor: acao.cor }} />
                  </div>
                </div>
              ))}
            </div>
          </article>
        </section>

        <article className={`${styles.chartPanel} ${styles.evolutionPanel}`}>
          <div className={styles.chartHeader}>
            <div>
              <h2>Evolução — {nomeEquipe}</h2>
              <p>Histórico recente <span className={styles.dotGreen}>•</span> <span className={styles.legendGreen}>{nomeEquipe}</span> <span className={styles.dotPink}>•</span> <span className={styles.legendPink}>Adversários</span></p>
            </div>
          </div>
          <LineChart data={dados.evolucao} />
        </article>
      </div>
    </main>
  );
};

interface FilterSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}

const FilterSelect = ({ label, value, onChange, options }: FilterSelectProps) => (
  <label className={styles.filterSelect}>
    <span className={styles.srOnly}>{label}</span>
    <select aria-label={label} value={value} onChange={(event) => onChange(event.target.value)}>
      {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
    </select>
    <ChevronDown size={16} aria-hidden="true" className={styles.selectIcon} />
  </label>
);

const SummaryItem = ({ label, value, color }: { label: string; value: number; color: 'green' | 'pink' }) => (
  <div className={styles.summaryItem}>
    <span>{label}</span>
    <strong className={color === 'green' ? styles.valueGreen : styles.valuePink}>{value}</strong>
  </div>
);

const BarChart = ({ data }: { data: AtletaEstatistica[] }) => {
  const width = 620;
  const height = 250;
  const left = 34;
  const right = 12;
  const top = 12;
  const bottom = 38;
  const chartWidth = width - left - right;
  const chartHeight = height - top - bottom;
  const maxValue = Math.max(30, ...data.flatMap((item) => [item.gols, item.assistencias]));
  const groupWidth = chartWidth / Math.max(data.length, 1);
  const barWidth = Math.min(40, groupWidth * 0.2);
  const gridValues = [0, 10, 20, 30];
  return (
    <div className={styles.svgWrapper}>
      <svg viewBox={`0 0 ${width} ${height}`} className={styles.chartSvg} role="img" aria-label="Gráfico de gols e assistências por atleta">
        {gridValues.map((value) => {
          const y = top + chartHeight - (value / maxValue) * chartHeight;
          return <line key={value} x1={left} y1={y} x2={width - right} y2={y} className={styles.gridLine} />;
        })}
        {data.map((item, index) => {
          const center = left + groupWidth * index + groupWidth / 2;
          const goalsHeight = (item.gols / maxValue) * chartHeight;
          const assistsHeight = (item.assistencias / maxValue) * chartHeight;
          return <g key={item.nome}>
            <rect x={center - barWidth - 3} y={top + chartHeight - goalsHeight} width={barWidth} height={Math.max(goalsHeight, 1)} rx="6" className={styles.barGoals} />
            <rect x={center + 3} y={top + chartHeight - assistsHeight} width={barWidth} height={Math.max(assistsHeight, 1)} rx="6" className={styles.barAssists} />
            <text x={center} y={height - 9} textAnchor="middle" className={styles.categoryText}>{item.nome}</text>
          </g>;
        })}
      </svg>
    </div>
  );
};

const LineChart = ({ data }: { data: Evolucao[] }) => {
  const width = 1100;
  const height = 280;
  const left = 38;
  const right = 16;
  const top = 18;
  const bottom = 36;
  const chartWidth = width - left - right;
  const chartHeight = height - top - bottom;
  const maxValue = 100;
  const x = (index: number) => left + (index / Math.max(data.length - 1, 1)) * chartWidth;
  const y = (value: number) => top + chartHeight - (value / maxValue) * chartHeight;
  const teamPoints = data.map((item, index) => `${x(index)},${y(item.equipe)}`).join(' ');
  const opponentPoints = data.map((item, index) => `${x(index)},${y(item.adversarios)}`).join(' ');
  const gridValues = [0, 25, 50, 75, 100];
  return <div className={styles.lineWrapper}>
    <svg viewBox={`0 0 ${width} ${height}`} className={styles.lineSvg} role="img" aria-label="Gráfico de evolução da equipe e dos adversários">
      {gridValues.map((value) => <g key={value}>
        <line x1={left} y1={y(value)} x2={width - right} y2={y(value)} className={styles.gridLine} />
        <text x={left - 10} y={y(value) + 4} textAnchor="end" className={styles.axisText}>{value}</text>
      </g>)}
      <polyline points={opponentPoints} fill="none" className={styles.opponentLine} />
      <polyline points={teamPoints} fill="none" className={styles.teamLine} />
      {data.map((item, index) => <g key={item.partida}>
        <circle cx={x(index)} cy={y(item.equipe)} r="4" className={styles.teamPoint} />
        <text x={x(index)} y={height - 10} textAnchor="middle" className={styles.axisText}>{item.partida}</text>
      </g>)}
    </svg>
  </div>;
};

export default Estatisticas;
