import {
  CalendarDays,
  Camera,
  Check,
  Clock3,
  ImagePlus,
  Palette,
  Save,
  Search,
  Shield,
  Trash2,
  UserRound,
  X,
} from 'lucide-react';

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import type {
  ChangeEvent,
  MouseEvent,
} from 'react';

import styles from './editarEquipeModal.module.css';
import LoadingState from '../ui/LoadingState/LoadingState';

/* =====================================
   TIPOS
===================================== */

export interface AtletaDisponivel {
  id: number;
  nome: string | null;
  categoria?: string | null;
  usuario?: {
    email?: string;
    avatarUrl?: string | null;
  } | null;
}

export interface EquipeParaEditar {
  id: number;
  nome: string;
  modalidade: string;
  categoria: string;
  atletas: number;
  atletasIds?: number[];
  atletasDetalhes?: AtletaDisponivel[];
  imagem: string;
  cor: string;
  proximaPartida: string;
  proximaPartidaRaw?: string | null;
}

export interface EditarEquipeData {
  id: number;
  nome: string;
  modalidade: string;
  categoria: string;
  atletasIds: number[];
  cor: string;
  proximaPartida: string;
  imagem: string;
}

interface EditarEquipeModalProps {
  open: boolean;
  equipe: EquipeParaEditar | null;
  atletasDisponiveis?: AtletaDisponivel[];
  salvando: boolean;
  onClose: () => void;
  onSave: (dados: EditarEquipeData) => void | Promise<void>;
  onDelete: () => void | Promise<void>;
}

/* =====================================
   OPÇÕES
===================================== */

const esportes = [
  'Futebol',
  'Basquete',
  'Vôlei',
  'Rugby',
  'Tênis',
];

const categorias = [
  'Principal',
  'Sub-20',
  'Sub-17',
  'Sub-15',
  'Feminino',
  'Masculino',
];

const cores = [
  '#16A875',
  '#1674B8',
  '#D9822B',
  '#B6B51A',
  '#7C5CE5',
  '#D652A2',
];

const diasSemana = [
  'Dom',
  'Seg',
  'Ter',
  'Qua',
  'Qui',
  'Sex',
  'Sáb',
];

/* =====================================
   FUNÇÕES DE FORMATAÇÃO
===================================== */

const formatarProximaPartida = (
  adversario: string,
  data: string,
  horario: string,
): string => {
  if (!adversario.trim()) {
    return 'Partida ainda não definida';
  }

  if (!data || !horario) {
    return `vs ${adversario.trim()}`;
  }

  const [ano, mes, dia] = data.split('-').map(Number);
  const dataPartida = new Date(ano, mes - 1, dia);
  const diaSemana = diasSemana[dataPartida.getDay()];
  const [hora, minuto] = horario.split(':');

  const horarioFormatado =
    minuto === '00'
      ? `${Number(hora)}h`
      : `${Number(hora)}h${minuto}`;

  return `vs ${adversario.trim()} (${diaSemana}, ${horarioFormatado})`;
};

