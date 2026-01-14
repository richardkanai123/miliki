'use client'

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import {
    Wallet,
    PiggyBank,
    Clock,
    AlertCircle,
} from 'lucide-react'
import { formatCurrency } from '@/lib/format'
import type { UnitFinancialStats } from '@/lib/dal/units/get-unit-financial-stats'

interface UnitDetailStatsProps {
    stats: UnitFinancialStats
}

export function UnitDetailStats({ stats }: UnitDetailStatsProps) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Expected Monthly Income
                    </CardTitle>
                    <Wallet className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(stats.expectedMonthlyIncome)}</div>
                    <p className="text-xs text-muted-foreground">
                        From active tenancies
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Collected This Month
                    </CardTitle>
                    <PiggyBank className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(stats.collectedThisMonth)}</div>
                    <p className="text-xs text-muted-foreground">
                        Paid invoices
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Pending Income
                    </CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(stats.pendingIncome)}</div>
                    <p className="text-xs text-muted-foreground">
                        Pending invoices
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Overdue Amount
                    </CardTitle>
                    <AlertCircle className={`h-4 w-4 ${stats.overdueAmount > 0 ? 'text-destructive' : 'text-muted-foreground'}`} />
                </CardHeader>
                <CardContent>
                    <div className={`text-2xl font-bold ${stats.overdueAmount > 0 ? 'text-destructive' : ''}`}>
                        {formatCurrency(stats.overdueAmount)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {stats.overdueInvoicesCount} invoice(s) overdue
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
