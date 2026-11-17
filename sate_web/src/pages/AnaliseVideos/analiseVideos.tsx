import {
  ArrowUpRight,
  Check,
  Circle,
  Clock3,
  Eraser,
  Flag,
  Flame,
  Footprints,
  Hand,
  Hash,
  Heart,
  Maximize,
  Minimize,
  Minus,
  MousePointer2,
  Pause,
  Pencil,
  Play,
  Plus,
  RotateCcw,
  RotateCw,
  Save,
  Scissors,
  Shield,
  Square,
  Star,
  Target,
  Trash2,
  Trophy,
  Undo2,
  Video,
  Volume2,
  VolumeX,
  X,
  Zap,
} from 'lucide-react';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type ComponentType,
  type FormEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react';

import styles from './analiseVideos.module.css';
import LoadingState from '../../components/ui/LoadingState/LoadingState';

const API_URL = 'http://localhost:3000/api';

/* ============================================================
   TIPOS
============================================================ */

type TipoEvento = 'boa' | 'ruim' | 'neutra' | 'destaque';

type TipoForma =
  | 'livre'
  | 'linha'
  | 'seta'
  | 'circulo'
  | 'retangulo'
  | 'numero';

type Ferramenta = 'nenhuma' | TipoForma;

interface Ponto {
  x: number;
  y: number;
}

interface Forma {
  tipo: TipoForma;
  cor: string;
  pontos: Ponto[];
  valor?: number;
}

interface VideoPartida {
  id: number;
  titulo?: string;
  nome?: string;
  url: string;
  nomeArquivo?: string;
  tipo?: string | null;
  tamanho?: number | string | null;
  duracao?: string;
  createdAt?: string;
}

interface Partida {
  id: number;
  equipeId: number;
  equipe: string;
  adversario: string;
  data: string;
  modalidade: string;
  videos: VideoPartida[];
}

interface PartidaBackend {
  id: number;
  adversario?: string | null;
  data?: string | null;
  equipe?: {
    id: number;
    nome: string;
    modalidade?: string | null;
  } | null;
}

interface AtletaPartida {
  id: number;
  nome: string;
  numero?: number | null;
  posicao?: string | null;
  titular?: boolean;
  participou?: boolean;
}

interface MarcacaoBackend {
  id: number;
  videoId: number;
  partidaId?: number | null;
  atletaId?: number | null;
  atleta?: {
    id: number;
    nome: string;
    numero?: number | null;
  } | null;
  categoriaId?: number | null;
  titulo: string;
  categoria: string;
  avaliacao?: string | null;
  tipoRegistro?: string | null;
  tempoInicio: number;
  tempoFim: number;
  observacao?: string | null;
  createdAt?: string;
}

interface Evento {
  id: number;
  nome: string;
  descricao: string;
  tipo: TipoEvento;
  segundo: number;
  duracao: number;
  atletaId: number | null;
  atletaNome: string;
  categoriaId: number | null;
}

interface Clipe {
  id: number;
  nome: string;
  inicio: number;
  fim: number;
  descricao: string;
  tipo: TipoEvento;
  atletaNome: string;
}

interface Anotacao {
  id: number;
  tempo: number;
  duracao: number;
  formas: Forma[];
}

interface AnotacaoBackend {
  id: number;
  videoId?: number;
  tempo: number;
  duracao: number;
  formas: Forma[] | string;
}

interface Categoria {
  id: number;
  nome: string;
  tipo: TipoEvento;
  icone: string;
  cor: string;
  mostrarNaTimeline: boolean;
}

interface CategoriaBackend {
  id: number;
  nome: string;
  tipo?: string | null;
  icone?: string | null;
  cor?: string | null;
  mostrarNaTimeline?: boolean | null;
}

interface RespostaErro {
  mensagem?: string;
  erro?: string;
}

interface RespostaCategoria {
  configuracao?: CategoriaBackend;
  campo?: CategoriaBackend;
}

interface FormularioCategoria {
  id: number | null;
  nome: string;
  tipo: TipoEvento;
  icone: string;
  cor: string;
  mostrarNaTimeline: boolean;
}

/* ============================================================
   CONSTANTES
============================================================ */

const AVALIACOES: Array<{ valor: TipoEvento; rotulo: string }> = [
  { valor: 'boa', rotulo: 'Boa' },
  { valor: 'ruim', rotulo: 'Ruim' },
  { valor: 'neutra', rotulo: 'Neutra' },
  { valor: 'destaque', rotulo: 'Destaque' },
];

const PALETA_CATEGORIA = [
  { chave: 'verde', hex: '#087b5b' },
  { chave: 'verdeClaro', hex: '#16a875' },
  { chave: 'rosa', hex: '#f04470' },
  { chave: 'vermelho', hex: '#d52941' },
  { chave: 'azul', hex: '#4289c7' },
  { chave: 'amarelo', hex: '#e5aa28' },
  { chave: 'laranja', hex: '#e07b2e' },
  { chave: 'roxo', hex: '#7b5cda' },
  { chave: 'cinza', hex: '#6c7c77' },
  { chave: 'escuro', hex: '#10251f' },
];

const PALETA_DESENHO = [
  { chave: 'vermelho', hex: '#ff3b4e' },
  { chave: 'amarelo', hex: '#ffd23f' },
  { chave: 'verde', hex: '#2ee59d' },
  { chave: 'azul', hex: '#4aa8ff' },
  { chave: 'rosa', hex: '#ff5c8a' },
  { chave: 'branco', hex: '#ffffff' },
];

const ICONES_CATEGORIA: Record<
  string,
  { rotulo: string; Componente: ComponentType<{ size?: number }> }
> = {
  alvo: { rotulo: 'Alvo', Componente: Target },
  raio: { rotulo: 'Raio', Componente: Zap },
  escudo: { rotulo: 'Defesa', Componente: Shield },
  bandeira: { rotulo: 'Bandeira', Componente: Flag },
  trofeu: { rotulo: 'Troféu', Componente: Trophy },
  estrela: { rotulo: 'Estrela', Componente: Star },
  fogo: { rotulo: 'Fogo', Componente: Flame },
  mao: { rotulo: 'Mão', Componente: Hand },
  passos: { rotulo: 'Passos', Componente: Footprints },
  coracao: { rotulo: 'Coração', Componente: Heart },
  relogio: { rotulo: 'Tempo', Componente: Clock3 },
  video: { rotulo: 'Vídeo', Componente: Video },
};

const FERRAMENTAS: Array<{
  id: TipoForma;
  rotulo: string;
  Componente: ComponentType<{ size?: number }>;
}> = [
  { id: 'livre', rotulo: 'Desenho livre', Componente: Pencil },
  { id: 'linha', rotulo: 'Linha', Componente: Minus },
  { id: 'seta', rotulo: 'Seta', Componente: ArrowUpRight },
  { id: 'circulo', rotulo: 'Círculo', Componente: Circle },
  { id: 'retangulo', rotulo: 'Retângulo', Componente: Square },
  { id: 'numero', rotulo: 'Número', Componente: Hash },
];

const VELOCIDADES = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

const DURACAO_PADRAO_EVENTO = 5;
const DURACAO_PADRAO_ANOTACAO = 5;

const CATEGORIA_VAZIA: FormularioCategoria = {
  id: null,
  nome: '',
  tipo: 'boa',
  icone: 'alvo',
  cor: '#087b5b',
  mostrarNaTimeline: true,
};

/* ============================================================
   FUNÇÕES AUXILIARES
============================================================ */

function obterToken(): string | null {
  return (
    localStorage.getItem('token') ||
    localStorage.getItem('accessToken') ||
    sessionStorage.getItem('token')
  );
}

function normalizarUrlVideo(url: string): string {
  if (!url) return '';

  if (
    url.startsWith('http://') ||
    url.startsWith('https://') ||
    url.startsWith('blob:')
  ) {
    return url;
  }

  return url.startsWith('/')
    ? `http://localhost:3000${url}`
    : `http://localhost:3000/${url}`;
}

function formatarData(data?: string | null): string {
  if (!data) return '--/--/----';

  const valor = new Date(data);

  return Number.isNaN(valor.getTime())
    ? data
    : valor.toLocaleDateString('pt-BR');
}

function converterDuracao(valor: string): number {
  const partes = valor.split(':').map(Number);

  if (partes.some(Number.isNaN)) return 0;

  if (partes.length === 3) {
    return partes[0] * 3600 + partes[1] * 60 + partes[2];
  }

  if (partes.length === 2) {
    return partes[0] * 60 + partes[1];
  }

  return Number(valor) || 0;
}

function formatarTempo(segundos: number): string {
  if (!Number.isFinite(segundos) || segundos < 0) {
    return '00:00';
  }

  const total = Math.floor(segundos);
  const horas = Math.floor(total / 3600);
  const minutos = Math.floor((total % 3600) / 60);
  const segs = total % 60;

  if (horas > 0) {
    return `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}:${String(segs).padStart(2, '0')}`;
  }

  return `${String(minutos).padStart(2, '0')}:${String(segs).padStart(2, '0')}`;
}

function obterNomeVideo(video: VideoPartida): string {
  return (
    video.titulo ||
    video.nome ||
    video.nomeArquivo ||
    'Vídeo da partida'
  );
}

function rotuloAvaliacao(tipo: TipoEvento): string {
  return AVALIACOES.find((item) => item.valor === tipo)?.rotulo ?? 'Neutra';
}

/** Converte o texto vindo do backend para o tipo usado na interface. */
function converterTipo(categoria: string): TipoEvento {
  const valor = categoria.toLowerCase().trim();

  if (
    valor === 'boa' ||
    valor === 'positiva' ||
    valor.includes('boa jogada')
  ) {
    return 'boa';
  }

  if (
    valor === 'ruim' ||
    valor === 'negativa' ||
    valor.includes('erro')
  ) {
    return 'ruim';
  }

  if (valor === 'destaque' || valor.includes('destaque')) {
    return 'destaque';
  }

  return 'neutra';
}

/** Converte o tipo da interface para o padrão aceito pelo backend. */
function converterTipoParaBackend(tipo: TipoEvento): string {
  const tipos: Record<TipoEvento, string> = {
    boa: 'POSITIVA',
    ruim: 'NEGATIVA',
    neutra: 'NEUTRA',
    destaque: 'DESTAQUE',
  };

  return tipos[tipo];
}

function converterCategoria(item: CategoriaBackend): Categoria {
  return {
    id: item.id,
    nome: item.nome,
    tipo: converterTipo(item.tipo || 'neutra'),
    icone: item.icone && ICONES_CATEGORIA[item.icone] ? item.icone : 'alvo',
    cor: item.cor || '#087b5b',
    mostrarNaTimeline: item.mostrarNaTimeline !== false,
  };
}

function converterEvento(registro: MarcacaoBackend): Evento {
  return {
    id: registro.id,
    nome: registro.titulo,
    descricao: registro.observacao || '',
    tipo: converterTipo(registro.avaliacao || registro.categoria),
    segundo: Number(registro.tempoInicio),
    duracao: Math.max(
      0,
      Number(registro.tempoFim) - Number(registro.tempoInicio),
    ),
    atletaId: registro.atletaId ?? registro.atleta?.id ?? null,
    atletaNome: registro.atleta?.nome ?? '',
    categoriaId: registro.categoriaId ?? null,
  };
}

function ehClipe(registro: MarcacaoBackend): boolean {
  return (
    (registro.tipoRegistro || '').toUpperCase() === 'CLIPE' ||
    registro.categoria.trim().toLowerCase() === 'clipe'
  );
}

