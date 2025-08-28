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
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Edit, Loader2 } from 'lucide-react'
import { Property } from '@/generated/prisma'
import { updatePropertyFees } from '@/lib/actions/properties/UpdatePropertySection'
import { toast } from 'sonner'
import { getCurrencyInfo } from '@/lib/utils/currency'
import { editFeesSchema, EditFeesInput } from '@/lib/schemas/EditPropertySchemas'

type FeesInput = EditFeesInput;

interface FeesEditDialogProps {
    property: Property;
}

const FeesEditDialog = ({ property }: FeesEditDialogProps) => {
    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const currencyInfo = getCurrencyInfo();

    const form = useForm<FeesInput>({
        resolver: zodResolver(editFeesSchema),
        defaultValues: {
            cleaningFee: property.cleaningFee,
            serviceFee: property.serviceFee,
            internetFee: property.internetFee,
            securityDeposit: property.securityDeposit,
        },
    });

    const onSubmit = async (data: FeesInput) => {
        try {
            setIsSubmitting(true);
            const result = await updatePropertyFees(property.id, data);
            if (result.success) {
                toast.success(result.message);
                setOpen(false);
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error('Failed to update fees and notes');
        } finally {
            setIsSubmitting(false);
        }
    };

    const fees = [
        { name: 'cleaningFee' as const, label: 'Cleaning Fee', description: 'One-time cleaning fee' },
        { name: 'serviceFee' as const, label: 'Service Fee', description: 'Service and maintenance fee' },
        { name: 'internetFee' as const, label: 'Internet Fee', description: 'Wi-Fi and internet access fee' },
        { name: 'securityDeposit' as const, label: 'Security Deposit', description: 'Refundable security deposit' },
    ];

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Edit className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Fees </DialogTitle>
                    <DialogDescription>
                        Update the fees for your property.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-foreground border-b pb-2">
                                Fees & Deposits ({currencyInfo.symbol})
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {fees.map((fee) => (
                                    <FormField
                                        key={fee.name}
                                        control={form.control}
                                        name={fee.name}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{fee.label}</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        min={0}
                                                        step="0.01"
                                                        placeholder="0.00"
                                                        {...field}
                                                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                                    />
                                                </FormControl>
                                                <p className="text-xs text-muted-foreground">
                                                    {fee.description}
                                                </p>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                ))}
                            </div>
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
                                    'Update'
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default FeesEditDialog;
