'use client';

import { useState, useCallback, useEffect } from 'react';

type Theme = 'light' | 'dark';

export function useTheme() {
  // Initialize state with the stored theme (lazy initializer runs once)
  const [theme, setThemeState] = useState<Theme>(() => {
    // Default to light for SSR
    if (typeof window === 'undefined') return 'light';
    
    try {
      const stored = localStorage.getItem('gee-theme') as Theme | null;
      if (stored) return stored;
      
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    } catch {
      // Ignore errors
    }
    return 'light';
  });

  // Apply theme to document whenever it changes
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    
    try {
      localStorage.setItem('gee-theme', theme);
    } catch {
      // Ignore errors
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setThemeState(prev => prev === 'light' ? 'dark' : 'light');
  }, []);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
  }, []);

  return { theme, setTheme, toggleTheme };
}
