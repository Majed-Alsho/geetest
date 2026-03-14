'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Rocket, Clock, AlertTriangle, CheckCircle, XCircle, 
  CreditCard, MoreVertical, Play, Pause, Trash2,
  TrendingUp, Eye, MousePointer, Calendar, RefreshCw
} from 'lucide-react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useAds } from '@/contexts/AdContext';
import { 
  Advertisement, 
  AdDuration, 
  AD_PRICING, 
  canExtendPromotion, 
  getTimeRemaining,
  isPaymentValid,
  EXTEND_WINDOW_HOURS
} from '@/types/advertising';
import { formatCurrency } from '@/lib/data';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface UserPromotionsProps {
  onPromoteNew?: () => void;
}

const STATUS_CONFIG: Record<string, { color: string; bg: string; icon: typeof Clock; label: string }> = {
  pending: { color: 'text-amber-500', bg: 'bg-amber-500/10', icon: Clock, label: 'Pending Approval' },
  approved_pending_payment: { color: 'text-blue-500', bg: 'bg-blue-500/10', icon: CreditCard, label: 'Awaiting Payment' },
  active: { color: 'text-green-500', bg: 'bg-green-500/10', icon: CheckCircle, label: 'Active' },
  paused: { color: 'text-yellow-500', bg: 'bg-yellow-500/10', icon: Pause, label: 'Paused' },
  expired: { color: 'text-gray-500', bg: 'bg-gray-500/10', icon: Clock, label: 'Expired' },
  rejected: { color: 'text-red-500', bg: 'bg-red-500/10', icon: XCircle, label: 'Rejected' },
  cancelled: { color: 'text-gray-500', bg: 'bg-gray-500/10', icon: XCircle, label: 'Cancelled' },
};

