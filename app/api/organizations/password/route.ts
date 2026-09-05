import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const { currentPassword, newPassword, confirmPassword } = body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { message: "All password fields are required" },
        { status: 400 },
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { message: "New passwords do not match" },
        { status: 400 },
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { message: "New password must be at least 8 characters" },
        { status: 400 },
      );
    }

    const organization = await prisma.organization.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        id: true,
        passwordHash: true,
      },
    });

    if (!organization) {
      return NextResponse.json(
        { message: "Organization not found" },
        { status: 404 },
      );
    }

    const passwordMatches = await bcrypt.compare(
      currentPassword,
      organization.passwordHash,
    );

    if (!passwordMatches) {
      return NextResponse.json(
        { message: "Current password is incorrect" },
        { status: 400 },
      );
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 12);

    await prisma.organization.update({
      where: {
        id: organization.id,
      },
      data: {
        passwordHash: newPasswordHash,
      },
    });

    return NextResponse.json(
      {
        message: "Password changed successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Failed to change password:", error);

    return NextResponse.json(
      { message: "Failed to change password" },
      { status: 500 },
    );
  }
}
