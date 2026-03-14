'use client';

import { motion } from 'framer-motion';
import { Link } from '@/components/Link';
import { 
  ShieldCheck, 
  Lock, 
  FileText, 
  Server,
  Eye,
  CheckCircle,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

import { GlassPanel } from '@/components/ui/GlassPanel';
import { StatusBadge } from '@/components/ui/StatusBadge';

const securityFeatures = [
  {
    icon: Lock,
    title: 'End-to-End Encryption',
    description: 'All data transmission uses TLS 1.3 encryption. Sensitive information is encrypted at rest using AES-256.'
  },
  {
    icon: FileText,
    title: 'Input Validation',
    description: 'Strict server-side validation using Zod schemas. All user inputs are sanitized to prevent injection attacks.'
  },
  {
    icon: Server,
    title: 'Rate Limiting',
    description: 'Intelligent rate limiting protects against abuse. Automated systems detect and block suspicious activity.'
  },
  {
    icon: Eye,
    title: 'Minimal Data Exposure',
    description: 'Seller information is never exposed client-side. Identity remains protected until explicit authorization.'
  },
  {
    icon: ShieldCheck,
    title: 'Secure Email Routing',
    description: 'Lead notifications route through secure channels. No direct contact information shared without consent.'
  },
  {
    icon: CheckCircle,
    title: 'Audit-Ready Logging',
    description: 'Comprehensive activity logs for compliance. Structured logging without sensitive data exposure.'
  }
];

const securityBadges = [
  { variant: 'encrypted' as const, label: 'Encrypted Data' },
  { variant: 'confidential' as const, label: 'Confidential Process' },
  { variant: 'verified' as const, label: 'Verified Platform' }
];

export default function Security() {
  return (
    
      <section className="section-padding">
        <div className="container-wide">
          {/* Header */}
          <div className="max-w-3xl mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap gap-2 mb-6"
            >
              {securityBadges.map((badge) => (
                <StatusBadge key={badge.label} variant={badge.variant}>
                  {badge.label}
                </StatusBadge>
              ))}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-6 tracking-tight"
            >
              Security & Confidentiality
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-muted-foreground"
            >
              Global Equity Exchange is built with secure-by-default practices: 
              validation, sanitization, rate limiting, and minimal data exposure. 
              Your information and transactions are protected at every step.
            </motion.p>
          </div>

          {/* Security Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {securityFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
              >
                <GlassPanel className="p-6 h-full">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </GlassPanel>
              </motion.div>
            ))}
          </div>

          {/* Trust Statement */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <GlassPanel className="p-8 md:p-12">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-2">Our Commitment</h2>
                  <p className="text-muted-foreground">
                    We never claim to be "unhackable." Instead, we build with secure-by-default 
                    practices and continuously improve our security posture. Our approach includes 
                    strict input validation, comprehensive sanitization, intelligent rate limiting, 
                    and minimal data exposure across all systems.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-8 border-t border-border">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm">Regular security audits</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm">Incident response plan</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm">Data protection policies</span>
                </div>
              </div>
            </GlassPanel>
          </motion.div>

          {/* Risk Disclosure Link */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12"
          >
            <GlassPanel className="p-6">
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-6 h-6 text-accent flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-2">Risk Disclosure</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Business acquisitions involve significant financial risk. Past performance 
                    does not guarantee future results. All information provided is illustrative 
                    and should be independently verified.
                  </p>
                  <Link 
                    to="risk-disclosure" 
                    className="btn-secondary text-sm inline-flex"
                  >
                    Read full Risk Disclosure
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
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
              <ShieldCheck className="w-10 h-10 text-accent mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Start Exploring Opportunities</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Your data is protected at every step. Browse vetted businesses with confidence.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="marketplace" className="btn-accent">
                  Browse Marketplace
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link to="how-it-works" className="btn-secondary">
                  Learn How It Works
                </Link>
              </div>
            </GlassPanel>
          </motion.div>
        </div>
      </section>
    
  );
}
