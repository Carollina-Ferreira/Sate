import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./partidas2.module.css";

type PartidaRecebida = {
  confronto: string;
  modalidade: string;
  data: string;
  resultado: string;
  status: string;
  tipo: string;
  temporada: string;
};

const eventos = [
  {
    horario: "22:54",
    tipo: "Gol",
    atleta: "Rafael Souza",
    cor: "verde",
  },
  {
    horario: "22:54",
    tipo: "Erro",
    atleta: "Bruno Alves",
    cor: "vermelho",
  },
  {
    horario: "22:54",
    tipo: "Finalização",
    atleta: "Rafael Souza",
    cor: "azul",
  },
  {
    horario: "22:54",
    tipo: "Falta",
    atleta: "Igor Tavares",
    cor: "laranja",
  },
  {
    horario: "22:54",
    tipo: "Gol",
    atleta: "Bruno Alves",
    cor: "verde",
  },
  {
    horario: "22:54",
    tipo: "Assistência",
    atleta: "Rafael Souza",
    cor: "verde",
  },
  {
    horario: "22:54",
    tipo: "Contra-Ataque",
    atleta: "Rafael Souza",
    cor: "amarelo",
  },
];

const videos = [
  {
    titulo: "Gol de Rafael Souza",
    horario: "22:54",
    tipo: "Gol",
    classe: "gol",
  },
  {
    titulo: "Gol de Rafael Souza",
    horario: "22:54",
    tipo: "Gol",
    classe: "gol",
  },
  {
    titulo: "Gol de Rafael Souza",
    horario: "22:54",
    tipo: "Destaque",
    classe: "destaque",
  },
];

const atletas = [
  {
    iniciais: "RS",
    nome: "Rafael Souza",
  },
  {
    iniciais: "BA",
    nome: "Bruno Alves",
  },
  {
    iniciais: "IT",
    nome: "Igor Tavares",
  },
];

export default function DetalhesDaPartida() {
  const navigate = useNavigate();
  const location = useLocation();

  const partida =
    location.state?.partida as
      | PartidaRecebida
      | undefined;

  const [videoSelecionado, setVideoSelecionado] =
    useState<number | null>(null);

  const voltarParaPartidas = () => {
    navigate("/partidas");
  };

  /*
    Caso a página seja aberta diretamente pela URL,
    usamos estes dados como padrão.
  */
  const confronto =
    partida?.confronto ||
    "Falcões FC vs Tigres FC";

  const modalidade =
    partida?.modalidade || "Futebol";

  const data =
    partida?.data || "18/06/2026";

  const resultado =
    partida?.resultado || "3 - 1";

  const status =
    partida?.status || "Analisada";

  const equipes = confronto.split(" vs ");

  const equipeCasa =
    equipes[0] || "Falcões FC";

  const equipeVisitante =
    equipes[1] || "Tigres FC";

  return (
    <div className={styles.page}>

      {/* VOLTAR */}
      <button
        className={styles.backButton}
        onClick={voltarParaPartidas}
      >
        <span>‹</span>
        Voltar para partidas
      </button>

      {/* PLACAR */}
      <section className={styles.scoreCard}>

        <div className={styles.team}>
          <div className={styles.teamIcon}>
            {equipeCasa
              .split(" ")
              .map((item) => item[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </div>

          <strong>{equipeCasa}</strong>
        </div>

        <div className={styles.scoreCenter}>

          <div className={styles.score}>
            {resultado}
          </div>

          <div className={styles.matchInfo}>
            <span>{data}</span>
            <span className={styles.separator}>
              •
            </span>
            <span>{modalidade}</span>
          </div>

          <span className={styles.status}>
            {status}
          </span>

        </div>

        <div className={styles.team}>
          <div className={styles.teamIcon}>
            {equipeVisitante
              .split(" ")
              .map((item) => item[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </div>

          <strong>{equipeVisitante}</strong>
        </div>

      </section>

      {/* EVENTOS + MOMENTOS */}
      <div className={styles.contentGrid}>

        {/* EVENTOS */}
        <section className={styles.card}>

          <div className={styles.cardHeader}>
            <h3>
              Eventos Registrando
            </h3>
          </div>

          <div className={styles.eventsList}>

            {eventos.map(
              (evento, index) => (
                <div
                  className={styles.eventRow}
                  key={index}
                >

                  <span
                    className={styles.eventTime}
                  >
                    {evento.horario}
                  </span>

                  <span
                    className={`${styles.eventDot} ${
                      styles[evento.cor]
                    }`}
                  />

                  <span
                    className={styles.eventType}
                  >
                    {evento.tipo}
                  </span>

                  <span
                    className={
                      styles.eventAthlete
                    }
                  >
                    {evento.atleta}
                  </span>

                </div>
              )
            )}

          </div>

        </section>

        {/* MOMENTOS */}
        <section className={styles.card}>

          <div className={styles.cardHeader}>
            <h3>
              Momentos Registrados
            </h3>
          </div>

          <div className={styles.videosList}>

            {videos.map(
              (video, index) => (
                <div
                  className={styles.videoItem}
                  key={index}
                >

                  <button
                    className={
                      styles.videoPreview
                    }
                    onClick={() =>
                      setVideoSelecionado(
                        index
                      )
                    }
                  >
                    <span
                      className={
                        styles.playIcon
                      }
                    >
                      ▶
                    </span>
                  </button>

                  <div
                    className={
                      styles.videoInfo
                    }
                  >

                    <div
                      className={
                        styles.videoTitleRow
                      }
                    >
                      <strong>
                        {video.titulo}
                      </strong>

                      <span>
                        {video.horario}
                      </span>
                    </div>

                    <span
                      className={`${styles.videoTag} ${
                        styles[video.classe]
                      }`}
                    >
                      <span
                        className={
                          styles.tagDot
                        }
                      />

                      {video.tipo}
                    </span>

                  </div>

                </div>
              )
            )}

          </div>

        </section>

      </div>

      {/* ATLETAS */}
      <section
        className={`${styles.card} ${styles.athletesCard}`}
      >

        <div className={styles.cardHeader}>
          <h3>
            Atletas participantes
          </h3>
        </div>

        <div className={styles.athletesList}>

          {atletas.map(
            (atleta, index) => (
              <div
                className={styles.athlete}
                key={index}
              >

                <div
                  className={
                    styles.athleteAvatar
                  }
                >
                  {atleta.iniciais}
                </div>

                <strong>
                  {atleta.nome}
                </strong>

              </div>
            )
          )}

        </div>

      </section>

      {/* MODAL DO VÍDEO */}
      {videoSelecionado !== null && (
        <div
          className={
            styles.videoModalOverlay
          }
          onClick={() =>
            setVideoSelecionado(null)
          }
        >

          <div
            className={styles.videoModal}
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <button
              className={styles.closeModal}
              onClick={() =>
                setVideoSelecionado(null)
              }
            >
              ×
            </button>

            <div
              className={styles.fakeVideo}
            >
              <span
                className={styles.bigPlay}
              >
                ▶
              </span>
            </div>

            <h3>
              {
                videos[
                  videoSelecionado
                ].titulo
              }
            </h3>

            <p>
              Momento registrado às{" "}
              {
                videos[
                  videoSelecionado
                ].horario
              }
            </p>

          </div>

        </div>
      )}

    </div>
  );
}