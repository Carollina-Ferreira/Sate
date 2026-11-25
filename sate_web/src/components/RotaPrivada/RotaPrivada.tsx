
import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import Carregamento from '../../pages/Carregamento/carregamento';

// URL do backend: funciona localmente e na Vercel.
import { API_ORIGIN as API_URL } from '../../config/api';

const RotaPrivada = () => {
  const [carregando, setCarregando] = useState(true);
  const [temEquipe, setTemEquipe] = useState(false);
  const [erro, setErro] = useState('');
  const [sessaoInvalida, setSessaoInvalida] = useState(false);
  const [tentativa, setTentativa] = useState(0);

  const token =
    localStorage.getItem('token') ||
    sessionStorage.getItem('token');

  useEffect(() => {
    const controller = new AbortController();

    const verificarEquipe = async () => {
      if (!token) {
        setCarregando(false);
        return;
      }

      setCarregando(true);
      setErro('');
      setSessaoInvalida(false);

      try {
        const resposta = await fetch(
          `${API_URL}/api/equipes`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            signal: controller.signal,
          }
        );

        if (resposta.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('usuario');
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('usuario');

          setSessaoInvalida(true);
          return;
        }

        if (!resposta.ok) {
          throw new Error(
            `Erro ao verificar equipes: ${resposta.status}`
          );
        }

        const dados = await resposta.json();

        const equipes = Array.isArray(dados)
          ? dados
          : dados.equipes;

        if (!Array.isArray(equipes)) {
          throw new Error('Resposta de equipes inválida.');
        }

        setTemEquipe(equipes.length > 0);

      } catch (error) {
        if (controller.signal.aborted) return;

        console.error('Erro ao verificar equipes:', error);

        setErro(
          'Não foi possível verificar suas equipes. Tente novamente.'
        );
      } finally {
        if (!controller.signal.aborted) {
          setCarregando(false);
        }
      }
    };

    void verificarEquipe();

    return () => controller.abort();

  }, [token, tentativa]);

  // Sem autenticação.
  if (!token || sessaoInvalida) {
    return <Navigate to="/login" replace />;
  }

  // Verificando acesso.
  if (carregando) {
    return (
      <Carregamento
        semRedirecionamento
        mensagem="Verificando seu acesso..."
      />
    );
  }

  // Falha de comunicação com o backend.
  if (erro) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          gap: '16px',
          textAlign: 'center',
        }}
      >
        <h2>Não foi possível verificar seu acesso</h2>

        <p role="alert">{erro}</p>

        <button
          onClick={() => setTentativa((anterior) => anterior + 1)}
          style={{
            background: '#005C45',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '10px',
            padding: '12px 24px',
            cursor: 'pointer',
          }}
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  // Treinador sem equipe.
  if (!temEquipe) {
    return <Navigate to="/boas-vindas" replace />;
  }

  // Acesso autorizado.
  return <Outlet />;
};

export default RotaPrivada;
