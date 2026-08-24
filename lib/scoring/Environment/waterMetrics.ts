import { prisma } from "@/lib/prisma";

type WaterMetricResult = {
  value: number;
  unit: string;
  rating: string;
  score: number;
  rawValue: number;
  sourceDocumentId: string;
};

export async function calculateWaterMetrics(
  assessmentId: string,
): Promise<WaterMetricResult | null> {
  const currentDocument = await prisma.document.findFirst({
    where: {
      assessmentId,
      documentType: "WATER_REPORT",
      water: {
        isNot: null,
      },
    },
    orderBy: {
      uploadedAt: "desc",
    },
    select: {
      id: true,
      water: {
        select: {
          consumptionCubicMeter: true,
          unitsConsumed: true,
          unit: true,
        },
      },
    },
  });

  const currentCubicMeter = currentDocument?.water?.consumptionCubicMeter;
  if (currentCubicMeter === null || currentCubicMeter === undefined) {
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

  const waterIntensity = Number(currentCubicMeter) / organizationEmployee;

  let rating: string = " ";
  let score: number = 0;

  if (waterIntensity <= 1) {
    rating = "Excellent";
    score = 100;
  } else if (waterIntensity <= 2.5) {
    rating = "Good";
    score = 85;
  } else if (waterIntensity <= 5) {
    rating = "Average";
    score = 70;
  } else if (waterIntensity <= 10) {
    rating = "Poor";
    score = 50;
  } else {
    rating = "Very Poor";
    score = 25;
  }

  const rawValue = Number(currentCubicMeter);

  return {
    value: waterIntensity,
    unit: "CUBIC_METER_PER_EMPLOYEE",
    rating,
    score,
    rawValue,
    sourceDocumentId,
  };
}
