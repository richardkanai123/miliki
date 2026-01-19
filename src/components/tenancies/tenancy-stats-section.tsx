import { getTenancyStats } from '@/lib/dal/tenancies/get-tenancy-stats'
import { TenancyStatsCards } from './tenancy-stats'

interface TenancyStatsSectionProps {
    slug: string
}

export async function TenancyStatsSection({ slug }: TenancyStatsSectionProps) {
    const stats = await getTenancyStats(slug)
    return <TenancyStatsCards stats={stats} />
}
