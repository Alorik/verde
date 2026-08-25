-- CreateTable
CREATE TABLE "EmployeeData" (
    "id" TEXT NOT NULL,
    "totalEmployees" INTEGER NOT NULL,
    "male" INTEGER NOT NULL,
    "female" INTEGER NOT NULL,
    "employeeTurnover" DECIMAL(65,30) NOT NULL,
    "trainingHours" INTEGER NOT NULL,
    "documentId" TEXT NOT NULL,

    CONSTRAINT "EmployeeData_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EmployeeData_documentId_key" ON "EmployeeData"("documentId");

-- AddForeignKey
ALTER TABLE "EmployeeData" ADD CONSTRAINT "EmployeeData_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
