import {
  ArrowLeftRight,
} from 'lucide-react';

import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  useNavigate,
} from 'react-router-dom';

import styles from './comparacoes.module.css';


const API_URL =
  'http://localhost:3000/api';


interface EquipeBackend {
  id: number;
  nome: string;
  modalidade: string;
  categoria?: string | null;
  imagem?: string | null;
  corEquipe?: string | null;
}


interface PartidaBackend {
  id: number;

  equipeId: number;

  adversario: string;

  data: string;

  local?: string | null;

  campeonato?: string | null;

  rodada?: string | null;

  observacoes?: string | null;

  status:
    | 'AGENDADA'
    | 'EM_ANDAMENTO'
    | 'FINALIZADA'
    | 'CANCELADA';

  golsEquipe?: number | null;

  golsAdversario?: number | null;

  equipe: EquipeBackend;
}


interface Estatistica {
  nome: string;

  valor: number | null;

  formato:
    | 'numero'
    | 'porcentagem';
}


/* ============================================================
   DATA
============================================================ */

function formatarData(
  data: string,
) {
  if (!data) {
    return 'Data não informada';
  }

  const dataLimpa =
    data.includes('T')
      ? data.split('T')[0]
      : data;

  const partes =
    dataLimpa.split('-');

  if (
    partes.length !== 3
  ) {
    return data;
  }

  return `${partes[2]}/${partes[1]}/${partes[0]}`;
}


/* ============================================================
   STATUS
============================================================ */

function formatarStatus(
  status: PartidaBackend['status'],
) {
  switch (status) {
    case 'AGENDADA':
      return 'Agendada';

    case 'EM_ANDAMENTO':
      return 'Em andamento';

    case 'FINALIZADA':
      return 'Finalizada';

    case 'CANCELADA':
      return 'Cancelada';

    default:
      return status;
  }
}


/* ============================================================
   PEGAR ERRO DA API
============================================================ */

function pegarMensagemErro(
  dados: unknown,
  padrao: string,
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

  return padrao;
}


/* ============================================================
   EXTRAIR PARTIDAS
============================================================ */

function extrairPartidas(
  dados: unknown,
): PartidaBackend[] {
  if (
    Array.isArray(dados)
  ) {
    return dados as PartidaBackend[];
  }

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
      Array.isArray(
        objeto.partidas,
      )
    ) {
      return objeto.partidas as PartidaBackend[];
    }

    if (
      Array.isArray(
        objeto.data,
      )
    ) {
      return objeto.data as PartidaBackend[];
    }
  }

  return [];
}


/* ============================================================
   GERAR ESTATÍSTICAS REAIS DA PARTIDA
============================================================ */

function criarEstatisticas(
  partida: PartidaBackend,
): Estatistica[] {
  const placarEquipe =
    partida.golsEquipe ??
    null;

  const placarAdversario =
    partida.golsAdversario ??
    null;


  const temPlacar =
    placarEquipe !== null &&
    placarAdversario !== null;


  const saldo =
    temPlacar
      ? placarEquipe -
        placarAdversario
      : null;


  const totalPontos =
    temPlacar
      ? placarEquipe +
        placarAdversario
      : null;


  const participacao =
    totalPontos !== null &&
    totalPontos > 0 &&
    placarEquipe !== null
      ? Math.round(
          (
            placarEquipe /
            totalPontos
          ) * 100,
        )
      : null;


  return [
    {
      nome:
        'Placar da equipe',

      valor:
        placarEquipe,

      formato:
        'numero',
    },

    {
      nome:
        'Placar adversário',

      valor:
        placarAdversario,

      formato:
        'numero',
    },

    {
      nome:
        'Saldo da partida',

      valor:
        saldo,

      formato:
        'numero',
    },

    {
      nome:
        'Participação no placar',

      valor:
        participacao,

      formato:
        'porcentagem',
    },
  ];
}


/* ============================================================
   COMPONENTE
============================================================ */

