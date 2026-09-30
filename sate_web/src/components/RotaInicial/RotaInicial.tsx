import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const RotaInicial = () => {
  const [carregando, setCarregando] = useState(true);
  const [temEquipe, setTemEquipe] = useState(false);

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
          setTemEquipe(false);
          setCarregando(false);
          return;
        }

        const dados = await resposta.json();

        /*
         * O backend retorna a lista de equipes.
         */
        const equipes = Array.isArray(dados)
          ? dados
          : dados.equipes || [];

        setTemEquipe(equipes.length > 0);
      } catch (error) {
        console.error(
          'Erro ao verificar equipe:',
          error
        );

        setTemEquipe(false);
      } finally {
        setCarregando(false);
      }
    };

    verificarEquipe();
  }, []);

  /*
   * Enquanto consulta o banco,
   * não mostra nenhuma tela.
   */
  if (carregando) {
    return null;
  }

  /*
   * Se já possui equipe,
   * não precisa fazer onboarding novamente.
   */
  if (temEquipe) {
    return <Navigate to="/inicio" replace />;
  }

  /*
   * Se não possui equipe,
   * libera as telas de configuração.
   */
  return <Outlet />;
};

export default RotaInicial;