
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// ==========================================
// LANDING PAGE
// ==========================================
import LandingPage from "./pages/LandingPage/landingPage";

// ==========================================
// PÁGINAS DE ACESSO
// ==========================================
import Login from "./pages/Login/login";
import Carregamento from "./pages/Carregamento/carregamento";
import Cadastro from "./pages/Cadastro/cadastro";
import EsqueciSenha from "./pages/EsqueciSenha/esqueciSenha";
import RedefinirSenha from "./pages/RedefinirSenha/redefinirSenha";
import VerificarEmail from "./pages/VerificarEmail/verificarEmail";

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
import { ThemeProvider } from "./components/context/ThemeContext";

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
import Partidas from "./pages/Partidas/partidas";
import DetalhesDaPartida from "./pages/DetalhesDaPartida/partidas2";
import Ajuda from './pages/Ajuda/ajuda';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <Routes>

          {/* ========================================
              PÁGINAS PÚBLICAS
          ======================================== */}

          {/* Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Login */}
          <Route path="/login" element={<Login />} />

          {/* Carregamento */}
          <Route
            path="/carregamento"
            element={<Carregamento />}
          />

          {/* Cadastro */}
          <Route path="/cadastro" element={<Cadastro />} />

          {/* Confirmação de e-mail do cadastro */}
          <Route path="/verificar-email" element={<VerificarEmail />} />

          {/* Recuperação de senha */}
          <Route path="/esqueci-senha" element={<EsqueciSenha />} />

          {/* Redefinição de senha via link enviado por e-mail */}
          <Route path="/redefinir-senha" element={<RedefinirSenha />} />

          {/* ========================================
              ONBOARDING / CONFIGURAÇÃO INICIAL
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
          ======================================== */}

          <Route element={<RotaPrivada />}>
            <Route element={<Layout />}>

              {/* DASHBOARD */}
              <Route
                path="/inicio"
                element={<Dashboard />}
              />

              {/* Compatibilidade com rota antiga */}
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
                element={<Atletas />}
              />

              {/* CADASTRO DE ATLETA */}
              <Route
                path="/cadastro-atleta"
                element={<Navigate to="/atletas?cadastro=1" replace />}
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
                path="/detalhes-partida/:id"
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

              <Route path="/ajuda" element={<Ajuda />} />

            </Route>
          </Route>
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
