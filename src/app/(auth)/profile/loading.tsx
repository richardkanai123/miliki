import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'

const ProfilePageSkeleton = () => {
    return (
        <div className="min-h-screen">
            <div className="max-w-3xl mx-auto p-4 space-y-2">
                {/* Header Skeleton */}
                <div className="text-center p-4 space-y-2">
                    <Skeleton className="h-8 w-32 mx-auto" />
                    <Skeleton className="h-4 w-48 mx-auto" />
                </div>

                {/* Profile Card Skeleton */}
                <Card className="overflow-hidden">
                    <CardContent className="p-2">
                        {/* Avatar Section Skeleton */}
                        <div className="flex flex-col items-center space-y-2 pb-6">
                            <div className="relative">
                                <Skeleton className="w-[120px] h-[120px] rounded-full" />
                            </div>
                            <div className="text-center space-y-1">
                                <Skeleton className="h-6 w-32 mx-auto" />
                                <Skeleton className="h-5 w-20 mx-auto rounded-full" />
                            </div>
                        </div>

                        <Separator className="mb-4" />

                        {/* Profile Information Skeleton */}
                        <div className="space-y-4">
                            {/* Username */}
                            <div className="flex items-center space-x-2 p-2 rounded-lg">
                                <div className="flex-shrink-0">
                                    <Skeleton className="h-5 w-5 rounded" />
                                </div>
                                <div className="flex-1 min-w-0 space-y-1">
                                    <Skeleton className="h-4 w-20" />
                                    <Skeleton className="h-4 w-24" />
                                </div>
                            </div>

                            {/* Email */}
                            <div className="flex items-center space-x-2 p-2 rounded-lg">
                                <div className="flex-shrink-0">
                                    <Skeleton className="h-5 w-5 rounded" />
                                </div>
                                <div className="flex-1 min-w-0 space-y-1">
                                    <Skeleton className="h-4 w-16" />
                                    <Skeleton className="h-4 w-48" />
                                </div>
                            </div>

                            {/* Full Name */}
                            <div className="flex items-center space-x-2 p-2 rounded-lg">
                                <div className="flex-shrink-0">
                                    <Skeleton className="h-5 w-5 rounded" />
                                </div>
                                <div className="flex-1 min-w-0 space-y-1">
                                    <Skeleton className="h-4 w-20" />
                                    <Skeleton className="h-4 w-32" />
                                </div>
                            </div>

                            {/* Last Active */}
                            <div className="flex items-center space-x-2 p-2 rounded-lg">
                                <div className="flex-shrink-0">
                                    <Skeleton className="h-5 w-5 rounded" />
                                </div>
                                <div className="flex-1 min-w-0 space-y-1">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-4 w-40" />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Actions Card Skeleton */}
                <Card>
                    <CardContent className="p-4 space-y-2">
                        <div className="flex items-center justify-between h-12 p-2">
                            <div className="flex items-center space-x-3">
                                <Skeleton className="h-5 w-5 rounded" />
                                <Skeleton className="h-4 w-32" />
                            </div>
                            <Skeleton className="h-4 w-4" />
                        </div>

                        <Separator />

                        <div className="pt-2">
                            <Skeleton className="h-10 w-full rounded-md" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default ProfilePageSkeleton