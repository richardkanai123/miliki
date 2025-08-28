import UnAuthenticated from '@/components/authentication/Unauthenticated'
import ErrorAlert from '@/components/ErrorAlert'
import PropertiesLister from '@/components/property/PropertiesLister'
import PropertyLink from '@/components/property/PropertyLink'
import { getProperties } from '@/lib/actions/properties/getUserProperties'
import { checkAuth } from '@/lib/checkAuth'
import { Suspense } from 'react'

const PropertiesPage = async () => {
    const session = await checkAuth()
    if (!session) {
        return <UnAuthenticated />
    }
    const userId = session.user.id;
    const { properties, message, success } = await getProperties(userId);
    if (!success) {
        return <ErrorAlert errorMessage={message} />
    }
    return (
        <div className='p-4'>
            <Suspense fallback={<div>Loading...</div>}>
                <PropertiesLister emptyStateMessage='No properties found.' properties={properties || []} />
            </Suspense>
        </div>
    )
}

export default PropertiesPage 