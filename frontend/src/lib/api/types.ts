export type HouseholdType = "PERSONAL" | "SHARED"
export type MemberRole = "ADMIN" | "MEMBER"
export type InvitationStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "EXPIRED"
export type AccountType = "BALANCE_TRACKING" | "BUDGETED"

export interface HouseholdCreate {
    name: string
    type: HouseholdType
}

export interface HouseholdRead {
    name: string
    type: HouseholdType
    id: string
    created_at: string
    updated_at: string
}

export interface UserRead {
    first_name: string
    last_name: string
    email: string
    created_at: string
    updated_at?: string | null
    id: string
}

export interface HouseholdMemberRead {
    household_id: string
    user_id: string
    role: MemberRole
    id: string
    joined_at: string
    user: UserRead
}

export interface HouseholdWithMembers extends HouseholdRead {
    members: HouseholdMemberRead[]
}

export interface HouseholdInvitationCreate {
    email: string
    role: MemberRole
}

export interface HouseholdInvitationRead {
    id: string
    household_id: string
    email: string
    role: MemberRole
    invited_by: string
    status: InvitationStatus
    created_at: string
    expires_at: string
    accepted_at?: string | null
}

export interface AccountAPIInput {
    household_id: string
    name: string
    type: AccountType
    currency: string
    initial_balance: number
}

export interface AccountResponse {
    id: string
    household_id: string
    name: string
    type: AccountType
    currency: string
    current_balance: number
    created_at: string
    updated_at: string
} 