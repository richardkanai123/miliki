import { getUnitStats } from '@/lib/dal/units/get-unit-stats'
import { UnitStatsCards } from './unit-stats'

interface UnitStatsSectionProps {
    propertyId: string
}

export async function UnitStatsSection({ propertyId }: UnitStatsSectionProps) {
    const stats = await getUnitStats(propertyId)
    return <UnitStatsCards stats={stats} />
}
