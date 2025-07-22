import { Guest } from "@/generated/prisma";
import { checkAuth } from "@/lib/checkAuth";
import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";

interface GetGuestsResponse {
	success: boolean;
	message: string;
	guests?: Guest[];
}

const getCachedGuests = unstable_cache(
	async (userid: string) => {
		return await prisma.guest.findMany({
			where: { creatorId: userid },
			orderBy: { createdAt: "desc" },
		});
	},
	["user-guests"],
	{ tags: ["user-guests"] }
);

export const getUserGuests = async (
	userid: string
): Promise<GetGuestsResponse> => {
	try {
		
		const session = await checkAuth();
		if (!session) {
			return {
				success: false,
				message: "You must be logged in to view guests.",
			};
		}

		if (session.user.id !== userid) {
			return {
				success: false,
				message: "You are not authorized to view these guests.",
			};
		}

		const guests = await getCachedGuests(userid);

		if (!guests || guests.length === 0) {
			return {
				success: false,
				message: "No guests found.",
			};
		}
		return {
			success: true,
			message: "Guests fetched successfully.",
			guests,
		};
	} catch (error) {
		const message =
			error instanceof Error
				? error.message
				: "An unexpected error occurred while fetching guests. Please try again later.";
		return {
			success: false,
			message,
		};
	}
};