function converterAnotacao(registro: AnotacaoBackend): Anotacao {
  let formas: Forma[] = [];

  if (Array.isArray(registro.formas)) {
    formas = registro.formas;
  } else if (typeof registro.formas === 'string') {
    try {
      formas = JSON.parse(registro.formas) as Forma[];
    } catch {
      formas = [];
    }
  }

  return {
    id: registro.id,
    tempo: Number(registro.tempo),
    duracao: Number(registro.duracao) || DURACAO_PADRAO_ANOTACAO,
    formas,
  };
}

function chaveDaCor(hex: string): string {
  return (
    PALETA_CATEGORIA.find(
      (cor) => cor.hex.toLowerCase() === hex.toLowerCase(),
    )?.chave ?? 'verde'
  );
}

function limitar(valor: number, minimo: number, maximo: number): number {
  return Math.min(maximo, Math.max(minimo, valor));
}

function posicaoNaTimeline(segundo: number, duracao: number): number {
  if (duracao <= 0) return 0;

  return limitar((segundo / duracao) * 100, 0, 100);
}

function alinhamentoDoBalao(porcentagem: number): string {
  if (porcentagem < 28) return styles.tooltipEsquerda;
  if (porcentagem > 72) return styles.tooltipDireita;

  return styles.tooltipCentro;
}

async function lerResposta<T>(resposta: Response): Promise<T> {
  const dados = await resposta.json().catch(() => ({}));

  if (resposta.status === 401) {
    window.location.href = '/login';
    throw new Error('Sua sessão expirou. Entre novamente.');
  }

  if (!resposta.ok) {
    const erro = dados as RespostaErro;

    throw new Error(
      erro.mensagem ||
        erro.erro ||
        'Não foi possível concluir a solicitação.',
    );
  }

  return dados as T;
}

/** Chamada autenticada à API. */
async function chamarApi<T>(
  caminho: string,
  opcoes: { metodo?: string; corpo?: unknown } = {},
): Promise<T> {
  const token = obterToken();

  if (!token) {
    window.location.href = '/login';
    throw new Error('Sua sessão expirou. Entre novamente.');
  }

  const resposta = await fetch(`${API_URL}${caminho}`, {
    method: opcoes.metodo ?? 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      ...(opcoes.corpo !== undefined
        ? { 'Content-Type': 'application/json' }
        : {}),
    },
    body:
      opcoes.corpo !== undefined ? JSON.stringify(opcoes.corpo) : undefined,
  });

  return lerResposta<T>(resposta);
}

