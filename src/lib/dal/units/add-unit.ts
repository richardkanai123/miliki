'use server'
import { authCheck } from "@/lib/auth-check";
import { hasPermission } from "@/lib/permission-helpers";
import { prisma } from "@/lib/prisma";
import { CreateUnitInput, createUnitSchema } from "@/lib/validations/create-unit-schema";
import { updateTag } from "next/cache";

export async function addUnit(unit: CreateUnitInput, propertyId: string) {

    try {
        if (!propertyId) {
            return { message: "Property ID is required to add a unit", success: false, unit: null }
        }
    //   validate the unit data
    const validatedUnit = createUnitSchema.safeParse(unit)
        if (!validatedUnit.success) {
            return { message: "Invalid unit data, please check the errors", success: false, unit: null, }
        }

        const session = await authCheck()
        if (!session) {
            return { message: "You must be logged in to add a unit", success: false, unit: null }
        }

        const hasPermissionToAddUnit = await hasPermission({
            resource: "unit",
            action: "create",
        })
        if (!hasPermissionToAddUnit) {
            return { message: "You do not have permission to add a unit. Please contact your administrator to be granted permission.", success: false, unit: null }
        }

        const newUnit = await prisma.unit.create({
            data: {
                ...validatedUnit.data,
                propertyId: propertyId,
            },
            select: {
                id: true,
                title: true,
            }
        })

        if (!newUnit) {
            return { message: "Error adding unit", success: false, unit: null }
        }

        // cache
        updateTag(`property-units-${propertyId}`)

        return { message: "Unit added successfully", success: true, unit: newUnit }
    } catch (error) {
        console.log(error)
        const errorMessage = error instanceof Error ? error.message : "Unknown error"
        return { message: errorMessage, success: false, unit: null}
    }
}