import { useState } from 'react';
import {
    ArrowLeft,
    ChevronDown,
    Play,
    Download,
    Share2,
    Trophy,
    Flag,
    Users,
    Activity,
    X,
    Search,
    Bell
} from 'lucide-react';

import styles from './clipesAtleta.module.css';

interface ClipesAtletaProps {
    onBack: () => void;
}

interface Clipe {
    id: number;
    tempo: string;
    titulo: string;
    partida: string;
    categoria: string;
    tipo: 'try' | 'tackle' | 'passe' | 'duelo' | 'chute';
    thumbnail: string;
    videoUrl: string;
}

const ClipesAtleta = ({ onBack }: ClipesAtletaProps) => {

    const [filtroAtivo, setFiltroAtivo] = useState('todos');
    const [campeonato, setCampeonato] = useState('Brasileiro XV');
    const [dropdownAberto, setDropdownAberto] = useState(false);
    const [videoAberto, setVideoAberto] = useState<Clipe | null>(null);
    const [copiado, setCopiado] = useState<number | null>(null);

    const [clipeSelecionado, setClipeSelecionado] = useState<Clipe | null>(null);

    const filtros = [
        { id: 'todos', label: 'Todos os lances', qtd: 10 },
        { id: 'try', label: 'Try', qtd: 1 },
        { id: 'tackle', label: 'Tackle', qtd: 5 },
        { id: 'passe', label: 'Passe', qtd: 10 },
        { id: 'duelo', label: 'Duelo', qtd: 12 },
        { id: 'chute', label: 'Chute', qtd: 3 },
    ];

    const campeonatos = [
        'Brasileiro XV',
        'Capeonato paulista',
        'Copa do Brasil',
        'Sul-Americano'
    ];

    const clipes: Clipe[] = [
        {
            id: 1,
            tempo: '12:30',
            titulo: 'Try',
            partida: 'Poli Rugby',
            categoria: 'Brasileiro XV',
            tipo: 'try',
            thumbnail:
                'https://images.unsplash.com/photo-1517466787929-bc90951d0974?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=85',
            videoUrl:
                'https://www.pexels.com/pt-br/download/video/3459703/'
        },
        {
            id: 2,
            tempo: '18:45',
            titulo: 'Tackle',
            partida: 'Poli Rugby',
            categoria: 'Brasileiro XV',
            tipo: 'tackle',
            thumbnail:
                'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            videoUrl:
                'https://www.pexels.com/pt-br/download/video/32469700/'
        },
        {
            id: 3,
            tempo: '24:10',
            titulo: 'Passe',
            partida: 'Poli Rugby',
            categoria: 'Brasileiro XV',
            tipo: 'passe',
            thumbnail:
                'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            videoUrl:
                'https://www.pexels.com/pt-br/download/video/38212182/'
        },
        {
            id: 4,
            tempo: '32:20',
            titulo: 'Duelo',
            partida: 'Poli Rugby',
            categoria: 'Brasileiro XV',
            tipo: 'duelo',
            thumbnail:
                'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            videoUrl:
                'https://www.pexels.com/pt-br/download/video/32469685/'
        },
    ];

    const clipesFiltrados =
        filtroAtivo === 'todos'
            ? clipes
            : clipes.filter((c) => c.tipo === filtroAtivo);

    const clipesTry = clipes.filter((clipe) => clipe.tipo === 'try');

    const principalTry =
        clipeSelecionado?.tipo === 'try'
            ? clipeSelecionado
            : clipesTry[0];

    const outrosClipes = [
        principalTry,
        {
            ...clipes[1],
            tempo: '18:45',
            titulo: 'Try',
            partida: 'Poli Rugby'
        },
        {
            ...clipes[2],
            tempo: '24:10',
            titulo: 'Try',
            partida: 'Poli Rugby'
        },
        {
            ...clipes[3],
            tempo: '32:20',
            titulo: 'Try',
            partida: 'Poli Rugby'
        }
    ].filter(Boolean) as Clipe[];

    const handleFiltro = (id: string) => {
        setFiltroAtivo(id);

        if (id === 'try') {
            setClipeSelecionado(clipesTry[0]);
        } else {
            setClipeSelecionado(null);
        }
    };

    const handleDownload = (clipe: Clipe) => {
        const link = document.createElement('a');

        link.href = clipe.videoUrl;
        link.download = `${clipe.titulo.replace(/\s+/g, '_')}.mp4`;
        link.target = '_blank';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleShare = async (clipe: Clipe) => {
        const url = `${window.location.origin}/clipes/${clipe.id}`;

        try {
            if (navigator.share) {
                await navigator.share({
                    title: clipe.titulo,
                    text: clipe.partida,
                    url
                });
            } else {
                await navigator.clipboard.writeText(url);

                setCopiado(clipe.id);

                setTimeout(() => {
                    setCopiado(null);
                }, 2000);
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className={styles.page}>

            <button
                className={styles.backButton}
                onClick={onBack}
            >
                <ArrowLeft size={16} />
                Voltar para o perfil
            </button>

            <div className={styles.toolbar}>

                <div className={styles.toolbarHeader}>

                    <div className={styles.titleArea}>

                        <div className={styles.titleRow}>
                            <h1>Clipes</h1>

                            <span className={styles.countBadge}>
                                10 clipes analisados
                            </span>
                        </div>

                        <p className={styles.subtitle}>
                            Explore os cortes categorizados e dados detalhados minuto a minuto de cada jogo oficial.
                        </p>

                    </div>

                    <div className={styles.championshipSelectWrapper}>

                        <div
                            className={styles.championshipSelect}
                            onClick={() =>
                                setDropdownAberto(!dropdownAberto)
                            }
                        >
                            <span>{campeonato}</span>

                            <ChevronDown
                                size={20}
                                style={{
                                    transform: dropdownAberto
                                        ? 'rotate(180deg)'
                                        : 'rotate(0deg)',
                                    transition: 'transform 0.2s'
                                }}
                            />
                        </div>

                        {dropdownAberto && (
                            <div className={styles.dropdown}>
                                {campeonatos.map((camp) => (
                                    <button
                                        key={camp}
                                        className={styles.dropdownItem}
                                        onClick={() => {
                                            setCampeonato(camp);
                                            setDropdownAberto(false);
                                        }}
                                    >
                                        {camp}
                                    </button>
                                ))}
                            </div>
                        )}

                    </div>

                </div>

                <div className={styles.filtersRow}>

                    <span className={styles.filterLabel}>
                        Filtrar:
                    </span>

                    {filtros.map((filtro) => (
                        <button
                            key={filtro.id}
                            className={`${styles.filterButton} ${
                                filtroAtivo === filtro.id
                                    ? styles.filterActive
                                    : ''
                            }`}
                            onClick={() =>
                                handleFiltro(filtro.id)
                            }
                        >

                            {filtro.id === 'try' && (
                                <Flag size={14} />
                            )}

                            {filtro.id === 'tackle' && (
                                <Users size={14} />
                            )}

                            {filtro.id === 'passe' && (
                                <Share2 size={14} />
                            )}

                            {filtro.id === 'duelo' && (
                                <Activity size={14} />
                            )}

                            {filtro.label} ({filtro.qtd})

                        </button>
                    ))}

                </div>

            </div>

            {/* =================================================
                SOMENTE QUANDO TRY ESTÁ SELECIONADO
            ================================================= */}

            {filtroAtivo === 'try' && principalTry ? (

                <div className={styles.tryLayout}>

                    {/* PLAYER PRINCIPAL */}

                    <div className={styles.mainPlayerCard}>

                        <div
                            className={styles.mainVideo}
                            onClick={() =>
                                setVideoAberto(principalTry)
                            }
                        >

                            <img
                                src={principalTry.thumbnail}
                                alt="Try - Diogo Ramos"
                                className={styles.mainThumbnail}
                            />

                            <div className={styles.mainPlayButton}>
                                <Play
                                    size={30}
                                    fill="white"
                                />
                            </div>

                            <div className={styles.videoControls}>

                                <button
                                    className={styles.controlPlay}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setVideoAberto(principalTry);
                                    }}
                                >
                                    <Play
                                        size={18}
                                        fill="white"
                                    />
                                </button>

                                <div className={styles.progressContainer}>

                                    <div className={styles.progressTrack}>
                                        <div
                                            className={
                                                styles.progressPlayed
                                            }
                                        />

                                        <div
                                            className={
                                                styles.progressIndicator
                                            }
                                        />
                                    </div>

                                </div>

                                <span className={styles.videoTime}>
                                    12:30
                                </span>

                            </div>

                        </div>

                        <div className={styles.mainVideoInfo}>

                            <div>
                                <span className={styles.mainVideoTime}>
                                    {principalTry.tempo}
                                </span>

                                <h2>
                                    Try
                                </h2>

                                <p>
                                    Diogo Ramos | Poli Rugby
                                </p>
                            </div>

                            <div className={styles.mainActions}>

                                <button
                                    onClick={() =>
                                        handleDownload(principalTry)
                                    }
                                >
                                    <Download size={16} />
                                    Download
                                </button>

                                <button
                                    onClick={() =>
                                        handleShare(principalTry)
                                    }
                                >
                                    <Share2 size={16} />
                                    {copiado === principalTry.id
                                        ? 'Copiado'
                                        : 'Compartilhar'}
                                </button>

                            </div>

                        </div>

                    </div>

                    {/* OUTROS CLIPES */}

                    <div className={styles.otherClipsCard}>

                        <h2>
                            Outros clipes
                        </h2>

                        <div className={styles.otherClipsList}>

                            {outrosClipes.map((clipe, index) => {

                                const ativo =
                                    principalTry.id === clipe.id;

                                return (
                                    <button
                                        key={`${clipe.id}-${index}`}
                                        className={`${styles.otherClip} ${
                                            ativo
                                                ? styles.otherClipActive
                                                : ''
                                        }`}
                                        onClick={() =>
                                            setClipeSelecionado(clipe)
                                        }
                                    >

                                        <div className={styles.otherThumbnail}>

                                            <img
                                                src={clipe.thumbnail}
                                                alt="Clipe"
                                            />

                                        </div>

                                        <div className={styles.otherClipInfo}>

                                            <strong>
                                                {clipe.tempo} - Try
                                            </strong>

                                            <span>
                                                Diogo Ramos
                                            </span>

                                            <span>
                                                Poli Rugby
                                            </span>

                                        </div>

                                        <span
                                            className={
                                                styles.otherPlay
                                            }
                                        >
                                            <Play
                                                size={14}
                                                fill={
                                                    ativo
                                                        ? 'white'
                                                        : '#222'
                                                }
                                            />
                                        </span>

                                    </button>
                                );
                            })}

                        </div>

                    </div>

                </div>

            ) : (

                /* =================================================
                   RESTANTE DA TELA — NÃO ALTERADO
                ================================================= */

                clipesFiltrados.length === 0 ? (

                    <div className={styles.emptyState}>
                        <p>
                            Nenhum clipe encontrado com esse filtro.
                        </p>
                    </div>

                ) : (

                    <div className={styles.clipesGrid}>

                        {clipesFiltrados.map((clipe) => (

                            <div
                                key={clipe.id}
                                className={styles.clipeCard}
                            >

                                <div
                                    className={styles.videoWrapper}
                                    onClick={() =>
                                        setVideoAberto(clipe)
                                    }
                                >

                                    <img
                                        src={clipe.thumbnail}
                                        alt={clipe.titulo}
                                        className={styles.thumbnail}
                                    />

                                    <div className={styles.playOverlay}>
                                        <Play
                                            size={22}
                                            fill="#fff"
                                        />
                                    </div>

                                </div>

                                <div className={styles.clipeInfo}>

                                    <span className={styles.timestamp}>
                                        {clipe.tempo}
                                    </span>

                                    <h3 className={styles.clipeTitle}>
                                        {clipe.titulo}
                                    </h3>

                                    <p className={styles.matchName}>
                                        {clipe.partida}
                                    </p>

                                    <span className={styles.categoryTag}>
                                        <Trophy size={14} />
                                        {clipe.categoria}
                                    </span>

                                    <div className={styles.cardFooter}>

                                        <button
                                            className={styles.downloadButton}
                                            onClick={() =>
                                                handleDownload(clipe)
                                            }
                                        >
                                            <Download size={16} />
                                            Download MP4
                                        </button>

                                        <button
                                            className={styles.shareButton}
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

                )

            )}

            {/* =================================================
                MODAL DE VÍDEO
            ================================================= */}

            {videoAberto && (

                <div
                    className={styles.videoModalOverlay}
                    onClick={() =>
                        setVideoAberto(null)
                    }
                >

                    <div
                        className={styles.videoModal}
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <button
                            className={styles.videoModalClose}
                            onClick={() =>
                                setVideoAberto(null)
                            }
                        >
                            <X size={22} />
                        </button>

                        <video
                            src={videoAberto.videoUrl}
                            controls
                            autoPlay
                            className={styles.videoPlayer}
                        />

                        <div className={styles.videoModalInfo}>

                            <h3>
                                {videoAberto.titulo}
                            </h3>

                            <p>
                                {videoAberto.partida} •{' '}
                                {videoAberto.tempo}
                            </p>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
};

export default ClipesAtleta;