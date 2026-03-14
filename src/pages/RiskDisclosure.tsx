'use client';

import { Link } from '@/components/Link';

import { GlassPanel } from '@/components/ui/GlassPanel';
import { AlertTriangle, ArrowLeft, ArrowRight } from 'lucide-react';

export default function RiskDisclosure() {
  return (
    
      <section className="section-padding">
        <div className="container-narrow">
          <Link 
            to="home"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          
          <div className="flex items-center gap-3 mb-8">
            <AlertTriangle className="w-8 h-8 text-accent" />
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Risk Disclosure</h1>
          </div>
          <GlassPanel className="p-8">
            <div className="prose prose-sm max-w-none text-muted-foreground space-y-6">
              <p className="text-foreground font-medium">Please read this risk disclosure carefully before using our platform.</p>
              <h2 className="text-foreground font-semibold text-lg mt-6">Investment Risk</h2>
              <p>Business acquisitions involve substantial risk of loss. Past performance of any business does not guarantee future results. You may lose some or all of your invested capital.</p>
              <h2 className="text-foreground font-semibold text-lg mt-6">Due Diligence</h2>
              <p>Information provided on listings is illustrative and should be independently verified. We do not guarantee the accuracy of seller-provided information.</p>
              <h2 className="text-foreground font-semibold text-lg mt-6">No Investment Advice</h2>
              <p>Nothing on this platform constitutes investment, legal, or tax advice. Consult qualified professionals before making investment decisions.</p>
              <h2 className="text-foreground font-semibold text-lg mt-6">Suitability</h2>
              <p>Business acquisitions may not be suitable for all investors. Consider your financial situation and risk tolerance carefully.</p>
            </div>
          </GlassPanel>
          
          <div className="mt-8">
            <GlassPanel className="p-6 text-center">
              <p className="text-muted-foreground mb-4">
                Understand the risks? Ready to explore opportunities?
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="marketplace" className="btn-accent">
                  Browse Marketplace
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link to="security" className="btn-secondary">
                  View Security Measures
                </Link>
              </div>
            </GlassPanel>
          </div>
        </div>
      </section>
    
  );
}