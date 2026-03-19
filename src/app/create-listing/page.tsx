'use client';

import { Suspense } from 'react';
import CreateListing from '@/views/CreateListing';
import { Layout } from '@/components/layout/Layout';
import { AnnouncementsBanner } from '@/components/announcements/AnnouncementsBanner';
import { SupportButton } from '@/components/support/SupportForm';
import { CookieConsent } from '@/components/legal/CookieConsent';

function CreateListingFallback() {
  return (
    <section className="section-padding">
      <div className="container-wide max-w-3xl">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-secondary rounded w-1/4"></div>
          <div className="h-64 bg-secondary rounded"></div>
          <div className="h-48 bg-secondary rounded"></div>
          <div className="h-32 bg-secondary rounded"></div>
        </div>
      </div>
    </section>
  );
}

export default function CreateListingPage() {
  return (
    <Layout>
      <AnnouncementsBanner />
      <Suspense fallback={<CreateListingFallback />}>
        <CreateListing />
      </Suspense>
      <SupportButton />
      <CookieConsent />
    </Layout>
  );
}
