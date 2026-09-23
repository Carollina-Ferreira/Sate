import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import type { LucideIcon } from 'lucide-react';

import {
  Activity,
  ArrowLeft,
  ArrowRight,
  Check,
  CircleDot,
  Clock3,
  Goal,
  Hand,
  Plus,
  Shield,
  Target,
  Timer,
  Trophy,
  Zap,
} from 'lucide-react';

import ModalCampoPersonalizado from '../../components/ModalCampoPersonalizado/modalCampoPersonalizado';

import styles from './configuracaoAnalise.module.css';

interface CampoAnalise {
  id: string;
  nome: string;
  icon: LucideIcon;
}

interface EstadoSelecaoEsporte {
  modalidade?: string;
  imagem?: string;
}

const camposPorEsporte: Record<string, CampoAnalise[]> = {
  Futebol: [
    {
      id: 'gol',
      nome: 'Gol',
      icon: Goal,
    },
    {
      id: 'finalizacao',
      nome: 'Finalização',
      icon: Target,
    },
    {
      id: 'passe',
      nome: 'Passe',
      icon: CircleDot,
    },
    {
      id: 'assistencia',
      nome: 'Assistência',
      icon: Zap,
    },
    {
      id: 'desarme',
      nome: 'Desarme',
      icon: Shield,
    },
    {
      id: 'interceptacao',
      nome: 'Interceptação',
      icon: Activity,
    },
    {
      id: 'falta',
      nome: 'Falta',
      icon: Hand,
    },
    {
      id: 'cartao',
      nome: 'Cartão',
      icon: Shield,
    },
    {
      id: 'escanteio',
      nome: 'Escanteio',
      icon: Target,
    },
    {
      id: 'defesa-goleiro',
      nome: 'Defesa do goleiro',
      icon: Shield,
    },
  ],

  Basquete: [
    {
      id: 'cesta-2',
      nome: 'Cesta de 2 pontos',
      icon: Target,
    },
    {
      id: 'cesta-3',
      nome: 'Cesta de 3 pontos',
      icon: Target,
    },
    {
      id: 'lance-livre',
      nome: 'Lance livre',
      icon: CircleDot,
    },
    {
      id: 'assistencia',
      nome: 'Assistência',
      icon: Zap,
    },
    {
      id: 'rebote-ofensivo',
      nome: 'Rebote ofensivo',
      icon: Activity,
    },
    {
      id: 'rebote-defensivo',
      nome: 'Rebote defensivo',
      icon: Shield,
    },
    {
      id: 'roubo-bola',
      nome: 'Roubo de bola',
      icon: Hand,
    },
    {
      id: 'toco',
      nome: 'Bloqueio / Toco',
      icon: Shield,
    },
    {
      id: 'falta',
      nome: 'Falta',
      icon: Hand,
    },
    {
      id: 'turnover',
      nome: 'Perda de bola',
      icon: Activity,
    },
  ],

  Vôlei: [
    {
      id: 'saque',
      nome: 'Saque',
      icon: Target,
    },
    {
      id: 'ace',
      nome: 'Ace',
      icon: Trophy,
    },
    {
      id: 'recepcao',
      nome: 'Recepção',
      icon: Hand,
    },
    {
      id: 'levantamento',
      nome: 'Levantamento',
      icon: Activity,
    },
    {
      id: 'ataque',
      nome: 'Ataque',
      icon: Zap,
    },
    {
      id: 'ponto-ataque',
      nome: 'Ponto de ataque',
      icon: Trophy,
    },
    {
      id: 'bloqueio',
      nome: 'Bloqueio',
      icon: Shield,
    },
    {
      id: 'defesa',
      nome: 'Defesa',
      icon: Shield,
    },
    {
      id: 'erro-saque',
      nome: 'Erro de saque',
      icon: Target,
    },
    {
      id: 'erro-ataque',
      nome: 'Erro de ataque',
      icon: Activity,
    },
  ],

  Handebol: [
    {
      id: 'gol',
      nome: 'Gol',
      icon: Goal,
    },
    {
      id: 'finalizacao',
      nome: 'Finalização',
      icon: Target,
    },
    {
      id: 'assistencia',
      nome: 'Assistência',
      icon: Zap,
    },
    {
      id: 'defesa-goleiro',
      nome: 'Defesa do goleiro',
      icon: Shield,
    },
    {
      id: 'passe',
      nome: 'Passe',
      icon: CircleDot,
    },
    {
      id: 'roubo',
      nome: 'Roubo de bola',
      icon: Hand,
    },
    {
      id: 'bloqueio',
      nome: 'Bloqueio',
      icon: Shield,
    },
    {
      id: 'falta',
      nome: 'Falta',
      icon: Hand,
    },
    {
      id: 'exclusao',
      nome: 'Exclusão de 2 minutos',
      icon: Clock3,
    },
    {
      id: 'sete-metros',
      nome: 'Tiro de 7 metros',
      icon: Target,
    },
  ],

  Rugby: [
    {
      id: 'try',
      nome: 'Try',
      icon: Trophy,
    },
    {
      id: 'conversao',
      nome: 'Conversão',
      icon: Target,
    },
    {
      id: 'passe',
      nome: 'Passe',
      icon: CircleDot,
    },
    {
      id: 'tackle',
      nome: 'Tackle',
      icon: Shield,
    },
    {
      id: 'quebra-tackle',
      nome: 'Quebra de tackle',
      icon: Zap,
    },
    {
      id: 'penalidade',
      nome: 'Penalidade',
      icon: Hand,
    },
    {
      id: 'scrum',
      nome: 'Scrum',
      icon: Activity,
    },
    {
      id: 'line-out',
      nome: 'Line-out',
      icon: Activity,
    },
    {
      id: 'turnover',
      nome: 'Turnover',
      icon: CircleDot,
    },
    {
      id: 'drop-goal',
      nome: 'Drop goal',
      icon: Goal,
    },
  ],

  Natação: [
    {
      id: 'tempo-total',
      nome: 'Tempo total',
      icon: Timer,
    },
    {
      id: 'tempo-volta',
      nome: 'Tempo por volta',
      icon: Clock3,
    },
    {
      id: 'parcial',
      nome: 'Tempo parcial',
      icon: Timer,
    },
    {
      id: 'velocidade-media',
      nome: 'Velocidade média',
      icon: Zap,
    },
    {
      id: 'bracadas',
      nome: 'Número de braçadas',
      icon: Activity,
    },
    {
      id: 'frequencia',
      nome: 'Frequência de braçadas',
      icon: Activity,
    },
    {
      id: 'distancia-bracada',
      nome: 'Distância por braçada',
      icon: Target,
    },
    {
      id: 'reacao',
      nome: 'Tempo de reação',
      icon: Clock3,
    },
    {
      id: 'virada',
      nome: 'Virada',
      icon: Activity,
    },
    {
      id: 'chegada',
      nome: 'Chegada',
      icon: Trophy,
    },
  ],

  Atletismo: [
    {
      id: 'tempo',
      nome: 'Tempo',
      icon: Timer,
    },
    {
      id: 'distancia',
      nome: 'Distância',
      icon: Target,
    },
    {
      id: 'velocidade',
      nome: 'Velocidade',
      icon: Zap,
    },
    {
      id: 'valida',
      nome: 'Tentativa válida',
      icon: Trophy,
    },
    {
      id: 'invalida',
      nome: 'Tentativa inválida',
      icon: Activity,
    },
    {
      id: 'melhor-marca',
      nome: 'Melhor marca',
      icon: Trophy,
    },
    {
      id: 'tempo-parcial',
      nome: 'Tempo parcial',
      icon: Clock3,
    },
    {
      id: 'largada',
      nome: 'Largada',
      icon: Zap,
    },
    {
      id: 'salto',
      nome: 'Salto',
      icon: Activity,
    },
    {
      id: 'lancamento',
      nome: 'Arremesso / Lançamento',
      icon: Target,
    },
  ],

  Tênis: [
    {
      id: 'ace',
      nome: 'Ace',
      icon: Trophy,
    },
    {
      id: 'dupla-falta',
      nome: 'Dupla falta',
      icon: Activity,
    },
    {
      id: 'primeiro-saque',
      nome: 'Primeiro saque',
      icon: Target,
    },
    {
      id: 'segundo-saque',
      nome: 'Segundo saque',
      icon: Target,
    },
    {
      id: 'winner',
      nome: 'Winner',
      icon: Trophy,
    },
    {
      id: 'erro-nao-forcado',
      nome: 'Erro não forçado',
      icon: Activity,
    },
    {
      id: 'break-point',
      nome: 'Break point',
      icon: Zap,
    },
    {
      id: 'ponto-saque',
      nome: 'Ponto de saque',
      icon: Target,
    },
    {
      id: 'devolucao',
      nome: 'Ponto de devolução',
      icon: CircleDot,
    },
    {
      id: 'volley',
      nome: 'Volley',
      icon: Hand,
    },
  ],
};

