'use client';

import NextLink from 'next/link';
import { ReactNode, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface LinkProps {
  to: string;
  href?: string; // Also accept href for compatibility
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  prefetch?: boolean;
  replace?: boolean;
  scroll?: boolean;
}

// Map old route names to new paths
const routeMap: Record<string, string> = {
  home: '/',
  marketplace: '/marketplace',
  'listing-detail': '/listings',
  compare: '/compare',
  'create-listing': '/create-listing',
  investors: '/investors',
  'investor-profile': '/investors',
  'knowledge-base': '/knowledge-base',
  'how-it-works': '/how-it-works',
  security: '/security',
  terms: '/terms',
  privacy: '/privacy',
  'risk-disclosure': '/risk-disclosure',
  login: '/login',
  signup: '/signup',
  'admin-login': '/admin-login',
  admin: '/admin',
  profile: '/profile',
  'reset-password': '/reset-password',
  'data-deletion': '/data-deletion',
  support: '/support',
};

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ to, href, children, className, onClick, ...props }, ref) => {
    // Convert route name to path
    const path = routeMap[to] || to || href || '/';
    
    return (
      <NextLink
        ref={ref}
        href={path}
        className={cn(
          // Add default styles for button-like links
          className?.includes('btn-') && 'inline-flex items-center justify-center gap-2 font-medium transition-all',
          className
        )}
        onClick={onClick}
        {...props}
      >
        {children}
      </NextLink>
    );
  }
);

Link.displayName = 'Link';

export default Link;
