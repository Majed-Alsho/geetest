'use client';

import { motion } from 'framer-motion';
import { Link } from '@/components/Link';
import { ArrowLeft, X, TrendingUp, DollarSign, Users, Building2, Percent, Target } from 'lucide-react';

import { GlassPanel } from '@/components/ui/GlassPanel';
import { useCompare } from '@/contexts/CompareContext';
import { useNavigation } from '@/contexts/NavigationContext';
import { formatCurrency } from '@/lib/data';
import { cn } from '@/lib/utils';

export default function ComparePage() {
  const { compareListings, removeFromCompare, clearCompare } = useCompare();
  const { setSelectedListingId, navigateTo } = useNavigation();

  const handleViewDetails = (listingId: string) => {
    setSelectedListingId(listingId);
    navigateTo('listing-detail');
  };

  const metrics = [
    { key: 'price', label: 'Asking Price', icon: DollarSign, format: (v: number) => formatCurrency(v), highlight: true },
    { key: 'revenue', label: 'Annual Revenue', icon: DollarSign, format: (v: number) => formatCurrency(v) },
    { key: 'netProfit', label: 'Net Profit', icon: TrendingUp, format: (v: number) => v ? formatCurrency(v) : 'N/A' },
    { key: 'growthYoY', label: 'YoY Growth', icon: TrendingUp, format: (v: number) => `+${v}%` },
    { key: 'ebitdaMargin', label: 'EBITDA Margin', icon: Percent, format: (v: number) => `${v}%` },
    { key: 'grossMargin', label: 'Gross Margin', icon: Percent, format: (v: number) => v ? `${v}%` : 'N/A' },
    { key: 'employees', label: 'Employees', icon: Users, format: (v: number) => v.toString() },
    { key: 'customerRetention', label: 'Customer Retention', icon: Users, format: (v: number) => v ? `${v}%` : 'N/A' },
    { key: 'debtToEquity', label: 'Debt to Equity', icon: Building2, format: (v: number) => v !== undefined ? v.toFixed(2) : 'N/A' },
    { key: 'marketPotential', label: 'Market Potential', icon: Target, format: (v: string) => v || 'N/A' },
  ];

  const getRevenueMultiple = (price: number, revenue: number) => (price / revenue).toFixed(1);

  if (compareListings.length === 0) {
    return (
      
        <section className="section-padding">
          <div className="container-wide text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Building2 className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
              <h1 className="text-2xl font-semibold mb-2">No Listings to Compare</h1>
              <p className="text-muted-foreground mb-6">
                Add listings to compare their metrics side by side.
              </p>
              <Link to="marketplace" className="btn-primary">
                <ArrowLeft className="w-5 h-5" />
                Browse Marketplace
              </Link>
            </motion.div>
          </div>
        </section>
      
    );
  }

  return (
    
      <section className="section-padding">
        <div className="container-wide">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <Link 
                to="marketplace"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Marketplace
              </Link>
              <button 
                onClick={clearCompare}
                className="text-sm text-destructive hover:underline"
              >
                Clear All
              </button>
            </div>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
              Compare Listings
            </h1>
            <p className="text-muted-foreground mt-2">
              Side-by-side comparison of {compareListings.length} opportunities
            </p>
          </motion.div>

          {/* Comparison Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <GlassPanel className="p-0 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="p-4 text-left text-sm font-medium text-muted-foreground w-48">
                        Metric
                      </th>
                      {compareListings.map((listing) => (
                        <th key={listing.id} className="p-4 text-left min-w-[200px]">
                          <div className="relative">
                            <button
                              onClick={() => removeFromCompare(listing.id)}
                              className="absolute -top-1 -right-1 p-1 rounded-full bg-destructive/10 hover:bg-destructive/20 text-destructive transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleViewDetails(listing.id)}
                              className="hover:text-accent transition-colors text-left"
                            >
                              <div className="text-sm text-muted-foreground mb-1">{listing.category}</div>
                              <div className="font-semibold pr-6">{listing.title}</div>
                              <div className="text-sm text-muted-foreground">{listing.location}, {listing.region}</div>
                            </button>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {/* Revenue Multiple (calculated) */}
                    <tr className="border-b border-border bg-accent/5">
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">Revenue Multiple</span>
                        </div>
                      </td>
                      {compareListings.map((listing) => (
                        <td key={listing.id} className="p-4">
                          <span className="font-semibold text-accent">
                            {getRevenueMultiple(listing.price, listing.revenue)}x
                          </span>
                        </td>
                      ))}
                    </tr>

                    {/* Dynamic Metrics */}
                    {metrics.map((metric, index) => (
                      <tr 
                        key={metric.key} 
                        className={cn(
                          "border-b border-border",
                          index % 2 === 0 && "bg-secondary/20"
                        )}
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <metric.icon className="w-4 h-4 text-muted-foreground" />
                            <span className={cn("font-medium", metric.highlight && "text-accent")}>
                              {metric.label}
                            </span>
                          </div>
                        </td>
                        {compareListings.map((listing) => {
                          const value = listing[metric.key as keyof typeof listing];
                          return (
                            <td key={listing.id} className="p-4">
                              <span className={cn("font-semibold", metric.highlight && "text-accent text-lg")}>
                                {metric.format(value as never)}
                              </span>
                            </td>
                          );
                        })}
                      </tr>
                    ))}

                    {/* Verified Status */}
                    <tr className="border-b border-border">
                      <td className="p-4">
                        <span className="font-medium">Verified</span>
                      </td>
                      {compareListings.map((listing) => (
                        <td key={listing.id} className="p-4">
                          <span className={cn(
                            "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                            listing.verified 
                              ? "bg-green-500/10 text-green-500" 
                              : "bg-muted text-muted-foreground"
                          )}>
                            {listing.verified ? '✓ Verified' : 'Unverified'}
                          </span>
                        </td>
                      ))}
                    </tr>

                    {/* CTA Row */}
                    <tr>
                      <td className="p-4">
                        <span className="font-medium">Action</span>
                      </td>
                      {compareListings.map((listing) => (
                        <td key={listing.id} className="p-4">
                          <button 
                            onClick={() => handleViewDetails(listing.id)}
                            className="btn-accent text-sm py-2"
                          >
                            View Details
                          </button>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </GlassPanel>
          </motion.div>
        </div>
      </section>
    
  );
}
