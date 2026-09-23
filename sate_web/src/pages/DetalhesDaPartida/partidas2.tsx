import styles from "./partidas.module.css";

const eventos = [
  {
    horario: "22:54",
    tipo: "Gol",
    jogador: "Rafael Souza",
    cor: "verde",
  },
  {
    horario: "22:54",
    tipo: "Erro",
    jogador: "Bruno Alves",
    cor: "vermelho",
  },
  {
    horario: "22:54",
    tipo: "Finalização",
    jogador: "Rafael Souza",
    cor: "azul",
  },
  {
    horario: "22:54",
    tipo: "Falta",
    jogador: "Igor Tavares",
    cor: "rosa",
  },
  {
    horario: "22:54",
    tipo: "Gol",
    jogador: "Bruno Alves",
    cor: "verde",
  },
  {
    horario: "22:54",
    tipo: "Assistência",
    jogador: "Rafael Souza",
    cor: "azul",
  },
  {
    horario: "22:54",
    tipo: "Contra - Ataque",
    jogador: "Rafael Souza",
    cor: "amarelo",
  },
];

const momentos = [
  {
    titulo: "Gol de Rafael Souza",
    horario: "22:54",
    status: "Gol",
    tipo: "gol",
  },
  {
    titulo: "Gol de Rafael Souza",
    horario: "22:54",
    status: "Gol",
    tipo: "gol",
  },
  {
    titulo: "Gol de Rafael Souza",
    horario: "22:54",
    status: "Destaque",
    tipo: "destaque",
  },
];

const atletas = [
  {
    iniciais: "RS",
    nome: "Rafel Souza",
  },
  {
    iniciais: "BA",
    nome: "Bruno Alves",
  },
  {
    iniciais: "IT",
    nome: "Igor Tavares",
  },
];

export default function Partidas() {
  return (
    <div className={styles.container}>
      {/* ================= MENU LATERAL ================= */}
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <span>SATE</span>
        </div>

        <nav className={styles.menu}>
          <button className={styles.menuItem}>
            <span>▣</span>
          </button>

          <button className={styles.menuItem}>
            <span>♟</span>
          </button>

          <button className={styles.menuItem}>
            <span>♟</span>
          </button>

          <button className={styles.menuItem}>
            <span>▣</span>
          </button>

          <button className={`${styles.menuItem} ${styles.active}`}>
            <span>🏆</span>
          </button>

          <button className={styles.menuItem}>
            <span>▥</span>
          </button>

          <button className={styles.menuItem}>
            <span>↝</span>
          </button>

          <button className={styles.menuItem}>
            <span>⚙</span>
          </button>
        </nav>

        <div className={styles.sidebarBottom}>
          <button className={styles.menuItem}>
            <span>⇥</span>
          </button>
        </div>
      </aside>

      {/* ================= ÁREA PRINCIPAL ================= */}
      <main className={styles.main}>
        {/* ================= HEADER ================= */}
        <header className={styles.header}>
          <h1>Detalhes de Partidas</h1>

          <div className={styles.headerRight}>
            <div className={styles.search}>
              <span className={styles.searchIcon}>⌕</span>

              <input
                type="text"
                placeholder="Pesquisar atletas, equipes, partidas"
              />
            </div>

            <button className={styles.notification}>
              ♧
            </button>

            <div className={styles.profile}>
              <div className={styles.avatar}>
                MF
              </div>

              <div className={styles.profileInfo}>
                <strong>Marcelo Ferreira</strong>
                <small>Treinador</small>
              </div>

              <span className={styles.profileArrow}>
               ⌄
              </span>
            </div>
          </div>
        </header>

        {/* ================= CONTEÚDO ================= */}
        <section className={styles.content}>

          {/* VOLTAR */}
          <button className={styles.backButton}>
            ←
            <span>Voltar para partidas</span>
          </button>

          {/* ================= PLACAR ================= */}
          <section className={styles.scoreCard}>

            {/* TIME 1 */}
            <div className={styles.team}>
              <div className={styles.teamCircle}>
                FC
              </div>

              <strong>Falcões FC</strong>
            </div>

            {/* RESULTADO */}
            <div className={styles.score}>
              <div className={styles.scoreNumber}>
                3 - 1
              </div>

              <div className={styles.matchInfo}>
                18/06/2026&nbsp; Futebol
              </div>

              <span className={styles.analyzed}>
                Analisada
              </span>
            </div>

            {/* TIME 2 */}
            <div className={styles.team}>
              <div className={styles.teamCircle}>
                TC
              </div>

              <strong>Tigres FC</strong>
            </div>
          </section>

          {/* ================= DUAS COLUNAS ================= */}
          <div className={styles.middleGrid}>

            {/* ================= EVENTOS ================= */}
            <section className={styles.eventsCard}>
              <h2>Eventos Registrando</h2>

              <div className={styles.eventsList}>
                {eventos.map((evento, index) => (
                  <div
                    className={styles.event}
                    key={index}
                  >
                    <span className={styles.eventTime}>
                      {evento.horario}
                    </span>

                    <span
                      className={`${styles.eventDot} ${
                        styles[evento.cor]
                      }`}
                    ></span>

                    <strong>{evento.tipo}</strong>

                    <span className={styles.eventPlayer}>
                      {evento.jogador}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* ================= MOMENTOS ================= */}
            <section className={styles.momentsCard}>
              <h2>Momentos Registrados</h2>

              <div className={styles.momentsList}>
                {momentos.map((momento, index) => (
                  <div
                    className={styles.moment}
                    key={index}
                  >
                    <div className={styles.videoBox}>
                      <span>▷</span>
                    </div>

                    <div className={styles.momentInfo}>
                      <strong>{momento.titulo}</strong>
                      <small>{momento.horario}</small>
                    </div>

                    <span
                      className={`${styles.momentStatus} ${
                        momento.tipo === "gol"
                          ? styles.goalStatus
                          : styles.highlightStatus
                      }`}
                    >
                      <span></span>
                      {momento.status}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* ================= ATLETAS ================= */}
          <section className={styles.athletesCard}>
            <h2>Atletas participantes</h2>

            <div className={styles.athletesList}>
              {atletas.map((atleta, index) => (
                <div
                  className={styles.athlete}
                  key={index}
                >
                  <div className={styles.athleteAvatar}>
                    {atleta.iniciais}
                  </div>

                  <span>{atleta.nome}</span>
                </div>
              ))}
            </div>
          </section>

        </section>
      </main>
    </div>
  );
}