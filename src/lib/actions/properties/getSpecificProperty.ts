"use server";

import { prisma } from "@/lib/prisma";
import { Property } from "@/generated/prisma";
import { checkAuth } from "@/lib/checkAuth";
import { unstable_cache } from "next/cache";

interface GetPropertyProps {
	success: boolean;
	property: Property | null;
	message: string;
}

const getCachedProperty = unstable_cache(
	async (id: string) => {
		return await prisma.property.findUnique({
			where: { id },
			// Only select necessary fields for better performance
			select: {
				id: true,
				title: true,
				description: true,
				location: true,
				size: true,
				status: true,
				bedrooms: true,
				bathrooms: true,
				AC: true,
				balcony: true,
				cableTV: true,
				cleaningFee: true,
				fireplace: true,
				furnished: true,
				garden: true,
				gym: true,
				heating: true,
				internet: true,
				internetFee: true,
				laundry: true,
				notes: true,
				parking: true,
				petsAllowed: true,
				pool: true,
				securitySystem: true,
				serviceFee: true,
				smokingAllowed: true,
				storage: true,
				wheelchairAccessible: true,
				coordinates: true,
				securityDeposit: true,
				createdAt: true,
				updatedAt: true,
				ownerid: true,
			},
		});
	},
	["property-by-id"],
	{
		tags: ["property"],
		revalidate: 300, // 5 minutes cache
	}
);

export const GetPropertyById = async (
	id: string
): Promise<GetPropertyProps> => {
	try {
		// 1. Authentication check
		const session = await checkAuth();
		if (!session || !session.user) {
			return {
				success: false,
				message: "Unauthorized: User session not found",
				property: null,
			};
		}

		// 2. Enhanced input validation
		if (!id || typeof id !== "string") {
			return {
				success: false,
				message: "Invalid property ID: ID must be provided as a string",
				property: null,
			};
		}

		const userId = session.user.id;

		// 3. Database query with caching
		const property = await getCachedProperty(id);

		// 4. Property existence check
		if (!property) {
			return {
				success: false,
				message: "Property not found",
				property: null,
			};
		}

		// 5. Authorization check
		if (property.ownerid !== userId) {
			// Log unauthorized access attempts
			console.warn("Unauthorized property access attempt:", {
				propertyId: id,
				requestedBy: userId,
				propertyOwner: property.ownerid,
				timestamp: new Date().toISOString(),
			});

			return {
				success: false,
				message:
					"Unauthorized: You do not have permission to access this property",
				property: null,
			};
		}

		// 6. Success response
		return {
			success: true,
			property: property as Property, // Type assertion after validation
			message: "Property retrieved successfully",
		};
	} catch (error) {
		// Consistent error response
		const errorMessage =
			error instanceof Error
				? error.message
				: "An unexpected error occurred while retrieving the property";

		return {
			success: false,
			message: errorMessage,
			property: null,
		};
	}
};
