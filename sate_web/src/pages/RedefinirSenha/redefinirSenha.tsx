import { API_BASE } from '../../config/api';

import { useEffect, useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';

import styles from '../EsqueciSenha/esqueciSenha.module.css';
import LoadingState from '../../components/ui/LoadingState/LoadingState';

import logoVerdeImg from '../../assets/img/logoVerde_img.png';

import futebolHero from '../../assets/img/hero/futebol.png.png';
import basqueteHero from '../../assets/img/hero/basquete.png.png';
import voleiHero from '../../assets/img/hero/volei.png.png';
import handebolHero from '../../assets/img/hero/handebol.png.png';
import rugbyHero from '../../assets/img/hero/rugby.png.png';
import natacaoHero from '../../assets/img/hero/natacao.png.png';
import atletismoHero from '../../assets/img/hero/atletismo.png.png';
import tenisHero from '../../assets/img/hero/tenis.png.png';

// ======================================================
// IMAGENS DO CARROSSEL
// ======================================================

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

interface ResetPasswordResponse {
  mensagem: string;
}

// ======================================================
// COMPONENTE
// ======================================================

const RedefinirSenha = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get('token') || '';

  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);

  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  const [activeSlide, setActiveSlide] = useState(0);

  // ======================================================
  // FADE DAS IMAGENS
  // ======================================================

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

  // ======================================================
  // INPUTS
  // ======================================================

  const handleSenha = (event: ChangeEvent<HTMLInputElement>) => {
    setSenha(event.target.value);
    setErro('');
  };

  const handleConfirmacao = (event: ChangeEvent<HTMLInputElement>) => {
    setConfirmarSenha(event.target.value);
    setErro('');
  };

  // ======================================================
  // REDEFINIR SENHA
  // ======================================================

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setErro('');
    setSucesso('');

    if (!token) {
      setErro(
        'O link está incompleto. Solicite uma nova recuperação de senha.'
      );
      return;
    }

    if (senha.length < 8) {
      setErro('A senha deve ter pelo menos 8 caracteres.');
      return;
    }

    if (senha !== confirmarSenha) {
      setErro('As senhas não coincidem.');
      return;
    }

    setLoading(true);

    try {
      const resposta = await fetch(
        `${API_BASE}/password/redefinir-senha`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            token,
            senha,
          }),
        }
      );

      const data: ResetPasswordResponse = await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          data.mensagem || 'Não foi possível redefinir sua senha.'
        );
      }

      setSucesso(data.mensagem);
      setSenha('');
      setConfirmarSenha('');
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : 'Não foi possível conectar ao servidor.'
      );
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // RENDERIZAÇÃO
  // ======================================================

  return (
    <main className={styles.page}>

      {/* ==================================================
          LADO ESQUERDO
      ================================================== */}

      <section className={styles.left}>

        {/* IMAGENS COM FADE */}

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

        {/* CURVAS DECORATIVAS */}

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

        {/* DETALHE ROSA */}

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

        {/* TEXTO */}

        <div className={styles.leftContent}>
          <h1>
            <span>Seu acesso,</span>
            <span>
              de volta ao <em>jogo.</em>
            </span>
          </h1>

          <p>
            Crie uma nova senha e continue acompanhando seus treinamentos,
            equipes e evolução esportiva.
          </p>
        </div>

        {/* INDICADORES */}

        <div className={styles.leftFooter}>
          <div className={styles.stat}>
            <strong>
              <ShieldCheck size={21} />
            </strong>

            <span>Conta protegida</span>
          </div>

          <span className={styles.statDivider} />

          <div className={styles.stat}>
            <strong>30 min</strong>

            <span>Validade do link</span>
          </div>
        </div>

      </section>

      {/* ==================================================
          LADO DIREITO
      ================================================== */}

      <section className={styles.right}>

        {/* FUNDO DECORATIVO */}

        <div
          className={styles.backgroundDecor}
          aria-hidden="true"
        >
          <span className={`${styles.gradientOrb} ${styles.orbTop}`} />

          <span className={`${styles.gradientOrb} ${styles.orbRight}`} />

          <span className={`${styles.gradientOrb} ${styles.orbBottom}`} />

          <span className={`${styles.gradientOrb} ${styles.orbLeft}`} />

          <span className={`${styles.gradientOrb} ${styles.orbCenter}`} />

          <span className={`${styles.gradientOrb} ${styles.orbSmallOne}`} />

          <span className={`${styles.gradientOrb} ${styles.orbSmallTwo}`} />

          <span className={styles.auroraTop} />

          <span className={styles.auroraBottom} />
        </div>

        {/* CARD */}

        <div className={styles.formContainer}>

          {/* LOGO */}

          <img
            src={logoVerdeImg}
            alt="SATE"
            className={styles.cardLogo}
          />

          {/* CABEÇALHO */}

          <div className={styles.cardHeader}>
            <h2>Crie uma nova senha</h2>

            <p className={styles.subtitle}>
              Escolha uma senha segura para voltar a acessar sua conta.
            </p>
          </div>

          {/* FORMULÁRIO */}

          {!sucesso ? (
            <form
              className={styles.form}
              onSubmit={handleSubmit}
            >

              {/* NOVA SENHA */}

              <div className={styles.inputGroup}>
                <label htmlFor="novaSenha">
                  Nova senha
                </label>

                <div className={styles.inputWrapper}>
                  <LockKeyhole
                    size={18}
                    className={styles.inputIcon}
                  />

                  <input
                    id="novaSenha"
                    type={mostrarSenha ? 'text' : 'password'}
                    value={senha}
                    onChange={handleSenha}
                    placeholder="Digite sua nova senha"
                    autoComplete="new-password"
                    minLength={8}
                    required
                    disabled={loading || !token}
                  />

                  <button
                    type="button"
                    className={styles.passwordToggle}
                    onClick={() => setMostrarSenha((value) => !value)}
                    aria-label={
                      mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'
                    }
                  >
                    {mostrarSenha ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* CONFIRMAR SENHA */}

              <div className={styles.inputGroup}>
                <label htmlFor="confirmarSenha">
                  Confirmar nova senha
                </label>

                <div className={styles.inputWrapper}>
                  <LockKeyhole
                    size={18}
                    className={styles.inputIcon}
                  />

                  <input
                    id="confirmarSenha"
                    type={mostrarConfirmacao ? 'text' : 'password'}
                    value={confirmarSenha}
                    onChange={handleConfirmacao}
                    placeholder="Digite novamente sua senha"
                    autoComplete="new-password"
                    minLength={8}
                    required
                    disabled={loading || !token}
                  />

                  <button
                    type="button"
                    className={styles.passwordToggle}
                    onClick={() =>
                      setMostrarConfirmacao((value) => !value)
                    }
                    aria-label={
                      mostrarConfirmacao ? 'Ocultar senha' : 'Mostrar senha'
                    }
                  >
                    {mostrarConfirmacao ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              <p className={styles.subtitle}>
                Utilize pelo menos 8 caracteres.
              </p>

              {/* ERRO */}

              {erro && (
                <div className={styles.errorMessage}>
                  {erro}
                </div>
              )}

              {!token && (
                <div className={styles.errorMessage}>
                  O link não contém um token válido. Solicite uma nova recuperação.
                </div>
              )}

              {/* BOTÃO */}

              <button
                type="submit"
                className={styles.submitButton}
                disabled={loading || !token}
              >
                <span>
                  {loading ? <LoadingState variant="inline" title="Salvando nova senha..." /> : 'Salvar nova senha'}
                </span>

                {!loading && (
                  <ArrowRight
                    size={20}
                    strokeWidth={1.8}
                  />
                )}
              </button>

            </form>
          ) : (

            /* SUCESSO */

            <div className={styles.successMessage}>
              <CheckCircle2 size={28} />

              <p>{sucesso}</p>

              <button
                type="button"
                className={styles.submitButton}
                onClick={() => navigate('/login')}
              >
                <span>Ir para o login</span>

                <ArrowRight size={20} />
              </button>
            </div>
          )}

          {/* VOLTAR */}

          <div className={styles.backArea}>
            <span>Precisa de outro link?</span>

            <Link
              to="/esqueci-senha"
              className={styles.link}
            >
              Solicitar recuperação
            </Link>
          </div>

        </div>
      </section>

    </main>
  );
};

export default RedefinirSenha;
