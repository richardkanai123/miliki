import ErrorAlert from '@/components/ErrorAlert'
import EditPropertyForm from '@/components/Forms/Properties/EditProperty'
import UnAuthenticated from '@/components/authentication/Unauthenticated'
import { GetPropertyById } from '@/lib/actions/properties/getSpecificProperty'
import { checkAuth } from '@/lib/checkAuth'
import React from 'react'

const EditPropertyPage = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params

    // Check authentication
    const session = await checkAuth()
    if (!session) {
        return <UnAuthenticated />
    }

    // Get property data
    const { message, property, success } = await GetPropertyById(id)
    if (!success) {
        return <ErrorAlert errorMessage={message} />
    }

    if (!property) {
        return <ErrorAlert errorMessage="Property not found" />
    }

    return (
        <EditPropertyForm property={property} />
    )
}

export default EditPropertyPage