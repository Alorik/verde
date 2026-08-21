/*
  Warnings:

  - The `unit` column on the `Electricity` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Electricity" DROP COLUMN "unit",
ADD COLUMN     "unit" "MetricUnit";
