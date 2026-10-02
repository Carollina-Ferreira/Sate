import { useState } from 'react';
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
} from 'lucide-react';

import styles from './editarAtleta.module.css';

interface EditarAtletaProps {
    onBack: () => void;
}

const EditarAtleta = ({ onBack }: EditarAtletaProps) => {
    const [abaAtiva, setAbaAtiva] = useState<
        'pessoais' | 'contato' | 'documentos'
    >('contato');

    const atleta = {
        nome: 'Diogo Ramos',
        categoria: 'M17 - Rugby',
        idade: '16 anos',
        nascimento: '15/03/2008',
        cpf: '292.240.879-00',
        statusDocumentos: '100% Completo',
    };

    const documentos = [
        {
            id: 1,
            titulo: 'Termo de Autorização de Viagem',
            status: 'Válido',
            tipo: 'PDF',
            tamanho: '1.2MB',
            validade: '31/12/2026',
        },
        {
            id: 2,
            titulo: 'Termo de Autorização de Viagem',
            status: 'Válido',
            tipo: 'PDF',
            tamanho: '1.2MB',
            validade: '31/12/2026',
        },
        {
            id: 3,
            titulo: 'Termo de Autorização de Viagem',
            status: 'Válido',
            tipo: 'PDF',
            tamanho: '1.2MB',
            validade: '31/12/2026',
        },
    ];

    return (
        <div className={styles.page}>

            {/* =========================
                VOLTAR
            ========================= */}

            <button
                className={styles.backButton}
                onClick={onBack}
            >
                <ArrowLeft size={17} />
                Voltar para atletas
            </button>


            {/* =========================
                CARD DO PERFIL
                + ABAS
            ========================= */}

            <div className={styles.profileCard}>

                {/* PARTE SUPERIOR */}

                <div className={styles.profileTop}>

                    <div className={styles.profileHeaderLeft}>

                        {/* FOTO */}

                        <div className={styles.photoContainer}>

                            <img
                                src="https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=300&q=80"
                                alt="Foto do atleta"
                                className={styles.photo}
                            />

                            <div className={styles.photoCheck}>
                                <Check size={14} />
                            </div>

                        </div>


                        {/* INFORMAÇÕES */}

                        <div className={styles.profileHeaderInfo}>

                            <div className={styles.nameRow}>

                                <h1>
                                    {atleta.nome}
                                </h1>

                                <span className={styles.categoryTag}>
                                    {atleta.categoria}
                                </span>

                            </div>

                            <p className={styles.photoHint}>
                                Foto de perfil JPG ou PNG
                            </p>


                            <div className={styles.badgesRow}>

                                <span className={styles.badge}>
                                    <FileText size={14} />
                                    {atleta.idade} ({atleta.nascimento})
                                </span>

                                <span className={styles.badge}>
                                    <FileText size={14} />
                                    CPF: {atleta.cpf}
                                </span>

                            </div>


                            <div className={styles.statusRow}>

                                <span className={styles.statusBadge}>
                                    <Check size={14} />
                                    Status dos Documentos: {atleta.statusDocumentos}
                                </span>

                            </div>

                        </div>

                    </div>


                    {/* BOTÕES */}

                    <div className={styles.profileHeaderActions}>

                        <button
                            className={styles.discardButton}
                            onClick={onBack}
                        >
                            <X size={18} />
                            Descartar Alterações
                        </button>

                        <button className={styles.saveButton}>
                            <Check size={18} />
                            Salvar Alterações
                        </button>

                    </div>

                </div>


                {/* =========================
                    DIVISÓRIA
                ========================= */}

                <div className={styles.divider} />


                {/* =========================
                    ABAS
                ========================= */}

                <div className={styles.tabsContainer}>

                    <span className={styles.tabsLabel}>
                        Filtrar:
                    </span>


                    <button
                        className={`${styles.tabButton} ${
                            abaAtiva === 'pessoais'
                                ? styles.tabActive
                                : ''
                        }`}
                        onClick={() => setAbaAtiva('pessoais')}
                    >
                        <User size={16} />
                        Dados pessoais
                    </button>


                    <button
                        className={`${styles.tabButton} ${
                            abaAtiva === 'contato'
                                ? styles.tabActive
                                : ''
                        }`}
                        onClick={() => setAbaAtiva('contato')}
                    >
                        <Phone size={16} />
                        Contato
                    </button>


                    <button
                        className={`${styles.tabButton} ${
                            abaAtiva === 'documentos'
                                ? styles.tabActive
                                : ''
                        }`}
                        onClick={() => setAbaAtiva('documentos')}
                    >
                        <FileText size={16} />
                        Documentos
                    </button>

                </div>

            </div>


            {/* =========================
                CONTEÚDO
            ========================= */}

            <div className={styles.formCard}>

                {/* =========================
                    DADOS PESSOAIS
                ========================= */}

                {abaAtiva === 'pessoais' && (
                    <>
                        <h2 className={styles.formTitle}>
                            Dados pessoais
                        </h2>


                        <div className={styles.formGrid}>

                            <div className={styles.formGroup}>
                                <label>
                                    Nome completo do atleta
                                    <span className={styles.required}>
                                        *
                                    </span>
                                </label>

                                <input
                                    type="text"
                                    defaultValue={atleta.nome}
                                />
                            </div>

                        </div>


                        <div className={styles.formGrid3}>

                            <div className={styles.formGroup}>
                                <label>
                                    Data de Nascimento
                                    <span className={styles.required}>
                                        *
                                    </span>
                                </label>

                                <input
                                    type="date"
                                    defaultValue="2008-03-15"
                                />
                            </div>


                            <div className={styles.formGroup}>
                                <label>
                                    Sexo
                                    <span className={styles.required}>
                                        *
                                    </span>
                                </label>

                                <select defaultValue="masculino">
                                    <option value="masculino">
                                        Masculino
                                    </option>

                                    <option value="feminino">
                                        Feminino
                                    </option>

                                    <option value="outro">
                                        Outro
                                    </option>
                                </select>
                            </div>


                            <div className={styles.formGroup}>
                                <label>
                                    Categoria
                                </label>

                                <input
                                    type="text"
                                    defaultValue={atleta.categoria}
                                />
                            </div>

                        </div>


                        <div className={styles.formGrid2}>

                            <div className={styles.formGroup}>
                                <label>
                                    Registro Geral (RG)
                                </label>

                                <input
                                    type="text"
                                    placeholder="Digite o RG..."
                                />
                            </div>


                            <div className={styles.formGroup}>
                                <label>
                                    Cadastro de Pessoa Física (CPF)
                                </label>

                                <input
                                    type="text"
                                    defaultValue={atleta.cpf}
                                />
                            </div>

                        </div>


                        <div className={styles.formGrid2}>

                            <div className={styles.formGroup}>
                                <label>
                                    E-mail
                                </label>

                                <input
                                    type="email"
                                    placeholder="Digite o e-mail..."
                                />
                            </div>


                            <div className={styles.formGroup}>
                                <label>
                                    Telefone
                                </label>

                                <input
                                    type="tel"
                                    placeholder="Digite o telefone..."
                                />
                            </div>

                        </div>
                    </>
                )}


                {/* =========================
                    CONTATO
                ========================= */}

                {abaAtiva === 'contato' && (
                    <>
                        <h2 className={styles.formTitle}>
                            Dados do Responsável
                        </h2>


                        <div className={styles.formGrid3}>

                            <div className={styles.formGroup}>
                                <label>
                                    Nome do Responsável
                                    <span className={styles.required}>
                                        *
                                    </span>
                                </label>

                                <input
                                    type="text"
                                    placeholder="Digite o nome..."
                                />
                            </div>


                            <div className={styles.formGroup}>
                                <label>
                                    Grau de Parentesco
                                </label>

                                <select defaultValue="">
                                    <option value="" disabled>
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


                            <div className={styles.formGroup}>
                                <label>
                                    Telefone
                                </label>

                                <input
                                    type="tel"
                                    placeholder="Digite o telefone..."
                                />
                            </div>

                        </div>


                        <h2 className={styles.sectionTitle}>
                            Endereço
                        </h2>


                        <div className={styles.formGridAddress}>

                            <div className={styles.formGroup}>
                                <label>
                                    CEP
                                </label>

                                <input
                                    type="text"
                                    placeholder="00000-000"
                                />
                            </div>


                            <div className={styles.formGroup}>
                                <label>
                                    Endereço
                                </label>

                                <input
                                    type="text"
                                    placeholder="Digite o endereço..."
                                />
                            </div>


                            <div className={styles.formGroupSmall}>
                                <label>
                                    Nº
                                </label>

                                <input
                                    type="text"
                                    placeholder="Nº"
                                />
                            </div>


                            <div className={styles.formGroup}>
                                <label>
                                    Bairro
                                </label>

                                <input
                                    type="text"
                                    placeholder="Digite o bairro..."
                                />
                            </div>

                        </div>

                    </>
                )}


                {/* =========================
                    DOCUMENTOS
                ========================= */}

                {abaAtiva === 'documentos' && (
                    <>
                        <div className={styles.docsHeader}>

                            <div>
                                <h2 className={styles.formTitle}>
                                    Repositório de Documentos e Termos
                                </h2>

                                <p className={styles.docsSubtitle}>
                                    Gerenciamento de autorizações e termos
                                    de viagem.
                                </p>
                            </div>


                            <button className={styles.uploadButton}>
                                <Upload size={18} />
                                Upload de novo documento
                            </button>

                        </div>


                        <div className={styles.docsGrid}>

                            {documentos.map((doc) => (

                                <div
                                    key={doc.id}
                                    className={styles.docCard}
                                >

                                    <div className={styles.docCardHeader}>

                                        <span className={styles.docStatus}>
                                            <Check size={12} />
                                            {doc.status}
                                        </span>

                                        <span className={styles.docMeta}>
                                            {doc.tipo} {doc.tamanho}
                                        </span>

                                    </div>


                                    <h4 className={styles.docTitle}>
                                        {doc.titulo}
                                    </h4>


                                    <span className={styles.docValidity}>
                                        Válido até {doc.validade}
                                    </span>


                                    <div className={styles.docCardFooter}>

                                        <button
                                            className={styles.docAction}
                                        >
                                            <Eye size={14} />
                                            Visualizar
                                        </button>


                                        <button
                                            className={styles.docAction}
                                        >
                                            <Download size={14} />
                                            PDF
                                        </button>


                                        <button
                                            className={styles.docActionIcon}
                                            title="Atualizar"
                                        >
                                            <RefreshCw size={16} />
                                        </button>

                                    </div>

                                </div>

                            ))}

                        </div>
                    </>
                )}

            </div>

        </div>
    );
};

export default EditarAtleta;