import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, MailIcon, UsersIcon } from "lucide-react"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"

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

async function getCachedOrg(organizationId: string) {
    return await auth.api.getFullOrganization({
        headers: await headers(),
        query: {
            organizationId
        }
    })
}

const OrgDetail = async ({ params }: OrgDetailProps) => {
    const { id } = await params
    const org = await getCachedOrg(id)

    if (!org) {
        return (
            <div className="w-full h-[60vh] flex flex-col items-center justify-center gap-4 text-center">
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
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MailIcon className="h-5 w-5 text-primary" />
                            Invitations
                        </CardTitle>
                        <CardDescription>
                            Pending invitations sent to users
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{invitations?.length || 0}</div>
                        <p className="text-xs text-muted-foreground mt-1">Pending accept</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Member List</CardTitle>
                    <CardDescription>Manage members and their roles</CardDescription>
                </CardHeader>
                <CardContent>
                    {members && members.length > 0 ? (
                        <div className="space-y-4">
                            {members.map((member: Member) => (
                                <div key={member.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage src={member.user.image || undefined} />
                                            <AvatarFallback>{member.user.name?.charAt(0) || 'U'}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium text-sm">{member.user.name}</p>
                                            <p className="text-xs text-muted-foreground">{member.user.email}</p>
                                        </div>
                                    </div>
                                    <Badge variant={member.role === 'owner' ? 'default' : 'secondary'}>
                                        {member.role}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-muted-foreground">
                            No members found.
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

export default OrgDetail
