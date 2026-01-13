'use server'

import { authCheck } from "@/lib/auth-check"
import { hasPermission } from "@/lib/permission-helpers"
import { prisma } from "@/lib/prisma"
import { cacheTag } from "next/cache"
import { Prisma } from "@/app/_generated/prisma/client/client"
const Decimal = Prisma.Decimal

// Use plain numbers for Client Component compatibility
export interface PropertyFinancialStats {
    totalUnits: number
    occupiedUnits: number
    vacantUnits: number
    maintenanceUnits: number
    reservedUnits: number
    listedUnits: number
    occupancyRate: number
    expectedMonthlyIncome: number
    collectedThisMonth: number
    pendingIncome: number
    overdueAmount: number
    overdueInvoicesCount: number
    expiringTenanciesCount: number
    unpaidDepositsCount: number
}

// Helper to safely convert Decimal to number
function toNumber(value: Prisma.Decimal | null | undefined): number {
    if (!value) return 0
    return value.toNumber()
}

// Cached function - only fetches data, no auth
async function fetchPropertyFinancialStats(propertyId: string): Promise<PropertyFinancialStats | null> {
    'use cache'
    const cacheKey = `property-financial-stats-${propertyId}`
    cacheTag(cacheKey)

    // Verify property exists
    const property = await prisma.property.findUnique({
        where: { id: propertyId },
        select: { id: true }
    })

    if (!property) return null

    // Get all unit IDs for this property
    const propertyUnits = await prisma.unit.findMany({
        where: { propertyId },
        select: { id: true, status: true, isListed: true, rentAmount: true }
    })

    const unitIds = propertyUnits.map(u => u.id)

    // Calculate unit stats
    const totalUnits = propertyUnits.length
    const occupiedUnits = propertyUnits.filter(u => u.status === 'OCCUPIED').length
    const vacantUnits = propertyUnits.filter(u => u.status === 'VACANT').length
    const maintenanceUnits = propertyUnits.filter(u => u.status === 'MAINTENANCE').length
    const reservedUnits = propertyUnits.filter(u => u.status === 'RESERVED').length
    const listedUnits = propertyUnits.filter(u => u.isListed).length
    const occupancyRate = totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0

    // Get active tenancies for expected monthly income
    const activeTenancies = await prisma.tenancy.findMany({
        where: {
            unitId: { in: unitIds },
            status: 'ACTIVE'
        },
        select: {
            id: true,
            monthlyRent: true,
            depositPaid: true,
            endDate: true,
        }
    })

    const tenancyIds = activeTenancies.map(t => t.id)

    // Calculate expected monthly income from active tenancies
    const expectedMonthlyIncome = activeTenancies.reduce(
        (sum, t) => sum.add(t.monthlyRent),
        new Decimal(0)
    )

    // Get current month's date range
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)

    // Get payments completed this month
    const paymentsThisMonth = await prisma.payment.aggregate({
        where: {
            invoice: {
                tenancyId: { in: tenancyIds }
            },
            status: 'COMPLETED',
            completedAt: {
                gte: startOfMonth,
                lte: endOfMonth
            }
        },
        _sum: {
            amount: true
        }
    })

    const collectedThisMonth = paymentsThisMonth._sum.amount ?? new Decimal(0)

    // Get pending invoices (PENDING status)
    const pendingInvoices = await prisma.invoice.aggregate({
        where: {
            tenancyId: { in: tenancyIds },
            status: 'PENDING'
        },
        _sum: {
            balance: true
        }
    })

    const pendingIncome = pendingInvoices._sum.balance ?? new Decimal(0)

    // Get overdue invoices
    const overdueInvoices = await prisma.invoice.aggregate({
        where: {
            tenancyId: { in: tenancyIds },
            status: 'OVERDUE'
        },
        _sum: {
            balance: true
        },
        _count: true
    })

    const overdueAmount = overdueInvoices._sum.balance ?? new Decimal(0)
    const overdueInvoicesCount = overdueInvoices._count

    // Get tenancies expiring within 30 days
    const thirtyDaysFromNow = new Date()
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)

    const expiringTenancies = await prisma.tenancy.count({
        where: {
            unitId: { in: unitIds },
            status: 'ACTIVE',
            endDate: {
                gte: now,
                lte: thirtyDaysFromNow
            }
        }
    })

    // Get tenancies with unpaid deposits
    const unpaidDeposits = activeTenancies.filter(t => !t.depositPaid).length

    // Convert all Decimal values to numbers for Client Component compatibility
    return {
        totalUnits,
        occupiedUnits,
        vacantUnits,
        maintenanceUnits,
        reservedUnits,
        listedUnits,
        occupancyRate,
        expectedMonthlyIncome: toNumber(expectedMonthlyIncome),
        collectedThisMonth: toNumber(collectedThisMonth),
        pendingIncome: toNumber(pendingIncome),
        overdueAmount: toNumber(overdueAmount),
        overdueInvoicesCount,
        expiringTenanciesCount: expiringTenancies,
        unpaidDepositsCount: unpaidDeposits,
    }
}

const defaultStats: PropertyFinancialStats = {
    totalUnits: 0,
    occupiedUnits: 0,
    vacantUnits: 0,
    maintenanceUnits: 0,
    reservedUnits: 0,
    listedUnits: 0,
    occupancyRate: 0,
    expectedMonthlyIncome: 0,
    collectedThisMonth: 0,
    pendingIncome: 0,
    overdueAmount: 0,
    overdueInvoicesCount: 0,
    expiringTenanciesCount: 0,
    unpaidDepositsCount: 0,
}

// Public function - handles auth, then calls cached function
export async function getPropertyFinancialStats(propertyId: string): Promise<PropertyFinancialStats> {
    try {
        const session = await authCheck()
        if (!session) {
            return defaultStats
        }

        const hasPermissionToRead = await hasPermission({
            resource: "property",
            action: "read",
        })
        if (!hasPermissionToRead) {
            return defaultStats
        }

        const stats = await fetchPropertyFinancialStats(propertyId)
        return stats ?? defaultStats
    } catch (error) {
        console.error("Error fetching property financial stats:", error)
        return defaultStats
    }
}
