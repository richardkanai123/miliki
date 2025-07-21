"use server";
import { checkAuth } from "@/lib/checkAuth";
import { prisma } from "@/lib/prisma";
import {
	createGuestSchema,
	CreateGuestSchemaType,
} from "@/lib/schemas/NewGuestSchema";
import { revalidateTag } from "next/cache";

interface AddGuestResponse {
	success: boolean;
    message: string;
    guest?: { name: string } | null; // Add optional guest property
}

export const addGuest = async (guest: CreateGuestSchemaType) => {
	try {
		const isValid = createGuestSchema.safeParse(guest);

		if (!isValid.success) {
			return { success: false, message: isValid.error.message };
		}

		const session = await checkAuth();
		if (!session) {
			return {
				success: false,
				message: "You must be logged in to add a guest.",
			};
		}

		const creatorId = session.user.id;

		const GuestData = {
			...isValid.data,
			name: isValid.data.name.trim(),
			phone: isValid.data.phone.replace(/\s+/g, ""), // Remove spaces
			email: isValid.data.email?.toLowerCase().trim() || null,
			idNumber: isValid.data.idNumber?.toUpperCase().trim() || null,
			address: isValid.data.address?.trim() || null,
			emergencyContact: isValid.data.emergencyContact?.trim() || null,
			notes: isValid.data.notes?.trim() || null,
			creatorId,
        };
        
        // check for duplicate guests
        const existingGuest = await prisma.guest.findFirst({
            where: {
                OR: [
                    { phone: GuestData.phone },
                    { email: GuestData.email },
                ],
            },
        });

		if (existingGuest) {
			return {
				success: false,
				message: "A guest with this phone number or email already exists.",
				guest: existingGuest,
			};
		}

		const newGuest = await prisma.guest.create({
			data: GuestData,
			select: {
				name: true,
			},
		});
		if (!newGuest) {
			return { success: false, message: "Failed to add guest." };
		}

        const message = `Guest ${newGuest.name} added successfully.`;
        
        revalidateTag("guests");

		return { success: true, message, guest: newGuest };
	} catch (error) {
		// Handle specific database errors
		if (error instanceof Error) {
			if (error.message.includes("Unique constraint")) {
				return {
					success: false,
					message: "A guest with this phone number or email already exists.",
					guest: null,
				};
			}

			if (error.message.includes("Foreign key constraint")) {
				return {
					success: false,
					message: "Invalid user session. Please log in again.",
					guest: null,
				};
			}
		}

		return {
			success: false,
			message: "Failed to create guest. Please try again.",
			guest: null,
		};
	}
};
