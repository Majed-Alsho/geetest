'use client';

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import {
  EarningRecord,
  EarningSource,
  EarningsStats,
  EARNING_SOURCE_LABELS,
} from '@/types/earnings';

interface EarningsContextType {
  earnings: EarningRecord[];
  stats: EarningsStats;
  isLoading: boolean;
  
  // Actions
  addEarning: (earning: {
    amount: number;
    source: EarningSource;
    description: string;
    listingId?: string;
    listingTitle?: string;
    userId?: string;
    userName?: string;
    adId?: string;
    metadata?: Record<string, any>;
  }) => EarningRecord;
  
  // Queries
  getEarningsByPeriod: (startDate: Date, endDate: Date) => EarningRecord[];
  getEarningsBySource: (source: EarningSource) => EarningRecord[];
  getEarningsByListing: (listingId: string) => EarningRecord[];
  getRecentEarnings: (count?: number) => EarningRecord[];
  getEarningsByDate: (date: Date) => EarningRecord[];
  getTotalBySource: (source: EarningSource) => number;
}

const EarningsContext = createContext<EarningsContextType | null>(null);

const EARNINGS_KEY = 'gee_earnings';

// Helper to generate unique ID
function generateId(): string {
  return `earn-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 5)}`;
}

// Get stored earnings from localStorage
function getStoredEarnings(): EarningRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(EARNINGS_KEY);
    const earnings = data ? JSON.parse(data) : [];
    // Deserialize dates
    return earnings.map((e: EarningRecord) => ({
      ...e,
      createdAt: new Date(e.createdAt),
    }));
  } catch {
    return [];
  }
}

// Save earnings to localStorage
function saveEarnings(earnings: EarningRecord[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(EARNINGS_KEY, JSON.stringify(earnings));
  } catch (e) {
    console.error('Failed to save earnings:', e);
  }
}

// Lazy initializer for useState
function getInitialEarnings(): EarningRecord[] {
  if (typeof window === 'undefined') return [];
  return getStoredEarnings();
}

// Calculate stats from earnings
function calculateStats(earnings: EarningRecord[]): EarningsStats {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const startOfWeek = new Date(today);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
  
  const startOfLastWeek = new Date(startOfWeek);
  startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);
  
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
  
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const startOfLastYear = new Date(now.getFullYear() - 1, 0, 1);
  const endOfLastYear = new Date(now.getFullYear(), 0, 0);

  const todayEarnings = earnings.filter(e => new Date(e.createdAt) >= today);
  const yesterdayEarnings = earnings.filter(e => {
    const date = new Date(e.createdAt);
    return date >= yesterday && date < today;
  });
  
  const thisWeekEarnings = earnings.filter(e => new Date(e.createdAt) >= startOfWeek);
  const lastWeekEarnings = earnings.filter(e => {
    const date = new Date(e.createdAt);
    return date >= startOfLastWeek && date < startOfWeek;
  });
  
  const thisMonthEarnings = earnings.filter(e => new Date(e.createdAt) >= startOfMonth);
  const lastMonthEarnings = earnings.filter(e => {
    const date = new Date(e.createdAt);
    return date >= startOfLastMonth && date <= endOfLastMonth;
  });
  
  const thisYearEarnings = earnings.filter(e => new Date(e.createdAt) >= startOfYear);
  const lastYearEarnings = earnings.filter(e => {
    const date = new Date(e.createdAt);
    return date >= startOfLastYear && date <= endOfLastYear;
  });

  const sumEarnings = (records: EarningRecord[]) => records.reduce((sum, e) => sum + e.amount, 0);
  
  const allTime = sumEarnings(earnings);
  const transactionCount = earnings.length;
  
  // Calculate averages
  const daysSinceFirst = earnings.length > 0 
    ? Math.max(1, Math.ceil((now.getTime() - new Date(earnings[earnings.length - 1].createdAt).getTime()) / (1000 * 60 * 60 * 24)))
    : 1;
  
  const weeksSinceFirst = Math.max(1, Math.ceil(daysSinceFirst / 7));
  const monthsSinceFirst = Math.max(1, Math.ceil(daysSinceFirst / 30));

  return {
    today: sumEarnings(todayEarnings),
    yesterday: sumEarnings(yesterdayEarnings),
    thisWeek: sumEarnings(thisWeekEarnings),
    lastWeek: sumEarnings(lastWeekEarnings),
    thisMonth: sumEarnings(thisMonthEarnings),
    lastMonth: sumEarnings(lastMonthEarnings),
    thisYear: sumEarnings(thisYearEarnings),
    lastYear: sumEarnings(lastYearEarnings),
    allTime,
    transactionCount,
    averagePerDay: Math.round(allTime / daysSinceFirst),
    averagePerWeek: Math.round(allTime / weeksSinceFirst),
    averagePerMonth: Math.round(allTime / monthsSinceFirst),
  };
}

