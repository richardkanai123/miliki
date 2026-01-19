import { z } from "zod";

// TenancyStatus enum matching Prisma
export const TenancyStatusEnum = z.enum([
  "PENDING",
  "ACTIVE",
  "EXPIRED",
  "CANCELLED",
  "RENEWED",
]);

export type TenancyStatus = z.infer<typeof TenancyStatusEnum>;

// Duration constants
const MIN_TENANCY_DAYS = 28; // ~1 month minimum
const MAX_TENANCY_DAYS = 730; // 2 years maximum

// Create Tenancy Schema
export const createTenancySchema = z.object({
  // Required fields
  unitId: z.string().min(1, "Unit ID is required"),
  tenantId: z.string().min(1, "Tenant ID is required"),
  startDate: z.coerce.date({
    message: "Invalid start date",  
  }),
  endDate: z.coerce.date({
    message: "Invalid end date",
  }),
  monthlyRent: z
    .coerce.number({ message: "Monthly rent must be a number" })
    .min(0, "Monthly rent must be greater than 0")
    .refine((val) => val <= 999999999.99, "Monthly rent is too large"),

  // Optional fields
  depositAmount: z
    .coerce.number({ message: "Deposit amount must be a number" })
    .min(0, "Deposit amount must be 0 or greater")
    .refine((val) => val <= 999999999.99, "Deposit amount is too large")
    .default(0),
  depositPaid: z.boolean().default(false),
  billingDay: z.coerce.number({ message: "Billing day must be a number" }).int().min(1).max(28).default(1),
  
  // Status
  status: TenancyStatusEnum.default("PENDING"),
})
.refine(
  (data) => {
    // End date must be after start date
    return data.endDate > data.startDate;
  },
  {
    message: "End date must be after start date",
    path: ["endDate"],
  }
)
.refine(
  (data) => {
    // Minimum tenancy duration: 1 month (28 days)
    const diffTime = data.endDate.getTime() - data.startDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= MIN_TENANCY_DAYS;
  },
  {
    message: "Tenancy must be at least 1 month (28 days)",
    path: ["endDate"],
  }
)
.refine(
  (data) => {
    // Maximum tenancy duration: 2 years (730 days)
    const diffTime = data.endDate.getTime() - data.startDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= MAX_TENANCY_DAYS;
  },
  {
    message: "Tenancy cannot exceed 2 years (730 days)",
    path: ["endDate"],
  }
);

// RHF works best with the schema *input* type
export type CreateTenancyFormValues = z.input<typeof createTenancySchema>;

// Parsed/validated values
export type CreateTenancyInput = z.output<typeof createTenancySchema>;
