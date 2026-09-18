import { useState } from 'react';
import {
    ArrowLeft, ChevronDown, Play, Download, Share2,
    Trophy, Flag, Users, Activity, X
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

    const filtros = [
        { id: 'todos', label: 'Todos os lances', qtd: 10 },
        { id: 'try', label: 'Try', qtd: 1 },
        { id: 'tackle', label: 'Tackle', qtd: 5 },
        { id: 'passe', label: 'Passe', qtd: 10 },
        { id: 'duelo', label: 'Duelo', qtd: 12 },
        { id: 'chute', label: 'Chute', qtd: 3 },
    ];

    const campeonatos = ['Brasileiro XV', 'Capeonato paulista', 'Copa do Brasil', 'Sul-Americano'];

    //  VÍDEOS E IMAGENS 
       const clipes: Clipe[] = [
    {
        id: 1,
        tempo: '12:30',
        titulo: 'Try Decisivo',
        partida: 'Poli Rugby x São José',
        categoria: 'Capeonato paulista',
        tipo: 'try',
        thumbnail: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.pexels.com/pt-br/download/video/3459703/' // <---
    },
    {
        id: 2,
        tempo: '18:45',
        titulo: 'Tackle Perfeito',
        partida: 'Poli Rugby x São José',
        categoria: 'Capeonato paulista',
        tipo: 'tackle',
        thumbnail: 'https://www.pexels.com/pt-br/download/video/32469700/',
        videoUrl: 'https://www.pexels.com/pt-br/download/video/32469700/' // <---
    },
    {
        id: 3,
        tempo: '24:10',
        titulo: 'Passe Longo',
        partida: 'Poli Rugby x São José',
        categoria: 'Capeonato paulista',
        tipo: 'passe',
        thumbnail: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.pexels.com/pt-br/download/video/38212182/' // <---
    },
    {
        id: 4,
        tempo: '32:20',
        titulo: 'Duelo Vencido',
        partida: 'Poli Rugby x São José',
        categoria: 'Capeonato paulista',
        tipo: 'duelo',
        thumbnail: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.pexels.com/pt-br/download/video/32469685/' // <---
    },
    ];

    const clipesFiltrados = filtroAtivo === 'todos'
        ? clipes
        : clipes.filter(c => c.tipo === filtroAtivo);

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
                await navigator.share({ title: clipe.titulo, text: clipe.partida, url });
            } else {
                await navigator.clipboard.writeText(url);
                setCopiado(clipe.id);
                setTimeout(() => setCopiado(null), 2000);
            }
        } catch (err) { console.error(err); }
    };

    return (
        <div className={styles.page}>

            <button className={styles.backButton} onClick={onBack}>
                <ArrowLeft size={16} />
                Voltar para o perfil
            </button>

            <div className={styles.toolbar}>
                <div className={styles.toolbarHeader}>
                    <div className={styles.titleArea}>
                        <div className={styles.titleRow}>
                            <h1>Clipes</h1>
                            <span className={styles.countBadge}>{clipesFiltrados.length} clipes analisados</span>
                        </div>
                        <p className={styles.subtitle}>
                            Explore os cortes categorizados e dados detalhados minuto a minuto de cada jogo oficial.
                        </p>
                    </div>

                    <div className={styles.championshipSelectWrapper}>
                        <div className={styles.championshipSelect} onClick={() => setDropdownAberto(!dropdownAberto)}>
                            <span>{campeonato}</span>
                            <ChevronDown size={20} style={{ transform: dropdownAberto ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
                        </div>
                        {dropdownAberto && (
                            <div className={styles.dropdown}>
                                {campeonatos.map((camp) => (
                                    <button key={camp} className={styles.dropdownItem} onClick={() => { setCampeonato(camp); setDropdownAberto(false); }}>
                                        {camp}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className={styles.filtersRow}>
                    <span className={styles.filterLabel}>Filtrar:</span>
                    {filtros.map((filtro) => (
                        <button
                            key={filtro.id}
                            className={`${styles.filterButton} ${filtroAtivo === filtro.id ? styles.filterActive : ''}`}
                            onClick={() => setFiltroAtivo(filtro.id)}
                        >
                            {filtro.id === 'try' && <Flag size={14} />}
                            {filtro.id === 'tackle' && <Users size={14} />}
                            {filtro.id === 'passe' && <Share2 size={14} />}
                            {filtro.id === 'duelo' && <Activity size={14} />}
                            {filtro.label} ({filtro.qtd})
                        </button>
                    ))}
                </div>
            </div>

            {clipesFiltrados.length === 0 ? (
                <div className={styles.emptyState}><p>Nenhum clipe encontrado com esse filtro.</p></div>
            ) : (
                <div className={styles.clipesGrid}>
                    {clipesFiltrados.map((clipe) => (
                        <div key={clipe.id} className={styles.clipeCard}>
                            <div className={styles.videoWrapper} onClick={() => setVideoAberto(clipe)}>
                                <img src={clipe.thumbnail} alt={clipe.titulo} className={styles.thumbnail} />
                                <div className={styles.playOverlay}><Play size={22} fill="#fff" /></div>
                            </div>

                            <div className={styles.clipeInfo}>
                                <span className={styles.timestamp}>{clipe.tempo}</span>
                                <h3 className={styles.clipeTitle}>{clipe.titulo}</h3>
                                <p className={styles.matchName}>{clipe.partida}</p>
                                <span className={styles.categoryTag}><Trophy size={14} />{clipe.categoria}</span>

                                <div className={styles.cardFooter}>
                                    <button className={styles.downloadButton} onClick={() => handleDownload(clipe)}>
                                        <Download size={16} /> Download MP4
                                    </button>
                                    <button className={styles.shareButton} onClick={() => handleShare(clipe)} title={copiado === clipe.id ? 'Link copiado!' : 'Compartilhar'}>
                                        <Share2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {videoAberto && (
                <div className={styles.videoModalOverlay} onClick={() => setVideoAberto(null)}>
                    <div className={styles.videoModal} onClick={(e) => e.stopPropagation()}>
                        <button className={styles.videoModalClose} onClick={() => setVideoAberto(null)}>
                            <X size={22} />
                        </button>
                        <video src={videoAberto.videoUrl} controls autoPlay className={styles.videoPlayer} />
                        <div className={styles.videoModalInfo}>
                            <h3>{videoAberto.titulo}</h3>
                            <p>{videoAberto.partida} • {videoAberto.tempo}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClipesAtleta;