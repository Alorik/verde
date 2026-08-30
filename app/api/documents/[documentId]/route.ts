import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { s3 } from "@/lib/s3";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
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
    const document = await prisma.document.findFirst({
      where: {
        id: documentId,
        assessment: {
          organizationId,
        },
      },
      select: {
        id: true,
        fileName: true,
        fileUrl: true,
        mimeType: true,
      },
    });

    if (!document) {
      return NextResponse.json(
        { message: "Document not found" },
        { status: 404 },
      );
    }

    if (!document.fileUrl) {
      return NextResponse.json(
        { message: "Document file is not available" },
        { status: 404 },
      );
    }

    // Generate temporary S3 URL
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: document.fileUrl,
      ResponseContentType: document.mimeType,
      ResponseContentDisposition: `inline; filename="${document.fileName}"`,
    });

    const signedUrl = await getSignedUrl(s3, command, {
      expiresIn: 300,
    });

    // Send user to the actual S3 document
    return NextResponse.redirect(signedUrl);
  } catch (error) {
    console.error("Failed to generate document URL:", error);

    return NextResponse.json(
      { message: "Failed to open document" },
      { status: 500 },
    );
  }
}
