import { Skeleton } from "@/components/ui/skeleton"

export default function TableSkeleton() {
    return (
        <div className="space-y-4">
            <Skeleton className="h-[400px] w-full rounded-md" />
        </div>
    )
}