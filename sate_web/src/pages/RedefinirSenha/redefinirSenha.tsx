import { useState } from 'react';
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
import logoVerdeImg from '../../assets/img/logoVerde_img.png';

interface ResetPasswordResponse {
  mensagem: string;
}

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

  const handleSenha = (event: ChangeEvent<HTMLInputElement>) => {
    setSenha(event.target.value);
    setErro('');
  };

  const handleConfirmacao = (event: ChangeEvent<HTMLInputElement>) => {
    setConfirmarSenha(event.target.value);
    setErro('');
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErro('');
    setSucesso('');

    if (!token) {
      setErro('O link está incompleto. Solicite uma nova recuperação de senha.');
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
        'http://localhost:3000/api/password/redefinir-senha',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token, senha }),
        }
      );

      const data: ResetPasswordResponse = await resposta.json();

      if (!resposta.ok) {
        throw new Error(data.mensagem || 'Não foi possível redefinir sua senha.');
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

  return (
    <main className={styles.page}>
      <section className={styles.left}>
        <div className={styles.leftOverlay} aria-hidden="true" />
        <Link to="/" className={styles.heroLogoLink} aria-label="Página inicial do SATE">
          <img src={logoVerdeImg} alt="SATE" className={styles.heroLogo} />
        </Link>

        <div className={styles.leftContent}>
          <h1>
            <span>Seu acesso,</span>
            <span>de volta ao <em>jogo.</em></span>
          </h1>
          <p>
            Crie uma nova senha e continue acompanhando seus treinamentos,
            equipes e evolução esportiva.
          </p>
        </div>

        <div className={styles.leftFooter}>
          <div className={styles.stat}>
            <strong><ShieldCheck size={21} /></strong>
            <span>Conta protegida</span>
          </div>
          <span className={styles.statDivider} />
          <div className={styles.stat}>
            <strong>30 min</strong>
            <span>Validade do link</span>
          </div>
        </div>
      </section>

      <section className={styles.right}>
        <div className={styles.backgroundDecor} aria-hidden="true">
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

        <div className={styles.formContainer}>
          <img src={logoVerdeImg} alt="SATE" className={styles.cardLogo} />

          <div className={styles.cardHeader}>
            <h2>Crie uma nova senha</h2>
            <p className={styles.subtitle}>
              Escolha uma senha segura para voltar a acessar sua conta.
            </p>
          </div>

          {!sucesso ? (
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.inputGroup}>
                <label htmlFor="novaSenha">Nova senha</label>
                <div className={styles.inputWrapper}>
                  <LockKeyhole size={18} className={styles.inputIcon} />
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
                    aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
                  >
                    {mostrarSenha ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="confirmarSenha">Confirmar nova senha</label>
                <div className={styles.inputWrapper}>
                  <LockKeyhole size={18} className={styles.inputIcon} />
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
                    onClick={() => setMostrarConfirmacao((value) => !value)}
                    aria-label={mostrarConfirmacao ? 'Ocultar senha' : 'Mostrar senha'}
                  >
                    {mostrarConfirmacao ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <p className={styles.subtitle}>
                Utilize pelo menos 8 caracteres.
              </p>

              {erro && <div className={styles.errorMessage}>{erro}</div>}

              {!token && (
                <div className={styles.errorMessage}>
                  O link não contém um token válido. Solicite uma nova recuperação.
                </div>
              )}

              <button
                type="submit"
                className={styles.submitButton}
                disabled={loading || !token}
              >
                <span>{loading ? 'Salvando...' : 'Salvar nova senha'}</span>
                {!loading && <ArrowRight size={20} strokeWidth={1.8} />}
              </button>
            </form>
          ) : (
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

          <div className={styles.backArea}>
            <span>Precisa de outro link?</span>
            <Link to="/esqueci-senha" className={styles.link}>
              Solicitar recuperação
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default RedefinirSenha;