// Generate demo earnings data
function generateDemoEarnings(): EarningRecord[] {
  const demoEarnings: EarningRecord[] = [];
  const sources: EarningSource[] = ['promotion_basic', 'promotion_premium', 'promotion_featured', 'listing_featured'];
  const listingTitles = [
    'E-commerce Fashion Store',
    'SaaS Analytics Platform',
    'Digital Marketing Agency',
    'Mobile App Startup',
    'Subscription Box Service',
  ];

  // Generate earnings for the past 30 days
  for (let i = 0; i < 45; i++) {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    date.setHours(Math.floor(Math.random() * 24));
    
    const source = sources[Math.floor(Math.random() * sources.length)];
    const listingTitle = listingTitles[Math.floor(Math.random() * listingTitles.length)];
    
    let amount = 0;
    switch (source) {
      case 'promotion_basic': amount = 29 + Math.floor(Math.random() * 30); break;
      case 'promotion_premium': amount = 79 + Math.floor(Math.random() * 50); break;
      case 'promotion_featured': amount = 149 + Math.floor(Math.random() * 100); break;
      case 'listing_featured': amount = 99 + Math.floor(Math.random() * 50); break;
      default: amount = 50;
    }

    demoEarnings.push({
      id: generateId(),
      amount,
      source,
      description: `${EARNING_SOURCE_LABELS[source]} for ${listingTitle}`,
      listingTitle,
      createdAt: date,
    });
  }

  return demoEarnings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function EarningsProvider({ children }: { children: ReactNode }) {
  const [earnings, setEarnings] = useState<EarningRecord[]>(getInitialEarnings);
  const [isLoading] = useState(false);

  // Initialize with demo data if empty
  useEffect(() => {
    if (earnings.length === 0) {
      const demoData = generateDemoEarnings();
      setEarnings(demoData);
      saveEarnings(demoData);
    }
  }, [earnings.length]);

  const stats = calculateStats(earnings);

  const addEarning = useCallback((data: {
    amount: number;
    source: EarningSource;
    description: string;
    listingId?: string;
    listingTitle?: string;
    userId?: string;
    userName?: string;
    adId?: string;
    metadata?: Record<string, any>;
  }): EarningRecord => {
    const newEarning: EarningRecord = {
      id: generateId(),
      amount: data.amount,
      source: data.source,
      description: data.description,
      listingId: data.listingId,
      listingTitle: data.listingTitle,
      userId: data.userId,
      userName: data.userName,
      adId: data.adId,
      createdAt: new Date(),
      metadata: data.metadata,
    };

    setEarnings(prev => {
      const updated = [newEarning, ...prev];
      saveEarnings(updated);
      return updated;
    });

    return newEarning;
  }, []);

  const getEarningsByPeriod = useCallback((startDate: Date, endDate: Date): EarningRecord[] => {
    return earnings.filter(e => {
      const date = new Date(e.createdAt);
      return date >= startDate && date <= endDate;
    });
  }, [earnings]);

  const getEarningsBySource = useCallback((source: EarningSource): EarningRecord[] => {
    return earnings.filter(e => e.source === source);
  }, [earnings]);

  const getEarningsByListing = useCallback((listingId: string): EarningRecord[] => {
    return earnings.filter(e => e.listingId === listingId);
  }, [earnings]);

  const getRecentEarnings = useCallback((count: number = 10): EarningRecord[] => {
    return earnings.slice(0, count);
  }, [earnings]);

  const getEarningsByDate = useCallback((date: Date): EarningRecord[] => {
    const targetDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const nextDate = new Date(targetDate);
    nextDate.setDate(nextDate.getDate() + 1);
    
    return earnings.filter(e => {
      const earningDate = new Date(e.createdAt);
      return earningDate >= targetDate && earningDate < nextDate;
    });
  }, [earnings]);

  const getTotalBySource = useCallback((source: EarningSource): number => {
    return earnings
      .filter(e => e.source === source)
      .reduce((sum, e) => sum + e.amount, 0);
  }, [earnings]);

  return (
    <EarningsContext.Provider
      value={{
        earnings,
        stats,
        isLoading,
        addEarning,
        getEarningsByPeriod,
        getEarningsBySource,
        getEarningsByListing,
        getRecentEarnings,
        getEarningsByDate,
        getTotalBySource,
      }}
    >
      {children}
    </EarningsContext.Provider>
  );
}

export function useEarnings() {
  const context = useContext(EarningsContext);
  if (!context) {
    return {
      earnings: [],
      stats: {
        today: 0,
        yesterday: 0,
        thisWeek: 0,
        lastWeek: 0,
        thisMonth: 0,
        lastMonth: 0,
        thisYear: 0,
        lastYear: 0,
        allTime: 0,
        transactionCount: 0,
        averagePerDay: 0,
        averagePerWeek: 0,
        averagePerMonth: 0,
      },
      isLoading: false,
      addEarning: () => ({ id: '', amount: 0, source: 'promotion_basic' as EarningSource, description: '', createdAt: new Date() }),
      getEarningsByPeriod: () => [],
      getEarningsBySource: () => [],
      getEarningsByListing: () => [],
      getRecentEarnings: () => [],
      getEarningsByDate: () => [],
      getTotalBySource: () => 0,
    };
  }
  return context;
}
