'use client'
import type { Invitation } from '@/app/_generated/prisma/client/browser'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { CalendarIcon, ShieldIcon, Building2 } from 'lucide-react'
import { organization } from '@/lib/auth-client'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

const InvitationComponent = ({ invitation }: { invitation: Invitation }) => {
    const router = useRouter()

    const handleAccept = async () => {
        try {
            await organization.acceptInvitation({
                invitationId: invitation.id
            })
            toast.success("Invitation accepted successfully")
            router.refresh()
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Failed to accept invitation"
            console.error(errorMessage)
            toast.error(errorMessage)
        }
    }

    const handleReject = async () => {
        try {
            await organization.rejectInvitation({
                invitationId: invitation.id
            })
            toast.success("Invitation rejected")
            router.refresh()
        } catch (error) {
            console.error(error)
            const errorMessage = error instanceof Error ? error.message : "Failed to reject invitation"
            toast.error(errorMessage)
        }
    }

    return (
        <Card className="overflow-hidden hover:shadow-md transition-shadow">
            <CardHeader className="pb-3 bg-muted/30">
                <div className="flex justify-between items-start gap-2">
                    <div className="flex items-center gap-2">
                        <div className="bg-primary/10 p-2 rounded-md">
                            <Building2 className="h-4 w-4 text-primary" />
                        </div>
                        <div className="space-y-0.5">
                            <CardTitle className="text-sm font-semibold truncate">
                                Organization Invite
                            </CardTitle>
                            <CardDescription className="text-xs truncate max-w-[150px]">
                                {invitation.email}
                            </CardDescription>
                        </div>
                    </div>
                    <Badge variant={invitation.status === 'pending' ? 'outline' : 'secondary'} className="capitalize text-[10px] h-5 px-2">
                        {invitation.status}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="py-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <span className="text-[10px] uppercase text-muted-foreground font-semibold tracking-wider">Role</span>
                        <div className="flex items-center gap-1.5">
                            <ShieldIcon className="h-3.5 w-3.5 text-muted-foreground/70" />
                            <span className="text-sm font-medium capitalize">{invitation.role}</span>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <span className="text-[10px] uppercase text-muted-foreground font-semibold tracking-wider">Expires</span>
                        <div className="flex items-center gap-1.5">
                            <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground/70" />
                            <span className="text-sm font-medium">{new Date(invitation.expiresAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="pt-0 pb-4 px-4">
                <div className="flex gap-2 w-full">
                    <Button onClick={handleReject} variant="outline" className="flex-1 h-9" size="sm">
                        Decline
                    </Button>
                    <Button onClick={handleAccept} className="flex-1 h-9" size="sm">
                        Accept
                    </Button>
                </div>
            </CardFooter>
        </Card>
    )
}

export default InvitationComponent
