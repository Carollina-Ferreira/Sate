
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from './sidebar.module.css';

import logo from '../../assets/img/logo.png';

interface SidebarProps {
  onExpand?: () => void;
  onCollapse?: () => void;
}

const menuItems = [
  {
    label: 'Dashboard',
    icon: 'dashboard',
    path: '/inicio',
  },
  {
    label: 'Equipes',
    icon: 'groups',
    path: '/equipes',
  },
  {
    label: 'Atletas',
    icon: 'person',
    path: '/atletas',
  },
  {
    label: 'Análise de Vídeos',
    icon: 'videocam',
    path: '/videos',
  },
  {
    label: 'Partidas',
    icon: 'emoji_events',
    path: '/partidas',
  },
  {
    label: 'Estatísticas',
    icon: 'bar_chart',
    path: '/estatisticas',
  },
  {
    label: 'Comparações',
    icon: 'compare_arrows',
    path: '/comparacoes',
  },
  {
    label: 'Configurações',
    icon: 'settings',
    path: '/configuracoes',
  },
];

const Sidebar = ({
  onExpand,
  onCollapse,
}: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('user');

    sessionStorage.removeItem('token');
    sessionStorage.removeItem('usuario');
    sessionStorage.removeItem('user');

    navigate('/', { replace: true });
  };

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

      <nav
        className={styles.menu}
        aria-label="Menu principal"
      >
        {menuItems.map((item) => {
          const isActive =
            location.pathname === item.path ||
            location.pathname.startsWith(
              `${item.path}/`
            );

          return (
            <Link
              key={item.path}
              to={item.path}
              title={item.label}
              aria-current={
                isActive ? 'page' : undefined
              }
              className={`${styles.menuItem} ${
                isActive ? styles.active : ''
              }`}
            >
              <span
                className="material-icons"
                aria-hidden="true"
              >
                {item.icon}
              </span>

              <span className={styles.label}>
                {item.label}
              </span>
            </Link>
          );
        })}

        {/* LINHA SEPARADORA */}

        <div className={styles.menuDivider} />

        {/* SAIR */}

        <Link
          to="/"
          title="Sair"
          className={styles.menuItem}
          onClick={(event) => {
            event.preventDefault();
            handleLogout();
          }}
        >
          <span
            className="material-icons"
            aria-hidden="true"
          >
            logout
          </span>

          <span className={styles.label}>
            Sair
          </span>
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
