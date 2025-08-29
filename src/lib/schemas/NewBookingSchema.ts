import { z } from "zod"

export const NewBookingSchema = z.object({
    guestId: z.string().min(1),
    propertyId: z.string().min(1),
    checkIn: z.date(),
    checkOut: z.date(),
    duration: z.number().min(1),
    guestsCount: z.number().min(1),
    bookingUnit: z.enum(["NIGHT", "WEEK", "MONTH"]),
    totalPrice: z.number().min(0),
    status: z.enum([
        "PENDING",
        "CONFIRMED",
        "CHECKED_IN",
        "CHECKED_OUT",
        "CANCELLED",
        "NO_SHOW"
    ]),
    notes: z.string().optional(),
}).refine((data) => data.checkIn < data.checkOut, {
    message: "Check-in date must be before check-out date",
    path: ["checkOut"]
})



export type NewBookingSchemaType = z.infer<typeof NewBookingSchema>