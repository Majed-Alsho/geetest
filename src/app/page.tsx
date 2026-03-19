'use client';

import Home from '@/views/Home';
import { Layout } from '@/components/layout/Layout';
import { AnnouncementsBanner } from '@/components/announcements/AnnouncementsBanner';
import { SupportButton } from '@/components/support/SupportForm';
import { CookieConsent } from '@/components/legal/CookieConsent';

export default function HomePage() {
  return (
    <Layout>
      <AnnouncementsBanner />
      <Home />
      <SupportButton />
      <CookieConsent />
    </Layout>
  );
}
