import { Suspense } from 'react'
import { PropertyStatsSection } from '@/components/property/property-stats-section'
import { PropertiesTableSection } from '@/components/property/properties-table-section'
import TableSkeleton from '@/components/skeletons/table-skeleton'
import StatsSkeletons from '@/components/skeletons/stats-skeleton'

interface PropertiesPageProps {
    params: Promise<{ slug: string }>
}

const PropertiesPage = async ({ params }: PropertiesPageProps) => {
    const { slug } = await params

    return (
        <div className="space-y-2 p-2">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Properties</h1>
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
