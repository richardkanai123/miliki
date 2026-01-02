import { redirect } from "next/navigation"
import { authCheck } from "@/lib/auth-check"
import OrgsLister from "@/components/org/org-lister"
import CreateOrgDialog from "@/components/org/create-org-dialog"

const MyOrgsPage = async () => {
    const session = await authCheck()
    if (!session) {
        redirect("/login")
    }

    return (
        <div className="w-full flex flex-col items-center justify-start gap-8 p-6 md:p-8 min-h-screen">
            <div className="w-full max-w-5xl m-auto flex flex-col sm:flex-row items-center justify-between gap-4 border-b pb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Organizations</h1>
                    <p className="text-muted-foreground mt-1">Manage your organizations and memberships</p>
                </div>
                <CreateOrgDialog />
            </div>
            
            <OrgsLister />
        </div>
    )
}

export default MyOrgsPage
