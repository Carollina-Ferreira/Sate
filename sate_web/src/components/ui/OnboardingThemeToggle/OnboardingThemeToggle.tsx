import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import styles from './OnboardingThemeToggle.module.css';

/** Alterna o tema do sistema inteiro; a preferência já é persistida pelo ThemeProvider. */
export default function OnboardingThemeToggle() {
  const { tema, alternarTema } = useTheme();
  const escuro = tema === 'dark';

  return (
    <button
      className={styles.toggle}
      type="button"
      onClick={alternarTema}
      aria-label={escuro ? 'Ativar modo claro' : 'Ativar modo escuro'}
      title={escuro ? 'Modo claro' : 'Modo escuro'}
      aria-pressed={escuro}
    >
      {escuro ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
      <span>{escuro ? 'Modo claro' : 'Modo escuro'}</span>
    </button>
  );
}
