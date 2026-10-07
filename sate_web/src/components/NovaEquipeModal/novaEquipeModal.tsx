import {
  CalendarDays,
  Camera,
  Check,
  Clock3,
  Palette,
  Plus,
  Search,
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

import styles from './novaEquipeModal.module.css';


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


export interface NovaEquipeData {
  nome: string;
  modalidade: string;
  categoria: string;
  atletasIds: number[];
  cor: string;
  proximaPartida: string | null;
  imagemPreview: string | null;
}


interface NovaEquipeModalProps {
  open: boolean;

  onClose: () => void;

  onCreate: (
    equipe: NovaEquipeData,
  ) => void;

  modalidadeInicial?: string;

  atletasDisponiveis?: AtletaDisponivel[];
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
   FORMATAR PARTIDA
===================================== */

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


/* =====================================
   COMPONENTE
===================================== */

const NovaEquipeModal = ({
  open,
  onClose,
  onCreate,

  modalidadeInicial = 'Futebol',

  atletasDisponiveis = [],
}: NovaEquipeModalProps) => {

  /* =====================================
     REFS
  ===================================== */

  const fileInputRef =
    useRef<HTMLInputElement>(null);

  const colorInputRef =
    useRef<HTMLInputElement>(null);


  /* =====================================
     ESTADOS
  ===================================== */

  const [nome, setNome] =
    useState('');

  const [
    categoria,
    setCategoria,
  ] = useState('Principal');

  const [
    atletasSelecionados,
    setAtletasSelecionados,
  ] = useState<number[]>([]);

  const [
    buscaAtleta,
    setBuscaAtleta,
  ] = useState('');

  const [cor, setCor] =
    useState('#16A875');

  const [
    corPersonalizada,
    setCorPersonalizada,
  ] = useState('#005942');

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
  ] = useState<string | null>(null);


  /* =====================================
     MODALIDADE
  ===================================== */

  const modalidade =
    modalidadeInicial === 'Todos'
      ? 'Futebol'
      : modalidadeInicial;


  /* =====================================
     PRÓXIMA PARTIDA
  ===================================== */

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


  /* =====================================
     COR PERSONALIZADA
  ===================================== */

  const corEhPersonalizada =
    !cores.includes(cor);


  /* =====================================
     FILTRAR ATLETAS
  ===================================== */

  const atletasFiltrados =
    useMemo(() => {
      const termo =
        buscaAtleta
          .trim()
          .toLowerCase();

      if (!termo) {
        return atletasDisponiveis;
      }

      return atletasDisponiveis.filter(
        (atleta) => {
          const nomeAtleta =
            atleta.nome
              ?.toLowerCase() || '';

          const categoriaAtleta =
            atleta.categoria
              ?.toLowerCase() || '';

          const email =
            atleta.usuario?.email
              ?.toLowerCase() || '';

          return (
            nomeAtleta.includes(termo) ||
            categoriaAtleta.includes(termo) ||
            email.includes(termo)
          );
        },
      );
    }, [
      atletasDisponiveis,
      buscaAtleta,
    ]);


  /* =====================================
     VALIDAÇÃO
  ===================================== */

  const formularioValido =
    useMemo(() => {
      return (
        nome.trim().length >= 2 &&
        categoria.trim() !== ''
      );
    }, [
      nome,
      categoria,
    ]);


  /* =====================================
     ESC
  ===================================== */

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleEscape = (
      event: KeyboardEvent,
    ) => {
      if (event.key === 'Escape') {
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
  }, [
    open,
    onClose,
  ]);


  /* =====================================
     IMAGEM
  ===================================== */

  const handleImagem = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    /*
      FileReader transforma a imagem
      em Base64, garantindo que o
      preview continue disponível.
    */

    const reader = new FileReader();

    reader.onload = () => {
      if (
        typeof reader.result ===
        'string'
      ) {
        setImagemPreview(
          reader.result,
        );
      }
    };

    reader.readAsDataURL(file);
  };


  /* =====================================
     COR PERSONALIZADA
  ===================================== */

  const handleCorPersonalizada = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const novaCor =
      event.target.value;

    setCorPersonalizada(
      novaCor,
    );

    setCor(novaCor);
  };


  /* =====================================
     SELECIONAR ATLETA
  ===================================== */

  const alternarAtleta = (
    atletaId: number,
  ) => {
    setAtletasSelecionados(
      (atuais) => {
        if (
          atuais.includes(atletaId)
        ) {
          return atuais.filter(
            (id) =>
              id !== atletaId,
          );
        }

        return [
          ...atuais,
          atletaId,
        ];
      },
    );
  };


  /* =====================================
     RESET
  ===================================== */

  const resetFormulario = () => {
    setNome('');

    setCategoria(
      'Principal',
    );

    setAtletasSelecionados(
      [],
    );

    setBuscaAtleta('');

    setCor('#16A875');

    setCorPersonalizada(
      '#005942',
    );

    setAdversario('');

    setDataPartida('');

    setHorarioPartida('');

    setImagemPreview(null);
  };


  /* =====================================
     FECHAR
  ===================================== */

  const fecharModal = () => {
    resetFormulario();

    onClose();
  };


  /* =====================================
     CRIAR
  ===================================== */

  const criarEquipe = () => {
    if (!formularioValido) {
      return;
    }

    onCreate({
      nome: nome.trim(),

      modalidade,

      categoria:
        categoria.trim(),

      atletasIds:
        atletasSelecionados,

      cor,

      proximaPartida:
        adversario.trim()
          ? dataPartida &&
            horarioPartida
            ? `${dataPartida}T${horarioPartida}:00`
            : proximaPartida
          : null,

      imagemPreview,
    });

    resetFormulario();

    onClose();
  };


  /* =====================================
     NÃO ABRIR
  ===================================== */

  if (!open) {
    return null;
  }


  /* =====================================
     RENDER
  ===================================== */

  return (
    <div
      className={styles.overlay}
      onMouseDown={fecharModal}
    >
      <div
        className={styles.modal}
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >

        {/* =================================
            HEADER
        ================================= */}

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
              Cadastre as principais
              informações do novo time.
            </p>
          </div>

          <button
            type="button"
            className={
              styles.closeButton
            }
            onClick={fecharModal}
          >
            <X size={19} />
          </button>
        </div>


        {/* =================================
            CONTEÚDO
        ================================= */}

        <div
          className={
            styles.content
          }
        >

          {/* ================================
              IMAGEM
          ================================= */}

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
                fileInputRef.current?.click()
              }
            >
              {imagemPreview ? (
                <img
                  src={imagemPreview}
                  alt="Preview da equipe"
                />
              ) : (
                <>
                  <div
                    className={
                      styles.cameraCircle
                    }
                  >
                    <Camera size={20} />
                  </div>

                  <strong>
                    Adicionar imagem
                  </strong>

                  <span>
                    PNG ou JPG
                  </span>
                </>
              )}
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className={
                styles.hiddenInput
              }
              onChange={handleImagem}
            />

            {imagemPreview && (
              <button
                type="button"
                className={
                  styles.changeImageButton
                }
                onClick={() =>
                  fileInputRef.current?.click()
                }
              >
                <Camera size={13} />

                Alterar imagem
              </button>
            )}
          </div>


          {/* ================================
              FORM
          ================================= */}

          <div
            className={
              styles.form
            }
          >

            {/* NOME */}

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
                onChange={(event) =>
                  setNome(
                    event.target.value,
                  )
                }
                autoFocus
              />
            </div>


            {/* CATEGORIA + CONTADOR */}

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
                  value={categoria}
                  onChange={(event) =>
                    setCategoria(
                      event.target.value,
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
                <label>
                  Atletas
                </label>

                <div
                  style={{
                    height: '46px',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 12px',
                    border:
                      '1px solid #c6d4cd',
                    borderRadius: '9px',
                    background:
                      '#f8faf9',
                    color: '#293a32',
                    fontSize: '11px',
                  }}
                >
                  <UserRound
                    size={14}
                    style={{
                      marginRight: '7px',
                      color: '#087b5b',
                    }}
                  />

                  <strong>
                    {
                      atletasSelecionados.length
                    }
                  </strong>

                  <span
                    style={{
                      marginLeft: '4px',
                    }}
                  >
                    selecionados
                  </span>
                </div>
              </div>
            </div>


            {/* ================================
                SELEÇÃO DE ATLETAS
            ================================= */}

            <div
              className={
                styles.field
              }
            >
              <label>
                Selecionar atletas
              </label>

              <div
                style={{
                  position: 'relative',
                }}
              >
                <Search
                  size={15}
                  style={{
                    position: 'absolute',
                    left: '11px',
                    top: '50%',
                    transform:
                      'translateY(-50%)',
                    color: '#7a8982',
                    pointerEvents:
                      'none',
                  }}
                />

                <input
                  type="text"
                  placeholder="Buscar atleta..."
                  value={buscaAtleta}
                  onChange={(event) =>
                    setBuscaAtleta(
                      event.target.value,
                    )
                  }
                  style={{
                    paddingLeft:
                      '34px',
                  }}
                />
              </div>


              {/* LISTA DE ATLETAS */}

              <div
                style={{
                  maxHeight: '105px',
                  overflowY: 'auto',
                  marginTop: '5px',
                  border:
                    '1px solid #cbd8d2',
                  borderRadius: '8px',
                  background:
                    '#f8faf9',
                }}
              >
                {atletasFiltrados.length ===
                0 ? (
                  <div
                    style={{
                      minHeight: '55px',
                      display: 'flex',
                      alignItems:
                        'center',
                      justifyContent:
                        'center',
                      padding: '10px',
                      color:
                        '#7b8982',
                      fontSize: '10px',
                      textAlign:
                        'center',
                    }}
                  >
                    {atletasDisponiveis.length ===
                    0
                      ? 'Nenhum atleta disponível para adicionar.'
                      : 'Nenhum atleta encontrado.'}
                  </div>
                ) : (
                  atletasFiltrados.map(
                    (atleta) => {
                      const selecionado =
                        atletasSelecionados.includes(
                          atleta.id,
                        );

                      return (
                        <button
                          key={atleta.id}
                          type="button"
                          onClick={() =>
                            alternarAtleta(
                              atleta.id,
                            )
                          }
                          style={{
                            width: '100%',
                            minHeight:
                              '34px',
                            display:
                              'flex',
                            alignItems:
                              'center',
                            gap: '8px',
                            padding:
                              '5px 9px',
                            border:
                              'none',
                            borderBottom:
                              '1px solid #e5ece8',
                            background:
                              selecionado
                                ? '#e8f6f0'
                                : 'transparent',
                            color:
                              '#24362e',
                            textAlign:
                              'left',
                            cursor:
                              'pointer',
                          }}
                        >

                          {/* AVATAR */}

                          <div
                            style={{
                              width: '25px',
                              height: '25px',
                              flexShrink: 0,
                              display:
                                'flex',
                              alignItems:
                                'center',
                              justifyContent:
                                'center',
                              overflow:
                                'hidden',
                              borderRadius:
                                '50%',
                              background:
                                '#dce9e3',
                              color:
                                '#087b5b',
                              fontSize:
                                '9px',
                              fontWeight:
                                700,
                            }}
                          >
                            {atleta.usuario
                              ?.avatarUrl ? (
                              <img
                                src={
                                  atleta
                                    .usuario
                                    .avatarUrl
                                }
                                alt=""
                                style={{
                                  width:
                                    '100%',
                                  height:
                                    '100%',
                                  objectFit:
                                    'cover',
                                }}
                              />
                            ) : (
                              atleta.nome
                                .trim()
                                .slice(0, 2)
                                .toUpperCase()
                            )}
                          </div>


                          {/* DADOS */}

                          <div
                            style={{
                              minWidth: 0,
                              flex: 1,
                              display:
                                'flex',
                              flexDirection:
                                'column',
                            }}
                          >
                            <span
                              style={{
                                overflow:
                                  'hidden',
                                fontSize:
                                  '10px',
                                fontWeight:
                                  600,
                                whiteSpace:
                                  'nowrap',
                                textOverflow:
                                  'ellipsis',
                              }}
                            >
                              {
                                atleta.nome
                              }
                            </span>

                            <span
                              style={{
                                marginTop:
                                  '1px',
                                color:
                                  '#829088',
                                fontSize:
                                  '8px',
                              }}
                            >
                              {atleta.categoria ||
                                'Sem categoria'}
                            </span>
                          </div>


                          {/* CHECK */}

                          {selecionado && (
                            <div
                              style={{
                                width: '20px',
                                height: '20px',
                                flexShrink: 0,
                                display:
                                  'flex',
                                alignItems:
                                  'center',
                                justifyContent:
                                  'center',
                                borderRadius:
                                  '6px',
                                background:
                                  '#16A875',
                                color:
                                  '#ffffff',
                              }}
                            >
                              <Check
                                size={13}
                              />
                            </div>
                          )}
                        </button>
                      );
                    },
                  )
                )}
              </div>
            </div>


            {/* ================================
                PRÓXIMA PARTIDA
            ================================= */}

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
                    size={15}
                  />
                </div>

                <div>
                  <strong>
                    Próxima partida
                  </strong>

                  <span>
                    Informe o adversário,
                    dia e horário.
                  </span>
                </div>
              </div>


              {/* ADVERSÁRIO */}

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
                  value={adversario}
                  onChange={(event) =>
                    setAdversario(
                      event.target.value,
                    )
                  }
                />
              </div>


              {/* DATA */}

              <div
                className={
                  styles.dateTimeGrid
                }
              >
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
                      size={14}
                    />

                    <input
                      id="data-partida"
                      type="date"
                      value={
                        dataPartida
                      }
                      onChange={(event) =>
                        setDataPartida(
                          event.target.value,
                        )
                      }
                    />
                  </div>
                </div>


                {/* HORÁRIO */}

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
                      size={14}
                    />

                    <input
                      id="hora-partida"
                      type="time"
                      value={
                        horarioPartida
                      }
                      onChange={(event) =>
                        setHorarioPartida(
                          event.target.value,
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
                    size={14}
                  />

                  <div>
                    <span>
                      Como aparecerá no card
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


            {/* ================================
                CORES
            ================================= */}

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
                  styles.colorsArea
                }
              >
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
                          cor === item
                            ? styles.colorSelected
                            : ''
                        }`}
                        style={{
                          background:
                            item,
                        }}
                        onClick={() =>
                          setCor(item)
                        }
                        title={item}
                      >
                        {cor === item && (
                          <Check
                            size={13}
                          />
                        )}
                      </button>
                    ),
                  )}


                  {/* COR PERSONALIZADA */}

                  <button
                    type="button"
                    className={`${styles.customColorButton} ${
                      corEhPersonalizada
                        ? styles.customColorSelected
                        : ''
                    }`}
                    onClick={() =>
                      colorInputRef.current?.click()
                    }
                    title="Escolher cor personalizada"
                  >
                    <div
                      className={
                        styles.rgbCircle
                      }
                    >
                      <div
                        className={
                          styles.rgbCircleCenter
                        }
                        style={{
                          background:
                            corPersonalizada,
                        }}
                      >
                        <Palette
                          size={12}
                        />
                      </div>
                    </div>
                  </button>

                  <input
                    ref={
                      colorInputRef
                    }
                    type="color"
                    value={
                      corPersonalizada
                    }
                    onChange={
                      handleCorPersonalizada
                    }
                    className={
                      styles.hiddenColorInput
                    }
                  />
                </div>


                {/* COR SELECIONADA */}

                <div
                  className={
                    styles.selectedColorInfo
                  }
                >
                  <span>
                    Cor
                  </span>

                  <strong>
                    {cor.toUpperCase()}
                  </strong>

                  <div
                    className={
                      styles.selectedColorPreview
                    }
                    style={{
                      background:
                        cor,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>


        {/* =================================
            PREVIEW DA EQUIPE
        ================================= */}

        <div
          className={
            styles.teamPreview
          }
        >

          {/* FOTO DA EQUIPE */}

          <div
            className={
              styles.previewAvatar
            }
            style={{
              background:
                imagemPreview
                  ? 'transparent'
                  : cor,
              overflow: 'hidden',
            }}
          >
            {imagemPreview ? (
              <img
                src={imagemPreview}
                alt="Preview da equipe"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            ) : (
              nome
                .trim()
                .slice(0, 2)
                .toUpperCase() ||
              'EQ'
            )}
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
              {categoria} •{' '}
              {
                atletasSelecionados.length
              }{' '}
              {atletasSelecionados.length ===
              1
                ? 'atleta'
                : 'atletas'}
            </small>
          </div>
        </div>


        {/* =================================
            FOOTER
        ================================= */}

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
            onClick={fecharModal}
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
            <Plus size={15} />

            Criar equipe
          </button>
        </div>

      </div>
    </div>
  );
};


export default NovaEquipeModal;