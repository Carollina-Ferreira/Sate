import styles from './dashboard.module.css';

const partidas = [
  {
    equipes: 'Falcões FC vs Tigres FC',
    modalidade: 'Futebol',
    data: '18/08/26',
    resultado: '3 - 1',
    status: 'Analisada',
    tipo: 'analisada',
  },
  {
    equipes: 'Águias B. vs Panteras B.',
    modalidade: 'Basquete',
    data: '15/08/26',
    resultado: '88 - 76',
    status: 'Analisada',
    tipo: 'analisada',
  },
  {
    equipes: 'Fúria Vôlei vs Ventania',
    modalidade: 'Vôlei',
    data: '12/08/26',
    resultado: '3 - 2',
    status: 'Análise',
    tipo: 'analise',
  },
  {
    equipes: 'Leões Rugby vs Torgus',
    modalidade: 'Rugby',
    data: '09/08/26',
    resultado: '21 - 24',
    status: 'Pendente',
    tipo: 'pendente',
  },
];

const atividades = [
  {
    icone: 'videocam',
    texto: 'Vídeo Falcões FC x Tigres FC analisado',
    tempo: 'há 2 horas',
    tipo: 'rosa',
  },
  {
    icone: 'emoji_events',
    texto: 'Nova partida Fúria Vôlei x Ventania adicionada',
    tempo: 'há 5 horas',
    tipo: 'verde',
  },
  {
    icone: 'person',
    texto: 'Perfil de Carla Mendes atualizado',
    tempo: 'ontem',
    tipo: 'rosa',
  },
];

const equipes = [
  {
    nome: 'Falcões FC',
    porcentagem: '78%',
    classe: 'verde',
  },
  {
    nome: 'Águias Basquete',
    porcentagem: '65%',
    classe: 'escuro',
  },
  {
    nome: 'Fúria Vôlei',
    porcentagem: '82%',
    classe: 'escuro',
  },
];

const dias = Array.from({ length: 30 }, (_, index) => index + 1);

const semanas = [
  [null, null, 1, 2, 3, 4, 5],
  [6, 7, 8, 9, 10, 11, 12],
  [13, 14, 15, 16, 17, 18, 19],
  [20, 21, 22, 23, 24, 25, 26],
  [27, 28, 29, 30, null, null, null],
];

const pontosSuaEquipe =
  'M0,92 C55,82 75,72 120,78 C165,84 185,58 230,60 C275,62 305,38 350,42';

const pontosAdversarios =
  'M0,78 C55,88 75,92 120,82 C165,72 185,78 230,70 C275,62 305,72 350,58';

