// Global Equity Exchange - Listing Data

export type ListingCategory = 
  | 'Hospitality'
  | 'Manufacturing'
  | 'Technology'
  | 'E-commerce'
  | 'Healthcare'
  | 'Logistics'
  | 'Food & Beverage'
  | 'Industrial Services'
  | 'Cybersecurity'
  | 'Education';

export type ListingRegion = 
  | 'Europe'
  | 'North America'
  | 'Middle East'
  | 'Asia Pacific'
  | 'Australia';

export interface ListingAnalytics {
  views: number;
  saves: number;
  inquiries: number;
  likes: number;
  shares: number;
  viewHistory: { date: string; count: number }[];
  likedBy: string[]; // User IDs who liked
  savedBy: string[]; // User IDs who saved
}

export type ListingStatus = 'pending' | 'approved' | 'rejected';

export interface FeaturedSubscription {
  active: boolean;
  startedAt?: string;
  monthlyPrice: number;
}

export interface VerificationDetails {
  financialsVerified: boolean;
  revenueVerified: boolean;
  trafficVerified: boolean;
  sellerVerified: boolean;
  ddReady: boolean;
  ndaRequired: boolean;
  verificationScore: number; // 0-100
  businessEstablished?: number; // Year established
}

export interface ListingImage {
  id: string;
  url: string; // Base64 data URL
  caption?: string;
  isPrimary?: boolean;
  order: number;
  uploadedAt: string;
  size: number; // in bytes
}

export interface GeoLocation {
  lat: number;
  lng: number;
}

export interface AddressDetails {
  street?: string;
  city: string;
  state?: string;
  postalCode?: string;
  country: string;
  countryCode: string;
  formattedAddress: string;
}

export interface Listing {
  id: string;
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
  verified: boolean;
  featured: boolean;
  status: ListingStatus;
  createdAt: string;
  createdBy?: string; // User ID who created the listing
  analytics?: ListingAnalytics;
  featuredSubscription?: FeaturedSubscription;
  verification?: VerificationDetails;
  // Additional financial metrics for comparison
  netProfit?: number;
  grossMargin?: number;
  debtToEquity?: number;
  customerRetention?: number;
  marketPotential?: 'Low' | 'Medium' | 'High' | 'Very High';
  // Images - up to 10 images
  images?: ListingImage[];
  // Location details with coordinates
  coordinates?: GeoLocation;
  address?: AddressDetails;
  // Rejection reason
  rejectionReason?: string;
}

// Support Case System
export type SupportCaseStatus = 'open' | 'in_progress' | 'resolved' | 'closed';

export interface SupportCase {
  id: string;
  caseNumber: string;
  userId: string;
  userName: string;
  userEmail: string;
  subject: string;
  description: string;
  status: SupportCaseStatus;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  updatedAt: Date;
  messages: SupportMessage[];
}

export interface SupportMessage {
  id: string;
  caseId: string;
  sender: 'user' | 'admin';
  senderName: string;
  message: string;
  createdAt: Date;
}

// Mock support cases
export const supportCases: SupportCase[] = [
  {
    id: '1',
    caseNumber: 'SUP-2024-001',
    userId: 'user1',
    userName: 'John Smith',
    userEmail: 'john.smith@example.com',
    subject: 'Cannot access listing details',
    description: 'I subscribed but still cannot see the detailed financials on the B2B Compliance SaaS listing.',
    status: 'open',
    priority: 'high',
    createdAt: new Date('2024-01-16T10:30:00'),
    updatedAt: new Date('2024-01-16T10:30:00'),
    messages: [
      {
        id: 'm1',
        caseId: '1',
        sender: 'user',
        senderName: 'John Smith',
        message: 'I subscribed but still cannot see the detailed financials on the B2B Compliance SaaS listing.',
        createdAt: new Date('2024-01-16T10:30:00')
      }
    ]
  },
  {
    id: '2',
    caseNumber: 'SUP-2024-002',
    userId: 'user2',
    userName: 'Emily Johnson',
    userEmail: 'emily.j@company.com',
    subject: 'How to upgrade to featured listing?',
    description: 'I created a listing last week and would like to upgrade it to featured. How do I proceed?',
    status: 'in_progress',
    priority: 'medium',
    createdAt: new Date('2024-01-15T14:20:00'),
    updatedAt: new Date('2024-01-16T09:15:00'),
    messages: [
      {
        id: 'm2',
        caseId: '2',
        sender: 'user',
        senderName: 'Emily Johnson',
        message: 'I created a listing last week and would like to upgrade it to featured. How do I proceed?',
        createdAt: new Date('2024-01-15T14:20:00')
      },
      {
        id: 'm3',
        caseId: '2',
        sender: 'admin',
        senderName: 'Support Team',
        message: 'Hi Emily, you can upgrade your listing from the listing detail page. Look for the "Upgrade to Featured" button. Let me know if you need further assistance.',
        createdAt: new Date('2024-01-16T09:15:00')
      }
    ]
  },
  {
    id: '3',
    caseNumber: 'SUP-2024-003',
    userId: 'user3',
    userName: 'Michael Chen',
    userEmail: 'm.chen@investors.co',
    subject: 'Verification process timeline',
    description: 'How long does the investor verification process typically take?',
    status: 'resolved',
    priority: 'low',
    createdAt: new Date('2024-01-14T08:45:00'),
    updatedAt: new Date('2024-01-14T16:30:00'),
    messages: [
      {
        id: 'm4',
        caseId: '3',
        sender: 'user',
        senderName: 'Michael Chen',
        message: 'How long does the investor verification process typically take?',
        createdAt: new Date('2024-01-14T08:45:00')
      },
      {
        id: 'm5',
        caseId: '3',
        sender: 'admin',
        senderName: 'Support Team',
        message: 'The investor verification process typically takes 2-5 business days depending on the documentation provided. Ensure all required documents are submitted for faster processing.',
        createdAt: new Date('2024-01-14T16:30:00')
      }
    ]
  }
];

