import {
    ArrowLeft,
    Edit3,
    Info,
    Play,
    Video,
    TrendingUp,
    Activity,
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
    onPartidas?: () => void;
}

const dadosEvolucao = [38, 88, 88, 62, 50, 62, 88];

const dadosAtributos = [
    { nome: 'Ataque', valor: 70 },
    { nome: 'Defesa', valor: 80 },
    { nome: 'Passe', valor: 65 },
    { nome: 'Físico', valor: 70 },
    { nome: 'Técnica', valor: 60 },
    { nome: 'Visão', valor: 75 },
];

const PerfilAtleta = ({
    atleta,
    onBack,
    onEdit,
    onInformacoes,
    onClipes,
    onPartidas,
}: PerfilAtletaProps) => {
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

    const calcularIdade = (): number | null => {
        if (!atleta.dataNascimento) return null;

        const apenasData = atleta.dataNascimento.split('T')[0];
        let ano: number;
        let mes: number;
        let dia: number;

        // Aceita datas no formato ISO (AAAA-MM-DD).
        const partesISO = apenasData.split('-');

        if (partesISO.length === 3) {
            ano = Number(partesISO[0]);
            mes = Number(partesISO[1]);
            dia = Number(partesISO[2]);
        } else {
            return null;
        }

        const nascimento = new Date(ano, mes - 1, dia);

        if (
            Number.isNaN(nascimento.getTime()) ||
            nascimento.getFullYear() !== ano ||
            nascimento.getMonth() !== mes - 1 ||
            nascimento.getDate() !== dia
        ) {
            return null;
        }

        const hoje = new Date();
        let idade = hoje.getFullYear() - ano;

        if (
            hoje.getMonth() < mes - 1 ||
            (hoje.getMonth() === mes - 1 && hoje.getDate() < dia)
        ) {
            idade--;
        }

        return idade >= 0 ? idade : null;
    };

    const idade = calcularIdade();

    const equipe = atleta.equipe?.nome || 'Sem equipe';
    const categoria =
        atleta.categoria ||
        atleta.equipe?.categoria ||
        'Categoria não informada';
    const modalidade =
        atleta.equipe?.modalidade || 'Modalidade não informada';

    const fotoUrl = atleta.usuario?.avatarUrl || null;

    // Valores demonstrativos até a integração com as estatísticas reais.
    const desempenho = 69;

    const estatisticas = [
        {
            titulo: 'Ações boas',
            valor: 0,
            classe: styles.good,
        },
        {
            titulo: 'Ações ruins',
            valor: 1,
            classe: styles.bad,
        },
        {
            titulo: 'Ações neutras',
            valor: 0,
            classe: styles.neutral,
        },
        {
            titulo: 'Ações destaque',
            valor: 3,
            classe: styles.highlight,
        },
    ];

    const metaLinha = [
        equipe,
        categoria,
        modalidade,
        idade !== null ? `${idade} anos` : null,
    ]
        .filter(Boolean)
        .join(' · ');

    // Gráfico de evolução.
    const pontosEvolucao = dadosEvolucao.map((valor, index) => ({
        x: 55 + index * 90,
        y: 225 - valor * 1.85,
        valor,
    }));

    const linhaEvolucao = pontosEvolucao
        .map(
            (ponto, index) =>
                `${index === 0 ? 'M' : 'L'} ${ponto.x} ${ponto.y}`
        )
        .join(' ');

    const areaEvolucao = `${linhaEvolucao} L 595 225 L 55 225 Z`;

    // Gráfico radar.
    const coordenadaRadar = (
        index: number,
        porcentagem: number
    ) => {
        const angulo = (Math.PI * 2 * index) / 6 - Math.PI / 2;
        const raio = 90 * (porcentagem / 100);

        return {
            x: 160 + Math.cos(angulo) * raio,
            y: 145 + Math.sin(angulo) * raio,
        };
    };

    const criarPoligono = (porcentagem: number) =>
        dadosAtributos
            .map((_, index) => {
                const ponto = coordenadaRadar(index, porcentagem);
                return `${ponto.x},${ponto.y}`;
            })
            .join(' ');

    const pontosRadar = dadosAtributos
        .map((atributo, index) => {
            const ponto = coordenadaRadar(index, atributo.valor);
            return `${ponto.x},${ponto.y}`;
        })
        .join(' ');

    const handleEditar = (
        event: React.MouseEvent<HTMLButtonElement>
    ) => {
        event.preventDefault();
        event.stopPropagation();
        onEdit();
    };

    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <button
                    className={styles.backButton}
                    onClick={onBack}
                    type="button"
                    style={{
                        position: 'relative',
                        zIndex: 1,
                        width: 'fit-content',
                    }}
                >
                    <ArrowLeft size={17} />
                    Voltar para atletas
                </button>

                {/* PERFIL DO ATLETA */}
                <section className={styles.profileCard}>
                    <div className={styles.profileLeft}>
                        <div className={styles.avatar}>
                            {fotoUrl ? (
                                <img
                                    src={fotoUrl}
                                    alt={`Foto de ${atleta.nome || 'atleta'}`}
                                />
                            ) : (
                                iniciais
                            )}
                        </div>

                        <div className={styles.nameGroup}>
                            <h1>{atleta.nome || 'Atleta sem nome'}</h1>

                            <p className={styles.metaInfo}>
                                {metaLinha}
                            </p>
                        </div>
                    </div>

                    <div className={styles.profilePerformance}>
                        <strong>{desempenho}%</strong>
                        <span>Índice de desempenho</span>
                    </div>
                </section>

                {/* NAVEGAÇÃO */}
                <nav
                    className={styles.actionsRow}
                    aria-label="Ações do perfil do atleta"
                    style={{
                        position: 'relative',
                        zIndex: 10,
                    }}
                >
                    <button
                        type="button"
                        className={styles.actionButton}
                        onClick={handleEditar}
                        style={{
                            position: 'relative',
                            zIndex: 11,
                            pointerEvents: 'auto',
                        }}
                    >
                        <Edit3 size={17} />
                        Editar atleta
                    </button>

                    <button
                        type="button"
                        className={styles.actionButton}
                        onClick={onInformacoes}
                    >
                        <Info size={17} />
                        Informações
                    </button>

                    <button
                        type="button"
                        className={styles.actionButton}
                        onClick={onPartidas}
                        disabled={!onPartidas}
                    >
                        <Play size={17} />
                        Partidas
                    </button>

                    <button
                        type="button"
                        className={styles.actionButton}
                        onClick={onClipes}
                    >
                        <Video size={17} />
                        Clipes
                    </button>
                </nav>

                {/* ESTATÍSTICAS */}
                <section
                    className={styles.statsGrid}
                    aria-label="Estatísticas do atleta"
                >
                    {estatisticas.map((estatistica) => (
                        <div
                            className={styles.statItem}
                            key={estatistica.titulo}
                        >
                            <span className={styles.statLabel}>
                                {estatistica.titulo}
                            </span>

                            <strong
                                className={`${styles.statValue} ${estatistica.classe}`}
                            >
                                {estatistica.valor}
                            </strong>
                        </div>
                    ))}
                </section>

                {/* GRÁFICOS */}
                <section className={styles.chartsGrid}>
                    <article className={styles.chartCard}>
                        <div className={styles.chartHeader}>
                            <div>
                                <h2>Evolução ao longo do tempo</h2>
                                <p>
                                    Índice de desempenho por partida.
                                </p>
                            </div>

                            <div className={styles.chartIcon}>
                                <TrendingUp size={20} />
                            </div>
                        </div>

                        <div className={styles.lineChartContainer}>
                            <svg
                                className={styles.lineChart}
                                viewBox="0 0 650 270"
                                role="img"
                                aria-label="Evolução do desempenho nas últimas sete partidas"
                            >
                                <defs>
                                    <linearGradient
                                        id="areaAtletaClaro"
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                    >
                                        <stop
                                            offset="0%"
                                            stopColor="#16A875"
                                            stopOpacity="0.18"
                                        />
                                        <stop
                                            offset="100%"
                                            stopColor="#16A875"
                                            stopOpacity="0"
                                        />
                                    </linearGradient>
                                </defs>

                                {[0, 25, 50, 75, 100].map((valor) => {
                                    const y = 225 - valor * 1.85;

                                    return (
                                        <g key={valor}>
                                            <text
                                                x="12"
                                                y={y + 4}
                                                className={styles.axisLabel}
                                            >
                                                {valor}
                                            </text>

                                            <line
                                                x1="55"
                                                y1={y}
                                                x2="595"
                                                y2={y}
                                                className={styles.gridLine}
                                            />
                                        </g>
                                    );
                                })}

                                <path
                                    d={areaEvolucao}
                                    fill="url(#areaAtletaClaro)"
                                />

                                <path
                                    d={linhaEvolucao}
                                    fill="none"
                                    className={styles.dataLine}
                                />

                                {pontosEvolucao.map((ponto, index) => (
                                    <g key={index}>
                                        <circle
                                            cx={ponto.x}
                                            cy={ponto.y}
                                            r={index === 6 ? 5.5 : 3.5}
                                            className={
                                                index === 6
                                                    ? styles.lastDataPoint
                                                    : styles.dataPoint
                                            }
                                        />

                                        <text
                                            x={ponto.x}
                                            y="254"
                                            textAnchor="middle"
                                            className={styles.axisLabel}
                                        >
                                            P{index + 1}
                                        </text>
                                    </g>
                                ))}
                            </svg>
                        </div>
                    </article>

                    <article className={styles.chartCard}>
                        <div className={styles.chartHeader}>
                            <div>
                                <h2>Perfil de atributos</h2>
                                <p>Média das avaliações.</p>
                            </div>

                            <div className={styles.chartIcon}>
                                <Activity size={20} />
                            </div>
                        </div>

                        <div className={styles.radarContainer}>
                            <svg
                                className={styles.radarChart}
                                viewBox="0 0 320 300"
                                role="img"
                                aria-label="Gráfico dos atributos técnicos e físicos do atleta"
                            >
                                {[25, 50, 75, 100].map((nivel) => (
                                    <polygon
                                        key={nivel}
                                        points={criarPoligono(nivel)}
                                        className={styles.radarGrid}
                                    />
                                ))}

                                {dadosAtributos.map((_, index) => {
                                    const ponto = coordenadaRadar(
                                        index,
                                        100
                                    );

                                    return (
                                        <line
                                            key={index}
                                            x1="160"
                                            y1="145"
                                            x2={ponto.x}
                                            y2={ponto.y}
                                            className={styles.radarAxis}
                                        />
                                    );
                                })}

                                <polygon
                                    points={pontosRadar}
                                    className={styles.radarArea}
                                />

                                {dadosAtributos.map(
                                    (atributo, index) => {
                                        const ponto = coordenadaRadar(
                                            index,
                                            atributo.valor
                                        );

                                        return (
                                            <circle
                                                key={atributo.nome}
                                                cx={ponto.x}
                                                cy={ponto.y}
                                                r="4"
                                                className={styles.radarPoint}
                                            />
                                        );
                                    }
                                )}

                                {dadosAtributos.map(
                                    (atributo, index) => {
                                        const ponto = coordenadaRadar(
                                            index,
                                            126
                                        );

                                        return (
                                            <text
                                                key={atributo.nome}
                                                x={ponto.x}
                                                y={ponto.y + 4}
                                                textAnchor="middle"
                                                className={styles.radarLabel}
                                            >
                                                {atributo.nome}
                                            </text>
                                        );
                                    }
                                )}
                            </svg>
                        </div>
                    </article>
                </section>
            </main>
        </div>
    );
};

export default PerfilAtleta;