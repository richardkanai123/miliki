'use server'

import { authCheck } from "@/lib/auth-check"
import { hasPermission } from "@/lib/permission-helpers"
import { prisma } from "@/lib/prisma"
import type { CreateTenancyInput } from "@/lib/validations/create-tenancy-schema"
import { createTenancySchema } from "@/lib/validations/create-tenancy-schema"
import { updateTag } from "next/cache"

export async function addTenancy(data: CreateTenancyInput) {
    try {
        // Validate the tenancy data
        const validatedData = createTenancySchema.safeParse(data)
        if (!validatedData.success) {
            const firstError = validatedData.error.issues[0]
            return { 
                message: firstError?.message || "Invalid tenancy data", 
                success: false, 
                tenancy: null 
            }
        }

        const session = await authCheck()
        if (!session) {
            return { message: "You must be logged in to add a tenancy", success: false, tenancy: null }
        }

        const hasPermissionToCreate = await hasPermission({
            resource: "tenancy",
            action: "create",
        })
        if (!hasPermissionToCreate) {
            return { 
                message: "You do not have permission to create a tenancy", 
                success: false, 
                tenancy: null 
            }
        }

        // Get unit to get property and organization info for cache invalidation
        const unit = await prisma.unit.findUnique({
            where: { id: validatedData.data.unitId },
            include: {
                property: {
                    include: {
                        organization: {
                            select: {
                                slug: true
                            }
                        }
                    }
                }
            }
        })

        if (!unit) {
            return { message: "Unit not found", success: false, tenancy: null }
        }

        // Check #1: Verify tenant doesn't already have an active/pending tenancy for the SAME unit
        const existingTenancyForSameUnit = await prisma.tenancy.findFirst({
            where: {
                unitId: validatedData.data.unitId,
                tenantId: validatedData.data.tenantId,
                status: { in: ['ACTIVE', 'PENDING'] }
            }
        })

        if (existingTenancyForSameUnit) {
            return { 
                message: "This tenant already has an active or pending tenancy for this unit", 
                success: false, 
                tenancy: null 
            }
        }

        // Check #5: Conflict detection - check for overlapping tenancies on this unit
        const overlappingTenancy = await prisma.tenancy.findFirst({
            where: {
                unitId: validatedData.data.unitId,
                status: { in: ['ACTIVE', 'PENDING'] },
                // Overlapping date ranges: new start < existing end AND new end > existing start
                AND: [
                    { startDate: { lt: validatedData.data.endDate } },
                    { endDate: { gt: validatedData.data.startDate } }
                ]
            },
            include: {
                tenant: {
                    include: {
                        user: {
                            select: { name: true }
                        }
                    }
                }
            }
        })

        if (overlappingTenancy) {
            const tenantName = overlappingTenancy.tenant?.user?.name || 'another tenant'
            const startDate = overlappingTenancy.startDate.toLocaleDateString()
            const endDate = overlappingTenancy.endDate.toLocaleDateString()
            return { 
                message: `This unit has an overlapping tenancy with ${tenantName} from ${startDate} to ${endDate}`, 
                success: false, 
                tenancy: null 
            }
        }

        // Create the tenancy
        const newTenancy = await prisma.tenancy.create({
            data: {
                unitId: validatedData.data.unitId,
                tenantId: validatedData.data.tenantId,
                startDate: validatedData.data.startDate,
                endDate: validatedData.data.endDate,
                monthlyRent: validatedData.data.monthlyRent,
                depositAmount: validatedData.data.depositAmount ?? 0,
                depositPaid: validatedData.data.depositPaid,
                billingDay: validatedData.data.billingDay,
                status: validatedData.data.status,
            },
            select: {
                id: true,
                unitId: true,
                tenantId: true,
            }
        })

        // Invalidate caches
        updateTag(`tenancies-by-org-${unit.property.organization.slug}`)
        updateTag(`tenancy-stats-${unit.property.organization.slug}`)
        updateTag(`unit-tenancies-${validatedData.data.unitId}`)
        updateTag(`property-tenancies-${unit.propertyId}`)
        updateTag(`unit-${validatedData.data.unitId}`)
        updateTag(`property-${unit.propertyId}`)

        return { 
            message: "Tenancy created successfully", 
            success: true, 
            tenancy: newTenancy 
        }
    } catch (error) {
        console.error("Error creating tenancy:", error)
        const errorMessage = error instanceof Error ? error.message : "Unknown error"
        return { message: errorMessage, success: false, tenancy: null }
    }
}
