'use client'


import { useState, useTransition } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Button } from '../ui/button'
import { organization } from '@/lib/auth-client'
import type { MilikiRole } from '@/lib/roles'
import { toast } from 'sonner'
import { Loader2Icon } from 'lucide-react'
import { Separator } from '../ui/separator'
import { Select, SelectContent, SelectTrigger, SelectItem, SelectValue } from '../ui/select'
import { Label } from '../ui/label'
import { useRouter } from 'next/navigation'

const ChangeMemberRoleDialog = ({ memberId, currentRole, organizationId, currentUserCanManage }: { memberId: string, currentRole: string, organizationId: string, currentUserCanManage: boolean }) => {
    const [open, setOpen] = useState(false)
    const router = useRouter()
    const [role, setRole] = useState<MilikiRole>(currentRole as MilikiRole)
    const [isPending, startTransition] = useTransition()
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    if (!currentUserCanManage) {
        return null
    }

    const handleChangeRole = async () => {
        startTransition(async () => {
            setErrorMessage(null)
            try {
                if (!currentUserCanManage) {
                    toast.error('You are not authorized to change the role of this member')
                    return
                }
                if (role === 'owner') {
                    toast.error('You cannot change the role of the owner')
                    return
                }

                await organization.updateMemberRole({
                    memberId,
                    role,
                    organizationId,
                }, {
                    onSuccess: () => {
                        toast.success(`Role changed successfully to ${role}`)
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
                <Button variant="outline" size="sm">Change Role</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Change Role to <span className="font-bold">{role}</span></DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    Are you sure you want to change the role of the member to <span className="font-bold">{role}</span>? This action cannot be undone.
                </DialogDescription>
                <Separator />
                <div className="space-y-2">
                    <Label>Role</Label>
                    <Select value={role} onValueChange={(value) => setRole(value as MilikiRole)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="manager">Manager</SelectItem>
                            <SelectItem value="member">Member</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)} disabled={isPending}>Cancel</Button>
                    <Button variant="destructive" onClick={() => handleChangeRole()} disabled={isPending}>
                        {isPending ? (
                            <>
                                <Loader2Icon className="size-4 animate-spin" />
                                Changing...
                            </>
                        ) : (
                            "Change Role"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default ChangeMemberRoleDialog