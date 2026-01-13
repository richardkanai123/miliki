'use server'

import { authCheck } from "@/lib/auth-check"
import { hasPermission } from "@/lib/permission-helpers"
import { prisma } from "@/lib/prisma"
import { cacheTag } from "next/cache"

export type PropertyTenancy = NonNullable<Awaited<ReturnType<typeof fetchPropertyTenancies>>>[number]

// Cached function - only fetches data, no auth
async function fetchPropertyTenancies(propertyId: string) {
    'use cache'
    const cacheKey = `property-tenancies-${propertyId}`
    cacheTag(cacheKey)

    // Get all units for this property
    const units = await prisma.unit.findMany({
        where: { propertyId },
        select: { id: true }
    })

    const unitIds = units.map(u => u.id)

    return prisma.tenancy.findMany({
        where: {
            unitId: { in: unitIds }
        },
        include: {
            unit: {
                select: {
                    id: true,
                    title: true,
                    rentAmount: true,
                }
            },
            tenant: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            image: true,
                        }
                    }
                }
            }
        },
        orderBy: [
            { status: 'asc' },
            { startDate: 'desc' }
        ]
    })
}

// Public function - handles auth, then calls cached function
export async function getPropertyTenancies(propertyId: string) {
    try {
        if (!propertyId) {
            return { message: "Property ID is required", success: false, tenancies: [] }
        }

        const session = await authCheck()
        if (!session) {
            return { message: "You must be logged in to view tenancies", success: false, tenancies: [] }
        }

        const hasPermissionToRead = await hasPermission({
            resource: "property",
            action: "read",
        })
        if (!hasPermissionToRead) {
            return { message: "You do not have permission to view tenancies", success: false, tenancies: [] }
        }

        const tenancies = await fetchPropertyTenancies(propertyId)
        return { message: "Tenancies fetched successfully", success: true, tenancies }
    } catch (error) {
        console.error("Error fetching property tenancies:", error)
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
        return { message: errorMessage, success: false, tenancies: [] }
    }
}
