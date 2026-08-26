import { prisma } from "../prisma";
import { calculateEnergyMetric } from "./Environment/energy";
import { calculateEnvironmentalScore } from "./Environment/EnvironmentScore";
import { calculateWaterMetrics } from "./Environment/waterMetrics";
import { calculateSocialMetric } from "./Social/EmployeeMetrics";
import { calculateSocialScore } from "./Social/SocialScore";

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
  const employeeData = await calculateSocialMetric(assessmentId);

  if (!energy && !waterResource && !employeeData) {
    throw new Error("No ESG metrics available to calculate");
  }

  const result = await prisma.$transaction(async (tx) => {
    const esgScore = await tx.eSGScore.upsert({
      where: {
        assessmentId,
      },

      create: {
        assessmentId,
        environmentalScore: null,
        socialScore: null,
        governanceScore: null,
        overallScore: null,
      },

      update: {
        environmentalScore: null,
        socialScore: null,
        governanceScore: null,
        overallScore: null,
      },
    });

    // Recalculation:
    // Remove previous metrics and rebuild them
    // from the currently available documents.
    await tx.eSGMetric.deleteMany({
      where: {
        esgScoreId: esgScore.id,
      },
    });

    // -----------------------------
    // ENVIRONMENTAL
    // -----------------------------

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

    // -----------------------------
    // SOCIAL
    // -----------------------------

    if (employeeData) {
      await tx.eSGMetric.create({
        data: {
          esgScoreId: esgScore.id,
          name: "Employee Data",
          category: "SOCIAL",
          rawValue: employeeData.rawValue,
          rawUnit: "EMPLOYEES",
          normalizedValue: employeeData.value,
          score: employeeData.score,
          sourceDocumentId: employeeData.sourceDocumentId,
        },
      });
    }

    // -----------------------------
    // ENVIRONMENTAL SCORE
    // -----------------------------

    const environmentalMetrics = await tx.eSGMetric.findMany({
      where: {
        esgScoreId: esgScore.id,
        category: "ENVIRONMENTAL",
      },
      select: {
        id: true,
        name: true,
        category: true,
        rawValue: true,
        rawUnit: true,
        normalizedValue: true,
        normalizedUnit: true,
        score: true,
        sourceDocumentId: true,
      },
    });

    const environmentalMetricScores = environmentalMetrics
      .map((metric) => metric.score)
      .filter((score): score is NonNullable<typeof score> => score !== null)
      .map((score) => Number(score));

    const environmentalScore = calculateEnvironmentalScore(
      environmentalMetricScores,
    );

    // -----------------------------
    // SOCIAL SCORE
    // -----------------------------

    const socialMetrics = await tx.eSGMetric.findMany({
      where: {
        esgScoreId: esgScore.id,
        category: "SOCIAL",
      },
      select: {
        id: true,
        name: true,
        category: true,
        rawValue: true,
        rawUnit: true,
        normalizedValue: true,
        normalizedUnit: true,
        score: true,
        sourceDocumentId: true,
      },
    });

    const socialMetricScores = socialMetrics
      .map((metric) => metric.score)
      .filter((score): score is NonNullable<typeof score> => score !== null)
      .map((score) => Number(score));

    const socialScore = calculateSocialScore(socialMetricScores);

    // -----------------------------
    // UPDATE ESG SCORE
    // -----------------------------

    const updatedESGScore = await tx.eSGScore.update({
      where: {
        id: esgScore.id,
      },
      data: {
        environmentalScore,
        socialScore,
      },
    });

    return {
      esgScore: updatedESGScore,
      metrics: [...environmentalMetrics, ...socialMetrics],
    };
  });

  return result;
}
