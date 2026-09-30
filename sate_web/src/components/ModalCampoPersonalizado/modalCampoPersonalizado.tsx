import { useEffect, useState } from 'react';

import {
  Activity,
  Check,
  CircleDot,
  Clock3,
  Goal,
  Hand,
  Plus,
  Shield,
  Target,
  Trophy,
  X,
  Zap,
} from 'lucide-react';

import type { LucideIcon } from 'lucide-react';

import styles from './modalCampoPersonalizado.module.css';

interface OpcaoIcone {
  id: string;
  nome: string;
  icon: LucideIcon;
}

interface ModalCampoPersonalizadoProps {
  open: boolean;

  camposExistentes: string[];

  onClose: () => void;

  onAdicionar: (
    nome: string,
    icone: LucideIcon,
  ) => void;
}

const opcoesIcones: OpcaoIcone[] = [
  {
    id: 'activity',
    nome: 'Ação',
    icon: Activity,
  },
  {
    id: 'zap',
    nome: 'Raio',
    icon: Zap,
  },
  {
    id: 'shield',
    nome: 'Escudo',
    icon: Shield,
  },
  {
    id: 'hand',
    nome: 'Mão',
    icon: Hand,
  },
  {
    id: 'target',
    nome: 'Alvo',
    icon: Target,
  },
  {
    id: 'trophy',
    nome: 'Troféu',
    icon: Trophy,
  },
  {
    id: 'goal',
    nome: 'Gol',
    icon: Goal,
  },
  {
    id: 'circle',
    nome: 'Bola',
    icon: CircleDot,
  },
  {
    id: 'clock',
    nome: 'Tempo',
    icon: Clock3,
  },
];

const normalizarTexto = (texto: string) =>
  texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();

export default function ModalCampoPersonalizado({
  open,
  camposExistentes,
  onClose,
  onAdicionar,
}: ModalCampoPersonalizadoProps) {
  const [nomeCampo, setNomeCampo] =
    useState('');

  const [erro, setErro] =
    useState('');

  const [iconeSelecionado, setIconeSelecionado] =
    useState('activity');

  useEffect(() => {
    if (!open) {
      return;
    }

    setNomeCampo('');
    setErro('');
    setIconeSelecionado('activity');

    const fecharComEsc = (
      event: KeyboardEvent,
    ) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener(
      'keydown',
      fecharComEsc,
    );

    return () => {
      document.removeEventListener(
        'keydown',
        fecharComEsc,
      );
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  const opcaoAtual =
    opcoesIcones.find(
      (opcao) =>
        opcao.id === iconeSelecionado,
    ) ?? opcoesIcones[0];

  const IconePreview =
    opcaoAtual.icon;

  const adicionarCampo = () => {
    const nome =
      nomeCampo.trim();

    if (!nome) {
      setErro(
        'Digite o nome do campo.',
      );

      return;
    }

    const duplicado =
      camposExistentes.some(
        (campo) =>
          normalizarTexto(campo) ===
          normalizarTexto(nome),
      );

    if (duplicado) {
      setErro(
        'Esse campo já existe.',
      );

      return;
    }

    /*
      AGORA MANDA O ÍCONE REAL
      PARA A TELA PRINCIPAL
    */
    onAdicionar(
      nome,
      opcaoAtual.icon,
    );

    setNomeCampo('');
    setErro('');
    setIconeSelecionado('activity');

    onClose();
  };

  return (
    <div
      className={styles.overlay}
      onMouseDown={onClose}
    >
      <div
        className={styles.modal}
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >
        {/* HEADER */}

        <div className={styles.header}>
          <div>
            <h2>
              Adicionar novo campo
            </h2>

            <p>
              Crie uma opção específica para sua análise.
            </p>
          </div>

          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Fechar"
          >
            <X size={23} />
          </button>
        </div>

        {/* CONTEÚDO */}

        <div className={styles.content}>
          {/* NOME */}

          <div className={styles.field}>
            <label htmlFor="campo-personalizado">
              Nome do campo
            </label>

            <input
              id="campo-personalizado"
              type="text"
              placeholder="Ex.: Bloqueio individual"
              value={nomeCampo}
              onChange={(event) => {
                setNomeCampo(
                  event.target.value,
                );

                setErro('');
              }}
              autoFocus
            />

            {erro && (
              <span className={styles.error}>
                {erro}
              </span>
            )}
          </div>

          {/* ÍCONES */}

          <div className={styles.iconSection}>
            <div
              className={
                styles.iconSectionHeader
              }
            >
              <div>
                <strong>
                  Escolha um ícone
                </strong>

                <span>
                  Selecione o símbolo que melhor representa esse campo.
                </span>
              </div>
            </div>

            <div className={styles.iconGrid}>
              {opcoesIcones.map((opcao) => {
                const Icon =
                  opcao.icon;

                const selecionado =
                  iconeSelecionado ===
                  opcao.id;

                return (
                  <button
                    key={opcao.id}
                    type="button"
                    className={`${styles.iconOption} ${
                      selecionado
                        ? styles.iconOptionSelected
                        : ''
                    }`}
                    onClick={() =>
                      setIconeSelecionado(
                        opcao.id,
                      )
                    }
                  >
                    {/* CHECK */}

                    {selecionado && (
                      <span
                        className={
                          styles.checkBadge
                        }
                      >
                        <Check
                          size={16}
                          strokeWidth={3}
                        />
                      </span>
                    )}

                    {/* ÍCONE */}

                    <div
                      className={
                        styles.iconBox
                      }
                    >
                      <Icon
                        size={24}
                        strokeWidth={2}
                      />
                    </div>

                    <span>
                      {opcao.nome}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* PREVIEW */}

          <div className={styles.preview}>
            <div
              className={
                styles.previewIcon
              }
            >
              <IconePreview
                size={24}
                strokeWidth={2}
              />
            </div>

            <div>
              <span>
                PRÉVIA
              </span>

              <strong>
                {nomeCampo.trim() ||
                  'Novo campo'}
              </strong>
            </div>
          </div>
        </div>

        {/* FOOTER */}

        <div className={styles.footer}>
          <button
            type="button"
            className={
              styles.cancelButton
            }
            onClick={onClose}
          >
            Cancelar
          </button>

          <button
            type="button"
            className={
              styles.addButton
            }
            onClick={
              adicionarCampo
            }
          >
            <Plus size={19} />

            Adicionar campo
          </button>
        </div>
      </div>
    </div>
  );
}