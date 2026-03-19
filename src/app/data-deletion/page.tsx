'use client';

import DataDeletion from '@/views/DataDeletion';
import { Layout } from '@/components/layout/Layout';
import { SupportButton } from '@/components/support/SupportForm';
import { CookieConsent } from '@/components/legal/CookieConsent';

export default function DataDeletionPage() {
  return (
    <Layout>
      <DataDeletion />
      <SupportButton />
      <CookieConsent />
    </Layout>
  );
}
