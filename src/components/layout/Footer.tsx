'use client';

import { Building2, ShieldCheck, Lock, FileText } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card/50">
      <div className="container-wide py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Building2 className="w-6 h-6 text-accent" />
              <span className="font-semibold text-lg">
                Global Equity Exchange
              </span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-md mb-6">
              Confidential deal flow for discerning investors. We connect qualified buyers with vetted business opportunities worldwide.
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <ShieldCheck className="w-4 h-4" />
                <span>Encrypted Data</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Lock className="w-4 h-4" />
                <span>Confidential Process</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-sm">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/marketplace" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Marketplace
                </Link>
              </li>
              <li>
                <Link href="/investors" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Investment Portal
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/security" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Security
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4 text-sm">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/risk-disclosure" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Risk Disclosure
                </Link>
              </li>
              <li>
                <Link href="/admin-login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Team Access
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">
              © {currentYear} Global Equity Exchange. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground text-center md:text-right max-w-lg">
              <FileText className="w-3 h-3 inline mr-1" />
              Information presented is illustrative. Listings may be confidential. This does not constitute investment advice.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
