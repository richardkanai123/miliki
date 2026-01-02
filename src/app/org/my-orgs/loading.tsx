import { OrgListSkeleton } from "@/components/skeletons/org-skeletons"

export default function Loading() {
    return (
        <div className="w-full flex flex-col items-center justify-center gap-4 p-4">
            <div className="w-full max-w-5xl m-auto flex items-center justify-between mb-4">
                <div className="h-8 w-48 bg-muted animate-pulse rounded" />
                <div className="h-10 w-40 bg-muted animate-pulse rounded" />
            </div>
            <div className="w-full max-w-5xl m-auto">
                <OrgListSkeleton />
            </div>
        </div>
    )
}

