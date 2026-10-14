import styles from './cardEquipe.module.css';

interface CardEquipeProps {
  nome: string;
  modalidade: string;
  categoria: string;
  atletas: number;
  imagem: string;
  icone: string;
  cor: string;
  vitorias: number;
  empates: number | string;
  derrotas: number;
  proximaPartida: string;
}

const CardEquipe = ({
  nome,
  modalidade,
  categoria,
  atletas,
  imagem,
  icone,
  cor,
  vitorias,
  empates,
  derrotas,
  proximaPartida,
}: CardEquipeProps) => {
  const corEquipe = cor || '#16A875';

  return (
    <div className={styles.card}>
      {/* IMAGEM DA EQUIPE */}
      <div className={styles.imageContainer}>
        <img
          src={imagem}
          alt={`Imagem da equipe ${nome}`}
          className={styles.image}
        />

        {/* MODALIDADE */}
        <div
          className={styles.modality}
          style={{
            backgroundColor: corEquipe,
          }}
        >
          <span className="material-icons">
            sports
          </span>

          {modalidade}
        </div>

        {/* ÍCONE DE DESEMPENHO */}
        <div className={styles.topIcon}>
          <span className="material-icons">
            trending_up
          </span>
        </div>

        {/* ÍCONE DA MODALIDADE */}
        <div
          className={styles.sportIcon}
          style={{
            backgroundColor: '#FFFFFF',
          }}
        >
          <span
            className="material-icons"
            style={{
              color: corEquipe,
            }}
          >
            {icone}
          </span>
        </div>
      </div>

      {/* INFORMAÇÕES DA EQUIPE */}
      <div className={styles.content}>
        <div className={styles.teamInfo}>
          <h2>{nome}</h2>

          <div className={styles.details}>
            <span>{categoria}</span>
            <span>{atletas} Atletas</span>
          </div>
        </div>

        {/* ESTATÍSTICAS */}
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span>VITÓRIAS</span>
            <strong className={styles.victory}>
              {vitorias}
            </strong>
          </div>

          <div className={styles.stat}>
            <span>EMPATES</span>
            <strong>
              {empates}
            </strong>
          </div>

          <div className={styles.stat}>
            <span>DERROTAS</span>
            <strong className={styles.defeat}>
              {derrotas}
            </strong>
          </div>
        </div>
      </div>

      {/* PRÓXIMA PARTIDA */}
      <div className={styles.nextGame}>
        <div
          className={styles.calendar}
          style={{
            backgroundColor: '#FFFFFF',
          }}
        >
          <span
            className="material-icons"
            style={{
              color: corEquipe,
            }}
          >
            calendar_month
          </span>
        </div>

        <div>
          <span className={styles.nextLabel}>
            PRÓXIMA PARTIDA
          </span>

          <strong>
            {proximaPartida}
          </strong>
        </div>
      </div>
    </div>
  );
};

export default CardEquipe;