import { CalculateESG } from "@/lib/scoring/CalculateESG";

import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ assessmentId: string }> },
) {
  const { assessmentId } = await params;

  try {
    const score = await CalculateESG(assessmentId);

    return NextResponse.json({
      message: "ESG score calculated successfully",
      score,
    });
  } catch (err) {
    console.error("ESG calculation failed:", err);

    return NextResponse.json(
      { message: "Failed to calculate ESG score" },
      { status: 500 },
    );
  }
}
