-- CreateEnum
CREATE TYPE "Industry" AS ENUM ('TECHNOLOGY', 'MANUFACTURING', 'HEALTHCARE', 'EDUCATION', 'CONSTRUCTION', 'ENERGY', 'FINANCE', 'OTHER');

-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "industry" "Industry" NOT NULL,
    "employeeCount" INTEGER NOT NULL,
    "country" TEXT NOT NULL,
    "city" TEXT,
    "foundedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);
