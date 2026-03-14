// Extended types for the Global Equity Exchange

export interface GeoLocation {
  lat: number;
  lng: number;
}

export interface AddressDetails {
  street: string;
  city: string;
  state?: string;
  postalCode?: string;
  country: string;
  countryCode: string;
  formattedAddress: string;
}

export interface ListingImage {
  id: string;
  url: string; // Base64 data URL or storage URL
  caption?: string;
  isPrimary?: boolean;
  order: number;
  uploadedAt: string;
  size: number; // in bytes
}

export interface ListingAnalyticsExtended {
  views: number;
  saves: number;
  inquiries: number;
  likes: number;
  shares: number;
  viewHistory: { date: string; count: number }[];
  likeHistory: { date: string; count: number }[];
  saveHistory: { date: string; count: number }[];
  shareHistory: { date: string; count: number }[];
  uniqueViewers: string[]; // User IDs
  likedBy: string[]; // User IDs
  savedBy: string[]; // User IDs
}

export interface UserProfileExtended {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin' | 'superadmin' | 'owner';
  clientNumber?: string;
  
  // Profile details
  avatar?: string; // Base64 data URL
  bio?: string;
  phone?: string;
  website?: string;
  company?: string;
  jobTitle?: string;
  location?: string;
  
  // Social links
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
  };
  
  // Preferences
  preferences: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    marketingEmails: boolean;
    showProfile: boolean; // Public profile visibility
    showContactInfo: boolean;
  };
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  
  // Stats
  listingsCount: number;
  savedListingsCount: number;
  
  // Verification
  emailVerified: boolean;
  phoneVerified: boolean;
  identityVerified: boolean;
}

export interface LocationSearchResult {
  placeId: string;
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

export interface MapMarker {
  id: string;
  position: GeoLocation;
  title: string;
  description?: string;
  type: 'listing' | 'user' | 'business';
}

// Image upload constraints
export const IMAGE_CONSTRAINTS = {
  MAX_IMAGES: 10,
  MAX_SIZE_PER_IMAGE: 5 * 1024 * 1024, // 5MB
  ACCEPTED_FORMATS: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  THUMBNAIL_WIDTH: 300,
  MAX_DISPLAY_WIDTH: 1200,
};

// Country to region mapping
export const COUNTRY_REGION_MAP: Record<string, string> = {
  // Europe
  'AT': 'Europe', 'BE': 'Europe', 'BG': 'Europe', 'HR': 'Europe',
  'CY': 'Europe', 'CZ': 'Europe', 'DK': 'Europe', 'EE': 'Europe',
  'FI': 'Europe', 'FR': 'Europe', 'DE': 'Europe', 'GR': 'Europe',
  'HU': 'Europe', 'IE': 'Europe', 'IT': 'Europe', 'LV': 'Europe',
  'LT': 'Europe', 'LU': 'Europe', 'MT': 'Europe', 'NL': 'Europe',
  'PL': 'Europe', 'PT': 'Europe', 'RO': 'Europe', 'SK': 'Europe',
  'SI': 'Europe', 'ES': 'Europe', 'SE': 'Europe', 'GB': 'Europe',
  'IS': 'Europe', 'NO': 'Europe', 'CH': 'Europe', 'RS': 'Europe',
  'ME': 'Europe', 'MK': 'Europe', 'AL': 'Europe', 'BA': 'Europe',
  'XK': 'Europe', 'BY': 'Europe', 'UA': 'Europe', 'MD': 'Europe',
  'RU': 'Europe',
  
  // North America
  'US': 'North America', 'CA': 'North America', 'MX': 'North America',
  
  // Middle East
  'AE': 'Middle East', 'SA': 'Middle East', 'QA': 'Middle East',
  'KW': 'Middle East', 'BH': 'Middle East', 'OM': 'Middle East',
  'JO': 'Middle East', 'LB': 'Middle East', 'IL': 'Middle East',
  'TR': 'Middle East', 'IR': 'Middle East', 'IQ': 'Middle East',
  
  // Asia Pacific
  'CN': 'Asia Pacific', 'JP': 'Asia Pacific', 'KR': 'Asia Pacific',
  'IN': 'Asia Pacific', 'SG': 'Asia Pacific', 'MY': 'Asia Pacific',
  'TH': 'Asia Pacific', 'VN': 'Asia Pacific', 'ID': 'Asia Pacific',
  'PH': 'Asia Pacific', 'TW': 'Asia Pacific', 'HK': 'Asia Pacific',
  'NZ': 'Asia Pacific',
  
  // Australia
  'AU': 'Australia',
};

export function getRegionFromCountryCode(countryCode: string): string {
  return COUNTRY_REGION_MAP[countryCode.toUpperCase()] || 'Europe';
}
