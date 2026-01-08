'use server'
import { authCheck } from "@/lib/auth-check"
import { hasPermission } from "@/lib/permission-helpers"
import { prisma } from "@/lib/prisma"
import { cacheTag } from "next/cache"
import type { PropertyStats } from "@/components/property/property-stats"

type GetPropertyStatsParams =
    | { organizationId: string; slug?: never }
    | { slug: string; organizationId?: never }

// Cached function - only fetches data, no auth
async function fetchPropertyStats(params: GetPropertyStatsParams): Promise<PropertyStats | null> {
    'use cache'
    const cacheKey = `property-stats-${params.slug || params.organizationId}`
    cacheTag(cacheKey)

    // Build the where clause based on which identifier was provided
    const whereClause = 'organizationId' in params && params.organizationId
        ? { id: params.organizationId }
        : { slug: params.slug }

    const org = await prisma.organization.findUnique({
        where: whereClause,
        select: { id: true }
    })

    if (!org) return null

    // Get property stats
    const [totalProperties, activeProperties, unitStats] = await Promise.all([
        // Total properties count
        prisma.property.count({
            where: { organizationId: org.id }
        }),
        // Active properties count
        prisma.property.count({
            where: { organizationId: org.id, isActive: true }
        }),
        // Unit stats aggregation
        prisma.unit.groupBy({
            by: ['status'],
            where: {
                property: { organizationId: org.id }
            },
            _count: true
        })
    ])

    // Calculate unit totals
    const totalUnits = unitStats.reduce((acc, curr) => acc + curr._count, 0)
    const occupiedUnits = unitStats
        .filter(stat => stat.status === 'OCCUPIED')
        .reduce((acc, curr) => acc + curr._count, 0)

    return {
        total: totalProperties,
        active: activeProperties,
        totalUnits,
        occupiedUnits,
    }
}

// Public function - handles auth, then calls cached function
export async function getPropertyStats(params: GetPropertyStatsParams): Promise<PropertyStats> {
    try {
        const session = await authCheck()
        if (!session) {
            return { total: 0, active: 0, totalUnits: 0, occupiedUnits: 0 }
        }

        const hasPermissionToRead = await hasPermission({
            resource: "property",
            action: "read",
        })
        if (!hasPermissionToRead) {
            return { total: 0, active: 0, totalUnits: 0, occupiedUnits: 0 }
        }

        // Call the cached function after auth passes
        const stats = await fetchPropertyStats(params)

        if (!stats) {
            return { total: 0, active: 0, totalUnits: 0, occupiedUnits: 0 }
        }

        return stats
    } catch {
        return { total: 0, active: 0, totalUnits: 0, occupiedUnits: 0 }
    }
}
