import UnAuthenticated from '@/components/authentication/Unauthenticated'
import { checkAuth } from '@/lib/checkAuth'
import { GetPropertyById } from '@/lib/actions/properties/getSpecificProperty'
import ErrorAlert from '@/components/ErrorAlert'
import PropertyDetails from '@/components/property/PropertyDetails'
import { Suspense } from 'react'


const PropertyPage = async ({ params }: { params: Promise<{ id: string }> }) => {
    const session = await checkAuth()
    if (!session) {
        return <UnAuthenticated />
    }
    const { id } = await params
    const { property, message, success } = await GetPropertyById(id)
    if (!success) {
        return <ErrorAlert errorMessage={message} />
    }
    if (!property) {
        return <ErrorAlert errorMessage='Property not found' />
    }

    return (
        <div className='w-full flex items-center gap-2 justify-center-safe flex-wrap p-4'>
            <div className='w-full'>
                <Suspense fallback={<div>Loading...</div>}>
                    <PropertyDetails property={property} />
                </Suspense>
            </div>
        </div>
    )
}

export default PropertyPage