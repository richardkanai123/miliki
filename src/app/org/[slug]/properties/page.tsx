import { Suspense } from 'react'
import { PropertyStatsSection } from '@/components/property/property-stats-section'
import { PropertiesTableSection } from '@/components/property/properties-table-section'
import TableSkeleton from '@/components/skeletons/table-skeleton'
import StatsSkeletons from '@/components/skeletons/stats-skeleton'
import { getUserRoleInOrganization } from '@/lib/auth-check'
import Unauthorised from '@/components/auth/unauthorised'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus } from 'lucide-react'

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
        <div className="w-full p-2 space-y-2">
            <div className="w-full flex items-end justify-end">
                <Button variant="ghost" size="sm" asChild className="self-end">
                    <Link href={`/org/${slug}/properties/create`}>
                        <Plus className="h-4 w-4 mr-1" />
                        Add Property
                    </Link>
                </Button>
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
