/*
  Warnings:

  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "PropertySizes" AS ENUM ('BEDSITTER', 'ONE_BEDROOM', 'TWO_BEDROOM', 'THREE_BEDROOM', 'FOUR_BEDROOM', 'FIVE_BEDROOM', 'STUDIO', 'PENTHOUSE', 'DUPLEX', 'VILLA', 'APARTMENT', 'BUNGALOW', 'TOWNHOUSE', 'MANSION', 'CASTLE', 'CONDOMINIUM', 'LOFT', 'COTTAGE', 'FARMHOUSE', 'CABIN', 'MOBILE_HOME', 'RV', 'TINY_HOME', 'HOUSEBOAT', 'YURT', 'TENT', 'TREEHOUSE', 'IGLOO', 'SHED', 'GARAGE', 'WAREHOUSE', 'BARN');

-- CreateEnum
CREATE TYPE "PropertyStatus" AS ENUM ('AVAILABLE', 'MAINTENANCE', 'UNAVAILABLE');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CHECKED_IN', 'CHECKED_OUT', 'CANCELLED', 'NO_SHOW');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CASH', 'MPESA', 'BANK_TRANSFER', 'CARD', 'CHEQUE');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "BookingUnit" AS ENUM ('NIGHT', 'WEEK', 'MONTH');

-- CreateEnum
CREATE TYPE "Services" AS ENUM ('CLEANING', 'LAUNDRY', 'GARDENING', 'POOL_MAINTENANCE', 'SECURITY', 'INTERNET', 'CABLE_TV', 'PARKING', 'GYM_ACCESS', 'AIRPORT_SHUTTLE', 'TOUR_GUIDE', 'MEAL_SERVICE', 'PET_CARE', 'MAINTENANCE');

-- CreateEnum
CREATE TYPE "BillStatus" AS ENUM ('PENDING', 'PAID', 'OVERDUE', 'CANCELLED');

-- DropTable
DROP TABLE "Post";

-- CreateTable
CREATE TABLE "properties" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "size" "PropertySizes" NOT NULL,
    "status" "PropertyStatus" NOT NULL,
    "ownerid" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "coordinates" TEXT,
    "bedrooms" INTEGER NOT NULL,
    "bathrooms" INTEGER NOT NULL,
    "parking" BOOLEAN NOT NULL,
    "garden" BOOLEAN NOT NULL,
    "balcony" BOOLEAN NOT NULL,
    "pool" BOOLEAN NOT NULL,
    "gym" BOOLEAN NOT NULL,
    "AC" BOOLEAN NOT NULL,
    "heating" BOOLEAN NOT NULL,
    "furnished" BOOLEAN NOT NULL,
    "petsAllowed" BOOLEAN NOT NULL,
    "smokingAllowed" BOOLEAN NOT NULL,
    "wheelchairAccessible" BOOLEAN NOT NULL,
    "securitySystem" BOOLEAN NOT NULL,
    "internet" BOOLEAN NOT NULL,
    "cableTV" BOOLEAN NOT NULL,
    "laundry" BOOLEAN NOT NULL,
    "storage" BOOLEAN NOT NULL,
    "fireplace" BOOLEAN NOT NULL,
    "notes" TEXT,
    "cleaningFee" DOUBLE PRECISION NOT NULL,
    "serviceFee" DOUBLE PRECISION NOT NULL,
    "internetFee" DOUBLE PRECISION NOT NULL,
    "securityDeposit" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "properties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guests" (
    "id" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "id_number" TEXT,
    "address" TEXT,
    "emergencyContact" TEXT,
    "notes" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "guests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bookings" (
    "id" TEXT NOT NULL,
    "guestId" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "checkIn" TIMESTAMP(3) NOT NULL,
    "checkOut" TIMESTAMP(3) NOT NULL,
    "status" "BookingStatus" NOT NULL DEFAULT 'PENDING',
    "duration" INTEGER NOT NULL,
    "bookingUnit" "BookingUnit" NOT NULL,
    "totalPrice" DOUBLE PRECISION NOT NULL,
    "guestsCount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "cancelled_at" TIMESTAMP(3),
    "cancellation_reason" TEXT,
    "notes" TEXT,

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "status" "PaymentStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "paymentMethod" "PaymentMethod" NOT NULL,
    "notes" TEXT,
    "paidBy" TEXT NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bills" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" "BillStatus" NOT NULL DEFAULT 'PENDING',
    "dueDate" TIMESTAMP(3) NOT NULL,
    "paidDate" TIMESTAMP(3),
    "notes" TEXT,
    "service" "Services" NOT NULL,
    "propertyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pricingRules" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "seasonName" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "pricePerNight" DECIMAL(10,2) NOT NULL,
    "pricePerWeek" DECIMAL(10,2) NOT NULL,
    "pricePerMonth" DECIMAL(10,2) NOT NULL,
    "minimumStay" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT,

    CONSTRAINT "pricingRules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "monthlySummaries" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "totalRevenue" DECIMAL(10,2) NOT NULL,
    "totalExpenses" DECIMAL(10,2) NOT NULL,
    "netIncome" DECIMAL(10,2) NOT NULL,
    "occupancyRate" DECIMAL(5,2) NOT NULL,
    "daysBooked" INTEGER NOT NULL,
    "totalDays" INTEGER NOT NULL,
    "averageDailyRate" DECIMAL(10,2) NOT NULL,
    "totalBookings" INTEGER NOT NULL,
    "calculatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "monthlySummaries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "properties_ownerid_id_title_idx" ON "properties"("ownerid", "id", "title");

-- CreateIndex
CREATE INDEX "guests_creatorId_id_name_idx" ON "guests"("creatorId", "id", "name");

-- CreateIndex
CREATE INDEX "bookings_guestId_propertyId_checkIn_checkOut_idx" ON "bookings"("guestId", "propertyId", "checkIn", "checkOut");

-- CreateIndex
CREATE INDEX "payments_bookingId_paidBy_status_idx" ON "payments"("bookingId", "paidBy", "status");

-- CreateIndex
CREATE INDEX "bills_propertyId_status_dueDate_idx" ON "bills"("propertyId", "status", "dueDate");

-- CreateIndex
CREATE INDEX "pricingRules_propertyId_seasonName_startDate_endDate_idx" ON "pricingRules"("propertyId", "seasonName", "startDate", "endDate");

-- CreateIndex
CREATE INDEX "monthlySummaries_propertyId_year_month_idx" ON "monthlySummaries"("propertyId", "year", "month");

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_ownerid_fkey" FOREIGN KEY ("ownerid") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guests" ADD CONSTRAINT "guests_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_guestId_fkey" FOREIGN KEY ("guestId") REFERENCES "guests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_paidBy_fkey" FOREIGN KEY ("paidBy") REFERENCES "guests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bills" ADD CONSTRAINT "bills_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pricingRules" ADD CONSTRAINT "pricingRules_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pricingRules" ADD CONSTRAINT "pricingRules_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monthlySummaries" ADD CONSTRAINT "monthlySummaries_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;
