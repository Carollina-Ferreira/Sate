
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import OnboardingThemeToggle from '../../components/ui/OnboardingThemeToggle/OnboardingThemeToggle';
import styles from './boasVindas.module.css';

import logoVerde from '../../assets/img/logoVerde_img.png';
import logoBranca from '../../assets/img/logo.png';
import esportesImg from '../../assets/img/boas-vindas-esportes.png';

export default function BoasVindas() {
    const navigate = useNavigate();

    const handleComecar = () => {
        navigate('/selecao-esporte');
    };

    return (
        <main className={styles.container}>
            <OnboardingThemeToggle />

            <section className={styles.leftSide}>
                {/* LOGO: CLARO E ESCURO */}
                <div className={styles.logoContainer}>
                    <img
                        src={logoVerde}
                        alt="SATE"
                        className={`${styles.logo} ${styles.logoClaro}`}
                    />

                    <img
                        src={logoBranca}
                        alt="SATE"
                        className={`${styles.logo} ${styles.logoEscuro}`}
                    />
                </div>

                {/* CONTEÚDO PRINCIPAL */}
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
                        <ArrowRight size={22} strokeWidth={2} />
                    </button>
                </div>

                {/* RODAPÉ */}
                <p className={styles.footer}>
                    Sistema de Acompanhamento e Treinamento Esportivo
                </p>
            </section>

            {/* IMAGEM LATERAL */}
            <section className={styles.imageSide}>
                <img
                    src={esportesImg}
                    alt="Materiais esportivos"
                />
            </section>

            <div className={styles.diagonal} />
        </main>
    );
}
