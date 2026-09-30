import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./partidas.module.css";

type TipoStatus = "analisada" | "analise" | "pendente";

type Partida = {
  confronto: string;
  modalidade: string;
  data: string;
  resultado: string;
  status: string;
  tipo: TipoStatus;
  temporada: string;
};

const partidasIniciais: Partida[] = [
  {
    confronto: "Falcões FC vs Tigres FC",
    modalidade: "Futebol",
    data: "18/06/2026",
    resultado: "4 - 4",
    status: "Analisada",
    tipo: "analisada",
    temporada: "2026",
  },
  {
    confronto: "Águias Basquete vs Panteras",
    modalidade: "Basquete",
    data: "18/06/2026",
    resultado: "88 - 76",
    status: "Analisada",
    tipo: "analisada",
    temporada: "2026",
  },
  {
    confronto: "Fúria Vôlei vs Ventania Vôlei",
    modalidade: "Vôlei",
    data: "18/06/2026",
    resultado: "2 - 4",
    status: "Em Análise",
    tipo: "analise",
    temporada: "2026",
  },
  {
    confronto: "Leões Rugby vs Touros Rugby",
    modalidade: "Rugby",
    data: "18/06/2026",
    resultado: "21 - 34",
    status: "Pendente",
    tipo: "pendente",
    temporada: "2026",
  },
  {
    confronto: "Falcões FC vs Cobras FC",
    modalidade: "Futebol",
    data: "18/06/2026",
    resultado: "1 - 4",
    status: "Analisada",
    tipo: "analisada",
    temporada: "2026",
  },
];

const STORAGE_KEY = "sate_partidas";

