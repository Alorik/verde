import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ assessmentId: string }> },
) {
  const { assessmentId } = await params;
  try {
    const assessment = await prisma.assessment.findUnique({
      where: {
        id: assessmentId,
      },
      include: {
        documents: {
          include: {
            electricity: true,
            water: true,
            employeeData: true,
            csrReport: true,
            esgMetrics: true,
          },
        },
        esgScore: {
          include: {
            metrics: true,
          },
        },
      },
    });

    if (!assessment) {
      return NextResponse.json(
        {
          message: "Assessment was not found",
        },
        {
          status: 404,
        },
      );
    }
    return NextResponse.json({ assessment }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
