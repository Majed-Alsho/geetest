'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, X, Filter, ChevronDown, ChevronUp, SlidersHorizontal,
  Clock, TrendingUp, Building2, MapPin, DollarSign, Tag,
  Star, Eye, Heart, ArrowUpDown
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { cn } from '@/lib/utils';
import { Listing } from '@/types';
import { formatCurrency } from '@/lib/data';

interface AdvancedSearchProps {
  listings: Listing[];
  onResults: (results: Listing[]) => void;
  categories: string[];
  regions: string[];
}

interface SearchFilters {
  query: string;
  category: string;
  region: string;
  minPrice: number;
  maxPrice: number;
  minRevenue: number;
  sortBy: 'relevance' | 'price_asc' | 'price_desc' | 'revenue' | 'views' | 'newest';
  showOnlyFeatured: boolean;
  showOnlyVerified: boolean;
}

// Fuzzy matching function
function fuzzyMatch(text: string, query: string): { match: boolean; score: number } {
  const textLower = text.toLowerCase();
  const queryLower = query.toLowerCase();
  
  // Exact match
  if (textLower.includes(queryLower)) {
    return { match: true, score: 100 };
  }
  
  // Fuzzy match - check if characters appear in order
  let queryIndex = 0;
  let score = 0;
  let lastMatchIndex = -1;
  
  for (let i = 0; i < textLower.length && queryIndex < queryLower.length; i++) {
    if (textLower[i] === queryLower[queryIndex]) {
      score += 10 - Math.min(9, i - lastMatchIndex - 1); // Higher score for closer matches
      lastMatchIndex = i;
      queryIndex++;
    }
  }
  
  const match = queryIndex === queryLower.length;
  return { match, score: match ? score : 0 };
}

// Calculate relevance score
function calculateRelevance(listing: Listing, query: string): number {
  if (!query) return 50;
  
  let totalScore = 0;
  
  // Title match (highest weight)
  const titleMatch = fuzzyMatch(listing.title, query);
  if (titleMatch.match) totalScore += titleMatch.score * 2;
  
  // Category match
  const categoryMatch = fuzzyMatch(listing.category, query);
  if (categoryMatch.match) totalScore += categoryMatch.score;
  
  // Description match
  if (listing.description) {
    const descMatch = fuzzyMatch(listing.description, query);
    if (descMatch.match) totalScore += descMatch.score * 0.5;
  }
  
  // Location match
  const locationMatch = fuzzyMatch(`${listing.location} ${listing.region}`, query);
  if (locationMatch.match) totalScore += locationMatch.score;
  
  return totalScore;
}

