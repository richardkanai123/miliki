import DefaultLoader from "@/components/skeletons/default-loader"
import { Button } from "@/components/ui/button"
import AddTenancyForm from "@/components/tenancies/add-tenancy-form"
import { ArrowLeftIcon, AlertCircle } from "lucide-react"
import Link from "next/link"
import { Suspense } from "react"
import { getUnitsForTenancy } from "@/lib/dal/tenancies/get-units-for-tenancy"
import { getMembersForTenancy } from "@/lib/dal/tenancies/get-members-for-tenancy"

interface AddTenancyPageProps {
    params: Promise<{ slug: string }>
}

const AddTenancyPage = async ({ params }: AddTenancyPageProps) => {
    const { slug } = await params

    // Fetch units and members in parallel
    const [unitsResult, membersResult] = await Promise.all([
        getUnitsForTenancy(slug),
        getMembersForTenancy(slug),
    ])

    if (!unitsResult.success || !unitsResult.units.length) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4 text-center p-4">
                <div className="bg-destructive/10 p-4 rounded-full">
                    <AlertCircle className="h-8 w-8 text-destructive" />
                </div>
                <div className="space-y-2">
                    <h1 className="text-2xl font-bold tracking-tight">No Vacant Units Available</h1>
                    <p className="text-muted-foreground max-w-[500px]">
                        All units are currently occupied or under maintenance. You need at least one vacant unit to create a tenancy.
                    </p>
                </div>
                <Button variant="outline" asChild className="mt-4">
                    <Link href={`/org/${slug}/properties`}>
                        <ArrowLeftIcon className="w-4 h-4 mr-2" />
                        Back to Properties
                    </Link>
                </Button>
            </div>
        )
    }

    if (!membersResult.success || !membersResult.members.length) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4 text-center p-4">
                <div className="bg-amber-100 dark:bg-amber-900/20 p-4 rounded-full">
                    <AlertCircle className="h-8 w-8 text-amber-600" />
                </div>
                <div className="space-y-2">
                    <h1 className="text-2xl font-bold tracking-tight">No Tenants Available</h1>
                    <p className="text-muted-foreground max-w-[500px]">
                        You need to invite members with the &quot;member&quot; (tenant) role to your organization before you can create a tenancy.
                        Owners, admins, and managers cannot be assigned as tenants.
                    </p>
                </div>
                <Button variant="outline" asChild className="mt-4">
                    <Link href={`/org/${slug}`}>
                        <ArrowLeftIcon className="w-4 h-4 mr-2" />
                        Manage Organization
                    </Link>
                </Button>
            </div>
        )
    }

    return (
        <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 max-w-7xl mx-auto w-full animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" asChild className="-ml-2 text-muted-foreground hover:text-foreground">
                        <Link href={`/org/${slug}/tenancies`}>
                            <ArrowLeftIcon className="w-4 h-4 mr-1" />
                            Back to Tenancies
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Form Content */}
            <Suspense fallback={<div className="w-full h-[600px] flex items-center justify-center"><DefaultLoader /></div>}>
                <AddTenancyForm
                    slug={slug}
                    units={unitsResult.units}
                    members={membersResult.members}
                />
            </Suspense>
        </div>
    )
}

export default AddTenancyPage
