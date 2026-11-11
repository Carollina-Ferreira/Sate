import {
  ArrowRight,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Play,
  Shield,
  TrendingDown,
  TrendingUp,
  Trophy,
  UserRound,
  Users,
} from 'lucide-react';

import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import { useNavigate } from 'react-router-dom';

import styles from './dashboard.module.css';
import LoadingState from '../../components/ui/LoadingState/LoadingState';


// ============================================================
// TIPOS
// ============================================================

type TipoAtividade =
  | 'partida'
  | 'atleta'
  | 'equipe'
  | 'estatistica'
  | 'video';


type StatusPartida =
  | 'Finalizada'
  | 'Analisada'
  | 'Em andamento'
  | 'Em análise'
  | 'Pendente'
  | 'Cancelada';


type Periodo =
  | 'Todas as partidas'
  | 'Últimas 7 partidas'
  | 'Últimas 5 partidas'
  | 'Últimas 3 partidas';

type Classificacao = 'boa' | 'ruim' | 'neutra' | 'destaque';

interface AcoesPartida {
  id: number;
  equipeId: number | null;
  equipeNome: string;
  adversario: string;
  data: string;
  boas: number;
  ruins: number;
  neutras: number;
  destaques: number;
  total: number;
  valor: number | null;
}

interface PartidaApi {
  id: number;
  equipeId?: number | null;
  equipe?: { id?: number; nome?: string } | null;
  adversario?: string;
  data?: string;
  status?: string;
}

interface VideoApi { id: number }

interface MarcacaoApi {
  id: number;
  categoria?: string | null;
  categoriaId?: number | null;
  avaliacao?: string | null;
  tipoRegistro?: string | null;
}

interface ConfiguracaoAnaliseApi {
  id: number;
  tipo?: string | null;
}

interface Resumo {
  id: number;
  titulo: string;
  valor: number;
  detalhe: string;
  variacao: number;
  rota: string;
}


interface AtividadeRecente {
  id: string | number;
  titulo: string;
  horario: string;
  tipo: TipoAtividade;
}


interface Partida {
  id: number;
  equipe: string;
  adversario: string;
  modalidade: string;
  data: string;
  dataFormatada?: string;
  resultado: string;
  status: StatusPartida;
}


interface Equipe {
  id: number;
  nome: string;
  modalidade: string;
  categoria?: string | null;
  sigla: string;
  desempenho: number;
  atletas?: number;
  corEquipe?: string | null;
  imagem?: string | null;
}


interface DashboardResponse {
  treinador: {
    id: number;
    nome: string;
    email?: string | null;
  };

  resumos: Resumo[];

  atividades: AtividadeRecente[];

  desempenho?: unknown;

  partidas: Partida[];

  partidasCalendario: Partida[];

  equipes: Equipe[];
}


interface ErroApi {
  mensagem?: string;
  erro?: string;
}


// ============================================================
// CONFIGURAÇÕES
// ============================================================

const API_URL = String(
  import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
).replace(/\/+$/, '');


const periodos: Periodo[] = [
  'Todas as partidas',
  'Últimas 7 partidas',
  'Últimas 5 partidas',
  'Últimas 3 partidas',
];

/** Aceita respostas em array ou encapsuladas como {partidas/videos/marcacoes/dados}. */
function extrairLista<T>(dados: unknown, chaves: string[]): T[] {
  if (Array.isArray(dados)) return dados as T[];
  if (!dados || typeof dados !== 'object') return [];
  const registro = dados as Record<string, unknown>;
  for (const chave of chaves) {
    if (Array.isArray(registro[chave])) return registro[chave] as T[];
    if (registro[chave] && typeof registro[chave] === 'object') {
      const interna = extrairLista<T>(registro[chave], chaves);
      if (interna.length) return interna;
    }
  }
  return [];
}

async function buscarLista<T>(url: string, token: string, chaves: string[]): Promise<T[]> {
  const resposta = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!resposta.ok) {
    throw new Error(`Erro HTTP ${resposta.status} ao consultar ${url}`);
  }
  const dados: unknown = await resposta.json();
  return extrairLista<T>(dados, chaves);
}

/** Mesma regra usada pelo Perfil do Atleta para classificar ações reais. */
function normalizarAvaliacao(valor: unknown): Classificacao | null {
  const texto = String(valor ?? '')
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase();

  if (['POSITIVA', 'POSITIVO', 'BOA', 'BOM'].includes(texto)) return 'boa';
  if (['NEGATIVA', 'NEGATIVO', 'RUIM'].includes(texto)) return 'ruim';
  if (['NEUTRA', 'NEUTRO'].includes(texto)) return 'neutra';
  if (['DESTAQUE', 'DESTACADA', 'DESTACADO'].includes(texto)) return 'destaque';
  return null;
}

function classificarMarcacao(
  marcacao: MarcacaoApi,
  tiposCategorias: Map<number, string>,
): Classificacao | null {
  const tipoRegistro = String(marcacao.tipoRegistro || 'EVENTO').toUpperCase();
  if (tipoRegistro !== 'EVENTO') return null;
  const categoria = String(marcacao.categoria || '').toUpperCase();
  if (categoria === 'CLIPE' || categoria === 'CLIP') return null;

  // Preferência: avaliação explícita > tipo da configuração > categoria legada.
  return normalizarAvaliacao(marcacao.avaliacao)
    || normalizarAvaliacao(tiposCategorias.get(Number(marcacao.categoriaId)))
    || normalizarAvaliacao(marcacao.categoria);
}

const diasSemana = [
  'SEG',
  'TER',
  'QUA',
  'QUI',
  'SEX',
  'SÁB',
  'DOM',
];


