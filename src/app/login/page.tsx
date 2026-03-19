'use client';

import Login from '@/views/Login';
import { Layout } from '@/components/layout/Layout';
import { SupportButton } from '@/components/support/SupportForm';
import { CookieConsent } from '@/components/legal/CookieConsent';

export default function LoginPage() {
  return (
    <Layout>
      <Login />
      <SupportButton />
      <CookieConsent />
    </Layout>
  );
}
