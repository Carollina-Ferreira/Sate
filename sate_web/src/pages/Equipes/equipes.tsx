import {
  useEffect,
  useState,
} from 'react';

import type {
  CSSProperties,
} from 'react';

import {
  Pencil,
  Trash2,
  X,
} from 'lucide-react';

import styles from './equipes.module.css';

import CardEquipe from '../../components/CardEquipe/cardEquipe';

import NovaEquipeModal from '../../components/NovaEquipeModal/novaEquipeModal';

import type {
  NovaEquipeData,
  AtletaDisponivel,
} from '../../components/NovaEquipeModal/novaEquipeModal';

import DetalhesEquipe from './detalhesEquipe';

import Futebol from '../../assets/img/futebol_img.png';
import Basquete from '../../assets/img/basquete_img.png';
import Volei from '../../assets/img/volei_img.png';
import Rugby from '../../assets/img/rugby_img.png';


type Modalidade =
  | 'Todos'
  | 'Futebol'
  | 'Basquete'
  | 'Vôlei'
  | 'Rugby'
  | 'Tênis';


interface EquipeBackend {
  id: number;
  nome: string;
  modalidade: string;
  categoria?: string | null;
  proximaPartida?: string | null;
  imagem?: string | null;
  corEquipe?: string | null;
  treinadorId?: number;
  numeroAtletas?: number;
  atletas?: unknown[];

  _count?: {
    atletas?: number;
  };
}


export interface Equipe {
  id: number;
  nome: string;
  modalidade: string;
  categoria: string;
  atletas: number;
  imagem: string;
  icone: string;
  cor: string;
  vitorias: number;
  empates: number | string;
  derrotas: number;
  proximaPartida: string;
  proximaPartidaRaw?: string | null;
  sigla: string;
  desempenho: number;
  videos: number;

  elenco: {
    id: number;
    nome: string;
    posicao: string;
    idade: number;
    desempenho: number;
  }[];

  evolucao: number[];
}


interface DadosEdicao {
  nome: string;
  modalidade: string;
  categoria: string;
  cor: string;
  proximaPartida: string;
}


const API_URL =
  'http://localhost:3000/api';


function obterToken() {
  return (
    localStorage.getItem('token') ||
    sessionStorage.getItem('token')
  );
}


function imagemPorModalidade(
  modalidade: string,
) {
  switch (modalidade) {
    case 'Basquete':
      return Basquete;

    case 'Vôlei':
      return Volei;

    case 'Rugby':
      return Rugby;

    default:
      return Futebol;
  }
}


function iconePorModalidade(
  modalidade: string,
) {
  switch (modalidade) {
    case 'Basquete':
      return 'sports_basketball';

    case 'Vôlei':
      return 'sports_volleyball';

    case 'Rugby':
      return 'sports_rugby';

    case 'Tênis':
      return 'sports_tennis';

    default:
      return 'sports_soccer';
  }
}


function criarSigla(
  nome: string,
) {
  const palavras =
    nome
      .trim()
      .split(' ')
      .filter(Boolean);


  if (
    palavras.length === 0
  ) {
    return 'EQ';
  }


  if (
    palavras.length === 1
  ) {
    return palavras[0]
      .slice(0, 2)
      .toUpperCase();
  }


  return `${palavras[0][0]}${palavras[
    palavras.length - 1
  ][0]}`.toUpperCase();
}


function formatarProximaPartida(
  data?: string | null,
) {
  if (!data) {
    return 'Nenhuma partida agendada';
  }


  const valor =
    new Date(data);


  if (
    Number.isNaN(
      valor.getTime(),
    )
  ) {
    return 'Nenhuma partida agendada';
  }


  return valor.toLocaleString(
    'pt-BR',
    {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    },
  );
}


function paraDateTimeLocal(
  data?: string | null,
) {
  if (!data) {
    return '';
  }


  const valor =
    new Date(data);


  if (
    Number.isNaN(
      valor.getTime(),
    )
  ) {
    return '';
  }


  const ano =
    valor.getFullYear();

  const mes =
    String(
      valor.getMonth() + 1,
    ).padStart(2, '0');

  const dia =
    String(
      valor.getDate(),
    ).padStart(2, '0');

  const hora =
    String(
      valor.getHours(),
    ).padStart(2, '0');

  const minuto =
    String(
      valor.getMinutes(),
    ).padStart(2, '0');


  return `${ano}-${mes}-${dia}T${hora}:${minuto}`;
}


