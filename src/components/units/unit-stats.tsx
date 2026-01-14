'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DoorOpen, CheckCircle, XCircle, TrendingUp } from 'lucide-react'
import type { UnitStats } from '@/lib/dal/units/get-unit-stats'

export function UnitStatsCards({ stats }: { stats: UnitStats }) {
    const cards = [
        {
            title: 'Total Units',
            value: stats.total,
            icon: DoorOpen,
            description: 'All units in property',
        },
        {
            title: 'Occupied',
            value: stats.occupied,
            icon: CheckCircle,
            description: 'Currently rented',
            valueClassName: 'text-emerald-600',
        },
        {
            title: 'Vacant',
            value: stats.vacant,
            icon: XCircle,
            description: 'Available for rent',
            valueClassName: stats.vacant > 0 ? 'text-amber-600' : '',
        },
        {
            title: 'Occupancy Rate',
            value: `${stats.occupancyRate}%`,
            icon: TrendingUp,
            description: 'Unit occupancy',
            valueClassName: stats.occupancyRate > 80
                ? 'text-emerald-600'
                : stats.occupancyRate > 50
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
