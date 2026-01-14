'use server'

import { authCheck } from "@/lib/auth-check"
import { hasPermission } from "@/lib/permission-helpers"
import { prisma } from "@/lib/prisma"
import { cacheTag } from "next/cache"

export type UnitWithDetails = {
    id: string
    title: string
    status: string
    rentAmount: number
    depositAmount: number | null
    bedrooms: number
    bathrooms: number
    squareMeters: number | null
    isListed: boolean
    locationInProperty: string | null
    type: string
    createdAt: Date
}

// Cached function - only fetches data, no auth
async function fetchUnitsByProperty(propertyId: string): Promise<UnitWithDetails[]> {
    'use cache'
    const cacheKey = `units-by-property-${propertyId}`
    cacheTag(cacheKey)

    const units = await prisma.unit.findMany({
        where: { propertyId },
        select: {
            id: true,
            title: true,
            status: true,
            rentAmount: true,
            depositAmount: true,
            bedrooms: true,
            bathrooms: true,
            squareMeters: true,
            isListed: true,
            locationInProperty: true,
            type: true,
            createdAt: true,
        },
        orderBy: { createdAt: 'desc' }
    })

    // Convert Decimal fields to numbers for Client Component compatibility
    return units.map(unit => ({
        ...unit,
        rentAmount: unit.rentAmount ? Number(unit.rentAmount) : 0,
        depositAmount: unit.depositAmount ? Number(unit.depositAmount) : null,
        squareMeters: unit.squareMeters ? Number(unit.squareMeters) : null,
    }))
}

// Public function - handles auth, then calls cached function
export async function getUnitsByProperty(propertyId: string) {
    try {
        if (!propertyId) {
            return { message: "Property ID is required", success: false, units: [] }
        }

        const session = await authCheck()
        if (!session) {
            return { message: "You must be logged in", success: false, units: [] }
        }

        const hasPermissionToRead = await hasPermission({
            resource: "unit",
            action: "read",
        })
        if (!hasPermissionToRead) {
            return { message: "You do not have permission to view units", success: false, units: [] }
        }

        const units = await fetchUnitsByProperty(propertyId)
        return { message: "Units fetched successfully", success: true, units }
    } catch (error) {
        console.error("Error fetching units:", error)
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
        return { message: errorMessage, success: false, units: [] }
    }
}
