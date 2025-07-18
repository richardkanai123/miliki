import React from "react";
import {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormDescription,
} from "@/components/ui/form";
import { IconWrapper } from "@/lib/Icons";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import { CreatePropertyInput } from "@/lib/schemas/NewPropertySchema";
import { amenitiesConfig, AmenityConfig, categoryLabels } from "@/lib/AmenetiesUtils";



// Fixed TypeScript props interface
export interface AmenitiesStepProps {
    form: UseFormReturn<Partial<CreatePropertyInput>>
}

const AmenitiesStep: React.FC<AmenitiesStepProps> = ({ form }) => {
    // Group amenities by category
    const groupedAmenities = amenitiesConfig.reduce(
        (acc, amenity) => {
            if (!acc[amenity.category]) {
                acc[amenity.category] = [];
            }
            acc[amenity.category].push(amenity);
            return acc;
        },
        {} as Record<string, AmenityConfig[]>
    );

    return (
        <div className="space-y-8">
            <div className="text-sm text-muted-foreground">
                Select all amenities and features that apply to your property
            </div>

            {Object.entries(groupedAmenities).map(([category, amenities]) => (
                <div
                    key={category}
                    className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground border-b pb-2">
                        {categoryLabels[category as keyof typeof categoryLabels]}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {amenities.map((amenity) => (
                            <FormField
                                key={amenity.name}
                                control={form.control}
                                name={amenity.name}
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 hover:bg-accent/50 transition-colors">
                                        <div className="space-y-0.5">
                                            <FormLabel className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                                                <IconWrapper
                                                    className="h-4 w-4 mr-2 mb-2"
                                                    variant="muted">
                                                    <amenity.icon />
                                                </IconWrapper>
                                                {amenity.label}
                                            </FormLabel>
                                            <FormDescription className="text-xs text-muted-foreground">
                                                {amenity.description}
                                            </FormDescription>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                className="checked:bg-primary "
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                aria-labelledby={`${amenity.name}-label`}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default React.memo(AmenitiesStep);
