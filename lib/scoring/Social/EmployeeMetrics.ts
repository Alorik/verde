import { prisma } from "@/lib/prisma";

type EmployeeMetrics = {
  totalEmployees: number;
  male: number;
  female: number;
  employeeTurnover: number;
  trainingHours: number;
  score: number;
  sourceDocumentId: string;
};

export default async function calculateEmployeeMetrics(
  assessmentId: string,
): Promise<EmployeeMetrics | null> {
  const currentDocument = await prisma.document.findFirst({
    where: {
      assessmentId,
      documentType: "EMPLOYEE_DATA",
      employeeData: {
        isNot: null,
      },
    },
    orderBy: {
      uploadedAt: "desc",
    },
    select: {
      id: true,
      employeeData: {
        select: {
          totalEmployees: true,
          male: true,
          female: true,
          employeeTurnover: true,
          trainingHours: true,
        },
      },
    },
  });

  if (!currentDocument || !currentDocument.employeeData) {
    return null;
  }

  const { totalEmployees, male, female, employeeTurnover, trainingHours } =
    currentDocument.employeeData;
  


  // We'll calculate the actual social score here.

  return {
    totalEmployees,
    male,
    female,
    employeeTurnover: Number(employeeTurnover),
    trainingHours,
    score: 0,
    sourceDocumentId: currentDocument.id,
  };
}
