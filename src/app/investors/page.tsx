'use client';

import Investors from '@/views/Investors';
import { Layout } from '@/components/layout/Layout';
import { AnnouncementsBanner } from '@/components/announcements/AnnouncementsBanner';
import { SupportButton } from '@/components/support/SupportForm';
import { CookieConsent } from '@/components/legal/CookieConsent';

export default function InvestorsPage() {
  return (
    <Layout>
      <AnnouncementsBanner />
      <Investors />
      <SupportButton />
      <CookieConsent />
    </Layout>
  );
}
