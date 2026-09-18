import { BrowserRouter, Routes, Route } from 'react-router-dom';

// =================================
// PÁGINAS DE ACESSO
// =================================
import Login from './pages/Login/login';
import Cadastro from './pages/Cadastro/cadastro';
import EsqueciSenha from './pages/EsqueciSenha/esqueciSenha';

// =================================
// PÁGINA DE BOAS-VINDAS
// =================================
import BoasVindas from './pages/BoasVindas/boasVindas';
import SelecaoEsporte from './pages/SelecaoEsporte/selecaoEsporte';
// =================================
// LAYOUT
// =================================
import Layout from './components/Layout/layout';

// =================================
// PÁGINAS INTERNAS
// =================================
import Dashboard from './pages/Dashboard/dashboard';
import Equipes from './pages/Equipes/equipes';
import Altetas from './pages/Atletas/atletas';
import Comparacoes from './pages/Comparacoes/compracoes';
import Estatisticas from './pages/Estatisticas/estatisticas';
import Configuracoes from './pages/Configuracoes/configuracoes';
import AnaliseVideo from './pages/AnaliseVideos/analiseVideos';


function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =================================
            PÁGINAS DE ACESSO
        ================================= */}

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/cadastro"
          element={<Cadastro />}
        />

        <Route
          path="/esqueci-senha"
          element={<EsqueciSenha />}
        />

        {/* =================================
            PÁGINA DE BOAS-VINDAS
            Aparece depois do login
            e antes do início
        ================================= */}

        <Route
          path="/boas-vindas"
          element={<BoasVindas />}
        />

        <Route
          path="/selecao-esporte"
          element={<SelecaoEsporte />}
        />

        {/* =================================
            ÁREA INTERNA DO SATE
        ================================= */}

        <Route element={<Layout />}>

          {/* Dashboard */}
          <Route
            path="/inicio"
            element={<Dashboard />}
          />

          {/* Equipes */}
          <Route
            path="/equipes"
            element={<Equipes />}
          />

          {/* Atletas */}
          <Route
            path="/atletas"
            element={<Altetas />}
          />

          {/* Análise de vídeos */}
          <Route
            path="/videos"
            element={
              <AnaliseVideo/>
            }
          />

          {/* Partidas */}
          <Route
            path="/partidas"
            element={
              <div>
                Partidas
              </div>
            }
          />

          {/* Estatísticas */}
          <Route
            path="/estatisticas"
            element={
             <Estatisticas/>
            }
          />

          {/* Comparações */}
          <Route
            path="/comparacoes"
            element={
              <Comparacoes/>
            }
          />

          {/* Configurações */}
          <Route
            path="/configuracoes"
            element={
                <Configuracoes/>
            }
          />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
