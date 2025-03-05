import { apiClient } from "./client"
import { serverApiClient } from "./server"
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies"
import { type HouseholdCreate, type HouseholdWithMembers, type HouseholdInvitationCreate, type HouseholdInvitationRead } from "./types"

export async function createHousehold(data: HouseholdCreate): Promise<HouseholdWithMembers> {
    const response = await apiClient<HouseholdWithMembers>("/api/v1/households/", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
        },
    })
    return response
}

export async function updateHousehold(id: string, data: HouseholdCreate): Promise<HouseholdWithMembers> {
    const response = await apiClient<HouseholdWithMembers>(`/api/v1/households/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
        },
    })
    return response
}

export async function createInvitation(householdId: string, data: HouseholdInvitationCreate): Promise<HouseholdInvitationRead> {
    const response = await apiClient<HouseholdInvitationRead>(`/api/v1/households/${householdId}/invitations`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
        },
    })
    return response
}

// For server components
export async function getHouseholds(cookies: ReadonlyRequestCookies): Promise<HouseholdWithMembers[]> {
    return serverApiClient<HouseholdWithMembers[]>("/api/v1/households/", {
        method: "GET",
    }, cookies)
}

// For client components
export async function getHouseholdsClient(): Promise<HouseholdWithMembers[]> {
    const response = await apiClient<HouseholdWithMembers[]>("/api/v1/households/", {
        method: "GET",
    })
    return response
} 