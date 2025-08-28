"use server";

import { checkAuth } from "@/lib/checkAuth";
import { prisma } from "@/lib/prisma";
import { revalidateTag } from "next/cache";
import {
    editBasicInfoSchema,
    editAmenitiesSchema,
    editPoliciesSchema,
    editFeesSchema,
    EditBasicInfoInput,
    EditAmenitiesInput,
    EditPoliciesInput,
    EditFeesInput,
} from "@/lib/schemas/EditPropertySchemas";

export const updatePropertyBasicInfo = async (propertyId: string, data: EditBasicInfoInput) => {
    try {
        const session = await checkAuth();
        if (!session || !session.user) {
            throw new Error("Unauthorized: User session not found");
        }

        // Validate input
        const parsedData = editBasicInfoSchema.safeParse(data);
        if (!parsedData.success) {
            throw new Error("Invalid data: " + parsedData.error.message);
        }

        const userId = session.user.id;

        // Check ownership
        const property = await prisma.property.findUnique({
            where: { id: propertyId },
            select: { ownerid: true },
        });

        if (!property || property.ownerid !== userId) {
            throw new Error("Property not found or unauthorized");
        }

        // Update property
        await prisma.property.update({
            where: { id: propertyId },
            data: parsedData.data,
        });

        revalidateTag("properties");
        revalidateTag("property");

        return { success: true, message: "Basic information updated successfully" };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to update basic information";
        return { success: false, message: errorMessage };
    }
};

export const updatePropertyAmenities = async (propertyId: string, data: EditAmenitiesInput) => {
    try {
        const session = await checkAuth();
        if (!session || !session.user) {
            throw new Error("Unauthorized: User session not found");
        }

        // Validate input
        const parsedData = editAmenitiesSchema.safeParse(data);
        if (!parsedData.success) {
            throw new Error("Invalid data: " + parsedData.error.message);
        }

        const userId = session.user.id;

        // Check ownership
        const property = await prisma.property.findUnique({
            where: { id: propertyId },
            select: { ownerid: true },
        });

        if (!property || property.ownerid !== userId) {
            throw new Error("Property not found or unauthorized");
        }

        // Update property
        await prisma.property.update({
            where: { id: propertyId },
            data: parsedData.data,
        });

        revalidateTag("properties");
        revalidateTag("property");

        return { success: true, message: "Amenities updated successfully" };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to update amenities";
        return { success: false, message: errorMessage };
    }
};

export const updatePropertyPolicies = async (propertyId: string, data: EditPoliciesInput) => {
    try {
        const session = await checkAuth();
        if (!session || !session.user) {
            throw new Error("Unauthorized: User session not found");
        }

        // Validate input
        const parsedData = editPoliciesSchema.safeParse(data);
        if (!parsedData.success) {
            throw new Error("Invalid data: " + parsedData.error.message);
        }

        const userId = session.user.id;

        // Check ownership
        const property = await prisma.property.findUnique({
            where: { id: propertyId },
            select: { ownerid: true },
        });

        if (!property || property.ownerid !== userId) {
            throw new Error("Property not found or unauthorized");
        }

        // Update property
        await prisma.property.update({
            where: { id: propertyId },
            data: parsedData.data,
        });

        revalidateTag("properties");
        revalidateTag("property");

        return { success: true, message: "Policies updated successfully" };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to update policies";
        return { success: false, message: errorMessage };
    }
};

export const updatePropertyFees = async (propertyId: string, data: EditFeesInput) => {
    try {
        const session = await checkAuth();
        if (!session || !session.user) {
            throw new Error("Unauthorized: User session not found");
        }

        // Validate input
        const parsedData = editFeesSchema.safeParse(data);
        if (!parsedData.success) {
            throw new Error("Invalid data: " + parsedData.error.message);
        }

        const userId = session.user.id;

        // Check ownership
        const property = await prisma.property.findUnique({
            where: { id: propertyId },
            select: { ownerid: true },
        });

        if (!property || property.ownerid !== userId) {
            throw new Error("Property not found or unauthorized");
        }

        // Update property
        await prisma.property.update({
            where: { id: propertyId },
            data: parsedData.data,
        });

        revalidateTag("properties");
        revalidateTag("property");

        return { success: true, message: "Fees and notes updated successfully" };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to update fees";
        return { success: false, message: errorMessage };
    }
};
