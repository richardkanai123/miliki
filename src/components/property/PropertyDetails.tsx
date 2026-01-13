import { Suspense } from 'react'
import { getPropertyDetails } from "@/lib/dal/properties/get-property-details"
import { getPropertyFinancialStats } from "@/lib/dal/properties/get-property-financial-stats"
import { getPropertyTenancies } from "@/lib/dal/properties/get-property-tenancies"
import { getPropertyInvoices } from "@/lib/dal/properties/get-property-invoices"
import { getPropertyPayments } from "@/lib/dal/properties/get-property-payments"
import { PropertyHeader } from './detail/property-header'
import { PropertyDetailStats } from './detail/property-detail-stats'
import { PropertyAlerts } from './detail/property-alerts'
import { PropertyTabsSection } from './property-tabs-section'
import TabsSkeleton from '../skeletons/tabs-skeleton'
import StatsSkeletons from '../skeletons/stats-skeleton'

interface PropertyDetailsProps {
    propertyid: string
}

async function PropertyDetails({ propertyid }: PropertyDetailsProps) {
    const { success, property, message } = await getPropertyDetails(propertyid)

    if (!success || !property) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center space-y-2">
                    <p className="text-muted-foreground">{message}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-4 p-2">
            {/* Property Header */}
            <PropertyHeader property={property} />

            <h2 className="text-lg font-medium">Property Stats & Alerts</h2>
            {/* Stats & Alerts Section - single fetch for both */}
            <Suspense fallback={<StatsSkeletons />}>
                <PropertyStatsAndAlerts propertyId={propertyid} />
            </Suspense>

            {/* Tabs with Tables - separate suspense for heavy data */}
            <Suspense fallback={<TabsSkeleton />}>
                <PropertyDataSection
                    propertyId={propertyid}
                    units={property.units}
                    slug={property.organization.slug}
                />
            </Suspense>
        </div>
    )
}

// Combined stats and alerts - fetches data once for both
async function PropertyStatsAndAlerts({ propertyId }: { propertyId: string }) {
    const stats = await getPropertyFinancialStats(propertyId)

    return (
        <>
            <PropertyDetailStats stats={stats} />
            <PropertyAlerts stats={stats} />
        </>
    )
}

// Data section with tabs - fetches in parallel
async function PropertyDataSection({
    propertyId,
    units,
    slug
}: {
    propertyId: string
    units: NonNullable<Awaited<ReturnType<typeof getPropertyDetails>>['property']>['units']
    slug: string
}) {
    // Fetch all data in parallel
    const [tenanciesResult, invoicesResult, paymentsResult] = await Promise.all([
        getPropertyTenancies(propertyId),
        getPropertyInvoices(propertyId),
        getPropertyPayments(propertyId),
    ])

    return (
        <PropertyTabsSection
            units={units}
            tenancies={tenanciesResult.tenancies}
            invoices={invoicesResult.invoices}
            payments={paymentsResult.payments}
            propertyId={propertyId}
            slug={slug}
        />
    )
}




export default PropertyDetails
