import {
  ArrowLeft,
  ArrowRight,
  Check,
  Plus,
  Target,
  Activity,
  Zap,
  Shield,
  CircleDot,
  Goal,
  Handshake,
  Flag,
} from 'lucide-react';

import {
  useEffect,
  useState,
  type ReactNode,
} from 'react';

import { useNavigate } from 'react-router-dom';

import styles from './configuracaoAnalise.module.css';

const API_URL = 'http://localhost:3000/api';

interface CampoAnalise {
  id: number;
  nome: string;
  descricao?: string | null;
  tipo: 'positiva' | 'negativa' | 'neutra';
  ordem?: number;
}

interface ConfiguracaoAnaliseProps {
  onVoltar?: () => void;
  onContinuar?: () => void;
}

interface CampoVisual {
  nome: string;
  descricao: string;
  tipo: 'positiva' | 'negativa' | 'neutra';
  icone: ReactNode;
}

const camposDisponiveis: CampoVisual[] = [
  {
    nome: 'Gol',
    descricao: 'Gol marcado pela equipe',
    tipo: 'positiva',
    icone: <Goal size={20} />,
  },
  {
    nome: 'Assistência',
    descricao: 'Passe que resulta em gol',
    tipo: 'positiva',
    icone: <Handshake size={20} />,
  },
  {
    nome: 'Ataque',
    descricao: 'Ação ofensiva da equipe',
    tipo: 'positiva',
    icone: <Zap size={20} />,
  },
  {
    nome: 'Contra-ataque',
    descricao: 'Transição rápida para o ataque',
    tipo: 'positiva',
    icone: <ArrowRight size={20} />,
  },
  {
    nome: 'Finalização',
    descricao: 'Finalização realizada pela equipe',
    tipo: 'positiva',
    icone: <Target size={20} />,
  },
  {
    nome: 'Defesa',
    descricao: 'Ação defensiva da equipe',
    tipo: 'positiva',
    icone: <Shield size={20} />,
  },
  {
    nome: 'Erro de passe',
    descricao: 'Passe errado ou interceptado',
    tipo: 'negativa',
    icone: <CircleDot size={20} />,
  },
  {
    nome: 'Falta',
    descricao: 'Falta cometida pela equipe',
    tipo: 'negativa',
    icone: <Flag size={20} />,
  },
];

function obterToken(): string | null {
  return (
    localStorage.getItem('token') ||
    localStorage.getItem('accessToken') ||
    sessionStorage.getItem('token')
  );
}

function converterTipo(
  tipo: string
): CampoAnalise['tipo'] {
  switch (tipo?.toUpperCase()) {
    case 'NEGATIVA':
      return 'negativa';

    case 'NEUTRA':
      return 'neutra';

    default:
      return 'positiva';
  }
}

function normalizarCampo(
  campo: CampoAnalise
): CampoAnalise {
  return {
    ...campo,
    tipo: converterTipo(campo.tipo),
  };
}

