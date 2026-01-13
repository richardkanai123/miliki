import { Skeleton } from "@/components/ui/skeleton"

export function PropertyDetailSkeleton() {
    return (
        <div className="space-y-6 p-4">
            {/* Header skeleton */}
            <div className="space-y-4">
                <Skeleton className="h-8 w-32" />
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-3">
                        <Skeleton className="h-8 w-64" />
                        <div className="flex gap-4">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-48" />
                            <Skeleton className="h-4 w-32" />
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Skeleton className="h-9 w-20" />
                        <Skeleton className="h-9 w-24" />
                    </div>
                </div>
            </div>

            {/* Stats skeleton */}
            <div className="grid gap-2 grid-cols-2 md:grid-cols-4 lg:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                    <Skeleton key={i} className="h-[90px]" />
                ))}
            </div>

            {/* Alerts skeleton */}
            <Skeleton className="h-16 w-full" />

            {/* Tabs skeleton */}
            <div className="space-y-4">
                <Skeleton className="h-10 w-96" />
                <Skeleton className="h-[400px] w-full" />
            </div>
        </div>
    )
}
