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

  status:
    | 'AGENDADA'
    | 'EM_ANDAMENTO'
    | 'FINALIZADA'
    | 'CANCELADA';

  golsEquipe?:
    | number
    | null;

  golsAdversario?:
    | number
    | null;

  equipe: EquipeBackend;
}


interface EstatisticaEquipe {
  nome: string;

  valor: number;

  formato:
    | 'numero'
    | 'porcentagem';
}


interface ResumoEquipe {
  jogos: number;

  vitorias: number;

  empates: number;

  derrotas: number;

  pontosFeitos: number;

  pontosSofridos: number;

  saldo: number;

  aproveitamento: number;
}


/* ============================================================
   TOKEN
============================================================ */

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


/* ============================================================
   ERRO
============================================================ */

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
      typeof objeto.mensagem ===
      'string'
    ) {
      return objeto.mensagem;
    }


    if (
      typeof objeto.erro ===
      'string'
    ) {
      return objeto.erro;
    }
  }


  return mensagemPadrao;
}


/* ============================================================
   EXTRAIR EQUIPES
============================================================ */

function extrairEquipes(
  dados: unknown,
): EquipeBackend[] {
  if (
    Array.isArray(
      dados,
    )
  ) {
    return dados as EquipeBackend[];
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
      return objeto.equipes as EquipeBackend[];
    }


    if (
      Array.isArray(
        objeto.data,
      )
    ) {
      return objeto.data as EquipeBackend[];
    }
  }


  return [];
}


/* ============================================================
   EXTRAIR PARTIDAS
============================================================ */

