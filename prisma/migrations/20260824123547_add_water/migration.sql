-- CreateTable
CREATE TABLE "Water" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "WaterCost" DECIMAL(65,30) NOT NULL,
    "unitsConsumed" DECIMAL(65,30) NOT NULL,
    "unit" "MetricUnit",
    "consumptionCubicMeter" DECIMAL(65,30),

    CONSTRAINT "Water_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Water_documentId_key" ON "Water"("documentId");

-- AddForeignKey
ALTER TABLE "Water" ADD CONSTRAINT "Water_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
