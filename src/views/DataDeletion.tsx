'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  AlertTriangle, 
  FileText, 
  Clock, 
  CheckCircle2,
  Send,
  ArrowLeft
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

import { GlassPanel } from '@/components/ui/GlassPanel';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Link } from '@/components/Link';
import { useAuth } from '@/contexts/AuthContext';
import { Separator } from '@/components/ui/separator';

const deletionRequestSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  reason: z.string().min(10, 'Please provide a reason (min 10 characters)'),
  confirmation: z.boolean().refine(val => val === true, 'You must confirm this action'),
});

type DeletionRequestData = z.infer<typeof deletionRequestSchema>;

export default function DataDeletion() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<DeletionRequestData>({
    resolver: zodResolver(deletionRequestSchema),
    defaultValues: {
      email: user?.email || '',
      confirmation: false,
    },
  });

  const onSubmit = async (data: DeletionRequestData) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitted(true);
    toast.success('Request submitted', {
      description: 'Your data deletion request has been received.',
    });
  };

  const dataCategories = [
    {
      category: 'Account Information',
      items: ['Name', 'Email address', 'Account preferences', 'Login history'],
    },
    {
      category: 'Activity Data',
      items: ['Saved listings', 'Search history', 'Alerts configured', 'Messages'],
    },
    {
      category: 'Transaction Records',
      items: ['Inquiries made', 'NDAs signed', 'Transactions initiated'],
    },
  ];

  if (isSubmitted) {
    return (
      <div className="section-padding min-h-[80vh] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-lg"
        >
          <GlassPanel className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
            <h1 className="text-2xl font-semibold mb-4">Request Received</h1>
            <p className="text-muted-foreground mb-6">
              Your data deletion request has been submitted successfully. We will process your request within 30 days 
              as required by GDPR Article 17. You will receive a confirmation email once the process is complete.
            </p>
            <div className="p-4 bg-secondary/30 rounded-xl mb-6">
              <p className="text-sm text-muted-foreground">
                <strong>Reference Number:</strong> DEL-{Date.now().toString(36).toUpperCase()}
              </p>
            </div>
            <Link href="/" className="btn-accent">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Return Home
            </Link>
          </GlassPanel>
        </motion.div>
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
          <Link 
            to="profile" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Profile
          </Link>
          <h1 className="text-3xl font-semibold mb-2">Request Data Deletion</h1>
          <p className="text-muted-foreground">
            Exercise your right to erasure under GDPR Article 17.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <GlassPanel className="p-6">
              {/* Warning Banner */}
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl mb-6">
                <div className="flex gap-3">
                  <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-destructive mb-1">Important Warning</h4>
                    <p className="text-sm text-muted-foreground">
                      This action is irreversible. Once your data is deleted, you will not be able to recover your account, 
                      saved listings, or any transaction history. This process may take up to 30 days to complete.
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    {...register('email')}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason">Reason for Deletion (Optional)</Label>
                  <textarea
                    id="reason"
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl bg-secondary/30 border border-border focus:border-accent focus:ring-1 focus:ring-accent outline-none resize-none"
                    placeholder="Please tell us why you're requesting data deletion..."
                    {...register('reason')}
                  />
                  {errors.reason && (
                    <p className="text-sm text-destructive">{errors.reason.message}</p>
                  )}
                </div>

                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="confirmation"
                    className="mt-1 h-4 w-4 rounded border-border text-accent focus:ring-accent"
                    {...register('confirmation')}
                  />
                  <label htmlFor="confirmation" className="text-sm text-muted-foreground">
                    I understand that this action is permanent and cannot be undone. I confirm that I want to 
                    delete all my personal data from Global Equity Exchange.
                  </label>
                </div>
                {errors.confirmation && (
                  <p className="text-sm text-destructive">{errors.confirmation.message}</p>
                )}

                <div className="flex gap-4">
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="btn-accent bg-destructive hover:bg-destructive/90"
                  >
                    {isSubmitting ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Submit Deletion Request
                      </>
                    )}
                  </Button>
                  <Link href="/profile" className="btn-secondary">
                  Cancel
                </Link>
                </div>
              </form>
            </GlassPanel>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* What Data Will Be Deleted */}
            <GlassPanel className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-accent" />
                Data to be Deleted
              </h3>
              <div className="space-y-4">
                {dataCategories.map((cat) => (
                  <div key={cat.category}>
                    <h4 className="text-sm font-medium mb-2">{cat.category}</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {cat.items.map((item) => (
                        <li key={item} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </GlassPanel>

            {/* Timeline */}
            <GlassPanel className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-accent" />
                Deletion Timeline
              </h3>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-medium text-accent">1</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Request Received</p>
                    <p className="text-xs text-muted-foreground">Confirmation email sent</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-medium text-accent">2</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Verification (1-3 days)</p>
                    <p className="text-xs text-muted-foreground">Identity verification</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-medium text-accent">3</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Processing (up to 30 days)</p>
                    <p className="text-xs text-muted-foreground">Data removal from all systems</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-medium text-accent">4</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Confirmation</p>
                    <p className="text-xs text-muted-foreground">Final deletion notice</p>
                  </div>
                </div>
              </div>
            </GlassPanel>

            {/* Your Rights */}
            <GlassPanel className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-accent" />
                Your GDPR Rights
              </h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Right to Access (Art. 15)</li>
                <li>• Right to Rectification (Art. 16)</li>
                <li>• Right to Erasure (Art. 17)</li>
                <li>• Right to Portability (Art. 20)</li>
                <li>• Right to Object (Art. 21)</li>
              </ul>
              <Separator className="my-4" />
              <p className="text-xs text-muted-foreground">
                For questions about your rights, contact our Data Protection Officer at{' '}
                <a href="mailto:dpo@globalequityexchange.com" className="text-accent hover:underline">
                  dpo@globalequityexchange.com
                </a>
              </p>
            </GlassPanel>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
