'use client';

import KnowledgeBase from '@/views/KnowledgeBase';
import { Layout } from '@/components/layout/Layout';
import { AnnouncementsBanner } from '@/components/announcements/AnnouncementsBanner';
import { SupportButton } from '@/components/support/SupportForm';
import { CookieConsent } from '@/components/legal/CookieConsent';

export default function KnowledgeBasePage() {
  return (
    <Layout>
      <AnnouncementsBanner />
      <KnowledgeBase />
      <SupportButton />
      <CookieConsent />
    </Layout>
  );
}
