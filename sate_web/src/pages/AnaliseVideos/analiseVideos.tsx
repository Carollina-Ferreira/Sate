import {
  ArrowLeft,
  Check,
  Clock3,
  Flag,
  Pause,
  Play,
  Plus,
  Scissors,
  Trophy,
  Video,
  X,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  RotateCcw,
  RotateCw,
} from 'lucide-react';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from 'react';

import styles from './analiseVideos.module.css';

const API_URL = 'http://localhost:3000/api';

type TipoEvento = 'boa' | 'ruim' | 'neutra' | 'destaque';

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

interface EventoBackend {
  id: number;
  videoId: number;
  titulo: string;
  categoria: string;
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
}

interface Categoria {
  id: number;
  nome: string;
  tipo: TipoEvento;
}

interface Clipe {
  id: number;
  nome: string;
  inicio: number;
  fim: number;
  descricao: string;
}

interface RespostaErro {
  mensagem?: string;
  erro?: string;
}

interface RespostaCampo {
  configuracao?: {
    id: number;
    nome: string;
    tipo?: string | null;
  };
  campo?: {
    id: number;
    nome: string;
    tipo?: string | null;
  };
}

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

/**
 * Converte a categoria recebida do backend para o tipo utilizado na interface.
 */
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

/**
 * Converte o tipo da interface para o padrão usado pelo backend.
 * O campo categoria da API precisa aceitar essas strings.
 */
function converterTipoParaBackend(tipo: TipoEvento): string {
  const tipos: Record<TipoEvento, string> = {
    boa: 'POSITIVA',
    ruim: 'NEGATIVA',
    neutra: 'NEUTRA',
    destaque: 'DESTAQUE',
  };

  return tipos[tipo];
}

function converterEvento(registro: EventoBackend): Evento {
  return {
    id: registro.id,
    nome: registro.titulo,
    descricao: registro.observacao || 'Evento registrado na partida',
    tipo: converterTipo(registro.categoria),
    segundo: Number(registro.tempoInicio),
    duracao: Math.max(
      0,
      Number(registro.tempoFim) - Number(registro.tempoInicio),
    ),
  };
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

function TargetIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1" />
    </svg>
  );
}