// ============================================================
// TOKEN
// ============================================================

const obterToken = () => {
  return (
    localStorage.getItem('token') ||
    sessionStorage.getItem('token') ||
    localStorage.getItem('accessToken') ||
    sessionStorage.getItem('accessToken')
  );
};


// ============================================================
// DATAS
// ============================================================

const dataLocal = (
  valor: string,
): Date | null => {
  if (!valor) {
    return null;
  }

  const partes = valor
    .slice(0, 10)
    .split('-');

  const data =
    partes.length === 3 &&
      partes[0].length === 4
      ? new Date(
        Number(partes[0]),
        Number(partes[1]) - 1,
        Number(partes[2]),
      )
      : new Date(valor);

  return Number.isNaN(
    data.getTime(),
  )
    ? null
    : data;
};


const formatarData = (
  valor: string,
) => {
  return (
    dataLocal(
      valor,
    )?.toLocaleDateString(
      'pt-BR',
    ) || '—'
  );
};


// ============================================================
// CALENDÁRIO
// ============================================================

const criarCalendario = (
  ano: number,
  mes: number,
): Array<number | null> => {
  const primeiroDia =
    new Date(
      ano,
      mes,
      1,
    ).getDay();

  const inicio =
    (primeiroDia + 6) % 7;

  const quantidadeDias =
    new Date(
      ano,
      mes + 1,
      0,
    ).getDate();

  const dias: Array<
    number | null
  > = Array(inicio).fill(
    null,
  );

  for (
    let dia = 1;
    dia <= quantidadeDias;
    dia += 1
  ) {
    dias.push(dia);
  }

  while (
    dias.length % 7 !== 0
  ) {
    dias.push(null);
  }

  return dias;
};


// ============================================================
// GRÁFICO — mesmos limites e curvas do Perfil do Atleta
// ============================================================

const LIMITE_ESQUERDO = 55;
const LIMITE_DIREITO = 625;
const GRAFICO_TOPO = 45;
const GRAFICO_BASE = 245;

interface PontoEvolucao extends AcoesPartida {
  x: number;
  y: number;
}

function gerarPontos(partidas: AcoesPartida[]): PontoEvolucao[] {
  return partidas.map((partida, index) => {
    const valor = Math.max(0, Math.min(100, Number(partida.valor ?? 0)));
    return {
      ...partida,
      x: partidas.length === 1
        ? (LIMITE_ESQUERDO + LIMITE_DIREITO) / 2
        : LIMITE_ESQUERDO + index *
          ((LIMITE_DIREITO - LIMITE_ESQUERDO) / (partidas.length - 1)),
      y: GRAFICO_BASE - (valor / 100) * (GRAFICO_BASE - GRAFICO_TOPO),
    };
  });
}

function gerarLinhaSuave(pontos: PontoEvolucao[]): string {
  if (pontos.length < 2) return '';
  return pontos.reduce((caminho, ponto, index) => {
    if (index === 0) return `M ${ponto.x} ${ponto.y}`;
    const anterior = pontos[index - 1];
    const distancia = (ponto.x - anterior.x) * 0.34;
    return `${caminho} C ${anterior.x + distancia} ${anterior.y}, ` +
      `${ponto.x - distancia} ${ponto.y}, ${ponto.x} ${ponto.y}`;
  }, '');
}

// ============================================================
// ÍCONES DE ATIVIDADES
// ============================================================

const iconAtividade = (
  tipo: TipoAtividade,
) => {
  if (tipo === 'video') {
    return (
      <Play size={15} />
    );
  }

  if (tipo === 'partida') {
    return (
      <Trophy size={15} />
    );
  }

  if (
    tipo ===
    'estatistica'
  ) {
    return (
      <BarChart3
        size={15}
      />
    );
  }

  return (
    <Users size={15} />
  );
};


// ============================================================
// STATUS
// ============================================================

const statusClass = (
  status: StatusPartida,
) => {
  if (
    status === 'Finalizada' ||
    status === 'Analisada'
  ) {
    return styles.statusDone;
  }

  if (
    status === 'Em andamento' ||
    status === 'Em análise'
  ) {
    return styles.statusAnalysis;
  }

  return styles.statusPending;
};


// ============================================================
// DASHBOARD
// ============================================================

