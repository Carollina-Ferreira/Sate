import { useEffect, useState } from 'react';
import styles from './LoadingState.module.css';

/**
 * Loading global do SATE, com o visual da tela Carregamento.
 *
 * Todas as variantes usadas no site continuam aceitas.
 * A aparência é a mesma para os carregamentos de seção/página;
 * apenas `inline` e `thumbnail` são compactos para caber em botões
 * e nas prévias dos vídeos.
 *
 * Nenhum temporizador encerra o loading ou redireciona a página.
 * Ele desaparece quando o componente pai deixa de renderizá-lo.
 */
export type LoadingVariant =
  | 'cards'
  | 'videos'
  | 'table'
  | 'charts'
  | 'inline'
  | 'thumbnail'
  | 'list'
  | 'form'
  | 'page';

export interface LoadingStateProps {
  variant?: LoadingVariant;
  title?: string;
  description?: string;
  count?: number; // Mantido por compatibilidade com as páginas atuais.
  className?: string;
}

const DEFAULT_TITLES: Record<LoadingVariant, string> = {
  cards: 'Carregando informações...',
  videos: 'Carregando clipes...',
  table: 'Carregando registros...',
  charts: 'Preparando gráficos...',
  inline: 'Carregando...',
  thumbnail: 'Gerando prévia...',
  list: 'Carregando informações...',
  form: 'Carregando formulário...',
  page: 'Preparando seu ambiente...',
};

const MENSAGENS_GERAIS = [
  'Preparando seu ambiente...',
  'Organizando suas equipes...',
  'Quase pronto...',
];

function Batimentos({ compact = false }: { compact?: boolean }) {
  return (
    <svg
      className={compact ? styles.smallIcon : styles.brandIcon}
      width={compact ? 20 : 38}
      height={compact ? 20 : 38}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline
        className={styles.pulse}
        points="2 12 8 12 11 20 14 4 17 12 22 12"
      />
    </svg>
  );
}

export default function LoadingState({
  variant = 'cards',
  title,
  description,
  className = '',
}: LoadingStateProps) {
  const [etapa, setEtapa] = useState(0);

  // Alterna as mensagens somente quando a tela de abertura não recebeu
  // uma mensagem específica. Não controla a duração da requisição.
  useEffect(() => {
    if (variant !== 'page' || title !== undefined) return;

    const intervalo = window.setInterval(() => {
      setEtapa((anterior) => (anterior + 1) % MENSAGENS_GERAIS.length);
    }, 1400);

    return () => window.clearInterval(intervalo);
  }, [variant, title]);

  const titulo =
    title ??
    (variant === 'page'
      ? MENSAGENS_GERAIS[etapa]
      : DEFAULT_TITLES[variant]);

  // Carregamentos em botões e pequenos controles não ocupam a tela toda.
  if (variant === 'inline') {
    return (
      <span
        className={`${styles.inline} ${className}`.trim()}
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        <Batimentos compact />
        <span>{titulo}</span>
      </span>
    );
  }

  // Carregamento das miniaturas: mesma marca, versão compacta.
  if (variant === 'thumbnail') {
    return (
      <div
        className={`${styles.thumbnail} ${className}`.trim()}
        role="status"
        aria-label={titulo}
        aria-busy="true"
      >
        <span className={styles.miniRings} aria-hidden="true" />
        <span className={styles.miniContent}>
          <Batimentos compact />
          <span>{titulo}</span>
        </span>
      </div>
    );
  }

  // Este painel é o mesmo para cards, vídeos, tabelas, gráficos, listas,
  // formulários e a tela inteira. As props antigas continuam funcionando.
  const conteudo = (
    <>
      <div className={styles.rings} aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </div>

      <div className={styles.content}>
        <div className={styles.brandMark} aria-hidden="true">
          <Batimentos />
        </div>

        <h1 className={styles.brandName}>
          SATE<span>.</span>
        </h1>

        <p className={styles.tagline}>
          Treinar. Acompanhar. <em>Evoluir.</em>
        </p>

        <div className={styles.progress} aria-hidden="true">
          <i />
        </div>

        <p className={styles.status} key={titulo}>
          {titulo}
        </p>

        {description && description !== 'Treinar. Acompanhar. Evoluir.' && (
          <p className={styles.description}>{description}</p>
        )}
      </div>
    </>
  );

  const classes = `${styles.screen} ${
    variant === 'page' ? styles.page : styles.section
  } ${className}`.trim();

  if (variant === 'page') {
    return (
      <main
        className={classes}
        role="status"
        aria-label="Carregando"
        aria-live="polite"
        aria-busy="true"
      >
        {conteudo}
      </main>
    );
  }

  return (
    <section
      className={classes}
      role="status"
      aria-label="Carregando"
      aria-live="polite"
      aria-busy="true"
    >
      {conteudo}
    </section>
  );
}
