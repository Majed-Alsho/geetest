# Global Equity Exchange

A modern equity marketplace platform for buying, selling, and trading equity stakes in various assets. Built with Next.js 16, React 19, and TypeScript.

## Features

### Core Marketplace
- **Listings Management** - Create, edit, and manage equity listings with images, descriptions, and pricing
- **Categories** - Organize listings by category (Real Estate, Startups, Art, Vehicles, etc.)
- **Search & Filter** - Advanced search with category and price filtering
- **Watchlist** - Save and track favorite listings

### Advertising System
- **Ad Creation** - Create banner and sidebar advertisements
- **Ad Management** - Track impressions, clicks, and manage ad status
- **Admin Approval** - Admin panel for approving/rejecting ads

### User System
- **Authentication** - Secure login with username/email and password
- **Role-Based Access Control** - Three-tier role system (User < Admin < SuperAdmin < Owner)
- **User Profiles** - Manage profile information and settings
- **Verification System** - Document verification with status tracking

### Admin Dashboard
- **User Management** - View, edit, and manage user accounts
- **Listing Moderation** - Approve or reject listings
- **Ad Management** - Review and approve advertisements
- **Support Tickets** - Handle user support requests
- **Analytics** - Platform statistics and metrics
- **Income Tracking** - Daily, weekly, monthly, and yearly income reports

### Security & Compliance
- **GDPR Compliance** - Data export and account deletion features
- **Activity Logging** - Track user actions and security events
- **Session Management** - Monitor and manage active sessions
- **Security Settings** - Two-factor authentication options

### Notifications
- **Real-time Notifications** - In-app notification system
- **Notification Categories** - Listings, Ads, Support, System, Security
- **Mark as Read/Unread** - Manage notification status

## Tech Stack

- **Framework**: Next.js 16 with App Router (Turbopack)
- **Frontend**: React 19, TypeScript 5
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui + Radix UI
- **Icons**: Lucide React
- **State Management**: React Context API
- **Data Persistence**: localStorage (client-side)

## Quick Start

```bash
# Clone the repository
git clone https://github.com/Majed-Alsho/geetest.git

# Navigate to project
cd geetest

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Test Accounts

| Role | Username/Email | Password |
|------|---------------|----------|
| Owner | `Majed` | `PureLegend!1122!0405!` |
| User | `majed1.alshoghri@gmail.com` | `PureLegend!1122!0405!` |

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication pages (login, register)
│   ├── (main)/            # Main application pages
│   └── api/               # API routes
├── components/            # Reusable React components
│   ├── layout/           # Layout components (Navbar, Footer)
│   └── ui/               # shadcn/ui components
├── contexts/             # React Context providers
│   ├── AuthContext.tsx   # Authentication state
│   ├── ListingsContext.tsx # Listings management
│   ├── AdContext.tsx     # Advertisements
│   ├── NotificationsContext.tsx # Notifications
│   ├── EarningsContext.tsx # Income tracking
│   └── VerificationContext.tsx # Document verification
├── hooks/                # Custom React hooks
└── lib/                  # Utility functions
```

## Role Permissions

### User
- Browse listings and categories
- Create and manage own listings
- Create and manage watchlist
- Submit support tickets
- Manage own profile

### Admin
- All User permissions
- Approve/reject listings
- Approve/reject ads
- Handle support tickets
- View platform analytics

### SuperAdmin
- All Admin permissions
- Manage users (edit, deactivate)
- Access all admin features
- Manage categories

### Owner
- All SuperAdmin permissions
- Full platform control
- Manage all roles
- System configuration

## Scripts

```bash
# Development
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## License

MIT License - feel free to use this project for personal or commercial purposes.