export default function Dashboard() {
  const navigate =
    useNavigate();


  // ==========================================================
  // ESTADOS
  // ==========================================================

  const [
    dashboard,
    setDashboard,
  ] =
    useState<DashboardResponse | null>(
      null,
    );


  const [
    carregando,
    setCarregando,
  ] = useState(true);


  const [
    erro,
    setErro,
  ] = useState('');


  const [
    periodo,
    setPeriodo,
  ] =
    useState<Periodo>(
      'Últimas 7 partidas',
    );


  // Gráfico global: mesmos critérios do Perfil do Atleta (boas+destaques/total).
  const [equipeGrafico, setEquipeGrafico] = useState('todas');
  const [acoesPartidas, setAcoesPartidas] = useState<AcoesPartida[]>([]);
  const [carregandoAcoes, setCarregandoAcoes] = useState(true);
  const [erroAcoes, setErroAcoes] = useState('');
  const [partidasIncompletas, setPartidasIncompletas] = useState(0);

  useEffect(() => {
    let cancelado = false;
    const token = obterToken();
    if (!token) {
      setCarregandoAcoes(false);
      return;
    }

    async function carregarEvolucao() {
      setCarregandoAcoes(true);
      setErroAcoes('');
      setPartidasIncompletas(0);
      try {
        // Mesmo campo de classificação do endpoint do perfil: configuracaoAnalise.tipo.
        // O GET antigo pode retornar configuracoes, campos ou dados.
        let tiposCategorias = new Map<number, string>();
        try {
          const configuracoes = await buscarLista<ConfiguracaoAnaliseApi>(
            `${API_URL}/configuracao-analise`, token!,
            ['configuracoes', 'campos', 'dados'],
          );
          tiposCategorias = new Map(
            configuracoes
              .filter((campo) => Number.isFinite(Number(campo.id)))
              .map((campo) => [Number(campo.id), String(campo.tipo || '')]),
          );
        } catch (error) {
          console.warn('Configurações de análise indisponíveis; tentando avaliações diretas.', error);
        }

        const lista = (await buscarLista<PartidaApi>(
          `${API_URL}/partidas`, token!, ['partidas', 'dados'],
        )).filter((partida) =>
          String(partida.status || '').toUpperCase() !== 'CANCELADA'
        );

        let indice = 0;
        let falhas = 0;
        const resultados: Array<AcoesPartida | null> = new Array(lista.length).fill(null);

        // Quatro partidas simultaneamente para não sobrecarregar o backend.
        async function trabalhador() {
          while (indice < lista.length && !cancelado) {
            const atual = indice++;
            const partida = lista[atual];
            const resumo = { boa: 0, ruim: 0, neutra: 0, destaque: 0 };
            let completa = true;

            try {
              const videos = await buscarLista<VideoApi>(
                `${API_URL}/partidas/${partida.id}/videos`, token!,
                ['videos', 'dados'],
              );
              const resultadosVideos = await Promise.allSettled(
                videos.map((video) => buscarLista<MarcacaoApi>(
                  `${API_URL}/videos/${video.id}/marcacoes`, token!,
                  ['marcacoes', 'eventos', 'dados'],
                )),
              );

              for (const resultado of resultadosVideos) {
                if (resultado.status === 'rejected') {
                  completa = false;
                  falhas += 1;
                  continue;
                }
                for (const marcacao of resultado.value) {
                  const tipo = classificarMarcacao(marcacao, tiposCategorias);
                  if (tipo) resumo[tipo] += 1;
                }
              }
            } catch (error) {
              console.error('Falha ao consultar evolução da partida:', partida.id, error);
              falhas += 1;
              completa = false;
            }

            // Não calcula porcentagens com eventos que não puderam ser consultados.
            if (!completa) continue;

            const total = resumo.boa + resumo.ruim + resumo.neutra + resumo.destaque;
            const equipeId = partida.equipeId ?? partida.equipe?.id;
            resultados[atual] = {
              id: Number(partida.id),
              equipeId: equipeId != null && Number.isFinite(Number(equipeId))
                ? Number(equipeId) : null,
              equipeNome: partida.equipe?.nome || 'Equipe',
              adversario: partida.adversario || 'Adversário',
              data: partida.data || '',
              boas: resumo.boa,
              ruins: resumo.ruim,
              neutras: resumo.neutra,
              destaques: resumo.destaque,
              total,
              valor: total > 0
                ? Math.round(((resumo.boa + resumo.destaque) / total) * 100)
                : null,
            };
          }
        }
        await Promise.all(
          Array.from({ length: Math.min(4, lista.length) }, () => trabalhador())
        );
        if (!cancelado) {
          setAcoesPartidas(
            resultados.filter((item): item is AcoesPartida => item !== null)
          );
          setPartidasIncompletas(falhas);
        }
      } catch (error) {
        if (!cancelado) {
          setErroAcoes(
            error instanceof Error ? error.message
              : 'Não foi possível consultar a evolução das equipes.'
          );
        }
      } finally {
        if (!cancelado) setCarregandoAcoes(false);
      }
    }

    void carregarEvolucao();
    return () => { cancelado = true; };
  }, []);

  const [
    mes,
    setMes,
  ] = useState(
    () =>
      new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        1,
      ),
  );


  const [
    dia,
    setDia,
  ] =
    useState<number | null>(
      new Date().getDate(),
    );


  // ==========================================================
  // CARREGAR DASHBOARD
  // ==========================================================

  useEffect(() => {
    let ativo = true;


    async function carregar() {
      try {
        setCarregando(true);

        setErro('');


        const token =
          obterToken();


        if (!token) {
          navigate(
            '/login',
            {
              replace: true,
            },
          );

          return;
        }


        const resposta =
          await fetch(
            `${API_URL}/dashboard`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            },
          );


        const texto =
          await resposta.text();


        let dados:
          DashboardResponse &
          ErroApi;


        try {
          dados =
            JSON.parse(
              texto,
            );
        } catch {
          throw new Error(
            'A API do dashboard não retornou JSON.',
          );
        }


        if (
          resposta.status === 401
        ) {
          const chaves = [
            'token',
            'accessToken',
            'usuario',
          ];


          chaves.forEach(
            (chave) => {
              localStorage.removeItem(
                chave,
              );

              sessionStorage.removeItem(
                chave,
              );
            },
          );


          navigate(
            '/login',
            {
              replace: true,
            },
          );

          return;
        }


        if (!resposta.ok) {
          throw new Error(
            dados.mensagem ||
            dados.erro ||
            `Erro HTTP ${resposta.status}`,
          );
        }


        if (!ativo) {
          return;
        }


        setDashboard(
          dados,
        );


        const partidasCalendario =
          Array.isArray(
            dados.partidasCalendario,
          )
            ? dados.partidasCalendario
            : [];


        const hoje =
          new Date();

        hoje.setHours(
          0,
          0,
          0,
          0,
        );


        const futura = [
          ...partidasCalendario,
        ]
          .filter(
            (partida) => {
              const data =
                dataLocal(
                  partida.data,
                );

              return (
                data &&
                data >= hoje
              );
            },
          )
          .sort(
            (
              primeira,
              segunda,
            ) =>
              (dataLocal(
                primeira.data,
              )?.getTime() ||
                0) -
              (dataLocal(
                segunda.data,
              )?.getTime() ||
                0),
          )[0];


        if (futura) {
          const data =
            dataLocal(
              futura.data,
            );


          if (data) {
            setMes(
              new Date(
                data.getFullYear(),
                data.getMonth(),
                1,
              ),
            );

            setDia(
              data.getDate(),
            );
          }
        }
      } catch (error) {
        if (ativo) {
          setErro(
            error instanceof Error
              ? error.message
              : 'Erro ao carregar dashboard.',
          );
        }
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }


    carregar();


    return () => {
      ativo = false;
    };
  }, [navigate]);


  // ==========================================================
  // DADOS
  // ==========================================================

  const resumos =
    dashboard?.resumos ||
    [];


  const atividades =
    dashboard?.atividades ||
    [];


  const partidas =
    dashboard?.partidas ||
    [];


  const partidasCalendario =
    dashboard?.partidasCalendario ||
    [];


  const equipes =
    dashboard?.equipes ||
    [];


  const serieGrafico = useMemo(() => {
    const avaliadas = acoesPartidas
      .filter((partida) =>
        (equipeGrafico === 'todas' || String(partida.equipeId) === equipeGrafico)
        && partida.valor !== null
      )
      .sort((a, b) =>
        (dataLocal(b.data)?.getTime() || 0) - (dataLocal(a.data)?.getTime() || 0)
        || b.id - a.id
      );

    const quantidade = periodo === 'Todas as partidas'
      ? avaliadas.length
      : Number(periodo.match(/\d+/)?.[0] || 7);
    const partidasSelecionadas = avaliadas.slice(0, quantidade).reverse();
    const pontos = gerarPontos(partidasSelecionadas);
    const linha = gerarLinhaSuave(pontos);
    const primeiro = pontos[0];
    const ultimo = pontos[pontos.length - 1];
    const area = pontos.length > 1 && primeiro && ultimo
      ? `${linha} L ${ultimo.x} ${GRAFICO_BASE} L ${primeiro.x} ${GRAFICO_BASE} Z`
      : '';

    const somaPositivas = partidasSelecionadas.reduce(
      (soma, partida) => soma + partida.boas + partida.destaques, 0
    );
    const somaTotal = partidasSelecionadas.reduce(
      (soma, partida) => soma + partida.total, 0
    );

    return {
      pontos,
      linha,
      area,
      percentualTotal: somaTotal > 0
        ? Math.round((somaPositivas / somaTotal) * 100) : null,
      somaPositivas,
      somaTotal,
    };
  }, [acoesPartidas, equipeGrafico, periodo]);

  // ==========================================================
  // CALENDÁRIO
  // ==========================================================

  const ano =
    mes.getFullYear();


  const numeroMes =
    mes.getMonth();


  const dias =
    useMemo(
      () =>
        criarCalendario(
          ano,
          numeroMes,
        ),
      [
        ano,
        numeroMes,
      ],
    );


  const partidasMes =
    useMemo(() => {
      return partidasCalendario.filter(
        (partida) => {
          const data =
            dataLocal(
              partida.data,
            );

          return (
            data?.getFullYear() === ano &&
            data.getMonth() === numeroMes
          );
        },
      );
    }, [
      partidasCalendario,
      ano,
      numeroMes,
    ]);


  const diasPartida =
    useMemo(() => {
      const diasComPartida =
        partidasMes
          .map(
            (partida) =>
              dataLocal(
                partida.data,
              )?.getDate(),
          )
          .filter(
            (
              diaPartida,
            ): diaPartida is number =>
              typeof diaPartida ===
              'number',
          );


      return new Set(
        diasComPartida,
      );
    }, [partidasMes]);


  const partidasDia =
    partidasMes.filter(
      (partida) =>
        dataLocal(
          partida.data,
        )?.getDate() === dia,
    );


  // ==========================================================
  // PRÓXIMA PARTIDA
  // ==========================================================

  const hoje =
    new Date();

  hoje.setHours(
    0,
    0,
    0,
    0,
  );


  const proxima = [
    ...partidasCalendario,
  ]
    .filter(
      (partida) => {
        const data =
          dataLocal(
            partida.data,
          );

        return (
          data &&
          data >= hoje
        );
      },
    )
    .sort(
      (
        primeira,
        segunda,
      ) =>
        (dataLocal(
          primeira.data,
        )?.getTime() ||
          0) -
        (dataLocal(
          segunda.data,
        )?.getTime() ||
          0),
    )[0];


  const dataProxima =
    proxima
      ? dataLocal(
        proxima.data,
      )
      : null;


  // ==========================================================
  // TREINADOR
  // ==========================================================

  const nome =
    dashboard?.treinador?.nome
      ?.trim()
      .split(/\s+/)[0] ||
    'Treinador';


  // ==========================================================
  // MÊS
  // ==========================================================

  const mesNome =
    mes.toLocaleDateString(
      'pt-BR',
      {
        month: 'long',
        year: 'numeric',
      },
    );


  // ==========================================================
  // RESUMOS
  // ==========================================================

  const iconesResumo = [
    UserRound,
    Shield,
    Trophy,
    TrendingUp,
  ];


  const ordemResumos = [
    'atleta',
    'equipe',
    'partida',
    'evolu',
  ];


  const resumosOrdenados =
    [...resumos].sort(
      (
        primeiro,
        segundo,
      ) => {
        const tituloPrimeiro =
          primeiro.titulo.toLowerCase();

        const tituloSegundo =
          segundo.titulo.toLowerCase();


        const indicePrimeiro =
          ordemResumos.findIndex(
            (item) =>
              tituloPrimeiro.includes(
                item,
              ),
          );


        const indiceSegundo =
          ordemResumos.findIndex(
            (item) =>
              tituloSegundo.includes(
                item,
              ),
          );


        return (
          (
            indicePrimeiro === -1
              ? 999
              : indicePrimeiro
          ) -
          (
            indiceSegundo === -1
              ? 999
              : indiceSegundo
          )
        );
      },
    );


  // ==========================================================
  // ALTERAR MÊS
  // ==========================================================

  const mudarMes = (
    deslocamento: number,
  ) => {
    setMes(
      (atual) =>
        new Date(
          atual.getFullYear(),
          atual.getMonth() +
          deslocamento,
          1,
        ),
    );

    setDia(null);
  };


  // ==========================================================
  // ABRIR ATIVIDADE
  // ==========================================================

  const abrirAtividade = (
    tipo: TipoAtividade,
  ) => {
    if (tipo === 'atleta') {
      navigate('/atletas');

      return;
    }

    if (tipo === 'equipe') {
      navigate('/equipes');

      return;
    }

    if (
      tipo ===
      'estatistica'
    ) {
      navigate('/estatisticas');

      return;
    }

    if (tipo === 'video') {
      navigate('/videos');

      return;
    }

    navigate('/partidas');
  };


  // ==========================================================
  // CARREGANDO
  // ==========================================================

  if (carregando) {
    return (
      <main className={styles.page}>
        <LoadingState variant="charts" title="Carregando dashboard..." description="Preparando indicadores e evolução das equipes." count={2} />
      </main>
    );
  }


  // ==========================================================
  // ERRO
  // ==========================================================

  if (erro) {
    return (
      <main className={styles.page}>
        <div
          className={
            styles.feedback
          }
        >
          <p>
            {erro}
          </p>

          <button
            type="button"
            onClick={() =>
              window.location.reload()
            }
          >
            Tentar novamente
          </button>
        </div>
      </main>
    );
  }


  // ==========================================================
  // TELA
  // ==========================================================

  return (
    <main className={styles.page}>
      <div
        className={
          styles.dashboard
        }
      >
        {/* =================================================
            CABEÇALHO
        ================================================= */}

        <header className={styles.heroHeader}>
          <div className={styles.heroTop}>
            <div className={styles.heroText}>
              <h1>
                Olá, <em>{nome}.</em>
              </h1>

              <p>
                Acompanhe tudo o que está acontecendo com seu time.
              </p>
            </div>

            <span className={styles.heroDate}>
              {new Date()
                .toLocaleDateString('pt-BR', {
                  month: 'long',
                  year: 'numeric',
                })
                .replace(/^./, (letra) => letra.toUpperCase())}
            </span>
          </div>
        </header>


        {/* =================================================
            INDICADORES
        ================================================= */}

        <section
          className={
            styles.scoreboard
          }
        >
          {resumosOrdenados.map(
            (
              item,
              index,
            ) => {
              const Icone =
                iconesResumo[
                index %
                iconesResumo.length
                ];


              const evolucao =
                item.titulo
                  .toLowerCase()
                  .includes(
                    'evolu',
                  );


              return (
                <button
                  key={
                    item.id
                  }
                  type="button"
                  className={
                    styles.scoreItem
                  }
                  onClick={() =>
                    navigate(
                      item.rota,
                    )
                  }
                >
                  <div
                    className={
                      styles.scoreTop
                    }
                  >
                    <span>
                      {item.titulo}
                    </span>

                    <Icone
                      size={19}
                    />
                  </div>


                  <strong>
                    {item.valor}

                    {evolucao
                      ? '%'
                      : ''}
                  </strong>


                  <div
                    className={
                      styles.scoreBottom
                    }
                  >
                    <span>
                      {item.detalhe}
                    </span>


                    {item.variacao !==
                      0 && (
                        <small
                          className={
                            item.variacao > 0
                              ? styles.positive
                              : styles.negative
                          }
                        >
                          {item.variacao >
                            0 ? (
                            <TrendingUp
                              size={13}
                            />
                          ) : (
                            <TrendingDown
                              size={13}
                            />
                          )}

                          {item.variacao >
                            0
                            ? '+'
                            : ''}

                          {item.variacao}%
                        </small>
                      )}
                  </div>
                </button>
              );
            },
          )}


          {!resumos.length && (
            <div
              className={
                styles.emptyWide
              }
            >
              Nenhum indicador
              disponível.
            </div>
          )}
        </section>


        {/* =================================================
            DESEMPENHO + PRÓXIMA PARTIDA
        ================================================= */}

        <section
          className={
            styles.topGrid
          }
        >
          {/* GRÁFICO — IDÊNTICO AO PADRÃO DO PERFIL DO ATLETA */}
          <article className={`${styles.card} ${styles.performance}`}>
            <div className={styles.cardHeading}>
              <div>
                <span className={styles.evolucaoEyebrow}>DESEMPENHO EM PARTIDAS</span>
                <h2>Evolução ao longo do <em>tempo</em></h2>
                <p>Percentual de ações boas e destaques por partida.</p>
              </div>
              <span className={styles.evolucaoIcon} aria-hidden="true">
                <TrendingUp size={19} />
              </span>
            </div>

            <div className={styles.chartFilters}>
              <label className={styles.evolucaoFilter}>
                <span>Equipe</span>
                <select
                  value={equipeGrafico}
                  onChange={(event) => setEquipeGrafico(event.target.value)}
                  aria-label="Selecionar equipe do gráfico"
                >
                  <option value="todas">Todas as equipes</option>
                  {equipes.map((equipe) => (
                    <option key={equipe.id} value={String(equipe.id)}>
                      {equipe.nome}
                    </option>
                  ))}
                </select>
              </label>
              <label className={styles.evolucaoFilter}>
                <span>Período</span>
                <select
                  value={periodo}
                  onChange={(event) => setPeriodo(event.target.value as Periodo)}
                  aria-label="Selecionar período do gráfico"
                >
                  {periodos.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </label>
            </div>

            <div className={styles.evolucaoMetrics}>
              <div className={styles.evolucaoMetricLabel}>
                <span className={styles.evolucaoMetricDot} />
                <span>Taxa de ações positivas</span>
              </div>
              <strong className={styles.evolucaoMetricPill}>
                {carregandoAcoes || serieGrafico.percentualTotal === null
                  ? 'Sem dados'
                  : `${serieGrafico.percentualTotal}% no total`}
              </strong>
            </div>

            <div className={styles.evolucaoGraphContainer}>
              {carregandoAcoes ? (
                <div className={styles.evolucaoEmpty} role="status">
                  <LoadingState variant="inline" title="Carregando evolução..." />
                  <p>Consultando os eventos das partidas.</p>
                </div>
              ) : erroAcoes ? (
                <div className={styles.evolucaoEmpty} role="alert">
                  <strong>Não foi possível carregar a evolução.</strong>
                  <p>{erroAcoes}</p>
                </div>
              ) : serieGrafico.pontos.length === 0 ? (
                <div className={styles.evolucaoEmpty} role="status">
                  <BarChart3 size={28} />
                  <strong>Nenhuma partida avaliada ainda</strong>
                  <p>Registre eventos classificados como boas, ruins, neutras ou destaques na análise de vídeo para visualizar a evolução.</p>
                </div>
              ) : (
                <svg
                  className={styles.evolucaoSvg}
                  viewBox="0 0 680 292"
                  role="img"
                  aria-label={`Evolução de ações positivas em ${serieGrafico.pontos.length} partidas avaliadas`}
                  preserveAspectRatio="xMidYMid meet"
                >
                  <defs>
                    <linearGradient id="sateDashboardEvolucaoArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#16A875" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#16A875" stopOpacity="0.015" />
                    </linearGradient>
                  </defs>
                  {[0, 25, 50, 75, 100].map((valor) => {
                    const y = GRAFICO_BASE -
                      (valor / 100) * (GRAFICO_BASE - GRAFICO_TOPO);
                    return (
                      <g key={valor}>
                        <text x="36" y={y + 4} textAnchor="end"
                          className={styles.evolucaoAxisLabel}>
                          {valor}%
                        </text>
                        <line x1={LIMITE_ESQUERDO} x2={LIMITE_DIREITO}
                          y1={y} y2={y} className={styles.evolucaoGridLine} />
                      </g>
                    );
                  })}

                  {serieGrafico.pontos.length > 1 && (
                    <>
                      <path d={serieGrafico.area} fill="url(#sateDashboardEvolucaoArea)" />
                      <path d={serieGrafico.linha} className={styles.evolucaoLine} fill="none" />
                    </>
                  )}

                  {serieGrafico.pontos.map((ponto, index) => {
                    const total = serieGrafico.pontos.length;
                    const intervalo = Math.max(1, Math.ceil(total / 8));
                    const exibirRotulo = total <= 8 || index % intervalo === 0 || index === total - 1;
                    return (
                      <g key={ponto.id}>
                        <title>{`${ponto.equipeNome} vs. ${ponto.adversario} • ${formatarData(ponto.data)} • ${ponto.valor}% de ações positivas (${ponto.boas} boas + ${ponto.destaques} destaques em ${ponto.total} ações)`}</title>
                        {index === total - 1 && (
                          <circle cx={ponto.x} cy={ponto.y} r="12"
                            className={styles.evolucaoHalo} />
                        )}
                        <circle cx={ponto.x} cy={ponto.y} r="5"
                          className={styles.evolucaoPoint} />
                        {exibirRotulo && (
                          <>
                            <text x={ponto.x} y={Math.max(25, ponto.y - 15)}
                              textAnchor="middle" className={styles.evolucaoValue}>
                              {ponto.valor}%
                            </text>
                            <text x={ponto.x} y="275" textAnchor="middle"
                              className={styles.evolucaoAxisLabel}>
                              {`J${index + 1}`}
                            </text>
                          </>
                        )}
                      </g>
                    );
                  })}
                </svg>
              )}
            </div>

            <p className={styles.evolucaoFootnote}>
              {serieGrafico.pontos.length === 1
                ? 'Uma partida avaliada. A linha de evolução aparecerá após a segunda.'
                : 'Calculado a partir das ações avaliadas nos vídeos; não é uma nota técnica.'}
              {serieGrafico.somaTotal > 0 &&
                ` · ${serieGrafico.pontos.length} partida(s) com eventos · ${serieGrafico.somaPositivas} de ${serieGrafico.somaTotal} ações positivas.`}
            </p>
            {partidasIncompletas > 0 && !carregandoAcoes && (
              <p className={styles.chartWarning} role="status">
                Algumas análises não puderam ser consultadas ({partidasIncompletas} falha(s)); as partidas incompletas foram excluídas do cálculo.
              </p>
            )}
          </article>

          {/* =================================================
              PRÓXIMA PARTIDA
          ================================================= */}

          <article
            className={
              styles.nextMatch
            }
          >
            <span
              className={
                styles.eyebrow
              }
            >
              PRÓXIMA PARTIDA
            </span>


            {proxima &&
              dataProxima ? (
              <>
                <div
                  className={
                    styles.matchDate
                  }
                >
                  <strong>
                    {
                      dataProxima.getDate()
                    }
                  </strong>


                  <div>
                    <b>
                      {dataProxima
                        .toLocaleDateString(
                          'pt-BR',
                          {
                            month:
                              'long',
                          },
                        )
                        .toUpperCase()}
                    </b>


                    <span>
                      {dataProxima.toLocaleDateString(
                        'pt-BR',
                        {
                          weekday:
                            'long',
                        },
                      )}
                    </span>
                  </div>
                </div>


                <div
                  className={
                    styles.matchTeams
                  }
                >
                  <strong>
                    {proxima.equipe}
                  </strong>

                  <em>
                    contra
                  </em>

                  <strong>
                    {proxima.adversario}
                  </strong>
                </div>


                <div
                  className={
                    styles.matchTags
                  }
                >
                  <span>
                    {
                      proxima.modalidade
                    }
                  </span>

                  <span>
                    {formatarData(
                      proxima.data,
                    )}
                  </span>
                </div>
              </>
            ) : (
              <p
                className={
                  styles.noUpcoming
                }
              >
                Nenhuma próxima
                partida agendada.
              </p>
            )}


            <button
              type="button"
              className={
                styles.matchButton
              }
              onClick={() =>
                navigate(
                  proxima ? proxima ? `/detalhes-partida/${proxima.id}` : '/partidas'  : '/partidas',
                )
              }
            >
              Ver partidas

              <ArrowRight
                size={17}
              />
            </button>


            <div
              className={
                styles.decorativeCircle
              }
            />
          </article>
        </section>


        {/* =================================================
            CALENDÁRIO + ATIVIDADES
        ================================================= */}

        <section
          className={
            styles.middleGrid
          }
        >
          <article
            className={`${styles.card} ${styles.calendarCard}`}
          >
            <div
              className={
                styles.cardHeading
              }
            >
              <div>
                <span
                  className={
                    styles.eyebrow
                  }
                >
                  AGENDA
                </span>

                <h2>
                  Calendário
                </h2>

                <p>
                  Acompanhe as datas
                  das partidas.
                </p>
              </div>
            </div>


            <div
              className={
                styles.calendarLayout
              }
            >
              <div
                className={
                  styles.calendarLeft
                }
              >
                <div
                  className={
                    styles.calendarNavigation
                  }
                >
                  <button
                    type="button"
                    aria-label="Mês anterior"
                    onClick={() =>
                      mudarMes(-1)
                    }
                  >
                    <ChevronLeft
                      size={17}
                    />
                  </button>


                  <strong>
                    {mesNome}
                  </strong>


                  <button
                    type="button"
                    aria-label="Próximo mês"
                    onClick={() =>
                      mudarMes(1)
                    }
                  >
                    <ChevronRight
                      size={17}
                    />
                  </button>
                </div>


                <div
                  className={
                    styles.calendarWeek
                  }
                >
                  {diasSemana.map(
                    (
                      diaSemana,
                    ) => (
                      <span
                        key={
                          diaSemana
                        }
                      >
                        {diaSemana}
                      </span>
                    ),
                  )}
                </div>


                <div
                  className={
                    styles.calendarDays
                  }
                >
                  {dias.map(
                    (
                      diaCalendario,
                      index,
                    ) => {
                      if (
                        diaCalendario ===
                        null
                      ) {
                        return (
                          <span
                            key={`vazio-${index}`}
                          />
                        );
                      }


                      const temPartida =
                        diasPartida.has(
                          diaCalendario,
                        );


                      const selecionado =
                        dia ===
                        diaCalendario;


                      return (
                        <button
                          key={
                            diaCalendario
                          }
                          type="button"
                          onClick={() =>
                            setDia(
                              diaCalendario,
                            )
                          }
                          className={`${styles.calendarDay} ${temPartida
                              ? styles.hasMatch
                              : ''
                            } ${selecionado
                              ? styles.selectedDay
                              : ''
                            }`}
                        >
                          {
                            diaCalendario
                          }

                          {temPartida && (
                            <i />
                          )}
                        </button>
                      );
                    },
                  )}
                </div>
              </div>


              <div
                className={
                  styles.calendarDetail
                }
              >
                <span
                  className={
                    styles.eyebrow
                  }
                >
                  PARTIDAS DO DIA
                </span>


                {partidasDia.length >
                  0 ? (
                  partidasDia.map(
                    (
                      partida,
                    ) => (
                      <button
                        key={
                          partida.id
                        }
                        type="button"
                        className={
                          styles.calendarMatch
                        }
                        onClick={() =>
                          navigate(
                            '/partidas',
                          )
                        }
                      >
                        <span>
                          {
                            partida.modalidade
                          }
                        </span>

                        <strong>
                          {
                            partida.equipe
                          }
                        </strong>

                        <small>
                          vs.{' '}
                          {
                            partida.adversario
                          }
                        </small>

                        <ArrowRight
                          size={15}
                        />
                      </button>
                    ),
                  )
                ) : (
                  <div
                    className={
                      styles.calendarEmpty
                    }
                  >
                    Nenhuma partida
                    nesta data.
                  </div>
                )}
              </div>
            </div>
          </article>


          <article
            className={`${styles.card} ${styles.activitiesCard}`}
          >
            <div
              className={
                styles.cardHeading
              }
            >
              <div>
                <span
                  className={
                    styles.eyebrow
                  }
                >
                  HISTÓRICO
                </span>

                <h2>
                  Atividades recentes
                </h2>
              </div>
            </div>


            <div
              className={
                styles.activityList
              }
            >
              {atividades.map(
                (
                  atividade,
                ) => (
                  <button
                    key={
                      atividade.id
                    }
                    type="button"
                    className={
                      styles.activity
                    }
                    onClick={() =>
                      abrirAtividade(
                        atividade.tipo,
                      )
                    }
                  >
                    <span
                      className={
                        styles.activityIcon
                      }
                    >
                      {iconAtividade(
                        atividade.tipo,
                      )}
                    </span>


                    <span
                      className={
                        styles.activityText
                      }
                    >
                      <strong>
                        {
                          atividade.titulo
                        }
                      </strong>

                      <small>
                        {
                          atividade.horario
                        }
                      </small>
                    </span>
                  </button>
                ),
              )}


              {!atividades.length && (
                <p
                  className={
                    styles.empty
                  }
                >
                  Nenhuma atividade
                  recente.
                </p>
              )}
            </div>
          </article>
        </section>


        {/* =================================================
            PARTIDAS + EQUIPES
        ================================================= */}

        <section
          className={
            styles.bottomGrid
          }
        >
          <article
            className={`${styles.card} ${styles.matchesCard}`}
          >
            <div
              className={
                styles.cardHeading
              }
            >
              <div>
                <span
                  className={
                    styles.eyebrow
                  }
                >
                  RESULTADOS
                </span>

                <h2>
                  Últimas partidas
                </h2>
              </div>


              <button
                type="button"
                className={
                  styles.textLink
                }
                onClick={() =>
                  navigate(
                    '/partidas',
                  )
                }
              >
                Ver todas

                <ArrowRight
                  size={15}
                />
              </button>
            </div>


            <div
              className={
                styles.tableScroll
              }
            >
              <table>
                <thead>
                  <tr>
                    <th>
                      Equipes
                    </th>

                    <th>
                      Modalidade
                    </th>

                    <th>
                      Data
                    </th>

                    <th>
                      Placar
                    </th>

                    <th>
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {partidas.map(
                    (
                      partida,
                    ) => (
                      <tr
                        key={
                          partida.id
                        }
                        onClick={() =>
                          navigate(
                            `/detalhes-partida/${partida.id}`,
                          )
                        }
                      >
                        <td>
                          <strong>
                            {
                              partida.equipe
                            }
                          </strong>

                          <small>
                            vs.{' '}
                            {
                              partida.adversario
                            }
                          </small>
                        </td>

                        <td>
                          {
                            partida.modalidade
                          }
                        </td>

                        <td>
                          {partida.dataFormatada ||
                            formatarData(
                              partida.data,
                            )}
                        </td>

                        <td
                          className={
                            styles.result
                          }
                        >
                          {partida.resultado ||
                            '—'}
                        </td>

                        <td>
                          <span
                            className={`${styles.status} ${statusClass(
                              partida.status,
                            )}`}
                          >
                            {
                              partida.status
                            }
                          </span>
                        </td>
                      </tr>
                    ),
                  )}


                  {!partidas.length && (
                    <tr>
                      <td
                        colSpan={5}
                        className={
                          styles.empty
                        }
                      >
                        Nenhuma partida
                        cadastrada.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </article>


          <article
            className={`${styles.card} ${styles.teamsCard}`}
          >
            <div
              className={
                styles.cardHeading
              }
            >
              <div>
                <span
                  className={
                    styles.eyebrow
                  }
                >
                  RANKING
                </span>

                <h2>
                  Equipes em destaque
                </h2>
              </div>


              <button
                type="button"
                className={
                  styles.textLink
                }
                onClick={() =>
                  navigate(
                    '/equipes',
                  )
                }
              >
                Ver equipes

                <ArrowRight
                  size={15}
                />
              </button>
            </div>


            <div
              className={
                styles.teamList
              }
            >
              {equipes.map(
                (
                  equipe,
                  index,
                ) => (
                  <button
                    key={
                      equipe.id
                    }
                    type="button"
                    className={
                      styles.teamRow
                    }
                    onClick={() =>
                      navigate(
                        '/equipes',
                      )
                    }
                  >
                    <span
                      className={
                        styles.teamRank
                      }
                    >
                      {String(
                        index + 1,
                      ).padStart(
                        2,
                        '0',
                      )}
                    </span>


                    <span
                      className={
                        styles.teamBadge
                      }
                      style={
                        equipe.corEquipe
                          ? {
                            background:
                              equipe.corEquipe,
                          }
                          : undefined
                      }
                    >
                      {equipe.sigla}
                    </span>


                    <span
                      className={
                        styles.teamInfo
                      }
                    >
                      <strong>
                        {equipe.nome}
                      </strong>

                      <small>
                        {
                          equipe.modalidade
                        }

                        {typeof equipe.atletas ===
                          'number'
                          ? ` · ${equipe.atletas} atletas`
                          : ''}
                      </small>


                      <span
                        className={
                          styles.progress
                        }
                      >
                        <i
                          style={{
                            width: `${Math.max(
                              0,
                              Math.min(
                                100,
                                equipe.desempenho,
                              ),
                            )}%`,
                          }}
                        />
                      </span>
                    </span>


                    <strong
                      className={
                        styles.teamPercent
                      }
                    >
                      {
                        equipe.desempenho
                      }
                      %
                    </strong>
                  </button>
                ),
              )}


              {!equipes.length && (
                <p
                  className={
                    styles.empty
                  }
                >
                  Nenhuma equipe
                  cadastrada.
                </p>
              )}
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}