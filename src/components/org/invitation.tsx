
import { getOrganizationById } from '@/lib/dal/organizations/get-org-by-id'
import AcceptButton from './accept-invitation-btn'
import RejectButton from './reject-invitation-btn'
import type { Invitation } from '@/app/_generated/prisma/client/client'
import type { Organization } from '@/app/_generated/prisma/client/client'


const InvitationComponent = async ({ invitation }: { invitation: Invitation }) => {

    const { success, organization, message } = await getOrganizationById(invitation.organizationId)

    if (!success) {
        return <div className="bg-card rounded-none overflow-hidden hover:shadow-md transition-shadow">
            <div className="pb-3 bg-muted/30">
                <h3> {message}</h3>
            </div>
        </div>
    }

    const { name } = organization as Organization


    return (
        <div className="w-full max-w-md bg-card/70 border p-2 rounded-md overflow-hidden hover:shadow-md transition-shadow flex justify-between gap-1">
            <h3 className="text-base font-semibold">
                You have been invited to join {name} as {invitation.role}
            </h3>
            <div className="flex justify-end gap-2 w-full">
                <AcceptButton invitationId={invitation.id} />
                <RejectButton invitationId={invitation.id} />
            </div>
        </div>
    )
}

export default InvitationComponent
