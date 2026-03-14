'use client';

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import {
  WatchlistItem,
  PriceAlert,
  WatchlistStats,
  PriceHistory,
  AlertCondition,
} from '@/types/watchlist';
import { Listing } from '@/types';

interface WatchlistContextType {
  items: WatchlistItem[];
  stats: WatchlistStats;
  priceHistories: PriceHistory[];
  
  // Watchlist Actions
  addToWatchlist: (listingId: string, notes?: string) => void;
  removeFromWatchlist: (listingId: string) => void;
  updateNotes: (listingId: string, notes: string) => void;
  isInWatchlist: (listingId: string) => boolean;
  
  // Price Alert Actions
  addPriceAlert: (listingId: string, condition: AlertCondition, value: number) => void;
  removePriceAlert: (listingId: string, alertId: string) => void;
  updatePriceAlert: (listingId: string, alertId: string, updates: Partial<PriceAlert>) => void;
  getAlertsForListing: (listingId: string) => PriceAlert[];
  
  // Simulated Price Updates (for demo)
  checkPriceAlerts: (listings: Listing[]) => PriceAlert[];
  
  // Stats
  getWatchlistStats: () => WatchlistStats;
}

const WatchlistContext = createContext<WatchlistContextType | null>(null);

const WATCHLIST_KEY = 'gee_watchlist';
const PRICE_HISTORY_KEY = 'gee_price_history';