function converterEquipe(
  equipe: EquipeBackend,
): Equipe {

  let quantidadeAtletas =
    0;


  if (
    typeof equipe.numeroAtletas ===
    'number'
  ) {
    quantidadeAtletas =
      equipe.numeroAtletas;

  } else if (
    typeof equipe._count
      ?.atletas ===
    'number'
  ) {
    quantidadeAtletas =
      equipe._count.atletas;

  } else if (
    Array.isArray(
      equipe.atletas,
    )
  ) {
    quantidadeAtletas =
      equipe.atletas.length;
  }


  return {
    id:
      equipe.id,

    nome:
      equipe.nome,

    modalidade:
      equipe.modalidade,

    categoria:
      equipe.categoria ||
      'Sem categoria',

    atletas:
      quantidadeAtletas,

    imagem:
      equipe.imagem ||
      imagemPorModalidade(
        equipe.modalidade,
      ),

    icone:
      iconePorModalidade(
        equipe.modalidade,
      ),

    cor:
      equipe.corEquipe ||
      '#16A875',

    vitorias:
      0,

    empates:
      0,

    derrotas:
      0,

    proximaPartida:
      formatarProximaPartida(
        equipe.proximaPartida,
      ),

    proximaPartidaRaw:
      equipe.proximaPartida ||
      null,

    sigla:
      criarSigla(
        equipe.nome,
      ),

    desempenho:
      0,

    videos:
      0,

    elenco:
      [],

    evolucao: [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
    ],
  };
}


function pegarMensagemErro(
  dados: unknown,
  padrao: string,
) {
  if (
    typeof dados ===
    'object' &&
    dados !== null
  ) {
    const objeto =
      dados as Record<
        string,
        unknown
      >;


    if (
      typeof objeto.erro ===
      'string'
    ) {
      return objeto.erro;
    }


    if (
      typeof objeto.mensagem ===
      'string'
    ) {
      return objeto.mensagem;
    }
  }


  return padrao;
}


function extrairEquipes(
  dados: unknown,
): EquipeBackend[] {

  if (
    Array.isArray(dados)
  ) {
    return dados as EquipeBackend[];
  }


  if (
    typeof dados ===
    'object' &&
    dados !== null
  ) {
    const objeto =
      dados as Record<
        string,
        unknown
      >;


    if (
      Array.isArray(
        objeto.equipes,
      )
    ) {
      return objeto.equipes as EquipeBackend[];
    }


    if (
      Array.isArray(
        objeto.data,
      )
    ) {
      return objeto.data as EquipeBackend[];
    }
  }


  return [];
}


/* ============================================================
   MODAL DE EDIÇÃO
============================================================ */

const overlayStyle:
  CSSProperties = {
  position: 'fixed',
  inset: 0,
  zIndex: 9999,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '20px',
  boxSizing: 'border-box',
  background:
    'rgba(0, 35, 26, 0.68)',
  backdropFilter:
    'blur(4px)',
};


const modalStyle:
  CSSProperties = {
  width:
    'min(560px, 100%)',
  maxHeight:
    '90vh',
  overflowY:
    'auto',
  padding:
    '24px',
  boxSizing:
    'border-box',
  borderRadius:
    '18px',
  background:
    '#eef4f1',
  color:
    '#18352d',
  boxShadow:
    '0 24px 60px rgba(0,0,0,.25)',
  fontFamily:
    "'Poppins', sans-serif",
};


const inputStyle:
  CSSProperties = {
  width: '100%',
  height: '44px',
  padding: '0 12px',
  boxSizing: 'border-box',
  border:
    '1px solid #c7d8d1',
  borderRadius: '9px',
  outline: 'none',
  background: '#ffffff',
  color: '#18352d',
  fontFamily: 'inherit',
  fontSize: '13px',
};


interface EditarEquipeModalProps {
  equipe:
  | Equipe
  | null;

  salvando: boolean;

  onClose: () => void;

  onSave: (
    dados: DadosEdicao,
  ) => Promise<void>;

  onDelete: () =>
    Promise<void>;
}


