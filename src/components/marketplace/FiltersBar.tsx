'use client';

import { useState } from 'react';
import { Search, Filter, X, ChevronDown } from 'lucide-react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { categories, regions, priceRanges } from '@/lib/data';
import { cn } from '@/lib/utils';

interface FiltersBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  category: string | null;
  onCategoryChange: (value: string | null) => void;
  region: string | null;
  onRegionChange: (value: string | null) => void;
  priceRange: { min: number; max: number } | null;
  onPriceRangeChange: (value: { min: number; max: number } | null) => void;
  verifiedOnly: boolean;
  onVerifiedChange: (value: boolean) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
}

export function FiltersBar({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  region,
  onRegionChange,
  priceRange,
  onPriceRangeChange,
  verifiedOnly,
  onVerifiedChange,
  sortBy,
  onSortChange
}: FiltersBarProps) {
  const [showFilters, setShowFilters] = useState(false);

  const activeFiltersCount = [
    category,
    region,
    priceRange,
    verifiedOnly
  ].filter(Boolean).length;

  const clearFilters = () => {
    onCategoryChange(null);
    onRegionChange(null);
    onPriceRangeChange(null);
    onVerifiedChange(false);
    onSearchChange('');
  };

  return (
    <div className="space-y-4">
      {/* Search & Toggle */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search listings..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
          />
          {search && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Toggle & Sort */}
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "flex items-center gap-2 px-4 py-3 rounded-xl border transition-colors",
              showFilters || activeFiltersCount > 0
                ? "bg-accent/10 border-accent text-accent"
                : "bg-secondary/50 border-border text-foreground hover:border-accent"
            )}
          >
            <Filter className="w-5 h-5" />
            <span className="hidden sm:inline">Filters</span>
            {activeFiltersCount > 0 && (
              <span className="bg-accent text-accent-foreground text-xs font-medium px-1.5 py-0.5 rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="appearance-none pl-4 pr-10 py-3 rounded-xl bg-secondary/50 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
            >
              <option value="featured">Featured</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="revenue-desc">Revenue: High to Low</option>
              <option value="growth-desc">Growth: High to Low</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <GlassPanel className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Category */}
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                value={category || ''}
                onChange={(e) => onCategoryChange(e.target.value || null)}
                className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Region */}
            <div>
              <label className="block text-sm font-medium mb-2">Region</label>
              <select
                value={region || ''}
                onChange={(e) => onRegionChange(e.target.value || null)}
                className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">All Regions</option>
                {regions.map((reg) => (
                  <option key={reg} value={reg}>{reg}</option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium mb-2">Price Range</label>
              <select
                value={priceRange ? `${priceRange.min}-${priceRange.max}` : ''}
                onChange={(e) => {
                  if (!e.target.value) {
                    onPriceRangeChange(null);
                  } else {
                    const range = priceRanges.find(
                      r => `${r.min}-${r.max}` === e.target.value
                    );
                    if (range) onPriceRangeChange({ min: range.min, max: range.max });
                  }
                }}
                className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Any Price</option>
                {priceRanges.map((range) => (
                  <option key={range.label} value={`${range.min}-${range.max}`}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Verified Only */}
            <div className="flex items-end">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={verifiedOnly}
                  onChange={(e) => onVerifiedChange(e.target.checked)}
                  className="w-5 h-5 rounded border-border text-accent focus:ring-accent"
                />
                <span className="text-sm font-medium">Verified Only</span>
              </label>
            </div>
          </div>

          {/* Clear Filters */}
          {activeFiltersCount > 0 && (
            <div className="mt-4 pt-4 border-t border-border">
              <button
                onClick={clearFilters}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Clear all filters
              </button>
            </div>
          )}
        </GlassPanel>
      )}
    </div>
  );
}
