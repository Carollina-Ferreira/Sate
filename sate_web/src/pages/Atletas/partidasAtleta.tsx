
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
    ArrowLeft,
    Activity,
    CalendarDays,
    ChevronDown,
    Clock,
    MapPin,
    Search,
    Trophy,
    Star,
    Video,
    Play,
    X,
    CircleCheck,
    CircleX,
    MinusCircle,
    LoaderCircle,
} from 'lucide-react';

import styles from './partidasAtleta.module.css';

// ============================================================
// PROPRIEDADES
// ============================================================

interface PartidasAtletaProps {
    atletaId: number | string;
    atletaNome?: string;
    onBack: () => void;
}

// ============================================================
// TIPOS
// ============================================================

interface AcaoAtleta {
    id: number;
    videoId?: number;
    videoTitulo?: string;
    videoUrl?: string;
    titulo: string;
    categoria?: string | null;
    cor?: string | null;
    avaliacao?: string | null;
    tipoRegistro?: string;
    tempoInicio: number;
    tempoFim?: number;
    observacao?: string | null;
}

interface Equipe {
    id: number;
    nome: string;
    modalidade?: string;
}

interface PartidaAtleta {
    id: number;
    adversario: string;
    data: string;
    local?: string | null;
    campeonato?: string | null;
    rodada?: string | null;
    status: string;
    golsEquipe?: number | null;
    golsAdversario?: number | null;
    equipe?: Equipe | null;
    acoes: AcaoAtleta[];
}

interface VideoAberto {
    url: string;
    titulo: string;
    partida: string;
    tempo: number;
    videoTitulo: string;
}

// ============================================================
// CONFIGURAÇÃO DA API
// ============================================================

const API_URL = (
    import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
).replace(/\/+$/, '');

const API_ORIGIN = API_URL.replace(/\/api\/?$/, '');

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
// RESOLVER URL DO VÍDEO
// ============================================================

function resolverUrlVideo(url?: string | null): string {
    if (!url) return '';

    const valor = url.trim();

    if (!valor) return '';

    if (
        valor.startsWith('http://') ||
        valor.startsWith('https://') ||
        valor.startsWith('blob:') ||
        valor.startsWith('data:')
    ) {
        return valor;
    }

    if (valor.startsWith('/')) {
        return `${API_ORIGIN}${valor}`;
    }

    return `${API_ORIGIN}/${valor}`;
}

// ============================================================
// REQUISIÇÃO
// ============================================================

async function buscarPartidas(
    atletaId: number | string
): Promise<PartidaAtleta[]> {
    const token = obterToken();

    const resposta = await fetch(
        `${API_URL}/atletas/${atletaId}/partidas`,
        {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                ...(token
                    ? {
                        Authorization: `Bearer ${token}`,
                    }
                    : {}),
            },
        }
    );

    const texto = await resposta.text();

    let dados: any = {};

    try {
        dados = texto ? JSON.parse(texto) : {};
    } catch {
        throw new Error('O servidor retornou uma resposta inválida.');
    }

    if (!resposta.ok) {
        throw new Error(
            dados.mensagem ||
            dados.message ||
            'Não foi possível carregar as partidas do atleta.'
        );
    }

    const lista = Array.isArray(dados)
        ? dados
        : dados.partidas ||
          dados.data?.partidas ||
          dados.dados ||
          [];

    if (!Array.isArray(lista)) {
        throw new Error(
            'O formato das partidas retornadas pelo servidor é inválido.'
        );
    }

    return lista.map((item: any) => ({
        id: Number(item.id),
        adversario: item.adversario || 'Adversário não informado',
        data: item.data || '',
        local: item.local || null,
        campeonato: item.campeonato || null,
        rodada: item.rodada || null,
        status: item.status || 'AGENDADA',
        golsEquipe: item.golsEquipe ?? null,
        golsAdversario: item.golsAdversario ?? null,
        equipe: item.equipe || null,

        acoes: Array.isArray(item.acoes)
            ? item.acoes.map((acao: any) => ({
                id: Number(acao.id),
                videoId: acao.videoId,
                videoTitulo: acao.videoTitulo || null,

                // Aceita os dois nomes retornados pela API.
                videoUrl: resolverUrlVideo(
                    acao.videoUrl || acao.url || null
                ),

                titulo: acao.titulo || 'Ação analisada',
                categoria:
                    acao.categoria ||
                    acao.categoriaNome ||
                    null,
                cor: acao.cor || null,
                avaliacao: acao.avaliacao || null,
                tipoRegistro: acao.tipoRegistro || 'EVENTO',
                tempoInicio: Number(acao.tempoInicio || 0),
                tempoFim: Number(acao.tempoFim || 0),
                observacao: acao.observacao || null,
            }))
            : [],
    }));
}

