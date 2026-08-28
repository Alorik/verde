import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { organizationSchema } from "@/lib/validations/organization";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const result = organizationSchema.safeParse(body);

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
    const organization = await prisma.organization.create({
      data: validatedData,
    });

    return NextResponse.json(
      {
        message: "Organization created successfully",
        organization,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Failed to create organization",
      },
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

    return NextResponse.json({ organization }, { status: 200 });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Organization failed to load" },
      { status: 500 },
    );
  }
}