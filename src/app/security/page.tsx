'use client';

import Security from '@/views/Security';
import { Layout } from '@/components/layout/Layout';
import { AnnouncementsBanner } from '@/components/announcements/AnnouncementsBanner';
import { SupportButton } from '@/components/support/SupportForm';
import { CookieConsent } from '@/components/legal/CookieConsent';

export default function SecurityPage() {
  return (
    <Layout>
      <AnnouncementsBanner />
      <Security />
      <SupportButton />
      <CookieConsent />
    </Layout>
  );
}
