'use client';

import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';

type ViewType = 
  | 'home' 
  | 'marketplace' 
  | 'listing-detail' 
  | 'compare' 
  | 'create-listing' 
  | 'investors'
  | 'investor-profile'
  | 'knowledge-base' 
  | 'how-it-works' 
  | 'security' 
  | 'terms' 
  | 'privacy' 
  | 'risk-disclosure' 
  | 'login' 
  | 'signup' 
  | 'admin-login' 
  | 'admin'
  | 'profile'
  | 'reset-password' 
  | 'support' 
  | 'data-deletion';

interface NavigationContextType {
  currentView: ViewType;
  navigateTo: (view: ViewType) => void;
  selectedListingId: string | null;
  setSelectedListingId: (id: string | null) => void;
}

const NavigationContext = createContext<NavigationContextType | null>(null);

const NAV_KEY = 'gee_current_view';

// Helper to validate view type
const VALID_VIEWS: Set<string> = new Set([
  'home', 'marketplace', 'listing-detail', 'compare', 'create-listing',
  'investors', 'investor-profile', 'knowledge-base', 'how-it-works', 'security', 'terms', 'privacy',
  'risk-disclosure', 'login', 'signup', 'admin-login', 'admin',
  'profile', 'reset-password', 'support', 'data-deletion'
]);

function isValidView(view: string): boolean {
  return VALID_VIEWS.has(view);
}

// Lazy initializer function - runs only once on mount
function getInitialView(): ViewType {
  if (typeof window === 'undefined') return 'home';
  try {
    const stored = localStorage.getItem(NAV_KEY);
    if (stored && isValidView(stored)) {
      return stored as ViewType;
    }
  } catch {
    // Ignore errors
  }
  return 'home';
}

export function NavigationProvider({ children }: { children: ReactNode }) {
  // Use lazy initialization - the function is only called once on mount
  const [currentView, setCurrentView] = useState<ViewType>(getInitialView);
  const [selectedListingId, setSelectedListingId] = useState<string | null>(null);

  const navigateTo = useCallback((view: ViewType) => {
    setCurrentView(view);
    try {
      localStorage.setItem(NAV_KEY, view);
    } catch {
      // Ignore errors
    }
    // Scroll to top on navigation
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  return (
    <NavigationContext.Provider 
      value={{ 
        currentView, 
        navigateTo, 
        selectedListingId, 
        setSelectedListingId 
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  // During SSR/static generation, return a default context instead of throwing
  if (!context) {
    return {
      currentView: 'home' as ViewType,
      navigateTo: () => {},
      selectedListingId: null,
      setSelectedListingId: () => {},
    };
  }
  return context;
}

export type { ViewType };
