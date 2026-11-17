import { useEffect, useMemo, useState, type MouseEvent } from 'react';
import {
  ArrowLeft, Edit3, Info, Play, Video, TrendingUp,
  Activity, AlertCircle, RefreshCw,
} from 'lucide-react';
import styles from './perfilAtleta.module.css';
import LoadingState from '../../components/ui/LoadingState/LoadingState';

export interface AtletaPerfil {
  id: number;
  nome: string | null;
  cpf?: string | null;
  rg?: string | null;
  dataNascimento?: string | null;
  sexo?: string | null;
  categoria?: string | null;
  telefone?: string | null;
  equipe?: {
    id: number;
    nome: string;
    modalidade: string;
    categoria?: string | null;
  } | null;
  usuario?: {
    id: number;
    nome?: string | null;
    email: string;
    tipo?: string | null;
    avatarUrl?: string | null;
  };
  responsavel?: {
    id: number;
    nome: string;
    grauParentesco: string;
    telefone: string;
  } | null;
  endereco?: {
    id: number;
    cep: string;
    logradouro: string;
    numero: string;
    bairro: string;
    complemento?: string | null;
    cidade?: string | null;
    estado?: string | null;
  } | null;
  documentos?: unknown[];
}

interface PerfilAtletaProps {
  atleta: AtletaPerfil;
  onBack: () => void;
  onEdit: () => void;
  onInformacoes: () => void;
  onClipes: (atleta: AtletaPerfil) => void;
  onPartidas?: () => void;
}

interface ResumoAcoes {
  boas: number;
  ruins: number;
  neutras: number;
  destaques: number;
  total: number;
  partidasComEventos: number;
}

interface EstatisticasPerfil {
  atleta: { id: number; nome: string | null };
  desempenho: number | null;
  resumo: ResumoAcoes;
  evolucao: Array<{
    partida: string;
    partidaId: number;
    adversario: string;
    data: string;
    valor: number | null;
    // O backend ja retorna o resumo individual de cada partida.
    boas?: number;
    ruins?: number;
    neutras?: number;
    destaques?: number;
    total?: number;
  }>;
  atributos: Array<{ nome: string; valor: number }>;
  disponibilidade: { marcacoes: boolean; atributos: boolean };
}

const API_URL = String(
  import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
).replace(/\/$/, '');

function tokenDeAcesso(): string {
  return localStorage.getItem('token') || localStorage.getItem('accessToken') || '';
}

function obterIdade(data?: string | null): number | null {
  if (!data) return null;
  const partes = data.substring(0, 10).split('-').map(Number);
  if (partes.length !== 3) return null;
  const [ano, mes, dia] = partes;
  const nascimento = new Date(ano, mes - 1, dia);
  if (!ano || nascimento.getFullYear() !== ano ||
      nascimento.getMonth() !== mes - 1 || nascimento.getDate() !== dia) return null;
  const hoje = new Date();
  let idade = hoje.getFullYear() - ano;
  if (hoje.getMonth() + 1 < mes ||
      (hoje.getMonth() + 1 === mes && hoje.getDate() < dia)) idade--;
  return idade >= 0 ? idade : null;
}

function limitarPercentual(valor: number): number {
  return Math.max(0, Math.min(100, valor));
}

const EIXO_X_INICIO = 55;
const EIXO_X_FIM = 625;
const EIXO_Y_TOPO = 35;
const EIXO_Y_BASE = 220;

