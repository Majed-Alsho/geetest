'use client';

import { useState, useCallback, useEffect } from 'react';

type Theme = 'light' | 'dark';

export function useTheme() {
  // Always start with 'light' for SSR to avoid hydration mismatch
  const [theme, setThemeState] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  // After mount, read the actual theme from localStorage
  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem('gee-theme') as Theme | null;
      if (stored) {
        setThemeState(stored);
      } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setThemeState('dark');
      }
    } catch {
      // Ignore errors
    }
  }, []);

  // Apply theme to document whenever it changes
  useEffect(() => {
    if (!mounted) return;
    
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    
    try {
      localStorage.setItem('gee-theme', theme);
    } catch {
      // Ignore errors
    }
  }, [theme, mounted]);

  const toggleTheme = useCallback(() => {
    setThemeState(prev => prev === 'light' ? 'dark' : 'light');
  }, []);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
  }, []);

  return { theme, setTheme, toggleTheme, mounted };
}
