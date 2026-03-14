'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { BadgeCheck, ShieldCheck, Lock } from 'lucide-react';

interface BadgeProps {
  variant: 'verified' | 'encrypted' | 'confidential' | 'custom';
  children?: ReactNode;
  className?: string;
}

export function StatusBadge({ variant, children, className }: BadgeProps) {
  const variants = {
    verified: {
      icon: <BadgeCheck className="w-3.5 h-3.5" />,
      label: 'Verified',
      className: 'bg-accent/20 text-accent border border-accent/30'
    },
    encrypted: {
      icon: <ShieldCheck className="w-3.5 h-3.5" />,
      label: 'Encrypted',
      className: 'bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20'
    },
    confidential: {
      icon: <Lock className="w-3.5 h-3.5" />,
      label: 'Confidential',
      className: 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground border border-primary/20'
    },
    custom: {
      icon: null,
      label: '',
      className: 'bg-secondary text-secondary-foreground'
    }
  };

  const config = variants[variant];

  return (
    <span 
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
        config.className,
        className
      )}
    >
      {config.icon}
      {children || config.label}
    </span>
  );
}
