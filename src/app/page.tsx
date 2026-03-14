'use client';

import { useNavigation } from '@/contexts/NavigationContext';
import Home from '@/pages/Home';
import Marketplace from '@/pages/Marketplace';
import ListingDetail from '@/pages/ListingDetail';
import ComparePage from '@/pages/ComparePage';
import CreateListing from '@/pages/CreateListing';
import Investors from '@/pages/Investors';
import InvestorProfile from '@/pages/InvestorProfile';
import KnowledgeBase from '@/pages/KnowledgeBase';
import HowItWorks from '@/pages/HowItWorks';
import Security from '@/pages/Security';
import Terms from '@/pages/Terms';
import Privacy from '@/pages/Privacy';
import RiskDisclosure from '@/pages/RiskDisclosure';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import AdminLogin from '@/pages/AdminLogin';
import AdminDashboard from '@/pages/AdminDashboard';
import Profile from '@/pages/Profile';
import DataDeletion from '@/pages/DataDeletion';
import ResetPassword from '@/pages/ResetPassword';
import NotFound from '@/pages/NotFound';
import { SupportButton } from '@/components/support/SupportForm';
import { Layout } from '@/components/layout/Layout';
import { CookieConsent } from '@/components/legal/CookieConsent';
import { AnnouncementsBanner } from '@/components/announcements/AnnouncementsBanner';

export default function Page() {
  const { currentView } = useNavigation();

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <Home />;
      case 'marketplace':
        return <Marketplace />;
      case 'listing-detail':
        return <ListingDetail />;
      case 'compare':
        return <ComparePage />;
      case 'create-listing':
        return <CreateListing />;
      case 'investors':
        return <Investors />;
      case 'investor-profile':
        return <InvestorProfile />;
      case 'knowledge-base':
        return <KnowledgeBase />;
      case 'how-it-works':
        return <HowItWorks />;
      case 'security':
        return <Security />;
      case 'terms':
        return <Terms />;
      case 'privacy':
        return <Privacy />;
      case 'risk-disclosure':
        return <RiskDisclosure />;
      case 'login':
        return <Login />;
      case 'signup':
        return <Signup />;
      case 'admin-login':
        return <AdminLogin />;
      case 'admin':
        return <AdminDashboard />;
      case 'profile':
        return <Profile />;
      case 'reset-password':
        return <ResetPassword />;
      case 'data-deletion':
        return <DataDeletion />;
      default:
        return <NotFound />;
    }
  };

  return (
    <Layout>
      <AnnouncementsBanner />
      {renderView()}
      <SupportButton />
      <CookieConsent />
    </Layout>
  );
}
