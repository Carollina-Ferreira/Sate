import {
  useEffect,
  useState,
} from 'react';

import styles from './equipes.module.css';

import CardEquipe from '../../components/CardEquipe/cardEquipe';

import NovaEquipeModal from '../../components/NovaEquipeModal/novaEquipeModal';

import type {
  NovaEquipeData,
} from '../../components/NovaEquipeModal/novaEquipeModal';

import EditarEquipeModal from '../../components/EditarEquipeModal/editarEquipeModal';

import type {
  EditarEquipeData,
} from '../../components/EditarEquipeModal/editarEquipeModal';

import DetalhesEquipe from './detalhesEquipe';

import Futebol from '../../assets/img/futebol_img.png';
import Basquete from '../../assets/img/basquete_img.png';
import Volei from '../../assets/img/volei_img.png';
import Rugby from '../../assets/img/rugby_img.png';

import {
  Pencil,
} from 'lucide-react';

/* ============================================================
   TIPOS
============================================================ */

type Modalidade =
  | 'Todos'
  | 'Futebol'
  | 'Basquete'
  | 'Vôlei'
  | 'Rugby'
  | 'Tênis';

export interface AtletaDisponivel {
  id: number;
  nome: string;
  categoria?: string | null;
  usuario?: {
    email?: string;
    avatarUrl?: string | null;
  } | null;
}

interface AtletaBackend {
  id: number;
  nome?: string | null;
  categoria?: string | null;
  usuario?: {
    email?: string | null;
    avatarUrl?: string | null;
  } | null;
}

interface EquipeBackend {
  id: number;
  nome: string;
  modalidade: string;
  categoria?: string | null;
  proximaPartida?: string | null;
  imagem?: string | null;
  corEquipe?: string | null;
  treinadorId?: number;
  numeroAtletas?: number;
  atletas?: AtletaBackend[];
  _count?: {
    atletas?: number;
  };
}

export interface Equipe {
  id: number;
  nome: string;
  modalidade: string;
  categoria: string;
  atletas: number;
  atletasIds: number[];
  atletasDetalhes: AtletaDisponivel[];
  imagem: string;
  icone: string;
  cor: string;
  vitorias: number;
  empates: number | string;
  derrotas: number;
  proximaPartida: string;
  proximaPartidaRaw?: string | null;
  sigla: string;
  desempenho: number;
  videos: number;
  elenco: {
    id: number;
    nome: string;
    posicao: string;
    idade: number;
    desempenho: number;
  }[];
  evolucao: number[];
}

/* ============================================================
   API
============================================================ */

const API_URL = 'http://localhost:3000/api';
const BACKEND_URL = 'http://localhost:3000';

/* ============================================================
   TOKEN
============================================================ */

function obterToken() {
  return (
    localStorage.getItem('token') ||
    localStorage.getItem('accessToken') ||
    sessionStorage.getItem('token')
  );
}

/* ============================================================
   MONTAR URL DA IMAGEM
============================================================ */

function montarUrlImagem(imagem?: string | null): string {
  if (!imagem) return '';

  const valor = imagem.trim();
  if (!valor) return '';

  if (valor.startsWith('http://') || valor.startsWith('https://')) {
    return valor;
  }

  if (valor.startsWith('data:')) {
    return valor;
  }

  if (valor.startsWith('/')) {
    return `${BACKEND_URL}${valor}`;
  }

  return `${BACKEND_URL}/${valor}`;
}

/* ============================================================
   IMAGEM POR MODALIDADE
============================================================ */

function imagemPorModalidade(modalidade: string) {
  switch (modalidade) {
    case 'Basquete':
      return Basquete;
    case 'Vôlei':
      return Volei;
    case 'Rugby':
      return Rugby;
    default:
      return Futebol;
  }
}

/* ============================================================
   ÍCONE POR MODALIDADE
============================================================ */

function iconePorModalidade(modalidade: string) {
  switch (modalidade) {
    case 'Basquete':
      return 'sports_basketball';
    case 'Vôlei':
      return 'sports_volleyball';
    case 'Rugby':
      return 'sports_rugby';
    case 'Tênis':
      return 'sports_tennis';
    default:
      return 'sports_soccer';
  }
}

/* ============================================================
   CRIAR SIGLA
============================================================ */

function criarSigla(nome: string) {
  const palavras = nome
    .trim()
    .split(' ')
    .filter(Boolean);

  if (palavras.length === 0) return 'EQ';
  if (palavras.length === 1) return palavras[0].slice(0, 2).toUpperCase();

  return `${palavras[0][0]}${palavras[palavras.length - 1][0]}`.toUpperCase();
}

