'use server'

import { authCheck } from "@/lib/auth-check"
import { hasPermission } from "@/lib/permission-helpers"
import type{ Prisma } from "@/app/_generated/prisma/client/client"
import { prisma } from "@/lib/prisma"
import { cacheTag } from "next/cache"

// Helper to convert Decimal to number
function toNumber(value: Prisma.Decimal | null | undefined): number {
    if (!value) return 0
    return typeof value === 'object' && 'toNumber' in value ? value.toNumber() : Number(value) || 0
}

export type PropertyDetails = Awaited<ReturnType<typeof fetchPropertyDetails>>

// Cached function - only fetches data, no auth
async function fetchPropertyDetails(propertyId: string) {
    'use cache'
    const cacheKey = `property-details-${propertyId}`
    cacheTag(cacheKey)

    const property = await prisma.property.findUnique({
        where: { id: propertyId },
        include: {
            manager: {
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
            },
            amenities: {
                include: {
                    amenity: true
                }
            },
            units: {
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
                }
            },
            organization: {
                select: {
                    id: true,
                    name: true,
                    slug: true,
                }
            }
        }
    })

    if (!property) return null

    // Transform units to convert Decimal to numbers
    return {
        ...property,
        units: property.units.map(unit => ({
            ...unit,
            rentAmount: toNumber(unit.rentAmount),
            depositAmount: unit.depositAmount ? toNumber(unit.depositAmount) : null,
        }))
    }
}

// Public function - handles auth, then calls cached function
export async function getPropertyDetails(propertyId: string) {
    try {
        if (!propertyId) {
            return { message: "Property ID is required", success: false, property: null }
        }

        const session = await authCheck()
        if (!session) {
            return { message: "You must be logged in to view property details", success: false, property: null }
        }

        const hasPermissionToView = await hasPermission({
            resource: "property",
            action: "read",
        })
        if (!hasPermissionToView) {
            return { message: "You do not have permission to view this property", success: false, property: null }
        }

        const property = await fetchPropertyDetails(propertyId)

        if (!property) {
            return { message: "Property not found", success: false, property: null }
        }

        return { message: "Property details fetched successfully", success: true, property }
    } catch (error) {
        console.error(error)
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
        return { message: errorMessage, success: false, property: null }
    }
}