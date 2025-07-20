import { NextRequest, NextResponse } from 'next/server';
import { checkAuth } from '@/lib/checkAuth';
import { prisma } from '@/lib/prisma';
import {
    createPropertySchema,
} from '@/lib/schemas/NewPropertySchema';
import { ZodError } from 'zod/v3';

// Define the response type
interface CreatePropertyResponse {
    success: boolean;
    message: string;
    data?: {
        id: string;
        title: string;
    };
    code?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<CreatePropertyResponse>> {
    try {
        // Check authentication
        const session = await checkAuth();

        if (!session || !session.user) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Unauthorized: User session not found',
                    code: 'UNAUTHORIZED'
                },
                { status: 401 }
            );
        }

        // Parse request body
        const body = await request.json();

        // Validate property input
        const parsedProperty = createPropertySchema.safeParse(body);
        if (!parsedProperty.success) {
            const validationErrors = parsedProperty.error.message

            return NextResponse.json(
                {
                    success: false,
                    message: `Invalid property data: ${validationErrors}`,
                    code: 'VALIDATION_ERROR'
                },
                { status: 400 }
            );
        }

        const userid = session.user.id;
        const {
            title,
            description,
            location,
            AC,
            balcony,
            bathrooms,
            bedrooms,
            cableTV,
            cleaningFee,
            fireplace,
            furnished,
            garden,
            gym,
            heating,
            internet,
            internetFee,
            laundry,
            notes,
            parking,
            petsAllowed,
            pool,
            securitySystem,
            serviceFee,
            size,
            smokingAllowed,
            status,
            storage,
            wheelchairAccessible,
            coordinates,
            securityDeposit,
        } = parsedProperty.data;

        // Create property in database
        const newProperty = await prisma.property.create({
            data: {
                title: title.trim(),
                description: description.trim(),
                location: location.trim(),
                AC,
                balcony,
                bathrooms,
                bedrooms,
                cableTV,
                cleaningFee: cleaningFee || 0,
                fireplace,
                furnished,
                garden,
                gym,
                heating,
                internet,
                internetFee: internetFee || 0,
                laundry,
                notes: notes?.trim(),
                parking,
                petsAllowed,
                pool,
                securitySystem,
                serviceFee: serviceFee || 0,
                size,
                smokingAllowed,
                status: status || 'AVAILABLE',
                storage,
                wheelchairAccessible,
                coordinates: coordinates?.trim(),
                securityDeposit: securityDeposit || 0,
                ownerid: userid,
            },
            select: {
                id: true,
                title: true,
                createdAt: true,
            },
        });

        if (!newProperty) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Failed to create property',
                    code: 'CREATION_FAILED'
                },
                { status: 500 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: `Property '${newProperty.title}' created successfully!`,
                data: {
                    id: newProperty.id,
                    title: newProperty.title,
                },
                code: 'PROPERTY_CREATED'
            },
            { status: 201 }
        );

    } catch (error) {
        // Enhanced error logging
        console.error('Property creation failed:', {
            error: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
            timestamp: new Date().toISOString(),
        });

        // Handle specific error types
        if (error instanceof ZodError) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Validation failed',
                    code: 'VALIDATION_ERROR'
                },
                { status: 400 }
            );
        }

        if (error instanceof Error) {
            // Check for specific database errors
            if (error.message.includes('Unique constraint')) {
                return NextResponse.json(
                    {
                        success: false,
                        message: 'A property with this information already exists.',
                        code: 'DUPLICATE_PROPERTY'
                    },
                    { status: 409 }
                );
            }

            // Check for authentication errors
            if (error.message.includes('Unauthorized')) {
                return NextResponse.json(
                    {
                        success: false,
                        message: error.message,
                        code: 'UNAUTHORIZED'
                    },
                    { status: 401 }
                );
            }

            return NextResponse.json(
                {
                    success: false,
                    message: error.message,
                    code: 'SERVER_ERROR'
                },
                { status: 500 }
            );
        }

        return NextResponse.json(
            {
                success: false,
                message: 'An unexpected error occurred while creating the property. Please try again.',
                code: 'UNKNOWN_ERROR'
            },
            { status: 500 }
        );
    }
}

// Optional: Add other HTTP methods if needed
export async function GET(request: NextRequest) {
    return NextResponse.json(
        {
            success: false,
            message: 'Method not allowed. Use POST to create properties.',
            code: 'METHOD_NOT_ALLOWED'
        },
        { status: 405 }
    );
}
export async function PUT(request: NextRequest) {
    return NextResponse.json(
        {
            success: false,
            message: 'Method not allowed. Use POST to create properties.',
            code: 'METHOD_NOT_ALLOWED'
        },
        { status: 405 }
    );
}
export async function DELETE(request: NextRequest) {
    return NextResponse.json(
        {
            success: false,
            message: 'Method not allowed. Use POST to create properties.',
            code: 'METHOD_NOT_ALLOWED'
        },
        { status: 405 }
    );
}
export async function PATCH(request: NextRequest) {
    return NextResponse.json(
        {
            success: false,
            message: 'Method not allowed. Use POST to create properties.',
            code: 'METHOD_NOT_ALLOWED'
        },
        { status: 405 }
    );
}
export async function HEAD(request: NextRequest) {
    return NextResponse.json(
        {
            success: false,
            message: 'Method not allowed. Use POST to create properties.',
            code: 'METHOD_NOT_ALLOWED'
        },
        { status: 405 }
    );
}

export async function OPTIONS(request: NextRequest) {
    return new NextResponse(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
    });
}