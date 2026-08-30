import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function DELETE({
  params,
}: {
  params: Promise<{ documentId: string }>;
}) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const organizationId = session.user.id;

    const { documentId } = await params;

    // Find document

    const document = await prisma.document.findUnique({
      where: {
        id: documentId,
      },
      select: {
        id: true,
        assessment: {
          select: {
            organizationId: true,
          },
        },
      },
    });

    if (!document) {
      return NextResponse.json(
        {
          message: "Document not found",
        },
        {
          status: 404,
        },
      );
    }

    // Ownership check

    if (document.assessment.organizationId !== organizationId) {
      return NextResponse.json(
        {
          message: "Forbidden",
        },
        {
          status: 403,
        },
      );
    }

    // Delete document

    await prisma.document.delete({
      where: {
        id: documentId,
      },
    });

    return NextResponse.json(
      {
        message: "Document deleted successfully",
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Failed to delete document",
      },
      {
        status: 500,
      },
    );
  }
}


export async function GET(
  req: Request,
  { params }: { params: Promise<{ documentId: string }> },
) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { documentId } = await params;

  try {
    const document = await prisma.document.findFirst({
      where: {
        id: documentId,
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
        fileUrl: true,
        uploadedAt: true,
        extractionStatus: true,

        assessment: {
          select: {
            id: true,
            name: true,
            reportingYear: true,
          },
        },
      },
    });

    if (!document) {
      return NextResponse.json(
        { message: "Document not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ document }, { status: 200 });
  } catch (error) {
    console.error("Failed to load document:", error);

    return NextResponse.json(
      { message: "Failed to load document" },
      { status: 500 },
    );
  }
}