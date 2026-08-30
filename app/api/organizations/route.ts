import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { organizationRegistrationSchema } from "@/lib/validations/organization";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const result = organizationRegistrationSchema.safeParse(body);

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
    const existingOrganization = await prisma.organization.findUnique({
      where: {
        email: validatedData.email,
      },
    });

    if (existingOrganization) {
      return NextResponse.json(
        {
          message: "An organization with this email already exists",
        },
        { status: 409 },
      );
    }

    const passwordHash = await bcrypt.hash(validatedData.password, 12);

    const organization = await prisma.organization.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        passwordHash,
        industry: validatedData.industry,
        employeeCount: validatedData.employeeCount,
        country: validatedData.country,
        city: validatedData.city,
        foundedAt: validatedData.foundedAt,
      },
      select: {
        id: true,
        name: true,
        email: true,
        industry: true,
        employeeCount: true,
        country: true,
        city: true,
        foundedAt: true,
        createdAt: true,
        updatedAt: true,
      },
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

      select: {
        id: true,
        name: true,
        email: true,
        industry: true,
        employeeCount: true,
        country: true,
        city: true,
        foundedAt: true,
        createdAt: true,
        updatedAt: true,

        assessments: {
          select: {
            id: true,
            name: true,
            reportingYear: true,
            status: true,
            description: true,
            createdAt: true,

            esgScore: {
              select: {
                overallScore: true,
                environmentalScore: true,
                socialScore: true,
                governanceScore: true,
              },
            },

            _count: {
              select: {
                documents: true,
              },
            },
          },

          orderBy: {
            createdAt: "desc",
          },
        },
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
