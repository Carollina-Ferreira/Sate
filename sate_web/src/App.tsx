import {
  useEffect,
  useState,
} from 'react';

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';


// ==========================================
// PÁGINAS DE ACESSO
// ==========================================

import Login from './pages/Login/login';
import Cadastro from './pages/Cadastro/cadastro';
import EsqueciSenha from './pages/EsqueciSenha/esqueciSenha';


// ==========================================
// PÁGINAS DE BOAS-VINDAS / CONFIGURAÇÃO
// ==========================================

import BoasVindas from './pages/BoasVindas/boasVindas';

import SelecaoEsporte from './pages/SelecaoEsporte/selecaoEsporte';

import ConfiguracaoAnalise from './pages/ConfiguracaoAnalise/configuracaoAnalise';

import ConfiguracaoEquipe from './pages/ConfiguracaoEquipe/configuracaoEquipe';

import ConfiguracaoConcluida from './pages/ConfiguracaoConcluida/configuracaoConcluida';


// ==========================================
// LAYOUT
// ==========================================

import Layout from './components/Layout/layout';


// ==========================================
// ROTAS DE PROTEÇÃO
// ==========================================

import RotaPrivada from './components/RotaPrivada/RotaPrivada';

import RotaInicial from './components/RotaInicial/RotaInicial';


// ==========================================
// LOADING
// ==========================================

import LoadingScreen from './components/LoadingScreen/loadingscreen';


// ==========================================
// PÁGINAS INTERNAS
// ==========================================

import Dashboard from './pages/Dashboard/dashboard';

import Equipes from './pages/Equipes/equipes';

import Altetas from './pages/Atletas/atletas';

import Comparacoes from './pages/Comparacoes/compracoes';

import Estatisticas from './pages/Estatisticas/estatisticas';

import Configuracoes from './pages/Configuracoes/configuracoes';

import AnaliseVideo from './pages/AnaliseVideos/analiseVideos';

import CadastroAtleta from './pages/Atletas/modalCadastroAtletas';

import Partidas from './pages/Partidas/partidas';

import DetalhesDaPartida from './pages/DetalhesDaPartida/partidas2';


// ==========================================
// STATE DA NAVEGAÇÃO
// ==========================================

interface NavigationState {
  mostrarLoading?: boolean;
}


// ==========================================
// LOADING SOBRE A PÁGINA
// ==========================================

function LoadingDeNavegacao() {
  const [
    visivel,
    setVisivel,
  ] = useState(true);


  useEffect(() => {
    const timer =
      window.setTimeout(() => {
        setVisivel(false);
      }, 2500);


    return () => {
      window.clearTimeout(
        timer,
      );
    };
  }, []);


  if (!visivel) {
    return null;
  }


  return (
    <LoadingScreen
      texto="Preparando seu ambiente..."
    />
  );
}


// ==========================================
// ROTAS
// ==========================================

function AppRoutes() {
  const location =
    useLocation();


  const navigationState =
    location.state as
      | NavigationState
      | null;


  const mostrarLoading =
    navigationState?.mostrarLoading ===
    true;


  return (
    <>

      {/* LOADING POR CIMA DA PÁGINA */}

      {mostrarLoading && (
        <LoadingDeNavegacao
          key={location.key}
        />
      )}


      <Routes>

        {/* ========================================
            PÁGINAS PÚBLICAS
        ======================================== */}

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


        {/* ========================================
            ONBOARDING
        ======================================== */}

        <Route
          element={<RotaInicial />}
        >

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
            element={
              <ConfiguracaoAnalise />
            }
          />


          <Route
            path="/configuracao-equipe"
            element={
              <ConfiguracaoEquipe />
            }
          />


          <Route
            path="/configuracao-concluida"
            element={
              <ConfiguracaoConcluida />
            }
          />

        </Route>


        {/* ========================================
            ÁREA PRIVADA
        ======================================== */}

        <Route
          element={<RotaPrivada />}
        >

          <Route
            element={<Layout />}
          >

            <Route
              path="/inicio"
              element={<Dashboard />}
            />


            <Route
              path="/equipes"
              element={<Equipes />}
            />


            <Route
              path="/atletas"
              element={<Altetas />}
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
              element={
                <DetalhesDaPartida />
              }
            />


            <Route
              path="/estatisticas"
              element={<Estatisticas />}
            />


            <Route
              path="/comparacoes"
              element={<Comparacoes />}
            />


            <Route
              path="/configuracoes"
              element={<Configuracoes />}
            />

          </Route>

        </Route>


        {/* ========================================
            ROTA NÃO EXISTENTE

            Evita tela branca.
        ======================================== */}

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

      </Routes>

    </>
  );
}


// ==========================================
// APP
// ==========================================

function App() {
  return (
    <BrowserRouter>

      <AppRoutes />

    </BrowserRouter>
  );
}


export default App;