const Dashboard = () => {
  return (
    <div className={styles.page}>

      {/* SAUDAÇÃO */}
      <section className={styles.welcome}>
        <div>
          <h1>Olá, treinador Marcelo</h1>

          <p>
            Acompanhe o desempenho dos seus da sua equipe e analise seus resultados.
          </p>
        </div>
      </section>

      {/* KPIs */}
      <section className={styles.metrics}>

        <div className={styles.metricCard}>
          <div className={`${styles.metricIcon} ${styles.greenIcon}`}>
            <span className="material-icons">person</span>
          </div>

          <div className={styles.metricInfo}>
            <span>Atletas</span>
            <strong>66</strong>
          </div>

          <span className={styles.positive}>66%</span>
        </div>

        <div className={styles.metricCard}>
          <div className={`${styles.metricIcon} ${styles.pinkIcon}`}>
            <span className="material-icons">groups</span>
          </div>

          <div className={styles.metricInfo}>
            <span>Equipes</span>
            <strong>4</strong>
          </div>

          <span className={styles.negative}>-80%</span>
        </div>

        <div className={styles.metricCard}>
          <div className={`${styles.metricIcon} ${styles.greenIcon}`}>
            <span className="material-icons">emoji_events</span>
          </div>

          <div className={styles.metricInfo}>
            <span>Partidas</span>
            <strong>46</strong>
          </div>

          <span className={styles.positive}>80%</span>
        </div>

        <div className={styles.metricCard}>
          <div className={`${styles.metricIcon} ${styles.pinkIcon}`}>
            <span className="material-icons">trending_down</span>
          </div>

          <div className={styles.metricInfo}>
            <span>Desempenho</span>
            <strong>5</strong>
          </div>

          <span className={styles.negative}>-5%</span>
        </div>

      </section>

      {/* CONTEÚDO PRINCIPAL */}
      <section className={styles.dashboardGrid}>

        {/* COLUNA ESQUERDA */}
        <div className={styles.leftColumn}>

          {/* CALENDÁRIO */}
          <div className={styles.card}>

            <div className={styles.cardHeader}>
              <h2>Setembro 2026</h2>

              <div className={styles.calendarArrows}>
                <button type="button">‹</button>
                <button type="button">›</button>
              </div>
            </div>

            <div className={styles.calendar}>

              <div className={styles.weekDays}>
                <span>D</span>
                <span>S</span>
                <span>T</span>
                <span>Q</span>
                <span>Q</span>
                <span>S</span>
                <span>S</span>
              </div>

              <div className={styles.calendarGrid}>
                {semanas.map((semana, index) => (
                  <div className={styles.calendarWeek} key={index}>
                    {semana.map((dia, diaIndex) => (
                      <span
                        key={diaIndex}
                        className={dia === 18 ? styles.today : ''}
                      >
                        {dia ?? ''}
                      </span>
                    ))}
                  </div>
                ))}
              </div>

            </div>
          </div>

          {/* ÚLTIMAS PARTIDAS */}
          <div className={`${styles.card} ${styles.matchesCard}`}>

            <div className={styles.cardHeader}>
              <h2>Últimas partidas</h2>

              <button
                type="button"
                className={styles.seeAll}
              >
                Ver todas
              </button>
            </div>

            <div className={styles.tableWrapper}>

              <table className={styles.matchesTable}>

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
                  {partidas.map((partida, index) => (
                    <tr key={index}>
                      <td>{partida.equipes}</td>
                      <td>{partida.modalidade}</td>
                      <td>{partida.data}</td>

                      <td className={styles.result}>
                        {partida.resultado}
                      </td>

                      <td>
                        <span
                          className={`${styles.status} ${
                            styles[partida.tipo as keyof typeof styles]
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
          </div>

        </div>

        {/* COLUNA DIREITA */}
        <div className={styles.rightColumn}>

          {/* ATIVIDADES */}
          <div className={styles.card}>

            <div className={styles.cardHeader}>
              <h2>Atividades recentes</h2>
            </div>

            <div className={styles.activities}>

              {atividades.map((atividade, index) => (
                <div
                  className={styles.activity}
                  key={index}
                >

                  <div
                    className={`${styles.activityIcon} ${
                      styles[atividade.tipo as keyof typeof styles]
                    }`}
                  >
                    <span className="material-icons">
                      {atividade.icone}
                    </span>
                  </div>

                  <div className={styles.activityText}>
                    <p>{atividade.texto}</p>
                    <span>{atividade.tempo}</span>
                  </div>

                </div>
              ))}

            </div>

          </div>

          {/* EQUIPES EM DESTAQUE */}
          <div className={styles.card}>

            <div className={styles.cardHeader}>
              <h2>Equipes em destaque</h2>
            </div>

            <div className={styles.featuredTeams}>

              {equipes.map((equipe, index) => (
                <div
                  className={styles.team}
                  key={index}
                >

                  <div
                    className={`${styles.teamCircle} ${
                      styles[equipe.classe as keyof typeof styles]
                    }`}
                  >
                    <span>{equipe.porcentagem}</span>
                  </div>

                  <span className={styles.teamName}>
                    {equipe.nome}
                  </span>

                </div>
              ))}

            </div>

          </div>

          {/* GRÁFICO */}
          <div className={`${styles.card} ${styles.chartCard}`}>

            <div className={styles.cardHeader}>
              <h2>Evolução de desempenho</h2>
            </div>

            <div className={styles.chart}>

              <div className={styles.yAxis}>
                <span>25 mil</span>
                <span>20 mil</span>
                <span>15 mil</span>
                <span>10 mil</span>
                <span>5 mil</span>
              </div>

              <div className={styles.chartArea}>

                <svg
                  viewBox="0 0 350 120"
                  preserveAspectRatio="none"
                  className={styles.chartSvg}
                >

                  <path
                    d={pontosAdversarios}
                    className={styles.lineAdversarios}
                    fill="none"
                  />

                  <path
                    d={pontosSuaEquipe}
                    className={styles.lineEquipe}
                    fill="none"
                  />

                  <circle
                    cx="0"
                    cy="78"
                    r="4"
                    className={styles.chartPointGreen}
                  />

                  <circle
                    cx="120"
                    cy="82"
                    r="4"
                    className={styles.chartPointGreen}
                  />

                  <circle
                    cx="230"
                    cy="70"
                    r="4"
                    className={styles.chartPointGreen}
                  />

                  <circle
                    cx="350"
                    cy="58"
                    r="4"
                    className={styles.chartPointGreen}
                  />

                  <circle
                    cx="0"
                    cy="92"
                    r="4"
                    className={styles.chartPointBlue}
                  />

                  <circle
                    cx="120"
                    cy="78"
                    r="4"
                    className={styles.chartPointBlue}
                  />

                  <circle
                    cx="230"
                    cy="60"
                    r="4"
                    className={styles.chartPointBlue}
                  />

                  <circle
                    cx="350"
                    cy="42"
                    r="4"
                    className={styles.chartPointBlue}
                  />

                </svg>

                <div className={styles.xAxis}>
                  <span>P1</span>
                  <span>P2</span>
                  <span>P3</span>
                  <span>P4</span>
                </div>

              </div>

            </div>

            <div className={styles.legend}>

              <span>
                <i className={styles.legendGreen}></i>
                Adversários
              </span>

              <span>
                <i className={styles.legendBlue}></i>
                Sua equipe
              </span>

            </div>

          </div>

        </div>

      </section>

    </div>
  );
};

export default Dashboard;