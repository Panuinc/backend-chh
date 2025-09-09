import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(_, { params }) {
  const user = await prisma.user.findUnique({ where: { id: Number(params.id) } });
  return NextResponse.json(user);
}

export async function PUT(req, { params }) {
  const data = await req.json();
  const user = await prisma.user.update({
    where: { id: Number(params.id) },
    data,
  });
  return NextResponse.json(user);
}

export async function DELETE(_, { params }) {
  await prisma.user.delete({ where: { id: Number(params.id) } });
  return NextResponse.json({ message: "User deleted" });
}
