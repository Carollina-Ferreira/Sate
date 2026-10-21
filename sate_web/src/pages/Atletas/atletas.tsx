
import {
    ArrowLeft,
    CheckCircle2,
    ChevronDown,
    Eye,
    FileSpreadsheet,
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

type TelaAtual =
    | 'lista'
    | 'perfil'
    | 'editar'
    | 'informacoes'
    | 'clipes';

type ModoCadastro = 'escolha' | 'manual' | 'planilha';

const API_URL = 'http://localhost:3000';

// Define uma cor fixa para cada atleta com base no ID.
// Assim, a cor não muda ao pesquisar, filtrar ou atualizar a página.
const obterCorAvatar = (id: number): string => {
    const cores = ['verde', 'rosa', 'azul', 'roxo', 'laranja'];
    return cores[Math.abs(id) % cores.length];
};

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
    responsavelGrau: '',
    responsavelTelefone: '',
};

// ============================================================
// COMPONENTE
// ============================================================

const Atletas = () => {
    const [atletas, setAtletas] = useState<Atleta[]>([]);
    const [atletaSelecionado, setAtletaSelecionado] =
        useState<AtletaBackend | null>(null);

    const [telaAtual, setTelaAtual] =
        useState<TelaAtual>('lista');

    const [busca, setBusca] = useState('');
    const [filtroModalidade, setFiltroModalidade] =
        useState('Todas');
    const [filtroCategoria, setFiltroCategoria] =
        useState('Todas');
    const [filtroEquipe, setFiltroEquipe] =
        useState('Todas');

    const [mostrarFiltros, setMostrarFiltros] = useState(false);
    const [mostrarCadastro, setMostrarCadastro] = useState(false);
    const [modoCadastro, setModoCadastro] =
        useState<ModoCadastro>('escolha');

    const [carregando, setCarregando] = useState(true);
    const [exportando, setExportando] = useState(false);
    const [erro, setErro] = useState('');

    const [novoAtleta, setNovoAtleta] =
        useState<NovoAtletaForm>({ ...FORMULARIO_VAZIO });

    const [atletasPlanilha, setAtletasPlanilha] =
        useState<AtletaPlanilha[]>([]);
    const [nomeArquivo, setNomeArquivo] = useState('');
    const [importandoPlanilha, setImportandoPlanilha] =
        useState(false);
    const [resultadoImportacao, setResultadoImportacao] =
        useState('');

    // ========================================================
    // AUTENTICAÇÃO
    // ========================================================

    const obterToken = () =>
        localStorage.getItem('token') ||
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

            const resposta = await fetch(
                `${API_URL}/api/atletas`,
                {
                    method: 'GET',
                    headers: headersAutenticacao(),
                }
            );

            if (!resposta.ok) {
                const dadosErro = await resposta
                    .json()
                    .catch(() => null);

                throw new Error(
                    dadosErro?.mensagem ||
                    'Não foi possível carregar os atletas.'
                );
            }

            const dados: AtletaBackend[] = await resposta.json();

            const atletasFormatados: Atleta[] = dados.map(
                (atleta) => ({
                    id: atleta.id,
                    nome:
                        atleta.nome ||
                        atleta.usuario?.nome ||
                        'Atleta sem nome',
                    equipe: atleta.equipe?.nome || 'Sem equipe',
                    modalidade:
                        atleta.equipe?.modalidade || 'Não informado',
                    categoria:
                        atleta.categoria ||
                        atleta.equipe?.categoria ||
                        undefined,
                    posicao: atleta.categoria || 'Atleta',
                    frequencia: 88,
                    cor: '#16A875',
                    email: atleta.usuario?.email || undefined,
                    avatarUrl: atleta.usuario?.avatarUrl || null,
                })
            );

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

            XLSX.utils.book_append_sheet(
                pastaTrabalho,
                planilha,
                'Atletas'
            );

            const dataAtual = new Date()
                .toLocaleDateString('pt-BR')
                .replace(/\//g, '-');

            XLSX.writeFile(
                pastaTrabalho,
                `atletas_sate_${dataAtual}.xlsx`
            );
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
                const dadosErro = await resposta
                    .json()
                    .catch(() => null);

                throw new Error(
                    dadosErro?.mensagem ||
                    'Não foi possível buscar o atleta.'
                );
            }

            const dados: AtletaBackend = await resposta.json();

            return dados;
        } catch (error) {
            console.error('Erro ao buscar atleta:', error);

            setErro(
                error instanceof Error
                    ? error.message
                    : 'Erro ao buscar atleta.'
            );

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

    const voltarParaPerfil = () => {
        if (!atletaSelecionado) {
            setTelaAtual('lista');
            return;
        }

        setTelaAtual('perfil');
    };

    const abrirEdicao = () => {
        if (!atletaSelecionado) return;
        setTelaAtual('editar');
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
    }, [
        atletas,
        busca,
        filtroModalidade,
        filtroCategoria,
        filtroEquipe,
    ]);

    const limparFiltros = () => {
        setFiltroModalidade('Todas');
        setFiltroCategoria('Todas');
        setFiltroEquipe('Todas');
        setBusca('');
    };

    // ========================================================
    // CADASTRO MANUAL
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
        event: FormEvent<HTMLFormElement>
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
                            novoAtleta.dataNascimento || null,
                        sexo: novoAtleta.sexo || null,
                        categoria: novoAtleta.categoria || null,
                        rg: novoAtleta.rg || null,
                        cpf: novoAtleta.cpf || null,
                        email: novoAtleta.email,
                        telefone: novoAtleta.telefone || null,
                        responsavel: novoAtleta.responsavelNome
                            ? {
                                  nome: novoAtleta.responsavelNome,
                                  grauParentesco:
                                      novoAtleta.responsavelGrau,
                                  telefone:
                                      novoAtleta.responsavelTelefone,
                              }
                            : null,
                    }),
                }
            );

            const dados = await resposta.json().catch(() => null);

            if (!resposta.ok) {
                throw new Error(
                    dados?.mensagem ||
                    'Não foi possível cadastrar o atleta.'
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
                    normalizarColuna(chave) ===
                    normalizarColuna(alternativa)
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

        const brasileira = valor.match(
            /^(\d{2})\/(\d{2})\/(\d{4})$/
        );

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

            const extensao = arquivo.name
                .split('.')
                .pop()
                ?.toLowerCase();

            if (!['xlsx', 'xls', 'csv'].includes(extensao || '')) {
                throw new Error(
                    'Selecione uma planilha Excel (.xlsx ou .xls) ou CSV.'
                );
            }

            const conteudo = await arquivo.arrayBuffer();

            const workbook = XLSX.read(conteudo, {
                type: 'array',
                cellDates: true,
            });

            const primeiraAba = workbook.SheetNames[0];

            if (!primeiraAba) {
                throw new Error('A planilha está vazia.');
            }

            const linhas = XLSX.utils.sheet_to_json<
                Record<string, unknown>
            >(workbook.Sheets[primeiraAba], {
                defval: '',
                raw: false,
            });

            if (linhas.length === 0) {
                throw new Error(
                    'Não encontramos linhas de atletas na planilha.'
                );
            }

            const atletasConvertidos: AtletaPlanilha[] =
                linhas.map((linha) => {
                    const sexoOriginal = lerValor(linha, [
                        'sexo',
                        'genero',
                    ])
                        .toLowerCase()
                        .normalize('NFD')
                        .replace(/[\u0300-\u036f]/g, '');

                    let sexo = '';

                    if (
                        ['masculino', 'm', 'masc'].includes(
                            sexoOriginal
                        )
                    ) {
                        sexo = 'MASCULINO';
                    } else if (
                        ['feminino', 'f', 'fem'].includes(
                            sexoOriginal
                        )
                    ) {
                        sexo = 'FEMININO';
                    } else if (
                        ['outro', 'outra'].includes(sexoOriginal)
                    ) {
                        sexo = 'OUTRO';
                    } else if (
                        ['nao informado'].includes(sexoOriginal)
                    ) {
                        sexo = 'NAO_INFORMADO';
                    }

                    return {
                        nome: lerValor(linha, [
                            'nome',
                            'nome completo',
                            'atleta',
                        ]),
                        email: lerValor(linha, [
                            'email',
                            'e-mail',
                            'email do atleta',
                        ]),
                        dataNascimento: converterData(
                            lerValor(linha, [
                                'data de nascimento',
                                'nascimento',
                                'data nascimento',
                            ])
                        ),
                        sexo,
                        categoria: lerValor(linha, ['categoria']),
                        cpf: lerValor(linha, ['cpf']),
                        rg: lerValor(linha, ['rg']),
                        telefone: lerValor(linha, [
                            'telefone',
                            'celular',
                            'telefone do atleta',
                        ]),
                        responsavelNome: lerValor(linha, [
                            'responsavel',
                            'nome do responsavel',
                            'responsável',
                            'nome responsável',
                        ]),
                        responsavelGrau: lerValor(linha, [
                            'grau de parentesco',
                            'parentesco',
                        ]),
                        responsavelTelefone: lerValor(linha, [
                            'telefone do responsavel',
                            'telefone responsável',
                        ]),
                    };
                });

            const linhasInvalidas = atletasConvertidos.filter(
                (atleta) => !atleta.nome || !atleta.email
            );

            if (linhasInvalidas.length > 0) {
                throw new Error(
                    `${linhasInvalidas.length} linha(s) estão sem nome ou e-mail. Corrija a planilha antes de importar.`
                );
            }

            const emails = atletasConvertidos.map((atleta) =>
                atleta.email.toLowerCase()
            );

            if (new Set(emails).size !== emails.length) {
                throw new Error(
                    'Existem e-mails repetidos na planilha. Corrija as duplicidades antes de importar.'
                );
            }

            setAtletasPlanilha(atletasConvertidos);
            setNomeArquivo(arquivo.name);
        } catch (error) {
            console.error('Erro ao ler planilha:', error);

            setErro(
                error instanceof Error
                    ? error.message
                    : 'Não foi possível ler a planilha.'
            );
        }
    };

    const importarAtletasPlanilha = async () => {
        if (atletasPlanilha.length === 0) {
            setErro('Selecione uma planilha com atletas válidos.');
            return;
        }

        try {
            setImportandoPlanilha(true);
            setErro('');
            setResultadoImportacao('');

            let cadastrados = 0;
            const falhas: string[] = [];

            for (let i = 0; i < atletasPlanilha.length; i++) {
                const atleta = atletasPlanilha[i];

                try {
                    const resposta = await fetch(
                        `${API_URL}/api/atletas`,
                        {
                            method: 'POST',
                            headers: headersAutenticacao(),
                            body: JSON.stringify({
                                nome: atleta.nome,
                                email: atleta.email,
                                dataNascimento:
                                    atleta.dataNascimento || null,
                                sexo: atleta.sexo || null,
                                categoria: atleta.categoria || null,
                                cpf: atleta.cpf || null,
                                rg: atleta.rg || null,
                                telefone: atleta.telefone || null,
                                responsavel: atleta.responsavelNome
                                    ? {
                                          nome: atleta.responsavelNome,
                                          grauParentesco:
                                              atleta.responsavelGrau,
                                          telefone:
                                              atleta.responsavelTelefone,
                                      }
                                    : null,
                            }),
                        }
                    );

                    const dados = await resposta
                        .json()
                        .catch(() => null);

                    if (!resposta.ok) {
                        throw new Error(
                            dados?.mensagem ||
                            `Erro HTTP ${resposta.status}`
                        );
                    }

                    cadastrados++;
                } catch (error) {
                    const mensagem =
                        error instanceof Error
                            ? error.message
                            : 'Erro desconhecido';

                    falhas.push(
                        `Linha ${i + 2} (${atleta.nome}): ${mensagem}`
                    );
                }
            }

            await carregarAtletas();

            if (falhas.length === 0) {
                setResultadoImportacao(
                    `${cadastrados} atleta(s) cadastrado(s) com sucesso!`
                );
                setAtletasPlanilha([]);
                setNomeArquivo('');
            } else {
                setResultadoImportacao(
                    `${cadastrados} de ${atletasPlanilha.length} atleta(s) cadastrados. ${falhas.length} não puderam ser importados.`
                );

                setErro(falhas.slice(0, 5).join('\n'));
            }
        } catch (error) {
            setErro(
                error instanceof Error
                    ? error.message
                    : 'Erro ao importar os atletas.'
            );
        } finally {
            setImportandoPlanilha(false);
        }
    };

    // ========================================================
    // ATUALIZAR ATLETA
    // ========================================================

    const atualizarAtletaSelecionado = async (
        dados: Record<string, unknown>
    ) => {
        if (!atletaSelecionado) return;

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

            const resultado = await resposta
                .json()
                .catch(() => null);

            if (!resposta.ok) {
                throw new Error(
                    resultado?.mensagem ||
                    'Não foi possível atualizar o atleta.'
                );
            }

            const atletaAtualizado = await buscarAtletaPorId(
                atletaSelecionado.id
            );

            if (atletaAtualizado) {
                setAtletaSelecionado(atletaAtualizado);
            }

            await carregarAtletas();
            setTelaAtual('perfil');
        } catch (error) {
            console.error('Erro ao atualizar atleta:', error);

            setErro(
                error instanceof Error
                    ? error.message
                    : 'Erro ao atualizar atleta.'
            );
        }
    };

    // ========================================================
    // TELAS INTERNAS
    // ========================================================

    if (telaAtual === 'editar') {
        if (!atletaSelecionado) return null;

        return (
            <EditarAtleta
                atleta={atletaSelecionado}
                onBack={voltarParaPerfil}
                onSave={atualizarAtletaSelecionado}
            />
        );
    }

    if (telaAtual === 'informacoes') {
        if (!atletaSelecionado) return null;

        return (
            <InformacoesAtleta
                atleta={atletaSelecionado}
                onBack={voltarParaPerfil}
            />
        );
    }

    if (telaAtual === 'clipes') {
        if (!atletaSelecionado) return null;

        return <ClipesAtleta onBack={voltarParaPerfil} />;
    }

    if (telaAtual === 'perfil') {
        if (!atletaSelecionado) return null;

        return (
            <PerfilAtleta
                atleta={atletaSelecionado}
                onBack={voltarParaLista}
                onEdit={abrirEdicao}
                onInformacoes={() =>
                    abrirInformacoes(atletaSelecionado.id)
                }
                onClipes={() =>
                    abrirClipes(atletaSelecionado.id)
                }
            />
        );
    }

    // ========================================================
    // LISTA DE ATLETAS
    // ========================================================

    return (
        <div className={styles.page}>
            <div className={styles.top}>
                <div className={styles.titleArea}>
                    <h1>Seus <em>atletas.</em></h1>
                    <p>Acompanhe desempenho, evolução e informações individuais.</p>
                </div>

                <div className={styles.headerActions}>
                    <button
                        type="button"
                        className={styles.exportButton}
                        onClick={exportarAtletasExcel}
                        disabled={
                            carregando ||
                            exportando ||
                            atletasFiltrados.length === 0
                        }
                    >
                        <FileSpreadsheet size={18} />
                        {exportando
                            ? 'Exportando...'
                            : 'Exportar Excel'}
                    </button>

                    <button
                        type="button"
                        className={styles.newAthleteButton}
                        onClick={abrirOpcoesCadastro}
                    >
                        <Plus size={18} />
                        Novo atleta
                    </button>
                </div>
            </div>

            {erro && !mostrarCadastro && (
                <div className={styles.message}>
                    <strong>Ocorreu um erro</strong>
                    <span>{erro}</span>
                    <button
                        type="button"
                        onClick={() => setErro('')}
                    >
                        Fechar
                    </button>
                </div>
            )}

            <div className={styles.filters}>
                <div className={styles.searchBox}>
                    <Search size={19} />

                    <input
                        type="text"
                        value={busca}
                        onChange={(event) =>
                            setBusca(event.target.value)
                        }
                        placeholder="Buscar atleta..."
                    />

                    {busca && (
                        <button
                            type="button"
                            className={styles.clearSearchButton}
                            onClick={() => setBusca('')}
                            aria-label="Limpar busca"
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>

                <div className={styles.selectBox}>
                    <select
                        value={filtroModalidade}
                        onChange={(event) =>
                            setFiltroModalidade(event.target.value)
                        }
                    >
                        {modalidades.map((modalidade) => (
                            <option
                                key={modalidade}
                                value={modalidade}
                            >
                                {modalidade}
                            </option>
                        ))}
                    </select>
                    <ChevronDown size={17} />
                </div>

                <div className={styles.selectBox}>
                    <select
                        value={filtroCategoria}
                        onChange={(event) =>
                            setFiltroCategoria(event.target.value)
                        }
                    >
                        {categorias.map((categoria) => (
                            <option
                                key={categoria}
                                value={categoria}
                            >
                                {categoria}
                            </option>
                        ))}
                    </select>
                    <ChevronDown size={17} />
                </div>


                {(busca ||
                    filtroModalidade !== 'Todas' ||
                    filtroCategoria !== 'Todas' ||
                    filtroEquipe !== 'Todas') && (
                    <button
                        type="button"
                        className={styles.clearFiltersButton}
                        onClick={limparFiltros}
                    >
                        Limpar filtros
                    </button>
                )}
            </div>

            {mostrarFiltros && (
                <div className={styles.teamFilter}>
                    <div className={styles.selectBox}>
                        <select
                            value={filtroEquipe}
                            onChange={(event) =>
                                setFiltroEquipe(event.target.value)
                            }
                        >
                            {equipes.map((equipe) => (
                                <option key={equipe} value={equipe}>
                                    {equipe}
                                </option>
                            ))}
                        </select>
                        <ChevronDown size={17} />
                    </div>
                </div>
            )}

            <div className={styles.athleteCount}>
                {carregando
                    ? 'Carregando atletas...'
                    : `${atletasFiltrados.length} ${
                          atletasFiltrados.length === 1
                              ? 'atleta'
                              : 'atletas'
                      }`}
            </div>

            {carregando && (
                <div className={styles.empty}>
                    <strong>Carregando atletas...</strong>
                    <span>
                        Aguarde enquanto buscamos os atletas.
                    </span>
                </div>
            )}

            {!carregando && atletasFiltrados.length === 0 && (
                <div className={styles.empty}>
                    <UserRound size={28} />

                    <strong>Nenhum atleta encontrado</strong>

                    <span>
                        {busca ||
                        filtroModalidade !== 'Todas' ||
                        filtroCategoria !== 'Todas' ||
                        filtroEquipe !== 'Todas'
                            ? 'Tente alterar os filtros ou a busca.'
                            : 'Cadastre seu primeiro atleta para começar.'}
                    </span>

                    {!busca &&
                        filtroModalidade === 'Todas' &&
                        filtroCategoria === 'Todas' &&
                        filtroEquipe === 'Todas' && (
                            <button
                                type="button"
                                className={styles.submitButton}
                                onClick={abrirOpcoesCadastro}
                            >
                                <Plus size={16} />
                                Novo atleta
                            </button>
                        )}
                </div>
            )}

            {!carregando && atletasFiltrados.length > 0 && (
                <div className={styles.athletesGrid}>
                    {atletasFiltrados.map((atleta) => (
                        <div key={atleta.id} className={styles.athleteCard}>
                            <div className={styles.cardContent}>
                                <div className={`${styles.avatar} ${styles[obterCorAvatar(atleta.id)]}`}>
                                    {atleta.avatarUrl ? (
                                        <img
                                            className={styles.avatarImage}
                                            src={atleta.avatarUrl}
                                            alt={`Foto de ${atleta.nome}`}
                                        />
                                    ) : (
                                        atleta.nome.charAt(0).toUpperCase()
                                    )}
                                </div>

                                <div className={styles.athleteName}>
                                    <h2>{atleta.nome}</h2>
                                </div>

                                <div className={styles.team}>
                                    {atleta.equipe || 'Sem equipe'}
                                </div>

                                <div className={styles.category}>
                                    {atleta.categoria || 'Não informado'}
                                </div>

                                <div className={styles.frequency}>
                                    {atleta.frequencia}%
                                </div>

                                <div
                                    className={styles.actionSpace}
                                    aria-hidden="true"
                                />
                            </div>

                            <div className={styles.cardHover}>
                                <button type="button" onClick={() => abrirPerfil(atleta.id)}>
                                    <Eye size={17} />
                                    Perfil
                                </button>
                                <button type="button" onClick={() => abrirInformacoes(atleta.id)}>
                                    <UserRound size={17} />
                                    Informações
                                </button>
                                <button type="button" onClick={() => abrirClipes(atleta.id)}>
                                    <Scissors size={17} />
                                    Clipes
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* MODAL DE CADASTRO */}

            {mostrarCadastro && (
                <div
                    className={styles.modalOverlay}
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            fecharCadastro();
                        }
                    }}
                >
                    <div
                        className={styles.newAthleteModal}
                        onMouseDown={(event) =>
                            event.stopPropagation()
                        }
                    >
                        <div className={styles.modalHeader}>
                            <div>
                                <span>CADASTRO</span>

                                <h2>
                                    {modoCadastro === 'escolha'
                                        ? 'Novo atleta'
                                        : modoCadastro === 'manual'
                                          ? 'Cadastro manual'
                                          : 'Cadastro por planilha'}
                                </h2>

                                <p>
                                    {modoCadastro === 'escolha'
                                        ? 'Escolha como deseja adicionar atletas.'
                                        : modoCadastro === 'manual'
                                          ? 'Preencha os dados do atleta.'
                                          : 'Importe vários atletas de uma só vez.'}
                                </p>
                            </div>

                            <button
                                type="button"
                                className={styles.closeModalButton}
                                onClick={fecharCadastro}
                                disabled={importandoPlanilha}
                                aria-label="Fechar cadastro"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {erro && (
                            <div className={styles.modalError}>
                                <strong>Ocorreu um erro</strong>
                                <span>{erro}</span>
                                <button
                                    type="button"
                                    onClick={() => setErro('')}
                                >
                                    Fechar
                                </button>
                            </div>
                        )}

                        {/* ESCOLHA DO CADASTRO */}

                        {modoCadastro === 'escolha' && (
                            <>
                                <div className={styles.modalBody}>
                                    <section className={styles.formSection}>
                                        <div className={styles.sectionHeader}>
                                            <h3>
                                                Como deseja cadastrar?
                                            </h3>
                                            <span>
                                                Escolha uma das opções abaixo
                                                para continuar.
                                            </span>
                                        </div>

                                        <div className={styles.cadastroOpcoes}>
                                            <button
                                                type="button"
                                                className={styles.cadastroOpcao}
                                                onClick={() => {
                                                    setErro('');
                                                    setModoCadastro('manual');
                                                }}
                                            >
                                                <span
                                                    className={`${styles.cadastroOpcaoIcone} ${styles.cadastroOpcaoIconeVerde}`}
                                                >
                                                    <UserRound size={28} />
                                                </span>

                                                <strong>
                                                    Cadastro manual
                                                </strong>

                                                <span className={styles.cadastroOpcaoDescricao}>
                                                    Cadastre um atleta por vez,
                                                    preenchendo o formulário
                                                    individual.
                                                </span>

                                                <span className={styles.cadastroOpcaoLink}>
                                                    Preencher formulário →
                                                </span>
                                            </button>

                                            <button
                                                type="button"
                                                className={`${styles.cadastroOpcao} ${styles.cadastroOpcaoPlanilha}`}
                                                onClick={() => {
                                                    setErro('');
                                                    setResultadoImportacao('');
                                                    setAtletasPlanilha([]);
                                                    setNomeArquivo('');
                                                    setModoCadastro('planilha');
                                                }}
                                            >
                                                <span
                                                    className={`${styles.cadastroOpcaoIcone} ${styles.cadastroOpcaoIconeRosa}`}
                                                >
                                                    <FileSpreadsheet size={28} />
                                                </span>

                                                <strong>
                                                    Cadastro por planilha
                                                </strong>

                                                <span className={styles.cadastroOpcaoDescricao}>
                                                    Importe vários atletas de
                                                    uma só vez usando Excel ou
                                                    CSV.
                                                </span>

                                                <span className={styles.cadastroOpcaoLink}>
                                                    Selecionar planilha →
                                                </span>
                                            </button>
                                        </div>
                                    </section>
                                </div>

                                <div className={styles.modalFooter}>
                                    <button
                                        type="button"
                                        className={styles.cancelButton}
                                        onClick={fecharCadastro}
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </>
                        )}

                        {/* CADASTRO MANUAL */}

                        {modoCadastro === 'manual' && (
                            <form
                                id="formulario-atleta"
                                className={styles.modalForm}
                                onSubmit={cadastrarAtleta}
                            >
                                <div className={styles.modalBody}>
                                    <button
                                        type="button"
                                        className={`${styles.cancelButton} ${styles.backToOptionsButton}`}
                                        onClick={() => {
                                            setErro('');
                                            setModoCadastro('escolha');
                                        }}
                                    >
                                        <ArrowLeft size={16} />
                                        Voltar às opções
                                    </button>

                                    <section className={styles.formSection}>
                                        <div className={styles.sectionHeader}>
                                            <h3>Dados pessoais</h3>
                                            <span>
                                                Informações principais do atleta
                                            </span>
                                        </div>

                                        <div className={styles.formGrid}>
                                            <div
                                                className={`${styles.formField} ${styles.fullField}`}
                                            >
                                                <label>
                                                    Nome completo <b>*</b>
                                                </label>
                                                <input
                                                    type="text"
                                                    value={novoAtleta.nome}
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

                                            <div className={styles.formField}>
                                                <label>
                                                    Data de nascimento
                                                </label>
                                                <input
                                                    type="date"
                                                    value={novoAtleta.dataNascimento}
                                                    onChange={(event) =>
                                                        alterarNovoAtleta(
                                                            'dataNascimento',
                                                            event.target.value
                                                        )
                                                    }
                                                />
                                            </div>

                                            <div className={styles.formField}>
                                                <label>Sexo</label>
                                                <select
                                                    value={novoAtleta.sexo}
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

                                            <div className={styles.formField}>
                                                <label>Categoria</label>
                                                <input
                                                    type="text"
                                                    value={novoAtleta.categoria}
                                                    onChange={(event) =>
                                                        alterarNovoAtleta(
                                                            'categoria',
                                                            event.target.value
                                                        )
                                                    }
                                                    placeholder="Ex.: Sub-18"
                                                />
                                            </div>

                                            <div className={styles.formField}>
                                                <label>CPF</label>
                                                <input
                                                    type="text"
                                                    value={novoAtleta.cpf}
                                                    onChange={(event) =>
                                                        alterarNovoAtleta(
                                                            'cpf',
                                                            event.target.value
                                                        )
                                                    }
                                                    placeholder="000.000.000-00"
                                                />
                                            </div>

                                            <div className={styles.formField}>
                                                <label>RG</label>
                                                <input
                                                    type="text"
                                                    value={novoAtleta.rg}
                                                    onChange={(event) =>
                                                        alterarNovoAtleta(
                                                            'rg',
                                                            event.target.value
                                                        )
                                                    }
                                                    placeholder="00.000.000-0"
                                                />
                                            </div>

                                            <div className={styles.formField}>
                                                <label>Telefone</label>
                                                <input
                                                    type="text"
                                                    value={novoAtleta.telefone}
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
                                                className={`${styles.formField} ${styles.fullField}`}
                                            >
                                                <label>
                                                    E-mail <b>*</b>
                                                </label>
                                                <input
                                                    type="email"
                                                    value={novoAtleta.email}
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

                                    <section className={styles.formSection}>
                                        <div className={styles.sectionHeader}>
                                            <h3>Responsável</h3>
                                            <span>
                                                Dados do responsável pelo atleta
                                            </span>
                                        </div>

                                        <div className={styles.responsibleGrid}>
                                            <div className={styles.formField}>
                                                <label>
                                                    Nome do responsável
                                                </label>
                                                <input
                                                    type="text"
                                                    value={novoAtleta.responsavelNome}
                                                    onChange={(event) =>
                                                        alterarNovoAtleta(
                                                            'responsavelNome',
                                                            event.target.value
                                                        )
                                                    }
                                                    placeholder="Nome completo"
                                                />
                                            </div>

                                            <div className={styles.formField}>
                                                <label>
                                                    Grau de parentesco
                                                </label>
                                                <input
                                                    type="text"
                                                    value={novoAtleta.responsavelGrau}
                                                    onChange={(event) =>
                                                        alterarNovoAtleta(
                                                            'responsavelGrau',
                                                            event.target.value
                                                        )
                                                    }
                                                    placeholder="Ex.: Mãe"
                                                />
                                            </div>

                                            <div className={styles.formField}>
                                                <label>Telefone</label>
                                                <input
                                                    type="text"
                                                    value={novoAtleta.responsavelTelefone}
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

                                <div className={styles.modalFooter}>
                                    <button
                                        type="button"
                                        className={styles.cancelButton}
                                        onClick={() => {
                                            setErro('');
                                            setModoCadastro('escolha');
                                        }}
                                    >
                                        Voltar
                                    </button>

                                    <button
                                        type="submit"
                                        className={styles.submitButton}
                                    >
                                        Cadastrar atleta
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* CADASTRO POR PLANILHA */}

                        {modoCadastro === 'planilha' && (
                            <>
                                <div className={styles.modalBody}>
                                    <button
                                        type="button"
                                        className={`${styles.cancelButton} ${styles.backToOptionsButton}`}
                                        onClick={() => {
                                            setErro('');
                                            setResultadoImportacao('');
                                            setModoCadastro('escolha');
                                        }}
                                        disabled={importandoPlanilha}
                                    >
                                        <ArrowLeft size={16} />
                                        Voltar às opções
                                    </button>

                                    <section className={styles.formSection}>
                                        <div className={styles.sectionHeader}>
                                            <h3>Importar atletas</h3>
                                            <span>
                                                Selecione sua planilha para
                                                carregar os dados.
                                            </span>
                                        </div>

                                        <label
                                            htmlFor="arquivo-planilha-atletas"
                                            className={styles.uploadArea}
                                        >
                                            <span
                                                className={`${styles.cadastroOpcaoIcone} ${styles.cadastroOpcaoIconeVerde}`}
                                            >
                                                <Upload size={30} />
                                            </span>

                                            <strong>
                                                {nomeArquivo ||
                                                    'Clique para selecionar a planilha'}
                                            </strong>

                                            <span className={styles.helpText}>
                                                Formatos aceitos: XLSX, XLS e
                                                CSV
                                            </span>

                                            <input
                                                id="arquivo-planilha-atletas"
                                                type="file"
                                                accept=".xlsx,.xls,.csv"
                                                disabled={importandoPlanilha}
                                                className={styles.hiddenFileInput}
                                                onChange={(event) => {
                                                    const arquivo =
                                                        event.target.files?.[0];

                                                    if (arquivo) {
                                                        void selecionarPlanilha(
                                                            arquivo
                                                        );
                                                    }

                                                    event.target.value = '';
                                                }}
                                            />
                                        </label>

                                        <p className={styles.helpText}>
                                            A primeira linha precisa conter os
                                            nomes das colunas. Nome e E-mail
                                            são obrigatórios. As demais
                                            informações podem ficar vazias.
                                        </p>

                                        <p className={styles.helpText}>
                                            Colunas reconhecidas: Nome,
                                            E-mail, Data de nascimento, Sexo,
                                            Categoria, CPF, RG, Telefone,
                                            Responsável, Grau de parentesco
                                            e Telefone do responsável.
                                        </p>
                                    </section>

                                    {atletasPlanilha.length > 0 && (
                                        <section className={styles.formSection}>
                                            <div className={styles.sectionHeader}>
                                                <h3 className={styles.previewTitle}>
                                                    <CheckCircle2 size={18} />
                                                    Prévia dos dados
                                                </h3>
                                                <span>
                                                    {atletasPlanilha.length}{' '}
                                                    {atletasPlanilha.length === 1
                                                        ? 'atleta encontrado'
                                                        : 'atletas encontrados'}
                                                </span>
                                            </div>

                                            <div className={styles.tableWrapper}>
                                                <table className={styles.previewTable}>
                                                    <thead>
                                                        <tr>
                                                            <th>Nome</th>
                                                            <th>E-mail</th>
                                                            <th>Categoria</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {atletasPlanilha
                                                            .slice(0, 8)
                                                            .map((atleta, index) => (
                                                                <tr
                                                                    key={`${atleta.email}-${index}`}
                                                                >
                                                                    <td>
                                                                        {atleta.nome}
                                                                    </td>
                                                                    <td>
                                                                        {atleta.email}
                                                                    </td>
                                                                    <td>
                                                                        {atleta.categoria ||
                                                                            '—'}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                    </tbody>
                                                </table>
                                            </div>

                                            {atletasPlanilha.length > 8 && (
                                                <p className={styles.helpText}>
                                                    Exibindo 8 de{' '}
                                                    {atletasPlanilha.length}{' '}
                                                    registros.
                                                </p>
                                            )}
                                        </section>
                                    )}

                                    {resultadoImportacao && (
                                        <div className={styles.importResult}>
                                            <CheckCircle2 size={20} />
                                            <span>
                                                {resultadoImportacao}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className={styles.modalFooter}>
                                    <button
                                        type="button"
                                        className={styles.cancelButton}
                                        onClick={() => {
                                            if (importandoPlanilha) return;

                                            setModoCadastro('escolha');
                                            setErro('');
                                            setResultadoImportacao('');
                                        }}
                                        disabled={importandoPlanilha}
                                    >
                                        Voltar
                                    </button>

                                    <button
                                        type="button"
                                        className={styles.submitButton}
                                        disabled={
                                            importandoPlanilha ||
                                            atletasPlanilha.length === 0
                                        }
                                        onClick={() =>
                                            void importarAtletasPlanilha()
                                        }
                                    >
                                        {importandoPlanilha
                                            ? 'Importando atletas...'
                                            : `Importar ${atletasPlanilha.length} atleta(s)`}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Atletas;