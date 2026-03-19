'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Globe, 
  DollarSign, 
  ArrowRight,
  Building2,
  ShieldCheck,
  BadgeCheck,
  Scale,
  FileCheck,
  Lock,
  CheckCircle2
} from 'lucide-react';

import { GlassPanel } from '@/components/ui/GlassPanel';
import { ChartCard } from '@/components/charts/ChartCard';
import { Modal } from '@/components/ui/Modal';
import { LeadForm } from '@/components/forms/LeadForm';
import { VerificationBadge } from '@/components/trust/VerificationBadges';
import { SecurityGuarantees, PlatformStats } from '@/components/trust/TrustIndicators';
import { useAuth } from '@/contexts/AuthContext';

const dealFlowSpecs = [
  { icon: DollarSign, label: 'Minimum Ticket', value: '$500K+' },
  { icon: Globe, label: 'Regions Covered', value: 'Global (40+ countries)' },
  { icon: Building2, label: 'Deal Types', value: 'Acquisitions, Partnerships, Growth Equity' }
];

const investorTiers = [
  {
    tier: 'Standard',
    price: '€2.99/mo',
    features: [
      'Access to all verified listings',
      'Basic financial details',
      'Submit unlimited inquiries',
      'Save & compare listings'
    ],
    cta: 'Start Free Trial',
    highlighted: false
  },
  {
    tier: 'Accredited',
    price: '€49/mo',
    features: [
      'Everything in Standard',
      'Priority deal flow alerts',
      'Detailed financials & projections',
      'Direct seller introductions',
      'Dedicated account manager',
      'Proof of funds verification'
    ],
    cta: 'Apply for Access',
    highlighted: true,
    badge: 'Most Popular'
  },
  {
    tier: 'Institutional',
    price: 'Custom',
    features: [
      'Everything in Accredited',
      'Off-market deal access',
      'Custom deal sourcing',
      'White-glove due diligence',
      'Legal & financial advisory',
      'Co-investment opportunities'
    ],
    cta: 'Contact Sales',
    highlighted: false
  }
];

const verificationProcess = [
  {
    step: 1,
    title: 'Identity Verification',
    description: 'Complete KYC with government ID and proof of address',
    icon: BadgeCheck
  },
  {
    step: 2,
    title: 'Accreditation Check',
    description: 'Verify accredited investor status or net worth requirements',
    icon: Scale
  },
  {
    step: 3,
    title: 'Proof of Funds',
    description: 'Demonstrate investment capacity with bank statements or portfolio proof',
    icon: DollarSign
  },
  {
    step: 4,
    title: 'NDA Agreement',
    description: 'Sign platform-wide confidentiality agreement for all listings',
    icon: FileCheck
  }
];

