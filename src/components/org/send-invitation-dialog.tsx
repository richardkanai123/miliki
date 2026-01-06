'use client'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useState, useTransition } from 'react'
import { Loader2Icon, MailIcon, SendIcon } from 'lucide-react'
import { organization } from '@/lib/auth-client'
import { toast } from 'sonner'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { useRouter } from 'next/navigation'

const SendInvitationDialog = ({ organizationId }: { organizationId: string }) => {
    const [open, setOpen] = useState(false)
    const [isPending, startTransition] = useTransition()
    const [targetEmail, setTargetEmail] = useState('')
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const router = useRouter()


    const createInvitation = async () => {
        startTransition(async () => {
            setErrorMessage(null)
            try {
                if (!targetEmail.trim()) {
                    setErrorMessage('Please enter a valid email address')
                    toast.info('Please enter a valid email address')
                    return
                }
                if (!targetEmail.includes('@')) {
                    setErrorMessage('Please enter a valid email address')
                    toast.info('Please enter a valid email address')
                    return
                }
                const { data, error } = await organization.inviteMember({
                    email: targetEmail,
                    role: "member",
                    organizationId,
                    resend: true,
                })

                if (error) {
                    console.error(error)
                    setErrorMessage(error.message ?? 'An unknown error occurred')
                    toast.error(error.message);
                    return;
                }

                const { status, role } = data

                if (status === 'pending') {
                    toast.success(`Invitation sent to ${targetEmail} as a ${role} `)
                    setOpen(false)
                    setTargetEmail('')
                    setErrorMessage(null)
                    router.refresh()
                    return
                }
                toast.info(`Failed to invite ${targetEmail} to the organization`)
            } catch (error) {
                const message = error instanceof Error ? error.message : 'An unknown error occurred'
                setErrorMessage(message)
                toast.error(message)
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" className="gap-2 shrink-0">
                    <MailIcon className="size-4" />
                    <span className="hidden sm:inline">Invite Member</span>
                    <span className="sm:hidden">Invite</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Invite User</DialogTitle>
                    <DialogDescription>
                        Send an invitation link to a user to join this organization.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-2">
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium">
                            Email address
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="user@example.com"
                            value={targetEmail}
                            onChange={(e) => setTargetEmail(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    createInvitation()
                                }
                            }}
                        />
                        {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
                    </div>
                </div>
                <DialogFooter className="flex sm:justify-end gap-2">
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        onClick={createInvitation}
                        disabled={isPending || !targetEmail.trim()}
                        className="gap-2"
                    >
                        {isPending ? (
                            <>
                                <Loader2Icon className="size-4 animate-spin" />
                                Sending...
                            </>
                        ) : (
                            <>
                                <SendIcon className="size-4" />
                                Send Invitation
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default SendInvitationDialog
