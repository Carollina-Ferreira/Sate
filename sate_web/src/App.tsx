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
// ROTA PRIVADA
// =================================
import RotaPrivada from './components/RotaPrivada/RotaPrivada';

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
import Partidas from './pages/Partidas/partidas';

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =================================
            PÁGINAS PÚBLICAS
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
            PÁGINAS PROTEGIDAS
        ================================= */}

        <Route element={<RotaPrivada />}>

          {/* ================================
              BOAS-VINDAS
          ================================= */}

          <Route
            path="/boas-vindas"
            element={<BoasVindas />}
          />

          {/* ================================
              SELEÇÃO DE ESPORTE
          ================================= */}

          <Route
            path="/selecao-esporte"
            element={<SelecaoEsporte />}
          />


          {/* ================================
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

            {/* Análise de Vídeos */}

            <Route
              path="/videos"
              element={<AnaliseVideo />}
            />

            {/* Partidas */}

            <Route
              path="/partidas"
              element={<Partidas />}
            />

            {/* Estatísticas */}

            <Route
              path="/estatisticas"
              element={<Estatisticas />}
            />

            {/* Comparações */}

            <Route
              path="/comparacoes"
              element={<Comparacoes />}
            />

            {/* Configurações */}

            <Route
              path="/configuracoes"
              element={<Configuracoes />}
            />

          </Route>

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;

