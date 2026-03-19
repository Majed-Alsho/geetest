'use client';

import { motion } from 'framer-motion';
import { useIsClient } from '@/hooks/useIsClient';
import { 
  ArrowRight, 
  ShieldCheck, 
  Lock, 
  BadgeCheck, 
  Scale,
  CheckCircle2,
  TrendingUp,
  Globe,
  Users,
  Building2,
  Sparkles
} from 'lucide-react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { ListingCard } from '@/components/marketplace/ListingCard';
import { ChartCard } from '@/components/charts/ChartCard';
import { Link } from '@/components/Link';
import { 
  TrustBadgeStrip, 
  SecurityGuarantees, 
  PlatformStats, 
  ProcessTimeline,
  PartnerLogos,
  Testimonials 
} from '@/components/trust/TrustIndicators';
import { getFeaturedListings } from '@/lib/data';

const whyChooseUs = [
  {
    icon: BadgeCheck,
    title: 'Verified Listings',
    description: 'Every business undergoes rigorous financial and operational verification before listing.'
  },
  {
    icon: ShieldCheck,
    title: 'Secure Platform',
    description: 'Built with secure-by-default practices to protect your data and privacy.'
  },
  {
    icon: Lock,
    title: 'NDA Protection',
    description: 'Confidential information protected by legally binding NDAs throughout the process.'
  },
  {
    icon: Scale,
    title: 'Due Diligence Support',
    description: 'Access to structured due diligence with verified documents and expert support.'
  }
];

// Animated stats for hero
const heroStats = [
  { label: 'Verified Listings', value: '2,500+', icon: Building2 },
  { label: 'Active Investors', value: '15,000+', icon: Users },
  { label: 'Countries', value: '45+', icon: Globe },
  { label: 'Transaction Volume', value: '$2.4B+', icon: TrendingUp },
];

// Pre-defined particle positions to avoid hydration mismatch
const particleConfigs = [
  { delay: 0, duration: 5, size: 6, left: '15%', top: '60%' },
  { delay: 2, duration: 6, size: 8, left: '25%', top: '70%' },
  { delay: 4, duration: 4.5, size: 5, left: '45%', top: '55%' },
  { delay: 1, duration: 5.5, size: 7, left: '65%', top: '65%' },
  { delay: 3, duration: 4, size: 6, left: '75%', top: '75%' },
  { delay: 5, duration: 5, size: 8, left: '85%', top: '60%' },
];

// Floating particle component
function FloatingParticle({ delay, duration, size, left, top }: { delay: number; duration: number; size: number; left: string; top: string }) {
  return (
    <motion.div
      className="absolute rounded-full bg-accent/20"
      style={{ width: size, height: size, left, top }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ 
        opacity: [0, 0.5, 0],
        scale: [0, 1, 0],
        y: [-20, -100]
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        repeatDelay: 3
      }}
    />
  );
}

