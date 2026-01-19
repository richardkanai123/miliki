'use server'

import { authCheck } from "@/lib/auth-check"
import { hasPermission } from "@/lib/permission-helpers"
import { prisma } from "@/lib/prisma"
import {type UpdatePropertyFormValues, updatePropertySchema } from "@/lib/validations/update-property-schema"
import { updateTag } from "next/cache"

export async function updateProperty(propertyId: string, data: UpdatePropertyFormValues) {
    try {
        if (!propertyId) {
            return { message: "Property ID is required", success: false, property: null }
        }

        // Validate the property data
        const validatedData = updatePropertySchema.safeParse(data)
        if (!validatedData.success) {
            const firstError = validatedData.error.issues[0]
            return { 
                message: firstError?.message || "Invalid property data", 
                success: false, 
                property: null 
            }
        }

        const session = await authCheck()
        if (!session) {
            return { message: "You must be logged in to update a property", success: false, property: null }
        }

        const hasPermissionToUpdate = await hasPermission({
            resource: "property",
            action: "update",
        })
        if (!hasPermissionToUpdate) {
            return { 
                message: "You do not have permission to update this property", 
                success: false, 
                property: null 
            }
        }

        // Get the existing property to get organizationId and slug for cache invalidation
        const existingProperty = await prisma.property.findUnique({
            where: { id: propertyId },
            select: { 
                organizationId: true,
                organization: {
                    select: {
                        slug: true
                    }
                }
            }
        })

        if (!existingProperty) {
            return { message: "Property not found", success: false, property: null }
        }

        // Update the property
        const updatedProperty = await prisma.property.update({
            where: { id: propertyId },
            data: {
                ...validatedData.data,
            },
            select: {
                id: true,
                name: true,
                organizationId: true,
                organization: {
                    select: {
                        slug: true
                    }
                }
            }
        })

        // Invalidate caches
        updateTag(`property-${propertyId}`)
        updateTag(`property-details-${propertyId}`)
        updateTag(`property-stats-${existingProperty.organizationId}`)
        updateTag(`property-stats-${existingProperty.organization.slug}`)
        updateTag(`properties-${existingProperty.organization.slug}`)
        updateTag(`properties-${existingProperty.organizationId}`)

        return { 
            message: "Property updated successfully", 
            success: true, 
            property: updatedProperty 
        }
    } catch (error) {
        console.error("Error updating property:", error)
        const errorMessage = error instanceof Error ? error.message : "Unknown error"
        return { message: errorMessage, success: false, property: null }
    }
}
