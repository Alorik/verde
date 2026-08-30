import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { documentSchema } from "@/lib/validations/document";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
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

    // Make sure the assessment belongs to
    // the currently logged-in organization.
    const assessment = await prisma.assessment.findFirst({
      where: {
        id: validatedData.assessmentId,
        organizationId: session.user.id,
      },
    });

    if (!assessment) {
      return NextResponse.json(
        { message: "Assessment not found" },
        { status: 404 },
      );
    }

    const document = await prisma.document.create({
      data: {
        fileName: validatedData.fileName,
        documentType: validatedData.documentType,
        fileSize: validatedData.fileSize,
        mimeType: validatedData.mimeType,
        assessmentId: validatedData.assessmentId,
      },
    });

    return NextResponse.json(
      {
        message: "Document added successfully",
        document,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Failed to create document:", error);

    return NextResponse.json(
      { message: "Failed to add document" },
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
    const documents = await prisma.document.findMany({
      where: {
        assessment: {
          organizationId: session.user.id,
        },
      },

      select: {
        id: true,
        fileName: true,
        documentType: true,
        fileSize: true,
        mimeType: true,
        uploadedAt: true,
        fileUrl: true,
        extractionStatus: true,

        assessment: {
          select: {
            id: true,
            name: true,
            reportingYear: true,
          },
        },
      },

      orderBy: {
        uploadedAt: "desc",
      },
    });

    return NextResponse.json({ documents }, { status: 200 });
  } catch (error) {
    console.error("Failed to load documents:", error);

    return NextResponse.json(
      { message: "Failed to load documents" },
      { status: 500 },
    );
  }
}
