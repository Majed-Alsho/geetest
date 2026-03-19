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
  const session = await getServerSession(authOptions);
  
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
