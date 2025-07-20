"use server";
import  {unstable_cache} from "next/cache";
import { checkAuth } from "@/lib/checkAuth";
import { prisma } from "@/lib/prisma";
export const getProperties = unstable_cache(async (userid: string) => {
    try {
        const session = await checkAuth();
        if (!session) {
            return {
                success: false,
                message: "You must be logged in to view your properties.",
            };
        }

        const loggedInUserId = session.user.id;

        if (loggedInUserId !== userid) {
            return {
                success: false,
                message: "You do not have permission to view these properties.",
            };
        }
        const properties = await prisma.property.findMany({
            where: {
                ownerid: loggedInUserId,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        if (!properties || properties.length === 0) {
            return {
                success: true,
                message: "No properties found for this user.",
                properties: [],
            };
        }

        return {
            success: true,
            message: "Properties retrieved successfully.",
            properties,
        };
    } catch (error) {
        const errorMessage =
            error instanceof Error ? error.message : "An unexpected error occurred.";
        return { success: false, message: errorMessage, properties: [] };
    }
},  ["properties"], {
    tags: ["properties"],
} );
