import { useEffect, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';

import { Link, useNavigate } from 'react-router-dom';

import {
    ArrowRight,
    Eye,
    EyeOff,
    LockKeyhole,
    Mail,
} from 'lucide-react';

import styles from './login.module.css';

import logoVerdeImg from '../../assets/img/logoVerde_img.png';

import futebolHero from '../../assets/img/hero/futebol.png.png';
import basqueteHero from '../../assets/img/hero/basquete.png.png';
import voleiHero from '../../assets/img/hero/volei.png.png';
import handebolHero from '../../assets/img/hero/handebol.png.png';
import rugbyHero from '../../assets/img/hero/rugby.png.png';
import natacaoHero from '../../assets/img/hero/natacao.png.png';
import atletismoHero from '../../assets/img/hero/atletismo.png.png';
import tenisHero from '../../assets/img/hero/tenis.png.png';


interface LoginFormState {
    email: string;
    senha: string;
    lembrar: boolean;
}

interface LoginResponse {
    mensagem: string;

    token?: string;

    usuario?: {
        id: number;
        email: string;
        tipo: 'TREINADOR' | 'ATLETA';
        primeiroAcesso: boolean;
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


const Login = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState<LoginFormState>({
        email: '',
        senha: '',
        lembrar: true,
    });

    const [showPassword, setShowPassword] = useState(false);

    const [loading, setLoading] = useState(false);

    const [erro, setErro] = useState('');

    const [activeSlide, setActiveSlide] = useState(0);


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
    };


    /* ============================================================
       LOGIN
    ============================================================ */

    const handleSubmit = async (
        e: FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        setErro('');
        setLoading(true);

        try {
            const resposta = await fetch(
                'http://localhost:3000/api/auth/login',
                {
                    method: 'POST',

                    headers: {
                        'Content-Type':
                            'application/json',
                    },

                    body: JSON.stringify({
                        email: form.email,
                        senha: form.senha,
                        tipo: 'TREINADOR',
                    }),
                }
            );

            const data: LoginResponse =
                await resposta.json();

            if (!resposta.ok) {
                throw new Error(
                    data.mensagem ||
                    'Não foi possível realizar o login.'
                );
            }

            if (!data.token || !data.usuario) {
                throw new Error(
                    'Resposta inválida do servidor.'
                );
            }


            /* =================================================
               LEMBRAR DE MIM
            ================================================= */

            if (form.lembrar) {
                localStorage.setItem(
                    'token',
                    data.token
                );

                localStorage.setItem(
                    'usuario',
                    JSON.stringify(data.usuario)
                );

                sessionStorage.removeItem('token');
                sessionStorage.removeItem('usuario');
            } else {
                sessionStorage.setItem(
                    'token',
                    data.token
                );

                sessionStorage.setItem(
                    'usuario',
                    JSON.stringify(data.usuario)
                );

                localStorage.removeItem('token');
                localStorage.removeItem('usuario');
            }


            /* =================================================
               TREINADOR
            ================================================= */

            if (data.usuario.tipo === 'TREINADOR') {
                if (data.usuario.primeiroAcesso) {
                    navigate('/boas-vindas');

                    return;
                }

                navigate('/inicio');

                return;
            }


            /* =================================================
               ATLETA
            ================================================= */

            setErro(
                'Esta conta está cadastrada como Atleta e não pode acessar o sistema do treinador.'
            );

        } catch (error) {
            console.error(
                'Erro no login:',
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

            {/* =================================================
                LADO ESQUERDO
            ================================================= */}

            <section className={styles.hero}>

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


                {/* OVERLAY */}

                <div
                    className={styles.heroOverlay}
                    aria-hidden="true"
                />


                {/* 3 CURVAS SUPERIORES */}

                <svg
                    className={styles.topCurves}
                    viewBox="0 0 620 320"
                    fill="none"
                    aria-hidden="true"
                >
                    <path
                        d="M-110 265 C80 245 205 142 252 -48"
                    />

                    <path
                        d="M-95 320 C130 290 284 165 332 -62"
                    />

                    <path
                        d="M25 332 C235 292 392 154 425 -70"
                    />
                </svg>


                {/* LINHA ROSA */}

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

                <div className={styles.heroContent}>
                    <h1>
                        <span>Dados que revelam</span>
                        <span>
                            o verdadeiro{' '}
                            <em>desempenho.</em>
                        </span>
                    </h1>

                    <p>
                        Gerencie equipes, analise vídeos e acompanhe
                        estatísticas de qualquer modalidade esportiva
                        em um único painel.
                    </p>
                </div>


                {/* INDICADORES */}

                <div className={styles.heroStats}>

                    <div className={styles.heroStat}>
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


                    <div className={styles.heroStat}>
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


                    <div className={styles.heroStat}>
                        <strong>
                            5+
                        </strong>

                        <span>
                            modalidades
                        </span>
                    </div>

                </div>

            </section>


            {/* =================================================
                LADO DIREITO
            ================================================= */}

            <section className={styles.loginArea}>

                {/* =================================================
                    FUNDO DECORATIVO
                ================================================= */}

                <div
                    className={styles.backgroundDecor}
                    aria-hidden="true"
                >

                    {/* ORB GRANDE SUPERIOR */}

                    <span
                        className={`${styles.gradientOrb} ${styles.orbTop}`}
                    />


                    {/* ORB GRANDE DIREITO */}

                    <span
                        className={`${styles.gradientOrb} ${styles.orbRight}`}
                    />


                    {/* ORB GRANDE INFERIOR */}

                    <span
                        className={`${styles.gradientOrb} ${styles.orbBottom}`}
                    />


                    {/* ORB LATERAL ESQUERDO */}

                    <span
                        className={`${styles.gradientOrb} ${styles.orbLeft}`}
                    />


                    {/* ORB CENTRAL */}

                    <span
                        className={`${styles.gradientOrb} ${styles.orbCenter}`}
                    />


                    {/* ORB PEQUENO 1 */}

                    <span
                        className={`${styles.gradientOrb} ${styles.orbSmallOne}`}
                    />


                    {/* ORB PEQUENO 2 */}

                    <span
                        className={`${styles.gradientOrb} ${styles.orbSmallTwo}`}
                    />


                    {/* FAIXA AURORA SUPERIOR */}

                    <span
                        className={styles.auroraTop}
                    />


                    {/* FAIXA AURORA INFERIOR */}

                    <span
                        className={styles.auroraBottom}
                    />

                </div>


                {/* =================================================
                    CARD
                ================================================= */}

                <div className={styles.loginCard}>

                    {/* LOGO */}

                    <img
                        src={logoVerdeImg}
                        alt="SATE"
                        className={styles.cardLogo}
                    />


                    {/* HEADER */}

                    <div className={styles.cardHeader}>

                        <h2>
                            Bem-vindo de volta!
                        </h2>

                        <p>
                            Entre para continuar acompanhando
                            o treinamento da sua equipe.
                        </p>

                    </div>


                    {/* FORM */}

                    <form
                        className={styles.form}
                        onSubmit={handleSubmit}
                    >

                        {/* EMAIL */}

                        <div className={styles.field}>

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
                                />

                            </div>

                        </div>


                        {/* SENHA */}

                        <div className={styles.field}>

                            <label htmlFor="senha">
                                Senha
                            </label>

                            <div className={styles.inputWrapper}>

                                <LockKeyhole
                                    size={18}
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
                                    autoComplete="current-password"
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
                                            <EyeOff size={18} />
                                        ) : (
                                            <Eye size={18} />
                                        )}
                                    </button>
                                )}

                            </div>

                        </div>


                        {/* ERRO */}

                        {erro && (
                            <div
                                className={styles.errorMessage}
                            >
                                {erro}
                            </div>
                        )}


                        {/* OPÇÕES */}

                        <div className={styles.options}>

                            <label
                                className={styles.remember}
                            >
                                <input
                                    type="checkbox"
                                    name="lembrar"
                                    checked={form.lembrar}
                                    onChange={handleChange}
                                />

                                <span>
                                    Lembrar de mim
                                </span>
                            </label>


                            <Link
                                to="/esqueci-senha"
                                className={
                                    styles.forgotPassword
                                }
                            >
                                Esqueci minha senha
                            </Link>

                        </div>


                        {/* BOTÃO */}

                        <button
                            type="submit"
                            className={styles.submitButton}
                            disabled={loading}
                        >
                            <span>
                                {loading
                                    ? 'Entrando...'
                                    : 'Entrar'}
                            </span>

                            {!loading && (
                                <ArrowRight
                                    size={20}
                                    strokeWidth={1.8}
                                />
                            )}
                        </button>

                    </form>


                    {/* DIVISOR */}

                    <div className={styles.signupDivider}>
                        <p>Ainda não possui uma conta?</p>

                        <Link
                            to="/cadastro"
                            className={styles.createAccount}
                        >
                            Criar conta
                        </Link>
                    </div>
                </div>
            </section>

        </main>
    );
};

export default Login;