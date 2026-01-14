'use server'

import { authCheck } from "@/lib/auth-check"
import { hasPermission } from "@/lib/permission-helpers"
import { prisma } from "@/lib/prisma"
import { cacheTag } from "next/cache"
import { Prisma } from "@/app/_generated/prisma/client/client"
const Decimal = Prisma.Decimal

// Use plain numbers for Client Component compatibility
export interface UnitFinancialStats {
    status: string
    isListed: boolean
    rentAmount: number
    expectedMonthlyIncome: number
    collectedThisMonth: number
    pendingIncome: number
    overdueAmount: number
    overdueInvoicesCount: number
    daysUntilVacancy: number | null // null if not active tenancy or no end date
    unpaidDepositsCount: number
}

// Helper to safely convert Decimal to number
function toNumber(value: Prisma.Decimal | null | undefined): number {
    if (!value) return 0
    return value.toNumber()
}

// Cached function - only fetches data, no auth
async function fetchUnitFinancialStats(unitId: string): Promise<UnitFinancialStats | null> {
    'use cache'
    const cacheKey = `unit-financial-stats-${unitId}`
    cacheTag(cacheKey)

    // Verify unit exists and get basic stats
    const unit = await prisma.unit.findUnique({
        where: { id: unitId },
        select: { 
            id: true, 
            status: true, 
            isListed: true, 
            rentAmount: true 
        }
    })

    if (!unit) return null

    // Get active tenancies for expected monthly income
    const activeTenancies = await prisma.tenancy.findMany({
        where: {
            unitId: unitId,
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

    // Calculate days until vacancy (for the nearest expiring tenancy)
    let daysUntilVacancy: number | null = null
    const expiringTenancy = activeTenancies
        .filter(t => t.endDate && t.endDate > now)
        .sort((a, b) => (a.endDate.getTime() - b.endDate.getTime()))[0]
    
    if (expiringTenancy?.endDate) {
        const diffTime = Math.abs(expiringTenancy.endDate.getTime() - now.getTime())
        daysUntilVacancy = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) 
    }

    // Get tenancies with unpaid deposits
    const unpaidDepositsCount = activeTenancies.filter(t => !t.depositPaid).length

    // Convert all Decimal values to numbers for Client Component compatibility
    return {
        status: unit.status,
        isListed: unit.isListed,
        rentAmount: toNumber(unit.rentAmount),
        expectedMonthlyIncome: toNumber(expectedMonthlyIncome),
        collectedThisMonth: toNumber(collectedThisMonth),
        pendingIncome: toNumber(pendingIncome),
        overdueAmount: toNumber(overdueAmount),
        overdueInvoicesCount,
        daysUntilVacancy,
        unpaidDepositsCount,
    }
}

const defaultStats: UnitFinancialStats = {
    status: 'UNKNOWN',
    isListed: false,
    rentAmount: 0,
    expectedMonthlyIncome: 0,
    collectedThisMonth: 0,
    pendingIncome: 0,
    overdueAmount: 0,
    overdueInvoicesCount: 0,
    daysUntilVacancy: null,
    unpaidDepositsCount: 0,
}

// Public function - handles auth, then calls cached function
export async function getUnitFinancialStats(unitId: string): Promise<UnitFinancialStats> {
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

        const stats = await fetchUnitFinancialStats(unitId)
        return stats ?? defaultStats
    } catch (error) {
        console.error(error)
        const errorMessage = error instanceof Error ? error.message : "Unknown error"
        console.error(errorMessage)
        return defaultStats
    }
}
