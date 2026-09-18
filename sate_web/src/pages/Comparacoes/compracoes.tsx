import { ArrowLeftRight } from 'lucide-react';
import { useMemo, useState } from 'react';

import styles from './comparacoes.module.css';

interface Estatistica {
  nome: string;
  valor: number;
  formato: 'numero' | 'porcentagem';
}

interface Partida {
  id: number;
  equipe: string;
  adversario: string;
  data: string;
  modalidade: string;
  estatisticas: Estatistica[];
}

const partidas: Partida[] = [
  {
    id: 1,
    equipe: 'Falcões FC',
    adversario: 'Tigres FC',
    data: '12/08/2026',
    modalidade: 'Futebol',
    estatisticas: [
      {
        nome: 'Posse de bola',
        valor: 58,
        formato: 'porcentagem',
      },
      {
        nome: 'Finalizações',
        valor: 14,
        formato: 'numero',
      },
      {
        nome: 'Passes certos',
        valor: 82,
        formato: 'porcentagem',
      },
      {
        nome: 'Faltas cometidas',
        valor: 6,
        formato: 'numero',
      },
      {
        nome: 'Eficiência ofensiva',
        valor: 74,
        formato: 'porcentagem',
      },
    ],
  },

  {
    id: 2,
    equipe: 'Águias Basquete',
    adversario: 'Panteras',
    data: '18/08/2026',
    modalidade: 'Basquete',
    estatisticas: [
      {
        nome: 'Posse de bola',
        valor: 46,
        formato: 'porcentagem',
      },
      {
        nome: 'Finalizações',
        valor: 9,
        formato: 'numero',
      },
      {
        nome: 'Passes certos',
        valor: 71,
        formato: 'porcentagem',
      },
      {
        nome: 'Faltas cometidas',
        valor: 11,
        formato: 'numero',
      },
      {
        nome: 'Eficiência ofensiva',
        valor: 58,
        formato: 'porcentagem',
      },
    ],
  },

  {
    id: 3,
    equipe: 'Poli Rugby',
    adversario: 'Jacareí Rugby',
    data: '24/08/2026',
    modalidade: 'Rugby',
    estatisticas: [
      {
        nome: 'Posse de bola',
        valor: 64,
        formato: 'porcentagem',
      },
      {
        nome: 'Finalizações',
        valor: 17,
        formato: 'numero',
      },
      {
        nome: 'Passes certos',
        valor: 76,
        formato: 'porcentagem',
      },
      {
        nome: 'Faltas cometidas',
        valor: 8,
        formato: 'numero',
      },
      {
        nome: 'Eficiência ofensiva',
        valor: 68,
        formato: 'porcentagem',
      },
    ],
  },

  {
    id: 4,
    equipe: 'Leões FC',
    adversario: 'Dragões FC',
    data: '29/08/2026',
    modalidade: 'Futebol',
    estatisticas: [
      {
        nome: 'Posse de bola',
        valor: 52,
        formato: 'porcentagem',
      },
      {
        nome: 'Finalizações',
        valor: 12,
        formato: 'numero',
      },
      {
        nome: 'Passes certos',
        valor: 79,
        formato: 'porcentagem',
      },
      {
        nome: 'Faltas cometidas',
        valor: 10,
        formato: 'numero',
      },
      {
        nome: 'Eficiência ofensiva',
        valor: 63,
        formato: 'porcentagem',
      },
    ],
  },
];

