// FAQ and Knowledge Base Types

export interface FAQCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  order: number;
}

export interface FAQArticle {
  id: string;
  categoryId: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  tags: string[];
  viewCount: number;
  helpfulCount: number;
  notHelpfulCount: number;
  createdAt: Date;
  updatedAt: Date;
  author: string;
  relatedArticles?: string[];
  isFeatured: boolean;
}

export interface FAQSearchResult {
  article: FAQArticle;
  relevanceScore: number;
  highlightedContent?: string;
}

// Default Categories
export const DEFAULT_CATEGORIES: FAQCategory[] = [
  {
    id: 'getting-started',
    name: 'Getting Started',
    description: 'Learn the basics of using our platform',
    icon: 'Rocket',
    order: 1,
  },
  {
    id: 'buyers',
    name: 'For Buyers',
    description: 'Guides for investors and acquirers',
    icon: 'Users',
    order: 2,
  },
  {
    id: 'sellers',
    name: 'For Sellers',
    description: 'Help for listing your business',
    icon: 'Building2',
    order: 3,
  },
  {
    id: 'listings',
    name: 'Listings & Marketplace',
    description: 'Understanding listings and transactions',
    icon: 'Store',
    order: 4,
  },
  {
    id: 'advertising',
    name: 'Advertising & Promotion',
    description: 'How to promote your listings',
    icon: 'Megaphone',
    order: 5,
  },
  {
    id: 'account',
    name: 'Account & Security',
    description: 'Manage your account settings',
    icon: 'Shield',
    order: 6,
  },
  {
    id: 'payments',
    name: 'Payments & Billing',
    description: 'Payment methods and invoices',
    icon: 'CreditCard',
    order: 7,
  },
  {
    id: 'legal',
    name: 'Legal & Compliance',
    description: 'GDPR, terms, and privacy',
    icon: 'Scale',
    order: 8,
  },
];

