
import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import Carregamento from '../../pages/Carregamento/carregamento';
import { API_BASE } from '../../config/api';

const RotaInicial = () => {
  const [carregando, setCarregando] = useState(true);
  const [temEquipe, setTemEquipe] = useState(false);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    const verificarEquipe = async () => {
      const token =
        localStorage.getItem('token') ||
        sessionStorage.getItem('token');

      if (!token) {
        setCarregando(false);
        return;
      }

      try {
        const resposta = await fetch(
          `${API_BASE}/equipes`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!resposta.ok) {
          setErro(true);
          return;
        }

        const dados = await resposta.json();

        const equipes = Array.isArray(dados)
          ? dados
          : dados.equipes || [];

        setTemEquipe(equipes.length > 0);
      } catch (error) {
        console.error('Erro ao verificar equipe:', error);
        setErro(true);
      } finally {
        setCarregando(false);
      }
    };

    void verificarEquipe();
  }, []);

  // Animação original do SATE, sem navegação por tempo fixo.
  if (carregando) {
    return (
      <Carregamento
        semRedirecionamento
        mensagem="Preparando suas equipes..."
      />
    );
  }

  const token =
    localStorage.getItem('token') ||
    sessionStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (temEquipe) {
    return <Navigate to="/inicio" replace />;
  }

  // Preserva o tratamento de erro já usado no seu projeto.
  if (erro) {
    return <Navigate to="/inicio" replace />;
  }

  // Sem equipe: libera a configuração inicial.
  return <Outlet />;
};

export default RotaInicial;
