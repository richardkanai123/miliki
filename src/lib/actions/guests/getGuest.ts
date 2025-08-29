'use server'

import { checkAuth } from "@/lib/checkAuth"
import { prisma } from "@/lib/prisma"

export const GetGuestById = async (id: string) => {
    try {
        if (!id) return {
            success: false,
            message: "Guest ID is required",
            guest: null
        }

        const session = await checkAuth()

        if (!session) return {
            success: false,
            message: "Unauthorized",
            guest: null
        }

        const userid = session.user.id

        const guest = await prisma.guest.findUnique({
            where: {
                id,
                creatorId: userid
            }
        })

        if (!guest) return {
            success: false,
            message: "Guest not found",
            guest: null
        }

        return {
            success: true,
            message: "Guest found",
            guest
        }

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
        return {
            success: false,
            message: errorMessage,
            guest: null
        }
    }
}