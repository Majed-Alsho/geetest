// Rate Limiting Types

export type RateLimitType = 'api' | 'auth' | 'listing' | 'message' | 'search' | 'upload';

export interface RateLimitConfig {
  type: RateLimitType;
  maxRequests: number;
  windowMs: number;
  blockDurationMs: number;
  enabled: boolean;
}

export interface RateLimitStatus {
  type: RateLimitType;
  identifier: string;
  requestCount: number;
  limit: number;
  windowStart: Date;
  windowEnd: Date;
  remaining: number;
  isBlocked: boolean;
  blockedUntil?: Date;
  resetAt: Date;
}

export interface RateLimitEvent {
  id: string;
  type: RateLimitType;
  identifier: string;
  ipAddress: string;
  userId?: string;
  timestamp: Date;
  blocked: boolean;
  requestCount: number;
  limit: number;
}

export interface RateLimitStats {
  totalRequests: number;
  blockedRequests: number;
  blockRate: number;
  byType: Record<RateLimitType, {
    requests: number;
    blocked: number;
    topIdentifiers: { identifier: string; count: number }[];
  }>;
  recentBlocks: RateLimitEvent[];
  hourlyDistribution: { hour: number; requests: number; blocked: number }[];
}

export const RATE_LIMIT_CONFIGS: RateLimitConfig[] = [
  { type: 'api', maxRequests: 1000, windowMs: 3600000, blockDurationMs: 3600000, enabled: true },
  { type: 'auth', maxRequests: 10, windowMs: 900000, blockDurationMs: 1800000, enabled: true },
  { type: 'listing', maxRequests: 50, windowMs: 3600000, blockDurationMs: 3600000, enabled: true },
  { type: 'message', maxRequests: 100, windowMs: 3600000, blockDurationMs: 1800000, enabled: true },
  { type: 'search', maxRequests: 200, windowMs: 3600000, blockDurationMs: 900000, enabled: true },
  { type: 'upload', maxRequests: 20, windowMs: 3600000, blockDurationMs: 3600000, enabled: true },
];

export const RATE_LIMIT_LABELS: Record<RateLimitType, string> = {
  api: 'API Requests',
  auth: 'Authentication',
  listing: 'Listing Operations',
  message: 'Messaging',
  search: 'Search',
  upload: 'File Uploads',
};
