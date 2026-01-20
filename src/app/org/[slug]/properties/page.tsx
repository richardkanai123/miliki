import { Suspense } from 'react'
import { PropertyStatsSection } from '@/components/property/property-stats-section'
import { PropertiesTableSection } from '@/components/property/properties-table-section'
import TableSkeleton from '@/components/skeletons/table-skeleton'
import StatsSkeletons from '@/components/skeletons/stats-skeleton'
import { getUserRoleInOrganization } from '@/lib/auth-check'
import Unauthorised from '@/components/auth/unauthorised'

interface PropertiesPageProps {
    params: Promise<{ slug: string }>
}

const PropertiesPage = async ({ params }: PropertiesPageProps) => {
    const { slug } = await params
    const userRole = await getUserRoleInOrganization(slug)

    const canManageProperty = userRole === "owner" || userRole === "manager" || userRole === "admin"


    if (!canManageProperty) {
        return <Unauthorised link={`/org/${slug}`} message="You are not authorized to access this property information" solution="Please contact the property owner/manager to get access" linkText="Go to organization page" />
    }

    return (
        <div className="p-2 space-y-2">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">
                    {slug} Properties
                </h1>
            </div>

            {/* Stats Cards */}
            <Suspense fallback={<StatsSkeletons />}>
                <PropertyStatsSection slug={slug} />
            </Suspense>

            {/* Data Table */}
            <div className="bg-card rounded-lg border p-4">
                <Suspense fallback={<TableSkeleton />}>
                    <PropertiesTableSection slug={slug} />
                </Suspense>
            </div>
        </div>
    )
}

export default PropertiesPage
