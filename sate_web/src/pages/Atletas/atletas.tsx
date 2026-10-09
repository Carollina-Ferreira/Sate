import {
    ArrowLeft,
    CheckCircle2,
    ChevronDown,
    Eye,
    FileSpreadsheet,
    ListFilter,
    Plus,
    Search,
    Scissors,
    Upload,
    UserRound,
    X,
} from 'lucide-react';

import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import * as XLSX from 'xlsx';

import styles from './atletas.module.css';

import PerfilAtleta from './perfilAtletas';
import EditarAtleta from './editarAtleta';
import ClipesAtleta from './clipesAtleta';
import InformacoesAtleta from './InformacoesAtleta';

// ============================================================
// ATLETA VINDO DO BACKEND
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

    documentos?: unknown[];
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
    responsavelParentesco: string;
    responsavelTelefone: string;
}

interface AtletaPlanilha {
    nome: string;
    email: string;
    dataNascimento: string;
    sexo: string;
    categoria: string;
    rg: string;
    cpf: string;
    telefone: string;
    responsavelNome: string;
    responsavelGrau: string;
    responsavelTelefone: string;
}

// ============================================================
// TELAS E TIPOS
// ============================================================

type TelaAtual = 'lista' | 'perfil' | 'editar' | 'clipes' | 'informacoes';
type ModoCadastro = 'escolha' | 'manual' | 'planilha';

// ============================================================
// API E CONSTANTES
// ============================================================

const API_URL = 'http://localhost:3000';

