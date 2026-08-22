import { prisma } from "@/lib/prisma";
import { calculateEnergyMetric } from "@/lib/scoring/electicity";
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

    const currentdocument = await prisma.document.findFirst({
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

    const currentMWh = currentdocument?.electricity?.consumptionMWh;

    if (currentMWh === null || currentMWh === undefined) {
      return NextResponse.json(
        { message: "Electricity data not found for this assessment" },

        { status: 400 },
      );
    }

    const energy = await calculateEnergyMetric(assessmentId);

    if (!energy) {
      return null;
    }

    const result = await prisma.$transaction(async (tx) => {
      const esgScore = await tx.eSGScore.create({
        data: {
          assessmentId,
          environmentalScore: energy.score,
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

      return {
        esgScore,
        metric,
      };
    });
    return NextResponse.json({
      message: "ESG score calculated successfully",
      score: result.esgScore,
      metric: result.metric,
    });
  } catch (err) {
    console.error("Assessment lookup failed:", err);
    return NextResponse.json(
      { message: "Failed to process assessment" },

      { status: 500 },
    );
  }
}
