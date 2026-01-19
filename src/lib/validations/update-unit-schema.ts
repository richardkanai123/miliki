import { z } from "zod";
import { UnitStatusEnum, UnitTypeEnum } from "./create-unit-schema";

// Update Unit Schema - all fields optional except id
export const updateUnitSchema = z.object({
  // Required fields
  title: z.string().min(1, "Unit title is required").max(255),
  rentAmount: z
    .coerce.number({ message: "Rent amount must be a number" })
    .min(0, "Rent amount must be greater than 0")
    .refine((val) => val <= 999999999.99, "Rent amount is too large"),

  // Optional fields
  description: z.string().optional().nullable(),
  locationInProperty: z.string().optional().nullable(),
  depositAmount: z
    .coerce.number({ message: "Deposit amount must be a number" })
    .min(0, "Deposit amount must be 0 or greater")
    .refine((val) => val <= 999999999.99, "Deposit amount is too large")
    .optional()
    .nullable(),

  // Specifications
  bedrooms: z.coerce.number({ message: "Bedrooms must be a number" }).int().min(0).default(1),
  bathrooms: z.coerce.number({ message: "Bathrooms must be a number" }).int().min(0).default(1),
  squareMeters: z
    .coerce.number({ message: "Square meters must be a number" })
    .positive("Square meters must be greater than 0")
    .optional()
    .nullable(),

  // Media - array of image URLs
  images: z.array(z.string().url("Invalid image URL")).default([]),

  // Status
  status: UnitStatusEnum.default("VACANT"),

  // Type of unit
  type: UnitTypeEnum.default("APARTMENT"),

  // Listing fields
  isListed: z.boolean().default(false),
  listingTitle: z.string().optional().nullable(),
  listingDescription: z.string().optional().nullable(),
}).refine(
  (data) => {
    // If listed, title is required
    if (data.isListed && !data.listingTitle?.trim()) {
      return false;
    }
    return true;
  },
  {
    message: "Listing title is required when unit is listed",
    path: ["listingTitle"],
  }
);

// RHF works best with the schema *input* type
export type UpdateUnitFormValues = z.input<typeof updateUnitSchema>;

// Parsed/validated values
export type UpdateUnitInput = z.output<typeof updateUnitSchema>;
