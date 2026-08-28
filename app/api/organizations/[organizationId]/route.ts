import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ organizationId: string }> },
) {
  try {
    // Authentication

    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { organizationId } = await params;

    // Ownership check

    if (session.user.id !== organizationId) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // Fetch organization

    const organization = await prisma.organization.findUnique({
      where: {
        id: organizationId,
      },
      include: {
        assessments: true,
      },
    });

    if (!organization) {
      return NextResponse.json(
        {
          message: "Organization was not found",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json({ organization }, { status: 200 });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
