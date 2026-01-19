'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, CheckCircle, Clock, XCircle, TrendingUp, Banknote } from 'lucide-react'
import { formatCurrency } from '@/lib/format'
import type { TenancyStats } from '@/lib/dal/tenancies/get-tenancy-stats'

export function TenancyStatsCards({ stats }: { stats: TenancyStats }) {
    const cards = [
        {
            title: 'Total Tenancies',
            value: stats.total,
            icon: Users,
            description: 'All tenancies',
        },
        {
            title: 'Active',
            value: stats.active,
            icon: CheckCircle,
            description: 'Currently active',
            valueClassName: 'text-emerald-600',
        },
        {
            title: 'Pending',
            value: stats.pending,
            icon: Clock,
            description: 'Awaiting activation',
            valueClassName: stats.pending > 0 ? 'text-amber-600' : '',
        },
        {
            title: 'Active Rate',
            value: `${stats.activeTenancyRate}%`,
            icon: TrendingUp,
            description: 'Tenancy activity',
            valueClassName: stats.activeTenancyRate > 80
                ? 'text-emerald-600'
                : stats.activeTenancyRate > 50
                    ? 'text-amber-600'
                    : 'text-red-600',
        },
    ]

    return (
        <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4">
            {cards.map((card) => (
                <Card key={card.title}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            {card.title}
                        </CardTitle>
                        <card.icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold ${card.valueClassName ?? ''}`}>
                            {card.value}
                        </div>
                        <p className="text-xs text-muted-foreground">{card.description}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
