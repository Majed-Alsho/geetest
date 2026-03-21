'use client';

import { motion } from 'framer-motion';
import { 
  MapPin, 
  Users, 
  TrendingUp, 
  DollarSign, 
  Building2,
  ArrowRight,
  Lock,
  Eye,
  Clock,
  Scale,
  Star,
  FileCheck,
  Rocket,
  Crown,
  Zap
} from 'lucide-react';
import Link from 'next/link';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Listing, formatCurrency, getListingAge } from '@/lib/data';
import { useAuth } from '@/contexts/AuthContext';
import { useCompare } from '@/contexts/CompareContext';
import { useAds } from '@/contexts/AdContext';
import { AdTier } from '@/types/advertising';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ListingCardProps {
  listing: Listing;
  index?: number;
  isPromoted?: boolean;
  adId?: string;
  adTier?: AdTier;
  onPromoteClick?: (listingId: string) => void;
}

const TIER_ICONS = {
  basic: Zap,
  premium: Star,
  featured: Crown,
};

const TIER_COLORS = {
  basic: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
  premium: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
  featured: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
};

export function ListingCard({ 
  listing, 
  index = 0, 
  isPromoted = false, 
  adId, 
  adTier = 'basic',
  onPromoteClick 
}: ListingCardProps) {
  const { isAuthenticated, user } = useAuth();
  const { addToCompare, removeFromCompare, isInCompare, canAddMore } = useCompare();
  const { incrementClick, getActiveAdsForListing } = useAds();

  const inCompare = isInCompare(listing.id);
  const TierIcon = TIER_ICONS[adTier];

  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (inCompare) {
      removeFromCompare(listing.id);
      toast.success('Removed from comparison');
    } else if (canAddMore) {
      addToCompare(listing);
      toast.success('Added to comparison');
    } else {
      toast.error('Maximum 4 listings can be compared');
    }
  };

  const handlePromoteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onPromoteClick) {
      onPromoteClick(listing.id);
    }
  };

  const handleClick = () => {
    // Track click on promoted listing
    if (isPromoted && adId) {
      incrementClick(adId);
    }
  };

  // Check if this listing already has an active ad
  const existingAd = getActiveAdsForListing(listing.id);
  
  // Check if current user owns this listing
  const isOwnListing = user && listing.createdBy === user.id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: 'easeOut' }}
    >
      <Link 
        href={`/listings/${listing.id}`}
        onClick={handleClick}
        className="block"
      >
        <GlassPanel hover className={cn(
          "h-full p-6 group relative overflow-hidden",
          isPromoted && "ring-2 ring-amber-500/30"
        )}>
          {/* Compare button */}
          <button
            onClick={handleCompareClick}
            className={cn(
              "absolute top-4 right-4 z-10 p-2 rounded-lg transition-colors",
              inCompare 
                ? "bg-accent text-accent-foreground" 
                : "bg-secondary/80 hover:bg-secondary text-muted-foreground hover:text-foreground"
            )}
            title={inCompare ? 'Remove from compare' : 'Add to compare'}
          >
            <Scale className="w-4 h-4" />
          </button>

          {/* Promoted Badge */}
          {isPromoted && (
            <div className={cn(
              "absolute top-4 left-4 z-10 inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border",
              TIER_COLORS[adTier]
            )}>
              <TierIcon className="w-3 h-3" />
              Promoted
            </div>
          )}

          {/* Featured Badge (for non-promoted featured listings) */}
          {!isPromoted && listing.featured && (
            <div className="absolute top-4 left-4 z-10 inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-accent text-accent-foreground">
              <Star className="w-3 h-3" />
              Featured
            </div>
          )}

          {/* Promote Button (only for listing owner) */}
          {onPromoteClick && isOwnListing && !isPromoted && !existingAd && (
            <button
              onClick={handlePromoteClick}
              className="absolute bottom-4 right-4 z-10 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 text-xs font-medium transition-colors flex items-center gap-1"
              title="Promote this listing"
            >
              <Rocket className="w-3 h-3" />
              Promote
            </button>
          )}

          {/* Header */}
          <div className="flex items-start justify-between mb-4 pr-10">
            <div className={cn("flex items-center gap-3", (listing.featured || isPromoted) && "pl-0 mt-6")}>
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-accent" />
              </div>
              <div>
                <span className="text-xs text-muted-foreground uppercase tracking-wide">
                  {listing.category}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {listing.verification?.ddReady && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-accent/10 text-accent border border-accent/20">
                  <FileCheck className="w-3 h-3" />
                  DD Ready
                </span>
              )}
              {listing.verified && <StatusBadge variant="verified" />}
            </div>
          </div>
          <h3 className={cn(
            "font-semibold text-lg mb-2 group-hover:text-accent transition-colors",
            !isAuthenticated && "blur-sm select-none"
          )}>
            {listing.title}
          </h3>
          <div className={cn(
            "flex items-center gap-1.5 text-sm text-muted-foreground mb-4",
            !isAuthenticated && "blur-sm select-none"
          )}>
            <MapPin className="w-4 h-4" />
            <span>{listing.location}, {listing.region}</span>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {/* Revenue - Always visible */}
            <div className="bg-secondary/50 rounded-lg p-3">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                <DollarSign className="w-3.5 h-3.5" />
                Revenue
              </div>
              <span className="font-semibold">{formatCurrency(listing.revenue)}/yr</span>
            </div>
            
            {/* Growth - Blurred if not authenticated */}
            <div className="bg-secondary/50 rounded-lg p-3">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                <TrendingUp className="w-3.5 h-3.5" />
                Growth
              </div>
              <span className={cn(
                "font-semibold",
                listing.growthYoY >= 20 && isAuthenticated && "text-green-600 dark:text-green-400",
                !isAuthenticated && "blur-sm select-none"
              )}>
                +{listing.growthYoY}% YoY
              </span>
            </div>
            
            {/* Employees - Blurred if not authenticated */}
            <div className="bg-secondary/50 rounded-lg p-3">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                <Users className="w-3.5 h-3.5" />
                Employees
              </div>
              <span className={cn("font-semibold", !isAuthenticated && "blur-sm select-none")}>
                {listing.employees}
              </span>
            </div>
            
            {/* EBITDA - Blurred if not authenticated */}
            <div className="bg-secondary/50 rounded-lg p-3">
              <div className="text-xs text-muted-foreground mb-1">EBITDA Margin</div>
              <span className={cn("font-semibold", !isAuthenticated && "blur-sm select-none")}>
                {listing.ebitdaMargin}%
              </span>
            </div>
          </div>

          {/* Analytics & Age */}
          <div className="flex items-center gap-3 mb-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{getListingAge(listing.createdAt)}</span>
            </div>
            {listing.analytics && (
              <div className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                <span>{listing.analytics.views.toLocaleString('en-US')} views</span>
              </div>
            )}
          </div>

          {/* Price & CTA */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div>
              <span className="text-xs text-muted-foreground">Asking Price</span>
              <p className={cn(
                "font-semibold text-xl text-accent",
                !isAuthenticated && "blur-sm select-none"
              )}>
                {formatCurrency(listing.price)}
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground group-hover:text-accent transition-colors">
              View Details
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Sign in overlay for non-authenticated users */}
          {!isAuthenticated && (
            <div className="absolute inset-0 flex items-end justify-center pb-20 pointer-events-none">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/90 text-primary-foreground text-xs font-medium pointer-events-auto">
                <Lock className="w-3.5 h-3.5" />
                Sign in to view details
              </div>
            </div>
          )}
        </GlassPanel>
      </Link>
    </motion.div>
  );
}
