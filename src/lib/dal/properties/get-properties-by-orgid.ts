'use server'
import { authCheck } from "@/lib/auth-check"
import { hasPermission } from "@/lib/permission-helpers"
import { prisma } from "@/lib/prisma"
import { cacheTag } from "next/cache"

type GetPropertiesParams = 
    | { organizationId: string; slug?: never }
    | { slug: string; organizationId?: never }

// Cached function - only fetches data, no auth
async function fetchPropertiesByOrg(params: GetPropertiesParams) {
    'use cache'
    const cacheKey = `properties-${params.slug || params.organizationId}`
    cacheTag(cacheKey)

    // Build the where clause based on which identifier was provided
    const whereClause = 'organizationId' in params && params.organizationId
        ? { id: params.organizationId }
        : { slug: params.slug }

    const org = await prisma.organization.findUnique({
        where: whereClause,
    })
    if (!org) {
        return { org: null, properties: null }
    }

    const properties = await prisma.property.findMany({
        where: {
            organizationId: org.id,
        },
        include: {
            _count: {
                select: { units: true }
            }
        },
        orderBy: { createdAt: 'desc' }
    })
    return { org, properties }
}

// Public function - handles auth, then calls cached function
export async function getPropertiesByOrg(params: GetPropertiesParams) {
    try {
        const session = await authCheck()
        if (!session) {
            return { message: "You must be logged in to get organization properties", success: false, properties: null }
        }
        
        const hasPermissionToGetProperties = await hasPermission({
            resource: "property",
            action: "read",
        })
        if (!hasPermissionToGetProperties) {
            return { message: "You do not have permission to get organization properties", success: false, properties: null }
        }

        // Call the cached function after auth passes
        const { org, properties } = await fetchPropertiesByOrg(params)
        
        if (!org) {
            return { message: "Organization not found", success: false, properties: null }
        }

        return { message: "Properties fetched successfully", success: true, properties }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Internal server error"
        return { message: errorMessage, success: false, properties: null }
    }
}
