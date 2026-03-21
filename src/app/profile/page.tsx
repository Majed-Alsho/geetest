import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { authOptions } from "@/lib/auth/auth-options";
import Profile from '@/views/Profile';
import { Layout } from '@/components/layout/Layout';
import { AnnouncementsBanner } from '@/components/announcements/AnnouncementsBanner';
import { SupportButton } from '@/components/support/SupportForm';
import { CookieConsent } from '@/components/legal/CookieConsent';

// Force dynamic rendering - this page requires authentication
export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  // Safe session handling - catch decryption errors from malformed cookies
  let session = null;
  try {
    session = await getServerSession(authOptions);
  } catch (error) {
    // JWT_SESSION_ERROR: decryption operation failed
    // This happens when cookie is corrupted or exceeds size limit
    console.error('[ProfilePage] Session error:', error instanceof Error ? error.message : 'Unknown error');
    // Forcefully delete corrupted NextAuth session cookies
    try {
      const cookieStore = await cookies();
      cookieStore.delete('next-auth.session-token');
      cookieStore.delete('__Secure-next-auth.session-token');
    } catch {}
    // Clear any corrupted cookies by redirecting to login with a fresh state
    redirect('/login?error=session_expired');
  }

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
