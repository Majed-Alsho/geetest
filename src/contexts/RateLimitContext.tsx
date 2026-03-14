'use client';

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import {
  RateLimitStatus,
  RateLimitEvent,
  RateLimitStats,
  RateLimitType,
  RateLimitConfig,
  RATE_LIMIT_CONFIGS,
  RATE_LIMIT_LABELS,
} from '@/types/rateLimit';

interface RateLimitContextType {
  configs: RateLimitConfig[];
  stats: RateLimitStats;
  recentEvents: RateLimitEvent[];
  currentLimits: Map<string, RateLimitStatus>;
  
  // Actions
  checkRateLimit: (type: RateLimitType, identifier: string) => RateLimitStatus;
  recordRequest: (type: RateLimitType, identifier: string, userId?: string) => boolean;
  blockIdentifier: (type: RateLimitType, identifier: string, duration: number) => void;
  unblockIdentifier: (type: RateLimitType, identifier: string) => void;
  
  // Configuration
  updateConfig: (type: RateLimitType, config: Partial<RateLimitConfig>) => void;
  resetLimits: (identifier?: string) => void;
  
  // Stats
  getRateLimitStats: () => RateLimitStats;
  getRecentBlocks: (count?: number) => RateLimitEvent[];
}

const RateLimitContext = createContext<RateLimitContextType | null>(null);

const RATE_LIMIT_STATE_KEY = 'gee_rate_limit_state';
const RATE_LIMIT_EVENTS_KEY = 'gee_rate_limit_events';

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

