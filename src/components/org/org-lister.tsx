import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import OrgCard from './org-card'

const OrgsLister = async () => {
    const myorgs = await auth.api.listOrganizations({
        headers: await headers()
    })

    const hasOrgs = myorgs?.length > 0
    if (!hasOrgs) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center border rounded-lg border-dashed w-full max-w-5xl m-auto bg-muted/30">
                <p className="text-muted-foreground mb-4">You haven't created or joined any organizations yet.</p>
            </div>
        )
    }

    const session = await auth.api.getSession({
        headers: await headers()
    })

    const activeOrg = session?.session?.activeOrganizationId

    return (
        <div className="w-full max-w-5xl m-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myorgs.map((org) => (
                <OrgCard key={org.id} org={org} activeOrg={activeOrg ?? ''} />
            ))}
        </div>
    )
}

export default OrgsLister
