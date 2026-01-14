'use server'

import { authCheck } from "@/lib/auth-check"
import { hasPermission } from "@/lib/permission-helpers"
import { prisma } from "@/lib/prisma"
import { cacheTag } from "next/cache"

export interface UnitStats {
    total: number
    occupied: number
    vacant: number
    maintenance: number
    totalRent: number
    occupancyRate: number
}

// Cached function - only fetches data, no auth
async function fetchUnitStats(propertyId: string): Promise<UnitStats | null> {
    'use cache'
    const cacheKey = `unit-stats-${propertyId}`
    cacheTag(cacheKey)

    // Verify property exists
    const property = await prisma.property.findUnique({
        where: { id: propertyId },
        select: { id: true }
    })

    if (!property) return null

    // Get unit stats grouped by status
    const [statusStats, rentStats] = await Promise.all([
        prisma.unit.groupBy({
            by: ['status'],
            where: { propertyId },
            _count: true
        }),
        prisma.unit.aggregate({
            where: { propertyId, status: 'OCCUPIED' },
            _sum: { rentAmount: true }
        })
    ])

    // Calculate totals
    const total = statusStats.reduce((acc, curr) => acc + curr._count, 0)
    const occupied = statusStats.find(s => s.status === 'OCCUPIED')?._count ?? 0
    const vacant = statusStats.find(s => s.status === 'VACANT')?._count ?? 0
    const maintenance = statusStats.find(s => s.status === 'MAINTENANCE')?._count ?? 0
    const totalRent = rentStats._sum.rentAmount ? Number(rentStats._sum.rentAmount) : 0
    const occupancyRate = total > 0 ? Math.round((occupied / total) * 100) : 0

    return {
        total,
        occupied,
        vacant,
        maintenance,
        totalRent,
        occupancyRate,
    }
}

const defaultStats: UnitStats = {
    total: 0,
    occupied: 0,
    vacant: 0,
    maintenance: 0,
    totalRent: 0,
    occupancyRate: 0,
}

// Public function - handles auth, then calls cached function
export async function getUnitStats(propertyId: string): Promise<UnitStats> {
    try {
        const session = await authCheck()
        if (!session) {
            return defaultStats
        }

        const hasPermissionToRead = await hasPermission({
            resource: "unit",
            action: "read",
        })
        if (!hasPermissionToRead) {
            return defaultStats
        }

        const stats = await fetchUnitStats(propertyId)
        return stats ?? defaultStats
    } catch (error) {
        console.error("Error fetching unit stats:", error)
        return defaultStats
    }
}
