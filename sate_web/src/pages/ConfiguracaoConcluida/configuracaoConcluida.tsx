import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import {
    ArrowLeft,
    ArrowRight,
    Check,
} from 'lucide-react';

import type { IconType } from 'react-icons';

import {
    FaBasketballBall,
    FaFootballBall,
    FaFutbol,
    FaRunning,
    FaSwimmer,
    FaTableTennis,
    FaVolleyballBall,
} from 'react-icons/fa';

import { GiHand } from 'react-icons/gi';

import styles from './configuracaoConcluida.module.css';

interface EstadoNavegacao {
    modalidade?: string;
    imagem?: string;
}

const iconePorEsporte: Record<string, IconType> = {
    Futebol: FaFutbol,
    Basquete: FaBasketballBall,
    Vôlei: FaVolleyballBall,
    Handebol: GiHand,
    Rugby: FaFootballBall,
    Natação: FaSwimmer,
    Atletismo: FaRunning,
    Tênis: FaTableTennis,
};

export default function ConfiguracaoConcluida() {
    const navigate = useNavigate();
    const location = useLocation();

    const state =
        location.state as EstadoNavegacao | null;

    const modalidade =
        state?.modalidade ||
        sessionStorage.getItem('sate-modalidade') ||
        'Futebol';

    const imagemEsporte =
        state?.imagem ||
        sessionStorage.getItem('sate-imagem-esporte') ||
        '';

    const nomeEquipe =
        sessionStorage.getItem('sate-nome-equipe') ||
        'Minha equipe';

    const categoria =
        sessionStorage.getItem('sate-categoria-equipe') ||
        'Principal';

    const imagemEquipe =
        sessionStorage.getItem('sate-imagem-equipe') ||
        '';

    const IconeEsporte =
        iconePorEsporte[modalidade] || FaFutbol;

    const camposSelecionados = useMemo(() => {
        try {
            const salvo =
                sessionStorage.getItem(
                    'sate-campos-analise',
                );

            if (!salvo) {
                return [];
            }

            const campos = JSON.parse(salvo);

            if (!Array.isArray(campos)) {
                return [];
            }

            return campos
                .map((campo) => {
                    if (typeof campo === 'string') {
                        return campo;
                    }

                    if (
                        campo &&
                        typeof campo.nome === 'string'
                    ) {
                        return campo.nome;
                    }

                    return null;
                })
                .filter(
                    (campo): campo is string =>
                        Boolean(campo),
                );
        } catch {
            return [];
        }
    }, []);

    const voltar = () => {
        navigate('/configuracao-equipe', {
            state: {
                modalidade,
                imagem: imagemEsporte,
            },
        });
    };

    const finalizar = () => {
        navigate('/inicio');
    };

    return (
        <main
            className={styles.page}
            style={
                imagemEsporte
                    ? {
                          backgroundImage: `
                            linear-gradient(
                                rgba(0, 66, 49, 0.92),
                                rgba(0, 66, 49, 0.96)
                            ),
                            url(${imagemEsporte})
                          `,
                      }
                    : undefined
            }
        >
            <div className={styles.container}>
                {/* PROGRESSO */}

                <div className={styles.progressArea}>
                    <div className={styles.stepBadge}>
                        Etapa 4 de 4 · Configuração concluída
                    </div>

                    <div className={styles.progressSteps}>
                        <div />
                        <div />
                        <div />
                        <div />
                    </div>
                </div>

                {/* CABEÇALHO */}

                <section className={styles.header}>
                    <div className={styles.completeIcon}>
                        <Check
                            size={25}
                            strokeWidth={3}
                        />
                    </div>

                    <h1>
                        Tudo pronto!
                    </h1>

                    <p>
                        Agora você já pode começar a acompanhar
                        o desempenho da sua equipe.
                    </p>
                </section>

                {/* RESUMO */}

                <section className={styles.summaryArea}>
                    {/* CAMPOS SELECIONADOS */}

                    <article className={styles.fieldsCard}>
                        <div className={styles.sportHeader}>
                            <div className={styles.sportCircle}>
                                <IconeEsporte size={21} />
                            </div>

                            <div>
                                <strong>
                                    {modalidade}
                                </strong>

                                <span>
                                    Configuração da análise
                                </span>
                            </div>
                        </div>

                        <div className={styles.divider} />

                        <span className={styles.fieldsTitle}>
                            Campos selecionados
                        </span>

                        <ul>
                            {camposSelecionados.map(
                                (campo) => (
                                    <li key={campo}>
                                        <Check size={13} />

                                        {campo}
                                    </li>
                                ),
                            )}
                        </ul>

                        {camposSelecionados.length === 0 && (
                            <p className={styles.emptyFields}>
                                Nenhum campo selecionado.
                            </p>
                        )}
                    </article>

                    {/* EQUIPE */}

                    <article className={styles.teamCard}>
                        <div
                            className={styles.teamImage}
                            style={
                                imagemEquipe || imagemEsporte
                                    ? {
                                          backgroundImage: `url(${
                                              imagemEquipe ||
                                              imagemEsporte
                                          })`,
                                      }
                                    : undefined
                            }
                        >
                            {!imagemEquipe &&
                                !imagemEsporte && (
                                    <IconeEsporte
                                        size={48}
                                    />
                                )}
                        </div>

                        <div className={styles.teamInfo}>
                            <div>
                                <span>
                                    SUA EQUIPE
                                </span>

                                <h2>
                                    {nomeEquipe}
                                </h2>

                                <p>
                                    {modalidade} · {categoria}
                                </p>
                            </div>

                            <div className={styles.sportEmoji}>
                                <IconeEsporte size={22} />
                            </div>
                        </div>
                    </article>
                </section>

                {/* RODAPÉ */}

                <footer className={styles.footer}>
                    <button
                        type="button"
                        className={styles.backButton}
                        onClick={voltar}
                    >
                        <ArrowLeft size={21} />

                        Voltar
                    </button>

                    <button
                        type="button"
                        className={styles.nextButton}
                        onClick={finalizar}
                    >
                        Ir para o início

                        <ArrowRight size={21} />
                    </button>
                </footer>
            </div>
        </main>
    );
}