/* ============================================================
   FORMATAR PRÓXIMA PARTIDA
============================================================ */

function formatarProximaPartida(data?: string | null) {
  if (!data) return 'Nenhuma partida agendada';

  const valor = new Date(data);
  if (Number.isNaN(valor.getTime())) {
    return 'Nenhuma partida agendada';
  }

  return valor.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/* ============================================================
   CONVERTER EQUIPE
============================================================ */

function converterEquipe(equipe: EquipeBackend): Equipe {
  let quantidadeAtletas = 0;

  if (typeof equipe.numeroAtletas === 'number') {
    quantidadeAtletas = equipe.numeroAtletas;
  } else if (typeof equipe._count?.atletas === 'number') {
    quantidadeAtletas = equipe._count.atletas;
  } else if (Array.isArray(equipe.atletas)) {
    quantidadeAtletas = equipe.atletas.length;
  }

  const atletasDetalhes: AtletaDisponivel[] = Array.isArray(equipe.atletas)
    ? equipe.atletas
        .filter((atleta) => atleta && typeof atleta.id === 'number')
        .map((atleta) => ({
          id: atleta.id,
          nome: atleta.nome || 'Atleta sem nome',
          categoria: atleta.categoria || null,
          usuario: atleta.usuario
            ? {
                email: atleta.usuario.email || '',
                avatarUrl: atleta.usuario.avatarUrl || null,
              }
            : null,
        }))
    : [];

  const atletasIds = atletasDetalhes.map((atleta) => atleta.id);

  const imagemEquipe =
    montarUrlImagem(equipe.imagem) ||
    imagemPorModalidade(equipe.modalidade);

  return {
    id: equipe.id,
    nome: equipe.nome,
    modalidade: equipe.modalidade,
    categoria: equipe.categoria || 'Sem categoria',
    atletas: quantidadeAtletas,
    atletasIds,
    atletasDetalhes,
    imagem: imagemEquipe,
    icone: iconePorModalidade(equipe.modalidade),
    cor: equipe.corEquipe || '#16A875',
    vitorias: 0,
    empates: 0,
    derrotas: 0,
    proximaPartida: formatarProximaPartida(equipe.proximaPartida),
    proximaPartidaRaw: equipe.proximaPartida || null,
    sigla: criarSigla(equipe.nome),
    desempenho: 0,
    videos: 0,
    elenco: [],
    evolucao: [0, 0, 0, 0, 0, 0, 0],
  };
}

/* ============================================================
   PEGAR MENSAGEM DE ERRO
============================================================ */

function pegarMensagemErro(dados: unknown, padrao: string) {
  if (typeof dados === 'object' && dados !== null) {
    const objeto = dados as Record<string, unknown>;

    if (typeof objeto.erro === 'string') {
      return objeto.erro;
    }
    if (typeof objeto.mensagem === 'string') {
      return objeto.mensagem;
    }
    if (typeof objeto.message === 'string') {
      return objeto.message;
    }
  }

  return padrao;
}

/* ============================================================
   EXTRAIR EQUIPES
============================================================ */

function extrairEquipes(dados: unknown): EquipeBackend[] {
  if (Array.isArray(dados)) {
    return dados as EquipeBackend[];
  }

  if (typeof dados === 'object' && dados !== null) {
    const objeto = dados as Record<string, unknown>;

    if (Array.isArray(objeto.equipes)) {
      return objeto.equipes as EquipeBackend[];
    }
    if (Array.isArray(objeto.data)) {
      return objeto.data as EquipeBackend[];
    }
  }

  return [];
}

/* ============================================================
   COMPONENTE
============================================================ */

const Equipes = () => {
  const [filtroAtivo, setFiltroAtivo] = useState<Modalidade>('Todos');
  const [equipes, setEquipes] = useState<Equipe[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [atletasDisponiveis, setAtletasDisponiveis] = useState<AtletaDisponivel[]>([]);
  const [carregandoAtletas, setCarregandoAtletas] = useState(false);
  const [equipeSelecionada, setEquipeSelecionada] = useState<Equipe | null>(null);
  const [modalNovaEquipe, setModalNovaEquipe] = useState(false);
  const [modoEditar, setModoEditar] = useState(false);
  const [equipeEmEdicao, setEquipeEmEdicao] = useState<Equipe | null>(null);
  const [salvandoEdicao, setSalvandoEdicao] = useState(false);

  /* ============================================================
     CARREGAR EQUIPES
  ============================================================ */

  async function carregarEquipes() {
    try {
      setCarregando(true);
      const token = obterToken();

      if (!token) {
        setEquipes([]);
        return;
      }

      const resposta = await fetch(`${API_URL}/equipes`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const dados: unknown = await resposta.json().catch(() => []);

      if (!resposta.ok) {
        throw new Error(
          pegarMensagemErro(dados, 'Erro ao carregar equipes.')
        );
      }

      const lista = extrairEquipes(dados);
      const equipesConvertidas = lista.map(converterEquipe);

      setEquipes(equipesConvertidas);
    } catch (error) {
      console.error('Erro ao carregar equipes:', error);
      setEquipes([]);
    } finally {
      setCarregando(false);
    }
  }

  /* ============================================================
     CARREGAR ATLETAS DISPONÍVEIS
  ============================================================ */

  async function carregarAtletas() {
    try {
      setCarregandoAtletas(true);
      const token = obterToken();

      if (!token) {
        setAtletasDisponiveis([]);
        return;
      }

      const resposta = await fetch(`${API_URL}/atletas/disponiveis`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const dados: unknown = await resposta.json().catch(() => []);

      if (!resposta.ok) {
        setAtletasDisponiveis([]);
        return;
      }

      let lista: unknown[] = [];

      if (Array.isArray(dados)) {
        lista = dados;
      } else if (typeof dados === 'object' && dados !== null) {
        const objeto = dados as Record<string, unknown>;
        if (Array.isArray(objeto.atletas)) {
          lista = objeto.atletas;
        }
      }

      const formatados = lista.map((item) => {
        const atleta = item as {
          id: number;
          nome?: string | null;
          categoria?: string | null;
          usuario?: {
            email?: string;
            avatarUrl?: string | null;
          } | null;
        };

        return {
          id: atleta.id,
          nome: atleta.nome || 'Atleta sem nome',
          categoria: atleta.categoria || null,
          usuario: atleta.usuario
            ? {
                email: atleta.usuario.email || '',
                avatarUrl: atleta.usuario.avatarUrl || null,
              }
            : null,
        } as AtletaDisponivel;
      });

      setAtletasDisponiveis(formatados);
    } catch (error) {
      console.error('Erro ao carregar atletas:', error);
      setAtletasDisponiveis([]);
    } finally {
      setCarregandoAtletas(false);
    }
  }

  /* ============================================================
     CARREGAMENTO INICIAL
  ============================================================ */

  useEffect(() => {
    void carregarEquipes();
    void carregarAtletas();
  }, []);

  /* ============================================================
     FILTRO
  ============================================================ */

  const equipesFiltradas =
    filtroAtivo === 'Todos'
      ? equipes
      : equipes.filter((equipe) => equipe.modalidade === filtroAtivo);

  /* ============================================================
     CRIAR EQUIPE
  ============================================================ */

  async function adicionarEquipe(dados: NovaEquipeData) {
    try {
      const token = obterToken();

      if (!token) {
        alert('Sessão não encontrada. Faça login novamente.');
        return;
      }

      const imagem = dados.imagemPreview || null;

      const resposta = await fetch(`${API_URL}/equipes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nome: dados.nome.trim(),
          modalidade: dados.modalidade,
          categoria: dados.categoria || null,
          imagem,
          corEquipe: dados.cor || '#16A875',
          proximaPartida: dados.proximaPartida || null,
          atletasIds: dados.atletasIds || [],
        }),
      });

      const respostaDados: unknown = await resposta.json().catch(() => ({}));

      if (!resposta.ok) {
        throw new Error(
          pegarMensagemErro(respostaDados, 'Erro ao criar equipe.')
        );
      }

      setModalNovaEquipe(false);
      setFiltroAtivo('Todos');

      await Promise.all([carregarEquipes(), carregarAtletas()]);

      alert('Equipe criada com sucesso!');
    } catch (error) {
      console.error('Erro ao criar equipe:', error);
      alert(error instanceof Error ? error.message : 'Erro ao criar equipe.');
    }
  }

  /* ============================================================
     CLICAR NA EQUIPE
  ============================================================ */

  function clicarEquipe(equipe: Equipe) {
    setEquipeSelecionada(equipe);
  }

  /* ============================================================
     SALVAR EDIÇÃO
  ============================================================ */

  async function salvarEdicao(dados: EditarEquipeData) {
    if (!equipeEmEdicao) return;

    if (!dados.nome.trim()) {
      alert('Informe o nome da equipe.');
      return;
    }

    try {
      setSalvandoEdicao(true);
      const token = obterToken();

      if (!token) {
        alert('Sessão não encontrada.');
        return;
      }

      const resposta = await fetch(`${API_URL}/equipes/${equipeEmEdicao.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nome: dados.nome.trim(),
          modalidade: dados.modalidade,
          categoria: dados.categoria.trim() || null,
          imagem: dados.imagem || null,
          corEquipe: dados.cor,
          proximaPartida: dados.proximaPartida
            ? new Date(dados.proximaPartida).toISOString()
            : null,
          atletasIds: dados.atletasIds,
        }),
      });

      const respostaDados: unknown = await resposta.json().catch(() => ({}));

      if (!resposta.ok) {
        throw new Error(
          pegarMensagemErro(respostaDados, 'Erro ao editar equipe.')
        );
      }

      setEquipeEmEdicao(null);
      setModoEditar(false);

      await Promise.all([carregarEquipes(), carregarAtletas()]);
    } catch (error) {
      console.error('Erro ao editar equipe:', error);
      alert(error instanceof Error ? error.message : 'Erro ao editar equipe.');
    } finally {
      setSalvandoEdicao(false);
    }
  }

  /* ============================================================
     EXCLUIR EQUIPE
  ============================================================ */

  async function excluirEquipe() {
    if (!equipeEmEdicao) return;

    try {
      setSalvandoEdicao(true);
      const token = obterToken();

      if (!token) {
        alert('Sessão não encontrada.');
        return;
      }

      const resposta = await fetch(`${API_URL}/equipes/${equipeEmEdicao.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const dados: unknown = await resposta.json().catch(() => ({}));

      if (!resposta.ok) {
        throw new Error(
          pegarMensagemErro(dados, 'Erro ao excluir equipe.')
        );
      }

      setEquipeEmEdicao(null);
      setModoEditar(false);

      await Promise.all([carregarEquipes(), carregarAtletas()]);
    } catch (error) {
      console.error('Erro ao excluir equipe:', error);
      alert(error instanceof Error ? error.message : 'Erro ao excluir equipe.');
    } finally {
      setSalvandoEdicao(false);
    }
  }

  /* ============================================================
     DETALHES DA EQUIPE
  ============================================================ */

  if (equipeSelecionada) {
    return (
      <DetalhesEquipe
        equipe={equipeSelecionada}
        onBack={() => setEquipeSelecionada(null)}
      />
    );
  }

  /* ============================================================
     TELA
  ============================================================ */

  return (
    <>
      <main className={styles.page}>
        {/* HEADER */}
        <div className={styles.header}>
          <h2>Equipes</h2>
          <button
            type="button"
            className={styles.btnNovaEquipe}
            onClick={() => setModalNovaEquipe(true)}
          >
            Nova Equipe
          </button>
        </div>

        {/* FILTROS DE MODALIDADE */}
        <div className={styles.filtros}>
          {(['Todos', 'Futebol', 'Basquete', 'Vôlei', 'Rugby', 'Tênis'] as Modalidade[]).map(
            (mod) => (
              <button
                key={mod}
                type="button"
                className={`${styles.btnFiltro} ${
                  filtroAtivo === mod ? styles.ativo : ''
                }`}
                onClick={() => setFiltroAtivo(mod)}
              >
                {mod}
              </button>
            )
          )}
        </div>

        {/* LISTA DE CARDS */}
        {carregando ? (
          <p className={styles.carregandoText}>Carregando equipes...</p>
        ) : equipesFiltradas.length === 0 ? (
          <p className={styles.emptyText}>Nenhuma equipe encontrada.</p>
        ) : (
          <div className={styles.gridEquipes}>
            {equipesFiltradas.map((equipe) => (
              <div key={equipe.id} className={styles.cardWrapper}>
                <button
                  type="button"
                  className={styles.btnEditarCard}
                  onClick={(e) => {
                    e.stopPropagation();
                    setEquipeEmEdicao(equipe);
                    setModoEditar(true);
                  }}
                  title="Editar Equipe"
                >
                  <Pencil size={16} />
                </button>
                <CardEquipe
                  equipe={equipe}
                  onClick={() => clicarEquipe(equipe)}
                />
              </div>
            ))}
          </div>
        )}
      </main>

      {/* MODAL NOVA EQUIPE */}
      {modalNovaEquipe && (
        <NovaEquipeModal
          onClose={() => setModalNovaEquipe(false)}
          onSubmit={adicionarEquipe}
          atletasDisponiveis={atletasDisponiveis}
        />
      )}

      {/* MODAL EDITAR EQUIPE */}
      {modoEditar && equipeEmEdicao && (
        <EditarEquipeModal
          equipe={equipeEmEdicao}
          atletasDisponiveis={atletasDisponiveis}
          carregandoAtletas={carregandoAtletas}
          salvando={salvandoEdicao}
          onClose={() => {
            setModoEditar(false);
            setEquipeEmEdicao(null);
          }}
          onSave={salvarEdicao}
          onDelete={excluirEquipe}
        />
      )}
    </>
  );
};

export default Equipes;