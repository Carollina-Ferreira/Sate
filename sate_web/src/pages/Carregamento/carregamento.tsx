
import { useEffect, useState, type CSSProperties } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import styles from './carregamento.module.css';

type LocationState = {
  destino?: string;
  mensagem?: string;
};

type CarregamentoProps = {
  /** Mantém a tela aberta até o componente pai terminar a consulta. */
  semRedirecionamento?: boolean;
  /** Texto usado pelas verificações de acesso e outros carregamentos. */
  mensagem?: string;
};

const mensagens = [
  'Preparando seu ambiente...',
  'Organizando suas equipes...',
  'Quase pronto...',
];

const DURACAO = 2200;

export default function Carregamento({
  semRedirecionamento = false,
  mensagem,
}: CarregamentoProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as LocationState | null;
  const [etapa, setEtapa] = useState(0);
  const [ciclo, setCiclo] = useState(0);

  useEffect(() => {
    if (semRedirecionamento) {
      // Reinicia a barra quando termina um ciclo. Não navega sozinho.
      const intervalo = window.setInterval(() => {
        setCiclo((atual) => atual + 1);
      }, DURACAO);

      return () => window.clearInterval(intervalo);
    }

    // Mantém o comportamento original da rota /carregamento.
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
  }, [navigate, semRedirecionamento, state?.destino]);

  const mensagemAtual =
    mensagem ||
    (state?.mensagem && etapa === 0
      ? state.mensagem
      : mensagens[etapa]);

  return (
    <main
      className={styles.page}
      role="status"
      aria-live="polite"
      aria-label="Carregando"
      aria-busy="true"
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
        {/* ÍCONE BRANCO DO SATE */}
        <div className={styles.brandMark} aria-hidden="true">
          <svg
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

        {/* LOGO */}
        <h1>
          SATE<span>.</span>
        </h1>

        {/* SLOGAN */}
        <p className={styles.tagline}>
          Treinar. Acompanhar. <em>Evoluir.</em>
        </p>

        {/* BARRA DE CARREGAMENTO */}
        <div className={styles.progress} aria-hidden="true">
          <i key={semRedirecionamento ? ciclo : 'original'} />
        </div>

        {/* MENSAGEM */}
        <p className={styles.status} key={mensagemAtual}>
          {mensagemAtual}
        </p>
      </section>
    </main>
  );
}
