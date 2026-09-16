import styles from './header.module.css';

interface HeaderProps {
  title: string;
}

const Header = ({ title }: HeaderProps) => {
  return (
    <header className={styles.header}>

      {/* TÍTULO DA PÁGINA */}
      <h1 className={styles.title}>
        {title}
      </h1>

      {/* ÁREA DIREITA */}
      <div className={styles.right}>

        {/* PESQUISA */}
        <div className={styles.search}>
          <span className="material-icons">
            search
          </span>

          <input
            type="text"
            placeholder="Pesquisar atletas, equipes, partidas"
          />
        </div>

        {/* NOTIFICAÇÃO */}
        <button
          className={styles.notification}
          type="button"
          aria-label="Notificações"
        >
          <span className="material-icons">
            notifications_none
          </span>
        </button>

        {/* USUÁRIO */}
        <div className={styles.user}>

          <div className={styles.avatar}>
            MF
          </div>

          <div className={styles.userInfo}>
            <span className={styles.userName}>
              Marcelo Ferreira
            </span>

            <span className={styles.userRole}>
              Treinador
            </span>
          </div>

          <span className="material-icons">
            keyboard_arrow_down
          </span>

        </div>

      </div>

    </header>
  );
};

export default Header;