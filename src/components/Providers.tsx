'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';
import { AuthProvider } from '@/contexts/AuthContext';
import { CompareProvider } from '@/contexts/CompareContext';
import { SupportProvider } from '@/contexts/SupportContext';
import { AdProvider } from '@/contexts/AdContext';
import { ListingProvider } from '@/contexts/ListingContext';
import { NotificationsProvider } from '@/contexts/NotificationsContext';
import { WatchlistProvider } from '@/contexts/WatchlistContext';
import { AuditProvider } from '@/contexts/AuditContext';
import { RateLimitProvider } from '@/contexts/RateLimitContext';
import { EarningsProvider } from '@/contexts/EarningsContext';
import { VerificationProvider } from '@/contexts/VerificationContext';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster as SonnerToaster } from '@/components/ui/sonner';
import { ReactNode } from 'react';

// Create a stable QueryClient instance outside the component
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ListingProvider>
            <CompareProvider>
              <SupportProvider>
                <AdProvider>
                  <NotificationsProvider>
                    <WatchlistProvider>
                      <AuditProvider>
                        <RateLimitProvider>
                          <EarningsProvider>
                            <VerificationProvider>
                              <TooltipProvider>
                                <SonnerToaster />
                                {children}
                              </TooltipProvider>
                            </VerificationProvider>
                          </EarningsProvider>
                        </RateLimitProvider>
                      </AuditProvider>
                    </WatchlistProvider>
                  </NotificationsProvider>
                </AdProvider>
              </SupportProvider>
            </CompareProvider>
          </ListingProvider>
        </AuthProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
