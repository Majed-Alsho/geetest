// Earnings and Revenue Types

export type EarningSource = 
  | 'promotion_basic'
  | 'promotion_premium'
  | 'promotion_featured'
  | 'listing_featured'
  | 'verification_fee'
  | 'subscription'
  | 'transaction_fee';

export type EarningPeriod = 'daily' | 'weekly' | 'monthly' | 'yearly' | 'all_time';

export interface EarningRecord {
  id: string;
  amount: number;
  source: EarningSource;
  description: string;
  listingId?: string;
  listingTitle?: string;
  userId?: string;
  userName?: string;
  adId?: string;
  createdAt: Date;
  metadata?: Record<string, any>;
}

export interface EarningsSummary {
  total: number;
  daily: number;
  weekly: number;
  monthly: number;
  yearly: number;
  bySource: Record<EarningSource, number>;
  recentTransactions: EarningRecord[];
}

export interface EarningsStats {
  today: number;
  yesterday: number;
  thisWeek: number;
  lastWeek: number;
  thisMonth: number;
  lastMonth: number;
  thisYear: number;
  lastYear: number;
  allTime: number;
  transactionCount: number;
  averagePerDay: number;
  averagePerWeek: number;
  averagePerMonth: number;
}

export const EARNING_SOURCE_LABELS: Record<EarningSource, string> = {
  promotion_basic: 'Basic Promotion',
  promotion_premium: 'Premium Promotion',
  promotion_featured: 'Featured Promotion',
  listing_featured: 'Featured Listing',
  verification_fee: 'Verification Fee',
  subscription: 'Subscription',
  transaction_fee: 'Transaction Fee',
};

export const EARNING_SOURCE_COLORS: Record<EarningSource, string> = {
  promotion_basic: 'bg-blue-500/10 text-blue-500',
  promotion_premium: 'bg-purple-500/10 text-purple-500',
  promotion_featured: 'bg-amber-500/10 text-amber-500',
  listing_featured: 'bg-green-500/10 text-green-500',
  verification_fee: 'bg-pink-500/10 text-pink-500',
  subscription: 'bg-cyan-500/10 text-cyan-500',
  transaction_fee: 'bg-orange-500/10 text-orange-500',
};
