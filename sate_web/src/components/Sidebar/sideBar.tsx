import { Link, useLocation } from 'react-router-dom';
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
  { label: 'Configurações', icon: 'settings', path: '/configuracoes' },
];

const Sidebar = ({
  onExpand,
  onCollapse,
}: SidebarProps) => {

  const location = useLocation();

  return (
    <aside
      className={styles.sidebar}
      onMouseEnter={onExpand}
      onMouseLeave={onCollapse}
    >

      {/* LOGO */}
      <div className={styles.logoContainer}>
        <img
          src={logo}
          alt="SATE"
          className={styles.logo}
        />
      </div>

      {/* MENU */}
      <nav className={styles.menu}>

        {menuItems.map((item) => {

          const isActive =
            location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`${styles.menuItem} ${
                isActive ? styles.active : ''
              }`}
            >

              <span className="material-icons">
                {item.icon}
              </span>

              <span className={styles.label}>
                {item.label}
              </span>

            </Link>
          );

        })}

      </nav>

      {/* SAIR */}
      <div className={styles.bottomMenu}>

        <Link
          to="/"
          className={styles.logout}
        >

          <span className="material-icons">
            logout
          </span>

          <span className={styles.label}>
            Sair
          </span>

        </Link>

      </div>

    </aside>
  );
};

export default Sidebar;