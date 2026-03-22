# Global Equity Exchange (GEE)

A premium business marketplace platform that facilitates the acquisition of verified businesses by connecting sellers with qualified investors. Built with Next.js 16 App Router, NextAuth, Prisma ORM, and Tailwind CSS 4.

---

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Technology Stack](#technology-stack)
4. [Project Structure](#project-structure)
5. [Pages & Routes](#pages--routes)
6. [Authentication](#authentication)
7. [API Routes](#api-routes)
8. [Data Models](#data-models)
9. [Role-Based Access Control](#role-based-access-control)
10. [Admin Dashboard](#admin-dashboard)
11. [Location & Map System](#location--map-system)
12. [Seeded Data & Test Accounts](#seeded-data--test-accounts)
13. [Quick Start](#quick-start)
14. [Development Guide](#development-guide)
15. [Bug Fixes & Changes](#bug-fixes--changes)

---

## Overview

**Global Equity Exchange** is a full-featured marketplace application where users can:

- **List businesses for sale** - Create detailed listings with financials, images, and location data
- **Browse and search listings** - Filter by category, region, price range
- **Save and compare listings** - Watchlist functionality and side-by-side comparison
- **Apply for verification** - Submit documents for business verification
- **Create advertisements** - Promote listings with tiered ad packages
- **Manage support tickets** - Full ticketing system for user support
- **Administer the platform** - Comprehensive admin dashboard with role-based access

The platform emphasizes trust and security with verification badges, audit logging, rate limiting, and GDPR compliance features.

---

## Features

### Core Marketplace Features

| Feature | Description |
|---------|-------------|
| **Listings Management** | Create, edit, delete business listings with images, financials, and location |
| **Categories** | 10 business categories: Technology, E-commerce, Healthcare, Manufacturing, etc. |
| **Regions** | 5 global regions: North America, Europe, Asia Pacific, Middle East, Australia |
| **Advanced Filtering** | Filter by category, region, price range, search terms |
| **Featured Listings** | Premium placement with $9.99/month subscription |
| **Watchlist** | Save favorite listings with price alerts |
| **Comparison Tool** | Compare up to 4 listings side-by-side |
| **Analytics** | View counts, saves, shares tracking per listing |

### User Management

| Feature | Description |
|---------|-------------|
| **Registration** | Email-based signup with auto-generated client number (GEE-YY-XXXXXX) |
| **Authentication** | NextAuth with Credentials provider (email + password) |
| **Admin Login** | Separate authentication flow for administrators |
| **Password Reset** | Token-based password recovery (24-hour expiry) |
| **Profile Management** | Avatar, bio, phone, social links customization |
| **Two-Factor Auth** | TOTP-based 2FA support |
| **Session Management** | View and revoke active sessions |
| **Account Suspension** | Admin can suspend/deactivate users |
| **GDPR Compliance** | Data export and account deletion features |

### Location & Map System

| Feature | Description |
|---------|-------------|
| **Address Autocomplete** | OpenStreetMap Nominatim integration (no API key required) |
| **Geolocation** | "Use my current location" with reverse geocoding |
| **Privacy Controls** | Toggle between exact location or general area |
| **Map Preview** | Embedded OpenStreetMap with expandable view |
| **Auto Region Detection** | Automatically sets region based on selected country |
| **Coordinate Storage** | Latitude/longitude stored with privacy toggle |

### Image Upload System

| Feature | Description |
|---------|-------------|
| **Multi-Image Upload** | Support for up to 10 images per listing |
| **Drag & Drop** | Intuitive drag-and-drop interface |
| **Primary Image** | Set featured image with star badge |
| **Image Reordering** | Move images left/right to reorder |
| **Captions** | Add captions to primary images |
| **Size Validation** | Max 5MB per image, JPG/PNG/WebP/GIF supported |

---

## Technology Stack

### Core Framework

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 16.x | React framework with App Router and Turbopack |
| **React** | 19.x | UI library |
| **TypeScript** | 5.x | Type-safe JavaScript |
| **Tailwind CSS** | 4.x | Utility-first CSS framework |

### Authentication & Database

| Technology | Purpose |
|------------|---------|
| **NextAuth.js** | Authentication with Credentials provider |
| **Prisma ORM** | Type-safe database access |
| **SQLite** | Lightweight SQL database |
| **bcryptjs** | Password hashing |

### UI Components

| Technology | Purpose |
|------------|---------|
| **shadcn/ui** | High-quality accessible components |
| **Radix UI** | Primitive UI components |
| **Lucide React** | Icon library |
| **Framer Motion** | Animations |
| **Recharts** | Charts and data visualization |

### State Management

| Technology | Purpose |
|------------|---------|
| **React Context** | Client-side state management |
| **TanStack Query** | Server state management |

### External Services

| Service | Purpose |
|---------|---------|
| **OpenStreetMap** | Map tiles and embeds |
| **Nominatim API** | Address geocoding and reverse geocoding |

---

## Project Structure

```
src/
├── app/                          # Next.js App Router (File-based routing)
│   ├── page.tsx                 # Home page (/)
│   ├── layout.tsx               # Root layout with providers
│   ├── globals.css              # Global styles
│   │
│   ├── api/                     # API Routes
│   │   ├── auth/[...nextauth]/  # NextAuth API endpoints
│   │   ├── listings/            # Listings CRUD API
│   │   └── users/[id]/          # User profile/avatar API
│   │
│   ├── admin/                   # Admin dashboard (/admin)
│   ├── admin-login/             # Admin login page
│   ├── login/                   # User login page
│   ├── signup/                  # User registration
│   ├── marketplace/             # Browse listings
│   ├── listings/[id]/           # Single listing detail
│   ├── profile/                 # User profile (protected)
│   ├── create-listing/          # Create listing form
│   ├── compare/                 # Side-by-side comparison
│   ├── investors/               # Investor portal
│   ├── knowledge-base/          # FAQ & help
│   ├── how-it-works/            # Platform guide
│   ├── security/                # Security info
│   ├── terms/                   # Terms of service
│   ├── privacy/                 # Privacy policy
│   ├── risk-disclosure/         # Investment risks
│   ├── reset-password/          # Password recovery
│   └── data-deletion/           # GDPR deletion
│
├── components/                   # React Components
│   ├── layout/                  # Layout components
│   │   ├── Navbar.tsx          # Top navigation bar
│   │   └── Footer.tsx          # Site footer
│   │
│   ├── marketplace/             # Marketplace components
│   │   ├── ListingCard.tsx     # Individual listing card
│   │   ├── FiltersBar.tsx      # Search and filter controls
│   │   ├── CompareBar.tsx      # Comparison selection bar
│   │   └── ListingActions.tsx  # Save, share, promote actions
│   │
│   ├── location/                # Location & Map components
│   │   └── LocationPicker.tsx  # Address autocomplete + map
│   │
│   ├── upload/                  # Upload components
│   │   └── ImageUploader.tsx   # Multi-image upload with drag-drop
│   │
│   ├── auth/                    # Authentication components
│   │   ├── ProtectedRoute.tsx  # Route guard
│   │   └── AuthGate.tsx        # Auth state wrapper
│   │
│   ├── trust/                   # Trust & verification
│   │   ├── TrustIndicators.tsx # Platform stats
│   │   ├── VerificationBadges.tsx
│   │   └── NDAGate.tsx         # NDA requirement modal
│   │
│   ├── ui/                      # shadcn/ui components
│   │   └── ... (30+ components)
│   │
│   └── Providers.tsx            # Context providers wrapper
│
├── contexts/                     # React Contexts
│   ├── AuthContext.tsx          # Authentication state
│   ├── ListingContext.tsx       # Listings management
│   ├── AdContext.tsx            # Advertisements
│   ├── NotificationsContext.tsx # Notifications
│   ├── VerificationContext.tsx  # Document verification
│   ├── SupportContext.tsx       # Support tickets
│   ├── WatchlistContext.tsx     # Watchlist & alerts
│   ├── CompareContext.tsx       # Listing comparison
│   ├── AnnouncementsContext.tsx # Platform announcements
│   ├── EarningsContext.tsx      # Income tracking
│   ├── AuditContext.tsx         # Audit logging
│   ├── RateLimitContext.tsx     # Rate limiting
│   └── InvestorContext.tsx      # Investor tools
│
├── hooks/                        # Custom React Hooks
│   ├── useApi.ts                # TanStack Query API hooks
│   └── use-toast.ts             # Toast notifications
│
├── lib/                          # Utilities
│   ├── auth/
│   │   └── auth-options.ts      # NextAuth configuration
│   ├── data.ts                  # Seed data & types
│   ├── utils.ts                 # Utility functions
│   └── validators.ts            # Validation schemas
│
├── views/                        # Page View Components
│   ├── Home.tsx                 # Landing page
│   ├── Marketplace.tsx          # Browse listings
│   ├── ListingDetail.tsx        # Single listing view
│   ├── ComparePage.tsx          # Side-by-side comparison
│   ├── CreateListing.tsx        # Listing form with validation
│   ├── Login.tsx                # User login
│   ├── AdminLogin.tsx           # Admin authentication
│   ├── AdminDashboard.tsx       # Admin panel with RBAC
│   ├── Profile.tsx              # User profile
│   └── ... (other views)
│
└── types/                        # TypeScript Types
    ├── advertising.ts
    ├── notifications.ts
    ├── support.ts
    ├── audit.ts
    └── index.ts

prisma/
├── schema.prisma                 # Database schema
└── seed.ts                       # Database seeding script
```

---

## Pages & Routes

The application uses Next.js 16 App Router with file-based routing:

### Public Pages

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | `Home.tsx` | Landing page with hero, featured listings, testimonials |
| `/marketplace` | `Marketplace.tsx` | Browse all listings with filters, search, pagination |
| `/listings/[id]` | `ListingDetail.tsx` | Detailed view of a single listing |
| `/compare` | `ComparePage.tsx` | Side-by-side comparison of up to 4 listings |
| `/investors` | `Investors.tsx` | Investment portal with AI analysis features |
| `/knowledge-base` | `KnowledgeBase.tsx` | FAQ and help articles |
| `/how-it-works` | `HowItWorks.tsx` | Step-by-step platform usage guide |
| `/security` | `Security.tsx` | Security features and policies |
| `/terms` | `Terms.tsx` | Terms of service |
| `/privacy` | `Privacy.tsx` | Privacy policy |
| `/risk-disclosure` | `RiskDisclosure.tsx` | Investment risk disclosure |

### Authentication Pages

| Route | Component | Description |
|-------|-----------|-------------|
| `/login` | `Login.tsx` | User login with NextAuth |
| `/signup` | `Signup.tsx` | User registration with email verification |
| `/admin-login` | `AdminLogin.tsx` | Admin authentication |
| `/reset-password` | `ResetPassword.tsx` | Password reset with token |
| `/data-deletion` | `DataDeletion.tsx` | GDPR data deletion request |

### Protected Pages (Require Authentication)

| Route | Component | Description |
|-------|-----------|-------------|
| `/profile` | `Profile.tsx` | User profile, settings, saved listings |
| `/create-listing` | `CreateListing.tsx` | Create new business listing |

### Admin Pages (Role-Based Access)

| Route | Component | Roles | Description |
|-------|-----------|-------|-------------|
| `/admin` | `AdminDashboard.tsx` | admin+ | Full admin dashboard with tabs |

---

## Authentication

### NextAuth Configuration

The application uses NextAuth.js with a Credentials provider for authentication. The JWT token is kept minimal (only `id` and `role`) to avoid size issues, with additional user data fetched from the database in the session callback.

```typescript
// src/lib/auth/auth-options.ts
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // Validate against Prisma database
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        
        if (user && await bcrypt.compare(credentials.password, user.passwordHash)) {
          return { id: user.id, email: user.email, name: user.name, role: user.role };
        }
        
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Keep JWT minimal to avoid size issues
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
        session.user.id = token.id;
        // Fetch additional user data from DB if needed
      }
      return session;
    },
  },
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-key-for-development',
};
```

### Client-Side Usage

```typescript
import { useSession } from 'next-auth/react';
import { signIn, signOut } from 'next-auth/react';

// Check authentication status
const { data: session, status } = useSession();

// Login
const result = await signIn('credentials', {
  email,
  password,
  redirect: false,
});

// Logout
await signOut({ callbackUrl: '/login' });
```

---

## API Routes

### Authentication API

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/[...nextauth]` | ALL | NextAuth handlers |

### Listings API

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/listings` | GET | Get all listings |
| `/api/listings` | POST | Create new listing (auth required) |
| `/api/listings/[id]` | GET | Get single listing |
| `/api/listings/[id]` | PUT | Update listing (auth required) |
| `/api/listings/[id]` | DELETE | Delete listing (auth required) |

### Users API

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/users/[id]` | GET | Get user profile |
| `/api/users/[id]` | PUT | Update user profile/avatar (auth required) |

### TanStack Query Hooks

```typescript
// src/hooks/useApi.ts
export function useListings() {
  return useQuery({ queryKey: ['listings'], queryFn: fetchListings });
}

export function useListing(id: string) {
  return useQuery({
    queryKey: ['listing', id],
    queryFn: () => fetchListing(id),
    enabled: !!id,
  });
}

export function useCreateListing() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createListing,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['listings'] }),
  });
}
```

---

## Data Models

### Prisma Schema

```prisma
// prisma/schema.prisma

enum UserRole {
  USER
  ADMIN
  SUPERADMIN
  OWNER
}

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  passwordHash  String
  role          UserRole  @default(USER)
  clientNumber  String?   @unique
  emailVerified DateTime?
  avatar        String?
  bio           String?
  phone         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  listings      Listing[]
}

model Listing {
  id                String   @id @default(cuid())
  title             String
  category          String
  region            String
  location          String
  description       String
  price             Float
  revenue           Float
  status            String   @default("pending")
  verified          Boolean  @default(false)
  featured          Boolean  @default(false)
  
  // Location fields
  latitude          Float?
  longitude         Float?
  showExactLocation Boolean @default(false)
  
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  createdBy         String?
  
  author            User?    @relation(fields: [createdBy], references: [id])
}
```

---

## Role-Based Access Control

### Role Hierarchy

```
Owner (Highest)
   ↓
SuperAdmin
   ↓
Admin
   ↓
User (Lowest)
```

### Permission Matrix

| Permission | User | Admin | SuperAdmin | Owner |
|------------|:----:|:-----:|:----------:|:-----:|
| **Marketplace** |
| Browse listings | ✅ | ✅ | ✅ | ✅ |
| Create listings | ✅ | ✅ | ✅ | ✅ |
| Edit own listings | ✅ | ✅ | ✅ | ✅ |
| Save listings | ✅ | ✅ | ✅ | ✅ |
| **Admin Dashboard** |
| Access admin panel | ❌ | ✅ | ✅ | ✅ |
| Support tickets tab | ❌ | ✅ | ✅ | ✅ |
| Listings review tab | ❌ | ✅* | ✅ | ✅ |
| Ads management | ❌ | ❌ | ✅ | ✅ |
| Users management | ❌ | ❌ | ✅ | ✅ |
| Analytics | ❌ | ❌ | ✅ | ✅ |
| Security settings | ❌ | ❌ | ❌ | ✅ |
| Audit logs | ❌ | ❌ | ❌ | ✅ |
| Rate limits | ❌ | ❌ | ❌ | ✅ |
| Verifications tab | ❌ | ❌ | ❌ | ✅ |
| Earnings tab | ❌ | ❌ | ❌ | ✅ |

*Admin can view listings review but cannot approve/reject

### Implementation

```typescript
// Role check helpers
const isAdmin = ['admin', 'superadmin', 'owner'].includes(user?.role);
const isSuperAdmin = ['superadmin', 'owner'].includes(user?.role);
const isOwner = user?.role === 'owner';

// Tab visibility in AdminDashboard
const allTabs = [
  { id: 'support', label: 'Support', roles: ['admin', 'superadmin', 'owner'] },
  { id: 'listings', label: 'Listings Review', roles: ['admin', 'superadmin', 'owner'] },
  { id: 'ads', label: 'Ads Management', roles: ['superadmin', 'owner'] },
  { id: 'users', label: 'Users', roles: ['superadmin', 'owner'] },
  { id: 'analytics', label: 'Analytics', roles: ['superadmin', 'owner'] },
  { id: 'security', label: 'Security', roles: ['owner'] },
  { id: 'audit', label: 'Audit Logs', roles: ['owner'] },
  { id: 'rate-limits', label: 'Rate Limits', roles: ['owner'] },
  { id: 'verifications', label: 'Verifications', roles: ['owner'] },
  { id: 'earnings', label: 'Earnings', roles: ['owner'] },
];
```

---

## Admin Dashboard

The admin dashboard is a comprehensive control panel with role-based tab visibility. Each tab provides specific management capabilities:

### Support Tab (Admin+)
- View all support tickets from users
- Respond to tickets with status updates
- Close or escalate tickets
- Filter by status, priority, date

### Listings Review Tab (Admin+)
- View pending listings awaiting approval
- Review listing details, financials, images
- Approve or reject listings with notes
- Admin role can view only, SuperAdmin+ can approve/reject

### Ads Management Tab (SuperAdmin+)
- Review advertisement submissions
- Approve/reject ad campaigns
- Manage ad placements and tiers
- View ad performance metrics

### Users Tab (SuperAdmin+)
- View all registered users
- Edit user profiles and roles
- Suspend/activate accounts
- Reset passwords
- View user activity logs
- **Safeguard**: Cannot edit Owner or SuperAdmin accounts (even as SuperAdmin)

### Analytics Tab (SuperAdmin+)
- Platform-wide statistics
- User growth charts
- Listing performance metrics
- Revenue tracking
- Geographic distribution

### Security Tab (Owner Only)
- Two-factor authentication settings
- Session management
- Security alerts
- IP allowlisting
- Login attempt monitoring

### Audit Logs Tab (Owner Only)
- Complete activity history
- Filter by user, action, date
- Export audit reports
- Search functionality
- Event details with actor information

### Rate Limits Tab (Owner Only)
- View current rate limits
- Configure limit thresholds
- View blocked requests
- Whitelist IP addresses

### Verifications Tab (Owner Only)
- Review business verification requests
- Approve/reject verification documents
- Manage verification badges
- View verification history

### Earnings Tab (Owner Only)
- Daily, weekly, monthly revenue
- Featured listing subscriptions
- Ad revenue tracking
- Payment history
- Financial reports
- Export capabilities

---

## Location & Map System

The location system provides address search, geocoding, and map display with privacy controls.

### Components

#### LocationPicker (`src/components/location/LocationPicker.tsx`)

The main component for address selection with:

- **Address Autocomplete**: Uses OpenStreetMap Nominatim API
- **Geolocation Button**: "Use my current location" with browser Geolocation API
- **Map Preview**: Embedded OpenStreetMap with marker
- **Privacy Toggle**: Switch between exact location and general area

### LocationData Interface

```typescript
interface LocationData {
  address: string;           // Full display name from Nominatim
  formattedAddress?: string; // Formatted for display
  city: string;
  state?: string;
  postalCode?: string;
  country: string;
  countryCode: string;
  lat: number;
  lng: number;
  region: string;            // Auto-detected region (Europe, North America, etc.)
  showExactLocation?: boolean;
}
```

### Country to Region Mapping

The system automatically maps country codes to platform regions:

```typescript
const COUNTRY_TO_REGION: Record<string, string> = {
  // Europe
  'AT': 'Europe', 'BE': 'Europe', 'BG': 'Europe', 'HR': 'Europe',
  'CY': 'Europe', 'CZ': 'Europe', 'DK': 'Europe', 'EE': 'Europe',
  'FI': 'Europe', 'FR': 'Europe', 'DE': 'Europe', 'GR': 'Europe',
  // ... more European countries
  
  // North America
  'US': 'North America', 'CA': 'North America', 'MX': 'North America',
  
  // Middle East
  'AE': 'Middle East', 'SA': 'Middle East', 'QA': 'Middle East',
  // ... more Middle East countries
  
  // Asia Pacific
  'CN': 'Asia Pacific', 'JP': 'Asia Pacific', 'KR': 'Asia Pacific',
  // ... more Asia Pacific countries
  
  // Australia
  'AU': 'Australia',
};
```

### Geolocation Error Handling

The system provides specific error messages for geolocation failures:

| Code | Error | Message |
|------|-------|---------|
| 1 | PERMISSION_DENIED | "Location permission denied. Please enable location access in your browser settings." |
| 2 | POSITION_UNAVAILABLE | "Location unavailable. Your position could not be determined." |
| 3 | TIMEOUT | "Location request timed out. Please try again." |

### Privacy Controls

When `showExactLocation` is `false`:
- Only the general area is shown to buyers
- The exact coordinates are stored but not displayed
- A privacy circle can be shown instead of a precise marker

---

## Seeded Data & Test Accounts

### RBAC Test Accounts

Run the seed script to create test accounts for role-based access testing:

```bash
npx prisma db push
npx tsx prisma/seed.ts
```

| Role | Email | Password |
|------|-------|----------|
| USER | user@echelon.com | EchelonTest123 |
| ADMIN | admin@echelon.com | EchelonTest123 |
| SUPERADMIN | super@echelon.com | EchelonTest123 |
| OWNER | owner@echelon.com | EchelonTest123 |

### Seed Listings (10 Businesses)

| Name | Category | Region | Price | Revenue |
|------|----------|--------|-------|---------|
| Boutique Hotel Chain | Hospitality | Europe | $8.5M | $2.8M |
| Precision Manufacturing Plant | Manufacturing | Europe | $12M | $4.2M |
| B2B Compliance SaaS Platform | Technology | Europe | $18M | $5.1M |
| Premium Pet Products E-commerce | E-commerce | North America | $6.2M | $3.8M |
| Private Healthcare Clinic Group | Healthcare | Middle East | $15M | $6.2M |
| Last-Mile Logistics Operator | Logistics | Asia Pacific | $9.5M | $4.8M |
| Artisanal Cheese Manufacturer | Food & Beverage | Europe | $4.8M | $1.9M |
| Industrial Maintenance Services | Industrial Services | North America | $7.2M | $3.1M |
| Managed Security Services Provider | Cybersecurity | North America | $22M | $8.4M |
| K-12 Education Franchise Network | Education | Australia | $11M | $4.5M |

---

## Quick Start

### Prerequisites

- Node.js 18+ installed
- npm or bun package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/Majed-Alsho/geetest.git

# Navigate to project directory
cd geetest

# Install dependencies
npm install
# or
bun install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Initialize database and seed test accounts
npx prisma db push
npx tsx prisma/seed.ts

# Start development server
npm run dev
# or
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Environment Variables

Create a `.env.local` file with:

```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Optional: OAuth providers
# GOOGLE_CLIENT_ID=""
# GOOGLE_CLIENT_SECRET=""
```

### Available Scripts

```bash
# Development server with Turbopack
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Type check
npm run type-check

# Database operations
npx prisma db push      # Push schema changes
npx prisma studio       # Open database GUI
npx tsx prisma/seed.ts  # Seed test accounts
```

---

## Development Guide

### Adding a New Page

1. Create a new directory in `src/app/`:
   ```bash
   mkdir src/app/new-page
   ```

2. Create a `page.tsx` file:
   ```tsx
   // src/app/new-page/page.tsx
   import NewPageView from '@/views/NewPageView';

   export default function NewPage() {
     return <NewPageView />;
   }
   ```

3. Create the view component in `src/views/NewPageView.tsx`

### Adding a New API Endpoint

1. Create the route handler in `src/app/api/`:
   ```tsx
   // src/app/api/example/route.ts
   import { NextResponse } from 'next/server';

   export async function GET() {
     return NextResponse.json({ message: 'Hello' });
   }
   ```

### Adding a New Context

1. Create the context file in `src/contexts/`
2. Add the provider to `src/components/Providers.tsx`

---

## Bug Fixes & Changes

### Migration from SPA to Next.js (March 2026)

The application was migrated from a client-side SPA with localStorage to a full-stack Next.js architecture:

| Before | After |
|--------|-------|
| React Router (client-side) | Next.js App Router (file-based) |
| localStorage persistence | Prisma ORM + SQLite |
| Custom auth in AuthContext | NextAuth with Credentials |
| src/pages/* | src/app/* + src/views/* |
| No API routes | Full REST API with TanStack Query |

### Bug Fixes Applied

| Issue | Fix |
|-------|-----|
| AuditContext crash | Added optional chaining for undefined `log.actor` |
| Hydration mismatch | Fixed in useTheme.ts |
| Missing 'use client' | Added directives to client components |
| AdContext infinite loop | Fixed useEffect dependency |
| AdminLogin not using NextAuth | Updated to use signIn |
| JWT_SESSION_ERROR | Stripped JWT to minimal fields (id, role only), fetch rest from DB |
| AdminDashboard TypeError | Added fallback for undefined `eventType` |
| RBAC permission bypass | Updated allTabs roles array, Owner-only for verifications/earnings |
| Avatar upload JSON error | Created proper API route with NextResponse.json() |
| ImageUploader crash | Default images prop to empty array |
| Silent form submission | Added map fields to validation schema |
| No validation feedback | Added error callback with toast notifications |
| Location field not syncing | Added useEffect to sync locationData to form |
| Empty geolocation error | Specific error messages based on error.code |

### Bug Fixes Applied (March 2026 - Session 2)

| Issue | Fix |
|-------|-----|
| Hydration mismatch in ListingCard | Added `'en-US'` locale to all `toLocaleString()` calls across 8 files |
| Admin approval not persisting | Updated AdminDashboard to call `/api/listings/[id]` API instead of only using context |
| Fatal React toast crash | Added defensive error handling to safely extract error messages from objects |
| Prisma "No record found" error | Changed user lookup from `session.user.id` to `session.user.email` which is reliable |
| Next.js 16 async params | Updated `/api/users/[id]/listings` and `/api/users/[id]/public` to use `Promise<{ id: string }>` |
| Generic error messages | API routes now return actual error messages for easier debugging |
| Zod validation rejecting empty strings | Updated `profileSchema` to accept empty strings using `.or(z.literal(''))` |
| Avatar storing as massive base64 | Avatar now uploads to `/api/upload` first, then saves URL to profile |
| Partial updates overwriting data | Profile route now only updates fields explicitly provided in request body |
| API route targeting wrong endpoint | Changed all self-user actions from `/api/users/${user.id}` to `/api/users/profile` |

### API Routes Added/Enhanced

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/users/profile` | GET | Get current user profile (email-based lookup) |
| `/api/users/profile` | PUT/PATCH | Update profile with partial updates and action handlers |
| `/api/upload` | POST | Upload images to server, returns public URL |
| `/api/upload` | DELETE | Delete uploaded files |

### Profile API Actions

The `/api/users/profile` endpoint now handles these actions via `body.action`:

| Action | Description |
|--------|-------------|
| `changePassword` | Change user password with current password verification |
| `saveListing` | Add a listing to user's saved list |
| `unsaveListing` | Remove a listing from saved list |
| `addAlert` | Add a search alert |
| `removeAlert` | Remove a search alert by index |
| `enable2FA` | Enable two-factor authentication |
| `disable2FA` | Disable two-factor authentication |
| `exportData` | Export user data (GDPR compliance) |

### Files Changed

- 75+ files modified
- 3,200+ lines added
- 1,600+ lines removed
- 20+ new App Router routes created
- 13 React contexts created
- 10+ API endpoints created

---

## License

This project is proprietary and confidential.

---

## Support

For questions or issues, contact the development team or create an issue in the repository.
