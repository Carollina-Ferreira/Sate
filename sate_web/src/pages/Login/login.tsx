import { useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import styles from './login.module.css';

import athleteImg from '../../assets/img/login_img.png';

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
    };
}

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

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));

        if (erro) {
            setErro('');
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setErro('');
        setLoading(true);

        try {
            const resposta = await fetch(
                'http://localhost:3000/api/auth/login',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: form.email,
                        senha: form.senha,

                        // O site SATE é exclusivo para treinadores
                        tipo: 'TREINADOR',
                    }),
                }
            );

            const data: LoginResponse = await resposta.json();

            if (!resposta.ok) {
                throw new Error(
                    data.mensagem || 'Não foi possível realizar o login.'
                );
            }

            if (!data.token || !data.usuario) {
                throw new Error('Resposta inválida do servidor.');
            }

            /*
             * Lembrar de mim
             */
            if (form.lembrar) {
                localStorage.setItem('token', data.token);

                localStorage.setItem(
                    'usuario',
                    JSON.stringify(data.usuario)
                );

                // Limpa uma sessão anterior, caso exista
                sessionStorage.removeItem('token');
                sessionStorage.removeItem('usuario');
            } else {
                sessionStorage.setItem('token', data.token);

                sessionStorage.setItem(
                    'usuario',
                    JSON.stringify(data.usuario)
                );

                // Limpa um login permanente anterior
                localStorage.removeItem('token');
                localStorage.removeItem('usuario');
            }

            console.log('Login realizado:', data.usuario);

            /*
             * O Web é exclusivo para TREINADOR.
             */
            if (data.usuario.tipo === 'TREINADOR') {
                navigate('/boas-vindas');
                return;
            }

            /*
             * Caso uma conta de atleta tente entrar pelo Web.
             */
            setErro(
                'Esta conta está cadastrada como Atleta e não pode acessar o sistema do treinador.'
            );

        } catch (error) {
            console.error('Erro no login:', error);

            if (error instanceof Error) {
                setErro(error.message);
            } else {
                setErro('Não foi possível conectar ao servidor.');
            }
        } finally {
            setLoading(false);
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
                    <span />
                    <span />
                    <span />
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
                        Dados que revelam o
                        <br />
                        verdadeiro desempenho.
                    </h1>

                    <p>
                        Gerencie equipes, analise vídeos e acompanhe estatísticas de
                        qualquer modalidade esportiva em um único painel.
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

                    <svg
                        className={styles.dataLine}
                        viewBox="0 0 260 120"
                        fill="none"
                    >
                        <polyline
                            points="0,100 40,80 80,90 120,55 160,68 200,30 240,45"
                            stroke="var(--azul)"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />

                        {[
                            [0, 100],
                            [80, 90],
                            [160, 68],
                            [240, 45],
                        ].map(([cx, cy], index) => (
                            <circle
                                key={index}
                                cx={cx}
                                cy={cy}
                                r="3.5"
                                fill={
                                    index % 2 === 0
                                        ? 'var(--rosa)'
                                        : 'var(--verde-principal)'
                                }
                            />
                        ))}
                    </svg>

                </div>


                {/* ===================== CARD DE LOGIN ===================== */}

                <div className={styles.formCard}>

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


                    <h2>
                        Bem-vindo de volta!
                    </h2>

                    <p className={styles.subtitle}>
                        Entre para continuar acompanhando o treinamento da sua equipe.
                    </p>


                    <form
                        className={styles.form}
                        onSubmit={handleSubmit}
                    >

                        {/* ===================== EMAIL ===================== */}

                        <div className={styles.field}>

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


                        {/* ===================== SENHA ===================== */}

                        <div className={styles.field}>

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
                                    autoComplete="current-password"
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


                        {/* ===================== ERRO ===================== */}

                        {erro && (
                            <div
                                style={{
                                    color: '#D52941',
                                    backgroundColor: '#FFF1F3',
                                    border: '1px solid #FFD5DB',
                                    borderRadius: '8px',
                                    padding: '10px 12px',
                                    fontSize: '14px',
                                }}
                            >
                                {erro}
                            </div>
                        )}


                        {/* ===================== OPÇÕES ===================== */}

                        <div className={styles.rowBetween}>

                            <label className={styles.checkboxLabel}>

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
                                className={styles.link}
                            >
                                Esqueci minha senha
                            </Link>

                        </div>


                        {/* ===================== BOTÃO ===================== */}

                        <button
                            type="submit"
                            className={styles.submitButton}
                            disabled={loading}
                        >
                            {loading ? 'Entrando...' : 'Entrar'}
                        </button>

                    </form>


                    {/* ===================== CRIAR CONTA ===================== */}

                    <p className={styles.signupText}>
                        Ainda não possui uma conta?{' '}

                        <Link
                            to="/cadastro"
                            className={styles.link}
                        >
                            Criar conta
                        </Link>
                    </p>

                </div>

            </section>

        </div>
    );
};

export default Login;