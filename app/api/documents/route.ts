import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { assessmentSchema } from "@/lib/validations/assessment";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

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
        id: session.user.id,
      },
    });

    if (!organization) {
      return NextResponse.json(
        { message: "Organization not found" },
        { status: 404 },
      );
    }

    const assessment = await prisma.assessment.create({
      data: {
        name: validatedData.name,
        reportingYear: validatedData.reportingYear,
        status: validatedData.status,
        description: validatedData.description,
        organizationId: session.user.id,
      },
    });

    return NextResponse.json(
      {
        message: "Assessment created successfully",
        assessment,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Failed to create assessment" },
      { status: 500 },
    );
  }
}

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const assessments = await prisma.assessment.findMany({
      where: {
        organizationId: session.user.id,
      },
      select: {
        id: true,
        name: true,
        reportingYear: true,
        status: true,
        createdAt: true,
        organization: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ assessments }, { status: 200 });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Assessments were not found" },
      { status: 500 },
    );
  }
}
