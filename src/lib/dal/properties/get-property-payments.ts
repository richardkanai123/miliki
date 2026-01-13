'use server'

import { authCheck } from "@/lib/auth-check"
import { hasPermission } from "@/lib/permission-helpers"
import { prisma } from "@/lib/prisma"
import { cacheTag } from "next/cache"

export type PropertyPayment = NonNullable<Awaited<ReturnType<typeof fetchPropertyPayments>>>[number]

// Cached function - only fetches data, no auth
async function fetchPropertyPayments(propertyId: string, limit?: number) {
    'use cache'
    const cacheKey = `property-payments-${propertyId}`
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

    // Get invoice IDs for these tenancies
    const invoices = await prisma.invoice.findMany({
        where: { tenancyId: { in: tenancyIds } },
        select: { id: true }
    })

    const invoiceIds = invoices.map(i => i.id)

    return prisma.payment.findMany({
        where: {
            invoiceId: { in: invoiceIds }
        },
        include: {
            invoice: {
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
                }
            }
        },
        orderBy: {
            initiatedAt: 'desc'
        },
        take: limit
    })
}

// Public function - handles auth, then calls cached function
export async function getPropertyPayments(propertyId: string, limit?: number) {
    try {
        if (!propertyId) {
            return { message: "Property ID is required", success: false, payments: [] }
        }

        const session = await authCheck()
        if (!session) {
            return { message: "You must be logged in to view payments", success: false, payments: [] }
        }

        const hasPermissionToRead = await hasPermission({
            resource: "property",
            action: "read",
        })
        if (!hasPermissionToRead) {
            return { message: "You do not have permission to view payments", success: false, payments: [] }
        }

        const payments = await fetchPropertyPayments(propertyId, limit)
        return { message: "Payments fetched successfully", success: true, payments }
    } catch (error) {
        console.error("Error fetching property payments:", error)
        const errorMessage = error instanceof Error ? error.message : "Unknown error"
        return { message: errorMessage, success: false, payments: [] }
    }
}
