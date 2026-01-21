'use client'

import { Button } from '@/components/ui/button'
import { organization } from '@/lib/auth-client'
import { toast } from 'sonner'
import { useTransition } from 'react'
import { Loader2, X } from 'lucide-react'
import { useRouter } from 'next/navigation'

const RejectButton = ({ invitationId }: { invitationId: string }) => {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()

    const handleReject = async () => {
        startTransition(async () => {
            try {
                await organization.rejectInvitation({
                    invitationId
                })
                toast.success("Invitation rejected")
                router.refresh()
            } catch (error) {
                console.error(error)
                const errorMessage = error instanceof Error ? error.message : "Failed to reject invitation"
                toast.error(errorMessage)
            }
        })
    }

    return (
        <Button className="flex-1 h-9" size="sm" variant="destructive" onClick={handleReject} disabled={isPending}>
            {isPending ? <Loader2 className='w-4 h-4 animate-spin' /> : <X className='w-4 h-4' />}
        </Button>
    )
}

export default RejectButton