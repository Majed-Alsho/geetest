'use client';

import { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
  onNavigateToLogin?: () => void;
  onNavigateHome?: () => void;
}

export function ProtectedRoute({ children, requireAdmin = false, onNavigateToLogin, onNavigateHome }: ProtectedRouteProps) {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated) {
    // Redirect to login
    if (onNavigateToLogin) {
      onNavigateToLogin();
    }
    return null;
  }

  if (requireAdmin && !isAdmin) {
    // Non-admin trying to access admin area
    if (onNavigateHome) {
      onNavigateHome();
    }
    return null;
  }

  return <>{children}</>;
}
