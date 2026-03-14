'use client';

import { useSyncExternalStore, useCallback } from 'react';

// Empty subscription since client state doesn't change
const emptySubscribe = () => () => {};

/**
 * Hook to safely detect if we're on the client side
 * Uses useSyncExternalStore to avoid hydration mismatches
 */
export function useIsClient(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true, // Client snapshot
    () => false // Server snapshot
  );
}
