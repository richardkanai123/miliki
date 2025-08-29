"use server";

import { checkAuth } from "@/lib/checkAuth";
import { prisma } from "@/lib/prisma";
import { NewBookingSchema, NewBookingSchemaType } from "@/lib/schemas/NewBookingSchema";
import { revalidateTag } from "next/cache";

interface CreateBookingResponse {
    success: boolean;
    message: string;
    booking?: { id: string; guestName: string; propertyTitle: string } | null;
}

export const createBooking = async (bookingData: NewBookingSchemaType): Promise<CreateBookingResponse> => {
    try {
        // 1. Validate input data
        const isValid = NewBookingSchema.safeParse(bookingData);

        if (!isValid.success) {
            return { 
                success: false, 
                message: isValid.error.issues.map(issue => issue.message).join(", ")
            };
        }

        // 2. Authentication check
        const session = await checkAuth();
        if (!session) {
            return {
                success: false,
                message: "You must be logged in to create a booking.",
            };
        }

        const userId = session.user.id;
        const validData = isValid.data;

        // 3. Verify guest belongs to user
        const guest = await prisma.guest.findUnique({
            where: { 
                id: validData.guestId,
                creatorId: userId 
            },
            select: { id: true, name: true, isActive: true }
        });

        if (!guest) {
            return {
                success: false,
                message: "Guest not found or does not belong to you.",
            };
        }

        if (!guest.isActive) {
            return {
                success: false,
                message: "Cannot create booking for inactive guest.",
            };
        }

        // 4. Verify property belongs to user and is available
        const property = await prisma.property.findUnique({
            where: { 
                id: validData.propertyId,
                ownerid: userId 
            },
            select: { id: true, title: true, status: true }
        });

        if (!property) {
            return {
                success: false,
                message: "Property not found or does not belong to you.",
            };
        }

        if (property.status !== "AVAILABLE") {
            return {
                success: false,
                message: `Property is currently ${property.status.toLowerCase()} and cannot be booked.`,
            };
        }

        // 5. Check for overlapping bookings
        const overlappingBooking = await prisma.booking.findFirst({
            where: {
                propertyId: validData.propertyId,
                status: {
                    in: ["PENDING", "CONFIRMED", "CHECKED_IN"]
                },
                OR: [
                    {
                        // New booking starts during existing booking
                        AND: [
                            { checkIn: { lte: validData.checkIn } },
                            { checkOut: { gt: validData.checkIn } }
                        ]
                    },
                    {
                        // New booking ends during existing booking
                        AND: [
                            { checkIn: { lt: validData.checkOut } },
                            { checkOut: { gte: validData.checkOut } }
                        ]
                    },
                    {
                        // New booking completely contains existing booking
                        AND: [
                            { checkIn: { gte: validData.checkIn } },
                            { checkOut: { lte: validData.checkOut } }
                        ]
                    }
                ]
            }
        });

        if (overlappingBooking) {
            return {
                success: false,
                message: "Property is already booked for the selected dates.",
            };
        }

        // 6. Create the booking
        const booking = await prisma.booking.create({
            data: {
                guestId: validData.guestId,
                propertyId: validData.propertyId,
                checkIn: validData.checkIn,
                checkOut: validData.checkOut,
                duration: validData.duration,
                guestsCount: validData.guestsCount,
                bookingUnit: validData.bookingUnit,
                totalPrice: validData.totalPrice,
                status: validData.status,
                notes: validData.notes?.trim() || null,
            },
            select: {
                id: true,
                guest: { select: { name: true } },
                property: { select: { title: true } }
            }
        });

        // 7. Update property status to BOOKED if confirmed
        if (validData.status === "CONFIRMED" || validData.status === "CHECKED_IN") {
            await prisma.property.update({
                where: { id: validData.propertyId },
                data: { status: "BOOKED" }
            });
        }

        // 8. Revalidate cache
        revalidateTag("bookings");
        revalidateTag("user-bookings");
        revalidateTag("properties");
        revalidateTag(`property-${validData.propertyId}`);

        return {
            success: true,
            message: `Booking created successfully for ${booking.guest.name} at ${booking.property.title}.`,
            booking: {
                id: booking.id,
                guestName: booking.guest.name,
                propertyTitle: booking.property.title
            }
        };

    } catch (error) {
        console.error("Error creating booking:", error);
        
        const message = error instanceof Error 
            ? error.message 
            : "An unexpected error occurred while creating the booking. Please try again later.";
            
        return {
            success: false,
            message,
        };
    }
};
