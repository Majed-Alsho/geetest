'use client';

import { createContext, useContext, ReactNode, useState, useEffect, useCallback } from 'react';

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
  clientNumber?: string; // Only for regular users (not admins)
  createdAt: Date;
  savedListings?: string[];
  alerts?: { category?: string; region?: string; maxPrice?: number }[];
  isSuspended?: boolean;
  suspensionReason?: string;
  lastLoginAt?: Date;
  loginCount?: number;
  twoFactorEnabled?: boolean;
  twoFactorSecret?: string;
  // New profile fields
  avatar?: string; // Base64 data URL for profile picture
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
  // User profile functions
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
  // Admin functions
  getAllUsers: () => User[];
  getUserById: (userId: string) => User | undefined;
  getUserByClientNumber: (clientNumber: string) => User | undefined;
  suspendUser: (userId: string, reason: string) => boolean;
  unsuspendUser: (userId: string) => boolean;
  deleteUser: (userId: string) => boolean;
  updateUserRole: (userId: string, role: UserRole) => boolean;
  // Password reset functions
  createPasswordResetToken: (userId: string) => PasswordResetToken | null;
  resetPasswordWithToken: (token: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  getPendingResetTokens: () => PasswordResetToken[];
  // Data export function (GDPR)
  exportUserData: () => Promise<{ success: boolean; data?: string; error?: string }>;
  // Two-factor authentication
  generateTwoFactorSecret: () => { secret: string; qrCodeUrl: string };
  enableTwoFactor: (secret: string, verificationCode: string) => Promise<{ success: boolean; error?: string }>;
  disableTwoFactor: () => Promise<{ success: boolean; error?: string }>;
  verifyTwoFactor: (code: string) => boolean;
  // Session management
  getSessions: () => UserSession[];
  revokeSession: (sessionId: string) => Promise<{ success: boolean; error?: string }>;
  revokeAllOtherSessions: () => Promise<{ success: boolean; error?: string }>;
  createCurrentSession: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Storage keys
const USERS_KEY = 'gee_users';
const SESSION_KEY = 'gee_session';
const SESSIONS_KEY = 'gee_user_sessions';
const RESET_TOKENS_KEY = 'gee_password_reset_tokens';

// Admin credentials
const ADMIN_ACCOUNTS: { username: string; password: string; role: AdminRole; name: string }[] = [
  { username: 'Majed', password: 'PureLegend!1122!0405!', role: 'owner', name: 'Majed' },
  { username: 'owner', password: 'Owner2024!', role: 'owner', name: 'Platform Owner' },
  { username: 'superadmin', password: 'SuperAdmin2024!', role: 'superadmin', name: 'Super Administrator' },
  { username: 'admin', password: 'GlobalEquity2024!', role: 'admin', name: 'Administrator' },
];

// Generate a unique client number
function generateClientNumber(): string {
  const year = new Date().getFullYear().toString().slice(-2);
  const random = Math.random().toString(36).substr(2, 8).toUpperCase();
  return `GEE-${year}-${random}`;
}

// Pre-seeded user accounts
const SEED_USERS: Record<string, { password: string; user: User }> = {
  'majed1.alshoghri@gmail.com': {
    password: 'PureLegend!1122!0405!',
    user: {
      id: 'user-majed-001',
      email: 'majed1.alshoghri@gmail.com',
      name: 'Majed Alshoghri',
      role: 'user',
      clientNumber: 'GEE-24-ALSH001',
      createdAt: new Date('2024-01-01'),
      savedListings: [],
      alerts: [],
      loginCount: 0,
    }
  }
};

// Helper functions for localStorage
function getStoredUsers(): Record<string, { password: string; user: User }> {
  if (typeof window === 'undefined') return SEED_USERS;
  try {
    const data = localStorage.getItem(USERS_KEY);
    const storedUsers = data ? JSON.parse(data) : {};
    return { ...storedUsers, ...SEED_USERS };
  } catch {
    return SEED_USERS;
  }
}

function saveUsers(users: Record<string, { password: string; user: User }>) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch (e) {
    console.error('Failed to save users:', e);
  }
}

