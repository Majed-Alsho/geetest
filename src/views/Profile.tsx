'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Lock, 
  Shield, 
  Bell, 
  Trash2, 
  Save, 
  Heart,
  AlertTriangle,
  Check,
  Eye,
  EyeOff,
  LogOut,
  Ticket,
  Clock,
  MessageCircle,
  Copy,
  Building2,
  Edit,
  Plus,
  Rocket,
  Download,
  Smartphone,
  QrCode,
  Key,
  Phone,
  Globe,
  MapPin,
  Briefcase,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  Camera,
  FileText
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

import { GlassPanel } from '@/components/ui/GlassPanel';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth, UserSocialLinks, UserPreferences } from '@/contexts/AuthContext';

import { useListings } from '@/contexts/ListingContext';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { formatCurrency } from '@/lib/data';
import { cn } from '@/lib/utils';
import { UserPromotions } from '@/components/promote/UserPromotions';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional().or(z.literal('')),
  phone: z.string().max(20).optional().or(z.literal('')),
  website: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  company: z.string().max(100).optional().or(z.literal('')),
  jobTitle: z.string().max(100).optional().or(z.literal('')),
  location: z.string().max(200).optional().or(z.literal('')),
  linkedin: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  twitter: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  facebook: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  instagram: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

export default function Profile() {
  const [activeTab, setActiveTab] = useState<'profile' | 'listings' | 'promotions' | 'security' | 'notifications' | 'danger'>('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const { user, logout, updateUserProfile, changePassword, exportUserData, 
          generateTwoFactorSecret, enableTwoFactor, disableTwoFactor,
          getSessions, revokeSession, revokeAllOtherSessions } = useAuth();
  const router = useRouter();
  const { getUserListings, deleteListing, isLoading: listingsLoading } = useListings();

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      bio: user?.bio || '',
      phone: user?.phone || '',
      website: user?.website || '',
      company: user?.company || '',
      jobTitle: user?.jobTitle || '',
      location: user?.location || '',
      linkedin: user?.socialLinks?.linkedin || '',
      twitter: user?.socialLinks?.twitter || '',
      facebook: user?.socialLinks?.facebook || '',
      instagram: user?.socialLinks?.instagram || '',
    },
  });

  // Initialize avatar preview
  useState(() => {
    if (user?.avatar) {
      setAvatarPreview(user.avatar);
    }
  });

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  // Get user's listings
  const myListings = user ? getUserListings(user.id) : [];

  // Preferences state
  const [preferences, setPreferences] = useState<UserPreferences>(
    user?.preferences || {
      emailNotifications: true,
      pushNotifications: true,
      marketingEmails: false,
      showProfile: true,
      showContactInfo: false,
    }
  );

  // Handle avatar upload
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast.error('Invalid file type', { description: 'Please upload a JPEG, PNG, or WebP image.' });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('File too large', { description: 'Maximum file size is 2MB.' });
      return;
    }

    // Show local preview immediately for better UX
    const localPreview = URL.createObjectURL(file);
    setAvatarPreview(localPreview);

    try {
      // Step 1: Upload to /api/upload first to get a proper URL
      const formData = new FormData();
      formData.append('file', file);
      
      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      const uploadResult = await uploadResponse.json();
      
      if (!uploadResponse.ok || !uploadResult.success) {
        // Extract error message safely
        const uploadError = typeof uploadResult.error === 'string' 
          ? uploadResult.error 
          : (uploadResult.error?.message || 'Failed to upload image');
        toast.error('Upload failed', { description: uploadError });
        // Revert preview on upload failure
        setAvatarPreview(user?.avatar || null);
        URL.revokeObjectURL(localPreview);
        return;
      }
      
      const avatarUrl = uploadResult.data.url;
      
      // Step 2: Update profile with the uploaded URL
      const result = await updateUserProfile({ avatar: avatarUrl });
      if (result.success) {
        toast.success('Avatar updated', { description: 'Your profile picture has been updated.' });
        // Update preview with server URL
        setAvatarPreview(avatarUrl);
      } else {
        // Safely extract error message - handle both string and object errors
        const errorMsg = typeof result.error === 'string' 
          ? result.error 
          : (result.error?.message || 'Please try again.');
        toast.error('Failed to update avatar', { description: errorMsg });
        // Revert preview on profile update failure
        setAvatarPreview(user?.avatar || null);
      }
      
      // Clean up the local preview URL
      URL.revokeObjectURL(localPreview);
    } catch (error) {
      console.error('Avatar upload error:', error);
      toast.error('Upload failed', { 
        description: error instanceof Error ? error.message : 'An unexpected error occurred.' 
      });
      // Revert preview on error
      setAvatarPreview(user?.avatar || null);
      URL.revokeObjectURL(localPreview);
    }
  };

  const onProfileSubmit = async (data: ProfileFormData) => {
    setIsUpdating(true);
    try {
      // Build social links object
      const socialLinks: UserSocialLinks = {
        linkedin: data.linkedin,
        twitter: data.twitter,
        facebook: data.facebook,
        instagram: data.instagram,
      };

      const result = await updateUserProfile({
        name: data.name,
        email: data.email,
        bio: data.bio,
        phone: data.phone,
        website: data.website,
        company: data.company,
        jobTitle: data.jobTitle,
        location: data.location,
        socialLinks,
      });
      
      if (result.success) {
        toast.success('Profile updated', {
          description: 'Your profile has been updated successfully.',
        });
      } else {
        // Safely extract error message - handle both string and object errors
        const errorMsg = typeof result.error === 'string' 
          ? result.error 
          : (result.error?.message || 'Failed to update profile.');
        toast.error('Update failed', {
          description: errorMsg,
        });
      }
    } catch (error) {
      toast.error('Update failed', {
        description: error instanceof Error ? error.message : 'An unexpected error occurred.',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle preferences change
  const handlePreferenceChange = async (key: keyof UserPreferences, value: boolean) => {
    const newPreferences = { ...preferences, [key]: value };
    setPreferences(newPreferences);
    
    const result = await updateUserProfile({ preferences: newPreferences });
    if (result.success) {
      toast.success('Preferences updated');
    }
  };

  const onPasswordSubmit = async (data: PasswordFormData) => {
    setIsChangingPassword(true);
    try {
      const result = await changePassword(data.currentPassword, data.newPassword);
      if (result.success) {
        toast.success('Password changed', {
          description: 'Your password has been changed successfully.',
        });
        passwordForm.reset();
      } else {
        // Safely extract error message - handle both string and object errors
        const errorMsg = typeof result.error === 'string' 
          ? result.error 
          : (result.error?.message || 'Failed to change password.');
        toast.error('Password change failed', {
          description: errorMsg,
        });
      }
    } catch (error) {
      toast.error('Password change failed', {
        description: error instanceof Error ? error.message : 'An unexpected error occurred.',
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleDeleteListing = async (listingId: string, listingTitle: string) => {
    if (!user) return;
    
    if (confirm(`Are you sure you want to delete "${listingTitle}"? This cannot be undone.`)) {
      const result = await deleteListing(listingId, user.id);
      if (result.success) {
        toast.success('Listing deleted', {
          description: 'Your listing has been deleted successfully.',
        });
      } else {
        // Safely extract error message - handle both string and object errors
        const errorMsg = typeof result.error === 'string' 
          ? result.error 
          : (result.error?.message || 'Failed to delete listing.');
        toast.error('Delete failed', {
          description: errorMsg,
        });
      }
    }
  };

  const [isExporting, setIsExporting] = useState(false);
  
  // 2FA state
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [twoFASecret, setTwoFASecret] = useState<{ secret: string; qrCodeUrl: string } | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [is2FALoading, setIs2FALoading] = useState(false);
  
  const handleEnable2FA = () => {
    const secret = generateTwoFactorSecret();
    setTwoFASecret(secret);
    setShow2FAModal(true);
    setVerificationCode('');
  };
  
  const handleConfirm2FA = async () => {
    if (!twoFASecret || !verificationCode) return;
    
    setIs2FALoading(true);
    try {
      const result = await enableTwoFactor(twoFASecret.secret, verificationCode);
      if (result.success) {
        toast.success('2FA enabled', {
          description: 'Two-factor authentication is now active on your account.',
        });
        setShow2FAModal(false);
        setTwoFASecret(null);
        setVerificationCode('');
      } else {
        // Safely extract error message - handle both string and object errors
        const errorMsg = typeof result.error === 'string' 
          ? result.error 
          : (result.error?.message || 'Invalid verification code.');
        toast.error('Verification failed', {
          description: errorMsg,
        });
      }
    } catch (error) {
      toast.error('Failed to enable 2FA', {
        description: error instanceof Error ? error.message : 'Please try again.',
      });
    } finally {
      setIs2FALoading(false);
    }
  };
  
  const handleDisable2FA = async () => {
    if (!confirm('Are you sure you want to disable two-factor authentication?')) return;
    
    setIs2FALoading(true);
    try {
      const result = await disableTwoFactor();
      if (result.success) {
        toast.success('2FA disabled', {
          description: 'Two-factor authentication has been disabled.',
        });
      } else {
        toast.error('Failed to disable 2FA');
      }
    } catch (error) {
      toast.error('Failed to disable 2FA', {
        description: error instanceof Error ? error.message : 'Please try again.',
      });
    } finally {
      setIs2FALoading(false);
    }
  };
  
  const handleExportData = async () => {
    setIsExporting(true);
    try {
      const result = await exportUserData();
      if (result.success && result.data) {
        // Create and download the file
        const blob = new Blob([result.data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `gee-data-export-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        toast.success('Data exported', {
          description: 'Your personal data has been downloaded as a JSON file.',
        });
      } else {
        // Safely extract error message - handle both string and object errors
        const errorMsg = typeof result.error === 'string' 
          ? result.error 
          : (result.error?.message || 'Failed to export data.');
        toast.error('Export failed', {
          description: errorMsg,
        });
      }
    } catch (error) {
      toast.error('Export failed', {
        description: error instanceof Error ? error.message : 'An unexpected error occurred.',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
    toast.success('Logged out', {
      description: 'You have been logged out successfully.',
    });
  };

  const handleDeleteAccount = () => {
    // In a real app, this would trigger account deletion process
    toast.error('Account deletion requested', {
      description: 'Please contact support to complete account deletion.',
    });
  };

  const tabs = [
    { id: 'profile' as const, label: 'Profile', icon: User },
    { id: 'listings' as const, label: 'My Listings', icon: Building2, badge: myListings.length },
    { id: 'promotions' as const, label: 'Promotions', icon: Rocket },
    { id: 'security' as const, label: 'Security', icon: Shield },
    { id: 'notifications' as const, label: 'Notifications', icon: Bell },
    { id: 'danger' as const, label: 'Danger Zone', icon: AlertTriangle },
  ];

  if (!user) {
    return (
      <div className="section-padding min-h-[80vh] flex items-center justify-center">
        <GlassPanel className="p-8 text-center max-w-md">
          <User className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-semibold mb-2">Not Signed In</h1>
          <p className="text-muted-foreground mb-6">
            Please sign in to access your profile.
          </p>
          <Link href="/login" className="btn-accent">
            Sign In
          </Link>
        </GlassPanel>
      </div>
    );
  }

  return (
    <div className="section-padding min-h-[80vh]">
      <div className="container-narrow">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-semibold mb-2">Account Settings</h1>
          <p className="text-muted-foreground">
            Manage your profile, security settings, and preferences.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <GlassPanel className="p-4">
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-accent/10 text-accent'
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </GlassPanel>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3"
          >
            <GlassPanel className="p-6">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">Profile Information</h2>
                  
                  {/* Avatar Section */}
                  <div className="flex items-center gap-6 mb-8 pb-8 border-b border-border">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full bg-accent/10 flex items-center justify-center overflow-hidden">
                        {avatarPreview || user.avatar ? (
                          <img 
                            src={avatarPreview || user.avatar} 
                            alt={user.name} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-12 h-12 text-accent" />
                        )}
                      </div>
                      <label className="absolute bottom-0 right-0 w-8 h-8 bg-accent rounded-full flex items-center justify-center cursor-pointer hover:bg-accent/90 transition-colors">
                        <Camera className="w-4 h-4 text-accent-foreground" />
                        <input 
                          type="file" 
                          className="hidden" 
                          accept="image/jpeg,image/png,image/webp"
                          onChange={handleAvatarChange}
                        />
                      </label>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-medium">{user.name}</h3>
                      <p className="text-muted-foreground">{user.email}</p>
                      {user.role !== 'user' && (
                        <span className="inline-block mt-1 text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-full capitalize">
                          {user.role}
                        </span>
                      )}
                      <p className="text-xs text-muted-foreground mt-2">
                        Click the camera icon to update your profile picture
                      </p>
                    </div>
                  </div>

                  <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                    {/* Basic Info */}
                    <div className="space-y-4">
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Basic Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input
                              id="name"
                              className="pl-10"
                              {...profileForm.register('name')}
                            />
                          </div>
                          {profileForm.formState.errors.name && (
                            <p className="text-sm text-destructive">
                              {profileForm.formState.errors.name.message}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input
                              id="email"
                              type="email"
                              className="pl-10"
                              {...profileForm.register('email')}
                            />
                          </div>
                          {profileForm.formState.errors.email && (
                            <p className="text-sm text-destructive">
                              {profileForm.formState.errors.email.message}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input
                              id="phone"
                              type="tel"
                              className="pl-10"
                              placeholder="+1 (555) 000-0000"
                              {...profileForm.register('phone')}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="location">Location</Label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input
                              id="location"
                              className="pl-10"
                              placeholder="City, Country"
                              {...profileForm.register('location')}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          placeholder="Tell us about yourself..."
                          rows={3}
                          {...profileForm.register('bio')}
                        />
                        <p className="text-xs text-muted-foreground">
                          {(profileForm.watch('bio') || '').length}/500 characters
                        </p>
                      </div>
                    </div>

                    {/* Professional Info */}
                    <div className="space-y-4 pt-4 border-t border-border">
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Professional Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="company">Company</Label>
                          <div className="relative">
                            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input
                              id="company"
                              className="pl-10"
                              placeholder="Company name"
                              {...profileForm.register('company')}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="jobTitle">Job Title</Label>
                          <div className="relative">
                            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input
                              id="jobTitle"
                              className="pl-10"
                              placeholder="Your role"
                              {...profileForm.register('jobTitle')}
                            />
                          </div>
                        </div>

                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="website">Website</Label>
                          <div className="relative">
                            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input
                              id="website"
                              type="url"
                              className="pl-10"
                              placeholder="https://yourwebsite.com"
                              {...profileForm.register('website')}
                            />
                          </div>
                          {profileForm.formState.errors.website && (
                            <p className="text-sm text-destructive">
                              {profileForm.formState.errors.website.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Social Links */}
                    <div className="space-y-4 pt-4 border-t border-border">
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Social Links</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="linkedin">LinkedIn</Label>
                          <div className="relative">
                            <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input
                              id="linkedin"
                              type="url"
                              className="pl-10"
                              placeholder="https://linkedin.com/in/username"
                              {...profileForm.register('linkedin')}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="twitter">Twitter/X</Label>
                          <div className="relative">
                            <Twitter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input
                              id="twitter"
                              type="url"
                              className="pl-10"
                              placeholder="https://twitter.com/username"
                              {...profileForm.register('twitter')}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="facebook">Facebook</Label>
                          <div className="relative">
                            <Facebook className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input
                              id="facebook"
                              type="url"
                              className="pl-10"
                              placeholder="https://facebook.com/username"
                              {...profileForm.register('facebook')}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="instagram">Instagram</Label>
                          <div className="relative">
                            <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input
                              id="instagram"
                              type="url"
                              className="pl-10"
                              placeholder="https://instagram.com/username"
                              {...profileForm.register('instagram')}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Preferences */}
                    <div className="space-y-4 pt-4 border-t border-border">
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Preferences</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-xl">
                          <div>
                            <p className="font-medium">Email Notifications</p>
                            <p className="text-sm text-muted-foreground">Receive email updates about your account</p>
                          </div>
                          <Switch
                            checked={preferences.emailNotifications}
                            onCheckedChange={(checked) => handlePreferenceChange('emailNotifications', checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-xl">
                          <div>
                            <p className="font-medium">Push Notifications</p>
                            <p className="text-sm text-muted-foreground">Receive push notifications in browser</p>
                          </div>
                          <Switch
                            checked={preferences.pushNotifications}
                            onCheckedChange={(checked) => handlePreferenceChange('pushNotifications', checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-xl">
                          <div>
                            <p className="font-medium">Marketing Emails</p>
                            <p className="text-sm text-muted-foreground">Receive news and promotional content</p>
                          </div>
                          <Switch
                            checked={preferences.marketingEmails}
                            onCheckedChange={(checked) => handlePreferenceChange('marketingEmails', checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-xl">
                          <div>
                            <p className="font-medium">Public Profile</p>
                            <p className="text-sm text-muted-foreground">Allow others to view your profile</p>
                          </div>
                          <Switch
                            checked={preferences.showProfile}
                            onCheckedChange={(checked) => handlePreferenceChange('showProfile', checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-xl">
                          <div>
                            <p className="font-medium">Show Contact Info</p>
                            <p className="text-sm text-muted-foreground">Display contact information on profile</p>
                          </div>
                          <Switch
                            checked={preferences.showContactInfo}
                            onCheckedChange={(checked) => handlePreferenceChange('showContactInfo', checked)}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end pt-4">
                      <Button type="submit" className="btn-accent" disabled={isUpdating}>
                        {isUpdating ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            Save Changes
                          </>
                        )}
                      </Button>
                    </div>
                  </form>

                  {/* Saved Listings */}
                  <Separator className="my-8" />
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-accent" />
                    Saved Listings
                  </h3>
                  {user.savedListings && user.savedListings.length > 0 ? (
                    <div className="text-muted-foreground">
                      You have {user.savedListings.length} saved listing(s).
                      <Link href="/marketplace" className="text-accent hover:underline ml-2">
                        View in Marketplace
                      </Link>
                    </div>
                  ) : (
                    <div className="text-muted-foreground">
                      No saved listings yet.
                      <Link href="/marketplace" className="text-accent hover:underline ml-2">
                        Browse Listings
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* My Listings Tab */}
              {activeTab === 'listings' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">My Listings</h2>
                    <Link href="/create-listing" className="btn-accent">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Listing
                    </Link>
                  </div>

                  {myListings.length > 0 ? (
                    <div className="space-y-4">
                      {myListings.map((listing) => (
                        <div 
                          key={listing.id} 
                          className="p-4 rounded-xl bg-secondary/30 border border-border hover:bg-secondary/50 transition-colors"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-4">
                              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                                <Building2 className="w-6 h-6 text-accent" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                  <h3 className="font-semibold truncate">{listing.title}</h3>
                                  <span className={cn(
                                    "px-2 py-0.5 rounded-full text-xs font-medium",
                                    listing.status === 'approved' ? "bg-green-500/10 text-green-500" :
                                    listing.status === 'pending' ? "bg-amber-500/10 text-amber-500" :
                                    "bg-red-500/10 text-red-500"
                                  )}>
                                    {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                                  </span>
                                  {listing.featured && (
                                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-accent text-accent-foreground">
                                      Featured
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">
                                  {listing.category} • {listing.region} • {listing.location}
                                </p>
                                <div className="flex items-center gap-4 text-sm">
                                  <span className="font-semibold text-accent">{formatCurrency(listing.price)}</span>
                                  <span className="text-muted-foreground">{formatCurrency(listing.revenue)}/yr revenue</span>
                                  <span className="text-muted-foreground">{listing.analytics?.views || 0} views</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => {
                                  // View listing
                                  toast.info('View listing coming soon');
                                }}
                                className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground"
                                title="View listing"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  router.push(`/create-listing?id=${listing.id}`);
                                }}
                                className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground"
                                title="Edit listing"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteListing(listing.id, listing.title)}
                                className="p-2 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-500"
                                title="Delete listing"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  // Promote listing
                                  toast.info('Promote listing from marketplace');
                                  router.push('/marketplace');
                                }}
                                className="p-2 rounded-lg hover:bg-amber-500/10 text-muted-foreground hover:text-amber-500"
                                title="Promote listing"
                              >
                                <Rocket className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Building2 className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No listings yet</h3>
                      <p className="text-muted-foreground mb-6">
                        Create your first listing to start selling your business.
                      </p>
                      <Link href="/create-listing" className="btn-accent">
                        <Plus className="w-4 h-4 mr-2" />
                        Create Your First Listing
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* Promotions Tab */}
              {activeTab === 'promotions' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">My Promotions</h2>
                  </div>
                  <UserPromotions />
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">Security Settings</h2>

                  {/* Change Password */}
                  <div className="mb-8">
                    <h3 className="text-lg font-medium mb-4">Change Password</h3>
                    <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4 max-w-md">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <Input
                            id="currentPassword"
                            type={showPassword ? 'text' : 'password'}
                            className="pl-10"
                            {...passwordForm.register('currentPassword')}
                          />
                        </div>
                        {passwordForm.formState.errors.currentPassword && (
                          <p className="text-sm text-destructive">
                            {passwordForm.formState.errors.currentPassword.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <Input
                            id="newPassword"
                            type={showPassword ? 'text' : 'password'}
                            className="pl-10 pr-10"
                            {...passwordForm.register('newPassword')}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                        {passwordForm.formState.errors.newPassword && (
                          <p className="text-sm text-destructive">
                            {passwordForm.formState.errors.newPassword.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <Input
                            id="confirmPassword"
                            type={showPassword ? 'text' : 'password'}
                            className="pl-10"
                            {...passwordForm.register('confirmPassword')}
                          />
                        </div>
                        {passwordForm.formState.errors.confirmPassword && (
                          <p className="text-sm text-destructive">
                            {passwordForm.formState.errors.confirmPassword.message}
                          </p>
                        )}
                      </div>

                      <Button type="submit" className="btn-accent">
                        Update Password
                      </Button>
                    </form>
                  </div>

                  {/* Two-Factor Auth */}
                  <div className="p-4 bg-secondary/30 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center",
                          user?.twoFactorEnabled 
                            ? "bg-green-500/10" 
                            : "bg-secondary"
                        )}>
                          <Smartphone className={cn(
                            "w-5 h-5",
                            user?.twoFactorEnabled 
                              ? "text-green-500" 
                              : "text-muted-foreground"
                          )} />
                        </div>
                        <div>
                          <h4 className="font-medium">Two-Factor Authentication</h4>
                          <p className="text-sm text-muted-foreground">
                            {user?.twoFactorEnabled 
                              ? 'Your account is protected with 2FA.'
                              : 'Add an extra layer of security to your account.'}
                          </p>
                        </div>
                      </div>
                      {user?.twoFactorEnabled ? (
                        <Button 
                          onClick={handleDisable2FA}
                          disabled={is2FALoading}
                          variant="outline" 
                          className="text-destructive border-destructive/20 hover:bg-destructive/10"
                        >
                          Disable
                        </Button>
                      ) : (
                        <Button 
                          onClick={handleEnable2FA}
                          variant="outline" 
                          className="btn-secondary"
                        >
                          <Shield className="w-4 h-4 mr-2" />
                          Enable
                        </Button>
                      )}
                    </div>
                    {user?.twoFactorEnabled && (
                      <div className="mt-3 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                        <p className="text-sm text-green-500 flex items-center gap-2">
                          <Check className="w-4 h-4" />
                          Two-factor authentication is enabled
                        </p>
                      </div>
                    )}
                  </div>

                  {/* 2FA Setup Modal */}
                  {show2FAModal && twoFASecret && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                      <div 
                        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                        onClick={() => setShow2FAModal(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative z-10 w-full max-w-md"
                      >
                        <GlassPanel className="p-6">
                          <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold">Set Up Two-Factor Authentication</h3>
                            <button 
                              onClick={() => setShow2FAModal(false)}
                              className="p-2 hover:bg-secondary rounded-lg"
                            >
                              <EyeOff className="w-5 h-5" />
                            </button>
                          </div>
                          
                          <div className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                              Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
                            </p>
                            
                            {/* QR Code Placeholder */}
                            <div className="p-4 bg-white rounded-xl flex items-center justify-center">
                              <div className="w-48 h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                                <div className="text-center">
                                  <QrCode className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                                  <p className="text-xs text-gray-500">QR Code</p>
                                </div>
                              </div>
                            </div>
                            
                            {/* Manual Secret Key */}
                            <div className="p-3 bg-secondary/50 rounded-xl">
                              <p className="text-xs text-muted-foreground mb-2">Or enter this code manually:</p>
                              <div className="flex items-center gap-2">
                                <code className="flex-1 p-2 bg-background rounded text-sm font-mono tracking-wider">
                                  {twoFASecret.secret}
                                </code>
                                <button 
                                  onClick={() => {
                                    navigator.clipboard.writeText(twoFASecret.secret);
                                    toast.success('Copied to clipboard');
                                  }}
                                  className="p-2 hover:bg-secondary rounded"
                                >
                                  <Copy className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                            
                            {/* Verification Code Input */}
                            <div className="space-y-2">
                              <Label htmlFor="verification-code">Verification Code</Label>
                              <Input
                                id="verification-code"
                                placeholder="Enter 6-digit code"
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                className="text-center text-lg tracking-widest"
                                maxLength={6}
                              />
                            </div>
                            
                            <div className="flex gap-3">
                              <Button 
                                onClick={() => setShow2FAModal(false)}
                                variant="outline" 
                                className="flex-1"
                              >
                                Cancel
                              </Button>
                              <Button 
                                onClick={handleConfirm2FA}
                                disabled={verificationCode.length !== 6 || is2FALoading}
                                className="btn-accent flex-1"
                              >
                                {is2FALoading ? (
                                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                  'Verify & Enable'
                                )}
                              </Button>
                            </div>
                          </div>
                        </GlassPanel>
                      </motion.div>
                    </div>
                  )}

                  {/* Session Management */}
                  <div className="mt-8">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium">Active Sessions</h3>
                      <Button 
                        onClick={async () => {
                          const result = await revokeAllOtherSessions();
                          if (result.success) {
                            toast.success('All other sessions revoked');
                          } else {
                            // Safely extract error message - handle both string and object errors
                            const errorMsg = typeof result.error === 'string' 
                              ? result.error 
                              : (result.error?.message || 'Failed to revoke sessions');
                            toast.error(errorMsg);
                          }
                        }}
                        variant="outline"
                        className="text-destructive border-destructive/20 hover:bg-destructive/10"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out All Other Devices
                      </Button>
                    </div>
                    
                    <div className="space-y-3">
                      {/* Current Session */}
                      <div className="p-4 bg-accent/5 border border-accent/20 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                            <Check className="w-5 h-5 text-accent" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium">Current Session</p>
                              <span className="px-2 py-0.5 rounded-full text-xs bg-green-500/10 text-green-500">
                                Active
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {typeof navigator !== 'undefined' ? (
                                <>
                                  {navigator.userAgent.includes('Chrome') ? 'Chrome' : 
                                   navigator.userAgent.includes('Firefox') ? 'Firefox' :
                                   navigator.userAgent.includes('Safari') ? 'Safari' : 'Browser'} 
                                  {' • '}
                                  {navigator.userAgent.includes('Windows') ? 'Windows' :
                                   navigator.userAgent.includes('Mac') ? 'macOS' :
                                   navigator.userAgent.includes('Linux') ? 'Linux' : 'Device'}
                                  {' • '}Active now
                                </>
                              ) : 'Browser session'}
                            </p>
                          </div>
                        </div>
                        <Button onClick={handleLogout} variant="outline" className="text-destructive border-destructive/20 hover:bg-destructive/10">
                          <LogOut className="w-4 h-4 mr-2" />
                          Sign Out
                        </Button>
                      </div>
                      
                      {/* Other Sessions Placeholder */}
                      <div className="p-4 bg-secondary/30 rounded-xl text-center">
                        <p className="text-sm text-muted-foreground">
                          No other active sessions found. You're only logged in on this device.
                        </p>
                      </div>
                    </div>
                    
                    <p className="text-xs text-muted-foreground mt-4">
                      If you notice any suspicious activity, immediately revoke all other sessions and change your password.
                    </p>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">Notification Preferences</h2>

                  <div className="space-y-4">
                    <div className="p-4 bg-secondary/30 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Email Notifications</h4>
                          <p className="text-sm text-muted-foreground">
                            Receive updates about your account and new listings.
                          </p>
                        </div>
                        <input type="checkbox" defaultChecked className="toggle" />
                      </div>
                    </div>

                    <div className="p-4 bg-secondary/30 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Market Alerts</h4>
                          <p className="text-sm text-muted-foreground">
                            Get notified when new listings match your criteria.
                          </p>
                        </div>
                        <input type="checkbox" defaultChecked className="toggle" />
                      </div>
                    </div>

                    <div className="p-4 bg-secondary/30 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Price Drop Alerts</h4>
                          <p className="text-sm text-muted-foreground">
                            Be notified when saved listings reduce in price.
                          </p>
                        </div>
                        <input type="checkbox" className="toggle" />
                      </div>
                    </div>

                    <div className="p-4 bg-secondary/30 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Marketing Communications</h4>
                          <p className="text-sm text-muted-foreground">
                            Receive promotional content and platform updates.
                          </p>
                        </div>
                        <input type="checkbox" className="toggle" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Danger Zone Tab */}
              {activeTab === 'danger' && (
                <div>
                  <h2 className="text-xl font-semibold mb-6 text-destructive">Danger Zone</h2>

                  {/* GDPR Data Export */}
                  <div className="p-4 border border-border rounded-xl mb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Export Your Data</h4>
                        <p className="text-sm text-muted-foreground">
                          Download a copy of all your personal data (GDPR Right to Access).
                        </p>
                      </div>
                      <Button 
                        onClick={handleExportData}
                        disabled={isExporting}
                        variant="outline" 
                        className="btn-secondary"
                      >
                        {isExporting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin mr-2" />
                            Exporting...
                          </>
                        ) : (
                          <>
                            <Download className="w-4 h-4 mr-2" />
                            Export Data
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* GDPR Data Deletion */}
                  <div className="p-4 border border-border rounded-xl mb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Request Data Deletion</h4>
                        <p className="text-sm text-muted-foreground">
                          Request deletion of your personal data (GDPR Right to Erasure).
                        </p>
                      </div>
                      <Link href="/data-deletion">
                        <Button variant="outline" className="btn-secondary">
                          Request Deletion
                        </Button>
                      </Link>
                    </div>
                  </div>

                  {/* Account Deletion */}
                  <div className="p-4 border border-destructive/30 bg-destructive/5 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-destructive flex items-center gap-2">
                          <Trash2 className="w-4 h-4" />
                          Delete Account
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Permanently delete your account and all associated data.
                        </p>
                      </div>
                      <Button 
                        onClick={handleDeleteAccount}
                        variant="outline" 
                        className="text-destructive border-destructive/30 hover:bg-destructive/10"
                      >
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </GlassPanel>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
