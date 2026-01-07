'use server'
import { authCheck } from "@/lib/auth-check"
import { hasPermission } from "@/lib/permission-helpers"
import { prisma } from "@/lib/prisma"

export async function getPropertiesByOrgId(orgId: string) {
    try {
        const session = await authCheck()
    if (!session) {
        return { message: "You must be logged in to get organization properties", success: false, properties: null }
    }
    // check if orgId is valid and current user is a member of the organization
    const hasPermissionToGetProperties = await hasPermission({
        resource: "property",
        action: "read",
    })
    if (!hasPermissionToGetProperties) {
        return { message: "You do not have permission to get organization properties", success: false, properties: null }
    }
    const org = await prisma.organization.findUnique({
        where: {
            id: orgId,
        },
    })
    if (!org) {
        return { message: "Organization not found", success: false, properties: null }
    }

    const properties = await prisma.property.findMany({
        where: {
            organizationId: orgId,
        },
    })
    return { message: "Properties fetched successfully", success: true, properties: properties }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Internal server error"
        return { message: errorMessage, success: false, properties: null }
    }
}