export default function Home() {
  const featuredListings = getFeaturedListings();
  // Track if we're on the client to avoid hydration issues with animations
  const isClient = useIsClient();

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-accent/5" />
        
        {/* Decorative elements */}
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        
        {/* Floating particles - only render on client to avoid hydration issues */}
        {isClient && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {particleConfigs.map((config, i) => (
              <FloatingParticle
                key={i}
                delay={config.delay}
                duration={config.duration}
                size={config.size}
                left={config.left}
                top={config.top}
              />
            ))}
          </div>
        )}

        <div className="container-wide relative z-10">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6">
                <CheckCircle2 className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium">$2.4B+ in Verified Transactions</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold leading-tight mb-6 tracking-tight">
                Verified Business Acquisitions.{' '}
                <span className="text-accent">
                  Secure. Confidential. Professional.
                </span>
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-8"
            >
              The trusted marketplace for acquiring verified businesses. 
              Independent financial verification. 
              NDA-protected confidential process.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 mb-8"
            >
              <Link href="/marketplace" className="btn-accent text-base px-8 py-4">
                Browse Verified Listings
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/create-listing" className="btn-secondary text-base px-8 py-4">
                List Your Business
              </Link>
            </motion.div>

            {/* Animated stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
            >
              {heroStats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-card/50 border border-border/50"
                >
                  <stat.icon className="w-5 h-5 text-accent" />
                  <div>
                    <p className="font-semibold text-lg">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Quick trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="flex flex-wrap gap-4 text-sm text-muted-foreground"
            >
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-accent" />
                Secure Platform
              </span>
              <span className="flex items-center gap-1.5">
                <BadgeCheck className="w-4 h-4 text-accent" />
                Verified Financials
              </span>
              <span className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-accent" />
                NDA Protection
              </span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Badge Strip */}
      <section className="py-8 border-y border-border bg-card/30">
        <div className="container-wide">
          <TrustBadgeStrip />
        </div>
      </section>

      {/* Platform Stats */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-semibold mb-3 tracking-tight">
                Trusted by Investors Worldwide
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Join thousands of verified investors who trust our platform for confidential business acquisitions.
              </p>
            </motion.div>
          </div>
          <PlatformStats />
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-padding bg-card/30">
        <div className="container-wide">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-semibold mb-3 tracking-tight">
                Why Global Equity Exchange
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Built for serious investors who demand verification, security, and confidentiality.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseUs.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center group"
              >
                <motion.div 
                  className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4 transition-colors group-hover:bg-accent/20"
                  whileHover={{ scale: 1.05 }}
                >
                  <item.icon className="w-7 h-7 text-accent" />
                </motion.div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="flex items-end justify-between mb-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
                <BadgeCheck className="w-4 h-4" />
                Verified & DD-Ready
              </div>
              <h2 className="text-3xl md:text-4xl font-semibold mb-3 tracking-tight">
                Featured Opportunities
              </h2>
              <p className="text-muted-foreground max-w-xl">
                Premium verified listings with independently verified financials and complete due diligence packages.
              </p>
            </motion.div>
            <Link
              href="/marketplace"
              className="hidden md:flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-accent transition-colors"
            >
              View all listings
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredListings.map((listing, index) => (
              <ListingCard key={listing.id} listing={listing} index={index} />
            ))}
          </div>

          <div className="mt-8 text-center md:hidden">
            <Link href="/marketplace" className="btn-secondary">
              View all listings
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-padding bg-card/30">
        <div className="container-wide">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-semibold mb-3 tracking-tight">
                Secure Acquisition Process
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                From discovery to close, every step is protected by our verification systems.
              </p>
            </motion.div>
          </div>

          <ProcessTimeline />
        </div>
      </section>

      {/* Security Guarantees */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-semibold mb-3 tracking-tight">
                Security & Trust Guarantees
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Built with secure-by-default practices to protect your investments and information.
              </p>
            </motion.div>
          </div>
          <SecurityGuarantees />
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-card/30">
        <div className="container-wide">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-semibold mb-3 tracking-tight">
                What Investors Say
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Hear from investors who have successfully acquired businesses through our platform.
              </p>
            </motion.div>
          </div>
          <Testimonials />
        </div>
      </section>

      {/* Investment Insights */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="flex items-end justify-between mb-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-semibold mb-3 tracking-tight">
                Investment Insights
              </h2>
              <p className="text-muted-foreground max-w-xl">
                Market trends and projections for discerning investors.
              </p>
            </motion.div>
            <Link
              href="/investors"
              className="hidden md:flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-accent transition-colors"
            >
              Investor Portal
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <ChartCard 
                title="Revenue Projection" 
                subtitle="Portfolio average trend"
                type="revenue"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <ChartCard 
                title="EBITDA Trend" 
                subtitle="Margin improvement"
                type="ebitda"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <ChartCard 
                title="YoY Growth" 
                subtitle="Compounded returns"
                type="growth"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Partner Logos */}
      <section className="py-12 border-y border-border">
        <div className="container-wide">
          <PartnerLogos />
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding">
        <div className="container-narrow">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <GlassPanel className="p-8 md:p-12 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent" />
              
              <div className="relative z-10">
                <motion.div 
                  className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-6"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <ShieldCheck className="w-8 h-8 text-accent" />
                </motion.div>
                <h2 className="text-2xl md:text-3xl font-semibold mb-4 tracking-tight">
                  Ready for a Secure Acquisition?
                </h2>
                <p className="text-muted-foreground max-w-lg mx-auto mb-8">
                  Join thousands of verified investors who trust Global Equity Exchange for confidential, secure business acquisitions.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/marketplace" className="btn-accent group">
                    Browse Verified Listings
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                  <Link href="/investors" className="btn-secondary">
                    Request Investor Access
                  </Link>
                </div>
                
                {/* Trust footer */}
                <div className="mt-8 pt-6 border-t border-border flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-accent" />
                    Bank-Level Security
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-accent" />
                    Verified Sellers
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-accent" />
                    NDA Enforced
                  </span>
                </div>
              </div>
            </GlassPanel>
          </motion.div>
        </div>
      </section>
    </>
  );
}
