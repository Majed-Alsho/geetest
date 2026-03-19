'use client';

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import {
  AuditLogEntry,
  AuditLogFilter,
  AuditStats,
  AuditAction,
  AuditSeverity,
  AUDIT_ACTION_LABELS,
} from '@/types/audit';

interface AuditContextType {
  logs: AuditLogEntry[];
  stats: AuditStats;
  
  // Actions
  logEvent: (
    action: AuditAction,
    actor: { id: string; name: string; email: string; role: string },
    target?: { type: 'user' | 'listing' | 'offer' | 'ticket' | 'payment' | 'system'; id: string; name?: string },
    details?: Record<string, any>,
    severity?: AuditSeverity,
    metadata?: { before?: any; after?: any; reason?: string }
  ) => void;
  
  // Querying
  getFilteredLogs: (filter: AuditLogFilter) => AuditLogEntry[];
  getLogsByUser: (userId: string) => AuditLogEntry[];
  getLogsByAction: (action: AuditAction) => AuditLogEntry[];
  
  // Management
  clearOldLogs: (daysToKeep: number) => void;
  exportLogs: (filter?: AuditLogFilter) => string;
  getAuditStats: () => AuditStats;
}

const AuditContext = createContext<AuditContextType | null>(null);

const AUDIT_LOG_KEY = 'gee_audit_logs';
const MAX_LOGS = 10000;

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

