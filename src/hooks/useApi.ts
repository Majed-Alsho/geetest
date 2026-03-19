'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Listing, ListingCategory, ListingRegion } from '@/lib/data';

// API response types
interface ApiListing {
  id: string;
  title: string;
  description: string;
  category: string;
  industry?: string | null;
  location: string;
  region: string;
  askingPrice: number;
  revenue: number;
  ebitda?: number | null;
  growthRate?: number | null;
  employees?: number | null;
  yearEstablished?: number | null;
  status: string;
  isFeatured: boolean;
  isVerified: boolean;
  verificationDate?: string | null;
  images?: string | null;
  viewCount: number;
  inquiryCount: number;
  ndaRequired: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string | null;
  expiresAt?: string | null;
  sellerId: string;
  seller?: {
    id: string;
    name: string | null;
    company: string | null;
  };
}

// Transform API listing to frontend Listing type
function transformListing(apiListing: ApiListing): Listing {
  return {
    id: apiListing.id,
    title: apiListing.title,
    description: apiListing.description,
    category: apiListing.category as ListingCategory,
    region: apiListing.region as ListingRegion,
    location: apiListing.location,
    highlights: [], // Would need to be stored separately or in JSON
    revenue: apiListing.revenue,
    growthYoY: apiListing.growthRate || 0,
    employees: apiListing.employees || 0,
    price: apiListing.askingPrice,
    ebitdaMargin: apiListing.ebitda ? Math.round((apiListing.ebitda / apiListing.revenue) * 100) : 0,
    verified: apiListing.isVerified,
    featured: apiListing.isFeatured,
    status: apiListing.status.toLowerCase() as 'pending' | 'approved' | 'rejected',
    createdAt: apiListing.createdAt,
    createdBy: apiListing.sellerId,
    analytics: {
      views: apiListing.viewCount,
      saves: 0,
      inquiries: apiListing.inquiryCount,
    },
    verification: apiListing.isVerified ? {
      financialsVerified: true,
      revenueVerified: true,
      trafficVerified: false,
      sellerVerified: true,
      ddReady: true,
      ndaRequired: apiListing.ndaRequired,
      verificationScore: 85,
      businessEstablished: apiListing.yearEstablished,
    } : undefined,
    netProfit: apiListing.ebitda || undefined,
  };
}

// Listings list params
interface UseListingsParams {
  page?: number;
  limit?: number;
  category?: string | null;
  region?: string | null;
  minPrice?: number | null;
  maxPrice?: number | null;
  search?: string;
  status?: string;
}

// Hook for fetching listings
export function useApiListings(params: UseListingsParams = {}) {
  return useQuery({
    queryKey: ['listings', params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params.page) searchParams.set('page', params.page.toString());
      if (params.limit) searchParams.set('limit', params.limit.toString());
      if (params.category) searchParams.set('category', params.category);
      if (params.region) searchParams.set('region', params.region);
      if (params.minPrice) searchParams.set('minPrice', params.minPrice.toString());
      if (params.maxPrice) searchParams.set('maxPrice', params.maxPrice.toString());
      if (params.search) searchParams.set('search', params.search);
      if (params.status) searchParams.set('status', params.status);

      const response = await fetch(`/api/listings?${searchParams.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch listings');
      }
      
      const data = await response.json();
      return {
        listings: data.data.map(transformListing),
        meta: data.meta,
      };
    },
    staleTime: 30000, // 30 seconds
  });
}

// Hook for fetching a single listing
export function useApiListing(id: string | null) {
  return useQuery({
    queryKey: ['listing', id],
    queryFn: async () => {
      if (!id) return null;
      
      const response = await fetch(`/api/listings/${id}`);
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error('Failed to fetch listing');
      }
      
      const data = await response.json();
      return transformListing(data.data);
    },
    enabled: !!id,
    staleTime: 30000,
  });
}

// Hook for creating a listing
export function useCreateListing() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: {
      title: string;
      description: string;
      category: string;
      region: string;
      location: string;
      askingPrice: number;
      revenue: number;
      ebitda?: number;
      growthRate?: number;
      employees?: number;
    }) => {
      const response = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to create listing');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
    },
  });
}

// Hook for updating a listing
export function useUpdateListing() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { 
      id: string; 
      data: Record<string, unknown> 
    }) => {
      const response = await fetch(`/api/listings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to update listing');
      }
      
      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      queryClient.invalidateQueries({ queryKey: ['listing', variables.id] });
    },
  });
}

// Hook for deleting a listing
export function useDeleteListing() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/listings/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to delete listing');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
    },
  });
}
