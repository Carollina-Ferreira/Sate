import styles from "./configuracao.module.css";

export default function Configuracoes() {
  return (
    <div className={styles.container}>

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
            <span>♙</span>
          </button>

          <button className={styles.menuItem}>
            <span>▣</span>
          </button>

          <button className={styles.menuItem}>
            <span>🏆</span>
          </button>

          <button className={styles.menuItem}>
            <span>▥</span>
          </button>

          <button className={styles.menuItem}>
            <span>↝</span>
          </button>

          <button
            className={`${styles.menuItem} ${styles.active}`}
          >
            <span>⚙</span>
          </button>

        </nav>

        <div className={styles.sidebarBottom}>
          <button className={styles.menuItem}>
            <span>⇥</span>
          </button>
        </div>

      </aside>

      <main className={styles.main}>

        <header className={styles.header}>

          <h1>Configurações</h1>

          <div className={styles.headerRight}>

            <div className={styles.search}>
              <span>⌕</span>

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

        <section className={styles.content}>

          <h2>Configurações</h2>

          <section className={styles.profileCard}>

            <h3>Perfil do usuário</h3>

            <div className={styles.profileEdit}>

              <div className={styles.bigAvatar}>
                MF
              </div>

              <button className={styles.photoButton}>
                ▣
                <span>Alterar Foto</span>
              </button>

            </div>

            <div className={styles.fields}>

              <div className={styles.field}>
                <label>Nome</label>

                <input
                  type="text"
                  value="Marcelo Ferreira"
                  readOnly
                />
              </div>

              <div className={styles.field}>
                <label>Email</label>

                <input
                  type="email"
                  value="marcelo.ferreira@gmail.com"
                  readOnly
                />
              </div>

            </div>

          </section>

          <section className={styles.preferencesCard}>

            <h3>Preferências do sistema</h3>

            <p className={styles.subtitle}>
              Notificações e segurança
            </p>

            <div className={styles.options}>

              <div className={styles.option}>
                <span>Notificações por e-mail</span>

                <label className={styles.switch}>
                  <input
                    type="checkbox"
                    defaultChecked
                  />
                  <span className={styles.slider}></span>
                </label>
              </div>

              <div className={styles.option}>
                <span>Notificações de push</span>

                <label className={styles.switch}>
                  <input
                    type="checkbox"
                    defaultChecked
                  />
                  <span className={styles.slider}></span>
                </label>
              </div>

              <div className={styles.option}>
                <span>Autenticação em duas etapas</span>

                <label className={styles.switch}>
                  <input type="checkbox" />
                  <span className={styles.slider}></span>
                </label>
              </div>

            </div>

          </section>

          <section className={styles.teamCard}>

            <h3>
              <span className={styles.helpIcon}>?</span>
              Personalização da equipe
            </h3>

            <p className={styles.subtitle}>
              Escolha até 3 cores para representar a identidade da sua equipe.
            </p>

            <div className={styles.palette}>

              <button
                className={`${styles.color} ${styles.color1}`}
              />

              <button
                className={`${styles.color} ${styles.color2}`}
              />

              <button
                className={`${styles.color} ${styles.color3}`}
              />

              <button
                className={`${styles.color} ${styles.color4}`}
              />

              <button
                className={`${styles.color} ${styles.color5}`}
              />

              <button
                className={`${styles.color} ${styles.color6}`}
              />

            </div>

            <span className={styles.paletteLabel}>
              Paleta
            </span>

            <div className={styles.teamColors}>
              <div className={styles.teamColor1}></div>
              <div className={styles.teamColor2}></div>
              <div className={styles.teamColor3}></div>
            </div>

          </section>

        </section>

      </main>

    </div>
  );
}