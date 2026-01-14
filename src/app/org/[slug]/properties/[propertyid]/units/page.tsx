import { Suspense } from 'react'
import { UnitStatsSection } from '@/components/units/unit-stats-section'
import { UnitsTableSection } from '@/components/units/units-table-section'
import TableSkeleton from '@/components/skeletons/table-skeleton'
import StatsSkeletons from '@/components/skeletons/stats-skeleton'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'

interface UnitsPageProps {
    params: Promise<{ slug: string; propertyid: string }>
}

const UnitsPage = async ({ params }: UnitsPageProps) => {
    const { slug, propertyid } = await params

    return (
        <div className="p-2 space-y-2">
            {/* Header with back button */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" asChild className="-ml-2">
                    <Link href={`/org/${slug}/properties/${propertyid}`}>
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Back to Property
                    </Link>
                </Button>
            </div>

            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">
                    Property Units
                </h1>
            </div>

            {/* Stats Cards */}
            <Suspense fallback={<StatsSkeletons />}>
                <UnitStatsSection propertyId={propertyid} />
            </Suspense>

            {/* Data Table */}
            <div className="bg-card rounded-lg border p-4">
                <Suspense fallback={<TableSkeleton />}>
                    <UnitsTableSection propertyId={propertyid} slug={slug} />
                </Suspense>
            </div>
        </div>
    )
}

export default UnitsPage
