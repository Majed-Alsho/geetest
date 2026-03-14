import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface StatPillProps {
  icon?: ReactNode;
  label: string;
  value: string;
  className?: string;
  variant?: 'default' | 'highlight' | 'success';
}

export function StatPill({ icon, label, value, className, variant = 'default' }: StatPillProps) {
  return (
    <div 
      className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-xl",
        variant === 'default' && "bg-secondary",
        variant === 'highlight' && "bg-accent/10 text-accent",
        variant === 'success' && "bg-green-500/10 text-green-600 dark:text-green-400",
        className
      )}
    >
      {icon && <span className="text-muted-foreground">{icon}</span>}
      <div className="flex flex-col">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="text-sm font-semibold">{value}</span>
      </div>
    </div>
  );
}
