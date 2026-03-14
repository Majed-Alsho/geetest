// Advertising and Promotion Types

export type AdDuration = '3_days' | '7_days' | '14_days' | '30_days';
export type AdStatus = 'pending' | 'approved_pending_payment' | 'active' | 'paused' | 'expired' | 'rejected' | 'cancelled';
export type AdTier = 'basic' | 'premium' | 'featured';

export interface AdPricing {
  duration: AdDuration;
  days: number;
  pricePerListing: number;
  discount: number; // Percentage discount for bulk
}

export interface Advertisement {
  id: string;
  listingId: string;
  listingTitle: string;
  userId: string;
  userEmail: string;
  userName: string;
  tier: AdTier;
  duration: AdDuration;
  status: AdStatus;
  startDate: Date;
  endDate: Date;
  pricePaid: number;
  impressions: number;
  clicks: number;
  createdAt: Date;
  // Payment workflow fields
  approvedAt?: Date;           // When admin approved
  paymentDeadline?: Date;      // 48 hours after approval
  paidAt?: Date;               // When user paid
  // Admin fields
  adminNotes?: string;
  rejectionReason?: string;
}

export interface PromotionPackage {
  id: string;
  name: string;
  tier: AdTier;
  description: string;
  features: string[];
  priceMultiplier: number;
  boostPercentage: number; // How much it boosts in search
}

// Pricing configuration
export const AD_PRICING: AdPricing[] = [
  { duration: '3_days', days: 3, pricePerListing: 29, discount: 0 },
  { duration: '7_days', days: 7, pricePerListing: 59, discount: 10 },
  { duration: '14_days', days: 14, pricePerListing: 99, discount: 15 },
  { duration: '30_days', days: 30, pricePerListing: 179, discount: 25 },
];

// Promotion packages - used in the UI
export const PROMOTION_PACKAGES: { id: string; name: string; tier: AdTier; description: string; features: string[]; priceMultiplier: number; boostPercentage: number }[] = [
  {
    id: 'basic',
    name: 'Basic Boost',
    tier: 'basic',
    description: 'Get your listing seen by more people',
    features: [
      'Appears in "Promoted" section',
      'Highlighted in search results',
      'Basic analytics',
    ],
    priceMultiplier: 1,
    boostPercentage: 50,
  },
  {
    id: 'premium',
    name: 'Premium Placement',
    tier: 'premium',
    description: 'Stand out from the competition',
    features: [
      'Top of search results',
      '"Promoted" badge on listing',
      'Enhanced analytics',
      'Email notification to matching buyers',
    ],
    priceMultiplier: 1.5,
    boostPercentage: 100,
  },
  {
    id: 'featured',
    name: 'Featured Listing',
    tier: 'featured',
    description: 'Maximum visibility for your listing',
    features: [
      'Homepage featured section',
      'Top of all search results',
      'Premium badge with animation',
      'Full analytics dashboard',
      'Priority support',
      'Social media promotion',
    ],
    priceMultiplier: 2.5,
    boostPercentage: 200,
  },
];

// Bulk discount tiers
export const BULK_DISCOUNTS = [
  { minListings: 1, discount: 0 },
  { minListings: 2, discount: 5 },
  { minListings: 3, discount: 10 },
  { minListings: 5, discount: 15 },
  { minListings: 10, discount: 20 },
];

// Payment deadline in hours
export const PAYMENT_DEADLINE_HOURS = 48;

// Near-expiry notification threshold in hours
export const NEAR_EXPIRY_HOURS = 6;

// Extend promotion window in hours (how many hours before expiry user can extend)
export const EXTEND_WINDOW_HOURS = 24;

// Calculate price for promotion
export function calculatePromotionPrice(
  tier: AdTier,
  duration: AdDuration,
  listingCount: number
): { basePrice: number; discount: number; finalPrice: number } {
  const pricing = AD_PRICING.find(p => p.duration === duration);
  const package_ = PROMOTION_PACKAGES.find(p => p.tier === tier);
  
  if (!pricing || !package_) {
    return { basePrice: 0, discount: 0, finalPrice: 0 };
  }
  
  const basePrice = pricing.pricePerListing * package_.priceMultiplier * listingCount;
  
  // Apply duration discount
  let discount = (basePrice * pricing.discount) / 100;
  
  // Apply bulk discount
  const bulkDiscount = BULK_DISCOUNTS.reduce((max, tier) => {
    if (listingCount >= tier.minListings && tier.discount > max) {
      return tier.discount;
    }
    return max;
  }, 0);
  
  discount += (basePrice * bulkDiscount) / 100;
  
  const finalPrice = Math.max(0, basePrice - discount);
  
  return {
    basePrice: Math.round(basePrice * 100) / 100,
    discount: Math.round(discount * 100) / 100,
    finalPrice: Math.round(finalPrice * 100) / 100,
  };
}

// Helper to check if payment is still valid
export function isPaymentValid(ad: Advertisement): boolean {
  if (ad.status !== 'approved_pending_payment') return false;
  if (!ad.paymentDeadline) return false;
  return new Date(ad.paymentDeadline) > new Date();
}

// Helper to check if promotion can be extended
export function canExtendPromotion(ad: Advertisement): boolean {
  if (ad.status !== 'active') return false;
  if (!ad.endDate) return false;
  
  const now = new Date();
  const endDate = new Date(ad.endDate);
  const hoursUntilExpiry = (endDate.getTime() - now.getTime()) / (1000 * 60 * 60);
  
  return hoursUntilExpiry > 0 && hoursUntilExpiry <= EXTEND_WINDOW_HOURS;
}

// Helper to get time remaining
export function getTimeRemaining(endDate: Date): { days: number; hours: number; minutes: number; total: number } {
  const now = new Date();
  const end = new Date(endDate);
  const total = Math.max(0, end.getTime() - now.getTime());
  
  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  const hours = Math.floor((total % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((total % (1000 * 60 * 60)) / (1000 * 60));
  
  return { days, hours, minutes, total };
}
