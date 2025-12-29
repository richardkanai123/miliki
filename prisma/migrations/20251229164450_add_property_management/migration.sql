-- CreateEnum
CREATE TYPE "PropertyType" AS ENUM ('APARTMENT', 'HOUSE', 'TOWNHOUSE', 'STUDIO', 'COMMERCIAL', 'BEDSITTER', 'SINGLE_ROOM', 'OTHER');

-- CreateEnum
CREATE TYPE "UnitStatus" AS ENUM ('VACANT', 'OCCUPIED', 'MAINTENANCE', 'RESERVED');

-- CreateEnum
CREATE TYPE "TenancyStatus" AS ENUM ('PENDING', 'ACTIVE', 'EXPIRED', 'CANCELLED', 'RENEWED');

-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('DRAFT', 'PENDING', 'PARTIAL', 'PAID', 'OVERDUE', 'CANCELLED', 'WRITTEN_OFF');

-- CreateEnum
CREATE TYPE "InvoiceType" AS ENUM ('RENT', 'DEPOSIT', 'UTILITY', 'PENALTY', 'OTHER');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('MPESA', 'BANK_TRANSFER', 'CASH', 'CHEQUE', 'CARD', 'OTHER');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED', 'REFUNDED');

-- CreateTable
CREATE TABLE "property" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" "PropertyType" NOT NULL DEFAULT 'APARTMENT',
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "county" TEXT NOT NULL,
    "postalCode" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "images" TEXT[],
    "organizationId" TEXT NOT NULL,
    "managerId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "property_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "amenity" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT,
    "category" TEXT,

    CONSTRAINT "amenity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "property_amenity" (
    "propertyId" TEXT NOT NULL,
    "amenityId" TEXT NOT NULL,

    CONSTRAINT "property_amenity_pkey" PRIMARY KEY ("propertyId","amenityId")
);

-- CreateTable
CREATE TABLE "unit" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "locationInProperty" TEXT,
    "rentAmount" DECIMAL(12,2) NOT NULL,
    "depositAmount" DECIMAL(12,2),
    "bedrooms" INTEGER NOT NULL DEFAULT 1,
    "bathrooms" INTEGER NOT NULL DEFAULT 1,
    "squareMeters" DOUBLE PRECISION,
    "images" TEXT[],
    "status" "UnitStatus" NOT NULL DEFAULT 'VACANT',
    "isListed" BOOLEAN NOT NULL DEFAULT false,
    "listingTitle" TEXT,
    "listingDescription" TEXT,
    "listedAt" TIMESTAMP(3),
    "propertyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "unit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "unit_amenity" (
    "unitId" TEXT NOT NULL,
    "amenityId" TEXT NOT NULL,

    CONSTRAINT "unit_amenity_pkey" PRIMARY KEY ("unitId","amenityId")
);

