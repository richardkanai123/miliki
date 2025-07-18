import React from 'react'
import { Input } from '@/components/ui/input'
import {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormDescription,
    FormMessage,
} from '@/components/ui/form'
import { UseFormReturn } from 'react-hook-form'
import { CreatePropertyInput } from '@/lib/schemas/NewPropertySchema'


const LocationStep = ({ form }: { form: UseFormReturn<Partial<CreatePropertyInput>> }) => (
    <div className="space-y-6">
        <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Property Location *</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., Westlands, Nairobi, Kenya" {...field} />
                    </FormControl>
                    <FormDescription>
                        Enter the full address or area where the property is located
                    </FormDescription>
                    <FormMessage />
                </FormItem>
            )}
        />

        <FormField
            control={form.control}
            name="coordinates"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Coordinates (Optional)</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., -1.2921, 36.8219" {...field} />
                    </FormControl>
                    <FormDescription>
                        GPS coordinates in latitude,longitude format for precise location
                    </FormDescription>
                    <FormMessage />
                </FormItem>
            )}
        />
    </div>
)

export default LocationStep