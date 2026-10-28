
import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import { useNavigate } from 'react-router-dom';

import styles from './partidas.module.css';

type TipoStatus = 'analisada' | 'analise' | 'pendente';

type StatusBackend =
  | 'AGENDADA'
  | 'EM_ANDAMENTO'
  | 'FINALIZADA'
  | 'CANCELADA';

type Equipe = {
  id: number;
  nome: string;
  modalidade: string;
  categoria?: string | null;
  imagem?: string | null;
  corEquipe?: string | null;
};

type Atleta = {
  id: number;
  nome?: string | null;
  equipeId?: number | null;
  equipe?: { id?: number } | null;
  usuario?: { nome?: string | null } | null;
};

type PartidaAPI = {
  id: number;
  equipeId: number;
  adversario: string;
  data: string;
  local?: string | null;
  campeonato?: string | null;
  rodada?: string | null;
  observacoes?: string | null;
  status: StatusBackend;
  golsEquipe?: number | null;
  golsAdversario?: number | null;
  createdAt?: string;
  updatedAt?: string;
  equipe: Equipe;
};

type Partida = {
  id: number;
  equipeId: number;
  confronto: string;
  modalidade: string;
  data: string;
  dataOriginal: string;
  resultado: string;
  status: string;
  tipo: TipoStatus;
  temporada: string;
  adversario: string;
  golsEquipe: number | null;
  golsAdversario: number | null;
  equipe: Equipe;
};

type NovaPartida = {
  equipeId: string;
  equipeVisitante: string;
  data: string;
  resultadoCasa: string;
  resultadoVisitante: string;
};

const API_URL = 'http://localhost:3000/api';

/* ============================================================
   DATAS
============================================================ */

