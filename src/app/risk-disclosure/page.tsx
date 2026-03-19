'use client';

import RiskDisclosure from '@/views/RiskDisclosure';
import { Layout } from '@/components/layout/Layout';
import { SupportButton } from '@/components/support/SupportForm';
import { CookieConsent } from '@/components/legal/CookieConsent';

export default function RiskDisclosurePage() {
  return (
    <Layout>
      <RiskDisclosure />
      <SupportButton />
      <CookieConsent />
    </Layout>
  );
}
