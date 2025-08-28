import { z } from "zod";
import { PropertySizesEnum, PropertyStatusEnum } from "./NewPropertySchema";

// Re-export the enums for use in the dialogs
export { PropertySizesEnum, PropertyStatusEnum };

// Reusable edit schemas derived from the main property schema
// These are simpler versions for editing specific sections

export const editBasicInfoSchema = z.object({
    title: z
        .string()
        .min(3, "Title must be at least 3 characters")
        .max(100, "Title must not exceed 100 characters")
        .trim(),
    
    description: z
        .string()
        .min(10, "Description must be at least 10 characters")
        .max(1000, "Description must not exceed 1000 characters")
        .trim(),
    
    size: PropertySizesEnum,
    status: PropertyStatusEnum,
    
    bedrooms: z
        .number()
        .int("Bedrooms must be a whole number")
        .min(0, "Bedrooms cannot be negative")
        .max(20, "Bedrooms cannot exceed 20"),
    
    bathrooms: z
        .number()
        .int("Bathrooms must be a whole number")
        .min(1, "Must have at least 1 bathroom")
        .max(10, "Bathrooms cannot exceed 10"),
    
    location: z
        .string()
        .min(5, "Location must be at least 5 characters")
        .max(200, "Location must not exceed 200 characters")
        .trim(),
    
    coordinates: z
        .string()
        .regex(
            /^-?\d+\.?\d*,-?\d+\.?\d*$/,
            "Coordinates must be in format 'latitude,longitude'"
        )
        .optional()
        .or(z.literal("")),
});

export const editAmenitiesSchema = z.object({
    parking: z.boolean(),
    garden: z.boolean(),
    balcony: z.boolean(),
    pool: z.boolean(),
    gym: z.boolean(),
    AC: z.boolean(),
    heating: z.boolean(),
    furnished: z.boolean(),
    internet: z.boolean(),
    cableTV: z.boolean(),
    laundry: z.boolean(),
    storage: z.boolean(),
    fireplace: z.boolean(),
    securitySystem: z.boolean(),
    wheelchairAccessible: z.boolean(),
});

export const editPoliciesSchema = z.object({
    petsAllowed: z.boolean(),
    smokingAllowed: z.boolean(),
});

export const editFeesSchema = z.object({
    cleaningFee: z.number().min(0, "Cleaning fee must be 0 or greater"),
    serviceFee: z.number().min(0, "Service fee must be 0 or greater"),
    internetFee: z.number().min(0, "Internet fee must be 0 or greater"),
    securityDeposit: z.number().min(0, "Security deposit must be 0 or greater"),
});

// Type exports
export type EditBasicInfoInput = z.infer<typeof editBasicInfoSchema>;
export type EditAmenitiesInput = z.infer<typeof editAmenitiesSchema>;
export type EditPoliciesInput = z.infer<typeof editPoliciesSchema>;
export type EditFeesInput = z.infer<typeof editFeesSchema>;
