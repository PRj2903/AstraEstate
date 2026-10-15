import React, { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'royal' | 'obsidian';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  isObsidian: boolean;
  themeName: string;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'royal',
  setTheme: () => {},
  toggleTheme: () => {},
  isObsidian: false,
  themeName: 'Royal Ivory & Emerald',
});

const THEME_STORAGE_KEY = 'astrea_theme_preference';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'obsidian' || saved === 'royal') {
      return saved;
    }
    // Default to Royal Ivory & Emerald for warm heritage Indian luxury
    return 'royal';
  });

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    if (theme === 'obsidian') {
      root.classList.add('dark', 'theme-obsidian');
      root.classList.remove('theme-royal');
    } else {
      root.classList.remove('dark', 'theme-obsidian');
      root.classList.add('theme-royal');
    }
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'royal' ? 'obsidian' : 'royal'));
  };

  const isObsidian = theme === 'obsidian';
  const themeName = isObsidian ? 'Obsidian Nocturne' : 'Royal Ivory & Emerald';

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, isObsidian, themeName }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
