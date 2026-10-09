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
  return (
    <div className={styles.card}>

      {/* Imagem */}
      <div className={styles.imageContainer}>
        <img
          src={imagem}
          alt={`Imagem da equipe ${nome}`}
          className={styles.image}
        />

        {/* Modalidade */}
        <div
          className={styles.modality}
          style={{ backgroundColor: cor }}
        >
          <span className="material-icons">
            sports
          </span>

          {modalidade}
        </div>

        {/* Ícone superior direito */}
        <div className={styles.topIcon}>
          <span className="material-icons">
            trending_up
          </span>
        </div>

        {/* Ícone da modalidade */}
        <div className={styles.sportIcon}>
          <span className="material-icons">
            {icone}
          </span>
        </div>
      </div>

      {/* Informações da equipe */}
      <div className={styles.content}>

        <div className={styles.teamInfo}>
          <h2>{nome}</h2>

          <div className={styles.details}>
            <span>{categoria}</span>
            <span>{atletas} Atletas</span>
          </div>
        </div>

        {/* Estatísticas */}
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

      {/* Próxima partida */}
      <div className={styles.nextGame}>

        <div className={styles.calendar}>
          <span className="material-icons">
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