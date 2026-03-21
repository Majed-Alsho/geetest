'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, Search, Loader2, X, Crosshair, 
  ChevronDown, Map, Maximize2, Minimize2, Eye, EyeOff
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// Dynamic import for Leaflet to avoid SSR issues
import dynamic from 'next/dynamic';

// Types
export interface LocationData {
  address: string;
  city: string;
  state?: string;
  postalCode?: string;
  country: string;
  countryCode: string;
  lat: number;
  lng: number;
  region: string;
  showExactLocation?: boolean;
}

interface LocationPickerProps {
  value?: LocationData | null;
  onChange: (location: LocationData | null) => void;
  onRegionChange?: (region: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

// Country code to region mapping
const COUNTRY_TO_REGION: Record<string, string> = {
  // Europe
  'AT': 'Europe', 'BE': 'Europe', 'BG': 'Europe', 'HR': 'Europe',
  'CY': 'Europe', 'CZ': 'Europe', 'DK': 'Europe', 'EE': 'Europe',
  'FI': 'Europe', 'FR': 'Europe', 'DE': 'Europe', 'GR': 'Europe',
  'HU': 'Europe', 'IE': 'Europe', 'IT': 'Europe', 'LV': 'Europe',
  'LT': 'Europe', 'LU': 'Europe', 'MT': 'Europe', 'NL': 'Europe',
  'PL': 'Europe', 'PT': 'Europe', 'RO': 'Europe', 'SK': 'Europe',
  'SI': 'Europe', 'ES': 'Europe', 'SE': 'Europe', 'GB': 'Europe',
  'IS': 'Europe', 'NO': 'Europe', 'CH': 'Europe', 'RS': 'Europe',
  'UA': 'Europe', 'RU': 'Europe',
  
  // North America
  'US': 'North America', 'CA': 'North America', 'MX': 'North America',
  
  // Middle East
  'AE': 'Middle East', 'SA': 'Middle East', 'QA': 'Middle East',
  'KW': 'Middle East', 'BH': 'Middle East', 'OM': 'Middle East',
  'JO': 'Middle East', 'LB': 'Middle East', 'IL': 'Middle East',
  'TR': 'Middle East',
  
  // Asia Pacific
  'CN': 'Asia Pacific', 'JP': 'Asia Pacific', 'KR': 'Asia Pacific',
  'IN': 'Asia Pacific', 'SG': 'Asia Pacific', 'MY': 'Asia Pacific',
  'TH': 'Asia Pacific', 'VN': 'Asia Pacific', 'ID': 'Asia Pacific',
  'PH': 'Asia Pacific', 'TW': 'Asia Pacific', 'HK': 'Asia Pacific',
  'NZ': 'Asia Pacific',
  
  // Australia
  'AU': 'Australia',
};

interface SearchResult {
  place_id: string;
  display_name: string;
  lat: string;
  lon: string;
  type: string;
  address: {
    house_number?: string;
    road?: string;
    city?: string;
    town?: string;
    village?: string;
    state?: string;
    postcode?: string;
    country: string;
    country_code: string;
  };
}

// Search component
function LocationSearch({
  onSelect,
  disabled,
}: {
  onSelect: (result: SearchResult) => void;
  disabled?: boolean;
}) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search with debounce
  const searchAddress = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 3) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&addressdetails=1&limit=5`
      );
      const data = await response.json();
      setResults(data);
      setShowResults(true);
    } catch (error) {
      console.error('Search failed:', error);
      toast.error('Failed to search for address');
    } finally {
      setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    if (query.length >= 3) {
      debounceRef.current = setTimeout(() => {
        searchAddress(query);
      }, 300);
    } else {
      setResults([]);
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, searchAddress]);

  return (
    <div ref={searchRef} className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setShowResults(true)}
          placeholder="Search address (e.g., Batterigränd 8, Östersund)"
          disabled={disabled}
          className="w-full pl-10 pr-10 py-3 rounded-xl border border-border bg-background focus:border-accent focus:outline-none disabled:opacity-50"
        />
        {isSearching && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 animate-spin text-muted-foreground" />
        )}
        {query && !isSearching && (
          <button
            onClick={() => {
              setQuery('');
              setResults([]);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-secondary rounded"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      <AnimatePresence>
        {showResults && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-xl shadow-lg overflow-hidden z-50"
          >
            {results.map((result) => (
              <button
                key={result.place_id}
                onClick={() => {
                  onSelect(result);
                  setQuery(result.display_name.split(',').slice(0, 2).join(','));
                  setShowResults(false);
                }}
                className="w-full text-left px-4 py-3 hover:bg-secondary transition-colors border-b border-border last:border-b-0"
              >
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">
                      {result.display_name.split(',')[0]}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {result.display_name.split(',').slice(1, 4).join(',')}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Simple static map preview
function MapPreview({
  lat,
  lng,
  isExpanded,
  onToggleExpand,
}: {
  lat: number;
  lng: number;
  isExpanded: boolean;
  onToggleExpand: () => void;
}) {
  // Use OpenStreetMap tile layer directly via static image
  const zoom = isExpanded ? 15 : 13;
  const mapUrl = `https://tile.openstreetmap.org/${zoom}/${Math.floor((lng + 180) / 360 * Math.pow(2, zoom))}/${Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom))}.png`;

