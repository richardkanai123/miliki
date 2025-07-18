import UnAuthenticated from '@/components/authentication/Unauthenticated'
import AddPropertyForm from '@/components/Forms/Properties/AddProperty'
import { checkAuth } from '@/lib/checkAuth'
import React from 'react'

const AddPropertiesPage = async () => {

    const session = await checkAuth()
    if (!session) {
        return <UnAuthenticated />
    }

    return (
        <AddPropertyForm />
    )
}

export default AddPropertiesPage