import { Suspense } from 'react'
import { getUnit } from "@/lib/dal/units/get-unit"
import { getUserRoleInOrganization } from '@/lib/auth-check'
import {
    UnitHeader,
    UnitListingPreview,
    UnitStatsAndAlerts,
    UnitDataSection,
    UnitActions,
} from './detail'
import TabsSkeleton from '../skeletons/tabs-skeleton'
import StatsSkeletons from '../skeletons/stats-skeleton'

interface UnitDetailsProps {
    slug: string
    unitId: string
}

async function UnitDetails({ unitId, slug }: UnitDetailsProps) {
    // Fetch unit data and user role in parallel
    const [unitResult, userRole] = await Promise.all([
        getUnit(unitId),
        getUserRoleInOrganization(slug),
    ])

    const { success, unit, message } = unitResult

    if (!success || !unit) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center space-y-2">
                    <p className="text-muted-foreground">{message}</p>
                </div>
            </div>
        )
    }

    const isManager = userRole === 'manager' || userRole === 'owner'

    return (
        <div className="space-y-4 p-2">
            {/* Unit Header */}
            <UnitHeader unit={unit} />

            {/* Manager Actions */}
            {isManager && (
                <UnitActions
                    slug={slug}
                    propertyId={unit.propertyId}
                    unitId={unitId}
                />
            )}

            {/* Stats & Listing Preview Grid */}
            <div className="grid gap-4 lg:grid-cols-3">
                {/* Stats & Alerts - 2 columns */}
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-lg font-medium">Unit Stats & Alerts</h2>
                    <Suspense fallback={<StatsSkeletons />}>
                        <UnitStatsAndAlerts unitId={unitId} />
                    </Suspense>
                </div>

                {/* Listing Preview - 1 column */}
                <div className="lg:col-span-1">
                    <UnitListingPreview unit={unit} />
                </div>
            </div>

            {/* Tabs with Tables */}
            <Suspense fallback={<TabsSkeleton />}>
                <UnitDataSection unitId={unitId} />
            </Suspense>
        </div>
    )
}

export default UnitDetails