export default function Investors() {
  const { isAuthenticated } = useAuth();
  const [accessOpen, setAccessOpen] = useState(false);

  return (
    <>
      {/* Hero */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="max-w-3xl mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap gap-2 mb-6"
            >
              <VerificationBadge type="proof-of-funds" size="md" />
              <VerificationBadge type="accredited-investor" size="md" />
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-6 tracking-tight"
            >
              Verified Investor Portal:{' '}
              <span className="text-accent">Premium Access to Verified Deals</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-muted-foreground"
            >
              Exclusive access to thoroughly vetted business acquisitions. 
              Our verification process ensures you're connected with legitimate opportunities 
              and qualified sellers—protected by NDA and due diligence support.
            </motion.p>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <ChartCard 
                title="Revenue Projection" 
                subtitle="Portfolio average trend"
                type="revenue"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <ChartCard 
                title="EBITDA Growth" 
                subtitle="Margin improvement"
                type="ebitda"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <ChartCard 
                title="YoY Returns" 
                subtitle="Compounded performance"
                type="growth"
              />
            </motion.div>
          </div>

          {/* Investor Tiers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-16"
          >
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-semibold mb-3 tracking-tight">
                Investor Access Tiers
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Choose the access level that matches your investment profile and deal flow needs.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {investorTiers.map((tier, index) => (
                <motion.div
                  key={tier.tier}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                >
                  <GlassPanel className={`p-6 h-full relative ${tier.highlighted ? 'ring-2 ring-accent' : ''}`}>
                    {tier.badge && (
                      <span className="absolute top-1 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-medium bg-accent text-accent-foreground whitespace-nowrap">
                        {tier.badge}
                      </span>
                    )}
                    <div className="text-center mb-6 pt-2">
                      <h3 className="font-semibold text-lg mb-2">{tier.tier}</h3>
                      <p className="text-2xl font-semibold text-accent">{tier.price}</p>
                    </div>
                    <ul className="space-y-3 mb-6">
                      {tier.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <button 
                      onClick={() => setAccessOpen(true)}
                      className={`w-full justify-center ${tier.highlighted ? 'btn-accent' : 'btn-secondary'}`}
                    >
                      {tier.cta}
                    </button>
                  </GlassPanel>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Verification Process */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="mb-16"
          >
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-semibold mb-3 tracking-tight">
                Investor Verification Process
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Our thorough verification ensures all parties are legitimate, qualified, and protected.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {verificationProcess.map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                    <item.icon className="w-7 h-7 text-accent" />
                  </div>
                  <div className="w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center mx-auto mb-3 font-semibold text-sm">
                    {item.step}
                  </div>
                  <h3 className="font-semibold mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Deal Flow Access Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            <GlassPanel className="p-8 md:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div>
                  <h2 className="text-2xl md:text-3xl font-semibold mb-6 tracking-tight">
                    Deal Flow Access
                  </h2>
                  <p className="text-muted-foreground mb-8">
                    Gain priority access to our curated pipeline of investment-ready businesses. 
                    Submit your credentials to join our network of verified investors.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                    {dealFlowSpecs.map((spec) => (
                      <div key={spec.label} className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                          <spec.icon className="w-5 h-5 text-accent" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">{spec.label}</p>
                          <p className="font-semibold">{spec.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button 
                    onClick={() => setAccessOpen(true)}
                    className="btn-accent"
                  >
                    Request Verified Access
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  <h3 className="font-semibold text-lg">Why Get Verified?</h3>
                  {[
                    {
                      icon: ShieldCheck,
                      title: 'Priority Deal Access',
                      description: 'Be first to see new listings matching your criteria.'
                    },
                    {
                      icon: BadgeCheck,
                      title: 'Trusted Status',
                      description: 'Sellers prioritize verified buyers with proof of funds.'
                    },
                    {
                      icon: Lock,
                      title: 'Full Confidential Access',
                      description: 'Unlock detailed financials and seller information.'
                    }
                  ].map((benefit, index) => (
                    <motion.div
                      key={benefit.title}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.3 + index * 0.1 }}
                      className="flex items-start gap-4"
                    >
                      <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                        <benefit.icon className="w-6 h-6 text-foreground" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">{benefit.title}</h4>
                        <p className="text-sm text-muted-foreground">{benefit.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </GlassPanel>
          </motion.div>
        </div>
      </section>

      {/* Platform Stats */}
      <section className="section-padding bg-card/30">
        <div className="container-wide">
          <PlatformStats />
        </div>
      </section>

      {/* Security Guarantees */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold mb-3 tracking-tight">
              Investor Protection Guarantees
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Your investments and information are protected at every step.
            </p>
          </div>
          <SecurityGuarantees />
        </div>
      </section>

      {/* Access Request Modal */}
      <Modal 
        isOpen={accessOpen} 
        onClose={() => setAccessOpen(false)}
        title="Request Verified Investor Access"
        size="lg"
      >
        <LeadForm 
          listingTitle="Verified Investor Access Request"
          listingId="investor-access"
          type="inquiry"
          onSuccess={() => setAccessOpen(false)}
        />
      </Modal>
    </>
  );
}
