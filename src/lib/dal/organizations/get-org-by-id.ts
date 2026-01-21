'use server'
import { prisma } from "@/lib/prisma"


export const getOrganizationById = async (id: string) => {
    try{
    const org = await prisma.organization.findUnique({
        where: {
            id
        }
    })
    if (!org) {
        return {
            message: 'Organization not found',
            success: false,
            organization: null

        }
    }
    return {
        message: 'Organization found',
        success: true,
        organization: org
    }
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Internal server error'
        return {
            message: message,
            success: false,
            organization: null
        }
    }
}