-- CreateTable
CREATE TABLE "tenancy" (
    "id" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "monthlyRent" DECIMAL(12,2) NOT NULL,
    "depositAmount" DECIMAL(12,2) NOT NULL,
    "depositPaid" BOOLEAN NOT NULL DEFAULT false,
    "billingDay" INTEGER NOT NULL DEFAULT 1,
    "status" "TenancyStatus" NOT NULL DEFAULT 'PENDING',
    "cancelReason" TEXT,
    "cancelledAt" TIMESTAMP(3),
    "unitId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "previousTenancyId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tenancy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoice" (
    "id" TEXT NOT NULL,
    "invoiceNumber" TEXT NOT NULL,
    "type" "InvoiceType" NOT NULL DEFAULT 'RENT',
    "description" TEXT,
    "amount" DECIMAL(12,2) NOT NULL,
    "taxAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "totalAmount" DECIMAL(12,2) NOT NULL,
    "amountPaid" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "balance" DECIMAL(12,2) NOT NULL,
    "issueDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "periodStart" TIMESTAMP(3),
    "periodEnd" TIMESTAMP(3),
    "status" "InvoiceStatus" NOT NULL DEFAULT 'DRAFT',
    "sentAt" TIMESTAMP(3),
    "paidAt" TIMESTAMP(3),
    "tenancyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment" (
    "id" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "method" "PaymentMethod" NOT NULL DEFAULT 'MPESA',
    "transactionRef" TEXT,
    "externalRef" TEXT,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "failureReason" TEXT,
    "mpesaReceiptNumber" TEXT,
    "mpesaPhoneNumber" TEXT,
    "initiatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "invoiceId" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_log" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "resourceType" TEXT NOT NULL,
    "resourceId" TEXT NOT NULL,
    "metadata" JSONB,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "property_organizationId_idx" ON "property"("organizationId");

-- CreateIndex
CREATE INDEX "property_managerId_idx" ON "property"("managerId");

-- CreateIndex
CREATE INDEX "property_city_county_idx" ON "property"("city", "county");

-- CreateIndex
CREATE UNIQUE INDEX "amenity_name_key" ON "amenity"("name");

-- CreateIndex
CREATE INDEX "unit_propertyId_idx" ON "unit"("propertyId");

-- CreateIndex
CREATE INDEX "unit_status_idx" ON "unit"("status");

-- CreateIndex
CREATE INDEX "unit_rentAmount_idx" ON "unit"("rentAmount");

-- CreateIndex
CREATE INDEX "unit_isListed_status_idx" ON "unit"("isListed", "status");

-- CreateIndex
CREATE UNIQUE INDEX "tenancy_previousTenancyId_key" ON "tenancy"("previousTenancyId");

-- CreateIndex
CREATE INDEX "tenancy_unitId_idx" ON "tenancy"("unitId");

-- CreateIndex
CREATE INDEX "tenancy_tenantId_idx" ON "tenancy"("tenantId");

-- CreateIndex
CREATE INDEX "tenancy_status_idx" ON "tenancy"("status");

-- CreateIndex
CREATE INDEX "tenancy_startDate_endDate_idx" ON "tenancy"("startDate", "endDate");

-- CreateIndex
CREATE UNIQUE INDEX "invoice_invoiceNumber_key" ON "invoice"("invoiceNumber");

-- CreateIndex
CREATE INDEX "invoice_tenancyId_idx" ON "invoice"("tenancyId");

-- CreateIndex
CREATE INDEX "invoice_status_idx" ON "invoice"("status");

-- CreateIndex
CREATE INDEX "invoice_dueDate_idx" ON "invoice"("dueDate");

-- CreateIndex
CREATE INDEX "invoice_invoiceNumber_idx" ON "invoice"("invoiceNumber");

-- CreateIndex
CREATE UNIQUE INDEX "payment_transactionRef_key" ON "payment"("transactionRef");

-- CreateIndex
CREATE INDEX "payment_invoiceId_idx" ON "payment"("invoiceId");

-- CreateIndex
CREATE INDEX "payment_memberId_idx" ON "payment"("memberId");

-- CreateIndex
CREATE INDEX "payment_status_idx" ON "payment"("status");

-- CreateIndex
CREATE INDEX "payment_transactionRef_idx" ON "payment"("transactionRef");

-- CreateIndex
CREATE INDEX "payment_mpesaReceiptNumber_idx" ON "payment"("mpesaReceiptNumber");

-- CreateIndex
CREATE INDEX "notification_userId_isRead_idx" ON "notification"("userId", "isRead");

-- CreateIndex
CREATE INDEX "notification_createdAt_idx" ON "notification"("createdAt");

-- CreateIndex
CREATE INDEX "audit_log_userId_idx" ON "audit_log"("userId");

-- CreateIndex
CREATE INDEX "audit_log_resourceType_resourceId_idx" ON "audit_log"("resourceType", "resourceId");

-- CreateIndex
CREATE INDEX "audit_log_createdAt_idx" ON "audit_log"("createdAt");

-- AddForeignKey
ALTER TABLE "property" ADD CONSTRAINT "property_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "property" ADD CONSTRAINT "property_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "member"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "property_amenity" ADD CONSTRAINT "property_amenity_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "property_amenity" ADD CONSTRAINT "property_amenity_amenityId_fkey" FOREIGN KEY ("amenityId") REFERENCES "amenity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "unit" ADD CONSTRAINT "unit_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "unit_amenity" ADD CONSTRAINT "unit_amenity_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "unit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "unit_amenity" ADD CONSTRAINT "unit_amenity_amenityId_fkey" FOREIGN KEY ("amenityId") REFERENCES "amenity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenancy" ADD CONSTRAINT "tenancy_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenancy" ADD CONSTRAINT "tenancy_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenancy" ADD CONSTRAINT "tenancy_previousTenancyId_fkey" FOREIGN KEY ("previousTenancyId") REFERENCES "tenancy"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice" ADD CONSTRAINT "invoice_tenancyId_fkey" FOREIGN KEY ("tenancyId") REFERENCES "tenancy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "invoice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
