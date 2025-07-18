import { z } from "zod";
export const PropertySizesEnum = z.enum([
	"BEDSITTER",
	"ONE_BEDROOM",
	"TWO_BEDROOM",
	"THREE_BEDROOM",
	"FOUR_BEDROOM",
	"FIVE_BEDROOM",
	"STUDIO",
	"PENTHOUSE",
	"DUPLEX",
	"VILLA",
	"APARTMENT",
	"BUNGALOW",
	"TOWNHOUSE",
	"MANSION",
	"CASTLE",
	"CONDOMINIUM",
	"LOFT",
	"COTTAGE",
	"FARMHOUSE",
	"CABIN",
	"MOBILE_HOME",
	"RV",
	"TINY_HOME",
	"HOUSEBOAT",
	"YURT",
	"TENT",
	"TREEHOUSE",
	"IGLOO",
	"SHED",
	"GARAGE",
	"WAREHOUSE",
	"BARN",
]);

export const PropertyStatusEnum = z.enum([
	"AVAILABLE",
	"BOOKED",
	"MAINTENANCE",
	"UNAVAILABLE",
]);

// Main Property creation schema
export const createPropertySchema = z
	.object({
		// Basic Information
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
        status: PropertyStatusEnum.default("AVAILABLE"),
        
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

		// Location
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


		// Amenities (Boolean fields)
		parking: z.boolean().default(false),
		garden: z.boolean().default(false),
		balcony: z.boolean().default(false),
		pool: z.boolean().default(false),
		gym: z.boolean().default(false),
		AC: z.boolean().default(false),
		heating: z.boolean().default(false),
		furnished: z.boolean().default(false),
		petsAllowed: z.boolean().default(false),
		smokingAllowed: z.boolean().default(false),
		wheelchairAccessible: z.boolean().default(false),
		securitySystem: z.boolean().default(false),
		internet: z.boolean().default(false),
		cableTV: z.boolean().default(false),
		laundry: z.boolean().default(false),
		storage: z.boolean().default(false),
		fireplace: z.boolean().default(false),

		// Additional Notes & Fees
		notes: z
			.string()
			.min(10, "Notes must be at least 10 characters")
			.max(500, "Notes must not exceed 500 characters")
			.trim()
            .or(z.literal("")),
        
		cleaningFee: z
            .number().int("Cleaning fee must be a whole number").default(0),
		serviceFee: z.number().int("Service fee must be a whole number").default(0),

		internetFee: z
			.number().int("Internet fee must be a whole number").default(0),

		securityDeposit: z
			.number().int("Security deposit must be a whole number").optional()
	})
	.refine(
		(data) => {
			// Custom validation: If internet is true, internetFee should be >= 0
			if (data.internet && data.internetFee < 0) {
				return false;
			}
			return true;
		},
		{
			message: "Internet fee must be specified if internet is provided",
			path: ["internetFee"],
		}
	)
	.refine(
		(data) => {
			if (
				data.size === "STUDIO" ||
				(data.size === "BEDSITTER" && data.bedrooms > 1)
			) {
				return false;
			}
			return true;
		},
		{
			message: "Studio apartments cannot have more than 1 bedroom",
			path: ["bedrooms"],
		}
	);

// Type inference
export type CreatePropertyInput = z.infer<typeof createPropertySchema>;

// Optional: Schema for property search/filtering
export const propertyFilterSchema = z.object({
	size: PropertySizesEnum.optional(),
	status: PropertyStatusEnum.optional(),
	minBedrooms: z.number().int().min(0).optional(),
	maxBedrooms: z.number().int().min(0).optional(),
	minBathrooms: z.number().int().min(0).optional(),
	maxBathrooms: z.number().int().min(0).optional(),
	location: z.string().optional(),
	parking: z.boolean().optional(),
	furnished: z.boolean().optional(),
	petsAllowed: z.boolean().optional(),
	minPrice: z.number().min(0).optional(),
	maxPrice: z.number().min(0).optional(),
});

export type PropertyFilterInput = z.infer<typeof propertyFilterSchema>;
