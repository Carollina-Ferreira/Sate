
import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

import {
  FaBasketballBall,
  FaFutbol,
  FaHandsHelping,
  FaRunning,
  FaTableTennis,
  FaVolleyballBall,
  FaWater,
} from 'react-icons/fa';

import styles from './configuracaoConcluida.module.css';
import LoadingState from '../../components/ui/LoadingState/LoadingState';

interface EstadoNavegacao {
  modalidade?: string;
  imagem?: string;
}

const iconePorEsporte: Record<string, React.ReactNode> = {
  Futebol: <FaFutbol />,
  Basquete: <FaBasketballBall />,
  Vôlei: <FaVolleyballBall />,
  Handebol: <FaHandsHelping />,
  Rugby: <FaRunning />,
  Natação: <FaWater />,
  Atletismo: <FaRunning />,
  Tênis: <FaTableTennis />,
};

export default function ConfiguracaoConcluida() {
  const navigate = useNavigate();
  const location = useLocation();

  const [salvando, setSalvando] = useState(false);

  const state = location.state as EstadoNavegacao | null;

  const modalidade =
    state?.modalidade ||
    sessionStorage.getItem('sate-modalidade') ||
    'Futebol';

  const imagemEsporte =
    state?.imagem ||
    sessionStorage.getItem('sate-imagem-esporte') ||
    '';

  const nomeEquipe =
    sessionStorage.getItem('sate-nome-equipe') ||
    'Minha equipe';

  const categoria =
    sessionStorage.getItem('sate-categoria-equipe') ||
    'Principal';

  const imagemEquipe =
    sessionStorage.getItem('sate-imagem-equipe') ||
    '';

  const camposSelecionados = useMemo(() => {
    const campos = sessionStorage.getItem('sate-campos-analise');

    if (!campos) {
      return [];
    }

    try {
      const dados = JSON.parse(campos);

      if (!Array.isArray(dados)) {
        return [];
      }

      return dados
        .map((campo) => {
          if (typeof campo === 'string') {
            return campo;
          }

          if (campo && typeof campo.nome === 'string') {
            return campo.nome;
          }

          return null;
        })
        .filter((campo): campo is string => Boolean(campo));
    } catch (error) {
      console.error('Erro ao carregar campos:', error);
      return [];
    }
  }, []);

  const voltar = () => {
    navigate('/configuracao-equipe', {
      state: {
        modalidade,
        imagem: imagemEsporte,
      },
    });
  };

  const finalizar = async () => {
    if (salvando) {
      return;
    }

    try {
      setSalvando(true);

      const token = localStorage.getItem('token');

      if (!token) {
        alert('Sessão não encontrada. Faça login novamente.');
        navigate('/login');
        return;
      }

      const resposta = await fetch(
        'http://localhost:3000/api/equipes',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            nome: nomeEquipe,
            modalidade,
            categoria,
            imagem: null,
            corEquipe: '#16A875',
            proximaPartida: null,
          }),
        },
      );

      const dados = await resposta.json().catch(() => ({}));

      if (!resposta.ok) {
        console.error('Erro retornado pelo backend:', dados);

        throw new Error(
          dados.erro ||
            dados.mensagem ||
            'Não foi possível salvar a equipe.',
        );
      }

      sessionStorage.removeItem('sate-nome-equipe');
      sessionStorage.removeItem('sate-categoria-equipe');
      sessionStorage.removeItem('sate-imagem-equipe');
      sessionStorage.removeItem('sate-imagem-esporte');
      sessionStorage.removeItem('sate-campos-analise');
      sessionStorage.removeItem('sate-modalidade');

      navigate('/inicio');
    } catch (error) {
      console.error('Erro ao salvar equipe:', error);

      alert(
        error instanceof Error
          ? error.message
          : 'Não foi possível salvar a equipe.',
      );

      setSalvando(false);
    }
  };

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <div className={styles.progressArea}>
          <div className={styles.stepBadge}>
            Etapa 4 de 4 · Configuração concluída
          </div>

          <div className={styles.progressSteps}>
            <div />
            <div />
            <div />
            <div />
          </div>
        </div>

        <header className={styles.header}>
          <div className={styles.completeIcon}>
            <Check size={27} strokeWidth={3} />
          </div>

          <h1>
            Tudo <em>pronto!</em>
          </h1>

          <p>
            Sua equipe foi configurada. Confira as informações antes de
            começar.
          </p>
        </header>

        <div className={styles.summaryArea}>
          <div className={styles.fieldsCard}>
            <div className={styles.sportHeader}>
              <div className={styles.sportCircle}>
                {iconePorEsporte[modalidade] || <FaRunning />}
              </div>

              <div>
                <strong>{modalidade}</strong>
                <span>CAMPOS DE ANÁLISE</span>
              </div>
            </div>

            <div className={styles.divider} />

            <span className={styles.fieldsTitle}>
              Informações selecionadas
            </span>

            {camposSelecionados.length > 0 ? (
              <ul>
                {camposSelecionados.slice(0, 6).map((campo, index) => (
                  <li key={`${campo}-${index}`}>
                    <Check size={13} />
                    {campo}
                  </li>
                ))}
              </ul>
            ) : (
              <p className={styles.emptyFields}>
                Nenhum campo selecionado.
              </p>
            )}

            {camposSelecionados.length > 6 && (
              <span className={styles.moreFields}>
                +{camposSelecionados.length - 6} campos selecionados
              </span>
            )}
          </div>

          <div className={styles.teamCard}>
            <div
              className={styles.teamImage}
              style={
                imagemEquipe
                  ? {
                      backgroundImage: `url("${imagemEquipe}")`,
                    }
                  : undefined
              }
            >
              {!imagemEquipe &&
                (iconePorEsporte[modalidade] || <FaRunning />)}
            </div>

            <div className={styles.teamInfo}>
              <div>
                <span>{modalidade.toUpperCase()}</span>

                <h2>{nomeEquipe}</h2>

                <p>Categoria: {categoria}</p>
              </div>

              <div className={styles.sportEmoji}>
                {iconePorEsporte[modalidade] || <FaRunning />}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.finalMessage}>
          <div className={styles.finalMessageIcon}>
            <Check size={17} strokeWidth={2.5} />
          </div>

          <div>
            <strong>Sua equipe está pronta!</strong>

            <span>
              Agora você pode começar a acompanhar seus atletas e
              treinamentos.
            </span>
          </div>
        </div>

        <footer className={styles.footer}>
          <button
            type="button"
            className={styles.backButton}
            onClick={voltar}
            disabled={salvando}
          >
            <ArrowLeft size={16} />
            Voltar
          </button>

          <button
            type="button"
            className={styles.nextButton}
            onClick={finalizar}
            disabled={salvando}
          >
            {salvando ? (
              <LoadingState variant="inline" title="Finalizando configuração..." />
            ) : (
              <>
                Ir para o início
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </footer>
      </div>
    </main>
  );
}
