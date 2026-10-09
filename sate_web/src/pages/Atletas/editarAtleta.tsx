import {
    useEffect,
    useRef,
    useState,
} from 'react';

import {
    ArrowLeft,
    X,
    Check,
    User,
    Phone,
    FileText,
    Upload,
    Eye,
    Download,
    RefreshCw,
    Trash2,
    Camera,
} from 'lucide-react';

import styles from './editarAtleta.module.css';


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

interface EditarAtletaProps {
    atleta: Atleta;
    onBack: () => void;

    onSave?: (
        dados: Record<string, unknown>
    ) => Promise<void> | void;

    onDelete?: () => Promise<void> | void;
}


// ============================================================
// COMPONENTE
// ============================================================

const EditarAtleta = ({
    atleta,
    onBack,
    onSave,
    onDelete,
}: EditarAtletaProps) => {

    const inputFotoRef =
        useRef<HTMLInputElement | null>(null);


    // ========================================================
    // ABA
    // ========================================================

    const [abaAtiva, setAbaAtiva] = useState<
        'pessoais' | 'contato' | 'documentos'
    >('pessoais');


    // ========================================================
    // DADOS PESSOAIS
    // ========================================================

    const [nome, setNome] = useState('');
    const [dataNascimento, setDataNascimento] = useState('');
    const [sexo, setSexo] = useState('');
    const [categoria, setCategoria] = useState('');
    const [rg, setRg] = useState('');
    const [cpf, setCpf] = useState('');
    const [email, setEmail] = useState('');
    const [telefone, setTelefone] = useState('');


    // ========================================================
    // RESPONSÁVEL
    // ========================================================

    const [responsavelNome, setResponsavelNome] =
        useState('');

    const [responsavelGrau, setResponsavelGrau] =
        useState('');

    const [responsavelTelefone, setResponsavelTelefone] =
        useState('');


    // ========================================================
    // ENDEREÇO
    // ========================================================

    const [cep, setCep] = useState('');
    const [logradouro, setLogradouro] = useState('');
    const [numero, setNumero] = useState('');
    const [bairro, setBairro] = useState('');
    const [complemento, setComplemento] = useState('');
    const [cidade, setCidade] = useState('');
    const [estado, setEstado] = useState('');


    // ========================================================
    // FOTO
    // ========================================================

    const [fotoPreview, setFotoPreview] =
        useState<string | null>(null);

    const [fotoArquivo, setFotoArquivo] =
        useState<File | null>(null);


    // ========================================================
    // ESTADOS
    // ========================================================

    const [salvando, setSalvando] =
        useState(false);

    const [excluindo, setExcluindo] =
        useState(false);

    const [erro, setErro] =
        useState('');

    const [sucesso, setSucesso] =
        useState('');


    // ========================================================
    // DOCUMENTOS
    // ========================================================

    const documentos =
        atleta.documentos || [];


    // ========================================================
    // CARREGAR DADOS
    // ========================================================

    useEffect(() => {

        setNome(
            atleta.nome || ''
        );

        setDataNascimento(
            formatarDataParaInput(
                atleta.dataNascimento
            )
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


        // FOTO ATUAL

        setFotoPreview(
            atleta.usuario?.avatarUrl || null
        );

        setFotoArquivo(null);


        // RESPONSÁVEL

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


        // ENDEREÇO

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


    // ========================================================
    // FUNÇÕES AUXILIARES
    // ========================================================

    function formatarDataParaInput(
        data?: string | null
    ) {
        if (!data) {
            return '';
        }

        if (data.includes('T')) {
            return data.split('T')[0];
        }

        return data;
    }


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
            return 'pai';
        }

        if (valorNormalizado === 'mae') {
            return 'mae';
        }

        if (
            valorNormalizado ===
            'responsavel legal'
        ) {
            return 'responsavel';
        }

        return 'outro';
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


    function formatarDataExibicao(
        data?: string | null
    ) {
        if (!data) {
            return 'Data não informada';
        }

        const dataFormatada =
            new Date(data);

        if (
            Number.isNaN(
                dataFormatada.getTime()
            )
        ) {
            return 'Data não informada';
        }

        return dataFormatada.toLocaleDateString(
            'pt-BR'
        );
    }


    // ========================================================
    // FOTO
    // ========================================================

    const selecionarFoto = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {

        const arquivo =
            event.target.files?.[0];

        if (!arquivo) {
            return;
        }


        // VALIDAR TIPO

        const tiposPermitidos = [
            'image/jpeg',
            'image/jpg',
            'image/png',
        ];

        if (
            !tiposPermitidos.includes(
                arquivo.type
            )
        ) {
            setErro(
                'A foto precisa estar no formato JPG ou PNG.'
            );

            event.target.value = '';

            return;
        }


        // VALIDAR TAMANHO

        if (
            arquivo.size >
            5 * 1024 * 1024
        ) {
            setErro(
                'A foto deve ter no máximo 5 MB.'
            );

            event.target.value = '';

            return;
        }


        setErro('');
        setSucesso('');

        setFotoArquivo(arquivo);


        // PREVIEW

        const reader =
            new FileReader();

        reader.onload = () => {

            if (
                typeof reader.result ===
                'string'
            ) {

                setFotoPreview(
                    reader.result
                );

            }
        };

        reader.onerror = () => {

            setErro(
                'Não foi possível carregar a foto.'
            );

        };

        reader.readAsDataURL(arquivo);
    };


    const abrirSeletorFoto = () => {

        if (
            salvando ||
            excluindo
        ) {
            return;
        }

        inputFotoRef.current?.click();
    };


    // ========================================================
    // SALVAR ALTERAÇÕES
    // ========================================================

    const salvarAlteracoes = async () => {

        if (salvando) {
            return;
        }

        try {

            setSalvando(true);
            setErro('');
            setSucesso('');


            // ==================================================
            // VALIDAÇÕES
            // ==================================================

            if (!nome.trim()) {

                setErro(
                    'O nome do atleta é obrigatório.'
                );

                return;
            }


            if (!email.trim()) {

                setErro(
                    'O e-mail do atleta é obrigatório.'
                );

                return;
            }


            // ==================================================
            // DADOS
            // ==================================================

            const dados: Record<string, unknown> = {

                nome:
                    nome.trim(),

                dataNascimento:
                    dataNascimento ||
                    null,

                sexo:
                    sexo ||
                    null,

                categoria:
                    categoria.trim() ||
                    null,

                rg:
                    rg.trim() ||
                    null,

                cpf:
                    cpf.trim() ||
                    null,

                email:
                    email.trim(),

                telefone:
                    telefone.trim() ||
                    null,


                // ==============================================
                // FOTO
                // ==============================================

                avatarUrl:
                    fotoPreview ||
                    null,


                // ==============================================
                // RESPONSÁVEL
                // ==============================================

                responsavel:
                    responsavelNome.trim()
                        ? {
                            nome:
                                responsavelNome.trim(),

                            grauParentesco:
                                responsavelGrau,

                            telefone:
                                responsavelTelefone.trim(),
                        }
                        : null,


                // ==============================================
                // ENDEREÇO
                // ==============================================

                endereco:
                    cep.trim() ||
                    logradouro.trim() ||
                    numero.trim() ||
                    bairro.trim()
                        ? {
                            cep:
                                cep.trim(),

                            logradouro:
                                logradouro.trim(),

                            numero:
                                numero.trim(),

                            bairro:
                                bairro.trim(),

                            complemento:
                                complemento.trim() ||
                                null,

                            cidade:
                                cidade.trim() ||
                                null,

                            estado:
                                estado.trim() ||
                                null,
                        }
                        : null,
            };


            console.log(
                'Dados enviados para atualizar atleta:',
                {
                    ...dados,
                    avatarUrl: fotoPreview
                        ? `Base64 (${fotoPreview.length} caracteres)`
                        : null,
                }
            );


            // ==================================================
            // SALVAR
            // ==================================================

            if (onSave) {

                await onSave(
                    dados
                );

            } else {

                throw new Error(
                    'A função de salvamento do atleta não foi configurada.'
                );

            }


            // ==================================================
            // FINALIZADO
            // ==================================================

            setFotoArquivo(null);

            setSucesso(
                'Alterações salvas com sucesso!'
            );

        } catch (error) {

            console.error(
                'Erro ao salvar atleta:',
                error
            );


            setErro(
                error instanceof Error
                    ? error.message
                    : 'Não foi possível salvar as alterações.'
            );

        } finally {

            setSalvando(false);
        }
    };


    // ========================================================
    // EXCLUIR ATLETA
    // ========================================================

    const excluirAtleta = async () => {

        const confirmou =
            window.confirm(
                `Tem certeza que deseja excluir o atleta "${nomeExibicao}"?\n\nEssa ação não poderá ser desfeita.`
            );

        if (!confirmou) {
            return;
        }


        try {

            setExcluindo(true);
            setErro('');

            if (onDelete) {

                await onDelete();

                return;
            }

        } catch (error) {

            console.error(
                'Erro ao excluir atleta:',
                error
            );

            setErro(
                error instanceof Error
                    ? error.message
                    : 'Não foi possível excluir o atleta.'
            );

        } finally {

            setExcluindo(false);
        }
    };


    // ========================================================
    // EXIBIÇÃO
    // ========================================================

    const nomeExibicao =
        nome ||
        atleta.nome ||
        'Atleta';


    const categoriaExibicao =
        categoria ||
        'Sem categoria';


    const idade =
        calcularIdade(
            dataNascimento ||
            atleta.dataNascimento
        );


    const cpfExibicao =
        cpf ||
        'Não informado';


    const inicial =
        nomeExibicao
            .charAt(0)
            .toUpperCase();


    // ========================================================
    // RENDER
    // ========================================================

    return (
        <div className={styles.page}>

            {/* =================================================
                VOLTAR
            ================================================= */}

            <button
                type="button"
                className={styles.backButton}
                onClick={onBack}
                disabled={
                    salvando ||
                    excluindo
                }
            >
                <ArrowLeft size={17} />

                Voltar para atletas
            </button>


            {/* =================================================
                CARD DO PERFIL
            ================================================= */}

            <div className={styles.profileCard}>

                <div className={styles.profileTop}>

                    <div
                        className={
                            styles.profileHeaderLeft
                        }
                    >

                        {/* =================================================
                            FOTO
                        ================================================= */}

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


                        {/* =================================================
                            INFORMAÇÕES
                        ================================================= */}

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
                                Foto de perfil JPG ou PNG
                            </p>


                            <div
                                style={{
                                    display: 'flex',
                                    gap: '8px',
                                    marginTop: '8px',
                                    flexWrap: 'wrap',
                                }}
                            >

                                <input
                                    ref={inputFotoRef}
                                    type="file"
                                    accept="image/jpeg,image/jpg,image/png"
                                    onChange={
                                        selecionarFoto
                                    }
                                    style={{
                                        display: 'none',
                                    }}
                                />


                                <button
                                    type="button"
                                    onClick={
                                        abrirSeletorFoto
                                    }
                                    disabled={
                                        salvando ||
                                        excluindo
                                    }
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '7px',
                                        border: 'none',
                                        borderRadius: '8px',
                                        padding: '8px 12px',
                                        cursor: 'pointer',
                                        background: '#E8F5F0',
                                        color: '#005C45',
                                        fontWeight: 600,
                                        fontSize: '13px',
                                    }}
                                >

                                    <Camera size={15} />

                                    {fotoPreview
                                        ? 'Trocar foto'
                                        : 'Adicionar foto'
                                    }

                                </button>

                            </div>


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
                                        ` (${formatarDataExibicao(
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

                                    CPF: {cpfExibicao}

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


                    {/* =================================================
                        BOTÕES
                    ================================================= */}

                    <div
                        className={
                            styles.profileHeaderActions
                        }
                    >

                        <button
                            type="button"
                            className={
                                styles.discardButton
                            }
                            onClick={onBack}
                            disabled={
                                salvando ||
                                excluindo
                            }
                        >
                            <X size={18} />

                            Descartar Alterações
                        </button>


                        <button
                            type="button"
                            className={
                                styles.saveButton
                            }
                            onClick={
                                salvarAlteracoes
                            }
                            disabled={
                                salvando ||
                                excluindo
                            }
                        >

                            <Check size={18} />

                            {salvando
                                ? 'Salvando...'
                                : 'Salvar Alterações'
                            }

                        </button>


                        <button
                            type="button"
                            onClick={
                                excluirAtleta
                            }
                            disabled={
                                salvando ||
                                excluindo
                            }
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                border: '1px solid #D52941',
                                background: '#fff',
                                color: '#D52941',
                                borderRadius: '9px',
                                padding: '10px 14px',
                                fontWeight: 600,
                                cursor: 'pointer',
                            }}
                        >

                            <Trash2 size={17} />

                            {excluindo
                                ? 'Excluindo...'
                                : 'Excluir atleta'
                            }

                        </button>

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


            {/* =================================================
                MENSAGENS
            ================================================= */}

            {erro && (

                <div
                    style={{
                        marginTop: '16px',
                        padding: '12px 16px',
                        borderRadius: '10px',
                        background: '#FDECEC',
                        color: '#D52941',
                        fontSize: '14px',
                    }}
                >
                    {erro}
                </div>

            )}


            {sucesso && (

                <div
                    style={{
                        marginTop: '16px',
                        padding: '12px 16px',
                        borderRadius: '10px',
                        background: '#E8F5F0',
                        color: '#005C45',
                        fontSize: '14px',
                    }}
                >
                    {sucesso}
                </div>

            )}


            {/* =================================================
                CONTEÚDO
            ================================================= */}

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

                                    <span
                                        className={
                                            styles.required
                                        }
                                    >
                                        *
                                    </span>
                                </label>


                                <input
                                    type="text"
                                    value={nome}
                                    onChange={(event) =>
                                        setNome(
                                            event.target.value
                                        )
                                    }
                                />

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

                                    <span
                                        className={
                                            styles.required
                                        }
                                    >
                                        *
                                    </span>
                                </label>


                                <input
                                    type="date"
                                    value={
                                        dataNascimento
                                    }
                                    onChange={(event) =>
                                        setDataNascimento(
                                            event.target.value
                                        )
                                    }
                                />

                            </div>


                            <div
                                className={
                                    styles.formGroup
                                }
                            >

                                <label>
                                    Sexo
                                </label>


                                <select
                                    value={sexo}
                                    onChange={(event) =>
                                        setSexo(
                                            event.target.value
                                        )
                                    }
                                >

                                    <option value="">
                                        Selecione
                                    </option>

                                    <option value="MASCULINO">
                                        Masculino
                                    </option>

                                    <option value="FEMININO">
                                        Feminino
                                    </option>

                                    <option value="OUTRO">
                                        Outro
                                    </option>

                                    <option value="NAO_INFORMADO">
                                        Não informado
                                    </option>

                                </select>

                            </div>


                            <div
                                className={
                                    styles.formGroup
                                }
                            >

                                <label>
                                    Categoria
                                </label>


                                <input
                                    type="text"
                                    value={categoria}
                                    onChange={(event) =>
                                        setCategoria(
                                            event.target.value
                                        )
                                    }
                                />

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


                                <input
                                    type="text"
                                    value={rg}
                                    onChange={(event) =>
                                        setRg(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Digite o RG..."
                                />

                            </div>


                            <div
                                className={
                                    styles.formGroup
                                }
                            >

                                <label>
                                    Cadastro de Pessoa Física (CPF)
                                </label>


                                <input
                                    type="text"
                                    value={cpf}
                                    onChange={(event) =>
                                        setCpf(
                                            event.target.value
                                        )
                                    }
                                />

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


                                <input
                                    type="email"
                                    value={email}
                                    onChange={(event) =>
                                        setEmail(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Digite o e-mail..."
                                />

                            </div>


                            <div
                                className={
                                    styles.formGroup
                                }
                            >

                                <label>
                                    Telefone
                                </label>


                                <input
                                    type="tel"
                                    value={telefone}
                                    onChange={(event) =>
                                        setTelefone(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Digite o telefone..."
                                />

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


                                <input
                                    type="text"
                                    value={
                                        responsavelNome
                                    }
                                    onChange={(event) =>
                                        setResponsavelNome(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Digite o nome..."
                                />

                            </div>


                            <div
                                className={
                                    styles.formGroup
                                }
                            >

                                <label>
                                    Grau de Parentesco
                                </label>


                                <select
                                    value={
                                        responsavelGrau
                                    }
                                    onChange={(event) =>
                                        setResponsavelGrau(
                                            event.target.value
                                        )
                                    }
                                >

                                    <option value="">
                                        Selecione
                                    </option>

                                    <option value="pai">
                                        Pai
                                    </option>

                                    <option value="mae">
                                        Mãe
                                    </option>

                                    <option value="responsavel">
                                        Responsável legal
                                    </option>

                                    <option value="outro">
                                        Outro
                                    </option>

                                </select>

                            </div>


                            <div
                                className={
                                    styles.formGroup
                                }
                            >

                                <label>
                                    Telefone
                                </label>


                                <input
                                    type="tel"
                                    value={
                                        responsavelTelefone
                                    }
                                    onChange={(event) =>
                                        setResponsavelTelefone(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Digite o telefone..."
                                />

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


                                <input
                                    type="text"
                                    value={cep}
                                    onChange={(event) =>
                                        setCep(
                                            event.target.value
                                        )
                                    }
                                    placeholder="00000-000"
                                />

                            </div>


                            <div
                                className={
                                    styles.formGroup
                                }
                            >

                                <label>
                                    Endereço
                                </label>


                                <input
                                    type="text"
                                    value={logradouro}
                                    onChange={(event) =>
                                        setLogradouro(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Digite o endereço..."
                                />

                            </div>


                            <div
                                className={
                                    styles.formGroupSmall
                                }
                            >

                                <label>
                                    Nº
                                </label>


                                <input
                                    type="text"
                                    value={numero}
                                    onChange={(event) =>
                                        setNumero(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Nº"
                                />

                            </div>


                            <div
                                className={
                                    styles.formGroup
                                }
                            >

                                <label>
                                    Bairro
                                </label>


                                <input
                                    type="text"
                                    value={bairro}
                                    onChange={(event) =>
                                        setBairro(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Digite o bairro..."
                                />

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


                                <input
                                    type="text"
                                    value={complemento}
                                    onChange={(event) =>
                                        setComplemento(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Apartamento, bloco..."
                                />

                            </div>


                            <div
                                className={
                                    styles.formGroup
                                }
                            >

                                <label>
                                    Cidade
                                </label>


                                <input
                                    type="text"
                                    value={cidade}
                                    onChange={(event) =>
                                        setCidade(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Digite a cidade..."
                                />

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
                                    Gerenciamento de autorizações
                                    e termos de viagem.
                                </p>

                            </div>


                            <button
                                type="button"
                                className={
                                    styles.uploadButton
                                }
                            >
                                <Upload size={18} />

                                Upload de novo documento
                            </button>

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


                                                <button
                                                    type="button"
                                                    className={
                                                        styles.docActionIcon
                                                    }
                                                    title="Atualizar"
                                                >

                                                    <RefreshCw
                                                        size={16}
                                                    />

                                                </button>

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


export default EditarAtleta;