import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import {
    ArrowLeft,
    ArrowRight,
    Camera,
    ImagePlus,
} from 'lucide-react';

import type { ChangeEvent } from 'react';
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

import styles from './configuracaoEquipe.module.css';

interface EstadoNavegacao {
    modalidade?: string;
    imagem?: string;
}

const categorias = [
    'Principal',
    'Sub-20',
    'Sub-17',
    'Sub-15',
    'Sub-13',
    'Feminino',
    'Masculino',
];

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

export default function ConfiguracaoEquipe() {
    const navigate = useNavigate();
    const location = useLocation();

    const fileInputRef =
        useRef<HTMLInputElement>(null);

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

    const [nomeEquipe, setNomeEquipe] =
        useState(
            sessionStorage.getItem('sate-nome-equipe') || '',
        );

    const [categoria, setCategoria] =
        useState(
            sessionStorage.getItem('sate-categoria-equipe') ||
                'Principal',
        );

    const [imagemEquipe, setImagemEquipe] =
        useState(
            sessionStorage.getItem('sate-imagem-equipe') ||
                '',
        );

    const IconeEsporte =
        iconePorEsporte[modalidade] || FaFutbol;

    const formularioValido =
        useMemo(() => {
            return (
                nomeEquipe.trim().length >= 2 &&
                categoria.trim().length > 0
            );
        }, [nomeEquipe, categoria]);

    useEffect(() => {
        sessionStorage.setItem(
            'sate-modalidade',
            modalidade,
        );

        if (imagemEsporte) {
            sessionStorage.setItem(
                'sate-imagem-esporte',
                imagemEsporte,
            );
        }
    }, [modalidade, imagemEsporte]);

    const selecionarImagem = (
        event: ChangeEvent<HTMLInputElement>,
    ) => {
        const arquivo =
            event.target.files?.[0];

        if (!arquivo) {
            return;
        }

        if (!arquivo.type.startsWith('image/')) {
            return;
        }

        const reader = new FileReader();

        reader.onload = () => {
            if (
                typeof reader.result === 'string'
            ) {
                setImagemEquipe(reader.result);

                try {
                    sessionStorage.setItem(
                        'sate-imagem-equipe',
                        reader.result,
                    );
                } catch {
                    console.warn(
                        'A imagem selecionada é muito grande para salvar temporariamente.',
                    );
                }
            }
        };

        reader.readAsDataURL(arquivo);
    };

    const voltar = () => {
        navigate('/configuracao-analise', {
            state: {
                modalidade,
                imagem: imagemEsporte,
            },
        });
    };

    const proximo = () => {
        if (!formularioValido) {
            return;
        }

        sessionStorage.setItem(
            'sate-nome-equipe',
            nomeEquipe.trim(),
        );

        sessionStorage.setItem(
            'sate-categoria-equipe',
            categoria,
        );

        navigate('/configuracao-concluida', {
            state: {
                modalidade,
                imagem: imagemEsporte,
            },
        });
    };

    return (
        <main
            className={styles.page}
            style={
                imagemEsporte
                    ? {
                          backgroundImage: `
                            linear-gradient(
                                rgba(0, 65, 48, 0.88),
                                rgba(0, 65, 48, 0.93)
                            ),
                            url(${imagemEsporte})
                          `,
                      }
                    : undefined
            }
        >
            <div className={styles.container}>
                <div className={styles.progressArea}>
                    <div className={styles.stepBadge}>
                        Etapa 3 de 4 · Configuração da equipe
                    </div>

                    <div className={styles.progressSteps}>
                        <div className={styles.progressComplete} />
                        <div className={styles.progressComplete} />
                        <div className={styles.progressComplete} />
                        <div className={styles.progressInactive} />
                    </div>
                </div>

                <section className={styles.header}>
                    <h1>
                        Finalize a configuração do seu registro
                    </h1>

                    <p>
                        Agora vamos configurar sua equipe.
                        Essas informações vão aparecer no seu painel
                        e ajudar na organização dos treinos e jogos.
                    </p>
                </section>

                <section className={styles.formCard}>
                    <div className={styles.photoColumn}>
                        <button
                            type="button"
                            className={styles.photoArea}
                            onClick={() =>
                                fileInputRef.current?.click()
                            }
                            style={
                                imagemEquipe || imagemEsporte
                                    ? {
                                          backgroundImage: `
                                            linear-gradient(
                                                rgba(0, 35, 26, 0.42),
                                                rgba(0, 35, 26, 0.6)
                                            ),
                                            url(${
                                                imagemEquipe ||
                                                imagemEsporte
                                            })
                                          `,
                                      }
                                    : undefined
                            }
                        >
                            <div className={styles.camera}>
                                <Camera size={28} />
                            </div>

                            <strong>
                                {imagemEquipe
                                    ? 'Alterar foto'
                                    : 'Adicione foto da equipe'}
                            </strong>

                            <span>
                                PNG ou JPG
                            </span>
                        </button>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/png,image/jpeg,image/webp"
                            className={styles.hiddenInput}
                            onChange={selecionarImagem}
                        />

                        {imagemEquipe && (
                            <button
                                type="button"
                                className={styles.changePhoto}
                                onClick={() =>
                                    fileInputRef.current?.click()
                                }
                            >
                                <ImagePlus size={16} />
                                Trocar imagem
                            </button>
                        )}
                    </div>

                    <div className={styles.formArea}>
                        <div className={styles.field}>
                            <label htmlFor="nome-equipe">
                                Nome da equipe
                                <span>*</span>
                            </label>

                            <input
                                id="nome-equipe"
                                type="text"
                                placeholder="Digite o nome da equipe..."
                                value={nomeEquipe}
                                onChange={(event) =>
                                    setNomeEquipe(
                                        event.target.value,
                                    )
                                }
                            />
                        </div>

                        <div className={styles.field}>
                            <label htmlFor="categoria">
                                Categoria
                                <span>*</span>
                            </label>

                            <select
                                id="categoria"
                                value={categoria}
                                onChange={(event) =>
                                    setCategoria(
                                        event.target.value,
                                    )
                                }
                            >
                                {categorias.map((item) => (
                                    <option
                                        key={item}
                                        value={item}
                                    >
                                        {item}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.field}>
                            <label htmlFor="modalidade">
                                Modalidade
                            </label>

                            <select
                                id="modalidade"
                                value={modalidade}
                                disabled
                            >
                                <option value={modalidade}>
                                    {modalidade}
                                </option>
                            </select>

                            <small>
                                Para alterar o esporte, volte para
                                a primeira etapa.
                            </small>
                        </div>
                    </div>

                    <aside className={styles.preview}>
                        <span className={styles.previewTitle}>
                            Prévia da equipe
                        </span>

                        <div className={styles.previewContent}>
                            <div
                                className={styles.avatar}
                                style={
                                    imagemEquipe
                                        ? {
                                              backgroundImage: `url(${imagemEquipe})`,
                                          }
                                        : undefined
                                }
                            >
                                {!imagemEquipe && (
                                    <IconeEsporte
                                        size={24}
                                    />
                                )}
                            </div>

                            <div>
                                <strong>
                                    {nomeEquipe.trim() ||
                                        'Nome da equipe'}
                                </strong>

                                <span>
                                    {modalidade} · {categoria}
                                </span>
                            </div>
                        </div>
                    </aside>
                </section>

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
                        disabled={!formularioValido}
                        onClick={proximo}
                    >
                        Próximo
                        <ArrowRight size={21} />
                    </button>
                </footer>
            </div>
        </main>
    );
}