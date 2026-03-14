// Watchlist Types with Price Alerts

export interface WatchlistItem {
  id: string;
  userId: string;
  listingId: string;
  addedAt: Date;
  notes?: string;
  priceAlerts: PriceAlert[];
  lastPrice: number;
  lastChecked: Date;
}

export interface PriceAlert {
  id: string;
  type: 'drop_below' | 'rise_above' | 'percentage_drop' | 'any_change';
  targetValue: number;
  percentageThreshold?: number; // For percentage_drop type (e.g., 10 for 10%)
  triggered: boolean;
  triggeredAt?: Date;
  createdAt: Date;
  notificationSent: boolean;
}

export interface WatchlistStats {
  totalItems: number;
  activeAlerts: number;
  triggeredAlerts: number;
  totalValueChange: number;
  averagePriceChange: number;
}

export interface PriceHistory {
  listingId: string;
  prices: {
    price: number;
    recordedAt: Date;
    source: 'initial' | 'update' | 'alert_check';
  }[];
}

export type AlertCondition = 'drop_below' | 'rise_above' | 'percentage_drop' | 'any_change';

export const ALERT_CONDITION_LABELS: Record<AlertCondition, string> = {
  drop_below: 'Price drops below',
  rise_above: 'Price rises above',
  percentage_drop: 'Price drops by',
  any_change: 'Any price change',
};
