import { z } from "zod";
import { kenyaCounties } from "../counties";
import { PropertyTypeEnum } from "./create-property-schema";

// Update Property Schema - all fields optional except required ones
export const updatePropertySchema = z.object({
  // Required fields
  name: z.string().min(1, "Property name is required").max(255),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  county: z.enum(kenyaCounties as [string, ...string[]]), // Kenyan counties
  
  // Optional fields
  description: z.string().optional().nullable(),
  type: PropertyTypeEnum.default("APARTMENT"),
  postalCode: z.string().optional().nullable(),
  
  // Media - array of image URLs
  images: z.array(z.string().url("Invalid image URL")).default([]),

  // Management
  managerId: z.string().optional().nullable(),

  // Status
  isActive: z.boolean().default(true),
});

// RHF works best with the schema *input* type
export type UpdatePropertyFormValues = z.input<typeof updatePropertySchema>;

// Parsed/validated values
export type UpdatePropertyInput = z.output<typeof updatePropertySchema>;
