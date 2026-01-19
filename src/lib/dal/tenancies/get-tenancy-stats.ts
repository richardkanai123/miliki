'use server'

import { authCheck } from "@/lib/auth-check"
import { hasPermission } from "@/lib/permission-helpers"
import { prisma } from "@/lib/prisma"
import { cacheTag } from "next/cache"

export interface TenancyStats {
    total: number
    active: number
    pending: number
    expired: number
    totalMonthlyRent: number
    activeTenancyRate: number
}

// Cached function - only fetches data, no auth
async function fetchTenancyStats(slug: string): Promise<TenancyStats | null> {
    'use cache'
    const cacheKey = `tenancy-stats-${slug}`
    cacheTag(cacheKey)

    // Get organization by slug
    const org = await prisma.organization.findUnique({
        where: { slug },
        select: { id: true }
    })

    if (!org) return null

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

    // Get tenancy stats grouped by status
    const [statusStats, activeRentStats] = await Promise.all([
        prisma.tenancy.groupBy({
            by: ['status'],
            where: { unitId: { in: unitIds } },
            _count: true
        }),
        prisma.tenancy.aggregate({
            where: { 
                unitId: { in: unitIds },
                status: 'ACTIVE'
            },
            _sum: { monthlyRent: true }
        })
    ])

    // Calculate totals
    const total = statusStats.reduce((acc, curr) => acc + curr._count, 0)
    const active = statusStats.find(s => s.status === 'ACTIVE')?._count ?? 0
    const pending = statusStats.find(s => s.status === 'PENDING')?._count ?? 0
    const expired = statusStats.find(s => s.status === 'EXPIRED')?._count ?? 0
    const totalMonthlyRent = activeRentStats._sum.monthlyRent ? Number(activeRentStats._sum.monthlyRent) : 0
    const activeTenancyRate = total > 0 ? Math.round((active / total) * 100) : 0

    return {
        total,
        active,
        pending,
        expired,
        totalMonthlyRent,
        activeTenancyRate,
    }
}

const defaultStats: TenancyStats = {
    total: 0,
    active: 0,
    pending: 0,
    expired: 0,
    totalMonthlyRent: 0,
    activeTenancyRate: 0,
}

// Public function - handles auth, then calls cached function
export async function getTenancyStats(slug: string): Promise<TenancyStats> {
    try {
        const session = await authCheck()
        if (!session) {
            return defaultStats
        }

        const hasPermissionToRead = await hasPermission({
            resource: "tenancy",
            action: "read",
        })
        if (!hasPermissionToRead) {
            return defaultStats
        }

        const stats = await fetchTenancyStats(slug)
        return stats ?? defaultStats
    } catch (error) {
        console.error("Error fetching tenancy stats:", error)
        return defaultStats
    }
}
