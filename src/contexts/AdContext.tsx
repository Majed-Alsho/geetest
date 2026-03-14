'use client';

import { createContext, useContext, useState, useCallback, useEffect, ReactNode, useRef } from 'react';
import { 
  Advertisement, 
  AdDuration, 
  AdTier, 
  AdStatus,
  AD_PRICING,
  PROMOTION_PACKAGES,
  PAYMENT_DEADLINE_HOURS,
  NEAR_EXPIRY_HOURS,
  calculatePromotionPrice,
  getTimeRemaining
} from '@/types/advertising';
import { useNotifications } from './NotificationsContext';

interface AdContextType {
  ads: Advertisement[];
  activeAds: Advertisement[];
  isLoading: boolean;
  createAd: (data: {
    listingId: string;
    listingTitle: string;
    tier: AdTier;
    duration: AdDuration;
    userId: string;
    userEmail: string;
    userName: string;
  }) => Promise<Advertisement>;
  approveAd: (adId: string) => void;
  rejectAd: (adId: string, reason: string) => void;
  payForAd: (adId: string) => Promise<boolean>;
  cancelAd: (adId: string) => void;
  pauseAd: (adId: string) => void;
  resumeAd: (adId: string) => void;
  deleteAd: (adId: string) => void;
  extendAd: (adId: string, duration: AdDuration) => Promise<boolean>;
  getAdsByListing: (listingId: string) => Advertisement[];
  getAdsByUser: (userId: string) => Advertisement[];
  getActiveAdsForListing: (listingId: string) => Advertisement | undefined;
  incrementImpression: (adId: string) => void;
  incrementClick: (adId: string) => void;
  getStats: () => { total: number; active: number; pending: number; pendingPayment: number; revenue: number };
  calculatePrice: (tier: AdTier, duration: AdDuration, listingCount: number) => { basePrice: number; discount: number; finalPrice: number };
}

const AdContext = createContext<AdContextType | null>(null);

const ADS_KEY = 'gee_advertisements';

// Helper to generate unique ID
function generateId(): string {
  return `AD-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 5)}`.toUpperCase();
}

// Get stored ads from localStorage
function getStoredAds(): Advertisement[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(ADS_KEY);
    const ads = data ? JSON.parse(data) : [];
    // Deserialize dates
    return ads.map((ad: Advertisement) => ({
      ...ad,
      createdAt: new Date(ad.createdAt),
      startDate: new Date(ad.startDate),
      endDate: new Date(ad.endDate),
      approvedAt: ad.approvedAt ? new Date(ad.approvedAt) : undefined,
      paymentDeadline: ad.paymentDeadline ? new Date(ad.paymentDeadline) : undefined,
      paidAt: ad.paidAt ? new Date(ad.paidAt) : undefined,
    }));
  } catch {
    return [];
  }
}

// Save ads to localStorage
function saveAds(ads: Advertisement[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ADS_KEY, JSON.stringify(ads));
  } catch (e) {
    console.error('Failed to save ads:', e);
  }
}

// Lazy initializer for useState
function getInitialAds(): Advertisement[] {
  if (typeof window === 'undefined') return [];
  return getStoredAds();
}

