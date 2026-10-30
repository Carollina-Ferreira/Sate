import { useEffect, useState } from 'react';
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
        { '--duracao': `${DURACAO}ms` } as React.CSSProperties
      }
    >
      <div className={styles.rings} aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </div>

      <section className={styles.content}>
        <div className={styles.brandMark} aria-hidden="true">
          <svg
            width="38"
            height="38"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
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

        <h1>
          SATE<span>.</span>
        </h1>

        <p className={styles.tagline}>
          Treinar. Acompanhar. <em>Evoluir.</em>
        </p>

        <div
          className={styles.progress}
          aria-hidden="true"
        >
          <i />
        </div>

        <p className={styles.status}>
          {mensagemAtual}
        </p>
      </section>
    </main>
  );
}