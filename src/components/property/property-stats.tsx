'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Building2, CheckCircle, DoorOpen, TrendingUp } from 'lucide-react'

export interface PropertyStats {
    total: number
    active: number
    totalUnits: number
    occupiedUnits: number
}

export function PropertyStatsCards({ stats }: { stats: PropertyStats }) {
    const occupancyRate = stats.totalUnits > 0
        ? Math.round((stats.occupiedUnits / stats.totalUnits) * 100)
        : 0

    const cards = [
        {
            title: 'Total Properties',
            value: stats.total,
            icon: Building2,
            description: 'All properties',
        },
        {
            title: 'Active',
            value: stats.active,
            icon: CheckCircle,
            description: 'Currently active',
            valueClassName: 'text-emerald-600',
        },
        {
            title: 'Total Units',
            value: stats.totalUnits,
            icon: DoorOpen,
            description: 'Across all properties',
        },
        {
            title: 'Occupancy Rate',
            value: `${occupancyRate}%`,
            icon: TrendingUp,
            description: 'Units occupied',
            valueClassName: occupancyRate > 80
                ? 'text-emerald-600'
                : occupancyRate > 50
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
