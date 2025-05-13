import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDarkMode: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const router = useRouter();

  
  useEffect(() => {
    
    const savedTheme = localStorage.getItem('theme') as Theme || 'light';
    setTheme(savedTheme);

    
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(savedTheme === 'dark' || (savedTheme === 'system' && prefersDarkMode));

    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (theme === 'system') {
        setIsDarkMode(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', theme);

      const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const shouldApplyDark = theme === 'dark' || (theme === 'system' && prefersDarkMode);
      
      setIsDarkMode(shouldApplyDark);
      
      if (shouldApplyDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        isDarkMode
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

