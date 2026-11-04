import {
  useEffect,
  useState,
} from 'react';

import {
  useSearchParams,
} from 'react-router-dom';

import {
  Pencil,
} from 'lucide-react';

import styles from './equipes.module.css';

import CardEquipe from '../../components/CardEquipe/cardEquipe';

import NovaEquipeModal from '../../components/NovaEquipeModal/novaEquipeModal';

import type {
  NovaEquipeData,
  AtletaDisponivel,
} from '../../components/NovaEquipeModal/novaEquipeModal';

import EditarEquipeModal from '../../components/EditarEquipeModal/editarEquipeModal';

import type {
  EditarEquipeData,
  EquipeParaEditar,
  AtletaDisponivel as AtletaParaEditar,
} from '../../components/EditarEquipeModal/editarEquipeModal';

import DetalhesEquipe from './detalhesEquipe';

import Futebol from '../../assets/img/futebol_img.png';
import Basquete from '../../assets/img/basquete_img.png';
import Volei from '../../assets/img/volei_img.png';
import Rugby from '../../assets/img/rugby_img.png';


type Modalidade =
  | 'Todos'
  | 'Futebol'
  | 'Basquete'
  | 'Vôlei'
  | 'Rugby'
  | 'Tênis';


interface AtletaEquipeBackend {
  id?: number;
  atletaId?: number;
  nome?: string | null;
  categoria?: string | null;
  equipeId?: number | null;

  equipe?: {
    id?: number;
  } | null;

  usuario?: {
    nome?: string | null;
    email?: string;
    avatarUrl?: string | null;
  } | null;

  atleta?: AtletaEquipeBackend | null;
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
  atletas?: unknown[];
  atletasIds?: number[];

  _count?: {
    atletas?: number;
  };
}


export interface Equipe extends EquipeParaEditar {
  icone: string;
  vitorias: number;
  empates: number | string;
  derrotas: number;
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


interface AtletaDaApi extends AtletaParaEditar {
  equipeId?: number | null;

