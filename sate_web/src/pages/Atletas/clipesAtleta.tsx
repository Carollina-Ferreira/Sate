
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    ArrowLeft,
    Play,
    Download,
    Share2,
    X,
    Video,
} from 'lucide-react';
import styles from './clipesAtleta.module.css';
import LoadingState from '../../components/ui/LoadingState/LoadingState';
interface ClipesAtletaProps {
    onBack: () => void;
    atletaId: number | string;
    atletaNome?: string;
}
interface ApiObjeto {
    [key: string]: any;
}
interface CategoriaAnalise {
    id: number;
    nome: string;
    descricao?: string | null;
    cor?: string | null;
    icone?: string | null;
    ordem?: number;
    mostrarNaTimeline?: boolean;
}
interface Clipe {
    id: number;
    videoId: number;
    tempo: string;
    tempoSegundos: number;
    titulo: string;
    partida: string;
    categoria: string;
    categoriaId: number | null;
    categoriaKey: string;
    corCategoria?: string;
    thumbnail?: string;
    videoUrl: string;
    observacao?: string;
}
interface CategoriaFiltro {
    id: string;
    nome: string;
    cor?: string;
    quantidade: number;
    ordem: number;
}
const API_URL = (
    import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
).replace(/\/+$/, '');
const API_ORIGIN = API_URL.replace(/\/api$/i, '');
// ============================================================
// AUTENTICAÇÃO
// ============================================================
function obterToken(): string {
    return (
        localStorage.getItem('token') ||
        localStorage.getItem('accessToken') ||
        sessionStorage.getItem('token') ||
        sessionStorage.getItem('accessToken') ||
        ''
    );
}
// ============================================================
// REQUISIÇÕES
// ============================================================
async function requisicaoAPI(caminho: string): Promise<any> {
    const token = obterToken();
    const resposta = await fetch(`${API_URL}${caminho}`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            ...(token
                ? { Authorization: `Bearer ${token}` }
                : {}),
        },
    });
    const texto = await resposta.text();
    let dados: any = {};
    try {
        dados = texto ? JSON.parse(texto) : {};
    } catch {
        dados = {};
    }
    if (!resposta.ok) {
        throw new Error(
            dados.message ||
            dados.mensagem ||
            dados.erro ||
            dados.error ||
            `Erro ${resposta.status} ao consultar ${caminho}`
        );
    }
    return dados;
}
// ============================================================
// EXTRAIR LISTAS DA API
// ============================================================
function extrairLista(
    resposta: any,
    propriedades: string[]
): any[] {
    if (Array.isArray(resposta)) {
        return resposta;
    }
    const objetos = [
        resposta,
        resposta?.data,
        resposta?.dados,
        resposta?.resultado,
        resposta?.result,
    ];
    for (const objeto of objetos) {
        if (!objeto || typeof objeto !== 'object') {
            continue;
        }
        for (const propriedade of propriedades) {
            if (Array.isArray(objeto[propriedade])) {
                return objeto[propriedade];
            }
        }
    }
    return [];
}
// ============================================================
// URL DO VÍDEO
// ============================================================
function resolverUrlVideo(url?: string | null): string {
    if (!url) {
        return '';
    }
    if (
        url.startsWith('http://') ||
        url.startsWith('https://') ||
        url.startsWith('blob:') ||
        url.startsWith('data:')
    ) {
        return url;
    }
    return `${API_ORIGIN}/${url.replace(/^\/+/, '')}`;
}
// ============================================================
// FORMATAÇÃO DO TEMPO
// ============================================================
function formatarTempo(segundos: number): string {
    const valor = Math.max(0, Math.floor(segundos || 0));
    const minutos = Math.floor(valor / 60);
    const segundosRestantes = valor % 60;
    return `${String(minutos).padStart(2, '0')}:${String(
        segundosRestantes
    ).padStart(2, '0')}`;
}
// ============================================================
// NORMALIZAR NOME DE CATEGORIA
// ============================================================
function normalizarCategoria(nome: string): string {
    return nome
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim()
        .toLowerCase();
}
// ============================================================
// CAPTURAR UMA IMAGEM REAL DO VÍDEO
// ============================================================
function capturarFrameVideo(clipe: Clipe): Promise<string | null> {
    return new Promise((resolve) => {
        if (!clipe.videoUrl) {
            resolve(null);
            return;
        }
        const video = document.createElement('video');
        video.crossOrigin = 'anonymous';
        video.preload = 'auto';
        video.muted = true;
        video.playsInline = true;
        let finalizado = false;
        const timeout = window.setTimeout(() => {
            finalizar(null);
        }, 15000);
        const finalizar = (resultado: string | null) => {
            if (finalizado) return;
            finalizado = true;
            window.clearTimeout(timeout);
            video.pause();
            video.removeAttribute('src');
            video.load();
            resolve(resultado);
        };
        const gerarImagem = () => {
            if (finalizado) return;
            try {
                if (
                    !video.videoWidth ||
                    !video.videoHeight
                ) {
                    finalizar(null);
                    return;
                }
                const canvas = document.createElement('canvas');
                // Limita a largura para evitar imagens muito pesadas.
                const largura = Math.min(video.videoWidth, 640);
                const proporcao =
                    video.videoHeight / video.videoWidth;
                canvas.width = largura;
                canvas.height = Math.round(largura * proporcao);
                const contexto = canvas.getContext('2d');
                if (!contexto) {
                    finalizar(null);
                    return;
                }
                // Captura um frame real do vídeo.
                contexto.drawImage(
                    video,
                    0,
                    0,
                    canvas.width,
                    canvas.height
                );
                // Converte o frame em uma imagem.
                const imagem = canvas.toDataURL(
                    'image/jpeg',
                    0.78
                );
                finalizar(imagem);
            } catch (error) {
                // Pode ocorrer se o servidor não permitir canvas via CORS.
                console.warn(
                    `Não foi possível capturar o frame do clipe ${clipe.id}:`,
                    error
                );
                finalizar(null);
            }
        };
        video.addEventListener(
            'loadeddata',
            () => {
                if (finalizado) return;
                const duracao = Number.isFinite(video.duration)
                    ? video.duration
                    : clipe.tempoSegundos;
                // Captura a imagem no momento exato da marcação.
                const tempo = Math.min(
                    Math.max(0, clipe.tempoSegundos),
                    Math.max(0, duracao - 0.1)
                );
                if (tempo <= 0.05) {
                    gerarImagem();
                } else {
                    video.addEventListener(
                        'seeked',
                        gerarImagem,
                        { once: true }
                    );
                    video.currentTime = tempo;
                }
            },
            { once: true }
        );
        video.addEventListener(
            'error',
            () => finalizar(null),
            { once: true }
        );
        video.src = clipe.videoUrl;
        video.load();
    });
}
// ============================================================
// BUSCAR CLIPES DO ATLETA
// ============================================================
async function carregarClipesAtleta(
    atletaId: number | string
): Promise<Clipe[]> {
    // Busca as partidas e as categorias configuradas pelo treinador.
    const [respostaPartidas, respostaCategorias] =
        await Promise.all([
            requisicaoAPI('/partidas'),
            requisicaoAPI('/configuracao-analise').catch((error) => {
                console.warn(
                    'Não foi possível carregar as categorias de análise:',
                    error
                );
                return [];
            }),
        ]);
    const partidas = extrairLista(
        respostaPartidas,
        ['partidas', 'dados']
    );
    const categoriasConfiguradas = extrairLista(
        respostaCategorias,
        [
            'configuracoes',
            'configuracoesAnalise',
            'categorias',
            'dados',
        ]
    ) as CategoriaAnalise[];
    // Organiza as categorias por ID.
    const categoriasPorId = new Map<number, CategoriaAnalise>();
    categoriasConfiguradas.forEach((categoria) => {
        if (categoria.id) {
            categoriasPorId.set(
                Number(categoria.id),
                categoria
            );
        }
    });
    if (!partidas.length) {
        return [];
    }
    // Percorre as partidas.
    const resultados = await Promise.all(
        partidas.map(async (partida: ApiObjeto) => {
            if (!partida.id) {
                return [];
            }
            let videos: ApiObjeto[] = [];
            // Busca os vídeos da partida.
            if (Array.isArray(partida.videos)) {
                videos = partida.videos;
            } else {
                try {
                    const respostaVideos = await requisicaoAPI(
                        `/partidas/${partida.id}/videos`
                    );
                    videos = extrairLista(
                        respostaVideos,
                        ['videos', 'dados']
                    );
                } catch (error) {
                    console.warn(
                        `Erro ao buscar vídeos da partida ${partida.id}:`,
                        error
                    );
                    return [];
                }
            }
            const nomeEquipe =
                partida.equipe?.nome ||
                partida.equipeNome ||
                partida.nomeEquipe ||
                'Equipe';
            const nomePartida = partida.adversario
                ? `${nomeEquipe} x ${partida.adversario}`
                : partida.nome || nomeEquipe;
            // Percorre os vídeos.
            const resultadosVideos = await Promise.all(
                videos.map(async (video: ApiObjeto) => {
                    if (!video.id) {
                        return [];
                    }
                    let marcacoes: ApiObjeto[] = [];
                    // Busca as marcações do vídeo.
                    if (Array.isArray(video.marcacoes)) {
                        marcacoes = video.marcacoes;
                    } else {
                        try {
                            const respostaMarcacoes =
                                await requisicaoAPI(
                                    `/videos/${video.id}/marcacoes`
                                );
                            marcacoes = extrairLista(
                                respostaMarcacoes,
                                ['marcacoes', 'dados']
                            );
                        } catch (error) {
                            console.warn(
                                `Erro ao buscar marcações do vídeo ${video.id}:`,
                                error
                            );
                            return [];
                        }
                    }
                    const videoUrl = resolverUrlVideo(
                        video.url ||
                        video.videoUrl ||
                        video.caminho
                    );
                    // Mantém somente marcações vinculadas ao atleta.
                    return marcacoes
                        .filter((marcacao: ApiObjeto) => {
                            const idAtleta =
                                marcacao.atletaId ??
                                marcacao.atleta?.id;
                            return (
                                Number(idAtleta) ===
                                Number(atletaId)
                            );
                        })
                        .map((marcacao: ApiObjeto): Clipe => {
                            const tempoSegundos = Math.max(
                                0,
                                Number(marcacao.tempoInicio || 0)
                            );
                            // Recupera a categoria de análise.
                            const idCategoria = Number(
                                marcacao.categoriaId ??
                                marcacao.configuracao?.id ??
                                marcacao.categoria?.id
                            );
                            const categoriaConfigurada =
                                Number.isFinite(idCategoria)
                                    ? categoriasPorId.get(idCategoria)
                                    : undefined;
                            const nomeCategoria =
                                marcacao.configuracao?.nome ||
                                categoriaConfigurada?.nome ||
                                marcacao.categoria?.nome ||
                                (
                                    typeof marcacao.categoria === 'string'
                                        ? marcacao.categoria
                                        : ''
                                ) ||
                                'Sem categoria';
                            const categoriaKey =
                                categoriaConfigurada?.id ||
                                marcacao.configuracao?.id ||
                                marcacao.categoriaId ||
                                (
                                    `nome:${normalizarCategoria(
                                        nomeCategoria
                                    )}`
                                );
                            const categoriaIdFinal =
                                Number.isFinite(idCategoria)
                                    ? idCategoria
                                    : null;
                            const titulo =
                                marcacao.titulo ||
                                nomeCategoria ||
                                'Lance analisado';
                            return {
                                id: Number(marcacao.id),
                                videoId: Number(video.id),
                                tempo: formatarTempo(
                                    tempoSegundos
                                ),
                                tempoSegundos,
                                titulo,
                                partida: nomePartida,
                                categoria: nomeCategoria,
                                categoriaId: categoriaIdFinal,
                                categoriaKey: String(categoriaKey),
                                corCategoria:
                                    marcacao.configuracao?.cor ||
                                    categoriaConfigurada?.cor ||
                                    undefined,
                                videoUrl,
                                observacao:
                                    marcacao.observacao || '',
                            };
                        });
                })
            );
            return resultadosVideos.flat();
        })
    );
    return resultados
        .flat()
        .sort(
            (a, b) =>
                b.tempoSegundos - a.tempoSegundos
        );
}
// ============================================================
// COMPONENTE
// ============================================================
const ClipesAtleta = ({
    onBack,
    atletaId,
    atletaNome = 'Atleta',
}: ClipesAtletaProps) => {
    const [clipes, setClipes] = useState<Clipe[]>([]);
    const [miniaturas, setMiniaturas] =
        useState<Record<number, string>>({});
    const [miniaturasIndisponiveis, setMiniaturasIndisponiveis] =
        useState<Record<number, boolean>>({});
    const [filtroAtivo, setFiltroAtivo] =
        useState('todos');
    const [videoAberto, setVideoAberto] =
        useState<Clipe | null>(null);
    const [copiado, setCopiado] =
        useState<number | null>(null);
    const [carregando, setCarregando] =
        useState(true);
    const [erro, setErro] = useState('');
    const videoRef = useRef<HTMLVideoElement>(null);
    // ========================================================
    // CARREGAR DADOS
    // ========================================================
    const buscarClipes = useCallback(async () => {
        try {
            setCarregando(true);
            setErro('');
            setClipes([]);
            setMiniaturas({});
            setMiniaturasIndisponiveis({});
            if (!atletaId) {
                throw new Error(
                    'Não foi informado o ID do atleta.'
                );
            }
            const dados = await carregarClipesAtleta(atletaId);
            setClipes(dados);
        } catch (error: any) {
            console.error(
                'Erro ao carregar clipes do atleta:',
                error
            );
            setErro(
                error.message ||
                'Não foi possível carregar os clipes.'
            );
        } finally {
            setCarregando(false);
        }
    }, [atletaId]);
    useEffect(() => {
        void buscarClipes();
    }, [buscarClipes]);
    // ========================================================
    // GERAR MINIATURAS DOS VÍDEOS
    // ========================================================
    useEffect(() => {
        let cancelado = false;
        const clipesComVideo = clipes.filter(
            (clipe) =>
                clipe.videoUrl &&
                clipe.id
        );
        let indiceAtual = 0;
        // Limita a três capturas simultâneas para
        // evitar carregar muitos vídeos ao mesmo tempo.
        const processarMiniaturas = async () => {
            const trabalhador = async () => {
                while (
                    indiceAtual < clipesComVideo.length &&
                    !cancelado
                ) {
                    const indice = indiceAtual++;
                    const clipe = clipesComVideo[indice];
                    const imagem = await capturarFrameVideo(clipe);
                    if (cancelado) continue;
                    if (imagem) {
                        setMiniaturas((atuais) => ({
                            ...atuais,
                            [clipe.id]: imagem,
                        }));
                    } else {
                        // Quando o vídeo não libera a captura de frame,
                        // mostra a mensagem final em vez de um loading infinito.
                        setMiniaturasIndisponiveis((atuais) => ({
                            ...atuais,
                            [clipe.id]: true,
                        }));
                    }
                }
            };
            await Promise.all([
                trabalhador(),
                trabalhador(),
                trabalhador(),
            ]);
        };
        void processarMiniaturas();
        return () => {
            cancelado = true;
        };
    }, [clipes]);
    // ========================================================
    // CATEGORIAS DINÂMICAS
    // ========================================================
    const categorias = useMemo(() => {
        const mapa = new Map<string, CategoriaFiltro>();
        clipes.forEach((clipe) => {
            const chave = clipe.categoriaKey;
            const existente = mapa.get(chave);
            if (existente) {
                existente.quantidade++;
            } else {
                mapa.set(chave, {
                    id: chave,
                    nome: clipe.categoria,
                    cor: clipe.corCategoria,
                    quantidade: 1,
                    ordem: clipe.categoriaId || 999,
                });
            }
        });
        return Array.from(mapa.values())
            .sort((a, b) => {
                // Primeiro aparecem as categorias com mais lances.
                if (b.quantidade !== a.quantidade) {
                    return b.quantidade - a.quantidade;
                }
                // Em caso de empate, respeita a ordem configurada.
                if (a.ordem !== b.ordem) {
                    return a.ordem - b.ordem;
                }
                return a.nome.localeCompare(b.nome);
            })
            .slice(0, 8);
    }, [clipes]);
    // FILTRAR CLIPES POR CATEGORIA
    // ========================================================
    const clipesFiltrados = useMemo(() => {
        return clipes.filter(
            (clipe) =>
                filtroAtivo === 'todos' ||
                clipe.categoriaKey === filtroAtivo
        );
    }, [clipes, filtroAtivo]);
    // ========================================================
    // ALTERAR CATEGORIA
    // ========================================================
    const handleFiltro = (id: string) => {
        setFiltroAtivo(id);
    };
    // ========================================================
    // ABRIR VÍDEO
    // ========================================================
    const abrirVideo = (clipe: Clipe) => {
        if (!clipe.videoUrl) {
            setErro(
                'O endereço do vídeo não está disponível.'
            );
            return;
        }
        setVideoAberto(clipe);
    };
    // ========================================================
    // POSICIONAR VÍDEO NO MOMENTO DO LANCE
    // ========================================================
    const handleVideoCarregado = () => {
        const video = videoRef.current;
        if (video && videoAberto) {
            const limite = Number.isFinite(video.duration)
                ? Math.max(0, video.duration - 0.1)
                : videoAberto.tempoSegundos;
            video.currentTime = Math.min(
                videoAberto.tempoSegundos,
                limite
            );
        }
    };
    // ========================================================
    // DOWNLOAD
    // ========================================================
    const handleDownload = (clipe: Clipe) => {
        if (!clipe.videoUrl) {
            return;
        }
        const link = document.createElement('a');
        link.href = clipe.videoUrl;
        link.download = `${clipe.titulo.replace(
            /\s+/g,
            '_'
        )}.mp4`;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    // ========================================================
    // COMPARTILHAR
    // ========================================================
    const handleShare = async (clipe: Clipe) => {
        const url =
            `${window.location.origin}` +
            `${window.location.pathname}?clipe=${clipe.id}`;
        try {
            if (navigator.share) {
                await navigator.share({
                    title: clipe.titulo,
                    text: `${clipe.partida} - ${clipe.tempo}`,
                    url,
                });
            } else {
                await navigator.clipboard.writeText(url);
                setCopiado(clipe.id);
                window.setTimeout(() => {
                    setCopiado(null);
                }, 2000);
            }
        } catch (error) {
            console.error(
                'Erro ao compartilhar clipe:',
                error
            );
        }
    };
    // ========================================================
    // RENDERIZAÇÃO
    // ========================================================
    return (
        <div className={styles.page}>
            {/* VOLTAR */}
            <button
                className={styles.backButton}
                onClick={onBack}
                type="button"
            >
                <ArrowLeft size={16} />
                Voltar para o perfil
            </button>
            {/* CABEÇALHO */}
            <div className={styles.toolbar}>
                <div className={styles.toolbarHeader}>
                    <div className={styles.titleArea}>
                        <div className={styles.titleRow}>
                            <h1>
                                Clipes <em>analisados.</em>
                            </h1>
                        </div>
                        <p className={styles.subtitle}>
                            Confira os lances de {atletaNome}
                            {' '}marcados pelo treinador durante
                            as análises das partidas.
                        </p>
                    </div>
                </div>
                {/* =================================================
                    CATEGORIAS DE ANÁLISE
                ================================================= */}
                <div className={styles.filtersRow}>
                    {/* TODOS OS LANCES */}
                    <button
                        type="button"
                        className={`
                            ${styles.filterButton}
                            ${
                                filtroAtivo === 'todos'
                                    ? styles.filterActive
                                    : ''
                            }
                        `}
                        onClick={() => handleFiltro('todos')}
                    >
                        Todos os lances
                        <small>{clipes.length}</small>
                    </button>
                    {/* CATEGORIAS CONFIGURADAS PELO TREINADOR */}
                    {categorias.map((categoria) => (
                        <button
                            type="button"
                            key={categoria.id}
                            className={`
                                ${styles.filterButton}
                                ${
                                    filtroAtivo === categoria.id
                                        ? styles.filterActive
                                        : ''
                                }
                            `}
                            onClick={() =>
                                handleFiltro(categoria.id)
                            }
                            style={
                                categoria.cor
                                    ? {
                                        borderColor: categoria.cor,
                                        ...(filtroAtivo === categoria.id
                                            ? {
                                                backgroundColor: categoria.cor,
                                            }
                                            : {}),
                                    }
                                    : undefined
                            }
                        >
                            {categoria.nome}
                            <small>
                                {categoria.quantidade}
                            </small>
                        </button>
                    ))}
                </div>
            </div>
            {/* =================================================
                CARREGAMENTO
            ================================================= */}
            {carregando && (
                <LoadingState
                    variant="videos"
                    title={`Carregando os clipes de ${atletaNome}...`}
                    description="Buscando os lances registrados nas partidas."
                    count={6}
                />
            )}
            {/* =================================================
                ERRO
            ================================================= */}
            {!carregando && erro && (
                <div className={styles.emptyState}>
                    <p>{erro}</p>
                    <button
                        type="button"
                        onClick={() => void buscarClipes()}
                    >
                        Tentar novamente
                    </button>
                </div>
            )}
            {/* =================================================
                NENHUM CLIPE
            ================================================= */}
            {!carregando &&
                !erro &&
                clipes.length === 0 && (
                    <div className={styles.emptyState}>
                        <Video size={36} />
                        <p>
                            Nenhum lance encontrado para este atleta.
                        </p>
                        <span>
                            Quando o treinador marcar o atleta
                            durante a análise de um vídeo,
                            os lances aparecerão aqui.
                        </span>
                    </div>
                )}
            {/* =================================================
                NENHUM RESULTADO NO FILTRO
            ================================================= */}
            {!carregando &&
                !erro &&
                clipes.length > 0 &&
                clipesFiltrados.length === 0 && (
                    <div className={styles.emptyState}>
                        <p>
                            Nenhum lance encontrado nesta categoria.
                        </p>
                    </div>
                )}
            {/* =================================================
                GRID DE CLIPES
            ================================================= */}
            {!carregando &&
                !erro &&
                clipesFiltrados.length > 0 && (
                    <div className={styles.clipesGrid}>
                        {clipesFiltrados.map((clipe) => (
                            <div
                                key={clipe.id}
                                className={styles.clipeCard}
                            >
                                {/* CAPA REAL DO VÍDEO */}
                                <div
                                    className={styles.videoWrapper}
                                    onClick={() => abrirVideo(clipe)}
                                >
                                    {miniaturas[clipe.id] ? (
                                        <img
                                            src={miniaturas[clipe.id]}
                                            alt={`Frame de ${clipe.titulo}`}
                                            className={styles.thumbnail}
                                        />
                                    ) : clipe.videoUrl && !miniaturasIndisponiveis[clipe.id] ? (
                                        <LoadingState
                                            variant="thumbnail"
                                            title="Gerando prévia..."
                                        />
                                    ) : (
                                        <div className={styles.thumbnailFallback}>
                                            <Video size={34} />
                                            <span>Prévia indisponível</span>
                                        </div>
                                    )}
                                    <div className={styles.playOverlay}>
                                        <Play
                                            size={22}
                                            fill="#fff"
                                        />
                                    </div>
                                    <span className={styles.timestamp}>
                                        {clipe.tempo}
                                    </span>
                                </div>
                                {/* INFORMAÇÕES */}
                                <div className={styles.clipeInfo}>
                                    <h3 className={styles.clipeTitle}>
                                        {clipe.titulo}
                                    </h3>
                                    <p className={styles.matchName}>
                                        {clipe.partida}
                                    </p>
                                    <span
                                        className={styles.categoryTag}
                                        style={
                                            clipe.corCategoria
                                                ? {
                                                    borderColor:
                                                        clipe.corCategoria,
                                                }
                                                : undefined
                                        }
                                    >
                                        {clipe.categoria}
                                    </span>
                                    {clipe.observacao && (
                                        <p className={styles.matchName}>
                                            {clipe.observacao}
                                        </p>
                                    )}
                                    {/* AÇÕES */}
                                    <div className={styles.cardFooter}>
                                        <button
                                            type="button"
                                            className={
                                                styles.downloadButton
                                            }
                                            onClick={() =>
                                                handleDownload(clipe)
                                            }
                                        >
                                            <Download size={16} />
                                            Download MP4
                                        </button>
                                        <button
                                            type="button"
                                            className={
                                                styles.shareButton
                                            }
                                            onClick={() =>
                                                handleShare(clipe)
                                            }
                                            title={
                                                copiado === clipe.id
                                                    ? 'Link copiado!'
                                                    : 'Compartilhar'
                                            }
                                        >
                                            <Share2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            {/* =================================================
                MODAL DE VÍDEO
            ================================================= */}
            {videoAberto && (
                <div
                    className={styles.videoModalOverlay}
                    onClick={() => setVideoAberto(null)}
                >
                    <div
                        className={styles.videoModal}
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >
                        <button
                            type="button"
                            className={styles.videoModalClose}
                            onClick={() => setVideoAberto(null)}
                        >
                            <X size={22} />
                        </button>
                        <video
                            ref={videoRef}
                            src={videoAberto.videoUrl}
                            controls
                            autoPlay
                            className={styles.videoPlayer}
                            onLoadedMetadata={
                                handleVideoCarregado
                            }
                        />
                        <div className={styles.videoModalInfo}>
                            <h3>
                                {videoAberto.titulo}
                            </h3>
                            <p>
                                {atletaNome}
                                {' | '}
                                {videoAberto.partida}
                                {' • '}
                                {videoAberto.tempo}
                            </p>
                            <p>
                                Categoria: {videoAberto.categoria}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
export default ClipesAtleta;
