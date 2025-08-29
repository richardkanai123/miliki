import { z } from "zod";
import { createGuestSchema } from "./NewGuestSchema";

// Update guest schema extends the create schema but makes fields optional for partial updates
export const updateGuestSchema = createGuestSchema.extend({
    id: z.string().min(1, "Guest ID is required"),
});

export type UpdateGuestSchemaType = z.infer<typeof updateGuestSchema>;
