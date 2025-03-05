import { useQuery } from "@tanstack/react-query";
import { apiClient } from "./client";
import { serverApiClient } from "./server";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { type AccountAPIInput, type AccountResponse } from "./types";

// For server components
export async function getAccounts(cookies: ReadonlyRequestCookies): Promise<AccountResponse[]> {
    return serverApiClient<AccountResponse[]>("/api/v1/accounts/", {
        method: "GET",
    }, cookies);
}

// For client components
export function useAccounts() {
    return useQuery({
        queryKey: ['accounts'],
        queryFn: () => apiClient<AccountResponse[]>("/api/v1/accounts/", {
            method: "GET",
        }),
    });
}

export async function createAccount(data: AccountAPIInput): Promise<AccountResponse> {
    const response = await apiClient<AccountResponse>("/api/v1/accounts/", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
        },
    })
    return response
} 