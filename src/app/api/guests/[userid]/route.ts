import { NextRequest, NextResponse } from "next/server";
import { Guest } from "@/generated/prisma";
import { checkAuth } from "@/lib/checkAuth";
import { prisma } from "@/lib/prisma";
import { revalidateTag } from "next/cache";

interface GetGuestsResponse {
	success: boolean;
	message: string;
	guests?: Guest[];
}
interface DeleteGuestResponse {
	success: boolean;
	message: string;
}
export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ userid: string }> }
): Promise<NextResponse<GetGuestsResponse>> {
	try {
		const session = await checkAuth();
		if (!session) {
			return NextResponse.json(
				{
					success: false,
					message: "You must be logged in to view guests.",
				},
				{ status: 401 }
			);
		}

		const { userid } = await params;

		// check if logged in user is the same as the user whose guests are being fetched
		if (session.user.id !== userid) {
			return NextResponse.json(
				{
					success: false,
					message: "You are not authorized to view these guests.",
				},
				{ status: 403 }
			);
		}

		const guests = await prisma.guest.findMany({
			where: {
				creatorId: userid,
			},
			orderBy: {
				createdAt: "desc",
			},
		});

		if (!guests || guests.length === 0) {
			return NextResponse.json(
				{
					success: false,
					message: "No guests found.",
				},
				{ status: 404 }
			);
		}

		return NextResponse.json(
			{
				success: true,
				message: "Guests fetched successfully.",
				guests,
			},
			{ status: 200 }
		);
	} catch (error) {
		const message =
			error instanceof Error
				? error.message
				: "An unexpected error occurred while fetching guests. Please try again later.";

		return NextResponse.json(
			{
				success: false,
				message,
			},
			{ status: 500 }
		);
	}
}

export async function DELETE(
	request: NextRequest,
	{ params }: { params: { guestid: string } }
): Promise<NextResponse<DeleteGuestResponse>> {
	try {
		// 1. Input validation
		const { guestid } = params;
		if (
			!guestid ||
			typeof guestid !== "string" ||
			guestid.trim().length === 0
		) {
			return NextResponse.json(
				{
					success: false,
					message: "Invalid guest ID provided.",
				},
				{ status: 400 }
			);
		}

		const trimmedGuestId = guestid.trim();

		// 2. Authentication check
		const session = await checkAuth();
		if (!session || !session.user) {
			return NextResponse.json(
				{
					success: false,
					message: "You must be logged in to delete guests.",
				},
				{ status: 401 }
			);
		}

		const guest = await prisma.guest.findUnique({
			where: { id: trimmedGuestId },
			select: {
				id: true,
				name: true,
				creatorId: true,
				// Only fetch relevant booking statuses
				Booking: {
					select: {
						id: true,
						status: true,
					},
					where: {
						status: {
							in: ["PENDING", "CHECKED_IN", "CONFIRMED"],
						},
					},
				},
				// Only fetch pending payments
				Payment: {
					select: {
						id: true,
						status: true,
					},
					where: {
						status: "PENDING",
					},
				},
			},
		});

		if (!guest) {
			return NextResponse.json(
				{
					success: false,
					message: "Guest not found.",
				},
				{ status: 404 }
			);
		}

		// 4. Authorization check
		if (session.user.id !== guest.creatorId) {
			return NextResponse.json(
				{
					success: false,
					message: "You are not authorized to delete this guest.",
				},
				{ status: 403 }
			);
		}

		// 5. Check for blocking conditions
		const hasActiveBookings = guest.Booking.length > 0;
		const hasPendingPayments = guest.Payment.length > 0;

		if (hasActiveBookings || hasPendingPayments) {
			const issues = [];
			if (hasActiveBookings) {
				issues.push(`${guest.Booking.length} active/pending booking(s)`);
			}
			if (hasPendingPayments) {
				issues.push(`${guest.Payment.length} pending payment(s)`);
			}

			return NextResponse.json(
				{
					success: false,
					message: `Cannot delete guest "${guest.name}". They have ${issues.join(" and ")}. Please resolve these first.`,
				},
				{ status: 409 }
			);
		}

		const deletedGuest = await prisma.guest.delete({
			where: { id: trimmedGuestId },
			select: {
				id: true,
				name: true,
				creatorId: true,
			},
		});

		revalidateTag("guests");
		revalidateTag("user-guests");

		return NextResponse.json(
			{
				success: true,
				message: `Guest "${deletedGuest.name}" has been successfully deleted.`,
			},
			{ status: 200 }
		);
	} catch (error) {
		const message =
			error instanceof Error
				? error.message
				: "An unexpected error occurred while deleting a guest. Please try again later.";

		return NextResponse.json(
			{
				success: false,
				message,
			},
			{ status: 500 }
		);
	}
}
