
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import styles from './sidebar.module.css';
import logo from '../../assets/img/logo.png';

interface SidebarProps {
  onExpand?: () => void;
  onCollapse?: () => void;
}

const menuItems = [
  { label: 'Dashboard', icon: 'dashboard', path: '/inicio' },
  { label: 'Equipes', icon: 'groups', path: '/equipes' },
  { label: 'Atletas', icon: 'person', path: '/atletas' },
  { label: 'Análise de Vídeos', icon: 'videocam', path: '/videos' },
  { label: 'Partidas', icon: 'emoji_events', path: '/partidas' },
  { label: 'Estatísticas', icon: 'bar_chart', path: '/estatisticas' },
  { label: 'Comparações', icon: 'compare_arrows', path: '/comparacoes' },
];

const Sidebar = ({ onExpand, onCollapse }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [modalSairAberto, setModalSairAberto] = useState(false);

  const confirmarSaida = () => {
    ['token', 'usuario', 'user'].forEach((chave) => {
      localStorage.removeItem(chave);
      sessionStorage.removeItem(chave);
    });

    navigate('/', { replace: true });
  };

  return (
    <>
      <aside
        className={styles.sidebar}
        onMouseEnter={onExpand}
        onMouseLeave={onCollapse}
      >
        <div className={styles.logoContainer}>
          <img src={logo} alt="SATE" className={styles.logo} />
        </div>

        <nav className={styles.menu}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`${styles.menuItem} ${
                  isActive ? styles.active : ''
                }`}
              >
                <span className="material-icons">{item.icon}</span>
                <span className={styles.label}>{item.label}</span>
              </Link>
            );
          })}

          <div className={styles.menuDivider} />

          <button
            type="button"
            className={styles.menuItem}
            onClick={() => setModalSairAberto(true)}
            style={{
              background: 'transparent',
              border: 'none',
              font: 'inherit',
              textAlign: 'left',
              cursor: 'pointer',
            }}
          >
            <span className="material-icons">logout</span>
            <span className={styles.label}>Sair</span>
          </button>
        </nav>
      </aside>

      {modalSairAberto &&
        createPortal(
          <div
            className={styles.modalOverlay}
            onClick={() => setModalSairAberto(false)}
          >
            <div
              className={styles.modalSair}
              onClick={(event) => event.stopPropagation()}
            >
              <div className={styles.modalIcone}>
                <span className="material-icons">logout</span>
              </div>

              <h2>Você realmente deseja sair?</h2>

              <p>
                Ao sair, você precisará entrar novamente para acessar sua conta.
              </p>

              <div className={styles.modalBotoes}>
                <button
                  type="button"
                  className={styles.botaoCancelar}
                  onClick={() => setModalSairAberto(false)}
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  className={styles.botaoSair}
                  onClick={confirmarSaida}
                >
                  Sim, sair
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

export default Sidebar;
