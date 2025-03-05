import { useMutation, useQuery } from "@tanstack/react-query";
import { apiClient } from "./client";
import { serverApiClient } from "./server";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import type { RequestCookies } from "next/dist/server/web/spec-extension/cookies";

interface SignupRequest {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
}

interface UserResponse {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    created_at: string;
    updated_at: string;
}

interface LoginRequest {
    email: string;
    password: string;
}

export function useSignupMutation() {
    return useMutation({
        mutationFn: async (data: SignupRequest) => {
            return fetch("/api/auth/signup", {
                method: "POST",
                body: JSON.stringify(data),
            });
        },
    });
}

export function useLoginMutation() {
    return useMutation({
        mutationFn: async (data: LoginRequest) => {
            return fetch("/api/auth/login", {
                method: "POST",
                body: JSON.stringify(data),
            });
        },
    });
}

// For client components
export function useCurrentUser() {
    return useQuery({
        queryKey: ['currentUser'],
        queryFn: () => apiClient<UserResponse>("/api/v1/users/me", {
            method: "GET",
        }),
    });
}

// For server components and middleware
export async function getCurrentUser(cookies: ReadonlyRequestCookies | RequestCookies): Promise<UserResponse | null> {
    try {
        return await serverApiClient<UserResponse>("/api/v1/users/me", {
            method: "GET",
        }, cookies);
    } catch {
        // If the user is not logged in, return null instead of throwing
        return null;
    }
} 