'use client';

import ResetPassword from '@/views/ResetPassword';
import { Layout } from '@/components/layout/Layout';
import { SupportButton } from '@/components/support/SupportForm';
import { CookieConsent } from '@/components/legal/CookieConsent';

export default function ResetPasswordPage() {
  return (
    <Layout>
      <ResetPassword />
      <SupportButton />
      <CookieConsent />
    </Layout>
  );
}
