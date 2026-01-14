import { Suspense } from 'react'
import { getUnit } from "@/lib/dal/units/get-unit"
import { getUnitFinancialStats } from "@/lib/dal/units/get-unit-financial-stats"
import { getUnitTenancies } from "@/lib/dal/units/get-unit-tenancies"
import { getUnitInvoices } from "@/lib/dal/units/get-unit-invoices"
import { getUnitPayments } from "@/lib/dal/units/get-unit-payments"
import { UnitHeader } from './detail/unit-header'
import { UnitDetailStats } from './detail/unit-detail-stats'
import { UnitAlerts } from './detail/unit-alerts'
import { UnitTabsSection } from './unit-tabs-section'
import TabsSkeleton from '../skeletons/tabs-skeleton'
import StatsSkeletons from '../skeletons/stats-skeleton'
import { getUserRoleInOrganization } from '@/lib/auth-check'
import { Pencil } from 'lucide-react'
import { Button } from '../ui/button'
import Link from 'next/link'

interface UnitDetailsProps {
    slug: string
    unitId: string
}

async function UnitDetails({ unitId, slug }: UnitDetailsProps) {
    const { success, unit, message } = await getUnit(unitId)

    if (!success || !unit) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center space-y-2">
                    <p className="text-muted-foreground">{message}</p>
                </div>
            </div>
        )
    }


    const userRole = await getUserRoleInOrganization(slug)
    const isManager = userRole === 'manager' || userRole === 'owner'

    return (
        <div className="space-y-4 p-2">
            {/* Unit Header */}
            <UnitHeader unit={unit} />
            {isManager && (
                <div className="flex items-center justify-end">
                    <Button variant="outline" size="sm" asChild>
                        <Link href={`/org/${slug}/properties/${unit.propertyId}/units/${unitId}/edit`}>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit Unit
                        </Link>
                    </Button>

                    <Button variant="outline" size="sm" asChild>

                    </Button>
                </div>
            )}


            <h2 className="text-lg font-medium">Unit Stats & Alerts</h2>
            {/* Stats & Alerts Section - single fetch for both */}
            <Suspense fallback={<StatsSkeletons />}>
                <UnitStatsAndAlerts unitId={unitId} />
            </Suspense>

            {/* Tabs with Tables - separate suspense for heavy data */}
            <Suspense fallback={<TabsSkeleton />}>
                <UnitDataSection unitId={unitId} />
            </Suspense>
        </div>
    )
}

// Combined stats and alerts - fetches data once for both
async function UnitStatsAndAlerts({ unitId }: { unitId: string }) {
    const stats = await getUnitFinancialStats(unitId)

    return (
        <>
            <UnitDetailStats stats={stats} />
            <UnitAlerts stats={stats} />
        </>
    )
}

// Data section with tabs - fetches in parallel
async function UnitDataSection({
    unitId,
}: {
    unitId: string
}) {
    // Fetch all data in parallel
    const [tenanciesResult, invoicesResult, paymentsResult] = await Promise.all([
        getUnitTenancies(unitId),
        getUnitInvoices(unitId),
        getUnitPayments(unitId),
    ])

    return (
        <UnitTabsSection
            tenancies={tenanciesResult.tenancies}
            invoices={invoicesResult.invoices}
            payments={paymentsResult.payments}
            unitId={unitId}
        />
    )
}

export default UnitDetails
