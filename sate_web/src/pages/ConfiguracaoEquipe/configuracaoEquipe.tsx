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

import OnboardingThemeToggle from '../../components/ui/OnboardingThemeToggle/OnboardingThemeToggle';
import OnboardingProgress from '../../components/ui/OnboardingProgress/OnboardingProgress';
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

    /*
     * Dados recebidos da tela anterior.
     */
    const state =
        location.state as EstadoNavegacao | null;

    /*
     * Recupera a modalidade pelo Router ou pelo
     * sessionStorage caso a página seja recarregada.
     */
    const modalidade =
        state?.modalidade ||
        sessionStorage.getItem('sate-modalidade') ||
        'Futebol';

    /*
     * Recupera a imagem do esporte.
     */
    const imagemEsporte =
        state?.imagem ||
        sessionStorage.getItem('sate-imagem-esporte') ||
        '';

    /*
     * Nome da equipe.
     */
    const [nomeEquipe, setNomeEquipe] =
        useState(
            sessionStorage.getItem(
                'sate-nome-equipe',
            ) || '',
        );

    /*
     * Categoria da equipe.
     */
    const [categoria, setCategoria] =
        useState(
            sessionStorage.getItem(
                'sate-categoria-equipe',
            ) || 'Principal',
        );

    /*
     * Imagem da equipe.
     */
    const [imagemEquipe, setImagemEquipe] =
        useState(
            sessionStorage.getItem(
                'sate-imagem-equipe',
            ) || '',
        );

    /*
     * Ícone correspondente à modalidade.
     */
    const IconeEsporte =
        iconePorEsporte[modalidade] ||
        FaFutbol;

    /*
     * Verifica se os campos obrigatórios
     * estão preenchidos.
     */
    const formularioValido = useMemo(() => {
        return (
            nomeEquipe.trim().length >= 2 &&
            categoria.trim().length > 0
        );
    }, [nomeEquipe, categoria]);

    /*
     * Mantém modalidade e imagem do esporte
     * salvas durante o onboarding.
     */
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
    }, [
        modalidade,
        imagemEsporte,
    ]);

    /*
     * Seleção da imagem da equipe.
     */
    const selecionarImagem = (
        event: ChangeEvent<HTMLInputElement>,
    ) => {
        const arquivo =
            event.target.files?.[0];

        if (!arquivo) {
            return;
        }

        /*
         * Aceita somente imagens.
         */
        if (!arquivo.type.startsWith('image/')) {
            return;
        }

        const reader = new FileReader();

        reader.onload = () => {
            if (
                typeof reader.result ===
                'string'
            ) {
                setImagemEquipe(
                    reader.result,
                );

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

    /*
     * Voltar para a 3ª etapa.
     */
    const voltar = () => {
        navigate(
            '/configuracao-analise',
            {
                state: {
                    modalidade,
                    imagem: imagemEsporte,
                },
            },
        );
    };

    /*
     * Avançar para a 5ª e última etapa.
     */
    const proximo = () => {
        if (!formularioValido) {
            return;
        }

        /*
         * Salva os dados temporariamente.
         *
         * O envio definitivo para o backend será
         * feito somente na última etapa do onboarding.
         */
        sessionStorage.setItem(
            'sate-nome-equipe',
            nomeEquipe.trim(),
        );

        sessionStorage.setItem(
            'sate-categoria-equipe',
            categoria,
        );

        /*
         * Se houver imagem, garante que ela
         * esteja salva.
         */
        if (imagemEquipe) {
            try {
                sessionStorage.setItem(
                    'sate-imagem-equipe',
                    imagemEquipe,
                );
            } catch {
                console.warn(
                    'Não foi possível salvar a imagem temporariamente.',
                );
            }
        }

        /*
         * Vai para a tela de configuração concluída.
         */
        navigate(
            '/configuracao-concluida',
            {
                state: {
                    modalidade,
                    imagem: imagemEsporte,
                },
            },
        );
    };

    return (
        <main
            className={styles.page}
            style={
                imagemEsporte
                    ? {
                        backgroundImage: `
                            linear-gradient(
                                var(--equipe-foto-overlay-inicio),
                                var(--equipe-foto-overlay-fim)
                            ),
                            url(${imagemEsporte})
                          `,
                    }
                    : undefined
            }
        >
            <OnboardingThemeToggle />
            <div className={styles.container}>

                {/* ================= PROGRESSO ================= */}

                <OnboardingProgress etapa={3} descricao="Configuração da equipe" />

                {/* ================= CABEÇALHO ================= */}

                <section
                    className={
                        styles.header
                    }
                >
                    <h1>
                        Finalize a configuração do <span>seu registro</span>
                    </h1>

                    <p>
                        Agora vamos configurar
                        sua equipe. Essas
                        informações vão aparecer
                        no seu painel e ajudar na
                        organização dos treinos
                        e jogos.
                    </p>
                </section>

                {/* ================= FORMULÁRIO ================= */}

                <section
                    className={
                        styles.formCard
                    }
                >

                    {/* ================= FOTO ================= */}

                    <div
                        className={
                            styles.photoColumn
                        }
                    >
                        <button
                            type="button"
                            className={`${styles.photoArea} ${imagemEquipe || imagemEsporte ? styles.photoAreaComImagem : ''}`}
                            onClick={() =>
                                fileInputRef.current?.click()
                            }
                            style={
                                imagemEquipe ||
                                    imagemEsporte
                                    ? {
                                        backgroundImage: `
                                            linear-gradient(
                                                rgba(0, 35, 26, 0.42),
                                                rgba(0, 35, 26, 0.6)
                                            ),
                                            url(${imagemEquipe ||
                                            imagemEsporte
                                            })
                                          `,
                                    }
                                    : undefined
                            }
                        >
                            <div
                                className={
                                    styles.camera
                                }
                            >
                                <Camera
                                    size={28}
                                />
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
                            ref={
                                fileInputRef
                            }
                            type="file"
                            accept="image/png,image/jpeg,image/webp"
                            className={
                                styles.hiddenInput
                            }
                            onChange={
                                selecionarImagem
                            }
                        />

                        {imagemEquipe && (
                            <button
                                type="button"
                                className={
                                    styles.changePhoto
                                }
                                onClick={() =>
                                    fileInputRef.current?.click()
                                }
                            >
                                <ImagePlus
                                    size={16}
                                />

                                Trocar imagem
                            </button>
                        )}
                    </div>

                    {/* ================= CAMPOS ================= */}

                    <div
                        className={
                            styles.formArea
                        }
                    >

                        {/* NOME */}

                        <div
                            className={
                                styles.field
                            }
                        >
                            <label htmlFor="nome-equipe">
                                Nome da equipe
                                <span>*</span>
                            </label>

                            <input
                                id="nome-equipe"
                                type="text"
                                placeholder="Digite o nome da equipe..."
                                value={
                                    nomeEquipe
                                }
                                onChange={(
                                    event,
                                ) =>
                                    setNomeEquipe(
                                        event.target.value,
                                    )
                                }
                                maxLength={100}
                            />
                        </div>

                        {/* CATEGORIA */}

                        <div
                            className={
                                styles.field
                            }
                        >
                            <label htmlFor="categoria">
                                Categoria
                                <span>*</span>
                            </label>

                            <select
                                id="categoria"
                                value={
                                    categoria
                                }
                                onChange={(
                                    event,
                                ) =>
                                    setCategoria(
                                        event.target.value,
                                    )
                                }
                            >
                                {categorias.map(
                                    (
                                        item,
                                    ) => (
                                        <option
                                            key={
                                                item
                                            }
                                            value={
                                                item
                                            }
                                        >
                                            {
                                                item
                                            }
                                        </option>
                                    ),
                                )}
                            </select>
                        </div>

                        {/* MODALIDADE */}

                        <div
                            className={
                                styles.field
                            }
                        >
                            <label htmlFor="modalidade">
                                Modalidade
                            </label>

                            <select
                                id="modalidade"
                                value={
                                    modalidade
                                }
                                disabled
                            >
                                <option
                                    value={
                                        modalidade
                                    }
                                >
                                    {
                                        modalidade
                                    }
                                </option>
                            </select>

                            <small>
                                Para alterar o
                                esporte, volte
                                para a primeira
                                etapa.
                            </small>
                        </div>
                    </div>

                    {/* ================= PRÉVIA ================= */}

                    <aside
                        className={
                            styles.preview
                        }
                    >
                        <span
                            className={
                                styles.previewTitle
                            }
                        >
                            Prévia da equipe
                        </span>

                        <div
                            className={
                                styles.previewContent
                            }
                        >
                            <div
                                className={
                                    styles.avatar
                                }
                                style={
                                    imagemEquipe
                                        ? {
                                            backgroundImage: `
                                                url(${imagemEquipe})
                                              `,
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
                                    {modalidade}
                                    {' · '}
                                    {categoria}
                                </span>
                            </div>
                        </div>
                    </aside>
                </section>

                {/* ================= RODAPÉ ================= */}

                <footer
                    className={
                        styles.footer
                    }
                >
                    <button
                        type="button"
                        className={
                            styles.backButton
                        }
                        onClick={
                            voltar
                        }
                    >
                        <ArrowLeft
                            size={21}
                        />

                        Voltar
                    </button>

                    <button
                        type="button"
                        className={
                            styles.nextButton
                        }
                        disabled={
                            !formularioValido
                        }
                        onClick={
                            proximo
                        }
                    >
                        Próximo

                        <ArrowRight
                            size={21}
                        />
                    </button>
                </footer>
            </div>
        </main>
    );
}
