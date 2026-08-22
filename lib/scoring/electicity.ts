

import { prisma } from "../prisma";


export function calculateEnergyScore(
  currentMWh: number,
  previousMWh: number | null,
): number | null {
  if (previousMWh === null || previousMWh <= 0) {
    return null;
  }

  const change = ((previousMWh - currentMWh) / previousMWh) * 100;

  if (change >= 20) return 100;
  if (change >= 15) return 90;
  if (change >= 10) return 80;
  if (change >= 5) return 70;
  if (change >= 0) return 60;

  if (change >= -5) return 50;
  if (change >= -10) return 40;
  if (change >= -15) return 30;
  if (change >= -20) return 20;

  return 10;
}

export async function AssessmentEnergyScore(
  assessmentId: string,
): Promise<number | null> {
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
      electricity: {
        select: {
          consumptionMWh: true,
        },
      },
    },
  });

  const currentMWh = currentDocument?.electricity?.consumptionMWh;
  if (!currentMWh) {
    return null;
  }


  const assessment = await prisma.assessment.findUnique({
    where: {
      id: assessmentId
    }
  });

  if (!assessment) {
    throw new Error("Assessment not found");
  }

  const organization = await prisma.organization.findUnique({
    where: {
      id: assessment.organizationId,
    }
  });

    if (!organization) {
      throw new Error("Organization not found");
    }



  const organizationEmployee = organization.employeeCount;
  

  if (organizationEmployee <= 0) {
    throw new Error("Employee cannot be zero");
  }

  const energyIntensity = Number(currentMWh) / organizationEmployee;
  
  
  let rating = " ";
  let score = 0;

  if (energyIntensity <= 1) {
    rating = "Excellent";
    score = 100;
  } else if (energyIntensity <= 2.5) {
    rating = "Good";
    score = 85;

  } else if ( energyIntensity <= 5) {
    rating = "Average";
    score = 70;
  } else if (energyIntensity <= 10) {
    rating = "Poor"; 
    score = 50;
  } else {
    rating = "Very Poor"
    score = 25;
  }
}
