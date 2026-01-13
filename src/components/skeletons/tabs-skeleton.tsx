import { Skeleton } from "@/components/ui/skeleton";

export default function TabsSkeleton() {
    return (

        <div className="w-full space-y-4">
            <Skeleton className="h-10 w-96" />
            <Skeleton className="h-[400px] w-full" />
        </div>
    )

}