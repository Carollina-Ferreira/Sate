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
// ATLETA VINDO DO BACKEND
// ============================================================

interface AtletaBackend {
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

    documentos?: unknown[];
}


// ============================================================
// ATLETA FORMATADO PARA A TELA
// ============================================================

interface Atleta {
    id: number;

    nome: string;

    equipe: string;

    posicao: string;

    modalidade: string;

    frequencia: number;

    cor:
    | 'verde'
    | 'rosa'
    | 'azul'
    | 'roxo'
    | 'laranja';

    email?: string;

    categoria?: string;
}


// ============================================================
// FORMULÁRIO
// ============================================================

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

    responsavelParentesco: string;

    responsavelTelefone: string;
}


// ============================================================
// TELAS
// ============================================================

type TelaAtual =
    | 'lista'
    | 'perfil'
    | 'editar'
    | 'clipes';


// ============================================================
// API
// ============================================================

const API_URL = 'http://localhost:3000';


// ============================================================
// CORES DOS AVATARES
// ============================================================

const cores: Atleta['cor'][] = [
    'verde',
    'rosa',
    'azul',
    'roxo',
    'laranja',
];


// ============================================================
// FORMULÁRIO INICIAL
// ============================================================

const formularioInicial: NovoAtletaForm = {
    nome: '',
    dataNascimento: '',
    sexo: '',
    categoria: '',
    rg: '',
    cpf: '',
    email: '',
    telefone: '',
    responsavelNome: '',
    responsavelParentesco: '',
    responsavelTelefone: '',
};


// ============================================================
// COMPONENTE
// ============================================================

