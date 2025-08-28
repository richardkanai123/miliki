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
import { Edit, Loader2 } from 'lucide-react'
import { Property } from '@/generated/prisma'
import { updatePropertyAmenities } from '@/lib/actions/properties/UpdatePropertySection'
import { toast } from 'sonner'
import { getAllAmenities } from '@/lib/AmenetiesUtils'
import { editAmenitiesSchema, EditAmenitiesInput } from '@/lib/schemas/EditPropertySchemas'

type AmenitiesInput = EditAmenitiesInput;

interface AmenitiesEditDialogProps {
    property: Property;
}

const AmenitiesEditDialog = ({ property }: AmenitiesEditDialogProps) => {
    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<AmenitiesInput>({
        resolver: zodResolver(editAmenitiesSchema),
        defaultValues: {
            parking: property.parking,
            garden: property.garden,
            balcony: property.balcony,
            pool: property.pool,
            gym: property.gym,
            AC: property.AC,
            heating: property.heating,
            furnished: property.furnished,
            internet: property.internet,
            cableTV: property.cableTV,
            laundry: property.laundry,
            storage: property.storage,
            fireplace: property.fireplace,
            securitySystem: property.securitySystem,
            wheelchairAccessible: property.wheelchairAccessible,
        },
    });

    const onSubmit = async (data: AmenitiesInput) => {
        try {
            setIsSubmitting(true);
            const result = await updatePropertyAmenities(property.id, data);
            if (result.success) {
                toast.success(result.message);
                setOpen(false);
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error('Failed to update amenities');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Get amenities with categories from the consolidated system
    const allAmenities = getAllAmenities();

    // Group amenities by category
    const amenitiesByCategory = allAmenities.reduce((acc, amenity) => {
        if (!acc[amenity.category]) {
            acc[amenity.category] = [];
        }
        acc[amenity.category].push(amenity);
        return acc;
    }, {} as Record<string, typeof allAmenities>);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Edit className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Amenities & Features</DialogTitle>
                    <DialogDescription>
                        Update the amenities and features available at your property.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {Object.entries(amenitiesByCategory).map(([category, categoryAmenities]) => (
                            <div key={category} className="space-y-4">
                                <h3 className="text-lg font-semibold text-foreground border-b pb-2 capitalize">
                                    {category.replace(/([A-Z])/g, ' $1').trim()}
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {categoryAmenities.map((amenity) => (
                                        <FormField
                                            key={amenity.name}
                                            control={form.control}
                                            name={amenity.name as keyof AmenitiesInput}
                                            render={({ field }) => (
                                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 hover:bg-accent/50 transition-colors">
                                                    <div className="space-y-0.5">
                                                        <FormLabel className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                                                            {React.createElement(amenity.icon as any, { className: "h-4 w-4 text-muted-foreground" })}
                                                            {amenity.label}
                                                        </FormLabel>
                                                        <p className="text-xs text-muted-foreground">
                                                            {amenity.description}
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
                            </div>
                        ))}

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
                                    'Update Amenities'
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default AmenitiesEditDialog;
