import { getPreviousElectricityConsumption } from "../extraction/previousElectrity";
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

  const previousMWh = await getPreviousElectricityConsumption(assessmentId);

  return calculateEnergyScore(
    Number(currentMWh),

    previousMWh,
  );
}
