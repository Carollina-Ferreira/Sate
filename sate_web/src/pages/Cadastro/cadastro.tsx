import { useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { Link } from 'react-router-dom';

import styles from './cadastro.module.css';

import athleteImg from '../../assets/img/login_img.png';

interface CadastroFormState {
  nome: string;
  email: string;
  senha: string;
  confirmarSenha: string;
  termos: boolean;
}

const Cadastro = () => {
  const [form, setForm] = useState<CadastroFormState>({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    termos: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (form.senha !== form.confirmarSenha) {
      alert('As senhas não coincidem.');
      return;
    }

    if (!form.termos) {
      alert('Aceite os termos para continuar.');
      return;
    }

    console.log('Cadastro:', form);
  };

  return (
    <div className={styles.page}>

      {/* ===================== LADO ESQUERDO ===================== */}

      <section className={styles.left}>

        {/* Imagem */}
        <img
          src={athleteImg}
          alt=""
          className={styles.leftImage}
        />

        {/* Overlay verde */}
        <div className={styles.leftOverlay} />

        {/* Círculos decorativos */}
        <div
          className={styles.rings}
          aria-hidden="true"
        >
          <span />
          <span />
          <span />
        </div>

        {/* Curvas coloridas */}
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

        {/* Conteúdo */}
        <div className={styles.leftContent}>
          <h1>
            Transforme seus dados
            <br />
            em desempenho.
          </h1>

          <p>
            Crie sua conta e tenha acesso a uma plataforma completa
            para acompanhar e evoluir o desempenho esportivo.
          </p>
        </div>

        {/* Informações inferiores */}
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

        {/* Elementos decorativos */}
        <div
          className={styles.decor}
          aria-hidden="true"
        >

          {/* Grade de pontos */}
          <div className={styles.dotGrid} />

          {/* Blobs */}
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


        {/* ===================== CARD DE CADASTRO ===================== */}

        <div className={styles.formContainer}>

          {/* Logo */}
          <div
            className={styles.brandMark}
            aria-hidden="true"
          >
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


          {/* Título */}
          <h2>
            Crie sua conta
          </h2>

          <p className={styles.subtitle}>
            Cadastre-se para começar a acompanhar o desempenho da sua equipe.
          </p>


          {/* Formulário */}
          <form
            className={styles.form}
            onSubmit={handleSubmit}
          >

            {/* Nome */}

            <div className={styles.inputGroup}>

              <label htmlFor="nome">
                Nome completo
              </label>

              <input
                id="nome"
                name="nome"
                type="text"
                value={form.nome}
                onChange={handleChange}
                autoComplete="name"
                placeholder="Digite seu nome"
                required
              />

            </div>


            {/* Email */}

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


            {/* Senha */}

            <div className={styles.inputGroup}>

              <label htmlFor="senha">
                Senha
              </label>

              <div className={styles.passwordWrapper}>

                <input
                  id="senha"
                  name="senha"
                  type={showPassword ? 'text' : 'password'}
                  value={form.senha}
                  onChange={handleChange}
                  autoComplete="new-password"
                  placeholder="Digite sua senha"
                  required
                />

                {form.senha.length > 0 && (
                  <button
                    type="button"
                    className={styles.passwordToggle}
                    onClick={() =>
                      setShowPassword((prev) => !prev)
                    }
                    aria-label={
                      showPassword
                        ? 'Ocultar senha'
                        : 'Mostrar senha'
                    }
                  >
                    {showPassword
                      ? 'visibility_off'
                      : 'visibility'}
                  </button>
                )}

              </div>

            </div>


            {/* Confirmar senha */}

            <div className={styles.inputGroup}>

              <label htmlFor="confirmarSenha">
                Confirmar senha
              </label>

              <div className={styles.passwordWrapper}>

                <input
                  id="confirmarSenha"
                  name="confirmarSenha"
                  type={
                    showConfirmPassword
                      ? 'text'
                      : 'password'
                  }
                  value={form.confirmarSenha}
                  onChange={handleChange}
                  autoComplete="new-password"
                  placeholder="Digite sua senha novamente"
                  required
                />

                {form.confirmarSenha.length > 0 && (
                  <button
                    type="button"
                    className={styles.passwordToggle}
                    onClick={() =>
                      setShowConfirmPassword((prev) => !prev)
                    }
                    aria-label={
                      showConfirmPassword
                        ? 'Ocultar senha'
                        : 'Mostrar senha'
                    }
                  >
                    {showConfirmPassword
                      ? 'visibility_off'
                      : 'visibility'}
                  </button>
                )}

              </div>

            </div>


            {/* Termos */}

            <label className={styles.terms}>

              <input
                type="checkbox"
                name="termos"
                checked={form.termos}
                onChange={handleChange}
              />

              <span>
                Li e concordo com os termos de uso.
              </span>

            </label>


            {/* Botão */}

            <button
              type="submit"
              className={styles.submitButton}
            >
              Criar conta
            </button>

          </form>


          {/* Login */}

          <p className={styles.loginText}>
            Já possui uma conta?{' '}

            <Link
              to="/"
              className={styles.link}
            >
              Entrar
            </Link>

          </p>

        </div>

      </section>

    </div>
  );
};

export default Cadastro;