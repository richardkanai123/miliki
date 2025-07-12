import { z } from "zod";
// const kenyanPhoneRegex = /^(?:\+254|254|0)(7\d{8}|1\d{8})$/;
export const signUpSchema = z
	.object({
		name: z.string().min(4, "Name is required"),
		email: z.email("Invalid email address"),
		// Ensure phone number is a valid Kenyan phone number
		// phone: z
		// 	.string()
		// 	.regex(kenyanPhoneRegex, "Invalid Kenyan phone number")
		// 	.transform((phone) => {
		// 		if (phone.startsWith("0")) return `+254${phone.slice(1)}`;
		// 		if (phone.startsWith("254")) return `+${phone}`;
		// 		return phone; // Already starts with +254
		// 	}),
		username: z.string().min(3, "Username must be at least 3 characters long").max(15, "Username must be at most 15 characters long").regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
		
		password: z
			.string()
			.min(8, "Password must be at least 8 characters")
			.regex(/[a-z]/, "Password must contain at least one lowercase letter")
			.regex(/[A-Z]/, "Password must contain at least one uppercase letter")
			.regex(/[0-9]/, "Password must contain at least one number")
			.regex(
				/[^a-zA-Z0-9]/,
				"Password must contain at least one special character"
			),
		confirmPassword: z
			.string()
			.min(8, "Password must be at least 8 characters long")
			.regex(/[a-z]/, "Password must contain at least one lowercase letter")
			.regex(/[A-Z]/, "Password must contain at least one uppercase letter"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	});
