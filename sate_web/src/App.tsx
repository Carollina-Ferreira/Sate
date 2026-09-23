import { BrowserRouter, Routes, Route } from 'react-router-dom';

// =================================
// PÁGINAS DE ACESSO
// =================================
import Login from './pages/Login/login';
import Cadastro from './pages/Cadastro/cadastro';
import EsqueciSenha from './pages/EsqueciSenha/esqueciSenha';

// =================================
// PÁGINAS DE BOAS-VINDAS / CONFIGURAÇÃO
// =================================
import BoasVindas from './pages/BoasVindas/boasVindas';
import SelecaoEsporte from './pages/SelecaoEsporte/selecaoEsporte';
import ConfiguracaoAnalise from './pages/ConfiguracaoAnalise/configuracaoAnalise';
import ConfiguracaoEquipe from './pages/ConfiguracaoEquipe/configuracaoEquipe';
import ConfiguracaoConcluida from './pages/ConfiguracaoConcluida/configuracaoConcluida';

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
import CadastroAtleta from './pages/Atletas/modalCadastroAtletas';
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
            PÁGINAS DE BOAS-VINDAS / CONFIGURAÇÃO
        ================================= */}

        <Route
          path="/boas-vindas"
          element={<BoasVindas />}
        />

        <Route
          path="/selecao-esporte"
          element={<SelecaoEsporte />}
        />

        <Route
          path="/configuracao-analise"
          element={<ConfiguracaoAnalise />}
        />

        <Route
          path="/configuracao-equipe"
          element={<ConfiguracaoEquipe />}
        />

        <Route
          path="/configuracao-concluida"
          element={<ConfiguracaoConcluida />}
        />

        {/* =================================
            ÁREA INTERNA DO SATE
        ================================= */}

        <Route element={<RotaPrivada />}>

          <Route element={<Layout />}>

            {/* ================================
                DASHBOARD
            ================================= */}

            <Route
              path="/inicio"
              element={<Dashboard />}
            />

            {/* ================================
                EQUIPES
            ================================= */}

            <Route
              path="/equipes"
              element={<Equipes />}
            />

            {/* ================================
                ATLETAS
            ================================= */}

            <Route
              path="/atletas"
              element={<Altetas />}
            />

            {/* ================================
                CADASTRO DE ATLETA
            ================================= */}

            <Route
              path="/cadastro-atleta"
              element={<CadastroAtleta />}
            />

            {/* ================================
                ANÁLISE DE VÍDEOS
            ================================= */}

            <Route
              path="/videos"
              element={<AnaliseVideo />}
            />

            {/* ================================
                PARTIDAS
            ================================= */}

            <Route
              path="/partidas"
              element={<Partidas />}
            />

            {/* ================================
                ESTATÍSTICAS
            ================================= */}

            <Route
              path="/estatisticas"
              element={<Estatisticas />}
            />

            {/* ================================
                COMPARAÇÕES
            ================================= */}

            <Route
              path="/comparacoes"
              element={<Comparacoes />}
            />

            {/* ================================
                CONFIGURAÇÕES
            ================================= */}

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