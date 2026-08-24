import { prisma } from "../prisma";
import { calculateEnergyMetric } from "./Environment/energy";
import { calculateEnvironmentalScore } from "./Environment/EnvironmentScore";
import { calculateWaterMetrics } from "./Environment/waterMetrics";

export async function CalculateESG(assessmentId: string) {
  const assessment = await prisma.assessment.findUnique({
    where: {
      id: assessmentId,
    },
  });

  if (!assessment) {
    throw new Error("Assessment not found");
  }

  const energy = await calculateEnergyMetric(assessmentId);
  const waterResource = await calculateWaterMetrics(assessmentId);

  const result = await prisma.$transaction(async (tx) => {
    const esgScore = await tx.eSGScore.create({
      data: {
        assessmentId,
        environmentalScore: null,
        socialScore: null,
        governanceScore: null,
        overallScore: null,
      },
    });

    if (energy) {
      await tx.eSGMetric.create({
        data: {
          esgScoreId: esgScore.id,
          name: "Energy Consumption",
          category: "ENVIRONMENTAL",
          rawValue: energy.rawValue,
          rawUnit: "MWH",
          normalizedValue: energy.value,
          normalizedUnit: "MWH_PER_EMPLOYEE",
          score: energy.score,
          sourceDocumentId: energy.sourceDocumentId,
        },
      });
    }

    if (waterResource) {
      await tx.eSGMetric.create({
        data: {
          esgScoreId: esgScore.id,
          name: "Water Consumption",
          category: "ENVIRONMENTAL",
          rawValue: waterResource.rawValue,
          rawUnit: "CUBIC_METER",
          normalizedValue: waterResource.value,
          normalizedUnit: "CUBIC_METER_PER_EMPLOYEE",
          score: waterResource.score,
          sourceDocumentId: waterResource.sourceDocumentId,
        },
      });
    }

    const environmentalMetrics = await tx.eSGMetric.findMany({
      where: {
        esgScoreId: esgScore.id,
        category: "ENVIRONMENTAL",
      },
      select: {
        score: true,
      },
    });

    const metricScores = environmentalMetrics
      .map((metric) => metric.score)
      .filter((score): score is NonNullable<typeof score> => score !== null)
      .map((score) => Number(score));

    const environmentalScore = calculateEnvironmentalScore(metricScores);

    const updatedESGScore = await tx.eSGScore.update({
      where: {
        id: esgScore.id,
      },
      data: {
        environmentalScore,
      },
    });

    return {
      esgScore: updatedESGScore,
      metrics: environmentalMetrics,
    };
  });

  return result;
}
