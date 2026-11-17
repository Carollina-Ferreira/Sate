import { useEffect, useMemo, useState } from 'react';
import { ChevronDown, RefreshCw } from 'lucide-react';
import styles from './estatisticas.module.css';

type Equipe = { id: number; nome: string; modalidade?: string };
type AtletaFiltro = { id: number; nome: string };
type AtletaEstatistica = { id: number; nome: string; boas: number; destaques: number; ruins: number; neutras: number };
type Acao = { nome: string; valor: number; quantidade: number };
type Evolucao = { partida: string; adversario: string; data: string; boas: number; ruins: number };
type EstatisticasResposta = {
  equipes: Equipe[];
  equipeId: number | null;
  periodo: string;
  atletasFiltro: AtletaFiltro[];
  resumo: { partidas: number; atletas: number; eventos: number; gols: number | null };
  atletas: AtletaEstatistica[];
  acoes: Acao[];
  evolucao: Evolucao[];
};

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api').replace(/\/+$/, '');
const PERIODOS = [
  { value: '30dias', label: 'Últimos 30 dias' },
  { value: '60dias', label: 'Últimos 60 dias' },
  { value: 'temporada', label: 'Todo o histórico' },
];
const NOMES: Record<string, string> = { boa: 'Boa', ruim: 'Ruim', neutra: 'Neutra', destaque: 'Destaque' };
const CORES: Record<string, string> = { boa: 'var(--verde)', ruim: 'var(--vermelho, #d52941)', neutra: 'var(--texto-suave)', destaque: 'var(--rosa)' };

function obterToken(): string {
  return localStorage.getItem('token') || localStorage.getItem('accessToken') ||
    sessionStorage.getItem('token') || sessionStorage.getItem('accessToken') || '';
}

