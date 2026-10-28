import {
  ArrowLeft,
  CalendarDays,
  Check,
  CircleAlert,
  Clock3,
  Film,
  LoaderCircle,
  Pencil,
  Play,
  Plus,
  RefreshCw,
  Save,
  Scissors,
  ShieldAlert,
  Trash2,
  Trophy,
  Upload,
  Users,
  Video,
  X,
} from 'lucide-react';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type MouseEvent,
} from 'react';

import {
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';

import styles from './partidas2.module.css';

const API_URL = 'http://localhost:3000/api';

type StatusAnalise = 'Pendente' | 'Em análise' | 'Analisada';

interface Atleta {
  id: number;
  nome: string;
  email?: string;
  equipeId?: number | null;
  equipe?: string;
  categoria?: string;
  modalidade?: string;
}

interface Equipe {
  id: number;
  nome: string;
}

interface Partida {
  id: number;
  adversario?: string;
  adversarioNome?: string;
  nomeAdversario?: string;
  equipeId?: number | null;
  equipe?: Equipe | null;
  equipeNome?: string;
  data?: string;
  dataPartida?: string;
  horario?: string;
  local?: string;
  campeonato?: string;
  golsEquipe?: number | null;
  golsAdversario?: number | null;
  golsFeitos?: number | null;
  golsSofridos?: number | null;
  placarNosso?: number | null;
  placarAdversario?: number | null;
  status?: string;
  statusAnalise?: StatusAnalise;
  observacoes?: string;
  atletas?: Atleta[];
  [key: string]: unknown;
}

interface VideoPartida {
  id: number;
  titulo?: string;
  nome?: string;
  url?: string;
  caminhoArquivo?: string;
  nomeArquivo?: string;
  arquivo?: string;
  duracao?: number;
  createdAt?: string;
}

interface MarcacaoVideo {
  id: number;
  titulo?: string;
  categoria?: string;
  tempoInicio?: number | string;
  tempoFim?: number | string;
  observacao?: string;
  descricao?: string;
  videoId?: number;
  videoTitulo?: string;
}

interface EstadoNavegacao {
  id?: number | string;
  partidaId?: number | string;
  partida?: Partida;
}

type RespostaApi = Record<string, unknown>;

function obterToken(): string {
  return (
    localStorage.getItem('token') ||
    localStorage.getItem('accessToken') ||
    ''
  );
}

function headersAuth(): HeadersInit {
  const token = obterToken();

  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function lerResposta<T>(resposta: Response): Promise<T> {
  const texto = await resposta.text();
  let dados: unknown = {};

  if (texto.trim()) {
    try {
      dados = JSON.parse(texto);
    } catch {
      dados = { mensagem: texto };
    }
  }

  if (!resposta.ok) {
    const objeto =
      dados && typeof dados === 'object'
        ? (dados as RespostaApi)
        : {};

    throw new Error(
      String(
        objeto.mensagem ||
          objeto.erro ||
          `Erro HTTP ${resposta.status}.`,
      ),
    );
  }

  return dados as T;
}

function extrairPartida(dados: unknown): Partida | null {
  if (!dados || typeof dados !== 'object') return null;

  const objeto = dados as RespostaApi;

  if (objeto.partida && typeof objeto.partida === 'object') {
    return extrairPartida(objeto.partida);
  }

  if (objeto.dados && typeof objeto.dados === 'object') {
    return extrairPartida(objeto.dados);
  }

  const id = Number(objeto.id);

  if (!Number.isFinite(id) || id <= 0) return null;

  return objeto as unknown as Partida;
}

function extrairLista<T>(
  dados: unknown,
  chaves: string[] = [],
): T[] {
  if (Array.isArray(dados)) return dados as T[];
  if (!dados || typeof dados !== 'object') return [];

  const objeto = dados as RespostaApi;

  for (const chave of chaves) {
    const valor = objeto[chave];
    if (Array.isArray(valor)) return valor as T[];
  }

  if (objeto.dados && typeof objeto.dados === 'object') {
    return extrairLista<T>(objeto.dados, chaves);
  }

  if (objeto.partida && typeof objeto.partida === 'object') {
    return extrairLista<T>(objeto.partida, chaves);
  }

  return [];
}

function normalizarStatus(status?: string | null): StatusAnalise {
  const valor = (status || '')
    .trim()
    .toUpperCase()
    .replace(/\s+/g, '_');

  if (
    ['EM_ANALISE', 'EM_ANDAMENTO', 'EM_ANDAMENTO_ANALISE'].includes(
      valor,
    )
  ) {
    return 'Em análise';
  }

  if (
    [
      'ANALISADA',
      'FINALIZADA',
      'FINALIZADO',
      'CONCLUIDA',
      'CONCLUÍDA',
    ].includes(valor)
  ) {
    return 'Analisada';
  }

  return 'Pendente';
}

function statusParaBanco(status: StatusAnalise): string {
  if (status === 'Em análise') return 'EM_ANDAMENTO';
  if (status === 'Analisada') return 'FINALIZADA';
  return 'AGENDADA';
}

function adaptarPartidaBackend(dados: Partida): Partida {
  const golsNossaEquipe =
    dados.golsEquipe ??
    dados.golsFeitos ??
    dados.placarNosso ??
    null;

  const golsEquipeAdversaria =
    dados.golsAdversario ??
    dados.golsSofridos ??
    dados.placarAdversario ??
    null;

  return {
    ...dados,
    id: Number(dados.id),
    equipeId:
      dados.equipeId != null
        ? Number(dados.equipeId)
        : dados.equipe?.id != null
          ? Number(dados.equipe.id)
          : null,
    equipeNome:
      dados.equipeNome || dados.equipe?.nome || 'Equipe',
    adversario:
      dados.adversario ||
      dados.adversarioNome ||
      dados.nomeAdversario ||
      'Adversário',
    data: dados.data || dados.dataPartida || '',
    golsEquipe: golsNossaEquipe,
    golsAdversario: golsEquipeAdversaria,
    golsFeitos: golsNossaEquipe,
    golsSofridos: golsEquipeAdversaria,
    placarNosso: golsNossaEquipe,
    placarAdversario: golsEquipeAdversaria,
    statusAnalise: normalizarStatus(
      dados.statusAnalise || dados.status,
    ),
  };
}

function nomeDoAtleta(atleta: Atleta): string {
  return atleta.nome || 'Atleta sem nome';
}

function nomeDoVideo(video: VideoPartida): string {
  return video.titulo || video.nome || `Vídeo ${video.id}`;
}

function formatarData(data?: string): string {
  if (!data) return 'Data não informada';

  const valor = new Date(data);
  if (Number.isNaN(valor.getTime())) return data;

  return valor.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

function segundosParaTempo(valor?: number | string): string {
  if (valor == null || valor === '') return '00:00';

  const numero = Number(valor);
  if (!Number.isFinite(numero)) return String(valor);

  const segundos = Math.max(0, Math.floor(numero));
  const horas = Math.floor(segundos / 3600);
  const minutos = Math.floor((segundos % 3600) / 60);
  const resto = segundos % 60;

  if (horas > 0) {
    return [
      String(horas).padStart(2, '0'),
      String(minutos).padStart(2, '0'),
      String(resto).padStart(2, '0'),
    ].join(':');
  }

  return [
    String(minutos).padStart(2, '0'),
    String(resto).padStart(2, '0'),
  ].join(':');
}

function normalizarUrlVideo(caminho?: string): string {
  if (!caminho) return '';

  if (/^(https?:\/\/|blob:)/i.test(caminho)) {
    return caminho;
  }

  const limpo = caminho.replace(/^\/+/, '');

  if (limpo.startsWith('uploads/')) {
    return `http://localhost:3000/${limpo}`;
  }

  return `http://localhost:3000/uploads/${limpo}`;
}

function extrairMarcacoes(dados: unknown): MarcacaoVideo[] {
  return extrairLista<MarcacaoVideo>(dados, [
    'marcacoes',
    'eventos',
    'dados',
  ]);
}

function extrairEquipeId(dados: unknown): number | null {
  const partida = extrairPartida(dados);
  if (!partida) return null;

  if (partida.equipeId != null) {
    const id = Number(partida.equipeId);
    return Number.isFinite(id) ? id : null;
  }

  if (partida.equipe?.id != null) {
    const id = Number(partida.equipe.id);
    return Number.isFinite(id) ? id : null;
  }

  return null;
}

function classeEvento(categoria?: string): string {
  const valor = (categoria || '').toLowerCase();

  if (valor.includes('bom') || valor.includes('boa')) {
    return styles.eventoBom;
  }

  if (valor.includes('ruim') || valor.includes('erro')) {
    return styles.eventoRuim;
  }

  if (valor.includes('destaque')) {
    return styles.eventoDestaque;
  }

  if (valor.includes('clipe') || valor.includes('clip')) {
    return styles.eventoClipe;
  }

  return styles.eventoNeutro;
}

function iniciais(nome: string): string {
  return nome
    .split(/\s+/)
    .slice(0, 2)
    .map((parte) => parte[0] || '')
    .join('')
    .toUpperCase();
}

export default function DetalhesPartida() {
  const params = useParams<{
    id?: string;
    partidaId?: string;
  }>();

  const navigate = useNavigate();
  const location = useLocation();

  const inputVideoRef = useRef<HTMLInputElement>(null);
  const playerRef = useRef<HTMLVideoElement>(null);

  const estadoNavegacao = location.state as
    | EstadoNavegacao
    | Partida
    | null;

  const partidaNoEstado = useMemo((): Partida | null => {
    if (!estadoNavegacao || typeof estadoNavegacao !== 'object') {
      return null;
    }

    if ('partida' in estadoNavegacao && estadoNavegacao.partida) {
      return estadoNavegacao.partida;
    }

    if ('id' in estadoNavegacao && Number(estadoNavegacao.id) > 0) {
      return estadoNavegacao as Partida;
    }

    return null;
  }, [estadoNavegacao]);

  const idDaUrl = location.pathname.match(/\/(\d+)\/?$/)?.[1];
  const idDaQuery = new URLSearchParams(location.search).get('id');

  const idDoEstado =
    estadoNavegacao && typeof estadoNavegacao === 'object'
      ? (
          'partidaId' in estadoNavegacao
            ? estadoNavegacao.partidaId
            : undefined
        ) ??
        partidaNoEstado?.id ??
        ('id' in estadoNavegacao
          ? estadoNavegacao.id
          : undefined)
      : undefined;

  const idRecebido =
    params.id ??
    params.partidaId ??
    idDoEstado ??
    idDaUrl ??
    idDaQuery ??
    undefined;

  const parametroId =
    idRecebido == null ? undefined : String(idRecebido);

  const idPartida = Number(parametroId);

  const idValido =
    parametroId != null &&
    parametroId.trim() !== '' &&
    Number.isInteger(idPartida) &&
    idPartida > 0;

  const partidaInicial = useMemo(() => {
    if (!partidaNoEstado || !idValido) return null;
    if (Number(partidaNoEstado.id) !== idPartida) return null;

    return adaptarPartidaBackend(partidaNoEstado);
  }, [partidaNoEstado, idPartida, idValido]);

  const [partida, setPartida] = useState<Partida | null>(
    partidaInicial,
  );

  const [statusAnalise, setStatusAnalise] =
    useState<StatusAnalise>(
      partidaInicial?.statusAnalise || 'Pendente',
    );

  const [editandoResultado, setEditandoResultado] = useState(false);
  const [golsNossaEditado, setGolsNossaEditado] = useState('');
  const [golsAdversarioEditado, setGolsAdversarioEditado] =
    useState('');
  const [salvandoResultado, setSalvandoResultado] = useState(false);

  const [videos, setVideos] = useState<VideoPartida[]>([]);
  const [atletasDisponiveis, setAtletasDisponiveis] =
    useState<Atleta[]>([]);
  const [atletasSelecionados, setAtletasSelecionados] =
    useState<number[]>([]);
  const [videoSelecionado, setVideoSelecionado] =
    useState<VideoPartida | null>(null);
  const [marcacoes, setMarcacoes] = useState<MarcacaoVideo[]>([]);

  const [eventosPartida, setEventosPartida] =
    useState<MarcacaoVideo[]>([]);
  const [carregandoEventos, setCarregandoEventos] = useState(false);

  const [buscaAtleta, setBuscaAtleta] = useState('');
  const [tituloVideo, setTituloVideo] = useState('');
  const [arquivoVideo, setArquivoVideo] = useState<File | null>(null);

  const [modalAtletas, setModalAtletas] = useState(false);
  const [modalUpload, setModalUpload] = useState(false);
  const [modalExcluir, setModalExcluir] = useState(false);

  const [carregando, setCarregando] = useState(true);
  const [carregandoAtletas, setCarregandoAtletas] = useState(false);
  const [carregandoVideos, setCarregandoVideos] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [salvandoStatus, setSalvandoStatus] = useState(false);
  const [enviandoVideo, setEnviandoVideo] = useState(false);
  const [excluindoPartida, setExcluindoPartida] = useState(false);

  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  const limparMensagens = () => {
    setErro('');
    setSucesso('');
  };

  const buscarPartida = useCallback(async (): Promise<Partida> => {
    if (!idValido) {
      throw new Error(
        `ID da partida inválido. Parâmetro recebido: ${String(
          parametroId,
        )}. Confira como a tela de detalhes está sendo aberta.`,
      );
    }

    let erroBusca: unknown = null;

    try {
      const resposta = await fetch(
        `${API_URL}/partidas/${idPartida}`,
        {
          method: 'GET',
          headers: headersAuth(),
        },
      );

      const dados = await lerResposta<unknown>(resposta);
      const encontrada = extrairPartida(dados);

      if (encontrada && Number(encontrada.id) === idPartida) {
        const adaptada = adaptarPartidaBackend(encontrada);

        setPartida(adaptada);
        setStatusAnalise(adaptada.statusAnalise || 'Pendente');

        return adaptada;
      }

      erroBusca = new Error(
        'A API respondeu, mas não retornou uma partida válida.',
      );
    } catch (error) {
      erroBusca = error;
      console.warn(
        'Falha ao buscar partida pelo ID; tentando pela listagem.',
        error,
      );
    }

    try {
      const respostaLista = await fetch(`${API_URL}/partidas`, {
        method: 'GET',
        headers: headersAuth(),
      });

      const dadosLista = await lerResposta<unknown>(respostaLista);
      const lista = extrairLista<Partida>(dadosLista, [
        'partidas',
        'dados',
      ]);

      const encontrada = lista.find(
        (item) => Number(item.id) === idPartida,
      );

      if (encontrada) {
        const adaptada = adaptarPartidaBackend(encontrada);

        setPartida(adaptada);
        setStatusAnalise(adaptada.statusAnalise || 'Pendente');

        return adaptada;
      }
    } catch (error) {
      console.error('Erro ao consultar partidas:', error);
    }

    throw new Error(
      erroBusca instanceof Error
        ? `Não foi possível carregar a partida ${idPartida}. ${erroBusca.message}`
        : `A partida ${idPartida} não foi encontrada na API.`,
    );
  }, [idPartida, idValido, parametroId]);

  const carregarVideos = useCallback(async () => {
    if (!idValido) return;

    setCarregandoVideos(true);
    setCarregandoEventos(true);

    try {
      const resposta = await fetch(
        `${API_URL}/partidas/${idPartida}/videos`,
        { headers: headersAuth() },
      );

      const dados = await lerResposta<unknown>(resposta);

      const listaVideos = extrairLista<VideoPartida>(dados, [
        'videos',
        'dados',
      ]);

      setVideos(listaVideos);

      const resultados = await Promise.allSettled(
        listaVideos.map(async (video) => {
          const respostaMarcacoes = await fetch(
            `${API_URL}/videos/${video.id}/marcacoes`,
            { headers: headersAuth() },
          );

          const dadosMarcacoes =
            await lerResposta<unknown>(respostaMarcacoes);

          return extrairMarcacoes(dadosMarcacoes).map((marcacao) => ({
            ...marcacao,
            videoId: Number(video.id),
            videoTitulo: nomeDoVideo(video),
          }));
        }),
      );

      const todosEventos = resultados
        .filter(
          (
            resultado,
          ): resultado is PromiseFulfilledResult<MarcacaoVideo[]> =>
            resultado.status === 'fulfilled',
        )
        .flatMap((resultado) => resultado.value)
        .sort(
          (a, b) =>
            Number(a.tempoInicio || 0) -
            Number(b.tempoInicio || 0),
        );

      setEventosPartida(todosEventos);
    } finally {
      setCarregandoVideos(false);
      setCarregandoEventos(false);
    }
  }, [idPartida, idValido]);

  const carregarAtletas = useCallback(async () => {
    if (!idValido) return;

    setCarregandoAtletas(true);

    try {
      const [respostaAtletas, respostaVinculos, partidaAtual] =
        await Promise.all([
          fetch(`${API_URL}/atletas`, {
            headers: headersAuth(),
          }),
          fetch(`${API_URL}/partidas/${idPartida}/atletas`, {
            headers: headersAuth(),
          }),
          buscarPartida(),
        ]);

      const [dadosAtletas, dadosVinculos] = await Promise.all([
        lerResposta<unknown>(respostaAtletas),
        lerResposta<unknown>(respostaVinculos),
      ]);

      const equipeId = extrairEquipeId(partidaAtual);

      if (equipeId == null) {
        setAtletasDisponiveis([]);
        setAtletasSelecionados([]);
        return;
      }

      const listaAtletas = extrairLista<Atleta>(dadosAtletas, [
        'atletas',
        'dados',
      ]);

      const mesmaEquipe = listaAtletas.filter(
        (atleta) =>
          atleta.equipeId != null &&
          Number(atleta.equipeId) === equipeId,
      );

      setAtletasDisponiveis(mesmaEquipe);

      const vinculos = extrairLista<unknown>(dadosVinculos, [
        'atletas',
        'participantes',
        'dados',
      ]);

      const ids = vinculos
        .map((item) => {
          if (!item || typeof item !== 'object') return null;

          const registro = item as RespostaApi;
          const atleta =
            registro.atleta && typeof registro.atleta === 'object'
              ? (registro.atleta as RespostaApi)
              : null;

          const valor = Number(
            atleta?.id ?? registro.atletaId ?? registro.id,
          );

          return Number.isFinite(valor) ? valor : null;
        })
        .filter((id): id is number => id !== null);

      setAtletasSelecionados(
        Array.from(
          new Set(
            ids.filter((id) =>
              mesmaEquipe.some(
                (atleta) => Number(atleta.id) === id,
              ),
            ),
          ),
        ),
      );
    } finally {
      setCarregandoAtletas(false);
    }
  }, [buscarPartida, idPartida, idValido]);

  const carregarMarcacoes = useCallback(async (videoId: number) => {
    const resposta = await fetch(
      `${API_URL}/videos/${videoId}/marcacoes`,
      { headers: headersAuth() },
    );

    const dados = await lerResposta<unknown>(resposta);
    setMarcacoes(extrairMarcacoes(dados));
  }, []);

  const recarregarTudo = useCallback(async () => {
    limparMensagens();
    setCarregando(true);

    try {
      await buscarPartida();

      await Promise.allSettled([
        carregarVideos(),
        carregarAtletas(),
      ]);
    } catch (error) {
      console.error('Erro ao carregar partida:', error);

      setErro(
        error instanceof Error
          ? error.message
          : 'Não foi possível carregar os dados da partida.',
      );
    } finally {
      setCarregando(false);
    }
  }, [buscarPartida, carregarVideos, carregarAtletas]);

  useEffect(() => {
    void recarregarTudo();
  }, [recarregarTudo]);

  const atletasFiltrados = useMemo(() => {
    const busca = buscaAtleta.trim().toLowerCase();

    return atletasDisponiveis.filter((atleta) =>
      nomeDoAtleta(atleta).toLowerCase().includes(busca),
    );
  }, [atletasDisponiveis, buscaAtleta]);

  const atletasParticipantes = useMemo(() => {
    const ids = new Set(atletasSelecionados);

    return atletasDisponiveis.filter((atleta) =>
      ids.has(Number(atleta.id)),
    );
  }, [atletasDisponiveis, atletasSelecionados]);

  const placarNosso =
    partida?.golsEquipe ??
    partida?.golsFeitos ??
    partida?.placarNosso;

  const placarAdversario =
    partida?.golsAdversario ??
    partida?.golsSofridos ??
    partida?.placarAdversario;

  const adversario =
    partida?.adversario ||
    partida?.adversarioNome ||
    partida?.nomeAdversario ||
    'Adversário';

  const equipeNome =
    partida?.equipeNome ||
    partida?.equipe?.nome ||
    'Minha equipe';

  const abrirEdicaoResultado = () => {
    limparMensagens();

    setGolsNossaEditado(
      placarNosso == null ? '' : String(placarNosso),
    );

    setGolsAdversarioEditado(
      placarAdversario == null
        ? ''
        : String(placarAdversario),
    );

    setEditandoResultado(true);
  };

  const salvarResultado = async () => {
    if (!idValido || !partida) {
      setErro('Não foi possível identificar a partida.');
      return;
    }

    const golsNossa = Number(golsNossaEditado);
    const golsAdversario = Number(golsAdversarioEditado);

    if (
      golsNossaEditado.trim() === '' ||
      golsAdversarioEditado.trim() === '' ||
      !Number.isInteger(golsNossa) ||
      !Number.isInteger(golsAdversario) ||
      golsNossa < 0 ||
      golsAdversario < 0
    ) {
      setErro(
        'Informe um número inteiro igual ou maior que zero para os gols.',
      );
      return;
    }

    limparMensagens();
    setSalvandoResultado(true);

    try {
      const resposta = await fetch(
        `${API_URL}/partidas/${idPartida}`,
        {
          method: 'PUT',
          headers: headersAuth(),
          body: JSON.stringify({
            golsEquipe: golsNossa,
            golsAdversario,
            golsFeitos: golsNossa,
            golsSofridos: golsAdversario,
          }),
        },
      );

      const dados = await lerResposta<unknown>(resposta);
      const partidaAtualizada = extrairPartida(dados);

      setPartida((atual) => {
        if (!atual) return atual;

        return adaptarPartidaBackend({
          ...atual,
          ...(partidaAtualizada || {}),
          golsEquipe: golsNossa,
          golsAdversario,
          golsFeitos: golsNossa,
          golsSofridos: golsAdversario,
          placarNosso: golsNossa,
          placarAdversario: golsAdversario,
        });
      });

      setEditandoResultado(false);
      setSucesso('Resultado da partida atualizado com sucesso!');
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : 'Não foi possível salvar o resultado.',
      );
    } finally {
      setSalvandoResultado(false);
    }
  };

  const atualizarStatus = async (novoStatus: StatusAnalise) => {
    if (!idValido) {
      setErro('Não é possível atualizar: o ID da partida é inválido.');
      return;
    }

    limparMensagens();
    setSalvandoStatus(true);

    try {
      const resposta = await fetch(
        `${API_URL}/partidas/${idPartida}`,
        {
          method: 'PUT',
          headers: headersAuth(),
          body: JSON.stringify({
            status: statusParaBanco(novoStatus),
          }),
        },
      );

      const dados = await lerResposta<unknown>(resposta);
      const atualizada = extrairPartida(dados);

      const statusFinal = atualizada
        ? normalizarStatus(
            atualizada.statusAnalise || atualizada.status,
          )
        : novoStatus;

      setStatusAnalise(statusFinal);

      if (atualizada) {
        setPartida((atual) =>
          atual
            ? adaptarPartidaBackend({
                ...atual,
                ...atualizada,
              })
            : adaptarPartidaBackend(atualizada),
        );
      } else {
        setPartida((atual) =>
          atual
            ? {
                ...atual,
                status: statusParaBanco(novoStatus),
                statusAnalise: novoStatus,
              }
            : atual,
        );
      }

      setSucesso('Status da partida atualizado.');
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : 'Não foi possível atualizar o status.',
      );
    } finally {
      setSalvandoStatus(false);
    }
  };

  const alternarAtleta = (atletaId: number) => {
    setAtletasSelecionados((atuais) =>
      atuais.includes(atletaId)
        ? atuais.filter((id) => id !== atletaId)
        : [...atuais, atletaId],
    );
  };

  const salvarAtletas = async () => {
    if (!idValido) {
      setErro('Não é possível salvar: o ID da partida é inválido.');
      return;
    }

    limparMensagens();
    setSalvando(true);

    try {
      const idsValidos = atletasSelecionados.filter((id) =>
        atletasDisponiveis.some(
          (atleta) => Number(atleta.id) === id,
        ),
      );

      const resposta = await fetch(
        `${API_URL}/partidas/${idPartida}/atletas`,
        {
          method: 'PUT',
          headers: headersAuth(),
          body: JSON.stringify({ atletasIds: idsValidos }),
        },
      );

      await lerResposta<unknown>(resposta);

      setAtletasSelecionados(idsValidos);
      setModalAtletas(false);
      setSucesso('Atletas da partida salvos com sucesso.');
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : 'Não foi possível salvar os atletas.',
      );
    } finally {
      setSalvando(false);
    }
  };

    const abrirUpload = () => {
    limparMensagens();
    setTituloVideo('');
    setArquivoVideo(null);

    if (inputVideoRef.current) {
      inputVideoRef.current.value = '';
    }

    setModalUpload(true);
  };

  const alterarArquivo = (
    evento: ChangeEvent<HTMLInputElement>,
  ) => {
    const arquivo = evento.target.files?.[0] || null;

    if (!arquivo) {
      setArquivoVideo(null);
      return;
    }

    if (!arquivo.type.startsWith('video/')) {
      setErro('Selecione um arquivo de vídeo válido.');
      evento.target.value = '';
      setArquivoVideo(null);
      return;
    }

    setErro('');
    setArquivoVideo(arquivo);

    if (!tituloVideo.trim()) {
      setTituloVideo(arquivo.name.replace(/\.[^/.]+$/, ''));
    }
  };

  const enviarVideo = async (
    evento: FormEvent<HTMLFormElement>,
  ) => {
    evento.preventDefault();
    limparMensagens();

    if (!idValido) {
      setErro('Não é possível enviar: o ID da partida é inválido.');
      return;
    }

    if (!arquivoVideo) {
      setErro('Selecione um vídeo antes de enviar.');
      return;
    }

    if (!tituloVideo.trim()) {
      setErro('Informe um título para o vídeo.');
      return;
    }

    setEnviandoVideo(true);

    try {
      const formulario = new FormData();
      formulario.append('arquivo', arquivoVideo);
      formulario.append('titulo', tituloVideo.trim());

      const token = obterToken();

      const resposta = await fetch(
        `${API_URL}/partidas/${idPartida}/videos`,
        {
          method: 'POST',
          headers: token
            ? { Authorization: `Bearer ${token}` }
            : {},
          body: formulario,
        },
      );

      await lerResposta<unknown>(resposta);

      setModalUpload(false);
      setTituloVideo('');
      setArquivoVideo(null);

      await carregarVideos();
      setSucesso('Vídeo enviado com sucesso.');
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : 'Não foi possível enviar o vídeo.',
      );
    } finally {
      setEnviandoVideo(false);
    }
  };

  const excluirVideo = async (videoId: number) => {
    if (
      !window.confirm(
        'Tem certeza de que deseja excluir este vídeo?',
      )
    ) {
      return;
    }

    limparMensagens();

    try {
      const resposta = await fetch(
        `${API_URL}/videos/${videoId}`,
        {
          method: 'DELETE',
          headers: headersAuth(),
        },
      );

      await lerResposta<unknown>(resposta);

      setVideos((atuais) =>
        atuais.filter((video) => Number(video.id) !== videoId),
      );

      setEventosPartida((atuais) =>
        atuais.filter((evento) => evento.videoId !== videoId),
      );

      if (Number(videoSelecionado?.id) === videoId) {
        setVideoSelecionado(null);
        setMarcacoes([]);
      }

      setSucesso('Vídeo excluído com sucesso.');
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : 'Não foi possível excluir o vídeo.',
      );
    }
  };

  const excluirPartida = async () => {
    if (!idValido) {
      setErro('Não é possível excluir: o ID da partida é inválido.');
      return;
    }

    limparMensagens();
    setExcluindoPartida(true);

    try {
      const resposta = await fetch(
        `${API_URL}/partidas/${idPartida}`,
        {
          method: 'DELETE',
          headers: headersAuth(),
        },
      );

      await lerResposta<unknown>(resposta);
      navigate('/partidas');
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : 'Não foi possível excluir a partida.',
      );

      setModalExcluir(false);
    } finally {
      setExcluindoPartida(false);
    }
  };

  const selecionarVideo = async (video: VideoPartida) => {
    limparMensagens();
    setVideoSelecionado(video);
    setMarcacoes([]);

    try {
      await carregarMarcacoes(video.id);
    } catch (error) {
      setMarcacoes([]);

      setErro(
        error instanceof Error
          ? error.message
          : 'Não foi possível carregar as marcações do vídeo.',
      );
    }
  };

  const reproduzirMarcacao = (marcacao: MarcacaoVideo) => {
    const player = playerRef.current;
    if (!player) return;

    const inicio = Number(marcacao.tempoInicio || 0);

    player.currentTime = Number.isFinite(inicio)
      ? Math.max(0, inicio)
      : 0;

    void player.play().catch((error: unknown) => {
      console.warn('Não foi possível reproduzir o vídeo:', error);
    });
  };

  const abrirEventoDaPartida = async (
    evento: MarcacaoVideo,
  ) => {
    const video = videos.find(
      (item) => Number(item.id) === Number(evento.videoId),
    );

    if (!video) {
      setErro('Não foi possível localizar o vídeo deste evento.');
      return;
    }

    await selecionarVideo(video);

    const inicio = Number(evento.tempoInicio || 0);

    window.setTimeout(() => {
      const player = playerRef.current;
      if (!player) return;

      player.currentTime = Number.isFinite(inicio)
        ? Math.max(0, inicio)
        : 0;

      void player.play().catch((error: unknown) => {
        console.warn('Não foi possível reproduzir o vídeo:', error);
      });
    }, 400);
  };

  const fecharModalAoClicarFora = (
    evento: MouseEvent<HTMLDivElement>,
    fechar: () => void,
  ) => {
    if (evento.target === evento.currentTarget) {
      fechar();
    }
  };

  if (carregando) {
    return (
      <main className={styles.page}>
        <div className={styles.pageInner}>
          <div className={styles.loadingState}>
            <LoaderCircle size={24} className={styles.spinner} />
            Carregando detalhes da partida...
          </div>
        </div>
      </main>
    );
  }

  if (!partida) {
    return (
      <main className={styles.page}>
        <div className={styles.pageInner}>
          <div className={styles.emptyPage}>
            <CircleAlert size={38} />

            <h2>Partida não encontrada</h2>

            <p>
              {erro ||
                'Não foi possível localizar os dados desta partida.'}
            </p>

            <button
              type="button"
              className={styles.primaryButton}
              onClick={() => navigate('/partidas')}
            >
              <ArrowLeft size={17} />
              Voltar para partidas
            </button>

            <button
              type="button"
              className={styles.secondaryButton}
              onClick={() => void recarregarTudo()}
            >
              <RefreshCw size={17} />
              Tentar novamente
            </button>
          </div>
        </div>
      </main>
    );
  }

  const statusClasse =
    statusAnalise === 'Analisada'
      ? styles.statusDone
      : statusAnalise === 'Em análise'
        ? styles.statusWorking
        : styles.statusPending;

  return (
    <main className={styles.page}>
      <div className={styles.pageInner}>
        <button
          type="button"
          className={styles.backButton}
          onClick={() => navigate('/partidas')}
        >
          <ArrowLeft size={17} />
          Voltar para partidas
        </button>

        <header className={styles.pageHeader}>
          <div>

            <h1>Detalhes da <em>partida</em></h1>

            <p>
              Consulte o resultado, os atletas, os vídeos e as marcações
              desta partida.
            </p>
          </div>

          <button
            type="button"
            className={styles.outlineButton}
            onClick={() => void recarregarTudo()}
            disabled={carregando}
          >
            <RefreshCw size={16} />
            Atualizar
          </button>
        </header>

        {erro && (
          <div className={styles.errorMessage} role="alert">
            <CircleAlert size={18} />
            <span>{erro}</span>

            <button
              type="button"
              onClick={() => setErro('')}
              aria-label="Fechar mensagem de erro"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {sucesso && (
          <div className={styles.successMessage} role="status">
            <Check size={18} />
            <span>{sucesso}</span>

            <button
              type="button"
              onClick={() => setSucesso('')}
              aria-label="Fechar mensagem de sucesso"
            >
              <X size={16} />
            </button>
          </div>
        )}

        <section className={styles.matchCard}>
          <div className={styles.matchTopLine}>
            <span className={styles.matchTag}>
              <Trophy size={14} />
              DETALHES DA PARTIDA
            </span>

            <span className={`${styles.statusBadge} ${statusClasse}`}>
              <span />
              {statusAnalise}
            </span>
          </div>

          <div className={styles.scoreArea}>
            <div className={styles.teamBlock}>
              <div className={styles.teamIcon}>
                <Trophy size={23} />
              </div>

              <h2>{equipeNome}</h2>
              <span>Equipe da casa</span>
            </div>

            <div className={styles.scoreBlock}>
              {editandoResultado ? (
                <>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'minmax(0, 1fr) auto minmax(0, 1fr)',
                      alignItems: 'center',
                      gap: 5,
                      width: '100%',
                    }}
                  >
                    <input
                      className={styles.textInput}
                      style={{
                        marginBottom: 0,
                        textAlign: 'center',
                      }}
                      type="number"
                      min="0"
                      step="1"
                      value={golsNossaEditado}
                      onChange={(evento) =>
                        setGolsNossaEditado(evento.target.value)
                      }
                      aria-label={`Gols de ${equipeNome}`}
                      required
                    />

                    <span>×</span>

                    <input
                      className={styles.textInput}
                      style={{
                        marginBottom: 0,
                        textAlign: 'center',
                      }}
                      type="number"
                      min="0"
                      step="1"
                      value={golsAdversarioEditado}
                      onChange={(evento) =>
                        setGolsAdversarioEditado(evento.target.value)
                      }
                      aria-label={`Gols de ${adversario}`}
                      required
                    />
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      justifyContent: 'center',
                      gap: 6,
                      marginTop: 9,
                    }}
                  >
                    <button
                      type="button"
                      className={styles.primaryButton}
                      onClick={() => void salvarResultado()}
                      disabled={salvandoResultado}
                    >
                      {salvandoResultado ? (
                        <LoaderCircle
                          size={15}
                          className={styles.spinner}
                        />
                      ) : (
                        <Save size={15} />
                      )}

                      {salvandoResultado ? 'Salvando...' : 'Salvar'}
                    </button>

                    <button
                      type="button"
                      className={styles.secondaryButton}
                      onClick={() => {
                        setEditandoResultado(false);
                        limparMensagens();
                      }}
                      disabled={salvandoResultado}
                    >
                      Cancelar
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <span className={styles.score}>
                    {placarNosso ?? '-'} × {placarAdversario ?? '-'}
                  </span>

                  <span className={styles.scoreLabel}>
                    PLACAR FINAL
                  </span>

                  <button
                    type="button"
                    className={styles.secondaryButton}
                    style={{ marginTop: 10 }}
                    onClick={abrirEdicaoResultado}
                  >
                    <Pencil size={14} />
                    {placarNosso == null || placarAdversario == null
                      ? 'Adicionar resultado'
                      : 'Editar resultado'}
                  </button>
                </>
              )}
            </div>

            <div className={styles.teamBlock}>
              <div className={styles.teamIcon}>
                <ShieldAlert size={23} />
              </div>

              <h2>{adversario}</h2>
              <span>Adversário</span>
            </div>
          </div>

          <div className={styles.matchMeta}>
            <span>
              <CalendarDays size={15} />
              {formatarData(partida.data)}
            </span>

            {partida.horario && (
              <span>
                <Clock3 size={15} />
                {partida.horario}
              </span>
            )}

            {partida.local && <span>{partida.local}</span>}

            {partida.campeonato && <span>{partida.campeonato}</span>}
          </div>
        </section>

        <section className={styles.statusCard}>
          <div className={styles.sectionHeading}>
            <div className={styles.sectionIcon}>
              <Check size={18} />
            </div>

            <div>
              <h2>Status da análise</h2>
              <p>
                Atualize a situação atual da análise desta partida.
              </p>
            </div>
          </div>

          <div className={styles.statusEditor}>
            <label htmlFor="statusPartida">Status</label>

            <select
              id="statusPartida"
              value={statusAnalise}
              onChange={(evento) =>
                setStatusAnalise(
                  evento.target.value as StatusAnalise,
                )
              }
              disabled={salvandoStatus}
            >
              <option value="Pendente">Pendente</option>
              <option value="Em análise">Em análise</option>
              <option value="Analisada">Analisada</option>
            </select>

            <button
              type="button"
              className={styles.primaryButton}
              onClick={() => void atualizarStatus(statusAnalise)}
              disabled={salvandoStatus}
            >
              {salvandoStatus ? (
                <LoaderCircle
                  size={16}
                  className={styles.spinner}
                />
              ) : (
                <Save size={16} />
              )}

              {salvandoStatus ? 'Salvando...' : 'Salvar status'}
            </button>
          </div>
        </section>

        <section className={styles.contentGrid}>
          <article className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.sectionHeading}>
                <div className={styles.sectionIcon}>
                  <Users size={18} />
                </div>

                <div>
                  <h2>Atletas participantes</h2>
                  <p>
                    {atletasParticipantes.length} atleta(s) vinculado(s)
                    à partida.
                  </p>
                </div>
              </div>

              <button
                type="button"
                className={styles.primaryButton}
                onClick={() => {
                  limparMensagens();
                  setModalAtletas(true);
                }}
              >
                <Pencil size={15} />
                Gerenciar
              </button>
            </div>

            {carregandoAtletas ? (
              <div className={styles.loadingState}>
                <LoaderCircle
                  size={19}
                  className={styles.spinner}
                />
                Carregando atletas...
              </div>
            ) : atletasParticipantes.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>
                  <Users size={22} />
                </div>

                <h3>Nenhum atleta selecionado</h3>

                <p>
                  Adicione os atletas da equipe que participaram desta
                  partida.
                </p>

                <button
                  type="button"
                  className={styles.primaryButton}
                  onClick={() => setModalAtletas(true)}
                >
                  <Plus size={15} />
                  Adicionar atletas
                </button>
              </div>
            ) : (
              <div className={styles.athletesList}>
                {atletasParticipantes.map((atleta) => (
                  <div className={styles.athleteItem} key={atleta.id}>
                    <div className={styles.athleteAvatar}>
                      {iniciais(nomeDoAtleta(atleta))}
                    </div>

                    <div className={styles.athleteInfo}>
                      <strong>{nomeDoAtleta(atleta)}</strong>
                      <span>{atleta.categoria || 'Atleta'}</span>
                    </div>

                    <span className={styles.athleteCheck}>
                      <Check size={13} />
                    </span>
                  </div>
                ))}
              </div>
            )}
          </article>

          <article className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.sectionHeading}>
                <div className={styles.sectionIcon}>
                  <Film size={18} />
                </div>

                <div>
                  <h2>Vídeos da partida</h2>
                  <p>Gerencie os vídeos usados na análise.</p>
                </div>
              </div>

              <button
                type="button"
                className={styles.primaryButton}
                onClick={abrirUpload}
              >
                <Upload size={15} />
                Enviar vídeo
              </button>
            </div>

            {carregandoVideos ? (
              <div className={styles.loadingState}>
                <LoaderCircle
                  size={19}
                  className={styles.spinner}
                />
                Carregando vídeos...
              </div>
            ) : videos.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>
                  <Video size={22} />
                </div>

                <h3>Nenhum vídeo cadastrado</h3>

                <p>
                  Envie um vídeo para começar a registrar as análises
                  desta partida.
                </p>

                <button
                  type="button"
                  className={styles.primaryButton}
                  onClick={abrirUpload}
                >
                  <Plus size={15} />
                  Adicionar vídeo
                </button>
              </div>
            ) : (
              <div className={styles.videosList}>
                {videos.map((video) => {
                  const url = normalizarUrlVideo(
                    video.url ||
                      video.caminhoArquivo ||
                      video.nomeArquivo ||
                      video.arquivo,
                  );

                  return (
                    <div
                      className={styles.videoItem}
                      key={video.id}
                    >
                      <button
                        type="button"
                        className={styles.videoPreview}
                        onClick={() => void selecionarVideo(video)}
                        aria-label={`Reproduzir ${nomeDoVideo(video)}`}
                      >
                        {url ? (
                          <video
                            src={url}
                            preload="metadata"
                            muted
                          />
                        ) : (
                          <span className={styles.videoPlaceholder}>
                            <Video size={23} />
                          </span>
                        )}

                        <span className={styles.playOverlay}>
                          <Play size={20} fill="currentColor" />
                        </span>
                      </button>

                      <div className={styles.videoInfo}>
                        <h3>{nomeDoVideo(video)}</h3>

                        <span className={styles.videoMeta}>
                          <Clock3 size={12} />
                          {video.duracao != null
                            ? segundosParaTempo(video.duracao)
                            : 'Vídeo da partida'}
                        </span>
                      </div>

                      <button
                        type="button"
                        className={styles.iconButtonDanger}
                        onClick={() => void excluirVideo(video.id)}
                        title="Excluir vídeo"
                        aria-label={`Excluir ${nomeDoVideo(video)}`}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </article>
        </section>

        {/* EVENTOS DE TODOS OS VÍDEOS DA PARTIDA */}
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.sectionHeading}>
              <div className={styles.sectionIcon}>
                <Scissors size={18} />
              </div>

              <div>
                <h2>Eventos da partida</h2>
                <p>
                  Consulte as marcações registradas em todos os vídeos.
                </p>
              </div>
            </div>

            <span className={styles.countBadge}>
              {eventosPartida.length}
            </span>
          </div>

          {carregandoEventos ? (
            <div className={styles.loadingState}>
              <LoaderCircle
                size={19}
                className={styles.spinner}
              />
              Carregando eventos...
            </div>
          ) : eventosPartida.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <Scissors size={22} />
              </div>

              <h3>Nenhum evento registrado</h3>

              <p>
                As marcações criadas nos vídeos desta partida aparecerão
                aqui.
              </p>
            </div>
          ) : (
            <div className={styles.eventsList}>
              {eventosPartida.map((evento, indice) => (
                <div
                  className={styles.eventRow}
                  key={`${evento.videoId}-${evento.id}-${indice}`}
                >
                  <span
                    className={`${styles.eventDot} ${classeEvento(evento.categoria)}`}
                  />

                  <span className={styles.eventTime}>
                    {segundosParaTempo(evento.tempoInicio)}
                  </span>

                  <div className={styles.eventDetails}>
                    <div className={styles.eventTitleRow}>
                      <h3>
                        {evento.titulo ||
                          evento.categoria ||
                          'Evento'}
                      </h3>

                      {evento.categoria && (
                        <span
                          className={`${styles.eventType} ${classeEvento(evento.categoria)}`}
                        >
                          {evento.categoria}
                        </span>
                      )}
                    </div>

                    {(evento.observacao || evento.descricao) && (
                      <p>
                        {evento.observacao || evento.descricao}
                      </p>
                    )}

                    {evento.videoTitulo && (
                      <span className={styles.eventVideo}>
                        <Video size={12} />
                        {evento.videoTitulo}
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    className={styles.eventPlayButton}
                    onClick={() =>
                      void abrirEventoDaPartida(evento)
                    }
                    aria-label="Abrir evento no vídeo"
                    title="Abrir evento no vídeo"
                  >
                    <Play size={15} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* VÍDEO SELECIONADO E SUAS MARCAÇÕES */}
        {videoSelecionado && (
          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.sectionHeading}>
                <div className={styles.sectionIcon}>
                  <Video size={18} />
                </div>

                <div>
                  <h2>{nomeDoVideo(videoSelecionado)}</h2>
                  <p>
                    Reproduza o vídeo e consulte suas marcações.
                  </p>
                </div>
              </div>

              <button
                type="button"
                className={styles.modalClose}
                onClick={() => {
                  setVideoSelecionado(null);
                  setMarcacoes([]);
                }}
                aria-label="Fechar vídeo"
              >
                <X size={17} />
              </button>
            </div>

            {normalizarUrlVideo(
              videoSelecionado.url ||
                videoSelecionado.caminhoArquivo ||
                videoSelecionado.nomeArquivo ||
                videoSelecionado.arquivo,
            ) ? (
              <video
                ref={playerRef}
                className={styles.videoPlayer}
                controls
                preload="metadata"
                src={normalizarUrlVideo(
                  videoSelecionado.url ||
                    videoSelecionado.caminhoArquivo ||
                    videoSelecionado.nomeArquivo ||
                    videoSelecionado.arquivo,
                )}
              >
                Seu navegador não suporta a reprodução de vídeo.
              </video>
            ) : (
              <div className={styles.videoUnavailable}>
                <CircleAlert size={27} />
                <p>
                  Este vídeo não possui um endereço de reprodução
                  retornado pelo servidor.
                </p>
              </div>
            )}

            <div style={{ marginTop: 18 }}>
              <div className={styles.sectionHeading}>
                <div className={styles.sectionIcon}>
                  <Scissors size={17} />
                </div>

                <div>
                  <h2>Marcações do vídeo</h2>
                  <p>
                    Clique em uma marcação para ir até o momento.
                  </p>
                </div>

                <span className={styles.countBadge}>
                  {marcacoes.length}
                </span>
              </div>

              {marcacoes.length === 0 ? (
                <div className={styles.emptyState}>
                  <p>
                    Nenhuma marcação encontrada para este vídeo.
                  </p>
                </div>
              ) : (
                <div className={styles.eventsList}>
                  {marcacoes.map((marcacao) => (
                    <div
                      className={styles.eventRow}
                      key={marcacao.id}
                    >
                      <span
                        className={`${styles.eventDot} ${classeEvento(marcacao.categoria)}`}
                      />

                      <span className={styles.eventTime}>
                        {segundosParaTempo(marcacao.tempoInicio)}
                      </span>

                      <div className={styles.eventDetails}>
                        <div className={styles.eventTitleRow}>
                          <h3>
                            {marcacao.titulo ||
                              marcacao.categoria ||
                              'Evento'}
                          </h3>

                          {marcacao.categoria && (
                            <span
                              className={`${styles.eventType} ${classeEvento(marcacao.categoria)}`}
                            >
                              {marcacao.categoria}
                            </span>
                          )}
                        </div>

                        {(marcacao.observacao ||
                          marcacao.descricao) && (
                          <p>
                            {marcacao.observacao ||
                              marcacao.descricao}
                          </p>
                        )}
                      </div>

                      <button
                        type="button"
                        className={styles.eventPlayButton}
                        onClick={() =>
                          reproduzirMarcacao(marcacao)
                        }
                        aria-label="Reproduzir a partir desta marcação"
                      >
                        <Play size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        <section className={styles.dangerZone}>
          <div className={styles.dangerIcon}>
            <ShieldAlert size={19} />
          </div>

          <div className={styles.dangerText}>
            <h2>Zona de perigo</h2>
            <p>
              Excluir a partida remove seu registro do sistema. Essa ação
              pode ser irreversível.
            </p>
          </div>

          <button
            type="button"
            className={styles.dangerButton}
            onClick={() => setModalExcluir(true)}
          >
            <Trash2 size={15} />
            Excluir partida
          </button>
        </section>
      </div>

      {/* MODAL DE ATLETAS */}
      {modalAtletas && (
        <div
          className={styles.modalOverlay}
          onMouseDown={(evento) =>
            fecharModalAoClicarFora(evento, () =>
              setModalAtletas(false),
            )
          }
        >
          <section
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="tituloModalAtletas"
          >
            <header className={styles.modalHeader}>
              <div>
                <span className={styles.eyebrow}>PARTICIPANTES</span>
                <h2 id="tituloModalAtletas">Gerenciar atletas</h2>
              </div>

              <button
                type="button"
                className={styles.modalClose}
                onClick={() => setModalAtletas(false)}
                aria-label="Fechar"
              >
                <X size={17} />
              </button>
            </header>

            <p className={styles.modalDescription}>
              São exibidos somente atletas da equipe desta partida.
            </p>

            <label
              className={styles.fieldLabel}
              htmlFor="buscaAtleta"
            >
              Buscar atleta
            </label>

            <input
              id="buscaAtleta"
              type="search"
              className={styles.textInput}
              value={buscaAtleta}
              onChange={(evento) =>
                setBuscaAtleta(evento.target.value)
              }
              placeholder="Digite o nome do atleta..."
            />

            <div className={styles.selectionSummary}>
              <Users size={14} />
              {atletasSelecionados.length} atleta(s) selecionado(s)
            </div>

            <div className={styles.athletePickerList}>
              {carregandoAtletas ? (
                <div className={styles.loadingState}>
                  <LoaderCircle
                    size={18}
                    className={styles.spinner}
                  />
                  Carregando atletas...
                </div>
              ) : atletasFiltrados.length === 0 ? (
                <div className={styles.pickerEmpty}>
                  <Users size={24} />
                  <p>Nenhum atleta encontrado</p>
                  <span>
                    Verifique se existem atletas cadastrados nesta
                    equipe.
                  </span>
                </div>
              ) : (
                atletasFiltrados.map((atleta) => {
                  const selecionado = atletasSelecionados.includes(
                    Number(atleta.id),
                  );

                  return (
                    <label
                      key={atleta.id}
                      className={`${styles.athletePickerItem} ${
                        selecionado
                          ? styles.athletePickerSelected
                          : ''
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selecionado}
                        onChange={() =>
                          alternarAtleta(Number(atleta.id))
                        }
                      />

                      <span className={styles.athleteAvatar}>
                        {iniciais(nomeDoAtleta(atleta))}
                      </span>

                      <span className={styles.pickerAthleteText}>
                        <strong>{nomeDoAtleta(atleta)}</strong>
                        <small>{atleta.categoria || 'Atleta'}</small>
                      </span>

                      {selecionado && (
                        <Check
                          size={16}
                          className={styles.pickerCheck}
                        />
                      )}
                    </label>
                  );
                })
              )}
            </div>

            <footer className={styles.modalActions}>
              <button
                type="button"
                className={styles.secondaryButton}
                onClick={() => setModalAtletas(false)}
                disabled={salvando}
              >
                Cancelar
              </button>

              <button
                type="button"
                className={styles.primaryButton}
                onClick={() => void salvarAtletas()}
                disabled={salvando || carregandoAtletas}
              >
                {salvando ? (
                  <LoaderCircle
                    size={15}
                    className={styles.spinner}
                  />
                ) : (
                  <Save size={15} />
                )}

                {salvando ? 'Salvando...' : 'Salvar atletas'}
              </button>
            </footer>
          </section>
        </div>
      )}

      {/* MODAL DE UPLOAD */}
      {modalUpload && (
        <div
          className={styles.modalOverlay}
          onMouseDown={(evento) => {
            if (
              evento.target === evento.currentTarget &&
              !enviandoVideo
            ) {
              setModalUpload(false);
            }
          }}
        >
          <section
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="tituloModalVideo"
          >
            <header className={styles.modalHeader}>
              <div>
                <span className={styles.eyebrow}>
                  ANÁLISE ESPORTIVA
                </span>
                <h2 id="tituloModalVideo">Enviar vídeo</h2>
              </div>

              <button
                type="button"
                className={styles.modalClose}
                onClick={() => setModalUpload(false)}
                aria-label="Fechar"
                disabled={enviandoVideo}
              >
                <X size={17} />
              </button>
            </header>

            <p className={styles.modalDescription}>
              Adicione um vídeo para analisar esta partida.
            </p>

            <form onSubmit={enviarVideo}>
              <label
                className={styles.fieldLabel}
                htmlFor="tituloVideo"
              >
                Título do vídeo
              </label>

              <input
                id="tituloVideo"
                type="text"
                className={styles.textInput}
                value={tituloVideo}
                onChange={(evento) =>
                  setTituloVideo(evento.target.value)
                }
                placeholder="Ex.: Jogo completo"
                required
                maxLength={150}
              />

              <label
                htmlFor="arquivoVideo"
                className={styles.fileDrop}
              >
                <Upload size={25} />

                <strong>
                  {arquivoVideo
                    ? arquivoVideo.name
                    : 'Clique para selecionar um vídeo'}
                </strong>

                <span>
                  {arquivoVideo
                    ? `${(
                        arquivoVideo.size /
                        (1024 * 1024)
                      ).toFixed(1)} MB`
                    : 'Selecione um arquivo de vídeo do seu computador'}
                </span>
              </label>

              <input
                ref={inputVideoRef}
                id="arquivoVideo"
                type="file"
                accept="video/*"
                className={styles.hiddenInput}
                onChange={alterarArquivo}
                required
              />

              {arquivoVideo && (
                <div className={styles.fileSelected}>
                  <Video size={16} />
                  <span>{arquivoVideo.name}</span>

                  <button
                    type="button"
                    onClick={() => {
                      setArquivoVideo(null);

                      if (inputVideoRef.current) {
                        inputVideoRef.current.value = '';
                      }
                    }}
                    aria-label="Remover arquivo selecionado"
                  >
                    <X size={15} />
                  </button>
                </div>
              )}

              <footer className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.secondaryButton}
                  onClick={() => setModalUpload(false)}
                  disabled={enviandoVideo}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className={styles.primaryButton}
                  disabled={enviandoVideo}
                >
                  {enviandoVideo ? (
                    <LoaderCircle
                      size={15}
                      className={styles.spinner}
                    />
                  ) : (
                    <Upload size={15} />
                  )}

                  {enviandoVideo
                    ? 'Enviando...'
                    : 'Enviar vídeo'}
                </button>
              </footer>
            </form>
          </section>
        </div>
      )}

      {/* MODAL DE EXCLUSÃO */}
      {modalExcluir && (
        <div
          className={styles.modalOverlay}
          onMouseDown={(evento) =>
            fecharModalAoClicarFora(evento, () => {
              if (!excluindoPartida) {
                setModalExcluir(false);
              }
            })
          }
        >
          <section
            className={styles.confirmModal}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="tituloExcluirPartida"
          >
            <div className={styles.confirmIcon}>
              <ShieldAlert size={22} />
            </div>

            <h2 id="tituloExcluirPartida">Excluir partida?</h2>

            <p>
              Deseja realmente excluir a partida contra{' '}
              <strong>{adversario}</strong>? Esta ação não poderá ser
              desfeita.
            </p>

            <footer className={styles.modalActions}>
              <button
                type="button"
                className={styles.secondaryButton}
                onClick={() => setModalExcluir(false)}
                disabled={excluindoPartida}
              >
                Cancelar
              </button>

              <button
                type="button"
                className={styles.dangerButton}
                onClick={() => void excluirPartida()}
                disabled={excluindoPartida}
              >
                {excluindoPartida ? (
                  <LoaderCircle
                    size={15}
                    className={styles.spinner}
                  />
                ) : (
                  <Trash2 size={15} />
                )}

                {excluindoPartida
                  ? 'Excluindo...'
                  : 'Confirmar exclusão'}
              </button>
            </footer>
          </section>
        </div>
      )}
    </main>
  );
}
