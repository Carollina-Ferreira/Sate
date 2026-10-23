import {
  useEffect,
  useRef,
  useState,
} from 'react';

import type {
  ChangeEvent,
} from 'react';

import {
  Camera,
  Check,
  Palette,
  Pencil,
  X,
} from 'lucide-react';

import styles from './editarEquipeModal.module.css';

export interface EquipeParaEditar {
  id: number;
  nome: string;
  modalidade: string;
  categoria: string;
  atletas: number;
  imagem: string;
  cor: string;
  proximaPartida: string;
}

export interface EditarEquipeData {
  id: number;
  nome: string;
  modalidade: string;
  categoria: string;
  atletas: number;
  imagem: string;
  cor: string;
  proximaPartida: string;
}

interface EditarEquipeModalProps {
  open: boolean;

  equipe:
    | EquipeParaEditar
    | null;

  onClose: () => void;

  onSave: (
    dados: EditarEquipeData,
  ) => void;
}

const cores = [
  '#16A875',
  '#1674B8',
  '#E58425',
  '#C8BE08',
  '#7857E6',
  '#D74792',
];

const modalidades = [
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
  'Sub-13',
  'Feminino',
  'Masculino',
];

export default function EditarEquipeModal({
  open,
  equipe,
  onClose,
  onSave,
}: EditarEquipeModalProps) {
  const inputImagemRef =
    useRef<HTMLInputElement>(
      null,
    );

  const [
    nome,
    setNome,
  ] = useState('');

  const [
    modalidade,
    setModalidade,
  ] = useState(
    'Futebol',
  );

  const [
    categoria,
    setCategoria,
  ] = useState(
    'Principal',
  );

  const [
    atletas,
    setAtletas,
  ] = useState(0);

  const [
    imagem,
    setImagem,
  ] = useState('');

  const [
    cor,
    setCor,
  ] = useState(
    '#16A875',
  );

  const [
    proximaPartida,
    setProximaPartida,
  ] = useState('');

  useEffect(() => {
    if (
      !open ||
      !equipe
    ) {
      return;
    }

    setNome(
      equipe.nome,
    );

    setModalidade(
      equipe.modalidade,
    );

    setCategoria(
      equipe.categoria,
    );

    setAtletas(
      equipe.atletas,
    );

    setImagem(
      equipe.imagem,
    );

    setCor(
      equipe.cor,
    );

    setProximaPartida(
      equipe.proximaPartida,
    );
  }, [
    open,
    equipe,
  ]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const fecharEsc = (
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
      fecharEsc,
    );

    return () => {
      document.removeEventListener(
        'keydown',
        fecharEsc,
      );
    };
  }, [
    open,
    onClose,
  ]);

  if (
    !open ||
    !equipe
  ) {
    return null;
  }

  const formularioValido =
    nome.trim().length >= 2 &&
    atletas >= 0;

  const selecionarImagem = (
    event:
      ChangeEvent<HTMLInputElement>,
  ) => {
    const arquivo =
      event.target
        .files?.[0];

    if (!arquivo) {
      return;
    }

    if (
      !arquivo.type.startsWith(
        'image/',
      )
    ) {
      return;
    }

    const reader =
      new FileReader();

    reader.onload = () => {
      if (
        typeof reader.result ===
        'string'
      ) {
        setImagem(
          reader.result,
        );
      }
    };

    reader.readAsDataURL(
      arquivo,
    );
  };

  const salvar = () => {
    if (
      !formularioValido
    ) {
      return;
    }

    onSave({
      id: equipe.id,

      nome:
        nome.trim(),

      modalidade,

      categoria,

      atletas,

      imagem,

      cor,

      proximaPartida:
        proximaPartida.trim(),
    });

    onClose();
  };

  return (
    <div
      className={
        styles.overlay
      }
      onMouseDown={
        onClose
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
        <header
          className={
            styles.header
          }
        >
          <div>
            <span
              className={
                styles.eyebrow
              }
            >
              EDITAR EQUIPE
            </span>

            <h2>
              Atualizar equipe
            </h2>

            <p>
              Altere as informações
              que precisar.
            </p>
          </div>

          <button
            type="button"
            className={
              styles.closeButton
            }
            onClick={
              onClose
            }
          >
            <X size={22} />
          </button>
        </header>

        <div
          className={
            styles.content
          }
        >
          <div
            className={
              styles.imageColumn
            }
          >
            <button
              type="button"
              className={
                styles.imagePreview
              }
              onClick={() =>
                inputImagemRef
                  .current
                  ?.click()
              }
            >
              {imagem ? (
                <img
                  src={
                    imagem
                  }
                  alt={
                    nome
                  }
                />
              ) : (
                <div
                  className={
                    styles.imageEmpty
                  }
                >
                  <div
                    className={
                      styles.cameraCircle
                    }
                  >
                    <Camera
                      size={25}
                    />
                  </div>

                  <strong>
                    Adicionar imagem
                  </strong>

                  <span>
                    PNG ou JPG
                  </span>
                </div>
              )}
            </button>

            <input
              ref={
                inputImagemRef
              }
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className={
                styles.hiddenInput
              }
              onChange={
                selecionarImagem
              }
            />

            <button
              type="button"
              className={
                styles.changeImage
              }
              onClick={() =>
                inputImagemRef
                  .current
                  ?.click()
              }
            >
              <Camera
                size={16}
              />

              Trocar imagem
            </button>
          </div>

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
              <label>
                Nome da equipe
              </label>

              <input
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
              />
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
                <label>
                  Modalidade
                </label>

                <select
                  value={
                    modalidade
                  }
                  onChange={(
                    event,
                  ) =>
                    setModalidade(
                      event
                        .target
                        .value,
                    )
                  }
                >
                  {modalidades.map(
                    (
                      item,
                    ) => (
                      <option
                        key={
                          item
                        }
                        value={
                          item
                        }
                      >
                        {
                          item
                        }
                      </option>
                    ),
                  )}
                </select>
              </div>

              <div
                className={
                  styles.field
                }
              >
                <label>
                  Categoria
                </label>

                <select
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
                  {categorias.map(
                    (
                      item,
                    ) => (
                      <option
                        key={
                          item
                        }
                        value={
                          item
                        }
                      >
                        {
                          item
                        }
                      </option>
                    ),
                  )}
                </select>
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
                <label>
                  Nº de atletas
                </label>

                <input
                  type="number"
                  min={0}
                  value={
                    atletas
                  }
                  onChange={(
                    event,
                  ) =>
                    setAtletas(
                      Number(
                        event
                          .target
                          .value,
                      ),
                    )
                  }
                />
              </div>

              <div
                className={
                  styles.field
                }
              >
                <label>
                  Próxima partida
                </label>

                <input
                  value={
                    proximaPartida
                  }
                  placeholder="Ex.: vs Tigres (Sáb, 16h)"
                  onChange={(
                    event,
                  ) =>
                    setProximaPartida(
                      event
                        .target
                        .value,
                    )
                  }
                />
              </div>
            </div>

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
                  styles.colorsRow
                }
              >
                <div
                  className={
                    styles.colorOptions
                  }
                >
                  {cores.map(
                    (
                      item,
                    ) => (
                      <button
                        key={
                          item
                        }
                        type="button"
                        className={`${styles.colorButton} ${
                          cor ===
                          item
                            ? styles.colorSelected
                            : ''
                        }`}
                        style={{
                          backgroundColor:
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
                            size={18}
                          />
                        )}
                      </button>
                    ),
                  )}

                  <label
                    className={
                      styles.rgbButton
                    }
                    title="Escolher cor personalizada"
                  >
                    <div
                      className={
                        styles.rgbIconOuter
                      }
                    >
                      <div
                        className={
                          styles.rgbIconInner
                        }
                      >
                        <Palette
                          size={15}
                          strokeWidth={2.2}
                        />
                      </div>
                    </div>

                    <input
                      type="color"
                      value={
                        cor
                      }
                      onChange={(
                        event,
                      ) =>
                        setCor(
                          event
                            .target
                            .value,
                        )
                      }
                    />
                  </label>
                </div>

                <div
                  className={
                    styles.selectedColorBox
                  }
                >
                  <span>
                    Cor selecionada
                  </span>

                  <strong>
                    {
                      cor.toUpperCase()
                    }
                  </strong>

                  <div
                    className={
                      styles.selectedColorPreview
                    }
                    style={{
                      backgroundColor:
                        cor,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className={
            styles.preview
          }
        >
          <div
            className={
              styles.previewColor
            }
            style={{
              backgroundColor:
                cor,
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
              PRÉVIA
            </span>

            <strong>
              {nome.trim() ||
                'Nome da equipe'}
            </strong>

            <small>
              {modalidade} ·{' '}
              {categoria}
            </small>
          </div>
        </div>

        <footer
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
              onClose
            }
          >
            Cancelar
          </button>

          <button
            type="button"
            className={
              styles.saveButton
            }
            disabled={
              !formularioValido
            }
            onClick={
              salvar
            }
          >
            <Pencil
              size={18}
            />

            Salvar alterações
          </button>
        </footer>
      </div>
    </div>
  );
}