// Sample Articles
export const SAMPLE_ARTICLES: FAQArticle[] = [
  {
    id: 'art-1',
    categoryId: 'getting-started',
    title: 'How does Global Equity Exchange work?',
    slug: 'how-does-gee-work',
    content: `# How Global Equity Exchange Works

Global Equity Exchange is a marketplace connecting business owners looking to sell with investors seeking acquisition opportunities.

## For Sellers

1. **Create an Account** - Sign up and verify your identity
2. **List Your Business** - Provide details about your business including financials
3. **Get Discovered** - Investors can find your listing through search and filters
4. **Connect with Buyers** - Receive inquiries and negotiate with interested parties

## For Buyers

1. **Browse Listings** - Search thousands of vetted business opportunities
2. **Filter by Criteria** - Narrow down by industry, location, price, and more
3. **Request Information** - Submit NDAs and get detailed financials
4. **Make an Offer** - Negotiate and close the deal

## Verification Process

All listings go through our verification process to ensure:
- Accurate financial information
- Legitimate business operations
- Proper documentation

This creates a trusted environment for all parties.`,
    excerpt: 'Learn how our marketplace connects business sellers with qualified investors.',
    tags: ['overview', 'platform', 'basics'],
    viewCount: 1542,
    helpfulCount: 148,
    notHelpfulCount: 12,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-03-10'),
    author: 'Support Team',
    isFeatured: true,
  },
  {
    id: 'art-2',
    categoryId: 'sellers',
    title: 'How to create an effective listing',
    slug: 'create-effective-listing',
    content: `# Creating an Effective Business Listing

A compelling listing attracts more qualified buyers. Here's how to optimize yours:

## Essential Information

### Financial Highlights
- Include accurate revenue figures for the last 3 years
- Show EBITDA or SDE margins
- Highlight growth trends

### Business Description
Write a clear, engaging description that includes:
- What the business does
- Target market and customers
- Competitive advantages
- Growth opportunities

## Tips for Success

1. **Be Transparent** - Accurate information builds trust
2. **Show Potential** - Highlight growth opportunities
3. **Use Keywords** - Help buyers find your listing
4. **Add Photos** - Visual content increases engagement
5. **Set Realistic Price** - Overpricing deters serious buyers

## Common Mistakes to Avoid

- Vague descriptions
- Missing financial data
- Unrealistic valuations
- Poor quality images`,
    excerpt: 'Tips and best practices for creating a business listing that attracts buyers.',
    tags: ['listing', 'selling', 'tips'],
    viewCount: 892,
    helpfulCount: 95,
    notHelpfulCount: 8,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-03-05'),
    author: 'Success Team',
    isFeatured: true,
  },
  {
    id: 'art-3',
    categoryId: 'advertising',
    title: 'How to promote your listing',
    slug: 'promote-listing',
    content: `# Promoting Your Business Listing

Stand out from the competition with our promotion options.

## Promotion Tiers

### Basic Boost ($29-$179)
- Appears in "Promoted" section
- Highlighted in search results
- Basic analytics

### Premium Placement
- Top of search results
- "Promoted" badge on listing
- Enhanced analytics
- Email notification to matching buyers

### Featured Listing
- Homepage featured section
- Top of all search results
- Premium badge with animation
- Full analytics dashboard
- Priority support
- Social media promotion

## Best Practices

1. **Use High-Quality Images** - Professional photos attract more attention
2. **Write Compelling Copy** - Your headline and description matter
3. **Update Regularly** - Fresh content performs better
4. **Respond Quickly** - Fast responses convert more leads

## Analytics

Track your promotion's performance:
- View count
- Click-through rate
- Inquiry rate
- Conversion rate`,
    excerpt: 'Learn about promotion options and how to maximize your listing visibility.',
    tags: ['promotion', 'advertising', 'visibility'],
    viewCount: 456,
    helpfulCount: 52,
    notHelpfulCount: 3,
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-03-01'),
    author: 'Marketing Team',
    isFeatured: false,
  },
  {
    id: 'art-4',
    categoryId: 'account',
    title: 'Enabling Two-Factor Authentication',
    slug: 'enable-2fa',
    content: `# Two-Factor Authentication (2FA)

Secure your account with an extra layer of protection.

## How to Enable 2FA

1. Go to **Profile** → **Security**
2. Click **Enable** under Two-Factor Authentication
3. Scan the QR code with your authenticator app:
   - Google Authenticator
   - Authy
   - Microsoft Authenticator
4. Enter the 6-digit verification code
5. Save your backup codes securely

## What If I Lose My Device?

Use one of your backup codes to access your account. Each code can only be used once.

## Disable 2FA

1. Go to **Profile** → **Security**
2. Click **Disable** under Two-Factor Authentication
3. Confirm your identity

## Best Practices

- Store backup codes in a secure location
- Use a password manager for authenticator backup
- Never share your 2FA codes with anyone
- Enable 2FA on all sensitive accounts`,
    excerpt: 'Step-by-step guide to enable two-factor authentication for your account.',
    tags: ['security', '2fa', 'account'],
    viewCount: 234,
    helpfulCount: 28,
    notHelpfulCount: 2,
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date('2024-02-20'),
    author: 'Security Team',
    isFeatured: false,
  },
  {
    id: 'art-5',
    categoryId: 'legal',
    title: 'Your Rights Under GDPR',
    slug: 'gdpr-rights',
    content: `# GDPR Rights and Data Protection

Under the General Data Protection Regulation (GDPR), you have specific rights regarding your personal data.

## Your Rights

### Right to Access (Article 15)
You can request a copy of all personal data we hold about you. This includes:
- Account information
- Activity history
- Saved preferences
- Communications

### Right to Rectification (Article 16)
You can request correction of inaccurate personal data.

### Right to Erasure (Article 17)
Also known as "Right to be Forgotten" - you can request deletion of your personal data.

### Right to Data Portability (Article 20)
You can receive your data in a machine-readable format.

### Right to Object (Article 21)
You can object to certain processing of your personal data.

## How to Exercise Your Rights

1. **Data Export**: Profile → Danger Zone → Export Data
2. **Data Deletion**: Profile → Danger Zone → Request Deletion
3. **Other Requests**: Contact support@globalequityexchange.com

## Response Time

We respond to all GDPR requests within 30 days.

## Legal Basis

We process your data based on:
- Contract performance
- Legal obligations
- Legitimate interests
- Your consent`,
    excerpt: 'Understanding your data protection rights under GDPR.',
    tags: ['gdpr', 'privacy', 'data', 'legal'],
    viewCount: 189,
    helpfulCount: 22,
    notHelpfulCount: 1,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-03-01'),
    author: 'Legal Team',
    isFeatured: false,
  },
];
