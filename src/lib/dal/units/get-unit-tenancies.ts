'use server'

import { authCheck } from "@/lib/auth-check"
import { hasPermission } from "@/lib/permission-helpers"
import { prisma } from "@/lib/prisma"
import { cacheTag } from "next/cache"
import type { Prisma } from "@/app/_generated/prisma/client/client"

export type UnitTenancy = Prisma.TenancyGetPayload<{
    include: {
        tenant: {
            include: {
                user: true
            }
        },
        unit: true // Included for consistency with PropertyTenancy if we reuse components, though we know the unit
    }
}>

async function fetchUnitTenancies(unitId: string): Promise<UnitTenancy[]> {
    'use cache'
    const cacheKey = `unit-tenancies-${unitId}`
    cacheTag(cacheKey)

    const tenancies = await prisma.tenancy.findMany({
        where: { unitId },
        include: {
            tenant: {
                include: {
                    user: true
                }
            },
            unit: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    return tenancies
}

export async function getUnitTenancies(unitId: string) {
    try {
        const session = await authCheck()
        if (!session) {
            return { message: "Unauthorized", success: false, tenancies: [] }
        }

        const hasPermissionToRead = await hasPermission({
            resource: "unit",
            action: "read",
        })
        if (!hasPermissionToRead) {
            return { message: "Forbidden", success: false, tenancies: [] }
        }

        const tenancies = await fetchUnitTenancies(unitId)
        if (!tenancies) {
            return { message: "No tenancies found", success: false, tenancies: [] }
        }
        return { message: "Tenancies found", success: true, tenancies }
    } catch (error) {
        console.error(error)
        const errorMessage = error instanceof Error ? error.message : "Unknown error"
        return { message: errorMessage, success: false, tenancies: [] }
    }
}   