function extrairPartidas(
  dados: unknown,
): PartidaBackend[] {
  if (
    Array.isArray(
      dados,
    )
  ) {
    return dados as PartidaBackend[];
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
   RESUMO DA EQUIPE
============================================================ */

function calcularResumoEquipe(
  equipeId: number,

  partidas:
    PartidaBackend[],
): ResumoEquipe {
  /*
    Só entram no desempenho partidas que já possuem placar.

    Isso também aceita partidas antigas que tenham placar,
    mesmo se o status antigo ainda estiver como AGENDADA.
  */

  const partidasComResultado =
    partidas.filter(
      (partida) =>
        partida.equipeId ===
          equipeId &&
        partida.golsEquipe !==
          null &&
        partida.golsEquipe !==
          undefined &&
        partida.golsAdversario !==
          null &&
        partida.golsAdversario !==
          undefined,
    );


  let vitorias = 0;

  let empates = 0;

  let derrotas = 0;

  let pontosFeitos = 0;

  let pontosSofridos = 0;


  partidasComResultado.forEach(
    (partida) => {
      const feitos =
        Number(
          partida.golsEquipe,
        );


      const sofridos =
        Number(
          partida.golsAdversario,
        );


      pontosFeitos +=
        feitos;


      pontosSofridos +=
        sofridos;


      if (
        feitos > sofridos
      ) {
        vitorias += 1;

      } else if (
        feitos === sofridos
      ) {
        empates += 1;

      } else {
        derrotas += 1;
      }
    },
  );


  const jogos =
    partidasComResultado.length;


  /*
    Vitória = 3 pontos
    Empate = 1 ponto

    É apenas um indicador percentual para comparação.
  */

  const pontosPossiveis =
    jogos * 3;


  const pontosObtidos =
    vitorias * 3 +
    empates;


  const aproveitamento =
    pontosPossiveis > 0
      ? Math.round(
          (
            pontosObtidos /
            pontosPossiveis
          ) * 100,
        )
      : 0;


  return {
    jogos,

    vitorias,

    empates,

    derrotas,

    pontosFeitos,

    pontosSofridos,

    saldo:
      pontosFeitos -
      pontosSofridos,

    aproveitamento,
  };
}


/* ============================================================
   ESTATÍSTICAS
============================================================ */

function criarEstatisticas(
  resumo: ResumoEquipe,
): EstatisticaEquipe[] {
  return [
    {
      nome:
        'Jogos disputados',

      valor:
        resumo.jogos,

      formato:
        'numero',
    },

    {
      nome:
        'Vitórias',

      valor:
        resumo.vitorias,

      formato:
        'numero',
    },

    {
      nome:
        'Empates',

      valor:
        resumo.empates,

      formato:
        'numero',
    },

    {
      nome:
        'Derrotas',

      valor:
        resumo.derrotas,

      formato:
        'numero',
    },

    {
      nome:
        'Pontos / gols feitos',

      valor:
        resumo.pontosFeitos,

      formato:
        'numero',
    },

    {
      nome:
        'Pontos / gols sofridos',

      valor:
        resumo.pontosSofridos,

      formato:
        'numero',
    },

    {
      nome:
        'Saldo',

      valor:
        resumo.saldo,

      formato:
        'numero',
    },

    {
      nome:
        'Aproveitamento',

      valor:
        resumo.aproveitamento,

      formato:
        'porcentagem',
    },
  ];
}


/* ============================================================
   COMPONENTE
============================================================ */

export default function Comparacoes() {
  const navigate =
    useNavigate();


  const [
    equipes,
    setEquipes,
  ] =
    useState<
      EquipeBackend[]
    >([]);


  const [
    partidas,
    setPartidas,
  ] =
    useState<
      PartidaBackend[]
    >([]);


  const [
    equipeAId,
    setEquipeAId,
  ] =
    useState<
      number | null
    >(null);


  const [
    equipeBId,
    setEquipeBId,
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
     CARREGAR EQUIPES + PARTIDAS
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


        if (
          respostaEquipes.status ===
            401 ||
          respostaPartidas.status ===
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
          listaPartidas,
        );


        if (
          listaEquipes.length >=
          1
        ) {
          setEquipeAId(
            listaEquipes[0]
              .id,
          );
        }


        if (
          listaEquipes.length >=
          2
        ) {
          setEquipeBId(
            listaEquipes[1]
              .id,
          );
        }

      } catch (error) {
        console.error(
          'Erro em comparações:',
          error,
        );


        setErro(
          error instanceof Error
            ? error.message
            : 'Não foi possível carregar os dados.',
        );


        setEquipes([]);

        setPartidas([]);

      } finally {
        setCarregando(
          false,
        );
      }
    }


    carregarDados();

  }, [navigate]);


  /* ============================================================
     EQUIPES SELECIONADAS
  ============================================================ */

  const equipeA =
    useMemo(() => {
      return (
        equipes.find(
          (equipe) =>
            equipe.id ===
            equipeAId,
        ) ?? null
      );

    }, [
      equipes,
      equipeAId,
    ]);


  const equipeB =
    useMemo(() => {
      return (
        equipes.find(
          (equipe) =>
            equipe.id ===
            equipeBId,
        ) ?? null
      );

    }, [
      equipes,
      equipeBId,
    ]);


  /* ============================================================
     RESUMOS
  ============================================================ */

  const resumoA =
    useMemo(() => {
      if (
        equipeAId ===
        null
      ) {
        return null;
      }


      return calcularResumoEquipe(
        equipeAId,

        partidas,
      );

    }, [
      equipeAId,
      partidas,
    ]);


  const resumoB =
    useMemo(() => {
      if (
        equipeBId ===
        null
      ) {
        return null;
      }


      return calcularResumoEquipe(
        equipeBId,

        partidas,
      );

    }, [
      equipeBId,
      partidas,
    ]);


  /* ============================================================
     ESTATÍSTICAS
  ============================================================ */

  const estatisticasA =
    useMemo(() => {
      if (!resumoA) {
        return [];
      }


      return criarEstatisticas(
        resumoA,
      );

    }, [resumoA]);


  const estatisticasB =
    useMemo(() => {
      if (!resumoB) {
        return [];
      }


      return criarEstatisticas(
        resumoB,
      );

    }, [resumoB]);


  /* ============================================================
     ALTERAR EQUIPES
  ============================================================ */

  function alterarEquipeA(
    id: number,
  ) {
    if (
      id === equipeBId
    ) {
      return;
    }


    setEquipeAId(id);
  }


  function alterarEquipeB(
    id: number,
  ) {
    if (
      id === equipeAId
    ) {
      return;
    }


    setEquipeBId(id);
  }


  function inverterEquipes() {
    if (
      equipeAId ===
        null ||
      equipeBId ===
        null
    ) {
      return;
    }


    const antigaA =
      equipeAId;


    setEquipeAId(
      equipeBId,
    );


    setEquipeBId(
      antigaA,
    );
  }


  /* ============================================================
     FORMATAR
  ============================================================ */

  function formatarValor(
    estatistica:
      EstatisticaEquipe,
  ) {
    if (
      estatistica.formato ===
      'porcentagem'
    ) {
      return `${estatistica.valor}%`;
    }


    return estatistica.valor;
  }


  /* ============================================================
     BARRAS
  ============================================================ */

  function calcularBarra(
    valorA: number,

    valorB: number,
  ) {
    const absolutoA =
      Math.abs(
        valorA,
      );


    const absolutoB =
      Math.abs(
        valorB,
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
  }


  /* ============================================================
     RENDER
  ============================================================ */

  return (
    <main
      className={
        styles.page
      }
    >

      {/* CABEÇALHO */}

      <div
        className={
          styles.pageHeader
        }
      >
        <h1>
          Suas{' '}
          <em>comparações.</em>
        </h1>

        <p>
          Compare o desempenho entre duas equipes.
        </p>
      </div>


      {/* CARREGANDO */}

      {carregando && (

        <section
          className={
            styles.stateCard
          }
        >
          <h2>
            Carregando equipes...
          </h2>

          <p>
            Buscando os dados das suas equipes.
          </p>
        </section>

      )}


      {/* ERRO */}

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


      {/* NENHUMA EQUIPE */}

      {!carregando &&
        !erro &&
        equipes.length ===
          0 && (

        <section
          className={
            styles.stateCard
          }
        >
          <h2>
            Nenhuma equipe cadastrada
          </h2>

          <p>
            Cadastre equipes para começar a comparar.
          </p>
        </section>

      )}


      {/* SÓ UMA EQUIPE */}

      {!carregando &&
        !erro &&
        equipes.length ===
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
              <label>
                Equipe A
              </label>

              <select
                value={
                  equipeAId ??
                  ''
                }
                disabled
              >
                <option>
                  {
                    equipes[0]
                      .nome
                  }
                </option>
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
                Equipe B
              </label>

              <select
                value=""
                disabled
              >
                <option>
                  Cadastre outra equipe
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
              Falta mais uma equipe
            </h2>

            <p>
              É necessário ter pelo menos duas equipes cadastradas para comparar.
            </p>
          </section>
        </>

      )}


      {/* COMPARAÇÃO */}

      {!carregando &&
        !erro &&
        equipes.length >=
          2 &&
        equipeA &&
        equipeB &&
        resumoA &&
        resumoB && (

        <>

          {/* SELEÇÃO */}

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
                htmlFor="equipe-a"
              >
                Equipe A
              </label>


              <select
                id="equipe-a"
                value={
                  equipeAId ??
                  ''
                }
                onChange={(
                  event,
                ) =>
                  alterarEquipeA(
                    Number(
                      event.target
                        .value,
                    ),
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
                        equipe.id
                      }
                      disabled={
                        equipe.id ===
                        equipeBId
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


            <button
              type="button"
              className={
                styles.switchButton
              }
              onClick={
                inverterEquipes
              }
              title="Inverter equipes"
              aria-label="Inverter equipes"
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
                htmlFor="equipe-b"
              >
                Equipe B
              </label>


              <select
                id="equipe-b"
                value={
                  equipeBId ??
                  ''
                }
                onChange={(
                  event,
                ) =>
                  alterarEquipeB(
                    Number(
                      event.target
                        .value,
                    ),
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
                        equipe.id
                      }
                      disabled={
                        equipe.id ===
                        equipeAId
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

          </section>


          {/* CARD COMPARAÇÃO */}

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

              {/* EQUIPE A */}

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
                  Equipe A
                </span>


                <h2>
                  {
                    equipeA.nome
                  }
                </h2>


                <div
                  className={
                    styles.teamSummary
                  }
                >
                  <strong>
                    {
                      resumoA.vitorias
                    }
                  </strong>

                  <span>
                    vitórias em{' '}
                    {
                      resumoA.jogos
                    }{' '}
                    jogo(s)
                  </span>
                </div>


                <div
                  className={
                    styles.matchMeta
                  }
                >
                  <span>
                    {
                      equipeA.modalidade
                    }
                  </span>

                  {equipeA.categoria && (
                    <span>
                      {
                        equipeA.categoria
                      }
                    </span>
                  )}
                </div>

              </div>


              {/* EQUIPE B */}

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
                  Equipe B
                </span>


                <h2>
                  {
                    equipeB.nome
                  }
                </h2>


                <div
                  className={
                    styles.teamSummary
                  }
                >
                  <strong>
                    {
                      resumoB.vitorias
                    }
                  </strong>

                  <span>
                    vitórias em{' '}
                    {
                      resumoB.jogos
                    }{' '}
                    jogo(s)
                  </span>
                </div>


                <div
                  className={
                    styles.matchMeta
                  }
                >
                  <span>
                    {
                      equipeB.modalidade
                    }
                  </span>

                  {equipeB.categoria && (
                    <span>
                      {
                        equipeB.categoria
                      }
                    </span>
                  )}
                </div>

              </div>

            </div>


            <div
              className={
                styles.divider
              }
            />


            {/* ESTATÍSTICAS */}

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
                          {
                            formatarValor(
                              estatisticaA,
                            )
                          }
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
                          {
                            formatarValor(
                              estatisticaB,
                            )
                          }
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
}