'use server'

import { authCheck } from "@/lib/auth-check"
import { hasPermission } from "@/lib/permission-helpers"
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'

export type MemberForTenancy = {
    id: string
    name: string
    email: string
    image: string | null
    hasActiveTenancy?: boolean
}

// Roles that should NOT be available as tenants
const NON_TENANT_ROLES = ['owner', 'admin', 'manager']

// Public function - handles auth, then fetches members with "member" role only
export async function getMembersForTenancy(slug: string) {
    try {
        if (!slug) {
            return { message: "Organization slug is required", success: false, members: [] }
        }

        const session = await authCheck()
        if (!session) {
            return { message: "You must be logged in", success: false, members: [] }
        }

        const hasPermissionToCreate = await hasPermission({
            resource: "tenancy",
            action: "create",
        })
        if (!hasPermissionToCreate) {
            return { message: "You do not have permission to create tenancies", success: false, members: [] }
        }

        // Get all members for the organization
        const membersResult = await auth.api.listMembers({
            headers: await headers(),
            query: {
                organizationSlug: slug,
            }
        })

        // Filter to only include members with "member" role (tenants)
        // Exclude owners, admins, and managers
        const tenantMembers = membersResult.members?.filter(
            (member: { role: string }) => !NON_TENANT_ROLES.includes(member.role?.toLowerCase())
        ) ?? []

        const members: MemberForTenancy[] = tenantMembers.map((member: {
            id: string
            role: string
            user?: {
                name?: string
                email?: string
                image?: string | null
            }
        }) => ({
            id: member.id,
            name: member.user?.name ?? '',
            email: member.user?.email ?? '',
            image: member.user?.image ?? null,
        }))

        return { message: "Members fetched successfully", success: true, members }
    } catch (error) {
        console.error("Error fetching members:", error)
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
        return { message: errorMessage, success: false, members: [] }
    }
}