function EditarEquipeModalInterno({
  equipe,
  salvando,
  onClose,
  onSave,
  onDelete,
}: EditarEquipeModalProps) {

  const [
    formulario,
    setFormulario,
  ] =
    useState<DadosEdicao>({
      nome: '',
      modalidade:
        'Futebol',
      categoria: '',
      cor: '#16A875',
      proximaPartida:
        '',
    });


  useEffect(() => {
    if (!equipe) {
      return;
    }


    setFormulario({
      nome:
        equipe.nome,

      modalidade:
        equipe.modalidade,

      categoria:
        equipe.categoria ===
          'Sem categoria'
          ? ''
          : equipe.categoria,

      cor:
        equipe.cor,

      proximaPartida:
        paraDateTimeLocal(
          equipe.proximaPartidaRaw,
        ),
    });

  }, [equipe]);


  if (!equipe) {
    return null;
  }


  function alterar(
    campo:
      keyof DadosEdicao,
    valor: string,
  ) {
    setFormulario(
      (anterior) => ({
        ...anterior,
        [campo]: valor,
      }),
    );
  }


  return (
    <div
      style={
        overlayStyle
      }
      onClick={() => {
        if (!salvando) {
          onClose();
        }
      }}
    >

      <div
        style={
          modalStyle
        }
        onClick={(
          event,
        ) =>
          event.stopPropagation()
        }
      >

        <div
          style={{
            display:
              'flex',
            alignItems:
              'center',
            justifyContent:
              'space-between',
            marginBottom:
              '20px',
          }}
        >

          <h2
            style={{
              margin: 0,
              fontSize:
                '22px',
            }}
          >
            Editar equipe
          </h2>


          <button
            type="button"
            onClick={
              onClose
            }
            disabled={
              salvando
            }
            style={{
              width: '38px',
              height: '38px',
              border: 'none',
              borderRadius:
                '10px',
              display: 'flex',
              alignItems:
                'center',
              justifyContent:
                'center',
              background:
                '#dce8e3',
              cursor:
                'pointer',
            }}
          >
            <X
              size={18}
            />
          </button>

        </div>


        <div
          style={{
            display:
              'flex',
            flexDirection:
              'column',
            gap: '14px',
          }}
        >

          <label>
            <span
              style={{
                display:
                  'block',
                marginBottom:
                  '6px',
                fontSize:
                  '12px',
                fontWeight:
                  600,
              }}
            >
              Nome
            </span>

            <input
              style={
                inputStyle
              }
              value={
                formulario.nome
              }
              onChange={(
                event,
              ) =>
                alterar(
                  'nome',
                  event.target
                    .value,
                )
              }
            />
          </label>


          <div
            style={{
              display:
                'grid',
              gridTemplateColumns:
                '1fr 1fr',
              gap: '12px',
            }}
          >

            <label>
              <span
                style={{
                  display:
                    'block',
                  marginBottom:
                    '6px',
                  fontSize:
                    '12px',
                  fontWeight:
                    600,
                }}
              >
                Modalidade
              </span>

              <select
                style={
                  inputStyle
                }
                value={
                  formulario.modalidade
                }
                onChange={(
                  event,
                ) =>
                  alterar(
                    'modalidade',
                    event.target
                      .value,
                  )
                }
              >
                <option value="Futebol">
                  Futebol
                </option>

                <option value="Basquete">
                  Basquete
                </option>

                <option value="Vôlei">
                  Vôlei
                </option>

                <option value="Rugby">
                  Rugby
                </option>

                <option value="Tênis">
                  Tênis
                </option>
              </select>
            </label>


            <label>
              <span
                style={{
                  display:
                    'block',
                  marginBottom:
                    '6px',
                  fontSize:
                    '12px',
                  fontWeight:
                    600,
                }}
              >
                Categoria
              </span>

              <input
                style={
                  inputStyle
                }
                value={
                  formulario.categoria
                }
                onChange={(
                  event,
                ) =>
                  alterar(
                    'categoria',
                    event.target
                      .value,
                  )
                }
              />
            </label>

          </div>


          <div
            style={{
              display:
                'grid',
              gridTemplateColumns:
                '1fr 1fr',
              gap: '12px',
            }}
          >

            <label>
              <span
                style={{
                  display:
                    'block',
                  marginBottom:
                    '6px',
                  fontSize:
                    '12px',
                  fontWeight:
                    600,
                }}
              >
                Cor
              </span>

              <input
                type="color"
                style={{
                  ...inputStyle,
                  padding:
                    '5px 8px',
                }}
                value={
                  formulario.cor
                }
                onChange={(
                  event,
                ) =>
                  alterar(
                    'cor',
                    event.target
                      .value,
                  )
                }
              />
            </label>


            <label>
              <span
                style={{
                  display:
                    'block',
                  marginBottom:
                    '6px',
                  fontSize:
                    '12px',
                  fontWeight:
                    600,
                }}
              >
                Próxima partida
              </span>

              <input
                type="datetime-local"
                style={
                  inputStyle
                }
                value={
                  formulario
                    .proximaPartida
                }
                onChange={(
                  event,
                ) =>
                  alterar(
                    'proximaPartida',
                    event.target
                      .value,
                  )
                }
              />
            </label>

          </div>

        </div>


        <div
          style={{
            display:
              'flex',
            alignItems:
              'center',
            justifyContent:
              'space-between',
            gap: '12px',
            marginTop:
              '22px',
          }}
        >

          <button
            type="button"
            onClick={
              onDelete
            }
            disabled={
              salvando
            }
            style={{
              height: '42px',
              display:
                'flex',
              alignItems:
                'center',
              gap: '7px',
              padding:
                '0 15px',
              border:
                '1px solid #dfb8b8',
              borderRadius:
                '9px',
              background:
                '#fff5f5',
              color:
                '#b53d3d',
              fontFamily:
                'inherit',
              fontWeight:
                600,
              cursor:
                'pointer',
            }}
          >
            <Trash2
              size={15}
            />

            Excluir
          </button>


          <button
            type="button"
            onClick={() =>
              void onSave(
                formulario,
              )
            }
            disabled={
              salvando
            }
            style={{
              height: '42px',
              padding:
                '0 20px',
              border:
                'none',
              borderRadius:
                '9px',
              background:
                '#16a875',
              color:
                '#ffffff',
              fontFamily:
                'inherit',
              fontWeight:
                700,
              cursor:
                'pointer',
            }}
          >
            {salvando
              ? 'Salvando...'
              : 'Salvar alterações'}
          </button>

        </div>

      </div>

    </div>
  );
}


