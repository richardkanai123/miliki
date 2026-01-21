import { auth } from '@/lib/auth';
import { authCheck } from '@/lib/auth-check';
import Unauthorised from '../auth/unauthorised';
import InvitationComponent from './invitation';
import { Mail } from 'lucide-react';

const InvitationsLister = async () => {

    const session = await authCheck()
    if (!session) {
        return <Unauthorised link="/login" message="You must be logged in to view your invitations" solution="Please login to your account" linkText="Login" />
    }

    const userEmail = session.user.email

    const invitations = await auth.api.listUserInvitations({
        query: {
            email: userEmail,
        }
    });

    if (!invitations.length) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center border rounded-xl bg-muted/5 border-dashed">
                <div className="bg-muted/20 p-4 rounded-full mb-4">
                    <Mail className="h-8 w-8 text-muted-foreground/60" />
                </div>
                <h3 className="text-lg font-semibold">No Pending Invitations</h3>
                <p className="text-muted-foreground max-w-sm mt-2 text-sm">
                    You don't have any pending invitations at the moment. When someone invites you to an organization, it will appear here.
                </p>
            </div>
        )
    }

    const pendingInvitations = invitations.filter((invitation) => invitation.status === "pending")

    return (
        <div className="space-y-4 mt-4 p-4 bg-card rounded-none">
            <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-bold tracking-tight">Your Invitations</h2>
                <p className="text-muted-foreground text-sm">Review and respond to your organization invitations.</p>
            </div>

            {
                pendingInvitations.length > 0 ? (
                    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-2">
                        {pendingInvitations.map((invitation) => (
                            <InvitationComponent key={invitation.id} invitation={invitation} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center border rounded-xl bg-muted/5 border-dashed">
                        <div className="bg-muted/20 p-4 rounded-full mb-4">
                            <Mail className="h-8 w-8 text-muted-foreground/60" />
                        </div>
                        <h3 className="text-lg font-semibold">No Pending Invitations</h3>
                        <p className="text-muted-foreground max-w-sm mt-2 text-sm">
                            You don't have any pending invitations at the moment. When someone invites you to an organization, it will appear here.
                        </p>
                    </div>
                )
            }
        </div >
    )
}

export default InvitationsLister
