'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { getQueryClient } from '../../lib/get-query-client';
import { PostHogProvider } from './posthog-provider';
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