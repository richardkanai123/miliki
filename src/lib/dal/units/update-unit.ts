'use server'

import { authCheck } from "@/lib/auth-check"
import { hasPermission } from "@/lib/permission-helpers"
import { prisma } from "@/lib/prisma"
import { updateUnitSchema } from "@/lib/validations/update-unit-schema"
import {  updateTag } from "next/cache"
import z from "zod"


export async function updateUnit(unitId: string, data: z.infer<typeof updateUnitSchema>) {
    try {
        if (!unitId) {
            return { message: "Unit ID is required", success: false, unit: null }
        }

        // Validate the unit data
        const validatedData = updateUnitSchema.safeParse(data)
        if (!validatedData.success) {
            const firstError = validatedData.error.issues[0]
            return { 
                message: firstError?.message || "Invalid unit data", 
                success: false, 
                unit: null 
            }
        }

        const session = await authCheck()
        if (!session) {
            return { message: "You must be logged in to update a unit", success: false, unit: null }
        }

        const hasPermissionToUpdate = await hasPermission({
            resource: "unit",
            action: "update",
        })
        if (!hasPermissionToUpdate) {
            return { 
                message: "You do not have permission to update this unit", 
                success: false, 
                unit: null 
            }
        }

        // Get the existing unit to get propertyId for cache invalidation
        const existingUnit = await prisma.unit.findUnique({
            where: { id: unitId },
            select: { propertyId: true }
        })

        if (!existingUnit) {
            return { message: "Unit not found", success: false, unit: null }
        }

        // Update the unit
        const updatedUnit = await prisma.unit.update({
            where: { id: unitId },
            data: {
                ...validatedData.data,
                // Set listedAt when listing is enabled
                listedAt: validatedData.data.isListed ? new Date() : null,
            },
            select: {
                id: true,
                title: true,
                propertyId: true,
            }
        })

        // Invalidate caches
        updateTag(`unit-${unitId}`)
        updateTag(`units-by-property-${existingUnit.propertyId}`)
        updateTag(`unit-stats-${existingUnit.propertyId}`)

        return { 
            message: "Unit updated successfully", 
            success: true, 
            unit: updatedUnit 
        }
    } catch (error) {
        console.error("Error updating unit:", error)
        const errorMessage = error instanceof Error ? error.message : "Unknown error"
        return { message: errorMessage, success: false, unit: null }
    }
}
