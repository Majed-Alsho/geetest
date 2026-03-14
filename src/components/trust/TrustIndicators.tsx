'use client';

import { motion } from 'framer-motion';
import { 
  Shield, 
  Lock, 
  BadgeCheck, 
  FileText, 
  Banknote,
  Globe,
  Users,
  Award,
  CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface TrustBadgeStripProps {
  className?: string;
}

const trustBadges = [
  { icon: Shield, label: 'Bank-Level Encryption' },
  { icon: Lock, label: 'NDA Protected' },
  { icon: BadgeCheck, label: 'Verified Listings' },
  { icon: FileText, label: 'Due Diligence Support' },
  { icon: Users, label: 'Verified Sellers' }
];

export function TrustBadgeStrip({ className }: TrustBadgeStripProps) {
  return (
    <div className={cn("flex flex-wrap justify-center gap-4 md:gap-8", className)}>
      {trustBadges.map((badge, index) => (
        <motion.div
          key={badge.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 * index }}
          className="trust-badge"
        >
          <badge.icon className="w-4 h-4 text-accent" />
          <span className="text-xs md:text-sm">{badge.label}</span>
        </motion.div>
      ))}
    </div>
  );
}

interface SecurityGuaranteeProps {
  className?: string;
}

const guarantees = [
  {
    icon: Shield,
    title: 'Secure Platform',
    description: 'Built with secure-by-default practices to protect your data'
  },
  {
    icon: BadgeCheck,
    title: 'Verified Sellers',
    description: 'Identity and ownership verification for all sellers'
  },
  {
    icon: FileText,
    title: 'Financial Verification',
    description: 'Independent review of financial statements'
  },
  {
    icon: Lock,
    title: 'Confidential Process',
    description: 'NDA protection and encrypted communications'
  }
];

export function SecurityGuarantees({ className }: SecurityGuaranteeProps) {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", className)}>
      {guarantees.map((item, index) => (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="text-center"
        >
          <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
            <item.icon className="w-6 h-6 text-accent" />
          </div>
          <h3 className="font-semibold mb-2">{item.title}</h3>
          <p className="text-sm text-muted-foreground">{item.description}</p>
        </motion.div>
      ))}
    </div>
  );
}

interface PlatformStatsProps {
  className?: string;
}

const platformStats = [
  { value: '$2.4B+', label: 'Total Transaction Volume', icon: Banknote },
  { value: '180+', label: 'Successful Acquisitions', icon: CheckCircle2 },
  { value: '40+', label: 'Countries Covered', icon: Globe },
  { value: '2,500+', label: 'Verified Investors', icon: Users }
];

export function PlatformStats({ className }: PlatformStatsProps) {
  return (
    <div className={cn("grid grid-cols-2 md:grid-cols-4 gap-6", className)}>
      {platformStats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          className="text-center p-6 rounded-xl bg-card border border-border"
        >
          <stat.icon className="w-6 h-6 text-accent mx-auto mb-3" />
          <p className="text-2xl md:text-3xl font-semibold text-accent mb-1">
            {stat.value}
          </p>
          <p className="text-xs md:text-sm text-muted-foreground">{stat.label}</p>
        </motion.div>
      ))}
    </div>
  );
}

interface ProcessTimelineProps {
  className?: string;
}

const processSteps = [
  { step: 1, title: 'List & Verify', description: 'Submit your business for verification' },
  { step: 2, title: 'Match Buyers', description: 'Connect with qualified investors' },
  { step: 3, title: 'Due Diligence', description: 'Structured DD with verified documents' },
  { step: 4, title: 'Close Deal', description: 'Complete your transaction securely' }
];

export function ProcessTimeline({ className }: ProcessTimelineProps) {
  return (
    <div className={cn("relative", className)}>
      {/* Connection line */}
      <div className="absolute top-6 left-0 right-0 h-0.5 bg-border hidden md:block" />
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {processSteps.map((item, index) => (
          <motion.div
            key={item.step}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.15 }}
            className="relative text-center"
          >
            <div className="w-12 h-12 rounded-full bg-accent text-accent-foreground flex items-center justify-center mx-auto mb-4 font-semibold text-lg relative z-10">
              {item.step}
            </div>
            <h3 className="font-semibold mb-1">{item.title}</h3>
            <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

interface PartnerLogosProps {
  className?: string;
}

// Placeholder partner names - in production these would be actual partner logos
const partners = [
  'Bloomberg', 'Reuters', 'Forbes', 'WSJ', 'Financial Times', 'TechCrunch'
];

export function PartnerLogos({ className }: PartnerLogosProps) {
  return (
    <div className={cn("text-center", className)}>
      <p className="text-sm text-muted-foreground mb-6">As featured in</p>
      <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
        {partners.map((partner) => (
          <span 
            key={partner}
            className="text-lg md:text-xl font-semibold text-muted-foreground/50 tracking-tight"
          >
            {partner}
          </span>
        ))}
      </div>
    </div>
  );
}

interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
  dealSize: string;
}

export function TestimonialCard({ quote, author, role, dealSize }: TestimonialCardProps) {
  return (
    <div className="p-6 rounded-xl bg-card border border-border">
      <div className="flex items-center gap-1 mb-4">
        {[1,2,3,4,5].map((star) => (
          <Award key={star} className="w-4 h-4 text-accent fill-accent" />
        ))}
      </div>
      <p className="text-muted-foreground mb-6 italic">"{quote}"</p>
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold">{author}</p>
          <p className="text-sm text-muted-foreground">{role}</p>
        </div>
        <span className="text-xs px-2 py-1 rounded-full bg-accent/10 text-accent font-medium">
          {dealSize}
        </span>
      </div>
    </div>
  );
}

export function Testimonials({ className }: { className?: string }) {
  const testimonials = [
    {
      quote: "The verification process gave me complete confidence. Knowing the financials were independently verified saved weeks of due diligence.",
      author: "Marcus K.",
      role: "Private Equity Partner",
      dealSize: "$12M Acquisition"
    },
    {
      quote: "Professional, confidential, and efficient. The platform made the transaction seamless. Highly recommended for serious buyers.",
      author: "Sarah L.",
      role: "Serial Entrepreneur",
      dealSize: "$4.2M Acquisition"
    },
    {
      quote: "Found the perfect acquisition target within 3 weeks. The quality of listings and verification standards are unmatched.",
      author: "James W.",
      role: "Family Office Director",
      dealSize: "$28M Acquisition"
    }
  ];

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-6", className)}>
      {testimonials.map((testimonial, index) => (
        <motion.div
          key={testimonial.author}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <TestimonialCard {...testimonial} />
        </motion.div>
      ))}
    </div>
  );
}
