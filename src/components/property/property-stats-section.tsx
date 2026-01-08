import { getPropertyStats } from '@/lib/dal/properties/get-property-stats'
import { PropertyStatsCards } from './property-stats'

interface PropertyStatsSectionProps {
    slug: string
}

export async function PropertyStatsSection({ slug }: PropertyStatsSectionProps) {
    const stats = await getPropertyStats({ slug })
    return <PropertyStatsCards stats={stats} />
}
