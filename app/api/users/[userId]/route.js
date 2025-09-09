import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request, context) {
  const { userId } = await context.params;
  try {
    const user = await prisma.user.findUnique({
      where: { userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch user", details: err.message },
      { status: 500 }
    );
  }
}

export async function PUT(request, context) {
  const { userId } = await context.params;
  try {
    const data = await request.json();

    const user = await prisma.user.update({
      where: { userId },
      data: {
        userEmail: data.userEmail,
        userName: data.userName ?? null,
      },
    });

    return NextResponse.json(user);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to update user", details: err.message },
      { status: 400 }
    );
  }
}

export async function DELETE(request, context) {
  const { userId } = await context.params;
  try {
    await prisma.user.delete({
      where: { userId },
    });

    return NextResponse.json({ message: "User deleted" });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to delete user", details: err.message },
      { status: 400 }
    );
  }
}

export const dynamic = "force-dynamic";
