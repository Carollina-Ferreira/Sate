
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { useLocation } from 'react-router-dom';

type Tema = 'light' | 'dark';

interface ThemeContextType {
  tema: Tema;
  alternarTema: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);

export function ThemeProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { pathname } = useLocation();

  // As páginas públicas são sempre claras, independentemente da preferência salva.
  const paginasPublicas = new Set([
    '/', '/login', '/carregamento', '/cadastro',
    '/verificar-email', '/esqueci-senha', '/redefinir-senha',
  ]);
  const temaEfetivo = paginasPublicas.has(pathname) ? 'light' : null;

  const [tema, setTema] = useState<Tema>(() => {
    return localStorage.getItem('sate-tema') === 'dark'
      ? 'dark'
      : 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', temaEfetivo ?? tema);
  }, [tema, temaEfetivo]);

  useEffect(() => {
    localStorage.setItem('sate-tema', tema);
  }, [tema]);

  const alternarTema = () => {
    setTema((atual) =>
      atual === 'light' ? 'dark' : 'light'
    );
  };

  return (
    <ThemeContext.Provider value={{ tema, alternarTema }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const contexto = useContext(ThemeContext);

  if (!contexto) {
    throw new Error(
      'useTheme deve ser usado dentro de ThemeProvider.'
    );
  }

  return contexto;
}
