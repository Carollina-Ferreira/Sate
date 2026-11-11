
import {
  Bell,
  CalendarClock,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  ClipboardCheck,
  LogOut,
  MapPin,
  Megaphone,
  Moon,
  Search,
  Settings,
  Star,
  Sun,
  UserRound,
  Users,
} from 'lucide-react';

import type { ReactNode } from 'react';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import styles from './header.module.css';
import LoadingState from '../../components/ui/LoadingState/LoadingState';

// ============================================================
// INTERFACES
// ============================================================

interface HeaderProps {
  title: string;
  onProfile?: () => void;
  onSettings?: () => void;
  onHelp?: () => void;
  onLogout?: () => void;
  onViewAllAthletes?: () => void;
  onViewAllTeams?: () => void;
  onViewAllMatches?: () => void;
}

export interface SearchItem {
  id: number;
  type: 'atleta' | 'equipe' | 'partida';
  title: string;
  subtitle: string;
  initials?: string;
}

interface NotificationItem {
  id: number;
  type: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  link?: string | null;
}

interface Usuario {
  id?: number;
  nome?: string;
  email?: string;
  tipo?: string;
  avatarUrl?: string | null;
}

interface AtletaAPI {
  id: number;
  nome?: string | null;
  categoria?: string | null;
  usuario?: {
    nome?: string | null;
    avatarUrl?: string | null;
  } | null;
  equipe?: {
    nome?: string | null;
  } | null;
}

interface EquipeAPI {
  id: number;
  nome?: string | null;
  modalidade?: string | null;
  categoria?: string | null;
  numeroAtletas?: number;
  _count?: {
    atletas?: number;
  };
  atletas?: unknown[];
}

interface PartidaAPI {
  id: number;
  adversario?: string | null;
  data?: string | null;
  status?: string | null;
  golsEquipe?: number | null;
  golsAdversario?: number | null;
  equipe?: {
    id?: number;
    nome?: string | null;
    modalidade?: string | null;
    categoria?: string | null;
  } | null;
}

interface NotificacoesResponse {
  notificacoes?: NotificationItem[];
  naoLidas?: number;
  total?: number;
  mensagem?: string;
}

type OpenPanel = 'search' | 'notifications' | 'user' | null;
type Theme = 'light' | 'dark';

const API_URL = 'http://localhost:3000';
const LIMITE_RESULTADOS = 3;

// ============================================================
// FUNÇÕES AUXILIARES
// ============================================================

function obterToken() {
  return (
    localStorage.getItem('token') ||
    sessionStorage.getItem('token') ||
    localStorage.getItem('accessToken') ||
    sessionStorage.getItem('accessToken')
  );
}

function normalizarTexto(texto: string) {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('pt-BR')
    .trim();
}

function obterIniciais(nome: string) {
  return nome
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0])
    .join('')
    .toUpperCase();
}

function formatarDataPartida(data?: string | null) {
  if (!data) return 'Data não informada';

  const dataConvertida = new Date(data);

  if (Number.isNaN(dataConvertida.getTime())) {
    return 'Data não informada';
  }

  return dataConvertida.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

function formatarStatus(status?: string | null) {
  if (!status) return 'Status não informado';

  const statusMap: Record<string, string> = {
    AGENDADA: 'Agendada',
    EM_ANDAMENTO: 'Em andamento',
    FINALIZADA: 'Finalizada',
    CANCELADA: 'Cancelada',
  };

  return statusMap[status] || status;
}

function formatarTempoNotificacao(dataString?: string | null) {
  if (!dataString) return '';

  const data = new Date(dataString);

  if (Number.isNaN(data.getTime())) {
    return '';
  }

  const diferenca = Date.now() - data.getTime();

  if (diferenca < 60_000) {
    return 'Agora';
  }

  if (diferenca < 3_600_000) {
    return `Há ${Math.floor(diferenca / 60_000)} min`;
  }

  if (diferenca < 86_400_000) {
    return `Há ${Math.floor(diferenca / 3_600_000)} h`;
  }

  return data.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
  });
}

// ============================================================
// DESTACAR INFORMAÇÕES IMPORTANTES DAS NOTIFICAÇÕES
// ============================================================

