import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "@/lib/s3";
import { DocumentType, MetricUnit } from "@prisma/client";
import { extractElectricityData } from "@/lib/extraction/Electricity";
import { normalizeToMWh } from "@/lib/extraction/normalize/normalizareElectricity";
import { extractWaterData } from "@/lib/extraction/water";
import { normalizeToCubicMeter } from "@/lib/extraction/normalize/normalizeWter";

const allowedDocumentTypes: DocumentType[] = [
  DocumentType.ELECTRICITY_BILL,
  DocumentType.WATER_REPORT,
  DocumentType.EMPLOYEE_DATA,
  DocumentType.CSR_REPORT,
  DocumentType.SUSTAINABILITY_REPORT,
  DocumentType.OTHER,
];

function isDocumentType(value: string): value is DocumentType {
  return Object.values(DocumentType).includes(value as DocumentType);
}

function toMetricUnit(value: string | null | undefined): MetricUnit | null {
  if (!value) return null;
  const normalized = value.toUpperCase().trim();
  return (Object.values(MetricUnit) as string[]).includes(normalized)
    ? (normalized as MetricUnit)
    : null;
}

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

    if (typeof documentType !== "string" || !isDocumentType(documentType)) {
      return NextResponse.json(
        {
          message: "DocumentType is not valid",
        },
        {
          status: 400,
        },
      );
    }

    const fileSize = file.size;

    const MAX_FILE_SIZE = 20 * 1024 * 1024;
    if (fileSize > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          message: "Only files upto 20 MB are allowed.",
        },
        {
          status: 400,
        },
      );
    }

    const fileType = file.type;
    if (fileType !== "application/pdf") {
      return NextResponse.json(
        {
          message: "Only .pdf files are allowed",
        },
        {
          status: 400,
        },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const safeFileName = file.name
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9._-]/g, "");

    const key = `assessments/${assessmentId}/${crypto.randomUUID()}-${safeFileName}`;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: file.type,
    });
    await s3.send(command);

    const document = await prisma.document.create({
      data: {
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        documentType: documentType,
        assessmentId: assessmentId,
        fileUrl: key,
      },
    });

    if (documentType === DocumentType.ELECTRICITY_BILL) {
      try {
        await prisma.document.update({
          where: {
            id: document.id,
          },
          data: {
            extractionStatus: "PROCESSING",
          },
        });

        const extracted = await extractElectricityData(file);

        if (
          extracted.electricityCost === null ||
          extracted.unitsConsumed === null ||
          extracted.unit === null
        ) {
          throw new Error("Required electricity data could not be extracted");
        }

        const consumptionMWh = normalizeToMWh(
          extracted.unitsConsumed,
          extracted.unit,
        );

        await prisma.electricity.create({
          data: {
            documentId: document.id,
            electricityCost: extracted.electricityCost,
            unitsConsumed: extracted.unitsConsumed,
            unit: toMetricUnit(extracted.unit),
            consumptionMWh,
          },
        });

        await prisma.document.update({
          where: {
            id: document.id,
          },
          data: {
            extractionStatus: "COMPLETED",
          },
        });
      } catch (error) {
        console.error("Electricity extraction failed:", error);

        await prisma.document.update({
          where: {
            id: document.id,
          },
          data: {
            extractionStatus: "FAILED",
          },
        });
      }
    } else if (documentType === DocumentType.WATER_REPORT) {
      try {
        const extractedWater = await extractWaterData(file);

        if (
          extractedWater.waterCost === null ||
          extractedWater.unitsConsumed === null ||
          extractedWater.unit === null
        ) {
          throw new Error("Required water data could not be extracted");
        }

        const consumptionCubicMeter = normalizeToCubicMeter(
          extractedWater.unitsConsumed,
          extractedWater.unit,
        );
        await prisma.water.create({
          data: {
            documentId: document.id,
            WaterCost: extractedWater.waterCost,
            unitsConsumed: extractedWater.unitsConsumed,
            unit: toMetricUnit(extractedWater.unit),
            consumptionCubicMeter,
          },
        });

        await prisma.document.update({
          where: {
            id: document.id,
          },
          data: {
            extractionStatus: "COMPLETED",
          },
        });
      } catch (error) {
        console.error("Electricity extraction failed:", error);

        await prisma.document.update({
          where: {
            id: document.id,
          },
          data: {
            extractionStatus: "FAILED",
          },
        });
      }
    } else {
      await prisma.document.update({
        where: {
          id: document.id,
        },

        data: {
          extractionStatus: "COMPLETED",
        },
      });
    }

    return NextResponse.json({
      message: "File uploaded successfully",
      document,
    });
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
