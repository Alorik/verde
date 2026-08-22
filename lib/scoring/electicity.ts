import { prisma } from "../prisma";

type EnergyMetricResult = {
  value: number;
  unit: string;
  rating: string;
  score: number;
  rawValue: number;
  sourceDocumentId:string;
};

export async function calculateEnergyMetric(
  assessmentId: string,
): Promise<EnergyMetricResult | null> {
  const currentDocument = await prisma.document.findFirst({
    where: {
      assessmentId,
      documentType: "ELECTRICITY_BILL",
      electricity: {
        isNot: null,
      },
    },
    orderBy: {
      uploadedAt: "desc",
    },

    select: {
      id: true,
      electricity: {
        select: {
          consumptionMWh: true,
        },
      },
    },
  });

  const currentMWh = currentDocument?.electricity?.consumptionMWh;
  if (currentMWh === null || currentMWh === undefined) {
    return null;
  }
    if (!currentDocument) {
      return null;
    }

    const sourceDocumentId = currentDocument.id;
  

  const assessment = await prisma.assessment.findUnique({
    where: {
      id: assessmentId,
    },
  });

  if (!assessment) {
    throw new Error("Assessment not found");
  }

  const organization = await prisma.organization.findUnique({
    where: {
      id: assessment.organizationId,
    },
  });

  if (!organization) {
    throw new Error("Organization not found");
  }

  const organizationEmployee = organization.employeeCount;

  if (organizationEmployee <= 0) {
    throw new Error("Employee cannot be zero");
  }

  const energyIntensity = Number(currentMWh) / organizationEmployee;

  let rating: string = " ";
  let score: number = 0;

  if (energyIntensity <= 1) {
    rating = "Excellent";
    score = 100;
  } else if (energyIntensity <= 2.5) {
    rating = "Good";
    score = 85;
  } else if (energyIntensity <= 5) {
    rating = "Average";
    score = 70;
  } else if (energyIntensity <= 10) {
    rating = "Poor";
    score = 50;
  } else {
    rating = "Very Poor";
    score = 25;
  }

  const rawValue = Number(currentMWh);


  return {
    value: energyIntensity,
    unit: "MWH_PER_EMPLOYEE",
    rating,
    score,
    rawValue,
    sourceDocumentId,
  };
}
