'use client'

import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, Clock, Wallet, CalendarClock } from 'lucide-react'
import { formatCurrency } from '@/lib/format'
import type { PropertyFinancialStats } from '@/lib/dal/properties/get-property-financial-stats'

interface PropertyAlertsProps {
    stats: PropertyFinancialStats
}

export function PropertyAlerts({ stats }: PropertyAlertsProps) {
    const alerts: Array<{
        show: boolean
        variant: 'default' | 'destructive'
        icon: React.ComponentType<{ className?: string }>
        title: string
        description: string
    }> = [
            {
                show: stats.overdueInvoicesCount > 0,
                variant: 'destructive',
                icon: AlertCircle,
                title: `${stats.overdueInvoicesCount} Overdue Invoice${stats.overdueInvoicesCount !== 1 ? 's' : ''}`,
                description: `Total overdue amount: ${formatCurrency(stats.overdueAmount)}`,
            },
            {
                show: stats.expiringTenanciesCount > 0,
                variant: 'default',
                icon: CalendarClock,
                title: `${stats.expiringTenanciesCount} Tenancy${stats.expiringTenanciesCount !== 1 ? 'ies' : ''} Expiring Soon`,
                description: 'Within the next 30 days. Consider renewal discussions.',
            },
            {
                show: stats.unpaidDepositsCount > 0,
                variant: 'default',
                icon: Wallet,
                title: `${stats.unpaidDepositsCount} Unpaid Deposit${stats.unpaidDepositsCount !== 1 ? 's' : ''}`,
                description: 'Active tenancies with outstanding deposit payments.',
            },
            {
                show: stats.vacantUnits > 0 && stats.listedUnits === 0,
                variant: 'default',
                icon: Clock,
                title: `${stats.vacantUnits} Vacant Unit${stats.vacantUnits !== 1 ? 's' : ''} Not Listed`,
                description: 'Consider listing vacant units to attract tenants.',
            },
        ]

    const visibleAlerts = alerts.filter(alert => alert.show)

    if (visibleAlerts.length === 0) {
        return null
    }

    return (
        <div className="space-y-2">
            {visibleAlerts.map((alert, index) => (
                <Alert key={index} variant={alert.variant}>
                    <alert.icon className="h-4 w-4" />
                    <AlertTitle>{alert.title}</AlertTitle>
                    <AlertDescription>{alert.description}</AlertDescription>
                </Alert>
            ))}
        </div>
    )
}
