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

// Helper to convert Date to ISO string
function toISOString(value: Date | string | null | undefined): string {
    if (!value) return ''
    if (value instanceof Date) return value.toISOString()
    return String(value)
}

function toISOStringOrNull(value: Date | string | null | undefined): string | null {
    if (!value) return null
    if (value instanceof Date) return value.toISOString()
    return String(value)
}

// Serialized type for Client Component compatibility
export interface OrgTenancy {
    id: string
    startDate: string
    endDate: string | null
    monthlyRent: number
    depositAmount: number | null
    depositPaid: boolean
    billingDay: number
    status: string
    cancelReason: string | null
    cancelledAt: string | null
    unitId: string
    tenantId: string
    previousTenancyId: string | null
    createdAt: string
    updatedAt: string
    unit: {
        id: string
        title: string
        description: string | null
        locationInProperty: string | null
        rentAmount: number
        depositAmount: number | null
        bedrooms: number
        bathrooms: number
        squareMeters: number | null
        images: string[]
        status: string
        type: string
        isListed: boolean
        listingTitle: string | null
        listingDescription: string | null
        listedAt: string | null
        propertyId: string
        createdAt: string
        updatedAt: string
        property: {
            id: string
            name: string
            organization: {
                slug: string
            }
        }
    }
    tenant: {
        id: string
        userId: string
        organizationId: string
        role: string
        createdAt: string
        user: {
            id: string
            name: string
            email: string
            image: string | null
        }
    }
}

// Cached function - fetches and serializes data (no auth)
// IMPORTANT: Serialization happens HERE so cached data is already plain objects
async function fetchTenanciesByOrg(slug: string): Promise<OrgTenancy[]> {
    'use cache'
    const cacheKey = `tenancies-by-org-${slug}`
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

    // Get all units for these properties
    const units = await prisma.unit.findMany({
        where: { propertyId: { in: propertyIds } },
        select: { id: true }
    })

    const unitIds = units.map(u => u.id)

    // Get all tenancies for these units
    const tenancies = await prisma.tenancy.findMany({
        where: {
            unitId: { in: unitIds }
        },
        include: {
            unit: {
                include: {
                    property: {
                        select: {
                            id: true,
                            name: true,
                            organization: {
                                select: {
                                    slug: true
                                }
                            }
                        }
                    }
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

    // Serialize all fields INSIDE the cached function
    // This ensures cached data is already plain objects
    return tenancies.map(tenancy => ({
        id: tenancy.id,
        startDate: toISOString(tenancy.startDate),
        endDate: toISOStringOrNull(tenancy.endDate),
        monthlyRent: toNumber(tenancy.monthlyRent),
        depositAmount: toNumberOrNull(tenancy.depositAmount),
        depositPaid: tenancy.depositPaid,
        billingDay: tenancy.billingDay,
        status: tenancy.status,
        cancelReason: tenancy.cancelReason,
        cancelledAt: toISOStringOrNull(tenancy.cancelledAt),
        unitId: tenancy.unitId,
        tenantId: tenancy.tenantId,
        previousTenancyId: tenancy.previousTenancyId,
        createdAt: toISOString(tenancy.createdAt),
        updatedAt: toISOString(tenancy.updatedAt),
        unit: {
            id: tenancy.unit.id,
            title: tenancy.unit.title,
            description: tenancy.unit.description,
            locationInProperty: tenancy.unit.locationInProperty,
            rentAmount: toNumber(tenancy.unit.rentAmount),
            depositAmount: toNumberOrNull(tenancy.unit.depositAmount),
            bedrooms: tenancy.unit.bedrooms,
            bathrooms: tenancy.unit.bathrooms,
            squareMeters: tenancy.unit.squareMeters ?? null,
            images: tenancy.unit.images,
            status: tenancy.unit.status,
            type: tenancy.unit.type,
            isListed: tenancy.unit.isListed,
            listingTitle: tenancy.unit.listingTitle,
            listingDescription: tenancy.unit.listingDescription,
            listedAt: toISOStringOrNull(tenancy.unit.listedAt),
            propertyId: tenancy.unit.propertyId,
            createdAt: toISOString(tenancy.unit.createdAt),
            updatedAt: toISOString(tenancy.unit.updatedAt),
            property: {
                id: tenancy.unit.property.id,
                name: tenancy.unit.property.name,
                organization: {
                    slug: tenancy.unit.property.organization.slug,
                }
            },
        },
        tenant: {
            id: tenancy.tenant.id,
            userId: tenancy.tenant.userId,
            organizationId: tenancy.tenant.organizationId,
            role: tenancy.tenant.role,
            createdAt: toISOString(tenancy.tenant.createdAt),
            user: {
                id: tenancy.tenant.user.id,
                name: tenancy.tenant.user.name,
                email: tenancy.tenant.user.email,
                image: tenancy.tenant.user.image,
            }
        },
    }))
}

// Public function - handles auth, then calls cached function
export async function getTenanciesByOrg(slug: string): Promise<{ message: string; success: boolean; tenancies: OrgTenancy[] }> {
    try {
        if (!slug) {
            return { message: "Organization slug is required", success: false, tenancies: [] }
        }

        const session = await authCheck()
        if (!session) {
            return { message: "You must be logged in", success: false, tenancies: [] }
        }

        const hasPermissionToRead = await hasPermission({
            resource: "tenancy",
            action: "read",
        })
        if (!hasPermissionToRead) {
            return { message: "You do not have permission to view tenancies", success: false, tenancies: [] }
        }

        // Data is already serialized from the cached function
        const tenancies = await fetchTenanciesByOrg(slug)
        
        return { message: "Tenancies fetched successfully", success: true, tenancies }
    } catch (error) {
        console.error("Error fetching tenancies:", error)
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
        return { message: errorMessage, success: false, tenancies: [] }
    }
}