function formatarDescricaoNotificacao(descricao: string) {
  const padraoDestaque =
    /[A-ZÀ-ÖØ-Þ][\p{L}\p{N}'’.-]*(?:\s+(?:(?:de|da|do|das|dos)\s+)?[A-ZÀ-ÖØ-Þ][\p{L}\p{N}'’.-]*){0,3}\s+x\s+[A-ZÀ-ÖØ-Þ][\p{L}\p{N}'’.-]*(?:\s+(?:(?:de|da|do|das|dos)\s+)?[A-ZÀ-ÖØ-Þ][\p{L}\p{N}'’.-]*){0,3}|\bmais\s+\d+\s+(?:partidas?|cadastros?|atletas?|equipes?|jogos?)\b|\b\d+\s+(?:partidas?|cadastros?|atletas?|equipes?|jogos?|pendências?|notificações?)\b|\b\d{1,2}\/\d{1,2}\/\d{2,4}\b|\b\d{4}-\d{2}-\d{2}\b|\b\d{1,2}h(?:\d{2})?\b|\b\d{1,2}:\d{2}\b/gu;

  const partes: ReactNode[] = [];
  let ultimoIndice = 0;
  let indiceDestaque = 0;

  for (const correspondencia of descricao.matchAll(padraoDestaque)) {
    const textoEncontrado = correspondencia[0];
    const inicio = correspondencia.index ?? 0;

    if (inicio > ultimoIndice) {
      partes.push(descricao.slice(ultimoIndice, inicio));
    }

    partes.push(
      <strong key={`destaque-${indiceDestaque}`}>
        {textoEncontrado}
      </strong>,
    );

    ultimoIndice = inicio + textoEncontrado.length;
    indiceDestaque += 1;
  }

  if (ultimoIndice < descricao.length) {
    partes.push(descricao.slice(ultimoIndice));
  }

  return partes.length > 0 ? partes : descricao;
}

// ============================================================
// EXTRAIR LISTAS DA API
// ============================================================

function extrairLista<T>(dados: unknown, chaves: string[]): T[] {
  if (Array.isArray(dados)) {
    return dados as T[];
  }

  if (!dados || typeof dados !== 'object') {
    return [];
  }

  const objeto = dados as Record<string, unknown>;

  for (const chave of chaves) {
    const valor = objeto[chave];

    if (Array.isArray(valor)) {
      return valor as T[];
    }

    if (valor && typeof valor === 'object') {
      const lista = extrairLista<T>(valor, chaves);

      if (lista.length > 0) {
        return lista;
      }
    }
  }

  return [];
}

// ============================================================
// BUSCAR ENDPOINT
// ============================================================

