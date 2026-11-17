
import { useState } from 'react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import OnboardingThemeToggle from '../../components/ui/OnboardingThemeToggle/OnboardingThemeToggle';
import OnboardingProgress from '../../components/ui/OnboardingProgress/OnboardingProgress';
import styles from './selecaoEsporte.module.css';

import futebolImg from '../../assets/img/esportes/futebol.jpg';
import basqueteImg from '../../assets/img/esportes/basquete.jfif';
import voleiImg from '../../assets/img/esportes/volei.jpg';
import handebolImg from '../../assets/img/esportes/handbol.webp';
import rugbyImg from '../../assets/img/esportes/rugby.jpg';
import natacaoImg from '../../assets/img/esportes/natacao.jfif';
import atletismoImg from '../../assets/img/esportes/atletismo.jfif';
import tenisImg from '../../assets/img/esportes/tenis.jpg';

interface Esporte {
    id: string;
    nome: string;
    emoji: string;
    imagem: string;
}

const esportes: Esporte[] = [
    {
        id: 'futebol',
        nome: 'Futebol',
        emoji: '⚽',
        imagem: futebolImg,
    },
    {
        id: 'basquete',
        nome: 'Basquete',
        emoji: '🏀',
        imagem: basqueteImg,
    },
    {
        id: 'volei',
        nome: 'Vôlei',
        emoji: '🏐',
        imagem: voleiImg,
    },
    {
        id: 'handebol',
        nome: 'Handebol',
        emoji: '🤾',
        imagem: handebolImg,
    },
    {
        id: 'rugby',
        nome: 'Rugby',
        emoji: '🏉',
        imagem: rugbyImg,
    },
    {
        id: 'natacao',
        nome: 'Natação',
        emoji: '🏊',
        imagem: natacaoImg,
    },
    {
        id: 'atletismo',
        nome: 'Atletismo',
        emoji: '🏃',
        imagem: atletismoImg,
    },
    {
        id: 'tenis',
        nome: 'Tênis',
        emoji: '🎾',
        imagem: tenisImg,
    },
];

export default function SelecaoEsporte() {
    const navigate = useNavigate();

    const [esporteSelecionado, setEsporteSelecionado] =
        useState<string | null>(null);

    const esporteAtual = esportes.find(
        (esporte) => esporte.id === esporteSelecionado,
    );

    const selecionarEsporte = (id: string) => {
        setEsporteSelecionado(id);
    };

    const voltar = () => {
        navigate(-1);
    };

    const proximo = () => {
        if (!esporteAtual) {
            return;
        }

        sessionStorage.setItem(
            'sate-modalidade',
            esporteAtual.nome,
        );

        sessionStorage.setItem(
            'sate-imagem-esporte',
            esporteAtual.imagem,
        );

        navigate('/configuracao-analise', {
            state: {
                modalidade: esporteAtual.nome,
                imagem: esporteAtual.imagem,
            },
        });
    };

    return (
        <main
            className={styles.container}
            style={
                esporteAtual
                    ? {
                        backgroundImage: `
                            linear-gradient(
                                rgba(72, 59, 54, 0.48),
                                rgba(105, 62, 76, 0.56)
                            ),
                            url("${esporteAtual.imagem}")
                        `,
                    }
                    : undefined
            }
        >
            <OnboardingThemeToggle />
            {!esporteAtual && (
                <div className={styles.fundoInicial} />
            )}

            <div className={styles.conteudo}>
                <OnboardingProgress etapa={1} descricao="Configuração do esporte" />

                {/* CABEÇALHO */}
                <section className={styles.cabecalho}>
                    <h1
                        className={`${styles.titulo} ${
                            esporteAtual
                                ? styles.tituloSelecionado
                                : styles.tituloInicial
                        }`}
                    >
                        Qual é o seu{' '}
                        <span>esporte?</span>
                    </h1>

                    <p
                        className={
                            esporteAtual
                                ? styles.descricaoSelecionada
                                : styles.descricaoInicial
                        }
                    >
                        Selecione a modalidade que você pratica.
                        Isso ajudará o sistema a organizar as
                        informações de forma correta.
                    </p>
                </section>

                {/* ESPORTES */}
                <section className={styles.gridEsportes}>
                    {esportes.map((esporte) => {
                        const selecionado =
                            esporteSelecionado === esporte.id;

                        return (
                            <button
                                key={esporte.id}
                                type="button"
                                className={`${styles.cardEsporte} ${
                                    selecionado
                                        ? styles.cardSelecionado
                                        : ''
                                }`}
                                onClick={() =>
                                    selecionarEsporte(esporte.id)
                                }
                                aria-pressed={selecionado}
                            >
                                <span className={styles.iconeEsporte}>
                                    {esporte.emoji}
                                </span>

                                <span className={styles.nomeEsporte}>
                                    {esporte.nome}
                                </span>

                                {selecionado && (
                                    <span className={styles.check}>
                                        <Check
                                            size={13}
                                            strokeWidth={3}
                                        />
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </section>

                {/* RODAPÉ */}
                <div className={styles.rodape}>
                    <button
                        type="button"
                        className={`${styles.botaoVoltar} ${
                            esporteAtual
                                ? styles.botaoVoltarSelecionado
                                : ''
                        }`}
                        onClick={voltar}
                    >
                        <ArrowLeft size={17} />
                        Voltar
                    </button>

                    <button
                        type="button"
                        className={styles.botaoProximo}
                        onClick={proximo}
                        disabled={!esporteSelecionado}
                    >
                        Próximo
                        <ArrowRight size={17} />
                    </button>
                </div>
            </div>
        </main>
    );
}