/* ============================================================
   COMPONENTE
============================================================ */

const Equipes = () => {

  const [
    filtroAtivo,
    setFiltroAtivo,
  ] =
    useState<Modalidade>(
      'Todos',
    );


  const [
    equipes,
    setEquipes,
  ] =
    useState<Equipe[]>([]);


  const [
    carregando,
    setCarregando,
  ] =
    useState(true);


  const [
    atletasDisponiveis,
    setAtletasDisponiveis,
  ] =
    useState<
      AtletaDisponivel[]
    >([]);


  const [
    carregandoAtletas,
    setCarregandoAtletas,
  ] =
    useState(false);


  const [
    equipeSelecionada,
    setEquipeSelecionada,
  ] =
    useState<
      Equipe | null
    >(null);


  const [
    modalNovaEquipe,
    setModalNovaEquipe,
  ] =
    useState(false);


  const [
    modoEditar,
    setModoEditar,
  ] =
    useState(false);


  const [
    equipeEmEdicao,
    setEquipeEmEdicao,
  ] =
    useState<
      Equipe | null
    >(null);


  const [
    salvandoEdicao,
    setSalvandoEdicao,
  ] =
    useState(false);


  async function carregarEquipes() {

    try {

      setCarregando(
        true,
      );


      const token =
        obterToken();


      if (!token) {

        setEquipes([]);

        return;
      }


      const resposta =
        await fetch(
          `${API_URL}/equipes`,
          {
            method:
              'GET',

            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          },
        );


      const dados:
        unknown =
        await resposta
          .json()
          .catch(
            () => [],
          );


      if (
        !resposta.ok
      ) {
        throw new Error(
          pegarMensagemErro(
            dados,
            'Erro ao carregar equipes.',
          ),
        );
      }


      const lista =
        extrairEquipes(
          dados,
        );


      setEquipes(
        lista.map(
          converterEquipe,
        ),
      );

    } catch (error) {

      console.error(
        'Erro ao carregar equipes:',
        error,
      );


      setEquipes([]);

    } finally {

      setCarregando(
        false,
      );

    }

  }


  async function carregarAtletas() {

    try {

      setCarregandoAtletas(
        true,
      );


      const token =
        obterToken();


      if (!token) {

        setAtletasDisponiveis(
          [],
        );

        return;
      }


      const resposta =
        await fetch(
          `${API_URL}/atletas/disponiveis`,
          {
            method:
              'GET',

            headers: {
              'Content-Type':
                'application/json',

              Authorization:
                `Bearer ${token}`,
            },
          },
        );


      const dados:
        unknown =
        await resposta
          .json()
          .catch(
            () => [],
          );


      if (
        !resposta.ok
      ) {
        console.warn(
          'Não foi possível carregar atletas disponíveis.',
          dados,
        );

        setAtletasDisponiveis(
          [],
        );

        return;
      }


      let lista:
        unknown[] = [];


      if (
        Array.isArray(
          dados,
        )
      ) {
        lista =
          dados;

      } else if (
        typeof dados ===
        'object' &&
        dados !== null
      ) {
        const objeto =
          dados as Record<
            string,
            unknown
          >;


        if (
          Array.isArray(
            objeto.atletas,
          )
        ) {
          lista =
            objeto.atletas;
        }
      }


      const formatados =
        lista.map(
          (item) => {

            const atleta =
              item as {
                id: number;
                nome?: string | null;
                categoria?: string | null;

                usuario?: {
                  email?: string;
                  avatarUrl?: string | null;
                } | null;
              };


            return {
              id:
                atleta.id,

              nome:
                atleta.nome ||
                'Atleta sem nome',

              categoria:
                atleta.categoria ||
                null,

              usuario:
                atleta.usuario
                  ? {
                    email:
                      atleta.usuario.email ||
                      '',

                    avatarUrl:
                      atleta.usuario.avatarUrl ||
                      null,
                  }
                  : undefined,
            } as AtletaDisponivel;
          },
        );


      setAtletasDisponiveis(
        formatados,
      );

    } catch (error) {

      console.error(
        'Erro ao carregar atletas disponíveis:',
        error,
      );


      setAtletasDisponiveis(
        [],
      );

    } finally {

      setCarregandoAtletas(
        false,
      );

    }

  }


  useEffect(() => {

    void carregarEquipes();

    void carregarAtletas();

  }, []);


  const equipesFiltradas =
    filtroAtivo ===
      'Todos'
      ? equipes
      : equipes.filter(
        (equipe) =>
          equipe.modalidade ===
          filtroAtivo,
      );


  async function adicionarEquipe(
    dados:
      NovaEquipeData,
  ) {

    try {

      const token =
        obterToken();


      if (!token) {

        alert(
          'Sessão não encontrada. Faça login novamente.',
        );

        return;
      }


      const extras =
        dados as NovaEquipeData & {
          atletasIds?: number[];

          proximaPartida?:
          | string
          | null;
        };


      const resposta =
        await fetch(
          `${API_URL}/equipes`,
          {
            method:
              'POST',

            headers: {
              'Content-Type':
                'application/json',

              Authorization:
                `Bearer ${token}`,
            },

            body:
              JSON.stringify({
                nome:
                  dados.nome.trim(),

                modalidade:
                  dados.modalidade,

                categoria:
                  dados.categoria ||
                  null,

                imagem:
                  null,

                corEquipe:
                  dados.cor ||
                  '#16A875',

                proximaPartida:
                  extras.proximaPartida ||
                  null,

                atletasIds:
                  extras.atletasIds ||
                  [],
              }),
          },
        );


      const respostaDados:
        unknown =
        await resposta
          .json()
          .catch(
            () => ({}),
          );


      if (
        !resposta.ok
      ) {
        throw new Error(
          pegarMensagemErro(
            respostaDados,
            'Erro ao criar equipe.',
          ),
        );
      }


      setModalNovaEquipe(
        false,
      );

      setFiltroAtivo(
        'Todos',
      );


      await Promise.all([
        carregarEquipes(),
        carregarAtletas(),
      ]);


      alert(
        'Equipe criada com sucesso!',
      );

    } catch (error) {

      console.error(
        'Erro ao criar equipe:',
        error,
      );


      alert(
        error instanceof Error
          ? error.message
          : 'Erro ao criar equipe.',
      );

    }

  }


  function clicarEquipe(
    equipe: Equipe,
  ) {

    if (modoEditar) {

      setEquipeEmEdicao(
        equipe,
      );

      return;
    }


    setEquipeSelecionada(
      equipe,
    );

  }


  async function salvarEdicao(
    dados:
      DadosEdicao,
  ) {

    if (
      !equipeEmEdicao
    ) {
      return;
    }


    if (
      !dados.nome.trim()
    ) {
      alert(
        'Informe o nome da equipe.',
      );

      return;
    }


    try {

      setSalvandoEdicao(
        true,
      );


      const token =
        obterToken();


      if (!token) {

        alert(
          'Sessão não encontrada.',
        );

        return;
      }


      const resposta =
        await fetch(
          `${API_URL}/equipes/${equipeEmEdicao.id}`,
          {
            method:
              'PUT',

            headers: {
              'Content-Type':
                'application/json',

              Authorization:
                `Bearer ${token}`,
            },

            body:
              JSON.stringify({
                nome:
                  dados.nome.trim(),

                modalidade:
                  dados.modalidade,

                categoria:
                  dados.categoria.trim() ||
                  null,

                corEquipe:
                  dados.cor,

                proximaPartida:
                  dados.proximaPartida
                    ? new Date(
                      dados.proximaPartida,
                    ).toISOString()
                    : null,
              }),
          },
        );


      const respostaDados:
        unknown =
        await resposta
          .json()
          .catch(
            () => ({}),
          );


      if (
        !resposta.ok
      ) {
        throw new Error(
          pegarMensagemErro(
            respostaDados,
            'Erro ao editar equipe.',
          ),
        );
      }


      setEquipeEmEdicao(
        null,
      );

      setModoEditar(
        false,
      );


      await carregarEquipes();


      alert(
        'Equipe atualizada com sucesso!',
      );

    } catch (error) {

      console.error(
        'Erro ao editar equipe:',
        error,
      );


      alert(
        error instanceof Error
          ? error.message
          : 'Erro ao editar equipe.',
      );

    } finally {

      setSalvandoEdicao(
        false,
      );

    }

  }


  async function excluirEquipe() {

    if (
      !equipeEmEdicao
    ) {
      return;
    }


    const confirmou =
      window.confirm(
        `Deseja realmente excluir a equipe "${equipeEmEdicao.nome}"?`,
      );


    if (!confirmou) {
      return;
    }


    try {

      setSalvandoEdicao(
        true,
      );


      const token =
        obterToken();


      if (!token) {
        return;
      }


      const resposta =
        await fetch(
          `${API_URL}/equipes/${equipeEmEdicao.id}`,
          {
            method:
              'DELETE',

            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          },
        );


      const dados:
        unknown =
        await resposta
          .json()
          .catch(
            () => ({}),
          );


      if (
        !resposta.ok
      ) {
        throw new Error(
          pegarMensagemErro(
            dados,
            'Erro ao excluir equipe.',
          ),
        );
      }


      setEquipeEmEdicao(
        null,
      );

      setModoEditar(
        false,
      );


      await Promise.all([
        carregarEquipes(),
        carregarAtletas(),
      ]);


      alert(
        'Equipe excluída com sucesso!',
      );

    } catch (error) {

      console.error(
        'Erro ao excluir equipe:',
        error,
      );


      alert(
        error instanceof Error
          ? error.message
          : 'Erro ao excluir equipe.',
      );

    } finally {

      setSalvandoEdicao(
        false,
      );

    }

  }


  if (
    equipeSelecionada
  ) {

    return (
      <DetalhesEquipe
        equipe={
          equipeSelecionada
        }

        onBack={() =>
          setEquipeSelecionada(
            null,
          )
        }
      />
    );

  }


  return (
    <>

      <main
        className={
          styles.page
        }
      >

        <div
          className={
            styles.header
          }
        >

          <div
            className={
              styles.headerText
            }
          >

            <h1 className={styles.title}>
              Minhas <em>equipes.</em>
            </h1>

            <p
              className={
                styles.description
              }
            >
              Gerencie seus times,
              acompanhe métricas de
              performance e organize
              seu portfólio de atletas
              em um só lugar.
            </p>

          </div>


          <div
            style={{
              display: 'flex',
              alignItems:
                'center',
              gap: '12px',
            }}
          >

            <button
              type="button"
              className={
                styles.newTeamButton
              }
              onClick={() => {

                setModoEditar(
                  (valor) =>
                    !valor,
                );

                setEquipeEmEdicao(
                  null,
                );

              }}
            >
              <Pencil
                size={17}
              />

              {modoEditar
                ? 'Cancelar edição'
                : 'Editar equipe'}
            </button>


            <button
              type="button"
              className={
                styles.newTeamButton
              }
              disabled={
                carregandoAtletas
              }
              onClick={() =>
                setModalNovaEquipe(
                  true,
                )
              }
            >

              <span
                className={
                  styles.plus
                }
              >
                +
              </span>


              {carregandoAtletas
                ? 'Carregando...'
                : 'Nova Equipe'}

            </button>

          </div>

        </div>


        {modoEditar && (
          <div
            style={{
              display: 'flex',
              alignItems:
                'center',
              gap: '8px',
              marginBottom:
                '16px',
              padding:
                '10px 14px',
              borderRadius:
                '9px',
              background:
                'rgba(255,255,255,.12)',
              color:
                '#ffffff',
              fontSize:
                '12px',
            }}
          >
            <Pencil
              size={15}
            />

            Clique na equipe
            que deseja editar.
          </div>
        )}


        <div className={styles.filters}>
          {[
            ['Todos', '⚽'],
            ['Futebol', '⚽'],
            ['Basquete', '🏀'],
            ['Vôlei', '🏐'],
            ['Rugby', '🏉'],
            ['Tênis', '🎾'],
          ].map(([nome, icone]) => (
            <button
              key={nome}
              type="button"
              className={`${styles.filterButton} ${filtroAtivo === nome
                  ? styles.active
                  : ''
                }`}
              onClick={() =>
                setFiltroAtivo(
                  nome as Modalidade,
                )
              }
            >
              <span className={styles.filterIcon}>
                {icone}
              </span>

              {nome}
            </button>
          ))}
        </div>


        {carregando && (
          <div
            style={{
              padding:
                '50px 20px',
              textAlign:
                'center',
              color:
                '#ffffff',
            }}
          >
            Carregando equipes...
          </div>
        )}


        {!carregando && (
          <div
            className={
              styles.teamsGrid
            }
          >

            {equipesFiltradas.map(
              (equipe) => (

                <div
                  key={
                    equipe.id
                  }
                  className={
                    styles.teamClickable
                  }
                  role="button"
                  tabIndex={0}
                  onClick={() =>
                    clicarEquipe(
                      equipe,
                    )
                  }
                  onKeyDown={(
                    event,
                  ) => {

                    if (
                      event.key ===
                      'Enter' ||
                      event.key ===
                      ' '
                    ) {

                      event.preventDefault();

                      clicarEquipe(
                        equipe,
                      );

                    }

                  }}
                >

                  <CardEquipe
                    nome={
                      equipe.nome
                    }

                    modalidade={
                      equipe.modalidade
                    }

                    categoria={
                      equipe.categoria
                    }

                    atletas={
                      equipe.atletas
                    }

                    imagem={
                      equipe.imagem
                    }

                    icone={
                      equipe.icone
                    }

                    cor={
                      equipe.cor
                    }

                    vitorias={
                      equipe.vitorias
                    }

                    empates={
                      equipe.empates
                    }

                    derrotas={
                      equipe.derrotas
                    }

                    proximaPartida={
                      equipe.proximaPartida
                    }
                  />

                </div>

              ),
            )}

          </div>
        )}


        {!carregando &&
          equipesFiltradas.length ===
          0 && (
            <div
              style={{
                padding:
                  '50px 20px',
                textAlign:
                  'center',
                color:
                  '#ffffff',
              }}
            >
              <h3>
                Nenhuma equipe encontrada.
              </h3>

              <p>
                Cadastre uma nova equipe
                para começar.
              </p>
            </div>
          )}

      </main>


      <NovaEquipeModal
        open={
          modalNovaEquipe
        }

        modalidadeInicial={
          filtroAtivo ===
            'Todos'
            ? 'Futebol'
            : filtroAtivo
        }

        atletasDisponiveis={
          atletasDisponiveis
        }

        onClose={() =>
          setModalNovaEquipe(
            false,
          )
        }

        onCreate={
          adicionarEquipe
        }
      />


      <EditarEquipeModalInterno
        equipe={
          equipeEmEdicao
        }

        salvando={
          salvandoEdicao
        }

        onClose={() =>
          setEquipeEmEdicao(
            null,
          )
        }

        onSave={
          salvarEdicao
        }

        onDelete={
          excluirEquipe
        }
      />

    </>
  );
};


export default Equipes;