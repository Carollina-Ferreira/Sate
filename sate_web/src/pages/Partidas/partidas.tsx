import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import { useNavigate } from 'react-router-dom';

import styles from './partidas.module.css';


type TipoStatus =
  | 'analisada'
  | 'analise'
  | 'pendente';


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


const API_URL =
  'http://localhost:3000/api';


function formatarData(data: string) {
  if (!data) {
    return '';
  }

  const somenteData =
    data.includes('T')
      ? data.split('T')[0]
      : data;

  const partes =
    somenteData.split('-');

  if (partes.length !== 3) {
    return data;
  }

  return `${partes[2]}/${partes[1]}/${partes[0]}`;
}


function pegarTemporada(data: string) {
  if (!data) {
    return String(
      new Date().getFullYear(),
    );
  }

  const somenteData =
    data.includes('T')
      ? data.split('T')[0]
      : data;

  return (
    somenteData.split('-')[0] ||
    String(new Date().getFullYear())
  );
}


function traduzirStatus(
  status: StatusBackend,
): {
  texto: string;
  tipo: TipoStatus;
} {
  switch (status) {
    case 'FINALIZADA':
      return {
        texto: 'Analisada',
        tipo: 'analisada',
      };

    case 'EM_ANDAMENTO':
      return {
        texto: 'Em Análise',
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


function converterPartida(
  partida: PartidaAPI,
): Partida {
  const status =
    traduzirStatus(
      partida.status,
    );

  const golsEquipe =
    partida.golsEquipe ??
    null;

  const golsAdversario =
    partida.golsAdversario ??
    null;

  const resultado =
    golsEquipe !== null &&
    golsAdversario !== null
      ? `${golsEquipe} - ${golsAdversario}`
      : '-';

  return {
    id: partida.id,

    equipeId:
      partida.equipeId,

    confronto:
      `${partida.equipe?.nome || 'Equipe'} vs ${partida.adversario}`,

    modalidade:
      partida.equipe?.modalidade ||
      '',

    data:
      formatarData(
        partida.data,
      ),

    dataOriginal:
      partida.data,

    resultado,

    status:
      status.texto,

    tipo:
      status.tipo,

    temporada:
      pegarTemporada(
        partida.data,
      ),

    adversario:
      partida.adversario,

    golsEquipe,

    golsAdversario,

    equipe:
      partida.equipe,
  };
}


/* ============================================================
   PEGAR MENSAGEM DE ERRO DA API
============================================================ */

function pegarMensagemErro(
  dados: unknown,
  mensagemPadrao: string,
) {
  if (
    typeof dados === 'object' &&
    dados !== null
  ) {
    const objeto =
      dados as Record<
        string,
        unknown
      >;

    if (
      typeof objeto.erro ===
      'string'
    ) {
      return objeto.erro;
    }

    if (
      typeof objeto.mensagem ===
      'string'
    ) {
      return objeto.mensagem;
    }
  }

  return mensagemPadrao;
}


/* ============================================================
   EXTRAIR EQUIPES DA RESPOSTA
============================================================ */

function extrairEquipes(
  dados: unknown,
): Equipe[] {
  if (
    Array.isArray(dados)
  ) {
    return dados as Equipe[];
  }


  if (
    typeof dados ===
      'object' &&
    dados !== null
  ) {
    const objeto =
      dados as Record<
        string,
        unknown
      >;


    if (
      Array.isArray(
        objeto.equipes,
      )
    ) {
      return objeto.equipes as Equipe[];
    }


    if (
      Array.isArray(
        objeto.data,
      )
    ) {
      return objeto.data as Equipe[];
    }
  }


  return [];
}


/* ============================================================
   EXTRAIR PARTIDAS DA RESPOSTA
============================================================ */

function extrairPartidas(
  dados: unknown,
): PartidaAPI[] {
  if (
    Array.isArray(dados)
  ) {
    return dados as PartidaAPI[];
  }


  if (
    typeof dados ===
      'object' &&
    dados !== null
  ) {
    const objeto =
      dados as Record<
        string,
        unknown
      >;


    if (
      Array.isArray(
        objeto.partidas,
      )
    ) {
      return objeto.partidas as PartidaAPI[];
    }


    if (
      Array.isArray(
        objeto.data,
      )
    ) {
      return objeto.data as PartidaAPI[];
    }
  }


  return [];
}


export default function Partidas() {
  const navigate =
    useNavigate();


  const [
    partidas,
    setPartidas,
  ] = useState<Partida[]>([]);


  const [
    equipes,
    setEquipes,
  ] = useState<Equipe[]>([]);


  const [
    carregando,
    setCarregando,
  ] = useState(true);


  const [
    salvando,
    setSalvando,
  ] = useState(false);


  const [
    erro,
    setErro,
  ] = useState('');


  const [
    equipeFiltro,
    setEquipeFiltro,
  ] = useState('todas');


  const [
    modalidadeFiltro,
    setModalidadeFiltro,
  ] = useState(
    'modalidades',
  );


  const [
    dataFiltro,
    setDataFiltro,
  ] = useState('');


  const [
    abaStatus,
    setAbaStatus,
  ] = useState<
    'todas' | 'proximas' | 'finalizadas' | 'analise'
  >('todas');


  const [
    mostrarModal,
    setMostrarModal,
  ] = useState(false);


  const [
    novaPartida,
    setNovaPartida,
  ] = useState<NovaPartida>({
    equipeId: '',
    equipeVisitante: '',
    data: '',
    resultadoCasa: '',
    resultadoVisitante: '',
  });


  /* ============================================================
     CARREGAR EQUIPES E PARTIDAS
  ============================================================ */

  useEffect(() => {
    async function carregarDados() {
      try {
        setCarregando(true);
        setErro('');


        const token =
          localStorage.getItem(
            'token',
          );


        if (!token) {
          navigate('/login');
          return;
        }


        const [
          respostaEquipes,
          respostaPartidas,
        ] =
          await Promise.all([
            fetch(
              `${API_URL}/equipes`,
              {
                headers: {
                  Authorization:
                    `Bearer ${token}`,
                },
              },
            ),

            fetch(
              `${API_URL}/partidas`,
              {
                headers: {
                  Authorization:
                    `Bearer ${token}`,
                },
              },
            ),
          ]);


        if (
          respostaEquipes.status ===
            401 ||
          respostaPartidas.status ===
            401
        ) {
          localStorage.removeItem(
            'token',
          );

          navigate('/login');

          return;
        }


        const dadosEquipes: unknown =
          await respostaEquipes
            .json()
            .catch(() => []);


        const dadosPartidas: unknown =
          await respostaPartidas
            .json()
            .catch(() => []);


        console.log(
          'EQUIPES DO BACKEND:',
          dadosEquipes,
        );


        console.log(
          'PARTIDAS DO BACKEND:',
          dadosPartidas,
        );


        if (
          !respostaEquipes.ok
        ) {
          throw new Error(
            pegarMensagemErro(
              dadosEquipes,
              'Erro ao carregar equipes.',
            ),
          );
        }


        if (
          !respostaPartidas.ok
        ) {
          throw new Error(
            pegarMensagemErro(
              dadosPartidas,
              'Erro ao carregar partidas.',
            ),
          );
        }


        const listaEquipes =
          extrairEquipes(
            dadosEquipes,
          );


        const listaPartidas =
          extrairPartidas(
            dadosPartidas,
          );


        console.log(
          'LISTA DE EQUIPES:',
          listaEquipes,
        );


        setEquipes(
          listaEquipes,
        );


        setPartidas(
          listaPartidas.map(
            converterPartida,
          ),
        );


        if (
          listaEquipes.length >
          0
        ) {
          setNovaPartida(
            (anterior) => ({
              ...anterior,

              equipeId:
                anterior.equipeId ||
                String(
                  listaEquipes[0]
                    .id,
                ),
            }),
          );
        }

      } catch (error) {
        console.error(
          'Erro ao carregar dados:',
          error,
        );


        setErro(
          error instanceof Error
            ? error.message
            : 'Não foi possível carregar os dados.',
        );

      } finally {
        setCarregando(false);
      }
    }


    carregarDados();

  }, [navigate]);


  /* ============================================================
     EQUIPE SELECIONADA
  ============================================================ */

  const equipeSelecionada =
    useMemo(() => {
      return equipes.find(
        (equipe) =>
          equipe.id ===
          Number(
            novaPartida.equipeId,
          ),
      );
    }, [
      equipes,
      novaPartida.equipeId,
    ]);


  /* ============================================================
     MODALIDADES
  ============================================================ */

  const modalidades =
    useMemo(() => {
      return Array.from(
        new Set(
          equipes
            .map(
              (equipe) =>
                equipe.modalidade,
            )
            .filter(Boolean),
        ),
      ).sort();

    }, [equipes]);

  /* ============================================================
     FILTROS
  ============================================================ */

  const partidasFiltradas =
    partidas.filter(
      (partida) => {
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
            partida.tipo === 'pendente') ||
          (abaStatus === 'finalizadas' &&
            partida.tipo === 'analisada') ||
          (abaStatus === 'analise' &&
            partida.tipo === 'analise');

        return (
          equipeOk &&
          modalidadeOk &&
          dataOk &&
          statusOk
        );
      },
    );

  const contadores = useMemo(
    () => ({
      todas: partidas.length,
      proximas: partidas.filter(
        (partida) => partida.tipo === 'pendente',
      ).length,
      finalizadas: partidas.filter(
        (partida) => partida.tipo === 'analisada',
      ).length,
      analise: partidas.filter(
        (partida) => partida.tipo === 'analise',
      ).length,
    }),
    [partidas],
  );


  /* ============================================================
     ALTERAR FORMULÁRIO
  ============================================================ */

  function atualizarNovaPartida(
    campo:
      keyof NovaPartida,

    valor: string,
  ) {
    setNovaPartida(
      (anterior) => ({
        ...anterior,
        [campo]: valor,
      }),
    );
  }


  /* ============================================================
     ABRIR MODAL
  ============================================================ */

  function abrirModal() {
    if (
      equipes.length === 0
    ) {
      alert(
        'Nenhuma equipe foi encontrada para este treinador.',
      );

      return;
    }


    setNovaPartida(
      (anterior) => ({
        ...anterior,

        equipeId:
          anterior.equipeId ||
          String(
            equipes[0].id,
          ),
      }),
    );


    setMostrarModal(true);
  }


  /* ============================================================
     FECHAR MODAL
  ============================================================ */

  function fecharModal() {
    if (salvando) {
      return;
    }


    setMostrarModal(false);
  }


  /* ============================================================
     CRIAR PARTIDA
  ============================================================ */

  async function criarPartida() {
    if (salvando) {
      return;
    }


    if (
      !novaPartida.equipeId ||
      !novaPartida
        .equipeVisitante
        .trim() ||
      !novaPartida.data
    ) {
      alert(
        'Selecione sua equipe, informe o adversário e a data.',
      );

      return;
    }


    try {
      setSalvando(true);


      const token =
        localStorage.getItem(
          'token',
        );


      if (!token) {
        navigate('/login');

        return;
      }


      const golsEquipe =
        novaPartida
          .resultadoCasa
          .trim() === ''
          ? null
          : Number(
              novaPartida
                .resultadoCasa,
            );


      const golsAdversario =
        novaPartida
          .resultadoVisitante
          .trim() === ''
          ? null
          : Number(
              novaPartida
                .resultadoVisitante,
            );


      const resposta =
        await fetch(
          `${API_URL}/partidas`,
          {
            method:
              'POST',

            headers: {
              'Content-Type':
                'application/json',

              Authorization:
                `Bearer ${token}`,
            },

            body:
              JSON.stringify({
                equipeId:
                  Number(
                    novaPartida
                      .equipeId,
                  ),

                adversario:
                  novaPartida
                    .equipeVisitante
                    .trim(),

                data:
                  `${novaPartida.data}T12:00:00.000Z`,

                golsEquipe,

                golsAdversario,

                status:
                  'AGENDADA',
              }),
          },
        );


      const dados: unknown =
        await resposta
          .json()
          .catch(() => ({}));


      if (
        resposta.status === 401
      ) {
        localStorage.removeItem(
          'token',
        );

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


      let partidaCriada:
        PartidaAPI | null =
        null;


      if (
        typeof dados ===
          'object' &&
        dados !== null
      ) {
        const objeto =
          dados as Record<
            string,
            unknown
          >;


        if (
          objeto.partida &&
          typeof objeto.partida ===
            'object'
        ) {
          partidaCriada =
            objeto.partida as PartidaAPI;

        } else if (
          'id' in objeto
        ) {
          partidaCriada =
            dados as PartidaAPI;
        }
      }


      if (!partidaCriada) {
        throw new Error(
          'A partida foi criada, mas o servidor não retornou os dados corretamente.',
        );
      }


      setPartidas(
        (anteriores) => [
          converterPartida(
            partidaCriada,
          ),

          ...anteriores,
        ],
      );


      setNovaPartida({
        equipeId:
          equipes.length > 0
            ? String(
                equipes[0].id,
              )
            : '',

        equipeVisitante: '',

        data: '',

        resultadoCasa: '',

        resultadoVisitante: '',
      });


      setMostrarModal(false);

    } catch (error) {
      console.error(
        'Erro ao criar partida:',
        error,
      );


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
     DETALHES
  ============================================================ */

  function abrirDetalhes(
    partida: Partida,
  ) {
    navigate(
      '/detalhes-partida',
      {
        state: {
          partida,
        },
      },
    );
  }


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
            <option value="todas">
              Todas as equipes
            </option>

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
              <option
                key={modalidade}
                value={modalidade}
              >
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


      {mostrarModal && (
        <div
          className={
            styles.modalOverlay
          }
          onClick={
            fecharModal
          }
        >
          <div
            className={
              styles.modal
            }
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div
              className={
                styles.modalHeader
              }
            >
              <h3>
                Nova Partida
              </h3>


              <button
                type="button"
                className={
                  styles.closeButton
                }
                onClick={
                  fecharModal
                }
              >
                ×
              </button>
            </div>


            <div
              className={
                styles.form
              }
            >

              <div
                className={
                  styles.formGroup
                }
              >
                <label>
                  Sua equipe
                </label>

                <select
                  value={
                    novaPartida
                      .equipeId
                  }
                  onChange={(event) =>
                    atualizarNovaPartida(
                      'equipeId',
                      event.target.value,
                    )
                  }
                >
                  <option value="">
                    Selecione
                  </option>

                  {equipes.map(
                    (equipe) => (
                      <option
                        key={
                          equipe.id
                        }
                        value={
                          String(
                            equipe.id,
                          )
                        }
                      >
                        {
                          equipe.nome
                        }
                      </option>
                    ),
                  )}
                </select>
              </div>


              <div
                className={
                  styles.formGroup
                }
              >
                <label>
                  Equipe adversária
                </label>

                <input
                  type="text"
                  placeholder="Ex.: Tigres FC"
                  value={
                    novaPartida
                      .equipeVisitante
                  }
                  onChange={(event) =>
                    atualizarNovaPartida(
                      'equipeVisitante',
                      event.target.value,
                    )
                  }
                />
              </div>


              <div
                className={
                  styles.formRow
                }
              >

                <div
                  className={
                    styles.formGroup
                  }
                >
                  <label>
                    Modalidade
                  </label>

                  <input
                    type="text"
                    readOnly
                    value={
                      equipeSelecionada
                        ?.modalidade ||
                      ''
                    }
                  />
                </div>


                <div
                  className={
                    styles.formGroup
                  }
                >
                  <label>
                    Data
                  </label>

                  <input
                    type="date"
                    value={
                      novaPartida
                        .data
                    }
                    onChange={(event) =>
                      atualizarNovaPartida(
                        'data',
                        event.target.value,
                      )
                    }
                  />
                </div>

              </div>


              <div
                className={
                  styles.formRow
                }
              >

                <div
                  className={
                    styles.formGroup
                  }
                >
                  <label>
                    Placar da sua equipe
                  </label>

                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={
                      novaPartida
                        .resultadoCasa
                    }
                    onChange={(event) =>
                      atualizarNovaPartida(
                        'resultadoCasa',
                        event.target.value,
                      )
                    }
                  />
                </div>


                <div
                  className={
                    styles.formGroup
                  }
                >
                  <label>
                    Placar adversário
                  </label>

                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={
                      novaPartida
                        .resultadoVisitante
                    }
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


            <div
              className={
                styles.modalActions
              }
            >

              <button
                type="button"
                className={
                  styles.cancelButton
                }
                onClick={
                  fecharModal
                }
              >
                Cancelar
              </button>


              <button
                type="button"
                className={
                  styles.saveButton
                }
                onClick={
                  criarPartida
                }
                disabled={
                  salvando
                }
              >
                {salvando
                  ? 'Criando...'
                  : 'Criar partida'}
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}