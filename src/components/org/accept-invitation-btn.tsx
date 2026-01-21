'use client'

import { Button } from '@/components/ui/button'
import { organization } from '@/lib/auth-client'
import { toast } from 'sonner'
import { useTransition } from 'react'
import { Check, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

const AcceptButton = ({ invitationId }: { invitationId: string }) => {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()

    const handleAccept = async () => {
        startTransition(async () => {
            try {
                await organization.acceptInvitation({
                    invitationId
                })
                toast.success("Invitation accepted successfully")
                router.refresh()
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : "Failed to accept invitation"
                console.error(errorMessage)
                toast.error(errorMessage)
            }
        })
    }

    return (
        <Button className="flex-1 h-9" size="sm" onClick={handleAccept} disabled={isPending}>
            {isPending ? <Loader2 className='w-4 h-4 animate-spin' /> : <Check className='w-4 h-4' />}
        </Button>
    )
}

export default AcceptButton