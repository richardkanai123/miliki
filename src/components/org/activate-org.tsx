'use client'

import { organization, useSession } from "@/lib/auth-client"
import { useTransition } from "react"
import { Button } from "@/components/ui/button"
import { CheckIcon, Loader2Icon } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

const ActivateOrg = ({ organizationId }: { organizationId: string }) => {
    const router = useRouter()
    const { data: session, isPending, error } = useSession()
    const [isPendingActivateOrg, startTransitionActivateOrg] = useTransition()

    if (isPending) return (
        <Button variant="outline" size="icon" disabled>
            <Loader2Icon className="size-4 text-destructive animate-spin" />
        </Button>
    )
    if (error) return null
    if (!session) {
        return null
    }

    const handleActivateOrg = async () => {
        startTransitionActivateOrg(async () => {
            try {
                const { data, error } = await organization.setActive({
                    organizationId
                })
                if (error) {
                    throw new Error(error.message)
                }
                toast.info(`${data.name} is now your active organization`)
                router.push(`/org/my-orgs/${data.slug}`)
            } catch (error) {
                toast.error(error instanceof Error ? error.message : "An unknown error occurred")
            }
        })
    }
    return (
        <Button variant="outline" disabled={isPendingActivateOrg} onClick={handleActivateOrg}>
            {isPendingActivateOrg ? <Loader2Icon className="size-4 text-destructive animate-spin" /> : <CheckIcon className="size-4 text-green-500" />}
            Activate
        </Button>
    )
}

export default ActivateOrg