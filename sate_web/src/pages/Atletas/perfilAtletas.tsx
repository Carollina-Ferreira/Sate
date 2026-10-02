import {
    ArrowLeft,
    Edit,
    Info,
    Play,
    Video,
} from 'lucide-react';

import styles from './perfilAtleta.module.css';

export interface AtletaPerfil {
    id: number;

    nome: string | null;

    cpf?: string | null;
    rg?: string | null;
    dataNascimento?: string | null;
    sexo?: string | null;
    categoria?: string | null;
    telefone?: string | null;

    equipe?: {
        id: number;
        nome: string;
        modalidade: string;
        categoria?: string | null;
    } | null;

    usuario?: {
        id: number;
        nome?: string | null;
        email: string;
        tipo?: string | null;
        avatarUrl?: string | null;
    };

    responsavel?: {
        id: number;
        nome: string;
        grauParentesco: string;
        telefone: string;
    } | null;

    endereco?: {
        id: number;
        cep: string;
        logradouro: string;
        numero: string;
        bairro: string;
        complemento?: string | null;
        cidade?: string | null;
        estado?: string | null;
    } | null;

    documentos?: unknown[];
}

interface PerfilAtletaProps {
    atleta: AtletaPerfil;
    onBack: () => void;
    onEdit: () => void;
    onInformacoes: () => void;
    onClipes: () => void;
}

