/**
 * Security Utilities
 * Helper functions for security-related operations
 */

// Password strength checker
export function checkPasswordStrength(password: string): {
  score: number; // 0-5
  label: string;
  color: string;
  feedback: string[];
} {
  let score = 0;
  const feedback: string[] = [];
  
  // Length checks
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (password.length >= 16) score++;
  
  // Character type checks
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;
  
  // Common patterns
  if (/(.)\1{2,}/.test(password)) {
    score--;
    feedback.push('Avoid repeating characters');
  }
  if (/^[a-z]+$/.test(password.toLowerCase())) {
    score--;
    feedback.push('Add numbers and special characters');
  }
  
  // Check against common passwords
  const commonPasswords = [
    'password', '123456', '12345678', 'qwerty', 'abc123',
    'monkey', 'master', 'dragon', 'letmein', 'login',
    'admin', 'welcome', 'password123', 'password1'
  ];
  if (commonPasswords.some(p => password.toLowerCase().includes(p))) {
    score = Math.max(0, score - 2);
    feedback.push('Avoid common password patterns');
  }
  
  // Normalize score
  score = Math.max(0, Math.min(5, score));
  
  const levels = [
    { label: 'Very Weak', color: '#ef4444' },
    { label: 'Weak', color: '#f97316' },
    { label: 'Fair', color: '#eab308' },
    { label: 'Good', color: '#22c55e' },
    { label: 'Strong', color: '#10b981' },
    { label: 'Very Strong', color: '#059669' },
  ];
  
  return {
    score,
    label: levels[score].label,
    color: levels[score].color,
    feedback,
  };
}

// Generate secure random token
export function generateSecureToken(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, x => chars[x % chars.length]).join('');
}

// Simple hash function (for demo - use bcrypt on server in production)
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Sanitize input to prevent XSS
export function sanitizeInput(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

// Check if string contains potential SQL injection patterns
export function hasSqlInjectionPatterns(input: string): boolean {
  const patterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|CREATE|TRUNCATE)\b)/i,
    /(--|\#|\/\*|\*\/)/,
    /(\bOR\b|\bAND\b).*?=.*?/i,
    /('|")/, // Quotes
    /(;)/, // Semicolons
  ];
  
  return patterns.some(pattern => pattern.test(input));
}

// Generate CSRF token
export function generateCsrfToken(): string {
  return generateSecureToken(32);
}

// Validate CSRF token
export function validateCsrfToken(token: string, storedToken: string): boolean {
  if (!token || !storedToken) return false;
  return token === storedToken;
}

// Check password requirements
export function validatePassword(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

// Session timeout configuration
export const SESSION_CONFIG = {
  // Session expires after 30 minutes of inactivity
  INACTIVITY_TIMEOUT: 30 * 60 * 1000,
  // Maximum session duration (24 hours)
  MAX_SESSION_DURATION: 24 * 60 * 60 * 1000,
  // Warning shown 5 minutes before expiry
  WARNING_BEFORE_EXPIRY: 5 * 60 * 1000,
};

// Check if session is expired
export function isSessionExpired(loginTime: number, lastActivity: number): boolean {
  const now = Date.now();
  
  // Check inactivity timeout
  if (now - lastActivity > SESSION_CONFIG.INACTIVITY_TIMEOUT) {
    return true;
  }
  
  // Check max session duration
  if (now - loginTime > SESSION_CONFIG.MAX_SESSION_DURATION) {
    return true;
  }
  
  return false;
}

// Get time until session expiry
export function getTimeUntilExpiry(loginTime: number, lastActivity: number): number {
  const now = Date.now();
  
  const inactivityExpiry = lastActivity + SESSION_CONFIG.INACTIVITY_TIMEOUT;
  const maxExpiry = loginTime + SESSION_CONFIG.MAX_SESSION_DURATION;
  
  const nearestExpiry = Math.min(inactivityExpiry, maxExpiry);
  
  return Math.max(0, nearestExpiry - now);
}
