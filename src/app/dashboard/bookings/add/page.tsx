import React, { Suspense } from 'react'
import { checkAuth } from '@/lib/checkAuth'
import { getUserGuests } from '@/lib/actions/guests/GetUserGuests'
import { getProperties } from '@/lib/actions/properties/getUserProperties'
import NewBookingForm from '@/components/Forms/Bookings/NewBookingForm'
import UnAuthenticated from '@/components/authentication/Unauthenticated'
import ErrorAlert from '@/components/ErrorAlert'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

const AddBookingsPage = async () => {
    const session = await checkAuth()
    if (!session) {
        return <UnAuthenticated />
    }

    const userId = session.user.id

    // Fetch guests and properties in parallel
    const [guestsResponse, propertiesResponse] = await Promise.all([
        getUserGuests(userId),
        getProperties(userId)
    ])

    if (!guestsResponse.success) {
        return <ErrorAlert errorMessage={guestsResponse.message} />
    }

    if (!propertiesResponse.success) {
        return <ErrorAlert errorMessage={propertiesResponse.message} />
    }

    // Sample pricing units - in a real app, this might come from a pricing rules table
    const pricingUnits = [
        { unit: 'NIGHT' as const, price: 2000, minDuration: 1, maxDuration: 7 },
        { unit: 'WEEK' as const, price: 10000, minDuration: 1, maxDuration: 14 },
        { unit: 'MONTH' as const, price: 40000, minDuration: 1, maxDuration: 28 }
    ]

    return (
        <Suspense fallback={<BookingFormSkeleton />}>
            <NewBookingForm
                guests={guestsResponse.guests || []}
                properties={propertiesResponse.properties || []}
                pricingUnits={pricingUnits}
            />
        </Suspense>
    )
}

// Loading skeleton component
const BookingFormSkeleton = () => (
    <div className="w-full mx-auto space-y-6 p-4 max-w-4xl">
        {/* Header Skeleton */}
        <Card>
            <CardHeader>
                <div className="flex items-center gap-3">
                    <Skeleton className="h-12 w-12 rounded-lg" />
                    <div className="flex-1">
                        <Skeleton className="h-6 w-48 mb-2" />
                        <Skeleton className="h-4 w-64" />
                    </div>
                    <Skeleton className="h-8 w-16" />
                </div>
            </CardHeader>
        </Card>

        {/* Form Sections Skeletons */}
        {[1, 2, 3].map((section) => (
            <Card key={section}>
                <CardHeader>
                    <Skeleton className="h-5 w-40 mb-2" />
                    <Skeleton className="h-4 w-56" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        ))}

        {/* Submit Button Skeleton */}
        <div className="flex justify-end gap-4 pt-4">
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-10 w-32" />
        </div>
    </div>
)

export default AddBookingsPage