function getStoredData<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function saveData<T>(key: string, data: T) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Failed to save ${key}:`, e);
  }
}

export function WatchlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [priceHistories, setPriceHistories] = useState<PriceHistory[]>([]);

  // Load data on mount
  useEffect(() => {
    const storedItems = getStoredData<WatchlistItem[]>(WATCHLIST_KEY, []);
    const storedHistories = getStoredData<PriceHistory[]>(PRICE_HISTORY_KEY, []);
    
    // Parse dates
    const parsedItems = storedItems.map(item => ({
      ...item,
      addedAt: new Date(item.addedAt),
      lastChecked: new Date(item.lastChecked),
      priceAlerts: item.priceAlerts.map(alert => ({
        ...alert,
        createdAt: new Date(alert.createdAt),
        triggeredAt: alert.triggeredAt ? new Date(alert.triggeredAt) : undefined,
      })),
    }));
    
    const parsedHistories = storedHistories.map(history => ({
      ...history,
      prices: history.prices.map(p => ({
        ...p,
        recordedAt: new Date(p.recordedAt),
      })),
    }));
    
    setItems(parsedItems);
    setPriceHistories(parsedHistories);
  }, []);

  const addToWatchlist = useCallback((listingId: string, notes?: string) => {
    setItems(prev => {
      if (prev.some(item => item.listingId === listingId)) {
        return prev;
      }
      
      const newItem: WatchlistItem = {
        id: `watch-${Date.now()}`,
        userId: 'current-user',
        listingId,
        addedAt: new Date(),
        notes,
        priceAlerts: [],
        lastPrice: 0,
        lastChecked: new Date(),
      };
      
      const updated = [...prev, newItem];
      saveData(WATCHLIST_KEY, updated);
      return updated;
    });
  }, []);

  const removeFromWatchlist = useCallback((listingId: string) => {
    setItems(prev => {
      const updated = prev.filter(item => item.listingId !== listingId);
      saveData(WATCHLIST_KEY, updated);
      return updated;
    });
  }, []);

  const updateNotes = useCallback((listingId: string, notes: string) => {
    setItems(prev => {
      const updated = prev.map(item =>
        item.listingId === listingId ? { ...item, notes } : item
      );
      saveData(WATCHLIST_KEY, updated);
      return updated;
    });
  }, []);

  const isInWatchlist = useCallback((listingId: string) => {
    return items.some(item => item.listingId === listingId);
  }, [items]);

  const addPriceAlert = useCallback((listingId: string, condition: AlertCondition, value: number) => {
    setItems(prev => {
      const updated = prev.map(item => {
        if (item.listingId !== listingId) return item;
        
        const newAlert: PriceAlert = {
          id: `alert-${Date.now()}`,
          type: condition,
          targetValue: value,
          percentageThreshold: condition === 'percentage_drop' ? value : undefined,
          triggered: false,
          createdAt: new Date(),
          notificationSent: false,
        };
        
        return {
          ...item,
          priceAlerts: [...item.priceAlerts, newAlert],
        };
      });
      
      saveData(WATCHLIST_KEY, updated);
      return updated;
    });
  }, []);

  const removePriceAlert = useCallback((listingId: string, alertId: string) => {
    setItems(prev => {
      const updated = prev.map(item => {
        if (item.listingId !== listingId) return item;
        
        return {
          ...item,
          priceAlerts: item.priceAlerts.filter(alert => alert.id !== alertId),
        };
      });
      
      saveData(WATCHLIST_KEY, updated);
      return updated;
    });
  }, []);

  const updatePriceAlert = useCallback((listingId: string, alertId: string, updates: Partial<PriceAlert>) => {
    setItems(prev => {
      const updated = prev.map(item => {
        if (item.listingId !== listingId) return item;
        
        return {
          ...item,
          priceAlerts: item.priceAlerts.map(alert =>
            alert.id === alertId ? { ...alert, ...updates } : alert
          ),
        };
      });
      
      saveData(WATCHLIST_KEY, updated);
      return updated;
    });
  }, []);

  const getAlertsForListing = useCallback((listingId: string) => {
    const item = items.find(i => i.listingId === listingId);
    return item?.priceAlerts || [];
  }, [items]);

  const checkPriceAlerts = useCallback((listings: Listing[]): PriceAlert[] => {
    const triggeredAlerts: PriceAlert[] = [];
    
    setItems(prev => {
      const updated = prev.map(item => {
        const listing = listings.find(l => l.id === item.listingId);
        if (!listing) return item;
        
        const currentPrice = listing.price;
        const previousPrice = item.lastPrice || currentPrice;
        
        // Update price history
        setPriceHistories(histories => {
          const existingHistory = histories.find(h => h.listingId === item.listingId);
          const newEntry = {
            price: currentPrice,
            recordedAt: new Date(),
            source: 'alert_check' as const,
          };
          
          let updatedHistories: PriceHistory[];
          if (existingHistory) {
            updatedHistories = histories.map(h =>
              h.listingId === item.listingId
                ? { ...h, prices: [...h.prices, newEntry].slice(-30) }
                : h
            );
          } else {
            updatedHistories = [...histories, { listingId: item.listingId, prices: [newEntry] }];
          }
          
          saveData(PRICE_HISTORY_KEY, updatedHistories);
          return updatedHistories;
        });
        
        // Check each alert
        const updatedAlerts = item.priceAlerts.map(alert => {
          if (alert.triggered) return alert;
          
          let shouldTrigger = false;
          
          switch (alert.type) {
            case 'drop_below':
              shouldTrigger = currentPrice < alert.targetValue;
              break;
            case 'rise_above':
              shouldTrigger = currentPrice > alert.targetValue;
              break;
            case 'percentage_drop':
              if (previousPrice > 0) {
                const dropPercent = ((previousPrice - currentPrice) / previousPrice) * 100;
                shouldTrigger = dropPercent >= (alert.percentageThreshold || 0);
              }
              break;
            case 'any_change':
              shouldTrigger = currentPrice !== previousPrice && previousPrice > 0;
              break;
          }
          
          if (shouldTrigger) {
            triggeredAlerts.push({ ...alert, triggered: true, triggeredAt: new Date() });
            return { ...alert, triggered: true, triggeredAt: new Date() };
          }
          
          return alert;
        });
        
        return {
          ...item,
          lastPrice: currentPrice,
          lastChecked: new Date(),
          priceAlerts: updatedAlerts,
        };
      });
      
      saveData(WATCHLIST_KEY, updated);
      return updated;
    });
    
    return triggeredAlerts;
  }, []);

  const getWatchlistStats = useCallback((): WatchlistStats => {
    const activeAlerts = items.reduce(
      (sum, item) => sum + item.priceAlerts.filter(a => !a.triggered).length,
      0
    );
    
    const triggeredAlerts = items.reduce(
      (sum, item) => sum + item.priceAlerts.filter(a => a.triggered).length,
      0
    );
    
    // Calculate value changes (simulated)
    const totalValueChange = items.reduce((sum, item) => {
      if (item.lastPrice === 0) return sum;
      return sum + (Math.random() - 0.5) * item.lastPrice * 0.1;
    }, 0);
    
    const averagePriceChange = items.length > 0
      ? (Math.random() - 0.5) * 10 // Simulated percentage change
      : 0;
    
    return {
      totalItems: items.length,
      activeAlerts,
      triggeredAlerts,
      totalValueChange,
      averagePriceChange,
    };
  }, [items]);

  const stats = getWatchlistStats();

  return (
    <WatchlistContext.Provider
      value={{
        items,
        stats,
        priceHistories,
        addToWatchlist,
        removeFromWatchlist,
        updateNotes,
        isInWatchlist,
        addPriceAlert,
        removePriceAlert,
        updatePriceAlert,
        getAlertsForListing,
        checkPriceAlerts,
        getWatchlistStats,
      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlist() {
  const context = useContext(WatchlistContext);
  if (!context) {
    return {
      items: [],
      stats: { totalItems: 0, activeAlerts: 0, triggeredAlerts: 0, totalValueChange: 0, averagePriceChange: 0 },
      priceHistories: [],
      addToWatchlist: () => {},
      removeFromWatchlist: () => {},
      updateNotes: () => {},
      isInWatchlist: () => false,
      addPriceAlert: () => {},
      removePriceAlert: () => {},
      updatePriceAlert: () => {},
      getAlertsForListing: () => [],
      checkPriceAlerts: () => [],
      getWatchlistStats: () => ({ totalItems: 0, activeAlerts: 0, triggeredAlerts: 0, totalValueChange: 0, averagePriceChange: 0 }),
    };
  }
  return context;
}