const Comparacoes = () => {
  const [partidaAId, setPartidaAId] = useState(1);
  const [partidaBId, setPartidaBId] = useState(2);

  const partidaA = useMemo(() => {
    return (
      partidas.find((partida) => partida.id === partidaAId) ??
      partidas[0]
    );
  }, [partidaAId]);

  const partidaB = useMemo(() => {
    return (
      partidas.find((partida) => partida.id === partidaBId) ??
      partidas[1]
    );
  }, [partidaBId]);

  const formatarValor = (estatistica: Estatistica) => {
    if (estatistica.formato === 'porcentagem') {
      return `${estatistica.valor}%`;
    }

    return estatistica.valor;
  };

  const calcularBarra = (
    valorA: number,
    valorB: number,
  ) => {
    const maiorValor = Math.max(valorA, valorB, 1);

    return {
      barraA: (valorA / maiorValor) * 100,
      barraB: (valorB / maiorValor) * 100,
    };
  };

  const inverterPartidas = () => {
    setPartidaAId(partidaBId);
    setPartidaBId(partidaAId);
  };

  return (
    <main className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1>Comparações</h1>

          <p>
            Compare o desempenho entre duas partidas.
          </p>
        </div>
      </div>

      <section className={styles.selectionCard}>
        <div className={styles.selectGroup}>
          <label htmlFor="partida-a">
            Partida A
          </label>

          <select
            id="partida-a"
            value={partidaAId}
            onChange={(event) =>
              setPartidaAId(Number(event.target.value))
            }
          >
            {partidas.map((partida) => (
              <option
                key={partida.id}
                value={partida.id}
                disabled={partida.id === partidaBId}
              >
                {partida.equipe} vs {partida.adversario}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          className={styles.switchButton}
          onClick={inverterPartidas}
          title="Inverter partidas"
        >
          <ArrowLeftRight size={18} />
        </button>

        <div className={styles.selectGroup}>
          <label htmlFor="partida-b">
            Partida B
          </label>

          <select
            id="partida-b"
            value={partidaBId}
            onChange={(event) =>
              setPartidaBId(Number(event.target.value))
            }
          >
            {partidas.map((partida) => (
              <option
                key={partida.id}
                value={partida.id}
                disabled={partida.id === partidaAId}
              >
                {partida.equipe} vs {partida.adversario}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className={styles.comparison}>
        <div className={styles.matchHeader}>
          <div className={styles.matchLeft}>
            <span className={styles.matchLabel}>
              Partida A
            </span>

            <h2>
              {partidaA.equipe}
              <span> vs </span>
              {partidaA.adversario}
            </h2>

            <div className={styles.matchMeta}>
              <span>{partidaA.modalidade}</span>
              <span>{partidaA.data}</span>
            </div>
          </div>

          <div className={styles.matchRight}>
            <span className={styles.matchLabel}>
              Partida B
            </span>

            <h2>
              {partidaB.equipe}
              <span> vs </span>
              {partidaB.adversario}
            </h2>

            <div className={styles.matchMeta}>
              <span>{partidaB.modalidade}</span>
              <span>{partidaB.data}</span>
            </div>
          </div>
        </div>

        <div className={styles.divider} />

        <div className={styles.stats}>
          {partidaA.estatisticas.map(
            (estatisticaA, index) => {
              const estatisticaB =
                partidaB.estatisticas[index];

              const { barraA, barraB } =
                calcularBarra(
                  estatisticaA.valor,
                  estatisticaB.valor,
                );

              return (
                <div
                  className={styles.statRow}
                  key={estatisticaA.nome}
                >
                  <div className={styles.statValues}>
                    <strong className={styles.valueA}>
                      {formatarValor(estatisticaA)}
                    </strong>

                    <span className={styles.statName}>
                      {estatisticaA.nome}
                    </span>

                    <strong className={styles.valueB}>
                      {formatarValor(estatisticaB)}
                    </strong>
                  </div>

                  <div className={styles.barArea}>
                    <div className={styles.barSideLeft}>
                      <div
                        className={styles.barA}
                        style={{
                          width: `${barraA}%`,
                        }}
                      />
                    </div>

                    <div className={styles.barCenter} />

                    <div className={styles.barSideRight}>
                      <div
                        className={styles.barB}
                        style={{
                          width: `${barraB}%`,
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
    </main>
  );
};

export default Comparacoes;