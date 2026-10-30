import {
  Bell,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  ClipboardCheck,
  LogOut,
  Megaphone,
  Moon,
  Search,
  Settings,
  Star,
  Sun,
  UserRound,
  Users,
} from 'lucide-react';

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { useNavigate } from 'react-router-dom';

import styles from './header.module.css';


interface HeaderProps {
  title: string;
  onProfile?: () => void;
  onSettings?: () => void;
  onHelp?: () => void;
  onLogout?: () => void;
  onViewAllNotifications?: () => void;
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
  type: 'convocacao' | 'treino' | 'avaliacao';
  title: string;
  description: string;
  time: string;
  read: boolean;
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


type OpenPanel = 'search' | 'notifications' | 'user' | null;
type Theme = 'light' | 'dark';


const API_URL = 'http://localhost:3000';
const LIMITE_RESULTADOS = 3;


const initialNotifications: NotificationItem[] = [
  {
    id: 1,
    type: 'convocacao',
    title: 'Nova Convocação',
    description: 'Você foi convocado para o jogo contra Poli Rugby',
    time: 'Hoje, 10:34',
    read: false,
  },
  {
    id: 2,
    type: 'treino',
    title: 'Treino Atualizado',
    description: 'O treino de amanhã foi atualizado pela comissão técnica',
    time: 'Hoje, 10:34',
    read: false,
  },
  {
    id: 3,
    type: 'avaliacao',
    title: 'Avaliação Disponível',
    description: 'Nova avaliação técnica disponível para o time',
    time: 'Hoje, 10:34',
    read: true,
  },
  {
    id: 4,
    type: 'convocacao',
    title: 'Partida Confirmada',
    description: 'A próxima partida da equipe foi confirmada',
    time: 'Ontem, 18:20',
    read: false,
  },
];


/* ============================================================
   FUNÇÕES AUXILIARES
============================================================ */

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


/* ============================================================
   EXTRAIR LISTAS DA API
============================================================ */

function extrairLista<T>(
  dados: unknown,
  chaves: string[],
): T[] {
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


/* ============================================================
   BUSCAR ENDPOINT
============================================================ */

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

  console.log(
    `[SATE] ${endpoint} - Status:`,
    resposta.status,
  );

  console.log(
    `[SATE] ${endpoint} - Resposta:`,
    texto,
  );

  if (!resposta.ok) {
    throw new Error(
      `Erro ${resposta.status} em ${endpoint}: ${texto}`,
    );
  }

  let dados: unknown;

  try {
    dados = JSON.parse(texto);
  } catch {
    throw new Error(`Resposta inválida em ${endpoint}.`);
  }

  const lista = extrairLista<T>(dados, chaves);

  console.log(
    `[SATE] ${endpoint} - Quantidade encontrada:`,
    lista.length,
  );

  return lista;
}


/* ============================================================
   HEADER
============================================================ */

const Header = ({
  title,
  onProfile,
  onSettings,
  onHelp,
  onLogout,
  onViewAllNotifications,
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

  const [notifications, setNotifications] =
    useState<NotificationItem[]>(initialNotifications);

  const [usuario, setUsuario] = useState<Usuario | null>(null);


  /* ============================================================
     TEMA
  ============================================================ */

  const [theme, setTheme] = useState<Theme>(() => {
    try {
      return localStorage.getItem('sate-theme') === 'dark'
        ? 'dark'
        : 'light';
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
    setTheme((current) =>
      current === 'dark' ? 'light' : 'dark',
    );
  };


  /* ============================================================
     CARREGAR USUÁRIO
  ============================================================ */

  useEffect(() => {
    let ativo = true;

    const carregarUsuario = async () => {
      const token = obterToken();

      const usuarioSalvo =
        localStorage.getItem('usuario') ||
        sessionStorage.getItem('usuario');

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
        const resposta = await fetch(
          `${API_URL}/api/usuarios/perfil`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!resposta.ok) return;

        const dados = await resposta.json();

        const usuarioAtualizado = (
          dados.usuario || dados
        ) as Usuario;

        if (!usuarioAtualizado || !ativo) return;

        setUsuario(usuarioAtualizado);

        const estaNoLocalStorage =
          localStorage.getItem('usuario') !== null;

        if (estaNoLocalStorage) {
          localStorage.setItem(
            'usuario',
            JSON.stringify(usuarioAtualizado),
          );
        } else {
          sessionStorage.setItem(
            'usuario',
            JSON.stringify(usuarioAtualizado),
          );
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


  /* ============================================================
     CARREGAR DADOS DA PESQUISA
  ============================================================ */

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
        buscarEndpoint<AtletaAPI>(
          '/api/atletas',
          token,
          ['atletas', 'data', 'resultados', 'items'],
        ),

        buscarEndpoint<EquipeAPI>(
          '/api/equipes',
          token,
          ['equipes', 'data', 'resultados', 'items'],
        ),

        buscarEndpoint<PartidaAPI>(
          '/api/partidas',
          token,
          ['partidas', 'data', 'resultados', 'items'],
        ),
      ]);

      if (!ativo) return;

      const dadosPesquisa: SearchItem[] = [];
      const falhas: string[] = [];


      // ATLETAS

      const resultadoAtletas = resultados[0];

      if (resultadoAtletas.status === 'fulfilled') {
        resultadoAtletas.value.forEach((atleta) => {
          const nome =
            atleta.nome ||
            atleta.usuario?.nome ||
            'Atleta sem nome';

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
        console.error(
          'Erro ao carregar atletas:',
          resultadoAtletas.reason,
        );

        falhas.push('atletas');
      }


      // EQUIPES

      const resultadoEquipes = resultados[1];

      if (resultadoEquipes.status === 'fulfilled') {
        resultadoEquipes.value.forEach((equipe) => {
          const nome = equipe.nome || 'Equipe sem nome';

          const detalhes = [
            equipe.modalidade,
            equipe.categoria,
          ].filter(Boolean);

          const quantidade =
            equipe.numeroAtletas ??
            equipe._count?.atletas ??
            equipe.atletas?.length ??
            0;

          dadosPesquisa.push({
            id: Number(equipe.id),
            type: 'equipe',
            title: nome,

            subtitle:
              detalhes.join(' • ') ||
              `${quantidade} atletas`,
          });
        });
      } else {
        console.error(
          'Erro ao carregar equipes:',
          resultadoEquipes.reason,
        );

        falhas.push('equipes');
      }


      // PARTIDAS

      const resultadoPartidas = resultados[2];

      if (resultadoPartidas.status === 'fulfilled') {
        resultadoPartidas.value.forEach((partida) => {
          const nomeEquipe =
            partida.equipe?.nome || 'Equipe';

          const adversario =
            partida.adversario || 'Adversário não informado';

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
        console.error(
          'Erro ao carregar partidas:',
          resultadoPartidas.reason,
        );

        falhas.push('partidas');
      }

      if (!ativo) return;

      setSearchData(dadosPesquisa);

      if (falhas.length === 3) {
        setSearchError(
          'Não foi possível carregar os dados. Verifique a conexão com o servidor.',
        );
      } else if (falhas.length > 0) {
        setSearchError(
          `Não foi possível carregar: ${falhas.join(', ')}.`,
        );
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


  /* ============================================================
     NAVEGAÇÃO DOS RESULTADOS
  ============================================================ */

  const handleSearchResult = (item: SearchItem) => {
    setOpenPanel(null);
    setSearchValue('');

    // ATLETA

    if (item.type === 'atleta') {
      navigate(
        `/atletas?tela=perfil&id=${item.id}`,
      );

      return;
    }


    // EQUIPE
    // A página Equipes lê os parâmetros tela e id
    // e abre os detalhes da equipe correspondente.

    if (item.type === 'equipe') {
      navigate({
        pathname: '/equipes',
        search: `?tela=perfil&id=${encodeURIComponent(
          String(item.id),
        )}`,
      });

      return;
    }


    // PARTIDA

    if (item.type === 'partida') {
      navigate('/detalhes-partida', {
        state: {
          partidaId: item.id,
        },
      });
    }
  };


  /* ============================================================
     VER TODOS
  ============================================================ */

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


  /* ============================================================
     SAIR
  ============================================================ */

  const handleLogout = () => {
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
    localStorage.removeItem('accessToken');

    sessionStorage.removeItem('usuario');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('accessToken');

    setOpenPanel(null);
    onLogout?.();
    navigate('/');
  };


  /* ============================================================
     FECHAR PAINÉIS
  ============================================================ */

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
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener(
        'mousedown',
        handleOutsideClick,
      );

      document.removeEventListener(
        'keydown',
        handleEscape,
      );
    };
  }, []);


  /* ============================================================
     FILTRAR PESQUISA
  ============================================================ */

  const filteredSearch = useMemo(() => {
    const value = normalizarTexto(searchValue);

    if (!value) return searchData;

    return searchData.filter((item) => {
      const titulo = normalizarTexto(item.title);
      const subtitulo = normalizarTexto(item.subtitle);

      return (
        titulo.includes(value) ||
        subtitulo.includes(value)
      );
    });
  }, [searchValue, searchData]);


  const athletes = filteredSearch.filter(
    (item) => item.type === 'atleta',
  );

  const teams = filteredSearch.filter(
    (item) => item.type === 'equipe',
  );

  const matches = filteredSearch.filter(
    (item) => item.type === 'partida',
  );


  /* ============================================================
     NOTIFICAÇÕES
  ============================================================ */

  const unreadNotifications = notifications.filter(
    (notification) => !notification.read,
  ).length;


  const handleNotificationClick = (id: number) => {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id
          ? { ...notification, read: true }
          : notification,
      ),
    );
  };


  const togglePanel = (panel: OpenPanel) => {
    setOpenPanel((current) =>
      current === panel ? null : panel,
    );
  };


  /* ============================================================
     RENDERIZAÇÃO
  ============================================================ */

  return (
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
                <div className={styles.emptySearch}>
                  Carregando resultados...
                </div>
              ) : (
                <>
                  {searchError && (
                    <div className={styles.emptySearch}>
                      {searchError}
                    </div>
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
            onClick={() => togglePanel('notifications')}
          >
            <Bell size={20} strokeWidth={2} />

            {unreadNotifications > 0 && (
              <span className={styles.notificationBadge}>
                {unreadNotifications}
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

                <button
                  type="button"
                  className={styles.viewAll}
                  onClick={() => {
                    onViewAllNotifications?.();
                    setOpenPanel(null);
                  }}
                >
                  Ver todas
                </button>
              </div>

              <div className={styles.notificationList}>
                {notifications.map((notification) => (
                  <button
                    type="button"
                    key={notification.id}
                    className={`${styles.notificationItem} ${
                      !notification.read
                        ? styles.notificationUnread
                        : ''
                    }`}
                    onClick={() =>
                      handleNotificationClick(notification.id)
                    }
                  >
                    <NotificationIcon type={notification.type} />

                    <div className={styles.notificationContent}>
                      <div className={styles.notificationTop}>
                        <strong>{notification.title}</strong>
                        <span>{notification.time}</span>
                      </div>

                      <p>{notification.description}</p>
                    </div>

                    {!notification.read && (
                      <span className={styles.unreadDot} />
                    )}
                  </button>
                ))}
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
                <img
                  src={avatarUrl}
                  alt={`Foto de ${nomeUsuario}`}
                />
              ) : (
                iniciais
              )}
            </div>

            <div className={styles.userInfo}>
              <span className={styles.userName}>
                {nomeUsuario}
              </span>

              <span className={styles.userRole}>
                Treinador
              </span>
            </div>

            <ChevronDown
              className={`${styles.userArrow} ${
                openPanel === 'user'
                  ? styles.userArrowOpen
                  : ''
              }`}
              size={19}
            />
          </button>

          {openPanel === 'user' && (
            <div className={styles.userDropdown}>
              <div className={styles.userDropdownHeader}>
                <div className={styles.dropdownAvatar}>
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={`Foto de ${nomeUsuario}`}
                    />
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
                    {theme === 'dark'
                      ? 'Modo claro'
                      : 'Modo escuro'}
                  </span>

                  <span
                    className={`${styles.themeSwitch} ${
                      theme === 'dark'
                        ? styles.themeSwitchActive
                        : ''
                    }`}
                    aria-hidden="true"
                  >
                    <span className={styles.themeSwitchKnob} />
                  </span>
                </button>

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

                <button
                  type="button"
                  className={styles.userMenuItem}
                  onClick={() => {
                    onHelp?.();
                    setOpenPanel(null);
                  }}
                >
                  <CircleHelp size={18} />
                  Ajuda
                </button>
              </div>

              <div className={styles.userMenuDivider} />

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
  );
};


/* ============================================================
   SEÇÃO DA PESQUISA
============================================================ */

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

        <button
          type="button"
          onClick={onViewAll}
        >
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
          <div className={styles.emptySearch}>
            {emptyMessage}
          </div>
        )}
      </div>
    </section>
  );
};


/* ============================================================
   ÍCONE DO RESULTADO
============================================================ */

interface SearchItemIconProps {
  item: SearchItem;
}


const SearchItemIcon = ({ item }: SearchItemIconProps) => {
  if (item.type === 'atleta') {
    return (
      <div className={styles.searchAvatar}>
        {item.initials}
      </div>
    );
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


/* ============================================================
   ÍCONE DA NOTIFICAÇÃO
============================================================ */

interface NotificationIconProps {
  type: NotificationItem['type'];
}


const NotificationIcon = ({
  type,
}: NotificationIconProps) => {
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

  return (
    <div
      className={`${styles.notificationIcon} ${styles.notificationIconPink}`}
    >
      <Star size={16} />
    </div>
  );
};


export default Header;