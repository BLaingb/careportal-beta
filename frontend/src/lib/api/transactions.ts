import { useQuery } from "@tanstack/react-query";
import { apiClient } from "./client";
import { serverApiClient } from "./server";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

export interface TransactionResponse {
    id: string;
    account_id: string;
    amount: number;
    type: 'EXPENSE' | 'INCOME';
    description: string;
    category_id?: string;
    date: string;
    created_at: string;
    updated_at: string;
}

interface TransactionFilters {
    start_date?: string;
    end_date?: string;
    category_id?: string;
    min_amount?: number;
    max_amount?: number;
    type?: 'EXPENSE' | 'INCOME';
    description?: string;
}

// For server components
export async function getRecentTransactions(cookies: ReadonlyRequestCookies): Promise<TransactionResponse[]> {
    return serverApiClient<TransactionResponse[]>("/api/v1/transactions/recent", {
        method: "GET",
    }, cookies);
}

// For client components
export function useRecentTransactions() {
    return useQuery({
        queryKey: ['transactions', 'recent'],
        queryFn: () => apiClient<TransactionResponse[]>("/api/v1/transactions/recent", {
            method: "GET",
        }),
    });
}

// For server components
export async function getAccountTransactions(accountId: string, cookies: ReadonlyRequestCookies, filters?: TransactionFilters): Promise<TransactionResponse[]> {
    const queryParams = new URLSearchParams();
    if (filters) {
        (Object.entries(filters) as [keyof TransactionFilters, string | number | undefined][]).forEach(([key, value]) => {
            if (value !== undefined) {
                queryParams.append(key, value.toString());
            }
        });
    }
    
    const queryString = queryParams.toString();
    const endpoint = `/api/v1/transactions/account/${accountId}${queryString ? `?${queryString}` : ''}`;
    
    return serverApiClient<TransactionResponse[]>(endpoint, {
        method: "GET",
    }, cookies);
}

// For client components
export function useAccountTransactions(accountId: string, filters?: TransactionFilters) {
    return useQuery({
        queryKey: ['transactions', accountId, filters],
        queryFn: () => {
            const queryParams = new URLSearchParams();
            if (filters) {
                (Object.entries(filters) as [keyof TransactionFilters, string | number | undefined][]).forEach(([key, value]) => {
                    if (value !== undefined) {
                        queryParams.append(key, value.toString());
                    }
                });
            }
            
            const queryString = queryParams.toString();
            const endpoint = `/api/v1/transactions/account/${accountId}${queryString ? `?${queryString}` : ''}`;
            
            return apiClient<TransactionResponse[]>(endpoint, {
                method: "GET",
            });
        },
    });
} 