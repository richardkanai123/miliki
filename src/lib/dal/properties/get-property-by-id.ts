'use server'

import { authCheck } from "@/lib/auth-check"
import { hasPermission } from "@/lib/permission-helpers"
import { prisma } from "@/lib/prisma"
import { cacheTag } from "next/cache"

// Cached function - only fetches data, no auth
async function fetchPropertyById(propertyId: string) {
    'use cache'
    const cacheKey = `property-by-id-${propertyId}`
    cacheTag(cacheKey)

    return prisma.property.findUnique({
        where: { id: propertyId },
    })
}

// Public function - handles auth, then calls cached function
export async function getPropertyById(propertyId: string) {
    try {
        if (!propertyId) {
            return { message: "Property ID is required", success: false, property: null }
        }
        
        const session = await authCheck()
        if (!session) {
            return { message: "You must be logged in to get a property", success: false, property: null }
        }

        const hasPermissionToGetProperty = await hasPermission({
            resource: "property",
            action: "read",
        })
        if (!hasPermissionToGetProperty) {
            return { message: "You do not have permission to get this property", success: false, property: null }
        }

        // Call the cached function after auth passes
        const property = await fetchPropertyById(propertyId)
        
        if (!property) {
            return { message: "Property not found", success: false, property: null }
        }
        return { message: "Property found", success: true, property }
    } catch (error) {
        console.error(error)
        return { message: "An error occurred while getting the property", success: false, property: null }
    }
}
