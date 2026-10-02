import {
  Bell,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  ClipboardCheck,
  LogOut,
  Megaphone,
  Search,
  Settings,
  Star,
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

  onSearchResult?: (item: SearchItem) => void;
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

type OpenPanel =
  | 'search'
  | 'notifications'
  | 'user'
  | null;

/* =====================================
   API
===================================== */

const API_URL = 'http://localhost:3000';

/* =====================================
   DADOS MOCKADOS - PESQUISA
===================================== */

const searchData: SearchItem[] = [
  {
    id: 1,
    type: 'atleta',
    title: 'Marcelo Ferreira',
    subtitle: 'Poli Rugby',
    initials: 'MF',
  },
  {
    id: 2,
    type: 'atleta',
    title: 'Marcelo Ferreira',
    subtitle: 'Poli Rugby',
    initials: 'MF',
  },
  {
    id: 3,
    type: 'equipe',
    title: 'Poli Rugby',
    subtitle: 'Rugby Sub-17',
  },
  {
    id: 4,
    type: 'partida',
    title: 'Poli x Jacareí',
    subtitle: '12/08/2026',
  },
];

/* =====================================
   DADOS MOCKADOS - NOTIFICAÇÕES
===================================== */

const initialNotifications: NotificationItem[] = [
  {
    id: 1,
    type: 'convocacao',
    title: 'Nova Convocação',
    description:
      'Você foi convocado para o jogo contra Poli Rugby',
    time: 'Hoje, 10:34',
    read: false,
  },
  {
    id: 2,
    type: 'treino',
    title: 'Treino Atualizado',
    description:
      'O treino de amanhã foi atualizado pela comissão técnica',
    time: 'Hoje, 10:34',
    read: false,
  },
  {
    id: 3,
    type: 'avaliacao',
    title: 'Avaliação Disponível',
    description:
      'Nova avaliação técnica disponível para o time',
    time: 'Hoje, 10:34',
    read: true,
  },
  {
    id: 4,
    type: 'convocacao',
    title: 'Partida Confirmada',
    description:
      'A próxima partida da equipe foi confirmada',
    time: 'Ontem, 18:20',
    read: false,
  },
];

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

  onSearchResult,
}: HeaderProps) => {

  /* =====================================
     NAVEGAÇÃO
  ===================================== */

  const navigate = useNavigate();

  const headerRef = useRef<HTMLElement>(null);

  const [openPanel, setOpenPanel] =
    useState<OpenPanel>(null);

  const [searchValue, setSearchValue] =
    useState('');

  const [
    notifications,
    setNotifications,
  ] = useState<NotificationItem[]>(
    initialNotifications,
  );

  /* =====================================
     USUÁRIO LOGADO
  ===================================== */

  const [usuario, setUsuario] =
    useState<Usuario | null>(null);

  /* =====================================
     CARREGAR USUÁRIO
  ===================================== */

  useEffect(() => {
    const carregarUsuario = async () => {
      const token =
        localStorage.getItem('token') ||
        sessionStorage.getItem('token');

      /*
       * Primeiro tenta pegar os dados já
       * salvos no navegador.
       */
      const usuarioSalvo =
        localStorage.getItem('usuario') ||
        sessionStorage.getItem('usuario');

      if (usuarioSalvo) {
        try {
          const usuarioLocal: Usuario =
            JSON.parse(usuarioSalvo);

          setUsuario(usuarioLocal);
        } catch {
          setUsuario(null);
        }
      }

      /*
       * Depois busca os dados atualizados
       * diretamente do backend.
       */
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
          return;
        }

        const dados =
          await resposta.json();

        const usuarioAtualizado: Usuario =
          dados.usuario;

        setUsuario(
          usuarioAtualizado,
        );

        /*
         * Mantém o storage sincronizado.
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
      } catch (error) {
        console.error(
          'Erro ao carregar usuário do backend:',
          error,
        );
      }
    };

    carregarUsuario();
  }, []);

  const nomeUsuario =
    usuario?.nome || 'Treinador';

  const iniciais =
    nomeUsuario
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((nome) => nome[0])
      .join('')
      .toUpperCase();

  const avatarUrl = usuario?.avatarUrl
    ? `${API_URL}${usuario.avatarUrl}`
    : null;

  /* =====================================
     SAIR
  ===================================== */

  const handleLogout = () => {

    // Remove os dados do usuário
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');

    sessionStorage.removeItem('usuario');
    sessionStorage.removeItem('token');

    // Fecha o menu
    setOpenPanel(null);

    // Mantém o callback caso outro componente
    // esteja utilizando essa função
    onLogout?.();

    // Vai para a tela de login
    navigate('/');
  };

  /* =====================================
     FECHAR AO CLICAR FORA
  ===================================== */

  useEffect(() => {
    const handleOutsideClick = (
      event: MouseEvent,
    ) => {
      if (
        headerRef.current &&
        !headerRef.current.contains(
          event.target as Node,
        )
      ) {
        setOpenPanel(null);
      }
    };

    const handleEscape = (
      event: KeyboardEvent,
    ) => {
      if (event.key === 'Escape') {
        setOpenPanel(null);
      }
    };

    document.addEventListener(
      'mousedown',
      handleOutsideClick,
    );

    document.addEventListener(
      'keydown',
      handleEscape,
    );

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

  /* =====================================
     PESQUISA
  ===================================== */

  const filteredSearch = useMemo(() => {
    const value = searchValue
      .trim()
      .toLowerCase();

    if (!value) {
      return searchData;
    }

    return searchData.filter((item) => {
      return (
        item.title
          .toLowerCase()
          .includes(value) ||
        item.subtitle
          .toLowerCase()
          .includes(value)
      );
    });
  }, [searchValue]);

  const athletes = filteredSearch.filter(
    (item) => item.type === 'atleta',
  );

  const teams = filteredSearch.filter(
    (item) => item.type === 'equipe',
  );

  const matches = filteredSearch.filter(
    (item) => item.type === 'partida',
  );

  const handleSearchResult = (
    item: SearchItem,
  ) => {
    onSearchResult?.(item);

    setSearchValue('');
    setOpenPanel(null);
  };

  /* =====================================
     NOTIFICAÇÕES
  ===================================== */

  const unreadNotifications =
    notifications.filter(
      (notification) =>
        !notification.read,
    ).length;

  const handleNotificationClick = (
    id: number,
  ) => {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id
          ? {
              ...notification,
              read: true,
            }
          : notification,
      ),
    );
  };

  /* =====================================
     CONTROLE DOS PAINÉIS
  ===================================== */

  const togglePanel = (
    panel: OpenPanel,
  ) => {
    setOpenPanel((current) =>
      current === panel ? null : panel,
    );
  };

  return (
    <header
      ref={headerRef}
      className={styles.header}
    >

      {/* =====================================
          TÍTULO
      ===================================== */}

      <h1 className={styles.title}>
        {title}
      </h1>

      {/* =====================================
          ÁREA DIREITA
      ===================================== */}

      <div className={styles.right}>

        {/* =====================================
            PESQUISA
        ===================================== */}

        <div
          className={
            styles.searchContainer
          }
        >
          <div
            className={styles.search}
            onClick={() =>
              setOpenPanel('search')
            }
          >
            <Search
              size={18}
              strokeWidth={2}
            />

            <input
              type="text"
              value={searchValue}
              placeholder="Pesquisar atletas, equipes, partidas"
              onFocus={() =>
                setOpenPanel('search')
              }
              onChange={(event) => {
                setSearchValue(
                  event.target.value,
                );

                setOpenPanel('search');
              }}
            />
          </div>

          {/* RESULTADOS DA PESQUISA */}

          {openPanel === 'search' && (
            <div
              className={
                styles.searchDropdown
              }
            >
              {filteredSearch.length ===
              0 ? (
                <div
                  className={
                    styles.emptySearch
                  }
                >
                  Nenhum resultado encontrado.
                </div>
              ) : (
                <>
                  {/* ATLETAS */}

                  {athletes.length > 0 && (
                    <SearchSection
                      title="Atletas"
                      items={athletes}
                      onViewAll={
                        onViewAllAthletes
                      }
                      onItemClick={
                        handleSearchResult
                      }
                    />
                  )}

                  {/* EQUIPES */}

                  {teams.length > 0 && (
                    <SearchSection
                      title="Equipes"
                      items={teams}
                      onViewAll={
                        onViewAllTeams
                      }
                      onItemClick={
                        handleSearchResult
                      }
                    />
                  )}

                  {/* PARTIDAS */}

                  {matches.length > 0 && (
                    <SearchSection
                      title="Partidas"
                      items={matches}
                      onViewAll={
                        onViewAllMatches
                      }
                      onItemClick={
                        handleSearchResult
                      }
                    />
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* =====================================
            NOTIFICAÇÕES
        ===================================== */}

        <div
          className={
            styles.notificationContainer
          }
        >
          <button
            className={
              styles.notification
            }
            type="button"
            aria-label="Notificações"
            aria-expanded={
              openPanel ===
              'notifications'
            }
            onClick={() =>
              togglePanel(
                'notifications',
              )
            }
          >
            <Bell
              size={20}
              strokeWidth={2}
            />

            {unreadNotifications > 0 && (
              <span
                className={
                  styles.notificationBadge
                }
              >
                {unreadNotifications}
              </span>
            )}
          </button>

          {openPanel ===
            'notifications' && (
            <div
              className={
                styles.notificationsDropdown
              }
            >
              <div
                className={
                  styles.notificationHeader
                }
              >
                <div
                  className={
                    styles.notificationTitleWrapper
                  }
                >
                  <h2>
                    Notificações
                  </h2>

                  {unreadNotifications >
                    0 && (
                    <span
                      className={
                        styles.notificationCount
                      }
                    >
                      {
                        unreadNotifications
                      }
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  className={
                    styles.viewAll
                  }
                  onClick={() => {
                    onViewAllNotifications?.();
                    setOpenPanel(null);
                  }}
                >
                  Ver todas
                </button>
              </div>

              <div
                className={
                  styles.notificationList
                }
              >
                {notifications.map(
                  (notification) => (
                    <button
                      type="button"
                      key={
                        notification.id
                      }
                      className={`${styles.notificationItem} ${
                        !notification.read
                          ? styles.notificationUnread
                          : ''
                      }`}
                      onClick={() =>
                        handleNotificationClick(
                          notification.id,
                        )
                      }
                    >
                      <NotificationIcon
                        type={
                          notification.type
                        }
                      />

                      <div
                        className={
                          styles.notificationContent
                        }
                      >
                        <div
                          className={
                            styles.notificationTop
                          }
                        >
                          <strong>
                            {
                              notification.title
                            }
                          </strong>

                          <span>
                            {
                              notification.time
                            }
                          </span>
                        </div>

                        <p>
                          {
                            notification.description
                          }
                        </p>
                      </div>

                      {!notification.read && (
                        <span
                          className={
                            styles.unreadDot
                          }
                        />
                      )}
                    </button>
                  ),
                )}
              </div>
            </div>
          )}
        </div>

        {/* =====================================
            USUÁRIO
        ===================================== */}

        <div
          className={styles.userContainer}
        >
          <button
            type="button"
            className={styles.user}
            aria-expanded={
              openPanel === 'user'
            }
            onClick={() =>
              togglePanel('user')
            }
          >

            {/* AVATAR PRINCIPAL */}

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

            <div
              className={styles.userInfo}
            >
              <span
                className={
                  styles.userName
                }
              >
                {nomeUsuario}
              </span>

              <span
                className={
                  styles.userRole
                }
              >
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

          {/* MENU DO USUÁRIO */}

          {openPanel === 'user' && (
            <div
              className={
                styles.userDropdown
              }
            >
              <div
                className={
                  styles.userDropdownHeader
                }
              >

                {/* AVATAR DO MENU */}

                <div
                  className={
                    styles.dropdownAvatar
                  }
                >
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
                  <strong>
                    {nomeUsuario}
                  </strong>

                  <span>
                    Treinador
                  </span>
                </div>
              </div>

              <div
                className={
                  styles.userMenu
                }
              >
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
                  className={
                    styles.userMenuItem
                  }
                  onClick={() => {
                    onSettings?.();
                    setOpenPanel(null);
                  }}
                >
                  <Settings size={18} />
                  Configurações
                </button>

                <button
                  type="button"
                  className={
                    styles.userMenuItem
                  }
                  onClick={() => {
                    onHelp?.();
                    setOpenPanel(null);
                  }}
                >
                  <CircleHelp size={18} />
                  Ajuda
                </button>
              </div>

              <div
                className={
                  styles.userMenuDivider
                }
              />

              {/* =====================================
                  SAIR
              ===================================== */}

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

/* =====================================
   SEÇÃO DA PESQUISA
===================================== */

interface SearchSectionProps {
  title: string;
  items: SearchItem[];
  onViewAll?: () => void;
  onItemClick: (
    item: SearchItem,
  ) => void;
}

const SearchSection = ({
  title,
  items,
  onViewAll,
  onItemClick,
}: SearchSectionProps) => {
  return (
    <section
      className={styles.searchSection}
    >
      <div
        className={
          styles.searchSectionHeader
        }
      >
        <strong>{title}</strong>

        <button
          type="button"
          onClick={onViewAll}
        >
          Ver todos
        </button>
      </div>

      <div
        className={
          styles.searchSectionItems
        }
      >
        {items.map((item) => (
          <button
            key={`${item.type}-${item.id}`}
            type="button"
            className={
              styles.searchResultItem
            }
            onClick={() =>
              onItemClick(item)
            }
          >
            <SearchItemIcon item={item} />

            <div
              className={
                styles.searchResultText
              }
            >
              <strong>
                {item.title}
              </strong>

              <span>
                {item.subtitle}
              </span>
            </div>

            <ChevronRight
              size={19}
              className={
                styles.searchResultArrow
              }
            />
          </button>
        ))}
      </div>
    </section>
  );
};

/* =====================================
   ÍCONE DO RESULTADO
===================================== */

interface SearchItemIconProps {
  item: SearchItem;
}

const SearchItemIcon = ({
  item,
}: SearchItemIconProps) => {
  if (item.type === 'atleta') {
    return (
      <div
        className={
          styles.searchAvatar
        }
      >
        {item.initials}
      </div>
    );
  }

  if (item.type === 'equipe') {
    return (
      <div
        className={
          styles.searchIconCircle
        }
      >
        <Users size={17} />
      </div>
    );
  }

  return (
    <div
      className={
        styles.searchIconCircle
      }
    >
      <CalendarDays size={17} />
    </div>
  );
};

/* =====================================
   ÍCONE DA NOTIFICAÇÃO
===================================== */

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