'use client'

import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Property } from "@/generated/prisma"
import { updatePropertyNotes } from "@/lib/actions/properties/updatePropertyNotes"
import { toast } from "sonner"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Edit, Loader2 } from "lucide-react"
import { useState } from "react"

// Schema for notes validation
const notesSchema = z.object({
    notes: z.string().max(500, "Notes must not exceed 500 characters").optional(),
});

type NotesInput = z.infer<typeof notesSchema>;

interface NotesEditDialogProps {
    property: Property;
}

const NotesEditDialog = ({ property }: NotesEditDialogProps) => {
    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<NotesInput>({
        resolver: zodResolver(notesSchema),
        defaultValues: {
            notes: property.notes || '',
        },
    });

    const onSubmit = async (data: NotesInput) => {
        setIsSubmitting(true);
        try {
            const result = await updatePropertyNotes(property.id, data.notes || '');
            if (result.success) {
                toast.success(result.message);
                setOpen(false);
                form.reset();
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "An unknown error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        setOpen(false);
        form.reset(); // Reset form when canceling
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Edit className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Property Notes</DialogTitle>
                    <DialogDescription>
                        Update the additional notes for your property. Notes are optional.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="notes"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Property Notes</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Any additional information, house rules, or special instructions..."
                                            className="min-h-[100px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <p className="text-xs text-muted-foreground">
                                        Optional additional information about the property (max 500 characters)
                                    </p>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex justify-end space-x-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleCancel}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Updating...
                                    </>
                                ) : (
                                    'Update Notes'
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default NotesEditDialog;