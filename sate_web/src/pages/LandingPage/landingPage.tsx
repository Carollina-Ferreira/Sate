import {
  useEffect,
  useState,
} from 'react';
import {
  ArrowRight,
  BarChart3,
  CalendarDays,
  Check,
  Database,
  FileSpreadsheet,
  Play,
  Upload,
  UserRound,
  Users,
  Video,
} from 'lucide-react';
import {
  FaApple,
  FaGooglePlay,
} from 'react-icons/fa';
import {
  useNavigate,
} from 'react-router-dom';
import styles from './landingPage.module.css';
/* ==========================================
   ASSETS
========================================== */
import logoSate from '../../assets/img/logo_grande.png';
import heroFutebol from '../../assets/img/hero/futebol.png.png';
import heroBasquete from '../../assets/img/hero/basquete.png.png';
import heroVolei from '../../assets/img/hero/volei.png.png';
import heroHandebol from '../../assets/img/hero/handebol.png.png';
import heroRugby from '../../assets/img/hero/rugby.png.png';
import heroNatacao from '../../assets/img/hero/natacao.png.png';
import heroAtletismo from '../../assets/img/hero/atletismo.png.png';
import heroTenis from '../../assets/img/hero/tenis.png.png';
import futebolImg from '../../assets/img/itens/futebolImg.png';
import basqueteImg from '../../assets/img/itens/basqueteImg.png';
import voleiImg from '../../assets/img/itens/voleiImg.png';
import handebolImg from '../../assets/img/itens/handebolImg.png';
import rugbyImg from '../../assets/img/itens/rugbyImg.png';
import natacaoImg from '../../assets/img/itens/natacaoImg.png';
import atletismoImg from '../../assets/img/itens/atletismoImg.png';
import tenisImg from '../../assets/img/itens/tenisImg.png';
/* ==========================================
   HERO
========================================== */
const heroSlides = [
  {
    nome: 'Futebol',
    imagem: heroFutebol,
    position: '70% center',
  },
  {
    nome: 'Basquete',
    imagem: heroBasquete,
    position: '70% center',
  },
  {
    nome: 'Vôlei',
    imagem: heroVolei,
    position: '72% center',
  },
  {
    nome: 'Handebol',
    imagem: heroHandebol,
    position: '72% center',
  },
  {
    nome: 'Rugby',
    imagem: heroRugby,
    position: '72% center',
  },
  {
    nome: 'Natação',
    imagem: heroNatacao,
    position: '70% center',
  },
  {
    nome: 'Atletismo',
    imagem: heroAtletismo,
    position: '72% center',
  },
  {
    nome: 'Tênis',
    imagem: heroTenis,
    position: '72% center',
  },
];
/* ==========================================
   ESPORTES
========================================== */
const esportes = [
  {
    nome: 'Futebol',
    imagem: futebolImg,
  },
  {
    nome: 'Basquete',
    imagem: basqueteImg,
  },
  {
    nome: 'Vôlei',
    imagem: voleiImg,
  },
  {
    nome: 'Handebol',
    imagem: handebolImg,
  },
  {
    nome: 'Rugby',
    imagem: rugbyImg,
  },
  {
    nome: 'Natação',
    imagem: natacaoImg,
  },
  {
    nome: 'Atletismo',
    imagem: atletismoImg,
  },
  {
    nome: 'Tênis',
    imagem: tenisImg,
  },
];
export default function LandingPage() {
  const navigate = useNavigate();
  const [heroAtual, setHeroAtual] =
    useState(0);
  /* ========================================
     FADE AUTOMÁTICO
  ======================================== */
  useEffect(() => {
    heroSlides.forEach((slide) => {
      const imagem = new Image();
      imagem.src = slide.imagem;
    });
    const intervalo =
      window.setInterval(() => {
        setHeroAtual((atual) =>
          (atual + 1) %
          heroSlides.length
        );
      }, 5500);
    return () => {
      window.clearInterval(
        intervalo,
      );
    };
  }, []);
  /* ========================================
     NAVEGAÇÃO
  ======================================== */
  const irParaLogin = () => {
    navigate('/login');
  };
  const rolarPara = (
    id: string,
  ) => {
    document
      .getElementById(id)
      ?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
  };
  return (
    <main className={`${styles.page} sate-public-landing`}>
      {/* ======================================
          HERO
      ====================================== */}
      <section
        className={styles.hero}
      >
        <div
          className={
            styles.heroBackgrounds
          }
        >
          {heroSlides.map(
            (slide, index) => (
              <div
                key={slide.nome}
                className={`${styles.heroBackground} ${index === heroAtual
                  ? styles.heroBackgroundActive
                  : ''
                  }`}
                style={{
                  backgroundImage:
                    `url(${slide.imagem})`,
                  backgroundPosition:
                    slide.position,
                }}
              />
            ),
          )}
        </div>
        <div
          className={
            styles.heroOverlay
          }
        />
        {/* HEADER */}
        <header
          className={styles.header}
        >
          <button
            type="button"
            className={
              styles.logoButton
            }
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: 'smooth',
              })
            }
          >
            <img
              src={logoSate}
              alt="SATE"
              className={styles.logo}
            />
            <strong>
              SATE
            </strong>
          </button>
          <nav
            className={
              styles.navigation
            }
          >
            <button
              type="button"
              onClick={() =>
                rolarPara(
                  'funcionalidades',
                )
              }
            >
              Produto
            </button>
            <button
              type="button"
              onClick={() =>
                rolarPara(
                  'esportes',
                )
              }
            >
              Esportes
            </button>
            <button
              type="button"
              onClick={() =>
                rolarPara(
                  'aplicativos',
                )
              }
            >
              Aplicativos
            </button>
            <button
              type="button"
              onClick={() =>
                rolarPara(
                  'sobre',
                )
              }
            >
              Sobre
            </button>
          </nav>
          <div
            className={
              styles.headerActions
            }
          >
            <button
              type="button"
              className={
                styles.loginButton
              }
              onClick={irParaLogin}
            >
              Entrar
            </button>
            <button
              type="button"
              className={
                styles.headerCta
              }
              onClick={irParaLogin}
            >
              Começar agora
              <ArrowRight
                size={17}
              />
            </button>
          </div>
        </header>
        {/* CONTEÚDO HERO */}
        <div
          className={
            styles.heroContent
          }
        >
          <span
            className={
              styles.eyebrowLight
            }
          >
            DESEMPENHO SEM LIMITES
          </span>
          <h1>
            Acompanhamento e
            <br />
            treinamento esportivo
            <br />
            em{' '}
            <em>
              outro nível.
            </em>
          </h1>
          <p>
            O SATE é uma plataforma
            completa para gerenciar
            equipes, acompanhar atletas,
            analisar desempenho e tomar
            decisões com mais confiança.
          </p>
          <div
            className={
              styles.heroButtons
            }
          >
            <button
              type="button"
              className={
                styles.primaryButton
              }
              onClick={irParaLogin}
            >
              Começar agora
              <ArrowRight
                size={18}
              />
            </button>
            <button
              type="button"
              className={
                styles.secondaryButton
              }
              onClick={() =>
                rolarPara(
                  'funcionalidades',
                )
              }
            >
              <span
                className={
                  styles.playCircle
                }
              >
                <Play
                  size={12}
                  fill="currentColor"
                />
              </span>
              Conheça o produto
            </button>
          </div>
          <div
            className={
              styles.heroBenefits
            }
          >
            <span>
              <BarChart3
                size={16}
              />
              Mais desempenho
            </span>
            <span>
              <Database
                size={16}
              />
              Decisões com dados
            </span>
            <span>
              <Users
                size={16}
              />
              Para todos os esportes
            </span>
          </div>
        </div>
      </section>
      {/* ======================================
          FUNCIONALIDADES
      ====================================== */}
      <section
        id="funcionalidades"
        className={
          styles.featuresSection
        }
      >
        <div
          className={
            styles.featuresContainer
          }
        >
          <div
            className={
              styles.featuresHeader
            }
          >
            <div>
              <span
                className={
                  styles.eyebrow
                }
              >
                FUNCIONALIDADES
              </span>
              <h2>
                Tudo o que o seu
                <br />
                time precisa, {' '}
                <em>
                  em um só lugar.
                </em>
              </h2>
            </div>
            <p>
              Ferramentas poderosas
              e intuitivas para
              simplificar a gestão,
              acompanhar o desempenho
              e potencializar resultados.
            </p>
          </div>
          <div
            className={
              styles.featureGrid
            }
          >
            <article
              className={`${styles.featureCard} ${styles.featureCardFeatured}`}
            >
              <div
                className={
                  styles.featureIcon
                }
              >
                <UserRound
                  size={26}
                />
              </div>
              <h3>
                Gestão de atletas
              </h3>
              <p>
                Perfis completos,
                informações e evolução
                individual em um só lugar.
              </p>
              <button
                type="button"
                className={
                  styles.featureArrow
                }
                onClick={irParaLogin}
              >
                <ArrowRight
                  size={17}
                />
              </button>
            </article>
            <article
              className={
                styles.featureCard
              }
            >
              <div
                className={
                  styles.featureIcon
                }
              >
                <Users
                  size={26}
                />
              </div>
              <h3>
                Equipes
              </h3>
              <p>
                Organize elencos,
                categorias e informações
                das suas equipes.
              </p>
              <button
                type="button"
                className={
                  styles.featureArrow
                }
                onClick={irParaLogin}
              >
                <ArrowRight
                  size={17}
                />
              </button>
            </article>
            <article
              className={
                styles.featureCard
              }
            >
              <div
                className={
                  styles.featureIcon
                }
              >
                <CalendarDays
                  size={26}
                />
              </div>
              <h3>
                Partidas
              </h3>
              <p>
                Planejamento,
                campeonatos e registros
                completos dos jogos.
              </p>
              <button
                type="button"
                className={
                  styles.featureArrow
                }
                onClick={irParaLogin}
              >
                <ArrowRight
                  size={17}
                />
              </button>
            </article>
            <article
              className={
                styles.featureCard
              }
            >
              <div
                className={
                  styles.featureIcon
                }
              >
                <Video
                  size={26}
                />
              </div>
              <h3>
                Análise de vídeo
              </h3>
              <p>
                Marque lances,
                crie clipes e analise
                partidas com facilidade.
              </p>
              <button
                type="button"
                className={
                  styles.featureArrow
                }
                onClick={irParaLogin}
              >
                <ArrowRight
                  size={17}
                />
              </button>
            </article>
            <article
              className={
                styles.featureCard
              }
            >
              <div
                className={
                  styles.featureIcon
                }
              >
                <BarChart3
                  size={26}
                />
              </div>
              <h3>
                Estatísticas
              </h3>
              <p>
                Visualize desempenho,
                evolução e indicadores
                importantes.
              </p>
              <button
                type="button"
                className={
                  styles.featureArrow
                }
                onClick={irParaLogin}
              >
                <ArrowRight
                  size={17}
                />
              </button>
            </article>
          </div>
        </div>
      </section>
      {/* ======================================
          PLATAFORMA WEB
      ====================================== */}
      <section
        className={
          styles.platformSection
        }
      >
        <div
          className={
            styles.platformText
          }
        >
          <span
            className={
              styles.eyebrowLight
            }
          >
            VISÃO COMPLETA
          </span>
          <h2>
            Do treino ao resultado,
            <br />
            <em>
              na sua tela.
            </em>
          </h2>
          <p>
            Uma experiência moderna
            e intuitiva para acompanhar,
            analisar e tomar decisões
            com mais confiança.
          </p>
          <button
            type="button"
            className={
              styles.platformButton
            }
            onClick={irParaLogin}
          >
            Conheça o produto
            <ArrowRight
              size={17}
            />
          </button>
        </div>
        <div
          className={
            styles.laptopArea
          }
        >
          <div
            className={
              styles.laptop
            }
          >
            <div
              className={
                styles.laptopScreen
              }
            >
              <aside
                className={
                  styles.mockSidebar
                }
              >
                <div
                  className={
                    styles.mockLogo
                  }
                >
                  <img
                    src={logoSate}
                    alt=""
                  />
                  <strong>
                    SATE
                  </strong>
                </div>
                <nav>
                  <span
                    className={
                      styles.mockActive
                    }
                  >
                    Início
                  </span>
                  <span>
                    Atletas
                  </span>
                  <span>
                    Equipes
                  </span>
                  <span>
                    Partidas
                  </span>
                  <span>
                    Vídeos
                  </span>
                  <span>
                    Estatísticas
                  </span>
                </nav>
              </aside>
              <div
                className={
                  styles.mockDashboard
                }
              >
                <div
                  className={
                    styles.mockHeader
                  }
                >
                  <div>
                    <span>
                      Visão geral
                    </span>
                    <h4>
                      Desempenho
                    </h4>
                  </div>
                  <div
                    className={
                      styles.mockUser
                    }
                  >
                    JS
                  </div>
                </div>
                <div
                  className={
                    styles.mockStats
                  }
                >
                  <MockStat
                    value="28"
                    label="Atletas"
                    change="+12%"
                  />
                  <MockStat
                    value="24"
                    label="Treinos"
                    change="+9%"
                  />
                  <MockStat
                    value="6"
                    label="Partidas"
                    change="+30%"
                  />
                  <MockStat
                    value="87%"
                    label="Evolução"
                    change="+14%"
                  />
                </div>
                <div
                  className={
                    styles.mockChart
                  }
                >
                  <div
                    className={
                      styles.mockChartTitle
                    }
                  >
                    <strong>
                      Evolução do desempenho
                    </strong>
                    <span>
                      Últimos 6 meses
                    </span>
                  </div>
                  <svg
                    viewBox="0 0 700 190"
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <linearGradient
                        id="landingChart"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#16a875"
                          stopOpacity="0.28"
                        />
                        <stop
                          offset="100%"
                          stopColor="#16a875"
                          stopOpacity="0"
                        />
                      </linearGradient>
                    </defs>
                    <path
                      d="
                        M0 145
                        L90 115
                        L175 130
                        L260 90
                        L345 70
                        L435 86
                        L525 47
                        L610 60
                        L700 25
                        L700 190
                        L0 190
                        Z
                      "
                      fill="url(#landingChart)"
                    />
                    <polyline
                      points="
                        0,145
                        90,115
                        175,130
                        260,90
                        345,70
                        435,86
                        525,47
                        610,60
                        700,25
                      "
                      fill="none"
                      stroke="#128961"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div
                  className={
                    styles.mockBottom
                  }
                >
                  <div
                    className={
                      styles.mockAthletes
                    }
                  >
                    <strong>
                      Atletas em destaque
                    </strong>
                    <MockAthlete
                      initials="PL"
                      name="Pedro Lima"
                      value="9.2"
                    />
                    <MockAthlete
                      initials="LM"
                      name="Lucas Martins"
                      value="8.7"
                    />
                    <MockAthlete
                      initials="GS"
                      name="Gabriel Souza"
                      value="8.1"
                    />
                  </div>
                  <div
                    className={
                      styles.mockTraining
                    }
                  >
                    <div
                      className={
                        styles.mockVideo
                      }
                    >
                      <Play
                        size={19}
                        fill="currentColor"
                      />
                    </div>
                    <strong>
                      Treino técnico
                    </strong>
                    <span>
                      Análise de desempenho
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div
              className={
                styles.laptopBottom
              }
            />
          </div>
        </div>
      </section>
      {/* ======================================
          EXCEL
      ====================================== */}
      <section
        className={
          styles.excelSection
        }
      >
        <div
          className={
            styles.excelText
          }
        >
          <span
            className={
              styles.eyebrow
            }
          >
            AUTOMAÇÃO INTELIGENTE
          </span>
          <h2>
            Importação de
            <br />
            <em>
              planilhas Excel.
            </em>
          </h2>
          <p>
            Importe informações em
            segundos, reduza cadastros
            manuais e mantenha atletas,
            equipes e dados sempre
            atualizados.
          </p>
          <button
            type="button"
            className={
              styles.greenButton
            }
            onClick={irParaLogin}
          >
            Saiba mais
            <ArrowRight
              size={17}
            />
          </button>
          <div
            className={
              styles.excelBenefits
            }
          >
            <span>
              <Upload
                size={17}
              />
              Importação rápida
            </span>
            <span>
              <Check
                size={17}
              />
              Menos trabalho manual
            </span>
            <span>
              <Database
                size={17}
              />
              Dados centralizados
            </span>
          </div>
        </div>
        <div
          className={
            styles.excelVisual
          }
        >
          <div
            className={
              styles.excelFile
            }
          >
            <div
              className={
                styles.excelLogo
              }
            >
              <FileSpreadsheet
                size={42}
                strokeWidth={1.8}
              />
            </div>
            <strong>
              Atletas.xlsx
            </strong>
            <span>
              Planilha Excel
            </span>
          </div>
          <div
            className={
              styles.excelArrow
            }
          >
            <ArrowRight
              size={28}
            />
          </div>
          <div
            className={
              styles.excelTable
            }
          >
            <div
              className={
                styles.excelHeader
              }
            >
              <span>
                Nome
              </span>
              <span>
                Posição
              </span>
              <span>
                Categoria
              </span>
              <span>
                Status
              </span>
            </div>
            {[
              [
                'Carlos Silva',
                'Atacante',
                'Sub-20',
              ],
              [
                'Matheus Lima',
                'Meio-campo',
                'Sub-17',
              ],
              [
                'João Pereira',
                'Zagueiro',
                'Sub-18',
              ],
              [
                'Rafael Costa',
                'Goleiro',
                'Sub-20',
              ],
            ].map(
              (atleta) => (
                <div
                  key={atleta[0]}
                  className={
                    styles.excelRow
                  }
                >
                  <span>
                    {atleta[0]}
                  </span>
                  <span>
                    {atleta[1]}
                  </span>
                  <span>
                    {atleta[2]}
                  </span>
                  <span
                    className={
                      styles.importBadge
                    }
                  >
                    Importado
                  </span>
                </div>
              ),
            )}
            <div
              className={
                styles.progressCard
              }
            >
              <div>
                <Check
                  size={15}
                />
                Importando dados...
              </div>
              <span>
                78%
              </span>
              <div
                className={
                  styles.progressBar
                }
              >
                <i />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ======================================
          ESPORTES
      ====================================== */}
      <section
        id="esportes"
        className={
          styles.sportsSection
        }
      >
        <span
          className={
            styles.eyebrow
          }
        >
          DIVERSAS MODALIDADES
        </span>
        <h2>
          Feito para{' '}
          <em>
            todos os esportes.
          </em>
        </h2>
        <p>
          O SATE se adapta às
          particularidades de cada
          modalidade, com campos de
          análise específicos e
          personalizáveis.
        </p>
        {/* Carrossel contínuo: a segunda sequência cria o loop sem cortes. */}
        <div
          className={styles.sportsMarquee}
          aria-label="Modalidades esportivas atendidas pelo SATE"
        >
          <div className={styles.sportsTrack}>
            {[0, 1].map((repeticao) => (
              <div
                key={repeticao}
                className={styles.sportsSequence}
                aria-hidden={repeticao === 1 ? true : undefined}
              >
                {esportes.map((esporte) => (
                  <article
                    key={esporte.nome}
                    className={styles.sportCard}
                  >
                    <div className={styles.sportImageBox}>
                      <img
                        src={esporte.imagem}
                        alt={esporte.nome}
                        className={styles.sportImage}
                      />
                    </div>
                    <strong>{esporte.nome}</strong>
                  </article>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* ======================================
          APLICATIVOS
      ====================================== */}
      <section
        id="aplicativos"
        className={
          styles.appsSection
        }
      >
        <div
          className={
            styles.appsText
          }
        >
          <span
            className={
              styles.eyebrow
            }
          >
            SEMPRE COM VOCÊ
          </span>
          <h2>
            Para treinadores
            <br />
            e atletas, em
            <br />
            <em>
              qualquer lugar.
            </em>
          </h2>
          <p>
            Além da plataforma web,
            o SATE também está
            disponível em aplicativos
            pensados para treinadores
            e atletas.
          </p>
          <div
            className={
              styles.storeButtons
            }
          >
            <button
              type="button"
              onClick={irParaLogin}
            >
              <FaApple
                className={
                  styles.storeIcon
                }
              />
              <div>
                <small>
                  Baixar na
                </small>
                <strong>
                  App Store
                </strong>
              </div>
            </button>
            <button
              type="button"
              onClick={irParaLogin}
            >
              <FaGooglePlay
                className={
                  styles.storeIcon
                }
              />
              <div>
                <small>
                  Disponível no
                </small>
                <strong>
                  Google Play
                </strong>
              </div>
            </button>
          </div>
        </div>
        <div
          className={
            styles.phonesArea
          }
        >
          {/* TREINADOR */}
          <div
            className={`${styles.phone} ${styles.phoneTrainer}`}
          >
            <div
              className={
                styles.phoneStatus
              }
            >
              <span>
                9:41
              </span>
              <span>
                •••
              </span>
            </div>
            <div
              className={
                styles.phoneBrand
              }
            >
              <img
                src={logoSate}
                alt=""
              />
              <strong>
                SATE
              </strong>
            </div>
            <div
              className={
                styles.phoneUser
              }
            >
              <div>
                C
              </div>
              <span>
                <small>
                  Olá, Professora!
                </small>
                <strong>
                  Carolina
                </strong>
              </span>
            </div>
            <h4>
              Visão geral
            </h4>
            <div
              className={
                styles.phoneStats
              }
            >
              <div>
                <strong>
                  24
                </strong>
                <span>
                  Atletas
                </span>
              </div>
              <div>
                <strong>
                  2
                </strong>
                <span>
                  Equipes
                </span>
              </div>
              <div>
                <strong>
                  3-1
                </strong>
                <span>
                  Última
                </span>
              </div>
            </div>
            <div
              className={
                styles.phoneMatches
              }
            >
              <strong>
                Últimas partidas
              </strong>
              <p>
                SATE FC
                <b>
                  3 - 1
                </b>
              </p>
              <p>
                Real Clube
                <b>
                  1 - 1
                </b>
              </p>
              <p>
                União
                <b>
                  2 - 0
                </b>
              </p>
            </div>
          </div>
          {/* ATLETA */}
          <div
            className={`${styles.phone} ${styles.phoneAthlete}`}
          >
            <div
              className={
                styles.phoneStatus
              }
            >
              <span>
                9:41
              </span>
              <span>
                •••
              </span>
            </div>
            <div
              className={
                styles.phoneBrand
              }
            >
              <img
                src={logoSate}
                alt=""
              />
              <strong>
                SATE
              </strong>
            </div>
            <div
              className={
                styles.phoneUser
              }
            >
              <div>
                P
              </div>
              <span>
                <small>
                  Olá, Pedro!
                </small>
                <strong>
                  Atleta
                </strong>
              </span>
            </div>
            <h4>
              Meu desempenho
            </h4>
            <div
              className={
                styles.phoneStats
              }
            >
              <div>
                <strong>
                  12
                </strong>
                <span>
                  Treinos
                </span>
              </div>
              <div>
                <strong>
                  540
                </strong>
                <span>
                  Minutos
                </span>
              </div>
              <div>
                <strong>
                  8.2
                </strong>
                <span>
                  Média
                </span>
              </div>
            </div>
            <div
              className={
                styles.phoneChart
              }
            >
              <svg
                viewBox="0 0 230 90"
                preserveAspectRatio="none"
              >
                <polyline
                  points="
                    0,72
                    32,54
                    62,65
                    95,38
                    126,48
                    156,22
                    187,34
                    230,12
                  "
                  fill="none"
                  stroke="#16966c"
                  strokeWidth="4"
                />
              </svg>
            </div>
            <div
              className={
                styles.phoneTraining
              }
            >
              <small>
                Próximo treino
              </small>
              <strong>
                Treino técnico
              </strong>
              <span>
                Hoje • 18:00
              </span>
            </div>
          </div>
        </div>
      </section>
      {/* ======================================
    CTA
====================================== */}
      <section
        id="sobre"
        className={styles.finalCta}
      >
        <div className={styles.finalCtaContent}>
          <span>RESULTADOS REAIS COMEÇAM AQUI</span>
          <h2>
            Pronto para levar
            <br />
            seu time <em>mais longe?</em>
          </h2>
          <p>
            Transforme organização, dados e desempenho
            em evolução dentro e fora de campo.
          </p>
        </div>
        <button
          type="button"
          className={styles.finalCtaButton}
          onClick={irParaLogin}
        >
          Começar agora
          <ArrowRight size={20} />
        </button>
      </section>
      {/* ======================================
    FOOTER
====================================== */}
      <footer className={styles.footer}>
        <div className={styles.footerTop}>
          <div className={styles.footerBrand}>
            <div className={styles.footerLogo}>
              <img
                src={logoSate}
                alt="SATE"
              />
              <strong>SATE</strong>
            </div>
            <p>
              Tecnologia para transformar dados
              esportivos em decisões melhores.
            </p>
            <span className={styles.footerPhrase}>
              Dados hoje. Grandes conquistas amanhã.
            </span>
          </div>
          <div className={styles.footerLinks}>
            <div>
              <strong>Produto</strong>
              <button
                type="button"
                onClick={() =>
                  rolarPara('funcionalidades')
                }
              >
                Funcionalidades
              </button>
              <button
                type="button"
                onClick={() =>
                  rolarPara('esportes')
                }
              >
                Esportes
              </button>
              <button
                type="button"
                onClick={() =>
                  rolarPara('aplicativos')
                }
              >
                Aplicativos
              </button>
              <button
                type="button"
                onClick={irParaLogin}
              >
                Entrar
              </button>
            </div>
            <div>
              <strong>Plataforma</strong>
              <span>Gestão de atletas</span>
              <span>Gestão de equipes</span>
              <span>Análise de partidas</span>
              <span>Estatísticas</span>
            </div>
            <div>
              <strong>Recursos</strong>
              <span>Análise de vídeo</span>
              <span>Importação por Excel</span>
              <span>Aplicativo mobile</span>
              <span>Múltiplos esportes</span>
            </div>
            <div>
              <strong>Sobre</strong>
              <span>Projeto SATE</span>
              <span>Privacidade</span>
              <span>Termos de uso</span>
              <span>Contato</span>
            </div>
          </div>
        </div>
        <div className={styles.footerDivider} />
        <div className={styles.footerBottom}>
          <span>
            © 2026 SATE. Todos os direitos reservados.
          </span>
          <div>
            <span>Sistema de Acompanhamento</span>
            <span>e Treinamento Esportivo</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
/* ==========================================
   MOCK DASHBOARD
========================================== */
interface MockStatProps {
  value: string;
  label: string;
  change: string;
}
function MockStat({
  value,
  label,
  change,
}: MockStatProps) {
  return (
    <div
      className={
        styles.mockStat
      }
    >
      <strong>
        {value}
      </strong>
      <span>
        {label}
      </span>
      <small>
        {change}
      </small>
    </div>
  );
}
interface MockAthleteProps {
  initials: string;
  name: string;
  value: string;
}
function MockAthlete({
  initials,
  name,
  value,
}: MockAthleteProps) {
  return (
    <div
      className={
        styles.mockAthlete
      }
    >
      <span>
        {initials}
      </span>
      <strong>
        {name}
      </strong>
      <i />
      <b>
        {value}
      </b>
    </div>
  );
}