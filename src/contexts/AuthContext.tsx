'use client';

import { createContext, useContext, ReactNode, useState, useEffect, useCallback } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export type AdminRole = 'owner' | 'superadmin' | 'admin';
export type UserRole = 'user' | AdminRole;

export interface UserSocialLinks {
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  instagram?: string;
}

export interface UserPreferences {
  emailNotifications: boolean;
  pushNotifications: boolean;
  marketingEmails: boolean;
  showProfile: boolean;
  showContactInfo: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  clientNumber?: string;
  createdAt: Date;
  savedListings?: string[];
  alerts?: { category?: string; region?: string; maxPrice?: number }[];
  isSuspended?: boolean;
  suspensionReason?: string;
  lastLoginAt?: Date;
  loginCount?: number;
  twoFactorEnabled?: boolean;
  twoFactorSecret?: string;
  avatar?: string;
  bio?: string;
  phone?: string;
  website?: string;
  company?: string;
  jobTitle?: string;
  location?: string;
  socialLinks?: UserSocialLinks;
  preferences?: UserPreferences;
}

export interface UserSession {
  id: string;
  userId: string;
  deviceName: string;
  browser: string;
  os: string;
  ipAddress: string;
  location?: string;
  createdAt: Date;
  lastActiveAt: Date;
  isCurrentSession: boolean;
  userAgent: string;
}

export interface PasswordResetToken {
  id: string;
  userId: string;
  userEmail: string;
  token: string;
  createdAt: Date;
  expiresAt: Date;
  used: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isOwner: boolean;
  canEditListings: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  adminLogin: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  saveListing: (listingId: string) => void;
  unsaveListing: (listingId: string) => void;
  isListingSaved: (listingId: string) => boolean;
  addAlert: (alert: { category?: string; region?: string; maxPrice?: number }) => void;
  removeAlert: (index: number) => void;
  updateUserProfile: (data: {
    name?: string;
    email?: string;
    avatar?: string;
    bio?: string;
    phone?: string;
    website?: string;
    company?: string;
    jobTitle?: string;
    location?: string;
    socialLinks?: UserSocialLinks;
    preferences?: UserPreferences;
  }) => Promise<{ success: boolean; error?: string }>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  getAllUsers: () => User[];
  getUserById: (userId: string) => User | undefined;
  getUserByClientNumber: (clientNumber: string) => User | undefined;
  suspendUser: (userId: string, reason: string) => boolean;
  unsuspendUser: (userId: string) => boolean;
  deleteUser: (userId: string) => boolean;
  updateUserRole: (userId: string, role: UserRole) => boolean;
  createPasswordResetToken: (userId: string) => PasswordResetToken | null;
  resetPasswordWithToken: (token: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  getPendingResetTokens: () => PasswordResetToken[];
  exportUserData: () => Promise<{ success: boolean; data?: string; error?: string }>;
  generateTwoFactorSecret: () => { secret: string; qrCodeUrl: string };
  enableTwoFactor: (secret: string, verificationCode: string) => Promise<{ success: boolean; error?: string }>;
  disableTwoFactor: () => Promise<{ success: boolean; error?: string }>;
  verifyTwoFactor: (code: string) => boolean;
  getSessions: () => UserSession[];
  revokeSession: (sessionId: string) => Promise<{ success: boolean; error?: string }>;
  revokeAllOtherSessions: () => Promise<{ success: boolean; error?: string }>;
  createCurrentSession: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Helper to convert NextAuth session user to our User type
function sessionToUser(session: any): User | null {
  if (!session?.user) return null;
  
  // Normalize role to lowercase for frontend use
  const normalizedRole = session.user.role?.toLowerCase() || 'user';
  
  return {
    id: session.user.id || '',
    email: session.user.email || '',
    name: session.user.name || '',
    role: normalizedRole as UserRole,
    clientNumber: session.user.clientNumber,
    createdAt: new Date(session.user.createdAt || Date.now()),
    savedListings: session.user.savedListings || [],
    alerts: session.user.alerts || [],
    isSuspended: session.user.isSuspended,
    suspensionReason: session.user.suspensionReason,
    lastLoginAt: session.user.lastLoginAt ? new Date(session.user.lastLoginAt) : undefined,
    loginCount: session.user.loginCount,
    twoFactorEnabled: session.user.twoFactorEnabled,
    avatar: session.user.avatar,
    bio: session.user.bio,
    phone: session.user.phone,
    website: session.user.website,
    company: session.user.company,
    jobTitle: session.user.jobTitle,
    location: session.user.location,
    socialLinks: session.user.socialLinks,
    preferences: session.user.preferences,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Sync user state with NextAuth session
  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      setUser(sessionToUser(session));
    } else if (status === 'unauthenticated') {
      setUser(null);
    }
    setIsInitialized(true);
  }, [session, status]);

