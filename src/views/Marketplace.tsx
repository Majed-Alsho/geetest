'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

import { ListingCard } from '@/components/marketplace/ListingCard';
import { FiltersBar } from '@/components/marketplace/FiltersBar';
import { CompareBar } from '@/components/marketplace/CompareBar';
import { SkeletonGrid } from '@/components/marketplace/SkeletonCard';
import { useAuth } from '@/contexts/AuthContext';
import { useApiListings } from '@/hooks/useApi';
import { useAds } from '@/contexts/AdContext';
import { SearchX, Plus, Rocket } from 'lucide-react';
import { PromoteListingModal } from '@/components/promote/PromoteListingModal';
import { Listing } from '@/lib/data';

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'revenue-desc' | 'growth-desc';

export default function Marketplace() {
  const { isAuthenticated } = useAuth();
  const { data, isLoading: isApiLoading, refetch } = useApiListings({ limit: 50 });
  const { activeAds, incrementImpression } = useAds();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string | null>(null);
  const [region, setRegion] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<{ min: number; max: number } | null>(null);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [showPromoteModal, setShowPromoteModal] = useState(false);
  const [selectedListingForPromo, setSelectedListingForPromo] = useState<string | null>(null);

  // Get listings from API response
  const listings = data?.listings ?? [];

  // Get promoted listing IDs from active ads
  const promotedListingIds = useMemo(() => {
    return new Set(activeAds.map(ad => ad.listingId));
  }, [activeAds]);

  // Get promoted listings data
  const promotedListings = useMemo(() => {
    return activeAds
      .map(ad => {
        const listing = listings.find(l => l.id === ad.listingId);
        if (listing) {
          return { ...listing, adId: ad.id, adTier: ad.tier };
        }
        return null;
      })
      .filter(Boolean) as (Listing & { adId: string; adTier: string })[];
  }, [activeAds, listings]);

  // Track impressions for promoted listings
  useEffect(() => {
    promotedListings.forEach(listing => {
      if (listing?.adId) {
        incrementImpression(listing.adId);
      }
    });
  }, [promotedListings, incrementImpression]);

  // Filter and sort listings (client-side additional filtering)
  const filteredListings = useMemo(() => {
    let result = listings.filter(listing => !promotedListingIds.has(listing.id));
    
    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(listing => 
        listing.title.toLowerCase().includes(searchLower) ||
        listing.category.toLowerCase().includes(searchLower) ||
        listing.location.toLowerCase().includes(searchLower) ||
        listing.region.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply category filter
    if (category) {
      result = result.filter(listing => listing.category === category);
    }
    
    // Apply region filter
    if (region) {
      result = result.filter(listing => listing.region === region);
    }
    
    // Apply price filter
    if (priceRange) {
      result = result.filter(listing => 
        listing.price >= priceRange.min && listing.price <= priceRange.max
      );
    }
    
    // Apply verified filter
    if (verifiedOnly) {
      result = result.filter(listing => listing.verified);
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'revenue-desc':
        result.sort((a, b) => b.revenue - a.revenue);
        break;
      case 'growth-desc':
        result.sort((a, b) => b.growthYoY - a.growthYoY);
        break;
      case 'featured':
      default:
        // Featured listings first
        result.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return 0;
        });
        break;
    }
    
    return result;
  }, [listings, promotedListingIds, search, category, region, priceRange, verifiedOnly, sortBy]);

  const handlePromoteClick = (listingId: string) => {
    setSelectedListingForPromo(listingId);
    setShowPromoteModal(true);
  };

  const isLoading = isApiLoading;

  return (
    <>
      <section className="section-padding pb-24">
        <div className="container-wide">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-12">
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-4 tracking-tight"
              >
                Business Marketplace
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-lg text-muted-foreground max-w-2xl"
              >
                Explore vetted business opportunities across industries and regions. 
                All listings are confidential until you submit a vetted inquiry.
              </motion.p>
            </div>
            
            {isAuthenticated && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Link href="/create-listing" className="btn-accent whitespace-nowrap">
                  <Plus className="w-5 h-5" />
                  Create Listing
                </Link>
              </motion.div>
            )}
          </div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <FiltersBar
              search={search}
              onSearchChange={setSearch}
              category={category}
              onCategoryChange={setCategory}
              region={region}
              onRegionChange={setRegion}
              priceRange={priceRange}
              onPriceRangeChange={setPriceRange}
              verifiedOnly={verifiedOnly}
              onVerifiedChange={setVerifiedOnly}
              sortBy={sortBy}
              onSortChange={(value) => setSortBy(value as SortOption)}
            />
          </motion.div>

          {/* Promoted Listings Section */}
          {promotedListings.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <Rocket className="w-4 h-4 text-amber-500" />
                </div>
                <h2 className="text-lg font-semibold">Promoted Listings</h2>
                <span className="text-xs text-muted-foreground">
                  Sponsored • {promotedListings.length} listings
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {promotedListings.map((listing, index) => (
                  <ListingCard 
                    key={listing.id} 
                    listing={listing} 
                    index={index}
                    isPromoted
                    adId={listing.adId}
                    adTier={listing.adTier}
                    onPromoteClick={handlePromoteClick}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* Results Count */}
          <div className="mb-6 text-sm text-muted-foreground">
            {filteredListings.length} {filteredListings.length === 1 ? 'opportunity' : 'opportunities'} found
          </div>

          {/* Listings Grid */}
          {isLoading ? (
            <SkeletonGrid count={6} />
          ) : filteredListings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredListings.map((listing, index) => (
                <ListingCard 
                  key={listing.id} 
                  listing={listing} 
                  index={index}
                  onPromoteClick={isAuthenticated ? handlePromoteClick : undefined}
                />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <SearchX className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No matches found</h3>
              <p className="text-muted-foreground">
                Try adjusting your filters or search criteria.
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Compare Bar */}
      <CompareBar />

      {/* Promote Modal */}
      <PromoteListingModal 
        isOpen={showPromoteModal}
        onClose={() => setShowPromoteModal(false)}
        preselectedListingId={selectedListingForPromo || undefined}
      />
    </>
  );
}
