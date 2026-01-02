'use client'

import { organization, useSession } from "@/lib/auth-client"
import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Loader2Icon, TrashIcon } from "lucide-react"
import { Dialog, DialogTitle, DialogHeader, DialogContent, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

const DeleteOrgDialog = ({ organizationId, organizationName }: { organizationId: string, organizationName: string }) => {
    const router = useRouter()
    const { data: session, isPending: sessionPending, error } = useSession()
    const [open, setOpen] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [isPending, startTransition] = useTransition()

    if (sessionPending) return (
        <Button variant="outline" size="icon" disabled>
            <Loader2Icon className="size-4 text-destructive animate-spin" />
        </Button>
    )
    if (error) return null
    if (!session) {
        return null
    }

    const handleDelete = async () => {
        startTransition(async () => {
            try {
                setErrorMessage(null)
                const { data, error } = await organization.delete({
                    organizationId
                })
                console.log(data, error)
                if (error) {
                    toast.error(error.message)
                    setErrorMessage(error.message ?? "An unknown error occurred")
                    setOpen(false)
                    return
                }
                toast.success(`Organization ${data.name} deleted successfully`)
                setErrorMessage(null)
                setOpen(false)
                router.push("/org/my-orgs")
            } catch (error) {
                const message = error instanceof Error ? error.message : "An unknown error occurred"
                toast.error(message)
                setErrorMessage(message)
                setOpen(false)
            }
        })
    }
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="destructive" disabled={isPending}>
                    <TrashIcon className="size-4" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Organization</DialogTitle>
                    {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                </DialogHeader>
                <DialogDescription>
                    Are you sure you want to delete the organization {organizationName}?
                </DialogDescription>

                <DialogFooter>
                    <Button variant="destructive" onClick={() => handleDelete()} disabled={isPending}>
                        {isPending ? "Deleting..." : "Delete"}
                    </Button>
                    <Button variant="outline" onClick={() => setOpen(false)} disabled={isPending}>Cancel</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default DeleteOrgDialog