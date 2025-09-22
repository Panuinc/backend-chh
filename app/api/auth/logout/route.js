import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getLocalNow } from "@/lib/getLocalNow";

export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, username, ipAddress, userAgent } = body;

    const lastLog = await prisma.userLog.findFirst({
      where: { userId, success: true },
      orderBy: { loginAt: "desc" },
    });

    if (lastLog) {
      await prisma.userLog.update({
        where: { userLogId: lastLog.userLogId },
        data: {
          logoutAt: getLocalNow(),
          message: "User logged out",
        },
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("❌ Logout handler failed:", error);
    return NextResponse.json(
      { ok: false, error: error?.message },
      { status: 500 }
    );
  }
}
