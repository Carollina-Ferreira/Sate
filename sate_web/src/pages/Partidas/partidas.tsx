import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  Check,
  Users,
  X,
} from 'lucide-react';

import {
  useNavigate,
} from 'react-router-dom';

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


type AtletaAPI = {
  id: number;

  nome?: string | null;

  categoria?: string | null;

  equipeId?: number | null;

  usuario?: {
    avatarUrl?: string | null;
    email?: string;
  } | null;

  equipe?: {
    id: number;
    nome?: string;
  } | null;
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

  atletasIds: number[];
};


const API_URL =
  'http://localhost:3000/api';


function obterToken() {
  return (
    localStorage.getItem(
      'token',
    ) ||
    sessionStorage.getItem(
      'token',
    )
  );
}


function chaveEscalacao(
  partidaId: number,
) {
  return `sate_escalacao_partida_${partidaId}`;
}


function formatarData(
  data: string,
) {
  if (!data) {
    return '';
  }


  const somenteData =
    data.includes('T')
      ? data.split('T')[0]
      : data;


  const partes =
    somenteData.split('-');


  if (
    partes.length !== 3
  ) {
    return data;
  }


  return `${partes[2]}/${partes[1]}/${partes[0]}`;
}


function pegarTemporada(
  data: string,
) {
  if (!data) {
    return String(
      new Date()
        .getFullYear(),
    );
  }


  const somenteData =
    data.includes('T')
      ? data.split('T')[0]
      : data;


  return (
    somenteData
      .split('-')[0] ||
    String(
      new Date()
        .getFullYear(),
    )
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
        texto:
          'Finalizada',

        tipo:
          'analisada',
      };


    case 'EM_ANDAMENTO':
      return {
        texto:
          'Em andamento',

        tipo:
          'analise',
      };


    case 'CANCELADA':
      return {
        texto:
          'Cancelada',

        tipo:
          'pendente',
      };


    case 'AGENDADA':
    default:
      return {
        texto:
          'Pendente',

        tipo:
          'pendente',
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
    id:
      partida.id,

    equipeId:
      partida.equipeId,

    confronto:
      `${partida.equipe?.nome || 'Equipe'} vs ${partida.adversario}`,

    modalidade:
      partida.equipe
        ?.modalidade ||
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


function pegarMensagemErro(
  dados: unknown,

  mensagemPadrao: string,
) {
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


function extrairEquipes(
  dados: unknown,
): Equipe[] {
  if (
    Array.isArray(
      dados,
    )
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


function extrairPartidas(
  dados: unknown,
): PartidaAPI[] {
  if (
    Array.isArray(
      dados,
    )
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


function extrairAtletas(
  dados: unknown,
): AtletaAPI[] {
  if (
    Array.isArray(
      dados,
    )
  ) {
    return dados as AtletaAPI[];
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
        objeto.atletas,
      )
    ) {
      return objeto.atletas as AtletaAPI[];
    }


    if (
      Array.isArray(
        objeto.data,
      )
    ) {
      return objeto.data as AtletaAPI[];
    }
  }


  return [];
}


function obterIniciais(
  nome: string,
) {
  const partes =
    nome
      .trim()
      .split(' ')
      .filter(Boolean);


  if (
    partes.length === 0
  ) {
    return 'AT';
  }


  if (
    partes.length === 1
  ) {
    return partes[0]
      .slice(0, 2)
      .toUpperCase();
  }


  return `${partes[0][0]}${partes[
    partes.length - 1
  ][0]}`.toUpperCase();
}


export default function Partidas() {
  const navigate =
    useNavigate();


  const [
    partidas,
    setPartidas,
  ] =
    useState<
      Partida[]
    >([]);


  const [
    equipes,
    setEquipes,
  ] =
    useState<
      Equipe[]
    >([]);


  const [
    atletas,
    setAtletas,
  ] =
    useState<
      AtletaAPI[]
    >([]);


  const [
    carregando,
    setCarregando,
  ] =
    useState(true);


  const [
    salvando,
    setSalvando,
  ] =
    useState(false);


  const [
    erro,
    setErro,
  ] =
    useState('');


  const [
    equipeFiltro,
    setEquipeFiltro,
  ] =
    useState(
      'todas',
    );


  const [
    modalidadeFiltro,
    setModalidadeFiltro,
  ] =
    useState(
      'modalidades',
    );


  const [
    dataFiltro,
    setDataFiltro,
  ] =
    useState('');


  const [
    temporadaFiltro,
    setTemporadaFiltro,
  ] =
    useState(
      'todas',
    );


  const [
    mostrarModal,
    setMostrarModal,
  ] =
    useState(false);


  const [
    novaPartida,
    setNovaPartida,
  ] =
    useState<
      NovaPartida
    >({
      equipeId: '',

      equipeVisitante:
        '',

      data: '',

      atletasIds: [],
    });


  const [
    partidaPlacar,
    setPartidaPlacar,
  ] =
    useState<
      Partida | null
    >(null);


  const [
    placarEquipe,
    setPlacarEquipe,
  ] =
    useState('');


  const [
    placarAdversario,
    setPlacarAdversario,
  ] =
    useState('');


  const [
    salvandoPlacar,
    setSalvandoPlacar,
  ] =
    useState(false);


  /* ============================================================
     CARREGAR DADOS
  ============================================================ */

  useEffect(() => {
    async function carregarDados() {
      try {
        setCarregando(
          true,
        );

        setErro('');


        const token =
          obterToken();


        if (!token) {
          navigate(
            '/login',
          );

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


        const dadosEquipes:
          unknown =
          await respostaEquipes
            .json()
            .catch(
              () => [],
            );


        const dadosPartidas:
          unknown =
          await respostaPartidas
            .json()
            .catch(
              () => [],
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
                anterior
                  .equipeId ||
                String(
                  listaEquipes[0]
                    .id,
                ),
            }),
          );
        }


        /* ==============================
           ATLETAS
        ============================== */

        try {
          const respostaAtletas =
            await fetch(
              `${API_URL}/atletas`,
              {
                headers: {
                  Authorization:
                    `Bearer ${token}`,
                },
              },
            );


          const dadosAtletas:
            unknown =
            await respostaAtletas
              .json()
              .catch(
                () => [],
              );


          if (
            respostaAtletas.ok
          ) {
            setAtletas(
              extrairAtletas(
                dadosAtletas,
              ),
            );

          } else {
            console.warn(
              'Erro ao buscar atletas:',
              dadosAtletas,
            );

            setAtletas(
              [],
            );
          }

        } catch (
          erroAtletas
        ) {
          console.error(
            'Erro ao carregar atletas:',
            erroAtletas,
          );

          setAtletas(
            [],
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
        setCarregando(
          false,
        );
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
     TEMPORADAS
  ============================================================ */

  const temporadas =
    useMemo(() => {
      const lista =
        new Set<string>();


      partidas.forEach(
        (partida) => {
          lista.add(
            partida.temporada,
          );
        },
      );


      return Array.from(
        lista,
      ).sort(
        (a, b) =>
          Number(b) -
          Number(a),
      );

    }, [partidas]);


  /* ============================================================
     FILTROS
  ============================================================ */

  const partidasFiltradas =
    partidas.filter(
      (partida) => {
        const equipeOk =
          equipeFiltro ===
            'todas' ||
          String(
            partida.equipeId,
          ) ===
            equipeFiltro;


        const modalidadeOk =
          modalidadeFiltro ===
            'modalidades' ||
          partida.modalidade ===
            modalidadeFiltro;


        const dataOk =
          dataFiltro === '' ||
          partida
            .dataOriginal
            .slice(
              0,
              10,
            ) ===
            dataFiltro;


        const temporadaOk =
          temporadaFiltro ===
            'todas' ||
          partida.temporada ===
            temporadaFiltro;


        return (
          equipeOk &&
          modalidadeOk &&
          dataOk &&
          temporadaOk
        );
      },
    );


  /* ============================================================
     ATLETAS DA EQUIPE
  ============================================================ */

  const atletasDaEquipe =
    useMemo(() => {
      if (
        !novaPartida.equipeId
      ) {
        return [];
      }


      const equipeId =
        Number(
          novaPartida
            .equipeId,
        );


      return atletas.filter(
        (atleta) => {
          const idEquipeAtleta =
            atleta.equipeId ??
            atleta.equipe?.id ??
            null;


          return (
            Number(
              idEquipeAtleta,
            ) ===
            equipeId
          );
        },
      );

    }, [
      atletas,
      novaPartida.equipeId,
    ]);


  /* ============================================================
     FORM
  ============================================================ */

  function atualizarNovaPartida(
    campo:
      | 'equipeVisitante'
      | 'data',

    valor: string,
  ) {
    setNovaPartida(
      (anterior) => ({
        ...anterior,

        [campo]:
          valor,
      }),
    );
  }


  function alterarEquipePartida(
    equipeId: string,
  ) {
    setNovaPartida(
      (anterior) => ({
        ...anterior,

        equipeId,

        atletasIds: [],
      }),
    );
  }


  /* ============================================================
     ESCALAÇÃO
  ============================================================ */

  function alternarAtleta(
    atletaId: number,
  ) {
    setNovaPartida(
      (anterior) => {
        const selecionado =
          anterior
            .atletasIds
            .includes(
              atletaId,
            );


        return {
          ...anterior,

          atletasIds:
            selecionado
              ? anterior
                  .atletasIds
                  .filter(
                    (id) =>
                      id !==
                      atletaId,
                  )
              : [
                  ...anterior
                    .atletasIds,

                  atletaId,
                ],
        };
      },
    );
  }


  /* ============================================================
     MODAL NOVA PARTIDA
  ============================================================ */

  function abrirModal() {
    if (
      equipes.length === 0
    ) {
      alert(
        'Nenhuma equipe foi encontrada.',
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

        atletasIds: [],
      }),
    );


    setMostrarModal(
      true,
    );
  }


  function fecharModal() {
    if (salvando) {
      return;
    }


    setMostrarModal(
      false,
    );
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
      setSalvando(
        true,
      );


      const token =
        obterToken();


      if (!token) {
        navigate(
          '/login',
        );

        return;
      }


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
                    novaPartida.equipeId,
                  ),

                adversario:
                  novaPartida
                    .equipeVisitante
                    .trim(),

                data:
                  `${novaPartida.data}T12:00:00.000Z`,
              }),
          },
        );


      const dados:
        unknown =
        await resposta
          .json()
          .catch(
            () => ({}),
          );


      if (
        resposta.status ===
        401
      ) {
        localStorage.removeItem(
          'token',
        );

        sessionStorage.removeItem(
          'token',
        );

        navigate(
          '/login',
        );

        return;
      }


      if (
        !resposta.ok
      ) {
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


      if (
        !partidaCriada
      ) {
        throw new Error(
          'A partida foi criada, mas o servidor não retornou os dados corretamente.',
        );
      }


      /* ======================================================
         SALVAR DADOS COMPLETOS DOS ATLETAS SELECIONADOS
      ====================================================== */

      const atletasSelecionados =
        atletasDaEquipe.filter(
          (atleta) =>
            novaPartida
              .atletasIds
              .includes(
                atleta.id,
              ),
        );


      localStorage.setItem(
        chaveEscalacao(
          partidaCriada.id,
        ),

        JSON.stringify(
          atletasSelecionados,
        ),
      );


      console.log(
        'PARTIDA:',
        partidaCriada.id,
      );


      console.log(
        'ESCALAÇÃO:',
        atletasSelecionados,
      );


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

        equipeVisitante:
          '',

        data:
          '',

        atletasIds:
          [],
      });


      setMostrarModal(
        false,
      );

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
      setSalvando(
        false,
      );
    }
  }


  /* ============================================================
     PLACAR
  ============================================================ */

  function partidaPodeReceberPlacar(
    partida: Partida,
  ) {
    const dataPartida =
      new Date(
        partida.dataOriginal,
      );


    const agora =
      new Date();


    const semPlacar =
      partida.golsEquipe ===
        null ||
      partida.golsAdversario ===
        null;


    return (
      dataPartida <=
        agora &&
      semPlacar &&
      partida.status !==
        'Cancelada'
    );
  }


  function abrirModalPlacar(
    partida: Partida,
  ) {
    setPartidaPlacar(
      partida,
    );


    setPlacarEquipe(
      '',
    );


    setPlacarAdversario(
      '',
    );
  }


  function fecharModalPlacar() {
    if (
      salvandoPlacar
    ) {
      return;
    }


    setPartidaPlacar(
      null,
    );
  }


  async function salvarPlacar() {
    if (
      !partidaPlacar ||
      salvandoPlacar
    ) {
      return;
    }


    if (
      placarEquipe === '' ||
      placarAdversario ===
        ''
    ) {
      alert(
        'Informe os dois placares.',
      );

      return;
    }


    const golsEquipe =
      Number(
        placarEquipe,
      );


    const golsAdversario =
      Number(
        placarAdversario,
      );


    if (
      Number.isNaN(
        golsEquipe,
      ) ||
      Number.isNaN(
        golsAdversario,
      ) ||
      golsEquipe < 0 ||
      golsAdversario < 0
    ) {
      alert(
        'Informe placares válidos.',
      );

      return;
    }


    try {
      setSalvandoPlacar(
        true,
      );


      const token =
        obterToken();


      if (!token) {
        navigate(
          '/login',
        );

        return;
      }


      const resposta =
        await fetch(
          `${API_URL}/partidas/${partidaPlacar.id}`,
          {
            method:
              'PUT',

            headers: {
              'Content-Type':
                'application/json',

              Authorization:
                `Bearer ${token}`,
            },

            body:
              JSON.stringify({
                golsEquipe,

                golsAdversario,

                status:
                  'FINALIZADA',
              }),
          },
        );


      const dados:
        unknown =
        await resposta
          .json()
          .catch(
            () => ({}),
          );


      if (
        !resposta.ok
      ) {
        throw new Error(
          pegarMensagemErro(
            dados,
            'Erro ao salvar placar.',
          ),
        );
      }


      setPartidas(
        (anteriores) =>
          anteriores.map(
            (partida) =>
              partida.id ===
              partidaPlacar.id
                ? {
                    ...partida,

                    golsEquipe,

                    golsAdversario,

                    resultado:
                      `${golsEquipe} - ${golsAdversario}`,

                    status:
                      'Finalizada',

                    tipo:
                      'analisada',
                  }
                : partida,
          ),
      );


      setPartidaPlacar(
        null,
      );


      setPlacarEquipe(
        '',
      );


      setPlacarAdversario(
        '',
      );

    } catch (error) {
      console.error(
        'Erro ao salvar placar:',
        error,
      );


      alert(
        error instanceof Error
          ? error.message
          : 'Erro ao salvar placar.',
      );

    } finally {
      setSalvandoPlacar(
        false,
      );
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
    <div
      className={
        styles.page
      }
    >

      {/* TÍTULO */}

      <div
        className={
          styles.titleRow
        }
      >

        <div>
          <h2>
            Partidas
          </h2>

          <p>
            Gerencie e acompanhe
            as partidas das suas equipes.
          </p>
        </div>


        <button
          type="button"
          className={
            styles.newButton
          }
          onClick={
            abrirModal
          }
        >
          + Nova Partida
        </button>

      </div>


      {/* FILTROS */}

      <div
        className={
          styles.filters
        }
      >

        <select
          value={
            equipeFiltro
          }
          onChange={(event) =>
            setEquipeFiltro(
              event.target.value,
            )
          }
        >
          <option value="todas">
            Todas as equipes
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


        <select
          value={
            modalidadeFiltro
          }
          onChange={(event) =>
            setModalidadeFiltro(
              event.target.value,
            )
          }
        >
          <option value="modalidades">
            Todas as modalidades
          </option>

          {modalidades.map(
            (modalidade) => (
              <option
                key={
                  modalidade
                }
                value={
                  modalidade
                }
              >
                {
                  modalidade
                }
              </option>
            ),
          )}
        </select>


        <input
          type="date"
          value={
            dataFiltro
          }
          onChange={(event) =>
            setDataFiltro(
              event.target.value,
            )
          }
        />


        <select
          value={
            temporadaFiltro
          }
          onChange={(event) =>
            setTemporadaFiltro(
              event.target.value,
            )
          }
        >
          <option value="todas">
            Todas as temporadas
          </option>

          {temporadas.map(
            (temporada) => (
              <option
                key={
                  temporada
                }
                value={
                  temporada
                }
              >
                {
                  temporada
                }
              </option>
            ),
          )}
        </select>

      </div>


      {/* TABELA */}

      <div
        className={
          styles.tableContainer
        }
      >

        <table>

          <thead>
            <tr>
              <th>
                Confronto
              </th>

              <th>
                Modalidade
              </th>

              <th>
                Data
              </th>

              <th>
                Resultado
              </th>

              <th>
                Status
              </th>

              <th />
            </tr>
          </thead>


          <tbody>

            {partidasFiltradas.map(
              (partida) => (

                <tr
                  key={
                    partida.id
                  }
                >

                  <td
                    className={
                      styles.confronto
                    }
                  >
                    {
                      partida.confronto
                    }
                  </td>


                  <td>
                    {
                      partida.modalidade
                    }
                  </td>


                  <td>
                    {
                      partida.data
                    }
                  </td>


                  <td
                    className={
                      styles.resultado
                    }
                  >

                    {partida.resultado !==
                    '-' ? (

                      partida.resultado

                    ) : partidaPodeReceberPlacar(
                        partida,
                      ) ? (

                      <button
                        type="button"
                        onClick={() =>
                          abrirModalPlacar(
                            partida,
                          )
                        }
                        style={{
                          height:
                            '32px',

                          padding:
                            '0 12px',

                          border:
                            '1px solid #15966c',

                          borderRadius:
                            '7px',

                          background:
                            '#e3f4ed',

                          color:
                            '#087653',

                          fontFamily:
                            'inherit',

                          fontSize:
                            '11px',

                          fontWeight:
                            600,

                          cursor:
                            'pointer',
                        }}
                      >
                        Adicionar placar
                      </button>

                    ) : (
                      '-'
                    )}

                  </td>


                  <td>

                    <span
                      className={
                        styles[
                          partida.tipo
                        ]
                      }
                    >
                      {
                        partida.status
                      }
                    </span>

                  </td>


                  <td>

                    <button
                      type="button"
                      className={
                        styles.details
                      }
                      onClick={() =>
                        abrirDetalhes(
                          partida,
                        )
                      }
                    >
                      ›
                    </button>

                  </td>

                </tr>

              ),
            )}

          </tbody>

        </table>


        {carregando && (
          <div
            className={
              styles.empty
            }
          >
            <h3>
              Carregando partidas...
            </h3>
          </div>
        )}


        {!carregando &&
          erro && (
            <div
              className={
                styles.empty
              }
            >
              <h3>
                Erro ao carregar
              </h3>

              <p>
                {erro}
              </p>
            </div>
          )}


        {!carregando &&
          !erro &&
          partidasFiltradas
            .length ===
            0 && (
            <div
              className={
                styles.empty
              }
            >
              <h3>
                Nenhuma partida encontrada
              </h3>
            </div>
          )}

      </div>


      {/* =====================================================
          MODAL NOVA PARTIDA
      ===================================================== */}

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

              <div>

                <span
                  className={
                    styles.modalEyebrow
                  }
                >
                  Cadastro de partida
                </span>


                <h3>
                  Nova Partida
                </h3>


                <p>
                  Preencha os dados e escolha os atletas.
                </p>

              </div>


              <button
                type="button"
                className={
                  styles.closeButton
                }
                onClick={
                  fecharModal
                }
              >
                <X
                  size={18}
                />
              </button>

            </div>


            <div
              className={
                styles.modalBody
              }
            >

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
                      alterarEquipePartida(
                        event.target.value,
                      )
                    }
                  >

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

                        event.target
                          .value,
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

                          event.target
                            .value,
                        )
                      }
                    />

                  </div>

                </div>

              </div>


              {/* ESCALAÇÃO */}

              <section
                className={
                  styles.lineupSection
                }
              >

                <div
                  className={
                    styles.lineupHeader
                  }
                >

                  <div
                    className={
                      styles.lineupTitle
                    }
                  >

                    <span
                      className={
                        styles.lineupIcon
                      }
                    >
                      <Users
                        size={16}
                      />
                    </span>


                    <div>

                      <h4>
                        Escalação
                      </h4>


                      <p>
                        Clique nos atletas que participarão.
                      </p>

                    </div>

                  </div>


                  <span
                    className={
                      styles.selectedCount
                    }
                  >
                    {
                      novaPartida
                        .atletasIds
                        .length
                    }{' '}
                    selecionado(s)
                  </span>

                </div>


                <div
                  className={
                    styles.athletesIcons
                  }
                >

                  {atletasDaEquipe
                    .length ===
                    0 && (

                    <div
                      className={
                        styles.lineupEmpty
                      }
                    >
                      Nenhum atleta nesta equipe.
                    </div>

                  )}


                  {atletasDaEquipe.map(
                    (
                      atleta,
                    ) => {

                      const nome =
                        atleta.nome ||
                        'Atleta';


                      const selecionado =
                        novaPartida
                          .atletasIds
                          .includes(
                            atleta.id,
                          );


                      return (

                        <button
                          key={
                            atleta.id
                          }
                          type="button"
                          title={
                            nome
                          }
                          className={`${styles.athleteIconButton} ${
                            selecionado
                              ? styles.athleteIconSelected
                              : ''
                          }`}
                          onClick={() =>
                            alternarAtleta(
                              atleta.id,
                            )
                          }
                        >

                          <div
                            className={
                              styles.athleteIconImage
                            }
                          >

                            {atleta
                              .usuario
                              ?.avatarUrl ? (

                              <img
                                src={
                                  atleta.usuario
                                    .avatarUrl
                                }
                                alt={
                                  nome
                                }
                              />

                            ) : (

                              <span>
                                {
                                  obterIniciais(
                                    nome,
                                  )
                                }
                              </span>

                            )}

                          </div>


                          {selecionado && (

                            <span
                              className={
                                styles.athleteMiniCheck
                              }
                            >
                              <Check
                                size={10}
                              />
                            </span>

                          )}

                        </button>

                      );

                    },
                  )}

                </div>

              </section>

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


      {/* =====================================================
          MODAL PLACAR
      ===================================================== */}

      {partidaPlacar && (

        <div
          className={
            styles.modalOverlay
          }
          onClick={
            fecharModalPlacar
          }
        >

          <div
            className={
              styles.modal
            }
            style={{
              maxWidth:
                '450px',
            }}
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div
              className={
                styles.modalHeader
              }
            >

              <div>

                <span
                  className={
                    styles.modalEyebrow
                  }
                >
                  Resultado
                </span>


                <h3>
                  Adicionar placar
                </h3>


                <p>
                  {
                    partidaPlacar
                      .confronto
                  }
                </p>

              </div>


              <button
                type="button"
                className={
                  styles.closeButton
                }
                onClick={
                  fecharModalPlacar
                }
              >
                <X
                  size={18}
                />
              </button>

            </div>


            <div
              className={
                styles.modalBody
              }
              style={{
                display:
                  'block',
              }}
            >

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
                    {
                      partidaPlacar
                        .equipe
                        .nome
                    }
                  </label>


                  <input
                    type="number"
                    min="0"
                    value={
                      placarEquipe
                    }
                    onChange={(event) =>
                      setPlacarEquipe(
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
                    {
                      partidaPlacar
                        .adversario
                    }
                  </label>


                  <input
                    type="number"
                    min="0"
                    value={
                      placarAdversario
                    }
                    onChange={(event) =>
                      setPlacarAdversario(
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
                  fecharModalPlacar
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
                  salvarPlacar
                }
                disabled={
                  salvandoPlacar
                }
              >
                {salvandoPlacar
                  ? 'Salvando...'
                  : 'Salvar placar'}
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}