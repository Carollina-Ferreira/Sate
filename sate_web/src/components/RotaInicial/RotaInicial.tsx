import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import Carregamento from '../../pages/Carregamento/carregamento';

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

    verificarEquipe();
  }, []);

  // Exibe a animação enquanto verifica as equipes.
  if (carregando) {
    return <Carregamento />;
  }

  // Sem autenticação, volta para o login.
  const token =
    localStorage.getItem('token') ||
    sessionStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Se já possui equipe, segue para o dashboard.
  if (temEquipe) {
    return <Navigate to="/inicio" replace />;
  }

  // Se ocorreu erro na consulta, não presume que não há equipe.
  if (erro) {
    return <Navigate to="/inicio" replace />;
  }

  // Sem equipe: libera as telas de configuração inicial.
  return <Outlet />;
};

export default RotaInicial;