function getStoredSession(): User | null {
  if (typeof window === 'undefined') return null;
  try {
    const data = localStorage.getItem(SESSION_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

function saveSessionToStorage(user: User | null) {
  if (typeof window === 'undefined') return;
  try {
    if (user) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  } catch (e) {
    console.error('Failed to save session:', e);
  }
}

// Session management helpers
function getStoredSessions(): UserSession[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(SESSIONS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveSessions(sessions: UserSession[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
  } catch (e) {
    console.error('Failed to save sessions:', e);
  }
}

function parseUserAgent(userAgent: string): { browser: string; os: string; deviceName: string } {
  // Simple user agent parsing
  let browser = 'Unknown Browser';
  let os = 'Unknown OS';
  let deviceName = 'Unknown Device';
  
  // Detect browser
  if (userAgent.includes('Firefox')) browser = 'Firefox';
  else if (userAgent.includes('Edg')) browser = 'Edge';
  else if (userAgent.includes('Chrome')) browser = 'Chrome';
  else if (userAgent.includes('Safari')) browser = 'Safari';
  else if (userAgent.includes('Opera') || userAgent.includes('OPR')) browser = 'Opera';
  
  // Detect OS
  if (userAgent.includes('Windows')) os = 'Windows';
  else if (userAgent.includes('Mac')) os = 'macOS';
  else if (userAgent.includes('Linux')) os = 'Linux';
  else if (userAgent.includes('Android')) os = 'Android';
  else if (userAgent.includes('iPhone') || userAgent.includes('iPad')) os = 'iOS';
  
  // Device name
  if (userAgent.includes('Mobile')) deviceName = 'Mobile Device';
  else if (userAgent.includes('Tablet')) deviceName = 'Tablet';
  else deviceName = 'Desktop';
  
  return { browser, os, deviceName };
}

// Lazy initializer function - runs only once on mount
function getInitialUser(): User | null {
  if (typeof window === 'undefined') return null;
  return getStoredSession();
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(getInitialUser);

  // Listen for storage changes (multi-tab support)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === SESSION_KEY) {
        setUser(getStoredSession());
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const users = getStoredUsers();
      const normalizedEmail = email.toLowerCase().trim();
      const userRecord = users[normalizedEmail];

      if (!userRecord) {
        return { success: false, error: 'No account found with this email.' };
      }

      if (userRecord.password !== password) {
        return { success: false, error: 'Invalid password.' };
      }

      if (userRecord.user.isSuspended) {
        return { success: false, error: `Account suspended: ${userRecord.user.suspensionReason || 'No reason provided'}` };
      }

      // Update login stats
      const updatedUser = {
        ...userRecord.user,
        lastLoginAt: new Date(),
        loginCount: (userRecord.user.loginCount || 0) + 1,
      };
      users[normalizedEmail].user = updatedUser;
      saveUsers(users);

      setUser(updatedUser);
      saveSessionToStorage(updatedUser);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'An unexpected error occurred. Please try again.' };
    }
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const users = getStoredUsers();
      const normalizedEmail = email.toLowerCase().trim();

      if (users[normalizedEmail]) {
        return { success: false, error: 'An account with this email already exists.' };
      }

      const newUser: User = {
        id: crypto.randomUUID(),
        email: normalizedEmail,
        name: name.trim(),
        role: 'user',
        clientNumber: generateClientNumber(),
        createdAt: new Date(),
        savedListings: [],
        alerts: [],
        loginCount: 1,
        lastLoginAt: new Date(),
      };

      users[normalizedEmail] = { password, user: newUser };
      saveUsers(users);
      setUser(newUser);
      saveSessionToStorage(newUser);
      return { success: true };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: 'An unexpected error occurred. Please try again.' };
    }
  }, []);

  const adminLogin = useCallback(async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const validAdmin = ADMIN_ACCOUNTS.find(
        (admin) => admin.username === username && admin.password === password
      );

      if (!validAdmin) {
        return { success: false, error: 'Invalid admin credentials.' };
      }

      const adminUser: User = {
        id: `admin-${validAdmin.role}-${Date.now()}`,
        email: `${validAdmin.username}@globalequityexchange.com`,
        name: validAdmin.name,
        role: validAdmin.role,
        createdAt: new Date(),
        lastLoginAt: new Date(),
        loginCount: 1,
      };

      setUser(adminUser);
      saveSessionToStorage(adminUser);
      return { success: true };
    } catch (error) {
      console.error('Admin login error:', error);
      return { success: false, error: 'An unexpected error occurred. Please try again.' };
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    saveSessionToStorage(null);
  }, []);

  const saveListing = useCallback((listingId: string) => {
    setUser(currentUser => {
      if (!currentUser) return currentUser;
      
      const savedListings = [...(currentUser.savedListings || [])];
      if (!savedListings.includes(listingId)) {
        savedListings.push(listingId);
        const updatedUser = { ...currentUser, savedListings };
        saveSessionToStorage(updatedUser);
        
        const users = getStoredUsers();
        const normalizedEmail = currentUser.email.toLowerCase().trim();
        if (users[normalizedEmail]) {
          users[normalizedEmail].user = updatedUser;
          saveUsers(users);
        }
        return updatedUser;
      }
      return currentUser;
    });
  }, []);

  const unsaveListing = useCallback((listingId: string) => {
    setUser(currentUser => {
      if (!currentUser) return currentUser;
      
      const savedListings = (currentUser.savedListings || []).filter(id => id !== listingId);
      const updatedUser = { ...currentUser, savedListings };
      saveSessionToStorage(updatedUser);
      
      const users = getStoredUsers();
      const normalizedEmail = currentUser.email.toLowerCase().trim();
      if (users[normalizedEmail]) {
        users[normalizedEmail].user = updatedUser;
        saveUsers(users);
      }
      return updatedUser;
    });
  }, []);

  const isListingSaved = useCallback((listingId: string): boolean => {
    return user?.savedListings?.includes(listingId) || false;
  }, [user]);

  const addAlert = useCallback((alert: { category?: string; region?: string; maxPrice?: number }) => {
    setUser(currentUser => {
      if (!currentUser) return currentUser;
      
      const alerts = [...(currentUser.alerts || []), alert];
      const updatedUser = { ...currentUser, alerts };
      saveSessionToStorage(updatedUser);
      
      const users = getStoredUsers();
      const normalizedEmail = currentUser.email.toLowerCase().trim();
      if (users[normalizedEmail]) {
        users[normalizedEmail].user = updatedUser;
        saveUsers(users);
      }
      return updatedUser;
    });
  }, []);

  const removeAlert = useCallback((index: number) => {
    setUser(currentUser => {
      if (!currentUser) return currentUser;
      
      const alerts = (currentUser.alerts || []).filter((_, i) => i !== index);
      const updatedUser = { ...currentUser, alerts };
      saveSessionToStorage(updatedUser);
      
      const users = getStoredUsers();
      const normalizedEmail = currentUser.email.toLowerCase().trim();
      if (users[normalizedEmail]) {
        users[normalizedEmail].user = updatedUser;
        saveUsers(users);
      }
      return updatedUser;
    });
  }, []);

  // User profile functions
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
  }): Promise<{ success: boolean; error?: string }> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      if (!user) {
        return { success: false, error: 'Not authenticated.' };
      }
      
      const users = getStoredUsers();
      const currentEmail = user.email.toLowerCase().trim();
      const userRecord = users[currentEmail];
      
      if (!userRecord) {
        return { success: false, error: 'User not found.' };
      }
      
      // If changing email, check if new email is already taken
      if (data.email && data.email.toLowerCase() !== currentEmail) {
        const newEmail = data.email.toLowerCase().trim();
        if (users[newEmail]) {
          return { success: false, error: 'An account with this email already exists.' };
        }
        
        // Move user record to new email
        const updatedUser = {
          ...user,
          ...data,
          email: newEmail,
        };
        
        delete users[currentEmail];
        users[newEmail] = { password: userRecord.password, user: updatedUser };
        saveUsers(users);
        
        setUser(updatedUser);
        saveSessionToStorage(updatedUser);
      } else {
        // Update profile fields
        const updatedUser = { ...user };
        
        // Update each field if provided
        if (data.name !== undefined) updatedUser.name = data.name;
        if (data.avatar !== undefined) updatedUser.avatar = data.avatar;
        if (data.bio !== undefined) updatedUser.bio = data.bio;
        if (data.phone !== undefined) updatedUser.phone = data.phone;
        if (data.website !== undefined) updatedUser.website = data.website;
        if (data.company !== undefined) updatedUser.company = data.company;
        if (data.jobTitle !== undefined) updatedUser.jobTitle = data.jobTitle;
        if (data.location !== undefined) updatedUser.location = data.location;
        if (data.socialLinks !== undefined) updatedUser.socialLinks = data.socialLinks;
        if (data.preferences !== undefined) updatedUser.preferences = data.preferences;
        
        users[currentEmail].user = updatedUser;
        saveUsers(users);
        
        setUser(updatedUser);
        saveSessionToStorage(updatedUser);
      }
      
      return { success: true };
    } catch (error) {
      console.error('Update profile error:', error);
      return { success: false, error: 'An unexpected error occurred.' };
    }
  }, [user]);

  const changePassword = useCallback(async (currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      if (!user) {
        return { success: false, error: 'Not authenticated.' };
      }
      
      const users = getStoredUsers();
      const currentEmail = user.email.toLowerCase().trim();
      const userRecord = users[currentEmail];
      
      if (!userRecord) {
        return { success: false, error: 'User not found.' };
      }
      
      // Verify current password
      if (userRecord.password !== currentPassword) {
        return { success: false, error: 'Current password is incorrect.' };
      }
      
      // Validate new password
      if (newPassword.length < 8) {
        return { success: false, error: 'New password must be at least 8 characters.' };
      }
      
      // Update password
      users[currentEmail].password = newPassword;
      saveUsers(users);
      
      return { success: true };
    } catch (error) {
      console.error('Change password error:', error);
      return { success: false, error: 'An unexpected error occurred.' };
    }
  }, [user]);

  // Admin functions
  const getAllUsers = useCallback((): User[] => {
    const users = getStoredUsers();
    return Object.values(users).map(record => record.user);
  }, []);

  const getUserById = useCallback((userId: string): User | undefined => {
    const users = getStoredUsers();
    return Object.values(users).find(record => record.user.id === userId)?.user;
  }, []);

  const getUserByClientNumber = useCallback((clientNumber: string): User | undefined => {
    const users = getStoredUsers();
    return Object.values(users).find(record => 
      record.user.clientNumber?.toUpperCase() === clientNumber.toUpperCase()
    )?.user;
  }, []);

  const suspendUser = useCallback((userId: string, reason: string): boolean => {
    const users = getStoredUsers();
    const email = Object.keys(users).find(key => users[key].user.id === userId);
    
    if (email) {
      users[email].user = {
        ...users[email].user,
        isSuspended: true,
        suspensionReason: reason,
      };
      saveUsers(users);
      return true;
    }
    return false;
  }, []);

  const unsuspendUser = useCallback((userId: string): boolean => {
    const users = getStoredUsers();
    const email = Object.keys(users).find(key => users[key].user.id === userId);
    
    if (email) {
      users[email].user = {
        ...users[email].user,
        isSuspended: false,
        suspensionReason: undefined,
      };
      saveUsers(users);
      return true;
    }
    return false;
  }, []);

  // Password reset token functions
  const getStoredResetTokens = useCallback((): PasswordResetToken[] => {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(RESET_TOKENS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }, []);

  const saveResetTokens = useCallback((tokens: PasswordResetToken[]) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(RESET_TOKENS_KEY, JSON.stringify(tokens));
    } catch (e) {
      console.error('Failed to save reset tokens:', e);
    }
  }, []);

  const createPasswordResetToken = useCallback((userId: string): PasswordResetToken | null => {
    const users = getStoredUsers();
    const email = Object.keys(users).find(key => users[key].user.id === userId);
    
    if (!email) return null;
    
    const token = crypto.randomUUID();
    const now = new Date();
    const expiresAt = new Date(now);
    expiresAt.setHours(expiresAt.getHours() + 24); // 24 hour expiry
    
    const resetToken: PasswordResetToken = {
      id: crypto.randomUUID(),
      userId,
      userEmail: email,
      token,
      createdAt: now,
      expiresAt,
      used: false,
    };
    
    const tokens = getStoredResetTokens();
    // Remove any existing tokens for this user
    const filteredTokens = tokens.filter(t => t.userId !== userId);
    filteredTokens.push(resetToken);
    saveResetTokens(filteredTokens);
    
    return resetToken;
  }, [getStoredResetTokens, saveResetTokens]);

  const resetPasswordWithToken = useCallback(async (token: string, newPassword: string): Promise<{ success: boolean; error?: string }> => {
    const tokens = getStoredResetTokens();
    const resetToken = tokens.find(t => t.token === token);
    
    if (!resetToken) {
      return { success: false, error: 'Invalid reset token.' };
    }
    
    if (resetToken.used) {
      return { success: false, error: 'This reset link has already been used.' };
    }
    
    if (new Date(resetToken.expiresAt) < new Date()) {
      return { success: false, error: 'This reset link has expired.' };
    }
    
    const users = getStoredUsers();
    const userRecord = users[resetToken.userEmail];
    
    if (!userRecord) {
      return { success: false, error: 'User not found.' };
    }
    
    // Update password
    users[resetToken.userEmail].password = newPassword;
    saveUsers(users);
    
    // Mark token as used
    const updatedTokens = tokens.map(t => 
      t.token === token ? { ...t, used: true } : t
    );
    saveResetTokens(updatedTokens);
    
    return { success: true };
  }, [getStoredResetTokens, saveResetTokens]);

  const getPendingResetTokens = useCallback((): PasswordResetToken[] => {
    const tokens = getStoredResetTokens();
    const now = new Date();
    return tokens.filter(t => !t.used && new Date(t.expiresAt) > now);
  }, [getStoredResetTokens]);

  // Export user data (GDPR Right to Access - Article 15)
  const exportUserData = useCallback(async (): Promise<{ success: boolean; data?: string; error?: string }> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (!user) {
        return { success: false, error: 'Not authenticated.' };
      }
      
      const users = getStoredUsers();
      const currentEmail = user.email.toLowerCase().trim();
      const userRecord = users[currentEmail];
      
      if (!userRecord) {
        return { success: false, error: 'User not found.' };
      }
      
      // Collect all user data
      const exportData = {
        exportDate: new Date().toISOString(),
        exportVersion: '1.0',
        user: {
          id: userRecord.user.id,
          email: userRecord.user.email,
          name: userRecord.user.name,
          role: userRecord.user.role,
          clientNumber: userRecord.user.clientNumber,
          createdAt: userRecord.user.createdAt,
          lastLoginAt: userRecord.user.lastLoginAt,
          loginCount: userRecord.user.loginCount,
          savedListings: userRecord.user.savedListings || [],
          alerts: userRecord.user.alerts || [],
        },
        // Note: Password is intentionally NOT included for security
        accountStatus: {
          isSuspended: userRecord.user.isSuspended || false,
          suspensionReason: userRecord.user.suspensionReason,
        },
        legalBasis: {
          gdprArticle: 'Article 15 - Right of access by the data subject',
          dataController: 'Global Equity Exchange',
          retentionPeriod: 'Data retained for the duration of account existence plus 30 days',
        },
      };
      
      return { 
        success: true, 
        data: JSON.stringify(exportData, null, 2) 
      };
    } catch (error) {
      console.error('Export data error:', error);
      return { success: false, error: 'An unexpected error occurred.' };
    }
  }, [user]);

  // Generate a TOTP secret for 2FA setup
  const generateTwoFactorSecret = useCallback((): { secret: string; qrCodeUrl: string } => {
    // Generate a random base32 secret (simplified for demo)
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

  // Enable 2FA after verification
  const enableTwoFactor = useCallback(async (secret: string, verificationCode: string): Promise<{ success: boolean; error?: string }> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      if (!user) {
        return { success: false, error: 'Not authenticated.' };
      }
      
      // In a real implementation, we would verify the TOTP code against the secret
      // For demo purposes, accept any 6-digit code
      if (!/^\d{6}$/.test(verificationCode)) {
        return { success: false, error: 'Invalid verification code. Please enter a 6-digit code.' };
      }
      
      const users = getStoredUsers();
      const currentEmail = user.email.toLowerCase().trim();
      
      if (users[currentEmail]) {
        const updatedUser = {
          ...user,
          twoFactorEnabled: true,
          twoFactorSecret: secret,
        };
        
        users[currentEmail].user = updatedUser;
        saveUsers(users);
        setUser(updatedUser);
        saveSessionToStorage(updatedUser);
        
        return { success: true };
      }
      
      return { success: false, error: 'Failed to enable 2FA.' };
    } catch (error) {
      console.error('Enable 2FA error:', error);
      return { success: false, error: 'An unexpected error occurred.' };
    }
  }, [user]);

  // Disable 2FA
  const disableTwoFactor = useCallback(async (): Promise<{ success: boolean; error?: string }> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      if (!user) {
        return { success: false, error: 'Not authenticated.' };
      }
      
      const users = getStoredUsers();
      const currentEmail = user.email.toLowerCase().trim();
      
      if (users[currentEmail]) {
        const updatedUser = {
          ...user,
          twoFactorEnabled: false,
          twoFactorSecret: undefined,
        };
        
        users[currentEmail].user = updatedUser;
        saveUsers(users);
        setUser(updatedUser);
        saveSessionToStorage(updatedUser);
        
        return { success: true };
      }
      
      return { success: false, error: 'Failed to disable 2FA.' };
    } catch (error) {
      console.error('Disable 2FA error:', error);
      return { success: false, error: 'An unexpected error occurred.' };
    }
  }, [user]);

  // Verify 2FA code (for login flow)
  const verifyTwoFactor = useCallback((code: string): boolean => {
    if (!user?.twoFactorEnabled || !user.twoFactorSecret) {
      return true; // No 2FA enabled, skip verification
    }
    
    // In a real implementation, this would verify the TOTP code
    // For demo purposes, accept any 6-digit code
    return /^\d{6}$/.test(code);
  }, [user]);

  // Session management functions
  const createCurrentSession = useCallback(() => {
    if (typeof window === 'undefined' || !user) return;
    
    const userAgent = navigator.userAgent;
    const { browser, os, deviceName } = parseUserAgent(userAgent);
    
    const newSession: UserSession = {
      id: `session-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 5)}`,
      userId: user.id,
      deviceName,
      browser,
      os,
      ipAddress: '192.168.1.x', // In production, this would be the real IP
      location: 'Unknown Location', // In production, this would be geolocated
      createdAt: new Date(),
      lastActiveAt: new Date(),
      isCurrentSession: true,
      userAgent,
    };
    
    const sessions = getStoredSessions();
    // Mark all other sessions as not current
    const updatedSessions = sessions.map(s => ({ ...s, isCurrentSession: false }));
    // Add new session
    updatedSessions.push(newSession);
    saveSessions(updatedSessions);
  }, [user]);

  const getSessions = useCallback((): UserSession[] => {
    if (!user) return [];
    const sessions = getStoredSessions();
    return sessions.filter(s => s.userId === user.id);
  }, [user]);

  const revokeSession = useCallback(async (sessionId: string): Promise<{ success: boolean; error?: string }> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      if (!user) {
        return { success: false, error: 'Not authenticated.' };
      }
      
      const sessions = getStoredSessions();
      const session = sessions.find(s => s.id === sessionId);
      
      if (!session) {
        return { success: false, error: 'Session not found.' };
      }
      
      if (session.isCurrentSession) {
        return { success: false, error: 'Cannot revoke your current session. Use logout instead.' };
      }
      
      const updatedSessions = sessions.filter(s => s.id !== sessionId);
      saveSessions(updatedSessions);
      
      return { success: true };
    } catch (error) {
      console.error('Revoke session error:', error);
      return { success: false, error: 'An unexpected error occurred.' };
    }
  }, [user]);

  const revokeAllOtherSessions = useCallback(async (): Promise<{ success: boolean; error?: string }> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      if (!user) {
        return { success: false, error: 'Not authenticated.' };
      }
      
      const sessions = getStoredSessions();
      const updatedSessions = sessions.filter(s => s.userId !== user.id || s.isCurrentSession);
      saveSessions(updatedSessions);
      
      return { success: true };
    } catch (error) {
      console.error('Revoke all sessions error:', error);
      return { success: false, error: 'An unexpected error occurred.' };
    }
  }, [user]);

  const deleteUser = useCallback((userId: string): boolean => {
    const users = getStoredUsers();
    const email = Object.keys(users).find(key => users[key].user.id === userId);
    
    if (email && users[email].user.role === 'user') {
      delete users[email];
      saveUsers(users);
      return true;
    }
    return false;
  }, []);

  const updateUserRole = useCallback((userId: string, role: UserRole): boolean => {
    const users = getStoredUsers();
    const email = Object.keys(users).find(key => users[key].user.id === userId);
    
    if (email) {
      users[email].user.role = role;
      // Remove client number if upgrading to admin
      if (role !== 'user') {
        users[email].user.clientNumber = undefined;
      } else if (!users[email].user.clientNumber) {
        users[email].user.clientNumber = generateClientNumber();
      }
      saveUsers(users);
      return true;
    }
    return false;
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
        // Session management
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
