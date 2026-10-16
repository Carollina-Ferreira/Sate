''
import { BrowserRouter, Routes, Route } from "react-router-dom";

// ==========================================
// LANDING PAGE
// ==========================================
import LandingPage from "./pages/LandingPage/landingPage";

// ==========================================
// PÁGINAS DE ACESSO
// ==========================================
import Login from "./pages/Login/login";
import Cadastro from "./pages/Cadastro/cadastro";
import EsqueciSenha from "./pages/EsqueciSenha/esqueciSenha";

// ==========================================
// PÁGINAS DE BOAS-VINDAS / CONFIGURAÇÃO
// ==========================================
import BoasVindas from "./pages/BoasVindas/boasVindas";
import SelecaoEsporte from "./pages/SelecaoEsporte/selecaoEsporte";
import ConfiguracaoAnalise from "./pages/ConfiguracaoAnalise/configuracaoAnalise";
import ConfiguracaoEquipe from "./pages/ConfiguracaoEquipe/configuracaoEquipe";
import ConfiguracaoConcluida from "./pages/ConfiguracaoConcluida/configuracaoConcluida";

// ==========================================
// LAYOUT
// ==========================================
import Layout from "./components/Layout/layout";

// ==========================================
// ROTAS DE PROTEÇÃO
// ==========================================
import RotaPrivada from "./components/RotaPrivada/RotaPrivada";
import RotaInicial from "./components/RotaInicial/RotaInicial";

// ==========================================
// PÁGINAS INTERNAS
// ==========================================
import Dashboard from "./pages/Dashboard/dashboard";
import Equipes from "./pages/Equipes/equipes";
import Atletas from "./pages/Atletas/atletas";
import Comparacoes from "./pages/Comparacoes/comparacoes";
import Estatisticas from "./pages/Estatisticas/estatisticas";
import Configuracoes from "./pages/Configuracoes/configuracoes";
import AnaliseVideo from "./pages/AnaliseVideos/analiseVideos";
import CadastroAtleta from "./pages/Atletas/modalCadastroAtletas";
import Partidas from "./pages/Partidas/partidas";
import DetalhesDaPartida from "./pages/DetalhesDaPartida/partidas2";

function App() {
  return (
    <BrowserRouter>
      <Routes>
<<<<<<< HEAD
        {/* PÁGINAS PÚBLICAS */}
        <Route path="/" element={<Login />} />

        <Route path="/cadastro" element={<Cadastro />} />
=======
        {/* ========================================
            PÁGINAS PÚBLICAS
        ======================================== */}

        <Route path="/" element={<LandingPage />} />

        <Route path="/login" element={<Login />} />
>>>>>>> c40bc0e1564aead88cfebd3d7a095525c352b1e8

        <Route path="/cadastro" element={<Cadastro />} />

        <Route path="/esqueci-senha" element={<EsqueciSenha />} />

<<<<<<< HEAD
        {/* CONFIGURAÇÃO INICIAL */}
=======
        {/* ========================================
            ONBOARDING / CONFIGURAÇÃO INICIAL
        ======================================== */}

>>>>>>> c40bc0e1564aead88cfebd3d7a095525c352b1e8
        <Route element={<RotaInicial />}>
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
        </Route>

<<<<<<< HEAD
        {/* ÁREA PRIVADA */}
        <Route element={<RotaPrivada />}>
          <Route element={<Layout />}>
=======
        {/* ========================================
            ÁREA PRIVADA
        ======================================== */}

        <Route element={<RotaPrivada />}>
          <Route element={<Layout />}>

            {/* DASHBOARD */}
>>>>>>> c40bc0e1564aead88cfebd3d7a095525c352b1e8
            <Route
              path="/inicio"
              element={<Dashboard />}
            />

            {/* COMPATIBILIDADE COM A ROTA ANTIGA */}
            <Route
              path="/dashboard"
              element={<Dashboard />}
            />

            <Route
              path="/equipes"
              element={<Equipes />}
            />

            <Route
              path="/atletas"
              element={<Atletas />}
            />

            <Route
              path="/cadastro-atleta"
              element={<CadastroAtleta />}
            />

            <Route
              path="/videos"
              element={<AnaliseVideo />}
            />

            <Route
              path="/partidas"
              element={<Partidas />}
            />

            <Route
              path="/detalhes-partida"
              element={<DetalhesDaPartida />}
            />

            <Route
              path="/estatisticas"
              element={<Estatisticas />}
            />

            <Route
              path="/comparacoes"
              element={<Comparacoes />}
            />

            {/* CONFIGURAÇÕES: página original mantida */}
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
