
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

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
  const [tema, setTema] = useState<Tema>(() => {
    return localStorage.getItem('sate-tema') === 'dark'
      ? 'dark'
      : 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', tema);
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