const FORMULARIO_VAZIO: NovoAtletaForm = {
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
// COMPONENTE PRINCIPAL
// ============================================================

const Atletas = () => {
    const [atletas, setAtletas] = useState<Atleta[]>([]);
    const [atletaSelecionado, setAtletaSelecionado] = useState<AtletaBackend | null>(null);
    const [telaAtual, setTelaAtual] = useState<TelaAtual>('lista');

    const [busca, setBusca] = useState('');
    const [filtroModalidade, setFiltroModalidade] = useState('Todas');
    const [filtroCategoria, setFiltroCategoria] = useState('Todas');
    const [filtroEquipe, setFiltroEquipe] = useState('Todas');

    const [mostrarCadastro, setMostrarCadastro] = useState(false);
    const [modoCadastro, setModoCadastro] = useState<ModoCadastro>('escolha');

    const [carregando, setCarregando] = useState(true);
    const [exportando, setExportando] = useState(false);
    const [erro, setErro] = useState('');

    const [novoAtleta, setNovoAtleta] = useState<NovoAtletaForm>({ ...FORMULARIO_VAZIO });

    const [atletasPlanilha, setAtletasPlanilha] = useState<AtletaPlanilha[]>([]);
    const [nomeArquivo, setNomeArquivo] = useState('');
    const [importandoPlanilha, setImportandoPlanilha] = useState(false);
    const [resultadoImportacao, setResultadoImportacao] = useState('');

    // ========================================================
    // AUTENTICAÇÃO
    // ========================================================

    const obterToken = () =>
        localStorage.getItem('token') ||
        sessionStorage.getItem('token') ||
        localStorage.getItem('accessToken') ||
        '';

    const headersAutenticacao = () => ({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${obterToken()}`,
    });

    // ========================================================
    // CARREGAR ATLETAS
    // ========================================================

    const carregarAtletas = async () => {
        try {
            setCarregando(true);
            setErro('');

            const token = obterToken();
            if (!token) {
                setErro('Usuário não autenticado. Faça login novamente.');
                setAtletas([]);
                return;
            }

            const resposta = await fetch(`${API_URL}/api/atletas`, {
                method: 'GET',
                headers: headersAutenticacao(),
            });

            if (!resposta.ok) {
                if (resposta.status === 401) {
                    setErro('Sua sessão expirou. Faça login novamente.');
                    return;
                }
                if (resposta.status === 403) {
                    setErro('Você não possui permissão para acessar os atletas.');
                    return;
                }
                throw new Error(`Erro HTTP ${resposta.status}.`);
            }

            const dados: AtletaBackend[] = await resposta.json();

            if (!Array.isArray(dados)) {
                throw new Error('O servidor não retornou uma lista de atletas.');
            }

            const atletasFormatados: Atleta[] = dados.map((atleta) => ({
                id: atleta.id,
                nome: atleta.nome || atleta.usuario?.nome || 'Atleta sem nome',
                equipe: atleta.equipe?.nome || 'Sem equipe',
                modalidade: atleta.equipe?.modalidade || 'Não informada',
                categoria: atleta.categoria || atleta.equipe?.categoria || undefined,
                posicao: atleta.categoria || 'Sem categoria',
                frequencia: 88,
                cor: '#16A875',
                email: atleta.usuario?.email || undefined,
                avatarUrl: atleta.usuario?.avatarUrl || null,
            }));

            setAtletas(atletasFormatados);
        } catch (error) {
            console.error('Erro ao carregar atletas:', error);
            setErro(
                error instanceof Error
                    ? error.message
                    : 'Erro ao carregar atletas.'
            );
        } finally {
            setCarregando(false);
        }
    };

    useEffect(() => {
        void carregarAtletas();
    }, []);

    // ========================================================
    // EXPORTAR PARA EXCEL
    // ========================================================

    const exportarAtletasExcel = () => {
        try {
            setErro('');

            if (atletasFiltrados.length === 0) {
                setErro('Não há atletas para exportar.');
                return;
            }

            setExportando(true);

            const dadosExcel = atletasFiltrados.map((atleta) => ({
                ID: atleta.id,
                'Nome completo': atleta.nome,
                'E-mail': atleta.email || '',
                Equipe: atleta.equipe,
                Modalidade: atleta.modalidade,
                Categoria: atleta.categoria || '',
                'Frequência (%)': atleta.frequencia,
            }));

            const planilha = XLSX.utils.json_to_sheet(dadosExcel);

            planilha['!cols'] = [
                { wch: 10 },
                { wch: 30 },
                { wch: 32 },
                { wch: 25 },
                { wch: 20 },
                { wch: 18 },
                { wch: 18 },
            ];

            const pastaTrabalho = XLSX.utils.book_new();

            XLSX.utils.book_append_sheet(pastaTrabalho, planilha, 'Atletas');

            const dataAtual = new Date()
                .toLocaleDateString('pt-BR')
                .replace(/\//g, '-');

            XLSX.writeFile(pastaTrabalho, `atletas_sate_${dataAtual}.xlsx`);
        } catch (error) {
            console.error('Erro ao exportar atletas:', error);
            setErro('Não foi possível gerar a planilha Excel.');
        } finally {
            setExportando(false);
        }
    };

    // ========================================================
    // BUSCAR ATLETA POR ID
    // ========================================================

    const buscarAtletaPorId = async (id: number): Promise<AtletaBackend | null> => {
        try {
            const resposta = await fetch(`${API_URL}/api/atletas/${id}`, {
                method: 'GET',
                headers: headersAutenticacao(),
            });

            if (!resposta.ok) {
                throw new Error('Erro ao buscar dados do atleta.');
            }

            const dados: AtletaBackend = await resposta.json();
            return dados;
        } catch (error) {
            console.error('Erro ao buscar atleta:', error);
            setErro('Não foi possível carregar os detalhes do atleta.');
            return null;
        }
    };

    // ========================================================
    // NAVEGAÇÃO E MODAL
    // ========================================================

    const abrirOpcoesCadastro = () => {
        setErro('');
        setResultadoImportacao('');
        setAtletasPlanilha([]);
        setNomeArquivo('');
        setModoCadastro('escolha');
        setMostrarCadastro(true);
    };

    const fecharCadastro = () => {
        if (importandoPlanilha) return;

        setMostrarCadastro(false);
        setModoCadastro('escolha');
        setErro('');
        setResultadoImportacao('');
        setAtletasPlanilha([]);
        setNomeArquivo('');
    };

    const abrirPerfil = async (id: number) => {
        setErro('');
        const atleta = await buscarAtletaPorId(id);
        if (!atleta) return;
        setAtletaSelecionado(atleta);
        setTelaAtual('perfil');
    };

    const abrirInformacoes = async (id: number) => {
        setErro('');
        const atleta = await buscarAtletaPorId(id);
        if (!atleta) return;
        setAtletaSelecionado(atleta);
        setTelaAtual('informacoes');
    };

    const abrirClipes = async (id: number) => {
        setErro('');
        const atleta = await buscarAtletaPorId(id);
        if (!atleta) return;
        setAtletaSelecionado(atleta);
        setTelaAtual('clipes');
    };

    const voltarParaLista = () => {
        setAtletaSelecionado(null);
        setTelaAtual('lista');
        setErro('');
    };

    // ========================================================
    // FILTROS
    // ========================================================

    const modalidades = useMemo(
        () => [
            'Todas',
            ...Array.from(
                new Set(
                    atletas
                        .map((atleta) => atleta.modalidade)
                        .filter(Boolean)
                )
            ),
        ],
        [atletas]
    );

    const categorias = useMemo(
        () => [
            'Todas',
            ...Array.from(
                new Set(
                    atletas
                        .map((atleta) => atleta.categoria)
                        .filter(Boolean) as string[]
                )
            ),
        ],
        [atletas]
    );

    const equipes = useMemo(
        () => [
            'Todas',
            ...Array.from(
                new Set(
                    atletas
                        .map((atleta) => atleta.equipe)
                        .filter(Boolean)
                )
            ),
        ],
        [atletas]
    );

    const atletasFiltrados = useMemo(() => {
        const textoBusca = busca.trim().toLowerCase();

        return atletas.filter((atleta) => {
            const correspondeBusca =
                !textoBusca ||
                atleta.nome.toLowerCase().includes(textoBusca) ||
                atleta.equipe.toLowerCase().includes(textoBusca) ||
                atleta.modalidade.toLowerCase().includes(textoBusca);

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
    }, [atletas, busca, filtroModalidade, filtroCategoria, filtroEquipe]);

    const limparFiltros = () => {
        setFiltroModalidade('Todas');
        setFiltroCategoria('Todas');
        setFiltroEquipe('Todas');
        setBusca('');
    };

    // ========================================================
    // CADASTRO MANUAL
    // ========================================================

    const alterarCampoNovoAtleta = (
        campo: keyof NovoAtletaForm,
        valor: string
    ) => {
        setNovoAtleta((atual) => ({
            ...atual,
            [campo]: valor,
        }));
    };

    const cadastrarAtleta = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            setErro('');

            const resposta = await fetch(`${API_URL}/api/atletas`, {
                method: 'POST',
                headers: headersAutenticacao(),
                body: JSON.stringify({
                    nome: novoAtleta.nome.trim(),
                    dataNascimento: novoAtleta.dataNascimento || null,
                    sexo: novoAtleta.sexo || null,
                    categoria: novoAtleta.categoria.trim() || null,
                    rg: novoAtleta.rg.trim() || null,
                    cpf: novoAtleta.cpf.trim() || null,
                    email: novoAtleta.email.trim() || null,
                    telefone: novoAtleta.telefone.trim() || null,
                    responsavel: novoAtleta.responsavelNome.trim()
                        ? {
                              nome: novoAtleta.responsavelNome.trim(),
                              grauParentesco: novoAtleta.responsavelParentesco.trim(),
                              telefone: novoAtleta.responsavelTelefone.trim(),
                          }
                        : null,
                }),
            });

            const dados = await resposta.json().catch(() => null);

            if (!resposta.ok) {
                throw new Error(
                    dados?.mensagem || 'Não foi possível cadastrar o atleta.'
                );
            }

            setNovoAtleta({ ...FORMULARIO_VAZIO });
            setMostrarCadastro(false);
            setModoCadastro('escolha');

            await carregarAtletas();
        } catch (error) {
            console.error('Erro ao cadastrar atleta:', error);
            setErro(
                error instanceof Error
                    ? error.message
                    : 'Erro ao cadastrar atleta.'
            );
        }
    };

    // ========================================================
    // IMPORTAÇÃO DE PLANILHA
    // ========================================================

    const normalizarColuna = (valor: string) =>
        valor
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '');

    const lerValor = (
        linha: Record<string, unknown>,
        alternativas: string[]
    ): string => {
        const chaves = Object.keys(linha);

        for (const alternativa of alternativas) {
            const chaveEncontrada = chaves.find(
                (chave) =>
                    normalizarColuna(chave) === normalizarColuna(alternativa)
            );

            if (chaveEncontrada !== undefined) {
                const valor = linha[chaveEncontrada];
                if (valor !== null && valor !== undefined) {
                    return String(valor).trim();
                }
            }
        }

        return '';
    };

    const converterData = (valor: string): string => {
        if (!valor) return '';

        const brasileira = valor.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
        if (brasileira) {
            return `${brasileira[3]}-${brasileira[2]}-${brasileira[1]}`;
        }

        if (/^\d{4}-\d{2}-\d{2}$/.test(valor)) {
            return valor;
        }

        return '';
    };

    const selecionarPlanilha = async (arquivo: File) => {
        try {
            setErro('');
            setResultadoImportacao('');
            setAtletasPlanilha([]);
            setNomeArquivo('');

            const extensao = arquivo.name.split('.').pop()?.toLowerCase();

            if (!['xlsx', 'xls', 'csv'].includes(extensao || '')) {
                throw new Error('Selecione uma planilha Excel (.xlsx ou .xls) ou CSV.');
            }

            setNomeArquivo(arquivo.name);

            const leitor = new FileReader();
            leitor.onload = (e) => {
                try {
                    const buffer = e.target?.result;
                    const pasta = XLSX.read(buffer, { type: 'binary' });
                    const primeiraAba = pasta.SheetNames[0];
                    const dadosBrutos: Record<string, unknown>[] = XLSX.utils.sheet_to_json(
                        pasta.Sheets[primeiraAba]
                    );

                    const atletasLidos: AtletaPlanilha[] = dadosBrutos.map((linha) => ({
                        nome: lerValor(linha, ['nome', 'nome completo', 'atleta']),
                        email: lerValor(linha, ['email', 'e-mail']),
                        dataNascimento: converterData(
                            lerValor(linha, ['data nascimento', 'nascimento', 'data_nascimento'])
                        ),
                        sexo: lerValor(linha, ['sexo', 'genero']),
                        categoria: lerValor(linha, ['categoria']),
                        rg: lerValor(linha, ['rg']),
                        cpf: lerValor(linha, ['cpf']),
                        telefone: lerValor(linha, ['telefone', 'celular']),
                        responsavelNome: lerValor(linha, ['nome responsavel', 'responsavel']),
                        responsavelGrau: lerValor(linha, ['grau parentesco', 'parentesco']),
                        responsavelTelefone: lerValor(linha, ['telefone responsavel']),
                    }));

                    setAtletasPlanilha(atletasLidos);
                } catch (err) {
                    setErro('Erro ao processar o arquivo.');
                }
            };

            leitor.readAsBinaryString(arquivo);
        } catch (error) {
            setErro(error instanceof Error ? error.message : 'Erro ao carregar o arquivo.');
        }
    };

    // Renderização básica da tela conforme o estado
    return (
        <div className={styles.container}>
            {erro && <div className={styles.erroAlert}>{erro}</div>}

            {telaAtual === 'lista' && (
                <div>
                    <h2>Lista de Atletas</h2>
                    {/* Visualização de lista de atletas */}
                </div>
            )}

            {telaAtual === 'perfil' && atletaSelecionado && (
                <PerfilAtleta atleta={atletaSelecionado} aoVoltar={voltarParaLista} />
            )}

            {telaAtual === 'informacoes' && atletaSelecionado && (
                <InformacoesAtleta atleta={atletaSelecionado} aoVoltar={voltarParaLista} />
            )}

            {telaAtual === 'clipes' && atletaSelecionado && (
                <ClipesAtleta atleta={atletaSelecionado} aoVoltar={voltarParaLista} />
            )}
        </div>
    );
};

export default Atletas;