'use client';

import { useState } from 'react';
import {
  Share2, 
  Flag, 
  Bookmark, 
  BookmarkCheck,
  Eye,
  Clock,
  MessageSquare,
  Scale,
  Check,
  Copy
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCompare } from '@/contexts/CompareContext';
import { Listing, getListingAge } from '@/lib/data';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ListingActionsProps {
  listing: Listing;
  showAnalytics?: boolean;
}

export function ListingActions({ listing, showAnalytics = false }: ListingActionsProps) {
  const { isAuthenticated, isAdmin, saveListing, unsaveListing, isListingSaved } = useAuth();
  const { addToCompare, removeFromCompare, isInCompare, canAddMore } = useCompare();
  const [reportOpen, setReportOpen] = useState(false);

  const isSaved = isListingSaved(listing.id);
  const inCompare = isInCompare(listing.id);

  const handleSave = () => {
    if (!isAuthenticated) {
      toast.error('Please log in to save listings');
      return;
    }
    if (isSaved) {
      unsaveListing(listing.id);
      toast.success('Removed from saved listings');
    } else {
      saveListing(listing.id);
      toast.success('Saved to your listings');
    }
  };

  const handleCompare = () => {
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

  const handleShare = async () => {
    const url = `${window.location.origin}/marketplace/${listing.id}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: listing.title,
          text: `Check out this business opportunity: ${listing.title}`,
          url,
        });
      } catch (err) {
        // User cancelled or share failed, fall back to copy
        copyToClipboard(url);
      }
    } else {
      copyToClipboard(url);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Link copied to clipboard!');
  };

  const handleReport = (reason: string) => {
    // In production, this would send to backend
    console.log('Report submitted:', { listingId: listing.id, reason });
    toast.success('Report submitted. Our team will review this listing.');
    setReportOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleSave}
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors",
            isSaved 
              ? "bg-accent/10 text-accent border border-accent/20" 
              : "bg-secondary hover:bg-secondary/80"
          )}
        >
          {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
          {isSaved ? 'Saved' : 'Save'}
        </button>

        <button
          onClick={handleCompare}
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors",
            inCompare 
              ? "bg-accent/10 text-accent border border-accent/20" 
              : "bg-secondary hover:bg-secondary/80"
          )}
        >
          <Scale className="w-4 h-4" />
          {inCompare ? 'In Compare' : 'Compare'}
        </button>

        <button
          onClick={handleShare}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm bg-secondary hover:bg-secondary/80 transition-colors"
        >
          <Share2 className="w-4 h-4" />
          Share
        </button>

        <Popover open={reportOpen} onOpenChange={setReportOpen}>
          <PopoverTrigger asChild>
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm bg-secondary hover:bg-secondary/80 transition-colors text-muted-foreground hover:text-destructive">
              <Flag className="w-4 h-4" />
              Report
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-64" align="end">
            <div className="space-y-2">
              <p className="font-medium text-sm">Report this listing</p>
              <div className="space-y-1">
                {[
                  'Misleading information',
                  'Suspicious activity',
                  'Duplicate listing',
                  'Inappropriate content',
                  'Other'
                ].map((reason) => (
                  <button
                    key={reason}
                    onClick={() => handleReport(reason)}
                    className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-secondary transition-colors"
                  >
                    {reason}
                  </button>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Listing Metadata */}
      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <Clock className="w-4 h-4" />
          <span>Listed {getListingAge(listing.createdAt)}</span>
        </div>
        
        {showAnalytics && listing.analytics && (
          <>
            <div className="flex items-center gap-1.5">
              <Eye className="w-4 h-4" />
              <span>{listing.analytics.views.toLocaleString()} views</span>
            </div>
            {isAdmin && (
              <>
                <div className="flex items-center gap-1.5">
                  <Bookmark className="w-4 h-4" />
                  <span>{listing.analytics.saves} saves</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4" />
                  <span>{listing.analytics.inquiries} inquiries</span>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
