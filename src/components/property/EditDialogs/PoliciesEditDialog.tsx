'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from '@/components/ui/form'
import { Switch } from '@/components/ui/switch'
import { Edit, Loader2, PawPrint, Cigarette } from 'lucide-react'
import { Property } from '@/generated/prisma'
import { updatePropertyPolicies } from '@/lib/actions/properties/UpdatePropertySection'
import { toast } from 'sonner'
import { editPoliciesSchema, EditPoliciesInput } from '@/lib/schemas/EditPropertySchemas'

type PoliciesInput = EditPoliciesInput;

interface PoliciesEditDialogProps {
    property: Property;
}

const PoliciesEditDialog = ({ property }: PoliciesEditDialogProps) => {
    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<PoliciesInput>({
        resolver: zodResolver(editPoliciesSchema),
        defaultValues: {
            petsAllowed: property.petsAllowed,
            smokingAllowed: property.smokingAllowed,
        },
    });

    const onSubmit = async (data: PoliciesInput) => {
        setIsSubmitting(true);
        try {
            const result = await updatePropertyPolicies(property.id, data);
            if (result.success) {
                toast.success(result.message);
                setOpen(false);
                window.location.reload();
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error('Failed to update policies');
        } finally {
            setIsSubmitting(false);
        }
    };

    const policies = [
        {
            name: 'petsAllowed' as const,
            label: 'Pets Allowed',
            description: 'Allow pets in the property',
            icon: PawPrint,
        },
        {
            name: 'smokingAllowed' as const,
            label: 'Smoking Allowed',
            description: 'Allow smoking in the property',
            icon: Cigarette,
        },
    ];

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Edit className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Edit Policies</DialogTitle>
                    <DialogDescription>
                        Update the policies for your property.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-4">
                            {policies.map((policy) => (
                                <FormField
                                    key={policy.name}
                                    control={form.control}
                                    name={policy.name}
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 hover:bg-accent/50 transition-colors">
                                            <div className="space-y-0.5">
                                                <FormLabel className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                                                    <policy.icon className="h-4 w-4 text-muted-foreground" />
                                                    {policy.label}
                                                </FormLabel>
                                                <p className="text-xs text-muted-foreground">
                                                    {policy.description}
                                                </p>
                                            </div>
                                            <FormControl>
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            ))}
                        </div>

                        <div className="flex justify-end space-x-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setOpen(false)}
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
                                    'Update Policies'
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default PoliciesEditDialog;
