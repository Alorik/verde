-- CreateTable
CREATE TABLE "Electricity" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "electricityCost" DECIMAL(65,30) NOT NULL,
    "unitsConsumed" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "Electricity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Electricity_documentId_key" ON "Electricity"("documentId");

-- AddForeignKey
ALTER TABLE "Electricity" ADD CONSTRAINT "Electricity_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
