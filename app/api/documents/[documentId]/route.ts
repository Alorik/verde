import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE({
  params,
}: {
  params: Promise<{ documentId: string }>;
}) {
  try {
    const { documentId } = await params;

    const document = await prisma.document.findUnique({
      where: {
        id: documentId,
      },
    });

    if (!document) {
      return NextResponse.json(
        {
          message: " Document not found",
        },
        {
          status: 404,
        },
      );
    }

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