export function AdProvider({ children }: { children: ReactNode }) {
  const [ads, setAds] = useState<Advertisement[]>(getInitialAds);
  const [isLoading] = useState(false);
  const { addNotification } = useNotifications();
  const notifiedAdsRef = useRef<Set<string>>(new Set());

  // Get active ads
  const activeAds = ads.filter(ad => ad.status === 'active');

  // Check for expired ads and payment deadlines
  useEffect(() => {
    const checkExpiration = () => {
      const now = new Date();
      let hasChanges = false;
      const newNotifiedAds = new Set(notifiedAdsRef.current);

      setAds(prev => {
        const updated = prev.map(ad => {
          // Check for expired payment deadline
          if (ad.status === 'approved_pending_payment' && ad.paymentDeadline) {
            if (new Date(ad.paymentDeadline) < now) {
              hasChanges = true;
              return { ...ad, status: 'expired' as AdStatus };
            }
          }

          // Check for expired active promotion
          if (ad.status === 'active' && new Date(ad.endDate) < now) {
            hasChanges = true;
            return { ...ad, status: 'expired' as AdStatus };
          }

          // Check for near-expiry notification (6 hours before end)
          if (ad.status === 'active' && ad.endDate) {
            const timeRemaining = getTimeRemaining(ad.endDate);
            const hoursRemaining = timeRemaining.total / (1000 * 60 * 60);
            
            if (hoursRemaining > 0 && hoursRemaining <= NEAR_EXPIRY_HOURS && !newNotifiedAds.has(`near-expiry-${ad.id}`)) {
              newNotifiedAds.add(`near-expiry-${ad.id}`);
              addNotification({
                type: 'system',
                title: 'Promotion Expiring Soon',
                message: `Your promotion for "${ad.listingTitle}" will expire in ${Math.ceil(hoursRemaining)} hours. Extend now to maintain visibility.`,
                priority: 'high',
                relatedId: ad.id,
              });
            }
          }

          return ad;
        });

        if (hasChanges) {
          saveAds(updated);
        }
        return updated;
      });

      notifiedAdsRef.current = newNotifiedAds;
    };

    // Check immediately
    checkExpiration();

    // Check every 60 seconds
    const interval = setInterval(checkExpiration, 60000);

    return () => clearInterval(interval);
  }, [addNotification]);

  const createAd = useCallback(async (data: {
    listingId: string;
    listingTitle: string;
    tier: AdTier;
    duration: AdDuration;
    userId: string;
    userEmail: string;
    userName: string;
  }): Promise<Advertisement> => {
    await new Promise(resolve => setTimeout(resolve, 500));

    const pricing = AD_PRICING.find(p => p.duration === data.duration);
    const package_ = PROMOTION_PACKAGES.find(p => p.tier === data.tier);
    
    if (!pricing || !package_) {
      throw new Error('Invalid ad configuration');
    }

    const { finalPrice } = calculatePromotionPrice(data.tier, data.duration, 1);
    
    const now = new Date();
    // Set initial dates - will be updated when payment is made
    const endDate = new Date(now);
    endDate.setDate(endDate.getDate() + pricing.days);

    const newAd: Advertisement = {
      id: generateId(),
      listingId: data.listingId,
      listingTitle: data.listingTitle,
      userId: data.userId,
      userEmail: data.userEmail,
      userName: data.userName,
      tier: data.tier,
      duration: data.duration,
      status: 'pending', // Requires admin approval
      startDate: now,
      endDate,
      pricePaid: finalPrice,
      impressions: 0,
      clicks: 0,
      createdAt: now,
    };

    setAds(prev => {
      const updated = [newAd, ...prev];
      saveAds(updated);
      return updated;
    });
    return newAd;
  }, []);

  const approveAd = useCallback((adId: string) => {
    setAds(prev => {
      const now = new Date();
      const paymentDeadline = new Date(now);
      paymentDeadline.setHours(paymentDeadline.getHours() + PAYMENT_DEADLINE_HOURS);

      const updated = prev.map(ad => {
        if (ad.id === adId) {
          return {
            ...ad,
            status: 'approved_pending_payment' as AdStatus,
            approvedAt: now,
            paymentDeadline,
          };
        }
        return ad;
      });
      saveAds(updated);

      // Notify the user
      const ad = updated.find(a => a.id === adId);
      if (ad) {
        addNotification({
          type: 'system',
          title: 'Promotion Approved!',
          message: `Your promotion for "${ad.listingTitle}" has been approved. You have 48 hours to complete payment.`,
          priority: 'high',
          relatedId: ad.id,
          userId: ad.userId,
        });
      }

      return updated;
    });
  }, [addNotification]);

  const rejectAd = useCallback((adId: string, reason: string) => {
    setAds(prev => {
      const updated = prev.map(ad => {
        if (ad.id === adId) {
          return {
            ...ad,
            status: 'rejected' as AdStatus,
            rejectionReason: reason,
          };
        }
        return ad;
      });
      saveAds(updated);

      // Notify the user
      const ad = updated.find(a => a.id === adId);
      if (ad) {
        addNotification({
          type: 'system',
          title: 'Promotion Rejected',
          message: `Your promotion for "${ad.listingTitle}" was rejected. Reason: ${reason}`,
          priority: 'high',
          relatedId: ad.id,
          userId: ad.userId,
        });
      }

      return updated;
    });
  }, [addNotification]);

  const payForAd = useCallback(async (adId: string): Promise<boolean> => {
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1000));

    const pricing = AD_PRICING.find(p => p.duration);
    
    setAds(prev => {
      const now = new Date();
      
      const updated = prev.map(ad => {
        if (ad.id === adId && ad.status === 'approved_pending_payment') {
          // Calculate end date from now
          const pricingInfo = AD_PRICING.find(p => p.duration === ad.duration);
          const endDate = new Date(now);
          if (pricingInfo) {
            endDate.setDate(endDate.getDate() + pricingInfo.days);
          }

          return {
            ...ad,
            status: 'active' as AdStatus,
            startDate: now,
            endDate,
            paidAt: now,
          };
        }
        return ad;
      });
      saveAds(updated);

      // Notify the user
      const ad = updated.find(a => a.id === adId);
      if (ad) {
        addNotification({
          type: 'system',
          title: 'Promotion Activated!',
          message: `Your promotion for "${ad.listingTitle}" is now live and will run until ${ad.endDate.toLocaleDateString()}.`,
          priority: 'medium',
          relatedId: ad.id,
        });
      }

      return updated;
    });

    return true;
  }, [addNotification]);

  const cancelAd = useCallback((adId: string) => {
    setAds(prev => {
      const updated = prev.map(ad => {
        if (ad.id === adId && (ad.status === 'pending' || ad.status === 'approved_pending_payment')) {
          return { ...ad, status: 'cancelled' as AdStatus };
        }
        return ad;
      });
      saveAds(updated);
      return updated;
    });
  }, []);

  const pauseAd = useCallback((adId: string) => {
    setAds(prev => {
      const updated = prev.map(ad => {
        if (ad.id === adId && ad.status === 'active') {
          return { ...ad, status: 'paused' as AdStatus };
        }
        return ad;
      });
      saveAds(updated);
      return updated;
    });
  }, []);

  const resumeAd = useCallback((adId: string) => {
    setAds(prev => {
      const updated = prev.map(ad => {
        if (ad.id === adId && ad.status === 'paused') {
          return { ...ad, status: 'active' as AdStatus };
        }
        return ad;
      });
      saveAds(updated);
      return updated;
    });
  }, []);

  const deleteAd = useCallback((adId: string) => {
    setAds(prev => {
      const updated = prev.filter(ad => ad.id !== adId);
      saveAds(updated);
      return updated;
    });
  }, []);

  const extendAd = useCallback(async (adId: string, duration: AdDuration): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 500));

    const pricingInfo = AD_PRICING.find(p => p.duration === duration);
    if (!pricingInfo) return false;

    setAds(prev => {
      const updated = prev.map(ad => {
        if (ad.id === adId && ad.status === 'active') {
          const newEndDate = new Date(ad.endDate);
          newEndDate.setDate(newEndDate.getDate() + pricingInfo.days);
          return { ...ad, endDate: newEndDate };
        }
        return ad;
      });
      saveAds(updated);

      // Notify the user
      const ad = updated.find(a => a.id === adId);
      if (ad) {
        addNotification({
          type: 'system',
          title: 'Promotion Extended!',
          message: `Your promotion for "${ad.listingTitle}" has been extended until ${ad.endDate.toLocaleDateString()}.`,
          priority: 'medium',
          relatedId: ad.id,
        });
      }

      return updated;
    });

    return true;
  }, [addNotification]);

  const getAdsByListing = useCallback((listingId: string): Advertisement[] => {
    return ads.filter(ad => ad.listingId === listingId);
  }, [ads]);

  const getAdsByUser = useCallback((userId: string): Advertisement[] => {
    return ads.filter(ad => ad.userId === userId);
  }, [ads]);

  const getActiveAdsForListing = useCallback((listingId: string): Advertisement | undefined => {
    return ads.find(ad => ad.listingId === listingId && ad.status === 'active');
  }, [ads]);

  const incrementImpression = useCallback((adId: string) => {
    setAds(prev => {
      const updated = prev.map(ad => {
        if (ad.id === adId) {
          return { ...ad, impressions: ad.impressions + 1 };
        }
        return ad;
      });
      saveAds(updated);
      return updated;
    });
  }, []);

  const incrementClick = useCallback((adId: string) => {
    setAds(prev => {
      const updated = prev.map(ad => {
        if (ad.id === adId) {
          return { ...ad, clicks: ad.clicks + 1 };
        }
        return ad;
      });
      saveAds(updated);
      return updated;
    });
  }, []);

  const getStats = useCallback(() => {
    return {
      total: ads.length,
      active: ads.filter(a => a.status === 'active').length,
      pending: ads.filter(a => a.status === 'pending').length,
      pendingPayment: ads.filter(a => a.status === 'approved_pending_payment').length,
      revenue: ads.filter(a => a.status === 'active' || a.status === 'expired').reduce((sum, a) => sum + a.pricePaid, 0),
    };
  }, [ads]);

  const calculatePrice = useCallback((tier: AdTier, duration: AdDuration, listingCount: number) => {
    return calculatePromotionPrice(tier, duration, listingCount);
  }, []);

  return (
    <AdContext.Provider
      value={{
        ads,
        activeAds,
        isLoading,
        createAd,
        approveAd,
        rejectAd,
        payForAd,
        cancelAd,
        pauseAd,
        resumeAd,
        deleteAd,
        extendAd,
        getAdsByListing,
        getAdsByUser,
        getActiveAdsForListing,
        incrementImpression,
        incrementClick,
        getStats,
        calculatePrice,
      }}
    >
      {children}
    </AdContext.Provider>
  );
}

export function useAds() {
  const context = useContext(AdContext);
  if (!context) {
    return {
      ads: [],
      activeAds: [],
      isLoading: false,
      createAd: async () => { throw new Error('Not available'); },
      approveAd: () => {},
      rejectAd: () => {},
      payForAd: async () => false,
      cancelAd: () => {},
      pauseAd: () => {},
      resumeAd: () => {},
      deleteAd: () => {},
      extendAd: async () => false,
      getAdsByListing: () => [],
      getAdsByUser: () => [],
      getActiveAdsForListing: () => undefined,
      incrementImpression: () => {},
      incrementClick: () => {},
      getStats: () => ({ total: 0, active: 0, pending: 0, pendingPayment: 0, revenue: 0 }),
      calculatePrice: () => ({ basePrice: 0, discount: 0, finalPrice: 0 }),
    };
  }
  return context;
}
