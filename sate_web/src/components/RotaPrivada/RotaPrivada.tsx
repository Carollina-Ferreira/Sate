import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

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
          setCarregando(false);
          return;
        }

        const dados = await resposta.json();

        const equipes = Array.isArray(dados)
          ? dados
          : dados.equipes || [];

        setTemEquipe(equipes.length > 0);
      } catch (error) {
        console.error(
          'Erro ao verificar equipes:',
          error
        );

        setTemEquipe(false);
      } finally {
        setCarregando(false);
      }
    };

    verificarEquipe();
  }, [token]);

  /*
   * Não está logado
   */
  if (!token) {
    return <Navigate to="/" replace />;
  }

  /*
   * Aguarda consultar o banco
   */
  if (carregando) {
    return null;
  }

  /*
   * Está logado, mas ainda não possui equipe.
   * Precisa fazer o onboarding.
   */
  if (!temEquipe) {
    return (
      <Navigate
        to="/boas-vindas"
        replace
      />
    );
  }

  /*
   * Está logado e possui equipe.
   * Pode acessar o sistema normalmente.
   */
  return <Outlet />;
};

export default RotaPrivada;