  // Login using NextAuth credentials provider
  const login = useCallback(async (email: string, password: string) => {
    try {
      console.log('[AuthContext] Attempting login for:', email);
      
      const result = await signIn('credentials', {
        email: email.toLowerCase().trim(),
        password,
        redirect: false,
      });

      console.log('[AuthContext] SignIn result:', { 
        ok: result?.ok, 
        error: result?.error,
        status: result?.status 
      });

      if (result?.error) {
        // Map NextAuth errors to user-friendly messages
        const errorMessages: Record<string, string> = {
          'CredentialsSignin': 'Invalid email or password. Please try again.',
          'SessionRequired': 'Please sign in to access this page.',
          'Default': 'Login failed. Please check your credentials and try again.',
        };
        
        const errorMessage = errorMessages[result.error] || result.error;
        console.log('[AuthContext] Login error:', result.error, '->', errorMessage);
        return { success: false, error: errorMessage };
      }

      if (result?.ok) {
        console.log('[AuthContext] Login successful, updating session...');
        // Force session update
        await update();
        return { success: true };
      }

      return { success: false, error: 'Login failed. Please try again.' };
    } catch (error) {
      console.error('[AuthContext] Login error:', error);
      return { success: false, error: 'An unexpected error occurred. Please try again.' };
    }
  }, [update]);

  // Signup - call API then login
  const signup = useCallback(async (name: string, email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || 'Registration failed' };
      }

