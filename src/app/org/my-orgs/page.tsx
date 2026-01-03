import OrgsLister from "@/components/org/org-lister"
import CreateOrgDialog from "@/components/org/create-org-dialog"
import { authCheck } from "@/lib/auth-check"
import { redirect } from "next/navigation"
import { Suspense } from "react"
import { OrgListSkeleton } from "@/components/skeletons/org-skeletons"

const MyOrgsPage = async () => {
    const session = await authCheck()
    if (!session) {
        redirect("/login")
    }

    return (
        <div className="w-full flex flex-col items-center justify-start gap-2 p-4 md:p-8 min-h-screen">
            <div className="w-full max-w-5xl m-auto flex flex-col sm:flex-row items-center justify-between gap-2 border-b">
                <div className="flex flex-col items-start justify-start gap-0">
                    <h1 className="text-3xl font-bold tracking-tight">My Organizations</h1>
                    <p className="text-muted-foreground mt-1">Manage your organizations and memberships</p>
                </div>
                <CreateOrgDialog />
            </div>
            <Suspense fallback={<OrgListSkeleton />}>
                <OrgsLister />
            </Suspense>
        </div>
    )
}

export default MyOrgsPage
