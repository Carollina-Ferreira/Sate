import {
  CalendarDays,
  Camera,
  Check,
  Clock3,
  ImagePlus,
  Palette,
  Plus,
  Search,
  Shield,
  UserRound,
  X,
} from 'lucide-react';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import type { ChangeEvent } from 'react';

import styles from './novaEquipeModal.module.css';
import LoadingState from '../ui/LoadingState/LoadingState';

export interface AtletaDisponivel {
  id: number;
  nome: string | null;
  categoria?: string | null;
  usuario?: {
    email?: string;
    avatarUrl?: string | null;
  };
}

export interface NovaEquipeData {
  nome: string;
  modalidade: string;
  categoria: string;
  atletasIds: number[];
  cor: string;
  proximaPartida: string | null;
  imagemPreview: string | null;
  imagemArquivo?: File | null;
}

interface NovaEquipeModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (equipe: NovaEquipeData) => void | Promise<void>;
  modalidadeInicial?: string;
  atletasDisponiveis?: AtletaDisponivel[];
}

const esportes = [
  'Futebol',
  'Basquete',
  'Vôlei',
  'Rugby',
  'Tênis',
];

const cores = [
  '#16A875',
  '#1674B8',
  '#D9822B',
  '#B6B51A',
  '#7C5CE5',
  '#D652A2',
];

const formatarProximaPartida = (
  adversario: string,
  data: string,
  horario: string,
) => {
  if (!adversario.trim()) {
    return 'Partida ainda não definida';
  }

  if (!data || !horario) {
    return `vs ${adversario.trim()}`;
  }

  const [ano, mes, dia] = data.split('-').map(Number);
  const dataPartida = new Date(ano, mes - 1, dia);

  const diasSemana = [
    'Dom',
    'Seg',
    'Ter',
    'Qua',
    'Qui',
    'Sex',
    'Sáb',
  ];

  const diaSemana = diasSemana[dataPartida.getDay()];
  const [hora, minuto] = horario.split(':');

  const horarioFormatado =
    minuto === '00'
      ? `${Number(hora)}h`
      : `${Number(hora)}h${minuto}`;

  return `vs ${adversario.trim()} (${diaSemana}, ${horarioFormatado})`;
};

