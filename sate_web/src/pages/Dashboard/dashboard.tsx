import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './dashboard.module.css';

const meses = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

const partidas = [
  {
    equipes: 'Falcões FC vs Tigres FC',
    modalidade: 'Futebol',
    data: '18/08/26',
    resultado: '3 - 1',
    status: 'Analisada',
    statusClass: 'analisada',
  },
  {
    equipes: 'Águias B. vs Panteras B.',
    modalidade: 'Basquete',
    data: '15/08/26',
    resultado: '88 - 76',
    status: 'Analisada',
    statusClass: 'analisada',
  },
  {
    equipes: 'Fúria Vôlei vs Ventania',
    modalidade: 'Vôlei',
    data: '12/08/26',
    resultado: '3 - 2',
    status: 'Análise',
    statusClass: 'analise',
  },
  {
    equipes: 'Leões Rugby vs Torgus',
    modalidade: 'Rugby',
    data: '09/08/26',
    resultado: '21 - 24',
    status: 'Pendente',
    statusClass: 'pendente',
  },
];

const atividades = [
  {
    tipo: 'pink',
    texto: 'Vídeo Falcões FC x Tigres FC analisado',
    tempo: 'há 2 horas',
  },
  {
    tipo: 'green',
    texto: 'Nova partida Fúria Vôlei x Ventania adicionada',
    tempo: 'há 5 horas',
  },
  {
    tipo: 'pink',
    texto: 'Perfil de Carla Mendes atualizado',
    tempo: 'ontem',
  },
];

const equipes = [
  {
    nome: 'Falcões FC',
    porcentagem: '78%',
    classe: 'light',
  },
  {
    nome: 'Águias Basquete',
    porcentagem: '65%',
    classe: 'medium',
  },
  {
    nome: 'Fúria Vôlei',
    porcentagem: '82%',
    classe: 'dark',
  },
];

function gerarDiasDoMes(ano: number, mes: number) {
  const primeiroDia = new Date(ano, mes, 1).getDay();
  const quantidadeDias = new Date(ano, mes + 1, 0).getDate();

  const dias: (number | null)[] = [];

  for (let i = 0; i < primeiroDia; i++) {
    dias.push(null);
  }

  for (let dia = 1; dia <= quantidadeDias; dia++) {
    dias.push(dia);
  }

  while (dias.length % 7 !== 0) {
    dias.push(null);
  }

  return dias;
}

