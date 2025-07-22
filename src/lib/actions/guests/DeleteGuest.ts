"use server";

import { checkAuth } from "@/lib/checkAuth";
import { prisma } from "@/lib/prisma";
import { revalidateTag } from "next/cache";

interface DeleteGuestResponse {
	success: boolean;
	message: string;
}

export const DeleteGuest = async (
	guestid: string
): Promise<DeleteGuestResponse> => {
	try {
		// 1. Input validation
		if (
			!guestid ||
			typeof guestid !== "string" ||
			guestid.trim().length === 0
		) {
			return {
				success: false,
				message: "Invalid guest ID provided.",
			};
		}

		const trimmedGuestId = guestid.trim();

		// 2. Authentication check
		const session = await checkAuth();
		if (!session || !session.user) {
			return {
				success: false,
				message: "You must be logged in to delete guests.",
			};
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
			return {
				success: false,
				message: "Guest not found.",
			};
		}

		// 4. Authorization check with logging
		if (session.user.id !== guest.creatorId) {
			return {
				success: false,
				message: "You are not authorized to delete this guest.",
			};
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

			return {
				success: false,
				message: `Cannot delete guest "${guest.name}". They have ${issues.join(" and ")}. Please resolve these first.`,
			};
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

		return {
			success: true,
			message: `Guest "${deletedGuest.name}" has been successfully deleted.`,
		};
	} catch (error) {
		const message =
			error instanceof Error
				? error.message
				: "An unexpected error occurred while deleting a guest. Please try again later.";
		return {
			success: false,
			message,
		};
	}
};
