import {
  Camera,
  Eye,
  EyeOff,
  LockKeyhole,
  Save,
} from 'lucide-react';

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import type {
  ChangeEvent,
} from 'react';

import styles from './configuracoes.module.css';
import LoadingState from '../../components/ui/LoadingState/LoadingState';

interface Preferencias {
  email: boolean;
  push: boolean;
  twoFactor: boolean;
}

interface Usuario {
  id?: number;
  nome?: string;
  email?: string;
  tipo?: string;
  avatarUrl?: string | null;
}

import { API_ORIGIN as API_URL } from '../../config/api';

const PREF_ENDPOINT = `${API_URL}/api/usuarios/preferencias`;
const CHAVE_PREF = 'sate:preferencias:v1:';

type PreferenciasNotificacao = Pick<Preferencias, 'email' | 'push'>;

function extrairPreferencias(dados: unknown): PreferenciasNotificacao | null {
  if (!dados || typeof dados !== 'object') return null;
  const envelope = dados as Record<string, unknown>;
  const p = (envelope.preferencias ?? envelope) as Record<string, unknown>;
  if (!p || typeof p.email !== 'boolean' || typeof p.push !== 'boolean') {
    return null;
  }
  return { email: p.email, push: p.push };
}

function lerPreferenciasLocais(id: number): PreferenciasNotificacao {
  try {
    const armazenadas = JSON.parse(localStorage.getItem(`${CHAVE_PREF}${id}`) || 'null');
    return extrairPreferencias(armazenadas) ?? { email: true, push: true };
  } catch {
    return { email: true, push: true };
  }
}

function guardarPreferenciasLocais(id: number, dados: PreferenciasNotificacao) {
  try {
    localStorage.setItem(`${CHAVE_PREF}${id}`, JSON.stringify(dados));
    window.dispatchEvent(new CustomEvent('sate:preferencias-atualizadas', {
      detail: { usuarioId: id, ...dados },
    }));
  } catch (erro) {
    console.warn('Não foi possível guardar preferências neste navegador:', erro);
  }
}

