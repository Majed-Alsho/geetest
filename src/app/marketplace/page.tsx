'use client';

import Marketplace from '@/views/Marketplace';
import { Layout } from '@/components/layout/Layout';
import { AnnouncementsBanner } from '@/components/announcements/AnnouncementsBanner';
import { SupportButton } from '@/components/support/SupportForm';
import { CookieConsent } from '@/components/legal/CookieConsent';

export default function MarketplacePage() {
  return (
    <Layout>
      <AnnouncementsBanner />
      <Marketplace />
      <SupportButton />
      <CookieConsent />
    </Layout>
  );
}
