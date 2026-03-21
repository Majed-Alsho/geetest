import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth/auth-options";
import AdminDashboard from '@/views/AdminDashboard';
import { Layout } from '@/components/layout/Layout';
import { AnnouncementsBanner } from '@/components/announcements/AnnouncementsBanner';
import { SupportButton } from '@/components/support/SupportForm';
import { CookieConsent } from '@/components/legal/CookieConsent';

// Force dynamic rendering - this page requires authentication
export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  // Safe session handling - catch decryption errors from malformed cookies
  let session = null;
  try {
    session = await getServerSession(authOptions);
  } catch (error) {
    // JWT_SESSION_ERROR: decryption operation failed
    // This happens when cookie is corrupted or exceeds size limit
    // Log the error and treat as unauthenticated - user will be redirected to login
    console.error('[AdminPage] Session error:', error instanceof Error ? error.message : 'Unknown error');
    // Clear any corrupted cookies by redirecting to admin login with a fresh state
    redirect('/admin-login?error=session_expired');
  }

  // Not authenticated - redirect to admin login
  if (!session?.user) {
    redirect('/admin-login');
  }
  
  // Check if user has admin role
  const adminRoles = ['ADMIN', 'SUPERADMIN', 'OWNER'];
  if (!adminRoles.includes(session.user.role || '')) {
    redirect('/');
  }
  
  return (
    <Layout>
      <AnnouncementsBanner />
      <AdminDashboard />
      <SupportButton />
      <CookieConsent />
    </Layout>
  );
}
