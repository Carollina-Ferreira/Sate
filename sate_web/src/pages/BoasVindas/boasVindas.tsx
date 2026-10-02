import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import styles from './boasVindas.module.css';

import logoSate from '../../assets/img/logo_grande.png';
import esportesImg from '../../assets/img/boas-vindas-esportes.png';

export default function BoasVindas() {
    const navigate = useNavigate();

    const handleComecar = () => {
        navigate('/selecao-esporte');
    };

    return (
        <main className={styles.container}>

            {/* Área verde */}
            <section className={styles.leftSide}>

                <img
                    src={logoSate}
                    alt="SATE"
                    className={styles.logo}
                />

                <div className={styles.content}>

                    <h1>
                        Bem-vindo, <span>Treinador!</span>
                    </h1>

                    <p>
                        Para começar, vamos configurar seu primeiro
                        registro. Escolha a modalidade e defina os campos
                        que serão utilizados para sua análise.
                    </p>

                    <button
                        type="button"
                        className={styles.startButton}
                        onClick={handleComecar}
                    >
                        <span>Começar</span>

                        <ArrowRight
                            size={22}
                            strokeWidth={2}
                        />
                    </button>

                </div>

                <p className={styles.footer}>
                    Sistema de Acompanhamento e Treinamento Esportivo
                </p>

            </section>

            {/* Imagem */}
            <section className={styles.imageSide}>
                <img
                    src={esportesImg}
                    alt="Materiais esportivos"
                />
            </section>

            {/* Faixa diagonal */}
            <div className={styles.diagonal} />

        </main>
    );
}