export const FEATURED_MONTHLY_PRICE = 9.99;

export const listings: Listing[] = [
  {
    id: '1',
    title: 'Boutique Hotel Chain',
    category: 'Hospitality',
    region: 'Europe',
    location: 'Mediterranean',
    description: 'Exclusive collection of four boutique hotels across prime Mediterranean coastal destinations. Properties feature 120 combined rooms with high occupancy rates, established reputation for luxury service, and strong repeat customer base. Includes valuable real estate assets and trained management team.',
    highlights: [
      'Prime beachfront locations in Greece and Croatia',
      'Average occupancy rate of 78% annually',
      'Award-winning hospitality recognition',
      'Established supply chain and vendor relationships',
      'Trained staff with low turnover rates'
    ],
    revenue: 4200000,
    growthYoY: 15,
    employees: 45,
    price: 12000000,
    ebitdaMargin: 22,
    verified: true,
    featured: true,
    status: 'approved',
    createdAt: '2024-01-15',
    analytics: { views: 1245, saves: 89, inquiries: 23 },
    featuredSubscription: { active: true, startedAt: '2024-01-15', monthlyPrice: 9.99 },
    verification: {
      financialsVerified: true,
      revenueVerified: true,
      trafficVerified: false,
      sellerVerified: true,
      ddReady: true,
      ndaRequired: true,
      verificationScore: 92,
      businessEstablished: 2008
    },
    netProfit: 920000,
    grossMargin: 65,
    debtToEquity: 0.4,
    customerRetention: 72,
    marketPotential: 'High'
  },
  {
    id: '2',
    title: 'Precision Manufacturing Plant',
    category: 'Manufacturing',
    region: 'Europe',
    location: 'Germany',
    description: 'State-of-the-art precision manufacturing facility specializing in automotive and aerospace components. ISO 9001 and AS9100 certified with long-term contracts with major OEMs. Modern equipment and skilled workforce in place.',
    highlights: [
      'ISO 9001 and AS9100 certified operations',
      'Long-term contracts with Tier 1 automotive suppliers',
      'Recently upgraded CNC machinery fleet',
      'Strategic location in industrial heartland',
      'Strong engineering and R&D capabilities'
    ],
    revenue: 8500000,
    growthYoY: 8,
    employees: 120,
    price: 22000000,
    ebitdaMargin: 18,
    verified: true,
    featured: true,
    status: 'approved',
    createdAt: '2024-02-01',
    analytics: { views: 892, saves: 45, inquiries: 12 },
    featuredSubscription: { active: true, startedAt: '2024-02-01', monthlyPrice: 9.99 },
    verification: {
      financialsVerified: true,
      revenueVerified: true,
      trafficVerified: false,
      sellerVerified: true,
      ddReady: true,
      ndaRequired: true,
      verificationScore: 88,
      businessEstablished: 1995
    },
    netProfit: 1530000,
    grossMargin: 42,
    debtToEquity: 0.6,
    customerRetention: 95,
    marketPotential: 'Medium'
  },
  {
    id: '3',
    title: 'B2B Compliance SaaS Platform',
    category: 'Technology',
    region: 'Europe',
    location: 'United Kingdom',
    description: 'Enterprise-grade compliance management software serving financial institutions across EMEA. Recurring revenue model with 95% customer retention. Proprietary technology stack with significant IP portfolio.',
    highlights: [
      '95% annual customer retention rate',
      '85% recurring revenue from subscriptions',
      'Serving 200+ financial institutions',
      'SOC 2 Type II certified',
      'Scalable cloud infrastructure'
    ],
    revenue: 3800000,
    growthYoY: 42,
    employees: 35,
    price: 18000000,
    ebitdaMargin: 28,
    verified: true,
    featured: true,
    status: 'approved',
    createdAt: '2024-01-20',
    analytics: { views: 2156, saves: 178, inquiries: 45 },
    featuredSubscription: { active: true, startedAt: '2024-01-20', monthlyPrice: 9.99 },
    verification: {
      financialsVerified: true,
      revenueVerified: true,
      trafficVerified: true,
      sellerVerified: true,
      ddReady: true,
      ndaRequired: true,
      verificationScore: 98,
      businessEstablished: 2018
    },
    netProfit: 1064000,
    grossMargin: 82,
    debtToEquity: 0.1,
    customerRetention: 95,
    marketPotential: 'Very High'
  },
  {
    id: '4',
    title: 'Premium Pet Products E-commerce',
    category: 'E-commerce',
    region: 'North America',
    location: 'United States',
    description: 'Direct-to-consumer premium pet supplies brand with strong social media presence and loyal customer base. Proprietary product lines with healthy margins. Fully operational fulfillment infrastructure.',
    highlights: [
      '2.5M+ social media followers',
      '40% repeat purchase rate',
      'Proprietary product formulations',
      'Amazon FBA and direct fulfillment',
      'Strong brand recognition in niche market'
    ],
    revenue: 5200000,
    growthYoY: 35,
    employees: 28,
    price: 14000000,
    ebitdaMargin: 24,
    verified: true,
    featured: false,
    status: 'approved',
    createdAt: '2024-02-10',
    createdBy: 'user-majed-001', // Owned by regular user (majed1.alshoghri@gmail.com)
    analytics: { views: 1567, saves: 134, inquiries: 28 },
    verification: {
      financialsVerified: true,
      revenueVerified: true,
      trafficVerified: true,
      sellerVerified: true,
      ddReady: false,
      ndaRequired: true,
      verificationScore: 78,
      businessEstablished: 2019
    },
    netProfit: 1248000,
    grossMargin: 58,
    debtToEquity: 0.3,
    customerRetention: 40,
    marketPotential: 'High'
  },
  {
    id: '5',
    title: 'Private Healthcare Clinic Group',
    category: 'Healthcare',
    region: 'Middle East',
    location: 'United Arab Emirates',
    description: 'Network of five premium outpatient clinics in Dubai and Abu Dhabi. Specializing in aesthetics, wellness, and preventive care. Strong referral network and high-net-worth patient base.',
    highlights: [
      'Premium locations in prime urban areas',
      'Licensed for 15+ medical specialties',
      'State-of-the-art medical equipment',
      'Established relationships with insurance providers',
      'Experienced medical director and staff'
    ],
    revenue: 7800000,
    growthYoY: 18,
    employees: 85,
    price: 28000000,
    ebitdaMargin: 20,
    verified: true,
    featured: true,
    status: 'approved',
    createdAt: '2024-01-25',
    analytics: { views: 743, saves: 52, inquiries: 8 },
    featuredSubscription: { active: true, startedAt: '2024-01-25', monthlyPrice: 9.99 },
    verification: {
      financialsVerified: true,
      revenueVerified: true,
      trafficVerified: false,
      sellerVerified: true,
      ddReady: true,
      ndaRequired: true,
      verificationScore: 85,
      businessEstablished: 2015
    },
    netProfit: 1560000,
    grossMargin: 55,
    debtToEquity: 0.5,
    customerRetention: 78,
    marketPotential: 'High'
  },
  {
    id: '6',
    title: 'Last-Mile Logistics Operator',
    category: 'Logistics',
    region: 'Asia Pacific',
    location: 'Singapore',
    description: 'Technology-enabled last-mile delivery company serving major e-commerce platforms across Southeast Asia. Proprietary route optimization software and fleet of 200+ vehicles.',
    highlights: [
      'Contracts with top 5 e-commerce platforms',
      '200+ owned and operated vehicles',
      'Proprietary delivery management software',
      'Same-day delivery capabilities',
      'Expansion-ready operations model'
    ],
    revenue: 12500000,
    growthYoY: 28,
    employees: 180,
    price: 32000000,
    ebitdaMargin: 12,
    verified: false,
    featured: false,
    status: 'approved',
    createdAt: '2024-02-05',
    analytics: { views: 534, saves: 23, inquiries: 5 },
    netProfit: 1500000,
    grossMargin: 28,
    debtToEquity: 0.8,
    customerRetention: 88,
    marketPotential: 'Very High'
  },
  {
    id: '7',
    title: 'Artisanal Cheese Manufacturer',
    category: 'Food & Beverage',
    region: 'Europe',
    location: 'Italy',
    description: 'Heritage artisanal cheese production facility in Emilia-Romagna. DOP certified products with distribution across Europe and North America. Includes aging facilities and retail storefront.',
    highlights: [
      'DOP and organic certifications',
      'Export relationships in 12 countries',
      'Traditional production methods',
      'Includes valuable aging inventory',
      'Strong brand heritage since 1952'
    ],
    revenue: 2800000,
    growthYoY: 12,
    employees: 22,
    price: 8500000,
    ebitdaMargin: 26,
    verified: true,
    featured: false,
    status: 'approved',
    createdAt: '2024-01-28',
    analytics: { views: 678, saves: 67, inquiries: 14 },
    netProfit: 728000,
    grossMargin: 48,
    debtToEquity: 0.2,
    customerRetention: 85,
    marketPotential: 'Medium'
  },
  {
    id: '8',
    title: 'Industrial Maintenance Services',
    category: 'Industrial Services',
    region: 'North America',
    location: 'Canada',
    description: 'Full-service industrial maintenance company serving oil & gas, mining, and manufacturing sectors. Long-term service contracts with major operators. Certified workforce and specialized equipment.',
    highlights: [
      'Multi-year contracts with Fortune 500 clients',
      'Specialized certifications for hazardous environments',
      'Fleet of specialized maintenance equipment',
      'Strong safety record with zero incidents',
      '24/7 emergency response capabilities'
    ],
    revenue: 9200000,
    growthYoY: 10,
    employees: 145,
    price: 25000000,
    ebitdaMargin: 16,
    verified: true,
    featured: false,
    status: 'approved',
    createdAt: '2024-02-08',
    analytics: { views: 412, saves: 31, inquiries: 7 },
    netProfit: 1472000,
    grossMargin: 35,
    debtToEquity: 0.4,
    customerRetention: 92,
    marketPotential: 'Medium'
  },
  {
    id: '9',
    title: 'Managed Security Services Provider',
    category: 'Cybersecurity',
    region: 'North America',
    location: 'United States',
    description: 'Enterprise cybersecurity firm providing 24/7 SOC services, penetration testing, and compliance consulting. Blue-chip client roster with high contract values and strong retention.',
    highlights: [
      'SOC 2 Type II certified operations',
      '24/7 Security Operations Center',
      'Partnerships with major security vendors',
      'Average contract value $150K+',
      'Government and defense sector clearances'
    ],
    revenue: 6500000,
    growthYoY: 38,
    employees: 52,
    price: 24000000,
    ebitdaMargin: 25,
    verified: true,
    featured: true,
    status: 'approved',
    createdAt: '2024-01-30',
    analytics: { views: 1834, saves: 156, inquiries: 34 },
    featuredSubscription: { active: true, startedAt: '2024-01-30', monthlyPrice: 9.99 },
    netProfit: 1625000,
    grossMargin: 72,
    debtToEquity: 0.15,
    customerRetention: 91,
    marketPotential: 'Very High'
  },
  {
    id: '10',
    title: 'K-12 Education Franchise Network',
    category: 'Education',
    region: 'Australia',
    location: 'Australia',
    description: 'Established tutoring and enrichment franchise with 45 locations across Australia. Proven curriculum and training systems. Strong brand recognition and waitlisted locations.',
    highlights: [
      '45 franchise locations nationwide',
      'Proprietary curriculum and materials',
      'Comprehensive franchisee training program',
      'Average franchisee tenure of 6+ years',
      'Digital learning platform included'
    ],
    revenue: 4800000,
    growthYoY: 15,
    employees: 38,
    price: 16000000,
    ebitdaMargin: 32,
    verified: false,
    featured: false,
    status: 'approved',
    createdAt: '2024-02-12',
    analytics: { views: 567, saves: 42, inquiries: 11 },
    netProfit: 1536000,
    grossMargin: 68,
    debtToEquity: 0.25,
    customerRetention: 82,
    marketPotential: 'High'
  }
];

