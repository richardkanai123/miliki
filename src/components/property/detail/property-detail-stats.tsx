'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    DoorOpen,
    TrendingUp,
    Wallet,
    AlertCircle,
    Home,
    Clock,
    Banknote,
    Users
} from 'lucide-react'
import { formatCurrency, formatPercent } from '@/lib/format'
import type { PropertyFinancialStats } from '@/lib/dal/properties/get-property-financial-stats'

interface PropertyDetailStatsProps {
    stats: PropertyFinancialStats
}

export function PropertyDetailStats({ stats }: PropertyDetailStatsProps) {
    const cards = [
        {
            title: 'Total Units',
            value: stats.totalUnits,
            icon: DoorOpen,
            description: `${stats.vacantUnits} vacant, ${stats.occupiedUnits} occupied`,
        },
        {
            title: 'Occupancy Rate',
            value: formatPercent(stats.occupancyRate),
            icon: TrendingUp,
            description: `${stats.occupiedUnits} of ${stats.totalUnits} units`,
            valueClassName: stats.occupancyRate > 80
                ? 'text-emerald-600'
                : stats.occupancyRate > 50
                    ? 'text-amber-600'
                    : 'text-red-600',
        },
        {
            title: 'Expected Income',
            value: formatCurrency(stats.expectedMonthlyIncome),
            icon: Banknote,
            description: 'Monthly rental income',
        },
        {
            title: 'Collected This Month',
            value: formatCurrency(stats.collectedThisMonth),
            icon: Wallet,
            description: 'Payments received',
            valueClassName: 'text-emerald-600',
        },
        {
            title: 'Pending Income',
            value: formatCurrency(stats.pendingIncome),
            icon: Clock,
            description: 'Awaiting payment',
            valueClassName: 'text-amber-600',
        },
        {
            title: 'Overdue Amount',
            value: formatCurrency(stats.overdueAmount),
            icon: AlertCircle,
            description: `${stats.overdueInvoicesCount} overdue invoice${stats.overdueInvoicesCount !== 1 ? 's' : ''}`,
            valueClassName: stats.overdueInvoicesCount > 0 ? 'text-red-600' : '',
        },
        {
            title: 'Listed Units',
            value: stats.listedUnits,
            icon: Home,
            description: 'Units currently listed',
        },
        {
            title: 'Active Tenants',
            value: stats.occupiedUnits,
            icon: Users,
            description: 'Current occupants',
        },
    ]

    return (
        <div className="grid gap-2 grid-cols-2 md:grid-cols-4 lg:grid-cols-4">
            {cards.map((card) => (
                <Card key={card.title} size="sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
                        <CardTitle className="text-xs font-medium text-muted-foreground">
                            {card.title}
                        </CardTitle>
                        <card.icon className="h-3.5 w-3.5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className={`text-lg font-bold ${card.valueClassName ?? ''}`}>
                            {card.value}
                        </div>
                        <p className="text-[10px] text-muted-foreground">{card.description}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
