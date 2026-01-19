import { getUnitFinancialStats } from "@/lib/dal/units/get-unit-financial-stats"
import { UnitDetailStats } from './unit-detail-stats'
import { UnitAlerts } from './unit-alerts'

interface UnitStatsAndAlertsProps {
    unitId: string
}

// Combined stats and alerts - fetches data once for both
export async function UnitStatsAndAlerts({ unitId }: UnitStatsAndAlertsProps) {
    const stats = await getUnitFinancialStats(unitId)

    return (
        <div className="space-y-4">
            <UnitDetailStats stats={stats} />
            <UnitAlerts stats={stats} />
        </div>
    )
}