export const categories: ListingCategory[] = [
  'Hospitality',
  'Manufacturing',
  'Technology',
  'E-commerce',
  'Healthcare',
  'Logistics',
  'Food & Beverage',
  'Industrial Services',
  'Cybersecurity',
  'Education'
];

export const regions: ListingRegion[] = [
  'Europe',
  'North America',
  'Middle East',
  'Asia Pacific',
  'Australia'
];

export const priceRanges = [
  { label: 'Under $5M', min: 0, max: 5000000 },
  { label: '$5M - $10M', min: 5000000, max: 10000000 },
  { label: '$10M - $20M', min: 10000000, max: 20000000 },
  { label: '$20M - $50M', min: 20000000, max: 50000000 },
  { label: '$50M+', min: 50000000, max: Infinity }
];

export const budgetRanges = [
  'Under $5M',
  '$5M - $10M',
  '$10M - $25M',
  '$25M - $50M',
  '$50M - $100M',
  '$100M+'
];

export const timelines = [
  'Immediate (< 30 days)',
  'Short-term (1-3 months)',
  'Medium-term (3-6 months)',
  'Long-term (6-12 months)',
  'Exploratory'
];

export const fundingSources = [
  'Cash / Personal Funds',
  'SBA / Bank Financing',
  'Private Equity',
  'Family Office',
  'Syndicated Investment',
  'Other'
];

