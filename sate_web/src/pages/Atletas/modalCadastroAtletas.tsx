import { useState } from 'react';
import {
    X,
    Upload,
    Check,
    Image as ImageIcon,
    ArrowLeft
} from 'lucide-react';

import styles from './ModalCadastroAtletas.module.css';

interface ModalCadastroAtletaProps {
    onClose: () => void;
    onSave?: (dados: unknown) => void;
}

interface AtletaManual {
    nome: string;
    email: string;
    nascimento: string;
    rg: string;
    cpf: string;
    sexo: string;
    responsavel: string;
    telefoneResponsavel: string;
    telefoneAtleta: string;
    cep: string;
    endereco: string;
    numero: string;
    bairro: string;
}

const dadosIniciais: AtletaManual = {
    nome: '',
    email: '',
    nascimento: '',
    rg: '',
    cpf: '',
    sexo: '',
    responsavel: '',
    telefoneResponsavel: '',
    telefoneAtleta: '',
    cep: '',
    endereco: '',
    numero: '',
    bairro: ''
};

const ModalCadastroAtleta = ({ onClose, onSave }: ModalCadastroAtletaProps) => {
    const [etapa, setEtapa] = useState(1);
    const [dados, setDados] = useState<AtletaManual>(dadosIniciais);
    const [arquivo, setArquivo] = useState<File | null>(null);

    const atualizarCampo = (campo: keyof AtletaManual, valor: string) => {
        setDados(prev => ({ ...prev, [campo]: valor }));
    };

    const continuarEtapa1 = () => {
        if (arquivo) {
            setEtapa(3); // Importação pula a etapa 2
            return;
        }
        setEtapa(2);
    };

    const continuarEtapa2 = () => {
        setEtapa(3);
    };

    const voltar = () => {
        if (etapa === 3 && arquivo) {
            setEtapa(1);
            return;
        }
        setEtapa(prev => Math.max(1, prev - 1));
    };

    const salvarAtleta = () => {
        onSave?.({ ...dados, arquivo });
        onClose();
    };

    // Renderiza o cabeçalho de etapas (Stepper) com linha de progresso
    const renderSteps = () => {
        const steps = ['Dados básicos', 'Dados Extras', 'Revisão'];
        
        // Calcula a largura da linha preenchida: Etapa 1 = 0%, Etapa 2 = 50%, Etapa 3 = 100%
        const progressWidth = `${((etapa - 1) / (steps.length - 1)) * 100}%`;

        return (
            <div className={styles.steps}>
                {/* Linha de fundo */}
                <div className={styles.stepLine}>
                    {/* Linha preenchida */}
                    <div 
                        className={styles.stepLineProgress} 
                        style={{ width: progressWidth }} 
                    />
                </div>

                {steps.map((nome, index) => {
                    const numero = index + 1;
                    const concluida = etapa > numero;
                    const atual = etapa === numero;

                    return (
                        <div className={styles.step} key={numero}>
                            <div className={`${styles.stepCircle} ${concluida || atual ? styles.active : ''}`}>
                                {concluida ? <Check size={18} /> : numero}
                            </div>
                            <span className={`${styles.stepLabel} ${atual ? styles.stepLabelActive : ''}`}>
                                Etapa {numero}: {nome}
                            </span>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                
                {renderSteps()}

                <button className={styles.closeButton} onClick={onClose} aria-label="Fechar cadastro">
                    <X size={23} />
                </button>

                <div className={styles.content}>
                    {/* ETAPA 1 */}
                    {etapa === 1 && (
                        <div className={styles.stepOne}>
                            {/* CADASTRO MANUAL */}
                            <div className={styles.manualCard}>
                                <h2>Cadastro manual</h2>
                                <div className={styles.formGroup}>
                                    <label>Nome</label>
                                    <input placeholder="Digite o nome..." value={dados.nome} onChange={e => atualizarCampo('nome', e.target.value)} />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>E-mail</label>
                                    <input type="email" placeholder="Digite o e-mail..." value={dados.email} onChange={e => atualizarCampo('email', e.target.value)} />
                                </div>
                                <div className={styles.twoColumns}>
                                    <div className={styles.formGroup}>
                                        <label>Data Nasc.</label>
                                        <input type="date" value={dados.nascimento} onChange={e => atualizarCampo('nascimento', e.target.value)} />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Foto</label>
                                        <label className={styles.photoUpload}>
                                            <ImageIcon size={38} />
                                            <input type="file" accept="image/*" hidden />
                                        </label>
                                    </div>
                                </div>
                                <div className={styles.formGroup}>
                                    <label>RG</label>
                                    <input value={dados.rg} onChange={e => atualizarCampo('rg', e.target.value)} />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>CPF</label>
                                    <input value={dados.cpf} onChange={e => atualizarCampo('cpf', e.target.value)} />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Sexo</label>
                                    <select value={dados.sexo} onChange={e => atualizarCampo('sexo', e.target.value)}>
                                        <option value="">Selecione</option>
                                        <option value="feminino">Feminino</option>
                                        <option value="masculino">Masculino</option>
                                        <option value="outro">Outro</option>
                                    </select>
                                </div>
                                <button className={styles.primaryButton} onClick={continuarEtapa1}>
                                    Continuar
                                </button>
                            </div>

                            {/* IMPORTAR PLANILHA */}
                            <div className={styles.importCard}>
                                <h2>Importar Planilha</h2>
                                <label className={styles.dropzone}>
                                    <Upload size={42} />
                                    <span>{arquivo ? arquivo.name : 'Arraste o arquivo .xlsx ou .csv aqui'}</span>
                                    <input type="file" accept=".xlsx,.csv" hidden onChange={e => setArquivo(e.target.files?.[0] || null)} />
                                </label>
                                <button className={styles.primaryButton} disabled={!arquivo} onClick={continuarEtapa1}>
                                    Importar
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ETAPA 2 */}
                    {etapa === 2 && (
                        <div className={styles.formCard}>
                            <h2>Cadastro manual</h2>
                            <div className={styles.formGroup}>
                                <label>Nome do responsável</label>
                                <input placeholder="Digite o nome..." value={dados.responsavel} onChange={e => atualizarCampo('responsavel', e.target.value)} />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Número do responsável</label>
                                <input placeholder="Digite o telefone..." value={dados.telefoneResponsavel} onChange={e => atualizarCampo('telefoneResponsavel', e.target.value)} />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Número do atleta</label>
                                <input placeholder="Digite o telefone..." value={dados.telefoneAtleta} onChange={e => atualizarCampo('telefoneAtleta', e.target.value)} />
                            </div>
                            <div className={styles.formGroup}>
                                <label>CEP</label>
                                <input value={dados.cep} onChange={e => atualizarCampo('cep', e.target.value)} />
                            </div>
                            <div className={styles.addressRow}>
                                <div className={styles.formGroup}>
                                    <label>Endereço</label>
                                    <input value={dados.endereco} onChange={e => atualizarCampo('endereco', e.target.value)} />
                                </div>
                                <div className={styles.formGroupSmall}>
                                    <label>Nº</label>
                                    <input value={dados.numero} onChange={e => atualizarCampo('numero', e.target.value)} />
                                </div>
                            </div>
                            <div className={styles.formGroup}>
                                <label>Bairro</label>
                                <input value={dados.bairro} onChange={e => atualizarCampo('bairro', e.target.value)} />
                            </div>
                            <div className={styles.actions}>
                                <button className={styles.backButton} onClick={voltar}>
                                    <ArrowLeft size={18} /> Voltar
                                </button>
                                <button className={styles.primaryButton} onClick={continuarEtapa2}>
                                    Continuar
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ETAPA 3 */}
                    {etapa === 3 && (
                        <div className={styles.reviewCard}>
                            <h2>Revisão & Correção</h2>
                            <p>Revise os dados dos atletas e corrija os erros</p>
                            <div className={styles.reviewTable}>
                                <div className={styles.reviewHeader}>
                                    <span>Nome & E-mail</span>
                                    <span>RG & CPF</span>
                                    <span>Data Nasc.</span>
                                    <span>Responsável</span>
                                </div>
                                <div className={styles.reviewRow}>
                                    <div>
                                        <b>{dados.nome || 'João de Almeida'}</b>
                                        <span>{dados.email || 'joaoAlmeida@gmail.com'}</span>
                                    </div>
                                    <div>
                                        <span>RG: {dados.rg || '56.095.742-7'}</span>
                                        <span>CPF: {dados.cpf || '292.230.848-06'}</span>
                                    </div>
                                    <span>{dados.nascimento || '03/04/2008'}</span>
                                    <span>{dados.responsavel || 'Fernando de Almeida'}</span>
                                </div>
                            </div>
                            <div className={styles.actions}>
                                <button className={styles.backButton} onClick={voltar}>
                                    <ArrowLeft size={18} /> Voltar
                                </button>
                                <button className={styles.primaryButton} onClick={salvarAtleta}>
                                    Salvar atleta
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ModalCadastroAtleta;