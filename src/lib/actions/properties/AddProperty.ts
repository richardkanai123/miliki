"use server";

import { checkAuth } from "@/lib/checkAuth";
import { prisma } from "@/lib/prisma";
import {
	CreatePropertyInput,
	createPropertySchema,
} from "@/lib/schemas/NewPropertySchema";
import { revalidateTag } from "next/cache";
import { ZodError } from "zod/v3";

export const AddProperty = async (property: CreatePropertyInput) => {
	try {
		const session = await checkAuth();

		if (!session || !session.user) {
			throw new Error("Unauthorized: User session not found");
		}

		// validate property input
		const parsedProperty = createPropertySchema.safeParse(property);
		if (!parsedProperty.success) {
			throw new Error("Invalid property data: " + parsedProperty.error.message);
		}

		const userid = session.user.id;
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

		const newProperty = await prisma.property.create({
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
				ownerid: userid,
			},
			select: {
				id: true,
				title: true,
			},
		});

		if (!newProperty) {
			throw new Error("Failed to create property");
		}

		revalidateTag("properties");
		revalidateTag(`user-properties-${userid}`);

		return {
			success: true,
			message: `Property '${newProperty.title}' created successfully!`,
		};
	} catch (error) {
		const errorMessage =
			error instanceof Error || error instanceof ZodError
				? error.message
				: "An unexpected error occurred while adding the property, please try again later.";

		return { success: false, message: errorMessage };
	}
};