const Configuracoes = () => {
  const fileInputRef =
    useRef<HTMLInputElement>(null);

  // =====================================================
  // USUÁRIO
  // =====================================================

  const [usuario, setUsuario] =
    useState<Usuario | null>(null);

  const [carregandoUsuario, setCarregandoUsuario] = useState(true);
  const [salvandoPerfil, setSalvandoPerfil] = useState(false);

  const [nome, setNome] =
    useState('');

  const [email, setEmail] =
    useState('');

  // =====================================================
  // FOTO
  // =====================================================

  const [avatarPreview, setAvatarPreview] =
    useState<string | null>(null);

  const [novaFoto, setNovaFoto] =
    useState<File | null>(null);

  // =====================================================
  // PREFERÊNCIAS
  // =====================================================

  const [preferencias, setPreferencias] =
    useState<Preferencias>({
      email: true,
      push: true,
      twoFactor: false,
    });

  // =====================================================
  // CONTROLE DE PREFERÊNCIAS
  // =====================================================

  const [carregandoPreferencias, setCarregandoPreferencias] = useState(true);
  const [salvandoPreferencia, setSalvandoPreferencia] = useState(false);
  const [statusPreferencias, setStatusPreferencias] = useState('');
  const [preferenciasNoServidor, setPreferenciasNoServidor] = useState(false);

  // =====================================================
  // SENHA
  // =====================================================

  const [novaSenha, setNovaSenha] =
    useState('');

  const [confirmarSenha, setConfirmarSenha] =
    useState('');

  const [
    mostrarNovaSenha,
    setMostrarNovaSenha,
  ] = useState(false);

  const [
    mostrarConfirmarSenha,
    setMostrarConfirmarSenha,
  ] = useState(false);

  const [erroSenha, setErroSenha] =
    useState('');

  // =====================================================
  // TOKEN
  // =====================================================

  const obterToken = () => {
    return (
      localStorage.getItem('token') ||
      localStorage.getItem('accessToken') ||
      sessionStorage.getItem('token') ||
      sessionStorage.getItem('accessToken')
    );
  };

  // =====================================================
  // CARREGAR USUÁRIO
  // =====================================================

  useEffect(() => {
    const carregarUsuario = async () => {
      setCarregandoUsuario(true);
      const token = obterToken();

      if (!token) {
        setCarregandoUsuario(false);
        return;
      }

      try {
        const resposta = await fetch(
          `${API_URL}/api/usuarios/perfil`,
          {
            method: 'GET',

            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          },
        );

        if (!resposta.ok) {
          throw new Error(
            'Não foi possível carregar o perfil.',
          );
        }

        const dados =
          await resposta.json();

        const usuarioAtual: Usuario =
          dados.usuario;

        setUsuario(usuarioAtual);

        setNome(
          usuarioAtual.nome || '',
        );

        setEmail(
          usuarioAtual.email || '',
        );

        if (usuarioAtual.avatarUrl) {
          setAvatarPreview(
            `${API_URL}${usuarioAtual.avatarUrl}`,
          );
        }
      } catch (error) {
        console.error(
          'Erro ao carregar usuário:',
          error,
        );

        const usuarioSalvo =
          localStorage.getItem('usuario') ||
          sessionStorage.getItem('usuario');

        if (!usuarioSalvo) {
          return;
        }

        try {
          const usuarioLocal: Usuario =
            JSON.parse(usuarioSalvo);

          setUsuario(usuarioLocal);

          setNome(
            usuarioLocal.nome || '',
          );

          setEmail(
            usuarioLocal.email || '',
          );

          if (usuarioLocal.avatarUrl) {
            setAvatarPreview(
              `${API_URL}${usuarioLocal.avatarUrl}`,
            );
          }
        } catch {
          setUsuario(null);
        }
      }
      finally {
        setCarregandoUsuario(false);
      }
    };

    carregarUsuario();
  }, []);

  // =====================================================
  // INICIAIS
  // =====================================================

  const iniciais = useMemo(() => {
    const partes = nome
      .trim()
      .split(' ')
      .filter(Boolean);

    if (partes.length === 0) {
      return 'TR';
    }

    if (partes.length === 1) {
      return partes[0]
        .slice(0, 2)
        .toUpperCase();
    }

    return `${partes[0][0]}${
      partes[partes.length - 1][0]
    }`.toUpperCase();
  }, [nome]);

  // =====================================================
  // FOTO
  // =====================================================

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert(
        'A imagem deve ter no máximo 5 MB.',
      );

      event.target.value = '';

      return;
    }

    if (!file.type.startsWith('image/')) {
      alert(
        'Selecione um arquivo de imagem.',
      );

      event.target.value = '';

      return;
    }

    setNovaFoto(file);

    const imageUrl =
      URL.createObjectURL(file);

    setAvatarPreview(imageUrl);
  };

  // =====================================================
  // PREFERÊNCIAS — CARREGAR E PERSISTIR
  // =====================================================

  useEffect(() => {
    if (!usuario?.id) {
      setCarregandoPreferencias(false);
      return;
    }

    let cancelado = false;
    const id = usuario.id;

    const carregar = async () => {
      setCarregandoPreferencias(true);
      setStatusPreferencias('');

      // Mostra inicialmente o que foi salvo neste navegador.
      const local = lerPreferenciasLocais(id);
      setPreferencias({ ...local, twoFactor: false });

      const token = obterToken();
      if (!token) {
        if (!cancelado) setCarregandoPreferencias(false);
        return;
      }

      try {
        const resposta = await fetch(PREF_ENDPOINT, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (resposta.status === 404 || resposta.status === 405) {
          if (!cancelado) {
            setPreferenciasNoServidor(false);
            setStatusPreferencias('Preferências salvas apenas neste navegador. Configure a rota no backend para sincronizar entre dispositivos.');
          }
          return;
        }

        if (!resposta.ok) throw new Error('Falha ao consultar preferências.');
        const remotas = extrairPreferencias(await resposta.json());
        if (!remotas) throw new Error('O servidor retornou preferências inválidas.');

        if (!cancelado) {
          setPreferencias({ ...remotas, twoFactor: false });
          setPreferenciasNoServidor(true);
          guardarPreferenciasLocais(id, remotas);
        }
      } catch (erro) {
        if (!cancelado) {
          setPreferenciasNoServidor(false);
          setStatusPreferencias('Sem conexão com as preferências do servidor. As escolhas deste navegador continuam disponíveis.');
          console.warn('Preferências em modo local:', erro);
        }
      } finally {
        if (!cancelado) setCarregandoPreferencias(false);
      }
    };

    void carregar();
    return () => { cancelado = true; };
  }, [usuario?.id]);

  const togglePreferencia = async (key: 'email' | 'push') => {
    if (!usuario?.id || salvandoPreferencia || carregandoPreferencias) return;

    const anterior = preferencias;
    const proxima: Preferencias = { ...anterior, [key]: !anterior[key] };
    const payload: PreferenciasNotificacao = { email: proxima.email, push: proxima.push };
    const id = usuario.id;
    const token = obterToken();

    setPreferencias(proxima);
    setSalvandoPreferencia(true);
    setStatusPreferencias('Salvando preferência...');

    // Sem endpoint disponível, mantém a escolha local, nunca afirma que
    // o backend já está enviando ou bloqueando notificações.
    try {
      if (!token) throw new Error('Faça login novamente para salvar suas preferências.');

      const resposta = await fetch(PREF_ENDPOINT, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (resposta.status === 404 || resposta.status === 405) {
        guardarPreferenciasLocais(id, payload);
        setPreferenciasNoServidor(false);
        setStatusPreferencias('Salvo neste navegador. Para aplicar às notificações em todos os dispositivos, instale a rota no backend.');
        return;
      }

      if (!resposta.ok) {
        const dados = await resposta.json().catch(() => null);
        throw new Error(dados?.mensagem || `Não foi possível salvar (HTTP ${resposta.status}).`);
      }

      const confirmadas = extrairPreferencias(await resposta.json().catch(() => null));
      if (!confirmadas) throw new Error('O servidor não confirmou as preferências.');

      setPreferencias({ ...confirmadas, twoFactor: false });
      guardarPreferenciasLocais(id, confirmadas);
      setPreferenciasNoServidor(true);
      setStatusPreferencias('Preferências salvas na sua conta.');
    } catch (erro) {
      // Falha de conexão: mantém uma cópia local, mas sinaliza que NÃO há
      // confirmação de sincronização com o servidor.
      if (erro instanceof TypeError) {
        guardarPreferenciasLocais(id, payload);
        setPreferenciasNoServidor(false);
        setStatusPreferencias('Sem conexão com o servidor: preferência guardada somente neste navegador.');
      } else {
        setPreferencias(anterior);
        setStatusPreferencias(erro instanceof Error ? erro.message : 'Erro ao salvar preferências.');
      }
    } finally {
      setSalvandoPreferencia(false);
    }
  };

  // =====================================================
  // SALVAR PERFIL
  // =====================================================

  const handleSalvar = async () => {
    if (!usuario) {
      alert(
        'Usuário não encontrado.',
      );

      return;
    }

    const token =
      obterToken();

    if (!token) {
      alert(
        'Sua sessão expirou. Faça login novamente.',
      );

      return;
    }

    if (!nome.trim()) {
      alert(
        'Informe seu nome.',
      );

      return;
    }

    if (!email.trim()) {
      alert(
        'Informe seu e-mail.',
      );

      return;
    }

    // VALIDAÇÃO VISUAL DA NOVA SENHA

    setErroSenha('');

    if (
      novaSenha ||
      confirmarSenha
    ) {
      if (
        !novaSenha ||
        !confirmarSenha
      ) {
        setErroSenha(
          'Preencha os dois campos de senha.',
        );

        return;
      }

      if (
        novaSenha.length < 6
      ) {
        setErroSenha(
          'A nova senha deve ter pelo menos 6 caracteres.',
        );

        return;
      }

      if (
        novaSenha !==
        confirmarSenha
      ) {
        setErroSenha(
          'As senhas não coincidem.',
        );

        return;
      }
    }

    try {
      setSalvandoPerfil(true);
      const formData =
        new FormData();

      formData.append(
        'nome',
        nome.trim(),
      );

      formData.append(
        'email',
        email.trim(),
      );

      if (novaFoto) {
        formData.append(
          'avatar',
          novaFoto,
        );
      }

      const resposta = await fetch(
        `${API_URL}/api/usuarios/perfil`,
        {
          method: 'PUT',

          headers: {
            Authorization:
              `Bearer ${token}`,
          },

          body: formData,
        },
      );

      const dados =
        await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          dados.mensagem ||
            'Não foi possível atualizar o perfil.',
        );
      }

      const usuarioAtualizado: Usuario =
        dados.usuario;

      setUsuario(
        usuarioAtualizado,
      );

      setNome(
        usuarioAtualizado.nome || '',
      );

      setEmail(
        usuarioAtualizado.email || '',
      );

      if (
        usuarioAtualizado.avatarUrl
      ) {
        setAvatarPreview(
          `${API_URL}${usuarioAtualizado.avatarUrl}`,
        );
      }

      setNovaFoto(null);

      const estaNoLocalStorage =
        localStorage.getItem(
          'usuario',
        ) !== null;

      if (estaNoLocalStorage) {
        localStorage.setItem(
          'usuario',

          JSON.stringify(
            usuarioAtualizado,
          ),
        );
      } else {
        sessionStorage.setItem(
          'usuario',

          JSON.stringify(
            usuarioAtualizado,
          ),
        );
      }

      alert(
        'Perfil atualizado com sucesso!',
      );
    } catch (error) {
      console.error(
        'Erro ao salvar perfil:',
        error,
      );

      alert(
        error instanceof Error
          ? error.message
          : 'Erro ao atualizar o perfil.',
      );
    } finally {
      setSalvandoPerfil(false);
    }
  };

  if (carregandoUsuario) {
    return <LoadingState variant="page" title="Carregando configurações..." description="Preparando os dados da sua conta." />;
  }

  return (
    <main className={styles.page}>
      {/* =================================================
          CABEÇALHO
      ================================================= */}

      <header
        className={
          styles.pageHeader
        }
      >
        <h1>
          Suas{' '}
          <em>
            configurações.
          </em>
        </h1>

        <p>
          Gerencie seu perfil e suas
          preferências.
        </p>
      </header>

      <div className={styles.content}>
        {/* =================================================
            PERFIL
        ================================================= */}

        <section
          className={styles.card}
        >
          <div
            className={
              styles.cardHeader
            }
          >
            <div>
              <h2>
                Perfil
              </h2>

              <p>
                Suas informações pessoais.
              </p>
            </div>
          </div>

          <div
            className={
              styles.cardDivider
            }
          />

          {/* FOTO */}

          <div
            className={
              styles.profileTop
            }
          >
            <div
              className={
                styles.avatarWrapper
              }
            >
              <div
                className={
                  styles.avatar
                }
              >
                {avatarPreview ? (
                  <img
                    src={
                      avatarPreview
                    }
                    alt="Foto do usuário"
                  />
                ) : (
                  iniciais
                )}
              </div>

              <button
                type="button"
                className={
                  styles.photoButton
                }
                onClick={
                  handleAvatarClick
                }
              >
                <Camera
                  size={17}
                />

                Alterar foto
              </button>

              <input
                ref={
                  fileInputRef
                }
                type="file"
                accept="image/*"
                className={
                  styles.hiddenInput
                }
                onChange={
                  handleAvatarChange
                }
              />
            </div>
          </div>

          {/* NOME E EMAIL */}

          <div
            className={
              styles.formGrid
            }
          >
            <div
              className={
                styles.field
              }
            >
              <label
                htmlFor="nome"
              >
                Nome
              </label>

              <input
                id="nome"
                type="text"
                value={nome}
                placeholder="Seu nome"
                onChange={(
                  event,
                ) =>
                  setNome(
                    event.target
                      .value,
                  )
                }
              />
            </div>

            <div
              className={
                styles.field
              }
            >
              <label
                htmlFor="email"
              >
                E-mail
              </label>

              <input
                id="email"
                type="email"
                value={email}
                placeholder="seu@email.com"
                onChange={(
                  event,
                ) =>
                  setEmail(
                    event.target
                      .value,
                  )
                }
              />
            </div>
          </div>

          {/* SENHA */}

          <div
            className={
              styles.passwordSection
            }
          >
            <div
              className={
                styles.passwordTitle
              }
            >
              <div
                className={
                  styles.passwordIcon
                }
              >
                <LockKeyhole
                  size={18}
                />
              </div>

              <div>
                <h3>
                  Alterar senha
                </h3>

                <p>
                  Defina uma nova senha
                  para sua conta.
                </p>
              </div>
            </div>

            <div
              className={
                styles.passwordGrid
              }
            >
              <div
                className={
                  styles.field
                }
              >
                <label
                  htmlFor="novaSenha"
                >
                  Nova senha
                </label>

                <div
                  className={
                    styles.passwordField
                  }
                >
                  <input
                    id="novaSenha"
                    type={
                      mostrarNovaSenha
                        ? 'text'
                        : 'password'
                    }
                    value={
                      novaSenha
                    }
                    autoComplete="new-password"
                    placeholder="Digite sua nova senha"
                    onChange={(
                      event,
                    ) => {
                      setNovaSenha(
                        event.target
                          .value,
                      );

                      setErroSenha(
                        '',
                      );
                    }}
                  />

                  <button
                    type="button"
                    className={
                      styles.eyeButton
                    }
                    onClick={() =>
                      setMostrarNovaSenha(
                        (atual) =>
                          !atual,
                      )
                    }
                    aria-label={
                      mostrarNovaSenha
                        ? 'Ocultar senha'
                        : 'Mostrar senha'
                    }
                  >
                    {mostrarNovaSenha ? (
                      <EyeOff
                        size={18}
                      />
                    ) : (
                      <Eye
                        size={18}
                      />
                    )}
                  </button>
                </div>
              </div>

              <div
                className={
                  styles.field
                }
              >
                <label
                  htmlFor="confirmarSenha"
                >
                  Confirmar nova senha
                </label>

                <div
                  className={
                    styles.passwordField
                  }
                >
                  <input
                    id="confirmarSenha"
                    type={
                      mostrarConfirmarSenha
                        ? 'text'
                        : 'password'
                    }
                    value={
                      confirmarSenha
                    }
                    autoComplete="new-password"
                    placeholder="Digite novamente"
                    onChange={(
                      event,
                    ) => {
                      setConfirmarSenha(
                        event.target
                          .value,
                      );

                      setErroSenha(
                        '',
                      );
                    }}
                  />

                  <button
                    type="button"
                    className={
                      styles.eyeButton
                    }
                    onClick={() =>
                      setMostrarConfirmarSenha(
                        (atual) =>
                          !atual,
                      )
                    }
                    aria-label={
                      mostrarConfirmarSenha
                        ? 'Ocultar senha'
                        : 'Mostrar senha'
                    }
                  >
                    {mostrarConfirmarSenha ? (
                      <EyeOff
                        size={18}
                      />
                    ) : (
                      <Eye
                        size={18}
                      />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {erroSenha && (
              <div
                className={
                  styles.passwordError
                }
              >
                {erroSenha}
              </div>
            )}
          </div>

          {/* SALVAR */}

          <div
            className={
              styles.saveArea
            }
          >
            <button
              type="button"
              className={
                styles.saveButton
              }
              onClick={handleSalvar}
              disabled={salvandoPerfil}
            >
              {!salvandoPerfil && <Save size={17} />}
              {salvandoPerfil
                ? <LoadingState variant="inline" title="Salvando configurações..." />
                : 'Salvar alterações'}
            </button>
          </div>
        </section>

        {/* =================================================
            PREFERÊNCIAS
        ================================================= */}

        <section
          className={styles.card}
        >
          <div
            className={
              styles.cardHeader
            }
          >
            <div>
              <h2>
                Preferências
              </h2>

              <p>
                Notificações e segurança.
              </p>
            </div>
          </div>

          <div
            className={
              styles.cardDivider
            }
          />

          <div
            className={
              styles.preferences
            }
          >
            <PreferenceRow
              label="Notificações por e-mail"
              description="Receba novidades e avisos importantes por e-mail."
              active={
                preferencias.email
              }
              onClick={() => { void togglePreferencia('email'); }}
              disabled={carregandoPreferencias || salvandoPreferencia || !usuario?.id}
            />

            <PreferenceRow
              label="Notificações de push"
              description="Receba alertas diretamente no sistema."
              active={
                preferencias.push
              }
              onClick={() => { void togglePreferencia('push'); }}
              disabled={carregandoPreferencias || salvandoPreferencia || !usuario?.id}
            />

            <PreferenceRow
              label="Autenticação em duas etapas"
              description="Requer ativação no backend e verificação obrigatória durante o login."
              active={
                preferencias.twoFactor
              }
              onClick={() => {}}
              disabled
            />
          </div>

          <p className={styles.preferenceStatus} role="status" aria-live="polite">
            {carregandoPreferencias
              ? 'Carregando preferências...'
              : salvandoPreferencia
                ? 'Salvando preferência...'
                : statusPreferencias || (preferenciasNoServidor
                  ? 'Suas preferências estão sincronizadas com a conta.'
                  : 'Os interruptores de notificação são salvos automaticamente.')}
          </p>
          <p className={styles.preferenceNotice}>
            A autenticação em duas etapas não pode ser ativada apenas com este interruptor.
            É necessário configurar os códigos de verificação no backend e no login.
          </p>
        </section>
      </div>
    </main>
  );
};

interface PreferenceRowProps {
  label: string;
  description: string;
  active: boolean;
  onClick: () => void;
  disabled?: boolean;
}

const PreferenceRow = ({
  label,
  description,
  active,
  onClick,
  disabled = false,
}: PreferenceRowProps) => {
  return (
    <div
      className={
        styles.preferenceRow
      }
    >
      <div
        className={
          styles.preferenceText
        }
      >
        <strong>
          {label}
        </strong>

        <span>
          {description}
        </span>
      </div>

      <button
        type="button"
        className={`${styles.switch} ${
          active
            ? styles.switchActive
            : ''
        }`}
        role="switch"
        aria-checked={active}
        aria-label={label}
        aria-disabled={disabled}
        disabled={disabled}
        onClick={onClick}
      >
        <span />
      </button>
    </div>
  );
};

export default Configuracoes;