// ============================================================
// FORMATAÇÃO
// ============================================================

function formatarData(data: string): string {
    if (!data) return 'Data não informada';

    const apenasData = data.split('T')[0];

    if (/^\d{4}-\d{2}-\d{2}$/.test(apenasData)) {
        const [ano, mes, dia] = apenasData.split('-').map(Number);

        return new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        }).format(new Date(ano, mes - 1, dia));
    }

    const valor = new Date(data);

    if (Number.isNaN(valor.getTime())) {
        return 'Data não informada';
    }

    return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    }).format(valor);
}

function formatarTempo(segundos: number): string {
    const valor = Math.max(0, Math.floor(segundos || 0));

    const horas = Math.floor(valor / 3600);
    const minutos = Math.floor((valor % 3600) / 60);
    const segundosRestantes = valor % 60;

    if (horas > 0) {
        return `${String(horas).padStart(2, '0')}:${String(
            minutos
        ).padStart(2, '0')}:${String(segundosRestantes).padStart(2, '0')}`;
    }

    return `${String(minutos).padStart(2, '0')}:${String(
        segundosRestantes
    ).padStart(2, '0')}`;
}

function obterStatus(status: string) {
    switch (status) {
        case 'FINALIZADA':
            return {
                texto: 'Finalizada',
                classe: styles.statusFinalizada,
            };

        case 'EM_ANDAMENTO':
            return {
                texto: 'Em andamento',
                classe: styles.statusAndamento,
            };

        case 'CANCELADA':
            return {
                texto: 'Cancelada',
                classe: styles.statusCancelada,
            };

        default:
            return {
                texto: 'Agendada',
                classe: styles.statusAgendada,
            };
    }
}

function obterAvaliacao(avaliacao?: string | null) {
    switch (avaliacao) {
        case 'POSITIVA':
            return {
                texto: 'Positiva',
                classe: styles.acaoPositiva,
                Icone: CircleCheck,
            };

        case 'NEGATIVA':
            return {
                texto: 'Negativa',
                classe: styles.acaoNegativa,
                Icone: CircleX,
            };

        case 'DESTAQUE':
            return {
                texto: 'Destaque',
                classe: styles.acaoDestaque,
                Icone: Star,
            };

        default:
            return {
                texto: 'Neutra',
                classe: styles.acaoNeutra,
                Icone: MinusCircle,
            };
    }
}

// ============================================================
// COMPONENTE
// ============================================================

