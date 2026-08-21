import { prisma } from "../prisma";

export async function getPreviousElectricityConsumption(
  assessmentId: string,
): Promise<number | null> {
  const currentAssessment = await prisma.assessment.findUnique({
    where: {
      id: assessmentId,
    },
    select: {
      organizationId: true,

      reportingYear: true,
    },
  });

  if (!currentAssessment) {
    throw new Error("Assessment not found");
  }

  const previousAssessment = await prisma.assessment.findFirst({
    where: {
      organizationId: currentAssessment.organizationId,
      reportingYear: currentAssessment.reportingYear - 1,
    },
    orderBy: {
      createdAt: "desc",
    },

    select: {
      documents: {
        where: {
          documentType: "ELECTRICITY_BILL",

          electricity: {
            isNot: null,
          },
        },

        select: {
          electricity: {
            select: {
              consumptionMWh: true,
            },
          },
        },

        orderBy: {
          uploadedAt: "desc",
        },

        take: 1,
      },
    },
  });

  const electricity = previousAssessment?.documents[0].electricity;

  if (!electricity?.consumptionMWh) {
    return null;
  }

  return Number(electricity.consumptionMWh);
}
