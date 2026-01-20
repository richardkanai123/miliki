import { Suspense } from "react"
import ProfileComponent from "@/components/auth/profile-component"
import ProfileSkeleton from "@/components/skeletons/profile-skeleton"
import { Skeleton } from "@/components/ui/skeleton"
import InvitationsLister from "@/components/org/invitations-lister"

const ProfilePage = async () => {
    return (
        <div className="w-full max-w-2xl mx-auto p-4 flex flex-col">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-primary">My Profile</h1>
            </div>
            <Suspense fallback={<ProfileSkeleton />}>
                <ProfileComponent />
            </Suspense>
            <Suspense fallback={<Skeleton className="h-10 w-full" />}>
                <InvitationsLister />
            </Suspense>
        </div>
    )
}

export default ProfilePage