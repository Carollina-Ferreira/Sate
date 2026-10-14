import {
  Activity,
} from 'lucide-react';

import styles from './loadingscreen.module.css';


interface LoadingScreenProps {
  texto?: string;
}


export default function LoadingScreen({
  texto = 'Preparando seu ambiente esportivo...',
}: LoadingScreenProps) {
  return (
    <div className={styles.overlay}>

      <div className={styles.content}>

        {/* LOGO */}

        <div className={styles.brand}>
          <div className={styles.brandIcon}>
            <Activity
              size={24}
              strokeWidth={2.3}
            />
          </div>

          <span>
            SATE
          </span>
        </div>


        {/* ANIMAÇÃO */}

        <div className={styles.loaderArea}>

          <div className={styles.loaderRing}>
            <span />
          </div>


          <div className={styles.loaderCenter}>
            <Activity
              size={34}
              strokeWidth={2}
            />
          </div>

        </div>


        {/* TEXTO */}

        <div className={styles.textArea}>

          <h1>
            Preparando seu painel
          </h1>

          <p>
            {texto}
          </p>

        </div>


        {/* INDICADOR */}

        <div className={styles.loadingLine}>
          <span />
        </div>


        <span className={styles.status}>
          Dados • Equipes • Desempenho
        </span>

      </div>

    </div>
  );
}