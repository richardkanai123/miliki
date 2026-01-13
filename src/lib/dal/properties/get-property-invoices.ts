'use server'

import { authCheck } from "@/lib/auth-check"
import { hasPermission } from "@/lib/permission-helpers"
import { prisma } from "@/lib/prisma"
import { cacheTag } from "next/cache"

export type PropertyInvoice = NonNullable<Awaited<ReturnType<typeof fetchPropertyInvoices>>>[number]

// Cached function - only fetches data, no auth
async function fetchPropertyInvoices(propertyId: string, limit?: number) {
    'use cache'
    const cacheKey = `property-invoices-${propertyId}`
    cacheTag(cacheKey)

    // Get all units for this property
    const units = await prisma.unit.findMany({
        where: { propertyId },
        select: { id: true }
    })

    const unitIds = units.map(u => u.id)

    // Get tenancy IDs for these units
    const tenancies = await prisma.tenancy.findMany({
        where: { unitId: { in: unitIds } },
        select: { id: true }
    })

    const tenancyIds = tenancies.map(t => t.id)

    return prisma.invoice.findMany({
        where: {
            tenancyId: { in: tenancyIds }
        },
        include: {
            tenancy: {
                include: {
                    unit: {
                        select: {
                            id: true,
                            title: true,
                        }
                    },
                    tenant: {
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    name: true,
                                }
                            }
                        }
                    }
                }
            }
        },
        orderBy: [
            { status: 'asc' },
            { dueDate: 'desc' }
        ],
        take: limit
    })
}

// Public function - handles auth, then calls cached function
export async function getPropertyInvoices(propertyId: string, limit?: number) {
    try {
        if (!propertyId) {
            return { message: "Property ID is required", success: false, invoices: [] }
        }

        const session = await authCheck()
        if (!session) {
            return { message: "You must be logged in to view invoices", success: false, invoices: [] }
        }

        const hasPermissionToRead = await hasPermission({
            resource: "property",
            action: "read",
        })
        if (!hasPermissionToRead) {
            return { message: "You do not have permission to view invoices", success: false, invoices: [] }
        }

        const invoices = await fetchPropertyInvoices(propertyId, limit)
        return { message: "Invoices fetched successfully", success: true, invoices }
    } catch (error) {
        console.error("Error fetching property invoices:", error)
        return { message: "An error occurred while fetching invoices", success: false, invoices: [] }
    }
}