const Atletas = () => {

    const [
        telaAtual,
        setTelaAtual,
    ] = useState<TelaAtual>('lista');


    const [
        atletas,
        setAtletas,
    ] = useState<Atleta[]>([]);


    const [
        carregando,
        setCarregando,
    ] = useState(true);


    const [
        erro,
        setErro,
    ] = useState('');


    const [
        busca,
        setBusca,
    ] = useState('');


    const [
        equipeSelecionada,
        setEquipeSelecionada,
    ] = useState('Todas as equipes');


    const [
        modalidadeSelecionada,
        setModalidadeSelecionada,
    ] = useState('Todas as modalidades');


    const [
        atletaSelecionado,
        setAtletaSelecionado,
    ] = useState<AtletaBackend | null>(null);


    const [
        modalNovoAtleta,
        setModalNovoAtleta,
    ] = useState(false);


    const [
        novoAtleta,
        setNovoAtleta,
    ] = useState<NovoAtletaForm>(
        formularioInicial,
    );


    const [
        erroCadastro,
        setErroCadastro,
    ] = useState('');


    const [
        cadastrando,
        setCadastrando,
    ] = useState(false);


    // ========================================================
    // TOKEN
    // ========================================================

    const obterToken = (): string | null => {

        const local = localStorage.getItem('token');

        if (local) {
            return local;
        }

        return sessionStorage.getItem('token');
    };


    // ========================================================
    // CARREGAR ATLETAS
    // ========================================================

    const carregarAtletas = async () => {

        try {

            setCarregando(true);

            setErro('');

            const token = obterToken();


            if (!token) {

                setErro(
                    'Usuário não autenticado. Faça login novamente.',
                );

                setAtletas([]);

                return;
            }


            const resposta = await fetch(
                `${API_URL}/api/atletas`,
                {
                    method: 'GET',

                    headers: {
                        Authorization:
                            `Bearer ${token}`,

                        'Content-Type':
                            'application/json',
                    },
                },
            );


            let dados: unknown;

            try {

                dados = await resposta.json();

            } catch {

                dados = null;

            }


            if (!resposta.ok) {

                if (resposta.status === 401) {

                    setErro(
                        'Sua sessão expirou. Faça login novamente.',
                    );

                    return;
                }


                if (resposta.status === 403) {

                    setErro(
                        'Você não possui permissão para acessar os atletas.',
                    );

                    return;
                }


                throw new Error(
                    `Erro HTTP ${resposta.status}.`,
                );
            }


            if (!Array.isArray(dados)) {

                throw new Error(
                    'O servidor não retornou uma lista de atletas.',
                );
            }


            const atletasBanco =
                dados as AtletaBackend[];


            // ==================================================
            // TRANSFORMAR DADOS DO BACKEND
            // ==================================================

            const atletasFormatados: Atleta[] =
                atletasBanco.map(
                    (
                        atleta,
                        index,
                    ) => {

                        const nome =
                            atleta.nome ||
                            atleta.usuario?.nome ||
                            'Atleta sem nome';


                        const equipe =
                            atleta.equipe?.nome ||
                            'Sem equipe';


                        const modalidade =
                            atleta.equipe?.modalidade ||
                            'Não informada';


                        return {

                            id:
                                atleta.id,

                            nome,

                            equipe,

                            posicao:
                                atleta.categoria ||
                                'Sem categoria',

                            modalidade,

                            frequencia:
                                0,

                            cor:
                                cores[
                                    index %
                                    cores.length
                                ],

                            email:
                                atleta.usuario?.email,

                            categoria:
                                atleta.categoria ||
                                undefined,

                        };

                    },
                );


            setAtletas(
                atletasFormatados,
            );


        } catch (error) {

            console.error(
                'Erro ao carregar atletas:',
                error,
            );


            setErro(
                error instanceof Error
                    ? error.message
                    : 'Erro ao carregar atletas.',
            );


            setAtletas([]);

        } finally {

            setCarregando(false);

        }

    };


    // ========================================================
    // CARREGAR AO ABRIR A PÁGINA
    // ========================================================

    useEffect(() => {

        carregarAtletas();

    }, []);


    // ========================================================
    // EQUIPES
    // ========================================================

    const equipes = useMemo(() => {

        const existentes =
            atletas
                .map(
                    (atleta) =>
                        atleta.equipe,
                )
                .filter(
                    Boolean,
                );


        return [
            'Todas as equipes',

            ...Array.from(
                new Set(
                    existentes,
                ),
            ),
        ];

    }, [atletas]);


    // ========================================================
    // MODALIDADES
    // ========================================================

    const modalidades = useMemo(() => {

        const existentes =
            atletas
                .map(
                    (atleta) =>
                        atleta.modalidade,
                )
                .filter(
                    (modalidade) =>
                        modalidade &&
                        modalidade !==
                        'Não informada',
                );


        return [
            'Todas as modalidades',

            ...Array.from(
                new Set(
                    existentes,
                ),
            ),
        ];

    }, [atletas]);


    // ========================================================
    // FILTROS
    // ========================================================

    const atletasFiltrados = useMemo(() => {

        const textoBusca =
            busca
                .toLowerCase()
                .trim();


        return atletas.filter(
            (atleta) => {

                const correspondeBusca =
                    atleta.nome
                        .toLowerCase()
                        .includes(
                            textoBusca,
                        ) ||

                    atleta.email
                        ?.toLowerCase()
                        .includes(
                            textoBusca,
                        ) ||

                    atleta.categoria
                        ?.toLowerCase()
                        .includes(
                            textoBusca,
                        );


                const correspondeEquipe =
                    equipeSelecionada ===
                    'Todas as equipes' ||

                    atleta.equipe ===
                    equipeSelecionada;


                const correspondeModalidade =
                    modalidadeSelecionada ===
                    'Todas as modalidades' ||

                    atleta.modalidade ===
                    modalidadeSelecionada;


                return (
                    correspondeBusca &&
                    correspondeEquipe &&
                    correspondeModalidade
                );

            },
        );

    }, [
        atletas,
        busca,
        equipeSelecionada,
        modalidadeSelecionada,
    ]);


    // ========================================================
    // NOVO ATLETA
    // ========================================================

    const abrirModalNovoAtleta = () => {

        setNovoAtleta(
            formularioInicial,
        );

        setErroCadastro('');

        setModalNovoAtleta(true);

    };


    const fecharModalNovoAtleta = () => {

        setModalNovoAtleta(false);

        setNovoAtleta(
            formularioInicial,
        );

        setErroCadastro('');

        setCadastrando(false);

    };


    const alterarCampoNovoAtleta = (
        campo: keyof NovoAtletaForm,
        valor: string,
    ) => {

        setNovoAtleta(
            (atual) => ({
                ...atual,

                [campo]:
                    valor,
            }),
        );


        if (erroCadastro) {

            setErroCadastro('');

        }

    };


    // ========================================================
    // CADASTRAR ATLETA
    // ========================================================

    const cadastrarNovoAtleta = async () => {

        if (!novoAtleta.nome.trim()) {

            setErroCadastro(
                'Informe o nome completo do atleta.',
            );

            return;
        }


        if (!novoAtleta.dataNascimento) {

            setErroCadastro(
                'Informe a data de nascimento.',
            );

            return;
        }


        if (!novoAtleta.sexo) {

            setErroCadastro(
                'Selecione o sexo.',
            );

            return;
        }


        const token = obterToken();


        if (!token) {

            setErroCadastro(
                'Usuário não autenticado. Faça login novamente.',
            );

            return;
        }


        try {

            setCadastrando(true);

            setErroCadastro('');


            const resposta =
                await fetch(
                    `${API_URL}/api/atletas`,
                    {
                        method: 'POST',

                        headers: {
                            Authorization:
                                `Bearer ${token}`,

                            'Content-Type':
                                'application/json',
                        },

                        body:
                            JSON.stringify({

                                nome:
                                    novoAtleta.nome.trim(),

                                dataNascimento:
                                    novoAtleta.dataNascimento,

                                sexo:
                                    novoAtleta.sexo,

                                categoria:
                                    novoAtleta.categoria.trim() ||
                                    null,

                                rg:
                                    novoAtleta.rg.trim() ||
                                    null,

                                cpf:
                                    novoAtleta.cpf.trim() ||
                                    null,

                                email:
                                    novoAtleta.email.trim() ||
                                    null,

                                telefone:
                                    novoAtleta.telefone.trim() ||
                                    null,

                                responsavelNome:
                                    novoAtleta.responsavelNome.trim() ||
                                    null,

                                responsavelParentesco:
                                    novoAtleta.responsavelParentesco.trim() ||
                                    null,

                                responsavelTelefone:
                                    novoAtleta.responsavelTelefone.trim() ||
                                    null,

                            }),
                    },
                );


            let dados: any = null;


            try {

                dados =
                    await resposta.json();

            } catch {

                dados = null;

            }


            if (!resposta.ok) {

                if (resposta.status === 401) {

                    throw new Error(
                        'Sua sessão expirou. Faça login novamente.',
                    );

                }


                if (resposta.status === 403) {

                    throw new Error(
                        'Você não possui permissão para cadastrar atletas.',
                    );

                }


                throw new Error(
                    dados?.mensagem ||
                    dados?.erro ||
                    `Erro HTTP ${resposta.status} ao cadastrar atleta.`,
                );

            }


            console.log(
                'Atleta cadastrado com sucesso:',
                dados,
            );


            fecharModalNovoAtleta();


            await carregarAtletas();


        } catch (error) {

            console.error(
                'Erro ao cadastrar atleta:',
                error,
            );


            setErroCadastro(
                error instanceof Error
                    ? error.message
                    : 'Erro ao cadastrar atleta.',
            );

        } finally {

            setCadastrando(false);

        }

    };


    // ========================================================
    // ABRIR PERFIL
    // ========================================================

    const abrirPerfil = async (
        id: number,
    ) => {

        try {

            const token =
                obterToken();


            if (!token) {

                setErro(
                    'Usuário não autenticado.',
                );

                return;
            }


            const resposta =
                await fetch(
                    `${API_URL}/api/atletas/${id}`,
                    {
                        method: 'GET',

                        headers: {
                            Authorization:
                                `Bearer ${token}`,

                            'Content-Type':
                                'application/json',
                        },
                    },
                );


            const dados =
                await resposta.json();


            if (!resposta.ok) {

                throw new Error(
                    dados.mensagem ||
                    'Erro ao buscar atleta.',
                );

            }


            setAtletaSelecionado(
                dados,
            );


            setTelaAtual(
                'perfil',
            );


        } catch (error) {

            console.error(
                'Erro ao abrir perfil:',
                error,
            );


            setErro(
                error instanceof Error
                    ? error.message
                    : 'Erro ao abrir perfil.',
            );

        }

    };


    // ========================================================
    // INFORMAÇÕES
    // ========================================================

    const abrirInformacoes = (
        atleta: Atleta,
    ) => {

        setAtletaSelecionado({

            id:
                atleta.id,

            nome:
                atleta.nome,

            categoria:
                atleta.categoria ||
                '',

            equipe:
                undefined,

            usuario: {

                id:
                    0,

                email:
                    atleta.email ||
                    '',

                tipo:
                    'ATLETA',

            },

        });


        setTelaAtual(
            'editar',
        );

    };


    // ========================================================
    // CLIPES
    // ========================================================

    const abrirClipes = (
        atleta: Atleta,
    ) => {

        setAtletaSelecionado({

            id:
                atleta.id,

            nome:
                atleta.nome,

            categoria:
                atleta.categoria ||
                '',

            equipe:
                undefined,

            usuario: {

                id:
                    0,

                email:
                    atleta.email ||
                    '',

                tipo:
                    'ATLETA',

            },

        });


        setTelaAtual(
            'clipes',
        );

    };


    // ========================================================
    // VOLTAR
    // ========================================================

    const voltarParaLista = () => {

        setTelaAtual(
            'lista',
        );

        setAtletaSelecionado(
            null,
        );

    };


    // ========================================================
    // TELA EDITAR
    // ========================================================

    if (
        telaAtual ===
        'editar'
    ) {

        return (

            <EditarAtleta

                onBack={() =>
                    setTelaAtual(
                        'perfil',
                    )
                }

            />

        );

    }


    // ========================================================
    // TELA CLIPES
    // ========================================================

    if (
        telaAtual ===
        'clipes'
    ) {

        return (

            <ClipesAtleta

                onBack={() =>
                    setTelaAtual(
                        'perfil',
                    )
                }

            />

        );

    }


    // ========================================================
    // TELA PERFIL
    // ========================================================

    if (
        telaAtual ===
        'perfil'
    ) {

        return (

            <PerfilAtleta

                onBack={
                    voltarParaLista
                }

                onEdit={() =>
                    setTelaAtual(
                        'editar',
                    )
                }

                onClipes={() =>
                    setTelaAtual(
                        'clipes',
                    )
                }

            />

        );

    }


    // ========================================================
    // LISTA
    // ========================================================

    return (

        <main
            className={
                styles.page
            }
        >

            {/* ==================================================
               CABEÇALHO
            ================================================== */}

            <div
                className={
                    styles.top
                }
            >

                <div
                    className={
                        styles.titleArea
                    }
                >

                    <h1>
                        Veja seus atletas
                    </h1>

                    <p>
                        Gerencie seus atletas e acesse rapidamente seus perfis e informações.
                    </p>

                </div>


                <button
                    type="button"
                    className={
                        styles.newAthleteButton
                    }
                    onClick={
                        abrirModalNovoAtleta
                    }
                >

                    <Plus
                        size={22}
                    />

                    Novo atleta

                </button>

            </div>


            {/* ==================================================
               FILTROS
            ================================================== */}

            <section
                className={
                    styles.filters
                }
            >

                <div
                    className={
                        styles.searchBox
                    }
                >

                    <Search
                        size={22}
                    />

                    <input
                        type="text"
                        placeholder="Buscar atleta..."
                        value={
                            busca
                        }
                        onChange={(
                            event,
                        ) =>
                            setBusca(
                                event.target.value,
                            )
                        }
                    />

                </div>


                <div
                    className={
                        styles.selectBox
                    }
                >

                    <select
                        value={
                            equipeSelecionada
                        }
                        onChange={(
                            event,
                        ) =>
                            setEquipeSelecionada(
                                event.target.value,
                            )
                        }
                    >

                        {equipes.map(
                            (equipe) => (

                                <option
                                    key={
                                        equipe
                                    }
                                    value={
                                        equipe
                                    }
                                >

                                    {equipe}

                                </option>

                            ),
                        )}

                    </select>


                    <ChevronDown
                        size={19}
                    />

                </div>


                <div
                    className={
                        styles.selectBox
                    }
                >

                    <select
                        value={
                            modalidadeSelecionada
                        }
                        onChange={(
                            event,
                        ) =>
                            setModalidadeSelecionada(
                                event.target.value,
                            )
                        }
                    >

                        {modalidades.map(
                            (modalidade) => (

                                <option
                                    key={
                                        modalidade
                                    }
                                    value={
                                        modalidade
                                    }
                                >

                                    {modalidade}

                                </option>

                            ),
                        )}

                    </select>


                    <ChevronDown
                        size={19}
                    />

                </div>


                <button
                    type="button"
                    className={
                        styles.filterButton
                    }
                >

                    <ListFilter
                        size={19}
                    />

                    Filtros

                </button>

            </section>


            {/* ==================================================
               CARREGANDO
            ================================================== */}

            {carregando && (

                <div
                    className={
                        styles.message
                    }
                >

                    Carregando atletas...

                </div>

            )}


            {/* ==================================================
               ERRO
            ================================================== */}

            {!carregando &&
                erro && (

                    <div
                        className={
                            styles.message
                        }
                    >

                        <strong>
                            Não foi possível carregar os atletas.
                        </strong>

                        <span>
                            {erro}
                        </span>

                        <button
                            type="button"
                            onClick={
                                carregarAtletas
                            }
                        >

                            Tentar novamente

                        </button>

                    </div>

                )}


            {/* ==================================================
               LISTA
            ================================================== */}

            {!carregando &&
                !erro && (

                    <section
                        className={
                            styles.athletesGrid
                        }
                    >

                        {atletasFiltrados.map(
                            (atleta) => {

                                const iniciais =
                                    atleta.nome
                                        .split(' ')
                                        .filter(Boolean)
                                        .slice(0, 2)
                                        .map(
                                            (parte) =>
                                                parte[0],
                                        )
                                        .join('')
                                        .toUpperCase();


                                return (

                                    <article
                                        key={
                                            atleta.id
                                        }
                                        className={
                                            styles.athleteCard
                                        }
                                    >

                                        <div
                                            className={
                                                styles.cardContent
                                            }
                                        >

                                            <div
                                                className={`${styles.avatar} ${styles[atleta.cor]}`}
                                            >

                                                {iniciais}

                                            </div>


                                            <div
                                                className={
                                                    styles.cardInfo
                                                }
                                            >

                                                <h2>
                                                    {atleta.nome}
                                                </h2>


                                                <span
                                                    className={
                                                        styles.team
                                                    }
                                                >

                                                    {atleta.equipe}

                                                </span>


                                                <p>

                                                    {atleta.posicao}

                                                    <span>
                                                        •
                                                    </span>

                                                    {atleta.modalidade}

                                                </p>

                                            </div>


                                            <span
                                                className={
                                                    styles.frequency
                                                }
                                            >

                                                {atleta.frequencia}%

                                            </span>

                                        </div>


                                        {/* ==================================================
                                           HOVER
                                        ================================================== */}

                                        <div
                                            className={
                                                styles.cardHover
                                            }
                                        >

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    abrirPerfil(
                                                        atleta.id,
                                                    )
                                                }
                                            >

                                                <Eye
                                                    size={20}
                                                />

                                                Perfil

                                            </button>


                                            <button
                                                type="button"
                                                onClick={() =>
                                                    abrirInformacoes(
                                                        atleta,
                                                    )
                                                }
                                            >

                                                <UserRound
                                                    size={20}
                                                />

                                                Informações

                                            </button>


                                            <button
                                                type="button"
                                                onClick={() =>
                                                    abrirClipes(
                                                        atleta,
                                                    )
                                                }
                                            >

                                                <Scissors
                                                    size={20}
                                                />

                                                Clipes

                                            </button>

                                        </div>

                                    </article>

                                );

                            },
                        )}


                        {atletasFiltrados.length ===
                            0 && (

                                <div
                                    className={
                                        styles.empty
                                    }
                                >

                                    <UserRound
                                        size={32}
                                    />

                                    <strong>
                                        Nenhum atleta encontrado
                                    </strong>

                                    <span>
                                        Tente alterar sua busca ou os filtros.
                                    </span>

                                </div>

                            )}

                    </section>

                )}


            {/* =====================================================
               MODAL NOVO ATLETA
            ===================================================== */}

            {modalNovoAtleta && (

                <div
                    className={
                        styles.modalOverlay
                    }
                    onMouseDown={
                        fecharModalNovoAtleta
                    }
                >

                    <div
                        className={
                            styles.newAthleteModal
                        }
                        onMouseDown={(
                            event,
                        ) =>
                            event.stopPropagation()
                        }
                    >

                        {/* HEADER */}

                        <div
                            className={
                                styles.modalHeader
                            }
                        >

                            <div>

                                <h2>
                                    Cadastrar atleta
                                </h2>

                                <p>
                                    Preencha os dados do atleta para adicioná-lo ao sistema.
                                </p>

                            </div>


                            <button
                                type="button"
                                className={
                                    styles.closeModalButton
                                }
                                onClick={
                                    fecharModalNovoAtleta
                                }
                            >

                                <X
                                    size={21}
                                />

                            </button>

                        </div>


                        {/* CONTEÚDO */}

                        <div
                            className={
                                styles.modalBody
                            }
                        >

                            {/* DADOS PESSOAIS */}

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

                                </div>


                                <div
                                    className={
                                        styles.formGrid
                                    }
                                >

                                    <div
                                        className={`${styles.formField} ${styles.fullField}`}
                                    >

                                        <label>
                                            Nome completo do atleta
                                            <b>*</b>
                                        </label>

                                        <input
                                            type="text"
                                            placeholder="Digite o nome completo..."
                                            value={
                                                novoAtleta.nome
                                            }
                                            onChange={(
                                                event,
                                            ) =>
                                                alterarCampoNovoAtleta(
                                                    'nome',
                                                    event.target.value,
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
                                            Data de nascimento
                                            <b>*</b>
                                        </label>

                                        <input
                                            type="date"
                                            value={
                                                novoAtleta.dataNascimento
                                            }
                                            onChange={(
                                                event,
                                            ) =>
                                                alterarCampoNovoAtleta(
                                                    'dataNascimento',
                                                    event.target.value,
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
                                            <b>*</b>
                                        </label>

                                        <select
                                            value={
                                                novoAtleta.sexo
                                            }
                                            onChange={(
                                                event,
                                            ) =>
                                                alterarCampoNovoAtleta(
                                                    'sexo',
                                                    event.target.value,
                                                )
                                            }
                                        >

                                            <option value="">
                                                Selecione
                                            </option>

                                            <option value="Masculino">
                                                Masculino
                                            </option>

                                            <option value="Feminino">
                                                Feminino
                                            </option>

                                            <option value="Outro">
                                                Outro
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
                                            placeholder="Ex.: M17 - Rugby"
                                            value={
                                                novoAtleta.categoria
                                            }
                                            onChange={(
                                                event,
                                            ) =>
                                                alterarCampoNovoAtleta(
                                                    'categoria',
                                                    event.target.value,
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
                                            Registro Geral (RG)
                                        </label>

                                        <input
                                            type="text"
                                            placeholder="Digite o RG..."
                                            value={
                                                novoAtleta.rg
                                            }
                                            onChange={(
                                                event,
                                            ) =>
                                                alterarCampoNovoAtleta(
                                                    'rg',
                                                    event.target.value,
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
                                            Cadastro de Pessoa Física (CPF)
                                        </label>

                                        <input
                                            type="text"
                                            placeholder="000.000.000-00"
                                            value={
                                                novoAtleta.cpf
                                            }
                                            onChange={(
                                                event,
                                            ) =>
                                                alterarCampoNovoAtleta(
                                                    'cpf',
                                                    event.target.value,
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
                                            E-mail
                                        </label>

                                        <input
                                            type="email"
                                            placeholder="Digite o e-mail..."
                                            value={
                                                novoAtleta.email
                                            }
                                            onChange={(
                                                event,
                                            ) =>
                                                alterarCampoNovoAtleta(
                                                    'email',
                                                    event.target.value,
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
                                            Telefone
                                        </label>

                                        <input
                                            type="tel"
                                            placeholder="Digite o telefone..."
                                            value={
                                                novoAtleta.telefone
                                            }
                                            onChange={(
                                                event,
                                            ) =>
                                                alterarCampoNovoAtleta(
                                                    'telefone',
                                                    event.target.value,
                                                )
                                            }
                                        />

                                    </div>

                                </div>

                            </section>


                            {/* RESPONSÁVEL */}

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
                                        Dados do responsável
                                    </h3>

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
                                            placeholder="Digite o nome..."
                                            value={
                                                novoAtleta.responsavelNome
                                            }
                                            onChange={(
                                                event,
                                            ) =>
                                                alterarCampoNovoAtleta(
                                                    'responsavelNome',
                                                    event.target.value,
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
                                            Grau de parentesco
                                        </label>

                                        <select
                                            value={
                                                novoAtleta.responsavelParentesco
                                            }
                                            onChange={(
                                                event,
                                            ) =>
                                                alterarCampoNovoAtleta(
                                                    'responsavelParentesco',
                                                    event.target.value,
                                                )
                                            }
                                        >

                                            <option value="">
                                                Selecione
                                            </option>

                                            <option value="Mãe">
                                                Mãe
                                            </option>

                                            <option value="Pai">
                                                Pai
                                            </option>

                                            <option value="Avó">
                                                Avó
                                            </option>

                                            <option value="Avô">
                                                Avô
                                            </option>

                                            <option value="Tia">
                                                Tia
                                            </option>

                                            <option value="Tio">
                                                Tio
                                            </option>

                                            <option value="Outro">
                                                Outro
                                            </option>

                                        </select>

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
                                            type="tel"
                                            placeholder="Digite o telefone..."
                                            value={
                                                novoAtleta.responsavelTelefone
                                            }
                                            onChange={(
                                                event,
                                            ) =>
                                                alterarCampoNovoAtleta(
                                                    'responsavelTelefone',
                                                    event.target.value,
                                                )
                                            }
                                        />

                                    </div>

                                </div>

                            </section>


                            {/* ERRO */}

                            {erroCadastro && (

                                <div
                                    className={
                                        styles.formError
                                    }
                                >

                                    {erroCadastro}

                                </div>

                            )}

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
                                onClick={
                                    fecharModalNovoAtleta
                                }
                                disabled={
                                    cadastrando
                                }
                            >

                                Cancelar

                            </button>


                            <button
                                type="button"
                                className={
                                    styles.submitButton
                                }
                                onClick={
                                    cadastrarNovoAtleta
                                }
                                disabled={
                                    cadastrando
                                }
                            >

                                <Plus
                                    size={18}
                                />

                                {cadastrando
                                    ? 'Cadastrando...'
                                    : 'Cadastrar atleta'}

                            </button>

                        </div>

                    </div>

                </div>

            )}

        </main>

    );

};


export default Atletas;