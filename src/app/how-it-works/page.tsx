'use client';

import HowItWorks from '@/views/HowItWorks';
import { Layout } from '@/components/layout/Layout';
import { AnnouncementsBanner } from '@/components/announcements/AnnouncementsBanner';
import { SupportButton } from '@/components/support/SupportForm';
import { CookieConsent } from '@/components/legal/CookieConsent';

export default function HowItWorksPage() {
  return (
    <Layout>
      <AnnouncementsBanner />
      <HowItWorks />
      <SupportButton />
      <CookieConsent />
    </Layout>
  );
}
