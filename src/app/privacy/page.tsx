'use client';

import Privacy from '@/views/Privacy';
import { Layout } from '@/components/layout/Layout';
import { SupportButton } from '@/components/support/SupportForm';
import { CookieConsent } from '@/components/legal/CookieConsent';

export default function PrivacyPage() {
  return (
    <Layout>
      <Privacy />
      <SupportButton />
      <CookieConsent />
    </Layout>
  );
}
