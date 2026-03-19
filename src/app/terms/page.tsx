'use client';

import Terms from '@/views/Terms';
import { Layout } from '@/components/layout/Layout';
import { SupportButton } from '@/components/support/SupportForm';
import { CookieConsent } from '@/components/legal/CookieConsent';

export default function TermsPage() {
  return (
    <Layout>
      <Terms />
      <SupportButton />
      <CookieConsent />
    </Layout>
  );
}
