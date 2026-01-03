'use server'
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export const AddMember = async (organizationId: string, userId: string, role: "admin" | "user" | "owner" | "member" | "manager") => {
    try {
    const response = await auth.api.addMember({
    body: {
        userId,
        role,
        organizationId
    },
    headers: await headers(),
    });

    if (!response) {
    return { success: false, message: "Failed to add member" }
    }

    return { success: true, message: `Added successfully as ${role}`}
    } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to add member"
    return { success: false, message: errorMessage }
    }
}