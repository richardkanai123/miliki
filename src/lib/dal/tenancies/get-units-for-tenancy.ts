'use server'

import { authCheck } from "@/lib/auth-check"
import { hasPermission } from "@/lib/permission-helpers"
import { prisma } from "@/lib/prisma"
import { cacheTag } from "next/cache"
import type { Prisma } from "@/app/_generated/prisma/client/client"

// Helper to safely convert Decimal to number
function toNumber(value: Prisma.Decimal | number | null | undefined): number {
    if (!value) return 0
    if (typeof value === 'number') return value
    if (typeof value === 'object' && 'toNumber' in value && typeof value.toNumber === 'function') {
        return value.toNumber()
    }
    return Number(value) || 0
}

// Helper to safely convert Decimal to number or null
function toNumberOrNull(value: Prisma.Decimal | number | null | undefined): number | null {
    if (value === null || value === undefined) return null
    if (typeof value === 'number') return value
    if (typeof value === 'object' && 'toNumber' in value && typeof value.toNumber === 'function') {
        return value.toNumber()
    }
    const num = Number(value)
    return Number.isNaN(num) ? null : num
}

// Serialized type for Client Component compatibility
export interface UnitForTenancy {
    id: string
    title: string
    propertyId: string
    property: {
        id: string
        name: string
    }
    rentAmount: number
    depositAmount: number | null
    status: string
}

// Cached function - fetches and serializes data (no auth)
// IMPORTANT: Serialization happens HERE so cached data is already plain objects
async function fetchUnitsForTenancy(slug: string): Promise<UnitForTenancy[]> {
    'use cache'
    const cacheKey = `units-for-tenancy-${slug}`
    cacheTag(cacheKey)

    // Get organization by slug
    const org = await prisma.organization.findUnique({
        where: { slug },
        select: { id: true }
    })

    if (!org) return []

    // Get all properties for this organization
    const properties = await prisma.property.findMany({
        where: { organizationId: org.id },
        select: { id: true }
    })

    const propertyIds = properties.map(p => p.id)

    // Get all VACANT units for these properties (exclude occupied and maintenance units)
    const units = await prisma.unit.findMany({
        where: { 
            propertyId: { in: propertyIds },
            status: 'VACANT', // Only show units available for rent
        },
        select: {
            id: true,
            title: true,
            propertyId: true,
            rentAmount: true,
            depositAmount: true,
            status: true,
            property: {
                select: {
                    id: true,
                    name: true,
                }
            }
        },
        orderBy: [
            { property: { name: 'asc' } },
            { title: 'asc' }
        ]
    })

    // Serialize Decimal fields INSIDE the cached function
    return units.map(unit => ({
        id: unit.id,
        title: unit.title,
        propertyId: unit.propertyId,
        property: {
            id: unit.property.id,
            name: unit.property.name,
        },
        rentAmount: toNumber(unit.rentAmount),
        depositAmount: toNumberOrNull(unit.depositAmount),
        status: unit.status,
    }))
}

// Public function - handles auth, then calls cached function
export async function getUnitsForTenancy(slug: string): Promise<{ message: string; success: boolean; units: UnitForTenancy[] }> {
    try {
        if (!slug) {
            return { message: "Organization slug is required", success: false, units: [] }
        }

        const session = await authCheck()
        if (!session) {
            return { message: "You must be logged in", success: false, units: [] }
        }

        const hasPermissionToRead = await hasPermission({
            resource: "tenancy",
            action: "create",
        })
        if (!hasPermissionToRead) {
            return { message: "You do not have permission to create tenancies", success: false, units: [] }
        }

        // Data is already serialized from the cached function
        const units = await fetchUnitsForTenancy(slug)
        
        return { message: "Units fetched successfully", success: true, units }
    } catch (error) {
        console.error("Error fetching units:", error)
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
        return { message: errorMessage, success: false, units: [] }
    }
}
