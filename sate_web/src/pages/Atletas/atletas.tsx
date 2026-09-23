
import { useEffect, useMemo, useState } from 'react';

import styles from './atletas.module.css';

import PerfilAtleta from './perfilAtletas.tsx';
import EditarAtleta from './editarAtleta.tsx';
import ClipesAtleta from './clipesAtleta.tsx';

import {
    Search,
    ChevronDown,
    Plus,
    SlidersHorizontal,
    Eye,
    BarChart3,
    Scissors
} from 'lucide-react';


// ============================================================================
// INTERFACES
// ============================================================================

interface AtletaBackend {
    id: number;
    nome: string | null;
    cpf?: string | null;
    rg?: string | null;
    dataNascimento?: string | null;
    sexo?: string | null;
    categoria?: string | null;
    telefone?: string | null;

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

interface Atleta {
    id: number;
    nome: string;
    equipe: string;
    posicao: string;
    modalidade: string;
    frequencia: number;
    cor: 'verde' | 'rosa' | 'azul';
    email?: string;
    categoria?: string;
}


// ============================================================================
// CONFIGURAÇÃO
// ============================================================================

const API_URL = 'http://localhost:3000';


// ============================================================================
// COMPONENTE
// ============================================================================

const Atletas = () => {

    const [telaAtual, setTelaAtual] = useState<
        'lista' | 'perfil' | 'editar' | 'clipes'
    >('lista');

    const [atletas, setAtletas] = useState<Atleta[]>([]);

    const [carregando, setCarregando] = useState(true);

    const [erro, setErro] = useState('');

    const [busca, setBusca] = useState('');

    const [equipeSelecionada, setEquipeSelecionada] = useState(
        'Todas as equipes'
    );

    const [modalidadeSelecionada, setModalidadeSelecionada] =
        useState(
            'Todas as modalidades'
        );

    const [atletaSelecionado, setAtletaSelecionado] =
        useState<AtletaBackend | null>(null);


    // ========================================================================
    // CORES DOS AVATARES
    // ========================================================================

    const cores: Array<'verde' | 'rosa' | 'azul'> = [
        'verde',
        'rosa',
        'azul'
    ];


    // ========================================================================
    // PEGAR TOKEN
    // ========================================================================

    const obterToken = (): string | null => {

        const tokenLocal =
            localStorage.getItem('token');

        if (tokenLocal) {
            return tokenLocal;
        }

        const tokenSession =
            sessionStorage.getItem('token');

        if (tokenSession) {
            return tokenSession;
        }

        return null;
    };


    // ========================================================================
    // CARREGAR ATLETAS DO BANCO
    // ========================================================================

    const carregarAtletas = async () => {

        try {

            setCarregando(true);
            setErro('');

            const token = obterToken();

            // ------------------------------------------------------------
            // VERIFICAR LOGIN
            // ------------------------------------------------------------

            if (!token) {

                setErro(
                    'Usuário não autenticado. Faça login novamente.'
                );

                setAtletas([]);

                return;
            }


            // ------------------------------------------------------------
            // BUSCAR ATLETAS
            // ------------------------------------------------------------

            const resposta = await fetch(
                `${API_URL}/api/atletas`,
                {
                    method: 'GET',

                    headers: {
                        Authorization:
                            `Bearer ${token}`,

                        'Content-Type':
                            'application/json'
                    }
                }
            );


            // ------------------------------------------------------------
            // TENTAR LER RESPOSTA
            // ------------------------------------------------------------

            let dados: any;

            try {

                dados = await resposta.json();

            } catch {

                dados = null;
            }


            // ------------------------------------------------------------
            // ERRO DA API
            // ------------------------------------------------------------

            if (!resposta.ok) {

                if (resposta.status === 401) {

                    setErro(
                        'Sua sessão expirou. Faça login novamente.'
                    );

                    return;
                }

                if (resposta.status === 403) {

                    setErro(
                        'Você não possui permissão para acessar os atletas.'
                    );

                    return;
                }

                throw new Error(
                    dados?.mensagem ||
                    dados?.erro ||
                    `Erro HTTP ${resposta.status}.`
                );
            }


            // ------------------------------------------------------------
            // GARANTIR QUE É UMA LISTA
            // ------------------------------------------------------------

            if (!Array.isArray(dados)) {

                console.error(
                    'Resposta inesperada da API:',
                    dados
                );

                throw new Error(
                    'O servidor não retornou uma lista de atletas.'
                );
            }


            // ------------------------------------------------------------
            // CONVERTER DADOS DO BANCO
            // ------------------------------------------------------------

            const atletasBanco: AtletaBackend[] =
                dados;


            const atletasFormatados: Atleta[] =
                atletasBanco.map(
                    (atleta, index) => {

                        const nome =
                            atleta.nome ||
                            atleta.usuario?.nome ||
                            'Atleta sem nome';

                        return {

                            id: atleta.id,

                            nome,

                            // Atualmente não existe equipe
                            // no modelo Atleta.
                            equipe:
                                'Sem equipe',

                            // Enquanto posição/modalidade
                            // não estiverem no banco.
                            posicao:
                                atleta.categoria ||
                                'Sem categoria',

                            modalidade:
                                'Não informada',

                            // Frequência ainda não existe
                            // no modelo atual.
                            frequencia: 0,

                            cor:
                                cores[
                                    index %
                                    cores.length
                                ],

                            email:
                                atleta.usuario?.email,

                            categoria:
                                atleta.categoria ||
                                undefined
                        };
                    }
                );


            // ------------------------------------------------------------
            // SALVAR NA TELA
            // ------------------------------------------------------------

            setAtletas(
                atletasFormatados
            );

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

            setAtletas([]);

        } finally {

            setCarregando(false);
        }
    };


    // ========================================================================
    // CARREGAR AO ABRIR A PÁGINA
    // ========================================================================

    useEffect(() => {

        carregarAtletas();

    }, []);


    // ========================================================================
    // EQUIPES
    // ========================================================================

    const equipes = useMemo(() => {

        const equipesExistentes =
            atletas
                .map(
                    (atleta) =>
                        atleta.equipe
                )
                .filter(Boolean);

        return [
            'Todas as equipes',
            ...Array.from(
                new Set(
                    equipesExistentes
                )
            )
        ];

    }, [atletas]);


    // ========================================================================
    // MODALIDADES
    // ========================================================================

    const modalidades = useMemo(() => {

        const modalidadesExistentes =
            atletas
                .map(
                    (atleta) =>
                        atleta.modalidade
                )
                .filter(Boolean);

        return [
            'Todas as modalidades',
            ...Array.from(
                new Set(
                    modalidadesExistentes
                )
            )
        ];

    }, [atletas]);


    // ========================================================================
    // FILTROS
    // ========================================================================

    const atletasFiltrados = useMemo(() => {

        return atletas.filter(
            (atleta) => {

                const textoBusca =
                    busca
                        .toLowerCase()
                        .trim();

                const correspondeBusca =
                    atleta.nome
                        .toLowerCase()
                        .includes(
                            textoBusca
                        ) ||

                    atleta.email
                        ?.toLowerCase()
                        .includes(
                            textoBusca
                        ) ||

                    atleta.categoria
                        ?.toLowerCase()
                        .includes(
                            textoBusca
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
            }
        );

    }, [
        atletas,
        busca,
        equipeSelecionada,
        modalidadeSelecionada
    ]);


    // ========================================================================
    // ABRIR PERFIL
    // ========================================================================

    const abrirPerfil = async (
        id: number
    ) => {

        try {

            const token =
                obterToken();

            if (!token) {

                setErro(
                    'Usuário não autenticado.'
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
                                'application/json'
                        }
                    }
                );


            const dados =
                await resposta.json();


            if (!resposta.ok) {

                throw new Error(
                    dados.mensagem ||
                    'Erro ao buscar atleta.'
                );
            }


            setAtletaSelecionado(
                dados
            );

            setTelaAtual(
                'perfil'
            );

        } catch (error) {

            console.error(
                'Erro ao abrir perfil:',
                error
            );

            setErro(
                error instanceof Error
                    ? error.message
                    : 'Erro ao abrir perfil.'
            );
        }
    };


    // ========================================================================
    // VOLTAR PARA LISTA
    // ========================================================================

    const voltarParaLista = () => {

        setTelaAtual(
            'lista'
        );

        setAtletaSelecionado(
            null
        );
    };


    // ========================================================================
    // TELA EDITAR
    // ========================================================================

    if (
        telaAtual === 'editar'
    ) {

        return (
            <EditarAtleta
                onBack={() =>
                    setTelaAtual(
                        'perfil'
                    )
                }
            />
        );
    }


    // ========================================================================
    // TELA CLIPES
    // ========================================================================

    if (
        telaAtual === 'clipes'
    ) {

        return (
            <ClipesAtleta
                onBack={() =>
                    setTelaAtual(
                        'perfil'
                    )
                }
            />
        );
    }


    // ========================================================================
    // TELA PERFIL
    // ========================================================================

    if (
        telaAtual === 'perfil'
    ) {

        return (
            <PerfilAtleta
                onBack={
                    voltarParaLista
                }

                onEdit={() =>
                    setTelaAtual(
                        'editar'
                    )
                }

                onClipes={() =>
                    setTelaAtual(
                        'clipes'
                    )
                }
            />
        );
    }


    // ========================================================================
    // TELA PRINCIPAL
    // ========================================================================

    return (

        <div
            className={
                styles.page
            }
        >

            {/* ================================================================
                CABEÇALHO
            ================================================================ */}

            <div
                className={
                    styles.header
                }
            >

                <h1
                    className={
                        styles.title
                    }
                >
                    Veja seus atletas
                </h1>


                <button
                    className={
                        styles.newAthleteButton
                    }

                    onClick={() =>
                        alert(
                            'Cadastro em breve!'
                        )
                    }
                >

                    <Plus
                        size={24}
                    />

                    <span>
                        Novo atleta
                    </span>

                </button>

            </div>


            {/* ================================================================
                FILTROS
            ================================================================ */}

            <div
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
                        size={23}
                        className={
                            styles.searchIcon
                        }
                    />


                    <input
                        type="text"

                        placeholder={
                            'Buscar atleta...'
                        }

                        value={
                            busca
                        }

                        onChange={(e) =>
                            setBusca(
                                e.target.value
                            )
                        }
                    />

                </div>


                <div
                    className={
                        styles.selectWrapper
                    }
                >

                    <select
                        className={
                            styles.select
                        }

                        value={
                            equipeSelecionada
                        }

                        onChange={(e) =>
                            setEquipeSelecionada(
                                e.target.value
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

                            )
                        )}

                    </select>


                    <ChevronDown
                        size={21}
                        className={
                            styles.selectIcon
                        }
                    />

                </div>


                <div
                    className={
                        styles.selectWrapper
                    }
                >

                    <select
                        className={
                            styles.select
                        }

                        value={
                            modalidadeSelecionada
                        }

                        onChange={(e) =>
                            setModalidadeSelecionada(
                                e.target.value
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

                            )
                        )}