const Estatisticas = () => {
  const [equipe, setEquipe] = useState('');
  const [atleta, setAtleta] = useState('todos');
  const [periodo, setPeriodo] = useState('30dias');
  const [dados, setDados] = useState<EstatisticasResposta | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [recarregar, setRecarregar] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const buscar = async () => {
      setCarregando(true);
      setErro('');
      try {
        const token = obterToken();
        if (!token) throw new Error('Sessão expirada. Entre novamente no SATE.');
        const params = new URLSearchParams({ periodo, atletaId: atleta });
        if (equipe) params.set('equipeId', equipe);
        const resposta = await fetch(`${API_URL}/estatisticas?${params}`, {
          signal: controller.signal,
          headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
        });
        const json = await resposta.json().catch(() => ({}));
        if (!resposta.ok) throw new Error(json.mensagem || json.erro || `Erro ${resposta.status} na API.`);
        if (!controller.signal.aborted) setDados(json as EstatisticasResposta);
      } catch (error) {
        if (!controller.signal.aborted) {
          setDados(null);
          setErro(error instanceof Error ? error.message : 'Não foi possível consultar a API.');
        }
      } finally {
        if (!controller.signal.aborted) setCarregando(false);
      }
    };
    void buscar();
    return () => controller.abort();
  }, [equipe, atleta, periodo, recarregar]);

  const equipes = dados?.equipes ?? [];
  const equipeAtual = dados?.equipeId == null ? '' : String(dados.equipeId);
  const nomeEquipe = equipes.find(e => String(e.id) === (equipe || equipeAtual))?.nome || 'Equipe';
  const atletasFiltro = dados?.atletasFiltro ?? [];
  const nomeAtleta = atletasFiltro.find(a => String(a.id) === atleta)?.nome;
  const atletas = dados?.atletas ?? [];
  const acoes = dados?.acoes ?? [];
  const evolucao = dados?.evolucao ?? [];
  const quantidadeAcoes = useMemo(() => acoes.reduce((total, item) => total + item.quantidade, 0), [acoes]);

  return (
    <main className={`${styles.page} sate-internal-page`}>
      <div className={styles.content}>
        <header className={styles.pageHeader}>
          <div>
            <h1>Estatísticas que revelam sua <em>evolução.</em></h1>
            <p>Dados reais das partidas e eventos registrados na análise de vídeos.</p>
          </div>
          <button type="button" className={styles.refreshButton} onClick={() => setRecarregar(x => x + 1)} disabled={carregando}>
            <RefreshCw size={16} aria-hidden="true" /> Atualizar
          </button>
        </header>

        <section className={styles.filters} aria-label="Filtros de estatísticas">
          <FilterSelect label="Equipe" value={equipe || equipeAtual} onChange={(id) => { setEquipe(id); setAtleta('todos'); }} options={[
            ...(equipes.length ? [] : [{ value: '', label: 'Nenhuma equipe' }]),
            ...equipes.map(e => ({ value: String(e.id), label: e.nome })),
          ]} />
          <FilterSelect label="Atleta" value={atleta} onChange={setAtleta} options={[
            { value: 'todos', label: 'Todos os atletas' },
            ...atletasFiltro.map(a => ({ value: String(a.id), label: a.nome })),
          ]} />
          <FilterSelect label="Período" value={periodo} onChange={setPeriodo} options={PERIODOS} />
        </section>

        {erro && <div className={styles.messageError} role="alert">{erro} <button type="button" onClick={() => setRecarregar(x => x + 1)}>Tentar novamente</button></div>}
        {carregando && <p className={styles.messageState} role="status">Carregando estatísticas...</p>}
        {!carregando && !erro && dados && (
          <>
            {equipes.length === 0 && <p className={styles.messageState}>Nenhuma equipe cadastrada. Cadastre uma equipe para começar.</p>}
            <section className={styles.summaryGrid} aria-label="Resumo do período">
              <SummaryItem label="Partidas" value={dados.resumo.partidas} color="green" />
              <SummaryItem label="Atletas com eventos" value={dados.resumo.atletas} color="pink" />
              <SummaryItem label="Eventos registrados" value={dados.resumo.eventos} color="green" />
              <SummaryItem label="Gols da equipe" value={dados.resumo.gols == null ? '—' : dados.resumo.gols} color="pink" />
            </section>

            <section className={styles.chartsGrid}>
              <article className={styles.chartPanel}>
                <div className={styles.chartHeader}>
                  <div>
                    <h2>Eventos por atleta</h2>
                    <p>{nomeAtleta || nomeEquipe} <span className={styles.dotGreen}>•</span> <span className={styles.legendGreen}>Boas</span> <span className={styles.dotPink}>•</span> <span className={styles.legendPink}>Destaques</span></p>
                  </div>
                </div>
                {atletas.length ? <BarChart data={atletas} /> : <p className={styles.emptyChart}>Nenhum evento vinculado a atletas neste período.</p>}
              </article>

              <article className={styles.chartPanel}>
                <div className={styles.chartHeader}>
                  <div>
                    <h2>Ações por avaliação</h2>
                    <p>{quantidadeAcoes} eventos classificados no período.</p>
                  </div>
                </div>
                {quantidadeAcoes ? (
                  <div className={styles.actionList}>
                    {acoes.map(acao => (
                      <div className={styles.actionItem} key={acao.nome}>
                        <div className={styles.actionLabel}><span>{NOMES[acao.nome] ?? acao.nome}</span><strong>{acao.quantidade} · {acao.valor}%</strong></div>
                        <div className={styles.progressTrack}><span style={{ width: `${acao.valor}%`, backgroundColor: CORES[acao.nome] || 'var(--verde)' }} /></div>
                      </div>
                    ))}
                  </div>
                ) : <p className={styles.emptyChart}>Nenhuma avaliação registrada para os filtros selecionados.</p>}
              </article>
            </section>

            <article className={`${styles.chartPanel} ${styles.evolutionPanel}`}>
              <div className={styles.chartHeader}>
                <div>
                  <h2>Eventos por partida — {nomeEquipe}</h2>
                  <p>Somente ações registradas <span className={styles.dotGreen}>•</span> <span className={styles.legendGreen}>Boas</span> <span className={styles.dotPink}>•</span> <span className={styles.legendPink}>Ruins</span></p>
                </div>
              </div>
              {evolucao.length ? <LineChart data={evolucao} /> : <p className={styles.emptyChart}>Nenhuma partida encontrada neste período.</p>}
            </article>
          </>
        )}
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
      {options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
    </select>
    <ChevronDown size={16} aria-hidden="true" className={styles.selectIcon} />
  </label>
);
const SummaryItem = ({ label, value, color }: { label: string; value: number | string; color: 'green' | 'pink' }) => (
  <div className={styles.summaryItem}>
    <span>{label}</span>
    <strong className={color === 'green' ? styles.valueGreen : styles.valuePink}>{value}</strong>
  </div>
);
const BarChart = ({ data }: { data: AtletaEstatistica[] }) => {
  const width = 620, height = 250, left = 34, right = 12, top = 12, bottom = 38;
  const chartWidth = width - left - right, chartHeight = height - top - bottom;
  const maxValue = Math.max(1, ...data.flatMap(item => [item.boas, item.destaques]));
  const groupWidth = chartWidth / Math.max(data.length, 1);
  const barWidth = Math.min(36, groupWidth * 0.2);
  const gridValues = [0, 1, 2, 3, 4].map(i => Math.ceil(maxValue * i / 4));
  return <div className={styles.svgWrapper}>
    <svg viewBox={`0 0 ${width} ${height}`} className={styles.chartSvg} role="img" aria-label="Gráfico de eventos bons e destaques por atleta">
      {gridValues.map((value, i) => {
        const y = top + chartHeight - value / maxValue * chartHeight;
        return <line key={i} x1={left} y1={y} x2={width - right} y2={y} className={styles.gridLine} />;
      })}
      {data.map((item, index) => {
        const center = left + groupWidth * index + groupWidth / 2;
        const boasHeight = item.boas / maxValue * chartHeight;
        const destaquesHeight = item.destaques / maxValue * chartHeight;
        return <g key={item.id}>
          <rect x={center - barWidth - 3} y={top + chartHeight - boasHeight} width={barWidth} height={boasHeight} rx="6" className={styles.barGoals} />
          <rect x={center + 3} y={top + chartHeight - destaquesHeight} width={barWidth} height={destaquesHeight} rx="6" className={styles.barAssists} />
          <text x={center} y={height - 9} textAnchor="middle" className={styles.categoryText}>{item.nome.length > 13 ? `${item.nome.slice(0, 12)}…` : item.nome}</text>
        </g>;
      })}
    </svg>
  </div>;
};
const LineChart = ({ data }: { data: Evolucao[] }) => {
  const width = 1100, height = 280, left = 38, right = 16, top = 18, bottom = 36;
  const chartWidth = width - left - right, chartHeight = height - top - bottom;
  const maxValue = Math.max(1, ...data.flatMap(item => [item.boas, item.ruins]));
  const x = (index: number) => left + (index / Math.max(data.length - 1, 1)) * chartWidth;
  const y = (value: number) => top + chartHeight - value / maxValue * chartHeight;
  const teamPoints = data.map((item, index) => `${x(index)},${y(item.boas)}`).join(' ');
  const opponentPoints = data.map((item, index) => `${x(index)},${y(item.ruins)}`).join(' ');
  const gridValues = [0, 1, 2, 3, 4].map(i => Math.ceil(maxValue * i / 4));
  return <div className={styles.lineWrapper}>
    <svg viewBox={`0 0 ${width} ${height}`} className={styles.lineSvg} role="img" aria-label="Evolução de eventos bons e ruins por partida">
      {gridValues.map((value, i) => <g key={i}>
        <line x1={left} y1={y(value)} x2={width - right} y2={y(value)} className={styles.gridLine} />
        <text x={left - 10} y={y(value) + 4} textAnchor="end" className={styles.axisText}>{value}</text>
      </g>)}
      <polyline points={opponentPoints} fill="none" className={styles.opponentLine} />
      <polyline points={teamPoints} fill="none" className={styles.teamLine} />
      {data.map((item, index) => <g key={item.partida}>
        <circle cx={x(index)} cy={y(item.boas)} r="4" className={styles.teamPoint} />
        <text x={x(index)} y={height - 10} textAnchor="middle" className={styles.axisText}>{item.partida}</text>
      </g>)}
    </svg>
  </div>;
};
export default Estatisticas;
