'use client';

import Signup from '@/views/Signup';
import { Layout } from '@/components/layout/Layout';
import { SupportButton } from '@/components/support/SupportForm';
import { CookieConsent } from '@/components/legal/CookieConsent';

export default function SignupPage() {
  return (
    <Layout>
      <Signup />
      <SupportButton />
      <CookieConsent />
    </Layout>
  );
}
