import { auth } from "@/lib/auth";
import { CalculateESG } from "@/lib/scoring/CalculateESG";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ assessmentId: string }> },
) {
  try {
        // Authentication
    
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const organizationId = session.user.id;

    const { assessmentId } = await params;

    // Find assessment
    
    const assessment = await prisma.assessment.findUnique({
      where: {
        id: assessmentId,
      },
      select: {
        id: true,
        organizationId: true,
      },
    });

    if (!assessment) {
      return NextResponse.json(
        { message: "Assessment not found" },
        { status: 404 },
      );
    }

    // Ownership check
    
    if (assessment.organizationId !== organizationId) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // Calculate ESG
    
    const score = await CalculateESG(assessmentId);

    return NextResponse.json(
      {
        message: "ESG score calculated successfully",
        score,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("ESG calculation failed:", error);

    return NextResponse.json(
      {
        message: "Failed to calculate ESG score",
      },
      { status: 500 },
    );
  }
}
