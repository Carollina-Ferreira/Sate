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
import Altetas from "./pages/Atletas/atletas";
import Comparacoes from "./pages/Comparacoes/compracoes";
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
        {/* ========================================
            PÁGINAS PÚBLICAS
        ======================================== */}

        {/* LANDING PAGE */}
        <Route
          path="/"
          element={<LandingPage />}
        />

        {/* LOGIN */}
        <Route
          path="/login"
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

        {/* ========================================
            ONBOARDING / CONFIGURAÇÃO INICIAL

            RotaInicial verifica:
            - se está logado
            - se já possui equipe

            Se já tiver equipe:
            -> /inicio

            Se não tiver:
            -> permite continuar o onboarding
        ======================================== */}

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

        {/* ========================================
            ÁREA PRIVADA

            RotaPrivada verifica:
            - se está logado
            - se possui equipe

            Sem login:
            -> /

            Sem equipe:
            -> /boas-vindas

            Com equipe:
            -> libera o sistema
        ======================================== */}

        <Route element={<RotaPrivada />}>
          <Route element={<Layout />}>
            {/* ====================================
                DASHBOARD
            ==================================== */}

            <Route
              path="/inicio"
              element={<Dashboard />}
            />

            <Route
              path="/dashboard"
              element={<Dashboard />}
            />

            {/* EQUIPES */}
            <Route
              path="/equipes"
              element={<Equipes />}
            />

            {/* ATLETAS */}
            <Route
              path="/atletas"
              element={<Altetas />}
            />

            {/* CADASTRO DE ATLETA */}
            <Route
              path="/cadastro-atleta"
              element={<CadastroAtleta />}
            />

            {/* ANÁLISE DE VÍDEO */}
            <Route
              path="/videos"
              element={<AnaliseVideo />}
            />

            {/* PARTIDAS */}
            <Route
              path="/partidas"
              element={<Partidas />}
            />

            {/* DETALHES DA PARTIDA */}
            <Route
              path="/detalhes-partida"
              element={<DetalhesDaPartida />}
            />

            {/* ESTATÍSTICAS */}
            <Route
              path="/estatisticas"
              element={<Estatisticas />}
            />

            {/* COMPARAÇÕES */}
            <Route
              path="/comparacoes"
              element={<Comparacoes />}
            />

            {/* CONFIGURAÇÕES */}
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