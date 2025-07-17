import UnAuthenticated from '@/components/authentication/Unauthenticated'
import { checkAuth } from '@/lib/checkAuth'
import React from 'react'

const AddPropertiesPage = async () => {

    const session = await checkAuth()
    if (!session) {
        return <UnAuthenticated />
    }

    return (
        <h1 className="text-center text-2xl font-bold mt-10">
            Add Properties Page
        </h1>
    )
}

export default AddPropertiesPage