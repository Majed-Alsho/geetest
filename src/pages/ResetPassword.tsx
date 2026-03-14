'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Key, Eye, EyeOff, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigation } from '@/contexts/NavigationContext';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const { resetPasswordWithToken } = useAuth();
  const { navigateTo } = useNavigation();
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('Invalid reset link. Please request a new password reset.');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await resetPasswordWithToken(token, newPassword);
      
      if (result.success) {
        setIsSuccess(true);
        toast.success('Password reset successfully!');
      } else {
        setError(result.error || 'Failed to reset password. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!token) {
    return (
      <div className="section-padding min-h-screen flex items-center justify-center">
        <GlassPanel className="p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-semibold mb-2">Invalid Reset Link</h1>
          <p className="text-muted-foreground mb-6">
            This password reset link is invalid or missing. Please request a new one.
          </p>
          <Button onClick={() => navigateTo('login')} className="w-full">
            Go to Login
          </Button>
        </GlassPanel>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="section-padding min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <GlassPanel className="p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h1 className="text-2xl font-semibold mb-2">Password Reset!</h1>
            <p className="text-muted-foreground mb-6">
              Your password has been successfully reset. You can now log in with your new password.
            </p>
            <Button onClick={() => navigateTo('login')} className="w-full">
              Go to Login
            </Button>
          </GlassPanel>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="section-padding min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <GlassPanel className="p-8">
          <button 
            onClick={() => navigateTo('login')}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
              <Key className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">Reset Password</h1>
              <p className="text-sm text-muted-foreground">Enter your new password</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">New Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Confirm Password</label>
              <Input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
              />
            </div>

            {/* Password Requirements */}
            <div className="space-y-2 p-3 rounded-xl bg-secondary/50">
              <p className="text-xs font-medium text-muted-foreground">Password Requirements</p>
              <div className="flex items-center gap-2 text-xs">
                <span className={cn(
                  "w-4 h-4 rounded-full flex items-center justify-center",
                  newPassword.length >= 8 ? "bg-green-500" : "bg-secondary"
                )}>
                  {newPassword.length >= 8 && <CheckCircle className="w-3 h-3 text-white" />}
                </span>
                <span className={newPassword.length >= 8 ? "text-green-500" : "text-muted-foreground"}>
                  At least 8 characters
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className={cn(
                  "w-4 h-4 rounded-full flex items-center justify-center",
                  newPassword && newPassword === confirmPassword ? "bg-green-500" : "bg-secondary"
                )}>
                  {newPassword && newPassword === confirmPassword && <CheckCircle className="w-3 h-3 text-white" />}
                </span>
                <span className={newPassword && newPassword === confirmPassword ? "text-green-500" : "text-muted-foreground"}>
                  Passwords match
                </span>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                <p className="text-sm text-red-500 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </p>
              </div>
            )}

            <Button
              type="submit"
              disabled={isSubmitting || newPassword.length < 8 || newPassword !== confirmPassword}
              className="w-full"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Resetting...
                </>
              ) : (
                <>
                  <Key className="w-4 h-4" />
                  Reset Password
                </>
              )}
            </Button>
          </form>
        </GlassPanel>
      </motion.div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="section-padding min-h-screen flex items-center justify-center">
        <div className="animate-pulse">
          <div className="w-96 h-96 bg-secondary/30 rounded-2xl" />
        </div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}
