import { useEffect, useRef, useState } from 'react';
import {
  Plus,
  Trash2,
  TriangleAlert,
  Upload,
  Video,
  X,
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

import styles from './partidas2.module.css';

type AtletaPartida = {
  id: number;
  nome?: string | null;
  categoria?: string | null;
  equipeId?: number | null;
  usuario?: {
    avatarUrl?: string | null;
    email?: string | null;
  } | null;
};

type PartidaRecebida = {
  id?: number;
  confronto: string;
  modalidade: string;
  data: string;
  resultado: string;
  status: string;
  tipo: string;
  temporada: string;
};

type VideoPartida = {
  id: number;
  titulo: string;
  horario?: string;
  tipo?: string | null;
  classe?: string;
  url: string;
  nomeArquivo?: string;
  tamanho?: number | string | null;
  createdAt?: string;
  updatedAt?: string;
};

const API_URL = 'http://localhost:3000/api';

const eventos = [
  { horario: '22:54', tipo: 'Gol', atleta: 'Rafael Souza', cor: 'verde' },
  { horario: '22:54', tipo: 'Erro', atleta: 'Bruno Alves', cor: 'vermelho' },
  { horario: '22:54', tipo: 'Finalização', atleta: 'Rafael Souza', cor: 'azul' },
  { horario: '22:54', tipo: 'Falta', atleta: 'Igor Tavares', cor: 'laranja' },
  { horario: '22:54', tipo: 'Gol', atleta: 'Bruno Alves', cor: 'verde' },
  { horario: '22:54', tipo: 'Assistência', atleta: 'Rafael Souza', cor: 'verde' },
  { horario: '22:54', tipo: 'Contra-Ataque', atleta: 'Rafael Souza', cor: 'amarelo' },
];

function obterToken() {
  return (
    localStorage.getItem('token') ||
    localStorage.getItem('accessToken') ||
    sessionStorage.getItem('token')
  );
}

function chaveEscalacao(partidaId: number) {
  return `sate_escalacao_partida_${partidaId}`;
}

function obterIniciais(nome: string) {
  const partes = nome.trim().split(' ').filter(Boolean);
  if (partes.length === 0) return 'AT';
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase();
  return `${partes[0][0]}${partes[partes.length - 1][0]}`.toUpperCase();
}

function formatarHorario(video: VideoPartida) {
  if (video.horario) return video.horario;
  if (video.createdAt) {
    const data = new Date(video.createdAt);
    if (!Number.isNaN(data.getTime())) {
      return data.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      });
    }
  }
  return '--:--';
}

function obterClasseVideo(video: VideoPartida) {
  if (video.classe) return video.classe;
  if (video.tipo?.toLowerCase().includes('gol')) return 'gol';
  return 'destaque';
}

function normalizarUrlVideo(url: string) {
  if (!url) return '';
  if (
    url.startsWith('http://') ||
    url.startsWith('https://') ||
    url.startsWith('blob:')
  ) {
    return url;
  }
  if (url.startsWith('/')) {
    return `http://localhost:3000${url}`;
  }
  return `http://localhost:3000/${url}`;
}

