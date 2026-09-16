import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import Sidebar from '../Sidebar/sideBar';
import Header from '../Header/header';

import styles from './layout.module.css';

const Layout = () => {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  const location = useLocation();

  const titles: Record<string, string> = {
    '/inicio': 'Dashboard',
    '/equipes': 'Equipes',
    '/atletas': 'Atletas',
    '/videos': 'Análise de Vídeos',
    '/partidas': 'Partidas',
    '/estatisticas': 'Estatísticas',
    '/comparacoes': 'Comparações',
    '/configuracoes': 'Configurações',
  };

  const title = titles[location.pathname] || 'SATE';

  return (
    <div className={styles.layout}>

      <Sidebar
        onExpand={() => setSidebarExpanded(true)}
        onCollapse={() => setSidebarExpanded(false)}
      />

      <div
        className={`${styles.main} ${
          sidebarExpanded ? styles.mainExpanded : ''
        }`}
      >

        <Header title={title} />

        <main className={styles.content}>
          <Outlet />
        </main>

      </div>

    </div>
  );
};

export default Layout;