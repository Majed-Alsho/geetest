import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth/auth-options";
import Profile from '@/views/Profile';
import { Layout } from '@/components/layout/Layout';
import { AnnouncementsBanner } from '@/components/announcements/AnnouncementsBanner';
import { SupportButton } from '@/components/support/SupportForm';
import { CookieConsent } from '@/components/legal/CookieConsent';

// Force dynamic rendering - this page requires authentication
export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  
  // Not authenticated - redirect to login
  if (!session?.user) {
    redirect('/login');
  }
  
  return (
    <Layout>
      <AnnouncementsBanner />
      <Profile />
      <SupportButton />
      <CookieConsent />
    </Layout>
  );
}