// Generate demo audit logs
function generateDemoLogs(): AuditLogEntry[] {
  const demoUsers = [
    { id: 'user-1', name: 'John Doe', email: 'john@example.com', role: 'admin' },
    { id: 'user-2', name: 'Jane Smith', email: 'jane@example.com', role: 'user' },
    { id: 'user-3', name: 'Bob Wilson', email: 'bob@example.com', role: 'user' },
  ];
  
  const actions: AuditAction[] = [
    'user.login', 'user.logout', 'listing.create', 'listing.update', 
    'listing.approve', 'message.send', 'ticket.create', 'ticket.reply',
  ];
  
  const logs: AuditLogEntry[] = [];
  
  for (let i = 0; i < 50; i++) {
    const user = demoUsers[Math.floor(Math.random() * demoUsers.length)];
    const action = actions[Math.floor(Math.random() * actions.length)];
    
    logs.push({
      id: `audit-${Date.now()}-${i}`,
      timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      action,
      actor: user,
      target: action.includes('listing') 
        ? { type: 'listing', id: `listing-${Math.floor(Math.random() * 100)}`, name: `Business ${Math.floor(Math.random() * 100)}` }
        : action.includes('ticket')
        ? { type: 'ticket', id: `ticket-${Math.floor(Math.random() * 50)}` }
        : undefined,
      details: { ip: `192.168.1.${Math.floor(Math.random() * 255)}` },
      severity: Math.random() > 0.9 ? 'warning' : 'info',
    });
  }
  
  return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export function AuditProvider({ children }: { children: ReactNode }) {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);

  // Load data on mount
  useEffect(() => {
    const storedLogs = getStoredData<AuditLogEntry[]>(AUDIT_LOG_KEY, []);
    
    if (storedLogs.length === 0) {
      const demoLogs = generateDemoLogs();
      setLogs(demoLogs);
      saveData(AUDIT_LOG_KEY, demoLogs);
    } else {
      // Parse dates
      const parsedLogs = storedLogs.map(log => ({
        ...log,
        timestamp: new Date(log.timestamp),
      }));
      setLogs(parsedLogs);
    }
  }, []);

  const logEvent = useCallback((
    action: AuditAction,
    actor: { id: string; name: string; email: string; role: string },
    target?: { type: 'user' | 'listing' | 'offer' | 'ticket' | 'payment' | 'system'; id: string; name?: string },
    details?: Record<string, any>,
    severity: AuditSeverity = 'info',
    metadata?: { before?: any; after?: any; reason?: string }
  ) => {
    const entry: AuditLogEntry = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      action,
      actor,
      target,
      details: details || {},
      ipAddress: '127.0.0.1', // Would be actual IP
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      severity,
      metadata,
    };
    
    setLogs(prev => {
      const updated = [entry, ...prev].slice(0, MAX_LOGS);
      saveData(AUDIT_LOG_KEY, updated);
      return updated;
    });
  }, []);

  const getFilteredLogs = useCallback((filter: AuditLogFilter): AuditLogEntry[] => {
    return logs.filter(log => {
      // Date range
      if (filter.startDate && new Date(log.timestamp) < filter.startDate) return false;
      if (filter.endDate && new Date(log.timestamp) > filter.endDate) return false;
      
      // Actions
      if (filter.actions && filter.actions.length > 0 && !filter.actions.includes(log.action)) return false;
      
      // Actors
      if (filter.actors && filter.actors.length > 0 && !filter.actors.includes(log.actor?.id || '')) return false;
      
      // Targets
      if (filter.targets && filter.targets.length > 0 && (!log.target || !filter.targets.includes(log.target.id))) return false;
      
      // Severity
      if (filter.severity && filter.severity.length > 0 && !filter.severity.includes(log.severity)) return false;
      
      // Search query
      if (filter.searchQuery) {
        const query = filter.searchQuery.toLowerCase();
        const searchable = `${log.actor?.name || ''} ${log.actor?.email || ''} ${log.action} ${log.target?.name || ''}`.toLowerCase();
        if (!searchable.includes(query)) return false;
      }
      
      return true;
    });
  }, [logs]);

  const getLogsByUser = useCallback((userId: string) => {
    return logs.filter(log => log.actor?.id === userId);
  }, [logs]);

  const getLogsByAction = useCallback((action: AuditAction) => {
    return logs.filter(log => log.action === action);
  }, [logs]);

  const clearOldLogs = useCallback((daysToKeep: number) => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - daysToKeep);
    
    setLogs(prev => {
      const updated = prev.filter(log => new Date(log.timestamp) >= cutoff);
      saveData(AUDIT_LOG_KEY, updated);
      return updated;
    });
  }, []);

  const exportLogs = useCallback((filter?: AuditLogFilter): string => {
    const data = filter ? getFilteredLogs(filter) : logs;
    return JSON.stringify(data, null, 2);
  }, [logs, getFilteredLogs]);

  const getAuditStats = useCallback((): AuditStats => {
    const eventsByAction: Record<string, number> = {};
    const eventsBySeverity: Record<AuditSeverity, number> = { info: 0, warning: 0, critical: 0 };
    const actorCounts: Record<string, { name: string; count: number }> = {};
    
    logs.forEach(log => {
      // Safeguard: skip logs with undefined actor
      if (!log?.actor?.id) return;

      eventsByAction[log.action] = (eventsByAction[log.action] || 0) + 1;
      eventsBySeverity[log.severity]++;

      if (!actorCounts[log.actor.id]) {
        actorCounts[log.actor.id] = { name: log.actor.name || 'Unknown', count: 0 };
      }
      actorCounts[log.actor.id].count++;
    });
    
    const topActors = Object.entries(actorCounts)
      .map(([id, data]) => ({ actorId: id, actorName: data.name, eventCount: data.count }))
      .sort((a, b) => b.eventCount - a.eventCount)
      .slice(0, 10);
    
    // Generate hourly distribution for last 24 hours
    const hourlyDistribution = Array.from({ length: 24 }, (_, i) => {
      const hour = new Date();
      hour.setHours(hour.getHours() - (23 - i));
      const hourStart = new Date(hour);
      hourStart.setMinutes(0, 0, 0);
      const hourEnd = new Date(hourStart);
      hourEnd.setHours(hourEnd.getHours() + 1);
      
      const hourLogs = logs.filter(log => {
        const logTime = new Date(log.timestamp);
        return logTime >= hourStart && logTime < hourEnd;
      });
      
      return {
        hour: hourStart.getHours(),
        requests: hourLogs.length,
        blocked: hourLogs.filter(l => l.severity === 'warning' || l.severity === 'critical').length,
      };
    });
    
    // Recent activity (last 7 days, grouped by day)
    const recentActivity = Array.from({ length: 7 }, (_, i) => {
      const day = new Date();
      day.setDate(day.getDate() - (6 - i));
      day.setHours(0, 0, 0, 0);
      const dayEnd = new Date(day);
      dayEnd.setDate(dayEnd.getDate() + 1);
      
      return {
        timestamp: day,
        count: logs.filter(log => {
          const logTime = new Date(log.timestamp);
          return logTime >= day && logTime < dayEnd;
        }).length,
      };
    });
    
    return {
      totalEvents: logs.length,
      eventsByAction,
      eventsBySeverity,
      recentActivity,
      topActors,
    };
  }, [logs]);

  const stats = getAuditStats();

  return (
    <AuditContext.Provider
      value={{
        logs,
        stats,
        logEvent,
        getFilteredLogs,
        getLogsByUser,
        getLogsByAction,
        clearOldLogs,
        exportLogs,
        getAuditStats,
      }}
    >
      {children}
    </AuditContext.Provider>
  );
}

export function useAudit() {
  const context = useContext(AuditContext);
  if (!context) {
    return {
      logs: [],
      stats: { totalEvents: 0, eventsByAction: {}, eventsBySeverity: { info: 0, warning: 0, critical: 0 }, recentActivity: [], topActors: [] },
      logEvent: () => {},
      getFilteredLogs: () => [],
      getLogsByUser: () => [],
      getLogsByAction: () => [],
      clearOldLogs: () => {},
      exportLogs: () => '[]',
      getAuditStats: () => ({ totalEvents: 0, eventsByAction: {}, eventsBySeverity: { info: 0, warning: 0, critical: 0 }, recentActivity: [], topActors: [] }),
    };
  }
  return context;
}

export { AUDIT_ACTION_LABELS };
