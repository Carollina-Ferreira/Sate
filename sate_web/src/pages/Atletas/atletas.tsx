import {
    ChevronDown,
    Eye,
    ListFilter,
    Plus,
    Search,
    Scissors,
    UserRound,
    X,
} from 'lucide-react';

import {
    useEffect,
    useMemo,
    useState,
} from 'react';

import styles from './atletas.module.css';

import PerfilAtleta from './perfilAtletas.tsx';
import EditarAtleta from './editarAtleta.tsx';
import ClipesAtleta from './clipesAtleta.tsx';


// ============================================================
// TIPOS
// ============================================================

export interface DocumentoAtleta {
    id: number;
    nome: string;
    tipo: string;
    url: string;
    createdAt?: string;
    updatedAt?: string;
}


export interface AtletaBackend {
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

    documentos?: DocumentoAtleta[];
}


interface Atleta {
    id: number;
    nome: string;
    equipe: string;
    posicao: string;
    modalidade: string;
    frequencia: number;
    cor: string;
    email?: string;
    categoria?: string;
    avatarUrl?: string | null;
}


interface NovoAtletaForm {
    nome: string;
    dataNascimento: string;
    sexo: string;
    categoria: string;
    rg: string;
    cpf: string;
    email: string;
    telefone: string;
    responsavelNome: string;
    responsavelGrau: string;
    responsavelTelefone: string;
}


type TelaAtual =
    | 'lista'
    | 'perfil'
    | 'editar'
    | 'clipes';


const API_URL = 'http://localhost:3000';


// ============================================================
// COMPONENTE
// ============================================================

