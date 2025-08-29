"use server";

import { checkAuth } from "@/lib/checkAuth";
import { prisma } from "@/lib/prisma";
import { updateGuestSchema, UpdateGuestSchemaType } from "@/lib/schemas/UpdateGuestSchema";
import { revalidateTag } from "next/cache";

interface UpdateGuestResponse {
    success: boolean;
    message: string;
    guest?: { name: string } | null;
}

export const updateGuest = async (guestData: UpdateGuestSchemaType): Promise<UpdateGuestResponse> => {
    try {
        // 1. Validate input data
        const isValid = updateGuestSchema.safeParse(guestData);

        if (!isValid.success) {
            return { 
                success: false, 
                message: isValid.error.issues.map(issue => issue.message).join(", ")
            };
        }

        // 2. Authentication check
        const session = await checkAuth();
        if (!session) {
            return {
                success: false,
                message: "You must be logged in to update a guest.",
            };
        }

        const userId = session.user.id;
        const { id, ...updateData } = isValid.data;

        // 3. Check if guest exists and belongs to the user
        const existingGuest = await prisma.guest.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                phone: true,
                idNumber: true,
                creatorId: true,
            },
        });

        if (!existingGuest) {
            return {
                success: false,
                message: "Guest not found.",
            };
        }

        // 4. Authorization check
        if (existingGuest.creatorId !== userId) {
            return {
                success: false,
                message: "You are not authorized to update this guest.",
            };
        }

        // 5. Check for duplicate phone/ID (excluding current guest)
        if (updateData.phone || updateData.idNumber) {
            const duplicateGuest = await prisma.guest.findFirst({
                where: {
                    AND: [
                        { id: { not: id } }, // Exclude current guest
                        { creatorId: userId }, // Only check within user's guests
                        {
                            OR: [
                                ...(updateData.phone ? [{ phone: updateData.phone }] : []),
                                ...(updateData.idNumber ? [{ idNumber: updateData.idNumber }] : []),
                            ],
                        },
                    ],
                },
                select: {
                    name: true,
                    phone: true,
                    idNumber: true,
                },
            });

            if (duplicateGuest) {
                const duplicateField = 
                    duplicateGuest.phone === updateData.phone ? "phone number" : "ID number";
                return {
                    success: false,
                    message: `Another guest "${duplicateGuest.name}" already has this ${duplicateField}.`,
                };
            }
        }

        // 6. Prepare update data with proper formatting
        const processedUpdateData = {
            ...updateData,
            name: updateData.name?.trim(),
            phone: updateData.phone?.replace(/\s+/g, ""), // Remove spaces
            email: updateData.email?.toLowerCase().trim() || null,
            idNumber: updateData.idNumber?.toUpperCase().trim() || null,
            address: updateData.address?.trim() || null,
            emergencyContact: updateData.emergencyContact?.trim() || null,
            notes: updateData.notes?.trim() || null,
        };

        // 7. Update the guest
        const updatedGuest = await prisma.guest.update({
            where: { id },
            data: processedUpdateData,
            select: {
                name: true,
            },
        });

        // 8. Revalidate cache
        revalidateTag("user-guests");
        revalidateTag("guests");

        return {
            success: true,
            message: `Guest "${updatedGuest.name}" has been successfully updated.`,
            guest: updatedGuest,
        };

    } catch (error) {
        console.error("Error updating guest:", error);
        
        const message = error instanceof Error 
            ? error.message 
            : "An unexpected error occurred while updating the guest. Please try again later.";
            
        return {
            success: false,
            message,
        };
    }
};
