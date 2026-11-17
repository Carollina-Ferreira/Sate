import styles from './OnboardingProgress.module.css';

type Etapa = 1 | 2 | 3 | 4;

interface Props {
  etapa: Etapa;
  descricao: string;
}

/** Quatro passos do primeiro acesso; sem duplicação de barras nas páginas. */
export default function OnboardingProgress({ etapa, descricao }: Props) {
  return (
    <div
      className={styles.wrapper}
      role="progressbar"
      aria-label="Configuração inicial do SATE"
      aria-valuemin={1}
      aria-valuemax={4}
      aria-valuenow={etapa}
      aria-valuetext={`Etapa ${etapa} de 4: ${descricao}`}
    >
      <div className={styles.badge}>Etapa {etapa} de 4 · {descricao}</div>
      <div className={styles.steps} aria-hidden="true">
        {([1, 2, 3, 4] as const).map((numero) => (
          <span
            key={numero}
            className={`${styles.step} ${
              numero < etapa ? styles.complete : numero === etapa ? styles.active : ''
            }`}
          />
        ))}
      </div>
    </div>
  );
}
