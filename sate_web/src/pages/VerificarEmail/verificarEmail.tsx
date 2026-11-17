import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, MailCheck, RefreshCw, ShieldCheck, XCircle } from 'lucide-react';
import TurnstileWidget from '../../components/TurnstileWidget/TurnstileWidget';
import styles from './verificarEmail.module.css';
import LoadingState from '../../components/ui/LoadingState/LoadingState';

const API_URL = (import.meta.env.VITE_API_URL as string | undefined) || 'http://localhost:3000';
const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined;

type Estado = 'verificando' | 'pendente' | 'sucesso' | 'erro';

interface ApiResponse {
  mensagem?: string;
}

const VerificarEmail = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const mensagemInicial = (location.state as { mensagem?: string } | null)?.mensagem;
  const token = searchParams.get('token');
  const emailInicial = searchParams.get('email') || '';

  const [estado, setEstado] = useState<Estado>(token ? 'verificando' : 'pendente');
  const [email, setEmail] = useState(emailInicial);
  const [mensagem, setMensagem] = useState(
    token ? 'Estamos confirmando seu endereço de e-mail...' : (mensagemInicial || 'Enviamos um link para o e-mail informado no cadastro.')
  );
  const [turnstileToken, setTurnstileToken] = useState('');
  const [turnstileKey, setTurnstileKey] = useState(0);
  const [reenviando, setReenviando] = useState(false);
  const tokenProcessado = useRef('');

  useEffect(() => {
    if (!token || tokenProcessado.current === token) return;
    tokenProcessado.current = token;

    const confirmar = async () => {
      setEstado('verificando');
      try {
        const resposta = await fetch(`${API_URL}/api/auth/verificar-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });

        const dados: ApiResponse = await resposta.json();
        if (!resposta.ok) {
          throw new Error(dados.mensagem || 'Não foi possível confirmar este e-mail.');
        }

        setMensagem(dados.mensagem || 'E-mail confirmado com sucesso!');
        setEstado('sucesso');
      } catch (error) {
        setMensagem(error instanceof Error ? error.message : 'Não foi possível confirmar este e-mail.');
        setEstado('erro');
      }
    };

    void confirmar();
  }, [token]);

  const reenviarLink = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMensagem('');

    if (TURNSTILE_SITE_KEY && !turnstileToken) {
      setMensagem('Conclua a verificação antirrobô antes de continuar.');
      return;
    }

    setReenviando(true);
    try {
      const resposta = await fetch(`${API_URL}/api/auth/reenviar-verificacao`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, turnstileToken }),
      });

      const dados: ApiResponse = await resposta.json();
      if (!resposta.ok) {
        throw new Error(dados.mensagem || 'Não foi possível reenviar o link.');
      }

      setMensagem(dados.mensagem || 'Caso exista uma conta pendente, enviaremos um novo link.');
    } catch (error) {
      setMensagem(error instanceof Error ? error.message : 'Não foi possível reenviar o link.');
    } finally {
      setReenviando(false);
      setTurnstileToken('');
      setTurnstileKey((atual) => atual + 1);
    }
  };

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <div className={styles.brand}>SATE</div>

        {estado === 'verificando' && (
          <LoadingState variant="inline" title="Confirmando seu e-mail..." />
        )}
        {estado === 'pendente' && (
          <div className={styles.iconPending}>
            <MailCheck size={34} />
          </div>
        )}
        {estado === 'sucesso' && (
          <div className={styles.iconSuccess}>
            <CheckCircle2 size={36} />
          </div>
        )}
        {estado === 'erro' && (
          <div className={styles.iconError}>
            <XCircle size={36} />
          </div>
        )}

        <h1>
          {estado === 'verificando' && 'Confirmando seu e-mail'}
          {estado === 'pendente' && 'Confira sua caixa de entrada'}
          {estado === 'sucesso' && 'E-mail confirmado!'}
          {estado === 'erro' && 'Não foi possível confirmar'}
        </h1>

        <p className={styles.description}>{mensagem}</p>

        {estado === 'pendente' && (
          <form className={styles.form} onSubmit={reenviarLink}>
            <label htmlFor="email-confirmacao">E-mail cadastrado</label>
            <input
              id="email-confirmacao"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="seuemail@exemplo.com"
              required
            />
            <TurnstileWidget
              key={turnstileKey}
              action="auth"
              onToken={setTurnstileToken}
            />
            <button type="submit" disabled={reenviando}>
              <RefreshCw size={17} />
              {reenviando ? <LoadingState variant="inline" title="Enviando link..." /> : 'Reenviar link de confirmação'}
            </button>
          </form>
        )}

        {estado === 'erro' && (
          <form className={styles.form} onSubmit={reenviarLink}>
            <label htmlFor="email-confirmacao">E-mail cadastrado</label>
            <input
              id="email-confirmacao"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="seuemail@exemplo.com"
              required
            />
            <TurnstileWidget
              key={turnstileKey}
              action="auth"
              onToken={setTurnstileToken}
            />
            <button type="submit" disabled={reenviando}>
              <RefreshCw size={17} />
              {reenviando ? <LoadingState variant="inline" title="Solicitando link..." /> : 'Solicitar novo link'}
            </button>
          </form>
        )}

        {estado === 'sucesso' && (
          <div className={styles.successNote}>
            <ShieldCheck size={18} />
            Sua conta está liberada para acessar o SATE.
          </div>
        )}

        <Link to="/login" className={styles.backLink}>
          <ArrowLeft size={17} />
          Voltar para o login
        </Link>
      </section>
    </main>
  );
};

export default VerificarEmail;
