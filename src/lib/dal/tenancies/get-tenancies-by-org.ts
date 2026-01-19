'use server'

import { authCheck } from "@/lib/auth-check"
import { hasPermission } from "@/lib/permission-helpers"
import { prisma } from "@/lib/prisma"
import { cacheTag } from "next/cache"
import type { Prisma } from "@/app/_generated/prisma/client/client"

export type OrgTenancy = Prisma.TenancyGetPayload<{
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
    }
}>

// Cached function - only fetches data, no auth
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
    return prisma.tenancy.findMany({
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
}

// Public function - handles auth, then calls cached function
export async function getTenanciesByOrg(slug: string) {
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

        const tenancies = await fetchTenanciesByOrg(slug)
        return { message: "Tenancies fetched successfully", success: true, tenancies }
    } catch (error) {
        console.error("Error fetching tenancies:", error)
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
        return { message: errorMessage, success: false, tenancies: [] }
    }
}
