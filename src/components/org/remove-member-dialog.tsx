'use client'
import { useState, useTransition } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Button } from '../ui/button'
import { organization } from '@/lib/auth-client'
import { toast } from 'sonner'
import { Loader2Icon } from 'lucide-react'
import { Separator } from '../ui/separator'
import { useRouter } from 'next/navigation'

const RemoveMemberDialog = ({ memberId, memberName, organizationId }: { memberId: string, memberName: string, organizationId: string }) => {
    const [open, setOpen] = useState(false)
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const handleRemoveMember = async () => {
        startTransition(async () => {
            try {
                await organization.removeMember({
                    memberIdOrEmail: memberId,
                    organizationId,
                }, {
                    onSuccess: () => {
                        toast.success(`User removed successfully`)
                        setOpen(false)
                        router.refresh()
                    },
                    onError: (error) => {
                        setErrorMessage(error.error.message || 'An unknown error occurred')
                        toast.error(error.error.message || 'An unknown error occurred')
                    }
                })
            } catch (error) {
                console.error(error)
                const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
                setErrorMessage(errorMessage)
                toast.error(errorMessage)
            }
        })
    }
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="destructive" size="sm">Remove</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Remove Member from Organization
                    </DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    Are you sure you want to remove <span className="font-bold">{memberName}</span> from the organization? This action cannot be undone.
                </DialogDescription>
                <Separator />
                {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)} disabled={isPending}>Cancel</Button>
                    <Button variant="destructive" onClick={() => handleRemoveMember()} disabled={isPending}>
                        {isPending ? (
                            <>
                                <Loader2Icon className="size-4 animate-spin" />
                                Removing...
                            </>
                        ) : (
                            "Remove"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default RemoveMemberDialog