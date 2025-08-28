'use client'

import { Button } from "@/components/ui/button"
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogTrigger, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { DeleteProperty } from "@/lib/actions/properties/DeleteProperty"
import { toast } from "sonner"
import { Loader2, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

const DeletePropertyBtn = ({ propertyId, propertyTitle }: { propertyId: string, propertyTitle: string }) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();
    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const result = await DeleteProperty(propertyId);
            if (result.success) {
                toast.success(result.message);
                router.push('/dashboard/properties');
                setIsDeleting(false);
            } else {
                toast.error(result.message);
                setIsDeleting(false);
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
            toast.error(errorMessage);
            setIsDeleting(false);
        } finally {
            setIsDeleting(false);
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="p-2" variant="destructive">
                    <Trash2 className="w-4 h-4" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete : {propertyTitle}</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this property? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="destructive" disabled={isDeleting} onClick={async () => await handleDelete()}>{isDeleting ? <Loader2 className="size-4 animate-spin" /> : 'Delete'}</Button>
                    <DialogClose disabled={isDeleting}>Cancel</DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default DeletePropertyBtn;