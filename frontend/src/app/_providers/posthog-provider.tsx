'use client'
import posthog from 'posthog-js'
import { PostHogProvider as PHProvider } from 'posthog-js/react'
import { useEffect } from 'react'
import React from 'react';
import { env } from '~/env';
import dynanmicLoader from 'next/dynamic';

const SuspendedPostHogPageView = dynanmicLoader(
    () => import("~/components/posthog-page-view"),
    { ssr: false },
)

export function PostHogProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
            api_host: '/ingest',
            ui_host: 'https://us.posthog.com',
            capture_pageview: false // Disable automatic pageview capture, as we capture manually
        })
    }, [])

    return (
        <PHProvider client={posthog}>
            <SuspendedPostHogPageView />
            {children}
        </PHProvider>
    )
}