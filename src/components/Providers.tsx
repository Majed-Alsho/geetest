'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { CompareProvider } from '@/contexts/CompareContext';
import { NavigationProvider } from '@/contexts/NavigationContext';
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
import { ReactNode, useState } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ListingProvider>
          <CompareProvider>
            <NavigationProvider>
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
            </NavigationProvider>
          </CompareProvider>
        </ListingProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
