import type { ReactNode } from 'react';
import styles from './PageHeading.module.css';

/** Cabeçalho único para telas internas: título, descrição e ações opcionais. */
interface PageHeadingProps {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export default function PageHeading({
  title,
  description,
  actions,
  className,
}: PageHeadingProps) {
  return (
    <header className={[styles.heading, className].filter(Boolean).join(' ')}>
      <div className={styles.copy}>
        <h1 className={styles.title}>{title}</h1>
        {description && <p className={styles.description}>{description}</p>}
      </div>
      {actions && <div className={styles.actions}>{actions}</div>}
    </header>
  );
}
