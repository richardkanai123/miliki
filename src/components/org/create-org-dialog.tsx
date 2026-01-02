'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import CreateOrgForm from "./create-org-form"
import { useSession } from "@/lib/auth-client"
import DefaultLoader from "../skeletons/default-loader"

const CreateOrgDialog = () => {
    const { data: session, isPending, error } = useSession()
    const [open, setOpen] = useState(false)

    if (isPending) return <DefaultLoader message="Loading..." />
    if (!session || error) return null
    const userId = session.user.id

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Create Organization</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Organization</DialogTitle>
                </DialogHeader>
                <CreateOrgForm userId={userId} />
            </DialogContent>
        </Dialog>
    )

}
export default CreateOrgDialog