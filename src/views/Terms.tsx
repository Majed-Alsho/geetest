'use client';

import { motion } from 'framer-motion';
import { Link } from '@/components/Link';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { 
  ArrowLeft, 
  FileText, 
  Scale, 
  Users, 
  Shield, 
  AlertTriangle,
  CreditCard,
  Gavel,
  RefreshCw,
  Mail
} from 'lucide-react';

export default function Terms() {
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
              <FileText className="w-7 h-7 text-accent" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Terms of Service</h1>
              <p className="text-muted-foreground">Legal Agreement for Platform Use</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GlassPanel className="p-8">
            <div className="space-y-8">
              {/* Preamble */}
              <div className="bg-accent/5 p-6 rounded-xl border border-accent/20">
                <p className="text-muted-foreground">
                  <strong>Effective Date:</strong> January 2024<br />
                  <strong>Applicable Law:</strong> Laws of the European Union and Member State of your residence
                </p>
              </div>

              {/* Section 1: Introduction */}
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                    <Scale className="w-5 h-5 text-accent" />
                  </div>
                  <h2 className="text-xl font-semibold">1. Agreement to Terms</h2>
                </div>
                <div className="text-muted-foreground space-y-4">
                  <p>
                    Welcome to Global Equity Exchange. By accessing or using our platform, you agree to be bound 
                    by these Terms of Service (&quot;Terms&quot;), which constitute a legally binding agreement between you 
                    and Global Equity Exchange (&quot;Company&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;).
                  </p>
                  <p>
                    These Terms apply to all users of the platform, including without limitation users who are 
                    browsers, vendors, customers, merchants, and/or contributors of content. If you are using 
                    our platform on behalf of a company or other legal entity, you represent that you have the 
                    authority to bind such entity to these Terms.
                  </p>
                  <div className="bg-yellow-500/10 p-4 rounded-xl border border-yellow-500/20">
                    <p className="text-sm">
                      <strong>EU Consumer Notice:</strong> If you are a consumer residing in the European Union, 
                      you benefit from mandatory consumer protection laws that cannot be overridden by these Terms. 
                      Nothing in these Terms limits your rights under applicable EU consumer protection legislation.
                    </p>
                  </div>
                </div>
              </section>

              {/* Section 2: Definitions */}
              <section>
                <h2 className="text-xl font-semibold mb-4">2. Definitions</h2>
                <div className="text-muted-foreground space-y-3">
                  <div className="bg-secondary/30 p-4 rounded-xl">
                    <p><strong>&quot;Platform&quot;</strong> means the Global Equity Exchange website, applications, and services.</p>
                    <p><strong>&quot;Listing&quot;</strong> means any business opportunity posted on the Platform for potential acquisition.</p>
                    <p><strong>&quot;User&quot;</strong> means any individual or entity accessing the Platform.</p>
                    <p><strong>&quot;Seller&quot;</strong> means a User posting a Listing on the Platform.</p>
                    <p><strong>&quot;Buyer&quot;</strong> means a User interested in acquiring a business listed on the Platform.</p>
                    <p><strong>&quot;NDA&quot;</strong> means a Non-Disclosure Agreement required to access confidential business information.</p>
                  </div>
                </div>
              </section>

              {/* Section 3: Service Description */}
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-accent" />
                  </div>
                  <h2 className="text-xl font-semibold">3. Description of Services</h2>
                </div>
                <div className="text-muted-foreground space-y-4">
                  <p>Global Equity Exchange provides a digital marketplace platform that facilitates:</p>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Connection between business sellers and potential buyers</li>
                    <li>Secure NDA-protected document exchange</li>
                    <li>Verified listing services with financial due diligence</li>
                    <li>Communication tools for buyer-seller interactions</li>
                    <li>Market analytics and investment insights</li>
                  </ul>
                  <div className="bg-red-500/10 p-4 rounded-xl border border-red-500/20">
                    <p className="text-sm">
                      <strong>Important Disclaimer:</strong> We are not a broker, investment advisor, or financial 
                      intermediary. We do not verify the accuracy of all information provided by Sellers. All 
                      transactions are conducted at your own risk. You should conduct your own due diligence 
                      and seek professional advice before making any investment decisions.
                    </p>
                  </div>
                </div>
              </section>

              {/* Section 4: Account Registration */}
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-accent" />
                  </div>
                  <h2 className="text-xl font-semibold">4. Account Registration and Eligibility</h2>
                </div>
                <div className="text-muted-foreground space-y-4">
                  <p>To access certain features, you must register for an account. By registering, you represent that:</p>
                  <ul className="list-disc list-inside space-y-2">
                    <li>You are at least 18 years of age</li>
                    <li>You have the legal capacity to enter into a binding agreement</li>
                    <li>You will provide accurate, current, and complete information</li>
                    <li>You will maintain the security of your account credentials</li>
                    <li>You will promptly notify us of any unauthorized use</li>
                  </ul>
                  <p>
                    We reserve the right to refuse service, terminate accounts, or cancel orders at our sole discretion.
                  </p>
                </div>
              </section>

              {/* Section 5: Subscription and Fees */}
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-accent" />
                  </div>
                  <h2 className="text-xl font-semibold">5. Subscription and Fees</h2>
                </div>
                <div className="text-muted-foreground space-y-4">
                  <div className="bg-secondary/30 p-4 rounded-xl space-y-3">
                    <h4 className="font-medium text-foreground">Pricing Structure</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li><strong>Basic Access:</strong> €2.99/month - Browse verified listings</li>
                      <li><strong>Professional:</strong> €19.99/month - Full access + NDA capabilities</li>
                      <li><strong>Enterprise:</strong> Custom pricing - Dedicated support and API access</li>
                    </ul>
                  </div>
                  
                  <h4 className="font-medium text-foreground">EU Consumer Rights (14-Day Withdrawal)</h4>
                  <p>
                    Pursuant to Directive 2011/83/EU, consumers in the European Union have the right to withdraw 
                    from a distance contract within 14 days without giving any reason. The withdrawal period 
                    expires 14 days after the conclusion of the contract.
                  </p>
                  <div className="bg-secondary/30 p-4 rounded-xl">
                    <p className="text-sm">
                      <strong>Exception:</strong> The right of withdrawal does not apply if you have expressly 
                      requested that the service begins during the withdrawal period and you acknowledge that 
                      you lose your right of withdrawal once the service has been fully performed.
                    </p>
                  </div>

                  <h4 className="font-medium text-foreground">Cancellation Policy</h4>
                  <p>
                    You may cancel your subscription at any time through your account settings. Cancellation 
                    takes effect at the end of your current billing period. No refunds are provided for partial 
                    months, except as required by law.
                  </p>
                </div>
              </section>

              {/* Section 6: User Conduct */}
              <section>
                <h2 className="text-xl font-semibold mb-4">6. User Conduct and Prohibited Activities</h2>
                <div className="text-muted-foreground space-y-4">
                  <p>You agree not to:</p>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Provide false, misleading, or fraudulent information</li>
                    <li>Use the Platform for any illegal or unauthorized purpose</li>
                    <li>Violate any applicable laws or regulations</li>
                    <li>Infringe upon intellectual property rights of others</li>
                    <li>Circumvent NDA protections or confidentiality agreements</li>
                    <li>Attempt to gain unauthorized access to any systems</li>
                    <li>Interfere with or disrupt the Platform&apos;s operation</li>
                    <li>Harass, abuse, or harm other users</li>
                    <li>Create multiple accounts to circumvent restrictions</li>
                    <li>Use automated systems to access the Platform without permission</li>
                  </ul>
                </div>
              </section>

              {/* Section 7: Intellectual Property */}
              <section>
                <h2 className="text-xl font-semibold mb-4">7. Intellectual Property Rights</h2>
                <div className="text-muted-foreground space-y-4">
                  <p>
                    The Platform, including its original content, features, and functionality, is owned by 
                    Global Equity Exchange and is protected by international copyright, trademark, and other 
                    intellectual property laws.
                  </p>
                  <p>
                    Our trademarks and trade dress may not be used without our prior written consent. User-generated 
                    content remains the property of the respective users, though you grant us a non-exclusive, 
                    worldwide, royalty-free license to use, display, and distribute such content on the Platform.
                  </p>
                </div>
              </section>

              {/* Section 8: NDAs and Confidentiality */}
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-accent" />
                  </div>
                  <h2 className="text-xl font-semibold">8. Non-Disclosure Agreements</h2>
                </div>
                <div className="text-muted-foreground space-y-4">
                  <p>
                    Access to confidential business information requires execution of a Non-Disclosure Agreement (NDA). 
                    By signing an NDA through the Platform, you agree to:
                  </p>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Maintain strict confidentiality of all disclosed information</li>
                    <li>Use information solely for evaluating the potential transaction</li>
                    <li>Not disclose information to third parties without authorization</li>
                    <li>Return or destroy confidential materials upon request</li>
                    <li>Comply with all terms specified in the NDA</li>
                  </ul>
                  <p>
                    Breach of NDA may result in immediate account termination and legal action.
                  </p>
                </div>
              </section>

              {/* Section 9: Disclaimers */}
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-accent" />
                  </div>
                  <h2 className="text-xl font-semibold">9. Disclaimers and Limitations</h2>
                </div>
                <div className="text-muted-foreground space-y-4">
                  <p>
                    THE PLATFORM IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, 
                    EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF 
                    MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
                  </p>
                  <p>
                    We do not guarantee the accuracy, completeness, or usefulness of any Listing or other 
                    content on the Platform. All financial projections, valuations, and representations 
                    are provided by Sellers and have not been independently verified by us unless explicitly stated.
                  </p>
                  <div className="bg-secondary/30 p-4 rounded-xl">
                    <h4 className="font-medium text-foreground mb-2">Limitation of Liability</h4>
                    <p className="text-sm">
                      TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE FOR ANY INDIRECT, 
                      INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, 
                      LOSS OF PROFITS, DATA, OR OTHER INTANGIBLE LOSSES.
                    </p>
                  </div>
                  <div className="bg-blue-500/10 p-4 rounded-xl border border-blue-500/20">
                    <p className="text-sm">
                      <strong>EU Consumer Protection:</strong> The above limitations may not apply to you if you 
                      are a consumer in the European Union, where mandatory consumer protection laws may provide 
                      additional rights and remedies.
                    </p>
                  </div>
                </div>
              </section>

              {/* Section 10: Indemnification */}
              <section>
                <h2 className="text-xl font-semibold mb-4">10. Indemnification</h2>
                <div className="text-muted-foreground space-y-4">
                  <p>
                    You agree to indemnify, defend, and hold harmless Global Equity Exchange and its officers, 
                    directors, employees, and agents from any claims, damages, obligations, losses, liabilities, 
                    costs, and expenses arising from:
                  </p>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Your use of the Platform</li>
                    <li>Your violation of these Terms</li>
                    <li>Your violation of any third-party rights</li>
                    <li>Any content you submit to the Platform</li>
                  </ul>
                </div>
              </section>

              {/* Section 11: Dispute Resolution */}
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                    <Gavel className="w-5 h-5 text-accent" />
                  </div>
                  <h2 className="text-xl font-semibold">11. Dispute Resolution and Governing Law</h2>
                </div>
                <div className="text-muted-foreground space-y-4">
                  <div className="bg-secondary/30 p-4 rounded-xl">
                    <h4 className="font-medium text-foreground mb-2">For EU Consumers</h4>
                    <p className="text-sm mb-3">
                      In accordance with Regulation (EU) No 524/2013, the European Commission provides an online 
                      dispute resolution platform at{' '}
                      <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                        ec.europa.eu/consumers/odr
                      </a>.
                    </p>
                    <p className="text-sm">
                      Consumers may use this platform to resolve disputes related to online purchases and services 
                      without going to court. We are not obligated to participate in dispute resolution proceedings 
                      before a consumer arbitration body.
                    </p>
                  </div>

                  <h4 className="font-medium text-foreground">Online Dispute Resolution (EU)</h4>
                  <p>
                    Before initiating formal proceedings, parties should attempt to resolve disputes amicably 
                    through good faith negotiations. You may contact us at legal@globalequityexchange.com for 
                    dispute resolution.
                  </p>

                  <h4 className="font-medium text-foreground">Governing Law and Jurisdiction</h4>
                  <p>
                    These Terms shall be governed by and construed in accordance with the laws of the jurisdiction 
                    in which you reside, without regard to its conflict of law provisions. For consumers, this 
                    means the laws of your habitual residence. For businesses, this means the laws of the country 
                    where your principal place of business is located.
                  </p>
                </div>
              </section>

              {/* Section 12: Termination */}
              <section>
                <h2 className="text-xl font-semibold mb-4">12. Termination</h2>
                <div className="text-muted-foreground space-y-4">
                  <p>
                    We may terminate or suspend your account and access to the Platform immediately, without 
                    prior notice, for any reason, including breach of these Terms. Upon termination:
                  </p>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Your right to use the Platform will cease immediately</li>
                    <li>We may delete your account and associated data</li>
                    <li>Provisions that should survive termination will remain in effect</li>
                    <li>NDAs and confidentiality obligations remain binding</li>
                  </ul>
                </div>
              </section>

              {/* Section 13: Changes */}
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                    <RefreshCw className="w-5 h-5 text-accent" />
                  </div>
                  <h2 className="text-xl font-semibold">13. Changes to Terms</h2>
                </div>
                <div className="text-muted-foreground space-y-4">
                  <p>
                    We reserve the right to modify these Terms at any time. We will notify users of material 
                    changes by posting the updated Terms on the Platform and updating the &quot;Effective Date&quot; above. 
                    For EU consumers, we will provide at least 15 days&apos; notice for material changes that affect 
                    your rights.
                  </p>
                  <p>
                    Your continued use of the Platform after changes become effective constitutes acceptance of 
                    the revised Terms. If you do not agree to the modified Terms, you must discontinue use of 
                    the Platform.
                  </p>
                </div>
              </section>

              {/* Section 14: Severability */}
              <section>
                <h2 className="text-xl font-semibold mb-4">14. Severability</h2>
                <div className="text-muted-foreground space-y-4">
                  <p>
                    If any provision of these Terms is found to be unenforceable or invalid, that provision 
                    will be limited or eliminated to the minimum extent necessary, and the remaining provisions 
                    will remain in full force and effect.
                  </p>
                </div>
              </section>

              {/* Section 15: Contact */}
              <section className="bg-accent/5 p-6 rounded-xl border border-accent/20">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-accent" />
                  15. Contact Information
                </h2>
                <div className="text-muted-foreground space-y-2">
                  <p><strong>Legal Department:</strong> legal@globalequityexchange.com</p>
                  <p><strong>General Support:</strong> support@globalequityexchange.com</p>
                  <p><strong>Data Protection:</strong> dpo@globalequityexchange.com</p>
                  <p><strong>Registered Office:</strong> [Company Address]</p>
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
          <Link href="/privacy" className="btn-secondary">
            Privacy Policy
          </Link>
          <Link href="/risk-disclosure" className="btn-secondary">
            Risk Disclosure
          </Link>
          <Link href="/security" className="btn-secondary">
            Security
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
