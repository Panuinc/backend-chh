import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getLocalNow } from "@/lib/getLocalNow"

export async function POST(request) {
  try {
    const body = await request.json()
    const { userId, ipAddress, userAgent } = body || {}
    if (userId) {
      await prisma.userLog.create({
        data: {
          userLogUserId: userId,
          userLogIpAddress: ipAddress || "unknown",
          userLogUserAgent: userAgent || "unknown",
          userLogSuccess: true,
          userLogMessage: "Logout",
          userLogLoginAt: getLocalNow(),
        },
      })
    }
    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error?.message },
      { status: 500 }
    )
  }
}
