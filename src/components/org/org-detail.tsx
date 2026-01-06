import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, Loader2Icon, MailIcon, PlusIcon, UsersIcon } from "lucide-react"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import SendInvitationDialog from "./send-invitation-dialog"
import LeaveOrgDialog from "./leave-org-dialog"
import { Suspense } from "react"
import { Button } from "../ui/button"
import OrgMember from "./org-member"
import { Skeleton } from "../ui/skeleton"
import { getRoleDisplayName, type MilikiRole } from "@/lib/roles"

interface OrgDetailProps {
    params: Promise<{ id: string }>
}

interface Member {
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

async function getOrg(organizationId: string) {
    return await auth.api.getFullOrganization({
        headers: await headers(),
        query: {
            organizationId
        }
    })
}


const getCurrentUserRole = async () => {
    const { role } = await auth.api.getActiveMemberRole({
        headers: await headers(),
    });
    return role
}

const OrgDetail = async ({ params }: OrgDetailProps) => {
    const { id } = await params
    const org = await getOrg(id)
    const currentUserRole = await getCurrentUserRole()
    const userCanManage = currentUserRole === 'owner' || currentUserRole === 'manager'
    const currentUserIsMember = currentUserRole === 'member'





    if (!org) {
        return (
            <div className="w-full h-[60vh]  flex flex-col items-center justify-center gap-4 text-center">
                <div className="rounded-full bg-muted p-4">
                    <UsersIcon className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                    <h1 className="text-xl font-bold">Organization Not Found</h1>
                    <p className="text-muted-foreground">The organization you are looking for does not exist or you don't have access.</p>
                </div>
            </div>
        )
    }

    const { name, logo, members, invitations, slug, createdAt } = org

    const sortedMembers = members?.sort((a: Member, b: Member) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

    return (
        <div className="w-full max-w-4xl mx-auto flex flex-col gap-8 p-6">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20 border-2 border-border">
                        <AvatarImage src={logo || undefined} alt={name} />
                        <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">
                            {name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold tracking-tight">{name}</h1>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Badge variant="outline" className="font-mono text-xs">{slug}</Badge>
                            <span className="text-xs flex items-center gap-1">
                                <CalendarIcon className="h-3 w-3" />
                                Created {new Date(createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                </div>
                {
                    currentUserIsMember ? <div className="flex items-center gap-2">
                        <LeaveOrgDialog orgId={id} />
                    </div> : (
                        <Badge variant="outline" className="font-mono text-xs">
                            {getRoleDisplayName(currentUserRole as MilikiRole)}
                        </Badge>
                    )
                }
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <UsersIcon className="h-5 w-5 text-primary" />
                            Members
                        </CardTitle>
                        <CardDescription>
                            People who are part of this organization
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{members?.length || 0}</div>
                        <p className="text-xs text-muted-foreground mt-1">Active members</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2 gap-4">
                        <div className="space-y-1">
                            <CardTitle className="flex items-center gap-2">
                                <MailIcon className="h-5 w-5 text-primary" />
                                Invitations
                            </CardTitle>
                            <CardDescription>
                                Pending invitations
                            </CardDescription>
                        </div>
                        {
                            userCanManage ? (
                                <Suspense fallback={
                                    <Button variant='outline' size="sm" disabled>
                                        <Loader2Icon className="size-4 animate-spin" />
                                    </Button>}>
                                    <SendInvitationDialog organizationId={id} />
                                </Suspense>
                            ) : null
                        }
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{invitations?.length || 0}</div>
                        <p className="text-xs text-muted-foreground mt-1">Awaiting acceptance</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Member List</CardTitle>
                    <CardDescription>Manage members and their roles</CardDescription>
                </CardHeader>
                <CardContent>
                    <Suspense fallback={
                        <div className="space-y-4">
                            <Skeleton className="size-3 w-full" />
                        </div>
                    }>
                        {members && members.length > 0 ? (
                            <div className="space-y-4">
                                {sortedMembers.map((member: Member) => (
                                    <OrgMember key={member.id} Member={member} currentUserCanManage={userCanManage} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                <p>No members found.</p>
                                <p>Add a member to the organization to get started.</p>
                                <Button variant="outline" size="sm">
                                    <PlusIcon className="size-4" />
                                    Add Member
                                </Button>
                            </div>
                        )}
                    </Suspense>
                </CardContent>
            </Card>
        </div>
    )
}

export default OrgDetail
