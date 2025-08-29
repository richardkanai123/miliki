import ErrorAlert from '@/components/ErrorAlert'
import EditGuestForm from '@/components/Forms/Guests/EditGuestForm'
import { GetGuestById } from '@/lib/actions/guests/getGuest'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import React, { Suspense } from 'react'

const EditGuestPage = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params

    const { guest, success, message } = await GetGuestById(id)

    if (!success) {
        return (
            <ErrorAlert errorMessage={message} />
        )
    }

    if (!guest) {
        return (
            <ErrorAlert errorMessage="Guest not found" />
        )
    }

    return (
        <Suspense fallback={<EditGuestLoadingSkeleton />}>
            <EditGuestForm guest={guest} />
        </Suspense>
    )
}

// Loading skeleton component
const EditGuestLoadingSkeleton = () => (
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

export default EditGuestPage