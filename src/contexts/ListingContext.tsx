'use client';

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { Listing, ListingCategory, ListingRegion, ListingAnalytics, listings as seedListings } from '@/lib/data';

export interface ListingInput {
  title: string;
  category: ListingCategory;
  region: ListingRegion;
  location: string;
  description: string;
  highlights: string[];
  revenue: number;
  growthYoY: number;
  employees: number;
  price: number;
  ebitdaMargin: number;
  netProfit?: number;
  grossMargin?: number;
  debtToEquity?: number;
  customerRetention?: number;
  marketPotential?: 'Low' | 'Medium' | 'High' | 'Very High';
  // New fields
  images?: Listing['images'];
  coordinates?: Listing['coordinates'];
  address?: Listing['address'];
}

export interface ListingAnalyticsData {
  views: number;
  likes: number;
  saves: number;
  shares: number;
  inquiries: number;
  viewHistory: { date: string; count: number }[];
  likedBy: string[];
  savedBy: string[];
}

interface ListingContextType {
  listings: Listing[];
  isLoading: boolean;
  createListing: (data: ListingInput, userId: string) => Promise<Listing>;
  updateListing: (listingId: string, data: Partial<ListingInput>, userId: string) => Promise<{ success: boolean; error?: string }>;
  deleteListing: (listingId: string, userId: string) => Promise<{ success: boolean; error?: string }>;
  getListingById: (listingId: string) => Listing | undefined;
  getUserListings: (userId: string) => Listing[];
  approveListing: (listingId: string) => void;
  rejectListing: (listingId: string, reason: string) => void;
  refreshListings: () => void;
  // New analytics functions
  incrementViews: (listingId: string) => void;
  toggleLike: (listingId: string, userId: string) => { liked: boolean; count: number };
  toggleSave: (listingId: string, userId: string) => { saved: boolean; count: number };
  incrementShares: (listingId: string) => void;
  getListingAnalytics: (listingId: string) => ListingAnalyticsData | null;
}

const ListingContext = createContext<ListingContextType | null>(null);

const USER_LISTINGS_KEY = 'gee_user_listings';
const LISTING_ANALYTICS_KEY = 'gee_listing_analytics';

// Helper to generate unique ID
function generateId(): string {
  return `listing-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 5)}`;
}

