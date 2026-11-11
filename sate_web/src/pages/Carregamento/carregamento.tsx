
import { useEffect, useState, type CSSProperties } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import styles from './carregamento.module.css';

type LocationState = {
  destino?: string;
  mensagem?: string;
};

const mensagens = [
  'Preparando seu ambiente...',
  'Organizando suas equipes...',
  'Quase pronto...',
];

const DURACAO = 2200;

export default function Carregamento() {
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as LocationState | null;
  const [etapa, setEtapa] = useState(0);

  useEffect(() => {
    const intervalo = window.setInterval(() => {
      setEtapa((atual) =>
        Math.min(atual + 1, mensagens.length - 1)
      );
    }, DURACAO / mensagens.length);

    const timer = window.setTimeout(() => {
      navigate(state?.destino || '/inicio', {
        replace: true,
      });
    }, DURACAO + 200);

    return () => {
      window.clearInterval(intervalo);
      window.clearTimeout(timer);
    };
  }, [navigate, state?.destino]);

  const mensagemAtual =
    state?.mensagem && etapa === 0
      ? state.mensagem
      : mensagens[etapa];

  return (
    <main
      className={styles.page}
      role="status"
      aria-live="polite"
      aria-label="Carregando"
      style={
        { '--duracao': `${DURACAO}ms` } as CSSProperties
      }
    >
      {/* CÍRCULOS ANIMADOS DO FUNDO */}
      <div className={styles.rings} aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </div>

      <section className={styles.content}>
        {/* ÍCONE ORIGINAL BRANCO E ANIMADO */}
        <div className={styles.brandMark} aria-hidden="true">
          <svg
            className={styles.brandIcon}
            width="38"
            height="38"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline
              className={styles.pulse}
              points="2 12 8 12 11 20 14 4 17 12 22 12"
            />
          </svg>
        </div>

        {/* NOME DO SISTEMA */}
        <h1>
          SATE<span>.</span>
        </h1>

        <p className={styles.tagline}>
          Treinar. Acompanhar. <em>Evoluir.</em>
        </p>

        {/* BARRA DE CARREGAMENTO */}
        <div className={styles.progress} aria-hidden="true">
          <i />
        </div>

        {/* MENSAGEM */}
        <p className={styles.status} key={etapa}>
          {mensagemAtual}
        </p>
      </section>
    </main>
  );
}
