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
        uploadedAt:"desc",
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
   return NextResponse.json({
     energy,
   });

  } catch (err) {
    console.error("Assessment lookup failed:", err);
      return NextResponse.json(
        { message: "Failed to process assessment" },

        { status: 500 },
      );
  }
}