const Comparacoes = () => {
  const navigate =
    useNavigate();


  const [
    partidas,
    setPartidas,
  ] =
    useState<
      PartidaBackend[]
    >([]);


  const [
    partidaAId,
    setPartidaAId,
  ] =
    useState<
      number | null
    >(null);


  const [
    partidaBId,
    setPartidaBId,
  ] =
    useState<
      number | null
    >(null);


  const [
    carregando,
    setCarregando,
  ] =
    useState(true);


  const [
    erro,
    setErro,
  ] =
    useState('');


  /* ============================================================
     CARREGAR PARTIDAS DO BANCO
  ============================================================ */

  useEffect(() => {
    async function carregarPartidas() {
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


        const resposta =
          await fetch(
            `${API_URL}/partidas`,
            {
              method: 'GET',

              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            },
          );


        const dados: unknown =
          await resposta
            .json()
            .catch(() => []);


        console.log(
          'PARTIDAS EM COMPARAÇÕES:',
          dados,
        );


        if (
          resposta.status ===
          401
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
              'Erro ao carregar partidas.',
            ),
          );
        }


        const lista =
          extrairPartidas(
            dados,
          );


        setPartidas(
          lista,
        );


        if (
          lista.length >= 1
        ) {
          setPartidaAId(
            lista[0].id,
          );
        }


        if (
          lista.length >= 2
        ) {
          setPartidaBId(
            lista[1].id,
          );
        }

      } catch (error) {
        console.error(
          'Erro ao carregar partidas:',
          error,
        );


        setErro(
          error instanceof Error
            ? error.message
            : 'Erro ao carregar partidas.',
        );


        setPartidas([]);

      } finally {
        setCarregando(false);
      }
    }


    carregarPartidas();

  }, [navigate]);


  /* ============================================================
     PARTIDA A
  ============================================================ */

  const partidaA =
    useMemo(() => {
      if (
        partidaAId === null
      ) {
        return null;
      }

      return (
        partidas.find(
          (partida) =>
            partida.id ===
            partidaAId,
        ) ??
        null
      );
    }, [
      partidas,
      partidaAId,
    ]);


  /* ============================================================
     PARTIDA B
  ============================================================ */

  const partidaB =
    useMemo(() => {
      if (
        partidaBId === null
      ) {
        return null;
      }

      return (
        partidas.find(
          (partida) =>
            partida.id ===
            partidaBId,
        ) ??
        null
      );
    }, [
      partidas,
      partidaBId,
    ]);


  /* ============================================================
     ESTATÍSTICAS
  ============================================================ */

  const estatisticasA =
    useMemo(() => {
      if (!partidaA) {
        return [];
      }

      return criarEstatisticas(
        partidaA,
      );
    }, [partidaA]);


  const estatisticasB =
    useMemo(() => {
      if (!partidaB) {
        return [];
      }

      return criarEstatisticas(
        partidaB,
      );
    }, [partidaB]);


  /* ============================================================
     FORMATAR VALOR
  ============================================================ */

  const formatarValor = (
    estatistica:
      Estatistica,
  ) => {
    if (
      estatistica.valor ===
      null
    ) {
      return '—';
    }


    if (
      estatistica.formato ===
      'porcentagem'
    ) {
      return `${estatistica.valor}%`;
    }


    return estatistica.valor;
  };


  /* ============================================================
     BARRAS
  ============================================================ */

  const calcularBarra = (
    valorA:
      number | null,

    valorB:
      number | null,
  ) => {
    if (
      valorA === null &&
      valorB === null
    ) {
      return {
        barraA: 0,
        barraB: 0,
      };
    }


    const absolutoA =
      Math.abs(
        valorA ?? 0,
      );


    const absolutoB =
      Math.abs(
        valorB ?? 0,
      );


    const maiorValor =
      Math.max(
        absolutoA,
        absolutoB,
        1,
      );


    return {
      barraA:
        (
          absolutoA /
          maiorValor
        ) * 100,

      barraB:
        (
          absolutoB /
          maiorValor
        ) * 100,
    };
  };


  /* ============================================================
     INVERTER PARTIDAS
  ============================================================ */

  const inverterPartidas =
    () => {
      if (
        partidaAId === null ||
        partidaBId === null
      ) {
        return;
      }


      const antigaA =
        partidaAId;


      setPartidaAId(
        partidaBId,
      );


      setPartidaBId(
        antigaA,
      );
    };


  /* ============================================================
     ALTERAR PARTIDA A
  ============================================================ */

  function alterarPartidaA(
    id: number,
  ) {
    if (
      id === partidaBId
    ) {
      return;
    }

    setPartidaAId(id);
  }


  /* ============================================================
     ALTERAR PARTIDA B
  ============================================================ */

  function alterarPartidaB(
    id: number,
  ) {
    if (
      id === partidaAId
    ) {
      return;
    }

    setPartidaBId(id);
  }


  return (
    <main
      className={
        styles.page
      }
    >

      {/* ======================================================
          CABEÇALHO
      ====================================================== */}

      <div
        className={
          styles.pageHeader
        }
      >
        <div>
          <h1>
            Comparações
          </h1>

          <p>
            Compare o desempenho entre duas partidas.
          </p>
        </div>
      </div>


      {/* ======================================================
          CARREGANDO
      ====================================================== */}

      {carregando && (
        <section
          className={
            styles.stateCard
          }
        >
          <h2>
            Carregando partidas...
          </h2>

          <p>
            Buscando suas partidas no banco de dados.
          </p>
        </section>
      )}


      {/* ======================================================
          ERRO
      ====================================================== */}

      {!carregando &&
        erro && (
          <section
            className={
              styles.stateCard
            }
          >
            <h2>
              Não foi possível carregar
            </h2>

            <p>
              {erro}
            </p>
          </section>
        )}


      {/* ======================================================
          NENHUMA PARTIDA
      ====================================================== */}

      {!carregando &&
        !erro &&
        partidas.length ===
          0 && (
          <section
            className={
              styles.stateCard
            }
          >
            <h2>
              Nenhuma partida cadastrada
            </h2>

            <p>
              Cadastre partidas para começar a comparar.
            </p>
          </section>
        )}


      {/* ======================================================
          APENAS UMA PARTIDA
      ====================================================== */}

      {!carregando &&
        !erro &&
        partidas.length ===
          1 && (
          <>
            <section
              className={
                styles.selectionCard
              }
            >
              <div
                className={
                  styles.selectGroup
                }
              >
                <label
                  htmlFor="partida-a"
                >
                  Partida A
                </label>

                <select
                  id="partida-a"
                  value={
                    partidaAId ??
                    ''
                  }
                  onChange={(
                    event,
                  ) =>
                    alterarPartidaA(
                      Number(
                        event.target
                          .value,
                      ),
                    )
                  }
                >
                  {partidas.map(
                    (partida) => (
                      <option
                        key={
                          partida.id
                        }
                        value={
                          partida.id
                        }
                      >
                        {
                          partida
                            .equipe
                            .nome
                        }{' '}
                        vs{' '}
                        {
                          partida
                            .adversario
                        }
                      </option>
                    ),
                  )}
                </select>
              </div>


              <button
                type="button"
                className={
                  styles.switchButton
                }
                disabled
              >
                <ArrowLeftRight
                  size={18}
                />
              </button>


              <div
                className={
                  styles.selectGroup
                }
              >
                <label>
                  Partida B
                </label>

                <select
                  disabled
                  value=""
                >
                  <option>
                    Cadastre outra partida
                  </option>
                </select>
              </div>
            </section>


            <section
              className={
                styles.stateCard
              }
            >
              <h2>
                Falta mais uma partida
              </h2>

              <p>
                É necessário ter pelo menos duas partidas cadastradas para realizar uma comparação.
              </p>
            </section>
          </>
        )}


      {/* ======================================================
          COMPARAÇÃO
      ====================================================== */}

      {!carregando &&
        !erro &&
        partidas.length >=
          2 &&
        partidaA &&
        partidaB && (
          <>

            {/* ==================================================
                SELEÇÃO
            ================================================== */}

            <section
              className={
                styles.selectionCard
              }
            >

              <div
                className={
                  styles.selectGroup
                }
              >
                <label
                  htmlFor="partida-a"
                >
                  Partida A
                </label>

                <select
                  id="partida-a"
                  value={
                    partidaAId ??
                    ''
                  }
                  onChange={(
                    event,
                  ) =>
                    alterarPartidaA(
                      Number(
                        event.target
                          .value,
                      ),
                    )
                  }
                >
                  {partidas.map(
                    (partida) => (
                      <option
                        key={
                          partida.id
                        }
                        value={
                          partida.id
                        }
                        disabled={
                          partida.id ===
                          partidaBId
                        }
                      >
                        {
                          partida
                            .equipe
                            .nome
                        }{' '}
                        vs{' '}
                        {
                          partida
                            .adversario
                        }
                      </option>
                    ),
                  )}
                </select>
              </div>


              <button
                type="button"
                className={
                  styles.switchButton
                }
                onClick={
                  inverterPartidas
                }
                title="Inverter partidas"
                aria-label="Inverter partidas"
              >
                <ArrowLeftRight
                  size={18}
                />
              </button>


              <div
                className={
                  styles.selectGroup
                }
              >
                <label
                  htmlFor="partida-b"
                >
                  Partida B
                </label>

                <select
                  id="partida-b"
                  value={
                    partidaBId ??
                    ''
                  }
                  onChange={(
                    event,
                  ) =>
                    alterarPartidaB(
                      Number(
                        event.target
                          .value,
                      ),
                    )
                  }
                >
                  {partidas.map(
                    (partida) => (
                      <option
                        key={
                          partida.id
                        }
                        value={
                          partida.id
                        }
                        disabled={
                          partida.id ===
                          partidaAId
                        }
                      >
                        {
                          partida
                            .equipe
                            .nome
                        }{' '}
                        vs{' '}
                        {
                          partida
                            .adversario
                        }
                      </option>
                    ),
                  )}
                </select>
              </div>

            </section>


            {/* ==================================================
                CARD DA COMPARAÇÃO
            ================================================== */}

            <section
              className={
                styles.comparison
              }
            >

              <div
                className={
                  styles.matchHeader
                }
              >

                {/* PARTIDA A */}

                <div
                  className={
                    styles.matchLeft
                  }
                >
                  <span
                    className={
                      styles.matchLabel
                    }
                  >
                    Partida A
                  </span>


                  <h2>
                    {
                      partidaA.equipe
                        .nome
                    }

                    <span>
                      {' '}
                      vs{' '}
                    </span>

                    {
                      partidaA.adversario
                    }
                  </h2>


                  <div
                    className={
                      styles.matchScore
                    }
                  >
                    {partidaA.golsEquipe ??
                      '—'}

                    <span>
                      ×
                    </span>

                    {partidaA.golsAdversario ??
                      '—'}
                  </div>


                  <div
                    className={
                      styles.matchMeta
                    }
                  >
                    <span>
                      {
                        partidaA
                          .equipe
                          .modalidade
                      }
                    </span>

                    <span>
                      {formatarData(
                        partidaA.data,
                      )}
                    </span>

                    <span>
                      {formatarStatus(
                        partidaA.status,
                      )}
                    </span>
                  </div>
                </div>


                {/* PARTIDA B */}

                <div
                  className={
                    styles.matchRight
                  }
                >
                  <span
                    className={
                      styles.matchLabel
                    }
                  >
                    Partida B
                  </span>


                  <h2>
                    {
                      partidaB.equipe
                        .nome
                    }

                    <span>
                      {' '}
                      vs{' '}
                    </span>

                    {
                      partidaB.adversario
                    }
                  </h2>


                  <div
                    className={
                      styles.matchScore
                    }
                  >
                    {partidaB.golsEquipe ??
                      '—'}

                    <span>
                      ×
                    </span>

                    {partidaB.golsAdversario ??
                      '—'}
                  </div>


                  <div
                    className={
                      styles.matchMeta
                    }
                  >
                    <span>
                      {
                        partidaB
                          .equipe
                          .modalidade
                      }
                    </span>

                    <span>
                      {formatarData(
                        partidaB.data,
                      )}
                    </span>

                    <span>
                      {formatarStatus(
                        partidaB.status,
                      )}
                    </span>
                  </div>
                </div>

              </div>


              <div
                className={
                  styles.divider
                }
              />


              {/* ==================================================
                  ESTATÍSTICAS
              ================================================== */}

              <div
                className={
                  styles.stats
                }
              >
                {estatisticasA.map(
                  (
                    estatisticaA,
                    index,
                  ) => {

                    const estatisticaB =
                      estatisticasB[
                        index
                      ];


                    if (
                      !estatisticaB
                    ) {
                      return null;
                    }


                    const {
                      barraA,
                      barraB,
                    } =
                      calcularBarra(
                        estatisticaA.valor,
                        estatisticaB.valor,
                      );


                    return (
                      <div
                        className={
                          styles.statRow
                        }
                        key={
                          estatisticaA.nome
                        }
                      >

                        <div
                          className={
                            styles.statValues
                          }
                        >

                          <strong
                            className={
                              styles.valueA
                            }
                          >
                            {formatarValor(
                              estatisticaA,
                            )}
                          </strong>


                          <span
                            className={
                              styles.statName
                            }
                          >
                            {
                              estatisticaA.nome
                            }
                          </span>


                          <strong
                            className={
                              styles.valueB
                            }
                          >
                            {formatarValor(
                              estatisticaB,
                            )}
                          </strong>

                        </div>


                        <div
                          className={
                            styles.barArea
                          }
                        >

                          <div
                            className={
                              styles.barSideLeft
                            }
                          >
                            <div
                              className={
                                styles.barA
                              }
                              style={{
                                width:
                                  `${barraA}%`,
                              }}
                            />
                          </div>


                          <div
                            className={
                              styles.barCenter
                            }
                          />


                          <div
                            className={
                              styles.barSideRight
                            }
                          >
                            <div
                              className={
                                styles.barB
                              }
                              style={{
                                width:
                                  `${barraB}%`,
                              }}
                            />
                          </div>

                        </div>

                      </div>
                    );
                  },
                )}
              </div>

            </section>

          </>
        )}

    </main>
  );
};


export default Comparacoes;