function formatarData(data: string) {
  if (!data) return '';

  const somenteData = data.includes('T')
    ? data.split('T')[0]
    : data;

  const partes = somenteData.split('-');

  if (partes.length !== 3) return data;

  return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

function pegarTemporada(data: string) {
  if (!data) {
    return String(new Date().getFullYear());
  }

  const somenteData = data.includes('T')
    ? data.split('T')[0]
    : data;

  return (
    somenteData.split('-')[0] ||
    String(new Date().getFullYear())
  );
}

/* ============================================================
   STATUS
============================================================ */

function traduzirStatus(status?: StatusBackend): {
  texto: string;
  tipo: TipoStatus;
} {
  switch (status) {
    case 'FINALIZADA':
      return {
        texto: 'Finalizada',
        tipo: 'analisada',
      };

    case 'EM_ANDAMENTO':
      return {
        texto: 'Em análise',
        tipo: 'analise',
      };

    case 'CANCELADA':
      return {
        texto: 'Cancelada',
        tipo: 'pendente',
      };

    case 'AGENDADA':
    default:
      return {
        texto: 'Pendente',
        tipo: 'pendente',
      };
  }
}

/* ============================================================
   CONVERTER PARTIDA DA API PARA A TELA
============================================================ */

function converterPartida(partida: PartidaAPI): Partida {
  const status = traduzirStatus(partida.status);

  const golsEquipe = partida.golsEquipe ?? null;
  const golsAdversario = partida.golsAdversario ?? null;

  const resultado =
    golsEquipe !== null && golsAdversario !== null
      ? `${golsEquipe} - ${golsAdversario}`
      : '—';

  return {
    id: partida.id,
    equipeId: partida.equipeId,

    confronto: `${
      partida.equipe?.nome || 'Equipe'
    } vs ${partida.adversario}`,

    modalidade: partida.equipe?.modalidade || '',

    data: formatarData(partida.data),
    dataOriginal: partida.data,

    resultado,
    status: status.texto,
    tipo: status.tipo,

    temporada: pegarTemporada(partida.data),
    adversario: partida.adversario,

    golsEquipe,
    golsAdversario,

    equipe: partida.equipe,
  };
}

/* ============================================================
   MENSAGENS DE ERRO
============================================================ */

function pegarMensagemErro(
  dados: unknown,
  mensagemPadrao: string,
): string {
  if (typeof dados === 'object' && dados !== null) {
    const objeto = dados as Record<string, unknown>;

    if (typeof objeto.erro === 'string') {
      return objeto.erro;
    }

    if (typeof objeto.mensagem === 'string') {
      return objeto.mensagem;
    }
  }

  return mensagemPadrao;
}

/* ============================================================
   EXTRAIR EQUIPES
============================================================ */

function extrairEquipes(dados: unknown): Equipe[] {
  if (Array.isArray(dados)) {
    return dados as Equipe[];
  }

  if (typeof dados === 'object' && dados !== null) {
    const objeto = dados as Record<string, unknown>;

    if (Array.isArray(objeto.equipes)) {
      return objeto.equipes as Equipe[];
    }

    if (Array.isArray(objeto.data)) {
      return objeto.data as Equipe[];
    }
  }

  return [];
}

/* ============================================================
   EXTRAIR ATLETAS
============================================================ */

function extrairAtletas(dados: unknown): Atleta[] {
  if (Array.isArray(dados)) {
    return dados as Atleta[];
  }

  if (typeof dados === 'object' && dados !== null) {
    const objeto = dados as Record<string, unknown>;

    if (Array.isArray(objeto.atletas)) {
      return objeto.atletas as Atleta[];
    }

    if (Array.isArray(objeto.data)) {
      return objeto.data as Atleta[];
    }

    if (Array.isArray(objeto.resultado)) {
      return objeto.resultado as Atleta[];
    }
  }

  return [];
}

function nomeDoAtleta(atleta: Atleta) {
  return (
    atleta.nome ||
    atleta.usuario?.nome ||
    `Atleta #${atleta.id}`
  );
}

function equipeDoAtleta(atleta: Atleta) {
  return atleta.equipeId ?? atleta.equipe?.id ?? null;
}

/* ============================================================
   EXTRAIR PARTIDAS
============================================================ */

function extrairPartidas(dados: unknown): PartidaAPI[] {
  if (Array.isArray(dados)) {
    return dados as PartidaAPI[];
  }

  if (typeof dados === 'object' && dados !== null) {
    const objeto = dados as Record<string, unknown>;

    if (Array.isArray(objeto.partidas)) {
      return objeto.partidas as PartidaAPI[];
    }

    if (Array.isArray(objeto.data)) {
      return objeto.data as PartidaAPI[];
    }

    if (
      objeto.partida &&
      typeof objeto.partida === 'object'
    ) {
      return [objeto.partida as PartidaAPI];
    }
  }

  return [];
}

/* ============================================================
   COMPONENTE
============================================================ */

export default function Partidas() {
  const navigate = useNavigate();

  const [partidas, setPartidas] = useState<Partida[]>([]);
  const [equipes, setEquipes] = useState<Equipe[]>([]);

  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');

  const [equipeFiltro, setEquipeFiltro] = useState('todas');
  const [modalidadeFiltro, setModalidadeFiltro] =
    useState('modalidades');
  const [dataFiltro, setDataFiltro] = useState('');

  const [abaStatus, setAbaStatus] = useState<
    'todas' | 'proximas' | 'finalizadas' | 'analise'
  >('todas');

  const [mostrarModal, setMostrarModal] = useState(false);

  const [novaPartida, setNovaPartida] = useState<NovaPartida>({
    equipeId: '',
    equipeVisitante: '',
    data: '',
    resultadoCasa: '',
    resultadoVisitante: '',
  });

  const [atletasEquipe, setAtletasEquipe] = useState<Atleta[]>([]);
  const [atletasSelecionados, setAtletasSelecionados] =
    useState<number[]>([]);
  const [carregandoAtletas, setCarregandoAtletas] =
    useState(false);
  const [erroAtletas, setErroAtletas] = useState('');

  /* ============================================================
     TOKEN
  ============================================================ */

  function obterToken() {
    return (
      localStorage.getItem('token') ||
      localStorage.getItem('accessToken') ||
      sessionStorage.getItem('token')
    );
  }

  /* ============================================================
     CARREGAR EQUIPES E PARTIDAS
  ============================================================ */

  useEffect(() => {
    let cancelado = false;

    async function carregarDados() {
      try {
        setCarregando(true);
        setErro('');

        const token = obterToken();

        if (!token) {
          navigate('/login');
          return;
        }

        const [respostaEquipes, respostaPartidas] =
          await Promise.all([
            fetch(`${API_URL}/equipes`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }),

            fetch(`${API_URL}/partidas`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }),
          ]);

        if (
          respostaEquipes.status === 401 ||
          respostaPartidas.status === 401
        ) {
          localStorage.removeItem('token');
          localStorage.removeItem('accessToken');
          sessionStorage.removeItem('token');

          navigate('/login');
          return;
        }

        const dadosEquipes: unknown =
          await respostaEquipes.json().catch(() => []);

        const dadosPartidas: unknown =
          await respostaPartidas.json().catch(() => []);

        if (!respostaEquipes.ok) {
          throw new Error(
            pegarMensagemErro(
              dadosEquipes,
              'Erro ao carregar equipes.',
            ),
          );
        }

        if (!respostaPartidas.ok) {
          throw new Error(
            pegarMensagemErro(
              dadosPartidas,
              'Erro ao carregar partidas.',
            ),
          );
        }

        const listaEquipes = extrairEquipes(dadosEquipes);
        const listaPartidas = extrairPartidas(dadosPartidas);

        console.log('EQUIPES DO BACKEND:', listaEquipes);
        console.log('PARTIDAS DO BACKEND:', listaPartidas);

        if (!cancelado) {
          setEquipes(listaEquipes);
          setPartidas(listaPartidas.map(converterPartida));

          if (listaEquipes.length > 0) {
            setNovaPartida((anterior) => ({
              ...anterior,
              equipeId:
                anterior.equipeId ||
                String(listaEquipes[0].id),
            }));
          }
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);

        if (!cancelado) {
          setErro(
            error instanceof Error
              ? error.message
              : 'Não foi possível carregar os dados.',
          );
        }
      } finally {
        if (!cancelado) {
          setCarregando(false);
        }
      }
    }

    void carregarDados();

    return () => {
      cancelado = true;
    };
  }, [navigate]);

  /* ============================================================
     CARREGAR ATLETAS DA EQUIPE
  ============================================================ */

  useEffect(() => {
    if (!mostrarModal || !novaPartida.equipeId) {
      setAtletasEquipe([]);
      setAtletasSelecionados([]);
      setErroAtletas('');
      return;
    }

    let cancelado = false;

    async function carregarAtletasDaEquipe() {
      try {
        setCarregandoAtletas(true);
        setErroAtletas('');

        const token = obterToken();

        if (!token) {
          navigate('/login');
          return;
        }

        const resposta = await fetch(`${API_URL}/atletas`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const dados: unknown =
          await resposta.json().catch(() => []);

        if (resposta.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('accessToken');
          sessionStorage.removeItem('token');
          navigate('/login');
          return;
        }

        if (!resposta.ok) {
          throw new Error(
            pegarMensagemErro(
              dados,
              'Não foi possível carregar os atletas.',
            ),
          );
        }

        const todos = extrairAtletas(dados);

        const daEquipe = todos.filter(
          (atleta) =>
            equipeDoAtleta(atleta) ===
            Number(novaPartida.equipeId),
        );

        if (!cancelado) {
          setAtletasEquipe(daEquipe);
          setAtletasSelecionados([]);

          if (daEquipe.length === 0) {
            setErroAtletas(
              'Não encontramos atletas vinculados a esta equipe.',
            );
          }
        }
      } catch (error) {
        if (!cancelado) {
          setAtletasEquipe([]);
          setErroAtletas(
            error instanceof Error
              ? error.message
              : 'Erro ao carregar atletas.',
          );
        }
      } finally {
        if (!cancelado) {
          setCarregandoAtletas(false);
        }
      }
    }

    void carregarAtletasDaEquipe();

    return () => {
      cancelado = true;
    };
  }, [mostrarModal, novaPartida.equipeId, navigate]);

  /* ============================================================
     SELECIONAR ATLETAS
  ============================================================ */

  function alternarAtleta(atletaId: number) {
    setAtletasSelecionados((anteriores) =>
      anteriores.includes(atletaId)
        ? anteriores.filter((id) => id !== atletaId)
        : [...anteriores, atletaId],
    );
  }

  /* ============================================================
     EQUIPE E MODALIDADES
  ============================================================ */

  const equipeSelecionada = useMemo(
    () =>
      equipes.find(
        (equipe) =>
          equipe.id === Number(novaPartida.equipeId),
      ),
    [equipes, novaPartida.equipeId],
  );

  const modalidades = useMemo(
    () =>
      Array.from(
        new Set(
          equipes
            .map((equipe) => equipe.modalidade)
            .filter(Boolean),
        ),
      ).sort(),
    [equipes],
  );

  /* ============================================================
     FILTROS
  ============================================================ */

  const partidasFiltradas = useMemo(
    () =>
      partidas.filter((partida) => {
        const equipeOk =
          equipeFiltro === 'todas' ||
          String(partida.equipeId) === equipeFiltro;

        const modalidadeOk =
          modalidadeFiltro === 'modalidades' ||
          partida.modalidade === modalidadeFiltro;

        const dataOk =
          dataFiltro === '' ||
          partida.dataOriginal.slice(0, 10) === dataFiltro;

        const statusOk =
          abaStatus === 'todas' ||
          (abaStatus === 'proximas' &&
            partida.status === 'Pendente') ||
          (abaStatus === 'finalizadas' &&
            partida.status === 'Finalizada') ||
          (abaStatus === 'analise' &&
            partida.status === 'Em análise');

        return (
          equipeOk &&
          modalidadeOk &&
          dataOk &&
          statusOk
        );
      }),
    [
      partidas,
      equipeFiltro,
      modalidadeFiltro,
      dataFiltro,
      abaStatus,
    ],
  );

  const contadores = useMemo(
    () => ({
      todas: partidas.length,
      proximas: partidas.filter(
        (partida) => partida.status === 'Pendente',
      ).length,
      finalizadas: partidas.filter(
        (partida) => partida.status === 'Finalizada',
      ).length,
      analise: partidas.filter(
        (partida) => partida.status === 'Em análise',
      ).length,
    }),
    [partidas],
  );

  /* ============================================================
     FORMULÁRIO
  ============================================================ */

  function atualizarNovaPartida(
    campo: keyof NovaPartida,
    valor: string,
  ) {
    setNovaPartida((anterior) => ({
      ...anterior,
      [campo]: valor,
    }));
  }

  function abrirModal() {
    if (equipes.length === 0) {
      alert(
        'Nenhuma equipe foi encontrada para este treinador.',
      );
      return;
    }

    setNovaPartida((anterior) => ({
      ...anterior,
      equipeId:
        anterior.equipeId || String(equipes[0].id),
    }));

    setMostrarModal(true);
  }

  function fecharModal() {
    if (salvando) return;
    setMostrarModal(false);
  }

  /* ============================================================
     CRIAR PARTIDA
  ============================================================ */

  async function criarPartida() {
    if (salvando) return;

    if (
      !novaPartida.equipeId ||
      !novaPartida.equipeVisitante.trim() ||
      !novaPartida.data
    ) {
      alert(
        'Selecione sua equipe, informe o adversário e a data.',
      );
      return;
    }

    const golsEquipe =
      novaPartida.resultadoCasa.trim() === ''
        ? null
        : Number(novaPartida.resultadoCasa);

    const golsAdversario =
      novaPartida.resultadoVisitante.trim() === ''
        ? null
        : Number(novaPartida.resultadoVisitante);

    if (
      (golsEquipe === null) !==
      (golsAdversario === null)
    ) {
      alert(
        'Preencha os dois placares ou deixe ambos vazios.',
      );
      return;
    }

    if (
      (golsEquipe !== null &&
        (!Number.isInteger(golsEquipe) || golsEquipe < 0)) ||
      (golsAdversario !== null &&
        (!Number.isInteger(golsAdversario) ||
          golsAdversario < 0))
    ) {
      alert(
        'Os placares devem ser números inteiros iguais ou maiores que zero.',
      );
      return;
    }

    const statusNovaPartida: StatusBackend =
      golsEquipe !== null && golsAdversario !== null
        ? 'FINALIZADA'
        : 'AGENDADA';

    try {
      setSalvando(true);

      const token = obterToken();

      if (!token) {
        navigate('/login');
        return;
      }

      const resposta = await fetch(`${API_URL}/partidas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          equipeId: Number(novaPartida.equipeId),
          adversario: novaPartida.equipeVisitante.trim(),
          data: `${novaPartida.data}T12:00:00.000Z`,
          golsEquipe,
          golsAdversario,
          status: statusNovaPartida,
        }),
      });

      const dados: unknown =
        await resposta.json().catch(() => ({}));

      if (resposta.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('accessToken');
        sessionStorage.removeItem('token');
        navigate('/login');
        return;
      }

      if (!resposta.ok) {
        throw new Error(
          pegarMensagemErro(
            dados,
            'Não foi possível criar a partida.',
          ),
        );
      }

      const objeto = dados as Record<string, unknown>;

      const partidaCriada =
        objeto.partida &&
        typeof objeto.partida === 'object'
          ? (objeto.partida as PartidaAPI)
          : ('id' in objeto
              ? (dados as PartidaAPI)
              : null);

      if (!partidaCriada || !partidaCriada.id) {
        throw new Error(
          'O servidor não retornou os dados da partida criada.',
        );
      }

      if (atletasSelecionados.length > 0) {
        const respostaEscalacao = await fetch(
          `${API_URL}/partidas/${partidaCriada.id}/atletas`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              atletasIds: atletasSelecionados,
            }),
          },
        );

        const dadosEscalacao: unknown =
          await respostaEscalacao.json().catch(() => ({}));

        if (!respostaEscalacao.ok) {
          console.error(
            'Falha ao salvar escalação:',
            dadosEscalacao,
          );

          alert(
            'A partida foi criada, mas não foi possível salvar a escalação dos atletas.',
          );
        }
      }

      setPartidas((anteriores) => [
        converterPartida(partidaCriada),
        ...anteriores,
      ]);

      setNovaPartida({
        equipeId:
          equipes.length > 0
            ? String(equipes[0].id)
            : '',
        equipeVisitante: '',
        data: '',
        resultadoCasa: '',
        resultadoVisitante: '',
      });

      setAtletasSelecionados([]);
      setAtletasEquipe([]);
      setMostrarModal(false);
    } catch (error) {
      console.error('Erro ao criar partida:', error);

      alert(
        error instanceof Error
          ? error.message
          : 'Não foi possível criar a partida.',
      );
    } finally {
      setSalvando(false);
    }
  }

  /* ============================================================
     ADICIONAR OU EDITAR RESULTADO
  ============================================================ */

  async function editarResultado(partida: Partida) {
    const golsCasaTexto = window.prompt(
      `Placar da sua equipe — ${partida.confronto}`,
      partida.golsEquipe === null
        ? ''
        : String(partida.golsEquipe),
    );

    if (golsCasaTexto === null) return;

    const golsAdversarioTexto = window.prompt(
      'Placar da equipe adversária:',
      partida.golsAdversario === null
        ? ''
        : String(partida.golsAdversario),
    );

    if (golsAdversarioTexto === null) return;

    if (
      golsCasaTexto.trim() === '' ||
      golsAdversarioTexto.trim() === ''
    ) {
      alert('Preencha os dois placares.');
      return;
    }

    const golsEquipe = Number(golsCasaTexto);
    const golsAdversario = Number(golsAdversarioTexto);

    if (
      !Number.isInteger(golsEquipe) ||
      golsEquipe < 0 ||
      !Number.isInteger(golsAdversario) ||
      golsAdversario < 0
    ) {
      alert(
        'Os placares devem ser números inteiros iguais ou maiores que zero.',
      );
      return;
    }

    try {
      const token = obterToken();

      if (!token) {
        navigate('/login');
        return;
      }

      const resposta = await fetch(
        `${API_URL}/partidas/${partida.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            golsEquipe,
            golsAdversario,
            status: 'FINALIZADA',
          }),
        },
      );

      const dados: unknown =
        await resposta.json().catch(() => ({}));

      if (resposta.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('accessToken');
        sessionStorage.removeItem('token');
        navigate('/login');
        return;
      }

      if (!resposta.ok) {
        throw new Error(
          pegarMensagemErro(
            dados,
            'Não foi possível atualizar o resultado.',
          ),
        );
      }

      const objeto = dados as Record<string, unknown>;

      const partidaAtualizada =
        objeto.partida &&
        typeof objeto.partida === 'object'
          ? (objeto.partida as PartidaAPI)
          : (dados as PartidaAPI);

      if (!partidaAtualizada?.id) {
        throw new Error(
          'O servidor não retornou a partida atualizada.',
        );
      }

      setPartidas((anteriores) =>
        anteriores.map((item) =>
          item.id === partida.id
            ? converterPartida(partidaAtualizada)
            : item,
        ),
      );
    } catch (error) {
      console.error('Erro ao atualizar resultado:', error);

      alert(
        error instanceof Error
          ? error.message
          : 'Erro ao atualizar o resultado.',
      );
    }
  }

  /* ============================================================
     DETALHES
  ============================================================ */

  function abrirDetalhes(partida: Partida) {
    navigate('/detalhes-partida', {
      state: {
        partida,
      },
    });
  }

  /* ============================================================
     TELA
  ============================================================ */

  return (
    <div className={styles.page}>
      <div className={styles.pageInner}>
        <div className={styles.titleRow}>
          <div>
            <h2>
              Suas <em>partidas.</em>
            </h2>

            <p>
              Organize jogos, resultados e análises.
            </p>
          </div>

          <button
            type="button"
            className={styles.newButton}
            onClick={abrirModal}
          >
            <span aria-hidden="true">+</span>
            Nova partida
          </button>
        </div>

        <div
          className={styles.statusTabs}
          role="tablist"
          aria-label="Filtrar partidas por status"
        >
          <button
            type="button"
            className={
              abaStatus === 'todas'
                ? styles.statusTabActive
                : styles.statusTab
            }
            onClick={() => setAbaStatus('todas')}
          >
            Todas
            <small>{contadores.todas}</small>
          </button>

          <button
            type="button"
            className={
              abaStatus === 'proximas'
                ? styles.statusTabActive
                : styles.statusTab
            }
            onClick={() => setAbaStatus('proximas')}
          >
            Pendentes
            <small>{contadores.proximas}</small>
          </button>

          <button
            type="button"
            className={
              abaStatus === 'finalizadas'
                ? styles.statusTabActive
                : styles.statusTab
            }
            onClick={() => setAbaStatus('finalizadas')}
          >
            Finalizadas
            <small>{contadores.finalizadas}</small>
          </button>

          <button
            type="button"
            className={
              abaStatus === 'analise'
                ? styles.statusTabActive
                : styles.statusTab
            }
            onClick={() => setAbaStatus('analise')}
          >
            Em análise
            <small>{contadores.analise}</small>
          </button>
        </div>

        <div className={styles.filters}>
          <select
            value={equipeFiltro}
            onChange={(event) =>
              setEquipeFiltro(event.target.value)
            }
          >
            <option value="todas">Todas as equipes</option>

            {equipes.map((equipe) => (
              <option
                key={equipe.id}
                value={String(equipe.id)}
              >
                {equipe.nome}
              </option>
            ))}
          </select>

          <select
            value={modalidadeFiltro}
            onChange={(event) =>
              setModalidadeFiltro(event.target.value)
            }
          >
            <option value="modalidades">
              Todas as modalidades
            </option>

            {modalidades.map((modalidade) => (
              <option key={modalidade} value={modalidade}>
                {modalidade}
              </option>
            ))}
          </select>

          <div className={styles.dateInput}>
            <input
              type="date"
              value={dataFiltro}
              onChange={(event) =>
                setDataFiltro(event.target.value)
              }
            />

            {dataFiltro && (
              <button
                type="button"
                className={styles.clearDate}
                onClick={() => setDataFiltro('')}
                aria-label="Limpar data"
              >
                ×
              </button>
            )}
          </div>
        </div>

        <div className={styles.tableContainer}>
          <table>
            <thead>
              <tr>
                <th>Confronto</th>
                <th>Modalidade</th>
                <th>Data</th>
                <th>Resultado</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {partidasFiltradas.map((partida) => (
                <tr
                  key={partida.id}
                  className={styles.tableRow}
                  onClick={() => abrirDetalhes(partida)}
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (
                      event.key === 'Enter' ||
                      event.key === ' '
                    ) {
                      event.preventDefault();
                      abrirDetalhes(partida);
                    }
                  }}
                >
                  <td className={styles.confronto}>
                    {partida.confronto}
                  </td>

                  <td>{partida.modalidade || '—'}</td>

                  <td>{partida.data}</td>

                  <td className={styles.resultado}>
                    {partida.resultado}
                  </td>

                  <td>
                    <span
                      className={`${styles.status} ${
                        styles[partida.tipo]
                      }`}
                    >
                      <i aria-hidden="true" />
                      {partida.status}
                    </span>

                    <button
                      type="button"
                      className={styles.adicionarResultado}
                      onClick={(event) => {
                        event.stopPropagation();
                        void editarResultado(partida);
                      }}
                      aria-label={`${
                        partida.golsEquipe === null ||
                        partida.golsAdversario === null
                          ? 'Adicionar'
                          : 'Editar'
                      } resultado de ${partida.confronto}`}
                    >
                      {partida.golsEquipe === null ||
                      partida.golsAdversario === null
                        ? 'Adicionar resultado'
                        : 'Editar resultado'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {carregando && (
            <div className={styles.empty}>
              <h3>Carregando partidas...</h3>
            </div>
          )}

          {!carregando && erro && (
            <div className={styles.empty}>
              <h3>Erro ao carregar</h3>
              <p>{erro}</p>
            </div>
          )}

          {!carregando &&
            !erro &&
            partidasFiltradas.length === 0 && (
              <div className={styles.empty}>
                <h3>Nenhuma partida encontrada</h3>
                <p>
                  Tente alterar os filtros ou cadastre
                  uma nova partida.
                </p>
              </div>
            )}
        </div>
      </div>

      {/* ========================================================
          MODAL DE NOVA PARTIDA
      ======================================================== */}

      {mostrarModal && (
        <div
          className={styles.modalOverlay}
          onClick={fecharModal}
        >
          <div
            className={styles.modal}
            onClick={(event) => event.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h3>Nova Partida</h3>

              <button
                type="button"
                className={styles.closeButton}
                onClick={fecharModal}
                disabled={salvando}
              >
                ×
              </button>
            </div>

            <div className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="equipePartida">
                  Sua equipe
                </label>

                <select
                  id="equipePartida"
                  value={novaPartida.equipeId}
                  onChange={(event) =>
                    atualizarNovaPartida(
                      'equipeId',
                      event.target.value,
                    )
                  }
                >
                  <option value="">Selecione</option>

                  {equipes.map((equipe) => (
                    <option
                      key={equipe.id}
                      value={String(equipe.id)}
                    >
                      {equipe.nome}
                    </option>
                  ))}
                </select>
              </div>

              <section
                className={styles.athletePicker}
                aria-labelledby="athletes-heading"
              >
                <div className={styles.athletePickerHeader}>
                  <div>
                    <h4 id="athletes-heading">
                      Atletas que vão jogar
                    </h4>
                    <p>
                      Selecione os participantes desta partida.
                    </p>
                  </div>

                  <span className={styles.athleteCount}>
                    {atletasSelecionados.length} selecionado(s)
                  </span>
                </div>

                {carregandoAtletas ? (
                  <p className={styles.athleteMessage}>
                    Carregando atletas...
                  </p>
                ) : erroAtletas ? (
                  <p className={styles.athleteError}>
                    {erroAtletas}
                  </p>
                ) : atletasEquipe.length > 0 ? (
                  <div className={styles.athleteList}>
                    {atletasEquipe.map((atleta) => (
                      <label
                        className={styles.athleteOption}
                        key={atleta.id}
                      >
                        <input
                          type="checkbox"
                          checked={atletasSelecionados.includes(
                            atleta.id,
                          )}
                          onChange={() =>
                            alternarAtleta(atleta.id)
                          }
                        />

                        <span
                          className={styles.athleteAvatar}
                          aria-hidden="true"
                        >
                          {nomeDoAtleta(atleta)
                            .trim()
                            .charAt(0)
                            .toUpperCase()}
                        </span>

                        <span className={styles.athleteName}>
                          {nomeDoAtleta(atleta)}
                        </span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <p className={styles.athleteMessage}>
                    Selecione uma equipe para carregar os atletas.
                  </p>
                )}
              </section>

              <div className={styles.formGroup}>
                <label htmlFor="adversarioPartida">
                  Equipe adversária
                </label>

                <input
                  id="adversarioPartida"
                  type="text"
                  placeholder="Ex.: Tigres FC"
                  value={novaPartida.equipeVisitante}
                  onChange={(event) =>
                    atualizarNovaPartida(
                      'equipeVisitante',
                      event.target.value,
                    )
                  }
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="modalidadePartida">
                    Modalidade
                  </label>

                  <input
                    id="modalidadePartida"
                    type="text"
                    readOnly
                    value={equipeSelecionada?.modalidade || ''}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="dataPartida">
                    Data
                  </label>

                  <input
                    id="dataPartida"
                    type="date"
                    value={novaPartida.data}
                    onChange={(event) =>
                      atualizarNovaPartida(
                        'data',
                        event.target.value,
                      )
                    }
                  />
                </div>
              </div>

              <p>
                O resultado é opcional. Se ainda não aconteceu,
                deixe os dois campos vazios. Se preencher ambos,
                a partida será salva como finalizada.
              </p>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="golsEquipe">
                    Placar da sua equipe
                  </label>

                  <input
                    id="golsEquipe"
                    type="number"
                    min="0"
                    step="1"
                    placeholder="Ex.: 3"
                    value={novaPartida.resultadoCasa}
                    onChange={(event) =>
                      atualizarNovaPartida(
                        'resultadoCasa',
                        event.target.value,
                      )
                    }
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="golsAdversario">
                    Placar adversário
                  </label>

                  <input
                    id="golsAdversario"
                    type="number"
                    min="0"
                    step="1"
                    placeholder="Ex.: 1"
                    value={novaPartida.resultadoVisitante}
                    onChange={(event) =>
                      atualizarNovaPartida(
                        'resultadoVisitante',
                        event.target.value,
                      )
                    }
                  />
                </div>
              </div>
            </div>

            <div className={styles.modalActions}>
              <button
                type="button"
                className={styles.cancelButton}
                onClick={fecharModal}
                disabled={salvando}
              >
                Cancelar
              </button>

              <button
                type="button"
                className={styles.saveButton}
                onClick={() => void criarPartida()}
                disabled={salvando}
              >
                {salvando ? 'Salvando...' : 'Criar partida'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
