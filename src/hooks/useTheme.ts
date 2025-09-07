import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

const THEME_KEY = 'devnotes_theme';

export const useTheme = () => {
  const getSystemTheme = (): Theme =>
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

  const readStoredTheme = (): Theme | null => {
    try {
      const t = localStorage.getItem(THEME_KEY);
      return t === 'dark' || t === 'light' ? t : null;
    } catch {
      return null;
    }
  };

  const [theme, setTheme] = useState<Theme>(() => readStoredTheme() ?? getSystemTheme());

  useEffect(() => {
    const apply = (t: Theme) => {
      document.documentElement.classList.toggle('dark', t === 'dark');
      try { localStorage.setItem(THEME_KEY, t); } catch {}
    };
    apply(theme);

    // Watch system theme changes if user hasn't explicitly chosen
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => {
      if (!readStoredTheme()) {
        const sys = media.matches ? 'dark' : 'light';
        setTheme(sys);
      }
    };
    media.addEventListener?.('change', onChange);
    return () => media.removeEventListener?.('change', onChange);
  }, [theme]);

  const toggle = () => setTheme(t => (t === 'dark' ? 'light' : 'dark'));

  return { theme, toggle };
};


