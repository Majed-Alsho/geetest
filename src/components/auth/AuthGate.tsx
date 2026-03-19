import { ReactNode } from 'react';
import { Link } from '@/components/Link';
import { motion } from 'framer-motion';
import { Lock, UserPlus, LogIn } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { GlassPanel } from '@/components/ui/GlassPanel';

interface AuthGateProps {
  children: ReactNode;
  message?: string;
}

export function AuthGate({ children, message = "Access confidential details" }: AuthGateProps) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="py-12"
      >
        <GlassPanel className="p-8 md:p-12 text-center max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-accent" />
          </div>
          
          <h2 className="text-2xl md:text-3xl font-semibold mb-3 tracking-tight">
            Authentication Required
          </h2>
          
          <p className="text-muted-foreground mb-4 max-w-sm mx-auto">
            {message}. Please log in or create an account to continue.
          </p>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6">
            <span className="text-accent font-semibold text-lg">€2.99</span>
            <span className="text-muted-foreground text-sm">/month for full access</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="login"
              className="btn-accent justify-center"
            >
              <LogIn className="w-5 h-5" />
              Log In
            </Link>
            <Link
              to="signup"
              className="btn-secondary justify-center"
            >
              <UserPlus className="w-5 h-5" />
              Create Account
            </Link>
          </div>

          <p className="text-sm text-muted-foreground mt-6">
            Your information is protected by our{' '}
            <Link href="/privacy" className="text-accent hover:underline">
              Privacy Policy
            </Link>
          </p>
        </GlassPanel>
      </motion.div>
    );
  }

  return <>{children}</>;
}
