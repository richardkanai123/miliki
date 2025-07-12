import { z } from "zod";

export const signInSchema = z
    .object({
       emailOrUsername: z
        .string()
        .min(1, "Email or username is required")
        .refine((value) => {
            // If it contains @, validate as email
            if (value.includes('@')) {
                return z.string().email().safeParse(value).success;
            }
            // If no @, validate as username (3-15 chars, alphanumeric + underscore)
            return /^[a-zA-Z0-9_]{3,15}$/.test(value);
        }, {
            message: "Please enter a valid email address or username (3-15 characters, letters, numbers, and underscores only)"
        }),
        password: z.string().min(8, "Password must be at least 8 characters long")
    });