async function buscarEndpoint<T>(
  endpoint: string,
  token: string,
  chaves: string[],
): Promise<T[]> {
  const resposta = await fetch(`${API_URL}${endpoint}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const texto = await resposta.text();

  console.log(`[SATE] ${endpoint} - Status:`, resposta.status);
  console.log(`[SATE] ${endpoint} - Resposta:`, texto);

  if (!resposta.ok) {
    throw new Error(`Erro ${resposta.status} em ${endpoint}: ${texto}`);
  }

  let dados: unknown;

  try {
    dados = JSON.parse(texto);
  } catch {
    throw new Error(`Resposta inválida em ${endpoint}.`);
  }

  const lista = extrairLista<T>(dados, chaves);
  console.log(`[SATE] ${endpoint} - Quantidade encontrada:`, lista.length);

  return lista;
}

// ============================================================
// HEADER
// ============================================================

const Header = ({
  title,
  onProfile,
  onSettings,
  onHelp,
  onLogout,
  onViewAllAthletes,
  onViewAllTeams,
  onViewAllMatches,
}: HeaderProps) => {
  const navigate = useNavigate();
  const headerRef = useRef<HTMLElement>(null);

  const [openPanel, setOpenPanel] = useState<OpenPanel>(null);
  const [searchValue, setSearchValue] = useState('');
  const [searchData, setSearchData] = useState<SearchItem[]>([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [searchError, setSearchError] = useState('');

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [notificationError, setNotificationError] = useState('');
  const [processingNotificationId, setProcessingNotificationId] =
    useState<number | null>(null);

  const [usuario, setUsuario] = useState<Usuario | null>(null);

  // MODAL DE SAÍDA
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  // ============================================================
  // TEMA
  // ============================================================

  const [theme, setTheme] = useState<Theme>(() => {
    try {
      return localStorage.getItem('sate-theme') === 'dark' ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;

    try {
      localStorage.setItem('sate-theme', theme);
    } catch (error) {
      console.error('Erro ao salvar tema:', error);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'));
  };

  // ============================================================
  // CARREGAR NOTIFICAÇÕES DO BACKEND
  // ============================================================

  const carregarNotificacoes = useCallback(async () => {
    const token = obterToken();

    if (!token) {
      setNotifications([]);
      setNotificationError('Faça login para visualizar as notificações.');
      return;
    }

    setLoadingNotifications(true);
    setNotificationError('');

    try {
      const resposta = await fetch(`${API_URL}/api/notificacoes`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      let dados: NotificacoesResponse;

      try {
        dados = await resposta.json();
      } catch {
        throw new Error('O servidor retornou uma resposta inválida.');
      }

      if (!resposta.ok) {
        throw new Error(dados.mensagem || 'Erro ao carregar notificações.');
      }

      setNotifications(
        Array.isArray(dados.notificacoes) ? dados.notificacoes : [],
      );

      console.log(
        '[SATE] Notificações carregadas:',
        dados.notificacoes?.length || 0,
      );
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
      setNotificationError(
        error instanceof Error
          ? error.message
          : 'Não foi possível carregar as notificações.',
      );
    } finally {
      setLoadingNotifications(false);
    }
  }, []);

  useEffect(() => {
    void carregarNotificacoes();
  }, [carregarNotificacoes]);

  // ============================================================
  // MARCAR NOTIFICAÇÃO COMO LIDA
  // ============================================================

  const handleNotificationClick = async (notification: NotificationItem) => {
    const token = obterToken();

    if (!token) {
      setNotificationError('Faça login novamente.');
      return;
    }

    if (processingNotificationId === notification.id) {
      return;
    }

    setProcessingNotificationId(notification.id);
    setNotificationError('');

    try {
      if (!notification.read) {
        const resposta = await fetch(
          `${API_URL}/api/notificacoes/${notification.id}/lida`,
          {
            method: 'PATCH',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          },
        );

        let dados: { mensagem?: string };

        try {
          dados = await resposta.json();
        } catch {
          throw new Error('Resposta inválida ao atualizar notificação.');
        }

        if (!resposta.ok) {
          throw new Error(
            dados.mensagem || 'Não foi possível marcar como lida.',
          );
        }
      }

      setNotifications((current) =>
        current.map((item) =>
          item.id === notification.id ? { ...item, read: true } : item,
        ),
      );

      setOpenPanel(null);

      if (notification.link) {
        navigate(notification.link);
      }
    } catch (error) {
      console.error('Erro ao atualizar notificação:', error);
      setNotificationError(
        error instanceof Error
          ? error.message
          : 'Não foi possível atualizar a notificação.',
      );
    } finally {
      setProcessingNotificationId(null);
    }
  };

  // ============================================================
  // CARREGAR USUÁRIO
  // ============================================================

  useEffect(() => {
    let ativo = true;

    const carregarUsuario = async () => {
      const token = obterToken();
      const usuarioSalvo =
        localStorage.getItem('usuario') || sessionStorage.getItem('usuario');

      if (usuarioSalvo) {
        try {
          if (ativo) {
            setUsuario(JSON.parse(usuarioSalvo) as Usuario);
          }
        } catch {
          if (ativo) setUsuario(null);
        }
      }

      if (!token) return;

      try {
        const resposta = await fetch(`${API_URL}/api/usuarios/perfil`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!resposta.ok) return;

        const dados = await resposta.json();
        const usuarioAtualizado = (dados.usuario || dados) as Usuario;

        if (!usuarioAtualizado || !ativo) return;

        setUsuario(usuarioAtualizado);

        const estaNoLocalStorage = localStorage.getItem('usuario') !== null;

        if (estaNoLocalStorage) {
          localStorage.setItem('usuario', JSON.stringify(usuarioAtualizado));
        } else {
          sessionStorage.setItem('usuario', JSON.stringify(usuarioAtualizado));
        }
      } catch (error) {
        console.error('Erro ao carregar usuário:', error);
      }
    };

    void carregarUsuario();

    return () => {
      ativo = false;
    };
  }, []);

  const nomeUsuario = usuario?.nome || 'Treinador';
  const iniciais = obterIniciais(nomeUsuario);

  const avatarUrl = usuario?.avatarUrl
    ? usuario.avatarUrl.startsWith('http')
      ? usuario.avatarUrl
      : `${API_URL}${usuario.avatarUrl}`
    : null;

  // ============================================================
  // CARREGAR DADOS DA PESQUISA
  // ============================================================

  useEffect(() => {
    let ativo = true;

    const carregarDadosPesquisa = async () => {
      const token = obterToken();

      if (!token) {
        setSearchData([]);
        setSearchError('Faça login para pesquisar.');
        return;
      }

      setLoadingSearch(true);
      setSearchError('');

      const resultados = await Promise.allSettled([
        buscarEndpoint<AtletaAPI>('/api/atletas', token, [
          'atletas',
          'data',
          'resultados',
          'items',
        ]),
        buscarEndpoint<EquipeAPI>('/api/equipes', token, [
          'equipes',
          'data',
          'resultados',
          'items',
        ]),
        buscarEndpoint<PartidaAPI>('/api/partidas', token, [
          'partidas',
          'data',
          'resultados',
          'items',
        ]),
      ]);

      if (!ativo) return;

      const dadosPesquisa: SearchItem[] = [];
      const falhas: string[] = [];

      const resultadoAtletas = resultados[0];

      if (resultadoAtletas.status === 'fulfilled') {
        resultadoAtletas.value.forEach((atleta) => {
          const nome = atleta.nome || atleta.usuario?.nome || 'Atleta sem nome';

          dadosPesquisa.push({
            id: Number(atleta.id),
            type: 'atleta',
            title: nome,
            subtitle:
              atleta.equipe?.nome ||
              atleta.categoria ||
              'Sem equipe cadastrada',
            initials: obterIniciais(nome),
          });
        });
      } else {
        console.error('Erro ao carregar atletas:', resultadoAtletas.reason);
        falhas.push('atletas');
      }

      const resultadoEquipes = resultados[1];

      if (resultadoEquipes.status === 'fulfilled') {
        resultadoEquipes.value.forEach((equipe) => {
          const nome = equipe.nome || 'Equipe sem nome';
          const detalhes = [equipe.modalidade, equipe.categoria].filter(Boolean);
          const quantidade =
            equipe.numeroAtletas ??
            equipe._count?.atletas ??
            equipe.atletas?.length ??
            0;

          dadosPesquisa.push({
            id: Number(equipe.id),
            type: 'equipe',
            title: nome,
            subtitle: detalhes.join(' • ') || `${quantidade} atletas`,
          });
        });
      } else {
        console.error('Erro ao carregar equipes:', resultadoEquipes.reason);
        falhas.push('equipes');
      }

      const resultadoPartidas = resultados[2];

      if (resultadoPartidas.status === 'fulfilled') {
        resultadoPartidas.value.forEach((partida) => {
          const nomeEquipe = partida.equipe?.nome || 'Equipe';
          const adversario = partida.adversario || 'Adversário não informado';

          dadosPesquisa.push({
            id: Number(partida.id),
            type: 'partida',
            title: `${nomeEquipe} x ${adversario}`,
            subtitle: [
              formatarDataPartida(partida.data),
              formatarStatus(partida.status),
            ].join(' • '),
          });
        });
      } else {
        console.error('Erro ao carregar partidas:', resultadoPartidas.reason);
        falhas.push('partidas');
      }

      if (!ativo) return;

      setSearchData(dadosPesquisa);

      if (falhas.length === 3) {
        setSearchError(
          'Não foi possível carregar os dados. Verifique a conexão com o servidor.',
        );
      } else if (falhas.length > 0) {
        setSearchError(`Não foi possível carregar: ${falhas.join(', ')}.`);
      } else {
        setSearchError('');
      }

      setLoadingSearch(false);
    };

    void carregarDadosPesquisa();

    return () => {
      ativo = false;
    };
  }, []);

  // ============================================================
  // NAVEGAÇÃO DOS RESULTADOS
  // ============================================================

  const handleSearchResult = (item: SearchItem) => {
    setOpenPanel(null);
    setSearchValue('');

    if (item.type === 'atleta') {
      navigate(`/atletas?tela=perfil&id=${item.id}`);
      return;
    }

    if (item.type === 'equipe') {
      navigate({
        pathname: '/equipes',
        search: `?tela=perfil&id=${encodeURIComponent(String(item.id))}`,
      });
      return;
    }

    if (item.type === 'partida') {
      navigate('/detalhes-partida', {
        state: {
          partidaId: item.id,
        },
      });
    }
  };

  // ============================================================
  // VER TODOS OS RESULTADOS DA PESQUISA
  // ============================================================

  const handleViewAll = (tipo: SearchItem['type']) => {
    const callbacks = {
      atleta: onViewAllAthletes,
      equipe: onViewAllTeams,
      partida: onViewAllMatches,
    };

    const callback = callbacks[tipo];

    setOpenPanel(null);
    setSearchValue('');

    if (callback) {
      callback();
      return;
    }

    const caminhos: Record<SearchItem['type'], string> = {
      atleta: '/atletas',
      equipe: '/equipes',
      partida: '/partidas',
    };

    navigate(caminhos[tipo]);
  };

  // ============================================================
  // SAIR
  // ============================================================

  // Abre a confirmação, sem encerrar a sessão imediatamente.
  const handleLogout = () => {
    setOpenPanel(null);
    setLogoutModalOpen(true);
  };

  // Executa a saída somente após confirmação.
  const confirmarLogout = () => {
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
    localStorage.removeItem('accessToken');

    sessionStorage.removeItem('usuario');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('accessToken');

    setNotifications([]);
    setSearchData([]);
    setOpenPanel(null);
    setLogoutModalOpen(false);

    onLogout?.();
    navigate('/', { replace: true });
  };

  // ============================================================
  // FECHAR PAINÉIS
  // ============================================================

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        headerRef.current &&
        !headerRef.current.contains(event.target as Node)
      ) {
        setOpenPanel(null);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenPanel(null);
        setLogoutModalOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  // ============================================================
  // FILTRAR PESQUISA
  // ============================================================

  const filteredSearch = useMemo(() => {
    const value = normalizarTexto(searchValue);

    if (!value) return searchData;

    return searchData.filter((item) => {
      const titulo = normalizarTexto(item.title);
      const subtitulo = normalizarTexto(item.subtitle);
      return titulo.includes(value) || subtitulo.includes(value);
    });
  }, [searchValue, searchData]);

  const athletes = filteredSearch.filter((item) => item.type === 'atleta');
  const teams = filteredSearch.filter((item) => item.type === 'equipe');
  const matches = filteredSearch.filter((item) => item.type === 'partida');

  // ============================================================
  // CONTADOR DE NOTIFICAÇÕES NÃO LIDAS
  // ============================================================

  const unreadNotifications = notifications.filter(
    (notification) => !notification.read,
  ).length;

  // ============================================================
  // ABRIR E FECHAR PAINÉIS
  // ============================================================

  const togglePanel = (panel: OpenPanel) => {
    setOpenPanel((current) => (current === panel ? null : panel));
  };

  const handleNotificationPanel = () => {
    const vaiAbrir = openPanel !== 'notifications';
    setOpenPanel(vaiAbrir ? 'notifications' : null);

    if (vaiAbrir) {
      void carregarNotificacoes();
    }
  };

  // ============================================================
  // RENDERIZAÇÃO
  // ============================================================

  return (
    <>
      <header ref={headerRef} className={styles.header}>
        <h1 className={styles.title}>{title}</h1>

        <div className={styles.right}>
          {/* PESQUISA */}
          <div className={styles.searchContainer}>
            <div
              className={styles.search}
              onClick={() => setOpenPanel('search')}
            >
              <Search size={18} strokeWidth={2} />
              <input
                type="text"
                value={searchValue}
                placeholder="Pesquisar atletas, equipes, partidas"
                aria-label="Pesquisar atletas, equipes e partidas"
                aria-expanded={openPanel === 'search'}
                onFocus={() => setOpenPanel('search')}
                onChange={(event) => {
                  setSearchValue(event.target.value);
                  setOpenPanel('search');
                }}
              />
            </div>

            {openPanel === 'search' && (
              <div className={styles.searchDropdown}>
                {loadingSearch ? (
                  <div className={styles.emptySearch}><LoadingState variant="inline" title="Carregando resultados..." /></div>
                ) : (
                  <>
                    {searchError && (
                      <div className={styles.emptySearch}>{searchError}</div>
                    )}

                    <SearchSection
                      title="Atletas"
                      items={athletes.slice(0, LIMITE_RESULTADOS)}
                      emptyMessage="Nenhum atleta encontrado."
                      onViewAll={() => handleViewAll('atleta')}
                      onItemClick={handleSearchResult}
                    />

                    <SearchSection
                      title="Equipes"
                      items={teams.slice(0, LIMITE_RESULTADOS)}
                      emptyMessage="Nenhuma equipe encontrada."
                      onViewAll={() => handleViewAll('equipe')}
                      onItemClick={handleSearchResult}
                    />

                    <SearchSection
                      title="Partidas"
                      items={matches.slice(0, LIMITE_RESULTADOS)}
                      emptyMessage="Nenhuma partida encontrada."
                      onViewAll={() => handleViewAll('partida')}
                      onItemClick={handleSearchResult}
                    />
                  </>
                )}
              </div>
            )}
          </div>

          {/* NOTIFICAÇÕES */}
          <div className={styles.notificationContainer}>
            <button
              className={styles.notification}
              type="button"
              aria-label="Notificações"
              aria-expanded={openPanel === 'notifications'}
              onClick={handleNotificationPanel}
            >
              <Bell size={20} strokeWidth={2} />

              {unreadNotifications > 0 && (
                <span className={styles.notificationBadge}>
                  {unreadNotifications > 99 ? '99+' : unreadNotifications}
                </span>
              )}
            </button>

            {openPanel === 'notifications' && (
              <div className={styles.notificationsDropdown}>
                <div className={styles.notificationHeader}>
                  <div className={styles.notificationTitleWrapper}>
                    <h2>Notificações</h2>
                    {unreadNotifications > 0 && (
                      <span className={styles.notificationCount}>
                        {unreadNotifications}
                      </span>
                    )}
                  </div>
                </div>

                <div className={styles.notificationList}>
                  {loadingNotifications && notifications.length === 0 ? (
                    <div className={styles.emptySearch}>
                      <LoadingState variant="inline" title="Carregando notificações..." />
                    </div>
                  ) : notificationError && notifications.length === 0 ? (
                    <div className={styles.emptySearch}>{notificationError}</div>
                  ) : notifications.length === 0 ? (
                    <div className={styles.emptySearch}>
                      Você não tem notificações no momento.
                    </div>
                  ) : (
                    <>
                      {notificationError && (
                        <div className={styles.emptySearch}>
                          {notificationError}
                        </div>
                      )}

                      {notifications.map((notification) => (
                        <button
                          type="button"
                          key={notification.id}
                          disabled={
                            processingNotificationId === notification.id
                          }
                          className={`${styles.notificationItem} ${!notification.read ? styles.notificationUnread : ''
                            }`}
                          onClick={() =>
                            void handleNotificationClick(notification)
                          }
                        >
                          <NotificationIcon type={notification.type} />

                          <div className={styles.notificationContent}>
                            <div className={styles.notificationTop}>
                              <strong>{notification.title}</strong>
                              <span>
                                {formatarTempoNotificacao(notification.time)}
                              </span>
                            </div>

                            <p>
                              {formatarDescricaoNotificacao(
                                notification.description,
                              )}
                            </p>
                          </div>

                          {!notification.read && (
                            <span className={styles.unreadDot} />
                          )}
                        </button>
                      ))}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* USUÁRIO */}
          <div className={styles.userContainer}>
            <button
              type="button"
              className={styles.user}
              aria-expanded={openPanel === 'user'}
              onClick={() => togglePanel('user')}
            >
              <div className={styles.avatar}>
                {avatarUrl ? (
                  <img src={avatarUrl} alt={`Foto de ${nomeUsuario}`} />
                ) : (
                  iniciais
                )}
              </div>

              <div className={styles.userInfo}>
                <span className={styles.userName}>{nomeUsuario}</span>
                <span className={styles.userRole}>Treinador</span>
              </div>

              <ChevronDown
                className={`${styles.userArrow} ${openPanel === 'user' ? styles.userArrowOpen : ''
                  }`}
                size={19}
              />
            </button>

            {openPanel === 'user' && (
              <div className={styles.userDropdown}>
                <div className={styles.userDropdownHeader}>
                  <div className={styles.dropdownAvatar}>
                    {avatarUrl ? (
                      <img src={avatarUrl} alt={`Foto de ${nomeUsuario}`} />
                    ) : (
                      iniciais
                    )}
                  </div>
                  <div>
                    <strong>{nomeUsuario}</strong>
                    <span>Treinador</span>
                  </div>
                </div>

                <div className={styles.userMenu}>
                  {/* TEMA */}
                  <button
                    type="button"
                    className={styles.userMenuItem}
                    onClick={toggleTheme}
                    role="switch"
                    aria-checked={theme === 'dark'}
                    aria-label={
                      theme === 'dark'
                        ? 'Desativar modo escuro'
                        : 'Ativar modo escuro'
                    }
                  >
                    {theme === 'dark' ? (
                      <Sun size={18} />
                    ) : (
                      <Moon size={18} />
                    )}

                    <span className={styles.themeLabel}>
                      {theme === 'dark' ? 'Modo claro' : 'Modo escuro'}
                    </span>

                    <span
                      className={`${styles.themeSwitch} ${theme === 'dark' ? styles.themeSwitchActive : ''
                        }`}
                      aria-hidden="true"
                    >
                      <span className={styles.themeSwitchKnob} />
                    </span>
                  </button>

                  {/* PERFIL */}
                  <button
                    type="button"
                    className={`${styles.userMenuItem} ${styles.userMenuActive}`}
                    onClick={() => {
                      onProfile?.();
                      setOpenPanel(null);
                    }}
                  >
                    <UserRound size={18} />
                    Meu Perfil
                  </button>

                  {/* CONFIGURAÇÕES */}
                  <button
                    type="button"
                    className={styles.userMenuItem}
                    onClick={() => {
                      if (onSettings) {
                        onSettings();
                      } else {
                        navigate('/configuracoes');
                      }
                      setOpenPanel(null);
                    }}
                  >
                    <Settings size={18} />
                    Configurações
                  </button>

                  {/* AJUDA */}
                  <button
                    type="button"
                    className={styles.userMenuItem}
                    onClick={() => {
                      if (onHelp) {
                        onHelp();
                      } else {
                        navigate('/ajuda');
                      }
                    }}
                  >
                    <CircleHelp size={18} />
                    Ajuda
                  </button>
                </div>

                <div className={styles.userMenuDivider} />

                {/* SAIR */}
                <button
                  type="button"
                  className={`${styles.userMenuItem} ${styles.logoutButton}`}
                  onClick={handleLogout}
                >
                  <LogOut size={18} />
                  Sair
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* MODAL DE CONFIRMAÇÃO DE SAÍDA */}
      {logoutModalOpen &&
        createPortal(
          <div
            className={styles.logoutModalOverlay}
            onClick={() => setLogoutModalOpen(false)}
          >
            <div
              className={styles.logoutModal}
              role="dialog"
              aria-modal="true"
              aria-labelledby="logout-modal-title"
              onClick={(event) => event.stopPropagation()}
            >
              <div className={styles.logoutModalIcon}>
                <LogOut size={24} />
              </div>

              <h2 id="logout-modal-title">
                Você realmente deseja sair?
              </h2>

              <p>
                Ao sair, você precisará entrar novamente para acessar sua conta.
              </p>

              <div className={styles.logoutModalButtons}>
                <button
                  type="button"
                  className={styles.logoutCancel}
                  onClick={() => setLogoutModalOpen(false)}
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  className={styles.logoutConfirm}
                  onClick={confirmarLogout}
                >
                  Sim, sair
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
};

// ============================================================
// SEÇÃO DA PESQUISA
// ============================================================

interface SearchSectionProps {
  title: string;
  items: SearchItem[];
  emptyMessage: string;
  onViewAll: () => void;
  onItemClick: (item: SearchItem) => void;
}

const SearchSection = ({
  title,
  items,
  emptyMessage,
  onViewAll,
  onItemClick,
}: SearchSectionProps) => {
  return (
    <section className={styles.searchSection}>
      <div className={styles.searchSectionHeader}>
        <strong>{title}</strong>
        <button type="button" onClick={onViewAll}>
          Ver todos
        </button>
      </div>

      <div className={styles.searchSectionItems}>
        {items.length > 0 ? (
          items.map((item) => (
            <button
              key={`${item.type}-${item.id}`}
              type="button"
              className={styles.searchResultItem}
              onClick={() => onItemClick(item)}
            >
              <SearchItemIcon item={item} />

              <div className={styles.searchResultText}>
                <strong>{item.title}</strong>
                <span>{item.subtitle}</span>
              </div>

              <ChevronRight
                size={19}
                className={styles.searchResultArrow}
              />
            </button>
          ))
        ) : (
          <div className={styles.emptySearch}>{emptyMessage}</div>
        )}
      </div>
    </section>
  );
};

// ============================================================
// ÍCONE DO RESULTADO DA PESQUISA
// ============================================================

interface SearchItemIconProps {
  item: SearchItem;
}

const SearchItemIcon = ({ item }: SearchItemIconProps) => {
  if (item.type === 'atleta') {
    return <div className={styles.searchAvatar}>{item.initials}</div>;
  }

  if (item.type === 'equipe') {
    return (
      <div className={styles.searchIconCircle}>
        <Users size={17} />
      </div>
    );
  }

  return (
    <div className={styles.searchIconCircle}>
      <CalendarDays size={17} />
    </div>
  );
};

// ============================================================
// ÍCONE DA NOTIFICAÇÃO
// ============================================================

interface NotificationIconProps {
  type: string;
}

const NotificationIcon = ({ type }: NotificationIconProps) => {
  if (
    type === 'cadastros_incompletos' ||
    type === 'cadastro_incompleto'
  ) {
    return (
      <div
        className={`${styles.notificationIcon} ${styles.notificationIconPink}`}
      >
        <Users size={16} />
      </div>
    );
  }

  if (type === 'atletas_sem_equipe') {
    return (
      <div
        className={`${styles.notificationIcon} ${styles.notificationIconPink}`}
      >
        <UserRound size={16} />
      </div>
    );
  }

  if (type === 'equipes_sem_atletas') {
    return (
      <div
        className={`${styles.notificationIcon} ${styles.notificationIconBlue}`}
      >
        <Users size={16} />
      </div>
    );
  }

  if (type === 'partida_proxima') {
    return (
      <div
        className={`${styles.notificationIcon} ${styles.notificationIconBlue}`}
      >
        <CalendarDays size={16} />
      </div>
    );
  }

  if (type === 'partidas_sem_escalacao') {
    return (
      <div
        className={`${styles.notificationIcon} ${styles.notificationIconBlue}`}
      >
        <ClipboardCheck size={16} />
      </div>
    );
  }

  if (type === 'partidas_sem_local') {
    return (
      <div
        className={`${styles.notificationIcon} ${styles.notificationIconBlue}`}
      >
        <MapPin size={16} />
      </div>
    );
  }

  if (type === 'partidas_pendentes_atrasadas') {
    return (
      <div
        className={`${styles.notificationIcon} ${styles.notificationIconRed}`}
      >
        <CalendarClock size={16} />
      </div>
    );
  }

  if (type === 'convocacao') {
    return (
      <div
        className={`${styles.notificationIcon} ${styles.notificationIconRed}`}
      >
        <Megaphone size={16} />
      </div>
    );
  }

  if (type === 'treino') {
    return (
      <div
        className={`${styles.notificationIcon} ${styles.notificationIconBlue}`}
      >
        <ClipboardCheck size={16} />
      </div>
    );
  }

  if (type === 'avaliacao') {
    return (
      <div
        className={`${styles.notificationIcon} ${styles.notificationIconPink}`}
      >
        <Star size={16} />
      </div>
    );
  }

  return (
    <div
      className={`${styles.notificationIcon} ${styles.notificationIconBlue}`}
    >
      <Bell size={16} />
    </div>
  );
};

export default Header;
