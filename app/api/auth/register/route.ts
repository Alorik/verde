import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      name,
      email,
      password,
      industry,
      employeeCount,
      country,
      city,
      foundedAt,
    } = body;

    // -----------------------------
    // Validation
    // -----------------------------

    if (
      !name ||
      !email ||
      !password ||
      !industry ||
      employeeCount === undefined ||
      !country
    ) {
      return NextResponse.json(
        {
          message: "Required fields are missing",
        },
        { status: 400 },
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        {
          message: "Password must be at least 8 characters",
        },
        { status: 400 },
      );
    }

    if (Number(employeeCount) <= 0) {
      return NextResponse.json(
        {
          message: "Employee count must be greater than zero",
        },
        { status: 400 },
      );
    }

    // -----------------------------
    // Normalize email
    // -----------------------------

    const normalizedEmail = email.trim().toLowerCase();

    // -----------------------------
    // Check existing organization
    // -----------------------------

    const existingOrganization = await prisma.organization.findUnique({
      where: {
        email: normalizedEmail,
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

    // -----------------------------
    // Hash password
    // -----------------------------

    const passwordHash = await bcrypt.hash(password, 12);

    // -----------------------------
    // Create organization
    // -----------------------------

    const organization = await prisma.organization.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        passwordHash,
        industry,
        employeeCount: Number(employeeCount),
        country: country.trim(),
        city: city?.trim() || null,
        foundedAt: foundedAt ? new Date(foundedAt) : null,
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
      },
    });

    return NextResponse.json(
      {
        message: "Organization registered successfully",
        organization,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Organization registration failed:", error);

    return NextResponse.json(
      {
        message: "Failed to register organization",
      },
      { status: 500 },
    );
  }
}