function desenharForma(
  ctx: CanvasRenderingContext2D,
  forma: Forma,
  largura: number,
  altura: number,
) {
  const pontos = forma.pontos.map((ponto) => ({
    x: ponto.x * largura,
    y: ponto.y * altura,
  }));

  if (pontos.length === 0) return;

  ctx.save();
  ctx.strokeStyle = forma.cor;
  ctx.fillStyle = forma.cor;
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
  ctx.shadowBlur = 4;

  const inicio = pontos[0];
  const fim = pontos[pontos.length - 1];

  if (forma.tipo === 'livre') {
    ctx.beginPath();
    ctx.moveTo(inicio.x, inicio.y);
    pontos.slice(1).forEach((ponto) => ctx.lineTo(ponto.x, ponto.y));
    ctx.stroke();
  }

  if (forma.tipo === 'linha') {
    ctx.beginPath();
    ctx.moveTo(inicio.x, inicio.y);
    ctx.lineTo(fim.x, fim.y);
    ctx.stroke();
  }

  if (forma.tipo === 'seta') {
    const angulo = Math.atan2(fim.y - inicio.y, fim.x - inicio.x);
    const ponta = 16;

    ctx.beginPath();
    ctx.moveTo(inicio.x, inicio.y);
    ctx.lineTo(fim.x, fim.y);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(fim.x, fim.y);
    ctx.lineTo(
      fim.x - ponta * Math.cos(angulo - Math.PI / 7),
      fim.y - ponta * Math.sin(angulo - Math.PI / 7),
    );
    ctx.lineTo(
      fim.x - ponta * Math.cos(angulo + Math.PI / 7),
      fim.y - ponta * Math.sin(angulo + Math.PI / 7),
    );
    ctx.closePath();
    ctx.fill();
  }

  if (forma.tipo === 'circulo') {
    ctx.beginPath();
    ctx.ellipse(
      (inicio.x + fim.x) / 2,
      (inicio.y + fim.y) / 2,
      Math.max(1, Math.abs(fim.x - inicio.x) / 2),
      Math.max(1, Math.abs(fim.y - inicio.y) / 2),
      0,
      0,
      Math.PI * 2,
    );
    ctx.stroke();
  }

  if (forma.tipo === 'retangulo') {
    ctx.strokeRect(
      Math.min(inicio.x, fim.x),
      Math.min(inicio.y, fim.y),
      Math.abs(fim.x - inicio.x),
      Math.abs(fim.y - inicio.y),
    );
  }

  if (forma.tipo === 'numero') {
    ctx.beginPath();
    ctx.arc(inicio.x, inicio.y, 17, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowBlur = 0;
    ctx.fillStyle = '#10251f';
    ctx.font = '700 17px Poppins, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(forma.valor ?? ''), inicio.x, inicio.y + 1);
  }

  ctx.restore();
}

/* ============================================================
   COMPONENTES AUXILIARES
============================================================ */

function IconeCategoria({
  icone,
  tamanho = 18,
}: {
  icone: string;
  tamanho?: number;
}) {
  const Componente = (ICONES_CATEGORIA[icone] ?? ICONES_CATEGORIA.alvo)
    .Componente;

  return <Componente size={tamanho} />;
}

/* ============================================================
   PÁGINA
============================================================ */

export default function AnaliseVideos() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const palcoRef = useRef<HTMLDivElement | null>(null);
  const areaVideoRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const trechoFimRef = useRef<number | null>(null);
  const requisicaoEventosRef = useRef(0);

  /* ---------- dados ---------- */
  const [partidas, setPartidas] = useState<Partida[]>([]);
  const [escalacao, setEscalacao] = useState<AtletaPartida[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [clipes, setClipes] = useState<Clipe[]>([]);
  const [anotacoes, setAnotacoes] = useState<Anotacao[]>([]);

  /* ---------- carregamento ---------- */
  const [carregandoPartidas, setCarregandoPartidas] = useState(true);
  const [carregandoVideos, setCarregandoVideos] = useState(false);
  const [carregandoEventos, setCarregandoEventos] = useState(false);
  const [carregandoEscalacao, setCarregandoEscalacao] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [salvandoCategoria, setSalvandoCategoria] = useState(false);

  /* ---------- mensagens ---------- */
  const [mensagemErro, setMensagemErro] = useState('');
  const [mensagemSucesso, setMensagemSucesso] = useState('');

  /* ---------- seleção ---------- */
  const [partidaSelecionadaId, setPartidaSelecionadaId] = useState(0);
  const [videoSelecionadoId, setVideoSelecionadoId] = useState(0);

  /* ---------- player ---------- */
  const [tempoAtual, setTempoAtual] = useState(0);
  const [duracaoRealVideo, setDuracaoRealVideo] = useState(0);
  const [videoExecutando, setVideoExecutando] = useState(false);
  const [velocidade, setVelocidade] = useState(1);
  const [mutado, setMutado] = useState(false);
  const [telaCheia, setTelaCheia] = useState(false);
  const [mostrarVelocidades, setMostrarVelocidades] = useState(false);

  /* ---------- timeline ---------- */
  const [marcadorAtivo, setMarcadorAtivo] = useState<{
    tipo: 'evento' | 'anotacao';
    id: number;
  } | null>(null);

  /* ---------- janelas ---------- */
  const [mostrarCategorias, setMostrarCategorias] = useState(false);
  const [mostrarNovoEvento, setMostrarNovoEvento] = useState(false);
  const [mostrarClipe, setMostrarClipe] = useState(false);

  /* ---------- formulários ---------- */
  const [novoEvento, setNovoEvento] = useState({
    categoriaId: 0,
    atletaId: 0,
    descricao: '',
    tipo: 'boa' as TipoEvento,
    duracao: DURACAO_PADRAO_EVENTO,
  });

  const [novoClipe, setNovoClipe] = useState({
    nome: '',
    descricao: '',
    inicio: 0,
    fim: 10,
    atletaId: 0,
    categoriaId: 0,
    tipo: 'neutra' as TipoEvento,
  });

  const [formularioCategoria, setFormularioCategoria] =
    useState<FormularioCategoria>(CATEGORIA_VAZIA);
  const [categoriaParaExcluir, setCategoriaParaExcluir] = useState(0);

  /* ---------- desenho ---------- */
  const [ferramenta, setFerramenta] = useState<Ferramenta>('nenhuma');
  const [corDesenho, setCorDesenho] = useState(PALETA_DESENHO[0].hex);
  const [desenhoAtual, setDesenhoAtual] = useState<Forma[]>([]);
  const [formaTemporaria, setFormaTemporaria] = useState<Forma | null>(null);
  const [tempoDesenho, setTempoDesenho] = useState<number | null>(null);
  const [tamanhoCanvas, setTamanhoCanvas] = useState({
    largura: 0,
    altura: 0,
  });

  /* ============================================================
     DADOS DERIVADOS
  ============================================================ */

  const partidaSelecionada = useMemo(
    () =>
      partidas.find((partida) => partida.id === partidaSelecionadaId) ?? null,
    [partidas, partidaSelecionadaId],
  );

  const videosDaPartida = partidaSelecionada?.videos ?? [];

  const videoSelecionado = useMemo(
    () =>
      videosDaPartida.find((video) => video.id === videoSelecionadoId) ??
      videosDaPartida[0] ??
      null,
    [videosDaPartida, videoSelecionadoId],
  );

  const equipeIdDaPartida = partidaSelecionada?.equipeId ?? 0;

  const duracaoVideo =
    duracaoRealVideo ||
    (videoSelecionado?.duracao
      ? converterDuracao(videoSelecionado.duracao)
      : 0);

  const eventosOrdenados = useMemo(
    () => [...eventos].sort((a, b) => a.segundo - b.segundo),
    [eventos],
  );

  const categoriaPorId = useCallback(
    (id: number | null) =>
      id ? categorias.find((categoria) => categoria.id === id) : undefined,
    [categorias],
  );

  /** Só aparecem na timeline os eventos de categorias marcadas para isso. */
  const eventosNaTimeline = useMemo(
    () =>
      eventosOrdenados.filter(
        (evento) =>
          categoriaPorId(evento.categoriaId)?.mostrarNaTimeline !== false,
      ),
    [eventosOrdenados, categoriaPorId],
  );

  const anotacoesOrdenadas = useMemo(
    () => [...anotacoes].sort((a, b) => a.tempo - b.tempo),
    [anotacoes],
  );

  const formasVisiveis = useMemo(() => {
    const salvas = anotacoes
      .filter(
        (anotacao) =>
          tempoAtual >= anotacao.tempo &&
          tempoAtual <= anotacao.tempo + anotacao.duracao,
      )
      .flatMap((anotacao) => anotacao.formas);

    return [
      ...salvas,
      ...desenhoAtual,
      ...(formaTemporaria ? [formaTemporaria] : []),
    ];
  }, [anotacoes, tempoAtual, desenhoAtual, formaTemporaria]);

  const desenhando = ferramenta !== 'nenhuma';

  const eventoAtivo =
    marcadorAtivo?.tipo === 'evento'
      ? (eventos.find((evento) => evento.id === marcadorAtivo.id) ?? null)
      : null;

  const anotacaoAtiva =
    marcadorAtivo?.tipo === 'anotacao'
      ? (anotacoes.find((anotacao) => anotacao.id === marcadorAtivo.id) ??
        null)
      : null;

  /* ============================================================
     CARREGAMENTO DE DADOS
  ============================================================ */

  const carregarMarcacoes = useCallback(async (videoId: number) => {
    if (!videoId) {
      setEventos([]);
      setClipes([]);
      setAnotacoes([]);
      return;
    }

    const numeroRequisicao = ++requisicaoEventosRef.current;

    setCarregandoEventos(true);

    try {
      const [dadosMarcacoes, dadosAnotacoes] = await Promise.all([
        chamarApi<MarcacaoBackend[] | { marcacoes?: MarcacaoBackend[] }>(
          `/videos/${videoId}/marcacoes`,
        ),
        chamarApi<AnotacaoBackend[] | { anotacoes?: AnotacaoBackend[] }>(
          `/videos/${videoId}/anotacoes`,
        ).catch(() => [] as AnotacaoBackend[]),
      ]);

      if (numeroRequisicao !== requisicaoEventosRef.current) return;

      const listaMarcacoes = Array.isArray(dadosMarcacoes)
        ? dadosMarcacoes
        : (dadosMarcacoes.marcacoes ?? []);

      const listaAnotacoes = Array.isArray(dadosAnotacoes)
        ? dadosAnotacoes
        : (dadosAnotacoes.anotacoes ?? []);

      setEventos(
        listaMarcacoes
          .filter((registro) => !ehClipe(registro))
          .map(converterEvento),
      );

      setClipes(
        listaMarcacoes.filter(ehClipe).map((registro) => ({
          id: registro.id,
          nome: registro.titulo,
          inicio: Number(registro.tempoInicio),
          fim: Number(registro.tempoFim),
          descricao: registro.observacao || '',
          tipo: converterTipo(registro.avaliacao || 'neutra'),
          atletaNome: registro.atleta?.nome ?? '',
        })),
      );

      setAnotacoes(listaAnotacoes.map(converterAnotacao));
    } catch (erro) {
      if (numeroRequisicao !== requisicaoEventosRef.current) return;

      setEventos([]);
      setClipes([]);
      setAnotacoes([]);

      setMensagemErro(
        erro instanceof Error
          ? erro.message
          : 'Erro ao carregar as marcações.',
      );
    } finally {
      if (numeroRequisicao === requisicaoEventosRef.current) {
        setCarregandoEventos(false);
      }
    }
  }, []);

  /* Categorias da equipe (inclui as personalizadas) */
  useEffect(() => {
    let ativo = true;

    async function carregarCategorias() {
      try {
        const consulta = equipeIdDaPartida
          ? `?equipeId=${equipeIdDaPartida}`
          : '';

        const dados = await chamarApi<{
          configuracoes?: CategoriaBackend[];
          campos?: CategoriaBackend[];
        }>(`/configuracao-analise${consulta}`);

        if (!ativo) return;

        const lista = Array.isArray(dados)
          ? (dados as CategoriaBackend[])
          : (dados.configuracoes ?? dados.campos ?? []);

        setCategorias(lista.map(converterCategoria));
      } catch (erro) {
        if (!ativo) return;

        console.error('Erro ao carregar categorias de análise:', erro);
        setCategorias([]);
        setMensagemErro(
          erro instanceof Error
            ? erro.message
            : 'Erro ao carregar as categorias de análise.',
        );
      }
    }

    void carregarCategorias();

    return () => {
      ativo = false;
    };
  }, [equipeIdDaPartida]);

  /* Partidas */
  useEffect(() => {
    let ativo = true;

    async function carregarPartidas() {
      try {
        setCarregandoPartidas(true);

        const dados = await chamarApi<
          PartidaBackend[] | { partidas?: PartidaBackend[] }
        >('/partidas');

        if (!ativo) return;

        const lista = Array.isArray(dados) ? dados : (dados.partidas ?? []);

        const formatadas: Partida[] = lista.map((partida) => ({
          id: partida.id,
          equipeId: partida.equipe?.id ?? 0,
          equipe: partida.equipe?.nome || 'Minha equipe',
          adversario: partida.adversario || 'Adversário',
          data: formatarData(partida.data),
          modalidade: partida.equipe?.modalidade || 'Esporte',
          videos: [],
        }));

        setPartidas(formatadas);
        setPartidaSelecionadaId(formatadas[0]?.id || 0);
      } catch (erro) {
        if (!ativo) return;

        setPartidas([]);
        setPartidaSelecionadaId(0);
        setMensagemErro(
          erro instanceof Error
            ? erro.message
            : 'Erro ao carregar partidas.',
        );
      } finally {
        if (ativo) setCarregandoPartidas(false);
      }
    }

    void carregarPartidas();

    return () => {
      ativo = false;
    };
  }, []);

  /* Vídeos e escalação da partida selecionada */
  useEffect(() => {
    let ativo = true;

    async function carregarVideos() {
      if (!partidaSelecionadaId) {
        setVideoSelecionadoId(0);
        setEventos([]);
        setClipes([]);
        setAnotacoes([]);
        return;
      }

      try {
        setCarregandoVideos(true);
        setMensagemErro('');
        setVideoSelecionadoId(0);
        setEventos([]);
        setClipes([]);
        setAnotacoes([]);
        setTempoAtual(0);
        setDuracaoRealVideo(0);
        trechoFimRef.current = null;

        videoRef.current?.pause();

        const dados = await chamarApi<
          VideoPartida[] | { videos?: VideoPartida[] }
        >(`/partidas/${partidaSelecionadaId}/videos`);

        if (!ativo) return;

        const lista = Array.isArray(dados) ? dados : (dados.videos ?? []);

        const formatados = lista.map((video) => ({
          ...video,
          nome:
            video.titulo ||
            video.nome ||
            video.nomeArquivo ||
            'Vídeo da partida',
          url: normalizarUrlVideo(video.url),
        }));

        setPartidas((atuais) =>
          atuais.map((partida) =>
            partida.id === partidaSelecionadaId
              ? { ...partida, videos: formatados }
              : partida,
          ),
        );

        setVideoSelecionadoId(formatados[0]?.id || 0);
      } catch (erro) {
        if (!ativo) return;

        setVideoSelecionadoId(0);
        setMensagemErro(
          erro instanceof Error
            ? erro.message
            : 'Erro ao carregar vídeos.',
        );
      } finally {
        if (ativo) setCarregandoVideos(false);
      }
    }

    async function carregarEscalacao() {
      if (!partidaSelecionadaId) {
        setEscalacao([]);
        return;
      }

      try {
        setCarregandoEscalacao(true);

        const dados = await chamarApi<
          | AtletaPartida[]
          | { atletas?: AtletaPartida[]; escalacao?: AtletaPartida[] }
        >(`/partidas/${partidaSelecionadaId}/escalacao`);

        if (!ativo) return;

        const lista = Array.isArray(dados)
          ? dados
          : (dados.atletas ?? dados.escalacao ?? []);

        /* Somente atletas da partida que realmente jogaram */
        setEscalacao(lista.filter((atleta) => atleta.participou !== false));
      } catch (erro) {
        if (!ativo) return;

        setEscalacao([]);
        setMensagemErro(
          erro instanceof Error
            ? erro.message
            : 'Erro ao carregar a escalação da partida.',
        );
      } finally {
        if (ativo) setCarregandoEscalacao(false);
      }
    }

    void carregarVideos();
    void carregarEscalacao();

    return () => {
      ativo = false;
    };
  }, [partidaSelecionadaId]);

  /* Marcações do vídeo selecionado */
  useEffect(() => {
    if (videoSelecionadoId) {
      void carregarMarcacoes(videoSelecionadoId);
    } else {
      setEventos([]);
      setClipes([]);
      setAnotacoes([]);
    }

    setTempoAtual(0);
    setDuracaoRealVideo(0);
    setFerramenta('nenhuma');
    setDesenhoAtual([]);
    setFormaTemporaria(null);
    setTempoDesenho(null);
    trechoFimRef.current = null;
  }, [videoSelecionadoId, carregarMarcacoes]);

  /* Tela cheia */
  useEffect(() => {
    function atualizarTelaCheia() {
      setTelaCheia(Boolean(document.fullscreenElement));
    }

    document.addEventListener('fullscreenchange', atualizarTelaCheia);

    return () => {
      document.removeEventListener('fullscreenchange', atualizarTelaCheia);
    };
  }, []);

  /* Tamanho do canvas acompanha a área do vídeo (inclusive em tela cheia) */
  useEffect(() => {
    const area = areaVideoRef.current;

    if (!area) return;

    function medir() {
      if (!area) return;

      setTamanhoCanvas({
        largura: Math.round(area.clientWidth),
        altura: Math.round(area.clientHeight),
      });
    }

    medir();

    const observador = new ResizeObserver(medir);
    observador.observe(area);

    return () => observador.disconnect();
  }, [videoSelecionadoId, telaCheia]);

  /* Redesenha o canvas sempre que as formas ou o tamanho mudam */
  useEffect(() => {
    const canvas = canvasRef.current;
    const contexto = canvas?.getContext('2d');

    if (!canvas || !contexto) return;

    contexto.clearRect(0, 0, canvas.width, canvas.height);

    formasVisiveis.forEach((forma) =>
      desenharForma(contexto, forma, canvas.width, canvas.height),
    );
  }, [formasVisiveis, tamanhoCanvas]);

  /* ============================================================
     PLAYER
  ============================================================ */

  function limparPlayer() {
    setTempoAtual(0);
    setDuracaoRealVideo(0);
    trechoFimRef.current = null;
    videoRef.current?.pause();
  }

  function trocarPartida(id: number) {
    setPartidaSelecionadaId(id);
    setVideoSelecionadoId(0);
    setEventos([]);
    setClipes([]);
    setAnotacoes([]);
    limparPlayer();
  }

  function trocarVideo(id: number) {
    setVideoSelecionadoId(id);
    setEventos([]);
    setClipes([]);
    setAnotacoes([]);
    limparPlayer();
  }

  function alternarVideo() {
    const video = videoRef.current;

    if (!video) return;

    if (video.paused) {
      void video.play().catch((erro) => {
        console.error('Erro ao reproduzir vídeo:', erro);
        setMensagemErro('Não foi possível reproduzir este vídeo.');
      });
    } else {
      video.pause();
    }
  }

  function voltarDezSegundos() {
    const video = videoRef.current;
    if (!video) return;

    trechoFimRef.current = null;
    video.currentTime = Math.max(0, video.currentTime - 10);
    setTempoAtual(video.currentTime);
  }

  function avancarDezSegundos() {
    const video = videoRef.current;
    if (!video) return;

    trechoFimRef.current = null;
    video.currentTime = Math.min(
      video.duration || duracaoVideo,
      video.currentTime + 10,
    );
    setTempoAtual(video.currentTime);
  }

  function alternarMute() {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setMutado(video.muted);
  }

  function alterarVelocidade(novaVelocidade: number) {
    setVelocidade(novaVelocidade);

    if (videoRef.current) {
      videoRef.current.playbackRate = novaVelocidade;
    }

    setMostrarVelocidades(false);
  }

  /** A tela cheia é aplicada ao palco inteiro (vídeo + timeline + ferramentas). */
  async function alternarTelaCheia() {
    const elemento = palcoRef.current;
    if (!elemento) return;

    try {
      if (!document.fullscreenElement) {
        await elemento.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (erro) {
      console.error('Erro ao alternar tela cheia:', erro);
    }
  }

  function alterarTempo(event: ChangeEvent<HTMLInputElement>) {
    const novoTempo = Number(event.target.value);

    trechoFimRef.current = null;
    setTempoAtual(novoTempo);

    if (videoRef.current) {
      videoRef.current.currentTime = novoTempo;
    }
  }

  function irParaEvento(segundo: number, fim?: number) {
    const video = videoRef.current;
    if (!video) return;

    const inicioSeguro = Math.max(0, segundo);

    trechoFimRef.current =
      typeof fim === 'number' && fim > inicioSeguro ? fim : null;

    video.currentTime = inicioSeguro;
    setTempoAtual(inicioSeguro);

    void video.play().catch((erro) => {
      console.error('Erro ao reproduzir a marcação:', erro);
      setMensagemErro('Não foi possível reproduzir este trecho.');
    });
  }

  function irParaMomento(segundo: number) {
    const video = videoRef.current;
    if (!video) return;

    trechoFimRef.current = null;
    video.pause();
    video.currentTime = Math.max(0, segundo);
    setTempoAtual(video.currentTime);
  }

  /* ============================================================
     DESENHOS E ANOTAÇÕES
  ============================================================ */

  function selecionarFerramenta(nova: Ferramenta) {
    const proxima = ferramenta === nova ? 'nenhuma' : nova;

    setFerramenta(proxima);

    if (proxima !== 'nenhuma') {
      videoRef.current?.pause();
    }
  }

  function pontoDoPonteiro(
    event: ReactPointerEvent<HTMLCanvasElement>,
  ): Ponto {
    const caixa = event.currentTarget.getBoundingClientRect();

    return {
      x: limitar((event.clientX - caixa.left) / caixa.width, 0, 1),
      y: limitar((event.clientY - caixa.top) / caixa.height, 0, 1),
    };
  }

  function iniciarDesenho(event: ReactPointerEvent<HTMLCanvasElement>) {
    if (ferramenta === 'nenhuma') return;

    event.currentTarget.setPointerCapture(event.pointerId);

    const ponto = pontoDoPonteiro(event);

    if (tempoDesenho === null) {
      setTempoDesenho(videoRef.current?.currentTime ?? tempoAtual);
    }

    if (ferramenta === 'numero') {
      const proximoNumero =
        desenhoAtual.filter((forma) => forma.tipo === 'numero').length + 1;

      setDesenhoAtual((atuais) => [
        ...atuais,
        {
          tipo: 'numero',
          cor: corDesenho,
          pontos: [ponto],
          valor: proximoNumero,
        },
      ]);

      return;
    }

    setFormaTemporaria({
      tipo: ferramenta,
      cor: corDesenho,
      pontos: ferramenta === 'livre' ? [ponto] : [ponto, ponto],
    });
  }

  function moverDesenho(event: ReactPointerEvent<HTMLCanvasElement>) {
    if (!formaTemporaria) return;

    const ponto = pontoDoPonteiro(event);

    setFormaTemporaria((atual) => {
      if (!atual) return atual;

      if (atual.tipo === 'livre') {
        return { ...atual, pontos: [...atual.pontos, ponto] };
      }

      return { ...atual, pontos: [atual.pontos[0], ponto] };
    });
  }

  function finalizarForma() {
    if (!formaTemporaria) return;

    const [primeiro, ultimo] = [
      formaTemporaria.pontos[0],
      formaTemporaria.pontos[formaTemporaria.pontos.length - 1],
    ];

    const moveu =
      Math.abs(primeiro.x - ultimo.x) > 0.004 ||
      Math.abs(primeiro.y - ultimo.y) > 0.004 ||
      formaTemporaria.pontos.length > 3;

    if (moveu) {
      setDesenhoAtual((atuais) => [...atuais, formaTemporaria]);
    }

    setFormaTemporaria(null);
  }

  function desfazerDesenho() {
    setDesenhoAtual((atuais) => atuais.slice(0, -1));
  }

  function descartarDesenho() {
    setDesenhoAtual([]);
    setFormaTemporaria(null);
    setTempoDesenho(null);
    setFerramenta('nenhuma');
  }

  async function salvarAnotacao() {
    if (!videoSelecionadoId || desenhoAtual.length === 0) {
      setMensagemErro('Faça ao menos um desenho antes de salvar.');
      return;
    }

    setSalvando(true);
    setMensagemErro('');
    setMensagemSucesso('');

    try {
      await chamarApi(`/videos/${videoSelecionadoId}/anotacoes`, {
        metodo: 'POST',
        corpo: {
          partidaId: partidaSelecionadaId,
          tempo: tempoDesenho ?? tempoAtual,
          duracao: DURACAO_PADRAO_ANOTACAO,
          formas: desenhoAtual,
        },
      });

      await carregarMarcacoes(videoSelecionadoId);

      setMensagemSucesso('Desenho salvo no momento do vídeo.');
      descartarDesenho();
    } catch (erro) {
      setMensagemErro(
        erro instanceof Error ? erro.message : 'Erro ao salvar o desenho.',
      );
    } finally {
      setSalvando(false);
    }
  }

  async function excluirAnotacao(id: number) {
    setMensagemErro('');
    setMensagemSucesso('');

    try {
      await chamarApi(`/anotacoes/${id}`, { metodo: 'DELETE' });

      setAnotacoes((atuais) => atuais.filter((item) => item.id !== id));
      setMensagemSucesso('Desenho excluído.');
    } catch (erro) {
      setMensagemErro(
        erro instanceof Error ? erro.message : 'Erro ao excluir o desenho.',
      );
    }
  }

  /* ============================================================
     CATEGORIAS (ADICIONAR, EDITAR, EXCLUIR)
  ============================================================ */

  function novaCategoria() {
    setFormularioCategoria(CATEGORIA_VAZIA);
    setCategoriaParaExcluir(0);
  }

  function editarCategoria(categoria: Categoria) {
    setFormularioCategoria({
      id: categoria.id,
      nome: categoria.nome,
      tipo: categoria.tipo,
      icone: categoria.icone,
      cor: categoria.cor,
      mostrarNaTimeline: categoria.mostrarNaTimeline,
    });
    setCategoriaParaExcluir(0);
  }

  async function salvarCategoria(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();

    const nome = formularioCategoria.nome.trim();

    if (!nome) {
      setMensagemErro('Digite o nome da categoria.');
      return;
    }

    if (
      categorias.some(
        (categoria) =>
          categoria.nome.toLowerCase() === nome.toLowerCase() &&
          categoria.id !== formularioCategoria.id,
      )
    ) {
      setMensagemErro('Já existe uma categoria com esse nome.');
      return;
    }

    setSalvandoCategoria(true);
    setMensagemErro('');
    setMensagemSucesso('');

    const corpo = {
      nome,
      tipo: converterTipoParaBackend(formularioCategoria.tipo),
      icone: formularioCategoria.icone,
      cor: formularioCategoria.cor,
      mostrarNaTimeline: formularioCategoria.mostrarNaTimeline,
      equipeId: equipeIdDaPartida || undefined,
    };

    try {
      const editando = formularioCategoria.id !== null;

      const dados = await chamarApi<RespostaCategoria>(
        editando
          ? `/configuracao-analise/${formularioCategoria.id}`
          : '/configuracao-analise',
        { metodo: editando ? 'PUT' : 'POST', corpo },
      );

      const salva = dados.configuracao ?? dados.campo;

      if (!salva) {
        throw new Error(
          'A API não retornou a categoria salva. Confira o formato da resposta do backend.',
        );
      }

      const convertida = converterCategoria(salva);

      setCategorias((atuais) =>
        editando
          ? atuais.map((item) => (item.id === convertida.id ? convertida : item))
          : [...atuais, convertida],
      );

      setFormularioCategoria(CATEGORIA_VAZIA);
      setMensagemSucesso(
        editando ? 'Categoria atualizada.' : 'Categoria criada com sucesso.',
      );
    } catch (erro) {
      setMensagemErro(
        erro instanceof Error ? erro.message : 'Erro ao salvar a categoria.',
      );
    } finally {
      setSalvandoCategoria(false);
    }
  }

  async function excluirCategoria(id: number) {
    setSalvandoCategoria(true);
    setMensagemErro('');
    setMensagemSucesso('');

    try {
      await chamarApi(`/configuracao-analise/${id}`, { metodo: 'DELETE' });

      setCategorias((atuais) => atuais.filter((item) => item.id !== id));
      setCategoriaParaExcluir(0);

      if (formularioCategoria.id === id) {
        setFormularioCategoria(CATEGORIA_VAZIA);
      }

      setMensagemSucesso('Categoria excluída.');
    } catch (erro) {
      setMensagemErro(
        erro instanceof Error ? erro.message : 'Erro ao excluir a categoria.',
      );
    } finally {
      setSalvandoCategoria(false);
    }
  }

  /* ============================================================
     EVENTOS
  ============================================================ */

  function abrirNovoEvento(categoria?: Categoria) {
    setNovoEvento({
      categoriaId: categoria?.id ?? 0,
      atletaId: 0,
      descricao: '',
      tipo: categoria?.tipo ?? 'boa',
      duracao: DURACAO_PADRAO_EVENTO,
    });

    setMostrarCategorias(false);
    setMostrarNovoEvento(true);
  }

  function selecionarCategoriaDoEvento(id: number) {
    const categoria = categoriaPorId(id);

    setNovoEvento((atual) => ({
      ...atual,
      categoriaId: id,
      tipo: categoria?.tipo ?? atual.tipo,
    }));
  }

  async function adicionarEvento() {
    if (!videoSelecionadoId) {
      setMensagemErro('Selecione um vídeo antes de marcar um evento.');
      return;
    }

    /* Regra: todo evento exige um atleta que jogou a partida */
    if (!novoEvento.atletaId) {
      setMensagemErro('Selecione o atleta que participou deste lance.');
      return;
    }

    const categoria = categoriaPorId(novoEvento.categoriaId);

    if (!categoria) {
      setMensagemErro('Selecione uma categoria de análise.');
      return;
    }

    const inicio = Math.max(0, tempoAtual);
    const fim = Math.max(
      inicio + 1,
      Math.min(
        duracaoVideo || inicio + novoEvento.duracao,
        inicio + novoEvento.duracao,
      ),
    );

    setSalvando(true);
    setMensagemErro('');
    setMensagemSucesso('');

    try {
      await chamarApi(`/videos/${videoSelecionadoId}/marcacoes`, {
        metodo: 'POST',
        corpo: {
          tipoRegistro: 'EVENTO',
          partidaId: partidaSelecionadaId,
          atletaId: novoEvento.atletaId,
          categoriaId: categoria.id,
          titulo: categoria.nome,
          categoria: converterTipoParaBackend(novoEvento.tipo),
          avaliacao: converterTipoParaBackend(novoEvento.tipo),
          tempoInicio: inicio,
          tempoFim: fim,
          observacao: novoEvento.descricao.trim(),
        },
      });

      await carregarMarcacoes(videoSelecionadoId);

      setMensagemSucesso('Evento salvo e vinculado ao atleta.');
      setMostrarNovoEvento(false);
    } catch (erro) {
      setMensagemErro(
        erro instanceof Error ? erro.message : 'Erro ao salvar o evento.',
      );
    } finally {
      setSalvando(false);
    }
  }

  /* ============================================================
     CLIPES
  ============================================================ */

  function abrirNovoClipe() {
    const inicio = Math.max(0, tempoAtual);

    setNovoClipe({
      nome: '',
      descricao: '',
      inicio,
      fim: Math.max(inicio + 1, Math.min(duracaoVideo || inicio + 10, inicio + 10)),
      atletaId: 0,
      categoriaId: 0,
      tipo: 'neutra',
    });

    setMostrarClipe(true);
  }

  async function adicionarClipe() {
    if (!videoSelecionadoId) {
      setMensagemErro('Selecione um vídeo antes de criar um clipe.');
      return;
    }

    if (!novoClipe.nome.trim()) {
      setMensagemErro('Digite um nome para o clipe.');
      return;
    }

    if (novoClipe.fim <= novoClipe.inicio) {
      setMensagemErro('O fim do clipe precisa ser depois do início.');
      return;
    }

    setSalvando(true);
    setMensagemErro('');
    setMensagemSucesso('');

    try {
      /* O atleta é opcional no clipe (diferente dos eventos) */
      await chamarApi(`/videos/${videoSelecionadoId}/marcacoes`, {
        metodo: 'POST',
        corpo: {
          tipoRegistro: 'CLIPE',
          partidaId: partidaSelecionadaId,
          atletaId: novoClipe.atletaId || null,
          categoriaId: novoClipe.categoriaId || null,
          titulo: novoClipe.nome.trim(),
          categoria: 'Clipe',
          avaliacao: converterTipoParaBackend(novoClipe.tipo),
          tempoInicio: novoClipe.inicio,
          tempoFim: novoClipe.fim,
          duracao: novoClipe.fim - novoClipe.inicio,
          observacao: novoClipe.descricao.trim(),
        },
      });

      await carregarMarcacoes(videoSelecionadoId);

      setMensagemSucesso('Clipe salvo no banco de dados.');
      setMostrarClipe(false);
    } catch (erro) {
      setMensagemErro(
        erro instanceof Error ? erro.message : 'Erro ao salvar o clipe.',
      );
    } finally {
      setSalvando(false);
    }
  }

  /* ============================================================
     BLOCOS REUTILIZADOS NO JSX
  ============================================================ */

  const textoMensagem = mensagemErro || mensagemSucesso;

  const classeMensagem = mensagemErro
    ? styles.messageError
    : styles.messageSuccess;

  function fecharMensagem() {
    setMensagemErro('');
    setMensagemSucesso('');
  }

  const botoesAvaliacao = (
    valorAtual: TipoEvento,
    aoSelecionar: (tipo: TipoEvento) => void,
  ) => (
    <div className={styles.ratingGrid}>
      {AVALIACOES.map((avaliacao) => (
        <button
          key={avaliacao.valor}
          type="button"
          className={`${styles.ratingButton} ${
            valorAtual === avaliacao.valor ? styles.ratingButtonActive : ''
          }`}
          onClick={() => aoSelecionar(avaliacao.valor)}
        >
          <span
            className={`${styles.ratingDot} ${styles[`ratingDot_${avaliacao.valor}`]}`}
          />
          {avaliacao.rotulo}
        </button>
      ))}
    </div>
  );

  const nomeDoAtleta = (atleta: AtletaPartida) =>
    `${atleta.numero ? `${atleta.numero} · ` : ''}${atleta.nome}${
      atleta.posicao ? ` (${atleta.posicao})` : ''
    }`;

  /* ============================================================
     RENDERIZAÇÃO
  ============================================================ */

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <div>
          <div className={styles.titleArea}>
            <h1>
              Análise de <em>vídeo</em>
            </h1>
          </div>

          <div className={styles.videoSelectors}>
            <div className={styles.videoSelectorGroup}>
              <label htmlFor="partida">Partida</label>
              <select
                id="partida"
                value={partidaSelecionadaId}
                onChange={(event) => trocarPartida(Number(event.target.value))}
                className={styles.matchSelector}
                disabled={carregandoPartidas || partidas.length === 0}
              >
                {partidas.length === 0 ? (
                  <option value={0}>
                    {carregandoPartidas
                      ? 'Carregando partidas...'
                      : 'Nenhuma partida'}
                  </option>
                ) : (
                  partidas.map((partida) => (
                    <option key={partida.id} value={partida.id}>
                      {partida.equipe} x {partida.adversario}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div className={styles.videoSelectorGroup}>
              <label htmlFor="video">Vídeo da partida</label>
              <select
                id="video"
                value={videoSelecionadoId}
                onChange={(event) => trocarVideo(Number(event.target.value))}
                className={styles.matchSelector}
                disabled={carregandoVideos || videosDaPartida.length === 0}
              >
                {carregandoVideos ? (
                  <option value={0}>Carregando vídeos...</option>
                ) : videosDaPartida.length === 0 ? (
                  <option value={0}>Nenhum vídeo</option>
                ) : (
                  videosDaPartida.map((video) => (
                    <option key={video.id} value={video.id}>
                      {obterNomeVideo(video)}
                    </option>
                  ))
                )}
              </select>
            </div>

            {(carregandoPartidas || carregandoVideos) && (
              <LoadingState variant="inline" title={carregandoPartidas ? 'Carregando partidas...' : 'Carregando vídeos...'} />
            )}

            {partidaSelecionada && (
              <div className={styles.matchDetails}>
                <span>{partidaSelecionada.data}</span>
                <i />
                <span>{partidaSelecionada.modalidade}</span>
                <i />
                <span>
                  {carregandoEscalacao
                    ? <LoadingState variant="inline" title="Carregando escalação..." />
                    : `${escalacao.length} ${
                        escalacao.length === 1 ? 'atleta' : 'atletas'
                      } na partida`}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className={styles.headerActions}>
          <button
            type="button"
            className={styles.manageCategoriesButton}
            onClick={() => {
              novaCategoria();
              setMostrarCategorias(true);
            }}
          >
            <Plus size={16} />
            Categorias
          </button>

          <button
            type="button"
            className={styles.actionButtonRed}
            onClick={abrirNovoClipe}
            disabled={!videoSelecionado}
          >
            <Scissors size={16} />
            Criar clipe
          </button>

          <button
            type="button"
            className={styles.actionButtonGreen}
            onClick={() => abrirNovoEvento()}
            disabled={!videoSelecionado}
          >
            <Plus size={16} />
            Marcar evento
          </button>
        </div>
      </header>

      {textoMensagem && !telaCheia && (
        <div role="status" className={`${styles.messageBox} ${classeMensagem}`}>
          <span className={styles.messageText}>{textoMensagem}</span>

          <button
            type="button"
            aria-label="Fechar mensagem"
            className={styles.messageClose}
            onClick={fecharMensagem}
          >
            <X size={16} />
          </button>
        </div>
      )}

      <div className={styles.analysisGrid}>
        <div className={styles.leftColumn}>
          <section className={styles.videoCard}>
            {/* PALCO: é este elemento que entra em tela cheia */}
            <div
              ref={palcoRef}
              className={`${styles.videoStage} ${
                telaCheia ? styles.videoStageFullscreen : ''
              }`}
            >
              <div ref={areaVideoRef} className={styles.videoArea}>
                {videoSelecionado?.url ? (
                  <video
                    key={videoSelecionado.id}
                    ref={videoRef}
                    src={videoSelecionado.url}
                    preload="metadata"
                    playsInline
                    className={styles.videoElement}
                    onTimeUpdate={(event) => {
                      const video = event.currentTarget;
                      setTempoAtual(video.currentTime);

                      if (
                        trechoFimRef.current !== null &&
                        video.currentTime >= trechoFimRef.current
                      ) {
                        video.pause();
                        video.currentTime = trechoFimRef.current;
                        setTempoAtual(trechoFimRef.current);
                        trechoFimRef.current = null;
                      }
                    }}
                    onSeeked={(event) =>
                      setTempoAtual(event.currentTarget.currentTime)
                    }
                    onLoadedMetadata={(event) => {
                      const video = event.currentTarget;
                      setDuracaoRealVideo(
                        Number.isFinite(video.duration) ? video.duration : 0,
                      );
                      video.playbackRate = velocidade;
                      video.muted = mutado;
                    }}
                    onPlay={() => {
                      setVideoExecutando(true);

                      if (videoRef.current) {
                        videoRef.current.playbackRate = velocidade;
                      }
                    }}
                    onPause={() => setVideoExecutando(false)}
                    onEnded={() => {
                      setVideoExecutando(false);
                      trechoFimRef.current = null;
                    }}
                    onVolumeChange={(event) =>
                      setMutado(event.currentTarget.muted)
                    }
                    onError={() => {
                      setMensagemErro(
                        'Não foi possível carregar o arquivo de vídeo. Verifique o endereço e o arquivo no servidor.',
                      );
                    }}
                  />
                ) : (
                  <div className={styles.videoEmpty}>
                    <Video size={42} />
                    {carregandoVideos ? (
                      <LoadingState variant="inline" title="Carregando vídeo..." />
                    ) : (
                      <span>Nenhum vídeo disponível para esta partida</span>
                    )}
                  </div>
                )}

                {/* Camada de desenho sobre o vídeo */}
                {videoSelecionado && (
                  <canvas
                    ref={canvasRef}
                    width={tamanhoCanvas.largura}
                    height={tamanhoCanvas.altura}
                    className={
                      desenhando ? styles.drawCanvasActive : styles.drawCanvas
                    }
                    onPointerDown={iniciarDesenho}
                    onPointerMove={moverDesenho}
                    onPointerUp={finalizarForma}
                    onPointerCancel={finalizarForma}
                  />
                )}

                {textoMensagem && telaCheia && (
                  <div
                    role="status"
                    className={`${styles.stageToast} ${classeMensagem}`}
                  >
                    <span className={styles.messageText}>{textoMensagem}</span>

                    <button
                      type="button"
                      aria-label="Fechar mensagem"
                      className={styles.messageClose}
                      onClick={fecharMensagem}
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}

                {videoSelecionado && (
                  <div className={styles.videoControls}>
                    <button
                      type="button"
                      title="Voltar 10 segundos"
                      onClick={voltarDezSegundos}
                      className={styles.controlButton}
                    >
                      <RotateCcw size={19} />
                    </button>

                    <button
                      type="button"
                      title={videoExecutando ? 'Pausar' : 'Reproduzir'}
                      onClick={alternarVideo}
                      className={`${styles.controlButton} ${styles.controlButtonPlay}`}
                    >
                      {videoExecutando ? (
                        <Pause size={21} fill="currentColor" />
                      ) : (
                        <Play size={21} fill="currentColor" />
                      )}
                    </button>

                    <button
                      type="button"
                      title="Avançar 10 segundos"
                      onClick={avancarDezSegundos}
                      className={styles.controlButton}
                    >
                      <RotateCw size={19} />
                    </button>

                    <button
                      type="button"
                      title={mutado ? 'Ativar som' : 'Silenciar'}
                      onClick={alternarMute}
                      className={styles.controlButton}
                    >
                      {mutado ? <VolumeX size={20} /> : <Volume2 size={20} />}
                    </button>

                    <span className={styles.controlTime}>
                      {formatarTempo(tempoAtual)} /{' '}
                      {formatarTempo(duracaoVideo)}
                    </span>

                    <div className={styles.controlSpacer} />

                    <div className={styles.speedWrapper}>
                      <button
                        type="button"
                        title="Velocidade"
                        onClick={() =>
                          setMostrarVelocidades((atual) => !atual)
                        }
                        className={`${styles.controlButton} ${styles.speedButton}`}
                      >
                        {velocidade}x
                      </button>

                      {mostrarVelocidades && (
                        <div className={styles.speedMenu}>
                          {VELOCIDADES.map((valor) => (
                            <button
                              key={valor}
                              type="button"
                              onClick={() => alterarVelocidade(valor)}
                              className={`${styles.speedOption} ${
                                velocidade === valor
                                  ? styles.speedOptionActive
                                  : ''
                              }`}
                            >
                              {valor}x
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      title={telaCheia ? 'Sair da tela cheia' : 'Tela cheia'}
                      onClick={() => void alternarTelaCheia()}
                      className={styles.controlButton}
                    >
                      {telaCheia ? (
                        <Minimize size={19} />
                      ) : (
                        <Maximize size={19} />
                      )}
                    </button>
                  </div>
                )}

                {videoSelecionado && !videoExecutando && !desenhando && (
                  <button
                    type="button"
                    className={styles.playButton}
                    onClick={alternarVideo}
                    aria-label="Reproduzir vídeo"
                  >
                    <Play size={29} fill="currentColor" />
                  </button>
                )}
              </div>

              {/* TIMELINE COM AS MARCAÇÕES */}
              <div className={styles.timelineArea}>
                {(eventoAtivo || anotacaoAtiva) && (
                  <div
                    role="tooltip"
                    className={`${styles.markerTooltip} ${alinhamentoDoBalao(
                      posicaoNaTimeline(
                        eventoAtivo?.segundo ?? anotacaoAtiva?.tempo ?? 0,
                        duracaoVideo,
                      ),
                    )}`}
                  >
                    {eventoAtivo && (
                      <>
                        <div className={styles.tooltipTop}>
                          <strong>{eventoAtivo.nome}</strong>
                          <span
                            className={`${styles.tooltipBadge} ${styles[`badge_${eventoAtivo.tipo}`]}`}
                          >
                            {rotuloAvaliacao(eventoAtivo.tipo)}
                          </span>
                        </div>

                        <span className={styles.tooltipLine}>
                          {eventoAtivo.atletaNome || 'Sem atleta'} ·{' '}
                          {formatarTempo(eventoAtivo.segundo)} ·{' '}
                          {eventoAtivo.duracao.toFixed(0)}s
                        </span>

                        {eventoAtivo.descricao && (
                          <span className={styles.tooltipNote}>
                            {eventoAtivo.descricao}
                          </span>
                        )}
                      </>
                    )}

                    {anotacaoAtiva && (
                      <>
                        <div className={styles.tooltipTop}>
                          <strong>Desenho no vídeo</strong>
                        </div>
                        <span className={styles.tooltipLine}>
                          {anotacaoAtiva.formas.length}{' '}
                          {anotacaoAtiva.formas.length === 1
                            ? 'marcação'
                            : 'marcações'}{' '}
                          · {formatarTempo(anotacaoAtiva.tempo)}
                        </span>
                      </>
                    )}
                  </div>
                )}

                <div className={styles.timelineTrackWrapper}>
                  <input
                    type="range"
                    min="0"
                    max={duracaoVideo || 1}
                    step="0.1"
                    value={Math.min(tempoAtual, duracaoVideo || 1)}
                    onChange={alterarTempo}
                    className={styles.videoRange}
                    aria-label="Posição do vídeo"
                  />

                  <div className={styles.analysisMarkers}>
                    <svg
                      className={styles.markersSvg}
                      width="100%"
                      height="22"
                      role="group"
                      aria-label="Marcações da timeline"
                    >
                      {eventosNaTimeline.map((evento) => (
                        <circle
                          key={`e-${evento.id}`}
                          cx={`${posicaoNaTimeline(evento.segundo, duracaoVideo)}%`}
                          cy="11"
                          r={marcadorAtivo?.tipo === 'evento' && marcadorAtivo.id === evento.id ? 8 : 6}
                          className={`${styles.markerHit} ${styles[`marker_${evento.tipo}`]}`}
                          tabIndex={0}
                          role="button"
                          aria-label={`${evento.nome} em ${formatarTempo(evento.segundo)}. Ir para o momento.`}
                          onMouseEnter={() =>
                            setMarcadorAtivo({ tipo: 'evento', id: evento.id })
                          }
                          onMouseLeave={() => setMarcadorAtivo(null)}
                          onFocus={() =>
                            setMarcadorAtivo({ tipo: 'evento', id: evento.id })
                          }
                          onBlur={() => setMarcadorAtivo(null)}
                          onClick={() =>
                            irParaEvento(
                              evento.segundo,
                              evento.segundo + evento.duracao,
                            )
                          }
                          onKeyDown={(event) => {
                            if (event.key === 'Enter' || event.key === ' ') {
                              event.preventDefault();
                              irParaEvento(
                                evento.segundo,
                                evento.segundo + evento.duracao,
                              );
                            }
                          }}
                        />
                      ))}

                      {anotacoesOrdenadas.map((anotacao) => (
                        <circle
                          key={`a-${anotacao.id}`}
                          cx={`${posicaoNaTimeline(anotacao.tempo, duracaoVideo)}%`}
                          cy="11"
                          r="6"
                          className={`${styles.markerHit} ${styles.annotationMarker}`}
                          tabIndex={0}
                          role="button"
                          aria-label={`Desenho em ${formatarTempo(anotacao.tempo)}. Ir para o momento.`}
                          onMouseEnter={() =>
                            setMarcadorAtivo({
                              tipo: 'anotacao',
                              id: anotacao.id,
                            })
                          }
                          onMouseLeave={() => setMarcadorAtivo(null)}
                          onFocus={() =>
                            setMarcadorAtivo({
                              tipo: 'anotacao',
                              id: anotacao.id,
                            })
                          }
                          onBlur={() => setMarcadorAtivo(null)}
                          onClick={() => irParaMomento(anotacao.tempo)}
                          onKeyDown={(event) => {
                            if (event.key === 'Enter' || event.key === ' ') {
                              event.preventDefault();
                              irParaMomento(anotacao.tempo);
                            }
                          }}
                        />
                      ))}
                    </svg>
                  </div>
                </div>

                <div className={styles.timelineLegend}>
                  {AVALIACOES.map((avaliacao) => (
                    <div
                      key={avaliacao.valor}
                      className={styles.timelineLegendItem}
                    >
                      <span
                        className={`${styles.legendDot} ${styles[`legend_${avaliacao.valor}`]}`}
                      />
                      <small>{avaliacao.rotulo}</small>
                    </div>
                  ))}

                  <div className={styles.timelineLegendItem}>
                    <span
                      className={`${styles.legendDot} ${styles.legendAnnotation}`}
                    />
                    <small>Desenho</small>
                  </div>
                </div>
              </div>

              {/* FERRAMENTAS: funcionam também em tela cheia */}
              {videoSelecionado && (
                <div className={styles.toolbar}>
                  <div className={styles.toolbarGroup}>
                    <button
                      type="button"
                      className={styles.toolbarActionGreen}
                      onClick={() => abrirNovoEvento()}
                    >
                      <Plus size={15} />
                      Marcar evento
                    </button>

                    <button
                      type="button"
                      className={styles.toolbarActionPink}
                      onClick={abrirNovoClipe}
                    >
                      <Scissors size={15} />
                      Criar clipe
                    </button>
                  </div>

                  <span className={styles.toolbarDivider} />

                  <div className={styles.toolbarGroup}>
                    <button
                      type="button"
                      title="Sair do modo desenho"
                      className={`${styles.toolButton} ${
                        !desenhando ? styles.toolButtonActive : ''
                      }`}
                      onClick={() => setFerramenta('nenhuma')}
                    >
                      <MousePointer2 size={16} />
                    </button>

                    {FERRAMENTAS.map(({ id, rotulo, Componente }) => (
                      <button
                        key={id}
                        type="button"
                        title={rotulo}
                        className={`${styles.toolButton} ${
                          ferramenta === id ? styles.toolButtonActive : ''
                        }`}
                        onClick={() => selecionarFerramenta(id)}
                      >
                        <Componente size={16} />
                      </button>
                    ))}
                  </div>

                  <span className={styles.toolbarDivider} />

                  <div className={styles.toolbarGroup}>
                    {PALETA_DESENHO.map((cor) => (
                      <button
                        key={cor.chave}
                        type="button"
                        title={cor.chave}
                        aria-label={`Cor ${cor.chave}`}
                        className={`${styles.drawSwatch} ${styles[`draw_${cor.chave}`]} ${
                          corDesenho === cor.hex ? styles.drawSwatchActive : ''
                        }`}
                        onClick={() => setCorDesenho(cor.hex)}
                      />
                    ))}
                  </div>

                  {(desenhoAtual.length > 0 || desenhando) && (
                    <>
                      <span className={styles.toolbarDivider} />

                      <div className={styles.toolbarGroup}>
                        <button
                          type="button"
                          title="Desfazer"
                          className={styles.toolButton}
                          onClick={desfazerDesenho}
                          disabled={desenhoAtual.length === 0}
                        >
                          <Undo2 size={16} />
                        </button>

                        <button
                          type="button"
                          title="Apagar desenho atual"
                          className={styles.toolButton}
                          onClick={descartarDesenho}
                        >
                          <Eraser size={16} />
                        </button>

                        <button
                          type="button"
                          className={styles.toolbarActionGreen}
                          onClick={() => void salvarAnotacao()}
                          disabled={desenhoAtual.length === 0 || salvando}
                        >
                          <Save size={15} />
                          {salvando ? <LoadingState variant="inline" title="Salvando desenho..." /> : 'Salvar desenho'}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* JANELAS DENTRO DO PALCO (visíveis também em tela cheia) */}
              {mostrarNovoEvento && (
                <div
                  className={styles.categoryOverlay}
                  onClick={() => setMostrarNovoEvento(false)}
                >
                  <div
                    className={`${styles.categoryModal} ${styles.categoryModalNarrow}`}
                    onClick={(event) => event.stopPropagation()}
                  >
                    <div className={styles.categoryModalHeader}>
                      <div>
                        <span>ANÁLISE</span>
                        <h2>Marcar evento</h2>
                        <p>
                          Momento atual: {formatarTempo(tempoAtual)} · todo
                          evento precisa de um atleta da partida.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setMostrarNovoEvento(false)}
                        aria-label="Fechar"
                      >
                        <X size={19} />
                      </button>
                    </div>

                    <div className={styles.categoryModalContent}>
                      <div className={styles.categoryForm}>
                        <div className={styles.categoryField}>
                          <label htmlFor="atletaEvento">Atleta *</label>

                          <select
                            id="atletaEvento"
                            value={novoEvento.atletaId}
                            onChange={(event) =>
                              setNovoEvento({
                                ...novoEvento,
                                atletaId: Number(event.target.value),
                              })
                            }
                            className={styles.categorySelect}
                            disabled={escalacao.length === 0}
                          >
                            <option value={0}>Selecione o atleta</option>
                            {escalacao.map((atleta) => (
                              <option key={atleta.id} value={atleta.id}>
                                {nomeDoAtleta(atleta)}
                              </option>
                            ))}
                          </select>

                          {escalacao.length === 0 && (
                            <div className={styles.warningBox}>
                              Esta partida ainda não tem atletas na escalação.
                              Cadastre quem jogou para poder marcar eventos.
                            </div>
                          )}
                        </div>

                        <div className={styles.categoryField}>
                          <label htmlFor="categoriaEvento">Categoria *</label>

                          <select
                            id="categoriaEvento"
                            value={novoEvento.categoriaId}
                            onChange={(event) =>
                              selecionarCategoriaDoEvento(
                                Number(event.target.value),
                              )
                            }
                            className={styles.categorySelect}
                          >
                            <option value={0}>Selecione uma categoria</option>
                            {categorias.map((categoria) => (
                              <option key={categoria.id} value={categoria.id}>
                                {categoria.nome}
                              </option>
                            ))}
                          </select>

                          {categorias.length === 0 && (
                            <button
                              type="button"
                              className={styles.addCategoryCard}
                              onClick={() => {
                                setMostrarNovoEvento(false);
                                novaCategoria();
                                setMostrarCategorias(true);
                              }}
                            >
                              <Plus size={15} />
                              Criar categoria de análise
                            </button>
                          )}
                        </div>

                        <div className={styles.categoryField}>
                          <label>Como foi essa ação?</label>
                          {botoesAvaliacao(novoEvento.tipo, (tipo) =>
                            setNovoEvento({ ...novoEvento, tipo }),
                          )}
                        </div>

                        <div className={styles.categoryField}>
                          <label htmlFor="descricaoEvento">Observações</label>
                          <textarea
                            id="descricaoEvento"
                            value={novoEvento.descricao}
                            placeholder="Descreva o lance, a decisão tomada, pontos a melhorar..."
                            onChange={(event) =>
                              setNovoEvento({
                                ...novoEvento,
                                descricao: event.target.value,
                              })
                            }
                            className={styles.categoryTextarea}
                          />
                        </div>

                        <div className={styles.categoryField}>
                          <label htmlFor="duracaoEvento">
                            Duração do trecho (segundos)
                          </label>
                          <input
                            id="duracaoEvento"
                            type="number"
                            min={1}
                            max={120}
                            value={novoEvento.duracao}
                            onChange={(event) =>
                              setNovoEvento({
                                ...novoEvento,
                                duracao: limitar(
                                  Number(event.target.value) || 1,
                                  1,
                                  120,
                                ),
                              })
                            }
                          />
                        </div>

                        <div className={styles.categoryFormFooter}>
                          <span className={styles.eventFormHint}>
                            Vídeo: {videoSelecionado ? obterNomeVideo(videoSelecionado) : '—'}
                          </span>

                          <div className={styles.categoryFormActions}>
                            <button
                              type="button"
                              className={styles.cancelCategoryButton}
                              onClick={() => setMostrarNovoEvento(false)}
                            >
                              Cancelar
                            </button>

                            <button
                              type="button"
                              className={styles.saveCategoryButton}
                              disabled={
                                !novoEvento.atletaId ||
                                !novoEvento.categoriaId ||
                                !videoSelecionado ||
                                salvando
                              }
                              onClick={() => void adicionarEvento()}
                            >
                              <Check size={15} />
                              {salvando ? <LoadingState variant="inline" title="Salvando evento..." /> : 'Salvar evento'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {mostrarClipe && (
                <>
                  <div
                    className={styles.overlay}
                    onClick={() => setMostrarClipe(false)}
                  />

                  <aside
                    className={`${styles.clipPanel} ${styles.clipPanelOpen}`}
                  >
                    <div className={styles.clipPanelHeader}>
                      <div>
                        <div className={styles.clipIcon}>
                          <Scissors size={16} />
                        </div>
                        <h2>Criar clipe</h2>
                      </div>

                      <button
                        type="button"
                        className={styles.closeButton}
                        onClick={() => setMostrarClipe(false)}
                        aria-label="Fechar"
                      >
                        <X size={17} />
                      </button>
                    </div>

                    <div className={styles.clipPanelContent}>
                      <div className={styles.formGroup}>
                        <label htmlFor="nomeClipe">Nome do clipe</label>
                        <input
                          id="nomeClipe"
                          type="text"
                          value={novoClipe.nome}
                          placeholder="Ex.: Contra-ataque — 2º tempo"
                          onChange={(event) =>
                            setNovoClipe({
                              ...novoClipe,
                              nome: event.target.value,
                            })
                          }
                        />
                      </div>

                      <div className={styles.formGroup}>
                        <label htmlFor="atletaClipe">
                          Atleta responsável (opcional)
                        </label>
                        <select
                          id="atletaClipe"
                          value={novoClipe.atletaId}
                          onChange={(event) =>
                            setNovoClipe({
                              ...novoClipe,
                              atletaId: Number(event.target.value),
                            })
                          }
                        >
                          <option value={0}>Sem atleta específico</option>
                          {escalacao.map((atleta) => (
                            <option key={atleta.id} value={atleta.id}>
                              {nomeDoAtleta(atleta)}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className={styles.formGroup}>
                        <label htmlFor="categoriaClipe">Categoria</label>
                        <select
                          id="categoriaClipe"
                          value={novoClipe.categoriaId}
                          onChange={(event) => {
                            const id = Number(event.target.value);
                            const categoria = categoriaPorId(id);

                            setNovoClipe({
                              ...novoClipe,
                              categoriaId: id,
                              tipo: categoria?.tipo ?? novoClipe.tipo,
                            });
                          }}
                        >
                          <option value={0}>Sem categoria</option>
                          {categorias.map((categoria) => (
                            <option key={categoria.id} value={categoria.id}>
                              {categoria.nome}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className={styles.formGroup}>
                        <label>Avaliação</label>
                        {botoesAvaliacao(novoClipe.tipo, (tipo) =>
                          setNovoClipe({ ...novoClipe, tipo }),
                        )}
                      </div>

                      <div className={styles.formGroup}>
                        <label htmlFor="observacaoClipe">Observação</label>
                        <textarea
                          id="observacaoClipe"
                          value={novoClipe.descricao}
                          placeholder="Descreva este momento..."
                          onChange={(event) =>
                            setNovoClipe({
                              ...novoClipe,
                              descricao: event.target.value,
                            })
                          }
                        />
                      </div>

                      <div className={styles.durationSection}>
                        <h3>Trecho do clipe</h3>

                        <div className={styles.durationInfo}>
                          <span>Início: {formatarTempo(novoClipe.inicio)}</span>
                          <span>Fim: {formatarTempo(novoClipe.fim)}</span>
                          <span className={styles.durationValue}>
                            Duração:{' '}
                            {formatarTempo(
                              Math.max(0, novoClipe.fim - novoClipe.inicio),
                            )}
                          </span>
                        </div>

                        <div className={styles.rangeGroup}>
                          <input
                            type="range"
                            aria-label="Tempo inicial do clipe"
                            min="0"
                            max={Math.max(duracaoVideo, novoClipe.inicio + 1, 1)}
                            step="0.1"
                            value={Math.min(
                              novoClipe.inicio,
                              duracaoVideo || novoClipe.inicio,
                            )}
                            onChange={(event) => {
                              const inicio = Number(event.target.value);

                              setNovoClipe((atual) => ({
                                ...atual,
                                inicio,
                                fim: Math.max(atual.fim, inicio + 1),
                              }));
                            }}
                          />

                          <input
                            type="range"
                            aria-label="Tempo final do clipe"
                            min={Math.min(
                              novoClipe.inicio + 1,
                              duracaoVideo || novoClipe.inicio + 1,
                            )}
                            max={Math.max(duracaoVideo, novoClipe.inicio + 1, 1)}
                            step="0.1"
                            value={Math.min(
                              novoClipe.fim,
                              duracaoVideo || novoClipe.fim,
                            )}
                            onChange={(event) =>
                              setNovoClipe((atual) => ({
                                ...atual,
                                fim: Math.max(
                                  Number(event.target.value),
                                  atual.inicio + 1,
                                ),
                              }))
                            }
                          />
                        </div>

                        <div className={styles.clipTimeButtons}>
                          <button
                            type="button"
                            className={styles.cancelCategoryButton}
                            onClick={() =>
                              setNovoClipe((atual) => ({
                                ...atual,
                                inicio: tempoAtual,
                                fim: Math.max(atual.fim, tempoAtual + 1),
                              }))
                            }
                          >
                            Início no momento atual
                          </button>

                          <button
                            type="button"
                            className={styles.cancelCategoryButton}
                            onClick={() =>
                              setNovoClipe((atual) => ({
                                ...atual,
                                fim: Math.max(tempoAtual, atual.inicio + 1),
                              }))
                            }
                          >
                            Fim no momento atual
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className={styles.clipPanelFooter}>
                      <button
                        type="button"
                        className={styles.saveClipButton}
                        disabled={
                          !novoClipe.nome.trim() || salvando || !videoSelecionado
                        }
                        onClick={() => void adicionarClipe()}
                      >
                        <Scissors size={15} />
                        {salvando ? <LoadingState variant="inline" title="Salvando clipe..." /> : 'Salvar clipe'}
                      </button>
                    </div>
                  </aside>
                </>
              )}

              {mostrarCategorias && (
                <div
                  className={styles.categoryOverlay}
                  onClick={() => setMostrarCategorias(false)}
                >
                  <div
                    className={styles.categoryModal}
                    onClick={(event) => event.stopPropagation()}
                  >
                    <div className={styles.categoryModalHeader}>
                      <div>
                        <span>CONFIGURAÇÃO DA ANÁLISE</span>
                        <h2>Categorias de análise</h2>
                        <p>
                          Crie, edite e exclua as categorias usadas para marcar
                          os momentos do vídeo.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setMostrarCategorias(false)}
                        aria-label="Fechar"
                      >
                        <X size={19} />
                      </button>
                    </div>

                    <div className={styles.categoryModalContent}>
                      <form
                        className={styles.categoryForm}
                        onSubmit={(event) => void salvarCategoria(event)}
                      >
                        <div className={styles.categoryFormGrid}>
                          <div className={styles.categoryFormLeft}>
                            <div className={styles.categoryField}>
                              <label htmlFor="nomeCategoria">
                                {formularioCategoria.id === null
                                  ? 'Nova categoria'
                                  : 'Editando categoria'}
                              </label>
                              <input
                                id="nomeCategoria"
                                value={formularioCategoria.nome}
                                placeholder="Ex.: Passe, Defesa, Finalização"
                                onChange={(event) =>
                                  setFormularioCategoria((atual) => ({
                                    ...atual,
                                    nome: event.target.value,
                                  }))
                                }
                                maxLength={100}
                                required
                              />
                            </div>

                            <div className={styles.categoryField}>
                              <label>Avaliação padrão</label>
                              {botoesAvaliacao(
                                formularioCategoria.tipo,
                                (tipo) =>
                                  setFormularioCategoria((atual) => ({
                                    ...atual,
                                    tipo,
                                  })),
                              )}
                            </div>

                            <div className={styles.categoryField}>
                              <label>Cor</label>
                              <div className={styles.categoryColorArea}>
                                {PALETA_CATEGORIA.map((cor) => (
                                  <button
                                    key={cor.chave}
                                    type="button"
                                    aria-label={`Cor ${cor.chave}`}
                                    className={`${styles.categoryColorButton} ${styles[`swatch_${cor.chave}`]} ${
                                      formularioCategoria.cor.toLowerCase() ===
                                      cor.hex.toLowerCase()
                                        ? styles.categoryColorButtonActive
                                        : ''
                                    }`}
                                    onClick={() =>
                                      setFormularioCategoria((atual) => ({
                                        ...atual,
                                        cor: cor.hex,
                                      }))
                                    }
                                  />
                                ))}
                              </div>
                            </div>

                            <div className={styles.timelineOption}>
                              <div>
                                <strong>Mostrar na timeline</strong>
                                <span>
                                  Quando ativo, os eventos desta categoria
                                  aparecem como marcações na linha do tempo.
                                </span>
                              </div>

                              <button
                                type="button"
                                role="switch"
                                aria-checked={
                                  formularioCategoria.mostrarNaTimeline
                                }
                                aria-label="Mostrar na timeline"
                                className={`${styles.toggleButton} ${
                                  formularioCategoria.mostrarNaTimeline
                                    ? styles.toggleButtonActive
                                    : ''
                                }`}
                                onClick={() =>
                                  setFormularioCategoria((atual) => ({
                                    ...atual,
                                    mostrarNaTimeline:
                                      !atual.mostrarNaTimeline,
                                  }))
                                }
                              >
                                <span />
                              </button>
                            </div>

                            <div className={styles.categoryPreviewForm}>
                              <div
                                className={`${styles.categoryPreviewFormIcon} ${styles[`tone_${chaveDaCor(formularioCategoria.cor)}`]}`}
                              >
                                <IconeCategoria
                                  icone={formularioCategoria.icone}
                                  tamanho={20}
                                />
                              </div>

                              <div>
                                <span>PRÉVIA</span>
                                <strong>
                                  {formularioCategoria.nome || 'Nome da categoria'}
                                </strong>
                              </div>
                            </div>
                          </div>

                          <div className={styles.categoryIconsSide}>
                            <span className={styles.iconsLabel}>Ícone</span>

                            <div className={styles.categoryIconsGrid}>
                              {Object.entries(ICONES_CATEGORIA).map(
                                ([chave, item]) => (
                                  <button
                                    key={chave}
                                    type="button"
                                    className={`${styles.categoryIconOption} ${
                                      formularioCategoria.icone === chave
                                        ? styles.categoryIconOptionActive
                                        : ''
                                    }`}
                                    onClick={() =>
                                      setFormularioCategoria((atual) => ({
                                        ...atual,
                                        icone: chave,
                                      }))
                                    }
                                  >
                                    <item.Componente size={20} />
                                    {item.rotulo}

                                    {formularioCategoria.icone === chave && (
                                      <span className={styles.categoryIconCheck}>
                                        <Check size={11} />
                                      </span>
                                    )}
                                  </button>
                                ),
                              )}
                            </div>
                          </div>
                        </div>

                        <div className={styles.categoryFormFooter}>
                          <span className={styles.eventFormHint}>
                            {categorias.length}{' '}
                            {categorias.length === 1 ? 'categoria' : 'categorias'}{' '}
                            da equipe
                          </span>

                          <div className={styles.categoryFormActions}>
                            {formularioCategoria.id !== null && (
                              <button
                                type="button"
                                className={styles.cancelCategoryButton}
                                onClick={novaCategoria}
                              >
                                Cancelar edição
                              </button>
                            )}

                            <button
                              type="submit"
                              className={styles.saveCategoryButton}
                              disabled={
                                !formularioCategoria.nome.trim() ||
                                salvandoCategoria
                              }
                            >
                              {formularioCategoria.id === null ? (
                                <Plus size={15} />
                              ) : (
                                <Check size={15} />
                              )}
                              {salvandoCategoria
                                ? <LoadingState variant="inline" title="Salvando categoria..." />
                                : formularioCategoria.id === null
                                  ? 'Criar categoria'
                                  : 'Salvar alterações'}
                            </button>
                          </div>
                        </div>
                      </form>

                      <div className={styles.categoryListToolbar}>
                        <div>
                          <strong>Categorias disponíveis</strong>
                          <span>
                            Clique em “Marcar” para registrar um evento com a
                            categoria.
                          </span>
                        </div>
                      </div>

                      <div className={styles.categoriesList}>
                        {categorias.length === 0 ? (
                          <div className={styles.categoryEmpty}>
                            Nenhuma categoria cadastrada. Crie a primeira acima.
                          </div>
                        ) : (
                          categorias.map((categoria) => (
                            <div key={categoria.id} className={styles.categoryRow}>
                              <div
                                className={`${styles.categoryRowIcon} ${styles[`tone_${chaveDaCor(categoria.cor)}`]}`}
                              >
                                <IconeCategoria icone={categoria.icone} />
                              </div>

                              <div className={styles.categoryRowInfo}>
                                <strong>{categoria.nome}</strong>
                                <span>
                                  {rotuloAvaliacao(categoria.tipo)} ·{' '}
                                  {categoria.mostrarNaTimeline
                                    ? 'na timeline'
                                    : 'fora da timeline'}
                                </span>
                              </div>

                              {categoriaParaExcluir === categoria.id ? (
                                <div className={styles.deleteArea}>
                                  <button
                                    type="button"
                                    className={`${styles.deleteCategoryButton} ${styles.deleteCategoryConfirm}`}
                                    onClick={() =>
                                      void excluirCategoria(categoria.id)
                                    }
                                    disabled={salvandoCategoria}
                                  >
                                    Excluir
                                  </button>

                                  <button
                                    type="button"
                                    className={styles.cancelCategoryButton}
                                    onClick={() => setCategoriaParaExcluir(0)}
                                  >
                                    Não
                                  </button>
                                </div>
                              ) : (
                                <div className={styles.rowActions}>
                                  <button
                                    type="button"
                                    className={styles.editCategoryButton}
                                    onClick={() => abrirNovoEvento(categoria)}
                                  >
                                    <Plus size={13} />
                                    Marcar
                                  </button>

                                  <button
                                    type="button"
                                    title="Editar categoria"
                                    aria-label={`Editar ${categoria.nome}`}
                                    className={styles.iconActionButton}
                                    onClick={() => editarCategoria(categoria)}
                                  >
                                    <Pencil size={14} />
                                  </button>

                                  <button
                                    type="button"
                                    title="Excluir categoria"
                                    aria-label={`Excluir ${categoria.nome}`}
                                    className={`${styles.iconActionButton} ${styles.iconActionDanger}`}
                                    onClick={() =>
                                      setCategoriaParaExcluir(categoria.id)
                                    }
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>

          <section className={styles.actionTypesCard}>
            <div className={styles.actionTypesHeader}>
              <div>
                <h2>Categorias de análise</h2>
                <p>
                  Clique em uma categoria para marcar um evento no momento atual
                  do vídeo.
                </p>
              </div>

              <button
                type="button"
                className={styles.editCategoriesSmall}
                onClick={() => {
                  novaCategoria();
                  setMostrarCategorias(true);
                }}
              >
                <Pencil size={14} />
                Gerenciar
              </button>
            </div>

            <div className={styles.actionTypesGrid}>
              {categorias.length === 0 ? (
                <div className={styles.emptyBlock}>
                  <Video size={28} />
                  <strong>Nenhuma categoria configurada</strong>
                  <span>
                    Clique em “Gerenciar” para criar a primeira categoria.
                  </span>
                </div>
              ) : (
                categorias.map((categoria) => (
                  <button
                    key={categoria.id}
                    type="button"
                    className={styles.categoryPreview}
                    onClick={() => abrirNovoEvento(categoria)}
                    disabled={!videoSelecionado}
                  >
                    <div
                      className={`${styles.actionTypeIcon} ${styles[`tone_${chaveDaCor(categoria.cor)}`]}`}
                    >
                      <IconeCategoria icone={categoria.icone} />
                    </div>

                    <strong>{categoria.nome}</strong>

                    <span className={styles.timelineStatus}>
                      <Plus size={12} />
                    </span>
                  </button>
                ))
              )}

              <button
                type="button"
                className={styles.addCategoryCard}
                onClick={() => {
                  novaCategoria();
                  setMostrarCategorias(true);
                }}
              >
                <Plus size={17} />
                Nova categoria
              </button>
            </div>
          </section>
        </div>

        <div className={styles.rightColumn}>
          <section className={styles.eventsCard}>
            <div className={styles.eventsHeader}>
              <div>
                <h2>Eventos</h2>
                <span>
                  {carregandoEventos
                    ? <LoadingState variant="inline" title="Carregando marcações..." />
                    : `${eventos.length} ${
                        eventos.length === 1 ? 'evento' : 'eventos'
                      } neste vídeo`}
                </span>
              </div>
              <Flag size={21} />
            </div>

            <div className={styles.eventsList}>
              {carregandoEventos ? (
                <LoadingState variant="list" title="Carregando marcações salvas..." count={4} />
              ) : eventosOrdenados.length === 0 ? (
                <div className={styles.eventsEmpty}>
                  Nenhum evento registrado neste vídeo. Use “Marcar evento” para
                  adicionar o primeiro.
                </div>
              ) : (
                eventosOrdenados.map((evento) => (
                  <button
                    key={evento.id}
                    type="button"
                    className={styles.eventItem}
                    onClick={() =>
                      irParaEvento(
                        evento.segundo,
                        evento.segundo + evento.duracao,
                      )
                    }
                  >
                    <div
                      className={`${styles.eventIcon} ${
                        evento.tipo === 'boa'
                          ? styles.eventIconGood
                          : evento.tipo === 'ruim'
                            ? styles.eventIconBad
                            : evento.tipo === 'destaque'
                              ? styles.eventIconHighlight
                              : styles.eventIconNeutral
                      }`}
                    >
                      {evento.tipo === 'boa' ? (
                        <Trophy size={17} />
                      ) : evento.tipo === 'ruim' ? (
                        <Flag size={17} />
                      ) : evento.tipo === 'destaque' ? (
                        <Star size={17} />
                      ) : (
                        <Clock3 size={17} />
                      )}
                    </div>

                    <div className={styles.eventContent}>
                      <strong>{evento.nome}</strong>
                      <span className={styles.eventAthleteName}>
                        {evento.atletaNome || 'Sem atleta'}
                      </span>
                      {evento.descricao && <span>{evento.descricao}</span>}
                    </div>

                    <div className={styles.eventRight}>
                      <span>{formatarTempo(evento.segundo)}</span>
                      <small>{evento.duracao.toFixed(0)}s</small>
                    </div>
                  </button>
                ))
              )}
            </div>
          </section>

          <section className={styles.sideCard}>
            <div className={styles.eventsHeader}>
              <div>
                <h2>Clipes</h2>
                <span>
                  {clipes.length} {clipes.length === 1 ? 'clipe' : 'clipes'}{' '}
                  neste vídeo
                </span>
              </div>
              <Scissors size={20} />
            </div>

            <div className={styles.eventsList}>
              {clipes.length === 0 ? (
                <div className={styles.eventsEmpty}>
                  Nenhum clipe criado ainda.
                </div>
              ) : (
                clipes.map((clipe) => (
                  <button
                    key={clipe.id}
                    type="button"
                    className={styles.eventItem}
                    onClick={() => irParaEvento(clipe.inicio, clipe.fim)}
                  >
                    <div className={`${styles.eventIcon} ${styles.eventIconClip}`}>
                      <Scissors size={16} />
                    </div>

                    <div className={styles.eventContent}>
                      <strong>{clipe.nome}</strong>
                      <span className={styles.eventAthleteName}>
                        {clipe.atletaNome || 'Sem atleta'} ·{' '}
                        {rotuloAvaliacao(clipe.tipo)}
                      </span>
                    </div>

                    <div className={styles.eventRight}>
                      <span>{formatarTempo(clipe.inicio)}</span>
                      <small>{formatarTempo(clipe.fim - clipe.inicio)}</small>
                    </div>
                  </button>
                ))
              )}
            </div>
          </section>

          <section className={styles.sideCard}>
            <div className={styles.eventsHeader}>
              <div>
                <h2>Desenhos</h2>
                <span>
                  {anotacoes.length}{' '}
                  {anotacoes.length === 1 ? 'anotação' : 'anotações'} no vídeo
                </span>
              </div>
              <Pencil size={20} />
            </div>

            <div className={styles.eventsList}>
              {anotacoesOrdenadas.length === 0 ? (
                <div className={styles.eventsEmpty}>
                  Use as ferramentas de desenho abaixo do vídeo para destacar
                  jogadas. Elas ficam salvas no momento em que foram feitas.
                </div>
              ) : (
                anotacoesOrdenadas.map((anotacao) => (
                  <div key={anotacao.id} className={styles.annotationRow}>
                    <button
                      type="button"
                      className={styles.annotationMain}
                      onClick={() => irParaMomento(anotacao.tempo)}
                    >
                      <div
                        className={`${styles.eventIcon} ${styles.eventIconDraw}`}
                      >
                        <Pencil size={16} />
                      </div>

                      <div className={styles.eventContent}>
                        <strong>Desenho em {formatarTempo(anotacao.tempo)}</strong>
                        <span>
                          {anotacao.formas.length}{' '}
                          {anotacao.formas.length === 1 ? 'forma' : 'formas'}
                        </span>
                      </div>
                    </button>

                    <button
                      type="button"
                      title="Excluir desenho"
                      aria-label="Excluir desenho"
                      className={`${styles.iconActionButton} ${styles.iconActionDanger}`}
                      onClick={() => void excluirAnotacao(anotacao.id)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}