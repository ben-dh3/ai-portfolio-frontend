'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WalletProvider } from '../context/WalletContext';
import { ReactNode } from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 20, 
      gcTime: 1000 * 60 * 30, 
      refetchOnWindowFocus: false,
    },
  },
});

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <WalletProvider>{children}</WalletProvider>
    </QueryClientProvider>
  );
}