const NovaEquipeModal = ({
  open,
  onClose,
  onCreate,
  modalidadeInicial = 'Futebol',
  atletasDisponiveis = [],
}: NovaEquipeModalProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const colorInputRef = useRef<HTMLInputElement>(null);

  const [nome, setNome] = useState('');
  const [criando, setCriando] = useState(false);

  const [modalidade, setModalidade] = useState(
    esportes.includes(modalidadeInicial)
      ? modalidadeInicial
      : 'Futebol',
  );

  const [categoria, setCategoria] = useState('Principal');
  const [atletasSelecionados, setAtletasSelecionados] =
    useState<number[]>([]);
  const [buscaAtleta, setBuscaAtleta] = useState('');

  const [cor, setCor] = useState('#16A875');
  const [corPersonalizada, setCorPersonalizada] =
    useState('#005942');

  const [adversario, setAdversario] = useState('');
  const [dataPartida, setDataPartida] = useState('');
  const [horarioPartida, setHorarioPartida] = useState('');

  const [imagemPreview, setImagemPreview] =
    useState<string | null>(null);
  const [imagemArquivo, setImagemArquivo] =
    useState<File | null>(null);

  const [erroImagem, setErroImagem] = useState('');

  const corEhPersonalizada = !cores.includes(cor);

  const atletasFiltrados = useMemo(() => {
    const termo = buscaAtleta.trim().toLowerCase();

    if (!termo) {
      return atletasDisponiveis;
    }

    return atletasDisponiveis.filter((atleta) => {
      const nomeAtleta = atleta.nome?.toLowerCase() ?? '';
      const emailAtleta =
        atleta.usuario?.email?.toLowerCase() ?? '';

      return (
        nomeAtleta.includes(termo) ||
        emailAtleta.includes(termo)
      );
    });
  }, [atletasDisponiveis, buscaAtleta]);

  const proximaPartidaPreview = useMemo(
    () =>
      formatarProximaPartida(
        adversario,
        dataPartida,
        horarioPartida,
      ),
    [adversario, dataPartida, horarioPartida],
  );

  const formularioValido =
    nome.trim().length >= 2 &&
    modalidade.trim() !== '' &&
    categoria.trim() !== '';

  const resetFormulario = useCallback(() => {
    setNome('');

    setModalidade(
      esportes.includes(modalidadeInicial)
        ? modalidadeInicial
        : 'Futebol',
    );

    setCategoria('Principal');
    setAtletasSelecionados([]);
    setBuscaAtleta('');
    setCor('#16A875');
    setCorPersonalizada('#005942');

    setAdversario('');
    setDataPartida('');
    setHorarioPartida('');

    setImagemPreview(null);
    setImagemArquivo(null);
    setErroImagem('');

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [modalidadeInicial]);

  const fecharModal = useCallback(() => {
    if (criando) return;
    resetFormulario();
    onClose();
  }, [criando, onClose, resetFormulario]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const overflowAnterior = document.body.style.overflow;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        fecharModal();
      }
    };

    document.addEventListener('keydown', handleEscape);

    // O overlay possui rolagem própria.
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener(
        'keydown',
        handleEscape,
      );

      document.body.style.overflow = overflowAnterior;
    };
  }, [open, fecharModal]);

  useEffect(() => {
    if (!imagemPreview?.startsWith('blob:')) {
      return;
    }

    return () => {
      URL.revokeObjectURL(imagemPreview);
    };
  }, [imagemPreview]);

  const handleImagem = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const arquivo = event.target.files?.[0];

    if (!arquivo) {
      return;
    }

    setErroImagem('');

    const tiposPermitidos = [
      'image/jpeg',
      'image/png',
      'image/webp',
    ];

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

    const url = URL.createObjectURL(arquivo);

    setImagemArquivo(arquivo);
    setImagemPreview(url);
  };

  const removerImagem = () => {
    setImagemPreview(null);
    setImagemArquivo(null);
    setErroImagem('');

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCorPersonalizada = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const novaCor = event.target.value;

    setCorPersonalizada(novaCor);
    setCor(novaCor);
  };

  const alternarAtleta = (atletaId: number) => {
    setAtletasSelecionados((atuais) =>
      atuais.includes(atletaId)
        ? atuais.filter((id) => id !== atletaId)
        : [...atuais, atletaId],
    );
  };

  const criarEquipe = async () => {
    if (!formularioValido || criando) return;

    const proximaPartida =
      dataPartida && horarioPartida
        ? `${dataPartida}T${horarioPartida}:00`
        : null;

    setCriando(true);
    try {
      await onCreate({
        nome: nome.trim(),
        modalidade,
        categoria,
        atletasIds: atletasSelecionados,
        cor,
        proximaPartida,
        imagemPreview,
        imagemArquivo,
      });
      resetFormulario();
      onClose();
    } catch (erro) {
      console.error('Erro ao criar equipe:', erro);
    } finally {
      setCriando(false);
    }
  };

  if (!open) {
    return null;
  }

  return (
    <div
      className={styles.overlay}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          fecharModal();
        }
      }}
    >
      <section
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="nova-equipe-titulo"
      >
        {/* CABEÇALHO */}

        <header className={styles.modalHeader}>
          <div>
            <span className={styles.eyebrow}>
              GESTÃO DE EQUIPES
            </span>

            <h2 id="nova-equipe-titulo">
              Criar equipe
            </h2>

            <p>
              Configure seu time e organize os atletas.
            </p>
          </div>

          <button
            type="button"
            className={styles.closeButton}
            onClick={fecharModal}
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
                <img
                  src={imagemPreview}
                  alt="Prévia da imagem da equipe"
                />
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
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className={styles.hiddenInput}
              onChange={handleImagem}
            />

            <button
              type="button"
              className={styles.changeImageButton}
              onClick={() => fileInputRef.current?.click()}
            >
              <Camera size={15} />

              {imagemPreview ? 'Alterar imagem' : 'Adicionar imagem'}
            </button>

            {imagemPreview && (
              <button
                type="button"
                className={styles.removeImageButton}
                onClick={removerImagem}
              >
                Remover imagem
              </button>
            )}

            {erroImagem && (
              <p className={styles.imageError}>
                {erroImagem}
              </p>
            )}

            <div className={styles.identityHint}>
              <Shield size={17} />

              <span>
                Personalize a identidade visual do seu time.
              </span>
            </div>
          </aside>

          {/* FORMULÁRIO */}

          <div className={styles.form}>
            <section className={styles.formSection}>
              <div className={styles.sectionHeading}>
                <span className={styles.sectionNumber}>01</span>

                <div>
                  <h3>Informações da equipe</h3>
                  <p>Defina o nome, o esporte e a categoria.</p>
                </div>
              </div>

              <div className={styles.field}>
                <label htmlFor="nome-equipe">
                  Nome da equipe <span>*</span>
                </label>

                <input
                  id="nome-equipe"
                  type="text"
                  placeholder="Ex.: Falcões FC"
                  value={nome}
                  maxLength={60}
                  onChange={(event) =>
                    setNome(event.target.value)
                  }
                  autoFocus
                />

                <small className={styles.fieldHint}>
                  {nome.length}/60 caracteres
                </small>
              </div>

              <div className={styles.formGrid}>
                <div className={styles.field}>
                  <label htmlFor="esporte-equipe">
                    Esporte <span>*</span>
                  </label>

                  <select
                    id="esporte-equipe"
                    value={modalidade}
                    onChange={(event) =>
                      setModalidade(event.target.value)
                    }
                  >
                    {esportes.map((esporte) => (
                      <option key={esporte} value={esporte}>
                        {esporte}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.field}>
                  <label htmlFor="categoria-equipe">
                    Categoria <span>*</span>
                  </label>

                  <select
                    id="categoria-equipe"
                    value={categoria}
                    onChange={(event) =>
                      setCategoria(event.target.value)
                    }
                  >
                    <option value="Principal">Principal</option>
                    <option value="Sub-20">Sub-20</option>
                    <option value="Sub-17">Sub-17</option>
                    <option value="Sub-15">Sub-15</option>
                    <option value="Feminino">Feminino</option>
                    <option value="Masculino">Masculino</option>
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
                  <p>Selecione quem fará parte da equipe.</p>
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
                  onChange={(event) =>
                    setBuscaAtleta(event.target.value)
                  }
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

                    <span>
                      Tente outro nome ou e-mail.
                    </span>
                  </div>
                ) : (
                  atletasFiltrados.map((atleta) => {
                    const selecionado =
                      atletasSelecionados.includes(atleta.id);

                    return (
                      <button
                        key={atleta.id}
                        type="button"
                        className={`${styles.athleteItem} ${
                          selecionado ? styles.athleteSelected : ''
                        }`}
                        onClick={() => alternarAtleta(atleta.id)}
                        aria-pressed={selecionado}
                      >
                        <span className={styles.athleteAvatar}>
                          {atleta.usuario?.avatarUrl ? (
                            <img
                              src={atleta.usuario.avatarUrl}
                              alt=""
                            />
                          ) : (
                            <UserRound size={18} />
                          )}
                        </span>

                        <span className={styles.athleteInfo}>
                          <strong>
                            {atleta.nome || 'Atleta sem nome'}
                          </strong>

                          <small>
                            {atleta.categoria ||
                              atleta.usuario?.email ||
                              'Atleta cadastrado'}
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
                  <p>Você pode preencher essas informações depois.</p>
                </div>
              </div>

              <div className={styles.field}>
                <label htmlFor="adversario">
                  Nome do adversário
                </label>

                <input
                  id="adversario"
                  type="text"
                  placeholder="Ex.: Tigres do Vale"
                  value={adversario}
                  maxLength={60}
                  onChange={(event) =>
                    setAdversario(event.target.value)
                  }
                />
              </div>

              <div className={styles.dateTimeGrid}>
                <div className={styles.field}>
                  <label htmlFor="data-partida">
                    Data
                  </label>

                  <div className={styles.dateInputWrapper}>
                    <CalendarDays size={16} />

                    <input
                      id="data-partida"
                      type="date"
                      value={dataPartida}
                      onChange={(event) =>
                        setDataPartida(event.target.value)
                      }
                    />
                  </div>
                </div>

                <div className={styles.field}>
                  <label htmlFor="hora-partida">
                    Horário
                  </label>

                  <div className={styles.dateInputWrapper}>
                    <Clock3 size={16} />

                    <input
                      id="hora-partida"
                      type="time"
                      value={horarioPartida}
                      onChange={(event) =>
                        setHorarioPartida(event.target.value)
                      }
                    />
                  </div>
                </div>
              </div>

              {(adversario.trim() || dataPartida || horarioPartida) && (
                <div className={styles.matchPreview}>
                  <CalendarDays size={17} />

                  <div>
                    <span>Prévia da partida</span>

                    <strong>
                      {proximaPartidaPreview}
                    </strong>

                    {dataPartida && (
                      <small>
                        {new Date(
                          `${dataPartida}T12:00:00`,
                        ).toLocaleDateString('pt-BR')}
                        {horarioPartida
                          ? ` • ${horarioPartida}`
                          : ''}
                      </small>
                    )}
                  </div>
                </div>
              )}
            </section>

            {/* COR DA EQUIPE */}

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
                        className={`${styles.colorButton} ${
                          selecionada ? styles.colorSelected : ''
                        }`}
                        style={{ backgroundColor: item }}
                        onClick={() => setCor(item)}
                        title={item}
                        aria-label={`Selecionar cor ${item}`}
                        aria-pressed={selecionada}
                      >
                        {selecionada && <Check size={16} />}
                      </button>
                    );
                  })}

                  <button
                    type="button"
                    className={`${styles.customColorButton} ${
                      corEhPersonalizada
                        ? styles.customColorSelected
                        : ''
                    }`}
                    onClick={() => colorInputRef.current?.click()}
                    aria-label="Escolher cor personalizada"
                    title="Cor personalizada"
                  >
                    <span
                      className={styles.rgbCircle}
                      style={{
                        backgroundColor: corPersonalizada,
                      }}
                    >
                      <Palette size={16} />
                    </span>
                  </button>

                  <input
                    ref={colorInputRef}
                    type="color"
                    value={corPersonalizada}
                    onChange={handleCorPersonalizada}
                    className={styles.hiddenColorInput}
                    aria-label="Selecionar cor personalizada"
                  />
                </div>

                <div className={styles.selectedColorInfo}>
                  <div
                    className={styles.selectedColorPreview}
                    style={{ backgroundColor: cor }}
                  />

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
          <div
            className={styles.previewAvatar}
            style={{ backgroundColor: cor }}
          >
            {nome.trim().slice(0, 2).toUpperCase() || (
              <Shield size={22} />
            )}
          </div>

          <div className={styles.previewInfo}>
            <span>PRÉVIA DA EQUIPE</span>

            <strong>
              {nome.trim() || 'Nome da equipe'}
            </strong>

            <small>
              {modalidade} · {categoria} ·{' '}
              {atletasSelecionados.length}{' '}
              {atletasSelecionados.length === 1
                ? 'atleta'
                : 'atletas'}
            </small>
          </div>

          {imagemPreview && (
            <img
              className={styles.previewImage}
              src={imagemPreview}
              alt=""
            />
          )}
        </div>

        {/* AÇÕES */}

        <footer className={styles.footer}>
          <span className={styles.requiredHint}>
            * Campos obrigatórios
          </span>

          <div className={styles.footerActions}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={fecharModal}
              disabled={criando}
            >
              Cancelar
            </button>

            <button
              type="button"
              className={styles.createButton}
              disabled={!formularioValido || criando}
              onClick={() => void criarEquipe()}
            >
              {!criando && <Plus size={17} />}
              {criando
                ? <LoadingState variant="inline" title="Criando equipe..." />
                : 'Criar equipe'}
            </button>
          </div>
        </footer>
      </section>
    </div>
  );
};

export default NovaEquipeModal;