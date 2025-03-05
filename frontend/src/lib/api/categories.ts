import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "./client"
import { serverApiClient } from "./server"
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies"

export interface CategoryResponse {
    id: string
    account_id: string
    name: string
    created_at: string
    deleted_at: string | null
    current_budget: number | null
}

export interface CategoryCreateAPI {
    name: string
    initial_budget?: number | null
}

export interface CategoryUpdate {
    name?: string | null
}

// Server Components
export async function getCategories(accountId: string, cookies: ReadonlyRequestCookies): Promise<CategoryResponse[]> {
    return serverApiClient<CategoryResponse[]>(`/api/v1/accounts/${accountId}/categories`, {
        method: "GET",
    }, cookies)
}

export async function getCategory(accountId: string, categoryId: string, cookies: ReadonlyRequestCookies): Promise<CategoryResponse> {
    return serverApiClient<CategoryResponse>(`/api/v1/accounts/${accountId}/categories/${categoryId}`, {
        method: "GET",
    }, cookies)
}

// Client Components
export function useCategories(accountId: string) {
    return useQuery({
        queryKey: ['categories', accountId],
        queryFn: () => apiClient<CategoryResponse[]>(`/api/v1/accounts/${accountId}/categories`, {
            method: "GET",
        }),
    })
}

export function useCreateCategory() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ accountId, data }: { accountId: string, data: CategoryCreateAPI }) => {
            return apiClient<CategoryResponse>(`/api/v1/accounts/${accountId}/categories`, {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json",
                },
            })
        },
        onSuccess: async (_, { accountId }) => {
            await queryClient.invalidateQueries({ queryKey: ['categories', accountId] })
        },
    })
}

export function useUpdateCategory() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ accountId, categoryId, data }: { accountId: string, categoryId: string, data: CategoryUpdate }) => {
            return apiClient<CategoryResponse>(`/api/v1/accounts/${accountId}/categories/${categoryId}`, {
                method: "PATCH",
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json",
                },
            })
        },
        onSuccess: async (_, { accountId }) => {
            await queryClient.invalidateQueries({ queryKey: ['categories', accountId] })
        },
    })
}

export function useDeleteCategory() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ accountId, categoryId }: { accountId: string, categoryId: string }) => {
            return apiClient(`/api/v1/accounts/${accountId}/categories/${categoryId}`, {
                method: "DELETE",
            })
        },
        onSuccess: async (_, { accountId }) => {
            await queryClient.invalidateQueries({ queryKey: ['categories', accountId] })
        },
    })
}

// Budget-related functions
export function useCurrentBudget(accountId: string, categoryId: string) {
    return useQuery({
        queryKey: ['budgets', categoryId],
        queryFn: () => apiClient<{ amount: number } | null>(`/api/v1/budgets/categories/${categoryId}/current`, {
            method: "GET",
        }),
    })
} 