import {
    ArrowLeft,
    Check,
    User,
    Phone,
    FileText,
    Eye,
    Download,
} from 'lucide-react';

import {
    useEffect,
    useState,
} from 'react';

import styles from './informacoesAtleta.module.css';


// ============================================================
// TIPOS
// ============================================================

interface Documento {
    id: number;
    nome: string;
    tipo: string;
    url: string;
    createdAt?: string;
    updatedAt?: string;
}

interface Atleta {
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

    documentos?: Documento[];
}


// ============================================================
// PROPS
// ============================================================

interface InformacoesAtletaProps {
    atleta: Atleta;
    onBack: () => void;
}


// ============================================================
// COMPONENTE
// ============================================================

const InformacoesAtleta = ({
    atleta,
    onBack,
}: InformacoesAtletaProps) => {

    const [abaAtiva, setAbaAtiva] = useState<
        'pessoais' | 'contato' | 'documentos'
    >('pessoais');


    const [nome, setNome] = useState('');
    const [dataNascimento, setDataNascimento] = useState('');
    const [sexo, setSexo] = useState('');
    const [categoria, setCategoria] = useState('');
    const [rg, setRg] = useState('');
    const [cpf, setCpf] = useState('');
    const [email, setEmail] = useState('');
    const [telefone, setTelefone] = useState('');

    const [responsavelNome, setResponsavelNome] =
        useState('');

    const [responsavelGrau, setResponsavelGrau] =
        useState('');

    const [responsavelTelefone, setResponsavelTelefone] =
        useState('');

    const [cep, setCep] = useState('');
    const [logradouro, setLogradouro] = useState('');
    const [numero, setNumero] = useState('');
    const [bairro, setBairro] = useState('');
    const [complemento, setComplemento] = useState('');
    const [cidade, setCidade] = useState('');
    const [estado, setEstado] = useState('');

    const [fotoPreview, setFotoPreview] =
        useState<string | null>(null);


    // ============================================================
    // CARREGAR DADOS
    // ============================================================

    useEffect(() => {

        setNome(
            atleta.nome || ''
        );

        setDataNascimento(
            atleta.dataNascimento || ''
        );

        setSexo(
            normalizarSexo(
                atleta.sexo
            )
        );

        setCategoria(
            atleta.categoria || ''
        );

        setRg(
            atleta.rg || ''
        );

        setCpf(
            atleta.cpf || ''
        );

        setEmail(
            atleta.usuario?.email || ''
        );

        setTelefone(
            atleta.telefone || ''
        );

        setFotoPreview(
            atleta.usuario?.avatarUrl || null
        );


        setResponsavelNome(
            atleta.responsavel?.nome || ''
        );

        setResponsavelGrau(
            normalizarGrauParentesco(
                atleta.responsavel?.grauParentesco
            )
        );

        setResponsavelTelefone(
            atleta.responsavel?.telefone || ''
        );


        setCep(
            atleta.endereco?.cep || ''
        );

        setLogradouro(
            atleta.endereco?.logradouro || ''
        );

        setNumero(
            atleta.endereco?.numero || ''
        );

        setBairro(
            atleta.endereco?.bairro || ''
        );

        setComplemento(
            atleta.endereco?.complemento || ''
        );

        setCidade(
            atleta.endereco?.cidade || ''
        );

        setEstado(
            atleta.endereco?.estado || ''
        );

    }, [atleta]);


    // ============================================================
    // FUNÇÕES
    // ============================================================

    function normalizarSexo(
        valor?: string | null
    ) {
        if (!valor) {
            return '';
        }

        const valorNormalizado =
            valor.toUpperCase();

        if (
            valorNormalizado === 'MASCULINO' ||
            valorNormalizado === 'M'
        ) {
            return 'MASCULINO';
        }

        if (
            valorNormalizado === 'FEMININO' ||
            valorNormalizado === 'F'
        ) {
            return 'FEMININO';
        }

        if (
            valorNormalizado === 'OUTRO'
        ) {
            return 'OUTRO';
        }

        if (
            valorNormalizado === 'NAO_INFORMADO'
        ) {
            return 'NAO_INFORMADO';
        }

        return '';
    }


    function normalizarGrauParentesco(
        valor?: string | null
    ) {
        if (!valor) {
            return '';
        }

        const valorNormalizado =
            valor
                .toLowerCase()
                .normalize('NFD')
                .replace(
                    /[\u0300-\u036f]/g,
                    ''
                );

        if (valorNormalizado === 'pai') {
            return 'Pai';
        }

        if (valorNormalizado === 'mae') {
            return 'Mãe';
        }

        if (
            valorNormalizado ===
            'responsavel legal'
        ) {
            return 'Responsável legal';
        }

        return 'Outro';
    }


    function formatarSexo(
        valor: string
    ) {
        switch (valor) {
            case 'MASCULINO':
                return 'Masculino';

            case 'FEMININO':
                return 'Feminino';

            case 'OUTRO':
                return 'Outro';

            case 'NAO_INFORMADO':
                return 'Não informado';

            default:
                return 'Não informado';
        }
    }


    function formatarData(
        data?: string | null
    ) {
        if (!data) {
            return 'Não informado';
        }

        const dataFormatada =
            new Date(data);

        if (
            Number.isNaN(
                dataFormatada.getTime()
            )
        ) {
            return 'Não informado';
        }

        return dataFormatada.toLocaleDateString(
            'pt-BR'
        );
    }


    function calcularIdade(
        data?: string | null
    ) {
        if (!data) {
            return null;
        }

        const nascimento =
            new Date(data);

        if (
            Number.isNaN(
                nascimento.getTime()
            )
        ) {
            return null;
        }

        const hoje =
            new Date();

        let idade =
            hoje.getFullYear() -
            nascimento.getFullYear();

        const mes =
            hoje.getMonth() -
            nascimento.getMonth();

        if (
            mes < 0 ||
            (
                mes === 0 &&
                hoje.getDate() <
                nascimento.getDate()
            )
        ) {
            idade--;
        }

        return idade;
    }


    function valor(
        texto?: string | null
    ) {
        return texto?.trim()
            ? texto
            : 'Não informado';
    }


    const documentos =
        atleta.documentos || [];

    const nomeExibicao =
        nome ||
        atleta.nome ||
        'Atleta';

    const categoriaExibicao =
        categoria ||
        'Sem categoria';

    const idade =
        calcularIdade(
            dataNascimento
        );

    const inicial =
        nomeExibicao
            .charAt(0)
            .toUpperCase();


    // ============================================================
    // RENDER
    // ============================================================

    return (
        <div className={styles.page}>

            {/* =====================================================
                VOLTAR
            ===================================================== */}

            <button
                type="button"
                className={styles.backButton}
                onClick={onBack}
            >
                <ArrowLeft size={17} />

                Voltar para atletas
            </button>

            <header className={styles.pageHeader}>
                <h1>
                    Informações do <em>atleta.</em>
                </h1>

                <p>
                    Consulte os dados pessoais, contato e documentos cadastrados.
                </p>
            </header>


            {/* =====================================================
                CARD DO PERFIL
            ===================================================== */}

            <div className={styles.profileCard}>

                <div className={styles.profileTop}>

                    <div
                        className={
                            styles.profileHeaderLeft
                        }
                    >

                        {/* FOTO */}

                        <div
                            className={
                                styles.photoContainer
                            }
                        >

                            <div
                                className={
                                    styles.photoWrapper
                                }
                            >

                                {fotoPreview ? (

                                    <img
                                        src={fotoPreview}
                                        alt={
                                            `Foto de ${nomeExibicao}`
                                        }
                                        className={
                                            styles.photo
                                        }
                                    />

                                ) : (

                                    <div
                                        className={
                                            styles.photoFallback
                                        }
                                    >
                                        {inicial}
                                    </div>

                                )}

                            </div>

                            <div
                                className={
                                    styles.photoCheck
                                }
                            >
                                <Check size={14} />
                            </div>

                        </div>


                        {/* INFORMAÇÕES */}

                        <div
                            className={
                                styles.profileHeaderInfo
                            }
                        >

                            <div
                                className={
                                    styles.nameRow
                                }
                            >

                                <h1>
                                    {nomeExibicao}
                                </h1>

                                <span
                                    className={
                                        styles.categoryTag
                                    }
                                >
                                    {categoriaExibicao}
                                </span>

                            </div>


                            <p
                                className={
                                    styles.photoHint
                                }
                            >
                                Informações do atleta
                            </p>


                            <div
                                className={
                                    styles.badgesRow
                                }
                            >

                                <span
                                    className={
                                        styles.badge
                                    }
                                >

                                    <FileText size={14} />

                                    {idade !== null
                                        ? `${idade} anos`
                                        : 'Idade não informada'
                                    }

                                    {dataNascimento &&
                                        ` (${formatarData(
                                            dataNascimento
                                        )})`
                                    }

                                </span>


                                <span
                                    className={
                                        styles.badge
                                    }
                                >

                                    <FileText size={14} />

                                    CPF: {valor(cpf)}

                                </span>

                            </div>


                            <div
                                className={
                                    styles.statusRow
                                }
                            >

                                <span
                                    className={
                                        styles.statusBadge
                                    }
                                >

                                    <Check size={14} />

                                    Status dos Documentos:{' '}

                                    {documentos.length > 0
                                        ? `${documentos.length} documento${
                                            documentos.length > 1
                                                ? 's'
                                                : ''
                                        }`
                                        : 'Nenhum documento'
                                    }

                                </span>

                            </div>

                        </div>

                    </div>

                </div>


                <div
                    className={styles.divider}
                />


                {/* =================================================
                    ABAS
                ================================================= */}

                <div
                    className={
                        styles.tabsContainer
                    }
                >

                    <span
                        className={
                            styles.tabsLabel
                        }
                    >
                        Filtrar:
                    </span>


                    <button
                        type="button"
                        className={`
                            ${styles.tabButton}
                            ${
                                abaAtiva === 'pessoais'
                                    ? styles.tabActive
                                    : ''
                            }
                        `}
                        onClick={() =>
                            setAbaAtiva('pessoais')
                        }
                    >
                        <User size={16} />

                        Dados pessoais
                    </button>


                    <button
                        type="button"
                        className={`
                            ${styles.tabButton}
                            ${
                                abaAtiva === 'contato'
                                    ? styles.tabActive
                                    : ''
                            }
                        `}
                        onClick={() =>
                            setAbaAtiva('contato')
                        }
                    >
                        <Phone size={16} />

                        Contato
                    </button>


                    <button
                        type="button"
                        className={`
                            ${styles.tabButton}
                            ${
                                abaAtiva === 'documentos'
                                    ? styles.tabActive
                                    : ''
                            }
                        `}
                        onClick={() =>
                            setAbaAtiva('documentos')
                        }
                    >
                        <FileText size={16} />

                        Documentos
                    </button>

                </div>

            </div>


            {/* =====================================================
                CONTEÚDO
            ===================================================== */}

            <div
                className={styles.formCard}
            >

                {/* =================================================
                    DADOS PESSOAIS
                ================================================= */}

                {abaAtiva === 'pessoais' && (

                    <>

                        <h2
                            className={
                                styles.formTitle
                            }
                        >
                            Dados pessoais
                        </h2>


                        <div
                            className={
                                styles.formGrid
                            }
                        >

                            <div
                                className={
                                    styles.formGroup
                                }
                            >

                                <label>
                                    Nome completo do atleta
                                </label>

                                <div
                                    className={
                                        styles.readonlyField
                                    }
                                >
                                    {valor(nome)}
                                </div>

                            </div>

                        </div>


                        <div
                            className={
                                styles.formGrid3
                            }
                        >

                            <div
                                className={
                                    styles.formGroup
                                }
                            >

                                <label>
                                    Data de Nascimento
                                </label>

                                <div
                                    className={
                                        styles.readonlyField
                                    }
                                >
                                    {formatarData(
                                        dataNascimento
                                    )}
                                </div>

                            </div>


                            <div
                                className={
                                    styles.formGroup
                                }
                            >

                                <label>
                                    Sexo
                                </label>

                                <div
                                    className={
                                        styles.readonlyField
                                    }
                                >
                                    {formatarSexo(sexo)}
                                </div>

                            </div>


                            <div
                                className={
                                    styles.formGroup
                                }
                            >

                                <label>
                                    Categoria
                                </label>

                                <div
                                    className={
                                        styles.readonlyField
                                    }
                                >
                                    {valor(categoria)}
                                </div>

                            </div>

                        </div>


                        <div
                            className={
                                styles.formGrid2
                            }
                        >

                            <div
                                className={
                                    styles.formGroup
                                }
                            >

                                <label>
                                    Registro Geral (RG)
                                </label>

                                <div
                                    className={
                                        styles.readonlyField
                                    }
                                >
                                    {valor(rg)}
                                </div>

                            </div>


                            <div
                                className={
                                    styles.formGroup
                                }
                            >

                                <label>
                                    Cadastro de Pessoa Física (CPF)
                                </label>

                                <div
                                    className={
                                        styles.readonlyField
                                    }
                                >
                                    {valor(cpf)}
                                </div>

                            </div>

                        </div>


                        <div
                            className={
                                styles.formGrid2
                            }
                        >

                            <div
                                className={
                                    styles.formGroup
                                }
                            >

                                <label>
                                    E-mail
                                </label>

                                <div
                                    className={
                                        styles.readonlyField
                                    }
                                >
                                    {valor(email)}
                                </div>

                            </div>


                            <div
                                className={
                                    styles.formGroup
                                }
                            >

                                <label>
                                    Telefone
                                </label>

                                <div
                                    className={
                                        styles.readonlyField
                                    }
                                >
                                    {valor(telefone)}
                                </div>

                            </div>

                        </div>

                    </>
                )}


                {/* =================================================
                    CONTATO
                ================================================= */}

                {abaAtiva === 'contato' && (

                    <>

                        <h2
                            className={
                                styles.formTitle
                            }
                        >
                            Dados do Responsável
                        </h2>


                        <div
                            className={
                                styles.formGrid3
                            }
                        >

                            <div
                                className={
                                    styles.formGroup
                                }
                            >

                                <label>
                                    Nome do Responsável
                                </label>

                                <div
                                    className={
                                        styles.readonlyField
                                    }
                                >
                                    {valor(
                                        responsavelNome
                                    )}
                                </div>

                            </div>


                            <div
                                className={
                                    styles.formGroup
                                }
                            >

                                <label>
                                    Grau de Parentesco
                                </label>

                                <div
                                    className={
                                        styles.readonlyField
                                    }
                                >
                                    {valor(
                                        responsavelGrau
                                    )}
                                </div>

                            </div>


                            <div
                                className={
                                    styles.formGroup
                                }
                            >

                                <label>
                                    Telefone
                                </label>

                                <div
                                    className={
                                        styles.readonlyField
                                    }
                                >
                                    {valor(
                                        responsavelTelefone
                                    )}
                                </div>

                            </div>

                        </div>


                        <h2
                            className={
                                styles.sectionTitle
                            }
                        >
                            Endereço
                        </h2>


                        <div
                            className={
                                styles.formGridAddress
                            }
                        >

                            <div
                                className={
                                    styles.formGroup
                                }
                            >

                                <label>
                                    CEP
                                </label>

                                <div
                                    className={
                                        styles.readonlyField
                                    }
                                >
                                    {valor(cep)}
                                </div>

                            </div>


                            <div
                                className={
                                    styles.formGroup
                                }
                            >

                                <label>
                                    Endereço
                                </label>

                                <div
                                    className={
                                        styles.readonlyField
                                    }
                                >
                                    {valor(logradouro)}
                                </div>

                            </div>


                            <div
                                className={
                                    styles.formGroupSmall
                                }
                            >

                                <label>
                                    Nº
                                </label>

                                <div
                                    className={
                                        styles.readonlyField
                                    }
                                >
                                    {valor(numero)}
                                </div>

                            </div>


                            <div
                                className={
                                    styles.formGroup
                                }
                            >

                                <label>
                                    Bairro
                                </label>

                                <div
                                    className={
                                        styles.readonlyField
                                    }
                                >
                                    {valor(bairro)}
                                </div>

                            </div>

                        </div>


                        <div
                            className={
                                styles.formGrid2
                            }
                        >

                            <div
                                className={
                                    styles.formGroup
                                }
                            >

                                <label>
                                    Complemento
                                </label>

                                <div
                                    className={
                                        styles.readonlyField
                                    }
                                >
                                    {valor(complemento)}
                                </div>

                            </div>


                            <div
                                className={
                                    styles.formGroup
                                }
                            >

                                <label>
                                    Cidade
                                </label>

                                <div
                                    className={
                                        styles.readonlyField
                                    }
                                >
                                    {valor(cidade)}
                                </div>

                            </div>

                        </div>


                        <div
                            className={
                                styles.formGrid2
                            }
                            style={{
                                marginTop: '18px',
                            }}
                        >

                            <div
                                className={
                                    styles.formGroup
                                }
                            >

                                <label>
                                    Estado
                                </label>

                                <div
                                    className={
                                        styles.readonlyField
                                    }
                                >
                                    {valor(estado)}
                                </div>

                            </div>


                            <div
                                className={
                                    styles.formGroup
                                }
                            >

                                <label>
                                    Equipe
                                </label>

                                <div
                                    className={
                                        styles.readonlyField
                                    }
                                >
                                    {atleta.equipe?.nome ||
                                        'Não informado'}
                                </div>

                            </div>

                        </div>

                    </>
                )}


                {/* =================================================
                    DOCUMENTOS
                ================================================= */}

                {abaAtiva === 'documentos' && (

                    <>

                        <div
                            className={
                                styles.docsHeader
                            }
                        >

                            <div>

                                <h2
                                    className={
                                        styles.formTitle
                                    }
                                >
                                    Repositório de Documentos e Termos
                                </h2>

                                <p
                                    className={
                                        styles.docsSubtitle
                                    }
                                >
                                    Documentos cadastrados
                                    para este atleta.
                                </p>

                            </div>

                        </div>


                        {documentos.length === 0 ? (

                            <div
                                style={{
                                    padding: '40px 20px',
                                    textAlign: 'center',
                                    color: '#6B7D76',
                                }}
                            >

                                <FileText
                                    size={34}
                                    style={{
                                        marginBottom: '10px',
                                    }}
                                />

                                <p>
                                    Nenhum documento cadastrado
                                    para este atleta.
                                </p>

                            </div>

                        ) : (

                            <div
                                className={
                                    styles.docsGrid
                                }
                            >

                                {documentos.map(
                                    (doc) => (

                                        <div
                                            key={doc.id}
                                            className={
                                                styles.docCard
                                            }
                                        >

                                            <div
                                                className={
                                                    styles.docCardHeader
                                                }
                                            >

                                                <span
                                                    className={
                                                        styles.docStatus
                                                    }
                                                >

                                                    <Check size={12} />

                                                    Válido

                                                </span>


                                                <span
                                                    className={
                                                        styles.docMeta
                                                    }
                                                >
                                                    {doc.tipo}
                                                </span>

                                            </div>


                                            <h4
                                                className={
                                                    styles.docTitle
                                                }
                                            >
                                                {doc.nome}
                                            </h4>


                                            <span
                                                className={
                                                    styles.docValidity
                                                }
                                            >
                                                Documento cadastrado
                                            </span>


                                            <div
                                                className={
                                                    styles.docCardFooter
                                                }
                                            >

                                                <button
                                                    type="button"
                                                    className={
                                                        styles.docAction
                                                    }
                                                    onClick={() =>
                                                        window.open(
                                                            doc.url,
                                                            '_blank'
                                                        )
                                                    }
                                                >

                                                    <Eye size={14} />

                                                    Visualizar

                                                </button>


                                                <a
                                                    href={doc.url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className={
                                                        styles.docAction
                                                    }
                                                >

                                                    <Download size={14} />

                                                    PDF

                                                </a>

                                            </div>

                                        </div>

                                    )
                                )}

                            </div>

                        )}

                    </>

                )}

            </div>

        </div>
    );
};


export default InformacoesAtleta;