  equipe?: {
    id?: number;
  } | null;
}


interface DadosExtrasNovaEquipe {
  atletasIds?: number[];
  proximaPartida?: string | null;
}


const API_URL = 'http://localhost:3000/api';


function obterToken(): string | null {
  return (
    localStorage.getItem('token') ||
    localStorage.getItem('accessToken') ||
    sessionStorage.getItem('token') ||
    sessionStorage.getItem('accessToken')
  );
}


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


function criarSigla(nome: string) {
  const palavras = nome
    .trim()
    .split(' ')
    .filter(Boolean);

  if (palavras.length === 0) {
    return 'EQ';
  }

  if (palavras.length === 1) {
    return palavras[0]
      .slice(0, 2)
      .toUpperCase();
  }

  return `${palavras[0][0]}${palavras[palavras.length - 1][0]}`.toUpperCase();
}


function formatarProximaPartida(data?: string | null) {
  if (!data) {
    return 'Partida ainda não definida';
  }

  const valor = new Date(data);

  if (Number.isNaN(valor.getTime())) {
    return 'Partida ainda não definida';
  }

  return valor.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}


function pegarMensagemErro(
  dados: unknown,
  padrao: string
) {
  if (
    typeof dados === 'object' &&
    dados !== null
  ) {
    const objeto = dados as Record<string, unknown>;

    if (typeof objeto.erro === 'string') {
      return objeto.erro;
    }

    if (typeof objeto.mensagem === 'string') {
      return objeto.mensagem;
    }
  }

  return padrao;
}


function extrairLista(
  dados: unknown,
  chave: string
): unknown[] {
  if (Array.isArray(dados)) {
    return dados;
  }

  if (
    typeof dados === 'object' &&
    dados !== null
  ) {
    const objeto = dados as Record<string, unknown>;

    if (Array.isArray(objeto[chave])) {
      return objeto[chave] as unknown[];
    }

    if (Array.isArray(objeto.data)) {
      return objeto.data;
    }
  }

  return [];
}


function converterAtletaParaEdicao(
  item: unknown
): AtletaDaApi | null {
  if (
    typeof item !== 'object' ||
    item === null
  ) {
    return null;
  }

  const registro = item as AtletaEquipeBackend;

  const atleta =
    registro.atleta &&
    typeof registro.atleta === 'object'
      ? registro.atleta
      : registro;

  const id = Number(
    atleta.id ?? registro.atletaId
  );

  if (
    !Number.isInteger(id) ||
    id <= 0
  ) {
    return null;
  }

  return {
    id,

    nome:
      atleta.nome ||
      atleta.usuario?.nome ||
      'Atleta sem nome',

    categoria:
      atleta.categoria || null,

    usuario: atleta.usuario
      ? {
          email: atleta.usuario.email || '',
          avatarUrl: atleta.usuario.avatarUrl || null,
        }
      : null,

    equipeId:
      atleta.equipeId ?? null,

    equipe:
      atleta.equipe || null,
  };
}


function converterEquipe(
  equipe: EquipeBackend
): Equipe {
  const atletasDetalhes =
    Array.isArray(equipe.atletas)
      ? equipe.atletas
          .map(converterAtletaParaEdicao)
          .filter(
            (atleta): atleta is AtletaDaApi =>
              atleta !== null
          )
      : [];

  const idsRecebidos =
    Array.isArray(equipe.atletasIds)
      ? equipe.atletasIds.map(Number)
      : atletasDetalhes.map(
          (atleta) => atleta.id
        );

  const atletasIds = [
    ...new Set(
      idsRecebidos.filter(
        (id) =>
          Number.isInteger(id) &&
          id > 0
      )
    ),
  ];

  let quantidadeAtletas = 0;

  if (
    typeof equipe.numeroAtletas === 'number'
  ) {
    quantidadeAtletas = equipe.numeroAtletas;
  } else if (
    typeof equipe._count?.atletas === 'number'
  ) {
    quantidadeAtletas = equipe._count.atletas;
  } else if (
    Array.isArray(equipe.atletas)
  ) {
    quantidadeAtletas = equipe.atletas.length;
  }

  return {
    id: equipe.id,

    nome: equipe.nome,

    modalidade: equipe.modalidade,

    categoria: equipe.categoria || 'Sem categoria',

    atletas: quantidadeAtletas,

    atletasIds,

    atletasDetalhes,

    imagem:
      equipe.imagem ||
      imagemPorModalidade(equipe.modalidade),

    icone: iconePorModalidade(equipe.modalidade),

    cor: equipe.corEquipe || '#16A875',

    vitorias: 0,
    empates: 0,
    derrotas: 0,

    proximaPartida: formatarProximaPartida(
      equipe.proximaPartida
    ),

    proximaPartidaRaw:
      equipe.proximaPartida || null,

    sigla: criarSigla(equipe.nome),

    desempenho: 0,

    videos: 0,

    elenco: [],

    evolucao: [
      0, 0, 0, 0, 0, 0, 0,
    ],
  };
}


function extrairEquipes(
  dados: unknown
): EquipeBackend[] {
  return extrairLista(
    dados,
    'equipes'
  ) as EquipeBackend[];
}


/* ============================================================
   COMPONENTE
============================================================ */

const Equipes = () => {
  const [searchParams, setSearchParams] =
    useSearchParams();

  const [filtroAtivo, setFiltroAtivo] =
    useState<Modalidade>('Todos');

  const [equipes, setEquipes] =
    useState<Equipe[]>([]);

  const [carregando, setCarregando] =
    useState(true);

  const [atletasDisponiveis, setAtletasDisponiveis] =
    useState<AtletaDisponivel[]>([]);

  const [carregandoAtletas, setCarregandoAtletas] =
    useState(false);

  const [atletasParaEditar, setAtletasParaEditar] =
    useState<AtletaParaEditar[]>([]);

  const [carregandoAtletasEdicao, setCarregandoAtletasEdicao] =
    useState(false);

  const [equipeSelecionada, setEquipeSelecionada] =
    useState<Equipe | null>(null);

  const [modalNovaEquipe, setModalNovaEquipe] =
    useState(false);

  const [modoEditar, setModoEditar] =
    useState(false);

  const [equipeEmEdicao, setEquipeEmEdicao] =
    useState<Equipe | null>(null);

  const [salvandoEdicao, setSalvandoEdicao] =
    useState(false);


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

      const resposta = await fetch(
        `${API_URL}/equipes`,
        {
          method: 'GET',

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const dados: unknown = await resposta
        .json()
        .catch(() => []);

      if (!resposta.ok) {
        throw new Error(
          pegarMensagemErro(
            dados,
            'Erro ao carregar equipes.'
          )
        );
      }

      const lista = extrairEquipes(dados);

      setEquipes(
        lista.map(converterEquipe)
      );
    } catch (error) {
      console.error(
        'Erro ao carregar equipes:',
        error
      );

      setEquipes([]);
    } finally {
      setCarregando(false);
    }
  }


  /* ============================================================
     CARREGAR ATLETAS PARA NOVA EQUIPE
  ============================================================ */

  async function carregarAtletas() {
    try {
      setCarregandoAtletas(true);

      const token = obterToken();

      if (!token) {
        setAtletasDisponiveis([]);
        return;
      }

      const resposta = await fetch(
        `${API_URL}/atletas/disponiveis`,
        {
          method: 'GET',

          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const dados: unknown = await resposta
        .json()
        .catch(() => []);

      if (!resposta.ok) {
        console.warn(
          'Não foi possível carregar atletas disponíveis.',
          dados
        );

        setAtletasDisponiveis([]);
        return;
      }

      const lista = extrairLista(
        dados,
        'atletas'
      );

      const formatados: AtletaDisponivel[] =
        lista
          .map((item) =>
            converterAtletaParaEdicao(item)
          )
          .filter(
            (atleta): atleta is AtletaDaApi =>
              atleta !== null
          )
          .map((atleta) => ({
            id: atleta.id,

            nome:
              atleta.nome || 'Atleta sem nome',

            categoria:
              atleta.categoria || null,

            usuario: atleta.usuario
              ? {
                  email: atleta.usuario.email || '',
                  avatarUrl: atleta.usuario.avatarUrl || null,
                }
              : undefined,
          }));

      setAtletasDisponiveis(formatados);
    } catch (error) {
      console.error(
        'Erro ao carregar atletas disponíveis:',
        error
      );

      setAtletasDisponiveis([]);
    } finally {
      setCarregandoAtletas(false);
    }
  }


  /* ============================================================
     CARREGAR ATLETAS PARA EDIÇÃO

     Mostra atletas sem equipe e os atletas
     que já pertencem à equipe selecionada.
  ============================================================ */

  async function carregarAtletasDaEquipe(
    equipeId: number
  ) {
    try {
      setCarregandoAtletasEdicao(true);

      const token = obterToken();

      if (!token) {
        throw new Error(
          'Sessão não encontrada. Faça login novamente.'
        );
      }

      const resposta = await fetch(
        `${API_URL}/atletas`,
        {
          method: 'GET',

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const dados: unknown = await resposta
        .json()
        .catch(() => []);

      if (!resposta.ok) {
        throw new Error(
          pegarMensagemErro(
            dados,
            'Não foi possível carregar os atletas.'
          )
        );
      }

      const lista = extrairLista(
        dados,
        'atletas'
      );

      const atletasConvertidos = lista
        .map((item) =>
          converterAtletaParaEdicao(item)
        )
        .filter(
          (atleta): atleta is AtletaDaApi =>
            atleta !== null
        );

      const atletasPermitidos =
        atletasConvertidos.filter((atleta) => {
          const idEquipeAtleta = Number(
            atleta.equipeId ??
            atleta.equipe?.id ??
            0
          );

          return (
            idEquipeAtleta === 0 ||
            idEquipeAtleta === equipeId
          );
        });

      const atletasDaEquipe =
        atletasConvertidos.filter((atleta) => {
          const idEquipeAtleta = Number(
            atleta.equipeId ??
            atleta.equipe?.id ??
            0
          );

          return idEquipeAtleta === equipeId;
        });

      setAtletasParaEditar(
        atletasPermitidos.map((atleta) => ({
          id: atleta.id,
          nome: atleta.nome,
          categoria: atleta.categoria,
          usuario: atleta.usuario,
        }))
      );

      const idsAtuais = atletasDaEquipe.map(
        (atleta) => atleta.id
      );

      setEquipeEmEdicao((atual) => {
        if (
          !atual ||
          atual.id !== equipeId
        ) {
          return atual;
        }

        return {
          ...atual,

          atletas: idsAtuais.length,

          atletasIds: idsAtuais,

          atletasDetalhes:
            atletasDaEquipe.map((atleta) => ({
              id: atleta.id,
              nome: atleta.nome,
              categoria: atleta.categoria,
              usuario: atleta.usuario,
            })),
        };
      });
    } catch (error) {
      console.error(
        'Erro ao carregar atletas da equipe para edição:',
        error
      );

      setAtletasParaEditar([]);

      alert(
        error instanceof Error
          ? error.message
          : 'Erro ao carregar atletas da equipe.'
      );
    } finally {
      setCarregandoAtletasEdicao(false);
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
     ABRIR EQUIPE PELA BUSCA DO HEADER
  ============================================================ */

  useEffect(() => {
    const tela = searchParams.get('tela');
    const id = searchParams.get('id');

    if (
      tela !== 'perfil' ||
      !id ||
      carregando
    ) {
      return;
    }

    const idEquipe = Number(id);

    if (!Number.isFinite(idEquipe)) {
      console.warn(
        'ID de equipe inválido na URL:',
        id
      );

      return;
    }

    const equipeEncontrada = equipes.find(
      (equipe) =>
        Number(equipe.id) === idEquipe
    );

    if (equipeEncontrada) {
      setEquipeSelecionada(equipeEncontrada);
    } else {
      console.warn(
        'Equipe não encontrada para o ID informado:',
        idEquipe
      );
    }
  }, [
    searchParams,
    equipes,
    carregando,
  ]);


  /* ============================================================
     FILTRO DE EQUIPES
  ============================================================ */

  const equipesFiltradas =
    filtroAtivo === 'Todos'
      ? equipes
      : equipes.filter(
          (equipe) =>
            equipe.modalidade === filtroAtivo
        );


  /* ============================================================
     ADICIONAR EQUIPE
  ============================================================ */

  async function adicionarEquipe(
    dados: NovaEquipeData
  ) {
    try {
      const token = obterToken();

      if (!token) {
        alert(
          'Sessão não encontrada. Faça login novamente.'
        );

        return;
      }

      const dadosExtras =
        dados as NovaEquipeData & DadosExtrasNovaEquipe;

      const resposta = await fetch(
        `${API_URL}/equipes`,
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            nome: dados.nome.trim(),

            modalidade: dados.modalidade,

            categoria:
              dados.categoria || null,

            imagem: null,

            corEquipe:
              dados.cor || '#16A875',

            proximaPartida:
              dadosExtras.proximaPartida || null,

            atletasIds:
              dadosExtras.atletasIds || [],
          }),
        }
      );

      const respostaDados: unknown =
        await resposta
          .json()
          .catch(() => ({}));

      if (!resposta.ok) {
        throw new Error(
          pegarMensagemErro(
            respostaDados,
            'Erro ao criar equipe.'
          )
        );
      }

      setModalNovaEquipe(false);

      setFiltroAtivo('Todos');

      await Promise.all([
        carregarEquipes(),
        carregarAtletas(),
      ]);

      alert('Equipe criada com sucesso!');
    } catch (error) {
      console.error(
        'Erro ao criar equipe:',
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : 'Erro ao criar equipe.'
      );
    }
  }


  /* ============================================================
     CLICAR EM UMA EQUIPE
  ============================================================ */

  function clicarEquipe(equipe: Equipe) {
    if (modoEditar) {
      setEquipeSelecionada(null);

      setAtletasParaEditar([]);

      setEquipeEmEdicao({
        ...equipe,

        atletasIds:
          equipe.atletasIds || [],

        atletasDetalhes:
          equipe.atletasDetalhes || [],
      });

      void carregarAtletasDaEquipe(equipe.id);

      return;
    }

    setEquipeSelecionada(equipe);
  }


  /* ============================================================
     SALVAR EDIÇÃO
  ============================================================ */

  async function salvarEdicao(
    dados: EditarEquipeData
  ) {
    if (!equipeEmEdicao) {
      return;
    }

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

      const resposta = await fetch(
        `${API_URL}/equipes/${dados.id}`,
        {
          method: 'PUT',

          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            nome: dados.nome.trim(),

            modalidade: dados.modalidade,

            categoria:
              dados.categoria.trim() || null,

            corEquipe: dados.cor,

            proximaPartida:
              dados.proximaPartida
                ? new Date(
                    dados.proximaPartida
                  ).toISOString()
                : null,

            atletasIds: dados.atletasIds,

            imagem: dados.imagem || null,
          }),
        }
      );

      const respostaDados: unknown =
        await resposta
          .json()
          .catch(() => ({}));

      if (!resposta.ok) {
        throw new Error(
          pegarMensagemErro(
            respostaDados,
            'Erro ao editar equipe.'
          )
        );
      }

      setEquipeEmEdicao(null);

      setModoEditar(false);

      await Promise.all([
        carregarEquipes(),
        carregarAtletas(),
      ]);

      alert('Equipe atualizada com sucesso!');
    } catch (error) {
      console.error(
        'Erro ao editar equipe:',
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : 'Erro ao editar equipe.'
      );
    } finally {
      setSalvandoEdicao(false);
    }
  }


  /* ============================================================
     EXCLUIR EQUIPE
  ============================================================ */

  async function excluirEquipe() {
    if (!equipeEmEdicao) {
      return;
    }

    const confirmou = window.confirm(
      `Deseja realmente excluir a equipe "${equipeEmEdicao.nome}"?`
    );

    if (!confirmou) {
      return;
    }

    try {
      setSalvandoEdicao(true);

      const token = obterToken();

      if (!token) {
        alert('Sessão não encontrada.');
        return;
      }

      const resposta = await fetch(
        `${API_URL}/equipes/${equipeEmEdicao.id}`,
        {
          method: 'DELETE',

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const dados: unknown =
        await resposta
          .json()
          .catch(() => ({}));

      if (!resposta.ok) {
        throw new Error(
          pegarMensagemErro(
            dados,
            'Erro ao excluir equipe.'
          )
        );
      }

      setEquipeEmEdicao(null);

      setModoEditar(false);

      await Promise.all([
        carregarEquipes(),
        carregarAtletas(),
      ]);

      alert('Equipe excluída com sucesso!');
    } catch (error) {
      console.error(
        'Erro ao excluir equipe:',
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : 'Erro ao excluir equipe.'
      );
    } finally {
      setSalvandoEdicao(false);
    }
  }


  /* ============================================================
     VOLTAR DOS DETALHES
  ============================================================ */

  function voltarParaEquipes() {
    setEquipeSelecionada(null);
    setSearchParams({});
  }


  /* ============================================================
     DETALHES DA EQUIPE
  ============================================================ */

  if (equipeSelecionada) {
    return (
      <DetalhesEquipe
        equipe={equipeSelecionada}
        onBack={voltarParaEquipes}
      />
    );
  }


  /* ============================================================
     RENDERIZAÇÃO
  ============================================================ */

  return (
    <>
      <main className={styles.page}>

        {/* CABEÇALHO */}

        <div className={styles.header}>
          <div className={styles.headerText}>
            <h1 className={styles.title}>
              Minhas <em>equipes.</em>
            </h1>

            <p className={styles.description}>
              Gerencie seus times,
              acompanhe métricas de
              performance e organize
              seu portfólio de atletas
              em um só lugar.
            </p>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <button
              type="button"
              className={styles.newTeamButton}
              onClick={() => {
                setModoEditar((valor) => !valor);
                setEquipeEmEdicao(null);
              }}
            >
              <Pencil size={17} />

              {modoEditar
                ? 'Cancelar edição'
                : 'Editar equipe'}
            </button>

            <button
              type="button"
              className={styles.newTeamButton}
              disabled={carregandoAtletas}
              onClick={() =>
                setModalNovaEquipe(true)
              }
            >
              <span className={styles.plus}>
                +
              </span>

              {carregandoAtletas
                ? 'Carregando...'
                : 'Nova Equipe'}
            </button>
          </div>
        </div>


        {/* AVISO DO MODO DE EDIÇÃO */}

        {modoEditar && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '16px',
              padding: '10px 14px',
              borderRadius: '9px',
              background: 'rgba(255,255,255,.12)',
              color: '#ffffff',
              fontSize: '12px',
            }}
          >
            <Pencil size={15} />

            Clique na equipe que deseja editar.
          </div>
        )}


        {/* FILTROS */}

        <div className={styles.filters}>
          {[
            ['Todos', '⚽'],
            ['Futebol', '⚽'],
            ['Basquete', '🏀'],
            ['Vôlei', '🏐'],
            ['Rugby', '🏉'],
            ['Tênis', '🎾'],
          ].map(([nome, icone]) => (
            <button
              key={nome}
              type="button"
              className={`${styles.filterButton} ${
                filtroAtivo === nome
                  ? styles.active
                  : ''
              }`}
              onClick={() =>
                setFiltroAtivo(nome as Modalidade)
              }
            >
              <span className={styles.filterIcon}>
                {icone}
              </span>

              {nome}
            </button>
          ))}
        </div>


        {/* CARREGAMENTO */}

        {carregando && (
          <div
            style={{
              padding: '50px 20px',
              textAlign: 'center',
              color: '#ffffff',
            }}
          >
            Carregando equipes...
          </div>
        )}


        {/* LISTA DE EQUIPES */}

        {!carregando && (
          <div className={styles.teamsGrid}>
            {equipesFiltradas.map((equipe) => (
              <div
                key={equipe.id}
                className={styles.teamClickable}
                role="button"
                tabIndex={0}
                onClick={() =>
                  clicarEquipe(equipe)
                }
                onKeyDown={(event) => {
                  if (
                    event.key === 'Enter' ||
                    event.key === ' '
                  ) {
                    event.preventDefault();
                    clicarEquipe(equipe);
                  }
                }}
              >
                <CardEquipe
                  nome={equipe.nome}
                  modalidade={equipe.modalidade}
                  categoria={equipe.categoria}
                  atletas={equipe.atletas}
                  imagem={equipe.imagem}
                  icone={equipe.icone}
                  cor={equipe.cor}
                  vitorias={equipe.vitorias}
                  empates={equipe.empates}
                  derrotas={equipe.derrotas}
                  proximaPartida={equipe.proximaPartida}
                />
              </div>
            ))}
          </div>
        )}


        {/* NENHUMA EQUIPE */}

        {!carregando &&
          equipesFiltradas.length === 0 && (
            <div
              style={{
                padding: '50px 20px',
                textAlign: 'center',
                color: '#ffffff',
              }}
            >
              <h3>
                Nenhuma equipe encontrada.
              </h3>

              <p>
                Cadastre uma nova equipe para começar.
              </p>
            </div>
          )}
      </main>


      {/* MODAL DE CRIAÇÃO */}

      <NovaEquipeModal
        open={modalNovaEquipe}
        modalidadeInicial={
          filtroAtivo === 'Todos'
            ? 'Futebol'
            : filtroAtivo
        }
        atletasDisponiveis={atletasDisponiveis}
        onClose={() =>
          setModalNovaEquipe(false)
        }
        onCreate={adicionarEquipe}
      />


      {/* MODAL DE EDIÇÃO */}

      <EditarEquipeModal
        open={Boolean(equipeEmEdicao)}
        equipe={equipeEmEdicao}
        atletasDisponiveis={atletasParaEditar}
        salvando={
          salvandoEdicao ||
          carregandoAtletasEdicao
        }
        onClose={() =>
          setEquipeEmEdicao(null)
        }
        onSave={salvarEdicao}
        onDelete={excluirEquipe}
      />
    </>
  );
};


export default Equipes;