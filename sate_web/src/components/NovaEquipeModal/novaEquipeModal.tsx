import {
  CalendarDays,
  Camera,
  Check,
  Clock3,
  Plus,
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

import styles from './novaEquipeModal.module.css';

export interface NovaEquipeData {
  nome: string;
  modalidade: string;
  categoria: string;
  atletas: number;
  cor: string;
  proximaPartida: string;
  imagemPreview: string | null;
}

interface NovaEquipeModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (
    equipe: NovaEquipeData,
  ) => void;
}

const modalidades = [
  {
    nome: 'Futebol',
    icone: '⚽',
  },
  {
    nome: 'Basquete',
    icone: '🏀',
  },
  {
    nome: 'Vôlei',
    icone: '🏐',
  },
  {
    nome: 'Rugby',
    icone: '🏉',
  },
  {
    nome: 'Tênis',
    icone: '🎾',
  },
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

  const [ano, mes, dia] =
    data.split('-').map(Number);

  /*
    new Date(ano, mes - 1, dia) evita
    problemas de fuso com "YYYY-MM-DD".
  */
  const dataPartida = new Date(
    ano,
    mes - 1,
    dia,
  );

  const diaSemana =
    diasSemana[
      dataPartida.getDay()
    ];

  const [hora, minuto] =
    horario.split(':');

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
}: NovaEquipeModalProps) => {
  const fileInputRef =
    useRef<HTMLInputElement>(
      null,
    );

  const [nome, setNome] =
    useState('');

  const [
    modalidade,
    setModalidade,
  ] = useState('Futebol');

  const [
    categoria,
    setCategoria,
  ] = useState('Principal');

  const [
    atletas,
    setAtletas,
  ] = useState('0');

  const [cor, setCor] =
    useState('#16A875');

  const [
    adversario,
    setAdversario,
  ] = useState('');

  const [
    dataPartida,
    setDataPartida,
  ] = useState('');

  const [
    horarioPartida,
    setHorarioPartida,
  ] = useState('');

  const [
    imagemPreview,
    setImagemPreview,
  ] = useState<
    string | null
  >(null);

  const proximaPartida =
    useMemo(() => {
      return formatarProximaPartida(
        adversario,
        dataPartida,
        horarioPartida,
      );
    }, [
      adversario,
      dataPartida,
      horarioPartida,
    ]);

  const formularioValido =
    useMemo(() => {
      return (
        nome.trim().length >=
          2 &&
        modalidade !== '' &&
        categoria.trim() !==
          '' &&
        Number(atletas) >= 0
      );
    }, [
      nome,
      modalidade,
      categoria,
      atletas,
    ]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleEscape = (
      event: KeyboardEvent,
    ) => {
      if (
        event.key ===
        'Escape'
      ) {
        onClose();
      }
    };

    document.addEventListener(
      'keydown',
      handleEscape,
    );

    document.body.style.overflow =
      'hidden';

    return () => {
      document.removeEventListener(
        'keydown',
        handleEscape,
      );

      document.body.style.overflow =
        '';
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  const handleImagem = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file =
      event.target
        .files?.[0];

    if (!file) {
      return;
    }

    const url =
      URL.createObjectURL(
        file,
      );

    setImagemPreview(url);
  };

  const resetFormulario =
    () => {
      setNome('');
      setModalidade(
        'Futebol',
      );
      setCategoria(
        'Principal',
      );
      setAtletas('0');
      setCor('#16A875');

      setAdversario('');
      setDataPartida('');
      setHorarioPartida('');

      setImagemPreview(null);
    };

  const fecharModal = () => {
    resetFormulario();
    onClose();
  };

  const criarEquipe = () => {
    if (!formularioValido) {
      return;
    }

    onCreate({
      nome: nome.trim(),
      modalidade,
      categoria:
        categoria.trim(),

      atletas:
        Number(atletas),

      cor,

      proximaPartida,

      imagemPreview,
    });

    resetFormulario();

    onClose();
  };

  return (
    <div
      className={
        styles.overlay
      }
      onMouseDown={
        fecharModal
      }
    >
      <div
        className={
          styles.modal
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
            <span
              className={
                styles.eyebrow
              }
            >
              NOVA EQUIPE
            </span>

            <h2>
              Criar equipe
            </h2>

            <p>
              Cadastre as
              principais
              informações do
              novo time.
            </p>
          </div>

          <button
            type="button"
            className={
              styles.closeButton
            }
            onClick={
              fecharModal
            }
            aria-label="Fechar"
          >
            <X size={20} />
          </button>
        </div>

        {/* CONTEÚDO */}

        <div
          className={
            styles.content
          }
        >
          {/* IMAGEM */}

          <div
            className={
              styles.imageArea
            }
          >
            <button
              type="button"
              className={
                styles.imagePreview
              }
              onClick={() =>
                fileInputRef
                  .current
                  ?.click()
              }
            >
              {imagemPreview ? (
                <img
                  src={
                    imagemPreview
                  }
                  alt="Preview da equipe"
                />
              ) : (
                <>
                  <div
                    className={
                      styles.cameraCircle
                    }
                  >
                    <Camera
                      size={22}
                    />
                  </div>

                  <strong>
                    Adicionar
                    imagem
                  </strong>

                  <span>
                    PNG ou JPG
                  </span>
                </>
              )}
            </button>

            <input
              ref={
                fileInputRef
              }
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className={
                styles.hiddenInput
              }
              onChange={
                handleImagem
              }
            />

            {imagemPreview && (
              <button
                type="button"
                className={
                  styles.changeImageButton
                }
                onClick={() =>
                  fileInputRef
                    .current
                    ?.click()
                }
              >
                <Camera
                  size={15}
                />

                Alterar imagem
              </button>
            )}
          </div>

          {/* FORMULÁRIO */}

          <div
            className={
              styles.form
            }
          >
            <div
              className={
                styles.field
              }
            >
              <label
                htmlFor="nome-equipe"
              >
                Nome da equipe
              </label>

              <input
                id="nome-equipe"
                type="text"
                placeholder="Ex: Águias Basquete"
                value={nome}
                onChange={(
                  event,
                ) =>
                  setNome(
                    event
                      .target
                      .value,
                  )
                }
                autoFocus
              />
            </div>

            {/* MODALIDADE */}

            <div
              className={
                styles.field
              }
            >
              <label>
                Modalidade
              </label>

              <div
                className={
                  styles.sports
                }
              >
                {modalidades.map(
                  (item) => (
                    <button
                      key={
                        item.nome
                      }
                      type="button"
                      className={`${styles.sportButton} ${
                        modalidade ===
                        item.nome
                          ? styles.sportButtonActive
                          : ''
                      }`}
                      onClick={() =>
                        setModalidade(
                          item.nome,
                        )
                      }
                    >
                      <span>
                        {
                          item.icone
                        }
                      </span>

                      {
                        item.nome
                      }
                    </button>
                  ),
                )}
              </div>
            </div>

            <div
              className={
                styles.twoColumns
              }
            >
              <div
                className={
                  styles.field
                }
              >
                <label
                  htmlFor="categoria"
                >
                  Categoria
                </label>

                <select
                  id="categoria"
                  value={
                    categoria
                  }
                  onChange={(
                    event,
                  ) =>
                    setCategoria(
                      event
                        .target
                        .value,
                    )
                  }
                >
                  <option value="Principal">
                    Principal
                  </option>

                  <option value="Sub-20">
                    Sub-20
                  </option>

                  <option value="Sub-17">
                    Sub-17
                  </option>

                  <option value="Sub-15">
                    Sub-15
                  </option>

                  <option value="Feminino">
                    Feminino
                  </option>

                  <option value="Masculino">
                    Masculino
                  </option>
                </select>
              </div>

              <div
                className={
                  styles.field
                }
              >
                <label
                  htmlFor="atletas"
                >
                  Nº de atletas
                </label>

                <input
                  id="atletas"
                  type="number"
                  min="0"
                  max="100"
                  value={
                    atletas
                  }
                  onChange={(
                    event,
                  ) =>
                    setAtletas(
                      event
                        .target
                        .value,
                    )
                  }
                />
              </div>
            </div>

            {/* =====================================
                PRÓXIMA PARTIDA
            ===================================== */}

            <div
              className={
                styles.matchSection
              }
            >
              <div
                className={
                  styles.matchSectionHeader
                }
              >
                <div
                  className={
                    styles.matchSectionIcon
                  }
                >
                  <CalendarDays
                    size={17}
                  />
                </div>

                <div>
                  <strong>
                    Próxima
                    partida
                  </strong>

                  <span>
                    Informe o
                    adversário,
                    dia e horário.
                  </span>
                </div>
              </div>

              <div
                className={
                  styles.field
                }
              >
                <label
                  htmlFor="adversario"
                >
                  Adversário
                </label>

                <input
                  id="adversario"
                  type="text"
                  placeholder="Ex: Tigres do Vale"
                  value={
                    adversario
                  }
                  onChange={(
                    event,
                  ) =>
                    setAdversario(
                      event
                        .target
                        .value,
                    )
                  }
                />
              </div>

              <div
                className={
                  styles.dateTimeGrid
                }
              >
                {/* DATA */}

                <div
                  className={
                    styles.field
                  }
                >
                  <label
                    htmlFor="data-partida"
                  >
                    Data
                  </label>

                  <div
                    className={
                      styles.dateInputWrapper
                    }
                  >
                    <CalendarDays
                      size={16}
                    />

                    <input
                      id="data-partida"
                      type="date"
                      value={
                        dataPartida
                      }
                      onChange={(
                        event,
                      ) =>
                        setDataPartida(
                          event
                            .target
                            .value,
                        )
                      }
                    />
                  </div>
                </div>

                {/* HORA */}

                <div
                  className={
                    styles.field
                  }
                >
                  <label
                    htmlFor="hora-partida"
                  >
                    Horário
                  </label>

                  <div
                    className={
                      styles.dateInputWrapper
                    }
                  >
                    <Clock3
                      size={16}
                    />

                    <input
                      id="hora-partida"
                      type="time"
                      value={
                        horarioPartida
                      }
                      onChange={(
                        event,
                      ) =>
                        setHorarioPartida(
                          event
                            .target
                            .value,
                        )
                      }
                    />
                  </div>
                </div>
              </div>

              {/* PREVIEW DA PARTIDA */}

              {adversario.trim() && (
                <div
                  className={
                    styles.matchPreview
                  }
                >
                  <CalendarDays
                    size={15}
                  />

                  <div>
                    <span>
                      Como aparecerá
                      no card
                    </span>

                    <strong>
                      {
                        proximaPartida
                      }
                    </strong>
                  </div>
                </div>
              )}
            </div>

            {/* COR */}

            <div
              className={
                styles.field
              }
            >
              <label>
                Cor da equipe
              </label>

              <div
                className={
                  styles.colors
                }
              >
                {cores.map(
                  (item) => (
                    <button
                      key={item}
                      type="button"
                      className={`${styles.colorButton} ${
                        cor ===
                        item
                          ? styles.colorSelected
                          : ''
                      }`}
                      style={{
                        background:
                          item,
                      }}
                      onClick={() =>
                        setCor(
                          item,
                        )
                      }
                    >
                      {cor ===
                        item && (
                        <Check
                          size={16}
                        />
                      )}
                    </button>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>

        {/* PREVIEW EQUIPE */}

        <div
          className={
            styles.teamPreview
          }
        >
          <div
            className={
              styles.previewAvatar
            }
            style={{
              background: cor,
            }}
          >
            {nome
              .trim()
              .slice(0, 2)
              .toUpperCase() ||
              'EQ'}
          </div>

          <div>
            <span>
              PREVIEW
            </span>

            <strong>
              {nome.trim() ||
                'Nome da equipe'}
            </strong>

            <small>
              {modalidade}
              {' • '}
              {categoria}
            </small>
          </div>
        </div>

        {/* FOOTER */}

        <div
          className={
            styles.footer
          }
        >
          <button
            type="button"
            className={
              styles.cancelButton
            }
            onClick={
              fecharModal
            }
          >
            Cancelar
          </button>

          <button
            type="button"
            className={
              styles.createButton
            }
            disabled={
              !formularioValido
            }
            onClick={
              criarEquipe
            }
          >
            <Plus size={17} />

            Criar equipe
          </button>
        </div>
      </div>
    </div>
  );
};

export default NovaEquipeModal;