export function AdvancedSearch({ listings, onResults, categories, regions }: AdvancedSearchProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    category: '',
    region: '',
    minPrice: 0,
    maxPrice: 0,
    minRevenue: 0,
    sortBy: 'relevance',
    showOnlyFeatured: false,
    showOnlyVerified: false,
  });
  
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  
  // Load recent searches from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('gee_recent_searches');
    if (stored) {
      setRecentSearches(JSON.parse(stored).slice(0, 5));
    }
  }, []);
  
  // Save recent search
  const saveRecentSearch = (query: string) => {
    if (!query.trim()) return;
    
    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('gee_recent_searches', JSON.stringify(updated));
  };
  
  // Filter and sort listings
  const filteredListings = useMemo(() => {
    let results = [...listings];
    
    // Apply text search with fuzzy matching
    if (filters.query) {
      results = results.filter(listing => {
        const titleMatch = fuzzyMatch(listing.title, filters.query);
        const categoryMatch = fuzzyMatch(listing.category, filters.query);
        const locationMatch = fuzzyMatch(`${listing.location} ${listing.region}`, filters.query);
        const descMatch = listing.description ? fuzzyMatch(listing.description, filters.query) : { match: false };
        
        return titleMatch.match || categoryMatch.match || locationMatch.match || descMatch.match;
      });
    }
    
    // Apply category filter
    if (filters.category) {
      results = results.filter(l => l.category === filters.category);
    }
    
    // Apply region filter
    if (filters.region) {
      results = results.filter(l => l.region === filters.region);
    }
    
    // Apply price filters
    if (filters.minPrice > 0) {
      results = results.filter(l => l.price >= filters.minPrice);
    }
    if (filters.maxPrice > 0) {
      results = results.filter(l => l.price <= filters.maxPrice);
    }
    
    // Apply revenue filter
    if (filters.minRevenue > 0) {
      results = results.filter(l => l.revenue >= filters.minRevenue);
    }
    
    // Apply featured filter
    if (filters.showOnlyFeatured) {
      results = results.filter(l => l.featured);
    }
    
    // Apply verified filter
    if (filters.showOnlyVerified) {
      results = results.filter(l => l.verified);
    }
    
    // Sort results
    switch (filters.sortBy) {
      case 'price_asc':
        results.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        results.sort((a, b) => b.price - a.price);
        break;
      case 'revenue':
        results.sort((a, b) => b.revenue - a.revenue);
        break;
      case 'views':
        results.sort((a, b) => (b.analytics?.views || 0) - (a.analytics?.views || 0));
        break;
      case 'newest':
        results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'relevance':
      default:
        if (filters.query) {
          results.sort((a, b) => calculateRelevance(b, filters.query) - calculateRelevance(a, filters.query));
        }
        break;
    }
    
    return results;
  }, [listings, filters]);
  
  // Notify parent of results
  useEffect(() => {
    onResults(filteredListings);
  }, [filteredListings, onResults]);
  
  const clearFilters = () => {
    setFilters({
      query: '',
      category: '',
      region: '',
      minPrice: 0,
      maxPrice: 0,
      minRevenue: 0,
      sortBy: 'relevance',
      showOnlyFeatured: false,
      showOnlyVerified: false,
    });
  };
  
  const hasActiveFilters = filters.query || filters.category || filters.region || 
    filters.minPrice > 0 || filters.maxPrice > 0 || filters.minRevenue > 0 ||
    filters.showOnlyFeatured || filters.showOnlyVerified;
  
  return (
    <div className="space-y-4">
      {/* Main Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            value={filters.query}
            onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
            onBlur={() => saveRecentSearch(filters.query)}
            placeholder="Search businesses by name, category, location..."
            className="pl-10 pr-10"
          />
          {filters.query && (
            <button
              onClick={() => setFilters(prev => ({ ...prev, query: '' }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <Button
          onClick={() => setShowFilters(!showFilters)}
          variant={showFilters ? "default" : "outline"}
          className={cn(showFilters && "btn-accent")}
        >
          <SlidersHorizontal className="w-4 h-4 mr-2" />
          Filters
          {hasActiveFilters && (
            <span className="ml-2 px-1.5 py-0.5 rounded-full bg-accent/20 text-xs">
              Active
            </span>
          )}
        </Button>
      </div>
      
      {/* Recent Searches */}
      {!showFilters && !filters.query && recentSearches.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <Clock className="w-4 h-4 text-muted-foreground" />
          {recentSearches.map((search, i) => (
            <button
              key={i}
              onClick={() => setFilters(prev => ({ ...prev, query: search }))}
              className="px-3 py-1 rounded-full bg-secondary/50 text-sm hover:bg-secondary transition-colors"
            >
              {search}
            </button>
          ))}
        </div>
      )}
      
      {/* Advanced Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <GlassPanel className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Category */}
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Category</label>
                  <select
                    value={filters.category}
                    onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full p-2 rounded-lg border border-border bg-background"
                  >
                    <option value="">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                
                {/* Region */}
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Region</label>
                  <select
                    value={filters.region}
                    onChange={(e) => setFilters(prev => ({ ...prev, region: e.target.value }))}
                    className="w-full p-2 rounded-lg border border-border bg-background"
                  >
                    <option value="">All Regions</option>
                    {regions.map(reg => (
                      <option key={reg} value={reg}>{reg}</option>
                    ))}
                  </select>
                </div>
                
                {/* Min Price */}
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Min Price</label>
                  <Input
                    type="number"
                    value={filters.minPrice || ''}
                    onChange={(e) => setFilters(prev => ({ ...prev, minPrice: parseInt(e.target.value) || 0 }))}
                    placeholder="$0"
                  />
                </div>
                
                {/* Max Price */}
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Max Price</label>
                  <Input
                    type="number"
                    value={filters.maxPrice || ''}
                    onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: parseInt(e.target.value) || 0 }))}
                    placeholder="No limit"
                  />
                </div>
                
                {/* Min Revenue */}
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Min Revenue</label>
                  <Input
                    type="number"
                    value={filters.minRevenue || ''}
                    onChange={(e) => setFilters(prev => ({ ...prev, minRevenue: parseInt(e.target.value) || 0 }))}
                    placeholder="$0"
                  />
                </div>
                
                {/* Sort By */}
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Sort By</label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as SearchFilters['sortBy'] }))}
                    className="w-full p-2 rounded-lg border border-border bg-background"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="newest">Newest First</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="revenue">Highest Revenue</option>
                    <option value="views">Most Viewed</option>
                  </select>
                </div>
                
                {/* Quick Filters */}
                <div className="md:col-span-2 flex items-end gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.showOnlyFeatured}
                      onChange={(e) => setFilters(prev => ({ ...prev, showOnlyFeatured: e.target.checked }))}
                      className="w-4 h-4 rounded border-border"
                    />
                    <span className="text-sm">Featured Only</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.showOnlyVerified}
                      onChange={(e) => setFilters(prev => ({ ...prev, showOnlyVerified: e.target.checked }))}
                      className="w-4 h-4 rounded border-border"
                    />
                    <span className="text-sm">Verified Only</span>
                  </label>
                </div>
              </div>
              
              {/* Clear Filters */}
              {hasActiveFilters && (
                <div className="mt-4 pt-4 border-t border-border flex justify-end">
                  <Button onClick={clearFilters} variant="outline" size="sm">
                    <X className="w-4 h-4 mr-2" />
                    Clear All Filters
                  </Button>
                </div>
              )}
            </GlassPanel>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Results Count */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>{filteredListings.length} results found</span>
        {filters.query && (
          <span>
            Searching for: "<span className="text-foreground">{filters.query}</span>"
          </span>
        )}
      </div>
    </div>
  );
}
