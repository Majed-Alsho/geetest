'use client';

import { motion } from 'framer-motion';
import { Link } from '@/components/Link';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { 
  ArrowLeft, 
  Shield, 
  Database, 
  Eye, 
  Lock, 
  Globe, 
  Users, 
  Mail,
  FileText,
  Clock,
  AlertCircle
} from 'lucide-react';

export default function Privacy() {
  return (
    <section className="section-padding">
      <div className="container-narrow">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link 
            to="home"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center">
              <Shield className="w-7 h-7 text-accent" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Privacy Policy</h1>
              <p className="text-muted-foreground">GDPR Compliant Data Protection</p>
            </div>
          </div>

          {/* Quick Summary */}
          <GlassPanel className="p-6 mb-8 bg-accent/5 border-accent/20">
            <h2 className="font-semibold mb-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-accent" />
              Quick Summary
            </h2>
            <p className="text-sm text-muted-foreground">
              This privacy policy explains how Global Equity Exchange collects, uses, and protects your personal data 
              in compliance with the General Data Protection Regulation (GDPR) and other applicable data protection laws. 
              By using our platform, you agree to the practices described in this policy.
            </p>
          </GlassPanel>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GlassPanel className="p-8">
            <div className="space-y-8">
              {/* Section 1: Introduction */}
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                    <Globe className="w-5 h-5 text-accent" />
                  </div>
                  <h2 className="text-xl font-semibold">1. Introduction</h2>
                </div>
                <div className="text-muted-foreground space-y-4 pl-13">
                  <p>
                    <strong>Last Updated:</strong> January 2024
                  </p>
                  <p>
                    Global Equity Exchange (&quot;we&quot;, &quot;our&quot;, or &quot;the Platform&quot;) is committed to protecting your privacy 
                    and ensuring the security of your personal data. This Privacy Policy applies to all users of our 
                    website and services, including investors, business sellers, and visitors.
                  </p>
                  <p>
                    We are the data controller for the personal data collected through this Platform. Our registered 
                    office is located at [Company Address]. For data protection inquiries, contact our Data Protection 
                    Officer at:
                  </p>
                  <div className="bg-secondary/30 p-4 rounded-xl">
                    <p><strong>Data Protection Officer:</strong> dpo@globalequityexchange.com</p>
                    <p><strong>General Inquiries:</strong> privacy@globalequityexchange.com</p>
                  </div>
                </div>
              </section>

              {/* Section 2: Data We Collect */}
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                    <Database className="w-5 h-5 text-accent" />
                  </div>
                  <h2 className="text-xl font-semibold">2. Personal Data We Collect</h2>
                </div>
                <div className="text-muted-foreground space-y-4">
                  <p>We collect the following categories of personal data:</p>
                  
                  <div className="bg-secondary/30 p-4 rounded-xl space-y-3">
                    <h4 className="font-medium text-foreground">Account Information</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Full name and professional title</li>
                      <li>Email address (verified)</li>
                      <li>Password (encrypted and hashed)</li>
                      <li>Phone number (optional)</li>
                      <li>Company name and position</li>
                      <li>Country of residence</li>
                    </ul>
                  </div>

                  <div className="bg-secondary/30 p-4 rounded-xl space-y-3">
                    <h4 className="font-medium text-foreground">Investment Preferences</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Investment criteria and preferences</li>
                      <li>Budget range and financing preferences</li>
                      <li>Industry sectors of interest</li>
                      <li>Geographic preferences</li>
                      <li>Saved listings and search history</li>
                    </ul>
                  </div>

                  <div className="bg-secondary/30 p-4 rounded-xl space-y-3">
                    <h4 className="font-medium text-foreground">Transaction Data</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>NDA signatures and access grants</li>
                      <li>Communications with sellers/buyers</li>
                      <li>Due diligence documents accessed</li>
                      <li>Transaction history and status</li>
                    </ul>
                  </div>

                  <div className="bg-secondary/30 p-4 rounded-xl space-y-3">
                    <h4 className="font-medium text-foreground">Technical Data</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>IP address and device information</li>
                      <li>Browser type and version</li>
                      <li>Cookies and similar technologies</li>
                      <li>Usage patterns and analytics data</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Section 3: Legal Basis */}
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-accent" />
                  </div>
                  <h2 className="text-xl font-semibold">3. Legal Basis for Processing (GDPR Art. 6)</h2>
                </div>
                <div className="text-muted-foreground space-y-4">
                  <p>We process your personal data under the following legal bases:</p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="bg-secondary/30 p-4 rounded-xl">
                      <h4 className="font-medium text-foreground mb-2">Contract Performance</h4>
                      <p className="text-sm">Processing necessary to provide our services and fulfill contractual obligations.</p>
                    </div>
                    <div className="bg-secondary/30 p-4 rounded-xl">
                      <h4 className="font-medium text-foreground mb-2">Legitimate Interests</h4>
                      <p className="text-sm">Processing for fraud prevention, security, and improving our services.</p>
                    </div>
                    <div className="bg-secondary/30 p-4 rounded-xl">
                      <h4 className="font-medium text-foreground mb-2">Consent</h4>
                      <p className="text-sm">Marketing communications, analytics cookies, and optional features.</p>
                    </div>
                    <div className="bg-secondary/30 p-4 rounded-xl">
                      <h4 className="font-medium text-foreground mb-2">Legal Obligation</h4>
                      <p className="text-sm">Compliance with anti-money laundering (AML) and other regulatory requirements.</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 4: How We Use Data */}
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                    <Eye className="w-5 h-5 text-accent" />
                  </div>
                  <h2 className="text-xl font-semibold">4. How We Use Your Data</h2>
                </div>
                <div className="text-muted-foreground space-y-4">
                  <p>Your personal data is used for:</p>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Providing access to verified business listings and investment opportunities</li>
                    <li>Facilitating NDA-protected information exchange between parties</li>
                    <li>Processing inquiries and communications between buyers and sellers</li>
                    <li>Sending relevant alerts about new listings matching your criteria</li>
                    <li>Ensuring platform security and preventing fraudulent activities</li>
                    <li>Complying with legal and regulatory obligations</li>
                    <li>Improving our services through analytics and user feedback</li>
                    <li>Sending marketing communications (with explicit consent)</li>
                  </ul>
                </div>
              </section>

              {/* Section 5: Data Sharing */}
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-accent" />
                  </div>
                  <h2 className="text-xl font-semibold">5. Data Sharing and Disclosure</h2>
                </div>
                <div className="text-muted-foreground space-y-4">
                  <p>We do not sell your personal data. We may share your data with:</p>
                  <ul className="list-disc list-inside space-y-2">
                    <li><strong>Business Sellers:</strong> Basic contact information after NDA signing</li>
                    <li><strong>Service Providers:</strong> Cloud hosting, payment processing, analytics (all GDPR compliant)</li>
                    <li><strong>Professional Advisors:</strong> Legal, accounting, and due diligence professionals</li>
                    <li><strong>Regulatory Authorities:</strong> When required by law or to prevent fraud</li>
                    <li><strong>Business Transfers:</strong> In connection with merger, acquisition, or sale of assets</li>
                  </ul>
                  <p className="text-sm bg-yellow-500/10 p-4 rounded-xl border border-yellow-500/20">
                    All third-party processors are bound by data processing agreements ensuring GDPR compliance 
                    and appropriate security measures.
                  </p>
                </div>
              </section>

              {/* Section 6: International Transfers */}
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                    <Globe className="w-5 h-5 text-accent" />
                  </div>
                  <h2 className="text-xl font-semibold">6. International Data Transfers</h2>
                </div>
                <div className="text-muted-foreground space-y-4">
                  <p>
                    Your data may be transferred to countries outside the European Economic Area (EEA). 
                    We ensure appropriate safeguards are in place:
                  </p>
                  <ul className="list-disc list-inside space-y-2">
                    <li>EU Standard Contractual Clauses (SCCs) with all non-EEA processors</li>
                    <li>Transfer Impact Assessments for high-risk destinations</li>
                    <li>Binding Corporate Rules where applicable</li>
                    <li>Adequacy decisions by the European Commission</li>
                  </ul>
                </div>
              </section>

              {/* Section 7: Your Rights */}
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-accent" />
                  </div>
                  <h2 className="text-xl font-semibold">7. Your Rights Under GDPR</h2>
                </div>
                <div className="text-muted-foreground space-y-4">
                  <p>You have the following rights regarding your personal data:</p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="bg-secondary/30 p-4 rounded-xl">
                      <h4 className="font-medium text-foreground mb-1">Right of Access (Art. 15)</h4>
                      <p className="text-sm">Request a copy of all personal data we hold about you.</p>
                    </div>
                    <div className="bg-secondary/30 p-4 rounded-xl">
                      <h4 className="font-medium text-foreground mb-1">Right to Rectification (Art. 16)</h4>
                      <p className="text-sm">Request correction of inaccurate or incomplete data.</p>
                    </div>
                    <div className="bg-secondary/30 p-4 rounded-xl">
                      <h4 className="font-medium text-foreground mb-1">Right to Erasure (Art. 17)</h4>
                      <p className="text-sm">Request deletion of your personal data (&quot;right to be forgotten&quot;).</p>
                    </div>
                    <div className="bg-secondary/30 p-4 rounded-xl">
                      <h4 className="font-medium text-foreground mb-1">Right to Restriction (Art. 18)</h4>
                      <p className="text-sm">Request limited processing of your data.</p>
                    </div>
                    <div className="bg-secondary/30 p-4 rounded-xl">
                      <h4 className="font-medium text-foreground mb-1">Right to Portability (Art. 20)</h4>
                      <p className="text-sm">Receive your data in a machine-readable format.</p>
                    </div>
                    <div className="bg-secondary/30 p-4 rounded-xl">
                      <h4 className="font-medium text-foreground mb-1">Right to Object (Art. 21)</h4>
                      <p className="text-sm">Object to processing based on legitimate interests.</p>
                    </div>
                  </div>
                  <p className="text-sm">
                    To exercise these rights, contact us at{' '}
                    <a href="mailto:dpo@globalequityexchange.com" className="text-accent hover:underline">
                      dpo@globalequityexchange.com
                    </a>
                    . We will respond within one month.
                  </p>
                </div>
              </section>

              {/* Section 8: Data Retention */}
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-accent" />
                  </div>
                  <h2 className="text-xl font-semibold">8. Data Retention</h2>
                </div>
                <div className="text-muted-foreground space-y-4">
                  <p>We retain your personal data only as long as necessary:</p>
                  <ul className="list-disc list-inside space-y-2">
                    <li><strong>Account Data:</strong> Duration of your account plus 7 years for legal compliance</li>
                    <li><strong>Transaction Records:</strong> 7 years after transaction completion</li>
                    <li><strong>NDA Records:</strong> Duration of NDA validity plus 7 years</li>
                    <li><strong>Marketing Data:</strong> Until consent is withdrawn</li>
                    <li><strong>Analytics Data:</strong> 26 months (anonymized after 12 months)</li>
                  </ul>
                </div>
              </section>

              {/* Section 9: Security */}
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                    <Lock className="w-5 h-5 text-accent" />
                  </div>
                  <h2 className="text-xl font-semibold">9. Data Security</h2>
                </div>
                <div className="text-muted-foreground space-y-4">
                  <p>We implement robust security measures including:</p>
                  <ul className="list-disc list-inside space-y-2">
                    <li>End-to-end encryption for all sensitive data in transit and at rest</li>
                    <li>Secure password hashing using industry-standard algorithms</li>
                    <li>Two-factor authentication for enhanced account security</li>
                    <li>Regular security audits and penetration testing</li>
                    <li>Strict access controls and role-based permissions</li>
                    <li>Incident response procedures and breach notification protocols</li>
                  </ul>
                </div>
              </section>

              {/* Section 10: Cookies */}
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                    <Eye className="w-5 h-5 text-accent" />
                  </div>
                  <h2 className="text-xl font-semibold">10. Cookies and Tracking</h2>
                </div>
                <div className="text-muted-foreground space-y-4">
                  <p>We use cookies in accordance with the ePrivacy Directive and GDPR:</p>
                  <div className="bg-secondary/30 p-4 rounded-xl space-y-3">
                    <div>
                      <h4 className="font-medium text-foreground">Necessary Cookies</h4>
                      <p className="text-sm">Required for platform functionality. No consent required.</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">Analytics Cookies</h4>
                      <p className="text-sm">Help us understand platform usage. Consent required.</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">Marketing Cookies</h4>
                      <p className="text-sm">Personalized advertising. Consent required.</p>
                    </div>
                  </div>
                  <p className="text-sm">
                    You can manage your cookie preferences at any time through our Cookie Consent Manager 
                    or by visiting your account settings.
                  </p>
                </div>
              </section>

              {/* Section 11: Children */}
              <section>
                <h2 className="text-xl font-semibold mb-4">11. Children&apos;s Privacy</h2>
                <div className="text-muted-foreground space-y-4">
                  <p>
                    Our platform is not intended for individuals under 18 years of age. We do not knowingly 
                    collect personal data from children. If you believe a child has provided us with personal data, 
                    please contact us immediately.
                  </p>
                </div>
              </section>

              {/* Section 12: Changes */}
              <section>
                <h2 className="text-xl font-semibold mb-4">12. Changes to This Policy</h2>
                <div className="text-muted-foreground space-y-4">
                  <p>
                    We may update this Privacy Policy periodically. Significant changes will be communicated 
                    via email and prominent notice on our platform. Continued use of our services after changes 
                    constitutes acceptance of the updated policy.
                  </p>
                </div>
              </section>

              {/* Section 13: Complaints */}
              <section>
                <h2 className="text-xl font-semibold mb-4">13. Right to Lodge a Complaint</h2>
                <div className="text-muted-foreground space-y-4">
                  <p>
                    If you believe your data protection rights have been violated, you have the right to lodge 
                    a complaint with a supervisory authority in your jurisdiction. For EU residents, this is 
                    typically the data protection authority in your country of residence.
                  </p>
                </div>
              </section>

              {/* Contact */}
              <section className="bg-accent/5 p-6 rounded-xl border border-accent/20">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-accent" />
                  Contact Us
                </h2>
                <div className="text-muted-foreground space-y-2">
                  <p><strong>Data Protection Officer:</strong> dpo@globalequityexchange.com</p>
                  <p><strong>General Privacy Inquiries:</strong> privacy@globalequityexchange.com</p>
                  <p><strong>Support:</strong> support@globalequityexchange.com</p>
                </div>
              </section>
            </div>
          </GlassPanel>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 flex flex-col sm:flex-row gap-4"
        >
          <Link href="/terms" className="btn-secondary">
            Terms of Service
          </Link>
          <Link href="/data-deletion" className="btn-secondary">
            Request Data Deletion
          </Link>
          <Link href="/security" className="btn-secondary">
            Security
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