export default function ConfiguracaoAnalise({
  onVoltar,
  onContinuar,
}: ConfiguracaoAnaliseProps) {
  const navigate = useNavigate();

  const [campos, setCampos] = useState<CampoAnalise[]>([]);

  const [carregando, setCarregando] =
    useState(true);

  const [salvando, setSalvando] =
    useState(false);

  const [erro, setErro] =
    useState('');

  const [adicionando, setAdicionando] =
    useState(false);

  /*
  |--------------------------------------------------------------------------
  | BUSCAR CONFIGURAÇÕES DO BANCO
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    buscarConfiguracoes();
  }, []);

  async function buscarConfiguracoes() {
    try {
      setCarregando(true);
      setErro('');

      const token = obterToken();

      if (!token) {
        setErro(
          'Sua sessão expirou. Faça login novamente.'
        );

        return;
      }

      const resposta = await fetch(
        `${API_URL}/configuracao-analise`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          dados.mensagem ||
            'Erro ao carregar as configurações.'
        );
      }

      const configuracoes =
        Array.isArray(dados.configuracoes)
          ? dados.configuracoes
          : [];

      setCampos(
        configuracoes.map(normalizarCampo)
      );
    } catch (error) {
      console.error(
        'Erro ao buscar configurações de análise:',
        error
      );

      setErro(
        error instanceof Error
          ? error.message
          : 'Erro ao carregar configurações.'
      );
    } finally {
      setCarregando(false);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | ADICIONAR CAMPO
  |--------------------------------------------------------------------------
  */

  async function adicionarCampo(
    campo: CampoVisual
  ) {
    try {
      setAdicionando(true);
      setErro('');

      const token = obterToken();

      if (!token) {
        setErro(
          'Sua sessão expirou. Faça login novamente.'
        );

        return;
      }

      const jaExiste = campos.some(
        (item) =>
          item.nome.toLowerCase() ===
          campo.nome.toLowerCase()
      );

      if (jaExiste) {
        return;
      }

      const resposta = await fetch(
        `${API_URL}/configuracao-analise`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nome: campo.nome,
            descricao: campo.descricao,
            tipo: campo.tipo.toUpperCase(),
            ordem: campos.length,
          }),
        }
      );

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          dados.mensagem ||
            'Erro ao adicionar evento.'
        );
      }

      const novoCampo =
        normalizarCampo(
          dados.configuracao
        );

      setCampos((anterior) => [
        ...anterior,
        novoCampo,
      ]);
    } catch (error) {
      console.error(
        'Erro ao adicionar configuração:',
        error
      );

      setErro(
        error instanceof Error
          ? error.message
          : 'Erro ao adicionar evento.'
      );
    } finally {
      setAdicionando(false);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | REMOVER CAMPO
  |--------------------------------------------------------------------------
  */

  async function removerCampo(
    campo: CampoAnalise
  ) {
    try {
      setErro('');

      const token = obterToken();

      if (!token) {
        setErro(
          'Sua sessão expirou. Faça login novamente.'
        );

        return;
      }

      const resposta = await fetch(
        `${API_URL}/configuracao-analise/${campo.id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          dados.mensagem ||
            'Erro ao remover evento.'
        );
      }

      setCampos((anterior) =>
        anterior.filter(
          (item) => item.id !== campo.id
        )
      );
    } catch (error) {
      console.error(
        'Erro ao remover configuração:',
        error
      );

      setErro(
        error instanceof Error
          ? error.message
          : 'Erro ao remover evento.'
      );
    }
  }

  /*
  |--------------------------------------------------------------------------
  | ALTERAR TIPO
  |--------------------------------------------------------------------------
  */

  async function alterarTipo(
    campo: CampoAnalise,
    novoTipo: CampoAnalise['tipo']
  ) {
    try {
      setErro('');

      const token = obterToken();

      if (!token) {
        setErro(
          'Sua sessão expirou. Faça login novamente.'
        );

        return;
      }

      const resposta = await fetch(
        `${API_URL}/configuracao-analise/${campo.id}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            tipo: novoTipo.toUpperCase(),
          }),
        }
      );

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          dados.mensagem ||
            'Erro ao atualizar evento.'
        );
      }

      const atualizado =
        normalizarCampo(
          dados.configuracao
        );

      setCampos((anterior) =>
        anterior.map((item) =>
          item.id === atualizado.id
            ? atualizado
            : item
        )
      );
    } catch (error) {
      console.error(
        'Erro ao atualizar tipo:',
        error
      );

      setErro(
        error instanceof Error
          ? error.message
          : 'Erro ao atualizar evento.'
      );
    }
  }

  /*
  |--------------------------------------------------------------------------
  | VERIFICAR SE CAMPO ESTÁ SELECIONADO
  |--------------------------------------------------------------------------
  */

  function campoSelecionado(
    nome: string
  ) {
    return campos.some(
      (campo) =>
        campo.nome.toLowerCase() ===
        nome.toLowerCase()
    );
  }

  /*
  |--------------------------------------------------------------------------
  | ADICIONAR CAMPO PERSONALIZADO
  |--------------------------------------------------------------------------
  */

  async function adicionarCampoPersonalizado() {
    const nome =
      window.prompt(
        'Digite o nome do novo evento:'
      );

    if (!nome || !nome.trim()) {
      return;
    }

    const descricao =
      window.prompt(
        'Digite uma descrição para esse evento:'
      );

    await adicionarCampo({
      nome: nome.trim(),
      descricao:
        descricao?.trim() ||
        'Evento configurado pelo treinador',
      tipo: 'positiva',
      icone: <Activity size={20} />,
    });
  }

  /*
  |--------------------------------------------------------------------------
  | CONTINUAR → CONFIGURAÇÃO DA EQUIPE
  |--------------------------------------------------------------------------
  */

  async function continuar() {
    if (campos.length === 0) {
      setErro(
        'Selecione pelo menos um evento para continuar.'
      );

      return;
    }

    try {
      setSalvando(true);
      setErro('');

      const token = obterToken();

      if (!token) {
        setErro(
          'Sua sessão expirou. Faça login novamente.'
        );

        return;
      }

      /*
       * Salva a ordem atual dos eventos
       * no banco de dados.
       */

      const listaOrdem = campos.map(
        (campo, index) => ({
          id: campo.id,
          ordem: index,
        })
      );

      const resposta = await fetch(
        `${API_URL}/configuracao-analise/ordem`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            configuracoes: listaOrdem,
          }),
        }
      );

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          dados.mensagem ||
            'Erro ao salvar a ordem dos eventos.'
        );
      }

      /*
       * Se o componente pai tiver uma função
       * onContinuar, ela será executada.
       */

      if (onContinuar) {
        onContinuar();
      }

      /*
       * Vai para a próxima etapa:
       * CONFIGURAÇÃO DA EQUIPE
       */
      navigate('/configuracao-equipe');

    } catch (error) {
      console.error(
        'Erro ao continuar configuração:',
        error
      );

      setErro(
        error instanceof Error
          ? error.message
          : 'Erro ao salvar configuração.'
      );
    } finally {
      setSalvando(false);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (
    <div className={styles.page}>
      <main className={styles.container}>

        {/* =====================================
            PROGRESSO
        ===================================== */}

        <section className={styles.progressArea}>
          <span className={styles.stepBadge}>
            Etapa 3 de 4
          </span>

          <div className={styles.progressSteps}>
            <span
              className={
                styles.progressComplete
              }
            />

            <span
              className={
                styles.progressComplete
              }
            />

            <span
              className={
                styles.progressActive
              }
            />

            <span
              className={
                styles.progressInactive
              }
            />
          </div>
        </section>

        {/* =====================================
            CABEÇALHO
        ===================================== */}

        <header className={styles.header}>
          <span className={styles.sportBadge}>
            ANÁLISE DE DESEMPENHO
          </span>

          <h1>
            Defina o que você quer{' '}
            <strong>
              analisar nos vídeos
            </strong>
          </h1>

          <p>
            Selecione os principais eventos
            que serão utilizados durante a
            análise das partidas da sua equipe.
          </p>
        </header>

        {/* =====================================
            ERRO
        ===================================== */}

        {erro && (
          <div
            style={{
              width: '100%',
              marginBottom: '16px',
              padding: '12px 16px',
              boxSizing: 'border-box',
              borderRadius: '10px',
              background:
                'rgba(213, 41, 65, 0.16)',
              border:
                '1px solid rgba(255, 150, 160, 0.4)',
              color: '#ffffff',
              fontSize: '12px',
              textAlign: 'center',
            }}
          >
            {erro}
          </div>
        )}

        {/* =====================================
            CAMPOS
        ===================================== */}

        {carregando ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '180px',
              color: '#d3e4de',
              fontSize: '13px',
            }}
          >
            Carregando configurações...
          </div>
        ) : (
          <section className={styles.fieldsGrid}>

            {camposDisponiveis.map(
              (campo) => {
                const selecionado =
                  campoSelecionado(
                    campo.nome
                  );

                const configuracao =
                  campos.find(
                    (item) =>
                      item.nome.toLowerCase() ===
                      campo.nome.toLowerCase()
                  );

                return (
                  <button
                    key={campo.nome}
                    type="button"
                    className={
                      selecionado
                        ? `${styles.fieldCard} ${styles.fieldCardSelected}`
                        : styles.fieldCard
                    }
                    onClick={() => {
                      if (selecionado) {
                        if (configuracao) {
                          removerCampo(
                            configuracao
                          );
                        }
                      } else {
                        adicionarCampo(
                          campo
                        );
                      }
                    }}
                    disabled={
                      adicionando ||
                      salvando
                    }
                  >
                    <span
                      className={
                        selecionado
                          ? `${styles.checkbox} ${styles.checkboxSelected}`
                          : styles.checkbox
                      }
                    >
                      {selecionado && (
                        <Check size={18} />
                      )}
                    </span>

                    <span
                      className={
                        styles.fieldName
                      }
                    >
                      {campo.nome}
                    </span>

                    <span
                      className={
                        styles.fieldIcon
                      }
                    >
                      {campo.icone}
                    </span>
                  </button>
                );
              }
            )}

            {/* =====================================
                ADICIONAR PERSONALIZADO
            ===================================== */}

            <button
              type="button"
              className={styles.addField}
              onClick={
                adicionarCampoPersonalizado
              }
              disabled={
                adicionando ||
                salvando
              }
            >
              <span
                className={styles.addIcon}
              >
                <Plus size={21} />
              </span>

              <span
                className={styles.addText}
              >
                <strong>
                  Adicionar campo
                </strong>

                <span>
                  Crie um evento personalizado
                </span>
              </span>
            </button>

          </section>
        )}

        {/* =====================================
            FOOTER
        ===================================== */}

        <footer className={styles.footer}>

          <button
            type="button"
            className={styles.backButton}
            onClick={onVoltar}
            disabled={salvando}
          >
            <ArrowLeft size={18} />
            Voltar
          </button>

          <div
            className={styles.footerRight}
          >
            <span
              className={
                styles.selectedCounter
              }
            >
              {campos.length}{' '}
              {campos.length === 1
                ? 'campo selecionado'
                : 'campos selecionados'}
            </span>

            <button
              type="button"
              className={styles.nextButton}
              onClick={continuar}
              disabled={
                campos.length === 0 ||
                salvando
              }
            >
              {salvando
                ? 'Salvando...'
                : 'Continuar'}

              {!salvando && (
                <ArrowRight size={18} />
              )}
            </button>
          </div>

        </footer>
      </main>
    </div>
  );
}