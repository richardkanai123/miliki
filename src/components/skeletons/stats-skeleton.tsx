import { Skeleton } from "@/components/ui/skeleton";

export default function StatsSkeletons() {
    return (
        <div className="w-full grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Skeleton className="h-[100px] rounded-lg" />
            <Skeleton className="h-[100px] rounded-lg" />
            <Skeleton className="h-[100x] rounded-lg" />
            <Skeleton className="h-[100px] rounded-lg" />
        </div>
    )
}