const PartidasAtleta = ({
    atletaId,
    atletaNome = 'Atleta',
    onBack,
}: PartidasAtletaProps) => {

    const [partidas, setPartidas] = useState<PartidaAtleta[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState('');
    const [busca, setBusca] = useState('');
    const [filtroStatus, setFiltroStatus] = useState('TODAS');

    const [partidasAbertas, setPartidasAbertas] =
        useState<Set<number>>(new Set());

    // Controle do vídeo aberto
    const [videoAberto, setVideoAberto] =
        useState<VideoAberto | null>(null);

    const videoRef = useRef<HTMLVideoElement>(null);

    // ========================================================
    // CARREGAR PARTIDAS
    // ========================================================

    const carregarDados = useCallback(async () => {
        try {
            setCarregando(true);
            setErro('');

            const dados = await buscarPartidas(atletaId);

            setPartidas(dados);
        } catch (error) {
            console.error(
                'Erro ao carregar partidas do atleta:',
                error
            );

            setErro(
                error instanceof Error
                    ? error.message
                    : 'Não foi possível carregar as partidas.'
            );
        } finally {
            setCarregando(false);
        }
    }, [atletaId]);

    useEffect(() => {
        void carregarDados();
    }, [carregarDados]);

    // ========================================================
    // ABRIR VÍDEO
    // ========================================================

    const abrirVideo = (
        acao: AcaoAtleta,
        partida: PartidaAtleta
    ) => {
        if (!acao.videoUrl) {
            alert('A URL deste vídeo não foi encontrada.');
            return;
        }

        setVideoAberto({
            url: acao.videoUrl,
            titulo: acao.titulo,
            partida: `${partida.equipe?.nome || 'Equipe'} x ${partida.adversario}`,
            tempo: acao.tempoInicio || 0,
            videoTitulo: acao.videoTitulo || 'Vídeo da partida',
        });
    };

    // ========================================================
    // FECHAR VÍDEO
    // ========================================================

    const fecharVideo = () => {
        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.removeAttribute('src');
            videoRef.current.load();
        }

        setVideoAberto(null);
    };

    // Posiciona o vídeo no momento da ação.
    const posicionarVideo = () => {
        if (!videoRef.current || !videoAberto) return;

        videoRef.current.currentTime = videoAberto.tempo;
    };

    // ========================================================
    // ESTATÍSTICAS REAIS
    // ========================================================

    const estatisticas = useMemo(() => {
        const todasAcoes = partidas.flatMap(
            (partida) => partida.acoes
        );

        return {
            partidas: partidas.length,
            acoes: todasAcoes.length,

            positivas: todasAcoes.filter(
                (acao) => acao.avaliacao === 'POSITIVA'
            ).length,

            negativas: todasAcoes.filter(
                (acao) => acao.avaliacao === 'NEGATIVA'
            ).length,

            destaques: todasAcoes.filter(
                (acao) => acao.avaliacao === 'DESTAQUE'
            ).length,
        };
    }, [partidas]);

    // ========================================================
    // FILTRAR PARTIDAS
    // ========================================================

    const partidasFiltradas = useMemo(() => {
        const texto = busca.trim().toLowerCase();

        return partidas.filter((partida) => {
            const correspondeBusca =
                !texto ||
                partida.adversario.toLowerCase().includes(texto) ||
                (partida.equipe?.nome || '')
                    .toLowerCase().includes(texto) ||
                (partida.campeonato || '')
                    .toLowerCase().includes(texto) ||
                partida.acoes.some((acao) =>
                    acao.titulo.toLowerCase().includes(texto)
                );

            const correspondeStatus =
                filtroStatus === 'TODAS' ||
                partida.status === filtroStatus;

            return correspondeBusca && correspondeStatus;
        });
    }, [partidas, busca, filtroStatus]);

    // ========================================================
    // ABRIR / FECHAR PARTIDA
    // ========================================================

    const alternarPartida = (id: number) => {
        setPartidasAbertas((atuais) => {
            const novas = new Set(atuais);

            if (novas.has(id)) {
                novas.delete(id);
            } else {
                novas.add(id);
            }

            return novas;
        });
    };

    // ========================================================
    // RENDERIZAÇÃO
    // ========================================================

    return (
        <div className={styles.page}>

            <button
                type="button"
                className={styles.backButton}
                onClick={onBack}
            >
                <ArrowLeft size={17} />
                Voltar para o perfil
            </button>

            <header className={styles.header}>
                <div>
                    <span className={styles.eyebrow}>
                        DESEMPENHO INDIVIDUAL
                    </span>

                    <h1>
                        Partidas <em>do atleta.</em>
                    </h1>

                    <p>
                        Confira a participação de {atletaNome}
                        {' '}e suas ações em cada partida.
                    </p>
                </div>
            </header>

            {/* ESTATÍSTICAS */}

            <section className={styles.statsGrid}>

                <article className={styles.statCard}>
                    <div className={styles.statIcon}>
                        <Trophy size={21} />
                    </div>
                    <div>
                        <strong>{estatisticas.partidas}</strong>
                        <span>Partidas</span>
                    </div>
                </article>

                <article className={styles.statCard}>
                    <div className={styles.statIcon}>
                        <Activity size={21} />
                    </div>
                    <div>
                        <strong>{estatisticas.acoes}</strong>
                        <span>Ações registradas</span>
                    </div>
                </article>

                <article className={styles.statCard}>
                    <div className={styles.statIcon}>
                        <CircleCheck size={21} />
                    </div>
                    <div>
                        <strong>{estatisticas.positivas}</strong>
                        <span>Ações positivas</span>
                    </div>
                </article>

                <article className={styles.statCard}>
                    <div className={styles.statIcon}>
                        <Star size={21} />
                    </div>
                    <div>
                        <strong>{estatisticas.destaques}</strong>
                        <span>Destaques</span>
                    </div>
                </article>

            </section>

            {/* FILTROS */}

            <section className={styles.filters}>

                <div className={styles.searchBox}>
                    <Search size={18} />

                    <input
                        value={busca}
                        onChange={(event) =>
                            setBusca(event.target.value)
                        }
                        placeholder="Buscar partida, campeonato ou ação..."
                    />
                </div>

                <div className={styles.selectWrapper}>
                    <select
                        value={filtroStatus}
                        onChange={(event) =>
                            setFiltroStatus(event.target.value)
                        }
                    >
                        <option value="TODAS">Todas as partidas</option>
                        <option value="FINALIZADA">Finalizadas</option>
                        <option value="EM_ANDAMENTO">Em andamento</option>
                        <option value="AGENDADA">Agendadas</option>
                        <option value="CANCELADA">Canceladas</option>
                    </select>

                    <ChevronDown size={17} />
                </div>

            </section>

            {/* TÍTULO DA LISTA */}

            <div className={styles.listHeader}>
                <div>
                    <h2>Histórico de partidas</h2>

                    <span>
                        {partidasFiltradas.length}{' '}
                        {partidasFiltradas.length === 1
                            ? 'partida encontrada'
                            : 'partidas encontradas'}
                    </span>
                </div>
            </div>

            {/* CARREGANDO */}

            {carregando && (
                <div className={styles.stateBox}>
                    <LoaderCircle
                        size={30}
                        className={styles.loadingIcon}
                    />
                    <strong>Carregando partidas...</strong>
                    <span>
                        Buscando o histórico de {atletaNome}.
                    </span>
                </div>
            )}

            {/* ERRO */}

            {!carregando && erro && (
                <div className={styles.stateBox}>
                    <CircleX size={30} />
                    <strong>Não foi possível carregar as partidas</strong>
                    <span>{erro}</span>

                    <button
                        type="button"
                        onClick={() => void carregarDados()}
                    >
                        Tentar novamente
                    </button>
                </div>
            )}

            {/* VAZIO */}

            {!carregando && !erro && partidas.length === 0 && (
                <div className={styles.stateBox}>
                    <Trophy size={34} />
                    <strong>Nenhuma partida encontrada</strong>
                    <span>
                        As partidas em que {atletaNome} for escalado aparecerão aqui.
                    </span>
                </div>
            )}

            {/* SEM RESULTADOS */}

            {!carregando &&
                !erro &&
                partidas.length > 0 &&
                partidasFiltradas.length === 0 && (
                    <div className={styles.stateBox}>
                        <Search size={30} />
                        <strong>Nenhuma partida encontrada</strong>
                        <span>
                            Tente alterar a busca ou o filtro selecionado.
                        </span>
                    </div>
                )}

            {/* LISTA DE PARTIDAS */}

            {!carregando &&
                !erro &&
                partidasFiltradas.length > 0 && (

                    <div className={styles.matchesList}>

                        {partidasFiltradas.map((partida) => {
                            const aberta = partidasAbertas.has(partida.id);
                            const status = obterStatus(partida.status);
                            const nomeEquipe = partida.equipe?.nome || 'Equipe';
                            const acoes = partida.acoes || [];

                            return (
                                <article
                                    className={styles.matchCard}
                                    key={partida.id}
                                >

                                    {/* CABEÇALHO DA PARTIDA */}

                                    <button
                                        type="button"
                                        className={styles.matchHeader}
                                        onClick={() =>
                                            alternarPartida(partida.id)
                                        }
                                        aria-expanded={aberta}
                                    >
                                        <div className={styles.matchMain}>
                                            <div className={styles.matchIcon}>
                                                <Trophy size={22} />
                                            </div>

                                            <div className={styles.matchTexts}>
                                                <div className={styles.matchTitleRow}>
                                                    <h3>
                                                        {nomeEquipe} x {partida.adversario}
                                                    </h3>

                                                    <span
                                                        className={`${styles.status} ${status.classe}`}
                                                    >
                                                        {status.texto}
                                                    </span>
                                                </div>

                                                <div className={styles.matchMetadata}>
                                                    <span>
                                                        <CalendarDays size={14} />
                                                        {formatarData(partida.data)}
                                                    </span>

                                                    {partida.campeonato && (
                                                        <span>
                                                            <Trophy size={14} />
                                                            {partida.campeonato}
                                                        </span>
                                                    )}

                                                    {partida.local && (
                                                        <span>
                                                            <MapPin size={14} />
                                                            {partida.local}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className={styles.matchRight}>
                                            <div className={styles.score}>
                                                {partida.golsEquipe !== null &&
                                                partida.golsEquipe !== undefined &&
                                                partida.golsAdversario !== null &&
                                                partida.golsAdversario !== undefined
                                                    ? `${partida.golsEquipe} x ${partida.golsAdversario}`
                                                    : '—'}
                                            </div>

                                            <div className={styles.actionCount}>
                                                <Activity size={14} />
                                                {acoes.length}{' '}
                                                {acoes.length === 1 ? 'ação' : 'ações'}
                                            </div>

                                            <ChevronDown
                                                size={20}
                                                className={
                                                    aberta
                                                        ? styles.chevronOpen
                                                        : styles.chevron
                                                }
                                            />
                                        </div>
                                    </button>

                                    {/* AÇÕES DA PARTIDA */}

                                    {aberta && (
                                        <div className={styles.matchDetails}>

                                            <div className={styles.detailsHeader}>
                                                <div>
                                                    <h4>Ações do atleta</h4>
                                                    <span>
                                                        Registros da análise desta partida
                                                    </span>
                                                </div>

                                                <span className={styles.detailsTotal}>
                                                    {acoes.length}{' '}
                                                    {acoes.length === 1
                                                        ? 'registro'
                                                        : 'registros'}
                                                </span>
                                            </div>

                                            {acoes.length === 0 ? (
                                                <div className={styles.noActions}>
                                                    <Activity size={24} />
                                                    <strong>Nenhuma ação registrada</strong>
                                                    <span>
                                                        O atleta participou desta partida,
                                                        mas ainda não possui ações vinculadas
                                                        na análise de vídeo.
                                                    </span>
                                                </div>
                                            ) : (
                                                <div className={styles.actionsList}>

                                                    {acoes
                                                        .slice()
                                                        .sort(
                                                            (a, b) =>
                                                                a.tempoInicio - b.tempoInicio
                                                        )
                                                        .map((acao) => {
                                                            const avaliacao =
                                                                obterAvaliacao(acao.avaliacao);

                                                            const Icone = avaliacao.Icone;

                                                            return (
                                                                <div
                                                                    className={styles.actionItem}
                                                                    key={acao.id}
                                                                >

                                                                    <div className={styles.actionTime}>
                                                                        <Clock size={15} />
                                                                        {formatarTempo(acao.tempoInicio)}
                                                                    </div>

                                                                    <div className={styles.actionContent}>
                                                                        <strong>
                                                                            {acao.titulo}
                                                                        </strong>

                                                                        <div className={styles.actionMetadata}>

                                                                            {acao.categoria && (
                                                                                <span
                                                                                    className={styles.category}
                                                                                    style={
                                                                                        acao.cor
                                                                                            ? {
                                                                                                borderColor: acao.cor,
                                                                                                color: acao.cor,
                                                                                            }
                                                                                            : undefined
                                                                                    }
                                                                                >
                                                                                    {acao.categoria}
                                                                                </span>
                                                                            )}

                                                                            {acao.observacao && (
                                                                                <span>
                                                                                    {acao.observacao}
                                                                                </span>
                                                                            )}

                                                                            {acao.videoTitulo && (
                                                                                <span className={styles.videoTitle}>
                                                                                    <Video size={13} />
                                                                                    {acao.videoTitulo}
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    </div>

                                                                    <div className={styles.actionRight}>

                                                                        <span
                                                                            className={`${styles.actionEvaluation} ${avaliacao.classe}`}
                                                                        >
                                                                            <Icone size={15} />
                                                                            {avaliacao.texto}
                                                                        </span>

                                                                        {acao.videoUrl && (
                                                                            <button
                                                                                type="button"
                                                                                className={styles.watchVideoButton}
                                                                                onClick={() =>
                                                                                    abrirVideo(acao, partida)
                                                                                }
                                                                            >
                                                                                <Play size={14} fill="currentColor" />
                                                                                Assistir vídeo
                                                                            </button>
                                                                        )}

                                                                    </div>

                                                                </div>
                                                            );
                                                        })}

                                                </div>
                                            )}
                                        </div>
                                    )}
                                </article>
                            );
                        })}
                    </div>
                )}

            {/* MODAL DO VÍDEO */}

            {videoAberto && (
                <div
                    className={styles.videoModalOverlay}
                    onClick={fecharVideo}
                >
                    <div
                        className={styles.videoModal}
                        onClick={(event) => event.stopPropagation()}
                        role="dialog"
                        aria-modal="true"
                        aria-label="Reprodutor de vídeo da partida"
                    >

                        <button
                            type="button"
                            className={styles.videoModalClose}
                            onClick={fecharVideo}
                            aria-label="Fechar vídeo"
                        >
                            <X size={20} />
                        </button>

                        <div className={styles.videoModalHeader}>
                            <span>ANÁLISE DE DESEMPENHO</span>

                            <h3>{videoAberto.titulo}</h3>

                            <p>
                                {videoAberto.partida}
                            </p>
                        </div>

                        <video
                            ref={videoRef}
                            key={videoAberto.url}
                            className={styles.videoPlayer}
                            src={videoAberto.url}
                            controls
                            playsInline
                            preload="metadata"
                            onLoadedMetadata={posicionarVideo}
                        >
                            Seu navegador não conseguiu reproduzir este vídeo.
                        </video>

                        <div className={styles.videoModalInfo}>
                            <div>
                                <span>Vídeo</span>
                                <strong>{videoAberto.videoTitulo}</strong>
                            </div>

                            <div>
                                <span>Momento da ação</span>
                                <strong>
                                    {formatarTempo(videoAberto.tempo)}
                                </strong>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default PartidasAtleta;
