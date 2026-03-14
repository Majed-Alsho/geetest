import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Send, Loader2, CheckCircle } from 'lucide-react';
import { budgetRanges, timelines, fundingSources, diligenceWindows } from '@/lib/data';
import { cn } from '@/lib/utils';

const inquirySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(80),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().optional(),
  accredited: z.boolean(),
  budgetRange: z.string().min(1, 'Please select a budget range'),
  timeline: z.string().min(1, 'Please select a timeline'),
  message: z.string().min(20, 'Message must be at least 20 characters').max(2000),
  ndaAccepted: z.literal(true, {
    errorMap: () => ({ message: 'You must accept the NDA agreement' })
  }),
  // Honeypot
  companyWebsite: z.string().max(0)
});

const loiSchema = inquirySchema.extend({
  offerPrice: z.number().min(1, 'Please enter an offer price').max(1000000000),
  fundingSource: z.string().min(1, 'Please select a funding source'),
  diligenceWindowDays: z.number().min(15).max(60)
});

type InquiryFormData = z.infer<typeof inquirySchema>;
type LOIFormData = z.infer<typeof loiSchema>;

interface LeadFormProps {
  listingTitle: string;
  listingId: string;
  type: 'inquiry' | 'loi';
  onSuccess?: () => void;
}

