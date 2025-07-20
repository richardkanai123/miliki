import { NextRequest, NextResponse } from 'next/server';
import { checkAuth } from '@/lib/checkAuth';
import { prisma } from '@/lib/prisma';

// CORS headers
const corsHeaders = {
    'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
    return new NextResponse(null, {
        status: 200,
        headers: corsHeaders,
    });
}

// GET /api/properties/my
export async function GET(request: NextRequest) {
    try {
        const session = await checkAuth();
        if (!session) {
            return NextResponse.json(
                {
                    success: false,
                    message: "You must be logged in to view your properties.",
                    properties: []
                },
                { 
                    status: 401,
                    headers: corsHeaders
                }
            );
        }

        const properties = await prisma.property.findMany({
            where: {
                ownerid: session.user.id,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        if (!properties || properties.length === 0) {
            return NextResponse.json(
                {
                    success: true,
                    message: "No properties found for this user.",
                    properties: [],
                },
                { 
                    status: 200,
                    headers: corsHeaders
                }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: "Properties retrieved successfully.",
                properties,
            },
            { 
                status: 200,
                headers: corsHeaders
            }
        );

    } catch (error) {
        const errorMessage = error instanceof Error 
            ? error.message 
            : "An unexpected error occurred.";
            
        return NextResponse.json(
            {
                success: false,
                message: errorMessage,
                properties: []
            },
            { 
                status: 500,
                headers: corsHeaders
            }
        );
    }
}