export default function PerfilAtleta({
  atleta, onBack, onEdit, onInformacoes, onClipes, onPartidas,
}: PerfilAtletaProps) {
  const [dados, setDados] = useState<EstatisticasPerfil | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [tentativa, setTentativa] = useState(0);
  const [partidaSelecionadaId, setPartidaSelecionadaId] = useState<number | null>(null);

  useEffect(() => {
    const abortar = new AbortController();
    async function carregar() {
      setCarregando(true);
      setErro('');
      setDados(null);
      setPartidaSelecionadaId(null);
      try {
        if (!Number.isSafeInteger(Number(atleta.id)) || Number(atleta.id) <= 0) {
          throw new Error('ID do atleta inválido.');
        }
        const token = tokenDeAcesso();
        if (!token) throw new Error('Entre na sua conta para consultar as estatísticas.');
        const resposta = await fetch(`${API_URL}/estatisticas/atletas/${atleta.id}`, {
          signal: abortar.signal,
          headers: { Authorization: `Bearer ${token}` },
        });
        const conteudo = await resposta.text();
        let json: unknown;
        try { json = conteudo ? JSON.parse(conteudo) : {}; }
        catch { json = {}; }
        const objeto = json as Partial<EstatisticasPerfil> & { mensagem?: string };
        if (!resposta.ok) {
          throw new Error(objeto.mensagem || `Não foi possível carregar (HTTP ${resposta.status}).`);
        }
        if (!objeto.resumo || !Array.isArray(objeto.evolucao)) {
          throw new Error('A API retornou estatísticas em um formato inesperado.');
        }
        if (!abortar.signal.aborted) setDados(objeto as EstatisticasPerfil);
      } catch (e) {
        if (!abortar.signal.aborted) {
          setErro(e instanceof Error ? e.message : 'Erro ao consultar estatísticas.');
        }
      } finally {
        if (!abortar.signal.aborted) setCarregando(false);
      }
    }
    void carregar();
    return () => abortar.abort();
  }, [atleta.id, tentativa]);

  const nome = atleta.nome || atleta.usuario?.nome || 'Atleta sem nome';
  const iniciais = nome.trim().split(/\s+/).slice(0, 2)
    .map((p) => p.charAt(0)).join('').toUpperCase() || 'AT';
  const idade = obterIdade(atleta.dataNascimento);
  const descricao = [
    atleta.equipe?.nome || 'Sem equipe',
    atleta.categoria || atleta.equipe?.categoria || 'Categoria não informada',
    atleta.equipe?.modalidade || 'Modalidade não informada',
    idade !== null ? `${idade} anos` : null,
  ].filter(Boolean).join(' · ');

  const resumo = dados?.resumo;
  const desempenho = dados?.desempenho ?? null;
  const estatisticas = [
    { titulo: 'Ações boas', valor: resumo?.boas, classe: styles.good },
    { titulo: 'Ações ruins', valor: resumo?.ruins, classe: styles.bad },
    { titulo: 'Ações neutras', valor: resumo?.neutras, classe: styles.neutral },
    { titulo: 'Ações destaque', valor: resumo?.destaques, classe: styles.highlight },
  ];

  const pontos = useMemo(() => {
    const evolucao = (dados?.evolucao || [])
      .filter((item) => item.valor !== null && Number.isFinite(Number(item.valor)))
      .slice(-7);
    return evolucao.map((item, i) => {
      const valor = limitarPercentual(Number(item.valor));
      const x = evolucao.length === 1
        ? (EIXO_X_INICIO + EIXO_X_FIM) / 2
        : EIXO_X_INICIO + (i * (EIXO_X_FIM - EIXO_X_INICIO)) / (evolucao.length - 1);
      const y = EIXO_Y_BASE - (valor / 100) * (EIXO_Y_BASE - EIXO_Y_TOPO);
      return { ...item, valor, x, y };
    });
  }, [dados]);

  const linha = pontos.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const area = pontos.length > 1
    ? `${linha} L ${pontos[pontos.length - 1].x} ${EIXO_Y_BASE} ` +
      `L ${pontos[0].x} ${EIXO_Y_BASE} Z`
    : '';

  // Cada ponto carrega os eventos exclusivamente daquela partida.
  // As contagens ja sao devolvidas por perfilAtletaController.js
  // dentro do array "evolucao".
  const partidaSelecionada =
    pontos.find((ponto) => ponto.partidaId === partidaSelecionadaId) ?? null;

  const temContagensDaPartida =
    partidaSelecionada !== null &&
    ['boas', 'ruins', 'neutras', 'destaques'].every((campo) => {
      const valor = partidaSelecionada[campo as 'boas' | 'ruins' | 'neutras' | 'destaques'];
      return typeof valor === 'number' && Number.isFinite(valor);
    });

  const acoesPartida = temContagensDaPartida && partidaSelecionada
    ? [
        { nome: 'Boas', valor: partidaSelecionada.boas!, classe: styles.acaoBoa },
        { nome: 'Destaques', valor: partidaSelecionada.destaques!, classe: styles.acaoDestaque },
        { nome: 'Neutras', valor: partidaSelecionada.neutras!, classe: styles.acaoNeutra },
        { nome: 'Ruins', valor: partidaSelecionada.ruins!, classe: styles.acaoRuim },
      ]
    : [];

  const totalDaPartida = acoesPartida.reduce((total, acao) => total + acao.valor, 0);

  function selecionarPartida(partidaId: number) {
    // Um segundo clique na mesma bolinha volta ao estado vazio.
    setPartidaSelecionadaId((anterior) =>
      anterior === partidaId ? null : partidaId,
    );
  }

  function editar(evento: MouseEvent<HTMLButtonElement>) {
    evento.preventDefault();
    evento.stopPropagation();
    onEdit();
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <button type="button" className={styles.backButton} onClick={onBack}>
          <ArrowLeft size={17} /> Voltar para atletas
        </button>

        <section className={styles.profileCard}>
          <div className={styles.profileLeft}>
            <div className={styles.avatar}>
              {atleta.usuario?.avatarUrl
                ? <img src={atleta.usuario.avatarUrl} alt={`Foto de ${nome}`} />
                : iniciais}
            </div>
            <div className={styles.nameGroup}>
              <h1>{nome}</h1>
              <p className={styles.metaInfo}>{descricao}</p>
            </div>
          </div>
          <div className={styles.profilePerformance}>
            <strong>{carregando ? '...' : desempenho === null ? '—' : `${desempenho}%`}</strong>
            <span>Taxa de ações positivas</span>
          </div>
        </section>

        {erro && (
          <div className={styles.errorMessage} role="alert">
            <AlertCircle size={18} />
            <span>{erro}</span>
            <button type="button" onClick={() => setTentativa((n) => n + 1)}>
              <RefreshCw size={15} /> Tentar novamente
            </button>
          </div>
        )}

        <nav className={styles.actionsRow} aria-label="Ações do perfil do atleta">
          <button type="button" className={styles.actionButton} onClick={editar}>
            <Edit3 size={17} /> Editar atleta
          </button>
          <button type="button" className={styles.actionButton} onClick={onInformacoes}>
            <Info size={17} /> Informações
          </button>
          <button type="button" className={styles.actionButton}
            onClick={onPartidas} disabled={!onPartidas}>
            <Play size={17} /> Partidas
          </button>
          <button type="button" className={styles.actionButton}
            onClick={() => onClipes(atleta)}>
            <Video size={17} /> Clipes
          </button>
        </nav>

        <section className={styles.statsGrid} aria-label="Estatísticas do atleta">
          {estatisticas.map((item) => (
            <div className={styles.statItem} key={item.titulo}>
              <span className={styles.statLabel}>{item.titulo}</span>
              <strong className={`${styles.statValue} ${item.classe}`}>
                {carregando ? '...' : item.valor ?? '—'}
              </strong>
            </div>
          ))}
        </section>

        {carregando ? (
          <LoadingState
            variant="charts"
            title="Preparando gráficos do atleta..."
            description="Organizando a evolução e as ações por partida."
            count={2}
          />
        ) : (
        <section className={styles.chartsGrid}>
          <article className={styles.chartCard}>
            <div className={styles.chartHeader}>
              <div>
                <span className={styles.chartEyebrow}>DESEMPENHO EM PARTIDAS</span>
                <h2>Evolução ao longo do tempo</h2>
                <p>Porcentagem de ações boas e destaques em cada partida.</p>
              </div>
              <span className={styles.chartIcon}><TrendingUp size={20} /></span>
            </div>
            <div className={styles.chartTopMetrics}>
              <span><i className={styles.metricLegendDot} /> Ações positivas</span>
              <strong className={styles.chartMetricPill}>
                {desempenho === null ? 'Sem dados' : `${desempenho}% no total`}
              </strong>
            </div>
            <div className={styles.lineChartContainer}>
              {pontos.length === 0 ? (
                <div className={styles.chartEmpty} role="status">
                  <Activity size={30} />
                  <strong>{carregando ? 'Carregando evolução...' : 'Nenhuma partida avaliada'}</strong>
                  <p>Registre eventos relacionados a este atleta nos vídeos das partidas.</p>
                </div>
              ) : (
                <svg className={styles.lineChart} viewBox="0 0 680 278"
                  role="img" aria-label={`Evolução em ${pontos.length} partidas`}
                  preserveAspectRatio="xMidYMid meet">
                  <defs>
                    <linearGradient id="areaPerfilSate" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#16A875" stopOpacity="0.24" />
                      <stop offset="100%" stopColor="#16A875" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {[0, 25, 50, 75, 100].map((valor) => {
                    const y = EIXO_Y_BASE - valor / 100 * (EIXO_Y_BASE - EIXO_Y_TOPO);
                    return (
                      <g key={valor}>
                        <line x1={EIXO_X_INICIO} x2={EIXO_X_FIM}
                          y1={y} y2={y} className={styles.gridLine} />
                        <text x="42" y={y + 4} textAnchor="end" className={styles.axisLabel}>
                          {valor}%
                        </text>
                      </g>
                    );
                  })}
                  {pontos.length > 1 && (
                    <>
                      <path d={area} fill="url(#areaPerfilSate)" />
                      <path d={linha} className={styles.dataLine} fill="none" />
                    </>
                  )}
                  {pontos.map((p, i) => {
                    const selecionada = partidaSelecionadaId === p.partidaId;

                    return (
                      <g
                        key={`${p.partidaId}-${i}`}
                        className={styles.partidaClicavel}
                        role="button"
                        tabIndex={0}
                        aria-pressed={selecionada}
                        aria-label={`Ver ações da partida ${p.partida}, contra ${p.adversario || 'adversário'}`}
                        onClick={() => selecionarPartida(p.partidaId)}
                        onKeyDown={(evento) => {
                          if (evento.key === 'Enter' || evento.key === ' ') {
                            evento.preventDefault();
                            selecionarPartida(p.partidaId);
                          }
                        }}
                      >
                        <title>{`Clique para ver as ações: ${p.adversario || p.partida} — ${p.valor}% positivas`}</title>

                        {(i === pontos.length - 1 || selecionada) && (
                          <circle cx={p.x} cy={p.y} r="12" className={styles.pointHalo} />
                        )}

                        {/* Area transparente para facilitar o clique sem mudar o grafico. */}
                        <circle cx={p.x} cy={p.y} r="16" fill="transparent" />

                        <circle
                          cx={p.x}
                          cy={p.y}
                          r={selecionada ? 7 : 5}
                          className={`${styles.dataPoint} ${selecionada ? styles.pontoSelecionado : ''}`}
                        />

                        <text
                          x={p.x}
                          y={Math.max(p.y - 15, 20)}
                          textAnchor="middle"
                          className={styles.pointValue}
                        >
                          {p.valor}%
                        </text>

                        <text x={p.x} y="254" textAnchor="middle" className={styles.axisLabel}>
                          {p.partida}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              )}
            </div>
            <p className={styles.chartFootnote}>
              {pontos.length === 1
                ? 'Uma partida avaliada. A evolução aparecerá após a próxima.'
                : 'Clique em uma bolinha do gráfico para ver as ações daquela partida.'}
            </p>
          </article>

          {/* DISTRIBUICAO DAS ACOES — VAZIA ATE SELECIONAR UMA PARTIDA */}
          <article className={styles.chartCard}>
            <div className={styles.chartHeader}>
              <div>
                <span className={styles.chartEyebrow}>AÇÕES POR PARTIDA</span>
                <h2>Distribuição das ações</h2>
                <p>
                  {partidaSelecionada
                    ? `${partidaSelecionada.partida} · ${partidaSelecionada.adversario || 'Partida selecionada'}`
                    : 'Selecione uma bolinha no gráfico ao lado.'}
                </p>
              </div>
              <span className={styles.chartIcon}><Activity size={20} /></span>
            </div>

            <div className={styles.radarContainer}>
              {!partidaSelecionada ? (
                <div className={styles.chartEmpty} role="status">
                  <Activity size={30} />
                  <strong>Nenhuma partida selecionada</strong>
                  <p>Clique em um ponto do gráfico de evolução para ver quantas ações boas, ruins, neutras e destaques aconteceram naquela partida.</p>
                </div>
              ) : !temContagensDaPartida ? (
                <div className={styles.chartEmpty} role="status">
                  <AlertCircle size={30} />
                  <strong>Contagens não disponíveis</strong>
                  <p>O backend precisa retornar boas, ruins, neutras e destaques em cada item de evolução. Não é possível calcular essas quantidades pelo percentual.</p>
                </div>
              ) : (
                <div className={styles.actionsBreakdown} key={partidaSelecionada.partidaId}>
                  <div className={styles.actionsTotal}>
                    <strong>{totalDaPartida}</strong>
                    <span>ações nesta partida</span>
                  </div>

                  {acoesPartida.map((item) => (
                    <div className={styles.actionRow} key={item.nome}>
                      <div className={styles.actionRowHeading}>
                        <span>{item.nome}</span>
                        <strong>{item.valor}</strong>
                      </div>

                      <div
                        className={styles.actionTrack}
                        role="progressbar"
                        aria-label={`${item.nome}: ${item.valor} ações nessa partida`}
                        aria-valuemin={0}
                        aria-valuemax={totalDaPartida}
                        aria-valuenow={item.valor}
                      >
                        <div
                          className={`${styles.actionFill} ${item.classe}`}
                          style={{ width: `${totalDaPartida > 0 ? (item.valor / totalDaPartida) * 100 : 0}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <p className={styles.chartFootnote}>
              {partidaSelecionada
                ? 'Clique em outra bolinha para comparar as partidas. Clique novamente na selecionada para limpar.'
                : 'As contagens serão exibidas apenas para a partida que você escolher.'}
            </p>
          </article>
        </section>
        )}
      </main>
    </div>
  );
}