const normalizarTexto = (texto: string) =>
  texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();

const criarId = (nome: string) =>
  normalizarTexto(nome)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

export default function ConfiguracaoAnalise() {
  const navigate = useNavigate();
  const location = useLocation();

  const state =
    location.state as EstadoSelecaoEsporte | null;

  const modalidade =
    state?.modalidade ||
    sessionStorage.getItem('sate-modalidade') ||
    'Futebol';

  const imagemEsporte =
    state?.imagem ||
    sessionStorage.getItem('sate-imagem-esporte') ||
    '';

  const camposIniciais =
    useMemo(() => {
      return (
        camposPorEsporte[modalidade] ??
        camposPorEsporte.Futebol
      );
    }, [modalidade]);

  const [
    camposPersonalizados,
    setCamposPersonalizados,
  ] = useState<CampoAnalise[]>([]);

  const [
    selecionados,
    setSelecionados,
  ] = useState<string[]>([]);

  const [
    modalAberto,
    setModalAberto,
  ] = useState(false);

  const todosCampos =
    useMemo(
      () => [
        ...camposIniciais,
        ...camposPersonalizados,
      ],
      [
        camposIniciais,
        camposPersonalizados,
      ],
    );

  const alternarCampo = (
    id: string,
  ) => {
    setSelecionados(
      (atual) =>
        atual.includes(id)
          ? atual.filter(
              (campoId) =>
                campoId !== id,
            )
          : [
              ...atual,
              id,
            ],
    );
  };

  const adicionarCampoPersonalizado = (
    nome: string,
    icone: LucideIcon,
  ) => {
    const id =
      `personalizado-${criarId(nome)}-${Date.now()}`;

    const novoCampo: CampoAnalise = {
      id,
      nome,
      icon: icone,
    };

    setCamposPersonalizados(
      (atual) => [
        ...atual,
        novoCampo,
      ],
    );

    setSelecionados(
      (atual) => [
        ...atual,
        id,
      ],
    );
  };

  const voltar = () => {
    navigate('/selecao-esporte');
  };

  const proximo = () => {
    if (
      selecionados.length === 0
    ) {
      return;
    }

    const camposSelecionados =
      todosCampos
        .filter((campo) =>
          selecionados.includes(
            campo.id,
          ),
        )
        .map(
          (campo) =>
            campo.nome,
        );

    sessionStorage.setItem(
      'sate-campos-analise',
      JSON.stringify(
        camposSelecionados,
      ),
    );

    navigate('/configuracao-equipe', {
      state: {
        modalidade,
        imagem: imagemEsporte,
      },
    });
  };

  return (
    <main
      className={styles.page}
      style={
        imagemEsporte
          ? {
              backgroundImage: `
                linear-gradient(
                  rgba(0, 55, 42, 0.84),
                  rgba(0, 55, 42, 0.91)
                ),
                url(${imagemEsporte})
              `,
            }
          : undefined
      }
    >
      <div
        className={
          styles.container
        }
      >
        {/* PROGRESSO */}

        <div
          className={
            styles.progressArea
          }
        >
          <div
            className={
              styles.stepBadge
            }
          >
            Etapa 2 de 4 · Configuração da análise
          </div>

          <div
            className={
              styles.progressSteps
            }
          >
            <div
              className={
                styles.progressComplete
              }
            />

            <div
              className={
                styles.progressActive
              }
            />

            <div
              className={
                styles.progressInactive
              }
            />

            <div
              className={
                styles.progressInactive
              }
            />
          </div>
        </div>

        {/* CABEÇALHO */}

        <section
          className={
            styles.header
          }
        >
          <span
            className={
              styles.sportBadge
            }
          >
            {modalidade}
          </span>

          <h1>
            Quais campos você quer acompanhar?
          </h1>

          <p>
            Selecione os principais campos que deseja
            acompanhar nas análises de{' '}
            <strong>
              {modalidade}
            </strong>
            . Você pode escolher somente as informações
            que fazem sentido para sua equipe.
          </p>
        </section>

        {/* CAMPOS */}

        <section
          className={
            styles.fieldsGrid
          }
        >
          {todosCampos.map(
            (campo) => {
              const Icon =
                campo.icon;

              const selecionado =
                selecionados.includes(
                  campo.id,
                );

              return (
                <button
                  key={
                    campo.id
                  }
                  type="button"
                  className={`${styles.fieldCard} ${
                    selecionado
                      ? styles.fieldCardSelected
                      : ''
                  }`}
                  onClick={() =>
                    alternarCampo(
                      campo.id,
                    )
                  }
                >
                  {/* BOLINHA DE SELEÇÃO */}

                  <span
                    className={`${styles.checkbox} ${
                      selecionado
                        ? styles.checkboxSelected
                        : ''
                    }`}
                  >
                    {selecionado && (
                      <Check
                        size={18}
                        strokeWidth={3}
                      />
                    )}
                  </span>

                  {/* NOME */}

                  <span
                    className={
                      styles.fieldName
                    }
                  >
                    {campo.nome}
                  </span>

                  {/* ÍCONE DIREITA */}

                  <span
                    className={
                      styles.fieldIcon
                    }
                  >
                    <Icon
                      size={24}
                      strokeWidth={2}
                    />
                  </span>
                </button>
              );
            },
          )}

          {/* ADICIONAR */}

          <button
            type="button"
            className={
              styles.addField
            }
            onClick={() =>
              setModalAberto(
                true,
              )
            }
          >
            <div
              className={
                styles.addIcon
              }
            >
              <Plus
                size={21}
              />
            </div>

            <div
              className={
                styles.addText
              }
            >
              <strong>
                Adicionar campo
              </strong>

              <span>
                Criar opção personalizada
              </span>
            </div>
          </button>
        </section>

        {/* FOOTER */}

        <footer
          className={
            styles.footer
          }
        >
          <button
            type="button"
            className={
              styles.backButton
            }
            onClick={
              voltar
            }
          >
            <ArrowLeft
              size={22}
            />

            Voltar
          </button>

          <div
            className={
              styles.footerRight
            }
          >
            {selecionados.length >
              0 && (
              <span
                className={
                  styles.selectedCounter
                }
              >
                {
                  selecionados.length
                }{' '}
                {selecionados.length ===
                1
                  ? 'campo selecionado'
                  : 'campos selecionados'}
              </span>
            )}

            <button
              type="button"
              className={
                styles.nextButton
              }
              disabled={
                selecionados.length ===
                0
              }
              onClick={
                proximo
              }
            >
              Próximo

              <ArrowRight
                size={21}
              />
            </button>
          </div>
        </footer>
      </div>

      {/* MODAL */}

      <ModalCampoPersonalizado
        open={
          modalAberto
        }
        camposExistentes={
          todosCampos.map(
            (campo) =>
              campo.nome,
          )
        }
        onClose={() =>
          setModalAberto(
            false,
          )
        }
        onAdicionar={
          adicionarCampoPersonalizado
        }
      />
    </main>
  );
}