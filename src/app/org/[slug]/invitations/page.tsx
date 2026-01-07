import { auth } from "@/lib/auth"
import { authCheck } from "@/lib/auth-check"
import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { Suspense } from "react"
import { hasPermissions } from "@/lib/permission-helpers"
import { Loader2Icon } from "lucide-react"

const getActiveOrgInvitations = async (organizationSlug: string) => {
    try {


        const session = authCheck()
        if (!session) {
            return redirect("/login")
        }

        console.log(organizationSlug)

        const organization = await auth.api.getFullOrganization({
            headers: await headers(),
            query: {
                organizationSlug: organizationSlug,
            },
        })

        if (!organization) {
            throw new Error("Organization not found")
        }

        const data = organization.invitations

        return data
    } catch (error) {
        console.error(error)
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
        throw new Error(errorMessage)
    }
}


const OrgInvitationsPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
    const { slug } = await params
    console.log(slug)
    const invitations = await getActiveOrgInvitations(slug)



    return (
        <Suspense fallback={<div className="w-full max-w-4xl mx-auto flex flex-col gap-8 p-6"><Loader2Icon className="size-4 animate-spin" /> Loading...</div>}>
            <div className="w-full max-w-4xl mx-auto flex flex-col gap-8 p-6">
                <h1 className="text-2xl font-bold">Invitations</h1>
                <div className="flex flex-col gap-4">
                    {invitations.map((invitation) => (
                        <div key={invitation.id}>
                            <h2 className="text-lg font-bold">{invitation.email}</h2>
                            <p className="text-sm text-muted-foreground">{invitation.role}</p>
                            <p>{invitation.status}</p>
                        </div>
                    ))}
                </div>

            </div>
        </Suspense>
    )
}

export default OrgInvitationsPage