import ErrorAlert from '@/components/ErrorAlert'
import PropertyFeatures from '@/components/property/PropertyFeatures'
import { GetPropertyById } from '@/lib/actions/properties/getSpecificProperty'
import { Params } from 'next/dist/server/request/params'
import React from 'react'

const PropertyDetailsPage = async (params: { params: Promise<{ id: string }> }) => {
    const { id } = await params.params

    const { message, property, success } = await GetPropertyById(id)
    if (!success) {
        <ErrorAlert errorMessage={message} />
    }

    if (!property) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4">
                <h1 className="text-2xl font-bold">Property Not Found</h1>
                <p className="mt-2 text-gray-600">{message || "The requested property does not exist."}</p>
            </div>
        )
    }

    const {
        title,
        description,
        location,
        status,
        createdAt } = property


    return (
        <div className="w-full max-w-7xl mx-auto p-4">
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
                <div className="p-4">
                    <h2 className="text-2xl font-semibold mb-2">{title}</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{description}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Location: {location}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Status: {status}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Created At: {new Date(createdAt).toLocaleDateString()}</p>
                </div>

                <div className="p-4 mx-auto max-w-md border-t border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold mb-2">Property Features</h3>
                    <PropertyFeatures property={property} variant='detailed' maxFeatures={20} />
                </div>

            </div>
        </div>
    )
}

export default PropertyDetailsPage