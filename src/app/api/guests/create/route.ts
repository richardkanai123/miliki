import { NextRequest, NextResponse } from "next/server";
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
	guest?: { name: string } | null;
}

const corsHeaders = {
	"Access-Control-Allow-Origin":
		process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
	"Access-Control-Allow-Methods": "POST, OPTIONS",
	"Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
	return new NextResponse(null, {
		status: 200,
		headers: corsHeaders,
	});
}

export async function POST(
	request: NextRequest
): Promise<NextResponse<AddGuestResponse>> {
	try {
		// 1. Parse request body
		let guest: CreateGuestSchemaType;
		try {
			guest = await request.json();
		} catch (parseError) {
			return NextResponse.json(
				{
					success: false,
					message: "Invalid JSON format in request body.",
					guest: null,
				},
				{
					status: 400,
					headers: corsHeaders,
				}
			);
		}

		// 2. Input validation
		const isValid = createGuestSchema.safeParse(guest);
		if (!isValid.success) {
			return NextResponse.json(
				{
					success: false,
					message: isValid.error.message,
					guest: null,
				},
				{
					status: 400,
					headers: corsHeaders,
				}
			);
		}

		// 3. Authentication check
		const session = await checkAuth();
		if (!session || !session.user) {
			return NextResponse.json(
				{
					success: false,
					message: "You must be logged in to add a guest.",
					guest: null,
				},
				{
					status: 401,
					headers: corsHeaders,
				}
			);
		}

		const creatorId = session.user.id;

		// 4. Data sanitization
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

		// 5. Check for duplicate guests
		const existingGuest = await prisma.guest.findFirst({
			where: {
				OR: [{ phone: GuestData.phone }, { email: GuestData.email }],
			},
			select: {
				id: true,
				name: true,
				phone: true,
				email: true,
			},
		});

		if (existingGuest) {
			return NextResponse.json(
				{
					success: false,
					message: "A guest with this phone number or email already exists.",
					guest: existingGuest,
				},
				{
					status: 409, // Conflict
					headers: corsHeaders,
				}
			);
		}

		// 6. Create new guest
		const newGuest = await prisma.guest.create({
			data: GuestData,
			select: {
				name: true,
			},
		});

		if (!newGuest) {
			return NextResponse.json(
				{
					success: false,
					message: "Failed to add guest.",
					guest: null,
				},
				{
					status: 500,
					headers: corsHeaders,
				}
			);
		}

		// 7. Revalidate cache
		revalidateTag("guests");

		const message = `Guest ${newGuest.name} added successfully.`;

		// 8. Success response
		return NextResponse.json(
			{
				success: true,
				message,
				guest: newGuest,
			},
			{
				status: 201, // Created
				headers: corsHeaders,
			}
		);
	} catch (error) {
		// Enhanced error logging
		console.error("Guest API Error:", {
			error: error instanceof Error ? error.message : "Unknown error",
			stack: error instanceof Error ? error.stack : undefined,
			timestamp: new Date().toISOString(),
			userAgent: request.headers.get("user-agent"),
			ip:
				request.headers.get("x-forwarded-for") ||
				request.headers.get("x-real-ip"),
		});

		// Handle specific database errors
		if (error instanceof Error) {
			if (error.message.includes("Unique constraint")) {
				return NextResponse.json(
					{
						success: false,
						message: "A guest with this phone number or email already exists.",
						guest: null,
					},
					{
						status: 409,
						headers: corsHeaders,
					}
				);
			}

			if (error.message.includes("Foreign key constraint")) {
				return NextResponse.json(
					{
						success: false,
						message: "Invalid user session. Please log in again.",
						guest: null,
					},
					{
						status: 401,
						headers: corsHeaders,
					}
				);
			}
		}

		return NextResponse.json(
			{
				success: false,
				message: "Failed to create guest. Please try again.",
				guest: null,
			},
			{
				status: 500,
				headers: corsHeaders,
			}
		);
	}
}
