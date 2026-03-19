'use client';

import { createContext, useContext, ReactNode, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';

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
  | 'data-deletion'
  | 'compare-listings';

// Map view types to actual routes
const viewToRoute: Record<string, string> = {
  'home': '/',
  'marketplace': '/marketplace',
  'listing-detail': '/listings',  // Will need ID appended
  'compare': '/compare',
  'create-listing': '/create-listing',
  'investors': '/investors',
  'investor-profile': '/investors',  // Will need ID appended
  'knowledge-base': '/knowledge-base',
  'how-it-works': '/how-it-works',
  'security': '/security',
  'terms': '/terms',
  'privacy': '/privacy',
  'risk-disclosure': '/risk-disclosure',
  'login': '/login',
  'signup': '/signup',
  'admin-login': '/admin-login',
  'admin': '/admin',
  'profile': '/profile',
  'reset-password': '/reset-password',
  'support': '/support',
  'data-deletion': '/data-deletion',
  'compare-listings': '/compare',
};

interface NavigationContextType {
  currentView: ViewType;
  navigateTo: (view: ViewType) => void;
  selectedListingId: string | null;
  setSelectedListingId: (id: string | null) => void;
}

const NavigationContext = createContext<NavigationContextType | null>(null);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  
  // Derive current view from pathname
  const getCurrentView = (): ViewType => {
    if (pathname === '/') return 'home';
    const path = pathname.split('/')[1];
    return (path as ViewType) || 'home';
  };
  
  // Simple state for selected listing
  let selectedListingId: string | null = null;
  
  const navigateTo = useCallback((view: ViewType) => {
    const route = viewToRoute[view] || '/';
    router.push(route);
  }, [router]);
  
  const setSelectedListingId = useCallback((id: string | null) => {
    selectedListingId = id;
  }, []);
  
  return (
    <NavigationContext.Provider 
      value={{ 
        currentView: getCurrentView(), 
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
  if (!context) {
    // Return a default context for SSR/SSG
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
