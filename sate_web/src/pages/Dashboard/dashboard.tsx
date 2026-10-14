import {
  BarChart3,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Play,
  Trophy,
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

interface SerieGrafico {
  equipe: number[];
  adversario: number[];
}

interface DadosGrafico {
  'Últimas 7 partidas': SerieGrafico;
  'Últimas 5 partidas': SerieGrafico;
  'Últimas 3 partidas': SerieGrafico;
}

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

interface RespostaErro {
  mensagem?: string;
  erro?: string;
}

// ============================================================
// CONFIGURAÇÃO
// ============================================================

const API_URL = 'http://localhost:3000/api';

const graficoVazio: DadosGrafico = {
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
// FUNÇÕES AUXILIARES
// ============================================================

function obterToken(): string | null {
  return (
    localStorage.getItem('token') ||
    sessionStorage.getItem('token') ||
    localStorage.getItem('accessToken') ||
    sessionStorage.getItem('accessToken')
  );
}

function criarDiasCalendario(ano: number, mes: number) {
  const primeiroDia = new Date(ano, mes, 1);
  const quantidadeDias = new Date(ano, mes + 1, 0).getDate();
  const espacosAntes = (primeiroDia.getDay() + 6) % 7;

  const dias: Array<number | null> = [];

  for (let i = 0; i < espacosAntes; i += 1) {
    dias.push(null);
  }

  for (let dia = 1; dia <= quantidadeDias; dia += 1) {
    dias.push(dia);
  }

  while (dias.length % 7 !== 0) {
    dias.push(null);
  }

  return dias;
}

function capitalizar(texto: string) {
  if (!texto) return texto;

  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

function formatarData(data: string) {
  if (!data) return '—';

  const dataLimpa = data.slice(0, 10);
  const partes = dataLimpa.split('-');

  if (
    partes.length === 3 &&
    partes[0].length === 4
  ) {
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  }

  const dataConvertida = new Date(data);

  if (Number.isNaN(dataConvertida.getTime())) {
    return data;
  }

  return dataConvertida.toLocaleDateString('pt-BR');
}

function obterDataPartida(data: string) {
  if (!data) return null;

  const partes = data.slice(0, 10).split('-');

  if (
    partes.length === 3 &&
    partes[0].length === 4
  ) {
    const ano = Number(partes[0]);
    const mes = Number(partes[1]) - 1;
    const dia = Number(partes[2]);

    const resultado = new Date(ano, mes, dia);

    return Number.isNaN(resultado.getTime())
      ? null
      : resultado;
  }

  const resultado = new Date(data);

  return Number.isNaN(resultado.getTime())
    ? null
    : resultado;
}

function criarLinha(valores: number[]) {
  if (valores.length === 0) return '';

  const largura = 700;
  const altura = 160;

  return valores
    .map((valor, index) => {
      const x =
        valores.length === 1
          ? largura / 2
          : (index * largura) / (valores.length - 1);

      const y = altura - (valor / 100) * altura + 10;

      return `${x},${y}`;
    })
    .join(' ');
}

function renderPoints(
  valores: number[],
  tipo: 'equipe' | 'adversario',
) {
  const largura = 700;
  const altura = 160;

  return valores.map((valor, index) => {
    const x =
      valores.length === 1
        ? largura / 2
        : (index * largura) / (valores.length - 1);

    const y = altura - (valor / 100) * altura + 10;

    return (
      <circle
        key={`${tipo}-${index}`}
        cx={x}
        cy={y}
        r="4"
        className={
          tipo === 'equipe'
            ? styles.teamPoint
            : styles.adversaryPoint
        }
      />
    );
  });
}

function statusClass(status: StatusPartida) {
  if (
    status === 'Finalizada' ||
    status === 'Analisada'
  ) {
    return 'statusDone';
  }

  if (
    status === 'Em andamento' ||
    status === 'Em análise'
  ) {
    return 'statusAnalysis';
  }

  return 'statusPending';
}

// ============================================================
// ÍCONE DE ATIVIDADE
// ============================================================

function ActivityIcon({ tipo }: { tipo: TipoAtividade }) {
  if (tipo === 'video') {
    return (
      <Play
        className={styles.activityIcon}
        size={15}
      />
    );
  }

  if (tipo === 'partida') {
    return (
      <Trophy
        className={styles.activityIcon}
        size={15}
      />
    );
  }

  if (tipo === 'atleta' || tipo === 'equipe') {
    return (
      <Users
        className={styles.activityIcon}
        size={15}
      />
    );
  }

  return (
    <BarChart3
      className={styles.activityIcon}
      size={15}
    />
  );
}

// ============================================================
// DASHBOARD
// ============================================================

export default function Dashboard() {
  const navigate = useNavigate();

  const [dadosDashboard, setDadosDashboard] =
    useState<DashboardResponse | null>(null);

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  const [periodo, setPeriodo] =
    useState<keyof DadosGrafico>('Últimas 7 partidas');

  const [mesCalendario, setMesCalendario] =
    useState(new Date());

  const [diaSelecionado, setDiaSelecionado] =
    useState<number | null>(null);

  // ==========================================================
  // CARREGAR DADOS DA API
  // ==========================================================

  useEffect(() => {
    let ativo = true;

    async function carregarDashboard() {
      try {
        setCarregando(true);
        setErro('');

        const token = obterToken();

        if (!token) {
          navigate('/', { replace: true });
          return;
        }

        const resposta = await fetch(`${API_URL}/dashboard`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const texto = await resposta.text();

        let dados: DashboardResponse & RespostaErro;

        try {
          dados = JSON.parse(texto);
        } catch {
          throw new Error(
            'A API do dashboard não retornou JSON. Confira a rota /api/dashboard no backend.',
          );
        }

        if (resposta.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('accessToken');
          localStorage.removeItem('usuario');

          sessionStorage.removeItem('token');
          sessionStorage.removeItem('accessToken');
          sessionStorage.removeItem('usuario');

          navigate('/', { replace: true });
          return;
        }

        if (!resposta.ok) {
          throw new Error(
            dados.mensagem ||
              dados.erro ||
              `Erro HTTP ${resposta.status}.`,
          );
        }

        if (ativo) {
          setDadosDashboard(dados);

          const calendario = Array.isArray(
            dados.partidasCalendario,
          )
            ? dados.partidasCalendario
            : [];

          const hoje = new Date();
          hoje.setHours(0, 0, 0, 0);

          const proximaPartida =
            calendario.find((partida) => {
              const data = obterDataPartida(partida.data);

              return data !== null && data >= hoje;
            }) || calendario[0];

          if (proximaPartida) {
            const data = obterDataPartida(proximaPartida.data);

            if (data) {
              setMesCalendario(
                new Date(
                  data.getFullYear(),
                  data.getMonth(),
                  1,
                ),
              );

              setDiaSelecionado(data.getDate());
            }
          }
        }
      } catch (error) {
        console.error('Erro ao carregar dashboard:', error);

        if (ativo) {
          setErro(
            error instanceof Error
              ? error.message
              : 'Erro ao carregar o dashboard.',
          );
        }
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }

    carregarDashboard();

    return () => {
      ativo = false;
    };
  }, [navigate]);

  // ==========================================================
  // DADOS DO DASHBOARD
  // ==========================================================

  const resumos = dadosDashboard?.resumos ?? [];
  const atividades = dadosDashboard?.atividades ?? [];
  const partidas = dadosDashboard?.partidas ?? [];
  const partidasCalendario =
    dadosDashboard?.partidasCalendario ?? [];
  const equipes = dadosDashboard?.equipes ?? [];

  const grafico = dadosDashboard?.desempenho ?? graficoVazio;
  const dados = grafico[periodo] ?? graficoVazio[periodo];

  const linhaEquipe = useMemo(
    () => criarLinha(dados.equipe),
    [dados.equipe],
  );

  const linhaAdversario = useMemo(
    () => criarLinha(dados.adversario),
    [dados.adversario],
  );

  // ==========================================================
  // CALENDÁRIO
  // ==========================================================

  const anoAtual = mesCalendario.getFullYear();
  const mesAtual = mesCalendario.getMonth();

  const diasCalendario = useMemo(
    () => criarDiasCalendario(anoAtual, mesAtual),
    [anoAtual, mesAtual],
  );

  const partidasDoMes = useMemo(
    () =>
      partidasCalendario.filter((partida) => {
        const data = obterDataPartida(partida.data);

        return (
          data !== null &&
          data.getFullYear() === anoAtual &&
          data.getMonth() === mesAtual
        );
      }),
    [partidasCalendario, anoAtual, mesAtual],
  );

  const diasComPartida = useMemo(
    () =>
      new Set(
        partidasDoMes.map((partida) => {
          return obterDataPartida(partida.data)!.getDate();
        }),
      ),
    [partidasDoMes],
  );

  const partidasSelecionadas = useMemo(
    () => {
      if (diaSelecionado === null) return [];

      return partidasDoMes.filter((partida) => {
        const data = obterDataPartida(partida.data);

        return data?.getDate() === diaSelecionado;
      });
    },
    [partidasDoMes, diaSelecionado],
  );

  const nomeMes = capitalizar(
    mesCalendario.toLocaleDateString('pt-BR', {
      month: 'long',
      year: 'numeric',
    }),
  );

  function alterarMes(quantidade: number) {
    setMesCalendario((anterior) => {
      return new Date(
        anterior.getFullYear(),
        anterior.getMonth() + quantidade,
        1,
      );
    });

    setDiaSelecionado(null);
  }

  function abrirAtividade(atividade: AtividadeRecente) {
    if (atividade.tipo === 'atleta') {
      navigate('/atletas');
      return;
    }

    if (atividade.tipo === 'equipe') {
      navigate('/equipes');
      return;
    }

    if (atividade.tipo === 'estatistica') {
      navigate('/estatisticas');
      return;
    }

    if (atividade.tipo === 'video') {
      navigate('/videos');
      return;
    }

    navigate('/partidas');
  }

  // ==========================================================
  // ESTADOS DE CARREGAMENTO E ERRO
  // ==========================================================

  if (carregando) {
    return (
      <main className={styles.page}>
        <div className={styles.dashboard}>
          <p>Carregando dashboard...</p>
        </div>
      </main>
    );
  }

  if (erro) {
    return (
      <main className={styles.page}>
        <div className={styles.dashboard}>
          <p>{erro}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
          >
            Tentar novamente
          </button>
        </div>
      </main>
    );
  }

  // ==========================================================
  // TELA PRINCIPAL
  // ==========================================================

  const agora = new Date();

  const mesCabecalho = capitalizar(
    agora.toLocaleDateString('pt-BR', {
      month: 'long',
    }),
  );

  const anoCabecalho = agora.getFullYear();

  return (
    <main className={styles.page}>
      <div className={styles.dashboard}>
        {/* CABEÇALHO */}

        <header className={styles.header}>
          <div>
            <h1>
              Olá, {dadosDashboard?.treinador?.nome || 'Treinador'}
            </h1>

            <p>
              Acompanhe o que está acontecendo com suas equipes.
            </p>
          </div>

          <span className={styles.date}>
            {mesCabecalho}
            <strong>{anoCabecalho}</strong>
          </span>
        </header>

        {/* RESUMOS */}

        <section className={styles.scoreboard}>
          {resumos.map((item) => (
            <button
              key={item.id}
              type="button"
              className={styles.scoreItem}
              onClick={() => navigate(item.rota)}
            >
              <div className={styles.scoreMain}>
                <strong>{item.valor}</strong>
                <span>{item.titulo}</span>
              </div>

              <div className={styles.scoreFooter}>
                <span>{item.detalhe}</span>

                {item.variacao !== 0 && (
                  <small
                    className={
                      item.variacao > 0
                        ? styles.positive
                        : styles.negative
                    }
                  >
                    {item.variacao > 0 ? '+' : ''}
                    {item.variacao}%
                  </small>
                )}
              </div>
            </button>
          ))}
        </section>

        {/* ÁREA PRINCIPAL */}

        <section className={styles.mainArea}>
          <div className={styles.leftColumn}>
            {/* GRÁFICO */}

            <article className={styles.performance}>
              <div className={styles.sectionHeader}>
                <div>
                  <h2>Evolução de desempenho</h2>
                  <p>Sua equipe comparada aos adversários</p>
                </div>

                <div className={styles.period}>
                  <select
                    value={periodo}
                    onChange={(event) =>
                      setPeriodo(
                        event.target.value as keyof DadosGrafico,
                      )
                    }
                  >
                    <option>Últimas 7 partidas</option>
                    <option>Últimas 5 partidas</option>
                    <option>Últimas 3 partidas</option>
                  </select>

                  <ChevronDown size={15} />
                </div>
              </div>

              <div className={styles.chartBody}>
                <div className={styles.axis}>
                  <span>100</span>
                  <span>75</span>
                  <span>50</span>
                  <span>25</span>
                </div>

                <div className={styles.chartArea}>
                  <span className={styles.horizontal1} />
                  <span className={styles.horizontal2} />
                  <span className={styles.horizontal3} />
                  <span className={styles.horizontal4} />

                  <svg
                    viewBox="0 0 700 185"
                    preserveAspectRatio="none"
                  >
                    <polyline
                      points={linhaAdversario}
                      className={styles.adversaryLine}
                    />

                    <polyline
                      points={linhaEquipe}
                      className={styles.teamLine}
                    />

                    {renderPoints(dados.adversario, 'adversario')}
                    {renderPoints(dados.equipe, 'equipe')}
                  </svg>

                  <div className={styles.labels}>
                    {dados.equipe.map((_, index) => (
                      <span key={index}>J{index + 1}</span>
                    ))}
                  </div>
                </div>
              </div>

              <footer className={styles.chartFooter}>
                <span>
                  <i className={styles.teamLegend} />
                  Sua equipe
                </span>

                <span>
                  <i className={styles.adversaryLegend} />
                  Adversário
                </span>
              </footer>
            </article>

            {/* CALENDÁRIO */}

            <article className={styles.calendar}>
              <div className={styles.calendarHeader}>
                <div>
                  <h2>Calendário</h2>
                  <p>Acompanhe as datas das partidas</p>
                </div>

                <CalendarDays size={20} />
              </div>

              <div className={styles.calendarContent}>
                <div className={styles.calendarMain}>
                  <div className={styles.calendarNavigation}>
                    <button
                      type="button"
                      aria-label="Mês anterior"
                      onClick={() => alterarMes(-1)}
                    >
                      <ChevronLeft size={17} />
                    </button>

                    <strong>{nomeMes}</strong>

                    <button
                      type="button"
                      aria-label="Próximo mês"
                      onClick={() => alterarMes(1)}
                    >
                      <ChevronRight size={17} />
                    </button>
                  </div>

                  <div className={styles.calendarWeek}>
                    {diasSemana.map((dia) => (
                      <span key={dia}>{dia}</span>
                    ))}
                  </div>

                  <div className={styles.calendarGrid}>
                    {diasCalendario.map((dia, index) => {
                      if (dia === null) {
                        return (
                          <span
                            key={`vazio-${index}`}
                            className={styles.calendarEmpty}
                          />
                        );
                      }

                      const temPartida = diasComPartida.has(dia);
                      const selecionado = diaSelecionado === dia;

                      return (
                        <button
                          key={dia}
                          type="button"
                          className={`${styles.calendarDay} ${
                            temPartida ? styles.calendarDayMatch : ''
                          } ${
                            selecionado
                              ? styles.calendarDaySelected
                              : ''
                          }`}
                          onClick={() => setDiaSelecionado(dia)}
                        >
                          {dia}
                          {temPartida && <i />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* PARTIDAS DO DIA */}

                <div className={styles.calendarDetails}>
                  <span className={styles.calendarDetailsLabel}>
                    Partidas do dia
                  </span>

                  {partidasSelecionadas.length > 0 ? (
                    partidasSelecionadas.map((partida) => (
                      <button
                        key={partida.id}
                        type="button"
                        className={styles.calendarMatch}
                        onClick={() => navigate('/partidas')}
                      >
                        <div>
                          <span>{partida.modalidade}</span>
                          <strong>{partida.equipe}</strong>
                          <small>vs. {partida.adversario}</small>
                        </div>

                        <ChevronRight size={17} />
                      </button>
                    ))
                  ) : (
                    <div className={styles.calendarNoMatch}>
                      <CalendarDays size={20} />
                      <span>
                        {diaSelecionado
                          ? 'Nenhuma partida nesta data.'
                          : 'Selecione uma data no calendário.'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </article>
          </div>

          {/* COLUNA DIREITA */}

          <div className={styles.rightColumn}>
            {/* ATIVIDADES RECENTES */}

            <aside className={styles.activities}>
              <div className={styles.sectionHeader}>
                <div>
                  <h2>Atividades recentes</h2>
                  <p>Últimas movimentações</p>
                </div>
              </div>

              <div className={styles.activityList}>
                {atividades.map((atividade, index) => (
                  <button
                    key={atividade.id}
                    type="button"
                    className={styles.activity}
                    onClick={() => abrirAtividade(atividade)}
                  >
                    <span className={styles.activityNumber}>
                      {String(index + 1).padStart(2, '0')}
                    </span>

                    <div className={styles.activityContent}>
                      <strong>{atividade.titulo}</strong>
                      <span>{atividade.horario}</span>
                    </div>

                    <ActivityIcon tipo={atividade.tipo} />
                  </button>
                ))}

                {atividades.length === 0 && (
                  <p>Nenhuma atividade recente.</p>
                )}
              </div>
            </aside>

            {/* EQUIPES EM DESTAQUE */}

            <aside className={styles.teams}>
              <div className={styles.sectionHeader}>
                <div>
                  <h2>Equipes em destaque</h2>
                  <p>Desempenho recente</p>
                </div>

                <button
                  type="button"
                  className={styles.link}
                  onClick={() => navigate('/equipes')}
                >
                  Ver equipes
                </button>
              </div>

              <div className={styles.teamList}>
                {equipes.map((equipe, index) => (
                  <button
                    key={equipe.id}
                    type="button"
                    className={styles.team}
                    onClick={() => navigate('/equipes')}
                  >
                    <div className={styles.teamPosition}>
                      {String(index + 1).padStart(2, '0')}
                    </div>

                    <div
                      className={styles.teamBadge}
                      style={
                        equipe.corEquipe
                          ? { backgroundColor: equipe.corEquipe }
                          : undefined
                      }
                    >
                      {equipe.sigla}
                    </div>

                    <div className={styles.teamText}>
                      <strong>{equipe.nome}</strong>
                      <span>{equipe.modalidade}</span>
                    </div>

                    <strong className={styles.teamValue}>
                      {equipe.desempenho}
                      <small>%</small>
                    </strong>
                  </button>
                ))}

                {equipes.length === 0 && (
                  <p>Nenhuma equipe cadastrada.</p>
                )}
              </div>
            </aside>
          </div>
        </section>

        {/* ÚLTIMAS PARTIDAS */}

        <section className={styles.bottomArea}>
          <article className={styles.matches}>
            <div className={styles.sectionHeader}>
              <div>
                <h2>Últimas partidas</h2>
                <p>Resultados mais recentes</p>
              </div>

              <button
                type="button"
                className={styles.link}
                onClick={() => navigate('/partidas')}
              >
                Ver todas
              </button>
            </div>

            <div className={styles.tableWrapper}>
              <table>
                <thead>
                  <tr>
                    <th>Equipes</th>
                    <th>Modalidade</th>
                    <th>Data</th>
                    <th>Placar</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {partidas.map((partida) => (
                    <tr
                      key={partida.id}
                      onClick={() => navigate('/partidas')}
                    >
                      <td>
                        <strong>{partida.equipe}</strong>
                        <span>{partida.adversario}</span>
                      </td>

                      <td>{partida.modalidade}</td>

                      <td>
                        {partida.dataFormatada ||
                          formatarData(partida.data)}
                      </td>

                      <td className={styles.result}>
                        {partida.resultado || '—'}
                      </td>

                      <td>
                        <span
                          className={`${styles.status} ${
                            styles[statusClass(partida.status)]
                          }`}
                        >
                          {partida.status}
                        </span>
                      </td>
                    </tr>
                  ))}

                  {partidas.length === 0 && (
                    <tr>
                      <td colSpan={5} style={{ textAlign: 'center' }}>
                        Nenhuma partida cadastrada.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}