'use server'

import { authCheck } from "@/lib/auth-check"
import { hasPermission } from "@/lib/permission-helpers"
import { prisma } from "@/lib/prisma"
import { cacheTag } from "next/cache"

export type UnitForTenancy = {
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

// Cached function - only fetches data, no auth
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

    // Convert Decimal to numbers
    return units.map(unit => ({
        ...unit,
        rentAmount: unit.rentAmount ? Number(unit.rentAmount) : 0,
        depositAmount: unit.depositAmount ? Number(unit.depositAmount) : null,
    }))
}

// Public function - handles auth, then calls cached function
export async function getUnitsForTenancy(slug: string) {
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

        const units = await fetchUnitsForTenancy(slug)
        return { message: "Units fetched successfully", success: true, units }
    } catch (error) {
        console.error("Error fetching units:", error)
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
        return { message: errorMessage, success: false, units: [] }
    }
}
