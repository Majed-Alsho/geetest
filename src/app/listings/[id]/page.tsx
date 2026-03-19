'use client';

import ListingDetail from '@/views/ListingDetail';
import { Layout } from '@/components/layout/Layout';
import { AnnouncementsBanner } from '@/components/announcements/AnnouncementsBanner';
import { SupportButton } from '@/components/support/SupportForm';
import { CookieConsent } from '@/components/legal/CookieConsent';

export default function ListingDetailPage() {
  return (
    <Layout>
      <AnnouncementsBanner />
      <ListingDetail />
      <SupportButton />
      <CookieConsent />
    </Layout>
  );
}
