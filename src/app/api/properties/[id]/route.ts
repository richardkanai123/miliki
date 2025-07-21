import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Property } from "@/generated/prisma";
import { checkAuth } from "@/lib/checkAuth";
import { unstable_cache } from "next/cache";

interface GetPropertyResponse {
	success: boolean;
	property: Property | null;
	message: string;
}

const corsHeaders = {
	"Access-Control-Allow-Origin":
		process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
	"Access-Control-Allow-Methods": "GET, OPTIONS",
	"Access-Control-Allow-Headers": "Content-Type, Authorization",
};

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

export async function OPTIONS() {
	return new NextResponse(null, {
		status: 200,
		headers: corsHeaders,
	});
}

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<GetPropertyResponse>> {
	try {
		// Await params to ensure we have the id
		const { id } = await params;

		const session = await checkAuth();
		if (!session || !session.user) {
			return NextResponse.json(
				{
					success: false,
					message: "Unauthorized: User session not found",
					property: null,
				},
				{
					status: 401,
					headers: corsHeaders,
				}
			);
		}

		if (!id || typeof id !== "string") {
			return NextResponse.json(
				{
					success: false,
					message: "Invalid property ID: ID must be provided as a string",
					property: null,
				},
				{
					status: 400,
					headers: corsHeaders,
				}
			);
		}

		const userId = session.user.id;

		const property = await getCachedProperty(id);

		if (!property) {
			return NextResponse.json(
				{
					success: false,
					message: "Property not found",
					property: null,
				},
				{
					status: 404,
					headers: corsHeaders,
				}
			);
		}

		if (property.ownerid !== userId) {
			// Log unauthorized access attempts
			console.warn("Unauthorized property access attempt:", {
				propertyId: id,
				requestedBy: userId,
				propertyOwner: property.ownerid,
				timestamp: new Date().toISOString(),
			});

			return NextResponse.json(
				{
					success: false,
					message:
						"Unauthorized: You do not have permission to access this property",
					property: null,
				},
				{
					status: 403,
					headers: corsHeaders,
				}
			);
		}

		return NextResponse.json(
			{
				success: true,
				property: property as Property, // Type assertion after validation
				message: "Property retrieved successfully",
			},
			{
				status: 200,
				headers: corsHeaders,
			}
		);
	} catch (error) {
		const errorMessage =
			error instanceof Error
				? error.message
				: "An unexpected error occurred while retrieving the property";

		return NextResponse.json(
			{
				success: false,
				message: errorMessage,
				property: null,
			},
			{
				status: 500,
				headers: corsHeaders,
			}
		);
	}
}
