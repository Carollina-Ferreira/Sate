import {
  Camera,
  Check,
  Palette,
  ShieldCheck,
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

interface CorEquipe {
  id: string;
  nome: string;
  valor: string;
}

interface Usuario {
  id?: number;
  nome?: string;
  email?: string;
  tipo?: string;
  avatarUrl?: string | null;
}

const API_URL = 'http://localhost:3000';

const coresDisponiveis: CorEquipe[] = [
  {
    id: 'verde',
    nome: 'Verde',
    valor: '#16A875',
  },
  {
    id: 'azul',
    nome: 'Azul',
    valor: '#2F78C4',
  },
  {
    id: 'roxo',
    nome: 'Roxo',
    valor: '#7D1A86',
  },
  {
    id: 'vermelho',
    nome: 'Vermelho',
    valor: '#B53A22',
  },
  {
    id: 'laranja',
    nome: 'Laranja',
    valor: '#FFA548',
  },
  {
    id: 'rosa',
    nome: 'Rosa',
    valor: '#D652A2',
  },
];

const Configuracoes = () => {
  const fileInputRef =
    useRef<HTMLInputElement>(null);

  /* =====================================
     USUÁRIO LOGADO
  ===================================== */

  const [usuario, setUsuario] =
    useState<Usuario | null>(null);

  const [nome, setNome] =
    useState('');

  const [email, setEmail] =
    useState('');

  /* =====================================
     FOTO
  ===================================== */

  const [avatarPreview, setAvatarPreview] =
    useState<string | null>(null);

  const [novaFoto, setNovaFoto] =
    useState<File | null>(null);

  /* =====================================
     PREFERÊNCIAS
  ===================================== */

  const [preferencias, setPreferencias] =
    useState<Preferencias>({
      email: true,
      push: true,
      twoFactor: false,
    });

  /* =====================================
     CORES
  ===================================== */

  const [coresSelecionadas, setCoresSelecionadas] =
    useState<string[]>([
      '#16A875',
      '#2F78C4',
      '#D652A2',
    ]);

  /* =====================================
     TOKEN
  ===================================== */

  const obterToken = () => {
    return (
      localStorage.getItem('token') ||
      sessionStorage.getItem('token')
    );
  };

  /* =====================================
     CARREGAR USUÁRIO
  ===================================== */

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
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!resposta.ok) {
          throw new Error(
            'Não foi possível carregar o perfil.',
          );
        }

        const dados = await resposta.json();

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

        /*
         * Caso a API esteja indisponível,
         * tenta carregar os dados antigos
         * do storage.
         */
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

  /* =====================================
     INICIAIS
  ===================================== */

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

  /* =====================================
     FOTO
  ===================================== */

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

  /* =====================================
     PREFERÊNCIAS
  ===================================== */

  const togglePreferencia = (
    key: keyof Preferencias,
  ) => {
    setPreferencias((atual) => ({
      ...atual,
      [key]: !atual[key],
    }));
  };

  /* =====================================
     CORES
  ===================================== */

  const toggleCor = (cor: string) => {
    setCoresSelecionadas((atuais) => {
      const jaSelecionada =
        atuais.includes(cor);

      if (jaSelecionada) {
        return atuais.filter(
          (item) => item !== cor,
        );
      }

      if (atuais.length >= 3) {
        return atuais;
      }

      return [...atuais, cor];
    });
  };

  /* =====================================
     SALVAR PERFIL
  ===================================== */

  const handleSalvar = async () => {
    if (!usuario) {
      alert(
        'Usuário não encontrado.',
      );

      return;
    }

    const token = obterToken();

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

    try {
      const formData = new FormData();

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
            Authorization: `Bearer ${token}`,
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

      if (usuarioAtualizado.avatarUrl) {
        setAvatarPreview(
          `${API_URL}${usuarioAtualizado.avatarUrl}`,
        );
      }

      setNovaFoto(null);

      /*
       * Atualiza também o usuário salvo
       * no navegador para o Header pegar
       * o novo nome.
       */
      const estaNoLocalStorage =
        localStorage.getItem('usuario') !== null;

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

      {/* =====================================
          CABEÇALHO
      ===================================== */}

      <div className={styles.pageHeader}>
        <div>
          <h1>Configurações</h1>

          <p>
            Gerencie seu perfil, preferências e a identidade da sua equipe.
          </p>
        </div>
      </div>

      <div className={styles.content}>

        {/* =====================================
            PERFIL
        ===================================== */}

        <section className={styles.card}>

          <div className={styles.cardHeader}>
            <div>
              <h2>
                Perfil do usuário
              </h2>

              <p>
                Atualize suas informações pessoais.
              </p>
            </div>
          </div>

          <div className={styles.profileTop}>

            <div className={styles.avatarWrapper}>

              <div className={styles.avatar}>

                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Foto do usuário"
                  />
                ) : (
                  iniciais
                )}

              </div>

              <button
                type="button"
                className={styles.photoButton}
                onClick={
                  handleAvatarClick
                }
              >
                <Camera size={17} />

                Alterar foto
              </button>

              <input
                ref={fileInputRef}
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

          <div className={styles.formGrid}>

            <div className={styles.field}>

              <label htmlFor="nome">
                Nome
              </label>

              <input
                id="nome"
                type="text"
                value={nome}
                onChange={(event) =>
                  setNome(
                    event.target.value,
                  )
                }
              />

            </div>

            <div className={styles.field}>

              <label htmlFor="email">
                Email
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(
                    event.target.value,
                  )
                }
              />

            </div>

          </div>

          {/* BOTÃO SALVAR */}

          <div className={styles.saveArea}>

            <button
              type="button"
              className={styles.saveButton}
              onClick={handleSalvar}
            >
              <Save size={17} />

              Salvar alterações
            </button>

          </div>

        </section>

        {/* =====================================
            PREFERÊNCIAS
        ===================================== */}

        <section className={styles.card}>

          <div className={styles.cardHeader}>

            <div>

              <h2>
                Preferências do sistema
              </h2>

              <p>
                Notificações e segurança.
              </p>

            </div>

            <div className={styles.cardIcon}>
              <ShieldCheck size={20} />
            </div>

          </div>

          <div className={styles.preferences}>

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

        {/* =====================================
            PERSONALIZAÇÃO
        ===================================== */}

        <section className={styles.card}>

          <div className={styles.cardHeader}>

            <div>

              <div
                className={
                  styles.personalizationTitle
                }
              >
                <Palette size={18} />

                <h2>
                  Personalização da equipe
                </h2>
              </div>

              <p>
                Escolha até 3 cores para representar a identidade da sua equipe.
              </p>

            </div>

          </div>

          <div className={styles.colorList}>

            {coresDisponiveis.map(
              (cor) => {

                const selecionada =
                  coresSelecionadas.includes(
                    cor.valor,
                  );

                return (
                  <button
                    key={cor.id}
                    type="button"
                    className={`${styles.colorButton} ${
                      selecionada
                        ? styles.colorButtonSelected
                        : ''
                    }`}
                    style={{
                      background:
                        cor.valor,
                    }}
                    title={cor.nome}
                    onClick={() =>
                      toggleCor(
                        cor.valor,
                      )
                    }
                  >

                    {selecionada && (
                      <Check
                        size={15}
                      />
                    )}

                  </button>
                );
              },
            )}

          </div>

          <div
            className={
              styles.paletteSection
            }
          >

            <span>
              Paleta
            </span>

            <div
              className={
                styles.palettePreview
              }
            >

              {coresSelecionadas.length ===
              0 ? (

                <div
                  className={
                    styles.emptyPalette
                  }
                >
                  Selecione uma cor
                </div>

              ) : (

                coresSelecionadas.map(
                  (cor) => (

                    <div
                      key={cor}
                      className={
                        styles.paletteColor
                      }
                      style={{
                        background: cor,
                      }}
                    />

                  ),
                )

              )}

            </div>

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

      <div>

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
        onClick={onClick}
      >
        <span />
      </button>

    </div>
  );
};

export default Configuracoes;