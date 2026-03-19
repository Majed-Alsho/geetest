'use client';

import AdminLogin from '@/views/AdminLogin';
import { Layout } from '@/components/layout/Layout';
import { SupportButton } from '@/components/support/SupportForm';
import { CookieConsent } from '@/components/legal/CookieConsent';

export default function AdminLoginPage() {
  return (
    <Layout>
      <AdminLogin />
      <SupportButton />
      <CookieConsent />
    </Layout>
  );
}
