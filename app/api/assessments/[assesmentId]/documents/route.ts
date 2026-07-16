import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ assessmentId: string }> },
) {
  try {
    const { assessmentId } = await params;

    const assessment = await prisma.assessment.findUnique({
      where: {
        id: assessmentId,
      },
    });

    if (!assessment) {
      return NextResponse.json(
        {
          message: "Assessment not found",
        },
        {
          status: 404,
        },
      );
    }
    const documents = await prisma.document.findMany({
      where: {
        assessmentId,
      },
      select: {
        id: true,
        fileName: true,
        documentType: true,
        fileSize: true,
        mimeType: true,
        uploadedAt: true,
        fileUrl: true,
      },
    });

    return NextResponse.json(
      {
        documents,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: "Failed to retrieve documents",
      },
      {
        status: 500,
      },
    );
  }
}
