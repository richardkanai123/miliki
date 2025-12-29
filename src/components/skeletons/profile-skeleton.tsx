"use client"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const ProfileSkeleton = () => {
    return (
        <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto p-4">
            {/* Top Card: User Summary */}
            <Card className="border-none shadow-sm bg-card">
                <CardContent className="p-6 flex items-center gap-6">
                    <div className="relative">
                        <Skeleton className="h-24 w-24 rounded-full" />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-5 w-16 rounded-xl" />
                    </div>
                </CardContent>
            </Card>

            {/* Personal Information */}
            <Card className="border-none shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-8 w-20" />
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-y-6 gap-x-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={`profile-skeleton-${i * 23}`} className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-5 w-full max-w-[200px]" />
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Active Organization */}
            <Card className="border-none shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <Skeleton className="h-6 w-40" />
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-y-6 gap-x-4">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-5 w-48" />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}


export default ProfileSkeleton