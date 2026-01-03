'use client'

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, AlertDialogMedia } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { organization } from "@/lib/auth-client"
import { toast } from "sonner"
import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Loader2Icon, LogOutIcon, TriangleAlertIcon } from "lucide-react"

const LeaveOrgDialog = ({ orgId }: { orgId: string }) => {
    const [isOpen, setIsOpen] = useState(false)
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    if (!orgId) return null

    const handleLeaveOrg = async () => {
        startTransition(async () => {
            try {
                await organization.leave({
                    organizationId: orgId,
                }, {
                    onSuccess: () => {
                        toast.success("You have left the organization")
                        setIsOpen(false)
                        router.push("/org/my-orgs")
                        router.refresh()
                    },
                    onError: (error) => {
                        const errorMessage = error.error.message || "An error occurred while leaving the organization"
                        toast.error(errorMessage)
                        return
                    }
                })
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : "An error occurred while leaving the organization"
                toast.error(errorMessage)
            }
        })
    }

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full sm:w-auto gap-2">
                    <LogOutIcon className="h-4 w-4" />
                    Leave Organization
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogMedia>
                        <TriangleAlertIcon className="h-5 w-5 text-destructive" />
                    </AlertDialogMedia>
                    <div className="flex flex-col gap-1 text-center sm:text-left">
                        <AlertDialogTitle>Leave Organization?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to leave this organization? You will lose access to all resources and will need to be re-invited to join again.
                        </AlertDialogDescription>
                    </div>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault()
                            handleLeaveOrg()
                        }}
                        disabled={isPending}
                        variant="destructive"
                        className="gap-2"
                    >
                        {isPending ? (
                            <>
                                <Loader2Icon className="h-4 w-4 animate-spin" />
                                Leaving...
                            </>
                        ) : (
                            'Confirm Leave'
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default LeaveOrgDialog
