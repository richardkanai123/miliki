'use server'

import { authCheck } from "@/lib/auth-check"
import { hasPermission } from "@/lib/permission-helpers"
import { prisma } from "@/lib/prisma"
import { cacheTag } from "next/cache"
import type { Prisma } from "@/app/_generated/prisma/client/client"

export type UnitPayment = Prisma.PaymentGetPayload<{
    include: {
        invoice: {
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
        }
    }
}>

async function fetchUnitPayments(unitId: string): Promise<UnitPayment[]> {
    'use cache'
    const cacheKey = `unit-payments-${unitId}`
    cacheTag(cacheKey)

    const payments = await prisma.payment.findMany({
        where: {
            invoice: {
                tenancy: {
                    unitId: unitId
                }
            }
        },
        include: {
            invoice: {
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
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    return payments
}

export async function getUnitPayments(unitId: string) {
    try {
        const session = await authCheck()
        if (!session) {
            return { message: "Unauthorized", success: false, payments: [] }
        }

        const hasPermissionToRead = await hasPermission({
            resource: "unit",
            action: "read",
        })
        if (!hasPermissionToRead) {
            return { message: "Forbidden", success: false, payments: [] }
        }

        const payments = await fetchUnitPayments(unitId)
        return { message: "Payments found", success: true, payments }
    } catch (error) {
        console.error("Error fetching unit payments:", error)
        const errorMessage = error instanceof Error ? error.message : "Unknown error"
        return { message: errorMessage, success: false, payments: [] }
    }
}
