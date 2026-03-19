'use client';

import ComparePage from '@/views/ComparePage';
import { Layout } from '@/components/layout/Layout';
import { AnnouncementsBanner } from '@/components/announcements/AnnouncementsBanner';
import { SupportButton } from '@/components/support/SupportForm';
import { CookieConsent } from '@/components/legal/CookieConsent';

export default function CompareRoute() {
  return (
    <Layout>
      <AnnouncementsBanner />
      <ComparePage />
      <SupportButton />
      <CookieConsent />
    </Layout>
  );
}