// Generate demo rate limit events
function generateDemoEvents(): RateLimitEvent[] {
  const events: RateLimitEvent[] = [];
  const types: RateLimitType[] = ['api', 'auth', 'search', 'listing', 'message', 'upload'];
  
  for (let i = 0; i < 30; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    const config = RATE_LIMIT_CONFIGS.find(c => c.type === type)!;
    
    events.push({
      id: `rle-${Date.now()}-${i}`,
      type,
      identifier: `192.168.1.${Math.floor(Math.random() * 255)}`,
      ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
      userId: Math.random() > 0.5 ? `user-${Math.floor(Math.random() * 10)}` : undefined,
      timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
      blocked: Math.random() > 0.85,
      requestCount: Math.floor(Math.random() * config.maxRequests),
      limit: config.maxRequests,
    });
  }
  
  return events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export function RateLimitProvider({ children }: { children: ReactNode }) {
  const [configs] = useState<RateLimitConfig[]>(RATE_LIMIT_CONFIGS);
  const [events, setEvents] = useState<RateLimitEvent[]>([]);
  const [currentLimits] = useState<Map<string, RateLimitStatus>>(new Map());

  // Load data on mount
  useEffect(() => {
    const storedEvents = getStoredData<RateLimitEvent[]>(RATE_LIMIT_EVENTS_KEY, []);
    
    if (storedEvents.length === 0) {
      const demoEvents = generateDemoEvents();
      setEvents(demoEvents);
      saveData(RATE_LIMIT_EVENTS_KEY, demoEvents);
    } else {
      // Parse dates
      const parsedEvents = storedEvents.map(event => ({
        ...event,
        timestamp: new Date(event.timestamp),
        windowStart: new Date(event.windowStart || Date.now()),
        windowEnd: new Date(event.windowEnd || Date.now() + 3600000),
        blockedUntil: event.blockedUntil ? new Date(event.blockedUntil) : undefined,
        resetAt: new Date(event.resetAt || Date.now() + 3600000),
      }));
      setEvents(parsedEvents);
    }
  }, []);

  const checkRateLimit = useCallback((type: RateLimitType, identifier: string): RateLimitStatus => {
    const config = configs.find(c => c.type === type);
    if (!config || !config.enabled) {
      return {
        type,
        identifier,
        requestCount: 0,
        limit: 0,
        windowStart: new Date(),
        windowEnd: new Date(Date.now() + config?.windowMs || 3600000),
        remaining: Infinity,
        isBlocked: false,
        resetAt: new Date(Date.now() + config?.windowMs || 3600000),
      };
    }
    
    const key = `${type}:${identifier}`;
    const now = new Date();
    
    // Check for existing status
    const existing = currentLimits.get(key);
    if (existing && new Date(existing.windowEnd) > now) {
      return existing;
    }
    
    // Create new status
    const status: RateLimitStatus = {
      type,
      identifier,
      requestCount: 0,
      limit: config.maxRequests,
      windowStart: now,
      windowEnd: new Date(now.getTime() + config.windowMs),
      remaining: config.maxRequests,
      isBlocked: false,
      resetAt: new Date(now.getTime() + config.windowMs),
    };
    
    currentLimits.set(key, status);
    return status;
  }, [configs, currentLimits]);

  const recordRequest = useCallback((type: RateLimitType, identifier: string, userId?: string): boolean => {
    const config = configs.find(c => c.type === type);
    if (!config || !config.enabled) return true;
    
    const key = `${type}:${identifier}`;
    const status = checkRateLimit(type, identifier);
    
    if (status.isBlocked) {
      // Record blocked event
      const event: RateLimitEvent = {
        id: `rle-${Date.now()}`,
        type,
        identifier,
        ipAddress: identifier,
        userId,
        timestamp: new Date(),
        blocked: true,
        requestCount: status.requestCount,
        limit: status.limit,
      };
      
      setEvents(prev => {
        const updated = [event, ...prev].slice(0, 1000);
        saveData(RATE_LIMIT_EVENTS_KEY, updated);
        return updated;
      });
      
      return false;
    }
    
    // Increment request count
    status.requestCount++;
    status.remaining = Math.max(0, status.limit - status.requestCount);
    
    // Check if limit exceeded
    if (status.requestCount >= status.limit) {
      status.isBlocked = true;
      status.blockedUntil = new Date(Date.now() + config.blockDurationMs);
      
      // Record blocked event
      const event: RateLimitEvent = {
        id: `rle-${Date.now()}`,
        type,
        identifier,
        ipAddress: identifier,
        userId,
        timestamp: new Date(),
        blocked: true,
        requestCount: status.requestCount,
        limit: status.limit,
      };
      
      setEvents(prev => {
        const updated = [event, ...prev].slice(0, 1000);
        saveData(RATE_LIMIT_EVENTS_KEY, updated);
        return updated;
      });
    }
    
    currentLimits.set(key, status);
    return !status.isBlocked;
  }, [configs, checkRateLimit, currentLimits]);

  const blockIdentifier = useCallback((type: RateLimitType, identifier: string, duration: number) => {
    const key = `${type}:${identifier}`;
    const status = checkRateLimit(type, identifier);
    status.isBlocked = true;
    status.blockedUntil = new Date(Date.now() + duration);
    currentLimits.set(key, status);
  }, [checkRateLimit, currentLimits]);

  const unblockIdentifier = useCallback((type: RateLimitType, identifier: string) => {
    const key = `${type}:${identifier}`;
    const status = checkRateLimit(type, identifier);
    status.isBlocked = false;
    status.blockedUntil = undefined;
    status.requestCount = 0;
    status.remaining = status.limit;
    currentLimits.set(key, status);
  }, [checkRateLimit, currentLimits]);

  const updateConfig = useCallback((type: RateLimitType, updates: Partial<RateLimitConfig>) => {
    // In a real app, this would update backend config
    console.log('Config update:', type, updates);
  }, []);

  const resetLimits = useCallback((identifier?: string) => {
    if (identifier) {
      // Reset specific identifier
      const keysToRemove: string[] = [];
      currentLimits.forEach((_, key) => {
        if (key.endsWith(`:${identifier}`)) {
          keysToRemove.push(key);
        }
      });
      keysToRemove.forEach(key => currentLimits.delete(key));
    } else {
      // Reset all
      currentLimits.clear();
    }
  }, [currentLimits]);

  const getRateLimitStats = useCallback((): RateLimitStats => {
    const totalRequests = events.length;
    const blockedRequests = events.filter(e => e.blocked).length;
    
    const byType: Record<RateLimitType, { requests: number; blocked: number; topIdentifiers: { identifier: string; count: number }[] }> = {
      api: { requests: 0, blocked: 0, topIdentifiers: [] },
      auth: { requests: 0, blocked: 0, topIdentifiers: [] },
      listing: { requests: 0, blocked: 0, topIdentifiers: [] },
      message: { requests: 0, blocked: 0, topIdentifiers: [] },
      search: { requests: 0, blocked: 0, topIdentifiers: [] },
      upload: { requests: 0, blocked: 0, topIdentifiers: [] },
    };
    
    const identifierCounts: Record<RateLimitType, Record<string, number>> = {
      api: {}, auth: {}, listing: {}, message: {}, search: {}, upload: {},
    };
    
    events.forEach(event => {
      byType[event.type].requests++;
      if (event.blocked) byType[event.type].blocked++;
      identifierCounts[event.type][event.identifier] = (identifierCounts[event.type][event.identifier] || 0) + 1;
    });
    
    // Calculate top identifiers for each type
    Object.entries(identifierCounts).forEach(([type, counts]) => {
      byType[type as RateLimitType].topIdentifiers = Object.entries(counts)
        .map(([identifier, count]) => ({ identifier, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
    });
    
    const recentBlocks = events.filter(e => e.blocked).slice(0, 10);
    
    // Hourly distribution
    const hourlyDistribution = Array.from({ length: 24 }, (_, i) => {
      const hour = new Date();
      hour.setHours(hour.getHours() - (23 - i));
      const hourStart = new Date(hour);
      hourStart.setMinutes(0, 0, 0);
      const hourEnd = new Date(hourStart);
      hourEnd.setHours(hourEnd.getHours() + 1);
      
      const hourEvents = events.filter(e => {
        const eventTime = new Date(e.timestamp);
        return eventTime >= hourStart && eventTime < hourEnd;
      });
      
      return {
        hour: hourStart.getHours(),
        requests: hourEvents.length,
        blocked: hourEvents.filter(e => e.blocked).length,
      };
    });
    
    return {
      totalRequests,
      blockedRequests,
      blockRate: totalRequests > 0 ? (blockedRequests / totalRequests) * 100 : 0,
      byType,
      recentBlocks,
      hourlyDistribution,
    };
  }, [events]);

  const getRecentBlocks = useCallback((count: number = 10): RateLimitEvent[] => {
    return events.filter(e => e.blocked).slice(0, count);
  }, [events]);

  const stats = getRateLimitStats();

  return (
    <RateLimitContext.Provider
      value={{
        configs,
        stats,
        recentEvents: events,
        currentLimits,
        checkRateLimit,
        recordRequest,
        blockIdentifier,
        unblockIdentifier,
        updateConfig,
        resetLimits,
        getRateLimitStats,
        getRecentBlocks,
      }}
    >
      {children}
    </RateLimitContext.Provider>
  );
}

export function useRateLimit() {
  const context = useContext(RateLimitContext);
  if (!context) {
    return {
      configs: RATE_LIMIT_CONFIGS,
      stats: { totalRequests: 0, blockedRequests: 0, blockRate: 0, byType: {} as any, recentBlocks: [], hourlyDistribution: [] },
      recentEvents: [],
      currentLimits: new Map(),
      checkRateLimit: () => ({ type: 'api' as RateLimitType, identifier: '', requestCount: 0, limit: 0, windowStart: new Date(), windowEnd: new Date(), remaining: 0, isBlocked: false, resetAt: new Date() }),
      recordRequest: () => true,
      blockIdentifier: () => {},
      unblockIdentifier: () => {},
      updateConfig: () => {},
      resetLimits: () => {},
      getRateLimitStats: () => ({ totalRequests: 0, blockedRequests: 0, blockRate: 0, byType: {} as any, recentBlocks: [], hourlyDistribution: [] }),
      getRecentBlocks: () => [],
    };
  }
  return context;
}

export { RATE_LIMIT_LABELS };
