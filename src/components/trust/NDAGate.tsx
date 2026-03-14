import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, FileText, CheckCircle2, AlertTriangle } from 'lucide-react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface NDAGateProps {
  listingId: string;
  listingTitle: string;
  onAccept: () => void;
  className?: string;
}

export function NDAGate({ listingId, listingTitle, onAccept, className }: NDAGateProps) {
  const { user } = useAuth();
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAcceptNDA = async () => {
    if (!agreed) {
      toast.error('Please agree to the NDA terms to continue');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success('NDA accepted', {
      description: 'You now have access to confidential details'
    });
    
    setIsSubmitting(false);
    onAccept();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("py-8", className)}
    >
      <GlassPanel className="p-8 max-w-2xl mx-auto">
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-amber-600 dark:text-amber-400" />
          </div>
          <h2 className="text-2xl font-semibold mb-2 tracking-tight">
            Non-Disclosure Agreement Required
          </h2>
          <p className="text-muted-foreground">
            This listing contains confidential business information. Please review and accept the NDA to proceed.
          </p>
        </div>

        <div className="bg-secondary/50 rounded-lg p-4 mb-6 text-sm">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            NDA Terms Summary
          </h3>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
              <span>All information shared is strictly confidential and for evaluation purposes only</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
              <span>You agree not to disclose any details to third parties without written consent</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
              <span>Direct contact with the seller is prohibited until authorized by Global Equity Exchange</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
              <span>This NDA remains in effect for 2 years from the date of acceptance</span>
            </li>
          </ul>
        </div>

        <div className="mb-6">
          <label className="flex items-start gap-3 cursor-pointer">
            <input 
              type="checkbox" 
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1 w-4 h-4 rounded border-border text-accent focus:ring-accent"
            />
            <span className="text-sm">
              I, <strong>{user?.name || 'Investor'}</strong>, agree to the terms of this Non-Disclosure Agreement 
              for the listing "<strong>{listingTitle}</strong>" and understand the confidentiality obligations.
            </span>
          </label>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleAcceptNDA}
            disabled={!agreed || isSubmitting}
            className="btn-accent justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                Accept NDA & View Details
              </>
            )}
          </button>
          
          <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            Your acceptance will be logged and is legally binding
          </p>
        </div>
      </GlassPanel>
    </motion.div>
  );
}