// Get stored user listings from localStorage
function getStoredUserListings(): Listing[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(USER_LISTINGS_KEY);
    if (!data) return [];
    const parsed = JSON.parse(data);
    // Validate the data structure
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// Save user listings to localStorage
function saveUserListings(listings: Listing[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(USER_LISTINGS_KEY, JSON.stringify(listings));
  } catch (e) {
    console.error('Failed to save listings:', e);
  }
}

// Get all listings (seed + user-created)
function getAllListings(): Listing[] {
  if (typeof window === 'undefined') return [];
  const userListings = getStoredUserListings();
  // Combine seed listings with user-created listings
  // Use a Map to avoid duplicates by id
  const listingMap = new Map<string, Listing>();
  
  // Add seed listings first
  seedListings.forEach(listing => {
    listingMap.set(listing.id, listing);
  });
  
  // Add/override with user listings
  userListings.forEach(listing => {
    listingMap.set(listing.id, listing);
  });
  
  return Array.from(listingMap.values());
}

export function ListingProvider({ children }: { children: ReactNode }) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize listings on mount (client-side only)
  useEffect(() => {
    if (!isInitialized) {
      setListings(getAllListings());
      setIsInitialized(true);
    }
  }, [isInitialized]);

  // Get user's own listings
  const getUserListings = useCallback((userId: string): Listing[] => {
    return listings.filter(listing => listing.createdBy === userId);
  }, [listings]);

  // Get listing by ID
  const getListingById = useCallback((listingId: string): Listing | undefined => {
    return listings.find(listing => listing.id === listingId);
  }, [listings]);

  // Create a new listing
  const createListing = useCallback(async (data: ListingInput, userId: string): Promise<Listing> => {
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newListing: Listing = {
      id: generateId(),
      ...data,
      verified: false,
      featured: false,
      status: 'pending', // Requires admin approval
      createdAt: new Date().toISOString(),
      createdBy: userId,
      analytics: { views: 0, saves: 0, inquiries: 0 },
    };
    
    setListings(prev => {
      const updated = [...prev, newListing];
      // Store only user-created listings separately (not seed listings)
      const userListings = updated.filter(l => l.createdBy);
      saveUserListings(userListings);
      return updated;
    });
    
    setIsLoading(false);
    return newListing;
  }, []);

  // Update a listing
  const updateListing = useCallback(async (
    listingId: string, 
    data: Partial<ListingInput>, 
    userId: string
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const listing = listings.find(l => l.id === listingId);
    
    if (!listing) {
      setIsLoading(false);
      return { success: false, error: 'Listing not found.' };
    }
    
    if (listing.createdBy !== userId) {
      setIsLoading(false);
      return { success: false, error: 'You can only edit your own listings.' };
    }
    
    setListings(prev => {
      const updated = prev.map(l => {
        if (l.id === listingId) {
          return {
            ...l,
            ...data,
            status: 'pending' as const, // Reset to pending after edit
            verified: false,
          };
        }
        return l;
      });
      
      // Update user listings storage
      const userListings = updated.filter(l => l.createdBy);
      saveUserListings(userListings);
      return updated;
    });
    
    setIsLoading(false);
    return { success: true };
  }, [listings]);

  // Delete a listing
  const deleteListing = useCallback(async (
    listingId: string, 
    userId: string
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const listing = listings.find(l => l.id === listingId);
    
    if (!listing) {
      setIsLoading(false);
      return { success: false, error: 'Listing not found.' };
    }
    
    if (listing.createdBy !== userId) {
      setIsLoading(false);
      return { success: false, error: 'You can only delete your own listings.' };
    }
    
    setListings(prev => {
      const updated = prev.filter(l => l.id !== listingId);
      // Update user listings storage
      const userListings = updated.filter(l => l.createdBy);
      saveUserListings(userListings);
      return updated;
    });
    
    setIsLoading(false);
    return { success: true };
  }, [listings]);

  // Admin: Approve listing
  const approveListing = useCallback((listingId: string) => {
    setListings(prev => {
      const updated = prev.map(l => {
        if (l.id === listingId) {
          return { ...l, status: 'approved' as const, verified: true };
        }
        return l;
      });
      
      const userListings = updated.filter(l => l.createdBy);
      saveUserListings(userListings);
      return updated;
    });
  }, []);

  // Admin: Reject listing
  const rejectListing = useCallback((listingId: string, reason: string) => {
    setListings(prev => {
      const updated = prev.map(l => {
        if (l.id === listingId) {
          return { ...l, status: 'rejected' as const, rejectionReason: reason };
        }
        return l;
      });
      
      const userListings = updated.filter(l => l.createdBy);
      saveUserListings(userListings);
      return updated;
    });
  }, []);

  // Refresh listings from storage
  const refreshListings = useCallback(() => {
    setListings(getAllListings());
  }, []);

  // Get analytics data from localStorage
  const getStoredAnalytics = useCallback((listingId: string): ListingAnalyticsData => {
    if (typeof window === 'undefined') {
      return { views: 0, likes: 0, saves: 0, shares: 0, inquiries: 0, viewHistory: [], likedBy: [], savedBy: [] };
    }
    try {
      const data = localStorage.getItem(LISTING_ANALYTICS_KEY);
      if (!data) return { views: 0, likes: 0, saves: 0, shares: 0, inquiries: 0, viewHistory: [], likedBy: [], savedBy: [] };
      const allAnalytics = JSON.parse(data);
      return allAnalytics[listingId] || { views: 0, likes: 0, saves: 0, shares: 0, inquiries: 0, viewHistory: [], likedBy: [], savedBy: [] };
    } catch {
      return { views: 0, likes: 0, saves: 0, shares: 0, inquiries: 0, viewHistory: [], likedBy: [], savedBy: [] };
    }
  }, []);

  // Save analytics data to localStorage
  const saveAnalytics = useCallback((listingId: string, analytics: ListingAnalyticsData) => {
    if (typeof window === 'undefined') return;
    try {
      const data = localStorage.getItem(LISTING_ANALYTICS_KEY);
      const allAnalytics = data ? JSON.parse(data) : {};
      allAnalytics[listingId] = analytics;
      localStorage.setItem(LISTING_ANALYTICS_KEY, JSON.stringify(allAnalytics));
    } catch (e) {
      console.error('Failed to save analytics:', e);
    }
  }, []);

  // Increment view count and track in view history
  const incrementViews = useCallback((listingId: string) => {
    const analytics = getStoredAnalytics(listingId);
    const today = new Date().toISOString().split('T')[0];
    
    // Update view history
    const viewHistory = [...analytics.viewHistory];
    const todayIndex = viewHistory.findIndex(v => v.date === today);
    if (todayIndex >= 0) {
      viewHistory[todayIndex].count += 1;
    } else {
      viewHistory.push({ date: today, count: 1 });
    }
    
    // Keep only last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const filteredHistory = viewHistory.filter(v => new Date(v.date) >= thirtyDaysAgo);
    
    const updatedAnalytics: ListingAnalyticsData = {
      ...analytics,
      views: analytics.views + 1,
      viewHistory: filteredHistory,
    };
    
    saveAnalytics(listingId, updatedAnalytics);
    
    // Also update the listing's analytics
    setListings(prev => {
      return prev.map(l => {
        if (l.id === listingId) {
          return {
            ...l,
            analytics: {
              ...l.analytics,
              views: updatedAnalytics.views,
              viewHistory: updatedAnalytics.viewHistory,
            } as ListingAnalytics,
          };
        }
        return l;
      });
    });
  }, [getStoredAnalytics, saveAnalytics]);

  // Toggle like on a listing
  const toggleLike = useCallback((listingId: string, userId: string): { liked: boolean; count: number } => {
    const analytics = getStoredAnalytics(listingId);
    const likedBy = [...analytics.likedBy];
    const isLiked = likedBy.includes(userId);
    
    if (isLiked) {
      // Remove like
      const index = likedBy.indexOf(userId);
      likedBy.splice(index, 1);
    } else {
      // Add like
      likedBy.push(userId);
    }
    
    const updatedAnalytics: ListingAnalyticsData = {
      ...analytics,
      likes: likedBy.length,
      likedBy,
    };
    
    saveAnalytics(listingId, updatedAnalytics);
    
    // Also update the listing's analytics
    setListings(prev => {
      return prev.map(l => {
        if (l.id === listingId) {
          return {
            ...l,
            analytics: {
              ...l.analytics,
              likes: updatedAnalytics.likes,
              likedBy: updatedAnalytics.likedBy,
            } as ListingAnalytics,
          };
        }
        return l;
      });
    });
    
    return { liked: !isLiked, count: likedBy.length };
  }, [getStoredAnalytics, saveAnalytics]);

  // Toggle save on a listing
  const toggleSave = useCallback((listingId: string, userId: string): { saved: boolean; count: number } => {
    const analytics = getStoredAnalytics(listingId);
    const savedBy = [...analytics.savedBy];
    const isSaved = savedBy.includes(userId);
    
    if (isSaved) {
      // Remove save
      const index = savedBy.indexOf(userId);
      savedBy.splice(index, 1);
    } else {
      // Add save
      savedBy.push(userId);
    }
    
    const updatedAnalytics: ListingAnalyticsData = {
      ...analytics,
      saves: savedBy.length,
      savedBy,
    };
    
    saveAnalytics(listingId, updatedAnalytics);
    
    // Also update the listing's analytics
    setListings(prev => {
      return prev.map(l => {
        if (l.id === listingId) {
          return {
            ...l,
            analytics: {
              ...l.analytics,
              saves: updatedAnalytics.saves,
              savedBy: updatedAnalytics.savedBy,
            } as ListingAnalytics,
          };
        }
        return l;
      });
    });
    
    return { saved: !isSaved, count: savedBy.length };
  }, [getStoredAnalytics, saveAnalytics]);

  // Increment share count
  const incrementShares = useCallback((listingId: string) => {
    const analytics = getStoredAnalytics(listingId);
    
    const updatedAnalytics: ListingAnalyticsData = {
      ...analytics,
      shares: analytics.shares + 1,
    };
    
    saveAnalytics(listingId, updatedAnalytics);
    
    // Also update the listing's analytics
    setListings(prev => {
      return prev.map(l => {
        if (l.id === listingId) {
          return {
            ...l,
            analytics: {
              ...l.analytics,
              shares: updatedAnalytics.shares,
            } as ListingAnalytics,
          };
        }
        return l;
      });
    });
  }, [getStoredAnalytics, saveAnalytics]);

  // Get analytics data for a listing
  const getListingAnalytics = useCallback((listingId: string): ListingAnalyticsData | null => {
    return getStoredAnalytics(listingId);
  }, [getStoredAnalytics]);

  return (
    <ListingContext.Provider
      value={{
        listings,
        isLoading,
        createListing,
        updateListing,
        deleteListing,
        getListingById,
        getUserListings,
        approveListing,
        rejectListing,
        refreshListings,
        // New analytics functions
        incrementViews,
        toggleLike,
        toggleSave,
        incrementShares,
        getListingAnalytics,
      }}
    >
      {children}
    </ListingContext.Provider>
  );
}

export function useListings() {
  const context = useContext(ListingContext);
  if (!context) {
    return {
      listings: [],
      isLoading: false,
      createListing: async (): Promise<Listing> => { throw new Error('Not available'); },
      updateListing: async () => ({ success: false, error: 'Not available during SSR' }),
      deleteListing: async () => ({ success: false, error: 'Not available during SSR' }),
      getListingById: () => undefined,
      getUserListings: () => [],
      approveListing: () => {},
      rejectListing: () => {},
      refreshListings: () => {},
      // New analytics functions
      incrementViews: () => {},
      toggleLike: () => ({ liked: false, count: 0 }),
      toggleSave: () => ({ saved: false, count: 0 }),
      incrementShares: () => {},
      getListingAnalytics: () => null,
    };
  }
  return context;
}
