import { useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import styles from './esqueciSenha.module.css';

import athleteImg from '../../assets/img/login_img.png';

interface ForgotPasswordState {
  email: string;
}

const EsqueciSenha = () => {
  const [form, setForm] = useState<ForgotPasswordState>({
    email: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({
      email: e.target.value,
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log('Recuperação de senha:', form);
  };

  return (
    <div className={styles.page}>

      {/* ===================== LADO ESQUERDO ===================== */}

      <section className={styles.left}>

        <img
          src={athleteImg}
          alt=""
          className={styles.leftImage}
        />

        <div className={styles.leftOverlay} />

        <div
          className={styles.rings}
          aria-hidden="true"
        >
          <span className={styles.ring1} />
          <span className={styles.ring2} />
          <span className={styles.ring3} />
          <span className={styles.ring4} />
          <span className={styles.ring5} />
        </div>

        <svg
          className={styles.curves}
          viewBox="0 0 320 320"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M -20 260 C 40 220, 60 160, 40 90"
            stroke="var(--rosa)"
            strokeWidth="3"
            strokeLinecap="round"
          />

          <path
            d="M -30 300 C 30 280, 70 230, 60 150"
            stroke="var(--azul)"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>

        <div className={styles.leftContent}>
          <h1>
            Seu desempenho,
            <br />
            sempre acompanhado.
          </h1>

          <p>
            Tenha controle dos seus treinamentos, estatísticas e evolução
            esportiva em um único lugar.
          </p>
        </div>

        <div className={styles.leftFooter}>
          <span>50+ atletas</span>

          <span className={styles.dot}>•</span>

          <span>100+ partidas analisadas</span>

          <span className={styles.dot}>•</span>

          <span>5+ modalidades</span>
        </div>

      </section>


      {/* ===================== LADO DIREITO ===================== */}

      <section className={styles.right}>

        <div
          className={styles.decor}
          aria-hidden="true"
        >

          <div className={styles.dotGrid} />

          <span
            className={`${styles.blob} ${styles.blobGreen}`}
          />

          <span
            className={`${styles.blob} ${styles.blobBlue}`}
          />

          <span
            className={`${styles.blob} ${styles.blobPink}`}
          />

        </div>


        {/* ===================== FORMULÁRIO ===================== */}

        <div className={styles.formContainer}>

          <div className={styles.brandMark}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="2 12 8 12 11 20 14 4 17 12 22 12" />
            </svg>
          </div>

          <h2>
            Esqueceu sua senha?
          </h2>

          <p className={styles.subtitle}>
            Informe seu email e enviaremos um link para você redefinir sua senha.
          </p>


          <form
            className={styles.form}
            onSubmit={handleSubmit}
          >

            <div className={styles.inputGroup}>

              <label htmlFor="email">
                Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                placeholder="Digite seu email"
                required
              />

            </div>


            <button
              type="submit"
              className={styles.submitButton}
            >
              Enviar link
            </button>

          </form>


          <p className={styles.backText}>
            Lembrou da senha?{' '}

            <a
              href="/"
              className={styles.link}
            >
              Voltar para o login
            </a>
          </p>

        </div>

      </section>

    </div>
  );
};

export default EsqueciSenha;