export const diligenceWindows = [
  { label: '15 days', value: 15 },
  { label: '30 days', value: 30 },
  { label: '45 days', value: 45 },
  { label: '60 days', value: 60 },
  { label: '90 days', value: 90 }
];

export function formatCurrency(value: number): string {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`;
  }
  return `$${value}`;
}

export function getListingById(id: string): Listing | undefined {
  return listings.find(listing => listing.id === id);
}

export function getFeaturedListings(): Listing[] {
  return listings.filter(listing => listing.featured && listing.status === 'approved').slice(0, 6);
}

export function getApprovedListings(): Listing[] {
  return listings.filter(listing => listing.status === 'approved');
}

export function getPendingListings(): Listing[] {
  return listings.filter(listing => listing.status === 'pending');
}

export function filterListings(filters: {
  categories?: ListingCategory[];
  regions?: ListingRegion[];
  priceMin?: number;
  priceMax?: number;
  sortBy?: 'price-asc' | 'price-desc' | 'revenue-desc' | 'growth-desc' | 'featured';
  search?: string;
}): Listing[] {
  let result = listings.filter(listing => listing.status === 'approved');

  if (filters.categories && filters.categories.length > 0) {
    result = result.filter(listing => filters.categories!.includes(listing.category));
  }

  if (filters.regions && filters.regions.length > 0) {
    result = result.filter(listing => filters.regions!.includes(listing.region));
  }

  if (filters.priceMin !== undefined) {
    result = result.filter(listing => listing.price >= filters.priceMin!);
  }

  if (filters.priceMax !== undefined) {
    result = result.filter(listing => listing.price <= filters.priceMax!);
  }

  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    result = result.filter(listing => 
      listing.title.toLowerCase().includes(searchLower) ||
      listing.description.toLowerCase().includes(searchLower) ||
      listing.category.toLowerCase().includes(searchLower) ||
      listing.location.toLowerCase().includes(searchLower)
    );
  }

  // Sort featured listings first, then apply regular sorting
  if (filters.sortBy === 'featured') {
    result.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    });
  } else {
    // Always put featured first, then sort within groups
    result.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      
      switch (filters.sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'revenue-desc':
          return b.revenue - a.revenue;
        case 'growth-desc':
          return b.growthYoY - a.growthYoY;
        default:
          return 0;
      }
    });
  }

  return result;
}

export function getListingAge(createdAt: string): string {
  const now = new Date();
  const created = new Date(createdAt);
  const diffInDays = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return 'Listed today';
  if (diffInDays === 1) return 'Listed 1 day ago';
  if (diffInDays < 7) return `Listed ${diffInDays} days ago`;
  if (diffInDays < 30) return `Listed ${Math.floor(diffInDays / 7)} weeks ago`;
  if (diffInDays < 365) return `Listed ${Math.floor(diffInDays / 30)} months ago`;
  return `Listed ${Math.floor(diffInDays / 365)} years ago`;
}

// Generate a new case number
export function generateCaseNumber(): string {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(Math.random() * 9000) + 1000;
  return `SUP-${year}-${randomNum}`;
}
