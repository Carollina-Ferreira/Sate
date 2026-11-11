import type { CSSProperties } from 'react';
import styles from './LoadingState.module.css';

/**
 * Padrão único de carregamento para o site SATE.
 * Os elementos provisórios são visuais: nunca exibem dados fictícios.
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

interface LoadingStateProps {
  variant?: LoadingVariant;
  title?: string;
  description?: string;
  count?: number;
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

const DEFAULT_COUNTS: Record<LoadingVariant, number> = {
  cards: 6,
  videos: 6,
  table: 5,
  charts: 2,
  inline: 1,
  thumbnail: 1,
  list: 5,
  form: 1,
  page: 1,
};

function SkeletonLine({ width = '100%' }: { width?: CSSProperties['width'] }) {
  return (
    <span
      className={styles.skeletonLine}
      style={{ width }}
    />
  );
}

export default function LoadingState({
  variant = 'cards',
  title,
  description,
  count,
  className = '',
}: LoadingStateProps) {
  const quantidade = Math.min(
    12,
    Math.max(1, Math.floor(count ?? DEFAULT_COUNTS[variant])),
  );
  const itens = Array.from({ length: quantidade }, (_, index) => index);
  const titulo = title ?? DEFAULT_TITLES[variant];

  if (variant === 'page') {
    return (
      <main className={`${styles.page} ${className}`.trim()} role="status" aria-live="polite" aria-busy="true">
        <div className={styles.pageBrand}>SATE<span>.</span></div>
        <LoadingState variant="inline" title={titulo} />
        {description && <p className={styles.pageDescription}>{description}</p>}
      </main>
    );
  }

  if (variant === 'inline') {
    return (
      <div
        className={`${styles.inline} ${className}`.trim()}
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        <span className={styles.dots} aria-hidden="true">
          <i /><i /><i />
        </span>
        <span>{titulo}</span>
      </div>
    );
  }

  if (variant === 'thumbnail') {
    return (
      <div
        className={`${styles.thumbnail} ${className}`.trim()}
        role="status"
        aria-label={titulo}
        aria-busy="true"
      >
        <span className={styles.thumbnailShimmer} aria-hidden="true" />
        <span className={styles.thumbnailContent}>
          <span className={styles.dots} aria-hidden="true">
            <i /><i /><i />
          </span>
          <span>{titulo}</span>
        </span>
      </div>
    );
  }

  return (
    <section
      className={`${styles.root} ${className}`.trim()}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className={styles.heading}>
        <span className={styles.dots} aria-hidden="true">
          <i /><i /><i />
        </span>
        <div>
          <strong>{titulo}</strong>
          {description && <p>{description}</p>}
        </div>
      </div>

      {variant === 'list' && (
        <div className={styles.listShell} aria-hidden="true">
          {itens.map(item => (
            <div className={styles.listRow} key={item}>
              <span className={styles.listIcon} />
              <div className={styles.listTexts}>
                <SkeletonLine width="80%" />
                <SkeletonLine width="48%" />
              </div>
            </div>
          ))}
        </div>
      )}

      {variant === 'form' && (
        <div className={styles.formShell} aria-hidden="true">
          {[0, 1, 2, 3].map(item => (
            <div className={styles.formField} key={item}>
              <SkeletonLine width="35%" />
              <span className={styles.formInput} />
            </div>
          ))}
        </div>
      )}

      {variant === 'cards' && (
        <div className={styles.cardsGrid} aria-hidden="true">
          {itens.map((item) => (
            <div className={styles.athleteCard} key={item}>
              <span className={styles.avatar} />
              <SkeletonLine width="68%" />
              <SkeletonLine width="48%" />
              <div className={styles.cardBadges}>
                <SkeletonLine width="38%" />
                <SkeletonLine width="24%" />
              </div>
            </div>
          ))}
        </div>
      )}

      {variant === 'videos' && (
        <div className={styles.cardsGrid} aria-hidden="true">
          {itens.map((item) => (
            <div className={styles.videoCard} key={item}>
              <span className={styles.videoPreview} />
              <div className={styles.videoContent}>
                <SkeletonLine width="72%" />
                <SkeletonLine width="52%" />
                <SkeletonLine width="34%" />
              </div>
            </div>
          ))}
        </div>
      )}

      {variant === 'table' && (
        <div className={styles.tableShell} aria-hidden="true">
          <div className={`${styles.tableRow} ${styles.tableHeader}`}>
            {[60, 40, 55, 35, 45].map((width, i) => (
              <SkeletonLine key={i} width={`${width}%`} />
            ))}
          </div>
          {itens.map((item) => (
            <div className={styles.tableRow} key={item}>
              {[78, 54, 66, 42, 55].map((width, i) => (
                <SkeletonLine key={i} width={`${width}%`} />
              ))}
            </div>
          ))}
        </div>
      )}

      {variant === 'charts' && (
        <div className={styles.chartsGrid} aria-hidden="true">
          {itens.map((item) => (
            <div className={styles.chartCard} key={item}>
              <SkeletonLine width="58%" />
              <SkeletonLine width="76%" />
              <div className={styles.chartCanvas}>
                {[44, 65, 35, 80, 58, 72, 49].map((height, i) => (
                  <span
                    key={i}
                    className={styles.chartBar}
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