  return (
    <div className={cn(
      "relative rounded-xl overflow-hidden border border-border bg-secondary",
      isExpanded ? "h-[400px]" : "h-[200px]"
    )}>
      {/* Use an iframe for interactive map */}
      <iframe
        src={`https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.01}%2C${lat - 0.01}%2C${lng + 0.01}%2C${lat + 0.01}&layer=mapnik&marker=${lat}%2C${lng}`}
        className="w-full h-full border-0"
        title="Location Map"
      />
      
      {/* Expand/Collapse Button */}
      <button
        onClick={onToggleExpand}
        className="absolute top-2 right-2 p-2 bg-background/90 hover:bg-background rounded-lg shadow-sm"
      >
        {isExpanded ? (
          <Minimize2 className="w-4 h-4" />
        ) : (
          <Maximize2 className="w-4 h-4" />
        )}
      </button>
      
      {/* Marker Overlay */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative">
          <MapPin className="w-8 h-8 text-accent drop-shadow-lg" />
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-accent rounded-full opacity-50" />
        </div>
      </div>
    </div>
  );
}

export function LocationPicker({
  value,
  onChange,
  onRegionChange,
  placeholder = 'Enter business location',
  disabled = false,
  className,
}: LocationPickerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  const handleSelectResult = useCallback((result: SearchResult) => {
    const city = result.address.city || result.address.town || result.address.village || '';
    const countryCode = result.address.country_code?.toUpperCase() || '';
    const region = COUNTRY_TO_REGION[countryCode] || 'Europe';

    const locationData: LocationData = {
      address: result.display_name,
      city,
      state: result.address.state,
      postalCode: result.address.postcode,
      country: result.address.country,
      countryCode,
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon),
      region,
    };

    onChange(locationData);
    onRegionChange?.(region);
  }, [onChange, onRegionChange]);

  const handleGetCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      toast.error('Geolocation not supported');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Reverse geocode
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
          );
          const data = await response.json();
          
          const countryCode = data.address?.country_code?.toUpperCase() || '';
          const region = COUNTRY_TO_REGION[countryCode] || 'Europe';
          
          const locationData: LocationData = {
            address: data.display_name,
            city: data.address?.city || data.address?.town || data.address?.village || '',
            state: data.address?.state,
            postalCode: data.address?.postcode,
            country: data.address?.country,
            countryCode,
            lat: latitude,
            lng: longitude,
            region,
          };

          onChange(locationData);
          onRegionChange?.(region);
          toast.success('Location found!');
        } catch (error) {
          console.error('Reverse geocoding failed:', error);
          toast.error('Failed to get address for location');
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        toast.error('Failed to get your location');
        setIsLocating(false);
      },
      { enableHighAccuracy: true }
    );
  }, [onChange, onRegionChange]);

  const handleClear = useCallback(() => {
    onChange(null);
  }, [onChange]);

  return (
    <div className={cn("space-y-4", className)}>
      {/* Search Input */}
      <div className="space-y-2">
        <LocationSearch onSelect={handleSelectResult} disabled={disabled} />
        
        {/* Use My Location Button */}
        <button
          onClick={handleGetCurrentLocation}
          disabled={disabled || isLocating}
          className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors disabled:opacity-50"
        >
          {isLocating ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Crosshair className="w-4 h-4" />
          )}
          Use my current location
        </button>
      </div>

      {/* Selected Location Display */}
      {value && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Address Card */}
          <div className="flex items-start gap-3 p-4 rounded-xl bg-secondary/50 border border-border">
            <MapPin className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-medium">{value.address.split(',')[0]}</p>
              <p className="text-sm text-muted-foreground truncate">
                {value.address.split(',').slice(1, 4).join(',')}
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="px-2 py-0.5 rounded-full bg-accent/10 text-accent text-xs">
                  {value.region}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-secondary text-muted-foreground text-xs">
                  {value.country}
                </span>
              </div>
            </div>
            <button
              onClick={handleClear}
              className="p-1.5 hover:bg-secondary rounded-lg"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          {/* Map Preview */}
          <MapPreview
            lat={value.lat}
            lng={value.lng}
            isExpanded={isExpanded}
            onToggleExpand={() => setIsExpanded(!isExpanded)}
          />

          {/* Privacy Toggle */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 border border-border">
            <div className="flex items-center gap-3">
              {value.showExactLocation ? (
                <Eye className="w-5 h-5 text-accent" />
              ) : (
                <EyeOff className="w-5 h-5 text-muted-foreground" />
              )}
              <div>
                <p className="text-sm font-medium">Show Exact Location</p>
                <p className="text-xs text-muted-foreground">
                  {value.showExactLocation 
                    ? 'Your precise location will be visible to buyers'
                    : 'Only the general area will be shown to protect your privacy'}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                onChange({ ...value, showExactLocation: !value.showExactLocation });
              }}
              className={cn(
                "relative w-12 h-6 rounded-full transition-colors",
                value.showExactLocation ? "bg-accent" : "bg-secondary"
              )}
            >
              <motion.div
                className="absolute top-1 w-4 h-4 rounded-full bg-white shadow"
                animate={{ left: value.showExactLocation ? '26px' : '4px' }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </button>
          </div>

          {/* Coordinates */}
          <p className="text-xs text-muted-foreground text-center">
            Coordinates: {value.lat.toFixed(6)}, {value.lng.toFixed(6)}
          </p>
        </motion.div>
      )}
    </div>
  );
}

export default LocationPicker;
