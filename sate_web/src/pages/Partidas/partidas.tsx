import styles from "./partidas.module.css";

const partidas = [
  {
    confronto: "Falcões FC vs Tigres FC",
    modalidade: "Futebol",
    data: "18/06/2026",
    resultado: "4 - 4",
    status: "Analisada",
    tipo: "analisada",
  },
  {
    confronto: "Águias Basquete vs Panteras",
    modalidade: "Basquete",
    data: "18/06/2026",
    resultado: "88 - 76",
    status: "Analisada",
    tipo: "analisada",
  },
  {
    confronto: "Fúria Vôlei vs Ventania Vôlei",
    modalidade: "Vôlei",
    data: "18/06/2026",
    resultado: "2 - 4",
    status: "Em Análise",
    tipo: "analise",
  },
  {
    confronto: "Leões Rugby vs Touros Rugby",
    modalidade: "Rugby",
    data: "18/06/2026",
    resultado: "21 - 34",
    status: "Pendente",
    tipo: "pendente",
  },
  {
    confronto: "Falcões FC vs Cobras FC",
    modalidade: "Futebol",
    data: "18/06/2026",
    resultado: "1 - 4",
    status: "Analisada",
    tipo: "analisada",
  },
];

export default function Partidas() {
  return (
    <div className={styles.page}>

      {/* TÍTULO */}
      <div className={styles.titleRow}>
        <h2>Partidas</h2>

        <button className={styles.newButton}>
          <span>＋</span>
          Nova Partida
        </button>
      </div>

      {/* FILTROS */}
      <div className={styles.filters}>

        <select defaultValue="todas">
          <option value="todas">Todas as equipes</option>
          <option>Falcões FC</option>
          <option>Tigres FC</option>
          <option>Cobras FC</option>
        </select>

        <select defaultValue="modalidades">
          <option value="modalidades">Todas as modalidades</option>
          <option>Futebol</option>
          <option>Basquete</option>
          <option>Vôlei</option>
          <option>Rugby</option>
        </select>

        <div className={styles.dateInput}>
          <span>▣</span>

          <input
            type="text"
            placeholder="Data"
          />

          <span>⌄</span>
        </div>

        <select defaultValue="2026">
          <option value="2026">Temporada 2026</option>
          <option>Temporada 2025</option>
          <option>Temporada 2024</option>
        </select>

      </div>

      {/* TABELA */}
      <div className={styles.tableContainer}>

        <table>

          <thead>
            <tr>
              <th>CONFRONTO</th>
              <th>MODALIDADE</th>
              <th>DATA</th>
              <th>RESULTADO</th>
              <th>STATUS</th>
              <th></th>
            </tr>
          </thead>

          <tbody>

            {partidas.map((partida, index) => (

              <tr key={index}>

                <td className={styles.confronto}>
                  {partida.confronto}
                </td>

                <td>
                  {partida.modalidade}
                </td>

                <td>
                  {partida.data}
                </td>

                <td className={styles.resultado}>
                  {partida.resultado}
                </td>

                <td>

                  <span
                    className={`${styles.status} ${
                      styles[partida.tipo as keyof typeof styles]
                    }`}
                  >
                    {partida.status}
                  </span>

                </td>

                <td>

                  <button className={styles.details}>
                    ›
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}