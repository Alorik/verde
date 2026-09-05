import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { s3 } from "@/lib/s3";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ documentId: string }> },
) {
  try {
    // Authentication
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const organizationId = session.user.id;

    const { documentId } = await params;

    // Find document and verify ownership
    const document = await prisma.document.findUnique({
      where: {
        id: documentId,
      },
      select: {
        id: true,
        fileName: true,
        fileUrl: true,
        mimeType: true,
        assessment: {
          select: {
            organizationId: true,
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

    // Ownership check
    if (document.assessment.organizationId !== organizationId) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    if (!document.fileUrl) {
      return NextResponse.json(
        { message: "Document file is not available" },
        { status: 404 },
      );
    }

    // Get original PDF from S3
const command = new GetObjectCommand({
  Bucket: process.env.AWS_S3_BUCKET_NAME,
  Key: document.fileUrl,
});

const response = await s3.send(command);

if (!response.Body) {
  return NextResponse.json(
    { message: "Document file could not be retrieved" },
    { status: 404 },
  );
}

const body = await response.Body.transformToByteArray();

return new Response(Buffer.from(body), {
  status: 200,
  headers: {
    "Content-Type": document.mimeType || "application/pdf",
    "Content-Disposition": `inline; filename="${document.fileName}"`,
    "Cache-Control": "private, no-store",
  },
});
    
  } catch (error) {
    console.error("Failed to view document:", error);

    return NextResponse.json(
      { message: "Failed to retrieve document" },
      { status: 500 },
    );
  }
}
