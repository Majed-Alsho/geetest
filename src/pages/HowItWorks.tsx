'use client';

import { Link } from '@/components/Link';
import { motion } from 'framer-motion';
import { 
  Search, 
  FileText, 
  Users, 
  Send, 
  Handshake,
  Lock,
  ArrowRight,
  ShieldCheck,
  CheckCircle
} from 'lucide-react';

import { GlassPanel } from '@/components/ui/GlassPanel';

const steps = [
  {
    icon: Search,
    title: 'Browse Opportunities',
    description: 'Explore our marketplace of vetted business listings across industries and regions. Filter by sector, location, price range, and growth metrics to find opportunities matching your investment criteria.'
  },
  {
    icon: FileText,
    title: 'Submit Inquiry or LOI',
    description: 'Express interest through a confidential inquiry or Letter of Intent. Provide your credentials, investment thesis, and relevant experience. All submissions are encrypted and handled with discretion.'
  },
  {
    icon: Users,
    title: 'Team Vetting',
    description: 'Our internal team reviews every inquiry for credibility and fit. We verify investor credentials, assess alignment with seller requirements, and ensure serious intent before any introductions.'
  },
  {
    icon: Send,
    title: 'Owner Introduction',
    description: 'Qualified inquiries are forwarded to business owners with your permission. Owners receive a summary of your interest without direct contact information until they choose to engage.'
  },
  {
    icon: Handshake,
    title: 'Direct Engagement',
    description: 'Once both parties express mutual interest, we facilitate introductions for direct discussions. From this point, you work directly with the business owner through due diligence and negotiation.'
  }
];

const principles = [
  {
    icon: Lock,
    title: 'Seller Anonymity',
    description: 'Business owners remain anonymous until they choose to reveal their identity to vetted buyers.'
  },
  {
    icon: ShieldCheck,
    title: 'Buyer Verification',
    description: 'All inquiries are screened for legitimacy, financial capability, and serious intent.'
  },
  {
    icon: CheckCircle,
    title: 'Quality Over Volume',
    description: 'We prioritize meaningful connections over transaction volume, ensuring productive discussions.'
  }
];

export default function HowItWorks() {
  return (
    
      <section className="section-padding">
        <div className="container-wide">
          {/* Header */}
          <div className="max-w-3xl mb-16">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-6 tracking-tight"
            >
              How It Works
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-muted-foreground"
            >
              Our no-broker gatekeeper model ensures confidentiality for sellers 
              and quality connections for buyers. Every step is designed to protect 
              both parties while facilitating meaningful transactions.
            </motion.p>
          </div>

          {/* Steps */}
          <div className="space-y-8 mb-20">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassPanel className="p-6 md:p-8">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                        <step.icon className="w-7 h-7 text-accent" />
                      </div>
                      <span className="text-4xl font-bold text-accent/30">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                </GlassPanel>
              </motion.div>
            ))}
          </div>

          {/* Principles */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <GlassPanel className="p-8 md:p-12">
              <div className="text-center mb-12">
                <h2 className="text-2xl md:text-3xl font-semibold mb-4 tracking-tight">
                  Our Core Principles
                </h2>
                <p className="text-muted-foreground max-w-xl mx-auto">
                  Every aspect of our process is built around trust, discretion, and quality.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {principles.map((principle, index) => (
                  <motion.div
                    key={principle.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="text-center"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-4">
                      <principle.icon className="w-7 h-7 text-foreground" />
                    </div>
                    <h3 className="font-semibold mb-2">{principle.title}</h3>
                    <p className="text-sm text-muted-foreground">{principle.description}</p>
                  </motion.div>
                ))}
              </div>
            </GlassPanel>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12"
          >
            <GlassPanel className="p-8 md:p-12 text-center">
              <Lock className="w-10 h-10 text-accent mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Ready to Get Started?</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Browse our marketplace of vetted opportunities or request investor access for priority deal flow.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="marketplace" className="btn-accent">
                  Browse Marketplace
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link to="investors" className="btn-secondary">
                  Request Investor Access
                </Link>
              </div>
            </GlassPanel>
          </motion.div>
        </div>
      </section>
    
  );
}
