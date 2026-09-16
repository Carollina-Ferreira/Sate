import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Páginas de acesso
import Login from './pages/Login/login';
import Cadastro from './pages/Cadastro/cadastro';
import EsqueciSenha from './pages/EsqueciSenha/esqueciSenha';

// Layout
import Layout from './components/Layout/layout';

// Páginas internas
import Dashboard from './pages/Dashboard/dashboard';
import Equipes from './pages/Equipes/equipes';

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
            element={
              <div>
                Atletas
              </div>
            }
          />

          {/* Análise de vídeos */}
          <Route
            path="/videos"
            element={
              <div>
                Análise de Vídeos
              </div>
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
              <div>
                Estatísticas
              </div>
            }
          />

          {/* Comparações */}
          <Route
            path="/comparacoes"
            element={
              <div>
                Comparações
              </div>
            }
          />

          {/* Configurações */}
          <Route
            path="/configuracoes"
            element={
              <div>
                Configurações
              </div>
            }
          />

        </Route>

      </Routes>

    </BrowserRouter>
  );
}

export default App;