'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { Listing } from '@/lib/data';

interface CompareContextType {
  compareListings: Listing[];
  addToCompare: (listing: Listing) => boolean;
  removeFromCompare: (listingId: string) => void;
  clearCompare: () => void;
  isInCompare: (listingId: string) => boolean;
  canAddMore: boolean;
  maxCompare: number;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

const MAX_COMPARE = 4;

// Default context for when CompareProvider is not available (SSR/build time)
const defaultCompareContext: CompareContextType = {
  compareListings: [],
  addToCompare: () => false,
  removeFromCompare: () => {},
  clearCompare: () => {},
  isInCompare: () => false,
  canAddMore: true,
  maxCompare: MAX_COMPARE,
};

export function CompareProvider({ children }: { children: ReactNode }) {
  const [compareListings, setCompareListings] = useState<Listing[]>([]);

  const addToCompare = (listing: Listing): boolean => {
    if (compareListings.length >= MAX_COMPARE) {
      return false;
    }
    if (compareListings.some(l => l.id === listing.id)) {
      return false;
    }
    setCompareListings(prev => [...prev, listing]);
    return true;
  };

  const removeFromCompare = (listingId: string) => {
    setCompareListings(prev => prev.filter(l => l.id !== listingId));
  };

  const clearCompare = () => {
    setCompareListings([]);
  };

  const isInCompare = (listingId: string): boolean => {
    return compareListings.some(l => l.id === listingId);
  };

  return (
    <CompareContext.Provider
      value={{
        compareListings,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isInCompare,
        canAddMore: compareListings.length < MAX_COMPARE,
        maxCompare: MAX_COMPARE,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  // During SSR/static generation, return a default context instead of throwing
  if (context === undefined) {
    return {
      compareListings: [],
      addToCompare: () => false,
      removeFromCompare: () => {},
      clearCompare: () => {},
      isInCompare: () => false,
      canAddMore: true,
      maxCompare: MAX_COMPARE,
    };
  }
  return context;
}
