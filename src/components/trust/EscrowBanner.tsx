import { CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DueDiligenceStatusProps {
  documentsReady: boolean;
  financialsVerified: boolean;
  legalReviewed: boolean;
  className?: string;
}

export function DueDiligenceStatus({ 
  documentsReady, 
  financialsVerified, 
  legalReviewed,
  className 
}: DueDiligenceStatusProps) {
  const steps = [
    { label: 'Documents Ready', complete: documentsReady },
    { label: 'Financials Verified', complete: financialsVerified },
    { label: 'Legal Reviewed', complete: legalReviewed }
  ];

  const completedCount = steps.filter(s => s.complete).length;
  const percentage = Math.round((completedCount / steps.length) * 100);

  return (
    <div className={cn("p-4 rounded-xl bg-secondary/50 border border-border", className)}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium">Due Diligence Status</span>
        <span className="text-xs text-muted-foreground">{percentage}% Complete</span>
      </div>
      
      {/* Progress bar */}
      <div className="h-2 bg-secondary rounded-full mb-4 overflow-hidden">
        <div 
          className="h-full bg-accent rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="space-y-2">
        {steps.map((step) => (
          <div key={step.label} className="flex items-center gap-2 text-sm">
            {step.complete ? (
              <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
            ) : (
              <div className="w-4 h-4 rounded-full border-2 border-muted-foreground/30" />
            )}
            <span className={step.complete ? 'text-foreground' : 'text-muted-foreground'}>
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface VerificationScoreProps {
  score: number; // 0-100
  className?: string;
}

export function VerificationScore({ score, className }: VerificationScoreProps) {
  const getScoreColor = (s: number) => {
    if (s >= 80) return 'text-green-600 dark:text-green-400';
    if (s >= 60) return 'text-amber-600 dark:text-amber-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreLabel = (s: number) => {
    if (s >= 80) return 'Excellent';
    if (s >= 60) return 'Good';
    return 'Basic';
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="relative w-14 h-14">
        <svg className="w-14 h-14 -rotate-90">
          <circle
            cx="28"
            cy="28"
            r="24"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
            className="text-secondary"
          />
          <circle
            cx="28"
            cy="28"
            r="24"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
            strokeDasharray={`${(score / 100) * 150.8} 150.8`}
            className={getScoreColor(score)}
          />
        </svg>
        <span className={cn("absolute inset-0 flex items-center justify-center text-sm font-semibold", getScoreColor(score))}>
          {score}
        </span>
      </div>
      <div>
        <p className="text-sm font-medium">Verification Score</p>
        <p className={cn("text-xs", getScoreColor(score))}>{getScoreLabel(score)}</p>
      </div>
    </div>
  );
}
