'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, HelpCircle, CheckCircle2, X, MessageCircle, Clock } from 'lucide-react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useSupport } from '@/contexts/SupportContext';
import { TicketCategory, TicketPriority, SupportTicket } from '@/types/support';

interface SupportFormProps {
  onSuccess?: (ticketId: string) => void;
  embedded?: boolean;
}

const CATEGORIES: { value: TicketCategory; label: string; description: string }[] = [
  { value: 'account', label: 'Account Issues', description: 'Login, profile, or access problems' },
  { value: 'subscription', label: 'Subscription', description: 'Billing, plans, or payment issues' },
  { value: 'listing', label: 'Listing Issues', description: 'Problems with listings or marketplace' },
  { value: 'technical', label: 'Technical Support', description: 'Bugs, errors, or technical issues' },
  { value: 'billing', label: 'Billing', description: 'Invoices, refunds, or payment methods' },
  { value: 'other', label: 'Other', description: 'General inquiries' },
];

export function SupportForm({ onSuccess, embedded = false }: SupportFormProps) {
  const { user, isAuthenticated } = useAuth();
  const { createTicket, userTickets } = useSupport();
  
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState(user?.email || '');
  const [category, setCategory] = useState<TicketCategory>('other');
  const [priority, setPriority] = useState<TicketPriority>('medium');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<SupportTicket | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  // Filter tickets for current user
  const myTickets = userTickets.filter(t => t.userId === user?.id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!subject.trim() || !description.trim() || !email.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!user?.clientNumber) {
      toast.error('You need a client account to submit support requests');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const ticket = await createTicket({
        subject,
        category,
        message: description,
        priority,
        userId: user.id,
        userEmail: email,
        userName: user.name,
        clientNumber: user.clientNumber,
      });

      setSubmittedTicket(ticket);
      toast.success(`Support ticket created`, {
        description: 'Our team will respond within 24 hours.'
      });
      
      onSuccess?.(ticket.id);
    } catch (error) {
      toast.error('Failed to submit request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSubmittedTicket(null);
    setSubject('');
    setDescription('');
    setCategory('other');
    setPriority('medium');
  };

  if (submittedTicket) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
      >
        <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-8 h-8 text-green-500" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Ticket Submitted</h3>
        <p className="text-muted-foreground mb-4">
          Your support request has been created successfully.
        </p>
        <div className="space-y-2 mb-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-accent/10 border border-accent/20">
            <span className="text-sm text-muted-foreground">Ticket ID:</span>
            <span className="font-semibold text-accent">{submittedTicket.id}</span>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary">
            <span className="text-sm text-muted-foreground">Client Number:</span>
            <span className="font-semibold">{submittedTicket.clientNumber}</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Our team will respond to your inquiry within 24 hours.
        </p>
        <div className="flex gap-2 justify-center">
          <button onClick={resetForm} className="btn-secondary">
            Submit Another Request
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Show client number for logged in users */}
      {isAuthenticated && user?.clientNumber && (
        <div className="flex items-center justify-between p-3 rounded-xl bg-accent/5 border border-accent/20">
          <span className="text-sm text-muted-foreground">Your Client Number:</span>
          <span className="font-semibold text-accent">{user.clientNumber}</span>
        </div>
      )}

      {/* Show ticket history for logged in users */}
      {isAuthenticated && myTickets.length > 0 && (
        <div className="mb-4">
          <button
            type="button"
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-2 text-sm text-accent hover:underline"
          >
            <MessageCircle className="w-4 h-4" />
            View your tickets ({myTickets.length})
          </button>
          
          <AnimatePresence>
            {showHistory && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-3 space-y-2 max-h-48 overflow-y-auto">
                  {myTickets.slice(0, 5).map(ticket => (
                    <div key={ticket.id} className="p-3 rounded-lg bg-secondary/50 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="font-medium truncate flex-1">{ticket.subject}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                          ticket.status === 'open' ? 'bg-blue-500/10 text-blue-500' :
                          ticket.status === 'resolved' ? 'bg-green-500/10 text-green-500' :
                          ticket.status === 'in_progress' ? 'bg-amber-500/10 text-amber-500' :
                          'bg-secondary text-muted-foreground'
                        }`}>
                          {ticket.status.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Email Address</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            disabled={isAuthenticated}
          />
          {isAuthenticated && (
            <p className="text-xs text-muted-foreground mt-1">Using your account email</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Category</label>
          <div className="grid grid-cols-2 gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => setCategory(cat.value)}
                className={`p-3 rounded-xl text-left transition-all ${
                  category === cat.value
                    ? 'bg-accent/10 border border-accent/30'
                    : 'bg-secondary/50 border border-transparent hover:bg-secondary'
                }`}
              >
                <div className="font-medium text-sm">{cat.label}</div>
                <div className="text-xs text-muted-foreground">{cat.description}</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Subject</label>
          <Input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Brief description of your issue"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Priority</label>
          <div className="flex gap-2">
            {(['low', 'medium', 'high', 'urgent'] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPriority(p)}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  priority === p
                    ? p === 'urgent' 
                      ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                      : p === 'high'
                      ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20'
                      : p === 'medium'
                      ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                      : 'bg-green-500/10 text-green-500 border border-green-500/20'
                    : 'bg-secondary hover:bg-secondary/80'
                }`}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Please describe your issue in detail. Include any relevant information such as error messages, listing IDs, or steps to reproduce the problem."
            rows={5}
            className="w-full px-4 py-3 rounded-xl border border-border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting || (!isAuthenticated && !user?.clientNumber)}
          className="w-full btn-accent justify-center disabled:opacity-50"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
          ) : (
            <>
              <Send className="w-5 h-5" />
              Submit Support Request
            </>
          )}
        </button>

        {!isAuthenticated && (
          <p className="text-xs text-center text-muted-foreground">
            You need to be logged in to submit a support request
          </p>
        )}
      </form>
    </div>
  );
}

export function SupportButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-accent text-accent-foreground shadow-lg hover:bg-accent/90 transition-colors flex items-center justify-center"
        title="Need help?"
      >
        <HelpCircle className="w-6 h-6" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div 
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <GlassPanel className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                      <HelpCircle className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h2 className="font-semibold">Need Help?</h2>
                      <p className="text-sm text-muted-foreground">Submit a support request</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-secondary rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <SupportForm onSuccess={() => {}} />
              </GlassPanel>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
