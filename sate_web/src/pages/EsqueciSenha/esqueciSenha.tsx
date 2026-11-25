import { API_BASE } from '../../config/api';
import { useEffect, useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';

import { Link } from 'react-router-dom';

import {
  ArrowRight,
  Check,
  Mail,
} from 'lucide-react';

import styles from './esqueciSenha.module.css';
import LoadingState from '../../components/ui/LoadingState/LoadingState';

import logoVerdeImg from '../../assets/img/logoVerde_img.png';
import logo from '../../assets/img/logo.png';

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
      `${API_BASE}/password/esqueci-senha`,
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
    <main className={(styles.page + ' sate-auth-page')}>

      {/* =====================================================
          LADO ESQUERDO
      ===================================================== */}

      <section className={(styles.left + ' sate-auth-left')}>

        {/* IMAGENS */}

        <div
          className={(styles.heroImages + ' sate-auth-heroImages')}
          aria-hidden="true"
        >
          {heroSlides.map((image, index) => (
            <div
              key={image}
              className={`${styles.heroSlide} sate-auth-heroSlide ${
                index === activeSlide
                  ? (styles.heroSlideActive + ' sate-auth-heroSlideActive')
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
          className={(styles.leftOverlay + ' sate-auth-leftOverlay')}
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
          className={(styles.heroLogoLink + ' sate-auth-heroLogoLink')}
          aria-label="Página inicial do SATE"
        >
          <img
            src={logo}
            alt="SATE"
            className={(styles.heroLogo + ' sate-auth-heroLogo')}
          />
        </Link>


        {/* CONTEÚDO */}

        <div className={(styles.leftContent + ' sate-auth-leftContent')}>

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

        <div className={(styles.leftFooter + ' sate-auth-leftFooter')}>

          <div className={(styles.stat + ' sate-auth-stat')}>
            <strong>
              50+
            </strong>

            <span>
              atletas
            </span>
          </div>


          <span
            className={(styles.statDivider + ' sate-auth-statDivider')}
          />


          <div className={(styles.stat + ' sate-auth-stat')}>
            <strong>
              100+
            </strong>

            <span>
              partidas analisadas
            </span>
          </div>


          <span
            className={(styles.statDivider + ' sate-auth-statDivider')}
          />


          <div className={(styles.stat + ' sate-auth-stat')}>
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

      <section className={(styles.right + ' sate-auth-right')}>

        {/* FUNDO ANIMADO */}

        <div
          className={(styles.backgroundDecor + ' sate-auth-backgroundDecor')}
          aria-hidden="true"
        >
          <span
            className={`${styles.gradientOrb} sate-auth-gradientOrb ${styles.orbTop} sate-auth-orbTop`}
          />

          <span
            className={`${styles.gradientOrb} sate-auth-gradientOrb ${styles.orbRight} sate-auth-orbRight`}
          />

          <span
            className={`${styles.gradientOrb} sate-auth-gradientOrb ${styles.orbBottom} sate-auth-orbBottom`}
          />

          <span
            className={`${styles.gradientOrb} sate-auth-gradientOrb ${styles.orbLeft} sate-auth-orbLeft`}
          />

          <span
            className={`${styles.gradientOrb} sate-auth-gradientOrb ${styles.orbCenter} sate-auth-orbCenter`}
          />

          <span
            className={`${styles.gradientOrb} sate-auth-gradientOrb ${styles.orbSmallOne} sate-auth-orbSmallOne`}
          />

          <span
            className={`${styles.gradientOrb} sate-auth-gradientOrb ${styles.orbSmallTwo} sate-auth-orbSmallTwo`}
          />

          <span
            className={(styles.auroraTop + ' sate-auth-auroraTop')}
          />

          <span
            className={(styles.auroraBottom + ' sate-auth-auroraBottom')}
          />
        </div>


        {/* =====================================================
            CARD
        ===================================================== */}

        <div className={(styles.formContainer + ' sate-auth-formContainer')}>

          <img
            src={logoVerdeImg}
            alt="SATE"
            className={(styles.cardLogo + ' sate-auth-cardLogo')}
          />


          <div className={(styles.cardHeader + ' sate-auth-cardHeader')}>

            <h2>
              Esqueceu sua senha?
            </h2>

            <p className={(styles.subtitle + ' sate-auth-subtitle')}>
              Informe seu email e enviaremos
              um link para você redefinir sua senha.
            </p>

          </div>


          <form
            className={(styles.form + ' sate-auth-form')}
            onSubmit={handleSubmit}
          >

            <div className={(styles.inputGroup + ' sate-auth-inputGroup')}>

              <label htmlFor="email">
                Email
              </label>

              <div className={(styles.inputWrapper + ' sate-auth-inputWrapper')}>

                <Mail
                  size={18}
                  className={(styles.inputIcon + ' sate-auth-inputIcon')}
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
              <div className={(styles.errorMessage + ' sate-auth-errorMessage')}>
                {erro}
              </div>
            )}


            <button
              type="submit"
              className={(styles.submitButton + ' sate-auth-submitButton')}
              disabled={loading}
            >
              <span>
                {loading
                  ? <LoadingState variant="inline" title="Enviando link..." />
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


          <div className={(styles.backArea + ' sate-auth-backArea')}>

            <span>
              Lembrou da senha?
            </span>

            <Link
              to="/login"
              className={(styles.link + ' sate-auth-link')}
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
          className={(styles.modalOverlay + ' sate-auth-modalOverlay')}
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirmationTitle"
        >

          <div className={(styles.confirmationCard + ' sate-auth-confirmationCard')}>

            <div className={(styles.successIcon + ' sate-auth-successIcon')}>
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


            <span className={(styles.emailText + ' sate-auth-emailText')}>
              {form.email}
            </span>


            <button
              type="button"
              className={(styles.confirmationButton + ' sate-auth-confirmationButton')}
              onClick={fecharModal}
            >
              Entendi
            </button>


            <button
              type="button"
              className={(styles.resendButton + ' sate-auth-resendButton')}
              onClick={reenviarEmail}
              disabled={reenviando}
            >
              {reenviando
                ? <LoadingState variant="inline" title="Reenviando..." />
                : 'Reenviar e-mail'}
            </button>


            {mensagemReenvio && (
              <p className={(styles.resendMessage + ' sate-auth-resendMessage')}>
                {mensagemReenvio}
              </p>
            )}


            <Link
              to="/login"
              className={(styles.confirmationLink + ' sate-auth-confirmationLink')}
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