'use server'

import { prisma } from "@/lib/prisma"
import { authCheck } from "@/lib/auth-check"
import { hasPermission } from "@/lib/permission-helpers"
import { cacheTag } from "next/cache"

async function fetchUnit(unitId: string) {
    'use cache'
    const cacheKey = `unit-${unitId}`
    cacheTag(cacheKey)

    const unit = await prisma.unit.findUnique({
        where: { id: unitId },
        include: {
            property: {
                include: {
                    organization: true
                }
            }
        }
    })

    if (!unit) return null

    // Serialize Decimal fields to plain numbers for Client Component compatibility
    return {
        ...unit,
        rentAmount: unit.rentAmount ? Number(unit.rentAmount) : 0,
        depositAmount: unit.depositAmount ? Number(unit.depositAmount) : null,
        squareMeters: unit.squareMeters ? Number(unit.squareMeters) : null,
    }
}

export type UnitDetails = Awaited<ReturnType<typeof fetchUnit>>

export async function getUnit(unitId: string) {
    try {
        if (!unitId) {
            return { message: "Unit ID is required", success: false, unit: null }
        }

        const session = await authCheck()
        if (!session) {
            return { message: "You must be logged in to get a unit", success: false, unit: null }
        }

        const hasPermissionToGetUnit = await hasPermission({
            resource: "unit",
            action: "read",
        })
        if (!hasPermissionToGetUnit) {
            return { message: "You do not have permission to get this unit", success: false, unit: null }
        }
        
        const unit = await fetchUnit(unitId)
        if (!unit) {
            return { message: "Unit not found", success: false, unit: null }
        }

        return { message: "Unit found", success: true, unit }
    }
    catch (error) {
        console.error(error)
        const errorMessage = error instanceof Error ? error.message : "Unknown error"
        return { message: errorMessage, success: false, unit: null }
    }
}
