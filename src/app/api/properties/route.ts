// POST /api/properties
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { createPropertySchema } from "@/lib/validations/create-property-schema"
import { headers } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        })
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }
        const { data } = await request.json()
        const validatedData = createPropertySchema.parse(data)
        const property = await prisma.property.create({
            data: validatedData,
        })
        return NextResponse.json({message: `${property.name} added successfully`}, { status: 200 })
    } catch (error) {
        console.error(error)
        const errorMessage = error instanceof Error ? error.message : "Internal server error"
        return NextResponse.json({ error: errorMessage }, { status: 500 })
    }
}



// GET /api/properties
// gets properties for the active organization of the user
export async function GET(request: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        })
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }
        const activeOrganizationId = session.session?.activeOrganizationId
        if (!activeOrganizationId) {
            return NextResponse.json({ error: "No active organization" }, { status: 401 })
        }
        const properties = await prisma.property.findMany({
            where: {
                organizationId: activeOrganizationId,
            },
        })
        return NextResponse.json({ properties }, { status: 200 })
    }
    catch (error) {
        console.error(error)
        const errorMessage = error instanceof Error ? error.message : "Internal server error"
        return NextResponse.json({ error: errorMessage }, { status: 500 })
    }
}