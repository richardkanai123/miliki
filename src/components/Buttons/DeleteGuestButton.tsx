'use client'
import { DeleteGuest } from "@/lib/actions/guests/DeleteGuest";
import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2Icon } from "lucide-react";
interface DeleteGuestButtonProps {
    guestId: string
    setDialogOpen: (open: boolean) => void
}
export const DeleteGuestButton = ({ guestId, setDialogOpen }: DeleteGuestButtonProps) => {
    const [isPending, startTransition] = useTransition();

    const handleDelete = async () => {
        setDialogOpen(false);
        if (isPending) return; // Prevent multiple clicks
        startTransition(async () => {
            try {
                const { message, success } = await DeleteGuest(guestId);
                if (success) {
                    toast.success(message);
                } else {
                    toast.error(message);
                }
            } catch (error) {
                if (error instanceof Error) {
                    const message = error.message || "An error occurred when deleting"
                    toast.error(message);
                }

            }

        });
    };

    return (
        <Button variant='destructive' onClick={handleDelete} disabled={isPending}>
            {isPending ? <Loader2 className="animate-spin mr-2" /> : <Trash2Icon className="mr-2" />}
            {isPending ? "Deleting..." : "Delete Guest"}
        </Button>
    );
};
