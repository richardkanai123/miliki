'use client'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { canManageRole, getRoleDisplayName, type MilikiRole } from "@/lib/roles";
import { Badge } from "@/components/ui/badge";
import ChangeMemberRoleDialog from "@/components/org/change-role";
import LeaveOrgDialog from "@/components/org/leave-org-dialog";
import RemoveMemberDialog from "@/components/org/remove-member-dialog";
import { useSession } from "@/lib/auth-client";

interface OrgMemberProps {
    id: string
    organizationId: string
    userId: string
    role: string
    createdAt: Date
    user: {
        id: string
        name: string
        email: string
        image?: string
    }
}


const OrgMember = ({ Member, currentUserRole }: { Member: OrgMemberProps, currentUserRole: MilikiRole }) => {

    const { id, organizationId, role, user } = Member;
    const { data: session } = useSession();
    const isCurrentUser = session?.user?.id === user.id;

    // Use role hierarchy to determine if current user can manage this member
    const canManageThisMember = canManageRole(currentUserRole, role as MilikiRole);

    // Current user can leave if viewing their own card and they're not the owner
    const canLeaveOrg = isCurrentUser && role !== 'owner';

    return (
        <div
            key={id}
            className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors"
        >
            <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                    <AvatarImage src={user.image || "/profile.jpg"} />
                    <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <div>
                    <p className="font-medium text-sm">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                    {
                        isCurrentUser ? (
                            <Badge className="ml-auto text-xs font-light text-muted-foreground" variant="default">
                                you
                            </Badge>
                        ) :
                            <Badge className="ml-auto text-xs font-light text-muted" variant="default">
                                {getRoleDisplayName(role as MilikiRole)}
                            </Badge>
                    }
                </div>
            </div>
            <div className="flex flex-col md:flex-row items-center justify-end  gap-2">

                {
                    canLeaveOrg && (
                        <LeaveOrgDialog orgId={organizationId} />
                    )
                }
                {canManageThisMember && !isCurrentUser && (
                    <>
                        <ChangeMemberRoleDialog memberId={id} currentRole={role} organizationId={organizationId} currentUserCanManage={canManageThisMember} />
                        <RemoveMemberDialog memberId={id} memberName={user.name} organizationId={organizationId} />
                    </>
                )}

            </div>

        </div >
    );
};
export default OrgMember;