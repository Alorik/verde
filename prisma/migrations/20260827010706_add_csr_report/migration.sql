-- AlterEnum
ALTER TYPE "MetricUnit" ADD VALUE 'EMPLOYEE_DATA';

-- CreateTable
CREATE TABLE "CSRReport" (
    "id" TEXT NOT NULL,
    "boardIndependence" INTEGER NOT NULL,
    "ethicsPolicy" BOOLEAN NOT NULL,
    "antiCorruptionPolicy" BOOLEAN NOT NULL,
    "whistleblowerPolicy" BOOLEAN NOT NULL,
    "riskManagement" BOOLEAN NOT NULL,
    "regulatoryCompliance" BOOLEAN NOT NULL,
    "governanceTraining" INTEGER NOT NULL,
    "complianceIncidents" INTEGER NOT NULL,
    "documentId" TEXT NOT NULL,

    CONSTRAINT "CSRReport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CSRReport_documentId_key" ON "CSRReport"("documentId");

-- AddForeignKey
ALTER TABLE "CSRReport" ADD CONSTRAINT "CSRReport_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
