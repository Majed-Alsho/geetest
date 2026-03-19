'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Users, 
  TrendingUp, 
  DollarSign, 
  Building2,
  ArrowLeft,
  Lock,
  FileText,
  Send,
  Check,
  Edit,
  Star,
  Clock,
  Loader2
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

import { GlassPanel } from '@/components/ui/GlassPanel';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Modal } from '@/components/ui/Modal';
import { LeadForm } from '@/components/forms/LeadForm';
import { AuthGate } from '@/components/auth/AuthGate';
import { ListingActions } from '@/components/marketplace/ListingActions';
import { CompareBar } from '@/components/marketplace/CompareBar';
import { VerificationStack } from '@/components/trust/VerificationBadges';
import { DueDiligenceStatus, VerificationScore } from '@/components/trust/EscrowBanner';
import { formatCurrency, FEATURED_MONTHLY_PRICE } from '@/lib/data';
import { useAuth } from '@/contexts/AuthContext';
import { useApiListing } from '@/hooks/useApi';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function ListingDetail() {
  const params = useParams();
  const router = useRouter();
  const listingId = params.id as string;
  const { user, canEditListings, isAuthenticated } = useAuth();
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [loiOpen, setLoiOpen] = useState(false);
  
  // Fetch listing from API
  const { data: listing, isLoading, error } = useApiListing(listingId);

  // Check if current user is the creator of this listing
  const isCreator = user && listing?.createdBy === user.id;
  const canEdit = isCreator || canEditListings;

  // Loading state
  if (isLoading) {
    return (
      <div className="section-padding container-wide">
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
        </div>
      </div>
    );
  }

  // Error or not found state
  if (error || !listing) {
    return (
      <div className="section-padding container-wide text-center">
        <h1 className="text-3xl font-semibold mb-4 tracking-tight">Listing Not Found</h1>
        <p className="text-muted-foreground mb-6">This opportunity may no longer be available.</p>
        <button onClick={() => router.push('/marketplace')} className="btn-primary">
          <ArrowLeft className="w-5 h-5" />
          Back to Marketplace
        </button>
      </div>
    );
  }

  const stats = [
    { label: 'Annual Revenue', value: formatCurrency(listing.revenue), icon: DollarSign },
    { label: 'YoY Growth', value: `+${listing.growthYoY}%`, icon: TrendingUp },
    { label: 'Employees', value: listing.employees.toString(), icon: Users },
    { label: 'Asking Price', value: formatCurrency(listing.price), icon: Building2, highlight: true },
    { label: 'EBITDA Margin', value: `${listing.ebitdaMargin}%`, icon: TrendingUp }
  ];

  const financials = [
    { label: 'Annual Revenue', value: formatCurrency(listing.revenue) },
    { label: 'EBITDA Margin', value: `${listing.ebitdaMargin}%` },
    { label: 'Year-over-Year Growth', value: `+${listing.growthYoY}%` },
    { label: 'Employee Count', value: listing.employees.toString() },
    { label: 'Asking Price', value: formatCurrency(listing.price) },
    { label: 'Revenue Multiple', value: `${(listing.price / listing.revenue).toFixed(1)}x` },
    ...(listing.netProfit ? [{ label: 'Net Profit', value: formatCurrency(listing.netProfit) }] : []),
    ...(listing.grossMargin ? [{ label: 'Gross Margin', value: `${listing.grossMargin}%` }] : []),
    ...(listing.customerRetention ? [{ label: 'Customer Retention', value: `${listing.customerRetention}%` }] : []),
    ...(listing.marketPotential ? [{ label: 'Market Potential', value: listing.marketPotential }] : []),
  ];

  return (
    <>
      <div className="section-padding pb-24">
        <div className="container-wide">
          {/* Back Link & Edit Button */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8 flex items-center justify-between"
          >
            <button 
              onClick={() => router.push('/marketplace')}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Marketplace
            </button>
            
            <div className="flex items-center gap-2">
              {/* Upgrade to Featured - Only for creators of non-featured listings */}
              {isCreator && !listing.featured && (
                <button 
                  onClick={() => {
                    toast.success('Redirecting to payment...', {
                      description: `Subscribe to Featured for €${FEATURED_MONTHLY_PRICE}/month`,
                    });
                    // In production, redirect to Stripe checkout for subscription
                  }}
                  className="btn-accent"
                >
                  <Star className="w-4 h-4" />
                  Upgrade to Featured (€{FEATURED_MONTHLY_PRICE}/mo)
                </button>
              )}
              
              {canEdit && (
                <button className="btn-secondary">
                  <Edit className="w-4 h-4" />
                  Edit Listing
                </button>
              )}
            </div>
          </motion.div>

          {/* Public Header - Always visible */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <GlassPanel className="p-6 md:p-8">
              <div className="flex flex-wrap items-start gap-3 mb-4">
                {listing.verified && <StatusBadge variant="verified" />}
                <StatusBadge variant="confidential" />
                {listing.featured && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent">
                    ⭐ Featured
                  </span>
                )}
              </div>

              {/* Title - Blur for non-authenticated users */}
              <h1 className={cn(
                "text-2xl md:text-3xl lg:text-4xl font-semibold mb-3 tracking-tight",
                !isAuthenticated && "blur-sm select-none"
              )}>
                {listing.title}
              </h1>

              {/* Location - Blur for non-authenticated users */}
              <div className={cn(
                "flex items-center gap-2 text-muted-foreground mb-4",
                !isAuthenticated && "blur-sm select-none"
              )}>
                <MapPin className="w-5 h-5" />
                <span>{listing.location}, {listing.region}</span>
                <span className="mx-2">•</span>
                <span>{listing.category}</span>
                {listing.verification?.businessEstablished && (
                  <>
                    <span className="mx-2">•</span>
                    <Clock className="w-4 h-4" />
                    <span>Est. {listing.verification.businessEstablished}</span>
                  </>
                )}
              </div>

              {/* Verification Badges */}
              {listing.verification && (
                <div className="mb-6">
                  <VerificationStack
                    financialsVerified={listing.verification.financialsVerified}
                    revenueVerified={listing.verification.revenueVerified}
                    trafficVerified={listing.verification.trafficVerified}
                    sellerVerified={listing.verification.sellerVerified}
                    ddReady={listing.verification.ddReady}
                    ndaRequired={listing.verification.ndaRequired}
                  />
                </div>
              )}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                <div className="p-4 rounded-xl bg-secondary/50">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                    <Building2 className="w-3.5 h-3.5" />
                    Category
                  </div>
                  <span className="font-semibold">{listing.category}</span>
                </div>
                <div className="p-4 rounded-xl bg-secondary/50">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                    <MapPin className="w-3.5 h-3.5" />
                    Region
                  </div>
                  <span className="font-semibold">{listing.region}</span>
                </div>
                <div className="p-4 rounded-xl bg-secondary/50">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                    <Users className="w-3.5 h-3.5" />
                    Size
                  </div>
                  <span className="font-semibold">{listing.employees}+ Employees</span>
                </div>
              </div>

              {/* Listing Actions */}
              <ListingActions listing={listing} showAnalytics />
            </GlassPanel>
          </motion.div>

          {/* Auth-gated content */}
          <AuthGate message="View detailed financial information, projections, and contact the seller">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Full Stats */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <GlassPanel className="p-6 md:p-8">
                    <h2 className="text-xl font-semibold mb-4">Key Metrics</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                      {stats.map((stat) => (
                        <div 
                          key={stat.label}
                          className={`p-4 rounded-xl ${stat.highlight ? 'bg-accent/10' : 'bg-secondary/50'}`}
                        >
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                            <stat.icon className="w-3.5 h-3.5" />
                            {stat.label}
                          </div>
                          <span className={`font-semibold text-lg ${stat.highlight ? 'text-accent' : ''}`}>
                            {stat.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </GlassPanel>
                </motion.div>

                {/* Overview */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <GlassPanel className="p-6 md:p-8">
                    <h2 className="text-xl font-semibold mb-4">Overview</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      {listing.description}
                    </p>
                  </GlassPanel>
                </motion.div>

                {/* Highlights */}
                {listing.highlights && listing.highlights.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <GlassPanel className="p-6 md:p-8">
                      <h2 className="text-xl font-semibold mb-4">Key Highlights</h2>
                      <ul className="space-y-3">
                        {listing.highlights.map((highlight, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <Check className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                            <span className="text-muted-foreground">{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </GlassPanel>
                  </motion.div>
                )}

                {/* Financial Snapshot */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <GlassPanel className="p-6 md:p-8">
                    <h2 className="text-xl font-semibold mb-4">Financial Snapshot</h2>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <tbody>
                          {financials.map((item, index) => (
                            <tr key={item.label} className={index !== financials.length - 1 ? 'border-b border-border' : ''}>
                              <td className="py-3 text-muted-foreground">{item.label}</td>
                              <td className="py-3 text-right font-semibold">{item.value}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </GlassPanel>
                </motion.div>

                {/* Mini Chart */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <GlassPanel className="p-6 md:p-8">
                    <h2 className="text-xl font-semibold mb-4">Revenue Projection</h2>
                    <div className="relative">
                      <svg 
                        viewBox="0 0 400 150" 
                        className="w-full h-48"
                        preserveAspectRatio="none"
                      >
                        <defs>
                          <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="hsl(142 76% 36%)" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="hsl(142 76% 36%)" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        
                        {/* Grid */}
                        <g stroke="currentColor" strokeOpacity="0.1" strokeWidth="1">
                          <line x1="40" y1="30" x2="380" y2="30" />
                          <line x1="40" y1="60" x2="380" y2="60" />
                          <line x1="40" y1="90" x2="380" y2="90" />
                          <line x1="40" y1="120" x2="380" y2="120" />
                        </g>

                        {/* Area */}
                        <motion.path
                          d="M 40 110 L 100 95 L 160 100 L 220 80 L 280 65 L 340 45 L 380 30 L 380 130 L 40 130 Z"
                          fill="url(#chartGradient)"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.8, delay: 0.3 }}
                        />

                        {/* Line */}
                        <motion.path
                          d="M 40 110 L 100 95 L 160 100 L 220 80 L 280 65 L 340 45 L 380 30"
                          fill="none"
                          stroke="hsl(142 76% 36%)"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 1.2, ease: 'easeOut' }}
                        />

                        {/* End point */}
                        <motion.circle
                          cx="380"
                          cy="30"
                          r="6"
                          fill="hsl(142 76% 36%)"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.3, delay: 1 }}
                        />
                      </svg>

                      <div className="flex justify-between text-xs text-muted-foreground mt-2 px-4">
                        <span>2021</span>
                        <span>2022</span>
                        <span>2023</span>
                        <span>2024</span>
                        <span>2025 (Proj.)</span>
                        <span>2026 (Proj.)</span>
                      </div>
                    </div>
                  </GlassPanel>
                </motion.div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="sticky top-28 space-y-6"
                >
                  {/* Verification Score */}
                  {listing.verification && (
                    <GlassPanel className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <VerificationScore score={listing.verification.verificationScore} />
                      </div>
                      <DueDiligenceStatus
                        documentsReady={listing.verification.ddReady}
                        financialsVerified={listing.verification.financialsVerified}
                        legalReviewed={listing.verification.sellerVerified}
                      />
                    </GlassPanel>
                  )}

                  {/* CTA Card */}
                  <GlassPanel className="p-6">
                    <div className="mb-6">
                      <span className="text-sm text-muted-foreground">Asking Price</span>
                      <p className="text-3xl font-semibold text-accent">
                        {formatCurrency(listing.price)}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <button 
                        onClick={() => setInquiryOpen(true)}
                        className="w-full btn-accent justify-center"
                      >
                        <Send className="w-5 h-5" />
                        Submit Inquiry
                      </button>
                      <button 
                        onClick={() => setLoiOpen(true)}
                        className="w-full btn-secondary justify-center"
                      >
                        <FileText className="w-5 h-5" />
                        Submit LOI
                      </button>
                    </div>
                  </GlassPanel>

                  {/* Confidentiality Notice */}
                  <GlassPanel className="p-6">
                    <div className="flex items-start gap-3">
                      <Lock className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold mb-1">Confidential Listing</h4>
                        <p className="text-sm text-muted-foreground">
                          Seller identity remains confidential. All inquiries are reviewed by our team before being forwarded.
                        </p>
                      </div>
                    </div>
                  </GlassPanel>

                  {/* Seller Info */}
                  <GlassPanel className="p-6">
                    <h4 className="font-semibold mb-4">Seller Information</h4>
                    <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-xl">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Confidential Seller</p>
                        <p className="text-sm text-muted-foreground">Identity protected</p>
                      </div>
                    </div>
                  </GlassPanel>
                </motion.div>
              </div>
            </div>

            {/* Mobile Sticky CTA */}
            <div className="fixed bottom-0 left-0 right-0 lg:hidden p-4 bg-background/95 backdrop-blur border-t border-border z-40">
              <div className="flex gap-3">
                <button 
                  onClick={() => setInquiryOpen(true)}
                  className="flex-1 btn-accent justify-center py-3"
                >
                  <Send className="w-5 h-5" />
                  Inquiry
                </button>
                <button 
                  onClick={() => setLoiOpen(true)}
                  className="flex-1 btn-secondary justify-center py-3"
                >
                  <FileText className="w-5 h-5" />
                  LOI
                </button>
              </div>
            </div>
          </AuthGate>
        </div>
      </div>

      {/* Compare Bar */}
      <CompareBar />

      {/* Inquiry Modal */}
      <Modal 
        isOpen={inquiryOpen} 
        onClose={() => setInquiryOpen(false)}
        title="Submit Inquiry"
        size="lg"
      >
        <LeadForm 
          listingTitle={listing.title}
          listingId={listing.id}
          type="inquiry"
          onSuccess={() => setInquiryOpen(false)}
        />
      </Modal>

      {/* LOI Modal */}
      <Modal 
        isOpen={loiOpen} 
        onClose={() => setLoiOpen(false)}
        title="Submit Letter of Intent"
        size="lg"
      >
        <LeadForm 
          listingTitle={listing.title}
          listingId={listing.id}
          type="loi"
          onSuccess={() => setLoiOpen(false)}
        />
      </Modal>
    </>
  );
}
