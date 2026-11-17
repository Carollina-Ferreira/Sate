
import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import Carregamento from '../../pages/Carregamento/carregamento';

const RotaPrivada = () => {
  const [carregando, setCarregando] = useState(true);
  const [temEquipe, setTemEquipe] = useState(false);

  const token =
    localStorage.getItem('token') ||
    sessionStorage.getItem('token');

  useEffect(() => {
    const verificarEquipe = async () => {
      if (!token) {
        setCarregando(false);
        return;
      }

      try {
        const resposta = await fetch(
          'http://localhost:3000/api/equipes',
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!resposta.ok) {
          setTemEquipe(false);
          return;
        }

        const dados = await resposta.json();

        const equipes = Array.isArray(dados)
          ? dados
          : dados.equipes || [];

        setTemEquipe(equipes.length > 0);
      } catch (error) {
        console.error('Erro ao verificar equipes:', error);
        setTemEquipe(false);
      } finally {
        setCarregando(false);
      }
    };

    void verificarEquipe();
  }, [token]);

  // Sem login: volta para a entrada.
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // Usa a MESMA tela visual /carregamento, sem redirecionar pelo timer.
  if (carregando) {
    return (
      <Carregamento
        semRedirecionamento
        mensagem="Verificando seu acesso..."
      />
    );
  }

  // Usuário sem equipe: abre a configuração inicial.
  if (!temEquipe) {
    return <Navigate to="/boas-vindas" replace />;
  }

  // Usuário com equipe: libera a rota solicitada.
  return <Outlet />;
};

export default RotaPrivada;