const formatarDataInput = (data?: string | null): string => {
  if (!data) return '';

  const correspondencia = data.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (correspondencia) {
    return `${correspondencia[1]}-${correspondencia[2]}-${correspondencia[3]}`;
  }

  const valor = new Date(data);
  if (Number.isNaN(valor.getTime())) return '';

  const ano = valor.getFullYear();
  const mes = String(valor.getMonth() + 1).padStart(2, '0');
  const dia = String(valor.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
};

const formatarHorarioInput = (data?: string | null): string => {
  if (!data) return '';

  const correspondencia = data.match(/T(\d{2}):(\d{2})/);
  if (correspondencia) {
    return `${correspondencia[1]}:${correspondencia[2]}`;
  }

  const valor = new Date(data);
  if (Number.isNaN(valor.getTime())) return '';

  const hora = String(valor.getHours()).padStart(2, '0');
  const minuto = String(valor.getMinutes()).padStart(2, '0');
  return `${hora}:${minuto}`;
};

const extrairAdversario = (texto?: string | null): string => {
  if (!texto || texto === 'Partida ainda não definida') return '';
  return texto.replace(/^vs\s*/i, '').split(' (')[0].trim();
};

/* =====================================
   COMPONENTE
===================================== */

const EditarEquipeModal = ({
  open,
  equipe,
  atletasDisponiveis = [],
  salvando,
  onClose,
  onSave,
  onDelete,
}: EditarEquipeModalProps) => {
  const inputImagemRef = useRef<HTMLInputElement>(null);
  const inputCorRef = useRef<HTMLInputElement>(null);

  const [nome, setNome] = useState('');
  const [modalidade, setModalidade] = useState('Futebol');
  const [categoria, setCategoria] = useState('Principal');
  const [atletasSelecionados, setAtletasSelecionados] = useState<number[]>([]);
  const [buscaAtleta, setBuscaAtleta] = useState('');
  const [cor, setCor] = useState('#16A875');
  const [corPersonalizada, setCorPersonalizada] = useState('#005942');
  const [adversario, setAdversario] = useState('');
  const [dataPartida, setDataPartida] = useState('');
  const [horarioPartida, setHorarioPartida] = useState('');
  const [imagemPreview, setImagemPreview] = useState('');
  const [erroImagem, setErroImagem] = useState('');
  const [erroFormulario, setErroFormulario] = useState('');
  const [confirmandoExclusao, setConfirmandoExclusao] = useState(false);

  const corEhPersonalizada = !cores.includes(cor);

  /* Carregar os dados atuais sempre que o modal abrir ou a equipe mudar. */
  useEffect(() => {
    if (!open || !equipe) return;

    setNome(equipe.nome || '');
    setModalidade(equipe.modalidade || 'Futebol');
    setCategoria(equipe.categoria || 'Principal');

    let ids: number[] = [];

    if (Array.isArray(equipe.atletasIds)) {
      ids = equipe.atletasIds
        .map(Number)
        .filter((id) => Number.isInteger(id) && id > 0);
    } else if (Array.isArray(equipe.atletasDetalhes)) {
      ids = equipe.atletasDetalhes
        .map((atleta) => Number(atleta.id))
        .filter((id) => Number.isInteger(id) && id > 0);
    }

    setAtletasSelecionados([...new Set(ids)]);

    const corInicial = equipe.cor || '#16A875';
    setCor(corInicial);
    setCorPersonalizada(cores.includes(corInicial) ? '#005942' : corInicial);

    setImagemPreview(equipe.imagem || '');
    setErroImagem('');
    setErroFormulario('');

    const partidaOriginal = equipe.proximaPartidaRaw || null;
    setDataPartida(formatarDataInput(partidaOriginal));
    setHorarioPartida(formatarHorarioInput(partidaOriginal));
    setAdversario(extrairAdversario(equipe.proximaPartida));

    setBuscaAtleta('');
    setConfirmandoExclusao(false);
  }, [open, equipe]);

  /* Impedir rolagem do fundo e permitir fechar com ESC. */
  useEffect(() => {
    if (!open) return;

    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !salvando) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = overflowAnterior;
    };
  }, [open, salvando, onClose]);

  /* Inclui os atletas atuais da equipe mesmo que não estejam na lista disponível. */
  const todosAtletas = useMemo(() => {
    const mapa = new Map<number, AtletaDisponivel>();

    equipe?.atletasDetalhes?.forEach((atleta) => {
      if (atleta && Number.isInteger(Number(atleta.id)) && Number(atleta.id) > 0) {
        mapa.set(Number(atleta.id), atleta);
      }
    });

    atletasDisponiveis.forEach((atleta) => {
      if (atleta && Number.isInteger(Number(atleta.id)) && Number(atleta.id) > 0) {
        mapa.set(Number(atleta.id), atleta);
      }
    });

    return Array.from(mapa.values());
  }, [equipe?.atletasDetalhes, atletasDisponiveis]);

  const atletasFiltrados = useMemo(() => {
    const termo = buscaAtleta.trim().toLowerCase();
    if (!termo) return todosAtletas;

    return todosAtletas.filter((atleta) => {
      const nomeAtleta = atleta.nome?.toLowerCase() || '';
      const categoriaAtleta = atleta.categoria?.toLowerCase() || '';
      const email = atleta.usuario?.email?.toLowerCase() || '';

      return (
        nomeAtleta.includes(termo) ||
        categoriaAtleta.includes(termo) ||
        email.includes(termo)
      );
    });
  }, [todosAtletas, buscaAtleta]);

  const proximaPartidaPreview = useMemo(
    () => formatarProximaPartida(adversario, dataPartida, horarioPartida),
    [adversario, dataPartida, horarioPartida],
  );

  const formularioValido = nome.trim().length >= 2 && modalidade.trim() !== '' && categoria.trim() !== '';

  const alternarAtleta = (atletaId: number) => {
    setAtletasSelecionados((atuais) =>
      atuais.includes(atletaId)
        ? atuais.filter((id) => id !== atletaId)
        : [...atuais, atletaId],
    );
  };

  const handleImagem = (event: ChangeEvent<HTMLInputElement>) => {
    const arquivo = event.target.files?.[0];
    if (!arquivo) return;

    const tiposPermitidos = ['image/jpeg', 'image/png', 'image/webp'];

    if (!tiposPermitidos.includes(arquivo.type)) {
      setErroImagem('Escolha uma imagem JPG, PNG ou WEBP.');
      event.target.value = '';
      return;
    }

    if (arquivo.size > 5 * 1024 * 1024) {
      setErroImagem('A imagem deve ter no máximo 5 MB.');
      event.target.value = '';
      return;
    }

    setErroImagem('');

    const leitor = new FileReader();
    leitor.onload = () => {
      if (typeof leitor.result === 'string') {
        setImagemPreview(leitor.result);
      }
    };
    leitor.onerror = () => setErroImagem('Não foi possível carregar a imagem.');
    leitor.readAsDataURL(arquivo);
  };

  const removerImagem = () => {
    setImagemPreview('');
    setErroImagem('');
    if (inputImagemRef.current) inputImagemRef.current.value = '';
  };

  const handleCorPersonalizada = (event: ChangeEvent<HTMLInputElement>) => {
    const novaCor = event.target.value;
    setCorPersonalizada(novaCor);
    setCor(novaCor);
  };

  const handleSalvar = async () => {
    if (!equipe || salvando) return;

    if (!formularioValido) {
      setErroFormulario('Preencha o nome, o esporte e a categoria da equipe.');
      return;
    }

    setErroFormulario('');

    const proximaPartida = dataPartida && horarioPartida
      ? `${dataPartida}T${horarioPartida}:00`
      : '';

    const idsAtletas = Array.from(
      new Set(
        atletasSelecionados
          .map(Number)
          .filter((id) => Number.isInteger(id) && id > 0),
      ),
    );

    const dados: EditarEquipeData = {
      id: equipe.id,
      nome: nome.trim(),
      modalidade: modalidade.trim(),
      categoria: categoria.trim(),
      atletasIds: idsAtletas,
      cor,
      proximaPartida,
      imagem: imagemPreview || '',
    };

    try {
      await onSave(dados);
    } catch (erro) {
      console.error('Erro ao salvar equipe:', erro);
      setErroFormulario(
        erro instanceof Error ? erro.message : 'Não foi possível salvar as alterações.',
      );
    }
  };

  const handleExcluir = async () => {
    if (salvando) return;

    try {
      await onDelete();
      setConfirmandoExclusao(false);
    } catch (erro) {
      console.error('Erro ao excluir equipe:', erro);
      setErroFormulario(
        erro instanceof Error ? erro.message : 'Não foi possível excluir a equipe.',
      );
    }
  };

  const handleOverlayMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget && !salvando) {
      onClose();
    }
  };

  if (!open || !equipe) return null;

  return (
    <div className={`${styles.overlay} sate-modal-layer`} onMouseDown={handleOverlayMouseDown}>
      <section
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="editar-equipe-titulo"
        onMouseDown={(event) => event.stopPropagation()}
      >
        {/* CABEÇALHO */}
        <header className={`${styles.modalHeader} sate-modal-header-layout`}>
          <div>
            <h2 id="editar-equipe-titulo">Editar equipe</h2>
            <p>Atualize as informações, os atletas e a identidade do seu time.</p>
          </div>

          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            disabled={salvando}
            aria-label="Fechar modal"
          >
            <X size={20} />
          </button>
        </header>

        {/* CONTEÚDO */}
        <div className={styles.content}>
          {/* IMAGEM E IDENTIDADE */}
          <aside className={styles.imageArea}>
            <div className={styles.imagePreview}>
              {imagemPreview ? (
                <img src={imagemPreview} alt={`Imagem da equipe ${nome}`} />
              ) : (
                <div className={styles.imagePlaceholder}>
                  <div className={styles.cameraCircle}>
                    <ImagePlus size={23} />
                  </div>
                  <strong>Imagem da equipe</strong>
                  <span>JPG, PNG ou WEBP</span>
                </div>
              )}
            </div>

            <input
              ref={inputImagemRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className={styles.hiddenInput}
              onChange={handleImagem}
            />

            <button
              type="button"
              className={styles.changeImageButton}
              onClick={() => inputImagemRef.current?.click()}
              disabled={salvando}
            >
              <Camera size={15} />
              {imagemPreview ? 'Alterar imagem' : 'Adicionar imagem'}
            </button>

            {imagemPreview && (
              <button
                type="button"
                className={styles.removeImageButton}
                onClick={removerImagem}
                disabled={salvando}
              >
                Remover imagem
              </button>
            )}

            {erroImagem && <p className={styles.imageError}>{erroImagem}</p>}
          </aside>

          {/* FORMULÁRIO */}
          <div className={styles.form}>
            {/* INFORMAÇÕES */}
            <section className={styles.formSection}>
              <div className={styles.sectionHeading}>
                <span className={styles.sectionNumber}>01</span>
                <div>
                  <h3>Informações da equipe</h3>
                  <p>Edite o nome, o esporte e a categoria.</p>
                </div>
              </div>

              <div className={styles.field}>
                <label htmlFor="editar-equipe-nome">Nome da equipe <span>*</span></label>
                <input
                  id="editar-equipe-nome"
                  type="text"
                  value={nome}
                  onChange={(event) => setNome(event.target.value)}
                  placeholder="Ex.: Falcões FC"
                  maxLength={60}
                  disabled={salvando}
                />
                <small className={styles.fieldHint}>{nome.length}/60 caracteres</small>
              </div>

              <div className={styles.formGrid}>
                <div className={styles.field}>
                  <label htmlFor="editar-equipe-modalidade">Esporte <span>*</span></label>
                  <select
                    id="editar-equipe-modalidade"
                    value={modalidade}
                    onChange={(event) => setModalidade(event.target.value)}
                    disabled={salvando}
                  >
                    {!esportes.includes(modalidade) && modalidade && (
                      <option value={modalidade}>{modalidade}</option>
                    )}
                    {esportes.map((esporte) => (
                      <option key={esporte} value={esporte}>{esporte}</option>
                    ))}
                  </select>
                </div>

                <div className={styles.field}>
                  <label htmlFor="editar-equipe-categoria">Categoria <span>*</span></label>
                  <select
                    id="editar-equipe-categoria"
                    value={categoria}
                    onChange={(event) => setCategoria(event.target.value)}
                    disabled={salvando}
                  >
                    {!categorias.includes(categoria) && categoria && (
                      <option value={categoria}>{categoria}</option>
                    )}
                    {categorias.map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </div>
              </div>
            </section>

            {/* ATLETAS */}
            <section className={styles.formSection}>
              <div className={styles.sectionHeading}>
                <span className={styles.sectionNumber}>02</span>
                <div>
                  <h3>Atletas</h3>
                  <p>Gerencie quem faz parte desta equipe.</p>
                </div>
                <span className={styles.selectionCount}>
                  {atletasSelecionados.length} selecionados
                </span>
              </div>

              <div className={styles.athleteSearch}>
                <Search size={17} />
                <input
                  type="text"
                  placeholder="Buscar por nome ou e-mail..."
                  aria-label="Buscar atletas"
                  value={buscaAtleta}
                  onChange={(event) => setBuscaAtleta(event.target.value)}
                  disabled={salvando}
                />
                {buscaAtleta && (
                  <button
                    type="button"
                    onClick={() => setBuscaAtleta('')}
                    aria-label="Limpar busca"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>

              <div className={styles.athletesList}>
                {atletasFiltrados.length === 0 ? (
                  <div className={styles.emptyAthletes}>
                    <UserRound size={25} />
                    <strong>Nenhum atleta encontrado</strong>
                    <span>Tente outro nome ou e-mail.</span>
                  </div>
                ) : (
                  atletasFiltrados.map((atleta) => {
                    const selecionado = atletasSelecionados.includes(atleta.id);

                    return (
                      <button
                        key={atleta.id}
                        type="button"
                        className={`${styles.athleteItem} ${selecionado ? styles.athleteSelected : ''}`}
                        onClick={() => alternarAtleta(atleta.id)}
                        disabled={salvando}
                        aria-pressed={selecionado}
                      >
                        <span className={styles.athleteAvatar}>
                          {atleta.usuario?.avatarUrl ? (
                            <img src={atleta.usuario.avatarUrl} alt="" />
                          ) : (
                            <UserRound size={18} />
                          )}
                        </span>

                        <span className={styles.athleteInfo}>
                          <strong>{atleta.nome || 'Atleta sem nome'}</strong>
                          <small>
                            {atleta.categoria || atleta.usuario?.email || 'Atleta cadastrado'}
                          </small>
                        </span>

                        <span className={styles.athleteCheck}>
                          {selecionado && <Check size={15} />}
                        </span>
                      </button>
                    );
                  })
                )}
              </div>
            </section>

            {/* PRÓXIMA PARTIDA */}
            <section className={styles.formSection}>
              <div className={styles.sectionHeading}>
                <span className={styles.sectionNumber}>03</span>
                <div>
                  <h3>Próxima partida</h3>
                  <p>Atualize o próximo compromisso da equipe.</p>
                </div>
              </div>

              <div className={styles.field}>
                <label htmlFor="editar-equipe-adversario">Nome do adversário</label>
                <input
                  id="editar-equipe-adversario"
                  type="text"
                  value={adversario}
                  onChange={(event) => setAdversario(event.target.value)}
                  placeholder="Ex.: Tigres do Vale"
                  maxLength={60}
                  disabled={salvando}
                />
              </div>

              <div className={styles.dateTimeGrid}>
                <div className={styles.field}>
                  <label htmlFor="editar-equipe-data">Data</label>
                  <div className={styles.dateInputWrapper}>
                    <CalendarDays size={16} />
                    <input
                      id="editar-equipe-data"
                      type="date"
                      value={dataPartida}
                      onChange={(event) => setDataPartida(event.target.value)}
                      disabled={salvando}
                    />
                  </div>
                </div>

                <div className={styles.field}>
                  <label htmlFor="editar-equipe-horario">Horário</label>
                  <div className={styles.dateInputWrapper}>
                    <Clock3 size={16} />
                    <input
                      id="editar-equipe-horario"
                      type="time"
                      value={horarioPartida}
                      onChange={(event) => setHorarioPartida(event.target.value)}
                      disabled={salvando}
                    />
                  </div>
                </div>
              </div>

              {(adversario.trim() || dataPartida || horarioPartida) && (
                <div className={styles.matchPreview}>
                  <CalendarDays size={17} />
                  <div>
                    <span>Prévia da partida</span>
                    <strong>{proximaPartidaPreview}</strong>
                    {dataPartida && (
                      <small>
                        {new Date(`${dataPartida}T12:00:00`).toLocaleDateString('pt-BR')}
                        {horarioPartida ? ` • ${horarioPartida}` : ''}
                      </small>
                    )}
                  </div>
                </div>
              )}
            </section>

            {/* IDENTIDADE VISUAL */}
            <section className={styles.formSection}>
              <div className={styles.sectionHeading}>
                <span className={styles.sectionNumber}>04</span>
                <div>
                  <h3>Identidade visual</h3>
                  <p>Escolha a cor principal da equipe.</p>
                </div>
              </div>

              <div className={styles.colorsArea}>
                <div className={styles.colors}>
                  {cores.map((item) => {
                    const selecionada = cor === item;

                    return (
                      <button
                        key={item}
                        type="button"
                        className={`${styles.colorButton} ${selecionada ? styles.colorSelected : ''}`}
                        style={{ backgroundColor: item }}
                        onClick={() => setCor(item)}
                        title={item}
                        aria-label={`Selecionar cor ${item}`}
                        aria-pressed={selecionada}
                        disabled={salvando}
                      >
                        {selecionada && <Check size={16} />}
                      </button>
                    );
                  })}

                  <button
                    type="button"
                    className={`${styles.customColorButton} ${corEhPersonalizada ? styles.customColorSelected : ''}`}
                    onClick={() => inputCorRef.current?.click()}
                    aria-label="Escolher cor personalizada"
                    title="Cor personalizada"
                    disabled={salvando}
                  >
                    <span className={styles.rgbCircle} style={{ backgroundColor: corPersonalizada }}>
                      <Palette size={16} />
                    </span>
                  </button>

                  <input
                    ref={inputCorRef}
                    type="color"
                    value={corPersonalizada}
                    onChange={handleCorPersonalizada}
                    className={styles.hiddenColorInput}
                    aria-label="Selecionar cor personalizada"
                    disabled={salvando}
                  />
                </div>

                <div className={styles.selectedColorInfo}>
                  <div className={styles.selectedColorPreview} style={{ backgroundColor: cor }} />
                  <div>
                    <span>Cor selecionada</span>
                    <strong>{cor.toUpperCase()}</strong>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* PRÉVIA DA EQUIPE */}
        <div className={styles.teamPreview}>
          <div className={styles.previewAvatar} style={{ backgroundColor: cor }}>
            {nome.trim().slice(0, 2).toUpperCase() || <Shield size={22} />}
          </div>

          <div className={styles.previewInfo}>
            <span>PRÉVIA DA EQUIPE</span>
            <strong>{nome.trim() || 'Nome da equipe'}</strong>
            <small>
              {modalidade} · {categoria} · {atletasSelecionados.length}{' '}
              {atletasSelecionados.length === 1 ? 'atleta' : 'atletas'}
            </small>
          </div>

          {imagemPreview && (
            <img className={styles.previewImage} src={imagemPreview} alt="" />
          )}
        </div>

        {erroFormulario && (
          <p className={styles.formError} role="alert">{erroFormulario}</p>
        )}

        {/* RODAPÉ */}
        <footer className={styles.footer}>
          <div className={styles.footerLeft}>
            {!confirmandoExclusao ? (
              <button
                type="button"
                className={styles.deleteButton}
                onClick={() => setConfirmandoExclusao(true)}
                disabled={salvando}
              >
                <Trash2 size={16} />
                Excluir equipe
              </button>
            ) : (
              <div className={styles.deleteConfirmation}>
                <span>Confirmar exclusão?</span>
                <button
                  type="button"
                  className={styles.deleteButton}
                  onClick={handleExcluir}
                  disabled={salvando}
                >
                  {salvando ? <LoadingState variant="inline" title="Excluindo equipe..." /> : 'Sim, excluir'}
                </button>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => setConfirmandoExclusao(false)}
                  disabled={salvando}
                >
                  Não
                </button>
              </div>
            )}
          </div>

          <div className={styles.footerActions}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}
              disabled={salvando}
            >
              Cancelar
            </button>
            <button
              type="button"
              className={styles.saveButton}
              onClick={handleSalvar}
              disabled={salvando || !formularioValido}
            >
              <Save size={17} />
              {salvando ? <LoadingState variant="inline" title="Salvando equipe..." /> : 'Salvar alterações'}
            </button>
          </div>
        </footer>
      </section>
    </div>
  );
};

export default EditarEquipeModal;
