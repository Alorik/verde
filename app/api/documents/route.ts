import { prisma } from "@/lib/prisma";
import { documentSchema } from "@/lib/validations/document";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const result = documentSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      {
        message: "Validation failed",
        errors: result.error.flatten(),
      },
      { status: 400 },
    );
  }

  const validatedData = result.data;
  try {
    const assessment = await prisma.assessment.findUnique({
      where: {
        id: validatedData.assessmentId,
      },
    });
    if (!assessment) {
      return NextResponse.json(
        { message: "Assessment not found" },
        { status: 404 },
      );
    }
    const document = await prisma.document.create({
      data: validatedData,
    });

    return NextResponse.json(
      {
        message: "Document uploaded successfully",
        document,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: "Document upload failed",
      },
      {
        status: 500,
      },
    );
  }
}
