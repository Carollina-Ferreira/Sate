import styles from './equipes.module.css';
import CardEquipe from '../../components/CardEquipe/cardEquipe';

import Futebol from '../../assets/img/futebol_img.png';
import Basquete from '../../assets/img/basquete_img.png';
import Volei from '../../assets/img/volei_img.png';
import Rugby from '../../assets/img/rugby_img.png';

const Equipes = () => {
    return (
        <div className={styles.page}>

            {/* CABEÇALHO DA PÁGINA */}
            <div className={styles.header}>

                <div className={styles.headerText}>
                    <h1 className={styles.title}>
                        Minhas Equipes
                    </h1>

                    <p className={styles.description}>
                        Gerencie seus times, acompanhe métricas de performance e organize seu
                        portfólio de atletas em um só lugar.
                    </p>
                </div>

                <button className={styles.newTeamButton}>
                    <span className={styles.plus}>+</span>
                    Nova Equipe
                </button>

            </div>


            {/* FILTROS DE MODALIDADE */}
            <div className={styles.filters}>

                <button
                    className={`${styles.filterButton} ${styles.active}`}
                >
                    <span className={styles.filterIcon}>⚽</span>
                    Todos
                </button>

                <button className={styles.filterButton}>
                    <span className={styles.filterIcon}>⚽</span>
                    Futebol
                </button>

                <button className={styles.filterButton}>
                    <span className={styles.filterIcon}>🏀</span>
                    Basquete
                </button>

                <button className={styles.filterButton}>
                    <span className={styles.filterIcon}>🏐</span>
                    Vôlei
                </button>

                <button className={styles.filterButton}>
                    <span className={styles.filterIcon}>🏉</span>
                    Rugby
                </button>

                <button className={styles.filterButton}>
                    <span className={styles.filterIcon}>🎾</span>
                    Tênis
                </button>

            </div>


            {/* ÁREA DOS CARDS */}
            <div className={styles.teamsGrid}>

                {/* FUTEBOL */}
                <CardEquipe
                    nome="Falcões FC"
                    modalidade="Futebol"
                    categoria="Principal"
                    atletas={24}
                    imagem={Futebol}
                    icone="sports_soccer"
                    cor="#1674B8"
                    vitorias={7}
                    empates={2}
                    derrotas={3}
                    proximaPartida="vs Tigres do Vale (Sáb, 16h)"
                />

                {/* BASQUETE */}
                <CardEquipe
                    nome="Falcões FC"
                    modalidade="Basquete"
                    categoria="Principal"
                    atletas={24}
                    imagem={Basquete}
                    icone="sports_basketball"
                    cor="#D9822B"
                    vitorias={6}
                    empates={10}
                    derrotas={8}
                    proximaPartida="vs Tigres do Vale (Sáb, 16h)"
                />

                {/* VÔLEI */}
                <CardEquipe
                    nome="Falcões FC"
                    modalidade="Vôlei"
                    categoria="Principal"
                    atletas={24}
                    imagem={Volei}
                    icone="sports_volleyball"
                    cor="#B6B51A"
                    vitorias={12}
                    empates="-"
                    derrotas={4}
                    proximaPartida="vs Tigres do Vale (Sáb, 16h)"
                />

                {/* RUGBY */}
                <CardEquipe
                    nome="Poli Rugby"
                    modalidade="Rugby"
                    categoria="Principal"
                    atletas={22}
                    imagem={Rugby}
                    icone="sports_rugby"
                    cor="#16A875"
                    vitorias={8}
                    empates={1}
                    derrotas={2}
                    proximaPartida="vs Spartans (Dom, 14h)"
                />

            </div>

        </div>
    );
};

export default Equipes;