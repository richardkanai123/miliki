import { Suspense } from 'react'
import { getPropertyDetails } from "@/lib/dal/properties/get-property-details"
import EditPropertyForm from "@/components/property/edit-property-form"
import DefaultErrorComponent from "@/components/error/default-error"
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import DefaultLoader from '@/components/skeletons/default-loader'

interface EditPropertyPageProps {
    params: Promise<{
        propertyid: string
        slug: string
    }>
}

const EditPropertyPage = async ({ params }: EditPropertyPageProps) => {
    const { propertyid, slug } = await params

    // Fetch property and managers in parallel
    const [propertyResult, managersResult] = await Promise.all([
        getPropertyDetails(propertyid),
        auth.api.listMembers({
            headers: await headers(),
            query: {
                organizationSlug: slug,
                filterField: 'role',
                filterValue: 'manager',
            }
        })
    ])

    const { success, property, message } = propertyResult

    if (!success || !property) {
        return (
            <DefaultErrorComponent
                reset={() => { }}
                message={message}
                label="Back to Property Details"
            />
        )
    }

    const managers = managersResult.members?.map((member) => ({
        id: member.id,
        name: member.user?.name ?? '',
        image: member.user?.image ?? '',
    })) ?? []

    return (
        <div className="w-full mx-auto flex flex-col gap-8 p-6">
            <Suspense fallback={<DefaultLoader />}>
                <EditPropertyForm
                    property={property}
                    slug={slug}
                    managers={managers}
                />
            </Suspense>
        </div>
    )
}

export default EditPropertyPage
