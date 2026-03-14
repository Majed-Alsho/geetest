/**
 * Rate Limiting Utility
 * Prevents brute force attacks and abuse
 */

interface RateLimitEntry {
  count: number;
  firstAttempt: number;
  blocked: boolean;
  blockedUntil?: number;
}

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxAttempts: number; // Max attempts per window
  blockDurationMs: number; // How long to block after exceeding limit
}

const defaultConfig: RateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxAttempts: 5,
  blockDurationMs: 30 * 60 * 1000, // 30 minutes
};

// In-memory store (in production, use Redis)
const rateLimitStore = new Map<string, RateLimitEntry>();

// Clean up old entries periodically
if (typeof window !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateLimitStore.entries()) {
      if (entry.blockedUntil && entry.blockedUntil < now) {
        rateLimitStore.delete(key);
      } else if (entry.firstAttempt + defaultConfig.windowMs < now) {
        rateLimitStore.delete(key);
      }
    }
  }, 60000); // Clean every minute
}

export function checkRateLimit(
  identifier: string,
  config: Partial<RateLimitConfig> = {}
): { allowed: boolean; remainingAttempts: number; blockedUntil?: number; message?: string } {
  const finalConfig = { ...defaultConfig, ...config };
  const now = Date.now();
  
  const entry = rateLimitStore.get(identifier);
  
  // Check if currently blocked
  if (entry?.blocked && entry.blockedUntil && entry.blockedUntil > now) {
    const remainingTime = Math.ceil((entry.blockedUntil - now) / 60000);
    return {
      allowed: false,
      remainingAttempts: 0,
      blockedUntil: entry.blockedUntil,
      message: `Too many attempts. Please try again in ${remainingTime} minute(s).`,
    };
  }
  
  // Check if block has expired
  if (entry?.blocked && entry.blockedUntil && entry.blockedUntil <= now) {
    rateLimitStore.delete(identifier);
    return checkRateLimit(identifier, config);
  }
  
  // First attempt or window expired
  if (!entry || entry.firstAttempt + finalConfig.windowMs < now) {
    rateLimitStore.set(identifier, {
      count: 1,
      firstAttempt: now,
      blocked: false,
    });
    return {
      allowed: true,
      remainingAttempts: finalConfig.maxAttempts - 1,
    };
  }
  
  // Increment count
  const newCount = entry.count + 1;
  
  if (newCount >= finalConfig.maxAttempts) {
    const blockedUntil = now + finalConfig.blockDurationMs;
    rateLimitStore.set(identifier, {
      count: newCount,
      firstAttempt: entry.firstAttempt,
      blocked: true,
      blockedUntil,
    });
    return {
      allowed: false,
      remainingAttempts: 0,
      blockedUntil,
      message: `Too many attempts. Account temporarily locked for ${Math.ceil(finalConfig.blockDurationMs / 60000)} minutes.`,
    };
  }
  
  rateLimitStore.set(identifier, {
    ...entry,
    count: newCount,
  });
  
  return {
    allowed: true,
    remainingAttempts: finalConfig.maxAttempts - newCount,
  };
}

export function resetRateLimit(identifier: string): void {
  rateLimitStore.delete(identifier);
}

// Specific rate limiters for different use cases
export const loginRateLimiter = (email: string) => 
  checkRateLimit(`login:${email}`, { maxAttempts: 5, blockDurationMs: 30 * 60 * 1000 });

export const adminLoginRateLimiter = (username: string) => 
  checkRateLimit(`admin:${username}`, { maxAttempts: 3, blockDurationMs: 60 * 60 * 1000 });

export const signupRateLimiter = (ip: string) => 
  checkRateLimit(`signup:${ip}`, { maxAttempts: 3, blockDurationMs: 60 * 60 * 1000 });

export const passwordResetRateLimiter = (email: string) => 
  checkRateLimit(`reset:${email}`, { maxAttempts: 3, blockDurationMs: 60 * 60 * 1000 });