const PerfilAtleta = ({
    atleta,
    onBack,
    onEdit,
    onInformacoes,
    onClipes,
}: PerfilAtletaProps) => {

    // ============================================================
    // INICIAIS
    // ============================================================

    const iniciais = atleta.nome
        ? atleta.nome
              .trim()
              .split(/\s+/)
              .filter(Boolean)
              .slice(0, 2)
              .map((nome) => nome.charAt(0))
              .join('')
              .toUpperCase()
        : 'AT';


    // ============================================================
    // IDADE
    // ============================================================

    const calcularIdade = () => {

        if (!atleta.dataNascimento) {
            return null;
        }

        const nascimento =
            new Date(atleta.dataNascimento);

        if (Number.isNaN(nascimento.getTime())) {
            return null;
        }

        const hoje = new Date();

        let idade =
            hoje.getFullYear() -
            nascimento.getFullYear();

        const mesAtual =
            hoje.getMonth();

        const mesNascimento =
            nascimento.getMonth();

        if (
            mesAtual < mesNascimento ||
            (
                mesAtual === mesNascimento &&
                hoje.getDate() <
                    nascimento.getDate()
            )
        ) {
            idade--;
        }

        return idade >= 0
            ? idade
            : null;
    };


    const idade = calcularIdade();


    // ============================================================
    // MODALIDADE
    // ============================================================

    const modalidade =
        atleta.equipe?.modalidade ||
        'Modalidade não informada';


    // ============================================================
    // EQUIPE
    // ============================================================

    const equipe =
        atleta.equipe?.nome ||
        'Sem equipe';


    // ============================================================
    // CATEGORIA
    // ============================================================

    const categoria =
        atleta.categoria ||
        atleta.equipe?.categoria ||
        'Sem categoria';


    // ============================================================
    // FOTO
    // ============================================================

    const fotoUrl =
        atleta.usuario?.avatarUrl || null;


    // ============================================================
    // RENDER
    // ============================================================

    return (
        <div className={styles.page}>

            {/* ================================================== */}
            {/* VOLTAR */}
            {/* ================================================== */}

            <button
                type="button"
                className={styles.backButton}
                onClick={onBack}
            >
                <ArrowLeft size={16} />
                Voltar para atletas
            </button>


            {/* ================================================== */}
            {/* PERFIL */}
            {/* ================================================== */}

            <div className={styles.profileCard}>

                <div className={styles.profileInfo}>

                    <div className={styles.avatarLarge}>

                        {fotoUrl ? (

                            <img
                                src={fotoUrl}
                                alt={`Foto de ${
                                    atleta.nome ||
                                    'atleta'
                                }`}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    borderRadius: '50%',
                                    display: 'block',
                                }}
                            />

                        ) : (

                            iniciais

                        )}

                    </div>


                    <div className={styles.profileDetails}>

                        <h2>
                            {atleta.nome ||
                                'Atleta sem nome'}
                        </h2>


                        <p>
                            {equipe}

                            {' - '}

                            {categoria}

                            {idade !== null && (
                                <>
                                    {' - '}
                                    {idade} anos
                                </>
                            )}

                            {' - '}

                            {modalidade}
                        </p>

                    </div>

                </div>


                <div className={styles.performanceIndex}>

                    <span
                        className={
                            styles.indexValue
                        }
                    >
                        69%
                    </span>


                    <span
                        className={
                            styles.indexLabel
                        }
                    >
                        Índice de desempenho
                    </span>

                </div>

            </div>


            {/* ================================================== */}
            {/* AÇÕES */}
            {/* ================================================== */}

            <div className={styles.actionsRow}>

                {/* EDITAR */}

                <button
                    type="button"
                    className={styles.actionButton}
                    onClick={onEdit}
                >
                    <Edit size={16} />
                    Editar atleta
                </button>


                {/* INFORMAÇÕES */}

                <button
                    type="button"
                    className={styles.actionButton}
                    onClick={onInformacoes}
                >
                    <Info size={16} />
                    Ver informações do atleta
                </button>


                {/* PARTIDAS */}

                <button
                    type="button"
                    className={styles.actionButton}
                >
                    <Play size={16} />
                    Ver partidas
                </button>


                {/* CLIPES */}

                <button
                    type="button"
                    className={styles.actionButton}
                    onClick={onClipes}
                >
                    <Video size={16} />
                    Ver todos os clipes
                </button>

            </div>


            {/* ================================================== */}
            {/* ESTATÍSTICAS */}
            {/* ================================================== */}

            <div className={styles.statsGrid}>

                <div
                    className={`${styles.statCard} ${styles.statGood}`}
                >
                    <span
                        className={styles.statValue}
                    >
                        0
                    </span>

                    <span
                        className={styles.statLabel}
                    >
                        Ações boas
                    </span>
                </div>


                <div
                    className={`${styles.statCard} ${styles.statBad}`}
                >
                    <span
                        className={styles.statValue}
                    >
                        1
                    </span>

                    <span
                        className={styles.statLabel}
                    >
                        Ações ruins
                    </span>
                </div>


                <div
                    className={`${styles.statCard} ${styles.statNeutral}`}
                >
                    <span
                        className={styles.statValue}
                    >
                        0
                    </span>

                    <span
                        className={styles.statLabel}
                    >
                        Ações neutras
                    </span>
                </div>


                <div
                    className={`${styles.statCard} ${styles.statHighlight}`}
                >
                    <span
                        className={styles.statValue}
                    >
                        3
                    </span>

                    <span
                        className={styles.statLabel}
                    >
                        Ações destaque
                    </span>
                </div>

            </div>


            {/* ================================================== */}
            {/* GRÁFICOS */}
            {/* ================================================== */}

            <div className={styles.chartsGrid}>

                {/* ================================================== */}
                {/* EVOLUÇÃO */}
                {/* ================================================== */}

                <div className={styles.chartCard}>

                    <h3>
                        Evolução ao longo do tempo
                    </h3>


                    <div
                        className={
                            styles.chartContainer
                        }
                    >

                        <svg
                            viewBox="0 0 400 200"
                            className={
                                styles.lineChart
                            }
                        >

                            {[0, 25, 50, 75, 100].map(
                                (val, i) => (

                                    <g key={i}>

                                        <text
                                            x="10"
                                            y={
                                                180 -
                                                val * 1.6
                                            }
                                            fontSize="10"
                                            fill="#999"
                                        >
                                            {val}
                                        </text>


                                        <line
                                            x1="30"
                                            y1={
                                                180 -
                                                val * 1.6
                                            }
                                            x2="390"
                                            y2={
                                                180 -
                                                val * 1.6
                                            }
                                            stroke="#eee"
                                            strokeWidth="1"
                                        />

                                    </g>
                                )
                            )}


                            <path
                                d="M 50 120 L 100 40 L 150 40 L 200 80 L 250 100 L 300 80 L 350 40"
                                fill="none"
                                stroke="#3498db"
                                strokeWidth="2"
                            />


                            {[
                                { x: 50, y: 120 },
                                { x: 100, y: 40 },
                                { x: 150, y: 40 },
                                { x: 200, y: 80 },
                                { x: 250, y: 100 },
                                { x: 300, y: 80 },
                                { x: 350, y: 40 },
                            ].map((p, i) => (

                                <circle
                                    key={i}
                                    cx={p.x}
                                    cy={p.y}
                                    r="4"
                                    fill="#3498db"
                                />

                            ))}


                            {[
                                'P1',
                                'P2',
                                'P3',
                                'P4',
                                'P5',
                                'P6',
                                'P7',
                            ].map((label, i) => (

                                <text
                                    key={i}
                                    x={50 + i * 50}
                                    y="195"
                                    fontSize="10"
                                    fill="#999"
                                    textAnchor="middle"
                                >
                                    {label}
                                </text>

                            ))}

                        </svg>

                    </div>

                </div>


                {/* ================================================== */}
                {/* PERFIL DE ATRIBUTOS */}
                {/* ================================================== */}

                <div className={styles.chartCard}>

                    <h3>
                        Perfil de atributos
                    </h3>


                    <div
                        className={
                            styles.chartContainer
                        }
                    >

                        <svg
                            viewBox="0 0 200 200"
                            className={
                                styles.radarChart
                            }
                        >

                            <polygon
                                points="100,20 169,60 169,140 100,180 31,140 31,60"
                                fill="none"
                                stroke="#eee"
                                strokeWidth="1"
                            />


                            <polygon
                                points="100,40 149,70 149,130 100,160 51,130 51,70"
                                fill="none"
                                stroke="#eee"
                                strokeWidth="1"
                            />


                            <polygon
                                points="100,60 129,80 129,120 100,140 71,120 71,80"
                                fill="none"
                                stroke="#eee"
                                strokeWidth="1"
                            />


                            <polygon
                                points="100,80 109,90 109,110 100,120 91,110 91,90"
                                fill="none"
                                stroke="#eee"
                                strokeWidth="1"
                            />


                            <line
                                x1="100"
                                y1="100"
                                x2="100"
                                y2="20"
                                stroke="#eee"
                                strokeWidth="1"
                            />

                            <line
                                x1="100"
                                y1="100"
                                x2="169"
                                y2="60"
                                stroke="#eee"
                                strokeWidth="1"
                            />

                            <line
                                x1="100"
                                y1="100"
                                x2="169"
                                y2="140"
                                stroke="#eee"
                                strokeWidth="1"
                            />

                            <line
                                x1="100"
                                y1="100"
                                x2="100"
                                y2="180"
                                stroke="#eee"
                                strokeWidth="1"
                            />

                            <line
                                x1="100"
                                y1="100"
                                x2="31"
                                y2="140"
                                stroke="#eee"
                                strokeWidth="1"
                            />

                            <line
                                x1="100"
                                y1="100"
                                x2="31"
                                y2="60"
                                stroke="#eee"
                                strokeWidth="1"
                            />


                            <polygon
                                points="100,50 140,75 130,120 100,140 80,120 70,80"
                                fill="rgba(52, 152, 219, 0.3)"
                                stroke="#3498db"
                                strokeWidth="2"
                            />


                            <text
                                x="100"
                                y="10"
                                fontSize="10"
                                fill="#999"
                                textAnchor="middle"
                            >
                                Ataque
                            </text>


                            <text
                                x="180"
                                y="60"
                                fontSize="10"
                                fill="#999"
                                textAnchor="middle"
                            >
                                Defesa
                            </text>


                            <text
                                x="180"
                                y="145"
                                fontSize="10"
                                fill="#999"
                                textAnchor="middle"
                            >
                                Passe
                            </text>


                            <text
                                x="100"
                                y="195"
                                fontSize="10"
                                fill="#999"
                                textAnchor="middle"
                            >
                                Físico
                            </text>


                            <text
                                x="20"
                                y="145"
                                fontSize="10"
                                fill="#999"
                                textAnchor="middle"
                            >
                                Técnica
                            </text>


                            <text
                                x="20"
                                y="60"
                                fontSize="10"
                                fill="#999"
                                textAnchor="middle"
                            >
                                Visão de jogo
                            </text>

                        </svg>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default PerfilAtleta;