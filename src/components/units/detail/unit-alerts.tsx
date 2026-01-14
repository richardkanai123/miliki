'use client'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, CalendarClock, Wallet } from 'lucide-react'
import type { UnitFinancialStats } from '@/lib/dal/units/get-unit-financial-stats'

interface UnitAlertsProps {
    stats: UnitFinancialStats
}

export function UnitAlerts({ stats }: UnitAlertsProps) {
    // Collect alerts
    const alerts = []

    // Overdue invoices
    if (stats.overdueAmount > 0) {
        alerts.push(
            <Alert key="overdue" variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Outstanding Payments</AlertTitle>
                <AlertDescription>
                    There are {stats.overdueInvoicesCount} overdue invoice(s) totaling {stats.overdueAmount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}.
                </AlertDescription>
            </Alert>
        )
    }

    // Vacancy warning
    if (stats.daysUntilVacancy !== null && stats.daysUntilVacancy <= 30) {
        alerts.push(
            <Alert key="vacancy" className="border-amber-500/50 text-amber-900 dark:text-amber-200 bg-amber-500/10">
                <CalendarClock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <AlertTitle className="text-amber-800 dark:text-amber-300">Vacancy Approaching</AlertTitle>
                <AlertDescription>
                    This unit will become vacant in {stats.daysUntilVacancy} day(s).
                </AlertDescription>
            </Alert>
        )
    }
    
    // Unpaid deposits
    if (stats.unpaidDepositsCount > 0) {
        alerts.push(
            <Alert key="deposit" className="border-orange-500/50 text-orange-900 dark:text-orange-200 bg-orange-500/10">
                <Wallet className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                <AlertTitle className="text-orange-800 dark:text-orange-300">Unpaid Deposits</AlertTitle>
                <AlertDescription>
                    There are active tenancies with unpaid deposits.
                </AlertDescription>
            </Alert>
        )
    }

    if (alerts.length === 0) return null

    return (
        <div className="space-y-4">
            {alerts}
        </div>
    )
}