export default function AnaliseVideos() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const videoAreaRef = useRef<HTMLDivElement | null>(null);
  const trechoFimRef = useRef<number | null>(null);
  const requisicaoEventosRef = useRef(0);

  const [partidas, setPartidas] = useState<Partida[]>([]);
  const [carregandoPartidas, setCarregandoPartidas] = useState(true);
  const [carregandoVideos, setCarregandoVideos] = useState(false);
  const [carregandoEventos, setCarregandoEventos] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [salvandoCampo, setSalvandoCampo] = useState(false);

  const [mensagemErro, setMensagemErro] = useState('');
  const [mensagemSucesso, setMensagemSucesso] = useState('');

  const [partidaSelecionadaId, setPartidaSelecionadaId] = useState(0);
  const [videoSelecionadoId, setVideoSelecionadoId] = useState(0);

  const [tempoAtual, setTempoAtual] = useState(0);
  const [duracaoRealVideo, setDuracaoRealVideo] = useState(0);
  const [videoExecutando, setVideoExecutando] = useState(false);
  const [velocidade, setVelocidade] = useState(1);
  const [mutado, setMutado] = useState(false);
  const [telaCheia, setTelaCheia] = useState(false);
  const [mostrarVelocidades, setMostrarVelocidades] = useState(false);

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [clipes, setClipes] = useState<Clipe[]>([]);

  const [mostrarCategorias, setMostrarCategorias] = useState(false);
  const [mostrarNovoEvento, setMostrarNovoEvento] = useState(false);
  const [mostrarClipe, setMostrarClipe] = useState(false);

  const [novoCampo, setNovoCampo] = useState({
    nome: '',
    tipo: 'boa' as TipoEvento,
  });

  const [novoEvento, setNovoEvento] = useState({
    nome: '',
    descricao: '',
    tipo: 'boa' as TipoEvento,
    segundo: 0,
    duracao: 5,
  });

  const [novoClipe, setNovoClipe] = useState({
    nome: '',
    descricao: '',
    inicio: 0,
    fim: 10,
  });

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

  const duracaoVideo =
    duracaoRealVideo ||
    (videoSelecionado?.duracao
      ? converterDuracao(videoSelecionado.duracao)
      : 0);

  const eventosOrdenados = useMemo(
    () => [...eventos].sort((a, b) => a.segundo - b.segundo),
    [eventos],
  );

  const carregarEventos = useCallback(async (videoId: number) => {
    if (!videoId) {
      setEventos([]);
      setClipes([]);
      return;
    }

    const tokenAtual = obterToken();

    if (!tokenAtual) {
      window.location.href = '/login';
      return;
    }

    const numeroRequisicao = ++requisicaoEventosRef.current;

    setCarregandoEventos(true);
    setMensagemErro('');

    try {
      const resposta = await fetch(
        `${API_URL}/videos/${videoId}/marcacoes`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${tokenAtual}`,
          },
        },
      );

      const dados = await lerResposta<
        EventoBackend[] | { marcacoes?: EventoBackend[] }
      >(resposta);

      if (numeroRequisicao !== requisicaoEventosRef.current) return;

      const lista = Array.isArray(dados)
        ? dados
        : Array.isArray(dados.marcacoes)
          ? dados.marcacoes
          : [];

      setEventos(
        lista
          .filter(
            (registro) =>
              registro.categoria.trim().toLowerCase() !== 'clipe',
          )
          .map(converterEvento),
      );

      setClipes(
        lista
          .filter(
            (registro) =>
              registro.categoria.trim().toLowerCase() === 'clipe',
          )
          .map((registro) => ({
            id: registro.id,
            nome: registro.titulo,
            inicio: Number(registro.tempoInicio),
            fim: Number(registro.tempoFim),
            descricao: registro.observacao || '',
          })),
      );
    } catch (erro) {
      if (numeroRequisicao !== requisicaoEventosRef.current) return;

      setEventos([]);
      setClipes([]);

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

  useEffect(() => {
    async function carregarCategorias() {
      const tokenAtual = obterToken();

      if (!tokenAtual) {
        window.location.href = '/login';
        return;
      }

      try {
        const resposta = await fetch(
          `${API_URL}/configuracao-analise`,
          {
            headers: {
              Authorization: `Bearer ${tokenAtual}`,
            },
          },
        );

        const dados = await lerResposta<{
          configuracoes?: Array<{
            id: number;
            nome: string;
            tipo?: string | null;
          }>;
          campos?: Array<{
            id: number;
            nome: string;
            tipo?: string | null;
          }>;
        }>(resposta);

        const lista = dados.configuracoes ?? dados.campos ?? [];

        setCategorias(
          lista.map((item) => ({
            id: item.id,
            nome: item.nome,
            tipo: converterTipo(item.tipo || 'neutra'),
          })),
        );
      } catch (erro) {
        console.error('Erro ao carregar campos de análise:', erro);
        setCategorias([]);
        setMensagemErro(
          erro instanceof Error
            ? erro.message
            : 'Erro ao carregar os campos de análise.',
        );
      }
    }

    void carregarCategorias();
  }, []);

  useEffect(() => {
    let ativo = true;

    async function carregarPartidas() {
      const tokenAtual = obterToken();

      if (!tokenAtual) {
        window.location.href = '/login';
        return;
      }

      try {
        setCarregandoPartidas(true);

        const resposta = await fetch(`${API_URL}/partidas`, {
          headers: {
            Authorization: `Bearer ${tokenAtual}`,
          },
        });

        const dados = await lerResposta<
          PartidaBackend[] | { partidas?: PartidaBackend[] }
        >(resposta);

        if (!ativo) return;

        const lista = Array.isArray(dados)
          ? dados
          : Array.isArray(dados.partidas)
            ? dados.partidas
            : [];

        const formatadas: Partida[] = lista.map((partida) => ({
          id: partida.id,
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

  useEffect(() => {
    let ativo = true;

    async function carregarVideos() {
      if (!partidaSelecionadaId) {
        setVideoSelecionadoId(0);
        setEventos([]);
        setClipes([]);
        return;
      }

      const tokenAtual = obterToken();

      if (!tokenAtual) {
        window.location.href = '/login';
        return;
      }

      try {
        setCarregandoVideos(true);
        setMensagemErro('');
        setVideoSelecionadoId(0);
        setEventos([]);
        setClipes([]);
        setTempoAtual(0);
        setDuracaoRealVideo(0);
        trechoFimRef.current = null;

        videoRef.current?.pause();

        const resposta = await fetch(
          `${API_URL}/partidas/${partidaSelecionadaId}/videos`,
          {
            headers: {
              Authorization: `Bearer ${tokenAtual}`,
            },
          },
        );

        const dados = await lerResposta<
          VideoPartida[] | { videos?: VideoPartida[] }
        >(resposta);

        if (!ativo) return;

        const lista = Array.isArray(dados)
          ? dados
          : Array.isArray(dados.videos)
            ? dados.videos
            : [];

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

    void carregarVideos();

    return () => {
      ativo = false;
    };
  }, [partidaSelecionadaId]);

  useEffect(() => {
    if (videoSelecionadoId) {
      void carregarEventos(videoSelecionadoId);
    } else {
      setEventos([]);
      setClipes([]);
    }

    setTempoAtual(0);
    setDuracaoRealVideo(0);
    trechoFimRef.current = null;
  }, [videoSelecionadoId, carregarEventos]);

  useEffect(() => {
    function atualizarTelaCheia() {
      setTelaCheia(Boolean(document.fullscreenElement));
    }

    document.addEventListener('fullscreenchange', atualizarTelaCheia);

    return () => {
      document.removeEventListener('fullscreenchange', atualizarTelaCheia);
    };
  }, []);

  function trocarPartida(id: number) {
    setPartidaSelecionadaId(id);
    setVideoSelecionadoId(0);
    setEventos([]);
    setClipes([]);
    setTempoAtual(0);
    setDuracaoRealVideo(0);
    trechoFimRef.current = null;
    videoRef.current?.pause();
  }

  function trocarVideo(id: number) {
    setVideoSelecionadoId(id);
    setEventos([]);
    setClipes([]);
    setTempoAtual(0);
    setDuracaoRealVideo(0);
    trechoFimRef.current = null;
    videoRef.current?.pause();
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

  async function alternarTelaCheia() {
    const elemento = videoAreaRef.current;
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

  async function adicionarCampo(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();

    const tokenAtual = obterToken();
    const nome = novoCampo.nome.trim();

    if (!tokenAtual) {
      window.location.href = '/login';
      return;
    }

    if (!nome) {
      setMensagemErro('Digite o nome do campo de análise.');
      return;
    }

    if (
      categorias.some(
        (categoria) => categoria.nome.toLowerCase() === nome.toLowerCase(),
      )
    ) {
      setMensagemErro('Já existe um campo com esse nome.');
      return;
    }

    setSalvandoCampo(true);
    setMensagemErro('');
    setMensagemSucesso('');

    try {
      const resposta = await fetch(
        `${API_URL}/configuracao-analise`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${tokenAtual}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nome,
            tipo: converterTipoParaBackend(novoCampo.tipo),
          }),
        },
      );

      const dados = await lerResposta<RespostaCampo>(resposta);
      const campoSalvo = dados.configuracao ?? dados.campo;

      if (!campoSalvo) {
        throw new Error(
          'A API não retornou o campo criado. Confira o formato da resposta do backend.',
        );
      }

      const categoriaCriada: Categoria = {
        id: campoSalvo.id,
        nome: campoSalvo.nome,
        tipo: converterTipo(campoSalvo.tipo || novoCampo.tipo),
      };

      setCategorias((atuais) => [...atuais, categoriaCriada]);
      setNovoCampo({ nome: '', tipo: 'boa' });
      setMensagemSucesso('Campo de análise criado com sucesso.');
    } catch (erro) {
      setMensagemErro(
        erro instanceof Error
          ? erro.message
          : 'Erro ao criar o campo de análise.',
      );
    } finally {
      setSalvandoCampo(false);
    }
  }

  async function adicionarEvento() {
    const tokenAtual = obterToken();

    if (!tokenAtual) {
      window.location.href = '/login';
      return;
    }

    if (!videoSelecionadoId) {
      setMensagemErro('Selecione um vídeo antes de marcar um evento.');
      return;
    }

    if (!novoEvento.nome.trim()) {
      setMensagemErro('Selecione um campo de análise.');
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
      const resposta = await fetch(
        `${API_URL}/videos/${videoSelecionadoId}/marcacoes`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${tokenAtual}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            titulo: novoEvento.nome.trim(),
            categoria: converterTipoParaBackend(novoEvento.tipo),
            tempoInicio: inicio,
            tempoFim: fim,
            observacao: novoEvento.descricao.trim(),
          }),
        },
      );

      await lerResposta<{
        mensagem?: string;
        marcacao: EventoBackend;
      }>(resposta);

      await carregarEventos(videoSelecionadoId);

      setMensagemSucesso('Evento salvo no banco de dados.');
      setMostrarNovoEvento(false);

      setNovoEvento({
        nome: '',
        descricao: '',
        tipo: 'boa',
        segundo: tempoAtual,
        duracao: 5,
      });
    } catch (erro) {
      setMensagemErro(
        erro instanceof Error
          ? erro.message
          : 'Erro ao salvar o evento.',
      );
    } finally {
      setSalvando(false);
    }
  }

  async function adicionarClipe() {
    const tokenAtual = obterToken();

    if (!tokenAtual) {
      window.location.href = '/login';
      return;
    }

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
      const resposta = await fetch(
        `${API_URL}/videos/${videoSelecionadoId}/marcacoes`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${tokenAtual}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            titulo: novoClipe.nome.trim(),
            categoria: 'Clipe',
            tempoInicio: novoClipe.inicio,
            tempoFim: novoClipe.fim,
            observacao: novoClipe.descricao.trim(),
          }),
        },
      );

      await lerResposta<{
        mensagem?: string;
        marcacao: EventoBackend;
      }>(resposta);

      await carregarEventos(videoSelecionadoId);

      setMensagemSucesso('Clipe salvo no banco de dados.');
      setMostrarClipe(false);

      setNovoClipe({
        nome: '',
        descricao: '',
        inicio: tempoAtual,
        fim: Math.min(
          duracaoVideo || tempoAtual + 10,
          tempoAtual + 10,
        ),
      });
    } catch (erro) {
      setMensagemErro(
        erro instanceof Error
          ? erro.message
          : 'Erro ao salvar o clipe.',
      );
    } finally {
      setSalvando(false);
    }
  }

  function selecionarCategoria(categoria: Categoria) {
    setNovoEvento({
      nome: categoria.nome,
      descricao: '',
      tipo: categoria.tipo,
      segundo: tempoAtual,
      duracao: 5,
    });

    setMostrarCategorias(false);
    setMostrarNovoEvento(true);
  }

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <div>
          <button
            type="button"
            onClick={() => window.history.back()}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 7,
              marginBottom: 12,
              border: 'none',
              background: 'transparent',
              color: '#ffffff',
              fontFamily: 'inherit',
              fontSize: 13,
              cursor: 'pointer',
              padding: 0,
            }}
          >
          </button>
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

            {partidaSelecionada && (
              <div className={styles.matchDetails}>
                <span>{partidaSelecionada.data}</span>
                <i />
                <span>{partidaSelecionada.modalidade}</span>
                <i />
                <span>
                  {videosDaPartida.length}{' '}
                  {videosDaPartida.length === 1 ? 'vídeo' : 'vídeos'}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className={styles.headerActions}>
          <button
            type="button"
            className={styles.manageCategoriesButton}
            onClick={() => setMostrarCategorias(true)}
          >
            <Plus size={16} />
            Adicionar campo
          </button>

          <button
            type="button"
            className={styles.actionButtonRed}
            onClick={() => {
              setNovoClipe({
                nome: '',
                descricao: '',
                inicio: Math.max(0, tempoAtual),
                fim: Math.max(
                  Math.max(0, tempoAtual) + 1,
                  Math.min(
                    duracaoVideo || tempoAtual + 10,
                    tempoAtual + 10,
                  ),
                ),
              });
              setMostrarClipe(true);
            }}
            disabled={!videoSelecionado}
          >
            <Scissors size={16} />
            Criar clipe
          </button>

          <button
            type="button"
            className={styles.actionButtonGreen}
            onClick={() => {
              setNovoEvento({
                nome: '',
                descricao: '',
                tipo: 'boa',
                segundo: tempoAtual,
                duracao: 5,
              });
              setMostrarNovoEvento(true);
            }}
            disabled={!videoSelecionado}
          >
            <Plus size={16} />
            Marcar evento
          </button>
        </div>
      </header>

      {(mensagemErro || mensagemSucesso) && (
        <div
          role="status"
          style={{
            margin: '0 0 16px',
            padding: '12px 16px',
            borderRadius: 10,
            color: mensagemErro ? '#a61b1b' : '#086b48',
            background: mensagemErro ? '#fff0f0' : '#e8f8ef',
            border: `1px solid ${mensagemErro ? '#f0b6b6' : '#b8e8cb'}`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ flex: 1 }}>
              {mensagemErro || mensagemSucesso}
            </span>

            <button
              type="button"
              aria-label="Fechar mensagem"
              onClick={() => {
                setMensagemErro('');
                setMensagemSucesso('');
              }}
              style={{
                border: 0,
                background: 'transparent',
                cursor: 'pointer',
              }}
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      <div className={styles.analysisGrid}>
        <div className={styles.leftColumn}>
          <section className={styles.videoCard}>
            <div
              ref={videoAreaRef}
              className={styles.videoArea}
              style={{ position: 'relative' }}
            >
              {videoSelecionado?.url ? (
                <video
                  key={videoSelecionado.id}
                  ref={videoRef}
                  src={videoSelecionado.url}
                  preload="metadata"
                  playsInline
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    display: 'block',
                    background: '#071914',
                  }}
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
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    minHeight: 260,
                    color: '#ffffff',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 10,
                    background: '#071914',
                  }}
                >
                  <Video size={42} />
                  <span>
                    {carregandoVideos
                      ? 'Carregando vídeo...'
                      : 'Nenhum vídeo disponível para esta partida'}
                  </span>
                </div>
              )}

              {videoSelecionado && (
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 5,
                    padding: '70px 14px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    background:
                      'linear-gradient(transparent, rgba(0,0,0,0.82))',
                    boxSizing: 'border-box',
                  }}
                >
                  <button
                    type="button"
                    title="Voltar 10 segundos"
                    onClick={voltarDezSegundos}
                    style={botaoControle}
                  >
                    <RotateCcw size={19} />
                  </button>

                  <button
                    type="button"
                    title={videoExecutando ? 'Pausar' : 'Reproduzir'}
                    onClick={alternarVideo}
                    style={{
                      ...botaoControle,
                      width: 38,
                      height: 38,
                      borderRadius: '50%',
                      background: 'rgba(255,255,255,0.14)',
                    }}
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
                    style={botaoControle}
                  >
                    <RotateCw size={19} />
                  </button>

                  <button
                    type="button"
                    title={mutado ? 'Ativar som' : 'Silenciar'}
                    onClick={alternarMute}
                    style={botaoControle}
                  >
                    {mutado ? <VolumeX size={20} /> : <Volume2 size={20} />}
                  </button>

                  <span
                    style={{
                      color: '#ffffff',
                      fontSize: 12,
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {formatarTempo(tempoAtual)} / {formatarTempo(duracaoVideo)}
                  </span>

                  <div style={{ flex: 1 }} />

                  <div style={{ position: 'relative' }}>
                    <button
                      type="button"
                      title="Velocidade"
                      onClick={() =>
                        setMostrarVelocidades((atual) => !atual)
                      }
                      style={{
                        ...botaoControle,
                        width: 48,
                        fontSize: 12,
                        fontWeight: 700,
                      }}
                    >
                      {velocidade}x
                    </button>

                    {mostrarVelocidades && (
                      <div
                        style={{
                          position: 'absolute',
                          bottom: 44,
                          right: 0,
                          minWidth: 100,
                          padding: 7,
                          borderRadius: 10,
                          background: '#ffffff',
                          boxShadow: '0 8px 25px rgba(0,0,0,0.28)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 2,
                        }}
                      >
                        {[0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map(
                          (valor) => (
                            <button
                              key={valor}
                              type="button"
                              onClick={() => alterarVelocidade(valor)}
                              style={{
                                border: 0,
                                borderRadius: 7,
                                padding: '7px 9px',
                                textAlign: 'left',
                                background:
                                  velocidade === valor
                                    ? '#e5f5ef'
                                    : 'transparent',
                                color:
                                  velocidade === valor
                                    ? '#16a875'
                                    : '#33453d',
                                cursor: 'pointer',
                              }}
                            >
                              {valor}x
                            </button>
                          ),
                        )}
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    title={telaCheia ? 'Sair da tela cheia' : 'Tela cheia'}
                    onClick={() => void alternarTelaCheia()}
                    style={botaoControle}
                  >
                    {telaCheia ? (
                      <Minimize size={19} />
                    ) : (
                      <Maximize size={19} />
                    )}
                  </button>
                </div>
              )}

              {videoSelecionado && !videoExecutando && (
                <button
                  type="button"
                  className={styles.playButton}
                  onClick={alternarVideo}
                  style={{ zIndex: 4 }}
                  aria-label="Reproduzir vídeo"
                >
                  <Play size={29} fill="currentColor" />
                </button>
              )}
            </div>

            <div className={styles.timelineArea}>
              <div className={styles.timelineTrackWrapper}>
                <input
                  type="range"
                  min="0"
                  max={duracaoVideo || 1}
                  value={Math.min(tempoAtual, duracaoVideo || 1)}
                  onChange={alterarTempo}
                  className={styles.videoRange}
                  aria-label="Posição do vídeo"
                />

                <div className={styles.analysisMarkers}>
                  {eventosOrdenados.map((evento) => (
                    <button
                      key={evento.id}
                      type="button"
                      className={`${styles.analysisMarker} ${styles[`marker_${evento.tipo}`] || ''}`}
                      style={{
                        left: `${
                          duracaoVideo > 0
                            ? Math.min(
                                100,
                                (evento.segundo / duracaoVideo) * 100,
                              )
                            : 0
                        }%`,
                      }}
                      onClick={() =>
                        irParaEvento(
                          evento.segundo,
                          evento.segundo + evento.duracao,
                        )
                      }
                      title={`${evento.nome} — ${formatarTempo(evento.segundo)}`}
                      aria-label={`Reproduzir ${evento.nome} a partir de ${formatarTempo(evento.segundo)}`}
                    />
                  ))}
                </div>
              </div>

              <div className={styles.timelineLegend}>
                <div className={styles.timelineLegendItem}>
                  <span className={styles.goodMarker} />
                  <small>Boa</small>
                </div>
                <div className={styles.timelineLegendItem}>
                  <span className={styles.badMarker} />
                  <small>Ruim</small>
                </div>
                <div className={styles.timelineLegendItem}>
                  <span className={styles.neutralMarker} />
                  <small>Neutra</small>
                </div>
                <div className={styles.timelineLegendItem}>
                  <span className={styles.highlightMarker} />
                  <small>Destaque</small>
                </div>
              </div>
            </div>
          </section>

          <section className={styles.actionTypesCard}>
            <div className={styles.actionTypesHeader}>
              <div>
                <h2>Campos de análise</h2>
                <p>Crie campos e use-os para marcar momentos do vídeo.</p>
              </div>

              <button
                type="button"
                className={styles.editCategoriesSmall}
                onClick={() => setMostrarCategorias(true)}
              >
                <Plus size={14} />
                Adicionar campo
              </button>
            </div>

            <div className={styles.actionTypesGrid}>
              {categorias.length === 0 ? (
                <div
                  style={{
                    gridColumn: '1 / -1',
                    padding: 28,
                    textAlign: 'center',
                    border: '1px dashed #cbd8d2',
                    borderRadius: 14,
                    color: '#718078',
                    background: '#f7faf8',
                  }}
                >
                  <Video size={28} />
                  <strong
                    style={{
                      display: 'block',
                      margin: '8px 0 5px',
                    }}
                  >
                    Nenhum campo configurado
                  </strong>
                  <span style={{ fontSize: 13 }}>
                    Clique em “Adicionar campo” para criar o primeiro.
                  </span>
                </div>
              ) : (
                categorias.map((categoria) => (
                  <button
                    key={categoria.id}
                    type="button"
                    className={styles.categoryPreview}
                    onClick={() => selecionarCategoria(categoria)}
                  >
                    <div
                      className={styles.actionTypeIcon}
                      style={{
                        background: '#e5f5ef',
                        color: '#16a875',
                      }}
                    >
                      <TargetIcon />
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
                onClick={() => setMostrarCategorias(true)}
              >
                <Plus size={17} />
                Adicionar campo
              </button>
            </div>
          </section>
        </div>

        <section className={styles.eventsCard}>
          <div className={styles.eventsHeader}>
            <div>
              <h2>Eventos</h2>
              <span>
                {carregandoEventos
                  ? 'Carregando marcações salvas...'
                  : `${eventos.length} ${eventos.length === 1 ? 'evento' : 'eventos'} neste vídeo`}
              </span>
            </div>
            <Flag size={21} />
          </div>

          <div className={styles.eventsList}>
            {!carregandoEventos && eventosOrdenados.length === 0 ? (
              <div
                style={{
                  padding: 22,
                  color: '#718078',
                  textAlign: 'center',
                }}
              >
                Nenhum evento registrado neste vídeo. Use “Marcar evento”
                para adicionar o primeiro.
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
                      <Play size={17} />
                    ) : (
                      <Clock3 size={17} />
                    )}
                  </div>

                  <div className={styles.eventContent}>
                    <strong>{evento.nome}</strong>
                    <span>{evento.descricao}</span>
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
      </div>

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
                <h2>Campos de análise</h2>
                <p>Crie campos para classificar os momentos do vídeo.</p>
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
                onSubmit={(event) => void adicionarCampo(event)}
              >
                <div className={styles.categoryField}>
                  <label htmlFor="nomeCampo">Nome do campo</label>
                  <input
                    id="nomeCampo"
                    value={novoCampo.nome}
                    placeholder="Ex.: Passe, Defesa, Finalização"
                    onChange={(event) =>
                      setNovoCampo((atual) => ({
                        ...atual,
                        nome: event.target.value,
                      }))
                    }
                    maxLength={100}
                    required
                  />
                </div>

                <div className={styles.categoryField}>
                  <label htmlFor="tipoCampo">Classificação padrão</label>
                  <select
                    id="tipoCampo"
                    value={novoCampo.tipo}
                    onChange={(event) =>
                      setNovoCampo((atual) => ({
                        ...atual,
                        tipo: event.target.value as TipoEvento,
                      }))
                    }
                    style={campoSelect}
                  >
                    <option value="boa">Boa</option>
                    <option value="ruim">Ruim</option>
                    <option value="neutra">Neutra</option>
                    <option value="destaque">Destaque</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className={styles.saveCategoryButton}
                  disabled={!novoCampo.nome.trim() || salvandoCampo}
                >
                  <Plus size={15} />
                  {salvandoCampo ? 'Salvando...' : 'Criar campo'}
                </button>
              </form>

              <div className={styles.categoryListToolbar}>
                <div>
                  <strong>Campos disponíveis</strong>
                  <span>
                    {categorias.length}{' '}
                    {categorias.length === 1 ? 'campo' : 'campos'}
                  </span>
                </div>
              </div>

              <div className={styles.categoriesList}>
                {categorias.length === 0 ? (
                  <div
                    style={{
                      padding: 24,
                      textAlign: 'center',
                      color: '#718078',
                    }}
                  >
                    Nenhum campo cadastrado. Crie o primeiro acima.
                  </div>
                ) : (
                  categorias.map((categoria) => (
                    <div
                      key={categoria.id}
                      className={styles.categoryRow}
                    >
                      <div
                        className={styles.categoryRowIcon}
                        style={{
                          background: '#e5f5ef',
                          color: '#16a875',
                        }}
                      >
                        <Video size={18} />
                      </div>

                      <div className={styles.categoryRowInfo}>
                        <strong>{categoria.nome}</strong>
                        <span>
                          {categoria.tipo === 'boa'
                            ? 'Classificação: Boa'
                            : categoria.tipo === 'ruim'
                              ? 'Classificação: Ruim'
                              : categoria.tipo === 'destaque'
                                ? 'Classificação: Destaque'
                                : 'Classificação: Neutra'}
                        </span>
                      </div>

                      <button
                        type="button"
                        className={styles.editCategoryButton}
                        onClick={() => selecionarCategoria(categoria)}
                      >
                        <Plus size={13} />
                        Marcar
                      </button>
                    </div>
                  ))
                )}
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
              >
                <X size={17} />
              </button>
            </div>

            <div className={styles.clipPanelContent}>
              <div className={styles.formGroup}>
                <label>Nome do clipe</label>
                <input
                  type="text"
                  value={novoClipe.nome}
                  placeholder="Ex.: Melhor jogada"
                  onChange={(event) =>
                    setNovoClipe({
                      ...novoClipe,
                      nome: event.target.value,
                    })
                  }
                />
              </div>

              <div className={styles.formGroup}>
                <label>Descrição</label>
                <textarea
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
                <h3>Duração do clipe</h3>

                <div className={styles.durationInfo}>
                  <span>
                    Início: {formatarTempo(novoClipe.inicio)}
                  </span>
                  <span className={styles.durationValue}>
                    Fim: {formatarTempo(novoClipe.fim)}
                  </span>
                </div>

                <div className={styles.rangeGroup}>
                  <input
                    type="range"
                    min="0"
                    max={Math.max(
                      duracaoVideo,
                      novoClipe.inicio + 1,
                      1,
                    )}
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
                    min={Math.min(
                      novoClipe.inicio + 1,
                      duracaoVideo || novoClipe.inicio + 1,
                    )}
                    max={Math.max(
                      duracaoVideo,
                      novoClipe.inicio + 1,
                      1,
                    )}
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
              </div>

              {clipes.length > 0 && (
                <div>
                  <h3>Clipes salvos: {clipes.length}</h3>
                  {clipes.map((clipe) => (
                    <button
                      key={clipe.id}
                      type="button"
                      className={styles.eventItem}
                      onClick={() => irParaEvento(clipe.inicio, clipe.fim)}
                    >
                      <Scissors size={16} />
                      <span>
                        {clipe.nome} ({formatarTempo(clipe.inicio)}–{formatarTempo(clipe.fim)})
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className={styles.clipPanelFooter}>
              <button
                type="button"
                className={styles.saveClipButton}
                disabled={
                  !novoClipe.nome.trim() ||
                  salvando ||
                  !videoSelecionado
                }
                onClick={() => void adicionarClipe()}
              >
                <Scissors size={15} />
                {salvando ? 'Salvando...' : 'Salvar clipe'}
              </button>
            </div>
          </aside>
        </>
      )}

      {mostrarNovoEvento && (
        <div
          className={styles.categoryOverlay}
          onClick={() => setMostrarNovoEvento(false)}
        >
          <div
            className={styles.categoryModal}
            style={{ width: 'min(560px, 100%)' }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className={styles.categoryModalHeader}>
              <div>
                <span>ANÁLISE</span>
                <h2>Marcar evento</h2>
                <p>Registre um momento importante da partida.</p>
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
                  <label htmlFor="campoEvento">Campo de análise</label>
                  <select
                    id="campoEvento"
                    value={novoEvento.nome}
                    onChange={(event) => {
                      const categoria = categorias.find(
                        (item) => item.nome === event.target.value,
                      );

                      setNovoEvento({
                        ...novoEvento,
                        nome: event.target.value,
                        tipo: categoria?.tipo || novoEvento.tipo,
                      });
                    }}
                    style={campoSelect}
                  >
                    <option value="">Selecione um campo</option>
                    {categorias.map((categoria) => (
                      <option
                        key={categoria.id}
                        value={categoria.nome}
                      >
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
                        setMostrarCategorias(true);
                      }}
                    >
                      <Plus size={15} />
                      Criar campo de análise
                    </button>
                  )}
                </div>

                <div className={styles.categoryField}>
                  <label htmlFor="descricaoEvento">Descrição</label>
                  <input
                    id="descricaoEvento"
                    value={novoEvento.descricao}
                    placeholder="Descreva o momento"
                    onChange={(event) =>
                      setNovoEvento({
                        ...novoEvento,
                        descricao: event.target.value,
                      })
                    }
                  />
                </div>

                <div className={styles.categoryField}>
                  <label htmlFor="tipoEvento">Tipo do evento</label>
                  <select
                    id="tipoEvento"
                    value={novoEvento.tipo}
                    onChange={(event) =>
                      setNovoEvento({
                        ...novoEvento,
                        tipo: event.target.value as TipoEvento,
                      })
                    }
                    style={campoSelect}
                  >
                    <option value="boa">Boa</option>
                    <option value="ruim">Ruim</option>
                    <option value="neutra">Neutra</option>
                    <option value="destaque">Destaque</option>
                  </select>
                </div>

                <div className={styles.categoryFormFooter}>
                  <span
                    style={{
                      color: '#78867f',
                      fontSize: 12,
                    }}
                  >
                    Momento atual: {formatarTempo(tempoAtual)}
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
                        !novoEvento.nome.trim() ||
                        !videoSelecionado ||
                        salvando
                      }
                      onClick={() => void adicionarEvento()}
                    >
                      <Check size={15} />
                      {salvando ? 'Salvando...' : 'Salvar evento'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const botaoControle = {
  width: 34,
  height: 34,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: 'none',
  borderRadius: 8,
  background: 'transparent',
  color: '#ffffff',
  cursor: 'pointer',
} as const;

const campoSelect = {
  width: '100%',
  height: 48,
  padding: '0 14px',
  border: '1px solid #c8d5cf',
  borderRadius: 10,
  background: '#ffffff',
  color: '#2c3c34',
  fontFamily: 'inherit',
  fontSize: 15,
} as const;
