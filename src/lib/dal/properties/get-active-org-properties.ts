'use server'
import { authCheck } from "@/lib/auth-check"
import { hasPermission } from "@/lib/permission-helpers"
import { prisma } from "@/lib/prisma"
import { cacheTag } from "next/cache"


async function fetchActiveOrgProperties(activeOrganizationId: string) {
    'use cache'
    const cacheKey = `active-org-properties-${activeOrganizationId}`
    cacheTag(cacheKey)
    return prisma.property.findMany({
        where: {
            organizationId: activeOrganizationId,
        },
    })
}

export async function getActiveOrgProperties() {
    try {
        const session = await authCheck()
    if (!session) {
        return { message: "You must be logged in to get organization properties", success: false, properties: null }
    }
    const activeOrganizationId = session.session?.activeOrganizationId
    if (!activeOrganizationId) {
        return { message: "You must be in an organization to get organization properties", success: false, properties: null }
        }
    // check if current user has permission to get organization properties
    const hasPermissionToGetProperties = await hasPermission({
        resource: "property",
        action: "read",
    })
    if (!hasPermissionToGetProperties) {
        return { message: "You do not have permission to get organization properties", success: false, properties: null }
        }
    // get all properties for the active organization
        const properties = await fetchActiveOrgProperties(activeOrganizationId)
        if (!properties) {
            return { message: "No active organization properties found", success: false, properties: null }
        }
    return { message: "Organization properties fetched successfully", success: true, properties: properties }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Internal server error"
        return { message: errorMessage, success: false, properties: null }
        
    }
}