-- CreateEnum
CREATE TYPE "ESGCategory" AS ENUM ('ENVIRONMENTAL', 'SOCIAL', 'GOVERNANCE');

-- CreateEnum
CREATE TYPE "MetricUnit" AS ENUM ('MWH', 'KWH', 'PERCENT', 'EMPLOYEES', 'CUBIC_METER', 'NONE');

-- CreateTable
CREATE TABLE "ESGScore" (
    "id" TEXT NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "environmentalScore" DECIMAL(65,30),
    "socialScore" DECIMAL(65,30),
    "governanceScore" DECIMAL(65,30),
    "overallScore" DECIMAL(65,30),
    "calculatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ESGScore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ESGMetric" (
    "id" TEXT NOT NULL,
    "esgScoreId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "ESGCategory" NOT NULL,
    "description" TEXT,
    "rawValue" DECIMAL(65,30),
    "rawUnit" "MetricUnit",
    "normalizedValue" DECIMAL(65,30),
    "normalizedUnit" "MetricUnit",
    "textValue" TEXT,
    "score" DECIMAL(65,30),
    "weight" DECIMAL(65,30),
    "sourceDocumentId" TEXT,

    CONSTRAINT "ESGMetric_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ESGScore_assessmentId_key" ON "ESGScore"("assessmentId");

-- AddForeignKey
ALTER TABLE "ESGScore" ADD CONSTRAINT "ESGScore_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "Assessment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ESGMetric" ADD CONSTRAINT "ESGMetric_esgScoreId_fkey" FOREIGN KEY ("esgScoreId") REFERENCES "ESGScore"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ESGMetric" ADD CONSTRAINT "ESGMetric_sourceDocumentId_fkey" FOREIGN KEY ("sourceDocumentId") REFERENCES "Document"("id") ON DELETE SET NULL ON UPDATE CASCADE;
