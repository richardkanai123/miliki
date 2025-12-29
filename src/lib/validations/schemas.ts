import { z } from "zod"


export const mobileNumberSchema = z.string().regex(/^(?:\+254|254|0)(7|1)\d{8}$/, {message: "Invalid Kenyan phone number"}).optional()