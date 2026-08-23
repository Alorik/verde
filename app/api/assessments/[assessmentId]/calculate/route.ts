import { prisma } from "@/lib/prisma";
import { calculateEnergyMetric } from "@/lib/scoring/electicity";
import { calculateEnvironmentalScore } from "@/lib/scoring/Environment/EnvironmentScore";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ assessmentId: string }> },
) {
  const { assessmentId } = await params;

  try {
    const assessment = await prisma.assessment.findUnique({
      where: {
        id: assessmentId,
      },
    });

    if (!assessment) {
      return NextResponse.json(
        { message: "Assessment not found" },
        { status: 404 },
      );
    }

    const energy = await calculateEnergyMetric(assessmentId);

    if (!energy) {
      return NextResponse.json(
        { message: "Energy data not available" },
        { status: 400 },
      );
    }

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

      const metric = await tx.eSGMetric.create({
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
        metric,
      };
    });

    return NextResponse.json({
      message: "ESG score calculated successfully",
      score: result.esgScore,
      metric: result.metric,
    });
  } catch (err) {
    console.error("ESG calculation failed:", err);

    return NextResponse.json(
      { message: "Failed to calculate ESG score" },
      { status: 500 },
    );
  }
}
