import { useEffect, useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';

import { Link } from 'react-router-dom';

import {
  ArrowRight,
  Check,
  Mail,
} from 'lucide-react';

import styles from './esqueciSenha.module.css';

import logoVerdeImg from '../../assets/img/logoVerde_img.png';

import futebolHero from '../../assets/img/hero/futebol.png.png';
import basqueteHero from '../../assets/img/hero/basquete.png.png';
import voleiHero from '../../assets/img/hero/volei.png.png';
import handebolHero from '../../assets/img/hero/handebol.png.png';
import rugbyHero from '../../assets/img/hero/rugby.png.png';
import natacaoHero from '../../assets/img/hero/natacao.png.png';
import atletismoHero from '../../assets/img/hero/atletismo.png.png';
import tenisHero from '../../assets/img/hero/tenis.png.png';


interface ForgotPasswordState {
  email: string;
}


interface ForgotPasswordResponse {
  mensagem: string;
}


const heroSlides = [
  futebolHero,
  basqueteHero,
  voleiHero,
  handebolHero,
  rugbyHero,
  natacaoHero,
  atletismoHero,
  tenisHero,
];


const EsqueciSenha = () => {
  const [form, setForm] =
    useState<ForgotPasswordState>({
      email: '',
    });

  const [emailEnviado, setEmailEnviado] =
    useState(false);

  const [reenviando, setReenviando] =
    useState(false);

  const [mensagemReenvio, setMensagemReenvio] =
    useState('');

  const [loading, setLoading] =
    useState(false);

  const [erro, setErro] =
    useState('');

  const [activeSlide, setActiveSlide] =
    useState(0);


  /* ============================================================
     FADE DAS IMAGENS
  ============================================================ */

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveSlide((current) => {
        return (current + 1) % heroSlides.length;
      });
    }, 18000);

    return () => {
      window.clearInterval(interval);
    };
  }, []);


  /* ============================================================
     INPUT
  ============================================================ */

  const handleChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    setForm({
      email: e.target.value,
    });

    if (erro) {
      setErro('');
    }
  };


  /* ============================================================
     RECUPERAÇÃO
  ============================================================ */

  const solicitarRecuperacao = async () => {
    const resposta = await fetch(
      'http://localhost:3000/api/password/esqueci-senha',
      {
        method: 'POST',

        headers: {
          'Content-Type':
            'application/json',
        },

        body: JSON.stringify({
          email: form.email,
        }),
      }
    );

    const data: ForgotPasswordResponse =
      await resposta.json();

    if (!resposta.ok) {
      throw new Error(
        data.mensagem ||
          'Não foi possível solicitar a recuperação.'
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
    <main className={styles.page}>

      {/* =====================================================
          LADO ESQUERDO
      ===================================================== */}

      <section className={styles.left}>

        {/* IMAGENS */}

        <div
          className={styles.heroImages}
          aria-hidden="true"
        >
          {heroSlides.map((image, index) => (
            <div
              key={image}
              className={`${styles.heroSlide} ${
                index === activeSlide
                  ? styles.heroSlideActive
                  : ''
              }`}
              style={{
                backgroundImage: `url(${image})`,
              }}
            />
          ))}
        </div>


        {/* OVERLAY */}

        <div
          className={styles.leftOverlay}
          aria-hidden="true"
        />


        {/* 3 CURVAS */}

        <svg
          className={styles.topCurves}
          viewBox="0 0 620 320"
          fill="none"
          aria-hidden="true"
        >
          <path d="M-110 265 C80 245 205 142 252 -48" />

          <path d="M-95 320 C130 290 284 165 332 -62" />

          <path d="M25 332 C235 292 392 154 425 -70" />
        </svg>


        <span
          className={styles.pinkAccent}
          aria-hidden="true"
        />


        {/* LOGO */}

        <Link
          to="/"
          className={styles.heroLogoLink}
          aria-label="Página inicial do SATE"
        >
          <img
            src={logoVerdeImg}
            alt="SATE"
            className={styles.heroLogo}
          />
        </Link>


        {/* CONTEÚDO */}

        <div className={styles.leftContent}>

          <h1>
            <span>
              Seu desempenho,
            </span>

            <span>
              sempre{' '}
              <em>
                acompanhado.
              </em>
            </span>
          </h1>

          <p>
            Tenha controle dos seus treinamentos,
            estatísticas e evolução esportiva em
            um único lugar.
          </p>

        </div>


        {/* ESTATÍSTICAS */}

        <div className={styles.leftFooter}>

          <div className={styles.stat}>
            <strong>
              50+
            </strong>

            <span>
              atletas
            </span>
          </div>


          <span
            className={styles.statDivider}
          />


          <div className={styles.stat}>
            <strong>
              100+
            </strong>

            <span>
              partidas analisadas
            </span>
          </div>


          <span
            className={styles.statDivider}
          />


          <div className={styles.stat}>
            <strong>
              5+
            </strong>

            <span>
              modalidades
            </span>
          </div>

        </div>

      </section>


      {/* =====================================================
          LADO DIREITO
      ===================================================== */}

      <section className={styles.right}>

        {/* FUNDO ANIMADO */}

        <div
          className={styles.backgroundDecor}
          aria-hidden="true"
        >
          <span
            className={`${styles.gradientOrb} ${styles.orbTop}`}
          />

          <span
            className={`${styles.gradientOrb} ${styles.orbRight}`}
          />

          <span
            className={`${styles.gradientOrb} ${styles.orbBottom}`}
          />

          <span
            className={`${styles.gradientOrb} ${styles.orbLeft}`}
          />

          <span
            className={`${styles.gradientOrb} ${styles.orbCenter}`}
          />

          <span
            className={`${styles.gradientOrb} ${styles.orbSmallOne}`}
          />

          <span
            className={`${styles.gradientOrb} ${styles.orbSmallTwo}`}
          />

          <span
            className={styles.auroraTop}
          />

          <span
            className={styles.auroraBottom}
          />
        </div>


        {/* =====================================================
            CARD
        ===================================================== */}

        <div className={styles.formContainer}>

          <img
            src={logoVerdeImg}
            alt="SATE"
            className={styles.cardLogo}
          />


          <div className={styles.cardHeader}>

            <h2>
              Esqueceu sua senha?
            </h2>

            <p className={styles.subtitle}>
              Informe seu email e enviaremos
              um link para você redefinir sua senha.
            </p>

          </div>


          <form
            className={styles.form}
            onSubmit={handleSubmit}
          >

            <div className={styles.inputGroup}>

              <label htmlFor="email">
                Email
              </label>

              <div className={styles.inputWrapper}>

                <Mail
                  size={18}
                  className={styles.inputIcon}
                />

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

            </div>


            {erro && (
              <div className={styles.errorMessage}>
                {erro}
              </div>
            )}


            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              <span>
                {loading
                  ? 'Enviando...'
                  : 'Enviar link'}
              </span>

              {!loading && (
                <ArrowRight
                  size={20}
                  strokeWidth={1.8}
                />
              )}
            </button>

          </form>


          <div className={styles.backArea}>

            <span>
              Lembrou da senha?
            </span>

            <Link
              to="/login"
              className={styles.link}
            >
              Voltar para o login
            </Link>

          </div>

        </div>

      </section>


      {/* =====================================================
          MODAL
      ===================================================== */}

      {emailEnviado && (

        <div
          className={styles.modalOverlay}
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirmationTitle"
        >

          <div className={styles.confirmationCard}>

            <div className={styles.successIcon}>
              <Check
                size={28}
                strokeWidth={2.4}
              />
            </div>


            <h2 id="confirmationTitle">
              E-mail enviado!
            </h2>


            <p>
              Enviamos um link para redefinir
              sua senha. Verifique sua caixa
              de entrada e a pasta de spam.
            </p>


            <span className={styles.emailText}>
              {form.email}
            </span>


            <button
              type="button"
              className={styles.confirmationButton}
              onClick={fecharModal}
            >
              Entendi
            </button>


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


            {mensagemReenvio && (
              <p className={styles.resendMessage}>
                {mensagemReenvio}
              </p>
            )}


            <Link
              to="/login"
              className={styles.confirmationLink}
            >
              Voltar para o login
            </Link>

          </div>

        </div>

      )}

    </main>
  );
};

export default EsqueciSenha;