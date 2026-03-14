'use client';

import { ReactNode, MouseEventHandler } from 'react';
import { useNavigation, ViewType } from '@/contexts/NavigationContext';

interface LinkProps {
  to: ViewType;
  children: ReactNode;
  className?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
}

export function Link({ to, children, className, onClick }: LinkProps) {
  const { navigateTo } = useNavigation();

  const handleClick: MouseEventHandler<HTMLAnchorElement> = (e) => {
    e.preventDefault();
    onClick?.(e);
    navigateTo(to);
  };

  return (
    <a href={`#${to}`} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}