export function LeadForm({ listingTitle, listingId, type, onSuccess }: LeadFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const schema = type === 'loi' ? loiSchema : inquirySchema;
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<LOIFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      accredited: false,
      ndaAccepted: false as any,
      companyWebsite: '',
      diligenceWindowDays: 30
    }
  });

  const onSubmit = async (data: LOIFormData) => {
    setIsSubmitting(true);
    
    // Simulate API call - in production this would go to backend
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Only log non-sensitive info in development mode
    if (import.meta.env.DEV) {
      console.log('Form submitted for listing:', listingId, 'type:', type);
    }
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    if (onSuccess) {
      setTimeout(onSuccess, 2000);
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="font-semibold text-xl mb-2">
          {type === 'loi' ? 'Letter of Intent Received' : 'Inquiry Received'}
        </h3>
        <p className="text-muted-foreground">
          Our team will review and respond within 1-2 business days.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Regarding: <span className="font-medium text-foreground">{listingTitle}</span>
      </p>

      {/* Honeypot - hidden from users */}
      <input
        {...register('companyWebsite')}
        type="text"
        className="absolute -left-[9999px] opacity-0"
        tabIndex={-1}
        autoComplete="off"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium mb-1.5">
            Full Name <span className="text-destructive">*</span>
          </label>
          <input
            {...register('name')}
            type="text"
            className={cn(
              "w-full px-4 py-2.5 rounded-xl bg-secondary/50 border text-foreground focus:outline-none focus:ring-2 focus:ring-ring",
              errors.name ? "border-destructive" : "border-border"
            )}
          />
          {errors.name && (
            <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium mb-1.5">
            Email <span className="text-destructive">*</span>
          </label>
          <input
            {...register('email')}
            type="email"
            className={cn(
              "w-full px-4 py-2.5 rounded-xl bg-secondary/50 border text-foreground focus:outline-none focus:ring-2 focus:ring-ring",
              errors.email ? "border-destructive" : "border-border"
            )}
          />
          {errors.email && (
            <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium mb-1.5">Phone</label>
          <input
            {...register('phone')}
            type="tel"
            className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* Budget Range */}
        <div>
          <label className="block text-sm font-medium mb-1.5">
            Budget Range <span className="text-destructive">*</span>
          </label>
          <select
            {...register('budgetRange')}
            className={cn(
              "w-full px-4 py-2.5 rounded-xl bg-secondary/50 border text-foreground focus:outline-none focus:ring-2 focus:ring-ring",
              errors.budgetRange ? "border-destructive" : "border-border"
            )}
          >
            <option value="">Select budget range</option>
            {budgetRanges.map((range) => (
              <option key={range} value={range}>{range}</option>
            ))}
          </select>
          {errors.budgetRange && (
            <p className="text-sm text-destructive mt-1">{errors.budgetRange.message}</p>
          )}
        </div>

        {/* Timeline */}
        <div>
          <label className="block text-sm font-medium mb-1.5">
            Timeline <span className="text-destructive">*</span>
          </label>
          <select
            {...register('timeline')}
            className={cn(
              "w-full px-4 py-2.5 rounded-xl bg-secondary/50 border text-foreground focus:outline-none focus:ring-2 focus:ring-ring",
              errors.timeline ? "border-destructive" : "border-border"
            )}
          >
            <option value="">Select timeline</option>
            {timelines.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          {errors.timeline && (
            <p className="text-sm text-destructive mt-1">{errors.timeline.message}</p>
          )}
        </div>

        {/* Accredited Investor */}
        <div className="flex items-center">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              {...register('accredited')}
              type="checkbox"
              className="w-5 h-5 rounded border-border text-accent focus:ring-accent"
            />
            <span className="text-sm">I am an accredited investor</span>
          </label>
        </div>
      </div>

      {/* LOI-specific fields */}
      {type === 'loi' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-border">
          {/* Offer Price */}
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Offer Price (USD) <span className="text-destructive">*</span>
            </label>
            <input
              {...register('offerPrice', { valueAsNumber: true })}
              type="number"
              min="1"
              placeholder="10000000"
              className={cn(
                "w-full px-4 py-2.5 rounded-xl bg-secondary/50 border text-foreground focus:outline-none focus:ring-2 focus:ring-ring",
                errors.offerPrice ? "border-destructive" : "border-border"
              )}
            />
            {errors.offerPrice && (
              <p className="text-sm text-destructive mt-1">{errors.offerPrice.message}</p>
            )}
          </div>

          {/* Funding Source */}
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Funding Source <span className="text-destructive">*</span>
            </label>
            <select
              {...register('fundingSource')}
              className={cn(
                "w-full px-4 py-2.5 rounded-xl bg-secondary/50 border text-foreground focus:outline-none focus:ring-2 focus:ring-ring",
                errors.fundingSource ? "border-destructive" : "border-border"
              )}
            >
              <option value="">Select funding source</option>
              {fundingSources.map((source) => (
                <option key={source} value={source}>{source}</option>
              ))}
            </select>
            {errors.fundingSource && (
              <p className="text-sm text-destructive mt-1">{errors.fundingSource.message}</p>
            )}
          </div>

          {/* Diligence Window */}
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Due Diligence Window <span className="text-destructive">*</span>
            </label>
            <select
              {...register('diligenceWindowDays', { valueAsNumber: true })}
              className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {diligenceWindows.map((window) => (
                <option key={window.value} value={window.value}>{window.label}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Message */}
      <div>
        <label className="block text-sm font-medium mb-1.5">
          Message <span className="text-destructive">*</span>
        </label>
        <textarea
          {...register('message')}
          rows={4}
          placeholder={type === 'loi' 
            ? "Describe your investment thesis, relevant experience, and any questions..."
            : "Tell us about your interest in this opportunity..."
          }
          className={cn(
            "w-full px-4 py-2.5 rounded-xl bg-secondary/50 border text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none",
            errors.message ? "border-destructive" : "border-border"
          )}
        />
        {errors.message && (
          <p className="text-sm text-destructive mt-1">{errors.message.message}</p>
        )}
      </div>

      {/* NDA Agreement */}
      <div className="p-4 bg-secondary/30 rounded-xl">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            {...register('ndaAccepted')}
            type="checkbox"
            className="w-5 h-5 mt-0.5 rounded border-border text-accent focus:ring-accent"
          />
          <span className="text-sm">
            <span className="text-destructive">*</span> I agree to maintain confidentiality of all information provided and understand that this inquiry will be reviewed by Global Equity Exchange before being forwarded to the business owner.
          </span>
        </label>
        {errors.ndaAccepted && (
          <p className="text-sm text-destructive mt-2">{errors.ndaAccepted.message}</p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full btn-accent py-3 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            <Send className="w-5 h-5" />
            {type === 'loi' ? 'Submit Letter of Intent' : 'Submit Inquiry'}
          </>
        )}
      </button>
    </form>
  );
}