function Dashboard() {
  const navigate = useNavigate();

  const [mesAtual, setMesAtual] = useState(8);
  const [anoAtual, setAnoAtual] = useState(2026);
  const [diaSelecionado, setDiaSelecionado] = useState(18);

  const diasDoMes = gerarDiasDoMes(anoAtual, mesAtual);

  function mesAnterior() {
    if (mesAtual === 0) {
      setMesAtual(11);
      setAnoAtual(anoAtual - 1);
    } else {
      setMesAtual(mesAtual - 1);
    }

    setDiaSelecionado(0);
  }

  function proximoMes() {
    if (mesAtual === 11) {
      setMesAtual(0);
      setAnoAtual(anoAtual + 1);
    } else {
      setMesAtual(mesAtual + 1);
    }

    setDiaSelecionado(0);
  }

  function abrirPartida(partida: (typeof partidas)[number]) {
    alert(
      `Partida selecionada:\n\n${partida.equipes}\n${partida.modalidade}\n${partida.data}\nResultado: ${partida.resultado}`,
    );
  }

  function abrirAtividade(texto: string) {
    alert(texto);
  }

  function abrirEquipe(nome: string) {
    alert(`Equipe selecionada: ${nome}`);
  }

  return (
    <main className={styles.page}>
      <section className={styles.content}>
        <div className={styles.welcome}>
          <h1>Olá, treinador Marcelo</h1>

          <p>
            Acompanhe o desempenho dos seus da sua equipe e analise seus
            resultados
          </p>
        </div>

        <section className={styles.kpiGrid}>
          <button
            type="button"
            className={`${styles.kpiCard} ${styles.kpiMint}`}
            onClick={() => navigate('/atletas')}
          >
            <div className={`${styles.kpiIcon} ${styles.kpiIconMint}`}>
              <span>♙</span>
            </div>

            <div className={styles.kpiTop}>
              <span>Atletas</span>
              <span className={styles.kpiBadge}>80%</span>
            </div>

            <strong className={styles.kpiValue}>66</strong>
          </button>

          <button
            type="button"
            className={`${styles.kpiCard} ${styles.kpiPink}`}
            onClick={() => navigate('/equipes')}
          >
            <div className={`${styles.kpiIcon} ${styles.kpiIconPink}`}>
              <span>♟</span>
            </div>

            <div className={styles.kpiTop}>
              <span>Equipes</span>
              <span className={styles.kpiBadge}>66%</span>
            </div>

            <strong className={`${styles.kpiValue} ${styles.valuePink}`}>
              4
            </strong>
          </button>

          <button
            type="button"
            className={`${styles.kpiCard} ${styles.kpiMint}`}
            onClick={() => navigate('/partidas')}
          >
            <div className={`${styles.kpiIcon} ${styles.kpiIconBlue}`}>
              <span>🏆</span>
            </div>

            <div className={styles.kpiTop}>
              <span>Partidas</span>
              <span className={styles.kpiBadge}>44%</span>
            </div>

            <strong className={styles.kpiValue}>46</strong>
          </button>

          <button
            type="button"
            className={`${styles.kpiCard} ${styles.kpiPink}`}
            onClick={() => navigate('/estatisticas')}
          >
            <div className={`${styles.kpiIcon} ${styles.kpiIconPink}`}>
              <span>⌁</span>
            </div>

            <div className={styles.kpiTop}>
              <span>Desempenho</span>
              <span className={styles.kpiBadge}>-5%</span>
            </div>

            <strong className={`${styles.kpiValue} ${styles.valuePink}`}>
              5
            </strong>
          </button>
        </section>

        <section className={styles.mainGrid}>
          <div className={styles.leftColumn}>
            <article className={`${styles.card} ${styles.calendarCard}`}>
              <div className={styles.calendarHeader}>
                <button
                  type="button"
                  onClick={mesAnterior}
                  aria-label="Mês anterior"
                >
                  ‹
                </button>

                <h2>
                  {meses[mesAtual]} {anoAtual}
                </h2>

                <button
                  type="button"
                  onClick={proximoMes}
                  aria-label="Próximo mês"
                >
                  ›
                </button>
              </div>

              <div className={styles.calendarWeek}>
                <span>D</span>
                <span>S</span>
                <span>T</span>
                <span>Q</span>
                <span>Q</span>
                <span>S</span>
                <span>S</span>
              </div>

              <div className={styles.calendarDays}>
                {diasDoMes.map((dia, index) => (
                  <div
                    key={`${dia}-${index}`}
                    className={
                      dia !== null && dia === diaSelecionado
                        ? styles.selectedDay
                        : ''
                    }
                    onClick={() => {
                      if (dia !== null) {
                        setDiaSelecionado(dia);
                      }
                    }}
                    style={{
                      cursor: dia !== null ? 'pointer' : 'default',
                    }}
                  >
                    {dia}
                  </div>
                ))}
              </div>
            </article>

            <article className={`${styles.card} ${styles.matchesCard}`}>
              <h2>Ultimas partidas</h2>

              <div className={styles.tableWrapper}>
                <table>
                  <thead>
                    <tr>
                      <th>EQUIPES</th>
                      <th>MODALIDADE</th>
                      <th>DATA</th>
                      <th>RESULTADO</th>
                      <th>STATUS</th>
                    </tr>
                  </thead>

                  <tbody>
                    {partidas.map((partida) => (
                      <tr
                        key={partida.equipes}
                        onClick={() => abrirPartida(partida)}
                        style={{ cursor: 'pointer' }}
                      >
                        <td>{partida.equipes}</td>
                        <td>{partida.modalidade}</td>
                        <td>{partida.data}</td>
                        <td>{partida.resultado}</td>
                        <td>
                          <span
                            className={`${styles.status} ${
                              styles[partida.statusClass]
                            }`}
                          >
                            {partida.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>
          </div>

          <aside className={styles.rightColumn}>
            <article
              className={`${styles.card} ${styles.activitiesCard}`}
            >
              <h2>Atividades recentes</h2>

              <div className={styles.activityList}>
                {atividades.map((atividade, index) => (
                  <div
                    className={styles.activity}
                    key={index}
                    onClick={() => abrirAtividade(atividade.texto)}
                    style={{ cursor: 'pointer' }}
                  >
                    <span
                      className={`${styles.activityIcon} ${
                        atividade.tipo === 'pink'
                          ? styles.activityPink
                          : styles.activityGreen
                      }`}
                    >
                      {atividade.tipo === 'green' ? '🏆' : ''}
                    </span>

                    <div>
                      <p>{atividade.texto}</p>
                      <small>{atividade.tempo}</small>
                    </div>
                  </div>
                ))}
              </div>
            </article>

            <article className={`${styles.card} ${styles.teamsCard}`}>
              <h2>Equipes em destaque</h2>

              <div className={styles.teamList}>
                {equipes.map((equipe) => (
                  <div
                    className={styles.featuredTeam}
                    key={equipe.nome}
                    onClick={() => abrirEquipe(equipe.nome)}
                    style={{ cursor: 'pointer' }}
                  >
                    <span
                      className={`${styles.teamCircle} ${
                        styles[equipe.classe]
                      }`}
                    />

                    <span className={styles.teamName}>
                      {equipe.nome}
                    </span>

                    <span className={styles.teamPercentage}>
                      {equipe.porcentagem}
                    </span>
                  </div>
                ))}
              </div>
            </article>

            <article className={`${styles.card} ${styles.chartCard}`}>
              <h2>Evolução de desempenho</h2>

              <div className={styles.chart}>
                <div className={styles.chartYAxis}>
                  <span>20 mil</span>
                  <span>15 mil</span>
                  <span>10 mil</span>
                  <span>5 mil</span>
                  <span>0</span>
                </div>

                <svg
                  className={styles.chartSvg}
                  viewBox="0 0 500 220"
                  preserveAspectRatio="none"
                >
                  <line x1="45" y1="20" x2="490" y2="20" />
                  <line x1="45" y1="65" x2="490" y2="65" />
                  <line x1="45" y1="110" x2="490" y2="110" />
                  <line x1="45" y1="155" x2="490" y2="155" />
                  <line x1="45" y1="200" x2="490" y2="200" />

                  <polyline
                    points="45,150 190,105 335,125 490,30"
                    fill="none"
                    stroke="#3385ff"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  <polyline
                    points="45,175 190,165 335,100 490,100"
                    fill="none"
                    stroke="#00b074"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  <circle cx="45" cy="150" r="4" fill="#3385ff" />
                  <circle cx="190" cy="105" r="4" fill="#3385ff" />
                  <circle cx="335" cy="125" r="4" fill="#3385ff" />
                  <circle cx="490" cy="30" r="4" fill="#3385ff" />

                  <circle cx="45" cy="175" r="4" fill="#00b074" />
                  <circle cx="190" cy="165" r="4" fill="#00b074" />
                  <circle cx="335" cy="100" r="4" fill="#00b074" />
                  <circle cx="490" cy="100" r="4" fill="#00b074" />
                </svg>

                <div className={styles.chartXAxis}>
                  <span>P1</span>
                  <span>P2</span>
                  <span>P3</span>
                  <span>P4</span>
                </div>
              </div>

              <div className={styles.chartLegend}>
                <span>
                  <i className={styles.legendGreen}></i>
                  Adversários
                </span>

                <span>
                  <i className={styles.legendBlue}></i>
                  Sua equipe
                </span>
              </div>
            </article>
          </aside>
        </section>
      </section>
    </main>
  );
}

export default Dashboard;