export default function Partidas() {
  const navigate = useNavigate();

  const [partidas, setPartidas] =
    useState<Partida[]>(partidasIniciais);

  const [equipeFiltro, setEquipeFiltro] =
    useState("todas");

  const [modalidadeFiltro, setModalidadeFiltro] =
    useState("modalidades");

  const [dataFiltro, setDataFiltro] =
    useState("");

  const [temporadaFiltro, setTemporadaFiltro] =
    useState("2026");

  const [mostrarModal, setMostrarModal] =
    useState(false);

  const [novaPartida, setNovaPartida] = useState({
    equipeCasa: "",
    equipeVisitante: "",
    modalidade: "Futebol",
    data: "",
    resultadoCasa: "",
    resultadoVisitante: "",
    temporada: "2026",
  });

  /* =========================
     CARREGAR PARTIDAS SALVAS
  ========================= */

  useEffect(() => {
    try {
      const partidasSalvas =
        localStorage.getItem(STORAGE_KEY);

      if (partidasSalvas) {
        const dados = JSON.parse(partidasSalvas);

        if (Array.isArray(dados)) {
          setPartidas(dados);
        }
      }
    } catch (error) {
      console.error(
        "Erro ao carregar partidas:",
        error
      );
    }
  }, []);

  /* =========================
     SALVAR PARTIDAS
  ========================= */

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(partidas)
      );
    } catch (error) {
      console.error(
        "Erro ao salvar partidas:",
        error
      );
    }
  }, [partidas]);

  /* =========================
     FILTROS
  ========================= */

  const partidasFiltradas = partidas.filter(
    (partida) => {
      const equipeOk =
        equipeFiltro === "todas" ||
        partida.confronto
          .toLowerCase()
          .includes(equipeFiltro.toLowerCase());

      const modalidadeOk =
        modalidadeFiltro === "modalidades" ||
        partida.modalidade === modalidadeFiltro;

      const dataOk =
        dataFiltro === "" ||
        partida.data === formatarData(dataFiltro);

      const temporadaOk =
        temporadaFiltro === "todas" ||
        partida.temporada === temporadaFiltro;

      return (
        equipeOk &&
        modalidadeOk &&
        dataOk &&
        temporadaOk
      );
    }
  );

  /* =========================
     FORMULÁRIO
  ========================= */

  function atualizarNovaPartida(
    campo: keyof typeof novaPartida,
    valor: string
  ) {
    setNovaPartida((anterior) => ({
      ...anterior,
      [campo]: valor,
    }));
  }

  /* =========================
     ABRIR MODAL
  ========================= */

  function abrirModal() {
    setMostrarModal(true);
  }

  /* =========================
     FECHAR MODAL
  ========================= */

  function fecharModal() {
    setMostrarModal(false);
  }

  /* =========================
     CRIAR PARTIDA
  ========================= */

  function criarPartida() {
    if (
      !novaPartida.equipeCasa.trim() ||
      !novaPartida.equipeVisitante.trim() ||
      !novaPartida.data
    ) {
      alert(
        "Preencha a equipe da casa, equipe visitante e a data."
      );
      return;
    }

    const resultadoCasa =
      novaPartida.resultadoCasa.trim() || "0";

    const resultadoVisitante =
      novaPartida.resultadoVisitante.trim() || "0";

    const nova: Partida = {
      confronto: `${novaPartida.equipeCasa} vs ${novaPartida.equipeVisitante}`,
      modalidade: novaPartida.modalidade,
      data: formatarData(novaPartida.data),
      resultado: `${resultadoCasa} - ${resultadoVisitante}`,
      status: "Pendente",
      tipo: "pendente",
      temporada: novaPartida.temporada,
    };

    setPartidas((anterior) => [
      nova,
      ...anterior,
    ]);

    setEquipeFiltro("todas");
    setModalidadeFiltro("modalidades");
    setDataFiltro("");
    setTemporadaFiltro(
      novaPartida.temporada
    );

    setNovaPartida({
      equipeCasa: "",
      equipeVisitante: "",
      modalidade: "Futebol",
      data: "",
      resultadoCasa: "",
      resultadoVisitante: "",
      temporada: "2026",
    });

    setMostrarModal(false);
  }

  /* =========================
     FORMATAR DATA
  ========================= */

  function formatarData(data: string) {
    if (!data) return "";

    const partes = data.split("-");

    if (partes.length !== 3) {
      return data;
    }

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  }

  /* =========================
     DETALHES
  ========================= */

  function abrirDetalhes(partida: Partida) {
    navigate("/detalhes-partida", {
      state: {
        partida,
      },
    });
  }

  return (
    <div className={styles.page}>
      {/* =========================
          TÍTULO
      ========================= */}

      <div className={styles.titleRow}>
        <div>
          <h2>Partidas</h2>

          <p>
            Gerencie e acompanhe as partidas
            analisadas.
          </p>
        </div>

        <button
          type="button"
          className={styles.newButton}
          onClick={abrirModal}
        >
          + Nova Partida
        </button>
      </div>

      {/* =========================
          FILTROS
      ========================= */}

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

          <option value="Falcões">
            Falcões
          </option>

          <option value="Tigres">
            Tigres
          </option>

          <option value="Águias">
            Águias
          </option>

          <option value="Panteras">
            Panteras
          </option>

          <option value="Fúria">
            Fúria
          </option>

          <option value="Ventania">
            Ventania
          </option>

          <option value="Leões">
            Leões
          </option>

          <option value="Touros">
            Touros
          </option>
        </select>

        <select
          value={modalidadeFiltro}
          onChange={(event) =>
            setModalidadeFiltro(
              event.target.value
            )
          }
        >
          <option value="modalidades">
            Todas as modalidades
          </option>

          <option value="Futebol">
            Futebol
          </option>

          <option value="Basquete">
            Basquete
          </option>

          <option value="Vôlei">
            Vôlei
          </option>

          <option value="Rugby">
            Rugby
          </option>
        </select>

        <input
          type="date"
          value={dataFiltro}
          onChange={(event) =>
            setDataFiltro(event.target.value)
          }
        />

        <select
          value={temporadaFiltro}
          onChange={(event) =>
            setTemporadaFiltro(
              event.target.value
            )
          }
        >
          <option value="todas">
            Todas as temporadas
          </option>

          <option value="2026">
            2026
          </option>

          <option value="2025">
            2025
          </option>

          <option value="2024">
            2024
          </option>
        </select>
      </div>

      {/* =========================
          TABELA
      ========================= */}

      <div className={styles.tableContainer}>
        <table>
          <thead>
            <tr>
              <th>Confronto</th>
              <th>Modalidade</th>
              <th>Data</th>
              <th>Resultado</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {partidasFiltradas.map(
              (partida, index) => (
                <tr
                  key={`${partida.confronto}-${partida.data}-${index}`}
                >
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
                      className={
                        styles[partida.tipo]
                      }
                    >
                      {partida.status}
                    </span>
                  </td>

                  <td>
                    <button
                      type="button"
                      className={styles.details}
                      onClick={() =>
                        abrirDetalhes(partida)
                      }
                      title="Ver detalhes"
                      aria-label="Ver detalhes da partida"
                    >
                      ›
                    </button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>

        {partidasFiltradas.length === 0 && (
          <div className={styles.empty}>
            <h3>
              Nenhuma partida encontrada
            </h3>

            <p>
              Tente alterar os filtros ou
              adicionar uma nova partida.
            </p>
          </div>
        )}
      </div>

      {/* =========================
          MODAL NOVA PARTIDA
      ========================= */}

      {mostrarModal && (
        <div
          className={styles.modalOverlay}
          onClick={fecharModal}
        >
          <div
            className={styles.modal}
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className={styles.modalHeader}>
              <div>
                <h3>Nova Partida</h3>
              </div>

              <button
                type="button"
                className={styles.closeButton}
                onClick={fecharModal}
              >
                ×
              </button>
            </div>

            <div className={styles.form}>
              <div className={styles.formGroup}>
                <label>
                  Equipe da casa
                </label>

                <input
                  type="text"
                  placeholder="Ex.: Falcões FC"
                  value={
                    novaPartida.equipeCasa
                  }
                  onChange={(event) =>
                    atualizarNovaPartida(
                      "equipeCasa",
                      event.target.value
                    )
                  }
                />
              </div>

              <div className={styles.formGroup}>
                <label>
                  Equipe visitante
                </label>

                <input
                  type="text"
                  placeholder="Ex.: Tigres FC"
                  value={
                    novaPartida.equipeVisitante
                  }
                  onChange={(event) =>
                    atualizarNovaPartida(
                      "equipeVisitante",
                      event.target.value
                    )
                  }
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>
                    Modalidade
                  </label>

                  <select
                    value={
                      novaPartida.modalidade
                    }
                    onChange={(event) =>
                      atualizarNovaPartida(
                        "modalidade",
                        event.target.value
                      )
                    }
                  >
                    <option value="Futebol">
                      Futebol
                    </option>

                    <option value="Basquete">
                      Basquete
                    </option>

                    <option value="Vôlei">
                      Vôlei
                    </option>

                    <option value="Rugby">
                      Rugby
                    </option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label>
                    Data
                  </label>

                  <input
                    type="date"
                    value={
                      novaPartida.data
                    }
                    onChange={(event) =>
                      atualizarNovaPartida(
                        "data",
                        event.target.value
                      )
                    }
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>
                    Placar da casa
                  </label>

                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={
                      novaPartida.resultadoCasa
                    }
                    onChange={(event) =>
                      atualizarNovaPartida(
                        "resultadoCasa",
                        event.target.value
                      )
                    }
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>
                    Placar visitante
                  </label>

                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={
                      novaPartida.resultadoVisitante
                    }
                    onChange={(event) =>
                      atualizarNovaPartida(
                        "resultadoVisitante",
                        event.target.value
                      )
                    }
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>
                    Temporada
                  </label>

                  <select
                    value={
                      novaPartida.temporada
                    }
                    onChange={(event) =>
                      atualizarNovaPartida(
                        "temporada",
                        event.target.value
                      )
                    }
                  >
                    <option value="2026">
                      2026
                    </option>

                    <option value="2025">
                      2025
                    </option>

                    <option value="2024">
                      2024
                    </option>
                  </select>
                </div>
              </div>
            </div>

            <div className={styles.modalActions}>
              <button
                type="button"
                className={styles.cancelButton}
                onClick={fecharModal}
              >
                Cancelar
              </button>

              <button
                type="button"
                className={styles.saveButton}
                onClick={criarPartida}
              >
                Criar partida
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}