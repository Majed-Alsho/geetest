# Global Equity Exchange (GEE)

A premium business marketplace platform that facilitates the acquisition of verified businesses by connecting sellers with qualified investors. Built with modern web technologies including Next.js 16, React 19, TypeScript, and Tailwind CSS 4.

---

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Technology Stack](#technology-stack)
4. [Project Structure](#project-structure)
5. [Pages & Routes](#pages--routes)
6. [Context System](#context-system)
7. [Data Models](#data-models)
8. [Role-Based Access Control](#role-based-access-control)
9. [Data Storage & Flow](#data-storage--flow)
10. [Seeded Data & Test Accounts](#seeded-data--test-accounts)
11. [Quick Start](#quick-start)
12. [Detailed Feature Documentation](#detailed-feature-documentation)
13. [API Reference](#api-reference)
14. [Development Guide](#development-guide)

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
| **Authentication** | Email/username + password login with secure validation |
| **Admin Login** | Separate authentication flow for administrators |
| **Password Reset** | Token-based password recovery (24-hour expiry) |
| **Profile Management** | Avatar, bio, phone, social links customization |
| **Two-Factor Auth** | TOTP-based 2FA support |
| **Session Management** | View and revoke active sessions |
| **Account Suspension** | Admin can suspend/deactivate users |
| **GDPR Compliance** | Data export and account deletion features |

### Advertising System

| Feature | Description |
|---------|-------------|
| **Ad Tiers** | Basic ($29-179), Premium, Featured packages |
| **Duration Options** | 3, 7, 14, or 30 days |
| **Approval Workflow** | Admin approval → 48-hour payment window |
| **Bulk Discounts** | Up to 20% discount for 10+ listings |
| **Analytics** | Impressions and clicks tracking |
| **Extensions** | Extend active advertisements |
| **Expiry Notifications** | Alerts 6 hours before ad expires |

### Notifications System

| Feature | Description |
|---------|-------------|
| **15 Notification Types** | Listings, offers, security, support, system, etc. |
| **In-App Dropdown** | Bell icon with unread count badge |
| **Priority Levels** | Low, medium, high, urgent |
| **Action URLs** | Direct links to relevant pages |
| **Preferences** | Configure notification settings |

### Verification System

| Feature | Description |
|---------|-------------|
| **Document Upload** | Financial statements, tax returns, legal documents |
| **Status Tracking** | Pending → Approved/Rejected with notes |
| **Admin Review** | Admin can approve/reject with reasons |
| **Verification Badges** | Display verification status on listings |

### Support System

| Feature | Description |
|---------|-------------|
| **Ticket Creation** | Category, priority, subject, description |
| **Categories** | Account, Listings, Payments, Technical, Other |
| **Priority Levels** | Low, medium, high, urgent |
| **Status Workflow** | Open → In Progress → Resolved |
| **Admin Assignment** | Assign tickets to team members |
| **Quick Replies** | Template responses for common issues |

### Security Features

| Feature | Description |
|---------|-------------|
| **Audit Logging** | All user and admin actions logged |
| **Rate Limiting** | API, auth, search, upload limits |
| **Suspicious Activity Detection** | Automated threat monitoring |
| **Cookie Consent** | GDPR-compliant consent banner |
| **Data Encryption** | Secure storage practices |

### Admin Dashboard

| Feature | Description |
|---------|-------------|
| **User Management** | View, edit, suspend, delete users |
| **Listing Moderation** | Approve/reject pending listings |
| **Ad Management** | Review and approve advertisements |
| **Support Tickets** | Handle user support requests |
| **Analytics Dashboard** | Platform statistics and metrics |
| **Income Tracking** | Daily, weekly, monthly, yearly revenue |
| **Audit Logs** | View all platform activity |
| **Rate Limit Monitor** | View and manage rate limits |
| **Announcements** | Create platform-wide announcements |

### Investor Features

| Feature | Description |
|---------|-------------|
| **Portfolio Management** | Track investment portfolio |
| **AI Analysis** | Run AI-powered business analysis |
| **Company Comparison** | Compare up to 4 businesses |
| **Compatibility Analysis** | Investment compatibility scoring |
| **Outsourcing Estimates** | Cost estimation tools |
| **AI Chat Interface** | Chat with AI assistant |

---

## Technology Stack

### Core Framework
| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 16.x | React framework with App Router and Turbopack |
| **React** | 19.x | UI library |
| **TypeScript** | 5.x | Type-safe JavaScript |
| **Tailwind CSS** | 4.x | Utility-first CSS framework |

### UI Components
| Technology | Purpose |
|------------|---------|
| **shadcn/ui** | High-quality accessible components |
| **Radix UI** | Primitive UI components |
| **Lucide React** | Icon library |
| **Framer Motion** | Animations |
| **Recharts** | Charts and data visualization |

### Forms & Validation
| Technology | Purpose |
|------------|---------|
| **React Hook Form** | Form state management |
| **Zod** | Schema validation |

### State Management
| Technology | Purpose |
|------------|---------|
| **React Context** | Global state management |
| **TanStack Query** | Server state (configured) |

### Data Storage
| Technology | Purpose |
|------------|---------|
| **localStorage** | Client-side data persistence |
| **Prisma** | ORM (configured for SQLite) |

---

## Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── page.tsx                 # Main entry point with router
│   ├── layout.tsx               # Root layout
│   ├── globals.css              # Global styles
│   └── api/                     # API routes
│
├── components/                   # React Components
│   ├── layout/                  # Layout components
│   │   ├── Layout.tsx          # Main app wrapper
│   │   ├── Navbar.tsx          # Top navigation bar
│   │   └── Footer.tsx          # Site footer
│   │
│   ├── marketplace/             # Marketplace components
│   │   ├── ListingCard.tsx     # Individual listing card
│   │   ├── FiltersBar.tsx      # Search and filter controls
│   │   ├── CompareBar.tsx      # Comparison selection bar
│   │   ├── ListingActions.tsx  # Save, share, promote actions
│   │   └── SkeletonCard.tsx    # Loading placeholder
│   │
│   ├── auth/                    # Authentication components
│   │   ├── ProtectedRoute.tsx  # Route guard
│   │   └── AuthGate.tsx        # Auth state wrapper
│   │
│   ├── trust/                   # Trust & verification
│   │   ├── TrustIndicators.tsx # Platform stats
│   │   ├── VerificationBadges.tsx
│   │   ├── NDAGate.tsx         # NDA requirement modal
│   │   └── EscrowBanner.tsx    # Escrow promotion
│   │
│   ├── ui/                      # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── dialog.tsx
│   │   ├── form.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── table.tsx
│   │   ├── tabs.tsx
│   │   ├── toast.tsx
│   │   └── ... (30+ components)
│   │
│   ├── NotificationsDropdown.tsx
│   ├── SupportForm.tsx
│   ├── ImageUploader.tsx
│   ├── LocationPicker.tsx
│   ├── PromoteListingModal.tsx
│   ├── UserPromotions.tsx
│   ├── AnnouncementsBanner.tsx
│   └── Providers.tsx            # Context providers wrapper
│
├── contexts/                     # React Contexts
│   ├── AuthContext.tsx          # Authentication state
│   ├── NavigationContext.tsx    # Client-side routing
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
│   └── use-toast.ts             # Toast notifications
│
├── lib/                          # Utilities
│   ├── data.ts                  # Seed data & types
│   ├── utils.ts                 # Utility functions
│   └── validators.ts            # Validation schemas
│
├── pages/                        # Page Components
│   ├── Home.tsx                 # Landing page
│   ├── Marketplace.tsx          # Browse listings
│   ├── ListingDetail.tsx        # Single listing view
│   ├── ComparePage.tsx          # Side-by-side comparison
│   ├── CreateListing.tsx        # Listing form
│   ├── Investors.tsx            # Investor portal
│   ├── InvestorProfile.tsx      # Investor dashboard
│   ├── KnowledgeBase.tsx        # FAQ & help
│   ├── HowItWorks.tsx           # Platform guide
│   ├── Security.tsx             # Security info
│   ├── Terms.tsx                # Terms of service
│   ├── Privacy.tsx              # Privacy policy
│   ├── RiskDisclosure.tsx       # Investment risks
│   ├── Login.tsx                # User login
│   ├── Signup.tsx               # User registration
│   ├── AdminLogin.tsx           # Admin authentication
│   ├── AdminDashboard.tsx       # Admin panel
│   ├── Profile.tsx              # User profile
│   ├── ResetPassword.tsx        # Password recovery
│   └── DataDeletion.tsx         # GDPR deletion
│
└── types/                        # TypeScript Types
    ├── advertising.ts
    ├── notifications.ts
    ├── support.ts
    └── index.ts
```

---

## Pages & Routes

The application uses a client-side navigation system via `NavigationContext`. All routes are defined in `src/app/page.tsx`:

### Public Pages

| Route | Component | Description |
|-------|-----------|-------------|
| `home` | `Home.tsx` | Landing page with hero section, featured listings, testimonials, trust indicators |
| `marketplace` | `Marketplace.tsx` | Browse all listings with filters, search, pagination |
| `listing-detail` | `ListingDetail.tsx` | Detailed view of a single listing with images, financials, contact |
| `compare` | `ComparePage.tsx` | Side-by-side comparison of up to 4 listings |
| `investors` | `Investors.tsx` | Investment portal with AI analysis features |
| `knowledge-base` | `KnowledgeBase.tsx` | FAQ and help articles |
| `how-it-works` | `HowItWorks.tsx` | Step-by-step platform usage guide |
| `security` | `Security.tsx` | Security features and policies |
| `terms` | `Terms.tsx` | Terms of service |
| `privacy` | `Privacy.tsx` | Privacy policy |
| `risk-disclosure` | `RiskDisclosure.tsx` | Investment risk disclosure |

### Authentication Pages

| Route | Component | Description |
|-------|-----------|-------------|
| `login` | `Login.tsx` | User login with email/username and password |
| `signup` | `Signup.tsx` | User registration with email verification |
| `admin-login` | `AdminLogin.tsx` | Separate admin authentication |
| `reset-password` | `ResetPassword.tsx` | Password reset with token |
| `data-deletion` | `DataDeletion.tsx` | GDPR data deletion request |

### Protected Pages (Require Authentication)

| Route | Component | Description |
|-------|-----------|-------------|
| `profile` | `Profile.tsx` | User profile, settings, saved listings |
| `create-listing` | `CreateListing.tsx` | Create new business listing |
| `investor-profile` | `InvestorProfile.tsx` | Investor portfolio management |

### Admin Pages (Role-Based Access)

| Route | Component | Roles | Description |
|-------|-----------|-------|-------------|
| `admin` | `AdminDashboard.tsx` | admin+ | Full admin dashboard with tabs |

---

## Context System

The application uses 14 React Contexts for state management:

### Core Contexts

#### AuthContext (`src/contexts/AuthContext.tsx`)

**State:**
- `user` - Current authenticated user
- `isAuthenticated` - Authentication status
- `isLoading` - Loading state
- `sessions` - Active user sessions

**Functions:**
```typescript
// Authentication
login(identifier: string, password: string): Promise<boolean>
signup(email: string, password: string, name: string): Promise<boolean>
adminLogin(username: string, password: string): Promise<boolean>
logout(): void

// User Management
updateUserProfile(updates: Partial<User>): Promise<boolean>
changePassword(currentPassword: string, newPassword: string): Promise<boolean>
suspendUser(userId: string, reason: string): void
deleteUser(userId: string): void
exportUserData(userId: string): Promise<string>

// Security
enableTwoFactor(userId: string): Promise<string>
getSessions(userId: string): Session[]
revokeSession(sessionId: string): void
```

#### NavigationContext (`src/contexts/NavigationContext.tsx`)

**State:**
- `currentView` - Current page/route
- `selectedListingId` - Selected listing for detail view

**Functions:**
```typescript
navigateTo(view: string): void
setSelectedListingId(id: string | null): void
```

#### ListingContext (`src/contexts/ListingContext.tsx`)

**State:**
- `listings` - All listings array
- `isLoading` - Loading state
- `analytics` - Listing analytics data

**Functions:**
```typescript
// CRUD Operations
createListing(listing: Omit<Listing, 'id'>): Promise<Listing>
updateListing(id: string, updates: Partial<Listing>): Promise<boolean>
deleteListing(id: string): Promise<boolean>

// Status Management
approveListing(id: string): Promise<boolean>
rejectListing(id: string, reason: string): Promise<boolean>

// Analytics
incrementViews(id: string): void
toggleLike(id: string, userId: string): void
toggleSave(id: string, userId: string): void
```

### Feature Contexts

#### AdContext (`src/contexts/AdContext.tsx`)

**State:**
- `advertisements` - All advertisements
- `userAds` - Current user's ads

**Functions:**
```typescript
createAd(listingId: string, tier: AdTier, duration: AdDuration): Promise<Advertisement>
approveAd(adId: string): void
rejectAd(adId: string, reason: string): void
payForAd(adId: string): Promise<boolean>
extendAd(adId: string, additionalDays: number): Promise<boolean>
incrementImpression(adId: string): void
incrementClick(adId: string): void
```

#### NotificationsContext (`src/contexts/NotificationsContext.tsx`)

**State:**
- `notifications` - User's notifications
- `unreadCount` - Number of unread notifications
- `preferences` - Notification preferences

**Functions:**
```typescript
addNotification(notification: Omit<AppNotification, 'id'>): void
markAsRead(notificationId: string): void
markAllAsRead(): void
clearAll(): void
updatePreferences(preferences: NotificationPreferences): void
```

#### VerificationContext (`src/contexts/VerificationContext.tsx`)

**State:**
- `verifications` - All verification requests
- `userVerifications` - Current user's requests

**Functions:**
```typescript
submitVerification(listingId: string, documents: Document[]): Promise<VerificationRequest>
uploadDocument(file: File, type: DocumentType): Promise<Document>
approveVerification(requestId: string, notes?: string): void
rejectVerification(requestId: string, reason: string): void
```

#### SupportContext (`src/contexts/SupportContext.tsx`)

**State:**
- `tickets` - All support tickets
- `userTickets` - Current user's tickets

**Functions:**
```typescript
createTicket(ticket: Omit<SupportTicket, 'id'>): Promise<SupportTicket>
addMessage(ticketId: string, message: string, isStaff: boolean): void
resolveTicket(ticketId: string, resolution: string): void
assignTicket(ticketId: string, adminId: string): void
```

#### WatchlistContext (`src/contexts/WatchlistContext.tsx`)

**State:**
- `watchlist` - User's saved listings
- `priceAlerts` - Configured price alerts

**Functions:**
```typescript
addToWatchlist(listingId: string): void
removeFromWatchlist(listingId: string): void
addPriceAlert(listingId: string, targetPrice: number): void
removePriceAlert(alertId: string): void
checkPriceAlerts(): void
```

#### CompareContext (`src/contexts/CompareContext.tsx`)

**State:**
- `compareList` - Listings selected for comparison (max 4)

**Functions:**
```typescript
addToCompare(listingId: string): boolean  // Returns false if already at max
removeFromCompare(listingId: string): void
clearCompare(): void
isInCompare(listingId: string): boolean
```

#### EarningsContext (`src/contexts/EarningsContext.tsx`)

**State:**
- `earnings` - All earnings records
- `summary` - Aggregated earnings data

**Functions:**
```typescript
addEarning(earning: Omit<Earning, 'id'>): void
getEarningsByPeriod(period: 'daily' | 'weekly' | 'monthly' | 'yearly'): Earning[]
getTotalBySource(source: EarningSource): number
```

#### AnnouncementsContext (`src/contexts/AnnouncementsContext.tsx`)

**State:**
- `announcements` - All platform announcements

**Functions:**
```typescript
createAnnouncement(announcement: Omit<Announcement, 'id'>): void
publishAnnouncement(id: string): void
dismissAnnouncement(id: string): void
```

#### InvestorContext (`src/contexts/InvestorContext.tsx`)

**State:**
- `portfolio` - User's investment portfolio
- `analysisResults` - AI analysis results

**Functions:**
```typescript
runAnalysis(companyId: string): Promise<AnalysisResult>
compareCompanies(companyIds: string[]): Promise<ComparisonResult>
analyzeCompatibility(profile: InvestorProfile): Promise<CompatibilityResult>
getOutsourcingEstimates(requirements: OutsourcingRequest): Promise<Estimate[]>
```

### Security Contexts

#### AuditContext (`src/contexts/AuditContext.tsx`)

**State:**
- `logs` - All audit log entries

**Functions:**
```typescript
logEvent(event: AuditEvent): void
getFilteredLogs(filters: LogFilters): AuditLog[]
exportLogs(format: 'json' | 'csv'): Promise<string>
clearOldLogs(olderThanDays: number): void
```

#### RateLimitContext (`src/contexts/RateLimitContext.tsx`)

**State:**
- `limits` - Current rate limit status
- `events` - Rate limit events

**Functions:**
```typescript
checkRateLimit(identifier: string, type: RateLimitType): boolean
recordRequest(identifier: string, type: RateLimitType): void
blockIdentifier(identifier: string, duration: number): void
```

---

## Data Models

### User

```typescript
interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin' | 'superadmin' | 'owner';
  clientNumber?: string;        // Format: GEE-YY-XXXXXX
  createdAt: Date;
  savedListings?: string[];
  isSuspended?: boolean;
  suspensionReason?: string;
  twoFactorEnabled?: boolean;
  twoFactorSecret?: string;
  avatar?: string;              // Base64 encoded
  bio?: string;
  phone?: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
  preferences?: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    marketingEmails: boolean;
  };
  lastLogin?: Date;
  loginCount?: number;
}
```

### Listing

```typescript
interface Listing {
  id: string;
  title: string;
  category: ListingCategory;
  region: ListingRegion;
  location: string;
  description: string;
  highlights: string[];
  
  // Financial Information
  revenue: number;              // Annual revenue
  growthYoY: number;            // Year-over-year growth percentage
  employees: number;
  price: number;                // Asking price
  ebitdaMargin: number;         // EBITDA margin percentage
  
  // Status
  verified: boolean;
  featured: boolean;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  
  // Metadata
  createdAt: string;
  createdBy?: string;
  updatedAt?: string;
  
  // Media
  images?: {
    id: string;
    url: string;
    caption?: string;
    isPrimary: boolean;
  }[];
  
  // Location Details
  coordinates?: {
    lat: number;
    lng: number;
  };
  address?: {
    street?: string;
    city: string;
    state?: string;
    postalCode?: string;
    country: string;
  };
  
  // Analytics
  analytics?: {
    views: number;
    saves: number;
    shares: number;
    inquiries: number;
  };
}

type ListingCategory = 
  | 'technology'
  | 'ecommerce'
  | 'healthcare'
  | 'manufacturing'
  | 'hospitality'
  | 'logistics'
  | 'food_beverage'
  | 'industrial_services'
  | 'cybersecurity'
  | 'education';

type ListingRegion = 
  | 'north_america'
  | 'europe'
  | 'asia_pacific'
  | 'middle_east'
  | 'australia';
```

### Advertisement

```typescript
interface Advertisement {
  id: string;
  listingId: string;
  userId: string;
  tier: 'basic' | 'premium' | 'featured';
  duration: '3_days' | '7_days' | '14_days' | '30_days';
  status: 
    | 'pending' 
    | 'approved_pending_payment' 
    | 'active' 
    | 'paused' 
    | 'expired' 
    | 'rejected';
  pricePaid: number;
  impressions: number;
  clicks: number;
  createdAt: Date;
  expiresAt: Date;
  rejectionReason?: string;
}
```

### Notification

```typescript
interface AppNotification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  read: boolean;
  createdAt: Date;
  actionUrl?: string;
}

type NotificationType = 
  | 'listing_approved'
  | 'listing_rejected'
  | 'listing_inquiry'
  | 'offer_received'
  | 'offer_accepted'
  | 'offer_rejected'
  | 'ad_approved'
  | 'ad_rejected'
  | 'ad_expiring'
  | 'verification_approved'
  | 'verification_rejected'
  | 'support_reply'
  | 'ticket_resolved'
  | 'security_alert'
  | 'system';
```

### SupportTicket

```typescript
interface SupportTicket {
  id: string;
  clientNumber: string;
  subject: string;
  category: 'account' | 'listings' | 'payments' | 'technical' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  messages: {
    id: string;
    sender: string;
    message: string;
    isStaff: boolean;
    timestamp: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
  assignedTo?: string;
  resolution?: string;
}
```

### VerificationRequest

```typescript
interface VerificationRequest {
  id: string;
  listingId: string;
  userId: string;
  status: 'pending' | 'approved' | 'rejected';
  documents: {
    id: string;
    type: 'financial_statement' | 'tax_return' | 'legal_document' | 'other';
    name: string;
    url: string;
    uploadedAt: Date;
  }[];
  notes?: string;
  rejectionReason?: string;
  createdAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
}
```

### Earning

```typescript
interface Earning {
  id: string;
  source: 'listing_fee' | 'ad_revenue' | 'subscription' | 'verification_fee';
  amount: number;
  description: string;
  referenceId?: string;
  createdAt: Date;
}
```

### AuditLog

```typescript
interface AuditLog {
  id: string;
  userId?: string;
  action: string;
  category: 'auth' | 'listing' | 'ad' | 'user' | 'support' | 'system';
  details: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
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
| Security settings | ❌ | ❌ | ✅ | ✅ |
| Audit logs | ❌ | ❌ | ✅ | ✅ |
| Rate limits | ❌ | ❌ | ✅ | ✅ |
| Verifications tab | ❌ | ❌ | ❌ | ✅ |
| Earnings tab | ❌ | ❌ | ❌ | ✅ |
| **User Management** |
| Edit any user | ❌ | ❌ | ✅ | ✅ |
| Suspend users | ❌ | ❌ | ✅ | ✅ |
| Delete users | ❌ | ❌ | ✅ | ✅ |
| Change user roles | ❌ | ❌ | ❌ | ✅ |
| **Listing Management** |
| Approve listings | ❌ | ❌ | ✅ | ✅ |
| Reject listings | ❌ | ❌ | ✅ | ✅ |
| Edit any listing | ❌ | ❌ | ✅ | ✅ |
| Delete any listing | ❌ | ❌ | ✅ | ✅ |

*Admin can view listings review but cannot approve/reject

### Implementation

```typescript
// Role check helpers (used throughout the app)
const isAdmin = user?.role === 'admin' || user?.role === 'superadmin' || user?.role === 'owner';
const isSuperAdmin = user?.role === 'superadmin' || user?.role === 'owner';
const isOwner = user?.role === 'owner';

// Tab visibility in AdminDashboard
const allTabs = [
  { id: 'support', label: 'Support', roles: ['admin', 'superadmin', 'owner'] },
  { id: 'listings', label: 'Listings Review', roles: ['admin', 'superadmin', 'owner'] },
  { id: 'ads', label: 'Ads Management', roles: ['superadmin', 'owner'] },
  { id: 'users', label: 'Users', roles: ['superadmin', 'owner'] },
  { id: 'analytics', label: 'Analytics', roles: ['superadmin', 'owner'] },
  { id: 'security', label: 'Security', roles: ['superadmin', 'owner'] },
  { id: 'audit', label: 'Audit Logs', roles: ['superadmin', 'owner'] },
  { id: 'rate-limits', label: 'Rate Limits', roles: ['superadmin', 'owner'] },
  { id: 'verifications', label: 'Verifications', roles: ['owner'] },
  { id: 'earnings', label: 'Earnings', roles: ['owner'] },
  { id: 'settings', label: 'Settings', roles: ['admin', 'superadmin', 'owner'] },
];

// Filter tabs based on user role
const visibleTabs = allTabs.filter(tab => tab.roles.includes(user?.role));
```

---

## Data Storage & Flow

### Storage Architecture

All data is stored in the browser's localStorage. This is a client-side only application with no backend database connection.

| Storage Key | Data |
|-------------|------|
| `gee_users` | User accounts with hashed passwords |
| `gee_session` | Current authenticated user |
| `gee_user_sessions` | Active user sessions |
| `gee_user_listings` | User-created listings |
| `gee_listing_analytics` | View/like/save analytics |
| `gee_advertisements` | Advertisement data |
| `gee_notifications` | User notifications |
| `gee_verifications` | Verification requests |
| `gee_support_tickets` | Support tickets |
| `gee_watchlist` | User watchlist |
| `gee_earnings` | Revenue records |
| `gee_audit_logs` | Audit log entries |
| `gee_rate_limit_events` | Rate limiting events |
| `gee_announcements` | Platform announcements |

### Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        User Interface                           │
│  (React Components - Pages, Cards, Forms, Modals)              │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    React Context Layer                          │
│  (Auth, Listing, Ad, Notification, Support, etc.)              │
│                                                                 │
│  - Manages application state                                    │
│  - Provides functions for data operations                       │
│  - Handles business logic                                       │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     localStorage Layer                          │
│  (Browser's persistent storage)                                 │
│                                                                 │
│  - Data persists across sessions                                │
│  - JSON serialization                                           │
│  - Synchronous read/write operations                            │
└─────────────────────────────────────────────────────────────────┘
```

### Data Flow Example: Creating a Listing

```
1. User fills out CreateListing form
2. Form submits to ListingContext.createListing()
3. ListingContext generates unique ID
4. ListingContext creates listing object with status='pending'
5. ListingContext saves to localStorage (gee_user_listings)
6. ListingContext updates state, triggers re-render
7. NavigationContext navigates to marketplace
8. ListingCard components display the new listing
```

### Context Provider Hierarchy

```tsx
// In src/components/Providers.tsx
<QueryClientProvider client={queryClient}>
  <AuthProvider>
    <ListingProvider>
      <CompareProvider>
        <NavigationProvider>
          <SupportProvider>
            <AdProvider>
              <NotificationsProvider>
                <WatchlistProvider>
                  <AuditProvider>
                    <RateLimitProvider>
                      <EarningsProvider>
                        <VerificationProvider>
                          <AnnouncementsProvider>
                            <InvestorProvider>
                              {children}
                            </InvestorProvider>
                          </AnnouncementsProvider>
                        </VerificationProvider>
                      </EarningsProvider>
                    </RateLimitProvider>
                  </AuditProvider>
                </WatchlistProvider>
              </NotificationsProvider>
            </AdProvider>
          </SupportProvider>
        </NavigationProvider>
      </CompareProvider>
    </ListingProvider>
  </AuthProvider>
</QueryClientProvider>
```

---

## Seeded Data & Test Accounts

### Admin Accounts (Hardcoded in AuthContext)

| Username | Role | Name |
|----------|------|------|
| `Majed` | owner | Majed |
| `owner` | owner | Platform Owner |
| `superadmin` | superadmin | Super Administrator |
| `admin` | admin | Administrator |

> ⚠️ **Security Note**: Default passwords are set in `AuthContext.tsx`. Change these immediately in production!

### Pre-seeded User Account

| Email | Client Number |
|-------|---------------|
| `majed1.alshoghri@gmail.com` | GEE-24-ALSH001 |

> ⚠️ **Security Note**: Demo user password is set in `AuthContext.tsx`. Change or disable in production!

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

### Auto-generated Demo Data

On first load, the application generates:

- **3 Verification Requests** - Pending, approved, and rejected states
- **50 Audit Log Entries** - Random user/admin actions
- **30 Rate Limit Events** - Various rate limit checks
- **45 Earnings Records** - Revenue over the past 30 days

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

# Start development server
npm run dev
# or
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

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
```

---

## Detailed Feature Documentation

### Authentication System

#### User Registration

1. User navigates to Signup page
2. Enters email, name, and password
3. System validates:
   - Email format and uniqueness
   - Password strength (min 8 chars, uppercase, lowercase, number)
   - Name is not empty
4. System generates unique client number: `GEE-YY-XXXXXX`
5. User is created with role `user`
6. User is automatically logged in
7. Welcome notification is sent

#### Login Process

1. User enters identifier (email, username, or client number)
2. User enters password
3. System checks:
   - Hardcoded admin accounts first
   - localStorage users second
4. Password is validated
5. If 2FA is enabled, TOTP code is requested
6. Session is created and stored
7. User is redirected to their previous page or home

#### Admin Authentication

Admin accounts are stored separately in code (not localStorage):
- Separate login page at `/admin-login`
- Username-based authentication
- Higher role accounts (admin, superadmin, owner)
- Access to admin dashboard

### Listing Lifecycle

```
Create → Pending → Approved/Rejected → Published → (Optional) Featured
                                                        ↓
                                                    Expired/Sold
```

1. **Creation**: User fills out listing form with business details
2. **Pending**: Listing awaits admin review
3. **Approval/Rejection**: Admin approves or rejects with reason
4. **Published**: Approved listings appear in marketplace
5. **Featured**: Optional paid promotion for visibility
6. **Expiration**: Listings expire after 90 days (renewable)

### Advertisement Workflow

```
Create → Pending → Approved (awaiting payment) → Paid → Active → Expired
                 ↘ Rejected                         ↘ Paused
```

1. **Creation**: User selects tier and duration
2. **Pending**: Ad awaits admin approval
3. **Approved/Payment**: 48-hour window to pay
4. **Active**: Ad displays in designated spots
5. **Expired**: Ad removed after duration ends

#### Ad Pricing

| Tier | 3 Days | 7 Days | 14 Days | 30 Days |
|------|--------|--------|---------|---------|
| Basic | $29 | $59 | $99 | $179 |
| Premium | $79 | $149 | $249 | $449 |
| Featured | $199 | $349 | $599 | $999 |

#### Bulk Discounts

- 3+ listings: 10% off
- 5+ listings: 15% off
- 10+ listings: 20% off

### Notification System

#### Notification Types

| Type | Trigger | Priority |
|------|---------|----------|
| `listing_approved` | Admin approves listing | Medium |
| `listing_rejected` | Admin rejects listing | High |
| `listing_inquiry` | Someone contacts about listing | High |
| `offer_received` | New offer on listing | High |
| `offer_accepted` | Your offer was accepted | Urgent |
| `offer_rejected` | Your offer was rejected | Medium |
| `ad_approved` | Ad approved by admin | Medium |
| `ad_rejected` | Ad rejected by admin | High |
| `ad_expiring` | Ad expires in 6 hours | Urgent |
| `verification_approved` | Verification approved | Medium |
| `verification_rejected` | Verification rejected | High |
| `support_reply` | Staff replied to ticket | Medium |
| `ticket_resolved` | Ticket marked resolved | Medium |
| `security_alert` | Suspicious activity detected | Urgent |
| `system` | Platform announcements | Low |

### Support Ticket Workflow

```
Create → Open → In Progress → Resolved → Closed
                        ↘ Reopened
```

#### Categories

- **Account**: Login, profile, settings issues
- **Listings**: Listing creation, editing, visibility
- **Payments**: Billing, invoices, refunds
- **Technical**: Bugs, errors, performance
- **Other**: General inquiries

#### Priority Levels

| Priority | Response Time | Color |
|----------|---------------|-------|
| Low | 48 hours | Gray |
| Medium | 24 hours | Blue |
| High | 4 hours | Orange |
| Urgent | 1 hour | Red |

### Verification Process

1. **Submit Request**: User uploads required documents
2. **Document Types**:
   - Financial statements (last 2 years)
   - Tax returns
   - Legal documents (registration, licenses)
   - Other supporting documents
3. **Admin Review**: SuperAdmin or Owner reviews
4. **Decision**: Approved or rejected with reason
5. **Badge**: Approved listings display verification badge

### Security Features

#### Audit Logging

All actions are logged with:
- Timestamp
- User ID
- Action type
- Details (JSON)
- IP address (if available)
- User agent

#### Rate Limiting

| Type | Limit | Window |
|------|-------|--------|
| API | 100 requests | 1 minute |
| Auth | 5 attempts | 15 minutes |
| Search | 30 requests | 1 minute |
| Upload | 10 uploads | 1 hour |

#### Suspicious Activity Detection

Automatic flags for:
- Multiple failed login attempts
- Rapid successive actions
- Unusual access patterns
- Geographic anomalies

---

## Development Guide

### Adding a New Page

1. Create component in `src/pages/`
2. Add route in `src/app/page.tsx`:
```tsx
case 'your-page':
  return <YourPage />;
```
3. Add navigation link in `Navbar.tsx`

### Adding a New Context

1. Create context file in `src/contexts/`
2. Define interface for state and functions
3. Create provider component
4. Add to `Providers.tsx` hierarchy
5. Export custom hook for easy access

### Adding a New Notification Type

1. Add type to `NotificationType` in `src/types/notifications.ts`
2. Add handler in `NotificationsContext.tsx`
3. Trigger notification where needed

### Modifying Role Permissions

1. Update `allTabs` array in `AdminDashboard.tsx`
2. Add role checks where needed
3. Update this README with changes

---

## License

MIT License - Feel free to use this project for personal or commercial purposes.

---

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## Support

For issues or questions, please open a GitHub issue or contact the development team.