const Atletas = () => {

    // ========================================================
    // ESTADOS
    // ========================================================

    const [atletas, setAtletas] =
        useState<Atleta[]>([]);

    const [atletaSelecionado, setAtletaSelecionado] =
        useState<AtletaBackend | null>(null);

    const [telaAtual, setTelaAtual] =
        useState<TelaAtual>('lista');

    const [busca, setBusca] =
        useState('');

    const [filtroModalidade, setFiltroModalidade] =
        useState('Todas');

    const [filtroCategoria, setFiltroCategoria] =
        useState('Todas');

    const [filtroEquipe, setFiltroEquipe] =
        useState('Todas');

    const [mostrarFiltros, setMostrarFiltros] =
        useState(false);

    const [mostrarCadastro, setMostrarCadastro] =
        useState(false);

    const [carregando, setCarregando] =
        useState(true);

    const [erro, setErro] =
        useState('');

    const [novoAtleta, setNovoAtleta] =
        useState<NovoAtletaForm>({
            nome: '',
            dataNascimento: '',
            sexo: '',
            categoria: '',
            rg: '',
            cpf: '',
            email: '',
            telefone: '',
            responsavelNome: '',
            responsavelGrau: '',
            responsavelTelefone: '',
        });


    // ========================================================
    // TOKEN
    // ========================================================

    const obterToken = () => {
        return (
            localStorage.getItem('token') ||
            localStorage.getItem('accessToken') ||
            ''
        );
    };


    // ========================================================
    // HEADERS
    // ========================================================

    const headersAutenticacao = () => {
        const token = obterToken();

        return {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        };
    };


    // ========================================================
    // CARREGAR ATLETAS
    // ========================================================

    const carregarAtletas = async () => {

        try {

            setCarregando(true);
            setErro('');

            const resposta = await fetch(
                `${API_URL}/api/atletas`,
                {
                    method: 'GET',
                    headers: headersAutenticacao(),
                }
            );

            if (!resposta.ok) {

                const dadosErro =
                    await resposta
                        .json()
                        .catch(() => null);

                throw new Error(
                    dadosErro?.mensagem ||
                    'Não foi possível carregar os atletas.'
                );
            }

            const dados: AtletaBackend[] =
                await resposta.json();


            const atletasFormatados: Atleta[] =
                dados.map((atleta) => ({

                    id: atleta.id,

                    nome:
                        atleta.nome ||
                        atleta.usuario?.nome ||
                        'Atleta sem nome',

                    equipe:
                        atleta.equipe?.nome ||
                        'Sem equipe',

                    modalidade:
                        atleta.equipe?.modalidade ||
                        'Não informado',

                    categoria:
                        atleta.categoria ||
                        atleta.equipe?.categoria ||
                        undefined,

                    posicao:
                        atleta.categoria ||
                        'Atleta',

                    frequencia: 88,

                    cor: '#16A875',

                    email:
                        atleta.usuario?.email ||
                        undefined,

                    // ====================================================
                    // FOTO DO ATLETA
                    // ====================================================

                    avatarUrl:
                        atleta.usuario?.avatarUrl ||
                        null,
                }));


            setAtletas(atletasFormatados);

        } catch (error) {

            console.error(
                'Erro ao carregar atletas:',
                error
            );

            setErro(
                error instanceof Error
                    ? error.message
                    : 'Erro ao carregar atletas.'
            );

        } finally {

            setCarregando(false);
        }
    };


    // ========================================================
    // CARREGAMENTO INICIAL
    // ========================================================

    useEffect(() => {
        carregarAtletas();
    }, []);


    // ========================================================
    // BUSCAR ATLETA
    // ========================================================

    const buscarAtletaPorId = async (
        id: number
    ): Promise<AtletaBackend | null> => {

        try {

            const resposta = await fetch(
                `${API_URL}/api/atletas/${id}`,
                {
                    method: 'GET',
                    headers: headersAutenticacao(),
                }
            );

            if (!resposta.ok) {

                const dadosErro =
                    await resposta
                        .json()
                        .catch(() => null);

                throw new Error(
                    dadosErro?.mensagem ||
                    'Não foi possível buscar o atleta.'
                );
            }

            const dados: AtletaBackend =
                await resposta.json();

            return dados;

        } catch (error) {

            console.error(
                'Erro ao buscar atleta:',
                error
            );

            setErro(
                error instanceof Error
                    ? error.message
                    : 'Erro ao buscar atleta.'
            );

            return null;
        }
    };


    // ========================================================
    // ABRIR PERFIL
    // ========================================================

    const abrirPerfil = async (
        id: number
    ) => {

        setErro('');

        const atleta =
            await buscarAtletaPorId(id);

        if (!atleta) {
            return;
        }

        setAtletaSelecionado(atleta);
        setTelaAtual('perfil');
    };


    // ========================================================
    // INFORMAÇÕES
    // ========================================================

    const abrirInformacoes = async (
        id: number
    ) => {
        await abrirPerfil(id);
    };


    // ========================================================
    // CLIPES
    // ========================================================

    const abrirClipes = async (
        id: number
    ) => {

        setErro('');

        const atleta =
            await buscarAtletaPorId(id);

        if (!atleta) {
            return;
        }

        setAtletaSelecionado(atleta);
        setTelaAtual('clipes');
    };


    // ========================================================
    // VOLTAR PARA LISTA
    // ========================================================

    const voltarParaLista = () => {

        setAtletaSelecionado(null);
        setTelaAtual('lista');
        setErro('');
    };


    // ========================================================
    // VOLTAR PARA PERFIL
    // ========================================================

    const voltarParaPerfil = () => {

        if (!atletaSelecionado) {
            setTelaAtual('lista');
            return;
        }

        setTelaAtual('perfil');
    };


    // ========================================================
    // ABRIR EDIÇÃO
    // ========================================================

    const abrirEdicao = () => {

        if (!atletaSelecionado) {
            return;
        }

        setTelaAtual('editar');
    };


    // ========================================================
    // FILTROS
    // ========================================================

    const modalidades = useMemo(() => {

        return [
            'Todas',
            ...Array.from(
                new Set(
                    atletas
                        .map(
                            (atleta) =>
                                atleta.modalidade
                        )
                        .filter(Boolean)
                )
            ),
        ];

    }, [atletas]);


    const categorias = useMemo(() => {

        return [
            'Todas',
            ...Array.from(
                new Set(
                    atletas
                        .map(
                            (atleta) =>
                                atleta.categoria
                        )
                        .filter(Boolean) as string[]
                )
            ),
        ];

    }, [atletas]);


    const equipes = useMemo(() => {

        return [
            'Todas',
            ...Array.from(
                new Set(
                    atletas
                        .map(
                            (atleta) =>
                                atleta.equipe
                        )
                        .filter(Boolean)
                )
            ),
        ];

    }, [atletas]);


    // ========================================================
    // FILTRAGEM
    // ========================================================

    const atletasFiltrados = useMemo(() => {

        const textoBusca =
            busca
                .trim()
                .toLowerCase();

        return atletas.filter((atleta) => {

            const correspondeBusca =
                !textoBusca ||
                atleta.nome
                    .toLowerCase()
                    .includes(textoBusca) ||
                atleta.equipe
                    .toLowerCase()
                    .includes(textoBusca) ||
                atleta.modalidade
                    .toLowerCase()
                    .includes(textoBusca);

            const correspondeModalidade =
                filtroModalidade === 'Todas' ||
                atleta.modalidade === filtroModalidade;

            const correspondeCategoria =
                filtroCategoria === 'Todas' ||
                atleta.categoria === filtroCategoria;

            const correspondeEquipe =
                filtroEquipe === 'Todas' ||
                atleta.equipe === filtroEquipe;

            return (
                correspondeBusca &&
                correspondeModalidade &&
                correspondeCategoria &&
                correspondeEquipe
            );
        });

    }, [
        atletas,
        busca,
        filtroModalidade,
        filtroCategoria,
        filtroEquipe,
    ]);


    // ========================================================
    // LIMPAR FILTROS
    // ========================================================

    const limparFiltros = () => {

        setFiltroModalidade('Todas');
        setFiltroCategoria('Todas');
        setFiltroEquipe('Todas');
        setBusca('');
    };


    // ========================================================
    // CADASTRO
    // ========================================================

    const alterarNovoAtleta = (
        campo: keyof NovoAtletaForm,
        valor: string
    ) => {

        setNovoAtleta((atual) => ({
            ...atual,
            [campo]: valor,
        }));
    };


    const cadastrarAtleta = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {

        event.preventDefault();

        try {

            setErro('');

            const resposta = await fetch(
                `${API_URL}/api/atletas`,
                {
                    method: 'POST',
                    headers: headersAutenticacao(),

                    body: JSON.stringify({

                        nome: novoAtleta.nome,

                        dataNascimento:
                            novoAtleta.dataNascimento ||
                            null,

                        sexo:
                            novoAtleta.sexo ||
                            null,

                        categoria:
                            novoAtleta.categoria ||
                            null,

                        rg:
                            novoAtleta.rg ||
                            null,

                        cpf:
                            novoAtleta.cpf ||
                            null,

                        email:
                            novoAtleta.email,

                        telefone:
                            novoAtleta.telefone ||
                            null,

                        responsavel:
                            novoAtleta.responsavelNome
                                ? {
                                    nome:
                                        novoAtleta
                                            .responsavelNome,

                                    grauParentesco:
                                        novoAtleta
                                            .responsavelGrau,

                                    telefone:
                                        novoAtleta
                                            .responsavelTelefone,
                                }
                                : null,
                    }),
                }
            );

            const dados =
                await resposta
                    .json()
                    .catch(() => null);

            if (!resposta.ok) {

                throw new Error(
                    dados?.mensagem ||
                    'Não foi possível cadastrar o atleta.'
                );
            }

            setNovoAtleta({
                nome: '',
                dataNascimento: '',
                sexo: '',
                categoria: '',
                rg: '',
                cpf: '',
                email: '',
                telefone: '',
                responsavelNome: '',
                responsavelGrau: '',
                responsavelTelefone: '',
            });

            setMostrarCadastro(false);

            await carregarAtletas();

        } catch (error) {

            console.error(
                'Erro ao cadastrar atleta:',
                error
            );

            setErro(
                error instanceof Error
                    ? error.message
                    : 'Erro ao cadastrar atleta.'
            );
        }
    };


    // ========================================================
    // SALVAR EDIÇÃO
    // ========================================================

    const atualizarAtletaSelecionado = async (
        dados: Record<string, unknown>
    ) => {

        if (!atletaSelecionado) {
            return;
        }

        try {

            setErro('');

            const resposta = await fetch(
                `${API_URL}/api/atletas/${atletaSelecionado.id}`,
                {
                    method: 'PUT',
                    headers: headersAutenticacao(),
                    body: JSON.stringify(dados),
                }
            );

            const resultado =
                await resposta
                    .json()
                    .catch(() => null);

            if (!resposta.ok) {

                throw new Error(
                    resultado?.mensagem ||
                    'Não foi possível atualizar o atleta.'
                );
            }

            const atletaAtualizado =
                await buscarAtletaPorId(
                    atletaSelecionado.id
                );

            if (atletaAtualizado) {

                setAtletaSelecionado(
                    atletaAtualizado
                );
            }

            await carregarAtletas();

            setTelaAtual('perfil');

        } catch (error) {

            console.error(
                'Erro ao atualizar atleta:',
                error
            );

            setErro(
                error instanceof Error
                    ? error.message
                    : 'Erro ao atualizar atleta.'
            );
        }
    };


    // ========================================================
    // TELA DE EDIÇÃO
    // ========================================================

    if (telaAtual === 'editar') {

        if (!atletaSelecionado) {
            return null;
        }

        return (
            <EditarAtleta
                atleta={atletaSelecionado}
                onBack={voltarParaPerfil}
                onSave={atualizarAtletaSelecionado}
            />
        );
    }


    // ========================================================
    // TELA DE CLIPES
    // ========================================================

    if (telaAtual === 'clipes') {

        if (!atletaSelecionado) {
            return null;
        }

        return (
            <ClipesAtleta
                onBack={voltarParaPerfil}
            />
        );
    }


    // ========================================================
    // TELA DE PERFIL
    // ========================================================

    if (telaAtual === 'perfil') {

        if (!atletaSelecionado) {
            return null;
        }

        return (
            <PerfilAtleta
                atleta={atletaSelecionado}
                onBack={voltarParaLista}
                onEdit={abrirEdicao}
                onClipes={() =>
                    abrirClipes(
                        atletaSelecionado.id
                    )
                }
            />
        );
    }


    // ========================================================
    // LISTA
    // ========================================================

    return (
        <div className={styles.page}>

            {/* ==================================================
                CABEÇALHO
            ================================================== */}

            <div className={styles.top}>

                <div className={styles.titleArea}>

                    <h1>
                        Atletas
                    </h1>

                    <p>
                        Gerencie os atletas das suas equipes.
                    </p>

                </div>


                <button
                    type="button"
                    className={styles.newAthleteButton}
                    onClick={() =>
                        setMostrarCadastro(true)
                    }
                >
                    <Plus size={18} />

                    Novo atleta
                </button>

            </div>


            {/* ==================================================
                ERRO
            ================================================== */}

            {erro && (

                <div className={styles.message}>

                    <strong>
                        Ocorreu um erro
                    </strong>

                    <span>
                        {erro}
                    </span>

                    <button
                        type="button"
                        onClick={() =>
                            setErro('')
                        }
                    >
                        Fechar
                    </button>

                </div>
            )}


            {/* ==================================================
                FILTROS / BUSCA
            ================================================== */}

            <div className={styles.filters}>

                <div className={styles.searchBox}>

                    <Search size={19} />

                    <input
                        type="text"
                        value={busca}
                        onChange={(event) =>
                            setBusca(
                                event.target.value
                            )
                        }
                        placeholder="Buscar atleta..."
                    />

                    {busca && (

                        <button
                            type="button"
                            onClick={() =>
                                setBusca('')
                            }
                            style={{
                                border: 'none',
                                background: 'transparent',
                                color: '#738078',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                padding: 0,
                            }}
                        >
                            <X size={16} />
                        </button>
                    )}

                </div>


                <div className={styles.selectBox}>

                    <select
                        value={filtroModalidade}
                        onChange={(event) =>
                            setFiltroModalidade(
                                event.target.value
                            )
                        }
                    >
                        {modalidades.map(
                            (modalidade) => (
                                <option
                                    key={modalidade}
                                    value={modalidade}
                                >
                                    {modalidade}
                                </option>
                            )
                        )}
                    </select>

                    <ChevronDown size={17} />

                </div>


                <div className={styles.selectBox}>

                    <select
                        value={filtroCategoria}
                        onChange={(event) =>
                            setFiltroCategoria(
                                event.target.value
                            )
                        }
                    >
                        {categorias.map(
                            (categoria) => (
                                <option
                                    key={categoria}
                                    value={categoria}
                                >
                                    {categoria}
                                </option>
                            )
                        )}
                    </select>

                    <ChevronDown size={17} />

                </div>


                <button
                    type="button"
                    className={styles.filterButton}
                    onClick={() =>
                        setMostrarFiltros(
                            (atual) => !atual
                        )
                    }
                >

                    <ListFilter size={17} />

                    {mostrarFiltros
                        ? 'Ocultar'
                        : 'Filtros'}

                </button>

            </div>


            {/* ==================================================
                FILTRO EXTRA DE EQUIPE
            ================================================== */}

            {mostrarFiltros && (

                <div
                    style={{
                        width: '100%',
                        display: 'grid',
                        gridTemplateColumns:
                            'minmax(220px, 300px)',
                        marginTop: '-25px',
                        marginBottom: '25px',
                    }}
                >

                    <div className={styles.selectBox}>

                        <select
                            value={filtroEquipe}
                            onChange={(event) =>
                                setFiltroEquipe(
                                    event.target.value
                                )
                            }
                        >
                            {equipes.map(
                                (equipe) => (
                                    <option
                                        key={equipe}
                                        value={equipe}
                                    >
                                        {equipe}
                                    </option>
                                )
                            )}
                        </select>

                        <ChevronDown size={17} />

                    </div>

                </div>
            )}


            {/* ==================================================
                RESULTADO
            ================================================== */}

            <div
                style={{
                    marginBottom: '16px',
                    color: 'rgba(255,255,255,0.72)',
                    fontSize: '13px',
                    fontWeight: 500,
                }}
            >
                {carregando
                    ? 'Carregando atletas...'
                    : `${atletasFiltrados.length} ${
                        atletasFiltrados.length === 1
                            ? 'atleta'
                            : 'atletas'
                    }`
                }
            </div>


            {/* ==================================================
                LOADING
            ================================================== */}

            {carregando && (

                <div className={styles.empty}>

                    <strong>
                        Carregando atletas...
                    </strong>

                    <span>
                        Aguarde enquanto buscamos os atletas.
                    </span>

                </div>
            )}


            {/* ==================================================
                VAZIO
            ================================================== */}

            {!carregando &&
                atletasFiltrados.length === 0 && (

                    <div className={styles.empty}>

                        <UserRound size={28} />

                        <strong>
                            Nenhum atleta encontrado
                        </strong>

                        <span>

                            {busca ||
                            filtroModalidade !== 'Todas' ||
                            filtroCategoria !== 'Todas' ||
                            filtroEquipe !== 'Todas'

                                ? 'Tente alterar os filtros ou a busca.'

                                : 'Cadastre seu primeiro atleta para começar.'
                            }

                        </span>


                        {!busca &&
                            filtroModalidade === 'Todas' &&
                            filtroCategoria === 'Todas' &&
                            filtroEquipe === 'Todas' && (

                                <button
                                    type="button"
                                    className={styles.submitButton}
                                    onClick={() =>
                                        setMostrarCadastro(
                                            true
                                        )
                                    }
                                >
                                    <Plus size={16} />

                                    Novo atleta
                                </button>
                            )}

                    </div>
                )}


            {/* ==================================================
                CARDS
            ================================================== */}

            {!carregando &&
                atletasFiltrados.length > 0 && (

                    <div className={styles.athletesGrid}>

                        {atletasFiltrados.map(
                            (atleta) => (

                                <div
                                    key={atleta.id}
                                    className={styles.athleteCard}
                                >

                                    <div
                                        className={styles.cardContent}
                                    >

                                        <div
                                            className={`
                                                ${styles.avatar}
                                                ${styles.verde}
                                            `}
                                        >

                                            {atleta.avatarUrl ? (

                                                <img
                                                    src={atleta.avatarUrl}
                                                    alt={`Foto de ${atleta.nome}`}
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'cover',
                                                        borderRadius: '50%',
                                                        display: 'block',
                                                    }}
                                                />

                                            ) : (

                                                atleta.nome
                                                    .charAt(0)
                                                    .toUpperCase()
                                            )}

                                        </div>


                                        <div
                                            className={styles.cardInfo}
                                        >

                                            <h2>
                                                {atleta.nome}
                                            </h2>

                                            <span
                                                className={styles.team}
                                            >
                                                {atleta.equipe}
                                            </span>

                                            <p>
                                                <span>
                                                    Modalidade:
                                                </span>

                                                {atleta.modalidade}
                                            </p>

                                            {atleta.categoria && (

                                                <p>
                                                    <span>
                                                        Categoria:
                                                    </span>

                                                    {atleta.categoria}
                                                </p>
                                            )}

                                        </div>


                                        <div
                                            className={styles.frequency}
                                        >
                                            {atleta.frequencia}%
                                        </div>

                                    </div>


                                    <div
                                        className={styles.cardHover}
                                    >

                                        <button
                                            type="button"
                                            onClick={() =>
                                                abrirPerfil(
                                                    atleta.id
                                                )
                                            }
                                        >
                                            <Eye size={17} />

                                            Perfil
                                        </button>


                                        <button
                                            type="button"
                                            onClick={() =>
                                                abrirInformacoes(
                                                    atleta.id
                                                )
                                            }
                                        >
                                            <UserRound
                                                size={17}
                                            />

                                            Informações
                                        </button>


                                        <button
                                            type="button"
                                            onClick={() =>
                                                abrirClipes(
                                                    atleta.id
                                                )
                                            }
                                        >
                                            <Scissors
                                                size={17}
                                            />

                                            Clipes
                                        </button>

                                    </div>

                                </div>
                            )
                        )}

                    </div>
                )}


            {/* ==================================================
                MODAL NOVO ATLETA
            ================================================== */}

            {mostrarCadastro && (

                <div
                    className={styles.modalOverlay}
                    onMouseDown={() =>
                        setMostrarCadastro(false)
                    }
                >

                    <div
                        className={styles.newAthleteModal}
                        onMouseDown={(event) =>
                            event.stopPropagation()
                        }
                    >

                        {/* HEADER */}

                        <div
                            className={styles.modalHeader}
                        >

                            <div>

                                <span>
                                    CADASTRO
                                </span>

                                <h2>
                                    Novo atleta
                                </h2>

                                <p>
                                    Cadastre um novo atleta
                                    na sua equipe.
                                </p>

                            </div>


                            <button
                                type="button"
                                className={
                                    styles.closeModalButton
                                }
                                onClick={() =>
                                    setMostrarCadastro(
                                        false
                                    )
                                }
                            >
                                <X size={18} />
                            </button>

                        </div>


                        {/* CORPO */}

                        <form
                            onSubmit={cadastrarAtleta}
                        >

                            <div
                                className={styles.modalBody}
                            >

                                {/* ============================
                                    DADOS PESSOAIS
                                ============================ */}

                                <section
                                    className={
                                        styles.formSection
                                    }
                                >

                                    <div
                                        className={
                                            styles.sectionHeader
                                        }
                                    >

                                        <h3>
                                            Dados pessoais
                                        </h3>

                                        <span>
                                            Informações principais
                                            do atleta
                                        </span>

                                    </div>


                                    <div
                                        className={
                                            styles.formGrid
                                        }
                                    >

                                        <div
                                            className={`
                                                ${styles.formField}
                                                ${styles.fullField}
                                            `}
                                        >

                                            <label>
                                                Nome completo
                                                <b>*</b>
                                            </label>

                                            <input
                                                type="text"
                                                value={
                                                    novoAtleta.nome
                                                }
                                                onChange={(event) =>
                                                    alterarNovoAtleta(
                                                        'nome',
                                                        event.target.value
                                                    )
                                                }
                                                required
                                                placeholder="Nome do atleta"
                                            />

                                        </div>


                                        <div
                                            className={
                                                styles.formField
                                            }
                                        >

                                            <label>
                                                Data de nascimento
                                            </label>

                                            <input
                                                type="date"
                                                value={
                                                    novoAtleta.dataNascimento
                                                }
                                                onChange={(event) =>
                                                    alterarNovoAtleta(
                                                        'dataNascimento',
                                                        event.target.value
                                                    )
                                                }
                                            />

                                        </div>


                                        <div
                                            className={
                                                styles.formField
                                            }
                                        >

                                            <label>
                                                Sexo
                                            </label>

                                            <select
                                                value={
                                                    novoAtleta.sexo
                                                }
                                                onChange={(event) =>
                                                    alterarNovoAtleta(
                                                        'sexo',
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
                                                styles.formField
                                            }
                                        >

                                            <label>
                                                Categoria
                                            </label>

                                            <input
                                                type="text"
                                                value={
                                                    novoAtleta.categoria
                                                }
                                                onChange={(event) =>
                                                    alterarNovoAtleta(
                                                        'categoria',
                                                        event.target.value
                                                    )
                                                }
                                                placeholder="Ex.: Sub-18"
                                            />

                                        </div>


                                        <div
                                            className={
                                                styles.formField
                                            }
                                        >

                                            <label>
                                                CPF
                                            </label>

                                            <input
                                                type="text"
                                                value={
                                                    novoAtleta.cpf
                                                }
                                                onChange={(event) =>
                                                    alterarNovoAtleta(
                                                        'cpf',
                                                        event.target.value
                                                    )
                                                }
                                                placeholder="000.000.000-00"
                                            />

                                        </div>


                                        <div
                                            className={
                                                styles.formField
                                            }
                                        >

                                            <label>
                                                RG
                                            </label>

                                            <input
                                                type="text"
                                                value={
                                                    novoAtleta.rg
                                                }
                                                onChange={(event) =>
                                                    alterarNovoAtleta(
                                                        'rg',
                                                        event.target.value
                                                    )
                                                }
                                                placeholder="00.000.000-0"
                                            />

                                        </div>


                                        <div
                                            className={
                                                styles.formField
                                            }
                                        >

                                            <label>
                                                Telefone
                                            </label>

                                            <input
                                                type="text"
                                                value={
                                                    novoAtleta.telefone
                                                }
                                                onChange={(event) =>
                                                    alterarNovoAtleta(
                                                        'telefone',
                                                        event.target.value
                                                    )
                                                }
                                                placeholder="(11) 99999-9999"
                                            />

                                        </div>


                                        <div
                                            className={`
                                                ${styles.formField}
                                                ${styles.fullField}
                                            `}
                                        >

                                            <label>
                                                E-mail
                                                <b>*</b>
                                            </label>

                                            <input
                                                type="email"
                                                value={
                                                    novoAtleta.email
                                                }
                                                onChange={(event) =>
                                                    alterarNovoAtleta(
                                                        'email',
                                                        event.target.value
                                                    )
                                                }
                                                required
                                                placeholder="atleta@email.com"
                                            />

                                        </div>

                                    </div>

                                </section>


                                {/* ============================
                                    RESPONSÁVEL
                                ============================ */}

                                <section
                                    className={
                                        styles.formSection
                                    }
                                >

                                    <div
                                        className={
                                            styles.sectionHeader
                                        }
                                    >

                                        <h3>
                                            Responsável
                                        </h3>

                                        <span>
                                            Dados do responsável
                                            pelo atleta
                                        </span>

                                    </div>


                                    <div
                                        className={
                                            styles.responsibleGrid
                                        }
                                    >

                                        <div
                                            className={
                                                styles.formField
                                            }
                                        >

                                            <label>
                                                Nome do responsável
                                            </label>

                                            <input
                                                type="text"
                                                value={
                                                    novoAtleta
                                                        .responsavelNome
                                                }
                                                onChange={(event) =>
                                                    alterarNovoAtleta(
                                                        'responsavelNome',
                                                        event.target.value
                                                    )
                                                }
                                                placeholder="Nome completo"
                                            />

                                        </div>


                                        <div
                                            className={
                                                styles.formField
                                            }
                                        >

                                            <label>
                                                Grau de parentesco
                                            </label>

                                            <input
                                                type="text"
                                                value={
                                                    novoAtleta
                                                        .responsavelGrau
                                                }
                                                onChange={(event) =>
                                                    alterarNovoAtleta(
                                                        'responsavelGrau',
                                                        event.target.value
                                                    )
                                                }
                                                placeholder="Ex.: Mãe"
                                            />

                                        </div>


                                        <div
                                            className={
                                                styles.formField
                                            }
                                        >

                                            <label>
                                                Telefone
                                            </label>

                                            <input
                                                type="text"
                                                value={
                                                    novoAtleta
                                                        .responsavelTelefone
                                                }
                                                onChange={(event) =>
                                                    alterarNovoAtleta(
                                                        'responsavelTelefone',
                                                        event.target.value
                                                    )
                                                }
                                                placeholder="(11) 99999-9999"
                                            />

                                        </div>

                                    </div>

                                </section>

                            </div>


                            {/* FOOTER */}

                            <div
                                className={
                                    styles.modalFooter
                                }
                            >

                                <button
                                    type="button"
                                    className={
                                        styles.cancelButton
                                    }
                                    onClick={() =>
                                        setMostrarCadastro(
                                            false
                                        )
                                    }
                                >
                                    Cancelar
                                </button>


                                <button
                                    type="submit"
                                    className={
                                        styles.submitButton
                                    }
                                >
                                    Cadastrar atleta
                                </button>

                            </div>

                        </form>

                    </div>

                </div>
            )}

        </div>
    );
};


export default Atletas;