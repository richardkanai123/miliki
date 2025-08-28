"use server"
import { checkAuth } from "@/lib/checkAuth";
import { prisma } from "@/lib/prisma";
import { revalidateTag } from "next/cache";

export const DeleteProperty = async (propertyId: string) => {
    try {
        if (!propertyId) {
            return {
                success: false,
                message: "Property ID is required"
            }
        }
        
        const session = await checkAuth();
        if (!session) {
            return {
                success: false,
                message: "Unauthorized"
            }
        }
        const userId = session.session.userId;

        const property = await prisma.property.findUnique({
            where:{id: propertyId}
        })

        if (!property) {
            return {
                success: false,
                message: "Property not found"
            }
        }
        
        if (property.ownerid !== userId) {
            return {
                success: false,
                message: "You are not the owner of this property"
            }
        }

        await prisma.property.delete({
            where: {
                id: propertyId
            }
        })

        revalidateTag(`property-by-id`);
        revalidateTag("property");
        revalidateTag("properties");

        return {
            success: true,
            message: "Property deleted successfully"
        }
        
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        return {
            success: false,
            message: errorMessage
        }
    }
}
