'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface GlassPanelProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function GlassPanel({ children, className, hover = false }: GlassPanelProps) {
  return (
    <div 
      className={cn(
        "glass-panel",
        hover && "card-hover",
        className
      )}
    >
      {children}
    </div>
  );
}
