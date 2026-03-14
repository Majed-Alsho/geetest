'use client';

import { cn } from '@/lib/utils';
import { 
  BadgeCheck, 
  ShieldCheck, 
  FileCheck, 
  Scale, 
  Banknote,
  Clock,
  TrendingUp,
  Lock
} from 'lucide-react';

interface VerificationBadgeProps {
  type: 
    | 'financials-verified' 
    | 'revenue-verified' 
    | 'traffic-verified' 
    | 'nda-required'
    | 'due-diligence-ready'
    | 'seller-verified'
    | 'proof-of-funds'
    | 'accredited-investor'
    | 'business-age';
  value?: string;
  size?: 'sm' | 'md';
  className?: string;
}

const badgeConfig = {
  'financials-verified': {
    icon: FileCheck,
    label: 'Financials Verified',
    description: 'Financial statements independently verified',
    className: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20'
  },
  'revenue-verified': {
    icon: Banknote,
    label: 'Revenue Verified',
    description: 'Revenue verified via bank statements or accounting software',
    className: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20'
  },
  'traffic-verified': {
    icon: TrendingUp,
    label: 'Traffic Verified',
    description: 'Web traffic verified via analytics integration',
    className: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
  },
  'nda-required': {
    icon: Lock,
    label: 'NDA Required',
    description: 'Non-disclosure agreement required before detailed access',
    className: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
  },
  'due-diligence-ready': {
    icon: FileCheck,
    label: 'DD Ready',
    description: 'Due diligence documents prepared and available',
    className: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20'
  },
  'seller-verified': {
    icon: BadgeCheck,
    label: 'Seller Verified',
    description: 'Seller identity and ownership verified',
    className: 'bg-accent/10 text-accent border-accent/20'
  },
  'proof-of-funds': {
    icon: Banknote,
    label: 'Proof of Funds',
    description: 'Buyer has verified proof of funds',
    className: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20'
  },
  'accredited-investor': {
    icon: Scale,
    label: 'Accredited',
    description: 'Verified accredited investor status',
    className: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20'
  },
  'business-age': {
    icon: Clock,
    label: 'Est.',
    description: 'Years in business',
    className: 'bg-secondary text-foreground border-border'
  }
};

export function VerificationBadge({ type, value, size = 'sm', className }: VerificationBadgeProps) {
  const config = badgeConfig[type];
  const Icon = config.icon;

  return (
    <div 
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-medium",
        size === 'sm' ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm",
        config.className,
        className
      )}
      title={config.description}
    >
      <Icon className={size === 'sm' ? "w-3 h-3" : "w-4 h-4"} />
      <span>{value || config.label}</span>
    </div>
  );
}

interface VerificationStackProps {
  financialsVerified?: boolean;
  revenueVerified?: boolean;
  trafficVerified?: boolean;
  ndaRequired?: boolean;
  ddReady?: boolean;
  sellerVerified?: boolean;
  businessAge?: number;
  className?: string;
}

export function VerificationStack({
  financialsVerified,
  revenueVerified,
  trafficVerified,
  ndaRequired,
  ddReady,
  sellerVerified,
  businessAge,
  className
}: VerificationStackProps) {
  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {sellerVerified && <VerificationBadge type="seller-verified" />}
      {financialsVerified && <VerificationBadge type="financials-verified" />}
      {revenueVerified && <VerificationBadge type="revenue-verified" />}
      {trafficVerified && <VerificationBadge type="traffic-verified" />}
      {ddReady && <VerificationBadge type="due-diligence-ready" />}
      {ndaRequired && <VerificationBadge type="nda-required" />}
      {businessAge && (
        <VerificationBadge 
          type="business-age" 
          value={`Est. ${new Date().getFullYear() - businessAge}`} 
        />
      )}
    </div>
  );
}
