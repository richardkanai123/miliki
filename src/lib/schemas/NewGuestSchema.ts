import { z } from "zod";

// Phone number validation regex for kenyan phone numbers
// Allows formats like +254712345678, 0712345678, 0721234567, 012345678, etc.
const PhoneRegex = /^(?:\+254|254|0)(7\d{8}|1\d{8})$/;

// Email validation (more permissive than default zod email)
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ID number validation (allow numbers only, 6 to 20 characters)
const idNumberRegex = /^\d{6,20}$/;

// Base Guest validation schema
export const createGuestSchema = z
	.object({
		// Required fields
		name: z
			.string()
			.min(2, "Name must be at least 2 characters long")
			.max(100, "Name must not exceed 100 characters")
			.regex(
				/^[a-zA-Z\s'-\.]+$/,
				"Name can only contain letters, spaces, hyphens, apostrophes, and periods"
			)
			.transform((val) => val.trim()),

		phone: z
			.string()
			.min(10, "Phone number must be at least 10 digits")
			.max(15, "Phone number must not exceed 15 digits")
			.regex(
				PhoneRegex,
				"Please provide a valid phone number (e.g., +1234567890 or 1234567890)"
			)
			.transform((val) => val.replace(/\s+/g, "")), // Remove spaces

		// Optional fields
		email: z
			.string()
			.email("Please provide a valid email address")
			.max(255, "Email must not exceed 255 characters")
			.transform((val) => val.toLowerCase().trim())
			.optional()
			.or(z.literal("")), // Allow empty string

		idNumber: z
			.string()
			.min(6, "ID number must be at least 6 characters")
			.max(20, "ID number must not exceed 20 characters")
			.regex(idNumberRegex, "ID number can only contain numbers")
			.transform((val) => val.toUpperCase().trim())
			.optional()
			.or(z.literal("")), // Allow empty string

		address: z
			.string()
			.min(5, "Address must be at least 5 characters long")
			.max(500, "Address must not exceed 500 characters")
			.transform((val) => val.trim())
			.optional()
			.or(z.literal("")), // Allow empty string

		emergencyContact: z
			.string()
			.min(5, "Emergency contact must be at least 5 characters")
			.max(200, "Emergency contact must not exceed 200 characters")
			.transform((val) => val.trim())
			.optional()
			.or(z.literal("")), // Allow empty string

		notes: z
			.string()
			.max(1000, "Notes must not exceed 1000 characters")
			.transform((val) => val.trim())
			.optional()
			.or(z.literal("")), // Allow empty string

		// System fields (typically handled by the system)
		isActive: z.boolean().default(true).optional(),
	})
	.refine(
		(data) => {
			// Ensure at least one contact method is provided
			return data.phone || data.email;
		},
		{
			message: "Either phone number or email address must be provided",
			path: ["phone"], // Show error on phone field
		}
	)
	.refine(
		(data) => {
			// If email is provided, ensure it's valid
			if (data.email && data.email.length > 0) {
				return emailRegex.test(data.email);
			}
			return true;
		},
		{
			message: "Please provide a valid email address",
			path: ["email"],
		}
	);

export type CreateGuestSchemaType = z.infer<typeof createGuestSchema>;
