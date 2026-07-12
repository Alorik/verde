import { prisma } from "@/lib/prisma";
import { assessmentSchema } from "@/lib/validations/Assessments";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const result = assessmentSchema.safeParse(body);

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
    const organization = await prisma.organization.findUnique({
      where: {
        id: validatedData.organizationId,
      },
    });

    if (!organization) {
      return NextResponse.json(
        { message: "Organization not found" },
        { status: 404 },
      );
    }
    const assessment = await prisma.assessment.create({
      data: validatedData,
    });
    return NextResponse.json(
      { message: "Assessment created successfully", assessment },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to create assessment" },
      {
        status: 500,
      },
    );
  }
}
