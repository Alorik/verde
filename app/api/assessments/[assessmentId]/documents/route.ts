import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


const allowedDocumentTypes = [
  "ELECTRICITY_BILL",
  "WATER_REPORT",
  "EMPLOYEE_DATA",
  "CSR_REPORT",
  "SUSTAINABILITY_REPORT",
  "OTHER",
];

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ assessmentId: string }> },
) {
  const { assessmentId } = await params;

  try {
    const assessment = await prisma.assessment.findUnique({
      where: {
        id: assessmentId,
      },
    });

    if (!assessment) {
      return NextResponse.json(
        {
          message: "assessment Not found",
        },
        {
          status: 404,
        },
      );
    }

    const formData = await req.formData();
    const file = formData.get("file");
    const documentType = formData.get("documentType");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { message: "No file provided" },
        { status: 400 },
      );
    }


if (
  typeof documentType !== "string" ||
  !allowedDocumentTypes.includes(documentType)
) {
  return NextResponse.json({
    message: "DocumentType is not valid"
  }, {
    status: 400
  });
    };
    
    const fileSize = file.size;

    const MAX_FILE_SIZE = 20 * 1024 * 1024;
    if (fileSize > MAX_FILE_SIZE) {
      return NextResponse.json({
        message: "Only file upto 20MB is allowed."
      }, {
        status: 400
      });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "failed to upload document" },
      { status: 500 },
    );
  }
}



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
