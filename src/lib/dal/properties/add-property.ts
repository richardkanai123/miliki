'use server'

import { authCheck } from "@/lib/auth-check"
import { prisma } from "@/lib/prisma"
import type { CreatePropertyInput } from "@/lib/validations/create-property-schema"
import { createPropertySchema } from "@/lib/validations/create-property-schema"
import { hasPermission } from "@/lib/permission-helpers"
import {  updateTag } from "next/cache"

export async function addProperty(property: CreatePropertyInput) {
try {
    const session = await authCheck()
    if (!session) {
        return { message: "You must be logged in to add a property", success: false, property: null }
    }
    const activeOrganizationId = session.session?.activeOrganizationId
    if (!activeOrganizationId) {
        return { message: "You must be in an organization to add a property", success: false, property: null }
    }

    const hasPermissionToAddProperty = await hasPermission({
        resource: "property",
        action: "create",
    })
    if (!hasPermissionToAddProperty) {
        return { message: "You do not have permission to add a property. Please contact your administrator to be granted permission.", success: false, property: null }
    }

    const validatedData = createPropertySchema.parse(property)
    const newProperty = await prisma.property.create({
        data: {
            ...validatedData,
            organizationId: activeOrganizationId,
        },
        select:{
            id: true,
            name: true,
            organizationId: true,
            organization: {
                select:{
                    slug: true,
                }
            }
        }
        
    })

    const cacheKey = `properties-${activeOrganizationId}`
    updateTag(`property-stats-${newProperty.organizationId}`)
    updateTag(`property-stats-${newProperty.organization.slug}`)
    updateTag(`properties-${newProperty.organization.slug}`)
    updateTag(`properties-${newProperty.organizationId}`)
    updateTag(cacheKey)
    
    return { message: `${newProperty.name} added successfully`, success: true, property: newProperty }
} catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Internal server error"
    return { message: errorMessage, success: false, property: null }
    
}
}