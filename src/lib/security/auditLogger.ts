/**
 * Security Audit Logger
 * Logs security-relevant events for monitoring and compliance
 */

export type AuditEventType = 
  | 'LOGIN_SUCCESS'
  | 'LOGIN_FAILED'
  | 'LOGOUT'
  | 'SIGNUP'
  | 'PASSWORD_CHANGE'
  | 'ACCOUNT_DELETE'
  | 'NDA_SIGN'
  | 'LISTING_CREATE'
  | 'LISTING_ACCESS'
  | 'ADMIN_ACTION'
  | 'VERIFICATION'
  | 'RATE_LIMIT_HIT'
  | 'SUSPICIOUS_ACTIVITY'
  | 'SESSION_EXPIRED'
  | 'PERMISSION_DENIED';

export type AuditSeverity = 'info' | 'warning' | 'critical';

interface AuditLogEntry {
  id: string;
  timestamp: string;
  eventType: AuditEventType;
  severity: AuditSeverity;
  userId?: string;
  userEmail?: string;
  ipAddress?: string;
  userAgent?: string;
  details: Record<string, unknown>;
  resourceType?: string;
  resourceId?: string;
}

const AUDIT_LOG_KEY = 'gee_audit_logs';
const MAX_LOG_ENTRIES = 1000;

// Get existing logs
function getLogs(): AuditLogEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(AUDIT_LOG_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

// Save logs
function saveLogs(logs: AuditLogEntry[]): void {
  if (typeof window === 'undefined') return;
  // Keep only the most recent entries
  const trimmedLogs = logs.slice(-MAX_LOG_ENTRIES);
  localStorage.setItem(AUDIT_LOG_KEY, JSON.stringify(trimmedLogs));
}

// Generate unique ID
function generateId(): string {
  return `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Log an event
export function auditLog(
  eventType: AuditEventType,
  details: Record<string, unknown> = {},
  options: {
    severity?: AuditSeverity;
    userId?: string;
    userEmail?: string;
    resourceType?: string;
    resourceId?: string;
  } = {}
): AuditLogEntry {
  const entry: AuditLogEntry = {
    id: generateId(),
    timestamp: new Date().toISOString(),
    eventType,
    severity: options.severity || getDefaultSeverity(eventType),
    userId: options.userId,
    userEmail: options.userEmail,
    details,
    resourceType: options.resourceType,
    resourceId: options.resourceId,
  };
  
  const logs = getLogs();
  logs.push(entry);
  saveLogs(logs);
  
  // In production, send to server
  console.log(`[AUDIT] ${eventType}:`, entry);
  
  return entry;
}

// Get default severity for event type
function getDefaultSeverity(eventType: AuditEventType): AuditSeverity {
  const criticalEvents: AuditEventType[] = [
    'SUSPICIOUS_ACTIVITY',
    'RATE_LIMIT_HIT',
    'ACCOUNT_DELETE',
  ];
  
  const warningEvents: AuditEventType[] = [
    'LOGIN_FAILED',
    'PASSWORD_CHANGE',
    'PERMISSION_DENIED',
    'VERIFICATION',
  ];
  
  if (criticalEvents.includes(eventType)) return 'critical';
  if (warningEvents.includes(eventType)) return 'warning';
  return 'info';
}

// Get all logs (for admin dashboard)
export function getAllAuditLogs(): AuditLogEntry[] {
  return getLogs();
}

// Get logs by user
export function getAuditLogsByUser(userId: string): AuditLogEntry[] {
  return getLogs().filter(log => log.userId === userId);
}

// Get logs by event type
export function getAuditLogsByType(eventType: AuditEventType): AuditLogEntry[] {
  return getLogs().filter(log => log.eventType === eventType);
}

// Get logs by severity
export function getAuditLogsBySeverity(severity: AuditSeverity): AuditLogEntry[] {
  return getLogs().filter(log => log.severity === severity);
}

// Get recent critical events
export function getRecentCriticalEvents(hours: number = 24): AuditLogEntry[] {
  const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
  return getLogs().filter(
    log => log.severity === 'critical' && log.timestamp >= cutoff
  );
}

// Get security summary
export function getSecuritySummary() {
  const logs = getLogs();
  const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const recentLogs = logs.filter(log => log.timestamp >= last24h);
  
  return {
    totalEvents: logs.length,
    last24h: {
      total: recentLogs.length,
      loginAttempts: recentLogs.filter(l => 
        l.eventType === 'LOGIN_SUCCESS' || l.eventType === 'LOGIN_FAILED'
      ).length,
      failedLogins: recentLogs.filter(l => l.eventType === 'LOGIN_FAILED').length,
      criticalEvents: recentLogs.filter(l => l.severity === 'critical').length,
      warnings: recentLogs.filter(l => l.severity === 'warning').length,
    },
    byType: Object.fromEntries(
      Object.values<AuditEventType>([
        'LOGIN_SUCCESS', 'LOGIN_FAILED', 'LOGOUT', 'SIGNUP',
        'PASSWORD_CHANGE', 'NDA_SIGN', 'LISTING_CREATE', 'ADMIN_ACTION'
      ]).map(type => [
        type, 
        recentLogs.filter(l => l.eventType === type).length
      ])
    ),
  };
}

// Clear old logs (GDPR compliance)
export function clearOldAuditLogs(daysToKeep: number = 90): number {
  const cutoff = new Date(Date.now() - daysToKeep * 24 * 60 * 60 * 1000).toISOString();
  const logs = getLogs();
  const filteredLogs = logs.filter(log => log.timestamp >= cutoff);
  const removedCount = logs.length - filteredLogs.length;
  saveLogs(filteredLogs);
  return removedCount;
}