      // Auto-login after successful registration
      return login(email, password);
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: 'An unexpected error occurred. Please try again.' };
    }
  }, [login]);

  // Admin login using NextAuth
  const adminLogin = useCallback(async (username: string, password: string) => {
    try {
      // Admin login uses the same credentials provider but with admin email format
      const email = `${username}@globalequityexchange.com`;
      
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
        isAdminLogin: 'true',
      });

      if (result?.error) {
        return { success: false, error: result.error };
      }

      if (result?.ok) {
        await update();
        return { success: true };
      }

      return { success: false, error: 'Admin login failed. Please try again.' };
    } catch (error) {
      console.error('Admin login error:', error);
      return { success: false, error: 'An unexpected error occurred. Please try again.' };
    }
  }, [update]);

  // Logout using NextAuth
  const logout = useCallback(() => {
    signOut({ redirect: false }).then(() => {
      router.push('/');
    });
  }, [router]);

  // Save listing to user's saved list
  const saveListing = useCallback(async (listingId: string) => {
    if (!user) return;
    
    try {
      const response = await fetch('/api/users/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'saveListing',
          listingId,
        }),
      });

      if (response.ok) {
        const savedListings = [...(user.savedListings || [])];
        if (!savedListings.includes(listingId)) {
          savedListings.push(listingId);
          setUser({ ...user, savedListings });
        }
      }
    } catch (error) {
      console.error('Save listing error:', error);
    }
  }, [user]);

  // Unsave listing
  const unsaveListing = useCallback(async (listingId: string) => {
    if (!user) return;
    
    try {
      const response = await fetch('/api/users/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'unsaveListing',
          listingId,
        }),
      });

      if (response.ok) {
        const savedListings = (user.savedListings || []).filter(id => id !== listingId);
        setUser({ ...user, savedListings });
      }
    } catch (error) {
      console.error('Unsave listing error:', error);
    }
  }, [user]);

  // Check if listing is saved
  const isListingSaved = useCallback((listingId: string): boolean => {
    return user?.savedListings?.includes(listingId) || false;
  }, [user]);

  // Add alert
  const addAlert = useCallback(async (alert: { category?: string; region?: string; maxPrice?: number }) => {
    if (!user) return;
    
    try {
      const response = await fetch('/api/users/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'addAlert',
          alert,
        }),
      });

      if (response.ok) {
        const alerts = [...(user.alerts || []), alert];
        setUser({ ...user, alerts });
      }
    } catch (error) {
      console.error('Add alert error:', error);
    }
  }, [user]);

  // Remove alert
  const removeAlert = useCallback(async (index: number) => {
    if (!user) return;
    
    try {
      const response = await fetch('/api/users/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'removeAlert',
          alertIndex: index,
        }),
      });

      if (response.ok) {
        const alerts = (user.alerts || []).filter((_, i) => i !== index);
        setUser({ ...user, alerts });
      }
    } catch (error) {
      console.error('Remove alert error:', error);
    }
  }, [user]);

  // Update user profile
  const updateUserProfile = useCallback(async (data: {
    name?: string;
    email?: string;
    avatar?: string;
    bio?: string;
    phone?: string;
    website?: string;
    company?: string;
    jobTitle?: string;
    location?: string;
    socialLinks?: UserSocialLinks;
    preferences?: UserPreferences;
  }) => {
    if (!user) {
      return { success: false, error: 'Not authenticated.' };
    }

    try {
      // Use the dedicated profile route which handles email-based lookup
      const response = await fetch('/api/users/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      // Handle non-JSON responses gracefully (e.g., HTML error pages)
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response received:', text.substring(0, 200));
        return { success: false, error: 'Server returned an invalid response. Please try again.' };
      }

      const result = await response.json();

      if (!response.ok) {
        // Handle both string errors and object errors with message property
        const errorMessage = typeof result.error === 'string' 
          ? result.error 
          : (result.error?.message || 'Failed to update profile');
        return { success: false, error: errorMessage };
      }

      // Update local state with the response data
      if (result.data) {
        setUser({ ...user, ...result.data });
      } else {
        setUser({ ...user, ...data });
      }
      await update();

      return { success: true };
    } catch (error) {
      console.error('Update profile error:', error);
      return { success: false, error: 'An unexpected error occurred.' };
    }
  }, [user, update]);

  // Change password
  const changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    if (!user) {
      return { success: false, error: 'Not authenticated.' };
    }

    try {
      // Use the dedicated profile route which handles email-based lookup
      const response = await fetch('/api/users/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'changePassword',
          currentPassword,
          newPassword,
        }),
      });

      // Handle non-JSON responses gracefully (e.g., HTML error pages)
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response received:', text.substring(0, 200));
        return { success: false, error: 'Server returned an invalid response. Please try again.' };
      }

      const result = await response.json();

      if (!response.ok) {
        // Handle both string errors and object errors with message property
        const errorMessage = typeof result.error === 'string' 
          ? result.error 
          : (result.error?.message || 'Failed to change password');
        return { success: false, error: errorMessage };
      }

      return { success: true };
    } catch (error) {
      console.error('Change password error:', error);
      return { success: false, error: 'An unexpected error occurred.' };
    }
  }, [user]);

  // Admin: Get all users
  const getAllUsers = useCallback((): User[] => {
    // This should be called from admin pages that fetch from API
    return [];
  }, []);

  // Admin: Get user by ID
  const getUserById = useCallback((userId: string): User | undefined => {
    if (user?.id === userId) return user;
    return undefined;
  }, [user]);

  // Admin: Get user by client number
  const getUserByClientNumber = useCallback((clientNumber: string): User | undefined => {
    if (user?.clientNumber?.toUpperCase() === clientNumber.toUpperCase()) return user;
    return undefined;
  }, [user]);

  // Admin: Suspend user
  const suspendUser = useCallback(async (userId: string, reason: string) => {
    if (!user?.role || !['admin', 'superadmin', 'owner'].includes(user.role)) return false;

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'suspend',
          reason,
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('Suspend user error:', error);
      return false;
    }
  }, [user]);

  // Admin: Unsuspend user
  const unsuspendUser = useCallback(async (userId: string) => {
    if (!user?.role || !['admin', 'superadmin', 'owner'].includes(user.role)) return false;

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'unsuspend' }),
      });

      return response.ok;
    } catch (error) {
      console.error('Unsuspend user error:', error);
      return false;
    }
  }, [user]);

  // Admin: Delete user
  const deleteUser = useCallback(async (userId: string) => {
    if (!user?.role || !['superadmin', 'owner'].includes(user.role)) return false;

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      });

      return response.ok;
    } catch (error) {
      console.error('Delete user error:', error);
      return false;
    }
  }, [user]);

  // Admin: Update user role
  const updateUserRole = useCallback(async (userId: string, role: UserRole) => {
    if (!user?.role || !['superadmin', 'owner'].includes(user.role)) return false;

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'updateRole', role }),
      });

      return response.ok;
    } catch (error) {
      console.error('Update user role error:', error);
      return false;
    }
  }, [user]);

  // Password reset token functions
  const createPasswordResetToken = useCallback((userId: string): PasswordResetToken | null => {
    // This should be handled by API
    return null;
  }, []);

  const resetPasswordWithToken = useCallback(async (token: string, newPassword: string) => {
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      });

      const result = await response.json();

      if (!response.ok) {
        // Handle both string errors and object errors with message property
        const errorMessage = typeof result.error === 'string' 
          ? result.error 
          : (result.error?.message || 'Failed to reset password');
        return { success: false, error: errorMessage };
      }

      return { success: true };
    } catch (error) {
      console.error('Reset password error:', error);
      return { success: false, error: 'An unexpected error occurred.' };
    }
  }, []);

  const getPendingResetTokens = useCallback((): PasswordResetToken[] => {
    return [];
  }, []);

  // Export user data (GDPR)
  const exportUserData = useCallback(async () => {
    if (!user) {
      return { success: false, error: 'Not authenticated.' };
    }

    try {
      const response = await fetch('/api/users/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'exportData' }),
      });
      const result = await response.json();

      if (!response.ok) {
        // Handle both string errors and object errors with message property
        const errorMessage = typeof result.error === 'string' 
          ? result.error 
          : (result.error?.message || 'Failed to export data');
        return { success: false, error: errorMessage };
      }

      return { success: true, data: JSON.stringify(result.data, null, 2) };
    } catch (error) {
      console.error('Export data error:', error);
      return { success: false, error: 'An unexpected error occurred.' };
    }
  }, [user]);

  // Two-factor authentication
  const generateTwoFactorSecret = useCallback((): { secret: string; qrCodeUrl: string } => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let secret = '';
    for (let i = 0; i < 16; i++) {
      secret += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    const userEmail = user?.email || 'user@example.com';
    const issuer = 'GlobalEquityExchange';
    const qrCodeUrl = `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(userEmail)}?secret=${secret}&issuer=${encodeURIComponent(issuer)}&algorithm=SHA1&digits=6&period=30`;

    return { secret, qrCodeUrl };
  }, [user]);

  const enableTwoFactor = useCallback(async (secret: string, verificationCode: string) => {
    if (!user) {
      return { success: false, error: 'Not authenticated.' };
    }

    try {
      const response = await fetch('/api/users/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'enable2FA',
          secret,
          verificationCode,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        // Handle both string errors and object errors with message property
        const errorMessage = typeof result.error === 'string' 
          ? result.error 
          : (result.error?.message || 'Failed to enable 2FA');
        return { success: false, error: errorMessage };
      }

      setUser({ ...user, twoFactorEnabled: true, twoFactorSecret: secret });
      return { success: true };
    } catch (error) {
      console.error('Enable 2FA error:', error);
      return { success: false, error: 'An unexpected error occurred.' };
    }
  }, [user]);

  const disableTwoFactor = useCallback(async () => {
    if (!user) {
      return { success: false, error: 'Not authenticated.' };
    }

    try {
      const response = await fetch('/api/users/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'disable2FA' }),
      });

      const result = await response.json();

      if (!response.ok) {
        // Handle both string errors and object errors with message property
        const errorMessage = typeof result.error === 'string' 
          ? result.error 
          : (result.error?.message || 'Failed to disable 2FA');
        return { success: false, error: errorMessage };
      }

      setUser({ ...user, twoFactorEnabled: false, twoFactorSecret: undefined });
      return { success: true };
    } catch (error) {
      console.error('Disable 2FA error:', error);
      return { success: false, error: 'An unexpected error occurred.' };
    }
  }, [user]);

  const verifyTwoFactor = useCallback((code: string): boolean => {
    if (!user?.twoFactorEnabled || !user.twoFactorSecret) {
      return true;
    }
    return /^\d{6}$/.test(code);
  }, [user]);

  // Session management
  const createCurrentSession = useCallback(() => {
    // Session is automatically created by NextAuth
  }, []);

  const getSessions = useCallback((): UserSession[] => {
    // Sessions are managed by NextAuth
    return [];
  }, []);

  const revokeSession = useCallback(async (sessionId: string) => {
    try {
      const response = await fetch(`/api/sessions/${sessionId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!response.ok) {
        // Handle both string errors and object errors with message property
        const errorMessage = typeof result.error === 'string' 
          ? result.error 
          : (result.error?.message || 'Failed to revoke session');
        return { success: false, error: errorMessage };
      }

      return { success: true };
    } catch (error) {
      console.error('Revoke session error:', error);
      return { success: false, error: 'An unexpected error occurred.' };
    }
  }, []);

  const revokeAllOtherSessions = useCallback(async () => {
    try {
      const response = await fetch('/api/sessions/revoke-all', {
        method: 'POST',
      });

      const result = await response.json();

      if (!response.ok) {
        // Handle both string errors and object errors with message property
        const errorMessage = typeof result.error === 'string' 
          ? result.error 
          : (result.error?.message || 'Failed to revoke sessions');
        return { success: false, error: errorMessage };
      }

      return { success: true };
    } catch (error) {
      console.error('Revoke all sessions error:', error);
      return { success: false, error: 'An unexpected error occurred.' };
    }
  }, []);

  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin' || user?.role === 'owner';
  const isSuperAdmin = user?.role === 'superadmin' || user?.role === 'owner';
  const isOwner = user?.role === 'owner';
  const canEditListings = user?.role === 'superadmin' || user?.role === 'owner';

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin,
        isSuperAdmin,
        isOwner,
        canEditListings,
        login,
        signup,
        adminLogin,
        logout,
        saveListing,
        unsaveListing,
        isListingSaved,
        addAlert,
        removeAlert,
        updateUserProfile,
        changePassword,
        getAllUsers,
        getUserById,
        getUserByClientNumber,
        suspendUser,
        unsuspendUser,
        deleteUser,
        updateUserRole,
        createPasswordResetToken,
        resetPasswordWithToken,
        getPendingResetTokens,
        exportUserData,
        generateTwoFactorSecret,
        enableTwoFactor,
        disableTwoFactor,
        verifyTwoFactor,
        getSessions,
        revokeSession,
        revokeAllOtherSessions,
        createCurrentSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    return {
      user: null,
      isAuthenticated: false,
      isAdmin: false,
      isSuperAdmin: false,
      isOwner: false,
      canEditListings: false,
      login: async () => ({ success: false, error: 'Not available during SSR' }),
      signup: async () => ({ success: false, error: 'Not available during SSR' }),
      adminLogin: async () => ({ success: false, error: 'Not available during SSR' }),
      logout: () => {},
      saveListing: () => {},
      unsaveListing: () => {},
      isListingSaved: () => false,
      addAlert: () => {},
      removeAlert: () => {},
      updateUserProfile: async () => ({ success: false, error: 'Not available during SSR' }),
      changePassword: async () => ({ success: false, error: 'Not available during SSR' }),
      getAllUsers: () => [],
      getUserById: () => undefined,
      getUserByClientNumber: () => undefined,
      suspendUser: () => false,
      unsuspendUser: () => false,
      deleteUser: () => false,
      updateUserRole: () => false,
      createPasswordResetToken: () => null,
      resetPasswordWithToken: async () => ({ success: false, error: 'Not available during SSR' }),
      getPendingResetTokens: () => [],
      exportUserData: async () => ({ success: false, error: 'Not available during SSR' }),
      generateTwoFactorSecret: () => ({ secret: '', qrCodeUrl: '' }),
      enableTwoFactor: async () => ({ success: false, error: 'Not available during SSR' }),
      disableTwoFactor: async () => ({ success: false, error: 'Not available during SSR' }),
      verifyTwoFactor: () => false,
      getSessions: () => [],
      revokeSession: async () => ({ success: false, error: 'Not available during SSR' }),
      revokeAllOtherSessions: async () => ({ success: false, error: 'Not available during SSR' }),
      createCurrentSession: () => {},
    };
  }
  return context;
}
