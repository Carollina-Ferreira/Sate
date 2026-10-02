import { useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { Link } from 'react-router-dom';

import styles from './esqueciSenha.module.css';

import athleteImg from '../../assets/img/login_img.png';

interface ForgotPasswordState {
  email: string;
}

interface ForgotPasswordResponse {
  mensagem: string;
}

const EsqueciSenha = () => {
  const [form, setForm] = useState<ForgotPasswordState>({
    email: '',
  });

  const [emailEnviado, setEmailEnviado] = useState(false);
  const [reenviando, setReenviando] = useState(false);
  const [mensagemReenvio, setMensagemReenvio] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({
      email: e.target.value,
    });

    if (erro) {
      setErro('');
    }
  };

  const solicitarRecuperacao = async () => {
    const resposta = await fetch(
      'http://localhost:3000/api/password/esqueci-senha',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: form.email,
        }),
      }
    );

    const data: ForgotPasswordResponse = await resposta.json();

    if (!resposta.ok) {
      throw new Error(
        data.mensagem || 'Não foi possível solicitar a recuperação.'
      );
    }

    return data;
  };

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setErro('');
    setMensagemReenvio('');
    setLoading(true);

    try {
      await solicitarRecuperacao();

      setEmailEnviado(true);
    } catch (error) {
      console.error(
        'Erro ao solicitar recuperação:',
        error
      );

      if (error instanceof Error) {
        setErro(error.message);
      } else {
        setErro(
          'Não foi possível conectar ao servidor.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const fecharModal = () => {
    setEmailEnviado(false);
    setMensagemReenvio('');
  };

  const reenviarEmail = async () => {
    setReenviando(true);
    setMensagemReenvio('');

    try {
      await solicitarRecuperacao();

      setMensagemReenvio(
        'E-mail reenviado com sucesso!'
      );
    } catch (error) {
      console.error(
        'Erro ao reenviar email:',
        error
      );

      setMensagemReenvio(
        'Não foi possível reenviar o e-mail.'
      );
    } finally {
      setReenviando(false);
    }
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
                disabled={loading}
              />

            </div>


            {erro && (
              <p
                style={{
                  color: '#D52941',
                  marginTop: '8px',
                  fontSize: '14px',
                }}
              >
                {erro}
              </p>
            )}


            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? 'Enviando...' : 'Enviar link'}
            </button>

          </form>


          <p className={styles.backText}>

            Lembrou da senha?{' '}

            <Link
              to="/"
              className={styles.link}
            >
              Voltar para o login
            </Link>

          </p>

        </div>

      </section>


      {/* ===================== MODAL DE CONFIRMAÇÃO ===================== */}

      {emailEnviado && (

        <div
          className={styles.modalOverlay}
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirmationTitle"
        >

          <div className={styles.confirmationCard}>

            {/* ÍCONE DE SUCESSO */}

            <div className={styles.successIcon}>

              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>

            </div>


            {/* TÍTULO */}

            <h2 id="confirmationTitle">
              E-mail enviado!
            </h2>


            {/* DESCRIÇÃO */}

            <p>
              Enviamos um link para redefinir sua senha.
              Verifique sua caixa de entrada e a pasta de spam.
            </p>


            {/* EMAIL */}

            <span className={styles.emailText}>
              {form.email}
            </span>


            {/* BOTÃO ENTENDI */}

            <button
              type="button"
              className={styles.confirmationButton}
              onClick={fecharModal}
            >
              Entendi
            </button>


            {/* REENVIAR E-MAIL */}

            <button
              type="button"
              className={styles.resendButton}
              onClick={reenviarEmail}
              disabled={reenviando}
            >
              {reenviando
                ? 'Reenviando...'
                : 'Reenviar e-mail'}
            </button>


            {/* MENSAGEM DE REENVIO */}

            {mensagemReenvio && (

              <p className={styles.resendMessage}>
                {mensagemReenvio}
              </p>

            )}


            {/* VOLTAR PARA LOGIN */}

            <Link
              to="/"
              className={styles.confirmationLink}
            >
              Voltar para o login
            </Link>

          </div>

        </div>

      )}

    </div>
  );
};

export default EsqueciSenha;