                    </select>


                    <ChevronDown
                        size={21}
                        className={
                            styles.selectIcon
                        }
                    />

                </div>


                <button
                    className={
                        styles.filterButton
                    }
                >

                    <SlidersHorizontal
                        size={19}
                    />

                    <span>
                        Filtros
                    </span>

                </button>

            </div>


            {/* ================================================================
                CARREGANDO
            ================================================================ */}

            {carregando && (

                <div>
                    Carregando atletas...
                </div>

            )}


            {/* ================================================================
                ERRO
            ================================================================ */}

            {!carregando &&
                erro && (

                    <div>
                        {erro}
                    </div>

                )}


            {/* ================================================================
                NENHUM ATLETA
            ================================================================ */}

            {!carregando &&
                !erro &&
                atletasFiltrados.length === 0 && (

                    <div>
                        Nenhum atleta encontrado.
                    </div>

                )}


            {/* ================================================================
                LISTA DE ATLETAS
            ================================================================ */}

            {!carregando &&
                !erro &&
                atletasFiltrados.length > 0 && (

                    <div
                        className={
                            styles.athletesGrid
                        }
                    >

                        {atletasFiltrados.map(
                            (atleta) => (

                                <div
                                    className={
                                        styles.athleteCard
                                    }

                                    key={
                                        atleta.id
                                    }
                                >

                                    {/* ------------------------------------------------
                                        CARD NORMAL
                                    ------------------------------------------------ */}

                                    <div
                                        className={
                                            styles.cardNormal
                                        }
                                    >

                                        <div
                                            className={`
                                                ${styles.avatar}
                                                ${styles[atleta.cor]}
                                            `}
                                        >

                                            {atleta.nome
                                                .split(
                                                    ' '
                                                )
                                                .filter(
                                                    Boolean
                                                )
                                                .slice(
                                                    0,
                                                    2
                                                )
                                                .map(
                                                    (nome) =>
                                                        nome[0]
                                                )
                                                .join('')
                                                .toUpperCase()}

                                        </div>


                                        <div
                                            className={
                                                styles.info
                                            }
                                        >

                                            <h2>
                                                {
                                                    atleta.nome
                                                }
                                            </h2>


                                            <p
                                                className={
                                                    styles.team
                                                }
                                            >
                                                {
                                                    atleta.equipe
                                                }
                                            </p>


                                            <p
                                                className={
                                                    styles.sport
                                                }
                                            >

                                                {
                                                    atleta.posicao
                                                }

                                                <span>
                                                    -
                                                </span>

                                                {
                                                    atleta.modalidade
                                                }

                                            </p>

                                        </div>


                                        <span
                                            className={`
                                                ${styles.frequency}
                                                ${styles[atleta.cor]}
                                            `}
                                        >
                                            {
                                                atleta.frequencia
                                            }%
                                        </span>

                                    </div>


                                    {/* ------------------------------------------------
                                        CARD HOVER
                                    ------------------------------------------------ */}

                                    <div
                                        className={
                                            styles.cardHover
                                        }
                                    >

                                        <button
                                            className={
                                                styles.hoverButton
                                            }

                                            onClick={() =>
                                                abrirPerfil(
                                                    atleta.id
                                                )
                                            }
                                        >

                                            <Eye
                                                size={19}
                                            />

                                            <span>
                                                Perfil
                                            </span>

                                        </button>


                                        <button
                                            className={
                                                styles.hoverButton
                                            }
                                        >

                                            <BarChart3
                                                size={19}
                                            />

                                            <span>
                                                Informações
                                            </span>

                                        </button>


                                        <button
                                            className={
                                                styles.hoverButton
                                            }

                                            onClick={() => {

                                                setAtletaSelecionado(
                                                    {
                                                        id:
                                                            atleta.id,

                                                        nome:
                                                            atleta.nome,

                                                        cpf:
                                                            '',

                                                        dataNascimento:
                                                            '',

                                                        sexo:
                                                            '',

                                                        categoria:
                                                            atleta.categoria ||
                                                            '',

                                                        usuario:
                                                            {
                                                                id:
                                                                    0,

                                                                email:
                                                                    atleta.email ||
                                                                    '',

                                                                tipo:
                                                                    'ATLETA'
                                                            }
                                                    }
                                                );

                                                setTelaAtual(
                                                    'clipes'
                                                );

                                            }}
                                        >

                                            <Scissors
                                                size={19}
                                            />

                                            <span>
                                                Clipes
                                            </span>

                                        </button>

                                    </div>

                                </div>

                            )
                        )}

                    </div>

                )}

        </div>
    );
};


export default Atletas;

