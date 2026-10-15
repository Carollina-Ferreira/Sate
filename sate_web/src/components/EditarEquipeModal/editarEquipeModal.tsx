
import {
  CalendarDays,
  Camera,
  Check,
  Clock3,
  Palette,
  Save,
  Search,
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
} from 'react';

import styles from './editarEquipeModal.module.css';

/* =====================================
   TIPOS
===================================== */

export interface AtletaDisponivel {
  id: number;
  nome: string;
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
  onSave: (
    dados: EditarEquipeData
  ) => void | Promise<void>;
  onDelete: () => void | Promise<void>;
}

/* =====================================
   CORES
===================================== */

const cores = [
  '#16A875',
  '#1674B8',
  '#D9822B',
  '#B6B51A',
  '#7C5CE5',
  '#D652A2',
];

/* =====================================
   DIAS DA SEMANA
===================================== */

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
   FORMATAR PRÓXIMA PARTIDA
===================================== */

const formatarProximaPartida = (
  adversario: string,
  data: string,
  horario: string
): string => {
  if (!adversario.trim()) {
    return 'Partida ainda não definida';
  }

  if (!data || !horario) {
    return `vs ${adversario.trim()}`;
  }

  const [ano, mes, dia] = data
    .split('-')
    .map(Number);

  const dataPartida = new Date(
    ano,
    mes - 1,
    dia
  );

  const diaSemana =
    diasSemana[dataPartida.getDay()];

  const [hora, minuto] = horario.split(':');

  const horarioFormatado =
    minuto === '00'
      ? `${Number(hora)}h`
      : `${Number(hora)}h${minuto}`;

  return `vs ${adversario.trim()} (${diaSemana}, ${horarioFormatado})`;
};

/* =====================================
   DATA PARA INPUT

   Evita conversões UTC que podem
   alterar o dia exibido no formulário.
===================================== */

const formatarDataInput = (
  data?: string | null
): string => {
  if (!data) {
    return '';
  }

  const correspondencia = data.match(
    /^(\d{4})-(\d{2})-(\d{2})/
  );

  if (correspondencia) {
    return `${correspondencia[1]}-${correspondencia[2]}-${correspondencia[3]}`;
  }

  const valor = new Date(data);

  if (Number.isNaN(valor.getTime())) {
    return '';
  }

  const ano = valor.getFullYear();
  const mes = String(
    valor.getMonth() + 1
  ).padStart(2, '0');
  const dia = String(
    valor.getDate()
  ).padStart(2, '0');

  return `${ano}-${mes}-${dia}`;
};

/* =====================================
   HORÁRIO PARA INPUT

   Lê diretamente o horário quando
   a API fornece uma data ISO.
===================================== */

