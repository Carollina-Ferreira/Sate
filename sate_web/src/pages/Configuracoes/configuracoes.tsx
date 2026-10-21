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

const API_URL = 'http://localhost:3000';

const Configuracoes = () => {
  const fileInputRef =
    useRef<HTMLInputElement>(null);

  // =====================================================
  // USUÁRIO
  // =====================================================

  const [usuario, setUsuario] =
    useState<Usuario | null>(null);

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
      sessionStorage.getItem('token')
    );
  };

  // =====================================================
  // CARREGAR USUÁRIO
  // =====================================================

  useEffect(() => {
    const carregarUsuario = async () => {
      const token = obterToken();

      if (!token) {
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
  // PREFERÊNCIAS
  // =====================================================

  const togglePreferencia = (
    key: keyof Preferencias,
  ) => {
    setPreferencias((atual) => ({
      ...atual,

      [key]:
        !atual[key],
    }));
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
    }
  };

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
              onClick={
                handleSalvar
              }
            >
              <Save size={17} />

              Salvar alterações
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
              onClick={() =>
                togglePreferencia(
                  'email',
                )
              }
            />

            <PreferenceRow
              label="Notificações de push"
              description="Receba alertas diretamente no sistema."
              active={
                preferencias.push
              }
              onClick={() =>
                togglePreferencia(
                  'push',
                )
              }
            />

            <PreferenceRow
              label="Autenticação em duas etapas"
              description="Adicione uma camada extra de segurança à conta."
              active={
                preferencias.twoFactor
              }
              onClick={() =>
                togglePreferencia(
                  'twoFactor',
                )
              }
            />
          </div>
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
}

const PreferenceRow = ({
  label,
  description,
  active,
  onClick,
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
        aria-pressed={active}
        aria-label={label}
        onClick={onClick}
      >
        <span />
      </button>
    </div>
  );
};

export default Configuracoes;