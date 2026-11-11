
import styles from './NovaPartidaModal.module.css';
import LoadingState from '../../components/ui/LoadingState/LoadingState';

type Equipe = {
  id: number;
  nome: string;
  modalidade: string;
};

type Atleta = {
  id: number;
  nome?: string | null;
  usuario?: {
    nome?: string | null;
  } | null;
};

type NovaPartidaModalProps = {
  aberto: boolean;
  salvando: boolean;

  equipes: Equipe[];
  equipeId: string;
  onEquipeChange: (valor: string) => void;
  modalidade: string;

  atletas: Atleta[];
  atletasSelecionados: number[];
  carregandoAtletas: boolean;
  erroAtletas: string;
  onAlternarAtleta: (atletaId: number) => void;

  adversario: string;
  onAdversarioChange: (valor: string) => void;

  data: string;
  onDataChange: (valor: string) => void;

  local: string;
  onLocalChange: (valor: string) => void;

  resultadoCasa: string;
  onResultadoCasaChange: (valor: string) => void;

  resultadoVisitante: string;
  onResultadoVisitanteChange: (valor: string) => void;

  onClose: () => void;
  onSubmit: () => void;
};

function nomeDoAtleta(atleta: Atleta) {
  return (
    atleta.nome ||
    atleta.usuario?.nome ||
    `Atleta #${atleta.id}`
  );
}

export default function NovaPartidaModal({
  aberto,
  salvando,
  equipes,
  equipeId,
  onEquipeChange,
  modalidade,
  atletas,
  atletasSelecionados,
  carregandoAtletas,
  erroAtletas,
  onAlternarAtleta,
  adversario,
  onAdversarioChange,
  data,
  onDataChange,
  local,
  onLocalChange,
  resultadoCasa,
  onResultadoCasaChange,
  resultadoVisitante,
  onResultadoVisitanteChange,
  onClose,
  onSubmit,
}: NovaPartidaModalProps) {
  if (!aberto) return null;

  return (
    <div
      className={styles.modalOverlay}
      onClick={onClose}
    >
      <div
        className={styles.modal}
        onClick={(event) => event.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <h3>Nova Partida</h3>

          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            disabled={salvando}
            aria-label="Fechar modal"
          >
            ×
          </button>
        </div>

        <div className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="equipePartida">
              Sua equipe
            </label>

            <select
              id="equipePartida"
              value={equipeId}
              onChange={(event) =>
                onEquipeChange(event.target.value)
              }
            >
              <option value="">Selecione</option>

              {equipes.map((equipe) => (
                <option
                  key={equipe.id}
                  value={String(equipe.id)}
                >
                  {equipe.nome}
                </option>
              ))}
            </select>
          </div>

          <section
            className={styles.athletePicker}
            aria-labelledby="athletes-heading"
          >
            <div className={styles.athletePickerHeader}>
              <div>
                <h4 id="athletes-heading">
                  Atletas que vão jogar
                </h4>

                <p>
                  Selecione os participantes desta partida.
                </p>
              </div>

              <span className={styles.athleteCount}>
                {atletasSelecionados.length} selecionado(s)
              </span>
            </div>

            {carregandoAtletas ? (
              <LoadingState variant="list" title="Carregando atletas da equipe..." count={4} />
            ) : erroAtletas ? (
              <p className={styles.athleteError}>
                {erroAtletas}
              </p>
            ) : atletas.length > 0 ? (
              <div className={styles.athleteList}>
                {atletas.map((atleta) => (
                  <label
                    className={styles.athleteOption}
                    key={atleta.id}
                  >
                    <input
                      type="checkbox"
                      checked={atletasSelecionados.includes(
                        atleta.id,
                      )}
                      onChange={() =>
                        onAlternarAtleta(atleta.id)
                      }
                    />

                    <span
                      className={styles.athleteAvatar}
                      aria-hidden="true"
                    >
                      {nomeDoAtleta(atleta)
                        .trim()
                        .charAt(0)
                        .toUpperCase()}
                    </span>

                    <span className={styles.athleteName}>
                      {nomeDoAtleta(atleta)}
                    </span>
                  </label>
                ))}
              </div>
            ) : (
              <p className={styles.athleteMessage}>
                Selecione uma equipe para carregar os atletas.
              </p>
            )}
          </section>

          <div className={styles.formGroup}>
            <label htmlFor="adversarioPartida">
              Equipe adversária
            </label>

            <input
              id="adversarioPartida"
              type="text"
              placeholder="Ex.: Tigres FC"
              value={adversario}
              onChange={(event) =>
                onAdversarioChange(event.target.value)
              }
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="modalidadePartida">
                Modalidade
              </label>

              <input
                id="modalidadePartida"
                type="text"
                readOnly
                value={modalidade}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="dataPartida">
                Data
              </label>

              <input
                id="dataPartida"
                type="date"
                value={data}
                onChange={(event) =>
                  onDataChange(event.target.value)
                }
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="localPartida">
              Local da partida
              <span className={styles.optionalLabel}>
                (opcional)
              </span>
            </label>

            <input
              id="localPartida"
              type="text"
              placeholder="Ex.: Ginásio Municipal de Osasco"
              value={local}
              onChange={(event) =>
                onLocalChange(event.target.value)
              }
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="golsEquipe">
                Placar da sua equipe
              </label>

              <input
                id="golsEquipe"
                type="number"
                min="0"
                step="1"
                placeholder="Ex.: 3"
                value={resultadoCasa}
                onChange={(event) =>
                  onResultadoCasaChange(event.target.value)
                }
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="golsAdversario">
                Placar adversário
              </label>

              <input
                id="golsAdversario"
                type="number"
                min="0"
                step="1"
                placeholder="Ex.: 1"
                value={resultadoVisitante}
                onChange={(event) =>
                  onResultadoVisitanteChange(event.target.value)
                }
              />
            </div>
          </div>
        </div>

        <div className={styles.modalActions}>
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
            onClick={onSubmit}
            disabled={salvando}
          >
            {salvando ? <LoadingState variant="inline" title="Criando partida..." /> : 'Criar partida'}
          </button>
        </div>
      </div>
    </div>
  );
}
