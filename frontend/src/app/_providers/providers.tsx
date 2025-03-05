'use client';
import { QueryClientProvider } from '@tanstack/react-query';
import { PostHogProvider } from './posthog-provider';
import { getQueryClient } from '~/lib/get-query-client';

export default function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <PostHogProvider>
        {children}
      </PostHogProvider>
    </QueryClientProvider>
  );
} 