const formatarHorarioInput = (
  data?: string | null
): string => {
  if (!data) {
    return '';
  }

  const correspondencia = data.match(
    /T(\d{2}):(\d{2})/
  );

  if (correspondencia) {
    return `${correspondencia[1]}:${correspondencia[2]}`;
  }

  const valor = new Date(data);

  if (Number.isNaN(valor.getTime())) {
    return '';
  }

  const hora = String(
    valor.getHours()
  ).padStart(2, '0');

  const minuto = String(
    valor.getMinutes()
  ).padStart(2, '0');

  return `${hora}:${minuto}`;
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
  /* =====================================
     ESTADOS
  ===================================== */

  const [nome, setNome] = useState('');
  const [categoria, setCategoria] = useState('');
  const [modalidade, setModalidade] = useState('');

  const [
    atletasSelecionados,
    setAtletasSelecionados,
  ] = useState<number[]>([]);

  const [buscaAtleta, setBuscaAtleta] =
    useState('');

  const [cor, setCor] = useState('#16A875');

  const [
    corPersonalizada,
    setCorPersonalizada,
  ] = useState('');

  const [adversario, setAdversario] =
    useState('');

  const [dataPartida, setDataPartida] =
    useState('');

  const [horarioPartida, setHorarioPartida] =
    useState('');

  const [imagemPreview, setImagemPreview] =
    useState('');

  const [
    confirmandoExclusao,
    setConfirmandoExclusao,
  ] = useState(false);

  const [erroImagem, setErroImagem] =
    useState('');

  const inputImagemRef =
    useRef<HTMLInputElement>(null);

  const inputCorRef =
    useRef<HTMLInputElement>(null);

  /* =====================================
     CARREGAR DADOS DA EQUIPE
  ===================================== */

  useEffect(() => {
    if (!open || !equipe) {
      return;
    }

    setNome(equipe.nome || '');
    setCategoria(equipe.categoria || '');
    setModalidade(equipe.modalidade || '');

    let ids: number[] = [];

    if (Array.isArray(equipe.atletasIds)) {
      ids = equipe.atletasIds
        .map(Number)
        .filter(
          (id) =>
            Number.isInteger(id) && id > 0
        );
    } else if (
      Array.isArray(equipe.atletasDetalhes)
    ) {
      ids = equipe.atletasDetalhes
        .map((atleta) => Number(atleta.id))
        .filter(
          (id) =>
            Number.isInteger(id) && id > 0
        );
    }

    setAtletasSelecionados([
      ...new Set(ids),
    ]);

    const corInicial =
      equipe.cor || '#16A875';

    setCor(corInicial);

    setCorPersonalizada(
      cores.includes(corInicial)
        ? ''
        : corInicial
    );

    setImagemPreview(equipe.imagem || '');
    setErroImagem('');

    const partidaOriginal =
      equipe.proximaPartidaRaw || null;

    setDataPartida(
      formatarDataInput(partidaOriginal)
    );

    setHorarioPartida(
      formatarHorarioInput(partidaOriginal)
    );

    if (
      equipe.proximaPartida &&
      equipe.proximaPartida !==
        'Partida ainda não definida'
    ) {
      const partida = equipe.proximaPartida
        .replace(/^vs\s*/i, '')
        .split(' (')[0];

      setAdversario(partida);
    } else {
      setAdversario('');
    }

    setBuscaAtleta('');
    setConfirmandoExclusao(false);
  }, [open, equipe]);

  /* =====================================
     TODOS OS ATLETAS

     Combina os atletas já associados à
     equipe com os disponíveis para seleção.
  ===================================== */

  const todosAtletas = useMemo(() => {
    const mapa = new Map<
      number,
      AtletaDisponivel
    >();

    if (Array.isArray(equipe?.atletasDetalhes)) {
      equipe.atletasDetalhes.forEach(
        (atleta) => {
          if (
            atleta &&
            Number.isInteger(Number(atleta.id)) &&
            Number(atleta.id) > 0
          ) {
            mapa.set(Number(atleta.id), atleta);
          }
        }
      );
    }

    atletasDisponiveis.forEach((atleta) => {
      if (
        atleta &&
        Number.isInteger(Number(atleta.id)) &&
        Number(atleta.id) > 0
      ) {
        mapa.set(Number(atleta.id), atleta);
      }
    });

    return Array.from(mapa.values());
  }, [
    equipe?.atletasDetalhes,
    atletasDisponiveis,
  ]);

  /* =====================================
     FILTRAR ATLETAS
  ===================================== */

  const atletasFiltrados = useMemo(() => {
    const termo = buscaAtleta
      .trim()
      .toLowerCase();

    if (!termo) {
      return todosAtletas;
    }

    return todosAtletas.filter((atleta) => {
      const nomeAtleta =
        atleta.nome?.toLowerCase() || '';

      const categoriaAtleta =
        atleta.categoria?.toLowerCase() || '';

      const email =
        atleta.usuario?.email?.toLowerCase() ||
        '';

      return (
        nomeAtleta.includes(termo) ||
        categoriaAtleta.includes(termo) ||
        email.includes(termo)
      );
    });
  }, [todosAtletas, buscaAtleta]);

  /* =====================================
     ALTERNAR SELEÇÃO DE ATLETA
  ===================================== */

  const alternarAtleta = (atletaId: number) => {
    setAtletasSelecionados((anteriores) => {
      if (anteriores.includes(atletaId)) {
        return anteriores.filter(
          (id) => id !== atletaId
        );
      }

      return [...anteriores, atletaId];
    });
  };

  /* =====================================
     SELECIONAR IMAGEM

     Limita a imagem a 5 MB e aceita
     somente PNG ou JPG/JPEG.
  ===================================== */

  const handleImagemChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const arquivo = event.target.files?.[0];

    if (!arquivo) {
      return;
    }

    const tiposPermitidos = [
      'image/png',
      'image/jpeg',
    ];

    if (!tiposPermitidos.includes(arquivo.type)) {
      setErroImagem(
        'Selecione uma imagem PNG ou JPG.'
      );
      event.target.value = '';
      return;
    }

    if (arquivo.size > 5 * 1024 * 1024) {
      setErroImagem(
        'A imagem deve ter no máximo 5 MB.'
      );
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

    leitor.onerror = () => {
      setErroImagem(
        'Não foi possível carregar a imagem.'
      );
    };

    leitor.readAsDataURL(arquivo);
  };

  /* =====================================
     COR PERSONALIZADA
  ===================================== */

  const handleCorPersonalizada = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const novaCor = event.target.value;

    setCorPersonalizada(novaCor);
    setCor(novaCor);
  };

  /* =====================================
     SALVAR EQUIPE
  ===================================== */

  const handleSalvar = async () => {
    if (!equipe || salvando) {
      return;
    }

    if (!nome.trim()) {
      return;
    }

    let proximaPartida = '';

    if (dataPartida && horarioPartida) {
      proximaPartida =
        `${dataPartida}T${horarioPartida}:00`;
    }

    const idsAtletas = Array.from(
      new Set(
        atletasSelecionados
          .map(Number)
          .filter(
            (id) =>
              Number.isInteger(id) && id > 0
          )
      )
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

    console.log('Salvando equipe:', {
      id: dados.id,
      nome: dados.nome,
      modalidade: dados.modalidade,
      categoria: dados.categoria,
      atletasIds: dados.atletasIds,
      temImagem: Boolean(dados.imagem),
      proximaPartida: dados.proximaPartida,
    });

    try {
      await onSave(dados);
    } catch (erro) {
      console.error(
        'Erro ao salvar equipe:',
        erro
      );
    }
  };

  /* =====================================
     EXCLUIR EQUIPE
  ===================================== */

  const handleExcluir = async () => {
    if (salvando) {
      return;
    }

    try {
      await onDelete();
      setConfirmandoExclusao(false);
    } catch (erro) {
      console.error(
        'Erro ao excluir equipe:',
        erro
      );
    }
  };

  /* =====================================
     FECHAR AO CLICAR NO FUNDO
  ===================================== */

  const handleOverlayMouseDown = (
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    if (
      event.target === event.currentTarget &&
      !salvando
    ) {
      onClose();
    }
  };

  /* =====================================
     NÃO RENDERIZAR
  ===================================== */

  if (!open || !equipe) {
    return null;
  }

  /* =====================================
     PRÉVIA DA PARTIDA
  ===================================== */

  const previewPartida = formatarProximaPartida(
    adversario,
    dataPartida,
    horarioPartida
  );

  /* =====================================
     RENDERIZAÇÃO
  ===================================== */

  return (
    <div
      className={styles.overlay}
      onMouseDown={handleOverlayMouseDown}
    >
      <div
        className={styles.modal}
        onMouseDown={(event) =>
          event.stopPropagation()
        }
        role="dialog"
        aria-modal="true"
        aria-labelledby="editar-equipe-titulo"
      >
        {/* HEADER */}

        <div className={styles.header}>
          <div>
            <span className={styles.eyebrow}>
              EDITAR EQUIPE
            </span>

            <h2 id="editar-equipe-titulo">
              Editar equipe
            </h2>

            <p>
              Atualize as informações, atletas e
              configurações da sua equipe.
            </p>
          </div>

          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            disabled={salvando}
            aria-label="Fechar"
          >
            <X size={20} />
          </button>
        </div>

        {/* CONTEÚDO */}

        <div className={styles.content}>
          {/* IMAGEM */}

          <div className={styles.imageColumn}>
            <div className={styles.imagePreview}>
              {imagemPreview ? (
                <img
                  src={imagemPreview}
                  alt={`Imagem da equipe ${nome}`}
                  onError={() => {
                    console.error(
                      'Erro ao carregar imagem da equipe.'
                    );
                  }}
                />
              ) : (
                <div className={styles.imageEmpty}>
                  <div className={styles.cameraCircle}>
                    <Camera size={24} />
                  </div>

                  <strong>
                    Adicionar imagem
                  </strong>

                  <span>PNG ou JPG</span>
                </div>
              )}

              <input
                ref={inputImagemRef}
                type="file"
                accept="image/png,image/jpeg"
                className={styles.hiddenInput}
                onChange={handleImagemChange}
              />
            </div>

            <button
              type="button"
              className={styles.changeImage}
              onClick={() =>
                inputImagemRef.current?.click()
              }
              disabled={salvando}
            >
              <Camera size={16} />

              {imagemPreview
                ? 'Alterar imagem'
                : 'Adicionar imagem'}
            </button>

            {erroImagem && (
              <span
                role="alert"
                style={{
                  display: 'block',
                  marginTop: '8px',
                  color: '#D52941',
                  fontSize: '12px',
                }}
              >
                {erroImagem}
              </span>
            )}
          </div>

          {/* FORMULÁRIO */}

          <div className={styles.form}>
            {/* NOME */}

            <div className={styles.field}>
              <label htmlFor="editar-equipe-nome">
                Nome da equipe
              </label>

              <input
                id="editar-equipe-nome"
                type="text"
                value={nome}
                onChange={(event) =>
                  setNome(event.target.value)
                }
                placeholder="Ex.: Falcões FC"
                maxLength={100}
                disabled={salvando}
              />
            </div>

            {/* CATEGORIA E QUANTIDADE */}

            <div className={styles.twoColumns}>
              <div className={styles.field}>
                <label htmlFor="editar-equipe-categoria">
                  Categoria
                </label>

                <input
                  id="editar-equipe-categoria"
                  type="text"
                  value={categoria}
                  onChange={(event) =>
                    setCategoria(event.target.value)
                  }
                  placeholder="Ex.: Sub-18"
                  maxLength={50}
                  disabled={salvando}
                />
              </div>

              <div className={styles.field}>
                <label>Atletas selecionados</label>

                <div
                  style={{
                    height: '44px',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 14px',
                    borderRadius: '12px',
                    border: '1px solid #DDE7E2',
                    background: '#F8FBF9',
                    fontSize: '14px',
                    fontWeight: 700,
                    color: '#12261F',
                  }}
                >
                  {atletasSelecionados.length}{' '}
                  {atletasSelecionados.length === 1
                    ? 'atleta'
                    : 'atletas'}
                </div>
              </div>
            </div>

            {/* SELEÇÃO DE ATLETAS */}

            <div className={styles.field}>
              <label htmlFor="editar-equipe-busca-atleta">
                Atletas da equipe
              </label>

              <div className={styles.searchAthlete}>
                <Search size={17} />

                <input
                  id="editar-equipe-busca-atleta"
                  type="text"
                  value={buscaAtleta}
                  onChange={(event) =>
                    setBuscaAtleta(event.target.value)
                  }
                  placeholder="Buscar atleta..."
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
                    <UserRound size={20} />

                    <span>
                      Nenhum atleta encontrado.
                    </span>
                  </div>
                ) : (
                  atletasFiltrados.map((atleta) => {
                    const selecionado =
                      atletasSelecionados.includes(
                        atleta.id
                      );

                    return (
                      <button
                        key={atleta.id}
                        type="button"
                        className={[
                          styles.athleteItem,
                          selecionado
                            ? styles.athleteSelected
                            : '',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                        onClick={() =>
                          alternarAtleta(atleta.id)
                        }
                        disabled={salvando}
                        aria-pressed={selecionado}
                      >
                        <div className={styles.athleteAvatar}>
                          {atleta.usuario?.avatarUrl ? (
                            <img
                              src={atleta.usuario.avatarUrl}
                              alt=""
                              onError={(event) => {
                                event.currentTarget.style.display =
                                  'none';
                              }}
                            />
                          ) : (
                            <UserRound size={18} />
                          )}
                        </div>

                        <div className={styles.athleteInfo}>
                          <strong>{atleta.nome}</strong>

                          <span>
                            {atleta.categoria ||
                              'Sem categoria'}
                          </span>
                        </div>

                        <div className={styles.athleteCheck}>
                          {selecionado && (
                            <Check size={16} />
                          )}
                        </div>
                      </button>
                    );
                  })
                )}
              </div>

              <span
                style={{
                  display: 'block',
                  marginTop: '7px',
                  fontSize: '12px',
                  color: '#71817A',
                }}
              >
                {atletasSelecionados.length}{' '}
                {atletasSelecionados.length === 1
                  ? 'atleta selecionado'
                  : 'atletas selecionados'}
              </span>
            </div>

            {/* PRÓXIMA PARTIDA */}

            <div className={styles.matchSection}>
              <div className={styles.matchSectionHeader}>
                <div className={styles.matchSectionIcon}>
                  <CalendarDays size={18} />
                </div>

                <div>
                  <strong>Próxima partida</strong>

                  <span>
                    Configure o próximo compromisso
                    da equipe.
                  </span>
                </div>
              </div>

              <div className={styles.field}>
                <label htmlFor="editar-equipe-adversario">
                  Adversário
                </label>

                <input
                  id="editar-equipe-adversario"
                  type="text"
                  value={adversario}
                  onChange={(event) =>
                    setAdversario(event.target.value)
                  }
                  placeholder="Ex.: Tigres FC"
                  maxLength={100}
                  disabled={salvando}
                />
              </div>

              <div className={styles.dateTimeGrid}>
                <div className={styles.dateInputWrapper}>
                  <CalendarDays size={16} />

                  <input
                    aria-label="Data da partida"
                    type="date"
                    value={dataPartida}
                    onChange={(event) =>
                      setDataPartida(event.target.value)
                    }
                    disabled={salvando}
                  />
                </div>

                <div className={styles.dateInputWrapper}>
                  <Clock3 size={16} />

                  <input
                    aria-label="Horário da partida"
                    type="time"
                    value={horarioPartida}
                    onChange={(event) =>
                      setHorarioPartida(event.target.value)
                    }
                    disabled={salvando}
                  />
                </div>
              </div>

              <div className={styles.matchPreview}>
                <CalendarDays size={17} />

                <span>{previewPartida}</span>
              </div>
            </div>

            {/* COR DA EQUIPE */}

            <div className={styles.field}>
              <label>Cor da equipe</label>

              <div className={styles.colorsRow}>
                <div className={styles.colorOptions}>
                  {cores.map((corOpcao) => {
                    const selecionada =
                      cor === corOpcao;

                    return (
                      <button
                        key={corOpcao}
                        type="button"
                        className={[
                          styles.colorButton,
                          selecionada
                            ? styles.colorSelected
                            : '',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                        style={{
                          backgroundColor: corOpcao,
                        }}
                        onClick={() => {
                          setCor(corOpcao);
                          setCorPersonalizada('');
                        }}
                        disabled={salvando}
                        aria-label={`Selecionar cor ${corOpcao}`}
                        aria-pressed={selecionada}
                      >
                        {selecionada && (
                          <Check
                            size={15}
                            color="#FFFFFF"
                          />
                        )}
                      </button>
                    );
                  })}

                  <button
                    type="button"
                    className={[
                      styles.colorButton,
                      !cores.includes(cor)
                        ? styles.colorSelected
                        : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    onClick={() =>
                      inputCorRef.current?.click()
                    }
                    disabled={salvando}
                    aria-label="Escolher cor personalizada"
                  >
                    <Palette size={17} />
                  </button>

                  <input
                    ref={inputCorRef}
                    type="color"
                    value={corPersonalizada || cor}
                    onChange={handleCorPersonalizada}
                    disabled={salvando}
                    aria-label="Seletor de cor personalizada"
                    style={{
                      position: 'absolute',
                      width: '1px',
                      height: '1px',
                      opacity: 0,
                      pointerEvents: 'none',
                    }}
                  />
                </div>

                <div className={styles.selectedColorBox}>
                  <span
                    className={styles.selectedColorPreview}
                    style={{
                      backgroundColor: cor,
                    }}
                  />

                  <span>{cor.toUpperCase()}</span>
                </div>
              </div>
            </div>

            {/* PRÉVIA DA EQUIPE */}

            <div className={styles.preview}>
              <div
                className={styles.previewColor}
                style={{
                  backgroundColor: cor,
                }}
              />

              <div>
                <span>PRÉVIA DA EQUIPE</span>

                <strong>
                  {nome || 'Nome da equipe'}
                </strong>

                <small>
                  {modalidade || 'Modalidade'}
                  {' • '}
                  {categoria || 'Categoria'}
                </small>
              </div>
            </div>
          </div>
        </div>

        {/* RODAPÉ */}

        <div className={styles.footer}>
          <div>
            {!confirmandoExclusao ? (
              <button
                type="button"
                className={styles.deleteButton}
                onClick={() =>
                  setConfirmandoExclusao(true)
                }
                disabled={salvando}
              >
                <Trash2 size={17} />
                Excluir equipe
              </button>
            ) : (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '8px',
                }}
              >
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#D52941',
                  }}
                >
                  Confirmar exclusão?
                </span>

                <button
                  type="button"
                  className={styles.deleteButton}
                  onClick={handleExcluir}
                  disabled={salvando}
                >
                  {salvando ? 'Aguarde...' : 'Sim, excluir'}
                </button>

                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={() =>
                    setConfirmandoExclusao(false)
                  }
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
              disabled={salvando || !nome.trim()}
            >
              <Save size={17} />

              {salvando
                ? 'Salvando...'
                : 'Salvar alterações'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditarEquipeModal;