export function UserPromotions({ onPromoteNew }: UserPromotionsProps) {
  const { user } = useAuth();
  const { getAdsByUser, payForAd, pauseAd, resumeAd, deleteAd, extendAd } = useAds();
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [extendAdId, setExtendAdId] = useState<string | null>(null);
  const [extendDuration, setExtendDuration] = useState<AdDuration>('7_days');

  const userAds = user ? getAdsByUser(user.id) : [];

  const handlePayNow = async (ad: Advertisement) => {
    if (!isPaymentValid(ad)) {
      toast.error('Payment deadline expired', {
        description: 'This promotion request has expired. Please submit a new request.',
      });
      return;
    }

    setProcessingId(ad.id);
    try {
      const success = await payForAd(ad.id);
      if (success) {
        toast.success('Payment successful!', {
          description: 'Your promotion is now active!',
        });
      } else {
        toast.error('Payment failed');
      }
    } catch (error) {
      toast.error('Payment failed');
    } finally {
      setProcessingId(null);
    }
  };

  const handlePause = (ad: Advertisement) => {
    pauseAd(ad.id);
    toast.success('Promotion paused');
  };

  const handleResume = (ad: Advertisement) => {
    resumeAd(ad.id);
    toast.success('Promotion resumed');
  };

  const handleDelete = (ad: Advertisement) => {
    if (confirm(`Are you sure you want to delete this promotion request?`)) {
      deleteAd(ad.id);
      toast.success('Promotion deleted');
    }
  };

  const handleExtend = async (ad: Advertisement) => {
    setProcessingId(ad.id);
    try {
      const success = await extendAd(ad.id, extendDuration);
      if (success) {
        toast.success('Promotion extended!', {
          description: `Extended by ${AD_PRICING.find(p => p.duration === extendDuration)?.days} days`,
        });
        setExtendAdId(null);
      } else {
        toast.error('Failed to extend promotion');
      }
    } catch (error) {
      toast.error('Failed to extend promotion');
    } finally {
      setProcessingId(null);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <Rocket className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">Sign in to manage promotions</h3>
      </div>
    );
  }

  if (userAds.length === 0) {
    return (
      <div className="text-center py-12">
        <Rocket className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">No promotions yet</h3>
        <p className="text-muted-foreground mb-6">
          Promote your listings to get more visibility and attract buyers.
        </p>
        {onPromoteNew && (
          <Button onClick={onPromoteNew} className="btn-accent">
            <Rocket className="w-4 h-4 mr-2" />
            Promote a Listing
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {userAds.map((ad, index) => {
        const config = STATUS_CONFIG[ad.status] || STATUS_CONFIG.pending;
        const StatusIcon = config.icon;
        const timeRemaining = ad.endDate ? getTimeRemaining(ad.endDate) : null;
        const canExtend = canExtendPromotion(ad);
        const paymentValid = ad.status === 'approved_pending_payment' && isPaymentValid(ad);

        return (
          <motion.div
            key={ad.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <GlassPanel className="p-4">
              <div className="flex items-start gap-4">
                {/* Status Icon */}
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
                  config.bg
                )}>
                  <StatusIcon className={cn("w-6 h-6", config.color)} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h4 className="font-semibold truncate">{ad.listingTitle}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-xs font-medium",
                          config.bg, config.color
                        )}>
                          {config.label}
                        </span>
                        <span className="text-xs text-muted-foreground capitalize">
                          {ad.tier} tier
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-accent">${ad.pricePaid}</p>
                      <p className="text-xs text-muted-foreground">{ad.duration.replace('_', ' ')}</p>
                    </div>
                  </div>

                  {/* Payment Deadline Warning */}
                  {ad.status === 'approved_pending_payment' && ad.paymentDeadline && (
                    <div className={cn(
                      "p-3 rounded-lg mb-3",
                      paymentValid ? "bg-blue-500/10 border border-blue-500/20" : "bg-red-500/10 border border-red-500/20"
                    )}>
                      <div className="flex items-center gap-2">
                        {paymentValid ? (
                          <>
                            <Clock className="w-4 h-4 text-blue-500" />
                            <span className="text-sm text-blue-500">
                              Payment deadline: {new Date(ad.paymentDeadline).toLocaleString()}
                            </span>
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="w-4 h-4 text-red-500" />
                            <span className="text-sm text-red-500">
                              Payment deadline expired
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Time Remaining for Active Promotions */}
                  {ad.status === 'active' && timeRemaining && timeRemaining.total > 0 && (
                    <div className={cn(
                      "p-3 rounded-lg mb-3",
                      canExtend ? "bg-amber-500/10 border border-amber-500/20" : "bg-secondary/30"
                    )}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">
                            {timeRemaining.days > 0 && `${timeRemaining.days}d `}
                            {timeRemaining.hours}h {timeRemaining.minutes}m remaining
                          </span>
                        </div>
                        {canExtend && (
                          <span className="text-xs text-amber-500 font-medium">
                            Extend now!
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Stats for Active/Paused */}
                  {(ad.status === 'active' || ad.status === 'paused' || ad.status === 'expired') && (
                    <div className="grid grid-cols-3 gap-3 mb-3">
                      <div className="p-2 rounded-lg bg-secondary/30 text-center">
                        <Eye className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                        <p className="font-semibold">{ad.impressions}</p>
                        <p className="text-xs text-muted-foreground">Views</p>
                      </div>
                      <div className="p-2 rounded-lg bg-secondary/30 text-center">
                        <MousePointer className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                        <p className="font-semibold">{ad.clicks}</p>
                        <p className="text-xs text-muted-foreground">Clicks</p>
                      </div>
                      <div className="p-2 rounded-lg bg-secondary/30 text-center">
                        <TrendingUp className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                        <p className="font-semibold">
                          {ad.impressions > 0 ? ((ad.clicks / ad.impressions) * 100).toFixed(1) : 0}%
                        </p>
                        <p className="text-xs text-muted-foreground">CTR</p>
                      </div>
                    </div>
                  )}

                  {/* Rejection Reason */}
                  {ad.status === 'rejected' && ad.rejectionReason && (
                    <div className="p-3 rounded-lg mb-3 bg-red-500/10 border border-red-500/20">
                      <p className="text-sm text-red-500">
                        <strong>Reason:</strong> {ad.rejectionReason}
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2">
                    {/* Pay Now Button */}
                    {paymentValid && (
                      <Button
                        onClick={() => handlePayNow(ad)}
                        disabled={processingId === ad.id}
                        className="btn-accent"
                      >
                        {processingId === ad.id ? (
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>
                            <CreditCard className="w-4 h-4 mr-2" />
                            Pay ${ad.pricePaid}
                          </>
                        )}
                      </Button>
                    )}

                    {/* Pause/Resume */}
                    {ad.status === 'active' && (
                      <Button
                        onClick={() => handlePause(ad)}
                        variant="outline"
                        size="sm"
                      >
                        <Pause className="w-4 h-4 mr-1" />
                        Pause
                      </Button>
                    )}
                    {ad.status === 'paused' && (
                      <Button
                        onClick={() => handleResume(ad)}
                        variant="outline"
                        size="sm"
                      >
                        <Play className="w-4 h-4 mr-1" />
                        Resume
                      </Button>
                    )}

                    {/* Extend */}
                    {canExtend && (
                      <Button
                        onClick={() => setExtendAdId(ad.id)}
                        variant="outline"
                        size="sm"
                        className="text-amber-500 border-amber-500/20 hover:bg-amber-500/10"
                      >
                        <RefreshCw className="w-4 h-4 mr-1" />
                        Extend
                      </Button>
                    )}

                    {/* Delete */}
                    {(ad.status === 'pending' || ad.status === 'rejected' || ad.status === 'expired' || ad.status === 'cancelled') && (
                      <Button
                        onClick={() => handleDelete(ad)}
                        variant="outline"
                        size="sm"
                        className="text-destructive border-destructive/20 hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Extend Modal */}
              {extendAdId === ad.id && canExtend && (
                <div className="mt-4 p-4 rounded-xl bg-secondary/30 border border-border">
                  <h5 className="font-medium mb-3">Extend Promotion</h5>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                    {AD_PRICING.map(d => (
                      <button
                        key={d.duration}
                        onClick={() => setExtendDuration(d.duration)}
                        className={cn(
                          "p-3 rounded-lg text-center transition-all border",
                          extendDuration === d.duration
                            ? "bg-accent/10 border-accent/30"
                            : "bg-secondary/30 border-transparent hover:bg-secondary/50"
                        )}
                      >
                        <p className="font-semibold">{d.days} days</p>
                        <p className="text-sm text-muted-foreground">${d.pricePerListing}</p>
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setExtendAdId(null)}
                      variant="outline"
                      size="sm"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => handleExtend(ad)}
                      disabled={processingId === ad.id}
                      size="sm"
                      className="btn-accent"
                    >
                      {processingId === ad.id ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Extend Now
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </GlassPanel>
          </motion.div>
        );
      })}

      {/* Promote New Button */}
      {onPromoteNew && (
        <div className="text-center pt-4">
          <Button onClick={onPromoteNew} variant="outline">
            <Rocket className="w-4 h-4 mr-2" />
            Promote Another Listing
          </Button>
        </div>
      )}
    </div>
  );
}
