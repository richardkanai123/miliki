import { Suspense } from 'react'
import { TenancyStatsSection } from '@/components/tenancies/tenancy-stats-section'
import { TenanciesTableSection } from '@/components/tenancies/tenancies-table-section'
import TableSkeleton from '@/components/skeletons/table-skeleton'
import StatsSkeletons from '@/components/skeletons/stats-skeleton'

interface TenanciesPageProps {
    params: Promise<{ slug: string }>
}

const TenanciesPage = async ({ params }: TenanciesPageProps) => {
    const { slug } = await params

    return (
        <div className="p-2 space-y-2">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">
                    Tenancies
                </h1>
            </div>

            {/* Stats Cards */}
            <Suspense fallback={<StatsSkeletons />}>
                <TenancyStatsSection slug={slug} />
            </Suspense>

            {/* Data Table */}
            <div className="bg-card rounded-lg border p-4">
                <Suspense fallback={<TableSkeleton />}>
                    <TenanciesTableSection slug={slug} />
                </Suspense>
            </div>
        </div>
    )
}

export default TenanciesPage
