"use server";

import { checkAuth } from "@/lib/checkAuth";
import { prisma } from "@/lib/prisma";
import {
	CreatePropertyInput,
	createPropertySchema,
} from "@/lib/schemas/NewPropertySchema";
import { revalidateTag } from "next/cache";
import { ZodError } from "zod/v3";

export const UpdateProperty = async (propertyId: string, property: CreatePropertyInput) => {
	try {
		const session = await checkAuth();

		if (!session || !session.user) {
			throw new Error("Unauthorized: User session not found");
		}

		// Validate property ID
		if (!propertyId || typeof propertyId !== "string") {
			throw new Error("Invalid property ID");
		}

		// Validate property input
		const parsedProperty = createPropertySchema.safeParse(property);
		if (!parsedProperty.success) {
			throw new Error("Invalid property data: " + parsedProperty.error.message);
		}

		const userId = session.user.id;

		// Check if property exists and user owns it
		const existingProperty = await prisma.property.findUnique({
			where: { id: propertyId },
			select: { id: true, ownerid: true, title: true },
		});

		if (!existingProperty) {
			throw new Error("Property not found");
		}

		if (existingProperty.ownerid !== userId) {
			throw new Error("Unauthorized: You do not have permission to edit this property");
		}

		const {
			title,
			description,
			location,
			AC,
			balcony,
			bathrooms,
			bedrooms,
			cableTV,
			cleaningFee,
			fireplace,
			furnished,
			garden,
			gym,
			heating,
			internet,
			internetFee,
			laundry,
			notes,
			parking,
			petsAllowed,
			pool,
			securitySystem,
			serviceFee,
			size,
			smokingAllowed,
			status,
			storage,
			wheelchairAccessible,
			coordinates,
			securityDeposit,
		} = parsedProperty.data;

		// Update property
		const updatedProperty = await prisma.property.update({
			where: { id: propertyId },
			data: {
				title,
				description,
				location,
				AC,
				balcony,
				bathrooms,
				bedrooms,
				cableTV,
				cleaningFee,
				fireplace,
				furnished,
				garden,
				gym,
				heating,
				internet,
				internetFee,
				laundry,
				notes,
				parking,
				petsAllowed,
				pool,
				securitySystem,
				serviceFee,
				size,
				smokingAllowed,
				status: status || "AVAILABLE",
				storage,
				wheelchairAccessible,
				coordinates,
				securityDeposit: securityDeposit || 0,
			},
			select: {
				id: true,
				title: true,
			},
		});

		if (!updatedProperty) {
			throw new Error("Failed to update property");
		}

		revalidateTag("properties");
		revalidateTag(`user-properties-${userId}`);

		return {
			success: true,
			message: `Property '${updatedProperty.title}' updated successfully!`,
			property: updatedProperty,
		};
	} catch (error) {
		const errorMessage =
			error instanceof Error || error instanceof ZodError
				? error.message
				: "An unexpected error occurred while updating the property, please try again later.";

		return { success: false, message: errorMessage, property: null };
	}
};
