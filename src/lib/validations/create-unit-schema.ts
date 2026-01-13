import { z } from "zod";

// UnitStatus enum matching Prisma
export const UnitStatusEnum = z.enum([
  "VACANT",
  "OCCUPIED",
  "MAINTENANCE",
  "RESERVED",
]);

export const UnitTypeEnum = z.enum([

  "APARTMENT",
  "HOUSE",
  "TOWNHOUSE",
  "STUDIO",
  "COMMERCIAL",
  "BEDSITTER",
  "SINGLE_ROOM",
  "DOUBLE_ROOM",
  "TRIPLE_ROOM",
  "QUADRUPLE_ROOM",
  "QUINQUEPLE_ROOM",
  "SEXTPLE_ROOM",
  "SEPTEMBLE_ROOM",
  "OCTOPLE_ROOM",
  "NONUPLE_ROOM",
  "DECATLE_ROOM",
  "UNDETLE_ROOM",
  "VIGINTILE_ROOM",
  "OTHER",
])

export type UnitStatus = z.infer<typeof UnitStatusEnum>;

// Create Unit Schema
export const createUnitSchema = z.object({
  // Required fields
  title: z.string().min(1, "Unit title is required").max(255),
  rentAmount: z
    .coerce.number("Rent amount must be a number")
    .min(0, "Rent amount must be greater than 0")
    .refine((val) => val <= 999999999.99, "Rent amount is too large"), // Max 12 digits, 2 decimals

  // Optional fields
  description: z.string().optional(),
  locationInProperty: z.string().optional(),
  depositAmount: z
    .coerce.number("Deposit amount must be a number")
    .positive("Deposit amount must be greater than 0")
    .refine((val) => val <= 999999999.99, "Deposit amount is too large")
    .optional(),
  // Specifications
  bedrooms: z.coerce.number("Bedrooms must be a number").int().min(0).default(1),
  bathrooms: z.coerce.number("Bathrooms must be a number").int().min(0).default(1),
  squareMeters: z
    .coerce.number("Square meters must be a number")
    .positive("Square meters must be greater than 0")
    .optional(),
  // Media - array of image URLs
  images: z.array(z.url("Invalid image URL")).default([]),

  // Status
  status: UnitStatusEnum.default("VACANT"),

  // type of unit
  type: UnitTypeEnum.default("APARTMENT"),

  // Listing fields - conditional validation
  isListed: z.boolean().default(false),
  listingTitle: z.string().optional(),
  listingDescription: z.string().optional(),
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

// RHF works best with the schema *input* type (defaults may be undefined at the type level).
export type CreateUnitFormValues = z.input<typeof createUnitSchema>;

// Parsed/validated values (defaults applied).
export type CreateUnitInput = z.output<typeof createUnitSchema>;
