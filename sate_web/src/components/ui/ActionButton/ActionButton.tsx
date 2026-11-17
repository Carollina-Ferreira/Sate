import type { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './ActionButton.module.css';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  icon?: ReactNode;
}

/** Botão do Design System do SATE. Mantém atributos nativos e acessibilidade. */
export default function ActionButton({
  variant = 'primary',
  icon,
  className,
  children,
  type = 'button',
  ...rest
}: ActionButtonProps) {
  return (
    <button
      type={type}
      className={[styles.button, styles[variant], className].filter(Boolean).join(' ')}
      {...rest}
    >
      {icon && <span className={styles.icon} aria-hidden="true">{icon}</span>}
      {children}
    </button>
  );
}
