'use server'

import { authCheck } from "@/lib/auth-check"
import { hasPermission } from "@/lib/permission-helpers"
import { prisma } from "@/lib/prisma"
import { cacheTag } from "next/cache"
import type { Prisma } from "@/app/_generated/prisma/client/client"

export type UnitInvoice = Prisma.InvoiceGetPayload<{
    include: {
        tenancy: {
            include: {
                tenant: {
                    include: {
                        user: true
                    }
                },
                unit: true
            }
        }
    }
}>

async function fetchUnitInvoices(unitId: string): Promise<UnitInvoice[]> {
    'use cache'
    const cacheKey = `unit-invoices-${unitId}`
    cacheTag(cacheKey)

    const invoices = await prisma.invoice.findMany({
        where: {
            tenancy: {
                unitId: unitId
            }
        },
        include: {
            tenancy: {
                include: {
                    tenant: {
                        include: {
                            user: true
                        }
                    },
                    unit: true
                }
            }
        },
        orderBy: {
            dueDate: 'desc'
        }
    })

    return invoices
}

export async function getUnitInvoices(unitId: string) {
    try {
        const session = await authCheck()
        if (!session) {
            return { message: "Unauthorized", success: false, invoices: [] }
        }

        const hasPermissionToRead = await hasPermission({
            resource: "unit",
            action: "read",
        })
        if (!hasPermissionToRead) {
            return { message: "Forbidden", success: false, invoices: [] }
        }

        const invoices = await fetchUnitInvoices(unitId)
        return { message: "Invoices found", success: true, invoices }
    } catch (error) {
        console.error("Error fetching unit invoices:", error)
        const errorMessage = error instanceof Error ? error.message : "Unknown error"
        return { message: errorMessage, success: false, invoices: [] }
    }
}
