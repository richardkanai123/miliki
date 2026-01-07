import { z } from "zod";
import { kenyaCounties } from "../counties";

// PropertyType enum matching Prisma
export const PropertyTypeEnum = z.enum([
  "APARTMENT",
  "HOUSE",
  "TOWNHOUSE",
  "STUDIO",
  "COMMERCIAL",
  "BEDSITTER",
  "SINGLE_ROOM",
  "OTHER",
]);

export type PropertyType = z.infer<typeof PropertyTypeEnum>;

// Create Property Schema
export const createPropertySchema = z.object({
  // Required fields
  name: z.string().min(1, "Property name is required").max(255),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  county: z.enum(kenyaCounties as [string, ...string[]]), // Kenyan counties
  description: z.string().optional(),
  type: PropertyTypeEnum.default("APARTMENT"),
  postalCode: z.string().optional(),
  // Media - array of image URLs
  images: z.array(z.url("Invalid image URL")).default([]),

  // Management
  managerId: z.string().optional(),

  // Status
  isActive: z.boolean().default(true),
});

// RHF works best with the schema *input* type (defaults may be undefined at the type level).
export type CreatePropertyFormValues = z.input<typeof createPropertySchema>;

// Parsed/validated values (defaults applied).
export type CreatePropertyInput = z.output<typeof createPropertySchema>;