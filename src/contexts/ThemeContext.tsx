import React, { createContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark';
type ThemePreference = 'system' | Theme;

interface ThemeContextType {
  theme: Theme; // 实际生效的主题
  preference: ThemePreference; // 用户偏好（含 system）
  toggleTheme: () => void; // 循环切换：light -> dark -> system -> light
  setThemePreference: (pref: ThemePreference) => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const getSystemTheme = (): Theme =>
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';

  // 读取偏好，兼容旧 key
  const [preference, setPreference] = useState<ThemePreference>(() => {
    const savedPref = localStorage.getItem('themePreference') as ThemePreference | null;
    const legacyTheme = localStorage.getItem('theme') as Theme | null;
    return savedPref || (legacyTheme ? legacyTheme : 'system');
  });

  const [theme, setTheme] = useState<Theme>(() => (preference === 'system' ? getSystemTheme() : preference));

  // 应用主题并持久化
  useEffect(() => {
    const effective: Theme = preference === 'system' ? getSystemTheme() : preference;
    setTheme(effective);

    const root = window.document.documentElement;
    if (effective === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');

    localStorage.setItem('themePreference', preference);
    // legacy 同步
    localStorage.setItem('theme', effective);
  }, [preference]);

  // 跟随系统变化（当 preference === 'system'）
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (preference === 'system') {
        const effective = getSystemTheme();
        setTheme(effective);
        const root = window.document.documentElement;
        if (effective === 'dark') root.classList.add('dark');
        else root.classList.remove('dark');
        localStorage.setItem('theme', effective);
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [preference]);

  const toggleTheme = () => {
    setPreference(prev => (prev === 'light' ? 'dark' : prev === 'dark' ? 'system' : 'light'));
  };

  const setThemePreference = (pref: ThemePreference) => setPreference(pref);

  return (
    <ThemeContext.Provider value={{ theme, preference, toggleTheme, setThemePreference }}>
      {children}
    </ThemeContext.Provider>
  );
};

