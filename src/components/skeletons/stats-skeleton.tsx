import { Skeleton } from "@/components/ui/skeleton";

export default function StatsSkeletons() {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Skeleton className="h-[108px] rounded-lg" />
            <Skeleton className="h-[108px] rounded-lg" />
            <Skeleton className="h-[108px] rounded-lg" />
            <Skeleton className="h-[108px] rounded-lg" />
        </div>
    )
}