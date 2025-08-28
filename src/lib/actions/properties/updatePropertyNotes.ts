'use server'

import { checkAuth } from "@/lib/checkAuth";
import { prisma } from "@/lib/prisma";
import { revalidateTag } from "next/cache";
import { z } from "zod";

// Schema for notes validation
const notesSchema = z.object({
    notes: z.string().max(500, "Notes must not exceed 500 characters").optional(),
});

export const updatePropertyNotes = async (propertyId: string, notes: string) => {
    try {
        const session = await checkAuth();
        if (!session || !session.user) {
            throw new Error("Unauthorized: User session not found");
        }

        // Validate input data
        const parsedData = notesSchema.safeParse({ notes });
        if (!parsedData.success) {
            // ZodError has .issues, not .errors
            throw new Error("Invalid data: " + (parsedData.error.issues[0]?.message ?? "Unknown validation error"));
        }

        const userId = session.user.id;

        // Check if the property exists and user owns it
        const property = await prisma.property.findUnique({
            where: { id: propertyId },
            select: { id: true, title: true, ownerid: true },
        });

        if (!property) {
            throw new Error("Property not found");
        }

        if (property.ownerid !== userId) {
            throw new Error("Unauthorized: You do not have permission to edit this property");
        }

        // Update the property notes
        const updatedProperty = await prisma.property.update({
            where: { id: propertyId },
            data: { notes: parsedData.data.notes },
            select: { id: true, title: true },
        });

        // Revalidate cache
        revalidateTag("properties");
        revalidateTag(`user-properties-${userId}`);
        revalidateTag(`property-by-id`);
        revalidateTag("property");

        return {
            success: true,
            message: `Notes for '${updatedProperty.title}' updated successfully!`,
        };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to update property notes";
        return {
            success: false,
            message: errorMessage,
        };
    }
};