export default function DetalhesDaPartida() {
  const navigate = useNavigate();
  const location = useLocation();

  const partida = location.state?.partida as PartidaRecebida | undefined;

  const inputVideoRef = useRef<HTMLInputElement | null>(null);

  const [atletasPartida, setAtletasPartida] = useState<AtletaPartida[]>([]);
  const [carregandoAtletas, setCarregandoAtletas] = useState(true);

  const [videos, setVideos] = useState<VideoPartida[]>([]);
  const [carregandoVideos, setCarregandoVideos] = useState(true);

  const [videoSelecionado, setVideoSelecionado] = useState<number | null>(null);
  const [mostrarAdicionarVideo, setMostrarAdicionarVideo] = useState(false);
  const [nomeNovoVideo, setNomeNovoVideo] = useState('');
  const [arquivoVideo, setArquivoVideo] = useState<File | null>(null);
  const [enviandoVideo, setEnviandoVideo] = useState(false);

  const [videoExcluindo, setVideoExcluindo] = useState<number | null>(null);
  const [mostrarExcluir, setMostrarExcluir] = useState(false);
  const [excluindo, setExcluindo] = useState(false);

  /* ============================================================
     CARREGAR ATLETAS DA PARTIDA
  ============================================================ */
  useEffect(() => {
    if (!partida?.id) {
      setCarregandoAtletas(false);
      return;
    }

    try {
      const chave = chaveEscalacao(partida.id);
      const dadosSalvos = localStorage.getItem(chave);

      if (!dadosSalvos) {
        setAtletasPartida([]);
        return;
      }

      const atletasSalvos = JSON.parse(dadosSalvos);
      if (Array.isArray(atletasSalvos)) {
        setAtletasPartida(atletasSalvos);
      } else {
        setAtletasPartida([]);
      }
    } catch (error) {
      console.error('Erro ao carregar escalação:', error);
      setAtletasPartida([]);
    } finally {
      setCarregandoAtletas(false);
    }
  }, [partida?.id]);

  /* ============================================================
     CARREGAR VÍDEOS DO BACKEND
  ============================================================ */
  useEffect(() => {
    async function carregarVideos() {
      if (!partida?.id) {
        setCarregandoVideos(false);
        return;
      }

      try {
        setCarregandoVideos(true);
        const token = obterToken();

        if (!token) {
          navigate('/login');
          return;
        }

        const resposta = await fetch(`${API_URL}/partidas/${partida.id}/videos`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const dados = await resposta.json().catch(() => ({}));

        if (resposta.status === 401) {
          navigate('/login');
          return;
        }

        if (!resposta.ok) {
          throw new Error(dados?.mensagem || 'Erro ao carregar os vídeos da partida.');
        }

        const lista = Array.isArray(dados)
          ? dados
          : Array.isArray(dados?.videos)
          ? dados.videos
          : [];

        const videosFormatados = lista.map((video: VideoPartida) => ({
          ...video,
          url: normalizarUrlVideo(video.url),
        }));

        setVideos(videosFormatados);
      } catch (error) {
        console.error('Erro ao carregar vídeos:', error);
        setVideos([]);
      } finally {
        setCarregandoVideos(false);
      }
    }

    carregarVideos();
  }, [partida?.id, navigate]);

  /* ============================================================
     DADOS DA PARTIDA
  ============================================================ */
  const confronto = partida?.confronto || 'Falcões FC vs Tigres FC';
  const modalidade = partida?.modalidade || 'Futebol';
  const data = partida?.data || '18/06/2026';
  const resultado = partida?.resultado || '3 - 1';
  const status = partida?.status || 'Analisada';

  const equipes = confronto.split(' vs ');
  const equipeCasa = equipes[0] || 'Falcões FC';
  const equipeVisitante = equipes[1] || 'Tigres FC';

  function voltarParaPartidas() {
    navigate('/partidas');
  }

  /* ============================================================
     MODAL E UPLOAD DE VÍDEOS
  ============================================================ */
  function abrirAdicionarVideo() {
    setNomeNovoVideo('');
    setArquivoVideo(null);
    setMostrarAdicionarVideo(true);
  }

  function fecharAdicionarVideo() {
    if (enviandoVideo) return;
    setMostrarAdicionarVideo(false);
    setNomeNovoVideo('');
    setArquivoVideo(null);
    if (inputVideoRef.current) {
      inputVideoRef.current.value = '';
    }
  }

  function selecionarArquivoVideo(event: React.ChangeEvent<HTMLInputElement>) {
    const arquivo = event.target.files?.[0];
    if (!arquivo) return;

    if (!arquivo.type.startsWith('video/')) {
      alert('Selecione um arquivo de vídeo válido.');
      event.target.value = '';
      return;
    }

    setArquivoVideo(arquivo);

    if (!nomeNovoVideo.trim()) {
      const nomeSemExtensao = arquivo.name.replace(/\.[^/.]+$/, '');
      setNomeNovoVideo(nomeSemExtensao);
    }
  }

  async function adicionarVideo() {
    if (!partida?.id) {
      alert('Não foi possível identificar a partida.');
      return;
    }
    if (!arquivoVideo) {
      alert('Selecione um vídeo antes de continuar.');
      return;
    }
    if (!nomeNovoVideo.trim()) {
      alert('Digite um nome para o vídeo.');
      return;
    }

    try {
      setEnviandoVideo(true);
      const token = obterToken();

      if (!token) {
        navigate('/login');
        return;
      }

      const formData = new FormData();
      formData.append('arquivo', arquivoVideo);
      formData.append('titulo', nomeNovoVideo.trim());

      const resposta = await fetch(`${API_URL}/partidas/${partida.id}/videos`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const dados = await resposta.json().catch(() => ({}));

      if (resposta.status === 401) {
        navigate('/login');
        return;
      }

      if (!resposta.ok) {
        throw new Error(dados?.mensagem || 'Erro ao enviar vídeo.');
      }

      const videoRecebido = dados?.video || dados;
      if (!videoRecebido?.id) {
        throw new Error('O vídeo foi enviado, mas o servidor não retornou os dados.');
      }

      const videoFormatado: VideoPartida = {
        ...videoRecebido,
        url: normalizarUrlVideo(videoRecebido.url),
      };

      setVideos((atual) => [...atual, videoFormatado]);
      fecharAdicionarVideo();
      setVideoSelecionado(videoFormatado.id);
      alert('Vídeo adicionado com sucesso!');
    } catch (error) {
      console.error('Erro ao adicionar vídeo:', error);
      alert(error instanceof Error ? error.message : 'Erro ao adicionar vídeo.');
    } finally {
      setEnviandoVideo(false);
    }
  }

  async function removerVideo(videoId: number) {
    if (!partida?.id) return;

    try {
      setVideoExcluindo(videoId);
      const token = obterToken();

      if (!token) {
        navigate('/login');
        return;
      }

      const resposta = await fetch(`${API_URL}/videos/${videoId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const dados = await resposta.json().catch(() => ({}));

      if (resposta.status === 401) {
        navigate('/login');
        return;
      }

      if (!resposta.ok) {
        throw new Error(dados?.mensagem || 'Erro ao excluir vídeo.');
      }

      setVideos((atual) => atual.filter((v) => v.id !== videoId));
      if (videoSelecionado === videoId) {
        setVideoSelecionado(null);
      }
    } catch (error) {
      console.error('Erro ao excluir vídeo:', error);
      alert(error instanceof Error ? error.message : 'Erro ao excluir vídeo.');
    } finally {
      setVideoExcluindo(null);
    }
  }

  /* ============================================================
     EXCLUIR PARTIDA
  ============================================================ */
  function abrirConfirmacaoExclusao() {
    setMostrarExcluir(true);
  }

  function fecharConfirmacaoExclusao() {
    if (!excluindo) setMostrarExcluir(false);
  }

  async function excluirPartida() {
    if (!partida?.id) return;

    try {
      setExcluindo(true);
      const token = obterToken();

      if (!token) {
        navigate('/login');
        return;
      }

      const resposta = await fetch(`${API_URL}/partidas/${partida.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const dados = await resposta.json().catch(() => ({}));

      if (!resposta.ok) {
        throw new Error(dados?.mensagem || 'Erro ao excluir partida.');
      }

      localStorage.removeItem(chaveEscalacao(partida.id));
      navigate('/partidas');
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : 'Erro ao excluir partida.');
    } finally {
      setExcluindo(false);
    }
  }

  const videoAtual =
    videoSelecionado !== null
      ? videos.find((v) => v.id === videoSelecionado)
      : null;

  return (
    <div className={styles.page}>
      {/* VOLTAR */}
      <button type="button" className={styles.backButton} onClick={voltarParaPartidas}>
        <span>‹</span> Voltar para partidas
      </button>

      {/* PLACAR */}
      <section className={styles.scoreCard}>
        <div className={styles.team}>
          <div className={styles.teamIcon}>{obterIniciais(equipeCasa)}</div>
          <strong>{equipeCasa}</strong>
        </div>

        <div className={styles.scoreCenter}>
          <div className={styles.score}>{resultado}</div>
          <div className={styles.matchInfo}>
            <span>{data}</span>
            <span className={styles.separator}>•</span>
            <span>{modalidade}</span>
          </div>
          <span
            className={`${styles.status} ${
              status === 'Pendente'
                ? styles.statusPending
                : status === 'Cancelada'
                ? styles.statusCancelled
                : styles.statusFinished
            }`}
          >
            {status}
          </span>
        </div>

        <div className={styles.team}>
          <div className={styles.teamIcon}>{obterIniciais(equipeVisitante)}</div>
          <strong>{equipeVisitante}</strong>
        </div>
      </section>

      {/* EVENTOS E VÍDEOS */}
      <div className={styles.contentGrid}>
        {/* EVENTOS */}
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h3>Eventos Registrados</h3>
          </div>
          <div className={styles.eventsList}>
            {eventos.map((evento, index) => (
              <div className={styles.eventRow} key={index}>
                <span className={styles.eventTime}>{evento.horario}</span>
                <span className={`${styles.eventDot} ${styles[evento.cor]}`} />
                <span className={styles.eventType}>{evento.tipo}</span>
                <span className={styles.eventAthlete}>{evento.atleta}</span>
              </div>
            ))}
          </div>
        </section>

        {/* VÍDEOS */}
        <section className={styles.card}>
          <div
            className={styles.cardHeader}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 16,
            }}
          >
            <div>
              <h3>Vídeos da partida</h3>
            </div>
            <button
              type="button"
              onClick={abrirAdicionarVideo}
              disabled={carregandoVideos}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 7,
                padding: '9px 13px',
                border: 'none',
                borderRadius: 9,
                background: '#16A875',
                color: '#ffffff',
                fontFamily: 'inherit',
                fontSize: 12,
                fontWeight: 700,
                cursor: carregandoVideos ? 'not-allowed' : 'pointer',
                whiteSpace: 'nowrap',
                opacity: carregandoVideos ? 0.6 : 1,
              }}
            >
              <Plus size={15} /> Adicionar vídeo
            </button>
          </div>

          <div className={styles.videosList}>
            {carregandoVideos ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '35px 20px',
                  textAlign: 'center',
                  color: '#77857e',
                  gap: 10,
                }}
              >
                <Video size={30} />
                <strong>Carregando vídeos...</strong>
              </div>
            ) : videos.length === 0 ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '35px 20px',
                  textAlign: 'center',
                  color: '#77857e',
                  gap: 10,
                }}
              >
                <Video size={32} />
                <strong>Nenhum vídeo adicionado</strong>
                <span style={{ fontSize: 12 }}>
                  Adicione um vídeo desta partida para começar.
                </span>
              </div>
            ) : (
              videos.map((video) => (
                <div className={styles.videoItem} key={video.id}>
                  <button
                    type="button"
                    className={styles.videoPreview}
                    onClick={() => setVideoSelecionado(video.id)}
                    style={{
                      position: 'relative',
                      overflow: 'hidden',
                      padding: 0,
                      border: 'none',
                      background: '#000',
                      cursor: 'pointer',
                    }}
                  >
                    <video
                      src={video.url}
                      muted
                      autoPlay
                      loop
                      playsInline
                      preload="metadata"
                      aria-label={video.titulo}
                      style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                        pointerEvents: 'none',
                      }}
                      onError={(event) => {
                        console.error('Erro ao carregar miniatura do vídeo:', video.url);
                        event.currentTarget.style.display = 'none';
                      }}
                    />
                    <span
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background:
                          'linear-gradient(rgba(0,0,0,0.03), rgba(0,0,0,0.25))',
                        pointerEvents: 'none',
                      }}
                    />
                    <span className={styles.playIcon}>▶</span>
                  </button>

                  <div className={styles.videoInfo}>
                    <div className={styles.videoTitleRow}>
                      <strong>{video.titulo}</strong>
                      <span>{formatarHorario(video)}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span className={`${styles.videoTag} ${styles[obterClasseVideo(video)]}`}>
                        <span className={styles.tagDot} />
                        {video.tipo || 'Momento'}
                      </span>
                      <button
                        type="button"
                        onClick={() => removerVideo(video.id)}
                        disabled={videoExcluindo === video.id}
                        style={{
                          border: 'none',
                          background: 'transparent',
                          color: '#b84242',
                          cursor: 'pointer',
                          padding: 4,
                          display: 'inline-flex',
                          alignItems: 'center',
                        }}
                        title="Excluir vídeo"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      {/* MODAL REPRODUZIR VÍDEO */}
      {videoAtual && (
        <div className={styles.videoModalOverlay} onClick={() => setVideoSelecionado(null)}>
          <div className={styles.videoModal} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className={styles.closeModal}
              onClick={() => setVideoSelecionado(null)}
            >
              ×
            </button>
            <div className={styles.fakeVideo}>
              <video src={videoAtual.url} controls autoPlay style={{ width: '100%', height: '100%' }} />
            </div>
            <h3>{videoAtual.titulo}</h3>
            <p>{formatarHorario(videoAtual)}</p>
          </div>
        </div>
      )}

      {/* MODAL ADICIONAR VÍDEO */}
      {mostrarAdicionarVideo && (
        <div className={styles.videoModalOverlay} onClick={fecharAdicionarVideo}>
          <div
            className={styles.videoModal}
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: 480 }}
          >
            <button type="button" className={styles.closeModal} onClick={fecharAdicionarVideo}>
              ×
            </button>
            <h3>Adicionar Vídeo</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 15, marginTop: 15 }}>
              <div>
                <label style={{ fontSize: 13, display: 'block', marginBottom: 5 }}>
                  Título do vídeo:
                </label>
                <input
                  type="text"
                  value={nomeNovoVideo}
                  onChange={(e) => setNomeNovoVideo(e.target.value)}
                  placeholder="Ex: Gol do Rafael Souza"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 6,
                    border: '1px solid #ccc',
                  }}
                />
              </div>
              <div>
                <label style={{ fontSize: 13, display: 'block', marginBottom: 5 }}>
                  Arquivo de vídeo:
                </label>
                <input
                  ref={inputVideoRef}
                  type="file"
                  accept="video/*"
                  onChange={selecionarArquivoVideo}
                  style={{ width: '100%' }}
                />
              </div>
              <button
                type="button"
                onClick={adicionarVideo}
                disabled={enviandoVideo}
                style={{
                  padding: '10px 15px',
                  background: '#16A875',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  fontWeight: 'bold',
                  cursor: enviandoVideo ? 'not-allowed' : 'pointer',
                  opacity: enviandoVideo ? 0.7 : 1,
                }}
              >
                {enviandoVideo ? 'Enviando...' : 'Salvar Vídeo'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ZONA DE PERIGO (EXCLUIR PARTIDA) */}
      {partida?.id && (
        <div className={styles.dangerZone} style={{ marginTop: 25 }}>
          <div className={styles.dangerText}>
            <strong>Excluir Partida</strong>
            <p>Esta ação removerá permanentemente todos os dados e vídeos associados.</p>
          </div>
          <button
            type="button"
            className={styles.deleteButton}
            onClick={abrirConfirmacaoExclusao}
          >
            <Trash2 size={16} /> Excluir Partida
          </button>
        </div>
      )}

      {/* MODAL CONFIRMAÇÃO DE EXCLUSÃO */}
      {mostrarExcluir && (
        <div className={styles.deleteOverlay} onClick={fecharConfirmacaoExclusao}>
          <div className={styles.deleteModal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.deleteModalHeader}>
              <div className={styles.deleteIcon}>
                <TriangleAlert size={20} />
              </div>
              <button
                type="button"
                className={styles.deleteClose}
                onClick={fecharConfirmacaoExclusao}
                disabled={excluindo}
              >
                <X size={18} />
              </button>
            </div>
            <div className={styles.deleteModalContent}>
              <h3>Tem certeza?</h3>
              <p>
                Você deseja mesmo excluir a partida <strong>{confronto}</strong>? Esta ação não
                poderá ser desfeita.
              </p>
            </div>
            <div className={styles.deleteActions}>
              <button
                type="button"
                className={styles.deleteCancel}
                onClick={fecharConfirmacaoExclusao}
                disabled={excluindo}
              >
                Cancelar
              </button>
              <button
                type="button"
                className={styles.deleteConfirm}
                onClick={excluirPartida}
                disabled={excluindo}
              >
                {excluindo ? 'Excluindo...' : 'Sim, excluir'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}