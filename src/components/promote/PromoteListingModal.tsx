'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Rocket, X, Check, Star, Crown, Zap, Clock, 
  TrendingUp, Eye, MousePointer, CreditCard, ChevronRight,
  Sparkles, Shield
} from 'lucide-react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useAds } from '@/contexts/AdContext';
import { useListings } from '@/contexts/ListingContext';
import { AD_PRICING, PROMOTION_PACKAGES, AdTier, AdDuration, BULK_DISCOUNTS } from '@/types/advertising';
import { formatCurrency } from '@/lib/data';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface PromoteListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedListingId?: string;
}

export function PromoteListingModal({ isOpen, onClose, preselectedListingId }: PromoteListingModalProps) {
  const { user } = useAuth();
  const { createAd } = useAds();
  const { listings, getListingById } = useListings();
  
  const [step, setStep] = useState(1);
  const [selectedListings, setSelectedListings] = useState<string[]>(
    preselectedListingId ? [preselectedListingId] : []
  );
  const [selectedTier, setSelectedTier] = useState<AdTier>('premium');
  const [selectedDuration, setSelectedDuration] = useState<AdDuration>('7_days');
  const [isProcessing, setIsProcessing] = useState(false);

  // Get user's own listings (listings they created)
  const userListings = user 
    ? listings.filter(l => l.createdBy === user.id)
    : [];

  const pricing = useMemo(() => {
    const pkg = PROMOTION_PACKAGES.find(p => p.tier === selectedTier);
    const duration = AD_PRICING.find(d => d.duration === selectedDuration);
    if (!pkg || !duration) return null;

    let baseTotal = duration.pricePerListing * pkg.priceMultiplier * selectedListings.length;
    
    const durationDiscount = (baseTotal * duration.discount) / 100;
    
    const bulkDiscountRate = selectedListings.length >= 10 ? 20 :
                             selectedListings.length >= 5 ? 15 :
                             selectedListings.length >= 3 ? 10 :
                             selectedListings.length >= 2 ? 5 : 0;
    const bulkDiscount = (baseTotal * bulkDiscountRate) / 100;
    
    const totalDiscount = durationDiscount + bulkDiscount;
    const finalPrice = baseTotal - totalDiscount;

    return {
      basePrice: duration.pricePerListing * pkg.priceMultiplier,
      baseTotal,
      durationDiscount,
      bulkDiscount,
      bulkDiscountRate,
      totalDiscount,
      finalPrice,
      days: duration.days,
    };
  }, [selectedTier, selectedDuration, selectedListings]);

  const toggleListing = (listingId: string) => {
    setSelectedListings(prev => 
      prev.includes(listingId)
        ? prev.filter(id => id !== listingId)
        : [...prev, listingId]
    );
  };

  const handlePromote = async () => {
    if (!user || selectedListings.length === 0) return;
    
    setIsProcessing(true);
    
    try {
      for (const listingId of selectedListings) {
        const listing = getListingById(listingId);
        if (listing) {
          await createAd({
            listingId,
            listingTitle: listing.title,
            tier: selectedTier,
            duration: selectedDuration,
            userId: user.id,
            userEmail: user.email,
            userName: user.name,
          });
        }
      }
      
      toast.success('Promotion submitted!', {
        description: 'Your ad is pending approval. You will be notified once it goes live.',
      });
      
      onClose();
    } catch (error) {
      toast.error('Failed to create promotion');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div 
          className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        >
          <GlassPanel className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Rocket className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h2 className="font-semibold text-lg">Promote Your Listing</h2>
                  <p className="text-sm text-muted-foreground">Get more visibility and buyers</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-secondary rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center gap-2 mb-8">
              {['Select Listings', 'Choose Plan', 'Checkout'].map((label, i) => (
                <div key={label} className="flex items-center flex-1">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                    step > i + 1 ? "bg-green-500 text-white" :
                    step === i + 1 ? "bg-accent text-accent-foreground" :
                    "bg-secondary text-muted-foreground"
                  )}>
                    {step > i + 1 ? <Check className="w-4 h-4" /> : i + 1}
                  </div>
                  <span className={cn(
                    "ml-2 text-sm hidden sm:block",
                    step === i + 1 ? "text-foreground font-medium" : "text-muted-foreground"
                  )}>
                    {label}
                  </span>
                  {i < 2 && (
                    <div className={cn(
                      "flex-1 h-0.5 mx-2",
                      step > i + 1 ? "bg-green-500" : "bg-secondary"
                    )} />
                  )}
                </div>
              ))}
            </div>

            {/* Step 1: Select Listings */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Select listings to promote</h3>
                  <span className="text-sm text-muted-foreground">
                    {selectedListings.length} selected
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto">
                  {userListings.map(listing => (
                    <div
                      key={listing.id}
                      onClick={() => toggleListing(listing.id)}
                      className={cn(
                        "p-4 rounded-xl cursor-pointer transition-all border",
                        selectedListings.includes(listing.id)
                          ? "bg-accent/10 border-accent/30"
                          : "bg-secondary/30 border-transparent hover:bg-secondary/50"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          "w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5",
                          selectedListings.includes(listing.id)
                            ? "bg-accent border-accent"
                            : "border-muted-foreground"
                        )}>
                          {selectedListings.includes(listing.id) && (
                            <Check className="w-3 h-3 text-white" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{listing.title}</p>
                          <p className="text-sm text-muted-foreground">{listing.category}</p>
                          <p className="text-sm font-semibold text-accent mt-1">
                            {formatCurrency(listing.price)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {selectedListings.length > 1 && (
                  <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20">
                    <p className="text-sm text-green-500 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Bulk discount: {selectedListings.length >= 10 ? '20%' :
                        selectedListings.length >= 5 ? '15%' :
                        selectedListings.length >= 3 ? '10%' : '5%'} off!
                    </p>
                  </div>
                )}

                <div className="flex justify-end">
                  <Button
                    onClick={() => setStep(2)}
                    disabled={selectedListings.length === 0}
                    className="btn-accent"
                  >
                    Continue <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Choose Plan */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-3">Choose promotion tier</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {PROMOTION_PACKAGES.map(pkg => (
                      <div
                        key={pkg.id}
                        onClick={() => setSelectedTier(pkg.tier)}
                        className={cn(
                          "p-4 rounded-xl cursor-pointer transition-all border relative",
                          selectedTier === pkg.tier
                            ? "bg-accent/10 border-accent/30"
                            : "bg-secondary/30 border-transparent hover:bg-secondary/50"
                        )}
                      >
                        {pkg.tier === 'featured' && (
                          <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-accent text-accent-foreground text-xs font-medium rounded-full">
                            Most Popular
                          </div>
                        )}
                        <div className="text-center">
                          <div className={cn(
                            "w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center",
                            pkg.tier === 'featured' ? "bg-amber-500/10" :
                            pkg.tier === 'premium' ? "bg-purple-500/10" : "bg-blue-500/10"
                          )}>
                            {pkg.tier === 'featured' ? (
                              <Crown className="w-6 h-6 text-amber-500" />
                            ) : pkg.tier === 'premium' ? (
                              <Star className="w-6 h-6 text-purple-500" />
                            ) : (
                              <Zap className="w-6 h-6 text-blue-500" />
                            )}
                          </div>
                          <h4 className="font-semibold">{pkg.name}</h4>
                          <p className="text-xs text-muted-foreground mt-1">{pkg.description}</p>
                        </div>
                        <ul className="mt-4 space-y-2">
                          {pkg.features.map((feature, i) => (
                            <li key={i} className="text-xs flex items-center gap-2">
                              <Check className="w-3 h-3 text-green-500 flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-3">Select duration</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {AD_PRICING.map(d => {
                      const pkg = PROMOTION_PACKAGES.find(p => p.tier === selectedTier);
                      const price = pkg ? Math.round(d.pricePerListing * pkg.priceMultiplier) : d.pricePerListing;
                      
                      return (
                        <div
                          key={d.duration}
                          onClick={() => setSelectedDuration(d.duration)}
                          className={cn(
                            "p-4 rounded-xl cursor-pointer transition-all border text-center",
                            selectedDuration === d.duration
                              ? "bg-accent/10 border-accent/30"
                              : "bg-secondary/30 border-transparent hover:bg-secondary/50"
                          )}
                        >
                          <p className="font-semibold">{d.days} days</p>
                          <p className="text-sm text-muted-foreground">${price}/listing</p>
                          {d.discount > 0 && (
                            <p className="text-xs text-green-500 mt-1">Save {d.discount}%</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button onClick={() => setStep(1)} variant="outline">Back</Button>
                  <Button onClick={() => setStep(3)} className="btn-accent">
                    Continue <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Checkout */}
            {step === 3 && pricing && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">Order Summary</h3>
                    <div className="p-4 rounded-xl bg-secondary/30 space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Listings</span>
                        <span>{selectedListings.length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Tier</span>
                        <span className="capitalize">{selectedTier}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Duration</span>
                        <span>{pricing.days} days</span>
                      </div>
                      <div className="border-t border-border pt-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Base Price</span>
                          <span>${pricing.baseTotal.toFixed(2)}</span>
                        </div>
                        {pricing.durationDiscount > 0 && (
                          <div className="flex justify-between text-sm text-green-500">
                            <span>Duration Discount</span>
                            <span>-${pricing.durationDiscount.toFixed(2)}</span>
                          </div>
                        )}
                        {pricing.bulkDiscount > 0 && (
                          <div className="flex justify-between text-sm text-green-500">
                            <span>Bulk Discount ({pricing.bulkDiscountRate}%)</span>
                            <span>-${pricing.bulkDiscount.toFixed(2)}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex justify-between font-semibold text-lg border-t border-border pt-3">
                        <span>Total</span>
                        <span className="text-accent">${pricing.finalPrice.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-accent/5 border border-accent/20">
                      <p className="text-sm flex items-start gap-2">
                        <Shield className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                        <span>Your ad will be reviewed within 24 hours. Full refund if rejected.</span>
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium">Payment (Demo)</h3>
                    <div className="p-4 rounded-xl bg-secondary/30">
                      <p className="text-sm text-muted-foreground">
                        This is a demo. In production, Stripe would be integrated here.
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-xl bg-secondary/30 text-center">
                        <Eye className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                        <p className="text-lg font-semibold">~500+</p>
                        <p className="text-xs text-muted-foreground">Est. Impressions</p>
                      </div>
                      <div className="p-3 rounded-xl bg-secondary/30 text-center">
                        <MousePointer className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                        <p className="text-lg font-semibold">~50+</p>
                        <p className="text-xs text-muted-foreground">Est. Clicks</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-4 border-t border-border">
                  <Button onClick={() => setStep(2)} variant="outline">Back</Button>
                  <Button onClick={handlePromote} disabled={isProcessing} className="btn-accent">
                    {isProcessing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Rocket className="w-4 h-4" />
                        Promote Now - ${pricing.finalPrice.toFixed(2)}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </GlassPanel>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
