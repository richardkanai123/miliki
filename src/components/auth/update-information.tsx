'use client'
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { EditIcon } from "lucide-react"
import UpdateInformationForm from "./update-information-form"
import { useState } from "react"

export default function UpdateInformationDialog({ email, name, phoneNumber }: { email: string, name: string, phoneNumber: string }) {
    const [open, setOpen] = useState(false)
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="bg-orange-500 text-white hover:bg-orange-600 hover:text-white border-none gap-2">
                    Edit <EditIcon className="size-4" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Update Information</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-4">
                    <UpdateInformationForm email={email} fullName={name} phoneNumber={phoneNumber} />
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button onClick={() => setOpen(false)} variant="outline">Cancel</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>

        </Dialog>
    )
}