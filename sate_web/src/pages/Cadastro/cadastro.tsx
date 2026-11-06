import { useEffect, useState } from 'react';
import type {
  ChangeEvent,
  FormEvent,
} from 'react';

import {
  Link,
  useNavigate,
} from 'react-router-dom';

import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  UserRound,
} from 'lucide-react';

import styles from './cadastro.module.css';
import TermosUso from '../TermosUso/termosUso';

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


interface CadastroFormState {
  nome: string;
  email: string;
  senha: string;
  confirmarSenha: string;
  termos: boolean;
}


interface CadastroResponse {
  mensagem: string;

  usuario?: {
    id: number;
    nome: string;
    email: string;
    tipo?: 'TREINADOR' | 'ATLETA' | null;
  };
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


const Cadastro = () => {
  const navigate = useNavigate();

  const [form, setForm] =
    useState<CadastroFormState>({
      nome: '',
      email: '',
      senha: '',
      confirmarSenha: '',
      termos: false,
    });

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [loading, setLoading] =
    useState(false);

  const [mostrarTermos, setMostrarTermos] = useState(false);

  const [termosLidos, setTermosLidos] = useState(false);

  const [erro, setErro] =
    useState('');

  const [sucesso, setSucesso] =
    useState('');

  const [
    activeSlide,
    setActiveSlide,
  ] = useState(0);


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
     INPUTS
  ============================================================ */

  const handleChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setForm((prev) => ({
      ...prev,

      [name]:
        type === 'checkbox'
          ? checked
          : value,
    }));

    if (erro) {
      setErro('');
    }

    if (sucesso) {
      setSucesso('');
    }
  };


  /* ============================================================
     CADASTRO
  ============================================================ */

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setErro('');
    setSucesso('');


    if (form.senha !== form.confirmarSenha) {
      setErro(
        'As senhas não coincidem.'
      );

      return;
    }

    if (!termosLidos || !form.termos) {
      setErro('Leia os Termos de Uso até o final e aceite para continuar.');
      return;
    }

    setLoading(true);

    try {
      const resposta = await fetch(
        'http://localhost:3000/api/auth/cadastro',
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',
          },

          body: JSON.stringify({
            nome: form.nome,
            email: form.email,
            senha: form.senha,

            tipo: 'TREINADOR',
          }),
        }
      );


      const data: CadastroResponse =
        await resposta.json();


      if (!resposta.ok) {
        throw new Error(
          data.mensagem ||
          'Não foi possível criar sua conta.'
        );
      }


      if (!data.usuario) {
        throw new Error(
          'A conta foi criada, mas não foi possível obter os dados do usuário.'
        );
      }


      setSucesso(
        'Conta de treinador criada com sucesso! Você será direcionado para o login.'
      );


      setTimeout(() => {
        navigate('/login');
      }, 1000);

    } catch (error) {
      console.error(
        'Erro no cadastro:',
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
              className={`${styles.heroSlide} ${index === activeSlide
                  ? styles.heroSlideActive
                  : ''
                }`}
              style={{
                backgroundImage: `url(${image})`,
              }}
            />
          ))}
        </div>


        <div
          className={styles.leftOverlay}
          aria-hidden="true"
        />


        {/* CURVAS */}

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
            src={logo}
            alt="SATE"
            className={styles.heroLogo}
          />
        </Link>


        {/* TEXTO */}

        <div className={styles.leftContent}>

          <h1>
            <span>
              Transforme seus dados
            </span>

            <span>
              em{' '}
              <em>
                desempenho.
              </em>
            </span>
          </h1>

          <p>
            Crie sua conta e tenha acesso a uma
            plataforma completa para acompanhar
            e evoluir o desempenho esportivo.
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
              Crie sua conta
            </h2>

            <p className={styles.subtitle}>
              Cadastre-se para começar a acompanhar
              o desempenho da sua equipe.
            </p>

          </div>


          <form
            className={styles.form}
            onSubmit={handleSubmit}
          >

            {/* NOME */}

            <div className={styles.inputGroup}>

              <label htmlFor="nome">
                Nome completo
              </label>

              <div className={styles.inputWrapper}>

                <UserRound
                  size={17}
                  className={styles.inputIcon}
                />

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

            </div>


            {/* EMAIL */}

            <div className={styles.inputGroup}>

              <label htmlFor="email">
                Email
              </label>

              <div className={styles.inputWrapper}>

                <Mail
                  size={17}
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
                />

              </div>

            </div>


            {/* SENHA */}

            <div className={styles.inputGroup}>

              <label htmlFor="senha">
                Senha
              </label>

              <div className={styles.inputWrapper}>

                <LockKeyhole
                  size={17}
                  className={styles.inputIcon}
                />

                <input
                  id="senha"
                  name="senha"
                  type={
                    showPassword
                      ? 'text'
                      : 'password'
                  }
                  value={form.senha}
                  onChange={handleChange}
                  autoComplete="new-password"
                  placeholder="Digite sua senha"
                  required
                />


                {form.senha.length > 0 && (
                  <button
                    type="button"
                    className={
                      styles.passwordToggle
                    }
                    onClick={() =>
                      setShowPassword(
                        (prev) => !prev
                      )
                    }
                    aria-label={
                      showPassword
                        ? 'Ocultar senha'
                        : 'Mostrar senha'
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>
                )}

              </div>

            </div>


            {/* CONFIRMAR */}

            <div className={styles.inputGroup}>

              <label htmlFor="confirmarSenha">
                Confirmar senha
              </label>

              <div className={styles.inputWrapper}>

                <LockKeyhole
                  size={17}
                  className={styles.inputIcon}
                />

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
                    className={
                      styles.passwordToggle
                    }
                    onClick={() =>
                      setShowConfirmPassword(
                        (prev) => !prev
                      )
                    }
                    aria-label={
                      showConfirmPassword
                        ? 'Ocultar senha'
                        : 'Mostrar senha'
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>
                )}

              </div>

            </div>


            {/* MENSAGENS */}

            {erro && (
              <div className={styles.errorMessage}>
                {erro}
              </div>
            )}


            {sucesso && (
              <div className={styles.successMessage}>
                {sucesso}
              </div>
            )}


            {/* TERMOS */}

            <label className={styles.terms}>

              <input
                type="checkbox"
                name="termos"
                checked={form.termos}
                disabled={!termosLidos}
                onChange={handleChange}
              />

              <span>
                Li e concordo com os{' '}
                <button
                  type="button"
                  className={styles.termsLink}
                  onClick={() => setMostrarTermos(true)}
                >
                  Termos de Uso
                </button>
                .
              </span>

            </label>


            {/* BOTÃO */}

            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              <span>
                {loading
                  ? 'Criando conta...'
                  : 'Criar conta'}
              </span>

              {!loading && (
                <ArrowRight
                  size={19}
                  strokeWidth={1.8}
                />
              )}
            </button>

          </form>


          {/* LOGIN */}

          <div className={styles.backArea}>

            <span>
              Já possui uma conta?
            </span>

            <Link
              to="/login"
              className={styles.link}
            >
              Entrar
            </Link>

          </div>

        </div>

      </section>

      {mostrarTermos && (
        <TermosUso
          onFechar={() => setMostrarTermos(false)}
          onLeuTermos={() => setTermosLidos(true)}
        />
      )}

    </main>
  );
};

export default Cadastro;